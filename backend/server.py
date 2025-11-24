import uuid
import logging
from datetime import datetime, timedelta, date
from typing import List, Dict, Optional
import math

from fastapi import FastAPI, APIRouter, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import dateparser

# --- CONFIGURATION ---
app = FastAPI(title="FocusFlow Intelligent Backend")
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- PILLAR 0: DATA STORE (In-Memory) ---
TASKS_DB = []

# --- MODELS ---
class RawTextRequest(BaseModel):
    text: str

class TaskCreate(BaseModel):
    title: str
    priority: str
    duration: int
    deadline: Optional[str] = None
    tags: List[str] = []

class Task(TaskCreate):
    id: str
    status: str = "pending"
    ai_score: float = 0.0
    remaining_duration: Optional[int] = 0
    is_virtual_chunk: bool = False

class ScheduleBlock(BaseModel):
    time: str
    task_id: str
    task_title: str
    type: str 
    duration: int
    color: str

class WeeklySchedule(BaseModel):
    schedule: Dict[str, List[ScheduleBlock]]
    unscheduled: List[str]

# --- HELPERS ---
def get_color_for_priority(priority: str) -> str:
    if priority == "High": return 'hsl(10 80% 65%)'
    if priority == "Medium": return 'hsl(180 60% 50%)'
    return 'hsl(240 5% 65%)'

# --- PILLAR 1: NLP ENGINE ---
class NLPEngine:
    @staticmethod
    def parse_text(text: str) -> TaskCreate:
        lower_text = text.lower()
        priority = "Medium"
        if any(w in lower_text for w in ["urgent", "asap", "critical"]): priority = "High"
        elif any(w in lower_text for w in ["low", "whenever"]): priority = "Low"

        tags = []
        if any(w in lower_text for w in ["report", "write"]): tags.append("Writing")
        if any(w in lower_text for w in ["code", "api"]): tags.append("Dev")
        if "meeting" in lower_text: tags.append("Meeting")

        deadline_obj = dateparser.parse(text, settings={'PREFER_DATES_FROM': 'future'})
        deadline_str = deadline_obj.strftime("%Y-%m-%d") if deadline_obj else (datetime.now() + timedelta(days=7)).strftime("%Y-%m-%d")

        duration = 60
        if "quick" in lower_text: duration = 30
        if "long" in lower_text: duration = 120

        return TaskCreate(title=text, priority=priority, duration=duration, deadline=deadline_str, tags=tags)

# --- PILLAR 2: SCORING ENGINE ---
def calculate_score(task: Task) -> float:
    p_scores = {"High": 150, "Medium": 100, "Low": 50}
    base_score = p_scores.get(task.priority, 50)

    try:
        due = datetime.strptime(task.deadline, "%Y-%m-%d").date()
        today = datetime.now().date()
        days_left = (due - today).days
        
        if days_left <= 0: urgency_mult = 3.0 
        elif days_left <= 2: urgency_mult = 2.0
        elif days_left <= 5: urgency_mult = 1.5
        else: urgency_mult = 1.0
        
        effort_bonus = task.duration / 60.0 * 5 

        return (base_score * urgency_mult) + effort_bonus
    except:
        return base_score

# --- PILLAR 3: INTELLIGENT SCHEDULING ENGINE ---
class DailyCapacity:
    def __init__(self, date_str):
        self.date_str = date_str
        self.current_time = datetime.strptime(f"{date_str} 09:00:00", "%Y-%m-%d %H:%M:%S")
        self.end_time = datetime.strptime(f"{date_str} 18:00:00", "%Y-%m-%d %H:%M:%S")
        self.blocks = []
        self.minutes_booked_for_long_tasks = 0

    def has_time(self, duration_needed):
        return (self.end_time - self.current_time).total_seconds() / 60 >= duration_needed

    def add_block(self, task: Task, duration: int, is_break=False):
        start_str = self.current_time.strftime("%I:%M %p")
        
        block = ScheduleBlock(
            time=start_str,
            task_id=task.id if not is_break else "break",
            task_title=task.title if not is_break else "🧠 Brain Break",
            type="work" if not is_break else "break",
            duration=duration,
            color=get_color_for_priority(task.priority) if not is_break else "hsl(150, 40%, 90%)"
        )
        self.blocks.append(block)
        self.current_time += timedelta(minutes=duration)
        
        if not is_break and task.duration > 120:
             self.minutes_booked_for_long_tasks += duration

