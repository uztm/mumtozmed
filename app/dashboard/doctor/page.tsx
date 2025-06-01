"use client";

import { useEffect, useState } from "react";
import {
  Stethoscope,
  ClipboardList,
  Search,
  Plus,
  Users,
  Calendar,
  Activity,
} from "lucide-react";
import PatientsDoctor from "@/components/demo/patientsDoctor";
import { isLoggedIn } from "@/hooks/auth.ts";
import { LoadDoctorsPatientsByDoctorIdCmd } from "@/app/api/apiService";
import { useUser } from "@/hooks/useUser";
import type { Patient } from "@/types/Patient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function DashboardPage() {
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null);
  const { user, loading: userLoading } = useUser();
  const [data, setData] = useState<Patient[]>();
  const [filteredData, setFilteredData] = useState<Patient[]>();
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoadingPatients, setIsLoadingPatients] = useState(false);
  const [error, setError] = useState<string>("");

  const getMyPatients = async () => {
    if (!user) return;

    setIsLoadingPatients(true);
    setError("");

    try {
      const res = await LoadDoctorsPatientsByDoctorIdCmd(user.id);
      setData(res);
      setFilteredData(res);
      console.log({ res });
    } catch (error) {
      console.error("Error fetching patients:", error);
      setError("Failed to load patients. Please try again.");
    } finally {
      setIsLoadingPatients(false);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (!data) return;

    if (query.trim() === "") {
      setFilteredData(data);
    } else {
      const filtered = data.filter(
        (patient) =>
          patient.fullName?.toLowerCase().includes(query.toLowerCase()) ||
          patient.email?.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredData(filtered);
    }
  };

  useEffect(() => {
    setLoggedIn(isLoggedIn());

    if (user) {
      getMyPatients();
    }
  }, [user]);

  const stats = [
    {
      title: "Total Patients",
      value: data?.length || 0,
      icon: Users,
      description: "Active patients under your care",
    },
    {
      title: "Today's Appointments",
      value: "8",
      icon: Calendar,
      description: "Scheduled for today",
    },
    {
      title: "Pending Reviews",
      value: "3",
      icon: ClipboardList,
      description: "Medical records to review",
    },
    {
      title: "Critical Cases",
      value: "2",
      icon: Activity,
      description: "Require immediate attention",
    },
  ];

  if (userLoading) {
    return (
      <div className="w-full min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="space-y-6">
            <Skeleton className="h-8 w-64" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-32" />
              ))}
            </div>
            <Skeleton className="h-10 w-full max-w-md" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-48" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Welcome back, Dr. {user?.fullName || "Doctor"}
              </h1>
              <p className="text-muted-foreground">
                Here's an overview of your patients and today's schedule
              </p>
            </div>
            <Button className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add New Patient
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <stat.icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {stat.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Patients Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold flex items-center gap-2">
                <Stethoscope className="w-6 h-6" />
                My Patients
                {data && (
                  <Badge variant="secondary" className="ml-2">
                    {filteredData?.length || 0} of {data.length}
                  </Badge>
                )}
              </h2>
              <p className="text-muted-foreground mt-1">
                Manage and monitor your patient records
              </p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search patients by name, email, or phone..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Error State */}
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Loading State */}
          {isLoadingPatients && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <Card key={i}>
                  <CardHeader>
                    <div className="flex items-center space-x-4">
                      <Skeleton className="h-12 w-12 rounded-full" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-24" />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <Skeleton className="h-3 w-full" />
                      <Skeleton className="h-3 w-3/4" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Patients Grid */}
          {!isLoadingPatients && filteredData && (
            <>
              {filteredData.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {filteredData.map((item, index) => (
                    <PatientsDoctor
                      item={item}
                      key={index}
                      index={index}
                      showButtons={true}
                      load={true}
                    />
                  ))}
                </div>
              ) : (
                <Card className="text-center py-12">
                  <CardContent>
                    <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">
                      {searchQuery ? "No patients found" : "No patients yet"}
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      {searchQuery
                        ? `No patients match "${searchQuery}". Try adjusting your search.`
                        : "You haven't added any patients yet. Start by adding your first patient."}
                    </p>
                    {!searchQuery && (
                      <Button className="flex items-center gap-2 mx-auto">
                        <Plus className="w-4 h-4" />
                        Add Your First Patient
                      </Button>
                    )}
                    {searchQuery && (
                      <Button
                        variant="outline"
                        onClick={() => handleSearch("")}
                        className="mx-auto"
                      >
                        Clear Search
                      </Button>
                    )}
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
