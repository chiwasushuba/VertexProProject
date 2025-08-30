// app/(your-route)/ProfilePage.tsx
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
} from "lucide-react"
import type { UserProfile } from "@/types/userProfileType"
import { useAuthContext } from "@/hooks/useAuthContext"
import TemplateDialog from "@/components/templateDialog"
import EditProfileDialog from "@/components/editProfileDialog"

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

interface PhotoObj {
  url: string
  timestampId: string
}

/* Mobile-friendly PhotoPreview component (integrates preview + delete) */
interface PhotoPreviewProps {
  photo: PhotoObj
  onDelete: (index: number, photo: PhotoObj) => Promise<void> | void
  isOwnProfile: boolean
  index: number
}

function PhotoPreview({
  photo,
  onDelete,
  isOwnProfile,
  index,
}: PhotoPreviewProps) {
  const [open, setOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const handleDelete = async () => {
    if (!confirm("Delete this photo? This cannot be undone.")) return
    try {
      setDeleting(true)
      await onDelete(index, photo)
      setOpen(false)
    } catch (err) {
      // onDelete shows alert/logs; keep UI state consistent
    } finally {
      setDeleting(false)
    }
  }

  return (
    <>
      <div className="relative group cursor-pointer" onClick={() => setOpen(true)}>
        <img
          src={photo.url || "/placeholder.svg"}
          alt={`Photo`}
          className="w-full h-32 object-cover rounded-lg border shadow-sm group-hover:shadow-md transition-shadow"
        />

        {/* Desktop quick delete button */}
        {isOwnProfile && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              if (!confirm("Delete this photo?")) return
              void onDelete(index, photo)
            }}
            className="absolute top-2 right-2 h-7 w-7 p-0 rounded-full bg-white/90 flex items-center justify-center shadow z-10"
            aria-label="Delete photo"
            type="button"
          >
            <Trash2 className="h-4 w-4 text-red-600" />
          </button>
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] p-4">
          <DialogTitle className="sr-only">Photo Preview</DialogTitle>
          <div className="flex flex-col items-center gap-4">
            <img src={photo.url || "/placeholder.svg"} alt={`Photo`} className="max-w-full max-h-[70vh] object-contain rounded-lg" />
            {isOwnProfile && (
              <div className="w-full flex justify-center">
                <Button variant="destructive" onClick={handleDelete} disabled={deleting} className="w-full sm:w-auto">
                  {deleting ? "Deleting..." : "Delete Photo"}
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

/* -------------------------
   ProfilePage (main export)
   ------------------------- */
export default function ProfilePage() {
  const { id } = useParams()
  const { userInfo } = useAuthContext()
  const [user, setUser] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  // changed: photos are objects carrying timestampId
  const [photos, setPhotos] = useState<PhotoObj[]>([])
  const [file, setFile] = useState<File | null>(null)
  const [tempDialogOpen, setTempDialogOpen] = useState(false)
  const [editProfileDialogOpen, setEditProfileDialogOpen] = useState(false)

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

  // Fetch photos when user changes — keep timestampId for deletes
  useEffect(() => {
    if (!user?._id) return

    const fetchPhotos = async () => {
      try {
        const res = await api.get(`/timestamp/user/${user._id}`)
        // res.data is an array of timestamp docs: { _id, pictures: [...] }
        const allPhotos: PhotoObj[] = res.data.flatMap((item: any) =>
          (item.pictures || []).map((p: string) => ({ url: p, timestampId: item._id }))
        )
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

  // Optimistic delete with auth header, reverts on failure
  const handleDeletePhoto = async (index: number, photo: PhotoObj) => {
    if (!isOwnProfile) return

    const previous = photos.slice()
    // optimistic remove
    const updated = photos.filter((_, i) => i !== index)
    setPhotos(updated)

    try {
      const headers: Record<string, string> = {}
      if (userInfo?.token) headers.Authorization = `Bearer ${userInfo.token}`

      // Call your backend deleteSingleImage: DELETE /timestamp/:id/image
      await api.delete(`/timestamp/${photo.timestampId}/image`, {
        headers,
        data: { imageUrl: photo.url },
      })

      // success — UI already updated
    } catch (err) {
      // revert
      setPhotos(previous)
      const error = err as AxiosError<{ message?: string }>
      console.error("Failed to delete photo:", error?.response?.data?.message || err)
      alert(error?.response?.data?.message || "Failed to delete photo. Please try again.")
      throw err
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

      const headers: Record<string, string> = {}
      if (userInfo?.token) headers.Authorization = `Bearer ${userInfo.token}`

      await api.post(`/timestamp`, formData, {
        headers, // axios sets the correct Content-Type with boundary
      })

      // Refetch photos after upload
      const res = await api.get(`/timestamp/user/${user._id}`)
      const allPhotos: PhotoObj[] = res.data.flatMap((item: any) =>
        (item.pictures || []).map((p: string) => ({ url: p, timestampId: item._id }))
      )
      setPhotos(allPhotos)

      setFile(null)
    } catch (err) {
      console.error("Upload failed:", err)
      alert("Upload failed. Please try again.")
    } finally {
      setIsUploading(false)
    }
  }

  const handleEditProfile = () => {
    setEditProfileDialogOpen(true)
  }

  // Prepare dialog props
  const fullName = `${user.firstName} ${user.middleName ? user.middleName + " " : ""}${user.lastName}`
  const role = user.position || user.role || ""
  const startTime = (user as any).startTime || ""
  const endTime = (user as any).endTime || ""
  const email = user.email || ""

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
                    <div key={`${photo.timestampId}-${index}`} className="aspect-square">
                      <PhotoPreview
                        photo={photo}
                        index={index}
                        isOwnProfile={isOwnProfile}
                        onDelete={handleDeletePhoto}
                      />
                    </div>
                  ))}

                  {(!photos || photos.length === 0) && (
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
                    <form onSubmit={handleFileSubmit} className="mb-6 flex flex-col sm:flex-row sm:items-center gap-2 w-full">
                      <input className="border p-2 rounded w-full sm:w-auto" type="file" accept="image/*" onChange={handleFileChange} />
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
                    <div>
                      <img src={user.nbiClearance || "/placeholder.svg"} alt="NBI" className="w-full h-32 object-cover rounded-lg border" />
                    </div>
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
                    <div>
                      <img src={user.fitToWork || "/placeholder.svg"} alt="Fit to work" className="w-full h-32 object-cover rounded-lg border" />
                    </div>
                    <div>
                      <InfoItem
                        icon={Calendar}
                        label="Expiration Date"
                        value={user.fitToWorkExpirationDate ? new Date(user.fitToWorkExpirationDate).toLocaleDateString() : ""}
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
                <InfoItem icon={Calendar} label="Created" value={user.createdAt ? new Date(user.createdAt).toLocaleDateString() : ""} />
                <InfoItem icon={Calendar} label="Last Updated" value={user.updatedAt ? new Date(user.updatedAt).toLocaleDateString() : ""} />
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="flex justify-between items-center">
                {isOwnProfile ? (
                  <div className="flex gap-5">
                    {/* Only show Request Letter if not admin/superAdmin */}
                    {!(userInfo?.user?.role === "admin" || userInfo?.user?.role === "superAdmin") && (
                      <Button onClick={handleRequestLetter} className="bg-blue-600 hover:bg-blue-700">
                        Request Store Intro Letter
                      </Button>
                    )}
                    <Button onClick={handleEditProfile} className="bg-blue-600 hover:bg-blue-700">
                      Edit Profile
                    </Button>
                  </div>
                ) : (
                  <>
                    {/* If the viewer is admin/superAdmin */}
                    {(userInfo?.user?.role === "admin" || userInfo?.user?.role === "superAdmin") ? (
                      <>
                        {/* Hide all buttons if admin is viewing a superAdmin */}
                        {!(userInfo?.user?.role === "admin" && user.role === "superAdmin") && (
                          <div className="flex gap-5">
                            <Button onClick={handleEditProfile} className="bg-blue-600 hover:bg-blue-700">
                              Edit Profile
                            </Button>

                            {/* Admins & superAdmins can also send intro letters to users */}
                            {user.role === "user" && (
                              <Button onClick={handleSendLetter} className="bg-blue-600 hover:bg-blue-700">
                                Send Store Intro Letter
                              </Button>
                            )}
                          </div>
                        )}
                      </>
                    ) : (
                      // Normal users sending store intro letter
                      <Button onClick={handleSendLetter} className="bg-blue-600 hover:bg-blue-700">
                        Send Store Intro Letter
                      </Button>
                    )}
                  </>
                )}
              </CardContent>
            </Card>

          </div>
        </div>

        {/* Template Dialog */}
        <TemplateDialog name={fullName} role={role} startTime={startTime} endTime={endTime} email={email} open={tempDialogOpen} setOpen={setTempDialogOpen} />

        {/* Edit Profile Dialog */}
        <EditProfileDialog _id={user._id} open={editProfileDialogOpen} setOpen={setEditProfileDialogOpen} />
      </div>
    </RouteGuard>
  )
}
