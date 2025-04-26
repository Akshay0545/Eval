
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Sidebar as SidebarUI, 
  SidebarContent, 
  SidebarTrigger, 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarHeader,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, Plus, LayoutDashboard, FileText } from 'lucide-react';
import { Project } from '@/types';
import { cn } from '@/lib/utils';

interface SidebarProps {
  projects: Project[];
  onNewProject: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ projects, onNewProject }) => {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SidebarUI>
      <SidebarHeader className="border-b p-4 flex justify-between items-center">
        <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center">
          <span className="text-primary-foreground font-bold">PP</span>
        </div>
        <SidebarTrigger />
      </SidebarHeader>

      <SidebarContent>
        <ScrollArea className="h-[calc(100vh-64px)] p-2">
          <div className="p-2">
            <div className="relative mb-4">
              <Search
                size={16}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
              />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search projects..."
                className="w-full pl-9 pr-4 py-2 border border-border rounded-md bg-background focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link
                        to="/dashboard"
                        className={cn(
                          "flex items-center gap-3 px-3 py-2 rounded-md transition-all",
                          location.pathname === "/dashboard"
                            ? "bg-accent text-accent-foreground font-medium"
                            : "hover:bg-accent/50"
                        )}
                      >
                        <LayoutDashboard size={18} />
                        <span>Dashboard</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup className="mt-6">
              <div className="flex items-center justify-between mb-2">
                <SidebarGroupLabel>Projects ({projects.length}/4)</SidebarGroupLabel>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 w-8 p-0"
                  onClick={onNewProject}
                  disabled={projects.length >= 4}
                  title={projects.length >= 4 ? "Maximum of 4 projects reached" : "Add new project"}
                >
                  <Plus size={16} />
                </Button>
              </div>

              <SidebarGroupContent>
                <SidebarMenu>
                  {filteredProjects.length > 0 ? (
                    filteredProjects.map((project) => (
                      <SidebarMenuItem key={project.id}>
                        <SidebarMenuButton asChild>
                          <Link
                            to={`/projects/${project.id}`}
                            className={cn(
                              "flex items-center gap-3 px-3 py-2 rounded-md transition-all",
                              location.pathname === `/projects/${project.id}`
                                ? "bg-accent text-accent-foreground font-medium"
                                : "hover:bg-accent/50"
                            )}
                          >
                            <FileText size={18} />
                            <span className="truncate">{project.name}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))
                  ) : (
                    <div className="text-sm text-muted-foreground text-center py-2">
                      {searchQuery
                        ? "No projects match your search"
                        : "No projects created yet"}
                    </div>
                  )}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </div>
        </ScrollArea>
      </SidebarContent>
    </SidebarUI>
  );
};

export default Sidebar;
