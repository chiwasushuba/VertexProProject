"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"
import { FileText } from "lucide-react"

interface PhotoPreviewProps {
  src: string
  alt: string
}

export function PhotoPreview({ src, alt }: PhotoPreviewProps) {
  const [open, setOpen] = useState(false)

  if (!src) {
    return (
      <div className="flex items-center justify-center h-32 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300">
        <div className="text-center">
          <FileText className="mx-auto h-8 w-8 text-gray-400 mb-2" />
          <p className="text-sm text-gray-500">No {alt} uploaded</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="relative group cursor-pointer" onClick={() => setOpen(true)}>
        <img
          src={src || "/placeholder.svg"}
          alt={alt}
          className="w-full h-32 object-cover rounded-lg border shadow-sm group-hover:shadow-md transition-shadow"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 rounded-lg transition-colors flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="bg-white/90 rounded-full p-2">
              <FileText className="h-4 w-4 text-gray-700" />
            </div>
          </div>
        </div>
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-4xl p-0">
          <DialogTitle>
            <VisuallyHidden>{alt} Preview</VisuallyHidden>
          </DialogTitle>
          <img src={src || "/placeholder.svg"} alt={alt} className="w-full h-auto rounded-lg" />
        </DialogContent>
      </Dialog>
    </>
  )
}
