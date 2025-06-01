"use client"

import type React from "react"

import { useEffect, useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Patient, RecoveryPlan, VitalSign } from "@/types/Patient"
import { UserRole } from "@/types/UserRole"
import { crud } from "@/app/api/apiService"
import {
  User,
  Mail,
  Phone,
  Calendar,
  UserCheck,
  Stethoscope,
  Heart,
  Thermometer,
  Activity,
  AlertTriangle,
  Clock,
  FileText,
  TrendingUp,
} from "lucide-react"

interface TableInsideProps {
  data: Patient
  showButtons?: boolean
  load?: boolean
}

interface PatientInfoItem {
  label: string
  value: string | number
  icon: React.ComponentType<{ className?: string }>
}

export function TableInside({ data, showButtons, load }: TableInsideProps) {
  const [vitalSigns, setVitalSigns] = useState<VitalSign[]>([])
  const [recoveryPlans, setRecoveryPlans] = useState<RecoveryPlan[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>("")

  const patientInfo = useMemo((): PatientInfoItem[] => {
    const info: PatientInfoItem[] = []

    if (data.fullName) info.push({ label: "Full Name", value: data.fullName, icon: User })
    if (data.email) info.push({ label: "Email", value: data.email, icon: Mail })
    if (data.phone) info.push({ label: "Phone", value: data.phone, icon: Phone })
    if (data.dateOfBirth) {
      info.push({
        label: "Date of Birth",
        value: new Date(data.dateOfBirth).toLocaleDateString(),
        icon: Calendar,
      })
    }
    if (data.role !== undefined) {
      info.push({ label: "Role", value: UserRole[data.role], icon: UserCheck })
    }
    if (data.doctorId) info.push({ label: "Doctor ID", value: data.doctorId, icon: Stethoscope })

    return info
  }, [data])

  const fetchMedicalData = async () => {
    if (!data.id || !load) return

    setLoading(true)
    setError("")

    try {
      const [vitalSignsRes, recoveryPlansRes] = await Promise.all([
        crud.loadAllById({
          resource: "RecoveryLog/patient",
          id: data.id,
        }),
        crud.loadAllById({
          resource: "Rehabilitation/progress",
          id: data.id,
        }),
      ])

      setVitalSigns(vitalSignsRes)
      setRecoveryPlans(recoveryPlansRes)
    } catch (error) {
      console.error("Error fetching medical data:", error)
      setError("Failed to load medical data. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMedicalData()
  }, [data.id, load])

  const getVitalStatus = (vital: VitalSign) => {
    if (vital.isEmergency) return "emergency"
    if (vital.painLevel >= 7) return "high"
    if (vital.painLevel >= 4) return "medium"
    return "normal"
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "emergency":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      case "high":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300"
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      default:
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
    }
  }

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="space-y-6">
      {/* Patient Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Patient Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {patientInfo.map((item, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
                <item.icon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-muted-foreground">{item.label}</p>
                  <p className="text-sm font-semibold truncate">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Medical Data */}
      {load && (
        <Tabs defaultValue="vitals" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="vitals" className="flex items-center gap-2">
              <Heart className="h-4 w-4" />
              Vital Signs
            </TabsTrigger>
            <TabsTrigger value="recovery" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Recovery Plans
            </TabsTrigger>
          </TabsList>

          {/* Error State */}
          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Vital Signs Tab */}
          <TabsContent value="vitals" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Vital Signs History
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="space-y-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-20 w-full" />
                      </div>
                    ))}
                  </div>
                ) : vitalSigns.length > 0 ? (
                  <ScrollArea className="h-96">
                    <div className="space-y-4">
                      {vitalSigns.map((vital, index) => {
                        const status = getVitalStatus(vital)
                        return (
                          <Card key={index} className="border-l-4 border-l-primary">
                            <CardHeader className="pb-3">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <Clock className="h-4 w-4 text-muted-foreground" />
                                  <span className="text-sm font-medium">{formatDate(vital.timestamp)}</span>
                                </div>
                                <Badge className={getStatusColor(status)}>
                                  {vital.isEmergency ? "Emergency" : status.charAt(0).toUpperCase() + status.slice(1)}
                                </Badge>
                              </div>
                            </CardHeader>
                            <CardContent className="pt-0">
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="flex items-center gap-2">
                                  <Thermometer className="h-4 w-4 text-blue-500" />
                                  <div>
                                    <p className="text-xs text-muted-foreground">Temperature</p>
                                    <p className="font-semibold">{vital.temperature}°C</p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Heart className="h-4 w-4 text-red-500" />
                                  <div>
                                    <p className="text-xs text-muted-foreground">Heart Rate</p>
                                    <p className="font-semibold">{vital.heartRate} bpm</p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Activity className="h-4 w-4 text-green-500" />
                                  <div>
                                    <p className="text-xs text-muted-foreground">Blood Pressure</p>
                                    <p className="font-semibold">
                                      {vital.systolic}/{vital.diastolic}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <AlertTriangle className="h-4 w-4 text-orange-500" />
                                  <div>
                                    <p className="text-xs text-muted-foreground">Pain Level</p>
                                    <p className="font-semibold">{vital.painLevel}/10</p>
                                  </div>
                                </div>
                              </div>
                              {vital.description && (
                                <>
                                  <Separator className="my-3" />
                                  <div>
                                    <p className="text-xs text-muted-foreground mb-1">Description</p>
                                    <p className="text-sm">{vital.description}</p>
                                  </div>
                                </>
                              )}
                            </CardContent>
                          </Card>
                        )
                      })}
                    </div>
                  </ScrollArea>
                ) : (
                  <div className="text-center py-8">
                    <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No vital signs recorded yet</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Recovery Plans Tab */}
          <TabsContent value="recovery" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Recovery Plans
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-4">
                    {Array.from({ length: 2 }).map((_, i) => (
                      <div key={i} className="space-y-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-24 w-full" />
                      </div>
                    ))}
                  </div>
                ) : recoveryPlans.length > 0 ? (
                  <ScrollArea className="h-96">
                    <div className="space-y-4">
                      {recoveryPlans.map((plan, index) => (
                        <Card key={index} className="border-l-4 border-l-green-500">
                          <CardHeader className="pb-3">
                            <CardTitle className="text-lg">Recovery Plan {index + 1}</CardTitle>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span>Assigned: {formatDate(plan.dateAssigned)}</span>
                              {plan.dateUpdated && <span>Updated: {formatDate(plan.dateUpdated)}</span>}
                            </div>
                          </CardHeader>
                          <CardContent className="pt-0 space-y-4">
                            <div>
                              <p className="text-sm font-medium text-muted-foreground mb-2">Treatment Plan</p>
                              <p className="text-sm bg-muted/50 p-3 rounded-lg">{plan.plan}</p>
                            </div>
                            {plan.progressNote && (
                              <div>
                                <p className="text-sm font-medium text-muted-foreground mb-2">Progress Notes</p>
                                <p className="text-sm bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                                  {plan.progressNote}
                                </p>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </ScrollArea>
                ) : (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No recovery plans assigned yet</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}
