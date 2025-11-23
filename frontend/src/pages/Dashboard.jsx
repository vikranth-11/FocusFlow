import React from 'react';
import { 
  Activity, 
  CheckCircle2, 
  Clock, 
  TrendingUp, 
  ArrowUpRight,
  Calendar as CalendarIcon
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Progress } from '../components/ui/progress';
import { Badge } from '../components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { useTasks } from '../context/TaskContext';
import { Link } from 'react-router-dom';

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

const TaskRow = ({ task }) => (
  <div className="flex items-center justify-between p-4 rounded-xl bg-card border border-border/50 hover:border-primary/20 transition-colors group">
    <div className="flex items-center gap-4">
      <div className={`w-2 h-2 rounded-full ${
        task.priority === 'High' ? 'bg-accent' : 
        task.priority === 'Medium' ? 'bg-yellow-500' : 'bg-green-500'
      }`} />
      <div>
        <h4 className="font-medium text-sm group-hover:text-primary transition-colors">{task.title}</h4>
        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
          <Clock className="w-3 h-3" />
          <span>{task.duration} mins</span>
        </div>
      </div>
    </div>
    <Badge variant={task.completed ? 'default' : 'outline'} className={task.completed ? 'bg-green-500 hover:bg-green-600' : ''}>
      {task.completed ? 'Done' : 'Pending'}
    </Badge>
  </div>
);

const Dashboard = () => {
  const { tasks } = useTasks();
  
  // Dynamic Stats Calculation
  const completedTasks = tasks.filter(t => t.completed).length;
  const totalTasks = tasks.length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  
  const totalMinutes = tasks.reduce((acc, t) => acc + (t.completed ? t.duration : 0), 0);
  const hours = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;

  const upcomingDeadlines = tasks.filter(t => !t.completed && new Date(t.deadline) <= new Date(Date.now() + 86400000 * 2)).length;

  const [insight, setInsight] = React.useState({
    text: "Based on your work patterns, you're most productive between 9 AM and 11 AM. I've scheduled your most complex task, \"Q3 Financial Report\", for this slot.",
    highlight: "Q3 Financial Report"
  });
  const [isOptimizing, setIsOptimizing] = React.useState(false);

  const handleOptimize = () => {
    setIsOptimizing(true);
    setTimeout(() => {
      setInsight({
        text: "I've detected a conflict at 2 PM. Moving \"Design System Update\" to 4 PM would free up a solid 3-hour block for deep work.",
        highlight: "Design System Update"
      });
      setIsOptimizing(false);
    }, 1500);
  };

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Good Morning, Alex! ☀️</h1>
          <p className="text-muted-foreground mt-1">You have {tasks.filter(t => t.priority === 'High' && !t.completed).length} high-priority tasks today. Let's get focused.</p>
        </div>
        <div className="flex gap-3">
          <Link to="/schedule">
            <Button variant="outline" className="gap-2">
              <CalendarIcon className="w-4 h-4" />
              View Calendar
            </Button>
          </Link>
          <Button 
            onClick={handleOptimize}
            disabled={isOptimizing}
            className="gap-2 bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/25 transition-all"
          >
            <ArrowUpRight className={`w-4 h-4 ${isOptimizing ? 'animate-spin' : ''}`} />
            {isOptimizing ? 'Optimizing...' : 'Optimize Schedule'}
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Productivity Score" 
          value={`${completionRate}%`} 
          icon={Activity} 
          trend={completionRate > 50 ? "+12%" : null}
        />
        <StatCard 
          title="Tasks Completed" 
          value={`${completedTasks}/${totalTasks}`} 
          icon={CheckCircle2} 
          trend={`+${completedTasks}`}
        />
        <StatCard 
          title="Focus Time" 
          value={`${hours}h ${mins}m`} 
          icon={Clock} 
        />
        <StatCard 
          title="Upcoming Deadlines" 
          value={upcomingDeadlines} 
          icon={TrendingUp} 
          trend={upcomingDeadlines > 0 ? "Urgent" : "On Track"}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-6">
          {/* AI Insight Widget */}
          <Card className="bg-gradient-to-r from-primary/5 to-purple-500/5 border-primary/10 transition-all duration-500">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="text-xs">✨</span>
                </div>
                <CardTitle className="text-base text-primary">AI Insight</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed animate-in fade-in duration-500 key={insight.text}">
                {insight.text.split(insight.highlight)[0]}
                <span className="font-medium text-foreground">{insight.highlight}</span>
                {insight.text.split(insight.highlight)[1]}
              </p>
            </CardContent>
          </Card>

          {/* Today's Schedule */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Today's Focus</h2>
              <Link to="/tasks">
                <Button variant="ghost" size="sm" className="text-muted-foreground">View All</Button>
              </Link>
            </div>
            <div className="space-y-3">
              {tasks.slice(0, 4).map(task => (
                <TaskRow key={task.id} task={task} />
              ))}
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
                  <span className="font-medium">{completionRate}%</span>
                </div>
                <Progress value={completionRate} className="h-2" />
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
              <Link to="/tasks">
                <Button variant="secondary" className="w-full bg-white/10 hover:bg-white/20 text-white border-none">
                  + New Task
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
