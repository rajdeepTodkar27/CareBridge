"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import {
    Card,
    CardContent,
} from "@/libs/ui/card";
import { Avatar } from "@/libs/ui/shadcn/avtar";

interface Patient {
    fullName: string;
    gender: string;
    avtarImg?: string;
}

interface AppointmentRequest {
    _id: string;
    patient: Patient;
    description?: string;
    scheduledTime?: string;
}

interface Checkup {
    _id: string;
    appointmentRequest: AppointmentRequest;
}

export default function RegularCheckupPage() {
    const [checkups, setCheckups] = useState<Checkup[]>([]);
    const router = useRouter();

    useEffect(() => {
        axios.get("/api/doctor/regular-checkup") // replace with your actual API path
            .then(res => setCheckups(res.data.data))
            .catch(err => console.error(err));
    }, []);

    const handleCardClick = (appointmentId: string) => {
        router.push(`/doctor/regular-checkup/${appointmentId}`);
    };

    return (
        <div className="flex justify-center px-4 sm:px-8 md:px-12 lg:px-20 xl:px-32">
            <div className="w-full max-w-4xl space-y-4 py-6">
                {checkups.length === 0 ? (
                    <p className="text-center text-gray-500">No regular checkups scheduled.</p>
                ) : (
                    checkups.map(({ appointmentRequest }) => (
                        <Card
                            key={appointmentRequest._id}
                            className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-4 shadow hover:shadow-lg transition cursor-pointer"
                            onClick={() => handleCardClick(appointmentRequest._id)}
                        >
                            {/* Patient Info */}
                            <div className="flex items-center gap-4">
                                <Avatar
                                    src={appointmentRequest.patient?.avtarImg || "/default-avatar.png"}
                                    alt={appointmentRequest.patient?.fullName}
                                />
                                <div>
                                    <p className="font-semibold">{appointmentRequest.patient?.fullName}</p>
                                    <p className="text-sm text-gray-500">{appointmentRequest.patient?.gender}</p>
                                </div>
                            </div>

                            {/* Appointment Info */}
                            <div className="text-left md:text-right space-y-1">
                                <p className="text-sm text-gray-700">{appointmentRequest.description || "No description"}</p>

                                {appointmentRequest.scheduledTime ? (
                                    <div className="text-xs text-gray-400 space-y-1">
                                        <p>Date: {new Date(appointmentRequest.scheduledTime).toLocaleDateString()}</p>
                                        <p>Time: {new Date(appointmentRequest.scheduledTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}</p>
                                    </div>
                                ) : (
                                    <p className="text-xs text-gray-400">Not Scheduled</p>
                                )}
                            </div>

                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
