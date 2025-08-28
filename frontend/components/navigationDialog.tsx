// NavigationDialog.tsx
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog" // <-- shadcn's wrapper, not radix directly
import { useRouter } from "next/navigation"
import { Label } from "@radix-ui/react-label"

// NavigationDialog.tsx
interface NavigationDialogProps {
  open: boolean
}

const NavigationDialog = ({ open }: NavigationDialogProps) => {
  const router = useRouter()

  const handleWatchVideo = () => {
    router.push("/watch")
  }

  const handleTimestamp = () => {
    router.push("/camera")
  }

  return (
    <Dialog open={open}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Navigation</DialogTitle>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="cursor-pointer" onClick={handleWatchVideo}>
              <Label>Go to Watch</Label>
            </div>
            <div className="cursor-pointer" onClick={handleTimestamp}>
              <Label>Go to Timestamp Camera</Label>
            </div>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}

export default NavigationDialog
