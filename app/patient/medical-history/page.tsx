"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { Input } from "@/libs/ui/shadcn/input";
import { Textarea } from "@/libs/ui/shadcn/textarea";
import { Button } from "@/libs/ui/shadcn/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/libs/ui/card";
import { Label } from "@/libs/ui/shadcn/label";
import { useParams, useRouter } from "next/navigation";
import MedicalTestSection from "@/libs/ui/components/MedicalTestSection";
import SurgerySection from "@/libs/ui/components/SurgerySection";
import PrescriptionTable from "@/libs/ui/components/PrescriptionTable";
import { extractPublicId } from "@/libs/utils";
import { useSession } from "next-auth/react";
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
  geneticDisorders: string;
  allergies: string;
  currentMedications: string;
  pastMedicalTests: MedicalTest[];
  pastPrescriptions: Prescription[];
  surgeries: Surgery[];
}

type MedicalHistoryFormInputs = Pick<
  MedicalHistory,
  "pastIllness" | "geneticDisorders" | "allergies" | "currentMedications"
>;

export default function MedicalHistoryPage() {
    const { data: session } = useSession();
  const [id, setid] = useState("")

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<MedicalHistoryFormInputs>();

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

  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);
  const [showModal, setShowModal] = useState(false);

  
  useEffect(() => {
    const fetchMedicalHistory = async () => {
      try {
        const res = await axios.get<{ data: MedicalHistory }>(`/api/patient/medical-history`);
        const fetchedData = res.data.data;
        setData(fetchedData);
        setMedicalTests(fetchedData.pastMedicalTests);

        const { pastIllness, geneticDisorders, allergies, currentMedications } = fetchedData;
        setValue("pastIllness", pastIllness);
        setValue("geneticDisorders", geneticDisorders);
        setValue("allergies", allergies);
        setValue("currentMedications", currentMedications);
      } catch (err) {
        console.error("Error loading history:", err);
      }
    };

   fetchMedicalHistory();
  }, [id, setValue]);

  const onSubmit = async (formData: MedicalHistoryFormInputs) => {
    try {
        
      const response = await axios.post("/api/patient/medical-history", formData);
      if (response.status === 200 || response.status === 201) {
        alert(response.data.message);
      } else {
        console.error("Unexpected status:", response.status);
      }
    } catch (error: any) {
      console.error("Submit failed:", error);
      alert("Failed to update medical history.");
    }
  };

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
      await axios.post("/api/patient/changereports", {
        patientId: id,
        ...newSurg,
      });

      setData((prev) => (prev ? { ...prev, surgeries: updatedSurgeries } : null));
      setNewSurgery({ nameOfSurgery: "", dateOfSurgery: "", reportFile: "", file: null });
      (document.getElementById("surgery-input") as HTMLInputElement).value = "";
    } catch (err) {
      console.error("Failed to add surgery:", err);
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

      await axios.patch("/api/patient/changereports", {
        patientId: id,
        surgeryToRemove: surgeryToDelete,
      });

      setData({ ...data, surgeries: updatedSurgeryList });
    } catch (error) {
      console.error("Delete surgery failed:", error);
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

      await axios.put("/api/patient/changereports", {
        patientId: id,
        newTest: testEntry,
      });

      setSelectedFile(null);
      setTestName("");
      (document.getElementById("upload-input") as HTMLInputElement).value = "";
    } catch (err) {
      console.error("Upload failed:", err);
    }
  };

  const handleDelete = async (index: number) => {
     const confirmDelete = confirm("Are you sure you want to delete this medical test report?");
    if (!confirmDelete) return;
    const test = medicalTests[index];
    const publicId = extractPublicId(test.testfile);

    try {
      await axios.post("/api/cloudinary/delete", { publicId });
      await axios.delete("/api/patient/changereports", {
        data: { patientId: id, testToRemove: test },
      });

      setMedicalTests((prev) => prev.filter((_, i) => i !== index));
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  if (!data) return <p className="p-4">Loading...</p>;

  return (
    <div className="max-w-5xl mx-auto p-4 space-y-10">
      {/* General Info Form */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">General Medical Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-3">
              <Label htmlFor="pastIllness">Past Illness</Label>
              <Textarea id="pastIllness" {...register("pastIllness")} />

              <Label htmlFor="geneticDisorders">Genetic Disorders</Label>
              <Textarea id="geneticDisorders" {...register("geneticDisorders")} />

              <Label htmlFor="allergies">Allergies</Label>
              <Textarea id="allergies" {...register("allergies")} />

              <Label htmlFor="currentMedications">Current Medications</Label>
              <Textarea id="currentMedications" {...register("currentMedications")} />
            </div>
            <Button type="submit">Update</Button>
          </form>
        </CardContent>
      </Card>

      {/* Surgeries */}
      <div>
        <h2 className="text-xl font-bold pb-2">Surgeries</h2>
        <SurgerySection
          surgeries={data.surgeries}
          newSurgery={newSurgery}
          setNewSurgery={setNewSurgery}
          handleAddSurgery={handleAddSurgery}
          handleDeleteSurgery={handleDeleteSurgery}
        />
      </div>

      {/* Medical Tests */}
      <div>
        <h2 className="text-xl font-bold pb-2">Medical Tests</h2>
        <MedicalTestSection
          testName={testName}
          setTestName={setTestName}
          selectedFile={selectedFile}
          handleFileChange={handleFileChange}
          handleUpload={handleUpload}
          medicalTests={medicalTests}
          handleDelete={handleDelete}
        />
      </div>

      {/* Prescriptions */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-3">
          <h2 className="text-xl font-bold">Past Prescriptions</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {[...data.pastPrescriptions]
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .map((prescription, index) => (
              <div
                key={index}
                onClick={() => {
                  setSelectedPrescription(prescription);
                  setShowModal(true);
                }}
                className="cursor-pointer border border-gray-200 shadow-sm rounded-xl p-4 hover:shadow-md transition"
              >
                <h3 className="text-base font-semibold text-green-700 mb-1">
                  Prescription {index + 1}
                </h3>
                <p className="text-sm text-gray-500">
                  Date: {new Date(prescription.date).toLocaleDateString()}
                </p>
              </div>
            ))}
        </div>
      </div>

      {/* Modal */}
      {showModal && selectedPrescription && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-8">
          <div className="relative bg-white w-full max-w-3xl max-h-[90vh] rounded-xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-xl"
              aria-label="Close"
            >
              ✖
            </button>
            <div className="p-6 overflow-y-auto max-h-[80vh]">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">Prescription Details</h3>
              <PrescriptionTable prescriptions={[selectedPrescription]} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
