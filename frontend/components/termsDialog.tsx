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

interface TermsDialogProps {
  name: string;
}


export function TermsDialog(termsDialogProps: TermsDialogProps) {
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
        
        <div className="flex flex-col space-y-4 justify-center">
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
          <div className="flex justify-between">
            <Label>
              Name: {termsDialogProps.name}
            </Label>
            <Label>
              Date/Time: {new Date().toLocaleString()}
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