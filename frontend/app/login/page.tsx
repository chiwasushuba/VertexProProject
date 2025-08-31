"use client"

import Header from "@/components/header"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { useState, useEffect } from "react"
import { Eye, EyeOff } from "lucide-react"
import { useRouter } from "next/navigation"
import { useLogin } from '@/hooks/useLogin'
import NavigationDialog from "@/components/navigationDialog"

const LoginPage = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [localError, setLocalError] = useState<string | null>(null)

  // Backend readiness states
  const [backendReady, setBackendReady] = useState(false)
  const [checkingBackend, setCheckingBackend] = useState(true)

  const { login } = useLogin()
  const router = useRouter()

  // Check if backend is ready
  useEffect(() => {
    const checkBackend = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}`) // change to your health/ready endpoint
        if (res.ok) {
          setBackendReady(true)
        } else {
          setBackendReady(false)
        }
      } catch (err) {
        setBackendReady(false)
      } finally {
        setCheckingBackend(false)
      }
    }

    checkBackend()

    // Optionally, retry every 5s until backend is ready
    const interval = setInterval(checkBackend, 5000)
    return () => clearInterval(interval)
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setLocalError(null)

    try {
      const res = await login(email, password)

      if (!res?.success) {
        setLocalError(res.error || "Login failed")
        return
      }

      setEmail("")
      setPassword("")
      setIsDialogOpen(true)
    } catch (err: any) {
      console.error("Error logging in:", err)
      setLocalError(err.message || "Login failed")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Show loading screen while backend is not ready
  if (checkingBackend || !backendReady) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-[#3f5a36] via-[#5f725d] to-[#374f2f]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-white mx-auto mb-4"></div>
          <p className="text-white text-lg font-semibold">
            {checkingBackend ? "Checking server..." : "Server not ready, retrying..."}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen w-full flex-col items-center bg-gradient-to-br from-[#3f5a36] via-[#5f725d] to-[#374f2f]">
      <Header variant="default" location="Login" />
      <div className="flex flex-1 items-center justify-center py-12 w-full">
        <Card className="max-w-md w-[90%] p-6 md:p-8">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold">Login</CardTitle>
            <CardDescription>
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="grid gap-6">
              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  placeholder="your@email.com"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              {/* Password */}
              <div className="relative">
                <Label>Password</Label>
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-2 flex items-center px-2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff className="mt-3" size={20} /> : <Eye className="mt-3" size={20} />}
                </button>
              </div>

              {localError && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded text-sm text-center">
                  {localError}
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Logging in..." : "Login"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="justify-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link
              href="/signup"
              className="ml-1 text-primary underline underline-offset-2"
            >
              Sign up
            </Link>
          </CardFooter>
        </Card>
      </div>

      {isDialogOpen && <NavigationDialog open={isDialogOpen} />}
    </div>
  )
}

export default LoginPage
