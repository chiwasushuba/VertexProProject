"use client"

import Header from "@/components/header"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"
import Link from "next/link"
import { Eye, EyeOff } from "lucide-react"
import { useRouter } from "next/navigation"
import { useSignup } from '@/hooks/useSignup'

const SignupPage = () => {
  const router = useRouter()
  const { signup, error } = useSignup()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [role, setRole] = useState("user")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [middleName, setMiddleName] = useState("")
  const [gender, setGender] = useState("")
  const [position, setPosition] = useState("")
  const [completeAddress, setCompleteAddress] = useState("")
  const [nbiRegistrationDate, setNbiRegistrationDate] = useState("")
  const [nbiExpirationDate, setNbiExpirationDate] = useState("")
  const [fitToWorkExpirationDate, setFitToWorkExpirationDate] = useState("")
  const [gcashNumber, setGcashNumber] = useState("")
  const [gcashName, setGcashName] = useState("")
  const [profileImage, setProfileImage] = useState<File | null>(null)
  const [nbiClearanceFile, setNbiClearanceFile] = useState<File | null>(null)
  const [fitToWorkFile, setFitToWorkFile] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const formData = new FormData()
      formData.append("email", email)
      formData.append("password", password)
      formData.append("role", role)
      formData.append("firstName", firstName)
      formData.append("lastName", lastName)
      formData.append("middleName", middleName)
      formData.append("gender", gender)
      formData.append("position", position)
      formData.append("completeAddress", completeAddress)
      formData.append("nbiRegistrationDate", nbiRegistrationDate)
      formData.append("nbiExpirationDate", nbiExpirationDate)
      formData.append("fitToWorkExpirationDate", fitToWorkExpirationDate)
      formData.append("gcashNumber", gcashNumber)
      formData.append("gcashName", gcashName)
      if (profileImage) formData.append("profileImage", profileImage, profileImage.name)
      if (nbiClearanceFile) formData.append("nbiClearance", nbiClearanceFile, nbiClearanceFile.name)
      if (fitToWorkFile) formData.append("fitToWork", fitToWorkFile, fitToWorkFile.name)

      const res = await signup(formData)

      if (!res.success) throw new Error(error || "Signup failed")

      alert("Signup successful!")
      router.push("/login")
    } catch (err) {
      console.error("Error submitting form:", err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen w-full flex-col items-center bg-gradient-to-br from-[#3f5a36] via-[#5f725d] to-[#374f2f]">
      <Header variant="default" location="Signup" />
      <main className="flex flex-1 items-center justify-center py-12">
        <Card className="max-w-3xl w-[80vh] p-6 md:p-8">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold">Sign Up</CardTitle>
            <CardDescription>Enter your details to create an account.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="grid gap-6">
              {/* Name Fields */}
              <div className="flex gap-2">
                <Input placeholder="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
                <Input placeholder="Middle Name" value={middleName} onChange={(e) => setMiddleName(e.target.value)} />
                <Input placeholder="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
              </div>

              {/* Email */}
              <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />

              {/* Password with toggle */}
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {/* Show error if any */}
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded text-sm text-center">
                  {error}
                </div>
              )}

              {/* Gender + Role + Position */}
              <div className="grid grid-cols-3 gap-2">
                <Select value={gender} onValueChange={setGender}>
                  <SelectTrigger className="w-full"><SelectValue placeholder="Select Gender" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={role} onValueChange={setRole}>
                  <SelectTrigger className="w-full"><SelectValue placeholder="Role" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={position} onValueChange={setPosition}>
                  <SelectTrigger className="w-full"><SelectValue placeholder="Position" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Coordinator">Coordinator</SelectItem>
                    <SelectItem value="Sampler">Sampler</SelectItem>
                    <SelectItem value="Helper">Helper</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Address */}
              <Input placeholder="Complete Address" value={completeAddress} onChange={(e) => setCompleteAddress(e.target.value)} />

              {/* Dates */}
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <Label>NBI Registration Date</Label>
                  <Input type="date" value={nbiRegistrationDate} onChange={(e) => setNbiRegistrationDate(e.target.value)} required/>
                </div>
                <div>
                  <Label>NBI Expiration Date</Label>
                  <Input type="date" value={nbiExpirationDate} onChange={(e) => setNbiExpirationDate(e.target.value)} required/>
                </div>
                <div>
                  <Label>Fit-to-Work Expiration</Label>
                  <Input type="date" value={fitToWorkExpirationDate} onChange={(e) => setFitToWorkExpirationDate(e.target.value)} required/>
                </div>
              </div>

              {/* GCash */}
              <Input placeholder="GCash Number" value={gcashNumber} onChange={(e) => setGcashNumber(e.target.value)} />
              <Input placeholder="GCash Name" value={gcashName} onChange={(e) => setGcashName(e.target.value)} />

              {/* Profile Image with Preview */}
              <div className="space-y-2">
                <Label>Profile Image</Label>
                <Input type="file" accept="image/*" onChange={(e) => setProfileImage(e.target.files?.[0] || null)} />
                {profileImage && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">Preview:</p>
                    <img
                      src={URL.createObjectURL(profileImage)}
                      alt="Profile Preview"
                      className="mt-1 h-32 w-32 object-cover rounded-full border"
                    />
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label>NBI Clearance</Label>
                <Input type="file" accept="image/*" onChange={(e) => setNbiClearanceFile(e.target.files?.[0] || null)} />
              </div>

              <div className="space-y-2">
                <Label>Fit To Work</Label>
                <Input type="file" accept="image/*" onChange={(e) => setFitToWorkFile(e.target.files?.[0] || null)} />
              </div>

              <Button type="submit" className="w-full bg-primary" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Sign Up"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="justify-center text-sm text-muted-foreground">
            Already have an account?
            <Link href="/login" className="ml-1 text-primary underline underline-offset-2">Login</Link>
          </CardFooter>
        </Card>
      </main>
    </div>
  )
}

export default SignupPage
