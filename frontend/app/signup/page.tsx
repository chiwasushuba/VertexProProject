"use client"

import Header from "@/components/header"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"
import Link from "next/link"
import { createWorker } from 'tesseract.js'

const SignupPage = () => {
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [positionTitle, setPositionTitle] = useState("")
  const [email, setEmail] = useState("")
  const [registrationDate, setRegistrationDate] = useState("")
  const [validUntilDate, setValidUntilDate] = useState("")
  const [nbiFile, setNbiFile] = useState<File | null>(null)
  const [fitToWork, setFitToWork] = useState<File | null>(null)
  const [gcashNumber, setGcashNumber] = useState("")
  const [gcashName, setGcashName] = useState("")
  const [idPhoto, setIdPhoto] = useState<File | null>(null)
  const [address, setAddress] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)

  const handleNBIUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsProcessing(true)
    setNbiFile(file)
    
    try {
      const worker = await createWorker('eng')
      const { data } = await worker.recognize(file)
      await worker.terminate()

      // Extract dates from the recognized text
      const text = data.text

      console.log(text)

      // Try multiple patterns to catch different date formats
      const registrationMatch = text.match(/(Registration|Issued) Date:\s*(\d{1,2}\/\d{1,2}\/\d{4})/i) || 
                              text.match(/(Date Issued|Printed):\s*(\d{1,2}\/\d{1,2}\/\d{4})/i)
      
      const validUntilMatch = text.match(/(Valid Until|Expiration|Deadline):\s*(\d{1,2}\/\d{1,2}\/\d{4})/i)

      if (registrationMatch && registrationMatch[2]) {
        setRegistrationDate(registrationMatch[2])
      }
      
      if (validUntilMatch && validUntilMatch[2]) {
        setValidUntilDate(validUntilMatch[2])
      }
      
    } catch (error) {
      console.error('OCR Error:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log({
      firstName,
      lastName,
      positionTitle,
      email,
      registrationDate,
      validUntilDate,
      nbiFile,
      fitToWork,
      gcashNumber,
      gcashName,
      idPhoto,
      address,
    })
    alert("Form submitted! Check console for data.")
  }

  return (
    <div className="flex min-h-screen w-full flex-col items-center bg-gradient-to-br from-[#3f5a36] via-[#5f725d] to-[#374f2f]">
      <Header variant="default" location="Signup" />
      <main className="flex flex-1 items-center justify-center py-12">
        <Card className="max-w-3xl w-[80vh] p-6 md:p-8">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold">Sign Up</CardTitle>
            <CardDescription className="">Enter your details to create an account.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="grid gap-6">
              <div className="flex gap-2">
                <div className="space-y-2 w-full">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    placeholder="First Name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2 w-full">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    placeholder="Last Name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 w-full">
                <div className="space-y-2">
                  <Label htmlFor="positionTitle">Position Title</Label>
                  <Select value={positionTitle} onValueChange={setPositionTitle}>
                    <SelectTrigger id="positionTitle" className="w-full">
                      <SelectValue placeholder="Select position" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="manager">Manager</SelectItem>
                      <SelectItem value="staff">Staff</SelectItem>
                      <SelectItem value="developer">Developer</SelectItem>
                      <SelectItem value="designer">Designer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    placeholder="Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address (Optional)</Label>
                <Input
                  id="address"
                  placeholder="123 Main St, City, Country"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="nbiRegistration">Upload NBI Clearance</Label>
                <Input
                  id="nbiRegistration"
                  type="file"
                  accept="image/*"
                  onChange={handleNBIUpload}
                  disabled={isProcessing}
                />
                {isProcessing && <p className="text-sm text-gray-500">Processing NBI clearance...</p>}
                
                {registrationDate && (
                  <div className="text-sm mt-2">
                    <p>Registration Date: <span className="font-medium">{registrationDate}</span></p>
                  </div>
                )}
                
                {validUntilDate && (
                  <div className="text-sm mt-1">
                    <p>Valid Until: <span className="font-medium">{validUntilDate}</span></p>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="fitToWork">Upload Fit to Work</Label>
                <Input id="fitToWork" type="file" onChange={(e) => setFitToWork(e.target.files?.[0] || null)} />
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="idPhoto">Upload ID Photo</Label>
                  <Input id="idPhoto" type="file" onChange={(e) => setIdPhoto(e.target.files?.[0] || null)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gcashNumber">GCash Number</Label>
                  <Input
                    id="gcashNumber"
                    placeholder="09XX-XXX-XXXX"
                    value={gcashNumber}
                    onChange={(e) => setGcashNumber(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="gcashName">GCash Name</Label>
                <Input
                  id="gcashName"
                  placeholder="Full Name on GCash"
                  value={gcashName}
                  onChange={(e) => setGcashName(e.target.value)}
                />
              </div>

              <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
                Submit
              </Button>
            </form>
          </CardContent>
          <CardFooter className="justify-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="ml-1 text-primary underline underline-offset-2">
              Login
            </Link>
          </CardFooter>
        </Card>
      </main>
    </div>
  )
}

export default SignupPage