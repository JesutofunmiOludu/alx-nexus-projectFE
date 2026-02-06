// Protected Route Component - Requires authentication

import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAppSelector } from '@/store';
import { Loading } from '@/components/ui/Spinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
}

export function ProtectedRoute({
  children,
  requireAuth = true,
  redirectTo = '/login',
}: ProtectedRouteProps) {
  const router = useRouter();
  const dispatch = useAppSelector(state => state.auth); // Access the whole state for debugging if needed
  const { isAuthenticated, isLoading, user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    // Debug log
    console.log('🛡️ ProtectedRoute State:', { isAuthenticated, isLoading, path: router.asPath });

    if (!isLoading && requireAuth && !isAuthenticated) {
      console.log('🚫 Not authenticated, redirecting to:', redirectTo);
      const returnUrl = router.asPath;
      router.push(`${redirectTo}?returnUrl=${encodeURIComponent(returnUrl)}`);
    }
  }, [isAuthenticated, isLoading, requireAuth, router, redirectTo]);

  // Show loading while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4">
        <Loading text="Checking authentication..." />
        <button 
          onClick={() => window.location.href = '/login'}
          className="mt-8 text-blue-400 hover:text-blue-300 text-sm font-medium"
        >
          Taking too long? Go to login
        </button>
      </div>
    );
  }

  // If we are authenticated but have no user object yet, we might still be fetching in the layout
  // But we let the layout handle the 'U' initial for now to avoid blocking the whole page.

  // Don't render if not authenticated and auth is required
  if (requireAuth && !isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
