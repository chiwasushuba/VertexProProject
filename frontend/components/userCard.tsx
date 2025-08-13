import React from 'react';
import { UserType } from '@/types/userType';
import { Card, CardTitle } from './ui/card';
import { Button } from './ui/button';

const UserCard = ({ name, email, verified }: UserType) => {
  return (
    <Card className="w-full bg-white shadow-lg rounded-lg p-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
      {/* User Info */}
      <div>
        <CardTitle className="text-[1.5rem] font-bold text-gray-800">
          {name}
        </CardTitle>
        <p className="text-gray-600">{email}</p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2">
        <Button>Edit</Button>
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
