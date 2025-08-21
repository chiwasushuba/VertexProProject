"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@radix-ui/react-label"
import { useRouter } from "next/navigation"

interface TermsDialogProps {
  name: string
  agreed: boolean
  open: boolean
  setOpen: (open: boolean) => void
}

export function TermsDialog({ name, agreed, open, setOpen }: TermsDialogProps) {
  const router = useRouter()

  const handleContinue = async () => {
    try {
      // Ask user to select a screen/tab/window
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
      })

      // Create a video element to draw a frame
      const video = document.createElement("video")
      video.srcObject = stream

      await new Promise((resolve) => {
        video.onloadedmetadata = () => {
          video.play()
          resolve(true)
        }
      })

      // Draw video frame into a canvas
      const canvas = document.createElement("canvas")
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      const ctx = canvas.getContext("2d")
      ctx?.drawImage(video, 0, 0, canvas.width, canvas.height)

      // Stop the screen share stream
      stream.getTracks().forEach((track) => track.stop())

      // Convert canvas to PNG
      const screenshot = canvas.toDataURL("image/png")

      // Trigger download
      const link = document.createElement("a")
      link.href = screenshot
      link.download = "screenshot.png"
      link.click()
    } catch (err) {
      console.error("Screen capture failed:", err)
    }

    // close dialog & navigate
    setOpen(false)
    router.push("/")
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>
            I accepted and agree to follow the rules in the video
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col space-y-4 justify-center">
          <div className="flex justify-between">
            <Label>Name: {name}</Label>
            <Label>Date/Time: {new Date().toLocaleString()}</Label>
          </div>
          <Button
            className="w-full mt-4"
            disabled={!agreed}
            onClick={handleContinue}
          >
            Continue
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
