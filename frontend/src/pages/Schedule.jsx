import React, { useState, useEffect } from 'react';
// FIXED IMPORTS: Using relative paths
import { Calendar as CalendarComponent } from '../components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { ChevronLeft, ChevronRight, Coffee, Zap, PlayCircle, AlertCircle, Split } from 'lucide-react';
import { useTasks } from '../context/TaskContext';
import { format, addDays, subDays } from 'date-fns';
import { toast } from 'sonner';

const TimeSlot = ({ time, slot }) => {
  // 1. Visual Logic: Height is proportional to duration (Tetris Effect)
  // 2.5px per minute. 60 mins = 150px height.
  const duration = slot ? slot.duration : 60; 
  const height = Math.max(duration * 2.5, 60); 

  if (!slot) {
    return (
      <div className="flex gap-4 group h-16">
        <div className="w-16 text-xs text-muted-foreground text-right pt-2 font-medium">{time}</div>
        <div className="flex-1 border-t border-dashed border-border/40 relative top-3" />
      </div>
    );
  }

  const isBreak = slot.type === 'break';
  // Detect chunking by checking title for "(Part X)" logic from backend
  const isSplit = slot.task_title.includes('(Part');
  
  const bgColor = isBreak ? 'bg-emerald-50' : 'bg-white';
  const borderColor = isBreak ? 'border-emerald-200' : 'border-border';
  const textColor = isBreak ? 'text-emerald-700' : 'text-foreground';

  return (
    <div className="flex gap-4 group animate-in slide-in-from-bottom-2 duration-500">
      <div className="w-16 text-xs text-muted-foreground text-right pt-2 font-medium">
        {slot.time}
      </div>
      <div className="flex-1 relative">
        <div 
          className={`rounded-xl p-4 border-l-4 shadow-sm hover:shadow-md transition-all cursor-pointer relative overflow-hidden ${bgColor} border border-r-0 border-t-0 border-b-0`}
          style={{ 
            height: `${height}px`,
            borderLeftColor: isBreak ? undefined : slot.color,
            borderLeftWidth: '6px'
          }}
        >
          {/* Subtle Background Pattern for "Work" blocks */}
          {!isBreak && (
             <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:16px_16px]"></div>
          )}

          <div className="flex justify-between items-start relative z-10 h-full">
            <div className="flex flex-col justify-between h-full">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  {isBreak ? <Coffee className="w-4 h-4 text-emerald-600" /> : null}
                  <h4 className={`font-semibold text-sm ${textColor}`}>
                    {slot.task_title}
                  </h4>
                </div>
                <p className="text-xs text-muted-foreground font-medium">
                  {duration} minutes
                </p>
              </div>

              {/* EXPLAINABLE AI BADGES */}
              <div className="flex gap-2 mt-2">
                {isBreak && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-100 text-emerald-700">
                    <Zap className="w-3 h-3" /> Recovery
                  </span>
                )}
                {isSplit && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-blue-50 text-blue-700 border border-blue-100">
                    <Split className="w-3 h-3" /> Auto-Split
                  </span>
                )}
                {!isBreak && !isSplit && duration >= 60 && (
                   <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-purple-50 text-purple-700 border border-purple-100">
                   <Zap className="w-3 h-3" /> Deep Work
                 </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Schedule = () => {
  const [date, setDate] = useState(new Date());
  const { weeklySchedule, fetchSchedule, loadDemoData, loading } = useTasks();
  const [todaysSlots, setTodaysSlots] = useState([]);

  useEffect(() => {
    fetchSchedule();
  }, []);

  useEffect(() => {
    if (date && weeklySchedule) {
      const dateKey = format(date, 'yyyy-MM-dd');
      const slots = weeklySchedule[dateKey] || [];
      setTodaysSlots(slots);
    }
  }, [date, weeklySchedule]);

  const handleDemoLoad = async () => {
    toast.info("Injecting complex workload...");
    await loadDemoData();
    toast.success("AI Optimization Complete!");
  };

  const handlePrevDay = () => setDate(subDays(date, 1));
  const handleNextDay = () => setDate(addDays(date, 1));

  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-col md:flex-row justify-between gap-6">
        
        {/* MAIN TIMELINE AREA */}
        <div className="flex-1 space-y-6">
          <div className="flex items-center justify-between bg-card p-4 rounded-xl border shadow-sm">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Smart Schedule</h1>
              <p className="text-xs text-muted-foreground">Optimized for flow state & recovery</p>
            </div>
            
            <div className="flex items-center gap-3">
               {/* DEMO BUTTON */}
               <Button 
                onClick={handleDemoLoad} 
                disabled={loading}
                variant="secondary" 
                size="sm" 
                className="hidden md:flex gap-2 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 border-indigo-200"
              >
                {loading ? <Zap className="w-4 h-4 animate-spin" /> : <PlayCircle className="w-4 h-4" />}
                Load Demo Data
              </Button>

              <div className="flex items-center gap-1 bg-muted/50 p-1 rounded-lg">
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handlePrevDay}>
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <span className="font-medium text-sm min-w-[140px] text-center">
                  {format(date, 'EEEE, MMM d')}
                </span>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleNextDay}>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="min-h-[600px] p-2">
            <div className="space-y-4">
              {todaysSlots.length > 0 ? (
                todaysSlots.map((slot, index) => (
                  <TimeSlot 
                    key={index} 
                    time={slot.time} 
                    slot={slot} 
                  />
                ))
              ) : (
                <div className="flex flex-col items-center justify-center h-96 text-muted-foreground border-2 border-dashed rounded-xl bg-muted/10">
                  <div className="bg-muted p-4 rounded-full mb-4">
                    <Zap className="w-8 h-8 opacity-20" />
                  </div>
                  <p className="font-medium">Free Day</p>
                  <p className="text-sm max-w-xs text-center mt-2">
                    No tasks scheduled. Use the "Load Demo Data" button to see the AI in action.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* SIDEBAR */}
        <div className="w-full md:w-80 space-y-6">
          <Card className="overflow-hidden border-none shadow-lg">
            <CardContent className="p-0">
              <CalendarComponent
                mode="single"
                selected={date}
                onSelect={(d) => d && setDate(d)}
                className="rounded-md border shadow-sm bg-white p-4"
              />
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-violet-600 to-indigo-700 text-white border-none shadow-xl relative overflow-hidden">
            {/* Decorative circles */}
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
            <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
            
            <CardContent className="p-6 relative z-10">
              <div className="flex items-center gap-2 mb-3">
                <div className="p-1.5 bg-white/20 rounded-lg backdrop-blur-sm">
                  <Zap className="w-4 h-4 text-white" />
                </div>
                <h3 className="font-semibold">Insight</h3>
              </div>
              <div className="space-y-3">
                
                <div className="h-px bg-white/10 my-2" />
                <div className="flex gap-3 items-start text-sm text-white/90">
                  <Coffee className="w-4 h-4 mt-0.5 shrink-0 opacity-70" />
                  <p className="leading-relaxed text-xs">
                    Recovery breaks are inserted after every 90m Deep Work block to maintain cognitive performance.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Schedule;