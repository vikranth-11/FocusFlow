import React, { createContext, useContext, useState, useEffect } from 'react';

const TaskContext = createContext();

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
};

export const TaskProvider = ({ children }) => {
  // Initial Mock Data
  const [tasks, setTasks] = useState([
    { id: 1, title: "Review Q3 Financial Report", date: new Date().toISOString().split('T')[0], duration: 120, priority: "High", tag: "Finance", color: "hsl(10 80% 65%)", completed: false, deadline: new Date().toISOString().split('T')[0] },
    { id: 2, title: "Update Design System Tokens", date: new Date().toISOString().split('T')[0], duration: 240, priority: "Medium", tag: "Design", color: "hsl(255 70% 60%)", completed: false, deadline: new Date(Date.now() + 86400000).toISOString().split('T')[0] },
    { id: 3, title: "Weekly Team Sync", date: new Date(Date.now() + 86400000).toISOString().split('T')[0], duration: 60, priority: "Medium", tag: "Meeting", color: "hsl(180 60% 50%)", completed: false, deadline: new Date(Date.now() + 86400000).toISOString().split('T')[0] },
    { id: 4, title: "Buy Groceries", date: new Date(Date.now() + 172800000).toISOString().split('T')[0], duration: 45, priority: "Low", tag: "Personal", color: "hsl(240 5% 65%)", completed: true, deadline: new Date(Date.now() + 172800000).toISOString().split('T')[0] },
  ]);

  const [schedule, setSchedule] = useState([]);

  // Priority Scoring Algorithm
  const calculatePriorityScore = (task) => {
    const priorityWeights = { High: 3, Medium: 2, Low: 1 };
    const deadlineWeight = new Date(task.deadline).getTime() - new Date().getTime() < 86400000 ? 2 : 0; // Boost if due within 24h
    return priorityWeights[task.priority] + deadlineWeight;
  };

  // Smart Scheduling Algorithm (Splitting & Breaks)
  const generateSmartSchedule = (selectedDate) => {
    const dateStr = selectedDate.toISOString().split('T')[0];
    
    // 1. Filter tasks for this date or overdue
    let dailyTasks = tasks.filter(t => t.date === dateStr && !t.completed);

    // 2. Sort by Priority Score
    dailyTasks.sort((a, b) => calculatePriorityScore(b) - calculatePriorityScore(a));

    const generatedSlots = [];
    let currentTime = 9 * 60; // Start at 9:00 AM (in minutes)
    const endTime = 17 * 60; // End at 5:00 PM

    dailyTasks.forEach(task => {
      let remainingDuration = task.duration;
      
      while (remainingDuration > 0 && currentTime < endTime) {
        // Max block size = 90 mins to force breaks
        const blockSize = Math.min(remainingDuration, 90); 
        
        generatedSlots.push({
          id: `${task.id}-${currentTime}`,
          taskId: task.id,
          title: task.title,
          startTime: formatTime(currentTime),
          duration: blockSize,
          color: task.color,
          type: 'task'
        });

        currentTime += blockSize;
        remainingDuration -= blockSize;

        // Add a 15 min break if task is split or finished, and we have time left
        if (currentTime < endTime) {
          generatedSlots.push({
            id: `break-${currentTime}`,
            title: "Brain Break 🧠",
            startTime: formatTime(currentTime),
            duration: 15,
            color: "hsl(150, 40%, 90%)",
            type: 'break'
          });
          currentTime += 15;
        }
      }
    });

    return generatedSlots;
  };

  const formatTime = (minutes) => {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    const ampm = h >= 12 ? 'PM' : 'AM';
    const h12 = h % 12 || 12;
    return `${h12}:${m.toString().padStart(2, '0')} ${ampm}`;
  };

  const addTask = (newTask) => {
    setTasks([...tasks, { ...newTask, id: Date.now(), completed: false }]);
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const toggleComplete = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  return (
    <TaskContext.Provider value={{ 
      tasks, 
      addTask, 
      deleteTask, 
      toggleComplete, 
      generateSmartSchedule 
    }}>
      {children}
    </TaskContext.Provider>
  );
};
