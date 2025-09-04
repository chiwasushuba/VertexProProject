"use client"

import Header from "@/components/header"
import { TermsDialog } from "@/components/termsDialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useEffect, useRef, useState } from "react"
import { RouteGuard } from "../RouteGuard"


const WatchPage = () => {
  const videoRefs = [useRef<HTMLVideoElement>(null), useRef<HTMLVideoElement>(null)]
  const [lastTimes, setLastTimes] = useState([0, 0])
  const [videoDone, setVideoDone] = useState([false, false])
  const [agreed, setAgreed] = useState(false)
  const [openDialog, setOpenDialog] = useState(false)

  const tempUser = { name: "John Doe" }

  const handleTimeUpdate = (index: number) => {
    const video = videoRefs[index].current
    if (!video) return
    setLastTimes((prev) => {
      const copy = [...prev]
      copy[index] = video.currentTime
      return copy
    })
  }

  const handleSeeking = (index: number) => {
    const video = videoRefs[index].current
    if (!video) return
    if (video.currentTime > lastTimes[index] + 0.01) {
      video.currentTime = lastTimes[index]
    }
  }

  const handleEnded = (index: number) => {
    setVideoDone((prev) => {
      const copy = [...prev]
      copy[index] = true
      return copy
    })
  }

  useEffect(() => {
    videoRefs.forEach((videoRef, index) => {
      const video = videoRef.current
      if (!video) return

      const onTimeUpdate = () => handleTimeUpdate(index)
      const onSeeking = () => handleSeeking(index)
      const onEnded = () => handleEnded(index)

      video.addEventListener("timeupdate", onTimeUpdate)
      video.addEventListener("seeking", onSeeking)
      video.addEventListener("ended", onEnded)

      return () => {
        video.removeEventListener("timeupdate", onTimeUpdate)
        video.removeEventListener("seeking", onSeeking)
        video.removeEventListener("ended", onEnded)
      }
    })
  }, [lastTimes])

  useEffect(() => {
    if (agreed) setOpenDialog(true)
  }, [agreed])

  return (
    <RouteGuard>
      <div className="flex min-h-screen w-full flex-col bg-gradient-to-br from-[#3f5a36] via-[#5f725d] to-[#374f2f]">
        <Header variant="signedUser" location="Watch Page" />

        <main className="flex flex-col flex-1 justify-center items-center gap-8 px-4 py-10">
          {/* Tabs Section */}
          <Tabs defaultValue="tagalog" className="w-full max-w-3xl">
            <TabsList className="w-full bg-white/10 rounded-xl p-1 flex gap-2 shadow-md">
              <TabsTrigger
                value="tagalog"
                className="flex-1 text-center py-2 px-2 rounded-lg text-sm sm:text-base
                           data-[state=active]:bg-white data-[state=active]:text-black
                           hover:bg-white/30 transition-colors"
              >
                Tagalog
              </TabsTrigger>
              <TabsTrigger
                value="english"
                className="flex-1 text-center py-2 px-2 rounded-lg text-sm sm:text-base
                           data-[state=active]:bg-white data-[state=active]:text-black
                           hover:bg-white/30 transition-colors"
              >
                English
              </TabsTrigger>
            </TabsList>

            {/* Tagalog Video */}
            <TabsContent value="tagalog">
              <div className="w-full aspect-video rounded-xl overflow-hidden shadow-lg">
                <video ref={videoRefs[0]} className="w-full h-full" controls>
                  <source
                    src="https://firebasestorage.googleapis.com/v0/b/vertexpro-inc-fcef5.firebasestorage.app/o/Manpower%20Briefing%20Deck%20(FILIPINO)%20-%20Revised.mp4?alt=media&token=55c4530e-fad0-49e4-8e4e-bbdfeed0fe79"
                    type="video/mp4"
                  />
                  Your browser does not support the video tag.
                </video>
              </div>
            </TabsContent>

            {/* English Video */}
            <TabsContent value="english">
              <div className="w-full aspect-video rounded-xl overflow-hidden shadow-lg">
                <video ref={videoRefs[1]} className="w-full h-full" controls>
                  <source
                    src="https://firebasestorage.googleapis.com/v0/b/vertexpro-inc-fcef5.firebasestorage.app/o/Manpower%20Briefing%20Deck%20(ENGLISH)%20-%20Revised.mp4?alt=media&token=a16f37c3-cc22-4c13-bc54-37e6fc4e43dc"
                    type="video/mp4"
                  />
                  Your browser does not support the video tag.
                </video>
              </div>
            </TabsContent>
          </Tabs>

          {/* Agreement Section */}
          <div className="flex items-start gap-3 max-w-3xl w-full px-2">
            <Checkbox
              id="terms"
              checked={agreed}
              onCheckedChange={(checked) => setAgreed(!!checked)}
              className="mt-1 flex-shrink-0"
            />
            <Label
              htmlFor="terms"
              className="text-sm sm:text-base leading-relaxed cursor-pointer text-white"
            >
              I UNDERSTAND THE VIDEO PRESENTED AND WILL FOLLOW THE RULES
            </Label>
          </div>

          {/* Terms Dialog */}
          <TermsDialog name={tempUser.name} agreed={agreed} open={openDialog} setOpen={setOpenDialog} />
        </main>
      </div>
    </RouteGuard>
  )
}

export default WatchPage
