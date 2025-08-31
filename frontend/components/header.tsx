'use client'

import { useRouter } from "next/navigation"
import type React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { MountainIcon } from "lucide-react"
import { useLogout } from "@/hooks/useLogout"
import { useAuthContext } from "@/hooks/useAuthContext"
import { Label } from "@radix-ui/react-label"

type HeaderVariant = "default" | "signedUser" | "noSignedUser" | "menu"

interface HeaderProps {
  variant?: HeaderVariant
  location?: string
}

const Header: React.FC<HeaderProps> = ({ variant = "default", location }) => {
  const { userInfo } = useAuthContext()
  const { logout } = useLogout()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push("/login") // redirect to login after logout
  }

  let actionSection

  if (variant === "signedUser") {
    actionSection = (
      <Button
        variant="link"
        className="mr-4 text-primary-foreground"
        onClick={handleLogout}
      >
        Logout
      </Button>
    )
  } else if (variant === "noSignedUser") {
    actionSection = (
      <Button
        className="mr-4 bg-secondary text-primary-foreground hover:bg-secondary/90"
        onClick={() => router.push("/login")} // navigate to login
      >
        Login
      </Button>
    )
  } else {
    actionSection = <></>
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-gray-800 mb-4">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <Link
          href="/"
          className="flex items-center gap-2 font-semibold text-primary-foreground"
        >
          <MountainIcon className="h-6 w-6 text-primary-foreground" />
          <span className="sr-only">VertexPro Inc</span>
          <span>VERTEXPRO</span>
        </Link>
        {location && (
          <div className="flex items-center justify-center text-sm font-medium text-primary-foreground">
            <span>{location}</span>
          </div>
        )}

        {(userInfo?.user.role === 'admin' || userInfo?.user.role === 'superAdmin') ?
          (<div className="flex items-center space-x-4">
          <Link href={"/admin"} className="flex items-center gap-2 font-semibold text-primary-foreground">
            Dashboard
          </Link>
          <Label className="flex items-center gap-2 font-semibold text-primary-foreground"> | </Label>
          <Link href={"/letter"} className="flex items-center gap-2 font-semibold text-primary-foreground">
            Letter
          </Link>
          {actionSection}
          </div>) : (
            <>
              {actionSection}
            </>
          )
        }
        

      </div>
    </header>
  )
}

export default Header
