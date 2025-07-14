"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
} from "@/libs/ui/card";
import { Button } from "@/libs/ui/shadcn/button";
import { Avatar } from "@/libs/ui/shadcn/avtar";
import { Check, X } from "lucide-react";
import ScheduleDialog from "@/libs/ui/components/ScheduleDialog";
import AppointmentDetailsDialog from "@/libs/ui/components/AppointmentDetailsDialog";

interface Patient {
  fullName: string;
  gender: string;
  avtarImg?: string;
  user?: {
    email: string;
  };
}

interface Doctor {
  fullName: string;
  empId: string;
}

interface Appointment {
  _id: string;
  patient: Patient;
  doctor: Doctor;
  subscription?: {
    endingDate: string;
  };
  description?: string;
  requestDateTime?: string;
  requestStatus: "pending" | "rejected" | "approved";
}

interface FormData {
  sheduledDate?: string;
  sheduledTime?: string;
  responceFromH: string;
}

export default function AppointmentRequestsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selected, setSelected] = useState<Appointment | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<"accept" | "reject">("accept");

  useEffect(() => {
    axios.get("/api/staff/appointment-req")
      .then(res => setAppointments(res.data.data))
      .catch(err => console.error(err));
  }, []);

  const openDialog = (appointment: Appointment, type: "accept" | "reject") => {
    setSelected(appointment);
    setActionType(type);
    setDialogOpen(true);
  };

  const openDetailsDialog = (appointment: Appointment) => {
    setSelected(appointment);
    setDetailsDialogOpen(true);
  };

  const handleDialogSubmit = async (data: FormData) => {
    alert("hi")
    if (!selected) return;
    const payload = {
      reqId: selected._id,
      responceFromH: data.responceFromH,
      requestStatus: actionType === "accept" ? "approved" : "rejected",
      sheduledDate: data.sheduledDate || "",
      sheduledTime: data.sheduledTime || "00:00"
    };

    await axios.put("/api/staff/appointment-req", payload);
    setAppointments(prev => prev.filter(app => app._id !== selected._id));
    setDialogOpen(false);
  };

  return (
    <div className="flex justify-center px-4 sm:px-8 md:px-12 lg:px-20 xl:px-32">
      <div className="w-full max-w-4xl space-y-4 py-6">

        {appointments.length === 0 ? (
          <p className="text-center text-gray-500">No appointment requests found.</p>
        ) : (
          appointments.map((app) => (
            <Card
              key={app._id}
              className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-4 shadow hover:shadow-lg transition"
            >
              {/* Left: Patient Info */}
              <div
                className="flex items-center gap-4 cursor-pointer"
                onClick={() => openDetailsDialog(app)}
              >
                <Avatar src={app.patient?.avtarImg || "/default-avatar.png"} alt={app.patient?.fullName} />
                <div>
                  <p className="font-semibold">{app.patient?.fullName}</p>
                  <p className="text-sm text-gray-500">{app.patient?.gender}</p>
                </div>
              </div>

              {/* Center: Doctor Info */}
              <div className="text-left md:text-right space-y-1">
                <p className="text-sm font-medium">{app.doctor?.fullName}</p>
                <p className="text-xs text-gray-400">{app.doctor?.empId}</p>
              </div>

              {/* Right: Action Buttons */}
              <div className="flex gap-2 justify-end">
                <Button onClick={() => openDialog(app, "accept")}>
                  <Check className="w-4 h-4" />
                </Button>
                <Button className="bg-red-500 hover:bg-red-600" onClick={() => openDialog(app, "reject")}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          ))
        )}

        {/* Dialogs */}
        <ScheduleDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          onSubmit={handleDialogSubmit}
          type={actionType}
        />

        <AppointmentDetailsDialog
          open={detailsDialogOpen}
          onOpenChange={setDetailsDialogOpen}
          appointment={selected}
        />
      </div>
    </div>
  );
}
