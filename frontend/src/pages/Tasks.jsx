import React, { useState } from 'react';
import { 
  Plus, 
  Filter, 
  ArrowUpDown, 
  MoreVertical, 
  Calendar as CalendarIcon,
  Clock,
  Tag
} from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Card, CardContent } from '../ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

const TaskCard = ({ task }) => (
  <Card className="mb-3 hover:shadow-md transition-all duration-200 border-l-4" style={{ borderLeftColor: task.color }}>
    <CardContent className="p-4 flex items-center justify-between">
      <div className="flex items-start gap-4">
        <div className="mt-1">
          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center cursor-pointer ${task.completed ? 'bg-primary border-primary' : 'border-muted-foreground'}`}>
            {task.completed && <div className="w-2.5 h-2.5 bg-white rounded-full" />}
          </div>
        </div>
        <div>
          <h3 className={`font-medium ${task.completed ? 'text-muted-foreground line-through' : 'text-foreground'}`}>
            {task.title}
          </h3>
          <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <CalendarIcon className="w-3 h-3" />
              <span>{task.date}</span>
            </div>
            {task.time && (
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{task.time}</span>
              </div>
            )}
            <Badge variant="secondary" className="text-[10px] h-5 px-1.5 font-normal">
              {task.tag}
            </Badge>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <Badge className={`${
          task.priority === 'High' ? 'bg-accent text-white hover:bg-accent/90' : 
          task.priority === 'Medium' ? 'bg-yellow-500/10 text-yellow-600 hover:bg-yellow-500/20' : 
          'bg-slate-100 text-slate-600 hover:bg-slate-200'
        }`}>
          {task.priority}
        </Badge>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreVertical className="w-4 h-4 text-muted-foreground" />
        </Button>
      </div>
    </CardContent>
  </Card>
);

const Tasks = () => {
  const [tasks, setTasks] = useState([
    { id: 1, title: "Review Q3 Financial Report", date: "Today", time: "2h", priority: "High", tag: "Finance", color: "hsl(10 80% 65%)", completed: false },
    { id: 2, title: "Update Design System Tokens", date: "Today", time: "4h", priority: "Medium", tag: "Design", color: "hsl(255 70% 60%)", completed: false },
    { id: 3, title: "Weekly Team Sync", date: "Tomorrow", time: "1h", priority: "Medium", tag: "Meeting", color: "hsl(180 60% 50%)", completed: false },
    { id: 4, title: "Buy Groceries", date: "Sat, Oct 24", priority: "Low", tag: "Personal", color: "hsl(240 5% 65%)", completed: true },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Tasks</h1>
          <p className="text-muted-foreground">Manage and organize your daily workload.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon">
            <Filter className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="icon">
            <ArrowUpDown className="w-4 h-4" />
          </Button>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button className="gap-2 bg-primary text-white shadow-lg shadow-primary/20">
                <Plus className="w-4 h-4" />
                Add Task
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Task</DialogTitle>
                <DialogDescription>
                  Create a new task and let AI optimize your schedule.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Task Title</Label>
                  <Input id="title" placeholder="e.g., Finish project proposal" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="priority">Priority</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="duration">Est. Duration</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="30">30 mins</SelectItem>
                        <SelectItem value="60">1 hour</SelectItem>
                        <SelectItem value="120">2 hours</SelectItem>
                        <SelectItem value="240">4 hours</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="notes">Notes (Optional)</Label>
                  <Input id="notes" placeholder="Add details..." />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Create Task</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-2">
          {tasks.map(task => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>

        <div className="space-y-6">
          <Card className="bg-muted/30 border-dashed">
            <CardContent className="p-6 text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-2">
                <Tag className="w-5 h-5 text-muted-foreground" />
              </div>
              <h3 className="font-medium">Tags</h3>
              <div className="flex flex-wrap gap-2 justify-center mt-4">
                {['Design', 'Finance', 'Meeting', 'Personal', 'Dev', 'Marketing'].map(tag => (
                  <Badge key={tag} variant="secondary" className="cursor-pointer hover:bg-primary/10 hover:text-primary transition-colors">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Tasks;
