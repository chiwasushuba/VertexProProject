import React from 'react'
import { UserType } from '@/types/userType'
import { Card, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from './ui/select'
import { useRouter } from 'next/navigation'

type Props = UserType & {
  onVerify: (id: string) => void
  onUnverify: (id: string) => void
  onDelete: (id: string) => void
  onChangeRole: (id: string, newRole: "user" | "admin" | "superAdmin") => void
  currentUserRole: "user" | "admin" | "superAdmin"
  currentUserId: string
  onClick?: () => void   
}

const UserCard = ({ 
  id, 
  name, 
  email, 
  pfp, 
  verified, 
  role,
  onVerify, 
  onUnverify, 
  onDelete, 
  onChangeRole,
  currentUserRole, 
  currentUserId,
  requestLetter,
  requestId,
  company_id,
  onClick
}: Props) => {
  const router = useRouter()
  const isSelf = id === currentUserId
  const isSuperAdmin = currentUserRole === "superAdmin"
  const targetIsSuperAdmin = role === "superAdmin"

  const handleNavigate = () => {
    if (onClick) {
      onClick()
    } else {
      router.push(`/profile/${id}`)
    }
  }

  // ✅ Build request message
  let requestMessage = ""
  if (requestId && requestLetter) {
    requestMessage = "Requesting ID and Letter..."
  } else if (requestId) {
    requestMessage = "Requesting ID..."
  } else if (requestLetter) {
    requestMessage = "Requesting Letter..."
  }

  return (
    <Card 
      className="w-full bg-white shadow-lg rounded-lg p-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 cursor-pointer hover:shadow-xl transition"
      onClick={handleNavigate}
    >
      {/* User Info */}
      <div className='flex items-center gap-4'>
        <Avatar className='w-16 h-16 rounded-full'>
          <AvatarImage className='rounded-full' src={pfp} />
          <AvatarFallback className='rounded-full'>
            {name ? name[0] : "?"}
          </AvatarFallback>
        </Avatar>
        <div>
          <CardTitle className="text-[1.5rem] font-bold text-gray-800">
            {name}
          </CardTitle>
          <p className="text-gray-600">{email} | {company_id}</p>

          {requestMessage && (
            <p className="text-gray-600 italic">{requestMessage}</p>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      {!isSelf && (
        <div 
          className="flex flex-wrap gap-2 items-center"
          onClick={(e) => e.stopPropagation()} // prevent triggering navigation
        >
          {!targetIsSuperAdmin || isSuperAdmin ? (
            <>
              {verified ? (
                <Button
                  className="bg-red-400 hover:bg-red-500"
                  onClick={() => onUnverify(id)}
                >
                  Unverify
                </Button>
              ) : (
                <Button
                  className="bg-green-400 hover:bg-green-500"
                  onClick={() => onVerify(id)}
                >
                  Verify
                </Button>
              )}

              {isSuperAdmin && (
                <Select
                  value={role}
                  onValueChange={(newRole) => onChangeRole(id, newRole as "user" | "admin" | "superAdmin")}
                >
                  <SelectTrigger className="w-[150px] bg-blue-100">
                    <SelectValue placeholder="Change Role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="superAdmin">Super Admin</SelectItem>
                  </SelectContent>
                </Select>
              )}

              {isSuperAdmin && (
                <Button 
                  className="bg-red-600 hover:bg-red-700" 
                  onClick={() => onDelete(id)}
                >
                  Delete
                </Button>
              )}
            </>
          ) : null}
        </div>
      )}
    </Card>
  )
}

export default UserCard
