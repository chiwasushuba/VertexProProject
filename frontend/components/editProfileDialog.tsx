// components/EditProfileDialog.tsx
"use client"

import React, { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog"
import { Label } from "./ui/label"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import api from "@/utils/axios"

interface EditProfileDialogProps {
  _id: string
  open: boolean
  setOpen: (open: boolean) => void
}

const EditProfileDialog = ({ _id, open, setOpen }: EditProfileDialogProps) => {
  const [profileFile, setProfileFile] = useState<File | null>(null)
  const [nbiFile, setNbiFile] = useState<File | null>(null)
  const [fitToWorkFile, setFitToWorkFile] = useState<File | null>(null)

  const [nbiRegDate, setNbiRegDate] = useState("")
  const [nbiExpDate, setNbiExpDate] = useState("")
  const [fitToWorkDate, setFitToWorkDate] = useState("")
  const [gcashNumber, setGcashNumber] = useState("")
  const [gcashName, setGcashName] = useState("")

  const [loading, setLoading] = useState(false)

  // Optional: load existing user values for convenience when opening the dialog (if desired)
  useEffect(() => {
    if (!open) return
    // optionally fetch current user data to prefill fields
  }, [open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!_id) {
      alert("Missing user id")
      return
    }

    setLoading(true)
    try {
      const formData = new FormData()

      // IMPORTANT: backend expects files with these exact keys
      if (profileFile) formData.append("profileImage", profileFile)
      if (nbiFile) formData.append("nbiClearance", nbiFile)
      if (fitToWorkFile) formData.append("fitToWork", fitToWorkFile)

      formData.append("nbiRegistrationDate", nbiRegDate)
      formData.append("nbiExpirationDate", nbiExpDate)
      formData.append("fitToWorkExpirationDate", fitToWorkDate)
      formData.append("gcashNumber", gcashNumber)
      formData.append("gcashName", gcashName)

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
          <Label>Upload New Profile</Label>
          <Input
            type="file"
            name="profileImage"
            accept=".docx,.png,.jpg,.jpeg"
            onChange={(e) => e.target.files && setProfileFile(e.target.files[0])}
          />

          <Label>Upload New NBI Clearance</Label>
          <Input
            type="file"
            name="nbiClearance"
            accept=".docx,.png,.jpg,.jpeg"
            onChange={(e) => e.target.files && setNbiFile(e.target.files[0])}
          />

          <Label>Upload New Fit To Work</Label>
          <Input
            type="file"
            name="fitToWork"
            accept=".docx,.png,.jpg,.jpeg"
            onChange={(e) => e.target.files && setFitToWorkFile(e.target.files[0])}
          />

          <Label>NBI Clearance Registration Date</Label>
          <Input type="date" value={nbiRegDate} onChange={(e) => setNbiRegDate(e.target.value)} />

          <Label>NBI Clearance Expiration Date</Label>
          <Input type="date" value={nbiExpDate} onChange={(e) => setNbiExpDate(e.target.value)} />

          <Label>Fit To Work Admitted Date</Label>
          <Input type="date" value={fitToWorkDate} onChange={(e) => setFitToWorkDate(e.target.value)} />

          <Label>GCash Number</Label>
          <Input placeholder="Your Number" value={gcashNumber} onChange={(e) => setGcashNumber(e.target.value)} />

          <Label>GCash Name</Label>
          <Input placeholder="Your Name" value={gcashName} onChange={(e) => setGcashName(e.target.value)} />

          <Button type="submit" className="w-full mt-4" disabled={loading}>
            {loading ? "Processing..." : "Continue"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default EditProfileDialog
