import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

type MedicalFormProps = {
  open: boolean;
  setOpen: (val: boolean) => void;
  patientId: number;
  doctorId: any;
  onSubmit: (data: any) => void;
};

export default function AddRehablitationDialog({
  open,
  setOpen,
  patientId,
  doctorId,
  onSubmit,
}: MedicalFormProps) {
  const [form, setForm] = useState({
    doctorId,
    plan: "",
  });

  const handleChange = (field: string, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    onSubmit(form);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md rounded-2xl p-6 shadow-lg bg-background">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Add Rehabilitation Plan
          </DialogTitle>
          <DialogDescription>
            Provide rehabilitation details for this patient.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 mt-4">
          <div className="grid gap-2">
            <Label htmlFor="plan" className="text-sm">
              Rehabilitation Plan
            </Label>
            <Textarea
              id="plan"
              placeholder="Describe the rehab plan..."
              value={form.plan}
              onChange={(e) => handleChange("plan", e.target.value)}
              className="min-h-[120px]"
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Submit</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
