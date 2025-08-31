// components/EditPasswordDialog.tsx
"use client"

import React, { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog"
import { Label } from "./ui/label"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import api from "@/utils/axios"

interface EditPasswordDialogProps {
  _id: string
  open: boolean
  setOpen: (open: boolean) => void
}

const EditPasswordDialog = ({ _id, open, setOpen }: EditPasswordDialogProps) => {
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!_id) {
      alert("Missing user id")
      return
    }

    if (newPassword !== confirmPassword) {
      alert("Passwords do not match")
      return
    }

    setLoading(true)
    try {
      await api.patch(`/user/changepassword/${_id}`, { newPassword })

      alert("Password updated successfully!")
      setNewPassword("")
      setConfirmPassword("")
      setOpen(false)
    } catch (err: any) {
      console.error("Password update failed:", err)
      alert(err?.response?.data?.error || "Failed to update password")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Change Password</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <div>
            <Label>New Password</Label>
            <Input
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>

          <div>
            <Label>Confirm Password</Label>
            <Input
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <Button type="submit" className="w-full mt-4" disabled={loading}>
            {loading ? "Processing..." : "Update Password"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default EditPasswordDialog
