"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { Input } from "@/libs/ui/shadcn/input";
import { Textarea } from "@/libs/ui/shadcn/textarea";
import { Button } from "@/libs/ui/shadcn/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/libs/ui/card";
import { UploadCloud, Plus } from "lucide-react";
import { Label } from "@/libs/ui/shadcn/label";
type Prescription = {
    medicine: string;
    date: string;
};

type Surgery = {
    nameOfSurgery: string;
    dateOfSurgery: string;
    reportFile: string;
};

type MedicalHistory = {
    pastIllness: string;
    geneticDisorders: string;
    allergies: string;
    currentMedications: string;
    pastMedicalTests: string[];
    pastPrescriptions: Prescription[];
    surgeries: Surgery[];
};

type MedicalHistoryFormInputs = Pick<
    MedicalHistory,
    "pastIllness" | "geneticDisorders" | "allergies" | "currentMedications"
>;

export default function MedicalHistoryPage() {
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<MedicalHistoryFormInputs>();

    const [medicalHistory, setMedicalHistory] = useState<MedicalHistory | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMedicalHistory = async () => {
            try {
                const res = await axios.get<{ data: MedicalHistory }>("/api/patient/medical-history");
                setMedicalHistory(res.data.data);

                const { pastIllness, geneticDisorders, allergies, currentMedications } = res.data.data;
                setValue("pastIllness", pastIllness);
                setValue("geneticDisorders", geneticDisorders);
                setValue("allergies", allergies);
                setValue("currentMedications", currentMedications);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchMedicalHistory();
    }, [setValue]);

    const onSubmit = async (data: MedicalHistoryFormInputs) => {
        try {
            const response = await axios.post("/api/patient/medical-history", data);

            if (response.status === 200 || response.status === 201) {
                alert(response.data.message); 
            } else {
                console.error("Unexpected status:", response.status);
            }
        } catch (error: any) {
            console.error("Error submitting medical history:", error);
            alert("Failed to update medical history.");
        }
    };


    if (loading) return <div className="p-4 text-center">Loading...</div>;

    return (
        <div className="max-w-4xl mx-auto p-4 space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle className="text-xl">General Medical Information</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="space-y-4">
                            <div className="space-y-1">
                                <Label htmlFor="pastIllness">Past Illness</Label>
                                <Textarea
                                    id="pastIllness"
                                    placeholder="Describe any past illnesses"
                                    {...register("pastIllness")}
                                />
                            </div>

                            <div className="space-y-1">
                                <Label htmlFor="geneticDisorders">Genetic Disorders</Label>
                                <Textarea
                                    id="geneticDisorders"
                                    placeholder="Any known genetic conditions"
                                    {...register("geneticDisorders")}
                                />
                            </div>

                            <div className="space-y-1">
                                <Label htmlFor="allergies">Allergies</Label>
                                <Textarea
                                    id="allergies"
                                    placeholder="Known allergies"
                                    {...register("allergies")}
                                />
                            </div>

                            <div className="space-y-1">
                                <Label htmlFor="currentMedications">Current Medications</Label>
                                <Textarea
                                    id="currentMedications"
                                    placeholder="Medications currently being taken"
                                    {...register("currentMedications")}
                                />
                            </div>
                        </div>

                        <Button type="submit">Update</Button>
                    </form>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Past Prescriptions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                    {medicalHistory?.pastPrescriptions && medicalHistory?.pastPrescriptions?.length > 0 ? (
                        medicalHistory.pastPrescriptions.map((presc: any, idx: number) => (
                            <div key={idx} className="p-3 border rounded-md text-sm bg-gray-50">
                                {presc.date}: {presc.medicine}
                            </div>
                        ))
                    ) : (
                        <p className="text-sm text-gray-500">No past prescriptions found.</p>
                    )}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Past Medical Tests</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <UploadCloud className="w-5 h-5 text-green-500" />
                        <span className="text-sm">Upload Report</span>
                        <Input type="file" className="hidden" />
                    </label>
                    {medicalHistory?.pastMedicalTests && medicalHistory?.pastMedicalTests?.length > 0 ? (
                        medicalHistory.pastMedicalTests.map((test: string, idx: number) => (
                            <div key={idx} className="p-3 border rounded-md text-sm bg-gray-50">
                                {test}
                            </div>
                        ))
                    ) : (
                        <p className="text-sm text-gray-500">No past tests found.</p>
                    )}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Surgeries</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {medicalHistory?.surgeries?.map((surgery: any, idx: number) => (
                        <div
                            key={idx}
                            className="border p-4 rounded-lg bg-gray-50 text-sm space-y-1"
                        >
                            <p><strong>Name:</strong> {surgery.nameOfSurgery}</p>
                            <p><strong>Date:</strong> {surgery.dateOfSurgery}</p>
                            <p><strong>Report:</strong> <a href={surgery.reportFile} target="_blank" rel="noopener noreferrer" className="text-green-600 underline">View Report</a></p>
                        </div>
                    ))}

                    <form className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Input type="text" placeholder="Surgery Name" />
                        <Input type="date" />
                        <label className="flex items-center gap-2 cursor-pointer">
                            <UploadCloud className="w-5 h-5 text-green-500" />
                            <span className="text-sm">Upload Report</span>
                            <Input type="file" className="hidden" />
                        </label>
                        <div className="sm:col-span-2">
                            <Button className="w-full flex items-center gap-2">
                                <Plus className="w-4 h-4" /> Add Surgery
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
