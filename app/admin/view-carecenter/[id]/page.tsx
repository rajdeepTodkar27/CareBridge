"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "next/navigation";
import { Save, Pencil } from "lucide-react";

interface Staff {
  _id: string;
  name: string;
  email: string;
  role: string;
}

interface Center {
  _id: string;
  centerId: string;
  branchId: string;
  name: string;
  type: string;
  address: string;
  city: string;
  state: string;
  email: string;
  phoneNo: number;
  latitude: number;
  longitude: number;
}

const CareCenterDetailPage = () => {
  const params = useParams();
  const { id } = params;  // centerId
  const [center, setCenter] = useState<Center | null>(null);
  const [staff, setStaff] = useState<Staff[]>([]);
  const [editMode, setEditMode] = useState(false);
  const [updatedCenter, setUpdatedCenter] = useState<Partial<Center>>({});
  const [errMessage, setErrMessage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setErrMessage("");
        const res = await axios.get(`/api/admin/stafinfo/${id}`);
        setCenter(res.data.data.allCenter);
        setUpdatedCenter(res.data.data.allCenter);
        setStaff(res.data.data.staff);
      } catch (error: any) {
        console.error(error);
        setErrMessage(error?.response?.data?.message || "Something went wrong.");
      }
    };

    fetchData();
  }, [id]);

  const handleUpdate = async () => {
    try {
      await axios.put(`/api/admin/update-carecenter/${id}`, updatedCenter);
      alert("Updated successfully");
      setEditMode(false);
    } catch (error) {
      console.log(error);
      alert("Update failed");
    }
  };

  if (!center) {
    return <p>Loading...</p>;
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#f8fafc] to-[#e2e8f0] py-12 px-4">
      <div className="max-w-5xl mx-auto space-y-8">
        <h2 className="text-3xl font-bold text-gray-900 text-center">Care Center Details</h2>

        {errMessage && <p className="text-red-600 text-center">{errMessage}</p>}

        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">{center.name}</h3>
            {!editMode ? (
              <button onClick={() => setEditMode(true)} className="text-blue-500">
                <Pencil size={20} /> Edit
              </button>
            ) : (
              <button onClick={handleUpdate} className="bg-green-500 text-white px-4 py-1 rounded">
                <Save size={20} className="inline" /> Save
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label>Branch ID</label>
              <input
                className="border p-2 rounded w-full"
                value={updatedCenter.branchId || ""}
                readOnly={!editMode}
                onChange={(e) => setUpdatedCenter({ ...updatedCenter, branchId: e.target.value })}
              />
            </div>
            <div>
              <label>Type</label>
              <input
                className="border p-2 rounded w-full"
                value={updatedCenter.type || ""}
                readOnly={!editMode}
                onChange={(e) => setUpdatedCenter({ ...updatedCenter, type: e.target.value })}
              />
            </div>
            <div>
              <label>City</label>
              <input
                className="border p-2 rounded w-full"
                value={updatedCenter.city || ""}
                readOnly={!editMode}
                onChange={(e) => setUpdatedCenter({ ...updatedCenter, city: e.target.value })}
              />
            </div>
            <div>
              <label>State</label>
              <input
                className="border p-2 rounded w-full"
                value={updatedCenter.state || ""}
                readOnly={!editMode}
                onChange={(e) => setUpdatedCenter({ ...updatedCenter, state: e.target.value })}
              />
            </div>
            <div>
              <label>Email</label>
              <input
                className="border p-2 rounded w-full"
                value={updatedCenter.email || ""}
                readOnly={!editMode}
                onChange={(e) => setUpdatedCenter({ ...updatedCenter, email: e.target.value })}
              />
            </div>
            <div>
              <label>Phone</label>
              <input
                className="border p-2 rounded w-full"
                value={updatedCenter.phoneNo || ""}
                readOnly={!editMode}
                onChange={(e) => setUpdatedCenter({ ...updatedCenter, phoneNo: Number(e.target.value) })}
              />
            </div>
          </div>
        </div>

        <div className="mt-10">
          <h3 className="text-2xl font-semibold mb-4">Staff Assigned</h3>
          <div className="flex overflow-x-auto space-x-6 pb-4">
            {staff.map((person) => (
              <div key={person._id} className="w-72 bg-white p-4 rounded-xl shadow">
                <h4 className="text-lg font-bold">{person.name || "N/A"}</h4>
                <p className="text-gray-600">{person.email}</p>
                <p className="text-gray-700 font-medium">{person.role.toUpperCase()}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
};

export default CareCenterDetailPage;
