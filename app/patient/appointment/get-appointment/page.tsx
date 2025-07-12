// "use client";

// import { useEffect, useState } from "react";
// import { useForm } from "react-hook-form";
// import { Card, CardContent } from "@/libs/ui/card";
// import { Button } from "@/libs/ui/shadcn/button";
// import { Input } from "@/libs/ui/shadcn/input";
// import { Textarea } from "@/libs/ui/shadcn/textarea";
// import { Label } from "@/libs/ui/shadcn/label";
// import { Loader2 } from "lucide-react";
// import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/libs/ui/shadcn/select";
// import axios from "axios";
// type AppointmentForm = {
//     branchId: string;
//     hospitalCenterId: string;
//     doctor: string;
//     description: string;
//     requestDate: string;
//     requestTime: string;
// };
// type carecenter = {
//   _id: string;
//   centerId: string;
//   name: string;
//   type: string; 
//   branchId: string;
// };
// type typedoctor = {
//   _id: string;
//   fullName: string;
//   gender?: string;
//   medicalSpeciality?: string;
// };


// export default function AppointmentRequestPage() {
//     const { register, handleSubmit, watch, setValue } = useForm<AppointmentForm>();
//     const [branchIds, setBranchIds] = useState<string[]>([]);
//     const [centers, setCenters] = useState<carecenter[]>([]);
//     const [doctors, setDoctors] = useState<typedoctor[]>([]);

//     const [loadingCenters, setLoadingCenters] = useState(false);
//     const [loadingDoctors, setLoadingDoctors] = useState(false);

//     const selectedBranchId = watch("branchId");
//     const selectedHospitalCenterId = watch("hospitalCenterId");
//     useEffect(() => {
//         const fetchBranchIds = async () => {
//             try {
//                 const res = await axios.get("/api/patient/carecenter");
//                 setBranchIds(res.data.data);
//             } catch (error) {
//                 console.error("Failed to fetch branch IDs:", error);
//             }
//         };
//         fetchBranchIds();
//     }, []);

//     useEffect(() => {
//         if (!selectedBranchId) return;

//         const fetchCenters = async () => {
//             setLoadingCenters(true);
//             try {
//                 const res = await axios.put("/api/patient/carecenter", {
//                     branchId: selectedBranchId,
//                 });

//                 const hospitalCenters = res.data.data.filter(
//                     (center: any) => center.type === "hospital"
//                 );

//                 setCenters(hospitalCenters);
//             } catch (error) {
//                 console.error("Failed to fetch centers:", error);
//             } finally {
//                 setLoadingCenters(false);
//             }
//         };

//         fetchCenters();
//     }, [selectedBranchId]);

//     useEffect(() => {
//         if (!selectedHospitalCenterId) return;

//         const fetchDoctors = async () => {
//             setLoadingDoctors(true);
//             try {
//                 const res = await axios.post("/api/patient/carecenter", { centerId: selectedHospitalCenterId });
//                 setDoctors(res.data.data);
//             } catch (error) {
//                 console.error("Failed to fetch doctors:", error);
//             } finally {
//                 setLoadingDoctors(false);
//             }
//         };

//         fetchDoctors();
//     }, [selectedHospitalCenterId]);

//     const onSubmit = async(data: AppointmentForm) => {
//         console.log("Appointment Request:", data);
//                 try {
//             const response = await axios.post("/api/patient/regular-checkup", data);

//             if (response.status === 201) {
//                 alert(response.data.message); 
//             } else {
//                 console.error("Unexpected status:", response.status);
//             }
//         } catch (error: any) {
//             console.error("Error submitting medical history:", error);
//             alert("Failed to update medical history.");
//         }
//     };

//     return (
//         <div className="max-w-3xl mx-auto mt-10 px-4">
//             <Card className="shadow-xl rounded-2xl">
//                 <CardContent className="space-y-6 py-6">
//                     <h2 className="text-2xl font-semibold text-center">Request an Appointment</h2>

//                     {/* Branch ID */}
//                     <div>
//                         <Label>Branch</Label>
//                         <Select onValueChange={(val) => setValue("branchId", val)}>
//                             <SelectTrigger>
//                                 <SelectValue placeholder="Select Branch ID" />
//                             </SelectTrigger>
//                             <SelectContent>
//                                 {branchIds.map((bid) => (
//                                     <SelectItem key={bid} value={bid}>
//                                         {bid}
//                                     </SelectItem>
//                                 ))}
//                             </SelectContent>
//                         </Select>
//                     </div>

