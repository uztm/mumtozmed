"use client";

import { useState, useEffect } from "react";
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Slider } from "@/components/ui/slider";
import {
  Thermometer,
  Heart,
  Activity,
  AlertTriangle,
  FileText,
  Clock,
  Loader2,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { toast } from "sonner";

interface MedicalFormProps {
  open: boolean;
  setOpen: (val: boolean) => void;
  patientId: number;
  doctorId: any;
  onSubmit: (data: any) => Promise<void>;
}

const medicalFormSchema = z.object({
  temperature: z
    .number()
    .min(30, "Temperature too low")
    .max(45, "Temperature too high")
    .refine((val) => val > 0, "Temperature is required"),
  heartRate: z
    .number()
    .min(30, "Heart rate too low")
    .max(200, "Heart rate too high")
    .refine((val) => val > 0, "Heart rate is required"),
  systolic: z
    .number()
    .min(70, "Systolic pressure too low")
    .max(250, "Systolic pressure too high")
    .refine((val) => val > 0, "Systolic pressure is required"),
  diastolic: z
    .number()
    .min(40, "Diastolic pressure too low")
    .max(150, "Diastolic pressure too high")
    .refine((val) => val > 0, "Diastolic pressure is required"),
  painLevel: z
    .number()
    .min(0, "Pain level cannot be negative")
    .max(10, "Pain level cannot exceed 10"),
  description: z.string().min(1, "Description is required"),
  isEmergency: z.boolean(),
});

type MedicalFormValues = z.infer<typeof medicalFormSchema>;

export default function AddInfoDialog({
  open,
  setOpen,
  patientId,
  doctorId,
  onSubmit,
}: MedicalFormProps) {
  const [loading, setLoading] = useState(false);

  const form = useForm<MedicalFormValues>({
    resolver: zodResolver(medicalFormSchema),
    defaultValues: {
      temperature: 36.5,
      heartRate: 72,
      systolic: 120,
      diastolic: 80,
      painLevel: 0,
      description: "",
      isEmergency: false,
    },
  });

  const watchedValues = form.watch();

  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      form.reset();
    }
  }, [open, form]);

  const getVitalStatus = (type: string, value: number) => {
    switch (type) {
      case "temperature":
        if (value < 36) return { status: "low", color: "blue" };
        if (value > 37.5) return { status: "high", color: "red" };
        return { status: "normal", color: "green" };
      case "heartRate":
        if (value < 60) return { status: "low", color: "blue" };
        if (value > 100) return { status: "high", color: "red" };
        return { status: "normal", color: "green" };
      case "systolic":
        if (value < 90) return { status: "low", color: "blue" };
        if (value > 140) return { status: "high", color: "red" };
        return { status: "normal", color: "green" };
      case "diastolic":
        if (value < 60) return { status: "low", color: "blue" };
        if (value > 90) return { status: "high", color: "red" };
        return { status: "normal", color: "green" };
      default:
        return { status: "normal", color: "green" };
    }
  };

  const getPainLevelColor = (level: number) => {
    if (level === 0)
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
    if (level <= 3)
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
    if (level <= 6)
      return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300";
    return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
  };

  const getPainLevelText = (level: number) => {
    if (level === 0) return "No Pain";
    if (level <= 3) return "Mild Pain";
    if (level <= 6) return "Moderate Pain";
    return "Severe Pain";
  };

  const handleSubmit = async (data: MedicalFormValues) => {
    setLoading(true);
    try {
      const formData = {
        ...data,
        timestamp: new Date().toISOString(),
        patientId,
        doctorId,
      };

      await onSubmit(formData);
      toast.success("Medical information added successfully");
      setOpen(false);
    } catch (error) {
      console.error("Failed to submit medical info:", error);
      toast.error("Failed to add medical information. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const VitalIndicator = ({ type, value, unit, icon: Icon }: any) => {
    const { status, color } = getVitalStatus(type, value);
    return (
      <div className="flex items-center gap-2">
        <Icon className={`h-4 w-4 text-${color}-500`} />
        <span className="text-sm font-medium">
          {value}
          {unit}
        </span>
        {status !== "normal" && (
          <Badge
            variant="outline"
            className={`text-xs text-${color}-600 border-${color}-200`}
          >
            {status === "high" ? (
              <TrendingUp className="h-3 w-3 mr-1" />
            ) : (
              <TrendingDown className="h-3 w-3 mr-1" />
            )}
            {status}
          </Badge>
        )}
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !loading && setOpen(isOpen)}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Add Medical Information
          </DialogTitle>
          <DialogDescription>
            Record vital signs and medical observations for the patient.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            {/* Vital Signs Section */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Vital Signs
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="temperature"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Thermometer className="h-4 w-4" />
                          Temperature (°C)
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.1"
                            placeholder="36.5"
                            {...field}
                            onChange={(e) =>
                              field.onChange(
                                Number.parseFloat(e.target.value) || 0
                              )
                            }
                          />
                        </FormControl>
                        <div className="mt-1">
                          <VitalIndicator
                            type="temperature"
                            value={field.value}
                            unit="°C"
                            icon={Thermometer}
                          />
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="heartRate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Heart className="h-4 w-4" />
                          Heart Rate (BPM)
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="72"
                            {...field}
                            onChange={(e) =>
                              field.onChange(
                                Number.parseInt(e.target.value) || 0
                              )
                            }
                          />
                        </FormControl>
                        <div className="mt-1">
                          <VitalIndicator
                            type="heartRate"
                            value={field.value}
                            unit=" bpm"
                            icon={Heart}
                          />
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="systolic"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Activity className="h-4 w-4" />
                          Systolic Pressure (mmHg)
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="120"
                            {...field}
                            onChange={(e) =>
                              field.onChange(
                                Number.parseInt(e.target.value) || 0
                              )
                            }
                          />
                        </FormControl>
                        <div className="mt-1">
                          <VitalIndicator
                            type="systolic"
                            value={field.value}
                            unit=" mmHg"
                            icon={Activity}
                          />
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="diastolic"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Activity className="h-4 w-4" />
                          Diastolic Pressure (mmHg)
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="80"
                            {...field}
                            onChange={(e) =>
                              field.onChange(
                                Number.parseInt(e.target.value) || 0
                              )
                            }
                          />
                        </FormControl>
                        <div className="mt-1">
                          <VitalIndicator
                            type="diastolic"
                            value={field.value}
                            unit=" mmHg"
                            icon={Activity}
                          />
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Blood Pressure Summary */}
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-sm font-medium mb-1">
                    Blood Pressure Reading
                  </p>
                  <p className="text-lg font-semibold">
                    {watchedValues.systolic}/{watchedValues.diastolic} mmHg
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Pain Assessment Section */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Pain Assessment
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="painLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pain Level (0-10 Scale)</FormLabel>
                      <FormControl>
                        <div className="space-y-3">
                          <Slider
                            value={[field.value]}
                            onValueChange={(value: any) =>
                              field.onChange(value[0])
                            }
                            max={10}
                            min={0}
                            step={1}
                            className="w-full"
                          />
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>No Pain</span>
                            <span>Worst Pain</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className={getPainLevelColor(field.value)}>
                              {field.value}/10 - {getPainLevelText(field.value)}
                            </Badge>
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Clinical Notes Section */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Clinical Notes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Clinical Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe the patient's condition, symptoms, and any relevant observations..."
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="isEmergency"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center space-x-2">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel className="flex items-center gap-2 cursor-pointer">
                          <AlertTriangle className="h-4 w-4 text-red-500" />
                          Mark as Emergency
                        </FormLabel>
                      </div>
                      {field.value && (
                        <Alert variant="destructive" className="mt-2">
                          <AlertTriangle className="h-4 w-4" />
                          <AlertDescription>
                            This case will be flagged as an emergency and
                            require immediate attention.
                          </AlertDescription>
                        </Alert>
                      )}
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Timestamp Display */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>Recorded at: {new Date().toLocaleString()}</span>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                type="button"
                onClick={() => setOpen(false)}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Medical Info"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
