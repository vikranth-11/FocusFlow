import React, { useState, useEffect } from 'react';
import { Calendar as CalendarComponent } from '../components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { ChevronLeft, ChevronRight, MoreHorizontal, Coffee } from 'lucide-react';
import { useTasks } from '../context/TaskContext';
import { format, addDays, subDays } from 'date-fns';

const TimeSlot = ({ time, slot }) => {
  // Calculate height based on duration (15 mins = 3rem approx)
  const heightClass = slot ? `h-[${Math.max(slot.duration * 2, 60)}px]` : 'h-16';
  const dynamicHeight = slot ? { height: `${slot.duration * 1.5}px` } : {};

  return (
    <div className="flex gap-4 group">
      <div className="w-16 text-xs text-muted-foreground text-right pt-2 font-medium">
        {time}
      </div>
      <div className="flex-1 relative pb-4">
        <div className="absolute top-3 w-full border-t border-border/50 -z-10" />
        {slot ? (
          <div 
            className={`rounded-lg p-3 border-l-4 shadow-sm hover:shadow-md transition-all cursor-pointer relative overflow-hidden ${slot.type === 'break' ? 'bg-green-50/50 border-green-300' : ''}`}
            style={{ 
              backgroundColor: slot.type === 'break' ? undefined : `${slot.color}15`, 
              borderLeftColor: slot.type === 'break' ? undefined : slot.color,
              ...dynamicHeight
            }}
          >
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2">
                  {slot.type === 'break' && <Coffee className="w-3 h-3 text-green-600" />}
                  <h4 className="font-medium text-sm" style={{ color: slot.type === 'break' ? '#166534' : slot.color }}>
                    {slot.title}
                  </h4>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {slot.startTime} - {slot.duration} mins
                </p>
              </div>
              {slot.type !== 'break' && (
                <Button variant="ghost" size="icon" className="h-6 w-6 -mt-1 -mr-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="h-8" /> // Empty slot spacer
        )}
      </div>
    </div>
  );
};

const Schedule = () => {
  const [date, setDate] = useState(new Date());
  const { generateSmartSchedule } = useTasks();
  const [scheduleSlots, setScheduleSlots] = useState([]);

  useEffect(() => {
    if (date) {
      const slots = generateSmartSchedule(date);
      setScheduleSlots(slots);
    }
  }, [date, generateSmartSchedule]);

  const handlePrevDay = () => setDate(subDays(date, 1));
  const handleNextDay = () => setDate(addDays(date, 1));

  // Helper to find slot starting at specific time (simplified for prototype)
  // In a real app, we'd map minutes to slots more robustly
  const renderTimeline = () => {
    if (scheduleSlots.length === 0) {
      return <div className="text-center py-10 text-muted-foreground">No tasks scheduled for this day. Enjoy your free time! 🎉</div>;
    }
    return scheduleSlots.map((slot, index) => (
      <TimeSlot 
        key={slot.id} 
        time={slot.startTime} 
        slot={slot} 
      />
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-6">
        <div className="flex-1 space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold tracking-tight">Schedule</h1>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" onClick={handlePrevDay}>
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="font-medium min-w-[140px] text-center">
                {format(date, 'EEE, MMM d, yyyy')}
              </span>
              <Button variant="outline" size="icon" onClick={handleNextDay}>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <Card className="min-h-[600px]">
            <CardContent className="p-6">
              <div className="space-y-0">
                {renderTimeline()}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="w-full md:w-80 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Calendar</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center">
              <CalendarComponent
                mode="single"
                selected={date}
                onSelect={(d) => d && setDate(d)}
                className="rounded-md border shadow-none"
              />
            </CardContent>
          </Card>

          <Card className="bg-primary text-primary-foreground">
            <CardContent className="p-6">
              <h3 className="font-semibold mb-2">Smart Scheduling Active ⚡</h3>
              <p className="text-sm opacity-90">
                Tasks longer than 90 mins are automatically split with "Brain Breaks" to maintain peak focus.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Schedule;
