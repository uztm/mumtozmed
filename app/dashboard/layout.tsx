"use client";

import Navbar from "@/components/common/navbar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="pt-[100px]">
      <Navbar />
      {children}
    </div>
  );
}