//                     {/* Hospital Center */}
//                     <div>
//                         <Label>Hospital Care Center</Label>
//                         <Select onValueChange={(val) => setValue("hospitalCenterId", val)} disabled={loadingCenters || !selectedBranchId}>
//                             <SelectTrigger>
//                                 <SelectValue placeholder={loadingCenters ? "Loading..." : "Select Care Center"} />
//                             </SelectTrigger>
//                             <SelectContent>
//                                 {centers.map((center) => (
//                                     <SelectItem key={center.centerId} value={center.centerId}>
//                                         {center.name} ({center.type})
//                                     </SelectItem>
//                                 ))}
//                             </SelectContent>
//                         </Select>
//                     </div>

//                     {/* Doctor */}
//                     <div>
//                         <Label>Doctor</Label>
//                         <Select onValueChange={(val) => setValue("doctor", val)} disabled={loadingDoctors || !selectedHospitalCenterId}>
//                             <SelectTrigger>
//                                 <SelectValue placeholder={loadingDoctors ? "Loading..." : "Select Doctor"} />
//                             </SelectTrigger>
//                             <SelectContent>
//                                 {doctors.map((doc) => (
//                                     <SelectItem key={doc._id} value={doc._id}>
//                                         {doc.fullName} ({doc.medicalSpeciality})
//                                     </SelectItem>
//                                 ))}
//                             </SelectContent>
//                         </Select>
//                     </div>

//                     {/* Description */}
//                     <div>
//                         <Label>Description</Label>
//                         <Textarea placeholder="Brief about your condition..." {...register("description")} />
//                     </div>

//                     {/* Request Date */}
//                     <div>
//                         <Label>Request Date</Label>
//                         <Input type="date" {...register("requestDate", { required: true })} />
//                     </div>

//                     {/* Request Time */}
//                     <div>
//                         <Label>Request Time</Label>
//                         <Input type="time" {...register("requestTime", { required: true })} />
//                     </div>

//                     {/* Submit Button */}
//                     <Button className="w-full mt-4" onClick={handleSubmit(onSubmit)}>
//                         Submit Appointment Request
//                     </Button>
//                 </CardContent>
//             </Card>
//         </div>
//     );
// }

"use client"
import { useState } from 'react';

