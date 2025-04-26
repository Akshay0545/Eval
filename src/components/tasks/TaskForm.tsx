
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue,
} from '@/components/ui/select';
import { createTask, updateTask } from '@/utils/api';
import { useToast } from '@/components/ui/use-toast';
import { Task, TaskStatus } from '@/types';

interface TaskFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (task: Task) => void;
  projectId: string;
  editTask?: Task | null;
}

const TaskForm: React.FC<TaskFormProps> = ({ 
  isOpen, 
  onClose, 
  onSuccess, 
  projectId, 
  editTask 
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TaskStatus>('todo');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  // Set form values when editing a task
  useEffect(() => {
    if (editTask) {
      setTitle(editTask.title);
      setDescription(editTask.description);
      setStatus(editTask.status);
    } else {
      // Reset form for new task
      setTitle('');
      setDescription('');
      setStatus('todo');
    }
  }, [editTask, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Task title is required",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      let result: Task;
      
      if (editTask) {
        // Update existing task
        result = await updateTask(editTask.id, {
          title: title.trim(),
          description: description.trim(),
          status,
        });
        
        toast({
          title: "Task updated",
          description: "Your task has been updated successfully.",
        });
      } else {
        // Create new task
        result = await createTask(
          projectId,
          title.trim(),
          description.trim()
        );
        
        toast({
          title: "Task created",
          description: "Your new task has been created successfully.",
        });
      }
      
      onSuccess(result);
      onClose();
    } catch (error) {
      toast({
        variant: "destructive",
        title: `Failed to ${editTask ? 'update' : 'create'} task`,
        description: error instanceof Error ? error.message : "An unknown error occurred",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{editTask ? 'Edit Task' : 'Create New Task'}</DialogTitle>
            <DialogDescription>
              {editTask 
                ? 'Update the details of your existing task.' 
                : 'Add a new task to your project.'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Task Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Task title"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description (optional)</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your task..."
                rows={3}
              />
            </div>
            
            {editTask && (
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={status} onValueChange={(value) => setStatus(value as TaskStatus)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todo">To Do</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="review">In Review</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading 
                ? (editTask ? "Updating..." : "Creating...") 
                : (editTask ? "Update Task" : "Create Task")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TaskForm;
