'use client'

import Header from '@/components/header'
import React, {useEffect, useState} from 'react'
import { UserType } from '@/types/userType'
import UserCard from '@/components/userCard'




const page = () => {

  const [user, setUser] = useState<UserType | null>(null)

  useEffect(() => {
    setUser({
      id: '1',
      name: 'John Doe',
      email: 'john.doe@gmail.com',
      verified: false
    })
  }, [])

  return (
    <div className="flex min-h-screen min-w-screen flex-col items-center bg-gradient-to-br from-[#3f5a36] via-[#5f725d] to-[#374f2f]">
      { user ?
      <Header variant='signedUser' /> : <Header variant='noSignedUser' />}
      <div className='flex w-11/12 sm:w-8/12 min-h-screen flex-col items-center justify-start gap-5 bg-gray-200 rounded-lg shadow-lg p-6 mb-5'>
        <h1 className='text-[2rem] font-bold text-black'>Admin Page</h1>
        {/* <p className='text-lg text-black'>Manage users and settings</p> */}
        <div className='w-full max-w-4xl'>
          {user && (
          <UserCard id={user.id} name={user.name} email={user.email} verified={user.verified}/>
        )}
        </div>


      </div>

    </div>
  )
}

export default page