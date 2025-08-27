"use client";

import Link from "next/link";
import { useAuthContext } from "@/hooks/useAuthContext";

const UnauthorizedPage = () => {
  const { userInfo } = useAuthContext();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold text-red-600 mb-4">Unauthorized</h1>
      <p className="text-lg text-gray-700 mb-6">
        You do not have permission to access this page.
      </p>
      {userInfo ? (
        <Link href="/" className="text-blue-600 underline">
          Go back to Home
        </Link>
      ) : (
        <Link href="/login" className="text-blue-600 underline">
          Go to Login
        </Link>
      )}
    </div>
  );
};

export default UnauthorizedPage;
