
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Project } from '@/types';

interface ProjectCardProps {
  project: Project;
  onDelete: (id: string) => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onDelete }) => {
  const taskCounts = {
    total: project.tasks.length,
    completed: project.tasks.filter((task) => task.status === 'completed').length,
  };

  const progress = taskCounts.total > 0 
    ? Math.round((taskCounts.completed / taskCounts.total) * 100) 
    : 0;

  const formattedDate = new Date(project.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <Card className="h-full flex flex-col animate-slide-up">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span className="truncate">{project.name}</span>
        </CardTitle>
        <p className="text-sm text-muted-foreground">Created on {formattedDate}</p>
      </CardHeader>
      
      <CardContent className="flex-1">
        <p className="line-clamp-3 text-sm text-gray-600 mb-4">
          {project.description || "No description provided."}
        </p>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress</span>
            <span>{progress}%</span>
          </div>
          
          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary" 
              style={{ width: `${progress}%` }}
            />
          </div>
          
          <p className="text-sm text-muted-foreground">
            {taskCounts.completed} of {taskCounts.total} tasks completed
          </p>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between gap-2 pt-2 border-t">
        <Button 
          variant="outline" 
          size="sm" 
          className="flex-1"
          onClick={() => onDelete(project.id)}
        >
          Delete
        </Button>
        <Button 
          size="sm" 
          className="flex-1" 
          asChild
        >
          <Link to={`/projects/${project.id}`}>View Project</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProjectCard;
