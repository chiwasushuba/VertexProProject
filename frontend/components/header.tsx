import { Link } from 'lucide-react'
import React from 'react'

const Header = () => {
  const user = {

  }

  return (
    <div className='absolute top-0 flex justify-between items-center w-screen h-13 bg-gray-600'>
        <div className='flex items-center justify-center border border-solid pl-10 pr-10 ml-10'>
            Logo
        </div>
        <div className='flex items-center justify-center border border-solid pl-10 pr-10 mr-10'>
            Logout
        </div>
    </div>
  )
}

export default Header