"use client"

import Header from '@/components/header'
import React, { useEffect, useState } from 'react'
import { RouteGuard } from './RouteGuard'
import { Button } from "@/components/ui/button"
import { MonitorPlay, Camera, Shield } from "lucide-react"
import { useRouter } from "next/navigation"
import { useAuthContext } from "@/hooks/useAuthContext"

const MainPage = () => {
  const router = useRouter()
  const { userInfo } = useAuthContext()
  const [disabled, setDisabled] = useState(false)

  useEffect(() => {
    setDisabled(userInfo?.user?.verified === false)
  }, [userInfo])

  const isAdmin = userInfo?.user?.role === "admin" || userInfo?.user?.role === "superAdmin"

  return (
    <RouteGuard>
      <div className='flex min-h-screen w-full flex-col items-center bg-gradient-to-br from-[#3f5a36] via-[#5f725d] to-[#374f2f]'>
        <Header variant='signedUser' />

        {/* Inline Navigation Menu */}
        <div className="max-w-md rounded-2xl shadow-xl p-6 bg-white/90 backdrop-blur-md mt-10">
          <h2 className="text-xl font-semibold text-center">Navigation</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
            {/* Watch Video */}
            <Button
              variant="outline"
              className="flex flex-col items-center justify-center h-24 gap-2 rounded-xl border border-gray-200 hover:bg-gray-100 transition"
              onClick={() => router.push("/watch")}
            >
              <MonitorPlay className="w-6 h-6" />
              <span className="text-sm font-medium">Go to Watch</span>
            </Button>

            {/* Timestamp Camera */}
            <Button
              variant="outline"
              className="flex flex-col items-center justify-center h-24 gap-2 rounded-xl border border-gray-200 hover:bg-gray-100 transition disabled:opacity-50"
              onClick={() => router.push("/camera")}
              disabled={disabled}
            >
              <Camera className="w-6 h-6" />
              <span className="text-sm font-medium text-center">
                Timestamp Camera
              </span>
            </Button>

            {/* Admin Dashboard (only for admins/superAdmins) */}
            {isAdmin && (
              <Button
                variant="outline"
                className="flex flex-col items-center justify-center h-24 gap-2 rounded-xl border border-gray-200 hover:bg-gray-100 transition sm:col-span-2"
                onClick={() => router.push("/admin")}
              >
                <Shield className="w-6 h-6" />
                <span className="text-sm font-medium">Admin Dashboard</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </RouteGuard>
  )
}

export default MainPage
