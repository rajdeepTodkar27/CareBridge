"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "next/navigation";
import { extractPublicId } from "@/libs/utils";
import MedicalTestSection from "@/libs/ui/components/MedicalTestSection";
import SurgerySection from "@/libs/ui/components/SurgerySection";
import PrescriptionTable from "@/libs/ui/components/PrescriptionTable";
interface Surgery {
  nameOfSurgery: string;
  dateOfSurgery: string;
  reportFile: string;
}

interface MedicalTest {
  nameOfTest: string;
  testfile: string;
}

interface Medicine {
  medName: string;
  quantity: string;
  dosage: string;
}

interface Prescription {
  medicine: Medicine[];
  date: string;
}

interface MedicalHistory {
  pastIllness: string;
  surgeries: Surgery[];
  currentMedications: string;
  allergies: string;
  geneticDisorders: string;
  pastMedicalTests: MedicalTest[];
  pastPrescriptions: Prescription[];
}

export default function MedicalHistoryPage() {
  const { id } = useParams();
  const [data, setData] = useState<MedicalHistory | null>(null);
  const [medicalTests, setMedicalTests] = useState<MedicalTest[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [testName, setTestName] = useState("");
  const [newSurgery, setNewSurgery] = useState<Surgery & { file?: File | null }>({
    nameOfSurgery: "",
    dateOfSurgery: "",
    reportFile: "",
    file: null,
  });

  const handleAddSurgery = async () => {
    if (!newSurgery.nameOfSurgery || !newSurgery.dateOfSurgery || !newSurgery.file) {
      return alert("Please fill all fields.");
    }

    try {
      const formData = new FormData();
      formData.append("file", newSurgery.file);
      formData.append("folder", "surgeryReports");

      const uploadRes = await axios.post("/api/upload", formData);
      const uploadedUrl = uploadRes.data.secure_url;

      const newSurg = {
        nameOfSurgery: newSurgery.nameOfSurgery,
        dateOfSurgery: newSurgery.dateOfSurgery,
        reportFile: uploadedUrl,
      };

      const updatedSurgeries = [...(data?.surgeries || []), newSurg];

      await axios.post("/api/doctor/medical-history/surgeries", {
        patientId: id,
        ...newSurg,
      });

      setData((prev) => (prev ? { ...prev, surgeries: updatedSurgeries } : null));

      setNewSurgery({ nameOfSurgery: "", dateOfSurgery: "", reportFile: "", file: null });
      (document.getElementById("surgery-input") as HTMLInputElement).value = "";
    } catch (err) {
      console.error("Failed to add surgery:", err);
      alert("Error uploading surgery. Please try again.");
    }
  };

  const handleDeleteSurgery = async (index: number) => {
    if (!data) return;
    const confirmDelete = confirm("Are you sure you want to delete this surgery?");
    if (!confirmDelete) return;

    const surgeryToDelete = data.surgeries[index];
    try {
      const publicId = extractPublicId(surgeryToDelete.reportFile);
      await axios.post("/api/cloudinary/delete", { publicId });

      const updatedSurgeryList = [...data.surgeries];
      updatedSurgeryList.splice(index, 1);

      await axios.patch("/api/doctor/medical-history/surgeries", {
        patientId: id,
        surgeryToRemove: surgeryToDelete,
      });

      setData({ ...data, surgeries: updatedSurgeryList });
    } catch (error) {
      console.error("Delete surgery failed:", error);
      alert("Failed to delete surgery. Please try again.");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const uploadTestFile = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", "medicalTests");

    const uploadRes = await axios.post("/api/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return uploadRes.data.secure_url;
  };

  const handleUpload = async () => {
    if (!selectedFile || !testName.trim()) {
      return alert("Please enter test name and select a file.");
    }

    try {
      const secureUrl = await uploadTestFile(selectedFile);
      const testEntry = { nameOfTest: testName.trim(), testfile: secureUrl };

      const updatedTests = [...medicalTests, testEntry];
      setMedicalTests(updatedTests);

      await axios.put("/api/doctor/medical-history/test", {
        patientId: id,
        newTest: testEntry,
      });

      setSelectedFile(null);
      setTestName("");
      (document.getElementById("upload-input") as HTMLInputElement).value = "";
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Upload failed.");
    }
  };

  const handleDelete = async (index: number) => {
    const test = medicalTests[index];
    const publicId = extractPublicId(test.testfile);

    try {
      await axios.post("/api/cloudinary/delete", { publicId });
      await axios.delete("/api/doctor/medical-history/test", {
        data: { patientId: id, testToRemove: test },
      });

      setMedicalTests((prev) => prev.filter((_, i) => i !== index));
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Deletion failed");
    }
  };

  useEffect(() => {
    if (!id) return;
    axios.get(`/api/doctor/medical-history/${id}`).then((res) => {
      setData(res.data.data);
      setMedicalTests(res.data.data.pastMedicalTests);
    });
  }, [id]);

  if (!data) return <p className="px-10 py-6">Loading...</p>;

  const renderRow = (label: string, value: string) => (
    <div className="col-span-2 grid grid-cols-1 md:grid-cols-subgrid border-t border-t-[#dde1e3] py-5 gap-2 md:gap-0">
      <p className="text-[#6a7881] text-sm font-normal leading-normal">{label}</p>
      <p className="text-[#121516] text-sm font-normal leading-normal">{value}</p>
    </div>
  );

  return (
    <div className="relative flex size-full min-h-screen flex-col bg-white group/design-root overflow-x-hidden" style={{ fontFamily: '"Public Sans", "Noto Sans", sans-serif' }}>
      <div className="layout-container flex h-full grow flex-col">
        <div className="px-4 sm:px-8 md:px-20 lg:px-40 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col w-full max-w-[960px] flex-1">
            <div className="flex flex-wrap justify-between gap-3 p-4">
              <div className="flex w-full min-w-0 flex-col gap-3">
                <p className="text-[#121516] tracking-light text-2xl sm:text-3xl font-bold leading-tight">Patient Medical History</p>
                <p className="text-[#6a7881] text-sm font-normal leading-normal">Comprehensive overview of patient's medical background</p>
              </div>
            </div>

            {/* Past Illnesses */}
            <h2 className="text-[#121516] text-xl sm:text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Past Illnesses</h2>
            <div className="p-4 grid grid-cols-1 md:grid-cols-[20%_1fr] gap-x-6">
              {data.pastIllness.split(",").map((illness, i) => renderRow(illness.trim(), ""))}
            </div>

          

            {/* Current Medications */}
            <h2 className="text-[#121516] text-xl sm:text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Current Medications</h2>
            <div className="p-4 grid grid-cols-1 md:grid-cols-[20%_1fr] gap-x-6">
              {data.currentMedications.split(",").map((med, i) => renderRow(med.trim(), ""))}
            </div>
              {/* Surgeries */}
            <h2 className="text-[#121516] text-xl sm:text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Surgeries</h2>
            <SurgerySection
              surgeries={data.surgeries}
              newSurgery={newSurgery}
              setNewSurgery={setNewSurgery}
              handleAddSurgery={handleAddSurgery}
              handleDeleteSurgery={handleDeleteSurgery}
            />
            {/* Allergies */}
            <h2 className="text-[#121516] text-xl sm:text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Allergies</h2>
            <div className="p-4 grid grid-cols-1 md:grid-cols-[20%_1fr] gap-x-6">
              {renderRow(data.allergies, "")}
            </div>

            {/* Genetic Disorders */}
            <h2 className="text-[#121516] text-xl sm:text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Genetic Disorders</h2>
            <div className="p-4 grid grid-cols-1 md:grid-cols-[20%_1fr] gap-x-6">
              {renderRow(data.geneticDisorders, "")}
            </div>
     
            <MedicalTestSection
              testName={testName}
              setTestName={setTestName}
              selectedFile={selectedFile}
              handleFileChange={handleFileChange}
              handleUpload={handleUpload}
              medicalTests={medicalTests}
              handleDelete={handleDelete}
            />

            {/* Prescriptions */}
            <h2 className="text-[#121516] text-xl sm:text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Past Prescriptions</h2>
            <PrescriptionTable prescriptions={data.pastPrescriptions} />
          </div>
        </div>
      </div>
    </div >
  );
}