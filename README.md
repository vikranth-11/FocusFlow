# Intelligent Task Scheduler

A smart task management application that optimally assigns tasks based on deadlines, priorities, and estimated effort. Features AI-driven scheduling with automatic task splitting and break insertion.

## 🚀 Features

- **Smart Scheduling**: Automatically splits long tasks (>90 mins) and inserts "Brain Breaks".
- **Priority Scoring**: Tasks are weighted by priority (High/Medium/Low) and deadline proximity.
- **Dynamic Dashboard**: Real-time stats for productivity, focus time, and upcoming deadlines.
- **Task Management**: Create, edit, delete, and complete tasks with deadline tracking.
- **Interactive Calendar**: Navigate through days to see your optimized schedule.

## 🛠️ Tech Stack

- **Frontend**: React, Tailwind CSS, Shadcn UI, Lucide Icons
- **State Management**: React Context API
- **Routing**: React Router DOM
- **Build Tool**: Vite / Create React App (configured with Craco)

## 🏃‍♂️ How to Run Locally

### Prerequisites
- Node.js (v16 or higher)
- Yarn or npm

### Installation

1. **Clone the repository** (or download the source code):
   ```bash
   git clone <your-repo-url>
   cd intelligent-task-scheduler
   ```

2. **Install Dependencies**:
   ```bash
   cd frontend
   yarn install
   # or
   npm install
   ```

3. **Start the Development Server**:
   ```bash
   yarn start
   # or
   npm start
   ```

4. **Open in Browser**:
   Navigate to `http://localhost:3000` to view the app.

## 📂 Project Structure

```
/src
  /components
    /layout       # Sidebar and main layout wrapper
    /ui           # Reusable Shadcn UI components
  /context        # Global state (TaskContext)
  /pages          # Main views (Dashboard, Tasks, Schedule)
  /lib            # Utilities (cn, etc.)
  App.jsx         # Main application entry
  index.css       # Global styles & Tailwind directives
```

## 🧠 Smart Scheduling Logic

The scheduler uses a client-side algorithm located in `src/context/TaskContext.jsx`:
1. **Filters** tasks for the selected date.
2. **Sorts** by a calculated Priority Score (Priority Weight + Deadline Urgency).
3. **Allocates** time slots starting from 9:00 AM.
4. **Splits** tasks longer than 90 minutes into smaller chunks.
5. **Inserts** 15-minute "Brain Breaks" between chunks to prevent burnout.

## 🎨 Design System

- **Theme**: "Focus Flow" (Violet/Teal/Coral)
- **Typography**: Inter (Body), Space Grotesk (Headings)
- **Styling**: Tailwind CSS with CSS Variables for easy theming.
