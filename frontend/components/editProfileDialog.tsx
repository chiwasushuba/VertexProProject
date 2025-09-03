// components/EditProfileDialog.tsx
"use client"

import React, { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog"
import { Label } from "./ui/label"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import api from "@/utils/axios"

interface EditProfileDialogProps {
  _id: string
  open: boolean
  setOpen: (open: boolean) => void
}

const EditProfileDialog = ({ _id, open, setOpen }: EditProfileDialogProps) => {
  // File states
  const [profileFile, setProfileFile] = useState<File | null>(null)
  const [nbiFile, setNbiFile] = useState<File | null>(null)
  const [fitToWorkFile, setFitToWorkFile] = useState<File | null>(null)
  const [govtIdFile, setGovtIdFile] = useState<File | null>(null)

  // Text states
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [middleName, setMiddleName] = useState("")
  const [gender, setGender] = useState("")
  const [position, setPosition] = useState("")
  const [completeAddress, setCompleteAddress] = useState("")
  const [role, setRole] = useState("")
  const [governmentIdType, setGovernmentIdType] = useState("")

  // Date / number states
  const [nbiRegDate, setNbiRegDate] = useState("")
  const [nbiExpDate, setNbiExpDate] = useState("")
  const [fitToWorkDate, setFitToWorkDate] = useState("")
  const [gcashNumber, setGcashNumber] = useState("")
  const [gcashName, setGcashName] = useState("")

  const [loading, setLoading] = useState(false)

  // Reset file selections when dialog closes to avoid stale file objects
  useEffect(() => {
    if (!open) {
      setProfileFile(null)
      setNbiFile(null)
      setFitToWorkFile(null)
      setGovtIdFile(null)
    }
  }, [open])

  // Prefill with existing user data when dialog opens
  useEffect(() => {
    if (!open || !_id) return

    let mounted = true
    ;(async () => {
      try {
        const { data } = await api.get(`/user/${_id}`)
        const u = data?.user || {}

        if (!mounted) return

        setFirstName(u.firstName ?? "")
        setLastName(u.lastName ?? "")
        setMiddleName(u.middleName ?? "")
        setGender(u.gender ?? "")
        setPosition(u.position ?? "")
        setCompleteAddress(u.completeAddress ?? "")
        setRole(u.role ?? "")
        setGovernmentIdType(u.governmentIdType ?? "")

        // Normalize date fields to yyyy-mm-dd if present
        setNbiRegDate(u.nbiRegistrationDate ? String(u.nbiRegistrationDate).split("T")[0] : "")
        setNbiExpDate(u.nbiExpirationDate ? String(u.nbiExpirationDate).split("T")[0] : "")
        setFitToWorkDate(u.fitToWorkExpirationDate ? String(u.fitToWorkExpirationDate).split("T")[0] : "")

        setGcashNumber(u.gcashNumber ?? "")
        setGcashName(u.gcashName ?? "")
      } catch (err) {
        console.error("Failed to load user data:", err)
      }
    })()

    return () => {
      mounted = false
    }
  }, [open, _id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!_id) {
      alert("Missing user id")
      return
    }

    setLoading(true)
    try {
      const formData = new FormData()

      // Attach files only if present
      if (profileFile) formData.append("profileImage", profileFile)
      if (nbiFile) formData.append("nbiClearance", nbiFile)
      if (fitToWorkFile) formData.append("fitToWork", fitToWorkFile)
      if (govtIdFile) formData.append("governmentId", govtIdFile)

      // Helper to append only non-empty values (so we don't overwrite with empty strings)
      const appendIf = (key: string, value: any) => {
        if (value !== undefined && value !== null && String(value).trim() !== "") {
          formData.append(key, String(value))
        }
      }

      appendIf("firstName", firstName)
      appendIf("lastName", lastName)
      appendIf("middleName", middleName)
      appendIf("gender", gender)
      appendIf("position", position)
      appendIf("completeAddress", completeAddress)
      appendIf("role", role)
      appendIf("governmentIdType", governmentIdType)

      appendIf("nbiRegistrationDate", nbiRegDate)
      appendIf("nbiExpirationDate", nbiExpDate)
      appendIf("fitToWorkExpirationDate", fitToWorkDate)
      appendIf("gcashNumber", gcashNumber)
      appendIf("gcashName", gcashName)

      // Let the browser/axios set the multipart boundary header — do NOT manually set Content-Type
      await api.patch(`/user/${_id}`, formData)

      alert("Profile updated successfully!")
      setOpen(false)
    } catch (err: any) {
      console.error("Update failed:", err)
      alert(err?.response?.data?.error || "Failed to update profile")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-h-[90vh] max-w-[70vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>Edit Your Profile</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <Label>First Name</Label>
          <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} />

          <Label>Last Name</Label>
          <Input value={lastName} onChange={(e) => setLastName(e.target.value)} />

          <Label>Middle Name</Label>
          <Input value={middleName} onChange={(e) => setMiddleName(e.target.value)} />

          <Label>Gender</Label>
          <Select value={gender} onValueChange={(val) => setGender(val)}>
            <SelectTrigger>
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Male">Male</SelectItem>
              <SelectItem value="Female">Female</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>

          <Label>Complete Address</Label>
          <Input value={completeAddress} onChange={(e) => setCompleteAddress(e.target.value)} />

          <div className="flex flex-col w-full gap-3">
            <Label>Position</Label>
            <Select value={position} onValueChange={setPosition}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Position" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Coordinator">Coordinator</SelectItem>
                <SelectItem value="Sampler">Sampler</SelectItem>
                <SelectItem value="Push Girl">Push Girl</SelectItem>
                <SelectItem value="Helper">Helper</SelectItem>
                <SelectItem value="Brand Ambassador">
                  Brand Ambassador
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Label>Upload New Profile</Label>
          <Input
            type="file"
            accept="image/*,.pdf,.docx"
            onChange={(e) => e.target.files && setProfileFile(e.target.files[0])}
          />

          <Label>Upload New NBI Clearance</Label>
          <Input
            type="file"
            accept="image/*,.pdf,.docx"
            onChange={(e) => e.target.files && setNbiFile(e.target.files[0])}
          />

          <Label>Upload New Fit To Work</Label>
          <Input
            type="file"
            accept="image/*,.pdf,.docx"
            onChange={(e) => e.target.files && setFitToWorkFile(e.target.files[0])}
          />

          <Label>Upload New Government ID</Label>
          <Input
            type="file"
            accept="image/*,.pdf,.docx"
            onChange={(e) => e.target.files && setGovtIdFile(e.target.files[0])}
          />

          <div className="space-y-2">
            <Label>Government ID Type</Label>
            <Select value={governmentIdType} onValueChange={setGovernmentIdType}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select ID Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Driver's License">Driver's License</SelectItem>
                <SelectItem value="Passport">Passport</SelectItem>
                <SelectItem value="SSS">SSS</SelectItem>
                <SelectItem value="PhilHealth">PhilHealth</SelectItem>
                <SelectItem value="UMID">UMID</SelectItem>
                <SelectItem value="Voter's ID">Voter's ID</SelectItem>
                <SelectItem value="TIN">TIN</SelectItem>
                <SelectItem value="Others">Others</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Label>NBI Clearance Registration Date</Label>
          <Input type="date" value={nbiRegDate} onChange={(e) => setNbiRegDate(e.target.value)} />

          <Label>NBI Clearance Expiration Date</Label>
          <Input type="date" value={nbiExpDate} onChange={(e) => setNbiExpDate(e.target.value)} />

          <Label>Fit To Work Expiration Date</Label>
          <Input type="date" value={fitToWorkDate} onChange={(e) => setFitToWorkDate(e.target.value)} />

          <Label>GCash Number</Label>
          <Input placeholder="Your Number" value={gcashNumber} onChange={(e) => setGcashNumber(e.target.value)} />

          <Label>GCash Name</Label>
          <Input placeholder="Your Name" value={gcashName} onChange={(e) => setGcashName(e.target.value)} />

          <Button type="submit" className="w-full mt-4" disabled={loading}>
            {loading ? "Processing..." : "Save Changes"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default EditProfileDialog
