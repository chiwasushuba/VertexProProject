'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuthContext } from '@/hooks/useAuthContext';

interface RouteGuardProps {
  children: React.ReactNode;
  adminOnly?: boolean;    // only admins can access
  guestOnly?: boolean;    // only guests (not logged in) can access
}

export default function RouteGuard({ children, adminOnly = false, guestOnly = false }: RouteGuardProps) {
  const { userInfo } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    // Admin-only route
    if (adminOnly && (!userInfo || userInfo.role !== 'superAdmin')) {
      router.replace('/unauthorized'); // or /login if not logged in
    }

    // Guest-only route (login/signup)
    if (guestOnly && userInfo) {
      router.replace('/'); // redirect logged-in users to home or dashboard
    }

    // Regular auth route (must be logged in)
    if (!adminOnly && !guestOnly && !userInfo) {
      router.replace('/login');
    }
  }, [userInfo, router, adminOnly, guestOnly]);

  // Prevent rendering until routing check is done
  if ((adminOnly && (!userInfo || userInfo.role !== 'superAdmin')) ||
      (guestOnly && userInfo) ||
      (!adminOnly && !guestOnly && !userInfo)) {
    return null;
  }

  return <>{children}</>;
}
