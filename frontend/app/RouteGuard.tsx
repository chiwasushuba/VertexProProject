"use client";

import { useAuthContext } from "@/hooks/useAuthContext";
import { useRouter } from "next/navigation";
import { useEffect, ReactNode } from "react";

interface RouteGuardProps {
  children: ReactNode;
  allowedRoles?: string[]; // Optional: if undefined, any verified user can access
}

export const RouteGuard: React.FC<RouteGuardProps> = ({ children, allowedRoles }) => {
  const { userInfo, authIsReady } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    if (!authIsReady) return; // Wait until auth status is ready

    // Not logged in → go to login
    if (!userInfo) {
      router.push("/login");
      return;
    }

    // Not verified → go to unauthorized
    if (!userInfo.user.verified) {
      router.push("/unauthorized");
      return;
    }

    // Role-based access check (only if allowedRoles is provided)
    if (allowedRoles && !allowedRoles.includes(userInfo.user.role)) {
      router.push("/unauthorized");
      return;
    }

    // Otherwise, access is allowed
  }, [userInfo, authIsReady, router, allowedRoles]);

  return <>{children}</>;
};
