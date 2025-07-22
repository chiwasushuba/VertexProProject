'use client'

import Header from '@/components/header'
import { Input } from '@/components/ui/input'
import { Label } from '@radix-ui/react-label'
import React, { useState } from 'react'

const SignupPage = () => {
  const [firstName, setFirstName] = useState('')

  return (
    <div className='min-h-screen w-full flex flex-col items-center'>
      <Header variant="default" location="Signup" />

      <form className='flex flex-col gap-4 w-11/12 max-w-xl mt-6 items-center'>
        <Label className='text-5xl'>Signup</Label>

        <div className='w-full'>
          <Label>First Name</Label>
          <Input placeholder='First Name' value={firstName} onChange={(e) => setFirstName(e.target.value)} />
        </div>

        <div className='w-full'>
          <Label>Last Name</Label>
          <Input placeholder='Last Name' />
        </div>

        <div className='w-full'>
          <Label>Middle Name</Label>
          <Input placeholder='Middle Name' />
        </div>

        {/* Add dropdown here */}
        {/* Add position title here */}

        <div className='w-full'>
          <Label>Email</Label>
          <Input placeholder='Email' type='email' />
        </div>

        {/* Optional Google Maps integration for address */}

        <div className='w-full'>
          <Label>Registration Date</Label>
          <Input type='date' />
        </div>

        <div className='w-full'>
          <Label>Upload NBI Registration</Label>
          <Input type='file' />
        </div>

        <div className='w-full'>
          <Label>Upload Fit to Work</Label>
          <Input type='file' />
        </div>

        <div className='w-full'>
          <Label>GCash Number</Label>
          <Input placeholder='GCash Number' />
        </div>

        <div className='w-full'>
          <Label>GCash Name</Label>
          <Input placeholder='GCash Name' />
        </div>

        <div className='w-full'>
          <Label>Upload ID Photo</Label>
          <Input type='file' />
        </div>

        <button className='mt-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition'>Submit</button>
      </form>
    </div>
  )
}

export default SignupPage
