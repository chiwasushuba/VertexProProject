import type React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { MountainIcon } from "lucide-react"

type HeaderVariant = "default" | "signedUser" | "noSignedUser" | "menu"

interface HeaderProps {
  variant?: HeaderVariant
  location?: string
}

const Header: React.FC<HeaderProps> = ({ variant = "default", location }) => {
  let actionSection

  if (variant === "signedUser") {
    actionSection = (
      <Button variant="link" className="mr-4 text-primary-foreground">
        Logout
      </Button>
    )
  } else if (variant === "noSignedUser") {
    actionSection = <Button className="mr-4 bg-secondary text-primary-foreground hover:bg-secondary/90">Login</Button>
  } else {
    actionSection = <></>
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-gray-800 mb-4">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold text-primary-foreground">
          <MountainIcon className="h-6 w-6 text-primary-foreground" />
          <span className="sr-only">Acme Inc</span>
          <span>VERTEXPRO</span>
        </Link>
        {location && (
          <div className="flex items-center justify-center text-sm font-medium text-primary-foreground">
            <span>{location}</span>
          </div>
        )}
        {actionSection}
      </div>
    </header>
  )
}

export default Header