const AppointmentForm = () => {
  const [selectedBranch, setSelectedBranch] = useState('Main Street Clinic');
  const [selectedCareCenter, setSelectedCareCenter] = useState('Oncology');
  const [selectedDoctor, setSelectedDoctor] = useState('Dr. Amelia Harper');
  const [selectedDate, setSelectedDate] = useState('July 15, 2024');
  const [selectedTime, setSelectedTime] = useState('10:00');
  const [reason, setReason] = useState('');

  const branches = [
    { name: 'Main Street Clinic', distance: '5 miles away' },
    { name: 'Downtown Care Center', distance: '12 miles away' },
    { name: 'Uptown Medical Hub', distance: '20 miles away' },
  ];

  const careCenters = [
    { name: 'Oncology', description: 'Specialized cancer treatments' },
    { name: 'Radiology', description: 'Imaging and diagnostics' },
    { name: 'Chemotherapy', description: 'Chemotherapy sessions' },
  ];

  const doctors = [
    { name: 'Dr. Amelia Harper', specialty: 'Oncologist' },
    { name: 'Dr. Ethan Carter', specialty: 'Radiologist' },
    { name: 'Dr. Olivia Bennett', specialty: 'Chemotherapist' },
  ];

  const times = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log({
      branch: selectedBranch,
      careCenter: selectedCareCenter,
      doctor: selectedDoctor,
      date: selectedDate,
      time: selectedTime,
      reason,
    });
  };

  return (
    <div className="relative flex size-full min-h-screen flex-col bg-white group/design-root overflow-x-hidden">
      <div className="layout-container flex h-full grow flex-col">
        <div className="px-40 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col w-[512px] max-w-[512px] py-5 max-w-[960px] flex-1">
            <div className="flex flex-wrap justify-between gap-3 p-4">
              <p className="text-[#111518] tracking-light text-[32px] font-bold leading-tight min-w-72">Book an Appointment</p>
            </div>
            
            {/* Branch Selection */}
            <h3 className="text-[#111518] text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">1. Select Branch</h3>
            <div className="flex flex-col gap-3 p-4">
              {branches.map((branch) => (
                <label key={branch.name} className="flex items-center gap-4 rounded-lg border border-solid border-[#dbe1e6] p-[15px] flex-row-reverse">
                  <input
                    type="radio"
                    className="h-5 w-5 border-2 border-[#dbe1e6] bg-transparent text-transparent checked:border-[#111518] checked:bg-[image:--radio-dot-svg] focus:outline-none focus:ring-0 focus:ring-offset-0 checked:focus:border-[#111518]"
                    name="branch"
                    checked={selectedBranch === branch.name}
                    onChange={() => setSelectedBranch(branch.name)}
                  />
                  <div className="flex grow flex-col">
                    <p className="text-[#111518] text-sm font-medium leading-normal">{branch.name}</p>
                    <p className="text-[#617989] text-sm font-normal leading-normal">{branch.distance}</p>
                  </div>
                </label>
              ))}
            </div>

            {/* Care Center Selection */}
            <h3 className="text-[#111518] text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">2. Select Care Center</h3>
            <div className="flex flex-col gap-3 p-4">
              {careCenters.map((center) => (
                <label key={center.name} className="flex items-center gap-4 rounded-lg border border-solid border-[#dbe1e6] p-[15px] flex-row-reverse">
                  <input
                    type="radio"
                    className="h-5 w-5 border-2 border-[#dbe1e6] bg-transparent text-transparent checked:border-[#111518] checked:bg-[image:--radio-dot-svg] focus:outline-none focus:ring-0 focus:ring-offset-0 checked:focus:border-[#111518]"
                    name="careCenter"
                    checked={selectedCareCenter === center.name}
                    onChange={() => setSelectedCareCenter(center.name)}
                  />
                  <div className="flex grow flex-col">
                    <p className="text-[#111518] text-sm font-medium leading-normal">{center.name}</p>
                    <p className="text-[#617989] text-sm font-normal leading-normal">{center.description}</p>
                  </div>
                </label>
              ))}
            </div>

            {/* Doctor Selection */}
            <h3 className="text-[#111518] text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">3. Select Doctor</h3>
            <div className="flex flex-col gap-3 p-4">
              {doctors.map((doctor) => (
                <label key={doctor.name} className="flex items-center gap-4 rounded-lg border border-solid border-[#dbe1e6] p-[15px] flex-row-reverse">
                  <input
                    type="radio"
                    className="h-5 w-5 border-2 border-[#dbe1e6] bg-transparent text-transparent checked:border-[#111518] checked:bg-[image:--radio-dot-svg] focus:outline-none focus:ring-0 focus:ring-offset-0 checked:focus:border-[#111518]"
                    name="doctor"
                    checked={selectedDoctor === doctor.name}
                    onChange={() => setSelectedDoctor(doctor.name)}
                  />
                  <div className="flex grow flex-col">
                    <p className="text-[#111518] text-sm font-medium leading-normal">{doctor.name}</p>
                    <p className="text-[#617989] text-sm font-normal leading-normal">{doctor.specialty}</p>
                  </div>
                </label>
              ))}
            </div>

            {/* Appointment Details */}
            <h3 className="text-[#111518] text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">4. Appointment Details</h3>
            <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
              <label className="flex flex-col min-w-40 flex-1">
                <p className="text-[#111518] text-base font-medium leading-normal pb-2">Reason for Visit</p>
                <input
                  placeholder="Briefly describe your health issue or consultation topic"
                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#111518] focus:outline-0 focus:ring-0 border border-[#dbe1e6] bg-white focus:border-[#dbe1e6] h-14 placeholder:text-[#617989] p-[15px] text-base font-normal leading-normal"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                />
              </label>
            </div>

            {/* Calendar */}
            <div className="flex flex-wrap items-center justify-center gap-6 p-4">
              <div className="flex min-w-72 max-w-[336px] flex-1 flex-col gap-0.5">
                <div className="flex items-center p-1 justify-between">
                  <button>
                    <div className="text-[#111518] flex size-10 items-center justify-center" data-icon="CaretLeft" data-size="18px" data-weight="regular">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18px" height="18px" fill="currentColor" viewBox="0 0 256 256">
                        <path d="M165.66,202.34a8,8,0,0,1-11.32,11.32l-80-80a8,8,0,0,1,0-11.32l80-80a8,8,0,0,1,11.32,11.32L91.31,128Z"></path>
                      </svg>
                    </div>
                  </button>
                  <p className="text-[#111518] text-base font-bold leading-tight flex-1 text-center">July 2024</p>
                  <button>
                    <div className="text-[#111518] flex size-10 items-center justify-center" data-icon="CaretRight" data-size="18px" data-weight="regular">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18px" height="18px" fill="currentColor" viewBox="0 0 256 256">
                        <path d="M181.66,133.66l-80,80a8,8,0,0,1-11.32-11.32L164.69,128,90.34,53.66a8,8,0,0,1,11.32-11.32l80,80A8,8,0,0,1,181.66,133.66Z"></path>
                      </svg>
                    </div>
                  </button>
                </div>
                <div className="grid grid-cols-7">
                  <p className="text-[#111518] text-[13px] font-bold leading-normal tracking-[0.015em] flex h-12 w-full items-center justify-center pb-0.5">S</p>
                  <p className="text-[#111518] text-[13px] font-bold leading-normal tracking-[0.015em] flex h-12 w-full items-center justify-center pb-0.5">M</p>
                  <p className="text-[#111518] text-[13px] font-bold leading-normal tracking-[0.015em] flex h-12 w-full items-center justify-center pb-0.5">T</p>
                  <p className="text-[#111518] text-[13px] font-bold leading-normal tracking-[0.015em] flex h-12 w-full items-center justify-center pb-0.5">W</p>
                  <p className="text-[#111518] text-[13px] font-bold leading-normal tracking-[0.015em] flex h-12 w-full items-center justify-center pb-0.5">T</p>
                  <p className="text-[#111518] text-[13px] font-bold leading-normal tracking-[0.015em] flex h-12 w-full items-center justify-center pb-0.5">F</p>
                  <p className="text-[#111518] text-[13px] font-bold leading-normal tracking-[0.015em] flex h-12 w-full items-center justify-center pb-0.5">S</p>
                  {Array.from({ length: 30 }, (_, i) => i + 1).map((day) => (
                    <button 
                      key={day} 
                      className={`h-12 w-full text-[#111518] text-sm font-medium leading-normal ${day === 5 ? 'text-white' : ''}`}
                      onClick={() => setSelectedDate(`July ${day}, 2024`)}
                    >
                      <div className={`flex size-full items-center justify-center rounded-full ${day === 5 ? 'bg-[#2a9fed]' : ''}`}>
                        {day}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Time Slots */}
            <h3 className="text-[#111518] text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">Available Time Slots</h3>
            <div className="flex flex-wrap gap-3 p-4">
              {times.map((time) => (
                <label
                  key={time}
                  className="text-sm font-medium leading-normal flex items-center justify-center rounded-lg border border-[#dbe1e6] px-4 h-11 text-[#111518] has-[:checked]:border-[3px] has-[:checked]:px-3.5 has-[:checked]:border-[#2a9fed] relative cursor-pointer"
                >
                  {time}
                  <input 
                    type="radio" 
                    className="invisible absolute" 
                    name="time" 
                    checked={selectedTime === time}
                    onChange={() => setSelectedTime(time)}
                  />
                </label>
              ))}
            </div>

            {/* Confirmation */}
            <h3 className="text-[#111518] text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">5. Confirmation</h3>
            <div className="p-4 grid grid-cols-[20%_1fr] gap-x-6">
              <div className="col-span-2 grid grid-cols-subgrid border-t border-t-[#dbe1e6] py-5">
                <p className="text-[#617989] text-sm font-normal leading-normal">Branch</p>
                <p className="text-[#111518] text-sm font-normal leading-normal">{selectedBranch}</p>
              </div>
              <div className="col-span-2 grid grid-cols-subgrid border-t border-t-[#dbe1e6] py-5">
                <p className="text-[#617989] text-sm font-normal leading-normal">Care Center</p>
                <p className="text-[#111518] text-sm font-normal leading-normal">{selectedCareCenter}</p>
              </div>
              <div className="col-span-2 grid grid-cols-subgrid border-t border-t-[#dbe1e6] py-5">
                <p className="text-[#617989] text-sm font-normal leading-normal">Doctor</p>
                <p className="text-[#111518] text-sm font-normal leading-normal">{selectedDoctor}</p>
              </div>
              <div className="col-span-2 grid grid-cols-subgrid border-t border-t-[#dbe1e6] py-5">
                <p className="text-[#617989] text-sm font-normal leading-normal">Date</p>
                <p className="text-[#111518] text-sm font-normal leading-normal">{selectedDate}</p>
              </div>
              <div className="col-span-2 grid grid-cols-subgrid border-t border-t-[#dbe1e6] py-5">
                <p className="text-[#617989] text-sm font-normal leading-normal">Time</p>
                <p className="text-[#111518] text-sm font-normal leading-normal">{selectedTime}</p>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex px-4 py-3">
              <button
                className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 flex-1 bg-[#2a9fed] text-white text-sm font-bold leading-normal tracking-[0.015em]"
                onClick={handleSubmit}
              >
                <span className="truncate">Book Appointment</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentForm;