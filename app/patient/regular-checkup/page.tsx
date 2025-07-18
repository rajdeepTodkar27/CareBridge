// "use client";

// import { useEffect, useState } from "react";
// import axios from "axios";
// import { useRouter } from "next/navigation";
// import { CalendarCheck } from "lucide-react";

// export default function AppointmentHistoryPage() {
//     const [checkups, setCheckups] = useState<any[]>([]);
//     const [loading, setLoading] = useState(true);
//     const [isDone, setIsDone] = useState(false); // false = pending, true = completed
//     const router = useRouter();

//     useEffect(() => {
//         const fetchCheckups = async () => {
//             try {
//                 const res = await axios.get("/api/patient/regular-checkup");
//                 const allCheckups = res.data.data.regularCheckups;
//                 setCheckups(allCheckups);
//             } catch (err) {
//                 console.error("Failed to fetch checkups", err);
//             } finally {
//                 setLoading(false);
//             }
//         };
//         fetchCheckups();
//     }, []);

//     const filteredCheckups = checkups.filter((c) => c.isDone === isDone);

//     if (loading) return <div className="p-4 text-center">Loading...</div>;

//     return (
//         <div className="max-w-6xl mx-auto p-4 space-y-8">
//             {/* Toggle Buttons */}
//             <div className="join flex flex-wrap justify-center gap-2">
//                 <button
//                     className={`btn join-item w-full sm:w-auto ${!isDone ? "bg-green-700 text-white" : "btn-outline"}`}
//                     onClick={() => setIsDone(false)}
//                 >
//                     Pending Checkups
//                 </button>
//                 <button
//                     className={`btn join-item w-full sm:w-auto ${isDone ? "bg-green-700 text-white" : "btn-outline"}`}
//                     onClick={() => setIsDone(true)}
//                 >
//                     Completed Checkups
//                 </button>
//             </div>

//             {/* Checkup Cards */}
//             <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
//                 {filteredCheckups.length > 0 ? (
//                     filteredCheckups.map((checkup, idx) => (
//                         <div
//                             key={idx}
//                             className="bg-white rounded-xl shadow-md p-4 border hover:shadow-lg transition cursor-pointer"
//                             onClick={() => router.push(`/checkup/details/${checkup._id}`)} // 🔁 Update this route as needed
//                         >
//                             <div className="flex items-center justify-between mb-2">
//                                 <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
//                                     <CalendarCheck className="h-5 w-5 text-green-600" />
//                                     Regular Checkup
//                                 </h3>
// <span className="text-xs text-gray-500">
//     {checkup.followUpDate
//         ? new Date(checkup.followUpDate).toLocaleDateString()
//         : "Follow-up: Not set"}
// </span>
//                             </div>
//                             <p className="text-sm text-gray-700">
//                                 <strong>Doctor:</strong>{" "}
//                                 {checkup.appointmentRequest?.doctor?.fullName ?? "N/A"}
//                             </p>
//                             <p className="text-sm text-gray-600 mt-1">
//                                 <strong>Notes:</strong> {checkup.notes || "No notes"}
//                             </p>
// <p className="text-sm text-gray-600 mt-1">
//     <strong>Scheduled:</strong>{" "}
//     {checkup.appointmentRequest?.scheduledTime
//         ? new Date(checkup.appointmentRequest.scheduledTime).toLocaleString()
//         : "Not scheduled"}
// </p>

//                         </div>
//                     ))
//                 ) : (
//                     <p className="text-sm text-gray-500 col-span-full text-center">
//                         No {isDone ? "completed" : "pending"} checkups found.
//                     </p>
//                 )}
//             </div>
//         </div>
//     );
// }


"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { CalendarCheck } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/libs/ui/dialog";

