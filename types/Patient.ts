import { UserRole } from "./UserRole";

export interface Patient {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  dateOfBirth: string; // ISO date string, e.g. "2000-01-01T00:00:00"
  password: string;
  role: UserRole; // e.g. 3 (consider creating an enum for roles)
  doctorId: number;
  pageNumber?: number;
  status?: "active" | "inactive" | "discharged" | "critical" | "on-leave";
}

export interface PatientsResponse {
  items: Patient[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
}


export interface VitalSign {
  temperature: number;
  heartRate: number;
  systolic: number;
  diastolic: number;
  painLevel: number;
  timestamp: string; // ISO date string
  description: string;
  isEmergency: boolean;
  patientId: number;
  doctorId: number;
}


export interface RecoveryPlan {
  id: number;
  patientId: number;
  doctorId: number;
  plan: string;
  progressNote: string | null;
  dateAssigned: string;  // ISO date string
  dateUpdated: string | null;  // ISO date string or null
}
