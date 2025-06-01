"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Stethoscope,
  Users,
  Calendar,
  Activity,
  TrendingUp,
  Settings,
  FileText,
  Shield,
  Bell,
  BarChart3,
  UserCheck,
  Clock,
  AlertTriangle,
  Plus,
  Search,
  Filter,
} from "lucide-react"
import { useUser } from "@/hooks/useUser"

interface AdminModule {
  name: string
  icon: React.ReactNode
  description: string
  href: string
  count?: number
  status?: "active" | "warning" | "error"
  color: string
  gradient: string
}

interface DashboardStats {
  totalDoctors: number
  totalPatients: number
  totalAppointments: number
  activeUsers: number
  pendingApprovals: number
  systemAlerts: number
}

const adminModules: AdminModule[] = [
  {
    name: "Doctors",
    icon: <Stethoscope className="w-6 h-6" />,
    description: "Manage doctors, schedules, and profiles",
    href: "/dashboard/admin/doctors",
    color: "text-blue-600",
    gradient: "from-blue-500 to-blue-600",
  },
  {
    name: "Patients",
    icon: <Users className="w-6 h-6" />,
    description: "Patient records and medical history",
    href: "/dashboard/admin/users",
    color: "text-green-600",
    gradient: "from-green-500 to-green-600",
  },
  {
    name: "Users",
    icon: <UserCheck className="w-6 h-6" />,
    description: "User management and permissions",
    href: "/dashboard/admin/users",
    color: "text-purple-600",
    gradient: "from-purple-500 to-purple-600",
  },
  {
    name: "Appointments",
    icon: <Calendar className="w-6 h-6" />,
    description: "Schedule and appointment management",
    href: "/dashboard/admin/",
    color: "text-orange-600",
    gradient: "from-orange-500 to-orange-600",
  },
  {
    name: "Analytics",
    icon: <BarChart3 className="w-6 h-6" />,
    description: "Reports and system analytics",
    href: "/dashboard/admin/",
    color: "text-indigo-600",
    gradient: "from-indigo-500 to-indigo-600",
  },
  {
    name: "Settings",
    icon: <Settings className="w-6 h-6" />,
    description: "System configuration and preferences",
    href: "/dashboard/admin/",
    color: "text-gray-600",
    gradient: "from-gray-500 to-gray-600",
  },
]

const quickActions = [
  {
    name: "Add Doctor",
    icon: <Plus className="w-4 h-4" />,
    href: "/dashboard/admin/",
    variant: "default" as const,
  },
  {
    name: "View Reports",
    icon: <FileText className="w-4 h-4" />,
    href: "/dashboard/admin/",
    variant: "outline" as const,
  },
  {
    name: "System Health",
    icon: <Activity className="w-4 h-4" />,
    href: "/dashboard/admin/",
    variant: "outline" as const,
  },
]

export default function AdminDashboard() {
  const { user, loading: userLoading } = useUser()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>("")

  // Simulate loading stats
  useEffect(() => {
    const loadStats = async () => {
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500))
        setStats({
          totalDoctors: 24,
          totalPatients: 156,
          totalAppointments: 89,
          activeUsers: 45,
          pendingApprovals: 3,
          systemAlerts: 1,
        })
      } catch (err) {
        setError("Failed to load dashboard statistics")
      } finally {
        setLoading(false)
      }
    }

    loadStats()
  }, [])

  const statsCards = [
    {
      title: "Total Doctors",
      value: stats?.totalDoctors || 0,
      icon: <Stethoscope className="h-4 w-4" />,
      change: "+2 this month",
      changeType: "positive" as const,
    },
    {
      title: "Total Patients",
      value: stats?.totalPatients || 0,
      icon: <Users className="h-4 w-4" />,
      change: "+12 this week",
      changeType: "positive" as const,
    },
    {
      title: "Appointments Today",
      value: stats?.totalAppointments || 0,
      icon: <Calendar className="h-4 w-4" />,
      change: "8 pending",
      changeType: "neutral" as const,
    },
    {
      title: "Active Users",
      value: stats?.activeUsers || 0,
      icon: <Activity className="h-4 w-4" />,
      change: "Online now",
      changeType: "positive" as const,
    },
  ]

  if (userLoading) {
    return (
      <div className="w-full min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <Skeleton className="h-32 w-full mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-48" />
            ))}
          </div>
        </div>
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
              <div>
                <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
                <p className="text-blue-100 text-lg">Welcome back, {user?.fullName || "Administrator"}</p>
                <p className="text-blue-200 text-sm mt-1">Manage your healthcare system efficiently</p>
              </div>
              <div className="hidden md:flex items-center space-x-4">
                {stats?.pendingApprovals && stats.pendingApprovals > 0 && (
                  <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
                    <div className="flex items-center gap-2">
                      <Bell className="h-5 w-5" />
                      <span className="text-sm font-medium">{stats.pendingApprovals} pending approvals</span>
                    </div>
                  </div>
                )}
                {stats?.systemAlerts && stats.systemAlerts > 0 && (
                  <div className="bg-red-500/20 backdrop-blur-sm rounded-lg p-3">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5" />
                      <span className="text-sm font-medium">{stats.systemAlerts} system alert</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24" />
        </div>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-3 mb-8">
          {quickActions.map((action, index) => (
            <Link key={index} href={action.href}>
              <Button variant={action.variant} className="flex items-center gap-2">
                {action.icon}
                {action.name}
              </Button>
            </Link>
          ))}
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsCards.map((stat, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                {stat.icon}
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {loading ? <Skeleton className="h-8 w-16" /> : stat.value.toLocaleString()}
                </div>
                
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Admin Modules */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold">Management Modules</h2>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {adminModules.map((module, index) => (
              <Link key={index} href={module.href}>
                <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer border-0 shadow-md">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className={`p-3 rounded-xl bg-gradient-to-r ${module.gradient} text-white shadow-lg`}>
                        {module.icon}
                      </div>
                      {module.count && (
                        <Badge variant="secondary" className="text-xs">
                          {module.count}
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardTitle className="text-lg mb-2 group-hover:text-primary transition-colors">
                      {module.name}
                    </CardTitle>
                    <CardDescription className="text-sm leading-relaxed">{module.description}</CardDescription>
                    <div className="mt-4 flex items-center text-sm text-muted-foreground group-hover:text-primary transition-colors">
                      <span>Manage {module.name.toLowerCase()}</span>
                      <TrendingUp className="h-4 w-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Recent Activity
            </CardTitle>
            <CardDescription>Latest system activities and updates</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex items-center space-x-3">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <div className="space-y-1 flex-1">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
                  <div className="p-2 bg-green-100 dark:bg-green-900 rounded-full">
                    <UserCheck className="h-4 w-4 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">New doctor registered</p>
                    <p className="text-xs text-muted-foreground">Dr. Sarah Johnson joined the system</p>
                  </div>
                  <span className="text-xs text-muted-foreground">2 hours ago</span>
                </div>
                <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-full">
                    <Calendar className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Appointment scheduled</p>
                    <p className="text-xs text-muted-foreground">15 new appointments for tomorrow</p>
                  </div>
                  <span className="text-xs text-muted-foreground">4 hours ago</span>
                </div>
                <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
                  <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-full">
                    <Shield className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Security update</p>
                    <p className="text-xs text-muted-foreground">System security patches applied</p>
                  </div>
                  <span className="text-xs text-muted-foreground">1 day ago</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
