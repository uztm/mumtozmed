"use client";

import { useEffect, useState, useCallback } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { crud, LoadAllDoctorsCmd } from "@/app/api/apiService";
import type { PatientsResponse } from "@/types/Patient";
import { toast } from "sonner";
import { UserPlus, Loader2, UserCog } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface CreateDialogProps {
  isOpen: boolean;
  onClose: () => void;
  roleType: "patient" | "doctor";
  onSuccess?: () => void;
}

// Schema for doctor form
const doctorFormSchema = z.object({
  fullName: z
    .string()
    .min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

// Schema for patient form with additional fields
const patientFormSchema = doctorFormSchema.extend({
  phone: z.string().min(5, { message: "Phone number is required" }),
  dateOfBirth: z.string().min(1, { message: "Date of birth is required" }),
  doctorId: z.string().min(1, { message: "Please select a doctor" }),
});

// Type inference from schemas
type DoctorFormValues = z.infer<typeof doctorFormSchema>;
type PatientFormValues = z.infer<typeof patientFormSchema>;

export default function CreateDialog({
  isOpen,
  onClose,
  roleType,
  onSuccess,
}: CreateDialogProps) {
  const [loading, setLoading] = useState(false);
  const [doctors, setDoctors] = useState<PatientsResponse>();
  const [loadingDoctors, setLoadingDoctors] = useState(false);
  const isDoctor = roleType === "doctor";

  // Initialize the form with the appropriate schema
  const doctorForm = useForm<DoctorFormValues>({
    resolver: zodResolver(doctorFormSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
    },
  });

  const patientForm = useForm<PatientFormValues>({
    resolver: zodResolver(patientFormSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      dateOfBirth: "",
      password: "",
      doctorId: "",
    },
  });

  // Load doctors for patient creation
  const fetchDoctors = useCallback(async () => {
    if (!isDoctor) {
      setLoadingDoctors(true);
      try {
        const res = await LoadAllDoctorsCmd();
        setDoctors(res);
      } catch (err) {
        console.error("Failed to load doctors:", err);
        toast.error("Failed to load doctors. Please try again.");
      } finally {
        setLoadingDoctors(false);
      }
    }
  }, [isDoctor]);

  useEffect(() => {
    if (isOpen) {
      fetchDoctors();

      // Reset forms when dialog opens
      doctorForm.reset();
      patientForm.reset();
    }
  }, [isOpen, fetchDoctors, doctorForm, patientForm]);

  const handleDoctorSubmit = async (data: DoctorFormValues) => {
    setLoading(true);
    try {
      const payload = {
        fullName: data.fullName,
        email: data.email,
        password: data.password,
        role: 1, // Doctor role enum value
      };

      const newDoctor = await crud.create({
        resource: "Doctor",
        data: payload,
      });

      toast.success("Doctor created successfully");
      onClose();
      onSuccess?.();
    } catch (error) {
      console.error("Failed to create doctor:", error);
      toast.error("Failed to create doctor. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handlePatientSubmit = async (data: PatientFormValues) => {
    setLoading(true);
    try {
      const payload = {
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        dateOfBirth: data.dateOfBirth,
        password: data.password,
        role: 0, // Patient role enum value
        doctorId: Number(data.doctorId),
      };

      const newPatient = await crud.create({
        resource: "Patient",
        data: payload,
      });

      toast.success("Patient created successfully");
      onClose();
      onSuccess?.();
    } catch (error) {
      console.error("Failed to create patient:", error);
      toast.error("Failed to create patient. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !loading && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            {isDoctor ? (
              <>
                <UserCog className="h-5 w-5 text-primary" />
                Create New Doctor
              </>
            ) : (
              <>
                <UserPlus className="h-5 w-5 text-primary" />
                Create New Patient
              </>
            )}
          </DialogTitle>
          <DialogDescription>
            Fill in the details below to create a new{" "}
            {isDoctor ? "doctor" : "patient"} record.
          </DialogDescription>
        </DialogHeader>

        {isDoctor ? (
          <Form {...doctorForm}>
            <form
              onSubmit={doctorForm.handleSubmit(handleDoctorSubmit)}
              className="space-y-4"
            >
              <FormField
                control={doctorForm.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Dr. John Smith" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={doctorForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="doctor@example.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={doctorForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter className="mt-6">
                <Button
                  variant="outline"
                  type="button"
                  onClick={onClose}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Create Doctor"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        ) : (
          <Form {...patientForm}>
            <form
              onSubmit={patientForm.handleSubmit(handlePatientSubmit)}
              className="space-y-4"
            >
              <Tabs defaultValue="personal" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="personal">Personal Info</TabsTrigger>
                  <TabsTrigger value="medical">Medical Info</TabsTrigger>
                </TabsList>

                <TabsContent value="personal" className="space-y-4 pt-4">
                  <FormField
                    control={patientForm.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Jane Smith" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={patientForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="patient@example.com"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={patientForm.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone</FormLabel>
                          <FormControl>
                            <Input placeholder="+1 (555) 123-4567" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={patientForm.control}
                    name="dateOfBirth"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date of Birth</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={patientForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="••••••••"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>

                <TabsContent value="medical" className="space-y-4 pt-4">
                  <FormField
                    control={patientForm.control}
                    name="doctorId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Assign Doctor</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a doctor" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {loadingDoctors ? (
                              <div className="flex items-center justify-center p-4">
                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                Loading doctors...
                              </div>
                            ) : doctors?.items && doctors.items.length > 0 ? (
                              doctors.items.map((doctor) => (
                                <SelectItem
                                  key={doctor.id}
                                  value={doctor.id.toString()}
                                >
                                  {doctor.fullName} ({doctor.email})
                                </SelectItem>
                              ))
                            ) : (
                              <div className="p-2 text-center text-sm text-muted-foreground">
                                No doctors available
                              </div>
                            )}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>
              </Tabs>

              <DialogFooter className="mt-6">
                <Button
                  variant="outline"
                  type="button"
                  onClick={onClose}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Create Patient"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}
