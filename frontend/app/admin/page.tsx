'use client'

import Header from '@/components/header'
import React, { useEffect, useState } from 'react'
import { UserType } from '@/types/userType'
import UserCard from '@/components/userCard'
import api from '@/utils/axios'
import { AxiosError } from 'axios'

const Page = () => {
  const signedUser = true // This should be replaced with actual user authentication logic
  const [users, setUsers] = useState<UserType[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const res = await api.get("/user")
        console.log(res)

        // Normalize API response to fit UserType
        const normalizedUsers: UserType[] = res.data.map((user: any) => ({
          id: user.id || user._id,
          name: user.name || `${user.firstName} ${user.lastName}`,
          email: user.email,
          pfp: user.profileImage || user.pfp,
          verified: user.verified,
        }))

        setUsers(normalizedUsers)
      } catch (err) {
        const error = err as AxiosError<{ message?: string }>
        setError(error.response?.data?.message || "Failed to fetch admins")
      } finally {
        setLoading(false)
      }
    }

    fetchAdmins()
  }, [])

      // Verify handler
    const handleVerify = async (id: string) => {
      try {
        await api.patch(`/user/verify/${id}`)
        setUsers(prev =>
          prev.map(user =>
            user.id === id ? { ...user, verified: true } : user
          )
        )
      } catch (err) {
        console.error("Failed to verify user:", err)
      }
    }

    // Unverify handler
    const handleUnverify = async (id: string) => {
      try {
        await api.patch(`/user/unverify/${id}`)
        setUsers(prev =>
          prev.map(user =>
            user.id === id ? { ...user, verified: false } : user
          )
        )
      } catch (err) {
        console.error("Failed to unverify user:", err)
      }
    }

  return (
    <div className="flex min-h-screen min-w-screen flex-col items-center bg-gradient-to-br from-[#3f5a36] via-[#5f725d] to-[#374f2f]">
      {signedUser ? <Header variant='signedUser' /> : <Header variant='noSignedUser' />}

      <div className='flex w-11/12 sm:w-8/12 min-h-screen flex-col items-center justify-start gap-5 bg-gray-200 rounded-lg shadow-lg p-6 mb-5'>
        <h1 className='text-[2rem] font-bold text-black'>Admin Page</h1>

        <div className='w-full max-w-4xl'>
          {loading && <p className="text-black">Loading admins...</p>}
          {error && <p className="text-red-500">{error}</p>}
          {!loading && !error && users.length === 0 && (
            <p className="text-black">No admins found</p>
          )}
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
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Page