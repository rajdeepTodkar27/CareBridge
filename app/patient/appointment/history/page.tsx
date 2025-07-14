"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { CalendarCheck, Clock } from "lucide-react";

export default function AppointmentHistoryPage() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [checkups, setCheckups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCheckups, setShowCheckups] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await axios.get("/api/patient/regular-checkup");
        setAppointments(res.data.data.appReq);
        setCheckups(res.data.data.regularCheckups);
      } catch (err) {
        console.error("Failed to fetch history", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  if (loading) return <div className="p-4 text-center">Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-8">
      {/* Toggle Buttons */}
      <div className="join flex flex-wrap justify-center gap-2">
        <button
          className={`btn join-item w-full sm:w-auto ${showCheckups ? "bg-green-700 text-white" : "btn-outline"}`}
          onClick={() => setShowCheckups(true)}
        >
          Regular Checkups
        </button>
        <button
          className={`btn join-item w-full sm:w-auto ${!showCheckups ? "bg-green-700 text-white" : "btn-outline"}`}
          onClick={() => setShowCheckups(false)}
        >
          Appointment Requests
        </button>
      </div>

      {/* Display Cards */}
      <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
        {showCheckups
          ? checkups.length > 0
            ? checkups.map((checkup, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-xl shadow-md p-4 border hover:shadow-lg transition"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                      <CalendarCheck className="h-5 w-5 text-green-600" />
                      Regular Checkup
                    </h3>
                    <span className="text-xs text-gray-500">
                      {checkup.followUpDate
                        ? new Date(checkup.followUpDate).toLocaleDateString()
                        : "Follow-up: Not set"}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700">
                    <strong>Doctor:</strong> {checkup.appointmentRequest?.doctor?.fullName ?? "N/A"}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    <strong>Notes:</strong> {checkup.notes || "No notes"}
                  </p>
                </div>
              ))
            : <p className="text-sm text-gray-500 col-span-full text-center">No checkups found.</p>
          : appointments.length > 0
            ? appointments.map((app, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-xl shadow-md p-4 border hover:shadow-lg transition"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                      <Clock className="h-5 w-5 text-orange-500" />
                      Appointment
                    </h3>
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${app.requestStatus === "approved"
                      ? "bg-green-100 text-green-800"
                      : app.requestStatus === "pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                    }`}>
                      {app.requestStatus}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700">
                    <strong>Date:</strong> {app.requestDateTime ? new Date(app.requestDateTime).toLocaleDateString() : "N/A"}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    <strong>Description:</strong> {app.description || "No description"}
                  </p>
                </div>
              ))
            : <p className="text-sm text-gray-500 col-span-full text-center">No appointment requests found.</p>
        }
      </div>
    </div>
  );
}