def generate_smart_schedule(tasks: List[Task]) -> WeeklySchedule:
    today = datetime.now().date()
    horizon_days = 14
    daily_caps = {
        (today + timedelta(days=i)).strftime("%Y-%m-%d"): DailyCapacity((today + timedelta(days=i)).strftime("%Y-%m-%d"))
        for i in range(horizon_days)
    }
    
    pending_tasks = [t.copy() for t in tasks if t.status != "completed"]
    for t in pending_tasks: t.remaining_duration = t.duration

    schedulable_chunks = []

    for task in pending_tasks:
        try:
            deadline_date = datetime.strptime(task.deadline, "%Y-%m-%d").date()
            days_until_due = (deadline_date - today).days
            
            if days_until_due <= 2:
                 task.ai_score = calculate_score(task) 
                 schedulable_chunks.append(task)
                 continue

            days_available = max(1, days_until_due - 1) 
            daily_effort_needed = math.ceil(task.duration / days_available)
            chunk_size_cap = max(daily_effort_needed, 120) if task.duration > 300 else task.duration

            remaining = task.duration
            chunk_idx = 0
            while remaining > 0:
                 this_chunk_duration = min(remaining, chunk_size_cap)
                 
                 chunk_task = task.copy()
                 chunk_task.id = f"{task.id}_chunk_{chunk_idx}"
                 chunk_task.duration = this_chunk_duration
                 chunk_task.remaining_duration = this_chunk_duration
                 chunk_task.title = f"{task.title} (Part {chunk_idx + 1})"
                 chunk_task.is_virtual_chunk = True
                 chunk_task.ai_score = calculate_score(task) - (chunk_idx * 5)
                 
                 schedulable_chunks.append(chunk_task)
                 remaining -= this_chunk_duration
                 chunk_idx += 1

        except Exception as e:
            logger.error(f"Error processing task {task.title} for spreading: {e}")
            schedulable_chunks.append(task)

    queue = sorted(schedulable_chunks, key=lambda t: t.ai_score, reverse=True)
    unscheduled = []
    
    for task_chunk in queue:
        placed = False
        for day_offset in range(horizon_days):
            current_date = today + timedelta(days=day_offset)
            date_str = current_date.strftime("%Y-%m-%d")
            
            try:
                 if current_date > datetime.strptime(task_chunk.deadline, "%Y-%m-%d").date():
                     continue
            except: pass

            day_cap = daily_caps[date_str]

            if task_chunk.is_virtual_chunk and day_cap.minutes_booked_for_long_tasks > 180:
                 continue 

            work_duration = min(task_chunk.remaining_duration, 90) 

            if day_cap.has_time(work_duration):
                day_cap.add_block(task_chunk, work_duration)
                task_chunk.remaining_duration -= work_duration
                placed = True
                
                if day_cap.has_time(15):
                     day_cap.add_block(task_chunk, 15, is_break=True)
                
                if task_chunk.remaining_duration > 0:
                     task_chunk.ai_score -= 1 
                     queue.insert(0, task_chunk) 
                break
        
        if not placed and task_chunk.remaining_duration > 0:
             unscheduled.append(task_chunk.title)

    final_schedule = {d: cap.blocks for d, cap in daily_caps.items() if cap.blocks}
    return WeeklySchedule(schedule=final_schedule, unscheduled=list(set(unscheduled)))

# --- API LAYER ---
api = APIRouter(prefix="/api")

@api.get("/health")
def health_check(): return {"status": "ok"}

@api.post("/tasks", response_model=Task)
def create_task(task_in: TaskCreate):
    new_task = Task(id=str(uuid.uuid4()), **task_in.dict())
    if not new_task.deadline:
         new_task.deadline = (datetime.now() + timedelta(days=7)).strftime("%Y-%m-%d")
    new_task.ai_score = calculate_score(new_task)
    TASKS_DB.append(new_task)
    return new_task

@api.get("/tasks", response_model=List[Task])
def get_tasks():
    for t in TASKS_DB: t.ai_score = calculate_score(t)
    return sorted(TASKS_DB, key=lambda t: t.ai_score, reverse=True)

# --- NEW: DELETE ENDPOINT ---
@api.delete("/tasks/{task_id}")
def delete_task(task_id: str):
    global TASKS_DB
    # Filter out the task with the matching ID
    TASKS_DB = [t for t in TASKS_DB if t.id != task_id]
    return {"status": "deleted", "remaining": len(TASKS_DB)}

# --- NEW: RESET ENDPOINT ---
@api.post("/db/reset")
def reset_db():
    global TASKS_DB
    TASKS_DB.clear()
    return {"status": "cleared"}

@api.get("/schedule", response_model=WeeklySchedule)
def get_schedule():
    for t in TASKS_DB: t.ai_score = calculate_score(t)
    return generate_smart_schedule(TASKS_DB)

app.include_router(api)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)