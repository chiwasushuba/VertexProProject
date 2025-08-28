'use client'

import Header from '@/components/header'
import React, { useEffect, useState } from 'react'
import { UserType } from '@/types/userType'
import UserCard from '@/components/userCard'
import api from '@/utils/axios'
import { AxiosError } from 'axios'
import { RouteGuard } from '../RouteGuard'
import { Label } from '@/components/ui/label'
import { useAuthContext } from '@/hooks/useAuthContext'  // ✅ bring in auth
import { useRouter } from 'next/navigation'

const Page = () => {
  const { userInfo } = useAuthContext()
  const router = useRouter()

  // // If no user info, redirect to login (or another page)
  // useEffect(() => {
  //   if (!userInfo) {
  //     router.push("/login")
  //   }
  // }, [userInfo, router])

  const currentUserRole: "user" | "admin" | "superAdmin" = userInfo?.user?.role || "user"
  const currentUserId = userInfo?.user?._id || "" // <-- dynamic user id

  const [admins, setAdmins] = useState<UserType[]>([])
  const [users, setUsers] = useState<UserType[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const resAdmin = await api.get("/user/role/admin")
        const resUser = await api.get("/user/role/user")

        const normalizedAdmins: UserType[] = resAdmin.data.map((user: any) => ({
          id: user.id || user._id,
          name: user.name || `${user.firstName} ${user.lastName}`,
          email: user.email,
          pfp: user.profileImage || user.pfp,
          verified: user.verified,
        }))

        const normalizedUsers: UserType[] = resUser.data.map((user: any) => ({
          id: user.id || user._id,
          name: user.name || `${user.firstName} ${user.lastName}`,
          email: user.email,
          pfp: user.profileImage || user.pfp,
          verified: user.verified,
        }))

        setUsers(normalizedUsers)
        setAdmins(normalizedAdmins)
      } catch (err) {
        const error = err as AxiosError<{ message?: string }>
        setError(error.response?.data?.message || "Failed to fetch admins")
      } finally {
        setLoading(false)
      }
    }

    if (userInfo) {
      fetchAdmins()
    }
  }, [userInfo])

  // ✅ Verify handler
  const handleVerify = async (id: string) => {
    try {
      await api.patch(`/user/verify/${id}`)

      // update both users and admins
      setUsers(prev =>
        prev.map(user =>
          user.id === id ? { ...user, verified: true } : user
        )
      )
      setAdmins(prev =>
        prev.map(admin =>
          admin.id === id ? { ...admin, verified: true } : admin
        )
      )
    } catch (err) {
      console.error("Failed to verify user:", err)
    }
  }

  // ✅ Unverify handler
  const handleUnverify = async (id: string) => {
    try {
      await api.patch(`/user/unverify/${id}`)

      // update both users and admins
      setUsers(prev =>
        prev.map(user =>
          user.id === id ? { ...user, verified: false } : user
        )
      )
      setAdmins(prev =>
        prev.map(admin =>
          admin.id === id ? { ...admin, verified: false } : admin
        )
      )
    } catch (err) {
      console.error("Failed to unverify user:", err)
    }
  }

  // Delete handler (only superAdmin)
  const handleDelete = async (id: string) => {
    if (currentUserRole !== "superAdmin") return
    try {
      await api.delete(`/user/${id}`)
      setUsers(prev => prev.filter(user => user.id !== id))
      setAdmins(prev => prev.filter(admin => admin.id !== id))
    } catch (err) {
      console.error("Failed to delete user:", err)
    }
  }

  return (
    <RouteGuard allowedRoles={["admin", "superAdmin"]}>
      <div className="flex min-h-screen min-w-screen flex-col items-center bg-gradient-to-br from-[#3f5a36] via-[#5f725d] to-[#374f2f]">
        {userInfo ? <Header variant='signedUser' /> : <Header variant='noSignedUser' />}

        <div className='flex w-11/12 sm:w-8/12 min-h-screen flex-col items-center justify-start gap-5 bg-gray-200 rounded-lg shadow-lg p-6 mb-5'>
          <h1 className='text-[2rem] font-bold text-black'>Admin Page</h1>

          <div className='flex flex-col w-full max-w-4xl gap-10'>
            {loading && <p className="text-black">Loading admins...</p>}
            {error && <p className="text-red-500">{error}</p>}
            {!loading && !error && users.length === 0 && (
              <p className="text-black">No admins found</p>
            )}
            
            <div className='flex flex-col gap-2'>
              <Label className='text-2xl'>Admins: </Label>
              {admins.map(admin => (
                <UserCard
                  key={admin.id}
                  id={admin.id}
                  name={admin.name}
                  email={admin.email}
                  verified={admin.verified}
                  pfp={admin.pfp}
                  onVerify={handleVerify}
                  onUnverify={handleUnverify}
                  onDelete={handleDelete}
                  currentUserRole={currentUserRole}
                  currentUserId={currentUserId}
                />
              ))}
            </div>

            <div className='flex flex-col gap-2'>
              <Label className='text-2xl'>Users: </Label>
              {users.map(user => (
                <UserCard
                  key={user.id}
                  id={user.id}
                  name={user.name}
                  email={user.email}
                  verified={user.verified}
                  pfp={user.pfp}
                  onVerify={handleVerify}
                  onUnverify={handleUnverify}
                  onDelete={handleDelete}
                  currentUserRole={currentUserRole}
                  currentUserId={currentUserId}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </RouteGuard>
  )
}

export default Page