export default function AppointmentHistoryPage() {
    const [checkups, setCheckups] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isDone, setIsDone] = useState(false);
    const [openPopup, setOpenPopup] = useState(false);
    const [selectedCheckup, setSelectedCheckup] = useState<any | null>(null);

    useEffect(() => {
        const fetchCheckups = async () => {
            try {
                const res = await axios.get("/api/patient/regular-checkup");
                setCheckups(res.data.data.regularCheckups);
            } catch (err) {
                console.error("Failed to fetch checkups", err);
            } finally {
                setLoading(false);
            }
        };
        fetchCheckups();
    }, []);

    const filteredCheckups = checkups.filter((c) => c.isDone === isDone);

    const formatDate = (dateString: string) => {
        if (!dateString) return "-";
        const date = new Date(dateString);
        return date.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    return (
        <div className="max-w-6xl mx-auto p-4 space-y-8">
            <div className="join flex flex-wrap justify-center gap-2">
                <button
                    className={`btn join-item w-full sm:w-auto ${!isDone ? "bg-green-700 text-white" : "btn-outline"}`}
                    onClick={() => setIsDone(false)}
                >
                    Pending Checkups
                </button>
                <button
                    className={`btn join-item w-full sm:w-auto ${isDone ? "bg-green-700 text-white" : "btn-outline"}`}
                    onClick={() => setIsDone(true)}
                >
                    Completed Checkups
                </button>
            </div>

            <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
                {loading ? (
                    <p className="text-center">Loading...</p>
                ) : filteredCheckups.length > 0 ? (
                    filteredCheckups.map((checkup, idx) => (
                        <div
                            key={idx}
                            className="bg-white rounded-xl shadow-md p-4 border hover:shadow-lg transition cursor-pointer"
                            onClick={() => {
                                setSelectedCheckup(checkup);
                                setOpenPopup(true);
                            }}
                        >
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                                    <CalendarCheck className="h-5 w-5 text-green-600" />
                                    Regular Checkup
                                </h3>
                                <span className="text-xs text-gray-500">Follow-up:
                                    {checkup.followUpDate
                                        ? new Date(checkup.followUpDate).toLocaleDateString()
                                        : " Not set"}
                                </span>
                            </div>
                            <p className="text-sm text-gray-700">
                                <strong>Doctor:</strong> {checkup.appointmentRequest?.doctor?.fullName ?? "N/A"}
                            </p>
                            <p className="text-sm text-gray-600 mt-1">
                                <strong>Notes:</strong> {checkup.notes || "No notes"}
                            </p>
                            <p className="text-sm text-gray-600 mt-1">
                                <strong>Scheduled:</strong>{" "}
                                {checkup.appointmentRequest?.scheduledTime
                                    ? new Date(checkup.appointmentRequest.scheduledTime).toLocaleString()
                                    : "Not scheduled"}
                            </p>
                        </div>
                    ))
                ) : (
                    <p className="text-sm text-gray-500 col-span-full text-center">
                        No {isDone ? "completed" : "pending"} checkups found.
                    </p>
                )}
            </div>

            {/* Popup for Treatment Services */}
            <Dialog open={openPopup} onOpenChange={setOpenPopup}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Treatment Services</DialogTitle>
                    </DialogHeader>
                    {selectedCheckup?.treatmentServices?.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm min-w-[800px] border">
                                <thead className="bg-white text-left font-medium text-[#111518]">
                                    <tr>
                                        <th className="px-4 py-3">Service Name</th>
                                        <th className="px-4 py-3">Cost</th>
                                        <th className="px-4 py-3">Is Paid</th>
                                        <th className="px-4 py-3">Is Provided</th>
                                        <th className="px-4 py-3">Date Provided</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {selectedCheckup.treatmentServices.map((item: any, index: number) => (
                                        <tr key={index} className="border-t border-[#dce1e5]">
                                            <td className="px-4 py-4 text-[#637988]">{item.service?.serviceName || "N/A"}</td>
                                            <td className="px-4 py-4">₹{item.totalCost || 0}</td>
                                            <td className="px-4 py-4">{item.isPaid ? "Yes" : "No"}</td>
                                            <td className="px-4 py-4">{item.isProvided}</td>
                                            <td className="px-4 py-4">{formatDate(item.dateProvided)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p className="text-center py-4 text-gray-500">No treatment services found.</p>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
