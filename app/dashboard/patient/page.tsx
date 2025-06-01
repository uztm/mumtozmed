"use client";

import React from "react";
import { useUser } from "@/hooks/useUser";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { User, Mail, Calendar, Phone, ClipboardList } from "lucide-react";

export default function Page() {
  const { user, loading } = useUser();

  if (loading) return <Skeleton className="w-full h-60 rounded-md" />;

  if (!user)
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-muted-foreground text-lg">No user found.</p>
      </div>
    );

  return (
    <div className="w-full min-h-screen bg-background flex justify-center py-16 px-4">
      <Card className="max-w-lg w-full shadow-lg border border-gray-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="text-3xl font-extrabold flex items-center gap-2">
            <User className="text-primary" /> Patient Profile
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Your personal information overview
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Full Name */}
          <div className="flex items-center gap-4">
            <User className="text-primary" />
            <div>
              <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                Full Name
              </p>
              <p className="text-lg font-medium">{user.fullName}</p>
            </div>
          </div>

          <Separator />

          {/* Email */}
          <div className="flex items-center gap-4">
            <Mail className="text-primary" />
            <div>
              <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">Email</p>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <p
                      className="text-lg font-medium cursor-pointer underline decoration-primary decoration-dotted"
                      title="Click to copy email"
                      onClick={() => navigator.clipboard.writeText(user.email)}
                    >
                      {user.email}
                    </p>
                  </TooltipTrigger>
                  <TooltipContent>Copied!</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>

          <Separator />

          {/* Role */}
          <div className="flex items-center gap-4">
            <ClipboardList className="text-primary" />
            <div>
              <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">Role</p>
              <p className="text-lg font-medium capitalize">{user.role}</p>
            </div>
          </div>

          <Separator />

          {/* Phone Number */}
          <div className="flex items-center gap-4">
            <Phone className="text-primary" />
            <div>
              <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">Phone Number</p>
              <p className="text-lg font-medium">{user.phoneNumber || "-"}</p>
            </div>
          </div>

          <Separator />

          {/* Date of Birth */}
          <div className="flex items-center gap-4">
            <Calendar className="text-primary" />
            <div>
              <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">Date of Birth</p>
              <p className="text-lg font-medium">{user.dateOfBirth || "-"}</p>
            </div>
          </div>

          <Separator />

          {/* Doctor ID */}
          <div className="flex items-center gap-4">
            <ClipboardList className="text-primary" />
            <div>
              <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">Doctor ID</p>
              <p className="text-lg font-medium">{user.doctor || "-"}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
