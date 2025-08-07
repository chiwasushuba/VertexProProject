"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { useRouter } from "next/navigation"
import { Label } from "@radix-ui/react-label"

export function TermsDialog() {
  const [open, setOpen] = useState(true)
  const [agreed, setAgreed] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const router = useRouter()

  const handleVideoEnd = () => {
    // Show the checkbox and button after video ends
  }

  const handleContinue = () => {
    setOpen(false)
    router.push("/") // Replace with your actual next page route
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Terms and Conditions</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Terms Agreement Checkbox - Initially hidden, shown after video */}
          <div className="flex items-center space-x-2 pt-4">
            <Checkbox 
              id="terms" 
              checked={agreed}
              onCheckedChange={(checked) => setAgreed(!!checked)}
            />
            <Label htmlFor="terms">
              I UNDERSTAND THE VIDEO PRESENTED AND WILL FOLLOW THE RULES
            </Label>
          </div>

          {/* Continue Button - Disabled until checkbox is checked */}
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