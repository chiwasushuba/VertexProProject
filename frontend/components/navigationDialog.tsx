// NavigationDialog.tsx
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { MonitorPlay, Camera } from "lucide-react" // icons for better visuals

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
      <DialogContent className="max-w-md rounded-2xl shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-center">
            Navigation
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
          <Button
            variant="outline"
            className="flex flex-col items-center justify-center h-24 gap-2 rounded-xl border border-gray-200 hover:bg-gray-50"
            onClick={handleWatchVideo}
          >
            <MonitorPlay className="w-6 h-6" />
            <span className="text-sm font-medium">Go to Watch</span>
          </Button>

          <Button
            variant="outline"
            className="flex flex-col items-center justify-center h-24 gap-2 rounded-xl border border-gray-200 hover:bg-gray-50"
            onClick={handleTimestamp}
          >
            <Camera className="w-6 h-6" />
            <span className="text-sm font-medium text-center">
              Timestamp Camera
            </span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default NavigationDialog