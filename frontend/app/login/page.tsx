"use client"

import Header from "@/components/header"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import { useRouter } from "next/navigation" // ✅ import useRouter

const LoginPage = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const router = useRouter() // ✅ initialize router

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) throw new Error("Login failed");

      const data = await res.json();
      localStorage.setItem("userInfo", JSON.stringify(data));

      alert("Login successful!");
      router.push("/watch");
    } catch (error) {
      console.error("Error logging in:", error);
      alert("Something went wrong! Check console for details.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col items-center bg-gradient-to-br from-[#3f5a36] via-[#5f725d] to-[#374f2f]">
      <Header variant="default" location="Login" />
      <div className="flex flex-1 items-center justify-center py-12 w-full">
        <Card className="max-w-md w-[90%] p-6 md:p-8">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold">Login</CardTitle>
            <CardDescription>Enter your credentials to access your account</CardDescription>
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
                <Label className="ml-2 text-[1.7vh]">Password</Label>
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
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <input
                    id="remember-me"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <Label htmlFor="remember-me">Remember me</Label>
                </div>
                <Link
                  href="/forgot-password"
                  className="text-sm text-primary underline-offset-2 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>

              <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isSubmitting}>
                {isSubmitting ? "Logging in..." : "Login"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="justify-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link href="/signup" className="ml-1 text-primary underline underline-offset-2">
              Sign up
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

export default LoginPage
