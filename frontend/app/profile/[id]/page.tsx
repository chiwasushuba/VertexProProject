"use client"
import { useEffect, useState } from "react"
import type React from "react"

import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import api from "@/utils/axios"
import type { AxiosError } from "axios"
import Header from "@/components/header"
import { RouteGuard } from "@/app/RouteGuard"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"
import {
  Calendar,
  CreditCard,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  Camera,
  User,
  MapPin,
  Mail,
  Trash2,
  Plus,
} from "lucide-react"
import type { UserProfile } from "@/types/userProfileType"
import { useAuthContext } from "@/hooks/useAuthContext"
import TemplateDialog from "@/components/templateDialog"

interface InfoItemProps {
  icon: any
  label: string
  value: string
}

function InfoItem({ icon: Icon, label, value }: InfoItemProps) {
  return (
    <div className="flex items-start gap-3 p-3 rounded-lg bg-white/50">
      <Icon className="h-4 w-4 text-gray-600 mt-0.5 flex-shrink-0" />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-gray-900">{label}</p>
        <p className="text-sm text-gray-600 break-words">{value}</p>
      </div>
    </div>
  )
}

interface PhotoPreviewProps {
  src: string
  alt: string
}

function PhotoPreview({ src, alt }: PhotoPreviewProps) {
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

/* -------------------------
   TemplateDialog component
   ------------------------- */

/* -------------------------
   ProfilePage (main export)
   ------------------------- */
export default function ProfilePage() {
  const { id } = useParams()
  const { userInfo } = useAuthContext()
  const [user, setUser] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [photos, setPhotos] = useState<string[]>([])
  const [file, setFile] = useState<File | null>(null)
  const [tempDialogOpen, setTempDialogOpen] = useState(false)

  useEffect(() => {
    if (!id) return

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

    fetchUser()
  }, [id])

  // Fetch photos when user changes
  useEffect(() => {
    if (!user?._id) return

    const fetchPhotos = async () => {
      try {
        const res = await api.get(`/timestamp/user/${user._id}`)
        // Flatten all pictures
        const allPhotos = res.data.flatMap((item: any) => item.pictures)
        setPhotos(allPhotos)
      } catch (err) {
        console.error("Failed to fetch photos:", err)
      }
    }

    fetchPhotos()
  }, [user])

  if (loading) {
    return (
      <RouteGuard>
        <div className="flex min-h-screen min-w-screen flex-col items-center bg-gradient-to-br from-[#3f5a36] via-[#5f725d] to-[#374f2f]">
          <Header variant="signedUser" />
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
              <p className="text-white">Loading profile...</p>
            </div>
          </div>
        </div>
      </RouteGuard>
    )
  }

  if (error) {
    return (
      <RouteGuard>
        <div className="flex min-h-screen min-w-screen flex-col items-center bg-gradient-to-br from-[#3f5a36] via-[#5f725d] to-[#374f2f]">
          <Header variant="signedUser" />
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <XCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
              <p className="text-red-400 font-medium">{error}</p>
            </div>
          </div>
        </div>
      </RouteGuard>
    )
  }

  if (!user) {
    return (
      <RouteGuard>
        <div className="flex min-h-screen min-w-screen flex-col items-center bg-gradient-to-br from-[#3f5a36] via-[#5f725d] to-[#374f2f]">
          <Header variant="signedUser" />
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <XCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-400">User not found</p>
            </div>
          </div>
        </div>
      </RouteGuard>
    )
  }

  const isOwnProfile = userInfo?.user?._id === id

  const handleSendLetter = async () => {
    setTempDialogOpen(true)
  }

  const handleRequestLetter = async () => {
    try {
      await api.patch(`/user/changerequest/${userInfo.user._id}`)
      alert("Request submitted.")
    } catch (e) {
      console.error(e)
      alert("Failed to request letter.")
    }
  }

  const handleDeletePhoto = async (index: number, photoUrl: string) => {
    if (!isOwnProfile) return

    try {
      await api.delete(`/user/${user?._id}/photos`, {
        data: { photoUrl },
      })
      setPhotos((prevPhotos) => prevPhotos.filter((_, i) => i !== index))
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>
      console.error("Failed to delete photo:", error.response?.data?.message || "Unknown error")
      alert("Failed to delete photo. Please try again.")
    }
  }
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleFileSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file || !isOwnProfile || !user?._id) return

    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append("picture", file)

      await api.post(`/timestamp`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${userInfo.token}`, // ✅ add token here
        },
      })

      // Refetch photos after upload
      const res = await api.get(`/timestamp/user/${user._id}`)
      const allPhotos = res.data.flatMap((item: any) => item.pictures)
      setPhotos(allPhotos)

      setFile(null)
    } catch (err) {
      console.error("Upload failed:", err)
    } finally {
      setIsUploading(false)
    }
  }

  const handlePhotoClick = (photo: string) => {
    setSelectedPhoto(photo)
  }

  // Prepare dialog props
  const fullName = `${user.firstName} ${user.middleName ? user.middleName + " " : ""}${user.lastName}`
  const role = user.position || user.role || ""
  const startTime = (user as any).startTime || "" // adjust if you store shift times
  const endTime = (user as any).endTime || ""
  const email = user.email || ""
  const token = userInfo?.token || null

  return (
    <RouteGuard>
      <div className="flex min-h-screen min-w-screen flex-col items-center bg-gradient-to-br from-[#3f5a36] via-[#5f725d] to-[#374f2f]">
        <Header variant="signedUser" />

        <div className="flex w-11/12 sm:w-8/12 min-h-screen flex-col items-center justify-start gap-5 bg-gray-200 rounded-lg shadow-lg p-6 mb-5">
          <h1 className="text-[2rem] font-bold text-black">User Profile</h1>

          <div className="w-full max-w-full space-y-6">
            {/* Header Section */}
            <Card className="shadow-lg">
              <CardHeader className="flex items-center flex-col">
                <Avatar className="w-24 h-24 mb-4 border-4 border-white shadow-lg">
                  <AvatarImage src={user.profileImage || "/placeholder.svg"} alt={user.firstName} />
                  <AvatarFallback className="text-xl font-semibold bg-green-600 text-white">
                    {user.firstName[0]}
                    {user.lastName[0]}
                  </AvatarFallback>
                </Avatar>
                <CardTitle className="text-2xl text-center text-balance">
                  {user.firstName} {user.middleName} {user.lastName}
                </CardTitle>
                <p className="text-gray-500 text-lg">{user.position}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant={user.verified ? "default" : "secondary"} className="gap-1">
                    {user.verified ? <CheckCircle className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                    {user.verified ? "Verified" : "Pending Verification"}
                  </Badge>
                  <Badge variant="outline">{user.role}</Badge>
                </div>
              </CardHeader>
            </Card>

            {/* Inline Photo Gallery */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="h-5 w-5" />
                  Photo Gallery
                  {photos.length > 0 && (
                    <Badge variant="secondary" className="ml-auto">
                      {photos.length} photo{photos.length !== 1 ? "s" : ""}
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {photos.map((photo, index) => (
                    <div key={index} className="relative group aspect-square">
                      <div className="w-full h-full cursor-pointer" onClick={() => handlePhotoClick(photo)}>
                        <img
                          src={photo || "/placeholder.svg"}
                          alt={`Photo ${index + 1}`}
                          className="w-full h-full object-cover rounded-lg border shadow-sm group-hover:shadow-md transition-shadow"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 rounded-lg transition-colors flex items-center justify-center">
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="bg-white/90 rounded-full p-2">
                              <Camera className="h-4 w-4 text-gray-700" />
                            </div>
                          </div>
                        </div>
                      </div>
                      {isOwnProfile && (
                        <Button
                          size="sm"
                          variant="destructive"
                          className="absolute top-2 right-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDeletePhoto(index, photo)
                          }}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  ))}
                  {!isOwnProfile && (!photos || photos.length === 0) && (
                    <div className="col-span-full flex items-center justify-center h-40 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300">
                      <div className="text-center">
                        <Camera className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                        <p className="text-sm text-gray-500">No photos uploaded</p>
                      </div>
                    </div>
                  )}
                </div>
                <Separator className="my-4" />
                <div className="w-full">
                  {/* Upload form only for own profile */}
                  {isOwnProfile && (
                    <form
                      onSubmit={handleFileSubmit}
                      className="mb-6 flex flex-col sm:flex-row sm:items-center gap-2 w-full"
                    >
                      <input
                        className="border p-2 rounded w-full sm:w-auto"
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                      />
                      <Button type="submit" disabled={isUploading} className="w-full sm:w-auto">
                        {isUploading ? "Uploading..." : "Upload"}
                      </Button>
                    </form>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Basic Information */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Basic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoItem icon={Mail} label="Email" value={user.email || ""} />
                <InfoItem icon={User} label="Gender" value={user.gender || ""} />
                <InfoItem icon={User} label="Position" value={user.position || ""} />
                <InfoItem icon={MapPin} label="Address" value={user.completeAddress || ""} />
              </CardContent>
            </Card>

            {/* Documents Section */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Documents
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* NBI Clearance */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <FileText className="h-4 w-4 text-green-600" />
                    <h3 className="font-semibold">NBI Clearance</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <PhotoPreview src={user.nbiClearance} alt="NBI Clearance" />
                    <div className="space-y-2">
                      <InfoItem
                        icon={Calendar}
                        label="Registration Date"
                        value={user.nbiRegistrationDate ? new Date(user.nbiRegistrationDate).toLocaleDateString() : ""}
                      />
                      <InfoItem
                        icon={Calendar}
                        label="Expiration Date"
                        value={user.nbiExpirationDate ? new Date(user.nbiExpirationDate).toLocaleDateString() : ""}
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Fit to Work */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <FileText className="h-4 w-4 text-green-600" />
                    <h3 className="font-semibold">Medical Clearance</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <PhotoPreview src={user.fitToWork} alt="Medical Clearance" />
                    <div>
                      <InfoItem
                        icon={Calendar}
                        label="Expiration Date"
                        value={
                          user.fitToWorkExpirationDate ? new Date(user.fitToWorkExpirationDate).toLocaleDateString() : ""
                        }
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Information */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Payment Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <InfoItem icon={User} label="GCash Name" value={user.gcashName || ""} />
                <InfoItem icon={CreditCard} label="GCash Number" value={user.gcashNumber?.toString() || ""} />
              </CardContent>
            </Card>

            {/* Account Information */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Account Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <InfoItem
                  icon={Calendar}
                  label="Created"
                  value={user.createdAt ? new Date(user.createdAt).toLocaleDateString() : ""}
                />
                <InfoItem
                  icon={Calendar}
                  label="Last Updated"
                  value={user.updatedAt ? new Date(user.updatedAt).toLocaleDateString() : ""}
                />
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="flex justify-between items-center">
                {isOwnProfile ? (
                  <Button onClick={handleRequestLetter} className="bg-blue-600 hover:bg-blue-700">
                    Request Store Intro Letter
                  </Button>
                ) : (
                  <Button onClick={handleSendLetter} className="bg-blue-600 hover:bg-blue-700">
                    Send Store Intro Letter
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Photo Preview Dialog */}
        <Dialog open={!!selectedPhoto} onOpenChange={() => setSelectedPhoto(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] p-2">
            <DialogTitle className="sr-only">Photo Preview</DialogTitle>
            {selectedPhoto && (
              <div className="flex items-center justify-center">
                <img
                  src={selectedPhoto || "/placeholder.svg"}
                  alt="Photo preview"
                  className="max-w-full max-h-[80vh] object-contain rounded-lg"
                />
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Template Dialog */}
        <TemplateDialog
          name={fullName}
          role={role}
          startTime={startTime}
          endTime={endTime}
          email={email}
          open={tempDialogOpen}
          setOpen={setTempDialogOpen}
        />
      </div>
    </RouteGuard>
  )
}
