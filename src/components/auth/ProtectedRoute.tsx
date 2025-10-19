'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'CLIENT' | 'PROFESSIONAL' | 'ADMIN';
  fallbackPath?: string;
}

export function ProtectedRoute({ 
  children, 
  requiredRole, 
  fallbackPath = '/login' 
}: ProtectedRouteProps) {
  const { user, isLoading, isInitialized } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isInitialized && !isLoading) {
      // Check if user is authenticated
      if (!user) {
        router.push(fallbackPath);
        return;
      }

      // Check if user has required role
      if (requiredRole && user.role !== requiredRole) {
        // Simple redirect to login for wrong role
        router.push('/login');
        return;
      }
    }
  }, [user, requiredRole, isLoading, isInitialized, router, fallbackPath]);

  // Show loading while initializing auth
  if (isLoading || !isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Don't render children if not authenticated or wrong role
  if (!user || (requiredRole && user.role !== requiredRole)) {
    return null;
  }

  return <>{children}</>;
}
