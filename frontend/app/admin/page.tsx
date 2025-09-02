'use client'

import Header from '@/components/header'
import React, { useEffect, useState } from 'react'
import { UserType } from '@/types/userType'
import UserCard from '@/components/userCard'
import api from '@/utils/axios'
import { AxiosError } from 'axios'
import { RouteGuard } from '../RouteGuard'
import { Label } from '@/components/ui/label'
import { useAuthContext } from '@/hooks/useAuthContext'
import { useRouter } from 'next/navigation'

const Page = () => {
  const { userInfo } = useAuthContext()
  const router = useRouter()

  const currentUserRole: "user" | "admin" | "superAdmin" = (userInfo?.user?.role as any) || "user"
  const currentUserId = userInfo?.user?._id || ""

  const [admins, setAdmins] = useState<UserType[]>([])
  const [users, setUsers] = useState<UserType[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // if there's no authenticated user, stop loading and don't fetch
    if (!userInfo) {
      setLoading(false)
      return
    }

    const fetchAdmins = async () => {
      setLoading(true)
      setError(null)

      try {
        const resAdmin = await api.get("/user/role/admin")
        const resUser = await api.get("/user/role/user")

        const normalizedAdmins: UserType[] = resAdmin.data.map((user: any) => ({
          id: user._id,
          name: `${user.firstName} ${user.lastName}`,
          email: user.email,
          pfp: user.profileImage || user.pfp,
          verified: user.verified,
          role: user.role,
          requestLetter: user.requestLetter ?? false,
          requestId: user.requestId ?? false,
          company_id: user.company_id
        }))

        const normalizedUsers: UserType[] = resUser.data.map((user: any) => ({
          id: user._id,
          name: `${user.firstName} ${user.lastName}`,
          email: user.email,
          pfp: user.profileImage || user.pfp,
          verified: user.verified,
          role: user.role,
          requestLetter: user.requestLetter ?? false,
          requestId: user.requestId ?? false,
          company_id: user.company_id
        }))

        setAdmins(normalizedAdmins)
        setUsers(normalizedUsers)
      } catch (err) {
        const axiosError = err as AxiosError<{ message?: string }>
        setError(axiosError.response?.data?.message || "Failed to fetch admins")
        console.error("fetchAdmins error:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchAdmins()
  }, [userInfo])

  const handleOpenProfile = (id: string) => {
    router.push(`/profile/${id}`)
  }

  const handleVerify = async (id: string) => {
    try {
      await api.patch(`/user/verify/${id}`)

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

  const handleUnverify = async (id: string) => {
    try {
      await api.patch(`/user/unverify/${id}`)

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

  const handleChangeRole = async (
    id: string,
    newRole: "user" | "admin" | "superAdmin"
  ) => {
    try {
      await api.patch(`/user/changerole/${id}`, { role: newRole });

      // update local state so UI reflects the change immediately
      setUsers(prev =>
        prev.map(user => (user.id === id ? { ...user, role: newRole } : user))
      );
      setAdmins(prev =>
        prev.map(admin => (admin.id === id ? { ...admin, role: newRole } : admin))
      );

      // If you need to reflect this change globally (auth tokens, menus, etc.)
      // you can re-fetch user data or do a full reload. Left commented:
      // window.location.reload();
    } catch (err) {
      console.error("Failed to change role:", err);
    }
  };

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
              <p className="text-black">No users found</p>
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
                  role={admin.role}
                  onVerify={handleVerify}
                  onUnverify={handleUnverify}
                  onDelete={handleDelete}
                  onChangeRole={handleChangeRole}
                  currentUserRole={currentUserRole}
                  currentUserId={currentUserId}
                  onClick={() => handleOpenProfile(admin.id)}
                  requestLetter ={admin.requestLetter}
                  requestId = {admin.requestId}
                  company_id={admin.company_id}
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
                  role={user.role}
                  onVerify={handleVerify}
                  onUnverify={handleUnverify}
                  onDelete={handleDelete}
                  onChangeRole={handleChangeRole}
                  currentUserRole={currentUserRole}
                  currentUserId={currentUserId}
                  onClick={() => handleOpenProfile(user.id)}
                  requestLetter = {user.requestLetter}
                  requestId = {user.requestId}
                  company_id={user.company_id}                
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
