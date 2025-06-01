"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { User2, Stethoscope, ClipboardList } from "lucide-react";

const cmds = [
  {
    name: "Doctors",
    icon: <Stethoscope className="w-8 h-8" />,
    content: "Manage doctors, schedules, and profiles.",
  },
  {
    name: "Nurses",
    icon: <ClipboardList className="w-8 h-8" />,
    content: "Assign nurses and track availability.",
  },
  {
    name: "Users",
    icon: <User2 className="w-8 h-8" />,
    content: "View registered users and permissions.",
  },
];

export default function Page() {
  return (
    <div className="w-full min-h-[100vh] bg-background py-10">
      <div className="container mx-auto px-4">
        <div
          className="w-full h-[120px] rounded-md mb-5 flex items-center px-12 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://avatars.mds.yandex.net/i?id=15d8c8e8531a916cc89ba7429b065889_l-4936065-images-thumbs&n=13')",
          }}
        >
          <h1 className="font-bold text-2xl text-white drop-shadow">
            Admin Dashboard
          </h1>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {cmds.map((cmd, i) => (
            <Dialog key={i}>
              <DialogTrigger asChild>
                <div className="bg-card  p-6 rounded-md shadow text-center cursor-pointer hover:bg-primary/90 hover:text-white text-foreground transition">
                  <div className="flex justify-center mb-2">{cmd.icon}</div>
                  <div className="font-semibold">{cmd.name}</div>
                </div>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{cmd.name}</DialogTitle>
                </DialogHeader>
                <div className="mt-2 text-muted-foreground">{cmd.content}</div>
              </DialogContent>
            </Dialog>
          ))}
        </div>
      </div>
    </div>
  );
}
