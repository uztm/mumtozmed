// src/types/Role.ts
export enum Role {
  Patient = 0,
  Doctor = 1,
  Moderator = 2,
}

export interface EmergencyRecord {
  id: number;
  patientId: number;
  emergencyType: string;
  createdAt: string; // ISO date string
  receivedAt: string; // ISO date string
}
