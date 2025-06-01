"use client";

import { isLoggedIn } from "@/hooks/auth.ts";
import { useUser } from "@/hooks/useUser";
import { useRouter } from "next/navigation"; // Important: use next/navigation for app dir
import { useEffect } from "react";

export default function Page() {
  const { user, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoggedIn()) {
      router.push("/auth/login");
    } else if (!loading && user) {
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

  return <div>Loading...</div>;
}
