"use client";

import React, { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import PatientsDoctor from "@/components/demo/patientsDoctor";
import { useUser } from "@/hooks/useUser";
import { LoadAllPatientsCmd, LoadAllDoctorsCmd } from "@/app/api/apiService";
import { PatientsResponse, Patient } from "@/types/Patient"; // You might also have Doctor/Moderator types
import { isLoggedIn } from "@/hooks/auth.ts";
import CreateDialog from "@/components/cmd/createDialog";

export default function Page() {
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null);
  const [activeTab, setActiveTab] = useState<
    "patients" | "doctors" | "moderators"
  >("patients");

  const { user, loading } = useUser();
  const [data, setData] = useState<PatientsResponse>();

  const fetchDataByTab = async (tab: typeof activeTab) => {
    try {
      switch (tab) {
        case "patients": {
          const res = await LoadAllPatientsCmd();
          setData(res);
          break;
        }
        case "doctors": {
          const res = await LoadAllDoctorsCmd();
          setData(res);
          break;
        }

        default:
          break;
      }
    } catch (error) {
      console.error(`Error loading ${tab}:`, error);
    }
  };

  useEffect(() => {
    setLoggedIn(isLoggedIn());
    if (user) {
      fetchDataByTab(activeTab);
    }
  }, [user, activeTab]);

  const [openDialog, setOpenDialog] = useState(false);
  const [createRole, setCreateRole] = useState<"patient" | "doctor">("patient");

  return (
    <div className="w-full min-h-[100vh] bg-background py-10">
      <div className="container mx-auto px-4">
        <h1 className=" mb-5 font-bold">
          Hello {loading ? "Loading..." : `${user?.fullName}`}
        </h1>
        <Tabs
          defaultValue="patients"
          value={activeTab}
          onValueChange={(val) => setActiveTab(val as typeof activeTab)}
          className="w-full"
        >
          <TabsList className="mb-4">
            <TabsTrigger value="patients">Patients</TabsTrigger>
            <TabsTrigger value="doctors">Doctors</TabsTrigger>
          </TabsList>

          <TabsContent value="patients">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-semibold">Patients</h1>
              <Button
                onClick={() => {
                  setCreateRole("patient");
                  setOpenDialog(true);
                }}
              >
                Create Patient
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {data?.items.map((item, index) => (
                <PatientsDoctor key={index} item={item} index={index} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="doctors">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-semibold">Doctors</h1>
              <Button
                onClick={() => {
                  setCreateRole("doctor");
                  setOpenDialog(true);
                }}
              >
                Create Doctor
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {data?.items.map((item, index) => (
                <PatientsDoctor key={index} item={item} index={index} />
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <CreateDialog
          isOpen={openDialog}
          onClose={() => setOpenDialog(false)}
          roleType={createRole}
        />
      </div>
    </div>
  );
}
