"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Clock } from "lucide-react";

export default function AppointmentHistoryPage() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<"pending" | "rejected">("pending");
  const [selectedApp, setSelectedApp] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await axios.get("/api/patient/appointment-history");
        setAppointments(res.data.data.appReq);
      } catch (err) {
        console.error("Failed to fetch appointments", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, []);

  const filteredAppointments = appointments.filter(
    (app) => app.requestStatus === selectedStatus
  );

  if (loading) return <div className="p-4 text-center">Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-8">
      {/* Toggle Buttons */}
      <div className="join flex flex-wrap justify-center gap-2">
        <button
          className={`btn join-item w-full sm:w-auto ${selectedStatus === "pending" ? "bg-yellow-600 text-white" : "btn-outline"}`}
          onClick={() => setSelectedStatus("pending")}
        >
          Pending Appointments
        </button>
        <button
          className={`btn join-item w-full sm:w-auto ${selectedStatus === "rejected" ? "bg-red-600 text-white" : "btn-outline"}`}
          onClick={() => setSelectedStatus("rejected")}
        >
          Rejected Appointments
        </button>
      </div>

      {/* Appointment Cards */}
      <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
        {filteredAppointments.length > 0 ? (
          filteredAppointments.map((app, idx) => (
            <div
              key={idx}
              onClick={() => setSelectedApp(app)}
              className="cursor-pointer bg-white rounded-xl shadow-md p-4 border hover:shadow-lg transition"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <Clock className="h-5 w-5 text-orange-500" />
                  Appointment
                </h3>
                <span
                  className={`text-xs font-medium px-2 py-1 rounded-full ${
                    app.requestStatus === "pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {app.requestStatus}
                </span>
              </div>
              <p className="text-sm text-gray-700">
                <strong>Date:</strong>{" "}
                {app.requestDateTime ? new Date(app.requestDateTime).toLocaleDateString() : "N/A"}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                <strong>Description:</strong> {app.description || "No description"}
              </p>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500 col-span-full text-center">
            No {selectedStatus} appointment requests found.
          </p>
        )}
      </div>

      {/* Modal */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white max-w-xl w-full rounded-xl p-6 relative overflow-y-auto max-h-[90vh] shadow-xl">
            <button
              onClick={() => setSelectedApp(null)}
              className="absolute top-3 right-4 text-xl text-gray-500 hover:text-gray-800"
            >
              ✖
            </button>

            <h2 className="text-xl font-bold mb-4 text-gray-800">Appointment Details</h2>
            <div className="space-y-3 text-sm text-gray-700">
              <div>
                <strong>Status:</strong>{" "}
                <span
                  className={`px-2 py-1 rounded ${
                    selectedApp.requestStatus === "pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {selectedApp.requestStatus}
                </span>
              </div>
              <div>
                <strong>Date:</strong>{" "}
                {selectedApp.requestDateTime
                  ? new Date(selectedApp.requestDateTime).toLocaleString()
                  : "N/A"}
              </div>
              <div>
                <strong>Description:</strong> {selectedApp.description || "No description"}
              </div>
              <div>
                <strong>Scheduled Time:</strong>{" "}
                {selectedApp.scheduledTime || "Not scheduled"}
              </div>
              <div>
                <strong>Response from Hospital:</strong>{" "}
                {selectedApp.responceFromH || "No response"}
              </div>
              <div>
                <strong>Doctor:</strong>{" "}
                {"Not assigned"}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
