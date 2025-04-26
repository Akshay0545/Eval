
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { SidebarProvider } from '@/components/ui/sidebar';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import ProjectCard from '@/components/projects/ProjectCard';
import ProjectForm from '@/components/projects/ProjectForm';
import { useToast } from '@/components/ui/use-toast';
import { User, Project } from '@/types';
import { isAuthenticated, getCurrentUser } from '@/utils/auth';
import { getProjects, deleteProject } from '@/utils/api';
import { Plus } from 'lucide-react';

const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProjectFormOpen, setIsProjectFormOpen] = useState(false);
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

  const loadProjects = async () => {
    setIsLoading(true);
    try {
      const data = await getProjects();
      setProjects(data);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to load projects",
        description: error instanceof Error ? error.message : "An unknown error occurred",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    setUser(null);
    navigate('/');
  };

  const handleCreateProject = (newProject: Project) => {
    setProjects(prev => [...prev, newProject]);
  };

  const handleDeleteProject = async (id: string) => {
    try {
      await deleteProject(id);
      setProjects(prev => prev.filter(project => project.id !== id));
      toast({
        title: "Project deleted",
        description: "The project has been deleted successfully.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to delete project",
        description: error instanceof Error ? error.message : "An unknown error occurred",
      });
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <Sidebar projects={projects} onNewProject={() => setIsProjectFormOpen(true)} />
        
        <div className="flex-1">
          <Navbar user={user} onLogout={handleLogout} />
          
          <main className="container mx-auto px-4 py-6">
            <div className="mb-8 flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold">Dashboard</h1>
                <p className="text-muted-foreground">Manage your projects and track progress</p>
              </div>
              
              <Button 
                onClick={() => setIsProjectFormOpen(true)} 
                disabled={projects.length >= 4}
                className="flex items-center gap-1"
              >
                <Plus size={16} /> New Project
              </Button>
            </div>
            
            <div className="mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-lg shadow flex items-center justify-between">
                  <div>
                    <h3 className="text-muted-foreground text-sm">Total Projects</h3>
                    <p className="text-3xl font-bold">{projects.length}</p>
                  </div>
                  <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                      <span className="text-primary-foreground font-bold">{projects.length}</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white p-4 rounded-lg shadow flex items-center justify-between">
                  <div>
                    <h3 className="text-muted-foreground text-sm">Remaining</h3>
                    <p className="text-3xl font-bold">{4 - projects.length}</p>
                  </div>
                  <div className="w-12 h-12 bg-secondary/20 rounded-full flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                      <span className="text-secondary-foreground font-bold">{4 - projects.length}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h2 className="text-xl font-semibold mb-4">Your Projects</h2>
              
              {isLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
                  <p className="mt-4 text-muted-foreground">Loading projects...</p>
                </div>
              ) : projects.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {projects.map((project) => (
                    <ProjectCard
                      key={project.id}
                      project={project}
                      onDelete={handleDeleteProject}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-muted rounded-lg">
                  <h3 className="text-xl font-medium mb-2">No projects yet</h3>
                  <p className="text-muted-foreground mb-6">
                    Create your first project to get started tracking your progress.
                  </p>
                  <Button onClick={() => setIsProjectFormOpen(true)}>
                    <Plus size={16} className="mr-2" /> Create Project
                  </Button>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
      
      <ProjectForm
        isOpen={isProjectFormOpen}
        onClose={() => setIsProjectFormOpen(false)}
        onSuccess={handleCreateProject}
      />
    </SidebarProvider>
  );
};

export default Dashboard;
