"use client";
import React, { useEffect } from "react";
import { useUser } from "@/hooks/useUser";
import { useRouter } from "next/navigation";

export default function Page() {
  const { user, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      switch (user.role) {
        case "AdminDoctor":
          router.push("/dashboard/admin");
          break;
        case "Doctor":
          router.push("/dashboard/doctor");
          break;
        case "Moderator":
          router.push("/dashboard/nurse");
          break;
        case "Patient":
          router.push("/dashboard/patient");
          break;
        default:
          router.push("/");
      }
    }
  }, [user, loading, router]);

  return (
    <div className="w-full h-[70vh] flex items-center justify-center bg-background">
      <h1 className="font-bold text-4xl">Loading Redirecting</h1>
    </div>
  );
}
