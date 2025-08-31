"use client";

import Link from "next/link";
import { useAuthContext } from "@/hooks/useAuthContext";
import { useLogout } from "@/hooks/useLogout";

const UnauthorizedPage = () => {
  const { userInfo } = useAuthContext();
  const { logout } = useLogout();

  const allowedRoles = ["admin", "superAdmin"]; // example

  const role = userInfo?.user?.role ?? null;
  const verified = userInfo?.user?.verified ?? false;
  const userId = userInfo?.user?._id ?? "";

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold text-red-600 mb-4">Unauthorized</h1>
      <p className="text-lg text-gray-700 mb-6">
        You do not have permission to access this page.
      </p>

      {userInfo ? (
        !verified ? (
          <button
            onClick={logout}
            className="text-blue-600 underline"
          >
            Logout &amp; Login Again (Get Verified First)
          </button>
        ) : (
          !(allowedRoles.includes(role ?? "")) && (
            <Link
              href={`/profile/${userId}`}
              className="text-blue-600 underline"
            >
              Go back to Profile
            </Link>
          )
        )
      ) : (
        <Link href="/login" className="text-blue-600 underline">
          Go to Login
        </Link>
      )}
    </div>
  );
};

export default UnauthorizedPage;
