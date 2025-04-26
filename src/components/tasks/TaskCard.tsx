
import React, { useState } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Task, TaskStatus } from '@/types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/components/ui/use-toast';
import { updateTask, deleteTask } from '@/utils/api';
import { Edit, Trash, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onUpdate: (updatedTask: Task) => void;
  onDelete: (id: string) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit, onUpdate, onDelete }) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();

  const statusLabels: Record<TaskStatus, string> = {
    'todo': 'To Do',
    'in-progress': 'In Progress',
    'review': 'In Review',
    'completed': 'Completed',
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleStatusChange = async (newStatus: TaskStatus) => {
    if (newStatus === task.status) return;
    
    setIsUpdating(true);
    try {
      const updatedTask = await updateTask(task.id, { status: newStatus });
      onUpdate(updatedTask);
      
      toast({
        title: "Task updated",
        description: `Task status changed to ${statusLabels[newStatus]}`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to update task",
        description: error instanceof Error ? error.message : "An unknown error occurred",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteTask = async () => {
    try {
      await deleteTask(task.id);
      onDelete(task.id);
      
      toast({
        title: "Task deleted",
        description: "The task has been deleted successfully.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to delete task",
        description: error instanceof Error ? error.message : "An unknown error occurred",
      });
    }
  };

  return (
    <Card className={cn(
      "task-todo border transition-all",
      `task-${task.status}`
    )}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-medium truncate">{task.title}</h3>
          <span className="text-xs px-2 py-1 rounded-full bg-white bg-opacity-70">
            {statusLabels[task.status]}
          </span>
        </div>

        <p className="text-sm line-clamp-3 mb-3 text-gray-600">
          {task.description || "No description provided."}
        </p>
        
        <div className="text-xs text-gray-500 flex flex-wrap gap-x-4 gap-y-1">
          <div>Created: {formatDate(task.createdAt)}</div>
          {task.completedAt && (
            <div>Completed: {formatDate(task.completedAt)}</div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="px-4 py-3 border-t flex justify-between">
        <DropdownMenu>
          <DropdownMenuTrigger asChild disabled={isUpdating}>
            <Button variant="ghost" size="sm">
              {isUpdating ? "Updating..." : "Change Status"}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {Object.entries(statusLabels).map(([status, label]) => (
              <DropdownMenuItem
                key={status}
                disabled={task.status === status as TaskStatus}
                onClick={() => handleStatusChange(status as TaskStatus)}
                className="cursor-pointer"
              >
                {label}
                {task.status === status as TaskStatus && <Check className="ml-2 h-4 w-4" />}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        
        <div className="flex gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8"
            onClick={() => onEdit(task)}
          >
            <Edit size={16} />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 text-destructive"
            onClick={handleDeleteTask}
          >
            <Trash size={16} />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default TaskCard;
