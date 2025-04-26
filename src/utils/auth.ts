
import { User } from '@/types';

// In a production environment, these would be handled by a backend
const AUTH_TOKEN_KEY = 'progress_pilot_token';
const USER_KEY = 'progress_pilot_user';

// Mock users for frontend-only demo
let mockUsers: any[] = [
  {
    id: '1',
    email: 'demo@example.com',
    name: 'Demo User',
    country: 'USA',
    password: 'password123', // In real app, this would be hashed
  }
];

// Simulate token creation (in real app, this would be done by backend)
const generateToken = (userId: string): string => {
  return `mock-jwt-token-${userId}-${Date.now()}`;
};

// Login function
export const login = async (email: string, password: string): Promise<{ user: User, token: string } | null> => {
  // Simulate API request delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const user = mockUsers.find(u => u.email === email && u.password === password);
  
  if (!user) {
    throw new Error('Invalid credentials');
  }
  
  // Create token
  const token = generateToken(user.id);
  
  // Save auth state to localStorage
  const userData = { ...user };
  delete userData.password;
  
  localStorage.setItem(AUTH_TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(userData));
  
  return { user: userData, token };
};

// Signup function
export const signup = async (email: string, password: string, name: string, country: string): Promise<{ user: User, token: string }> => {
  // Simulate API request delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Check if user already exists
  const existingUser = mockUsers.find(u => u.email === email);
  if (existingUser) {
    throw new Error('User already exists');
  }
  
  // Create new user
  const newUser = {
    id: `user-${Date.now()}`,
    email,
    name,
    country,
    password, // In real app, this would be hashed
  };
  
  mockUsers.push(newUser);
  
  // Create token
  const token = generateToken(newUser.id);
  
  // Save auth state to localStorage
  const userData = { ...newUser };
  delete userData.password;
  
  localStorage.setItem(AUTH_TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(userData));
  
  return { user: userData, token };
};

// Logout function
export const logout = (): void => {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem(AUTH_TOKEN_KEY);
};

// Get current user
export const getCurrentUser = (): User | null => {
  const userStr = localStorage.getItem(USER_KEY);
  return userStr ? JSON.parse(userStr) : null;
};

// Get auth token
export const getAuthToken = (): string | null => {
  return localStorage.getItem(AUTH_TOKEN_KEY);
};
