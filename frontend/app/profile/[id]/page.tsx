"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import api from "@/utils/axios"
import { AxiosError } from "axios"
import Header from "@/components/header"
import { RouteGuard } from "@/app/RouteGuard"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"
import { useAuthContext } from "@/hooks/useAuthContext"

interface User {
  _id: string
  email: string
  role: string
  firstName: string
  lastName: string
  middleName?: string
  gender: string
  position: string
  completeAddress: string
  nbiClearance: string
  nbiRegistrationDate: string
  nbiExpirationDate: string
  fitToWork: string
  fitToWorkExpirationDate: string
  gcashNumber: number
  gcashName: string
  profileImage: string
  createdAt: string
  updatedAt: string
  verified: boolean
}

function PhotoPreview({ src, alt }: { src: string; alt: string }) {
  const [open, setOpen] = useState(false)

  if (!src) return <p>No {alt} uploaded</p>

  return (
    <>
      <img
        src={src}
        alt={alt}
        className="max-w-xs rounded border shadow cursor-pointer hover:opacity-80"
        onClick={() => setOpen(true)}
      />
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-3xl p-0">
          <DialogTitle>
            <VisuallyHidden>{alt} Preview</VisuallyHidden>
          </DialogTitle>
          <img src={src} alt={alt} className="w-full h-auto rounded" />
        </DialogContent>
      </Dialog>
    </>
  )
}

export default function ProfilePage() {
  const { id } = useParams()
  const { userInfo } = useAuthContext()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get(`/user/${id}`)
        setUser(res.data)
      } catch (err) {
        const error = err as AxiosError<{ message?: string }>
        setError(error.response?.data?.message || "Failed to fetch user")
      } finally {
        setLoading(false)
      }
    }

    if (id) fetchUser()
  }, [id])

  if (loading) return <p className="text-center mt-10">Loading...</p>
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>
  if (!user) return <p className="text-center mt-10">User not found.</p>

  // Check if this profile belongs to the logged-in user
  const isOwnProfile = userInfo?.user?._id === user._id

  return (
    <RouteGuard>
      <div className="flex min-h-screen min-w-screen flex-col items-center bg-gradient-to-br from-[#3f5a36] via-[#5f725d] to-[#374f2f]">
        <Header variant="signedUser" />

        <div className="flex w-11/12 sm:w-8/12 min-h-screen flex-col items-center justify-start gap-5 bg-gray-200 rounded-lg shadow-lg p-6 mb-5">
          <h1 className="text-[2rem] font-bold text-black">User Profile</h1>

          <Card className="shadow-lg w-full max-w-2xl">
            <CardHeader className="flex items-center flex-col">
              <Avatar className="w-24 h-24 mb-4">
                <AvatarImage src={user.profileImage} alt={user.firstName} />
                <AvatarFallback>
                  {user.firstName[0]}
                  {user.lastName[0]}
                </AvatarFallback>
              </Avatar>
              <CardTitle className="text-2xl">
                {user.firstName} {user.middleName} {user.lastName}
              </CardTitle>
              <p className="text-gray-500">{user.role}</p>
              <p className="mt-2">
                {user.verified ? (
                  <span className="text-green-600">✅ Verified</span>
                ) : (
                  <span className="text-red-600">❌ Not Verified</span>
                )}
              </p>
            </CardHeader>

            <CardContent className="space-y-4">
              <div>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Gender:</strong> {user.gender}</p>
                <p><strong>Position:</strong> {user.position}</p>
                <p><strong>Address:</strong> {user.completeAddress}</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold">NBI Clearance</h3>
                <PhotoPreview src={user.nbiClearance} alt="NBI Clearance" />
                <p><strong>Registration:</strong> {new Date(user.nbiRegistrationDate).toLocaleDateString()}</p>
                <p><strong>Expiration:</strong> {new Date(user.nbiExpirationDate).toLocaleDateString()}</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold">Fit To Work</h3>
                <PhotoPreview src={user.fitToWork} alt="Fit To Work" />
                <p><strong>Expiration:</strong> {new Date(user.fitToWorkExpirationDate).toLocaleDateString()}</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold">GCash Info</h3>
                <p><strong>Name:</strong> {user.gcashName}</p>
                <p><strong>Number:</strong> {user.gcashNumber}</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold">Account</h3>
                <p><strong>Created:</strong> {new Date(user.createdAt).toLocaleString()}</p>
                <p><strong>Updated:</strong> {new Date(user.updatedAt).toLocaleString()}</p>
              </div>

              {/* --- Action Buttons --- */}
              {!isOwnProfile && (
                <div className="flex justify-end gap-4 pt-6">
                  {user.role === "admin" || user.role === "superAdmin" ? (
                    <>
                      <button
                        onClick={() => console.log("Send Store Intro Letter")}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                      >
                        Send Store Intro Letter
                      </button>
                      <button
                        onClick={() => console.log("Send Company ID")}
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                      >
                        Send Company ID
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => console.log("Request Store Intro Letter")}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        Request Store Intro Letter
                      </button>
                      <button
                        onClick={() => console.log("Request Company ID")}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                      >
                        Request Company ID
                      </button>
                    </>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </RouteGuard>
  )
}
