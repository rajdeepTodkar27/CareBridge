"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "next/navigation";

interface Surgery {
  nameOfSurgery: string;
  dateOfSurgery: string;
  reportFile: string;
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
  pastMedicalTests: string[];
  pastPrescriptions: Prescription[];
}

export default function MedicalHistoryPage() {
  const { id } = useParams();
  const [data, setData] = useState<MedicalHistory | null>(null);

  useEffect(() => {
    if (!id) return;
    axios.get(`/api/doctor/medical-history/${id}`).then((res) => {
      setData(res.data.data);
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

            {/* Surgeries */}
            <h2 className="text-[#121516] text-xl sm:text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Surgeries</h2>
            <div className="px-4 py-3 @container">
              <div className="flex overflow-x-auto rounded-xl border border-[#dde1e3] bg-white">
                <table className="flex-1 min-w-[600px]">
                  <thead>
                    <tr className="bg-white">
                      <th className="table-3f64e334-be2d-4943-ba95-c6f413f42e49-column-120 px-4 py-3 text-left text-[#121516] w-[200px] sm:w-[400px] text-sm font-medium leading-normal">
                        Surgery Name
                      </th>
                      <th className="table-3f64e334-be2d-4943-ba95-c6f413f42e49-column-240 px-4 py-3 text-left text-[#121516] w-[200px] sm:w-[400px] text-sm font-medium leading-normal">Date</th>
                      <th className="table-3f64e334-be2d-4943-ba95-c6f413f42e49-column-360 px-4 py-3 text-left text-[#121516] w-40 sm:w-60 text-[#6a7881] text-sm font-medium leading-normal">
                        Report
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.surgeries.map((surg, i) => (
                      <tr key={i} className="border-t border-t-[#dde1e3]">
                        <td className="table-3f64e334-be2d-4943-ba95-c6f413f42e49-column-120 h-[72px] px-4 py-2 w-[200px] sm:w-[400px] text-[#121516] text-sm font-normal leading-normal">
                          {surg.nameOfSurgery}
                        </td>
                        <td className="table-3f64e334-be2d-4943-ba95-c6f413f42e49-column-240 h-[72px] px-4 py-2 w-[200px] sm:w-[400px] text-[#6a7881] text-sm font-normal leading-normal">
                          {surg.dateOfSurgery}
                        </td>
                        <td className="table-3f64e334-be2d-4943-ba95-c6f413f42e49-column-360 h-[72px] px-4 py-2 w-40 sm:w-60 text-[#6a7881] text-sm font-bold leading-normal tracking-[0.015em]">
                          <a href={`${surg.reportFile}`} target="_blank" className="hover:underline">View Report</a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <style>
                {/* {`@container(max-width:120px){.table-3f64e334-be2d-4943-ba95-c6f413f42e49-column-120{display: none;}}
                @container(max-width:240px){.table-3f64e334-be2d-4943-ba95-c6f413f42e49-column-240{display: none;}}
                @container(max-width:360px){.table-3f64e334-be2d-4943-ba95-c6f413f42e49-column-360{display: none;}}`} */}
              </style>
            </div>

            {/* Current Medications */}
            <h2 className="text-[#121516] text-xl sm:text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Current Medications</h2>
            <div className="p-4 grid grid-cols-1 md:grid-cols-[20%_1fr] gap-x-6">
              {data.currentMedications.split(",").map((med, i) => renderRow(med.trim(), ""))}
            </div>

            {/* Allergies */}
            <h2 className="text-[#121516] text-xl sm:text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Allergies</h2>
            <div className="p-4 grid grid-cols-1 md:grid-cols-[20%_1fr] gap-x-6">
              {renderRow(data.allergies, "")}
            </div>

            {/* Genetic Disorders */}
            <h2 className="text-[#121516] text-xl sm:text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Genetic Disorders</h2>
            <div className="p-4 grid grid-cols-1 md:grid-cols-[20%_1fr] gap-x-6">
              {renderRow(data.geneticDisorders,"")}
            </div>

            {/* Medical Tests */}
            <h2 className="text-[#121516] text-xl sm:text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Past Medical Tests</h2>
            <div className="px-4 py-3 @container">
              <div className="flex overflow-x-auto rounded-xl border border-[#dde1e3] bg-white">
                <table className="flex-1 min-w-[400px]">
                  <thead>
                    <tr className="bg-white">
                      <th className="table-10e1a7dc-e598-4189-9cc0-733355dcfd05-column-120 px-4 py-3 text-left text-[#121516] w-[200px] sm:w-[400px] text-sm font-medium leading-normal">
                        Test Name
                      </th>
                      <th className="table-10e1a7dc-e598-4189-9cc0-733355dcfd05-column-360 px-4 py-3 text-left text-[#121516] w-40 sm:w-60 text-[#6a7881] text-sm font-medium leading-normal">
                        Report
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.pastMedicalTests.map((test, i) => (
                      <tr key={i} className="border-t border-t-[#dde1e3]">
                        <td className="table-10e1a7dc-e598-4189-9cc0-733355dcfd05-column-120 h-[72px] px-4 py-2 w-[200px] sm:w-[400px] text-[#121516] text-sm font-normal leading-normal">
                          Test Report {i + 1}
                        </td>
                        <td className="table-10e1a7dc-e598-4189-9cc0-733355dcfd05-column-360 h-[72px] px-4 py-2 w-40 sm:w-60 text-[#6a7881] text-sm font-bold leading-normal tracking-[0.015em]">
                          <a href={`${test}`} target="_blank" className="hover:underline">View Report</a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <style>
                {/* {`@container(max-width:120px){.table-10e1a7dc-e598-4189-9cc0-733355dcfd05-column-120{display: none;}}
                @container(max-width:240px){.table-10e1a7dc-e598-4189-9cc0-733355dcfd05-column-240{display: none;}}
                @container(max-width:360px){.table-10e1a7dc-e598-4189-9cc0-733355dcfd05-column-360{display: none;}}`} */}
              </style>
            </div>

            {/* Prescriptions */}
            <h2 className="text-[#121516] text-xl sm:text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Past Prescriptions</h2>
            <div className="px-4 py-3 @container">
              <div className="flex overflow-x-auto rounded-xl border border-[#dde1e3] bg-white">
                <table className="flex-1 min-w-[800px]">
                  <thead>
                    <tr className="bg-white">
                      <th className="table-cb9cdff7-6ccf-4a29-9812-82c9fab82ed8-column-120 px-4 py-3 text-left text-[#121516] w-[150px] sm:w-[400px] text-sm font-medium leading-normal">
                        Medicine
                      </th>
                      <th className="table-cb9cdff7-6ccf-4a29-9812-82c9fab82ed8-column-240 px-4 py-3 text-left text-[#121516] w-[150px] sm:w-[400px] text-sm font-medium leading-normal">
                        Quantity
                      </th>
                      <th className="table-cb9cdff7-6ccf-4a29-9812-82c9fab82ed8-column-360 px-4 py-3 text-left text-[#121516] w-[150px] sm:w-[400px] text-sm font-medium leading-normal">Dosage</th>
                      <th className="table-cb9cdff7-6ccf-4a29-9812-82c9fab82ed8-column-480 px-4 py-3 text-left text-[#121516] w-[150px] sm:w-[400px] text-sm font-medium leading-normal">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.pastPrescriptions.map((pres, i) => (
                      pres.medicine.map((med, j) => (
                        <tr key={`${i}-${j}`} className="border-t border-t-[#dde1e3]">
                          <td className="table-cb9cdff7-6ccf-4a29-9812-82c9fab82ed8-column-120 h-[72px] px-4 py-2 w-[150px] sm:w-[400px] text-[#121516] text-sm font-normal leading-normal">
                            {med.medName}
                          </td>
                          <td className="table-cb9cdff7-6ccf-4a29-9812-82c9fab82ed8-column-240 h-[72px] px-4 py-2 w-[150px] sm:w-[400px] text-[#6a7881] text-sm font-normal leading-normal">
                            {med.quantity}
                          </td>
                          <td className="table-cb9cdff7-6ccf-4a29-9812-82c9fab82ed8-column-360 h-[72px] px-4 py-2 w-[150px] sm:w-[400px] text-[#6a7881] text-sm font-normal leading-normal">{med.dosage}</td>
                          <td className="table-cb9cdff7-6ccf-4a29-9812-82c9fab82ed8-column-480 h-[72px] px-4 py-2 w-[150px] sm:w-[400px] text-[#6a7881] text-sm font-normal leading-normal">
                            {new Date(pres.date).toISOString().split("T")[0]}
                          </td>
                        </tr>
                      ))
                    ))}
                  </tbody>
                </table>
              </div>
              <style>
                {/* {`@container(max-width:120px){.table-cb9cdff7-6ccf-4a29-9812-82c9fab82ed8-column-120{display: none;}}
                @container(max-width:240px){.table-cb9cdff7-6ccf-4a29-9812-82c9fab82ed8-column-240{display: none;}}
                @container(max-width:360px){.table-cb9cdff7-6ccf-4a29-9812-82c9fab82ed8-column-360{display: none;}}
                @container(max-width:480px){.table-cb9cdff7-6ccf-4a29-9812-82c9fab82ed8-column-480{display: none;}}`} */}
              </style>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}