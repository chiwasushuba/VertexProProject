'use client'

import { useRouter } from "next/navigation"
import React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useLogout } from "@/hooks/useLogout"
import { useAuthContext } from "@/hooks/useAuthContext"

type HeaderVariant = "default" | "signedUser" | "noSignedUser" | "menu"

interface HeaderProps {
  variant?: HeaderVariant
  location?: string
}

const Header: React.FC<HeaderProps> = ({ variant = "default", location }) => {
  const { userInfo } = useAuthContext()
  const { logout } = useLogout()
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await logout?.()
    } catch (err) {
      console.error("Logout failed:", err)
    } finally {
      router.push("/login")
    }
  }

  let actionSection = <></>

  if (variant === "signedUser") {
    actionSection = (
      <Button
        variant="link"
        className="mr-4 text-primary-foreground"
        onClick={handleLogout}
        aria-label="Logout"
      >
        Logout
      </Button>
    )
  } else if (variant === "noSignedUser") {
    actionSection = (
      <Button
        className="mr-4 bg-secondary text-primary-foreground hover:bg-secondary/90"
        onClick={() => router.push("/login")}
      >
        Login
      </Button>
    )
  }

  const isAdmin = !!(
    userInfo?.user?.role &&
    (userInfo.user.role === "admin" || userInfo.user.role === "superAdmin")
  )

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-gray-800 mb-4">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-2 font-semibold text-primary-foreground">
          {location === "Watch Page" ? (
            <div className="flex items-center gap-2">
              <img
                src="/vertexproLogo.png"
                alt="VertexPro Logo"
                width={200}
                height={200}
              />
            </div>
          ) : (
            <Link href="/" className="flex items-center gap-2">
              <img
                src="/vertexproLogo.png"
                alt="VertexPro Logo"
                width={200}
                height={200}
              />
            </Link>
          )}
        </div>

        {location && (
          <div className="flex items-center justify-center text-sm font-medium text-primary-foreground">
            <span>{location}</span>
          </div>
        )}

        {/* Align action section vertically centered */}
        <div className="flex items-center space-x-4">
          {isAdmin && (
            <>
              <Link
                href={"/admin"}
                className="flex items-center gap-2 font-semibold text-primary-foreground"
              >
                Dashboard
              </Link>
              <span className="text-primary-foreground">|</span>
              <Link
                href={"/letter"}
                className="flex items-center gap-2 font-semibold text-primary-foreground"
              >
                Letter
              </Link>
            </>
          )}

          {actionSection}
        </div>
      </div>
    </header>
  )
}

export default Header
