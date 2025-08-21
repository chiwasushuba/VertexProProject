import React from 'react';
import { UserType } from '@/types/userType';
import { Card, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@radix-ui/react-avatar';

const UserCard = ({id, name, email, pfp,verified }: UserType) => {
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
      <div className="flex flex-wrap gap-2">
        {/* <Button>Edit</Button> */}
        <Button className="text-[0.800rem]">
          Send Intro Letter
        </Button>

        <Button className="bg-red-400 hover:bg-red-500">Delete</Button>
        {verified ? (
          <Button className="bg-red-400 hover:bg-red-500">Unverify</Button>
        ) : (
          <Button className="bg-green-400 hover:bg-green-500">Verify</Button>
        )}
      </div>
    </Card>
  );
};

export default UserCard;
