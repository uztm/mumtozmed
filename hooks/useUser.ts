"use client";

import { MeCmd } from "@/app/api/apiService";
import { useState, useEffect } from "react";

export interface UserProfile {
  id: string;
  email: string;
  role: "AdminDoctor" | "Doctor" | "Moderator" | "Patient";
  fullName: string;

  phoneNumber?: string;
  dateOfBirth?: string;
  doctor?: string;
}


export function useUser() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await MeCmd();
        setUser(res);
      } catch (err) {
        console.error("Failed to fetch user:", err);
        window.location.href = "/auth/register";
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return { user, loading };
}
