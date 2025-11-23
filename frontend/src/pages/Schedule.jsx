import React from 'react';
import { Calendar as CalendarComponent } from '../components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';

const TimeSlot = ({ time, task, color, duration }) => {
  // Simple height calculation based on duration (mock)
  const height = duration === '2h' ? 'h-32' : duration === '1h' ? 'h-16' : 'h-16';
  
  return (
    <div className="flex gap-4 group">
      <div className="w-16 text-xs text-muted-foreground text-right pt-2 font-medium">
        {time}
      </div>
      <div className="flex-1 relative pb-4">
        <div className="absolute top-3 w-full border-t border-border/50 -z-10" />
        {task && (
          <div className={`${height} rounded-lg p-3 border-l-4 shadow-sm hover:shadow-md transition-all cursor-pointer relative overflow-hidden`}
            style={{ 
              backgroundColor: `${color}15`, // 15% opacity
              borderLeftColor: color 
            }}
          >
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-medium text-sm" style={{ color: color }}>{task}</h4>
                <p className="text-xs text-muted-foreground mt-1">Project Alpha</p>
              </div>
              <Button variant="ghost" size="icon" className="h-6 w-6 -mt-1 -mr-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const Schedule = () => {
  const [date, setDate] = React.useState(new Date());

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-6">
        <div className="flex-1 space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold tracking-tight">Schedule</h1>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon">
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="font-medium min-w-[100px] text-center">Oct 24, 2025</span>
              <Button variant="outline" size="icon">
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <Card className="min-h-[600px]">
            <CardContent className="p-6">
              <div className="space-y-0">
                <TimeSlot time="09:00 AM" task="Review Q3 Financial Report" color="#ef4444" duration="2h" />
                <TimeSlot time="10:00 AM" />
                <TimeSlot time="11:00 AM" />
                <TimeSlot time="11:30 AM" task="Team Sync Meeting" color="#0ea5e9" duration="1h" />
                <TimeSlot time="12:30 PM" />
                <TimeSlot time="01:00 PM" />
                <TimeSlot time="02:00 PM" task="Design System Update" color="#8b5cf6" duration="2h" />
                <TimeSlot time="03:00 PM" />
                <TimeSlot time="04:00 PM" />
                <TimeSlot time="04:30 PM" task="Client Email Responses" color="#f59e0b" duration="1h" />
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
                onSelect={setDate}
                className="rounded-md border shadow-none"
              />
            </CardContent>
          </Card>

          <Card className="bg-primary text-primary-foreground">
            <CardContent className="p-6">
              <h3 className="font-semibold mb-2">Pro Tip</h3>
              <p className="text-sm opacity-90">
                You have a 2-hour gap between 12:30 PM and 2:30 PM. 
                Great time for deep work or a lunch break!
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Schedule;
