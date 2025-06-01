"use client";

import { useState, useCallback, memo } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  MoreVertical,
  Phone,
  Mail,
  MapPin,
  FileText,
  Trash2,
  Plus,
  Heart,
  Stethoscope,
} from "lucide-react";
import { TableInside } from "./tableInside";
import type { Patient } from "@/types/Patient";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { crud } from "@/app/api/apiService";
import { UserRoleCrud } from "@/types/UserRoleCrud";
import AddInfoDialog from "../cmd/addInfoDialog";
import { useUser } from "@/hooks/useUser";
import AddRehablitationDialog from "../cmd/addRehablitation";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";

interface PatientsCardProps {
  index: number;
  item: Patient;
  showButtons?: boolean;
  load?: boolean;
  onPatientDeleted?: (patientId: any) => void;
}

const PatientsCard = memo(function PatientsCard({
  item,
  index,
  showButtons = false,
  load = false,
  onPatientDeleted,
}: PatientsCardProps) {
  const [loading, setLoading] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [openAddInfo, setOpenAddInfo] = useState(false);
  const [openRehabi, setOpenRehabi] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const { user } = useUser();

  const handleDeleteConfirmed = useCallback(async () => {
    if (!item.id) return;

    setLoading(true);
    try {
      const resourceName = UserRoleCrud[item.role];
      await crud.remove({ resource: resourceName, id: item.id });

      toast.success("Patient deleted successfully");
      onPatientDeleted?.(item.id);
      setConfirmOpen(false);
    } catch (error) {
      console.error("Delete failed", error);
      toast.error("Failed to delete patient. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [item.id, item.role, onPatientDeleted]);

  const handleRecoverySubmit = useCallback(
    async (data: any) => {
      try {
        const res = await crud.createByID({
          resource: "RecoveryLog",
          data: data,
          id: item.id,
        });
        toast.success("Recovery log added successfully");
        console.log({ res });
      } catch (err) {
        console.error({ err });
        toast.error("Failed to add recovery log");
      }
    },
    [item.id]
  );

  const handleRehabilitationSubmit = useCallback(
    async (data: any) => {
      try {
        const res = await crud.createByID({
          resource: "Rehabilitation/plan",
          data: data,
          id: item.id,
        });
        toast.success("Rehabilitation plan added successfully");
        console.log({ res });
      } catch (err) {
        console.error({ err });
        toast.error("Failed to add rehabilitation plan");
      }
    },
    [item.id]
  );

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getStatusColor = (status?: string) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "inactive":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
      case "critical":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default:
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
    }
  };

  return (
    <>
      <Card className="group hover:shadow-lg transition-all duration-200 border-0 shadow-sm hover:shadow-md">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Avatar className="h-12 w-12 border-2 border-primary/10">
                <AvatarImage src={"/placeholder.svg"} alt={item.fullName} />
                <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                  {getInitials(item.fullName || "UN")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-lg truncate">
                  {item.fullName}
                </h3>
              </div>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <MoreVertical className="h-4 w-4" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => setDetailsOpen(true)}>
                  <FileText className="mr-2 h-4 w-4" />
                  View Details
                </DropdownMenuItem>
                {showButtons && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setOpenRehabi(true)}>
                      <Heart className="mr-2 h-4 w-4" />
                      Add Recovery Log
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setOpenAddInfo(true)}>
                      <Stethoscope className="mr-2 h-4 w-4" />
                      Add Rehabilitation
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                  </>
                )}
                <DropdownMenuItem
                  onClick={() => setConfirmOpen(true)}
                  className="text-destructive focus:text-destructive"
                  disabled={loading}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Patient
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          <div className="space-y-3">
            {/* Contact Information */}
            <div className="grid grid-cols-1 gap-2 text-sm">
              {item.email && (
                <div className="flex items-center text-muted-foreground">
                  <Mail className="mr-2 h-4 w-4 flex-shrink-0" />
                  <span className="truncate">{item.email}</span>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => setDetailsOpen(true)}
              >
                <FileText className="mr-2 h-4 w-4" />
                View Details
              </Button>
              {showButtons && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setOpenRehabi(true)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Patient Details Dialog */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={"/placeholder.svg"} alt={item.fullName} />
                <AvatarFallback>
                  {getInitials(item.fullName || "UN")}
                </AvatarFallback>
              </Avatar>
              {item.fullName}
            </DialogTitle>
            <DialogDescription>
              Complete patient information and medical records
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4">
            <TableInside data={item} showButtons={showButtons} load={load} />
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Patient</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <strong>{item.fullName}</strong>?
              This action cannot be undone and will permanently remove all
              patient data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirmed}
              disabled={loading}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {loading ? "Deleting..." : "Delete Patient"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Recovery Log Dialog */}
      {user && (
        <AddInfoDialog
          open={openRehabi}
          setOpen={setOpenRehabi}
          patientId={item.id}
          doctorId={user.id}
          onSubmit={handleRecoverySubmit}
        />
      )}

      {/* Rehabilitation Dialog */}
      {user && (
        <AddRehablitationDialog
          open={openAddInfo}
          setOpen={setOpenAddInfo}
          patientId={item.id}
          doctorId={user.id}
          onSubmit={handleRehabilitationSubmit}
        />
      )}
    </>
  );
});

export default PatientsCard;
