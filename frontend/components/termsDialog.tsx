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
          <div><Label className="text-gray-600 text-center text-sm">Note: You need to send a screenshot of this to your supervisor in order to prove that you watched the video</Label></div>
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
