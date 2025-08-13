'use client'

import Header from '@/components/header'
import React, {useState} from 'react'
import { UserType } from '@/types/userType'




const page = () => {

  const [user, setUser] = useState<UserType | null>(null)

  return (
    <div className="flex min-h-screen min-w-screen flex-col items-center bg-gradient-to-br from-[#3f5a36] via-[#5f725d] to-[#374f2f]">
      { user ?
      <Header variant='signedUser' /> : <Header variant='noSignedUser' />}


    </div>
  )
}

export default page