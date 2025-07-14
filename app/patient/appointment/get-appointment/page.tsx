
"use client";

import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import axios from "axios";
import Select from "@/libs/ui/stitchUi/select";
import Textarea from "@/libs/ui/stitchUi/textarea";
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';

type AppointmentForm = {
  branchId: string;
  hospitalCenterId: string;
  doctor: string;
  description: string;
  requestDate: string;
  requestTime: string;
  selectedTimeSlot?: string;
};

type CareCenter = {
  _id: string;
  centerId: string;
  name: string;
  type: string;
  branchId: string;
};

type Doctor = {
  _id: string;
  fullName: string;
  gender?: string;
  medicalSpeciality?: string;
};

export default function AppointmentRequestPage() {
  const { register, control, handleSubmit, watch, setValue } = useForm<AppointmentForm>({
    defaultValues: {
      branchId: undefined,
      hospitalCenterId: undefined,
      doctor: undefined,
      description: "",
      requestDate: "",
      requestTime: ""
    }
  });
  const [branchIds, setBranchIds] = useState<string[]>([]);
  const [centers, setCenters] = useState<CareCenter[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loadingCenters, setLoadingCenters] = useState(false);
  const [loadingDoctors, setLoadingDoctors] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>("");

  const selectedBranchId = useWatch({ control, name: "branchId" });
  const selectedHospitalCenterId = useWatch({ control, name: "hospitalCenterId" });
  const selectedDoctor = useWatch({ control, name: "doctor" });

  const selectedBranch = branchIds.find(b => b === selectedBranchId);
  const selectedCenter = centers.find(c => c.centerId === selectedHospitalCenterId);
  const selectedDoctorInfo = doctors.find(d => d._id === selectedDoctor);

  useEffect(() => {
    const fetchBranchIds = async () => {
      try {
        const res = await axios.get("/api/patient/carecenter");
        setBranchIds(res.data.data);
      } catch (error) {
        console.error("Failed to fetch branch IDs:", error);
      }
    };
    fetchBranchIds();
  }, []);

  useEffect(() => {
    if (!selectedBranchId) return;

    const fetchCenters = async () => {
      setLoadingCenters(true);
      try {
        const res = await axios.put("/api/patient/carecenter", {
          branchId: selectedBranchId,
        });
        const hospitalCenters = res.data.data.filter(
          (center: any) => center.type === "hospital"
        );
        setCenters(hospitalCenters);
      } catch (error) {
        console.error("Failed to fetch centers:", error);
      } finally {
        setLoadingCenters(false);
      }
    };
    fetchCenters();
  }, [selectedBranchId]);

  useEffect(() => {
    if (!selectedHospitalCenterId) return;

    const fetchDoctors = async () => {
      setLoadingDoctors(true);
      try {
        const res = await axios.post("/api/patient/carecenter", {
          centerId: selectedHospitalCenterId
        });
        setDoctors(res.data.data);
      } catch (error) {
        console.error("Failed to fetch doctors:", error);
      } finally {
        setLoadingDoctors(false);
      }
    };
    fetchDoctors();
  }, [selectedHospitalCenterId]);

  const onSubmit = async (data: AppointmentForm) => {
    try {
      const response = await axios.post("/api/patient/regular-checkup", {
        ...data,
        selectedTimeSlot
      });

      if (response.status === 201) {
        alert(response.data.message);
      } else {
        console.error("Unexpected status:", response.status);
      }
    } catch (error: any) {
      console.error("Error submitting appointment:", error);
      alert("Failed to book appointment.");
    }
  };

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setValue("requestDate", date);
  };


  const handleTimeSlotSelect = (time: string) => {
    setSelectedTimeSlot(time);
    setValue("requestTime", time);
  };

  return (
    <div className="relative flex size-full min-h-screen flex-col bg-white group/design-root overflow-x-hidden"
      style={{ fontFamily: 'Lexend, "Noto Sans", sans-serif' }}>
      <div className="layout-container flex h-full grow flex-col">
        <div className="px-4 md:px-40 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
            <div className="flex flex-col sm:flex-row justify-between gap-3 p-4">
              <p className="text-[#121517] tracking-light text-[32px] font-bold leading-tight min-w-72">Book an Appointment</p>
            </div>

            {/* Branch Selection */}
            <h3 className="text-[#121517] text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">
              1. Select Branch
            </h3>
            <div className="flex w-full max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
              <Select
                options={branchIds.map((bid) => ({ value: bid, label: bid }))}
                value={selectedBranchId || ""}
                onChange={(val) => {
                  setValue("branchId", val);
                  setValue("hospitalCenterId", ""); // Reset dependent field
                }}
                placeholder="Select Branch"
              />
            </div>

            <h3 className="text-[#121517] text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">
              2. Select Care Center
            </h3>
            <div className="flex w-full max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">

              <Select
                options={centers.map((center) => ({
                  value: center.centerId,
                  label: `${center.name} (${center.type})`,
                }))}
                value={selectedHospitalCenterId}
                onChange={(val) => {
                  setValue("hospitalCenterId", val);
                  setValue("doctor", ""); // Reset dependent field
                }}
                placeholder={loadingCenters ? "Loading..." : "Select Care Center"}
                disabled={!selectedBranchId || loadingCenters}
              />
            </div>

            <h3 className="text-[#121517] text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">
              3. Select Doctor
            </h3>
           <div className="flex w-full max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">

              <Select
                options={doctors.map((doc) => ({
                  value: doc._id,
                  label: `${doc.fullName} (${doc.medicalSpeciality})`,
                }))}
                value={selectedDoctor}
                onChange={(val) => setValue("doctor", val)}
                placeholder={loadingDoctors ? "Loading..." : "Select Doctor"}
                disabled={!selectedHospitalCenterId || loadingDoctors}
              />
            </div>

            {/* Appointment Details */}
            <h3 className="text-[#121517] text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">4. Appointment Details</h3>
           <div className="flex w-full max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">

              <Textarea
                value={watch("description")}
                onChange={(val) => setValue("description", val)}
                label="Reason for Visit"
                placeholder="Briefly describe your health issue or consultation topic"
              />
            </div>

            {/* Date Selection */}
            <h3 className="text-[#121517] text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">
              4. Select Date
            </h3>
            <div className="flex justify-center px-4 py-3">
              <DayPicker
                mode="single"
                selected={selectedDate ? new Date(selectedDate) : undefined}
                onSelect={(date) => {
                  const formatted = date?.toLocaleDateString('en-CA'); // YYYY-MM-DD
                  handleDateSelect(formatted || "");
                }}
                weekStartsOn={0}
                className="rounded-lg border border-[#dde1e4] bg-white p-4 shadow-sm"
                modifiersClassNames={{
                  selected: 'bg-[#bfdaec] text-black font-bold',
                  today: 'text-[#121517] font-semibold',
                }}
                styles={{
                  head_cell: { fontSize: '13px', color: '#121517' },
                  cell: { height: '48px', width: '48px' },
                }}
              />
            </div>

            {/* Time Slots */}
            <h3 className="text-[#121517] text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">Available Time Slots</h3>
            <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-3 p-4">

              {['9:00', '10:00', '11:00', '14:00', '15:00', '16:00'].map((time) => (
                <label
                  key={time}
                  className={`text-sm font-medium leading-normal flex items-center justify-center rounded-xl border border-[#dde1e4] px-4 h-11 text-[#121517] relative cursor-pointer ${selectedTimeSlot === time ? 'border-[3px] px-3.5 border-[#bfdaec]' : ''
                    }`}
                >
                  {time}
                  <input
                    type="radio"
                    className="invisible absolute"
                    name="timeSlot"
                    checked={selectedTimeSlot === time}
                    onChange={() => handleTimeSlotSelect(time)}
                  />
                </label>
              ))}
            </div>

            {/* Confirmation */}
            <h3 className="text-[#121517] text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">5. Confirmation</h3>
            <div className="p-4 grid grid-cols-1 sm:grid-cols-[20%_1fr] gap-x-6">

              <div className="col-span-2 grid grid-cols-subgrid border-t border-t-[#dde1e4] py-5">
                <p className="text-[#687882] text-sm font-normal leading-normal">Branch</p>
                <p className="text-[#121517] text-sm font-normal leading-normal">{selectedBranch || 'Not selected'}</p>
              </div>
              <div className="col-span-2 grid grid-cols-subgrid border-t border-t-[#dde1e4] py-5">
                <p className="text-[#687882] text-sm font-normal leading-normal">Care Center</p>
                <p className="text-[#121517] text-sm font-normal leading-normal">{selectedCenter?.name || 'Not selected'}</p>
              </div>
              <div className="col-span-2 grid grid-cols-subgrid border-t border-t-[#dde1e4] py-5">
                <p className="text-[#687882] text-sm font-normal leading-normal">Doctor</p>
                <p className="text-[#121517] text-sm font-normal leading-normal">{selectedDoctorInfo?.fullName || 'Not selected'}</p>
              </div>
              <div className="col-span-2 grid grid-cols-subgrid border-t border-t-[#dde1e4] py-5">
                <p className="text-[#687882] text-sm font-normal leading-normal">Date</p>
                <p className="text-[#121517] text-sm font-normal leading-normal">
                  {selectedDate ? new Date(selectedDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  }) : 'Not selected'}
                </p>
              </div>
              <div className="col-span-2 grid grid-cols-subgrid border-t border-t-[#dde1e4] py-5">
                <p className="text-[#687882] text-sm font-normal leading-normal">Time</p>
                <p className="text-[#121517] text-sm font-normal leading-normal">{selectedTimeSlot || 'Not selected'}</p>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex px-4 py-3">
              <button
                onClick={handleSubmit(onSubmit)}
                className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 flex-1 bg-[#bfdaec] text-[#121517] text-sm font-bold leading-normal tracking-[0.015em]"
                disabled={!selectedBranchId || !selectedHospitalCenterId || !selectedDoctor || !selectedDate || !selectedTimeSlot}
              >
                <span className="truncate">Book Appointment</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}