'use client'

import Header from '@/components/header'
import { Input } from '@/components/ui/input'
import { Label } from '@radix-ui/react-label'
import React, { useState } from 'react'

const SignupPage = () => {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [middleName, setMiddleName] = useState('')
  const [positionTitle, setPositionTitle] = useState('') // for future dropdown
  const [email, setEmail] = useState('')
  const [registrationDate, setRegistrationDate] = useState('')
  const [nbiRegistration, setNbiRegistration] = useState<File | null>(null)
  const [fitToWork, setFitToWork] = useState<File | null>(null)
  const [gcashNumber, setGcashNumber] = useState('')
  const [gcashName, setGcashName] = useState('')
  const [idPhoto, setIdPhoto] = useState<File | null>(null)
  const [address, setAddress] = useState('') // optional, if you add Google Maps/address

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
          <Input placeholder='Last Name' value={lastName} onChange={(e) => setLastName(e.target.value)} />
        </div>

        <div className='w-full'>
          <Label>Middle Name</Label>
          <Input placeholder='Middle Name' value={middleName} onChange={(e) => setMiddleName(e.target.value)} />
        </div>

        {/* Add dropdown here */}
        {/* Example: 
        <div className='w-full'>
          <Label>Position Title</Label>
          <select value={positionTitle} onChange={(e) => setPositionTitle(e.target.value)} className='w-full border rounded p-2'>
            <option value=''>Select position</option>
            <option value='Manager'>Manager</option>
            <option value='Staff'>Staff</option>
            ...
          </select>
        </div>
        */}

        <div className='w-full'>
          <Label>Email</Label>
          <Input placeholder='Email' type='email' value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>

        {/* Optional Google Maps/address input */}
        {/* <div className='w-full'>
          <Label>Address</Label>
          <Input placeholder='Address' value={address} onChange={(e) => setAddress(e.target.value)} />
        </div> */}

        <div className='w-full'>
          <Label>Registration Date</Label>
          <Input type='date' value={registrationDate} onChange={(e) => setRegistrationDate(e.target.value)} />
        </div>

        <div className='w-full'>
          <Label>Upload NBI Registration</Label>
          <Input type='file' onChange={(e) => setNbiRegistration(e.target.files?.[0] || null)} />
        </div>

        <div className='w-full'>
          <Label>Upload Fit to Work</Label>
          <Input type='file' onChange={(e) => setFitToWork(e.target.files?.[0] || null)} />
        </div>

        <div className='w-full'>
          <Label>GCash Number</Label>
          <Input placeholder='GCash Number' value={gcashNumber} onChange={(e) => setGcashNumber(e.target.value)} />
        </div>

        <div className='w-full'>
          <Label>GCash Name</Label>
          <Input placeholder='GCash Name' value={gcashName} onChange={(e) => setGcashName(e.target.value)} />
        </div>

        <div className='w-full'>
          <Label>Upload ID Photo</Label>
          <Input type='file' onChange={(e) => setIdPhoto(e.target.files?.[0] || null)} />
        </div>

        <button className='mt-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition'>Submit</button>
      </form>
    </div>
  )
}

export default SignupPage
