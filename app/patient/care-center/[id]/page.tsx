"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "next/navigation";
import { Card, CardContent } from "@/libs/ui/card";
import { Loader2, MapPin, Users,LayoutGrid } from "lucide-react";
import DoctorCard from "@/libs/ui/components/DoctorCard";
import StaffCard from "@/libs/ui/components/StaffCard";
import ServicesCard from "@/libs/ui/components/ServicesCard";
interface Center {
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

interface Doctor {
  fullName: string;
  avtarImg: string;
  gender: string;
  medicalSpeciality: string;
  experience: number;
  administrativeTitle: string;
  licenseNo: string;
  licenseAuthority: string;
}

interface Nurse {
  avtarImg: string;
  fullName: string;
  gender: string;
  qualification: string;
  institute: string;
  administrativeTitle: string;
}
interface services {
  serviceName: string;
  centerId: string;
  category: string;
  department: string;
  baseCost: number;
  unit: number;
  description: string;
  isActive: boolean;
}

export default function StaffInfoPage() {
  const { id } = useParams();
  const [center, setCenter] = useState<Center | null>(null);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [nurses, setNurses] = useState<Nurse[]>([]);
  const [activeServices, setactiveServices] = useState<services[]>([])
  const [loading, setLoading] = useState(true);
  const [errMessage, setErrMessage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setErrMessage("");
        const res = await axios.get(`/api/patient/carecenter/${id}`);
        setCenter(res.data.data.allCenter);
        setDoctors(res.data.data.doctors);
        setNurses(res.data.data.nurses);
        setactiveServices(res.data.data.activeServices);
      } catch (error: any) {
        console.error(error);
        setErrMessage(error?.response?.data?.error || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="animate-spin w-10 h-10 text-green-500" />
      </div>
    );
  }

  if (errMessage) {
    return (
      <div className="text-center text-red-500 mt-10">
        <p>{errMessage}</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Center Info */}
      <Card className="bg-white/70 backdrop-blur-md shadow-xl border border-gray-200 rounded-2xl">
        <CardContent className="p-6 space-y-4">
          <h2 className="text-3xl font-bold text-gray-800">{center?.name}</h2>
          <p className="text-gray-600 capitalize font-medium">{center?.type}</p>
          <div className="grid sm:grid-cols-2 gap-4 text-sm text-gray-700">
            <div>
              <strong>Address:</strong><br />
              {center?.address}, {center?.city}, {center?.state}
            </div>
            <div>
              <strong>Phone:</strong> {center?.phoneNo}<br />
              <strong>Email:</strong> {center?.email}
            </div>
          </div>
          <a
            href={`https://www.google.com/maps?q=${center?.latitude},${center?.longitude}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-white bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg transition"
          >
            <MapPin className="w-4 h-4" />
            View on Google Maps
          </a>
        </CardContent>
      </Card>

      {/* Doctors */}
      <Card className="bg-white shadow-md border border-gray-200 rounded-2xl">
        <CardContent className="p-6">
          <h3 className="text-2xl font-semibold flex items-center gap-2 text-gray-800 mb-6">
            <Users className="w-6 h-6 text-green-500" />
            Doctors ({doctors.length})
          </h3>
          {doctors.length > 0 ? (
            <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {doctors.map((doc, idx) => (
                <DoctorCard key={idx} doc={doc} />
              ))}
            </ul>

          ) : (
            <p className="text-gray-500">No doctors found.</p>
          )}
        </CardContent>
      </Card>

      {/* Nurses */}
      <Card className="bg-white shadow-md border border-gray-200 rounded-2xl">
        <CardContent className="p-6">
          <h3 className="text-2xl font-semibold flex items-center gap-2 text-gray-800 mb-6">
            <Users className="w-6 h-6 text-blue-500" />
            Nurses ({nurses.length})
          </h3>
          {nurses.length > 0 ? (
            <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {nurses.map((nurse, idx) => (
                <StaffCard key={idx} nurse={nurse} />
              ))}
            </ul>

          ) : (
            <p className="text-gray-500">No nurses found.</p>
          )}
        </CardContent>
      </Card>
      <Card className="bg-white shadow-md border border-gray-200 rounded-2xl">
        <CardContent className="p-6">
          <h3 className="text-2xl font-semibold flex items-center gap-2 text-gray-800 mb-6">
            <LayoutGrid className="w-6 h-6 text-green-500" />
             Services ({activeServices.length})
          </h3>

          {activeServices.length > 0 ? (
            <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {activeServices.map((service, idx) => (
                <ServicesCard key={idx} service={service} />
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No active services found.</p>
          )}
        </CardContent>
      </Card>

    </div>
  );
}
