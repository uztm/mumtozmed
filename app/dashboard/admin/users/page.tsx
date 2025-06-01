"use client"

import { useEffect, useState, useCallback } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Home,
  Users,
  Search,
  Filter,
  Plus,
  Download,
  Upload,
  MoreHorizontal,
  RefreshCw,
  AlertTriangle,
  ChevronLeft,
  FileText,
  Trash2,
  UserPlus,
  ClipboardList,
} from "lucide-react"
import { crud } from "@/app/api/apiService"
import type { Patient, PatientsResponse } from "@/types/Patient"
import { PatientsTable } from "@/components/demo/patientsTable"
import CreateDialog from "@/components/cmd/createDialog"
import { toast } from "sonner"

export default function PatientsPage() {
  const [data, setData] = useState<PatientsResponse>()
  const [filteredData, setFilteredData] = useState<Patient[]>()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>("")
  const [searchQuery, setSearchQuery] = useState("")
  const [openDialog, setOpenDialog] = useState(false)
  const [createRole, setCreateRole] = useState<"patient" | "doctor">("patient")
  const [selectedTab, setSelectedTab] = useState("all")

  const getPatients = useCallback(async () => {
    setLoading(true)
    setError("")
    try {
      const res = await crud.loadAll("Patient")
      setData(res)
      setFilteredData(res.items)
    } catch (err) {
      console.error("Failed to load patients:", err)
      setError("Failed to load patients. Please try again.")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    getPatients()
  }, [getPatients])

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    if (!data?.items) return

    if (query.trim() === "") {
      setFilteredData(data.items)
    } else {
      const filtered = data.items.filter(
        (patient) =>
          patient.fullName?.toLowerCase().includes(query.toLowerCase()) ||
          patient.email?.toLowerCase().includes(query.toLowerCase()) ||
          patient.phone?.includes(query),
      )
      setFilteredData(filtered)
    }
  }

  const handleTabChange = (value: string) => {
    setSelectedTab(value)
    if (!data?.items) return

    if (value === "all") {
      setFilteredData(data.items)
    } else if (value === "active") {
      setFilteredData(data.items.filter((patient) => patient.status === "active"))
    } else if (value === "inactive") {
      setFilteredData(data.items.filter((patient) => patient.status === "inactive"))
    } else if (value === "critical") {
      setFilteredData(data.items.filter((patient) => patient.status === "critical"))
    }
  }

  const handleRefresh = () => {
    getPatients()
    toast.success("Patient data refreshed")
  }

  const handleExport = () => {
    toast.success("Exporting patient data...")
    // Implementation for exporting data would go here
  }

  const handleBulkDelete = () => {
    toast.error("Bulk delete is not implemented yet")
    // Implementation for bulk delete would go here
  }

  const patientStats = {
    total: data?.items.length || 0,
    active: data?.items.filter((p) => p.status === "active").length || 0,
    critical: data?.items.filter((p) => p.status === "critical").length || 0,
    newThisMonth: 12, // Example static data
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link href="/dashboard/admin" className="flex items-center gap-1 hover:text-foreground transition-colors">
            <Home className="h-3.5 w-3.5" />
            <span>Admin</span>
          </Link>
          <ChevronLeft className="h-3.5 w-3.5 rotate-180" />
          <span className="text-foreground font-medium">Patients</span>
        </div>

        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Patient Management</h1>
            <p className="text-muted-foreground">View, add, and manage patient records</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button
              onClick={() => {
                setCreateRole("patient")
                setOpenDialog(true)
              }}
              className="flex items-center gap-2"
            >
              <UserPlus className="h-4 w-4" />
              Add Patient
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <MoreHorizontal className="h-4 w-4 mr-2" />
                  Actions
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>Patient Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleRefresh} className="flex items-center gap-2 cursor-pointer">
                  <RefreshCw className="h-4 w-4" />
                  Refresh Data
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleExport} className="flex items-center gap-2 cursor-pointer">
                  <Download className="h-4 w-4" />
                  Export Data
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
                  <Upload className="h-4 w-4" />
                  Import Patients
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
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Patients</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {/* <div className="text-2xl font-bold">
                {loading ? <Skeleton className="h-8 w-16" /> : patientStats.total}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {loading ? <Skeleton className="h-3 w-24" /> : `${patientStats.newThisMonth} new this month`}
              </p> */}
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Patients</CardTitle>
              <Users className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading ? <Skeleton className="h-8 w-16" /> : patientStats.active}
              </div>
              <p className="text-xs text-green-600 mt-1">
                {loading ? <Skeleton className="h-3 w-24" /> : "Currently under care"}
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Critical Cases</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading ? <Skeleton className="h-8 w-16" /> : patientStats.critical}
              </div>
              <p className="text-xs text-red-600 mt-1">
                {loading ? <Skeleton className="h-3 w-24" /> : "Require immediate attention"}
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Medical Records</CardTitle>
              <FileText className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{loading ? <Skeleton className="h-8 w-16" /> : "156"}</div>
              <p className="text-xs text-blue-600 mt-1">
                {loading ? <Skeleton className="h-3 w-24" /> : "24 updated this week"}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search patients by name, email, or phone..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
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
        <Tabs defaultValue="all" value={selectedTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="all" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              All Patients
              {!loading && data && (
                <Badge variant="secondary" className="ml-2">
                  {data.items.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="active" className="flex items-center gap-2">
              <ClipboardList className="h-4 w-4" />
              Active
              {!loading && data && (
                <Badge variant="secondary" className="ml-2">
                  {data.items.filter((p) => p.status === "active").length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="inactive" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Inactive
              {!loading && data && (
                <Badge variant="secondary" className="ml-2">
                  {data.items.filter((p) => p.status === "inactive").length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="critical" className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Critical
              {!loading && data && (
                <Badge variant="secondary" className="ml-2">
                  {data.items.filter((p) => p.status === "critical").length}
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
            ) : filteredData && filteredData.length > 0 ? (
              <Card>
                <CardContent className="p-0">
                  <PatientsTable data={filteredData} />
                </CardContent>
              </Card>
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
                    <Button
                      onClick={() => {
                        setCreateRole("patient")
                        setOpenDialog(true)
                      }}
                      className="flex items-center gap-2 mx-auto"
                    >
                      <Plus className="w-4 h-4" />
                      Add Your First Patient
                    </Button>
                  )}
                  {searchQuery && (
                    <Button variant="outline" onClick={() => handleSearch("")} className="mx-auto">
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
            ) : filteredData && filteredData.length > 0 ? (
              <Card>
                <CardContent className="p-0">
                  <PatientsTable data={filteredData} />
                </CardContent>
              </Card>
            ) : (
              <Card className="text-center py-12">
                <CardContent>
                  <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No active patients</h3>
                  <p className="text-muted-foreground mb-4">There are currently no active patients in the system.</p>
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
            ) : filteredData && filteredData.length > 0 ? (
              <Card>
                <CardContent className="p-0">
                  <PatientsTable data={filteredData} />
                </CardContent>
              </Card>
            ) : (
              <Card className="text-center py-12">
                <CardContent>
                  <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No inactive patients</h3>
                  <p className="text-muted-foreground mb-4">There are currently no inactive patients in the system.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="critical" className="mt-0">
            {loading ? (
              <div className="space-y-4">
                <Skeleton className="h-12 w-full" />
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : filteredData && filteredData.length > 0 ? (
              <Card>
                <CardContent className="p-0">
                  <PatientsTable data={filteredData} />
                </CardContent>
              </Card>
            ) : (
              <Card className="text-center py-12">
                <CardContent>
                  <AlertTriangle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No critical patients</h3>
                  <p className="text-muted-foreground mb-4">There are currently no critical patients in the system.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        {/* Create Dialog */}
        <CreateDialog isOpen={openDialog} onClose={() => setOpenDialog(false)} roleType={createRole} />
      </div>
    </div>
  )
}
