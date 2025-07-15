"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
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

interface Patient {
    fullName: string;
    gender: string;
    email: string;
    aadharNo: string;
    dateOfBirth: string;
    mobileNo: string;
    emergencyContact: string;
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

interface fetchedServices {
    _id: string;
    serviceName: string;
    category: string;
    department: string;
    baseCost: number;
    unit: string;
    description?: string;
    isActive: boolean;
}

export default function CheckupDetails() {
    const { id } = useParams();
    const [data, setData] = useState<CheckupDetails | null>(null);
    const [servicesData, setservicesData] = useState<fetchedServices[] | null>(null);
    const [centerId, setcenterId] = useState("");
    const [editMode, setEditMode] = useState(false);
    const { data: session } = useSession();

    const methods = useForm();

    useEffect(() => {
        if (session?.user?.centerId) {
            setcenterId(session.user.centerId);
        }
    }, [session]);

    useEffect(() => {
        axios.get(`/api/staff/regular-checkup/${id}`)
            .then((res) => setData(res.data.data))
            .catch((err) => console.error(err));
    }, [id]);

    useEffect(() => {
        if (centerId) {
            axios.get(`/api/services/${centerId}`)
                .then((res) => setservicesData(res.data.data))
                .catch((err) => console.error(err));
        }
    }, [centerId]);

    const onSubmit = async (formValues: any) => {
        if (!id) return alert("Invalid checkup ID");

        try {
            const payload = {
                appointmentRequest: id,
                service: {
                    serviceId: formValues.service,
                    unit: formValues.unit,
                    totalCost: parseFloat(formValues.totalCost),
                    note: formValues.note || "",
                    dateProvided: new Date(formValues.dateProvided),
                    isProvided: formValues.isProvided,
                    isPaid: formValues.isPaid
                }
            };
            
            
            const res = await axios.put("/api/staff/regular-checkup/treatment", payload);

            alert("Treatment service added successfully.");
            methods.reset();
            const updated = await axios.get(`/api/staff/regular-checkup/${id}`);
            setData(updated.data.data);

        } catch (error: any) {
            console.error("Error adding treatment service:", error);
            alert(error?.response?.data?.error || "Something went wrong.");
        }
    };

    const updateService = async (serviceId: string, updates: Partial<TreatmentService>) => {
        const confirmUpdate = window.confirm("Are you sure you want to update this treatment service?");
        if (!confirmUpdate) return;
        try {
            console.log(updates);
            await axios.post("/api/staff/regular-checkup/update-service", {
                serviceId,
                updatedData: updates
            });
            
            
            const updated = await axios.get(`/api/staff/regular-checkup/${id}`);
            setData(updated.data.data);
        } catch (err) {
            alert("Failed to update service");
        }
    };

    const deleteService = async (serviceId: string) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this treatment service?");
        if (!confirmDelete) return;

        try {
            await axios.delete("/api/staff/regular-checkup/remove-service", {
                data: { appointmentRequest: id, serviceId }
            });
            const updated = await axios.get(`/api/staff/regular-checkup/${id}`);
            setData(updated.data.data);
        } catch (err) {
            alert("Failed to delete service");
        }
    };


    if (!data) {
        return <p className="text-center mt-10 text-gray-500">Loading or No Data Found</p>;
    }

    const { patient, regularCheckup } = data;

