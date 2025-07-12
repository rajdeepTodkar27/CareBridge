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

  const handleDialogSubmit = async (data: FormData) => {
    if (!selected) return;

    const payload = {
      reqId: selected._id,
      responceFromH: data.responceFromH,
      requestStatus: actionType === "accept" ? "approved" : "rejected",
      sheduledDate: data.sheduledDate || new Date().toISOString().split("T")[0],
      sheduledTime: data.sheduledTime || "00:00"
    };

    await axios.put("/api/staff/appointment-req", payload);
    setAppointments(prev => prev.filter(app => app._id !== selected._id));
    setDialogOpen(false);
  };

  return (
    <div className="p-6 space-y-4">
      {appointments.map((app) => (
        <Card key={app._id} className="flex items-center justify-between p-4 shadow hover:shadow-lg transition cursor-pointer">
          <div className="flex items-center space-x-4" onClick={() => alert(JSON.stringify(app, null, 2))}>
            <Avatar src={app.patient?.avtarImg || "/default-avatar.png"} alt={app.patient?.fullName} />
            <div>
              <p className="font-semibold">{app.patient?.fullName}</p>
              <p className="text-sm text-gray-500">{app.patient?.gender}</p>
            </div>
          </div>

          <div className="text-right space-y-1">
            <p className="text-sm font-medium">{app.doctor?.fullName}</p>
            <p className="text-xs text-gray-400">{app.doctor?.empId}</p>
          </div>

          <div className="flex space-x-2">
            <Button  onClick={() => openDialog(app, "accept")} >
              <Check className="w-4 h-4" />
            </Button>
            <Button onClick={() => openDialog(app, "reject")} >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </Card>
      ))}

      <ScheduleDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleDialogSubmit}
        type={actionType}
      />
    </div>
  );
}