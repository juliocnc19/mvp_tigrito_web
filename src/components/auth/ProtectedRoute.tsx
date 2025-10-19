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
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      // Check if user is authenticated
      if (!user) {
        router.push(fallbackPath);
        return;
      }

      // Check if user has required role
      if (requiredRole && user.role !== requiredRole) {
        // Redirect based on user role
        if (user.role === 'ADMIN') {
          router.push('/admin');
        } else if (user.role === 'CLIENT') {
          router.push('/dashboard');
        } else if (user.role === 'PROFESSIONAL') {
          router.push('/dashboard');
        } else {
          router.push(fallbackPath);
        }
        return;
      }
    }
  }, [user, requiredRole, isLoading, router, fallbackPath]);

  // Show loading while checking authentication
  if (isLoading) {
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
