import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, CheckSquare, Calendar, Settings, Bell, Search, User } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

const SidebarItem = ({ icon: Icon, label, path, isActive }) => (
  <Link to={path}>
    <div className={cn(
      "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
      isActive 
        ? "bg-primary/10 text-primary font-medium" 
        : "text-muted-foreground hover:bg-muted hover:text-foreground"
    )}>
      <Icon className={cn("w-5 h-5", isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
      <span>{label}</span>
    </div>
  </Link>
);

const Layout = ({ children }) => {
  const location = useLocation();

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-card/50 hidden md:flex flex-col p-6">
        <div className="flex items-center gap-2 mb-10 px-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white font-bold">
            F
          </div>
          <span className="text-xl font-display font-bold tracking-tight">FocusFlow</span>
        </div>

        <nav className="space-y-2 flex-1">
          <SidebarItem 
            icon={LayoutDashboard} 
            label="Dashboard" 
            path="/dashboard" 
            isActive={location.pathname === '/dashboard'} 
          />
          <SidebarItem 
            icon={CheckSquare} 
            label="My Tasks" 
            path="/tasks" 
            isActive={location.pathname === '/tasks'} 
          />
          <SidebarItem 
            icon={Calendar} 
            label="Schedule" 
            path="/schedule" 
            isActive={location.pathname === '/schedule'} 
          />
        </nav>

        <div className="mt-auto pt-6 border-t border-border">
          <SidebarItem 
            icon={Settings} 
            label="Settings" 
            path="/settings" 
            isActive={location.pathname === '/settings'} 
          />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {/* Header */}
        <header className="h-16 border-b border-border bg-background/80 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-10">
          <div className="md:hidden">
            {/* Mobile Menu Trigger would go here */}
            <span className="font-bold text-primary">FocusFlow</span>
          </div>
          
          <div className="hidden md:flex items-center gap-4 flex-1 max-w-md">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Search tasks, projects..." 
                className="pl-10 bg-muted/50 border-transparent focus:bg-background transition-all rounded-full"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="rounded-full relative">
              <Bell className="w-5 h-5 text-muted-foreground" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-accent rounded-full border-2 border-background"></span>
            </Button>
            <Avatar className="h-9 w-9 border border-border cursor-pointer">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Layout;
