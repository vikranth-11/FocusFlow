import React from 'react';
import { 
  Activity, 
  CheckCircle2, 
  Clock, 
  TrendingUp, 
  ArrowUpRight,
  MoreHorizontal,
  Calendar as CalendarIcon
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

const StatCard = ({ title, value, change, icon: Icon, trend }) => (
  <Card className="card-hover border-none shadow-sm bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-950">
    <CardContent className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="p-2 bg-primary/10 rounded-lg text-primary">
          <Icon className="w-5 h-5" />
        </div>
        {trend && (
          <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
            {trend}
          </Badge>
        )}
      </div>
      <div className="space-y-1">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <h3 className="text-2xl font-bold tracking-tight">{value}</h3>
      </div>
    </CardContent>
  </Card>
);

const TaskRow = ({ title, time, priority, status }) => (
  <div className="flex items-center justify-between p-4 rounded-xl bg-card border border-border/50 hover:border-primary/20 transition-colors group">
    <div className="flex items-center gap-4">
      <div className={`w-2 h-2 rounded-full ${
        priority === 'High' ? 'bg-accent' : 
        priority === 'Medium' ? 'bg-yellow-500' : 'bg-green-500'
      }`} />
      <div>
        <h4 className="font-medium text-sm group-hover:text-primary transition-colors">{title}</h4>
        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
          <Clock className="w-3 h-3" />
          <span>{time}</span>
        </div>
      </div>
    </div>
    <Badge variant={status === 'Done' ? 'default' : 'outline'} className={status === 'Done' ? 'bg-green-500 hover:bg-green-600' : ''}>
      {status}
    </Badge>
  </div>
);

const Dashboard = () => {
  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Good Morning, Alex! ☀️</h1>
          <p className="text-muted-foreground mt-1">You have 5 high-priority tasks today. Let's get focused.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2">
            <CalendarIcon className="w-4 h-4" />
            View Calendar
          </Button>
          <Button className="gap-2 bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/25">
            <ArrowUpRight className="w-4 h-4" />
            Optimize Schedule
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Productivity Score" 
          value="84%" 
          icon={Activity} 
          trend="+12%"
        />
        <StatCard 
          title="Tasks Completed" 
          value="12/18" 
          icon={CheckCircle2} 
          trend="+4"
        />
        <StatCard 
          title="Focus Time" 
          value="4h 20m" 
          icon={Clock} 
        />
        <StatCard 
          title="Upcoming Deadlines" 
          value="3" 
          icon={TrendingUp} 
          trend="Urgent"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-6">
          {/* AI Insight Widget */}
          <Card className="bg-gradient-to-r from-primary/5 to-purple-500/5 border-primary/10">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="text-xs">✨</span>
                </div>
                <CardTitle className="text-base text-primary">AI Insight</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Based on your work patterns, you're most productive between <strong>9 AM and 11 AM</strong>. 
                I've scheduled your most complex task, <span className="font-medium text-foreground">"Q3 Financial Report"</span>, for this slot.
              </p>
            </CardContent>
          </Card>

          {/* Today's Schedule */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Today's Focus</h2>
              <Button variant="ghost" size="sm" className="text-muted-foreground">View All</Button>
            </div>
            <div className="space-y-3">
              <TaskRow title="Review Q3 Financial Report" time="09:00 AM - 11:00 AM" priority="High" status="In Progress" />
              <TaskRow title="Team Sync Meeting" time="11:30 AM - 12:30 PM" priority="Medium" status="Pending" />
              <TaskRow title="Design System Update" time="02:00 PM - 04:00 PM" priority="Medium" status="Pending" />
              <TaskRow title="Client Email Responses" time="04:30 PM - 05:00 PM" priority="Low" status="Pending" />
            </div>
          </div>
        </div>

        {/* Sidebar Widgets */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Weekly Progress</CardTitle>
              <CardDescription>You're ahead of schedule!</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Goal Completion</span>
                  <span className="font-medium">78%</span>
                </div>
                <Progress value={78} className="h-2" />
              </div>
              <div className="pt-4 border-t border-border">
                <div className="flex items-center gap-3 mb-3">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <div className="text-sm">
                    <p className="font-medium">Team Velocity</p>
                    <p className="text-muted-foreground text-xs">Top 5% this week</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 text-white border-none">
            <CardHeader>
              <CardTitle className="text-base text-slate-100">Quick Add</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-400 mb-4">Capture tasks quickly before you forget.</p>
              <Button variant="secondary" className="w-full bg-white/10 hover:bg-white/20 text-white border-none">
                + New Task
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
