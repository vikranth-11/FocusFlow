import React, { useState } from 'react';
import { 
  Plus, Filter, ArrowUpDown, MoreVertical, 
  Calendar as CalendarIcon, Clock, Tag, Trash2, Check, RefreshCw
} from 'lucide-react';
// FIXED IMPORTS: Using relative paths
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Card, CardContent } from '../components/ui/card';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "../components/ui/dialog";
import { Label } from "../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { useTasks } from '../context/TaskContext';
import { toast } from 'sonner';

const TaskCard = ({ task, onDelete, onToggle }) => (
  <Card className="mb-3 hover:shadow-md transition-all duration-200 border-l-4" style={{ borderLeftColor: task.color }}>
    <CardContent className="p-4 flex items-center justify-between">
      <div className="flex items-start gap-4">
        <div className="mt-1">
          <div 
            onClick={() => onToggle(task.id)}
            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center cursor-pointer transition-colors ${task.completed ? 'bg-primary border-primary' : 'border-muted-foreground hover:border-primary'}`}
          >
            {task.completed && <Check className="w-3 h-3 text-white" />}
          </div>
        </div>
        <div>
          <h3 className={`font-medium ${task.completed ? 'text-muted-foreground line-through' : 'text-foreground'}`}>
            {task.title}
          </h3>
          <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
            {task.deadline && (
               <div className="flex items-center gap-1 text-accent font-medium">
                <CalendarIcon className="w-3 h-3" />
                <span>Due: {task.deadline}</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{task.duration}m</span>
            </div>
            
            {task.tags && task.tags.map((tag, i) => (
                <Badge key={i} variant="secondary" className="text-[10px] h-5 px-1.5 font-normal">
                    {tag}
                </Badge>
            ))}
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        {/* Show AI Score if available */}
        {task.ai_score > 0 && (
            <span className="text-[10px] font-mono text-muted-foreground bg-muted px-1 rounded">
                AI Score: {Math.round(task.ai_score)}
            </span>
        )}

        <Badge className={`${
          task.priority === 'High' ? 'bg-red-100 text-red-700 hover:bg-red-200' : 
          task.priority === 'Medium' ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' : 
          'bg-slate-100 text-slate-600 hover:bg-slate-200'
        }`}>
          {task.priority}
        </Badge>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreVertical className="w-4 h-4 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => onDelete(task.id)}>
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </CardContent>
  </Card>
);

const Tasks = () => {
  const { tasks, addTask, deleteTask, toggleComplete, loading } = useTasks();
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [newTask, setNewTask] = useState({
    title: '',
    priority: 'Medium',
    duration: '60',
    tag: 'General',
    deadline: new Date().toISOString().split('T')[0]
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
        await addTask(newTask);
        setIsOpen(false);
        toast.success("Task sent to AI Engine");
        // Reset form
        setNewTask({ title: '', priority: 'Medium', duration: '60', tag: 'General', deadline: new Date().toISOString().split('T')[0] });
    } catch (err) {
        toast.error("Failed to connect to AI Backend");
    } finally {
        setIsSubmitting(false);
    }
  };

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
          
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
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
              <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Task Title</Label>
                  <Input 
                    id="title" 
                    value={newTask.title}
                    onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                    placeholder="e.g., Finish project proposal" 
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="priority">Priority</Label>
                    <Select value={newTask.priority} onValueChange={(v) => setNewTask({...newTask, priority: v})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="High">High</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="Low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="duration">Est. Duration</Label>
                    <Select value={newTask.duration} onValueChange={(v) => setNewTask({...newTask, duration: v})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="30">30 mins</SelectItem>
                        <SelectItem value="60">1 hour</SelectItem>
                        <SelectItem value="120">2 hours</SelectItem>
                        <SelectItem value="240">4 hours</SelectItem>
                        <SelectItem value="600">10 hours (Split)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="deadline">Deadline</Label>
                  <Input 
                    id="deadline" 
                    type="date"
                    value={newTask.deadline}
                    onChange={(e) => setNewTask({...newTask, deadline: e.target.value})}
                    required
                  />
                </div>
                <DialogFooter>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? <RefreshCw className="w-4 h-4 animate-spin mr-2" /> : null}
                    Create Task
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-2">
          {loading ? (
             <div className="text-center py-12 text-muted-foreground flex flex-col items-center">
                <RefreshCw className="w-8 h-8 animate-spin mb-4 opacity-50" />
                Connecting to AI Backend...
             </div>
          ) : tasks.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No tasks found. Add one to trigger the algorithm!
            </div>
          ) : (
            tasks.map(task => (
              <TaskCard 
                key={task.id} 
                task={task} 
                onDelete={deleteTask}
                onToggle={toggleComplete}
              />
            ))
          )}
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