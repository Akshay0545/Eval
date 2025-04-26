
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import AuthForm from '@/components/auth/AuthForm';
import { User } from '@/types';
import { isAuthenticated, getCurrentUser } from '@/utils/auth';

const Index = () => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();
  
  // Check if user is already authenticated
  useEffect(() => {
    if (isAuthenticated()) {
      const currentUser = getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
        navigate('/dashboard');
      }
    }
  }, [navigate]);

  const handleAuthSuccess = (user: User, token: string) => {
    setUser(user);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary/10 to-primary/20">
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8 items-center min-h-[calc(100vh-4rem)]">
          <div className="flex flex-col justify-center order-2 lg:order-1">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              Track Your Projects with <span className="text-primary">Progress Pilot</span>
            </h1>
            
            <p className="text-lg text-gray-600 mb-8">
              Efficiently manage your projects and tasks in one place. Stay on top of your progress and achieve your goals.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Button size="lg" className="shadow-md">Get Started</Button>
              <Button size="lg" variant="outline">Learn More</Button>
            </div>
            
            <div className="mt-12">
              <h3 className="font-medium mb-4">Features:</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-lg shadow">
                  <h4 className="font-medium mb-2">Multiple Projects</h4>
                  <p className="text-sm text-gray-600">Manage up to 4 projects with detailed tracking.</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                  <h4 className="font-medium mb-2">Task Management</h4>
                  <p className="text-sm text-gray-600">Create, update, and track tasks with status indicators.</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                  <h4 className="font-medium mb-2">Progress Tracking</h4>
                  <p className="text-sm text-gray-600">Visual progress indicators for each project.</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                  <h4 className="font-medium mb-2">User Profiles</h4>
                  <p className="text-sm text-gray-600">Personalized experience with user accounts.</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="order-1 lg:order-2">
            <div className="max-w-md mx-auto">
              <AuthForm onAuthSuccess={handleAuthSuccess} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
