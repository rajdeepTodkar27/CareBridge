// /components/AppointmentDetailsDialog.tsx
"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../dialog";
// import { Appointment } from "../path/to/types"; // replace with actual path
interface Patient {
    fullName: string;
    gender: string;
    avtarImg?: string;
    patient?: {
        email: string;
    };
}

interface Doctor {
    fullName: string;
    empId: string;
}

type Appointment = {
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

export default function AppointmentDetailsDialog({
    open,
    onOpenChange,
    appointment,
}: {
    open: boolean;
    onOpenChange: (val: boolean) => void;
    appointment: Appointment | null;
}) {
    if (!appointment) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Appointment Details</DialogTitle>
                </DialogHeader>
                <div className="space-y-2 text-sm">
                    <p><strong>Patient Name:</strong> {appointment.patient.fullName}</p>
                    <p><strong>Gender:</strong> {appointment.patient.gender}</p>
                    <p><strong>Email:</strong> {appointment.patient.patient?.email || "N/A"}</p>
                    <p><strong>Doctor:</strong> {appointment.doctor.fullName} ({appointment.doctor.empId})</p>
                    <p><strong>Request Date:</strong> {appointment.requestDateTime ? new Date(appointment.requestDateTime).toLocaleDateString() : "N/A"}</p>
                    <p><strong>Request Time:</strong> {appointment.requestDateTime ? new Date(appointment.requestDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "N/A"}</p>
                    <p><strong>Subscription Ends:</strong> {appointment.subscription?.endingDate ? new Date(appointment.subscription.endingDate).toISOString().split("T")[0] : "N/A"}</p>
                    <p><strong>Status:</strong> {appointment.requestStatus}</p>
                </div>
            </DialogContent>
        </Dialog>
    );
}
