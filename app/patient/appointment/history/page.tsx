"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/libs/ui/card";
import { CalendarCheck, Clock } from "lucide-react";

export default function AppointmentHistoryPage() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [checkups, setCheckups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCheckups, setShowCheckups] = useState(true); // Default to showing checkups

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await axios.get("/api/patient/appointment-history");
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
    <div className="max-w-5xl mx-auto p-4 space-y-8">
      <div className="join flex justify-center mb-4">
        <button
          className={`btn join-item ${showCheckups ? "btn-primary" : "btn-outline"}`}
          onClick={() => setShowCheckups(true)}
        >
          Regular Checkups
        </button>
        <button
          className={`btn join-item ${!showCheckups ? "btn-primary" : "btn-outline"}`}
          onClick={() => setShowCheckups(false)}
        >
          Appointment Requests
        </button>
      </div>

      <div className="flex w-full flex-col lg:flex-row gap-4">
        {showCheckups && (
          <div className="card bg-base-300 rounded-box grow p-4">
            <h2 className="text-xl font-semibold flex items-center gap-2 mb-2">
              <CalendarCheck className="w-5 h-5 text-green-500" /> Regular Checkups
            </h2>
            {checkups.length > 0 ? (
              <ul className="space-y-3">
                {checkups.map((checkup, idx) => (
                  <li
                    key={idx}
                    className="bg-white p-4 rounded-xl shadow border space-y-1"
                  >
                    <div className="text-sm font-medium text-gray-800">
                      Doctor: {checkup.appointmentRequest.doctor?.fullName ?? "N/A"}
                    </div>
                    <div className="text-xs text-gray-600">
                      Follow-up: {checkup.followUpDate || "Not set"}
                    </div>
                    <div className="text-xs text-gray-500">
                      Notes: {checkup.notes || "No notes"}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500">No checkups found.</p>
            )}
          </div>
        )}

        {!showCheckups && (
          <div className="card bg-base-300 rounded-box grow p-4">
            <h2 className="text-xl font-semibold flex items-center gap-2 mb-2">
              <Clock className="w-5 h-5 text-orange-500" /> Appointment Requests
            </h2>
            {appointments.length > 0 ? (
              <ul className="space-y-3">
                {appointments.map((app, idx) => (
                  <li
                    key={idx}
                    className="bg-white p-4 rounded-xl shadow border space-y-1"
                  >
                    <div className="text-sm font-medium text-gray-800">
                      Status: {app.requestStatus}
                    </div>
                    <div className="text-xs text-gray-600">
                      Request Date: {app.requestDateTime}
                    </div>
                    <div className="text-xs text-gray-500">
                      Description: {app.description || "No description"}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500">No appointment requests found.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}