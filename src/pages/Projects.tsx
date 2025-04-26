
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { SidebarProvider } from '@/components/ui/sidebar';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import TaskCard from '@/components/tasks/TaskCard';
import TaskForm from '@/components/tasks/TaskForm';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { User, Project, Task } from '@/types';
import { isAuthenticated, getCurrentUser } from '@/utils/auth';
import { getProjects, getProject } from '@/utils/api';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Plus } from 'lucide-react';

const Projects = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();

  // Check authentication
  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/');
      return;
    }

    const currentUser = getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    } else {
      navigate('/');
    }
  }, [navigate]);

  // Load projects
  useEffect(() => {
    if (user) {
      loadProjects();
    }
  }, [user]);

  // Load current project data
  useEffect(() => {
    if (projectId && projects.length > 0) {
      loadProjectDetails(projectId);
    }
  }, [projectId, projects]);

  const loadProjects = async () => {
    try {
      const data = await getProjects();
      setProjects(data);
      
      // If we have a projectId but no current project yet
      if (projectId && !currentProject) {
        loadProjectDetails(projectId);
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to load projects",
        description: error instanceof Error ? error.message : "An unknown error occurred",
      });
    }
  };

  const loadProjectDetails = async (id: string) => {
    setIsLoading(true);
    try {
      const data = await getProject(id);
      setCurrentProject(data);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to load project",
        description: error instanceof Error ? error.message : "An unknown error occurred",
      });
      navigate('/dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    setUser(null);
    navigate('/');
  };

  const handleCreateTask = (newTask: Task) => {
    if (currentProject) {
      setCurrentProject({
        ...currentProject,
        tasks: [...currentProject.tasks, newTask],
      });
    }
  };

  const handleUpdateTask = (updatedTask: Task) => {
    if (currentProject) {
      setCurrentProject({
        ...currentProject,
        tasks: currentProject.tasks.map(task => 
          task.id === updatedTask.id ? updatedTask : task
        ),
      });
    }
  };

  const handleDeleteTask = (taskId: string) => {
    if (currentProject) {
      setCurrentProject({
        ...currentProject,
        tasks: currentProject.tasks.filter(task => task.id !== taskId),
      });
    }
  };

  const openEditTaskModal = (task: Task) => {
    setEditTask(task);
    setIsTaskFormOpen(true);
  };

  const getFilteredTasks = () => {
    if (!currentProject) return [];
    
    let filteredTasks = currentProject.tasks;
    
    // Apply status filter
    if (filterStatus !== 'all') {
      filteredTasks = filteredTasks.filter(task => task.status === filterStatus);
    }
    
    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filteredTasks = filteredTasks.filter(task => 
        task.title.toLowerCase().includes(query) || 
        task.description.toLowerCase().includes(query)
      );
    }
    
    return filteredTasks;
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <Sidebar projects={projects} onNewProject={() => navigate('/dashboard')} />
        
        <div className="flex-1">
          <Navbar user={user} onLogout={handleLogout} />
          
          <main className="container mx-auto px-4 py-6">
            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
                <p className="mt-4 text-muted-foreground">Loading project...</p>
              </div>
            ) : currentProject ? (
              <>
                <div className="mb-8">
                  <h1 className="text-3xl font-bold mb-1">{currentProject.name}</h1>
                  <p className="text-muted-foreground">
                    {currentProject.description || "No description provided."}
                  </p>
                </div>
                
                <div className="mb-6 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
                  <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                    <div className="w-full sm:w-64">
                      <Input
                        placeholder="Search tasks..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full"
                      />
                    </div>
                    
                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                      <SelectTrigger className="w-full sm:w-40">
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Tasks</SelectItem>
                        <SelectItem value="todo">To Do</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="review">In Review</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Button
                    onClick={() => {
                      setEditTask(null);
                      setIsTaskFormOpen(true);
                    }}
                    className="shrink-0"
                  >
                    <Plus size={16} className="mr-1" /> Add Task
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {getFilteredTasks().length > 0 ? (
                    getFilteredTasks().map(task => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        onEdit={openEditTaskModal}
                        onUpdate={handleUpdateTask}
                        onDelete={handleDeleteTask}
                      />
                    ))
                  ) : (
                    <div className="col-span-full text-center py-12 bg-muted rounded-lg">
                      <h3 className="text-xl font-medium mb-2">No tasks found</h3>
                      <p className="text-muted-foreground mb-6">
                        {searchQuery || filterStatus !== 'all' 
                          ? "Try changing your search or filter criteria." 
                          : "Create your first task to start tracking progress."}
                      </p>
                      <Button onClick={() => {
                        setEditTask(null);
                        setIsTaskFormOpen(true);
                      }}>
                        <Plus size={16} className="mr-2" /> Create Task
                      </Button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-xl font-medium mb-2">Project not found</h3>
                <p className="text-muted-foreground mb-6">
                  The project you're looking for doesn't exist or you don't have access to it.
                </p>
                <Button onClick={() => navigate('/dashboard')}>
                  Return to Dashboard
                </Button>
              </div>
            )}
          </main>
        </div>
      </div>
      
      {currentProject && (
        <TaskForm
          isOpen={isTaskFormOpen}
          onClose={() => {
            setIsTaskFormOpen(false);
            setEditTask(null);
          }}
          onSuccess={(task) => {
            if (editTask) {
              handleUpdateTask(task);
            } else {
              handleCreateTask(task);
            }
          }}
          projectId={currentProject.id}
          editTask={editTask}
        />
      )}
    </SidebarProvider>
  );
};

export default Projects;
