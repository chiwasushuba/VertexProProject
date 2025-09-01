"use client"

import Header from "@/components/header"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { useEffect, useState } from "react"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useLogin } from '@/hooks/useLogin'
import NavigationDialog from "@/components/navigationDialog"
import api from "@/utils/axios"

const LoginPage = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [localError, setLocalError] = useState<string | null>(null)

  const [isBackendReady, setIsBackendReady] = useState(false) // ✅ loading screen state
  const [backendError, setBackendError] = useState<string | null>(null)

  const { login } = useLogin()
  const router = useRouter()

  // Check backend by fetching all users
  useEffect(() => {
    const checkBackend = async () => {
      try {
        const res = await api.get("/user")  // will throw if backend is down
        if (res.status === 200) {
          setIsBackendReady(true)
          return
        }
      } catch (err) {
        console.warn("Backend not ready, retrying...")
        setTimeout(checkBackend, 2000) // retry every 2s
      }
    }
    checkBackend()
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

      // Clear fields
      setEmail("")
      setPassword("")

      // Show dialog only if login is successful
      setIsDialogOpen(true)

    } catch (err: any) {
      console.error("Error logging in:", err)
      setLocalError(err.message || "Login failed")
    } finally {
      setIsSubmitting(false)
    }
  }

  // ✅ Loading screen while backend not ready
  if (!isBackendReady) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-[#3f5a36] via-[#5f725d] to-[#374f2f]">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-white" />
          <p className="text-white text-lg font-medium">Connecting to server...</p>
          {backendError && <p className="text-red-300 text-sm">{backendError}</p>}
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen w-full flex-col items-center bg-gradient-to-br from-[#3f5a36] via-[#5f725d] to-[#374f2f]">
      <Header variant="default"/>
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

              {/* Password with toggle */}
              <div className="relative">
                <Label>Password</Label>
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
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

              {/* Show error if any */}
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

      {/* Only show NavigationDialog if login is successful */}
      {isDialogOpen && <NavigationDialog open={isDialogOpen} />}
    </div>
  )
}

export default LoginPage
