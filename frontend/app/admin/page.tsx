'use client'

import Header from '@/components/header'
import React, {useEffect, useState} from 'react'
import { UserType } from '@/types/userType'
import UserCard from '@/components/userCard'




const page = () => {

  const signedUser = true // This should be replaced with actual user authentication logic
  const sampleUsers: UserType[] = [
    {
      id: '1',
      name: 'John Doe',
      email: 'john.doe@gmail.com',
      pfp: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqT1nFXt_nZYKVIx4coe2GFqo1lNqcM5OpRw&s',
      verified: false
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane.smith@gmail.com',
      pfp: 'https://media.tenor.com/d532ir4rUe0AAAAe/charmander.png',
      verified: true
    },
    {
      id: '3',
      name: 'Alice Johnson',
      email: 'alice.johnson@gmail.com',
      pfp: 'https://thestartbutton89.wordpress.com/wp-content/uploads/2013/09/tumblr_msmyklesso1svlwhbo1_1280.png',
      verified: false
    }
  ]

  const [users, setUsers] = useState<UserType[]>([])

  useEffect(() => {
    setUsers(sampleUsers)
  }, [])


  return (
    <div className="flex min-h-screen min-w-screen flex-col items-center bg-gradient-to-br from-[#3f5a36] via-[#5f725d] to-[#374f2f]">
      {signedUser ?
      <Header variant='signedUser' /> : <Header variant='noSignedUser' />}
      <div className='flex w-11/12 sm:w-8/12 min-h-screen flex-col items-center justify-start gap-5 bg-gray-200 rounded-lg shadow-lg p-6 mb-5'>
        <h1 className='text-[2rem] font-bold text-black'>Admin Page</h1>
        {/* <p className='text-lg text-black'>Manage users and settings</p> */}
        <div className='w-full max-w-4xl'>
          {users.map(user => (
            <UserCard
              key={user.id}
              id={user.id}
              name={user.name}
              email={user.email}
              verified={user.verified}
              pfp={user.pfp}
            />
          ))}
        </div>


      </div>

    </div>
  )
}

export default page