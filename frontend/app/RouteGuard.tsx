// app/RouteGuard.tsx
"use client"

import { useAuthContext } from "@/hooks/useAuthContext"
import { useRouter } from "next/navigation"
import { useEffect, useState, ReactNode } from "react"

interface RouteGuardProps {
  children: ReactNode
  allowedRoles: string[]
}

export const RouteGuard: React.FC<RouteGuardProps> = ({ children, allowedRoles }) => {
  const { user, token } = useAuthContext()
  const router = useRouter()
  const [isAuthorized, setIsAuthorized] = useState(false)

  useEffect(() => {
    if (!user || !token) {
      router.push("/login")
    } else if (!allowedRoles.includes(user.role)) {
      router.push("/unauthorized")
    } else {
      setIsAuthorized(true)
    }
  }, [user, token, router, allowedRoles])

  if (!isAuthorized) return null

  return <>{children}</>
}
