"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Home,
  Stethoscope,
  Search,
  Filter,
  Plus,
  Download,
  Upload,
  MoreHorizontal,
  RefreshCw,
  AlertTriangle,
  ChevronLeft,
  Calendar,
  Users,
  Clock,
  UserPlus,
  Star,
  Trash2,
} from "lucide-react";
import { crud } from "@/app/api/apiService";
import type { PatientsResponse } from "@/types/Patient";
import { DataTableDemo } from "@/components/demo/dataTable";
import CreateDialog from "@/components/cmd/createDialog";
import { toast } from "sonner";

interface Doctor {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  specialization?: string;
  department?: string;
  status?: "active" | "inactive" | "on-leave";
  patientsCount?: number;
  rating?: number;
  experience?: number;
  location?: string;
}

export default function DoctorsPage() {
  const [data, setData] = useState<PatientsResponse>();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [createRole, setCreateRole] = useState<"patient" | "doctor">("doctor");
  const [selectedTab, setSelectedTab] = useState("all");

  const getDoctors = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await crud.loadAll("Doctor");
      setData(res);
      
    } catch (err) {
      console.error("Failed to load doctors:", err);
      setError("Failed to load doctors. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getDoctors();
  }, [getDoctors]);



  const handleTabChange = (value: string) => {
    setSelectedTab(value);
    if (!data?.items) return;

   
  };

  const handleRefresh = () => {
    getDoctors();
    toast.success("Doctor data refreshed");
  };

  const handleExport = () => {
    toast.success("Exporting doctor data...");
    // Implementation for exporting data would go here
  };

  const handleBulkDelete = () => {
    toast.error("Bulk delete is not implemented yet");
    // Implementation for bulk delete would go here
  };

  const doctorStats = {
    total: data?.items.length || 0,
    active: data?.items.filter((d) => d.status === "active").length || 0,
    onLeave: data?.items.filter((d) => d.status === "on-leave").length || 0,
    newThisMonth: 3, // Example static data
  };

  const specializations = [
    { name: "Cardiology", count: 8, icon: "❤️" },
    { name: "Neurology", count: 6, icon: "🧠" },
    { name: "Orthopedics", count: 5, icon: "🦴" },
    { name: "Pediatrics", count: 4, icon: "👶" },
    { name: "General Medicine", count: 12, icon: "🩺" },
  ];

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link
            href="/dashboard/admin"
            className="flex items-center gap-1 hover:text-foreground transition-colors"
          >
            <Home className="h-3.5 w-3.5" />
            <span>Admin</span>
          </Link>
          <ChevronLeft className="h-3.5 w-3.5 rotate-180" />
          <span className="text-foreground font-medium">Doctors</span>
        </div>

        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Doctor Management</h1>
            <p className="text-muted-foreground">
              Manage medical staff, schedules, and specializations
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button
              onClick={() => {
                setCreateRole("doctor");
                setOpenDialog(true);
              }}
              className="flex items-center gap-2"
            >
              <UserPlus className="h-4 w-4" />
              Add Doctor
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <MoreHorizontal className="h-4 w-4 mr-2" />
                  Actions
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>Doctor Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleRefresh}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <RefreshCw className="h-4 w-4" />
                  Refresh Data
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleExport}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <Download className="h-4 w-4" />
                  Export Data
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
                  <Upload className="h-4 w-4" />
                  Import Doctors
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
                  <Calendar className="h-4 w-4" />
                  Schedule Management
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleBulkDelete}
                  className="flex items-center gap-2 cursor-pointer text-destructive focus:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                  Bulk Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Doctors
              </CardTitle>
              <Stethoscope className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  doctorStats.total
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {loading ? (
                  <Skeleton className="h-3 w-24" />
                ) : (
                  `${doctorStats.newThisMonth} new this month`
                )}
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Active Doctors
              </CardTitle>
              <Users className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  doctorStats.active
                )}
              </div>
              <p className="text-xs text-green-600 mt-1">
                {loading ? (
                  <Skeleton className="h-3 w-24" />
                ) : (
                  "Currently available"
                )}
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                On Leave
              </CardTitle>
              <Clock className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  doctorStats.onLeave
                )}
              </div>
              <p className="text-xs text-orange-600 mt-1">
                {loading ? (
                  <Skeleton className="h-3 w-24" />
                ) : (
                  "Temporarily unavailable"
                )}
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Specializations
              </CardTitle>
              <Star className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading ? <Skeleton className="h-8 w-16" /> : "12"}
              </div>
              <p className="text-xs text-blue-600 mt-1">
                {loading ? (
                  <Skeleton className="h-3 w-24" />
                ) : (
                  "Different specialties"
                )}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Specializations Overview */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5" />
              Specializations Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {specializations.map((spec, index) => (
                  <div
                    key={index}
                    className="text-center p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <div className="text-2xl mb-2">{spec.icon}</div>
                    <h3 className="font-medium text-sm mb-1">{spec.name}</h3>
                    <Badge variant="secondary">{spec.count} doctors</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search doctors by name, email, specialization, or department..."
              value={searchQuery}
              onChange={(e) => null}
              className="pl-10"
            />
          </div>
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Advanced Filters
          </Button>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Tabs and Table */}
        <Tabs
          defaultValue="all"
          value={selectedTab}
          onValueChange={handleTabChange}
          className="w-full"
        >
          <TabsList className="mb-6">
            <TabsTrigger value="all" className="flex items-center gap-2">
              <Stethoscope className="h-4 w-4" />
              All Doctors
              {!loading && data && (
                <Badge variant="secondary" className="ml-2">
                  {data.items.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="active" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Active
              {!loading && data && (
                <Badge variant="secondary" className="ml-2">
                  {data.items.filter((d) => d.status === "active").length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="inactive" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Inactive
              {!loading && data && (
                <Badge variant="secondary" className="ml-2">
                  {data.items.filter((d) => d.status === "inactive").length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="on-leave" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              On Leave
              {!loading && data && (
                <Badge variant="secondary" className="ml-2">
                  {data.items.filter((d) => d.status === "on-leave").length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-0">
            {loading ? (
              <div className="space-y-4">
                <Skeleton className="h-12 w-full" />
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : data && data.items.length > 0 ? (
              <Card>
                <CardContent className="p-0">
                  <DataTableDemo data={data.items} />
                </CardContent>
              </Card>
            ) : (
              <Card className="text-center py-12">
                <CardContent>
                  <Stethoscope className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    {searchQuery ? "No doctors found" : "No doctors yet"}
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {searchQuery
                      ? `No doctors match "${searchQuery}". Try adjusting your search.`
                      : "You haven't added any doctors yet. Start by adding your first doctor."}
                  </p>
                  {!searchQuery && (
                    <Button
                      onClick={() => {
                        setCreateRole("doctor");
                        setOpenDialog(true);
                      }}
                      className="flex items-center gap-2 mx-auto"
                    >
                      <Plus className="w-4 h-4" />
                      Add Your First Doctor
                    </Button>
                  )}
                  {searchQuery && (
                    <Button
                      variant="outline"
                      onClick={() => null}
                      className="mx-auto"
                    >
                      Clear Search
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="active" className="mt-0">
            {loading ? (
              <div className="space-y-4">
                <Skeleton className="h-12 w-full" />
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : data && data?.items.length > 0 ? (
              <Card>
                <CardContent className="p-0">
                  <DataTableDemo data={data?.items} />
                </CardContent>
              </Card>
            ) : (
              <Card className="text-center py-12">
                <CardContent>
                  <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    No active doctors
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    There are currently no active doctors in the system.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="inactive" className="mt-0">
            {loading ? (
              <div className="space-y-4">
                <Skeleton className="h-12 w-full" />
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : data && data?.items.length > 0 ? (
              <Card>
                <CardContent className="p-0">
                  <DataTableDemo data={data.items} />
                </CardContent>
              </Card>
            ) : (
              <Card className="text-center py-12">
                <CardContent>
                  <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    No inactive doctors
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    There are currently no inactive doctors in the system.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="on-leave" className="mt-0">
            {loading ? (
              <div className="space-y-4">
                <Skeleton className="h-12 w-full" />
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : data && data.items.length > 0 ? (
              <Card>
                <CardContent className="p-0">
                  <DataTableDemo data={data.items} />
                </CardContent>
              </Card>
            ) : (
              <Card className="text-center py-12">
                <CardContent>
                  <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    No doctors on leave
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    There are currently no doctors on leave.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        {/* Create Dialog */}
        <CreateDialog
          isOpen={openDialog}
          onClose={() => setOpenDialog(false)}
          roleType={createRole}
          onSuccess={getDoctors}
        />
      </div>
    </div>
  );
}
