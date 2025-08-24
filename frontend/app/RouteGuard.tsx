"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuthContext } from "@/hooks/useAuthContext"; // your context/hook

export default function AdminRouteGuard({ children }: { children: React.ReactNode }) {
  const { userInfo } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    if (!userInfo) {
      router.replace("/login");
    } else if (userInfo.role !== "admin") {
      router.replace("/unauthorized");
    }
  }, [userInfo, router]);

  if (!userInfo || userInfo.role !== "admin") {
    return null;
  }

  return <>{children}</>;
}
