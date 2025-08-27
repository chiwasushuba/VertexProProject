"use client"

import { useAuthContext } from "@/hooks/useAuthContext"
import { useRouter } from "next/navigation"
import { useEffect, ReactNode } from "react"

interface RouteGuardProps {
  children: ReactNode
  allowedRoles?: string[]   // make optional
}

export const RouteGuard: React.FC<RouteGuardProps> = ({ children, allowedRoles }) => {
  const { userInfo, authIsReady } = useAuthContext()
  const router = useRouter()

  useEffect(() => {
    if (!authIsReady) return

    // If not logged in → go to login
    if (!userInfo) {
      router.push("/login")
      return
    }

    // If allowedRoles are specified, enforce role-based access
    if (allowedRoles && !allowedRoles.includes(userInfo.role)) {
      router.push("/unauthorized")
    }
  }, [userInfo, authIsReady, router, allowedRoles])

  return <>{children}</>
}
