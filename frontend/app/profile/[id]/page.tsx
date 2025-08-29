"use client"
import { useEffect, useState } from "react"
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
import { useAuthContext } from "@/hooks/useAuthContext"
import { PhotoGallery } from "@/components/PhotoGallery"
import { PhotoPreview } from "@/components/PhotoPreview"
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

export default function ProfilePage() {
  const { id } = useParams()
  const { userInfo } = useAuthContext()
  const [user, setUser] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [photos, setPhotos] = useState([
    "/profile-photo-1.png",
    "/profile-photo-2.png",
    "/profile-photo-3.png",
    "/profile-photo-4.png",
    "/profile-photo-5.png",
    "/profile-photo-6.png",
  ])

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

  const isOwnProfile = userInfo?.user?._id === user._id

  const handleDeleteProfile = async () => {
    if (!isOwnProfile) return

    setIsDeleting(true)
    try {
      await api.delete(`/user/${user._id}`)
      window.location.href = "/"
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>
      console.error("Failed to delete profile:", error.response?.data?.message || "Unknown error")
      alert("Failed to delete profile. Please try again.")
    } finally {
      setIsDeleting(false)
      setShowDeleteDialog(false)
    }
  }

  const handleDeletePhoto = (index: number) => {
    setPhotos((prevPhotos) => prevPhotos.filter((_, i) => i !== index))
  }

  const handleUploadPhoto = (file: File) => {
    // Create a URL for the uploaded file to display it immediately
    const fileUrl = URL.createObjectURL(file)
    setPhotos((prevPhotos) => [...prevPhotos, fileUrl])

    // Here you would typically upload the file to your server
    // Example: uploadPhotoToServer(file)
    console.log("[v0] Photo uploaded:", file.name)
  }

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
                <PhotoGallery
                  photos={photos}
                  onDeletePhoto={handleDeletePhoto}
                  onUploadPhoto={handleUploadPhoto}
                  isOwner={isOwnProfile}
                />
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
                <InfoItem icon={Mail} label="Email" value={user.email} />
                <InfoItem icon={User} label="Gender" value={user.gender} />
                <InfoItem icon={User} label="Position" value={user.position} />
                <InfoItem icon={MapPin} label="Address" value={user.completeAddress} />
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
                        value={new Date(user.nbiRegistrationDate).toLocaleDateString()}
                      />
                      <InfoItem
                        icon={Calendar}
                        label="Expiration Date"
                        value={new Date(user.nbiExpirationDate).toLocaleDateString()}
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
                        value={new Date(user.fitToWorkExpirationDate).toLocaleDateString()}
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
                <InfoItem icon={User} label="GCash Name" value={user.gcashName} />
                <InfoItem icon={CreditCard} label="GCash Number" value={user.gcashNumber.toString()} />
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
                <InfoItem icon={Calendar} label="Created" value={new Date(user.createdAt).toLocaleDateString()} />
                <InfoItem icon={Calendar} label="Last Updated" value={new Date(user.updatedAt).toLocaleDateString()} />
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="flex justify-between items-center">
                {isOwnProfile && (
                  <Button onClick={() => setShowDeleteDialog(true)} variant="destructive" className="gap-2">
                    <Trash2 className="h-4 w-4" />
                    Delete Profile
                  </Button>
                )}

                {!isOwnProfile && (
                  <div className="flex justify-end gap-4 w-full">
                    {user.role === "admin" || user.role === "superAdmin" ? (
                      <>
                        <Button
                          onClick={() => console.log("Send Store Intro Letter")}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          Send Store Intro Letter
                        </Button>
                        <Button
                          onClick={() => console.log("Send Company ID")}
                          className="bg-purple-600 hover:bg-purple-700"
                        >
                          Send Company ID
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          onClick={() => console.log("Request Store Intro Letter")}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          Request Store Intro Letter
                        </Button>
                        <Button
                          onClick={() => console.log("Request Company ID")}
                          className="bg-indigo-600 hover:bg-indigo-700"
                        >
                          Request Company ID
                        </Button>
                      </>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Delete Confirmation Dialog */}
        <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <DialogContent className="max-w-md">
            <DialogTitle className="text-lg font-semibold text-red-600">Delete Profile</DialogTitle>
            <div className="space-y-4">
              <p className="text-gray-600">
                Are you sure you want to delete your profile? This action cannot be undone and will permanently remove
                all your data.
              </p>
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setShowDeleteDialog(false)} disabled={isDeleting}>
                  Cancel
                </Button>
                <Button variant="destructive" onClick={handleDeleteProfile} disabled={isDeleting} className="gap-2">
                  {isDeleting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="h-4 w-4" />
                      Delete Profile
                    </>
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </RouteGuard>
  )
}