    return (
        <div className="flex flex-col min-h-screen bg-white font-['Public_Sans','Noto_Sans',sans-serif]">
            <main className="px-4 sm:px-8 md:px-10 lg:px-40 py-6 flex justify-center">
                <div className="w-full max-w-5xl">
                    <Section title="Patient Information">
                        <InfoGrid patient={patient} />
                    </Section>

                    <Section title="Doctor Information">
                        <InfoGrid doctor={regularCheckup.doctor} />
                    </Section>

                    <Section title="Regular Checkup Information">
                        <CheckupTable regularCheckup={regularCheckup} />
                    </Section>

                    <Section title="Treatment Services">
                        <div className="flex items-center justify-between pb-2">
                            <Button onClick={() => setEditMode((prev) => !prev)}>{editMode ? "Cancel Edit" : "Edit Services"}</Button>
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button>Add Treatment</Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-lg w-full">
                                    <DialogHeader>
                                        <DialogTitle>Add Treatment Service</DialogTitle>
                                    </DialogHeader>
                                    <FormProvider {...methods}>
                                        <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
                                            <div>
                                                <Label htmlFor="service">Service</Label>
                                                <select {...methods.register("service", { required: true })} className="w-full border px-2 py-2 rounded">
                                                    {servicesData?.map((s) => (s.isActive && (
                                                        <option key={s._id} value={s._id}>
                                                            {s.serviceName} ({s.unit}) - ₹{s.baseCost}
                                                        </option>
                                                    )))}
                                                </select>
                                            </div>
                                            <div>
                                                <Label htmlFor="unit">Unit</Label>
                                                <Input {...methods.register("unit", { required: true })} />
                                            </div>
                                            <div>
                                                <Label htmlFor="totalCost">Total Cost</Label>
                                                <Input type="number" {...methods.register("totalCost", { required: true })} />
                                            </div>
                                            <div>
                                                <Label htmlFor="dateProvided">Date Provided</Label>
                                                <Input type="date" {...methods.register("dateProvided", { required: true })} />
                                            </div>
                                            <div>
                                                <Label htmlFor="note">Note</Label>
                                                <Textarea {...methods.register("note")} />
                                            </div>
                                            <div className="flex gap-4">
                                                <CheckboxField name="isProvided" label="Is Provided" />
                                                <CheckboxField name="isPaid" label="Is Paid" />
                                            </div>
                                            <Button type="submit" className="w-full">Add Service</Button>
                                        </form>
                                    </FormProvider>
                                </DialogContent>
                            </Dialog>
                        </div>
                        <TreatmentTable
                            treatments={regularCheckup.treatmentServices}
                            editMode={editMode}
                            onEdit={updateService}
                            onDelete={deleteService}
                        />
                    </Section>
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

function TreatmentTable({ treatments, editMode, onEdit, onDelete }: { treatments: TreatmentService[]; editMode?: boolean; onEdit?: any; onDelete?: any }) {
    return (
        <div className="overflow-x-auto">
            <div className="min-w-[800px] rounded-lg border border-[#dce1e5] bg-white">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="bg-white text-left font-medium text-[#111518]">
                            <th className="px-4 py-3">Service Name</th>
                            <th className="px-4 py-3">Cost</th>
                            <th className="px-4 py-3">Is Paid</th>
                            <th className="px-4 py-3">Is Provided</th>
                            <th className="px-4 py-3">Date Provided</th>
                            {editMode && <th className="px-4 py-3">Actions</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {treatments?.length > 0 ? (
                            treatments.map((item, index) => (
                                <tr key={index} className="border-t border-[#dce1e5]">
                                    <td className="px-4 py-4 text-[#637988]">{item.service?.serviceName || "N/A"}</td>
                                    <td className="px-4 py-4">
                                        {editMode ? (
                                            <Input
                                                type="number"
                                                defaultValue={item.totalCost}
                                                onBlur={(e) => onEdit(item._id, { totalCost: parseFloat(e.target.value) })}
                                            />
                                        ) : (
                                            `₹${item.totalCost || 0}`
                                        )}
                                    </td>
                                    <td className="px-4 py-4">
                                        {editMode ? (
                                            <select
                                                defaultValue={item.isPaid ? "true" : "false"}
                                                onChange={(e) => onEdit(item._id, { isPaid: e.target.value === "true" })}
                                            >
                                                <option value="true">Yes</option>
                                                <option value="false">No</option>
                                            </select>
                                        ) : item.isPaid ? "Yes" : "No"}
                                    </td>
                                    <td className="px-4 py-4">
                                        {editMode ? (
                                            <select
                                                defaultValue={item.isProvided}
                                                onChange={(e) => onEdit(item._id, { isProvided: e.target.value })}
                                            >
                                                <option value="provided">Provided</option>
                                                <option value="pending">Pending</option>
                                            </select>
                                        ) : item.isProvided}
                                    </td>
                                    <td className="px-4 py-4">
                                        {editMode ? (
                                            <Input
                                                type="date"
                                                defaultValue={item.dateProvided?.substring(0, 10)}
                                                onBlur={(e) => onEdit(item._id, { dateProvided: e.target.value })}
                                            />
                                        ) : (
                                            formatDate(item.dateProvided)
                                        )}
                                    </td>
                                    {editMode && (
                                        <td className="px-4 py-4">
                                            <Button onClick={() => onDelete(item._id)}>Delete</Button>
                                        </td>
                                    )}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={6} className="px-4 py-4 text-center text-[#999]">No treatment services available.</td>
                            </tr>
                        )}
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
