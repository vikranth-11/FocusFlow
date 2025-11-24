import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const TaskContext = createContext();

// Backend URL - Ensure your Python server is running
const API_URL = 'http://localhost:8000/api';

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
};

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [weeklySchedule, setWeeklySchedule] = useState({});
  const [loading, setLoading] = useState(false);

  // Helper: Assign colors based on priority
  const enhanceTaskWithUI = (task) => {
    let color = 'hsl(240 5% 65%)'; // Default Low
    if (task.priority === 'High') color = 'hsl(10 80% 65%)';
    if (task.priority === 'Medium') color = 'hsl(180 60% 50%)';
    
    return { 
      ...task, 
      color, 
      date: task.deadline 
    };
  };

  // 1. Fetch Tasks from Backend
  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/tasks`);
      const data = Array.isArray(res.data) ? res.data : [];
      const enhancedTasks = data.map(enhanceTaskWithUI);
      setTasks(enhancedTasks);
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  // 2. Add Task
  const addTask = async (newTaskData) => {
    try {
      const payload = {
        title: newTaskData.title,
        priority: newTaskData.priority,
        duration: parseInt(newTaskData.duration) || 60,
        deadline: newTaskData.deadline,
        tags: [newTaskData.tag] 
      };

      await axios.post(`${API_URL}/tasks`, payload);
      // Refresh data to get the updated schedule
      await fetchTasks();
      await fetchSchedule(); 
    } catch (error) {
      console.error("Failed to add task:", error);
      throw error;
    }
  };

  // --- THE MAGIC DEMO FUNCTION ---
  const loadDemoData = async () => {
    setLoading(true);
    try {
      // 1. CLEAR OLD DATA FIRST (Prevents duplicates)
      await axios.post(`${API_URL}/db/reset`);
      
      // Clear local state immediately to show UI feedback
      setTasks([]);
      setWeeklySchedule({});

      // 2. Add Huge Task (to show intelligent chunking)
      await axios.post(`${API_URL}/tasks`, {
        title: "Study for Final Exams",
        priority: "High",
        duration: 600, // 10 Hours
        deadline: new Date(Date.now() + 86400000 * 10).toISOString().split('T')[0], // 10 days out
        tags: ["Study"]
      });

      // 3. Add Urgent Task (to show prioritization)
      await axios.post(`${API_URL}/tasks`, {
        title: "Submit Project Proposal",
        priority: "High",
        duration: 60,
        deadline: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Tomorrow
        tags: ["Work"]
      });

      // 4. Medium Filler Task
      await axios.post(`${API_URL}/tasks`, {
        title: "Weekly Team Sync",
        priority: "Medium",
        duration: 45,
        deadline: new Date().toISOString().split('T')[0], // Today
        tags: ["Meeting"]
      });

      // Refresh everything
      await fetchTasks();
      await fetchSchedule();
    } catch (e) {
      console.error("Demo load failed", e);
    } finally {
      setLoading(false);
    }
  };

  // 3. Fetch Optimized Schedule
  const fetchSchedule = async () => {
    try {
      const res = await axios.get(`${API_URL}/schedule`);
      setWeeklySchedule(res.data.schedule || {});
    } catch (error) {
      console.error("Failed to fetch schedule:", error);
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`${API_URL}/tasks/${id}`);
      setTasks(prev => prev.filter(t => t.id !== id));
      await fetchSchedule();
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  };

  const toggleComplete = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  useEffect(() => {
    fetchTasks();
    fetchSchedule();
  }, []);

  return (
    <TaskContext.Provider value={{ 
      tasks, 
      weeklySchedule,
      loading,
      addTask, 
      loadDemoData,
      deleteTask, 
      toggleComplete, 
      fetchTasks,
      fetchSchedule
    }}>
      {children}
    </TaskContext.Provider>
  );
};

export default TaskProvider;