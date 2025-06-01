"use client"

import { useEffect, useState } from "react"
import { useUser } from "@/hooks/useUser"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  User,
  Mail,
  Calendar,
  Phone,
  Stethoscope,
  Heart,
  Activity,
  FileText,
  Settings,
  Edit,
  Download,
  AlertTriangle,
  TrendingUp,
  Thermometer,
  Pill,
  CalendarDays,
} from "lucide-react"

interface UpcomingAppointment {
  id: string
  doctorName: string
  specialty: string
  date: string
  time: string
  type: "checkup" | "follow-up" | "consultation"
  status: "confirmed" | "pending" | "cancelled"
}

interface VitalSigns {
  temperature: number
  heartRate: number
  bloodPressure: string
  weight: number
  height: number
  lastUpdated: string
}

interface Medication {
  name: string
  dosage: string
  frequency: string
  startDate: string
  endDate?: string
  status: "active" | "completed" | "paused"
}

export default function PatientDashboard() {
  const { user, loading } = useUser()
  const [appointments, setAppointments] = useState<UpcomingAppointment[]>([])
  const [vitals, setVitals] = useState<VitalSigns | null>(null)
  const [medications, setMedications] = useState<Medication[]>([])
  const [loadingData, setLoadingData] = useState(true)

  useEffect(() => {
    const loadPatientData = async () => {
      if (!user?.id) return

      try {
        // Simulate loading patient data
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Mock data - replace with actual API calls
        setAppointments([
          {
            id: "1",
            doctorName: "Dr. Sarah Johnson",
            specialty: "Cardiology",
            date: "2024-01-15",
            time: "10:00 AM",
            type: "checkup",
            status: "confirmed",
          },
          {
            id: "2",
            doctorName: "Dr. Michael Chen",
            specialty: "General Medicine",
            date: "2024-01-20",
            time: "2:30 PM",
            type: "follow-up",
            status: "pending",
          },
        ])

        setVitals({
          temperature: 98.6,
          heartRate: 72,
          bloodPressure: "120/80",
          weight: 70,
          height: 175,
          lastUpdated: "2024-01-10",
        })

        setMedications([
          {
            name: "Lisinopril",
            dosage: "10mg",
            frequency: "Once daily",
            startDate: "2024-01-01",
            status: "active",
          },
          {
            name: "Metformin",
            dosage: "500mg",
            frequency: "Twice daily",
            startDate: "2024-01-01",
            status: "active",
          },
        ])
      } catch (error) {
        console.error("Failed to load patient data:", error)
      } finally {
        setLoadingData(false)
      }
    }

    loadPatientData()
  }, [user?.id])

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      case "active":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "completed":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="container mx-auto px-4 py-8">
          <div className="space-y-6">
            <Skeleton className="h-32 w-full" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Skeleton className="h-48" />
              <Skeleton className="h-48" />
              <Skeleton className="h-48" />
            </div>
            <Skeleton className="h-96 w-full" />
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>No user found. Please log in to access your dashboard.</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 p-8 mb-8 text-white">
          <div className="absolute inset-0 bg-black/20" />
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <Avatar className="h-20 w-20 border-4 border-white/20">
                  <AvatarImage src="/placeholder.svg" alt={user.fullName} />
                  <AvatarFallback className="bg-white/20 text-white text-xl font-bold">
                    {getInitials(user.fullName || "UN")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="text-3xl font-bold mb-2">Welcome back, {user.fullName}</h1>
                  <p className="text-blue-100 text-lg">Patient Dashboard</p>
                  <p className="text-blue-200 text-sm mt-1">Manage your health and appointments</p>
                </div>
              </div>
              <div className="hidden md:flex items-center space-x-4">
                <Button variant="secondary" className="flex items-center gap-2">
                  <Edit className="h-4 w-4" />
                  Edit Profile
                </Button>
                <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24" />
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Next Appointment</CardTitle>
              <CalendarDays className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loadingData ? <Skeleton className="h-8 w-16" /> : appointments.length > 0 ? "Jan 15" : "None"}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {loadingData ? (
                  <Skeleton className="h-3 w-24" />
                ) : appointments.length > 0 ? (
                  "Dr. Sarah Johnson"
                ) : (
                  "No upcoming appointments"
                )}
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Medications</CardTitle>
              <Pill className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loadingData ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  medications.filter((m) => m.status === "active").length
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {loadingData ? <Skeleton className="h-3 w-24" /> : "Currently prescribed"}
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Last Checkup</CardTitle>
              <Stethoscope className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{loadingData ? <Skeleton className="h-8 w-16" /> : "Jan 10"}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {loadingData ? <Skeleton className="h-3 w-24" /> : "Vitals updated"}
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Health Score</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{loadingData ? <Skeleton className="h-8 w-16" /> : "85%"}</div>
              <p className="text-xs text-green-600 mt-1">{loadingData ? <Skeleton className="h-3 w-24" /> : "Good"}</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="appointments">Appointments</TabsTrigger>
            <TabsTrigger value="vitals">Vital Signs</TabsTrigger>
            <TabsTrigger value="medications">Medications</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Upcoming Appointments */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Upcoming Appointments
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {loadingData ? (
                    <div className="space-y-3">
                      {Array.from({ length: 2 }).map((_, i) => (
                        <Skeleton key={i} className="h-16 w-full" />
                      ))}
                    </div>
                  ) : appointments.length > 0 ? (
                    <div className="space-y-4">
                      {appointments.slice(0, 3).map((appointment) => (
                        <div
                          key={appointment.id}
                          className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                        >
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/10 rounded-full">
                              <Stethoscope className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                              <p className="font-medium">{appointment.doctorName}</p>
                              <p className="text-sm text-muted-foreground">{appointment.specialty}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium">{appointment.date}</p>
                            <p className="text-sm text-muted-foreground">{appointment.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No upcoming appointments</p>
                      <Button className="mt-4">Schedule Appointment</Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Recent Vitals */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Recent Vital Signs
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {loadingData ? (
                    <div className="space-y-3">
                      {Array.from({ length: 4 }).map((_, i) => (
                        <Skeleton key={i} className="h-12 w-full" />
                      ))}
                    </div>
                  ) : vitals ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-2">
                          <Thermometer className="h-4 w-4 text-blue-500" />
                          <div>
                            <p className="text-sm text-muted-foreground">Temperature</p>
                            <p className="font-semibold">{vitals.temperature}°F</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Heart className="h-4 w-4 text-red-500" />
                          <div>
                            <p className="text-sm text-muted-foreground">Heart Rate</p>
                            <p className="font-semibold">{vitals.heartRate} bpm</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Activity className="h-4 w-4 text-green-500" />
                          <div>
                            <p className="text-sm text-muted-foreground">Blood Pressure</p>
                            <p className="font-semibold">{vitals.bloodPressure}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-4 w-4 text-purple-500" />
                          <div>
                            <p className="text-sm text-muted-foreground">Weight</p>
                            <p className="font-semibold">{vitals.weight} kg</p>
                          </div>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">Last updated: {vitals.lastUpdated}</p>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No vital signs recorded</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Current Medications */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Pill className="h-5 w-5" />
                  Current Medications
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loadingData ? (
                  <div className="space-y-3">
                    {Array.from({ length: 2 }).map((_, i) => (
                      <Skeleton key={i} className="h-16 w-full" />
                    ))}
                  </div>
                ) : medications.length > 0 ? (
                  <div className="space-y-4">
                    {medications.map((medication, index) => (
                      <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-full">
                            <Pill className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div>
                            <p className="font-medium">{medication.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {medication.dosage} - {medication.frequency}
                            </p>
                          </div>
                        </div>
                        <Badge className={getStatusColor(medication.status)}>{medication.status}</Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Pill className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No medications prescribed</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Personal Information
                </CardTitle>
                <CardDescription>Your personal details and contact information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center gap-4">
                    <User className="text-primary h-5 w-5" />
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Full Name</p>
                      <p className="text-lg font-medium">{user.fullName}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <Mail className="text-primary h-5 w-5" />
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Email</p>
                      <p className="text-lg font-medium">{user.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <Phone className="text-primary h-5 w-5" />
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Phone Number</p>
                      <p className="text-lg font-medium">{user.phoneNumber || "Not provided"}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <Calendar className="text-primary h-5 w-5" />
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Date of Birth</p>
                      <p className="text-lg font-medium">{user.dateOfBirth || "Not provided"}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <Stethoscope className="text-primary h-5 w-5" />
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Primary Doctor</p>
                      <p className="text-lg font-medium">{user.doctor || "Not assigned"}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <FileText className="text-primary h-5 w-5" />
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Patient ID</p>
                      <p className="text-lg font-medium">{user.id}</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button className="flex items-center gap-2">
                    <Edit className="h-4 w-4" />
                    Edit Profile
                  </Button>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    Download Records
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Other tabs would be implemented similarly */}
          <TabsContent value="appointments">
            <Card>
              <CardHeader>
                <CardTitle>All Appointments</CardTitle>
                <CardDescription>View and manage your appointments</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Appointments management interface would go here.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="vitals">
            <Card>
              <CardHeader>
                <CardTitle>Vital Signs History</CardTitle>
                <CardDescription>Track your health metrics over time</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Vital signs tracking interface would go here.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="medications">
            <Card>
              <CardHeader>
                <CardTitle>Medication Management</CardTitle>
                <CardDescription>Track your prescriptions and medication schedule</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Medication management interface would go here.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
