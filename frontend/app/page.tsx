import Header from '@/components/header'
import React from 'react'
import { RouteGuard } from './RouteGuard'
import NavigationDialog from '@/components/navigationDialog'

const MainPage = () => {
  return (
    <RouteGuard>
    <div className='flex min-h-screen w-full flex-col items-center bg-gradient-to-br from-[#3f5a36] via-[#5f725d] to-[#374f2f]'>
      <Header variant='signedUser' />
    </div>
    </RouteGuard>
  )
}

export default MainPage