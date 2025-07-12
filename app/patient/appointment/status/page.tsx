"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Loader2, CalendarClock, Stethoscope,CalendarCheck2   } from "lucide-react";

type Doctor = {
  _id: string;
  fullName: string;
  empId?: string;
};

type AppointmentStatus = "pending" | "approved" | "rejected";

type Appointment = {
  doctor: Doctor;
  requestStatus: AppointmentStatus;
  hospitalCenterId: string;
  requestDateTime: string;
  scheduledTime: string;
  responceFromH: string;
};

export default function RequestStatusPage() {
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await axios.get("/api/patient/regular-checkup/status");
        setAppointment(res.data.data);
      } catch (error) {
        console.error("Failed to fetch appointment:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
  }, []);

  const getStepStatus = (step: AppointmentStatus) => {
    if (!appointment) return "";

    const status = appointment.requestStatus;
    const stepOrder: AppointmentStatus[] = ["pending", "approved", "rejected"];

    if (status === step) return "step-primary";
    if (stepOrder.indexOf(status) > stepOrder.indexOf(step)) return "step-primary";
    return "";
  };

  return (
    <main className="max-w-3xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="bg-white rounded-2xl shadow-md p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">
            Appointment Request Status
          </h1>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <Loader2 className="animate-spin h-6 w-6 text-green-600" />
          </div>
        ) : appointment ? (
          <>
            <div className="w-full overflow-x-auto">
              <ul className="steps steps-vertical md:steps-horizontal w-full text-sm">
                <li className={`step ${getStepStatus("pending")}`}>Requested</li>
                <li className={`step ${getStepStatus("approved")}`}>Approved</li>
                <li className={`step ${getStepStatus("rejected")}`}>Rejected</li>
              </ul>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 text-sm text-gray-700">
              <div className="bg-gray-50 p-4 rounded-lg shadow-sm border">
                <div className="flex items-center gap-2 font-semibold text-gray-800">
                  <Stethoscope  className="w-5 h-5 text-green-500" />
                  Doctor
                </div>
                <div className="ml-7 mt-1">{appointment.doctor.fullName}</div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg shadow-sm border">
                <div className="font-semibold text-gray-800">Hospital Center ID</div>
                <div className="mt-1">{appointment.hospitalCenterId}</div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg shadow-sm border">
                <div className="flex items-center gap-2 font-semibold text-gray-800">
                  <CalendarClock className="w-5 h-5 text-green-500" />
                  Requested At
                </div>
                <div className="ml-7 mt-1">
                  {new Date(appointment.requestDateTime).toLocaleString()}
                </div>
              </div>

              {appointment.scheduledTime && (
                <div className="bg-gray-50 p-4 rounded-lg shadow-sm border">
                  <div className=" flex items-center gap-2 font-semibold text-gray-800">
                    <CalendarCheck2  className="w-5 h-5 text-green-500" />
                    Scheduled Time</div>
                  <div className="mt-1">{new Date(appointment.scheduledTime).toLocaleString()}</div>
                </div>
              )}

              {appointment.responceFromH && (
                <div className="bg-gray-50 p-4 rounded-lg shadow-sm border sm:col-span-2">
                  <div className="font-semibold text-gray-800">Hospital Response</div>
                  <div className="mt-1 text-gray-700">{appointment.responceFromH}</div>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="text-center text-gray-500 mt-6">
            No recent appointment request found.
          </div>
        )}
      </div>
    </main>
  );
}
