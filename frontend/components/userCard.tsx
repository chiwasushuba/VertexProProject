import React from 'react';
import { UserType } from '@/types/userType';
import { Card, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@radix-ui/react-avatar';

type Props = UserType & {
  onVerify: (id: string) => void;
  onUnverify: (id: string) => void;
  onDelete: (id: string) => void;
  currentUserRole: "user" | "admin" | "superAdmin";
  currentUserId: string;
};

const UserCard = ({ 
  id, 
  name, 
  email, 
  pfp, 
  verified, 
  onVerify, 
  onUnverify, 
  onDelete, 
  currentUserRole, 
  currentUserId 
}: Props) => {
  const isSelf = id === currentUserId;

  return (
    <Card className="w-full bg-white shadow-lg rounded-lg p-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
      {/* User Info */}
      <div className='flex items-center gap-4'>
        <Avatar className='w-16 h-16 rounded-full'>
          <AvatarImage className='rounded-full' src={pfp} />
          <AvatarFallback className='rounded-full'>CN</AvatarFallback>
        </Avatar>
        <div>
          <CardTitle className="text-[1.5rem] font-bold text-gray-800">
            {name}
          </CardTitle>
          <p className="text-gray-600">{email}</p>
        </div>
      </div>

      {/* Action Buttons */}
      {!isSelf && (
        <div className="flex flex-wrap gap-2">
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

          {/* Only superAdmin can Delete */}
          {currentUserRole === "superAdmin" && (
            <Button 
              className="bg-red-600 hover:bg-red-700" 
              onClick={() => onDelete(id)}
            >
              Delete
            </Button>
          )}
        </div>
      )}
    </Card>
  );
};

export default UserCard;
