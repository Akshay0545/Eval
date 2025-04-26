
import { Project, Task, User } from '@/types';
import { getCurrentUser } from './auth';

// Mock data store
let mockProjects: Project[] = [];
let mockTasks: Task[] = [];

// Projects API
export const getProjects = async (): Promise<Project[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  const currentUser = getCurrentUser();
  
  if (!currentUser) {
    throw new Error('User not authenticated');
  }
  
  return mockProjects.filter(project => project.userId === currentUser.id);
};

export const getProject = async (id: string): Promise<Project> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  const project = mockProjects.find(p => p.id === id);
  
  if (!project) {
    throw new Error('Project not found');
  }
  
  const projectTasks = mockTasks.filter(task => task.projectId === id);
  return { ...project, tasks: projectTasks };
};

export const createProject = async (name: string, description: string): Promise<Project> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  const currentUser = getCurrentUser();
  
  if (!currentUser) {
    throw new Error('User not authenticated');
  }
  
  // Check if user has reached the limit of 4 projects
  const userProjects = mockProjects.filter(p => p.userId === currentUser.id);
  if (userProjects.length >= 4) {
    throw new Error('You can only have up to 4 projects');
  }
  
  const newProject: Project = {
    id: `project-${Date.now()}`,
    userId: currentUser.id,
    name,
    description,
    createdAt: new Date().toISOString(),
    tasks: [],
  };
  
  mockProjects.push(newProject);
  return newProject;
};

export const updateProject = async (id: string, updates: Partial<Project>): Promise<Project> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  const index = mockProjects.findIndex(p => p.id === id);
  
  if (index === -1) {
    throw new Error('Project not found');
  }
  
  mockProjects[index] = { ...mockProjects[index], ...updates };
  return mockProjects[index];
};

export const deleteProject = async (id: string): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  const index = mockProjects.findIndex(p => p.id === id);
  
  if (index === -1) {
    throw new Error('Project not found');
  }
  
  mockProjects.splice(index, 1);
  
  // Also delete all tasks associated with this project
  mockTasks = mockTasks.filter(task => task.projectId !== id);
};

// Tasks API
export const getTasks = async (projectId: string): Promise<Task[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return mockTasks.filter(task => task.projectId === projectId);
};

export const getTask = async (id: string): Promise<Task> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  const task = mockTasks.find(t => t.id === id);
  
  if (!task) {
    throw new Error('Task not found');
  }
  
  return task;
};

export const createTask = async (projectId: string, title: string, description: string): Promise<Task> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  const project = mockProjects.find(p => p.id === projectId);
  
  if (!project) {
    throw new Error('Project not found');
  }
  
  const newTask: Task = {
    id: `task-${Date.now()}`,
    projectId,
    title,
    description,
    status: 'todo',
    createdAt: new Date().toISOString(),
    completedAt: null,
  };
  
  mockTasks.push(newTask);
  return newTask;
};

export const updateTask = async (id: string, updates: Partial<Task>): Promise<Task> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  const index = mockTasks.findIndex(t => t.id === id);
  
  if (index === -1) {
    throw new Error('Task not found');
  }
  
  // If status is being updated to 'completed', set completedAt
  if (updates.status === 'completed' && mockTasks[index].status !== 'completed') {
    updates.completedAt = new Date().toISOString();
  }
  
  // If status is being changed from 'completed', remove completedAt
  if (mockTasks[index].status === 'completed' && updates.status && updates.status !== 'completed') {
    updates.completedAt = null;
  }
  
  mockTasks[index] = { ...mockTasks[index], ...updates };
  return mockTasks[index];
};

export const deleteTask = async (id: string): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  const index = mockTasks.findIndex(t => t.id === id);
  
  if (index === -1) {
    throw new Error('Task not found');
  }
  
  mockTasks.splice(index, 1);
};
