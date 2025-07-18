"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useForm, FormProvider } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/libs/ui/dialog";
import { Button } from "@/libs/ui/shadcn/button";
import { Input } from "@/libs/ui/shadcn/input";
import { Label } from "@/libs/ui/shadcn/label";
import { Textarea } from "@/libs/ui/shadcn/textarea";
import { CheckboxField } from "@/libs/ui/shadcn/checkbox";
import { format } from "date-fns";
import { VitalsTable } from "@/libs/ui/components/VitalsTable";
interface Patient {
  patientUId: string;
  fullName: string;
  gender: string;
  email: string;
  aadharNo: string;
  dateOfBirth: string;
  mobileNo: string;
  emergencyContact: string;
}
interface Vitals {
  weight: number;
  height: number;
  bmi: number;
  heartRate: number;
  bloodSugar: number;
  bloodPressure: string;
  temperature: number
}

interface Doctor {
  fullName: string;
  empId: string;
  gender: string;
  mobileNo: string;
  medicalSpeciality: string;
}

interface Service {
  _id: string;
  serviceName: string;
}

interface TreatmentService {
  _id: string;
  service: Service;
  isPaid: boolean;
  isProvided: string;
  totalCost: number;
  dateProvided: string;
}

interface Checkup {
  doctor: Doctor;
  followUpDate: string;
  notes: string;
  isDone: boolean;
  treatmentServices: TreatmentService[];
}

interface CheckupDetails {
  patient: Patient;
  regularCheckup: Checkup;
}


export default function CheckupDetails() {
  const { id } = useParams() as { id: string };
  const [data, setData] = useState<CheckupDetails | null>(null);
  const [vitals, setvitals] = useState<Vitals>()

  const router = useRouter()
  useEffect(() => {
    axios.get(`/api/staff/regular-checkup/${id}`)
      .then((res) => setData(res.data.data))
      .catch((err) => console.error(err));
  }, [id]);

  useEffect(() => {
    if (data?.patient?.patientUId) {
      axios.get(`/api/nurse/patientsvital/${data.patient.patientUId}`)
        .then((res) => {
          console.log("Vitals API response:", res.data);
          setvitals(res.data.data);
        })
        .catch((err) => console.error(err));
    }
  }, [data]);


  if (!data) {
    return <p className="text-center mt-10 text-gray-500">Loading or No Data Found</p>;
  }
  const handlemedhis =()=>{
    router.push(`/nurse/medical-history/${patient.patientUId}`)
  }
  const { patient, regularCheckup } = data;

  return (
    <div className="flex flex-col min-h-screen bg-white font-['Public_Sans','Noto_Sans',sans-serif]">
      <main className="px-4 sm:px-8 md:px-10 lg:px-40 py-6 flex justify-center">
        <div className="w-full max-w-5xl">
          <Section title="Patient Information">
            <InfoGrid patient={patient} />
          </Section>
          <div className="flex justify-between gap-8 mb-6">
            <Button onClick={handlemedhis}>Medical History</Button>
          </div>
          <Section title="Doctor Information">
            <InfoGrid doctor={regularCheckup.doctor} />
          </Section>

          <Section title="Regular Checkup Information">
            <CheckupTable regularCheckup={regularCheckup} />
          </Section>
          {vitals && (
            <div className="mb-10">
              <VitalsTable initialVitals={vitals} patientUid={id} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-8 px-2">
      <h2 className="text-lg font-bold text-[#111518] pb-2">{title}</h2>
      {children}
    </section>
  );
}

function InfoGrid({ patient, doctor }: { patient?: Patient; doctor?: Doctor }) {
  const fields = patient
    ? [
      ["Full Name", patient.fullName],
      ["Gender", patient.gender],
      ["Email", patient.email],
      ["Aadhar Number", patient.aadharNo],
      ["Date of Birth", formatDate(patient.dateOfBirth)],
      ["Mobile Number", patient.mobileNo],
      ["Emergency Contact", patient.emergencyContact],
    ]
    : doctor
      ? [
        ["Full Name", doctor.fullName],
        ["Gender", doctor.gender],
        ["Mobile Number", doctor.mobileNo],
        ["Medical Speciality", doctor.medicalSpeciality],
        ["Employee ID", doctor.empId],
      ]
      : [];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 border-t border-gray-200">
      {fields.map(([label, value]) => (
        <InfoItem key={label} label={label} value={value} />
      ))}
    </div>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 border-t border-gray-200 py-4 px-2">
      <p className="text-sm text-[#637988]">{label}</p>
      <p className="text-sm text-[#111518]">{value}</p>
    </div>
  );
}

function CheckupTable({ regularCheckup }: { regularCheckup: Checkup }) {
  return (
    <div className="overflow-x-auto">
      <div className="min-w-[600px] rounded-lg border border-[#dce1e5] bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-white text-left font-medium text-[#111518]">
              <th className="px-4 py-3">Doctor</th>
              <th className="px-4 py-3">Follow-up Date</th>
              <th className="px-4 py-3">Notes</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t border-[#dce1e5]">
              <td className="px-4 py-4 text-[#637988]">{regularCheckup.doctor.fullName}</td>
              <td className="px-4 py-4 text-[#637988]">{formatDate(regularCheckup.followUpDate)}</td>
              <td className="px-4 py-4 text-[#637988]">{regularCheckup.notes || "No notes provided."}</td>
              <td className="px-4 py-4">
                <span className="inline-block px-4 py-1 bg-[#f0f3f4] rounded text-[#111518] font-medium">
                  {regularCheckup.isDone ? "Completed" : "Pending"}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}



function formatDate(date: string) {
  if (!date) return "-";
  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}
