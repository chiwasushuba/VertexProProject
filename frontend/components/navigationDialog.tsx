import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '@radix-ui/react-dialog'
import React from 'react'
import { DialogHeader } from './ui/dialog'
import { useRouter } from "next/navigation"

interface NavigationDialogProps {
  setOpen: (open: boolean) => void
}

const NavigationDialog = ({setOpen} : NavigationDialogProps) => {
  const router = useRouter()

  const handleWatchVideButton = () => {
    router.push("/watch")
  }

  const handleTimestampButton = () => {
    router.push("/camera")
  }




  return (
    <Dialog>
      <DialogContent className='w-2/8 h-1/7'>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your account
            and remove your data from our servers.
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}

export default NavigationDialog