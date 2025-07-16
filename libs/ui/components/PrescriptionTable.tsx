"use client";
import React from "react";

interface Medicine {
  medName: string;
  quantity: string;
  dosage: string;
}

interface Prescription {
  medicine: Medicine[];
  date: string;
}

interface Props {
  prescriptions: Prescription[];
}

const PrescriptionTable: React.FC<Props> = ({ prescriptions }) => {
  return (
    <div className="px-4 py-3">
      <div className="flex overflow-x-auto rounded-xl border border-[#dde1e3] bg-white">
        <table className="flex-1 min-w-[800px]">
          <thead>
            <tr className="bg-white">
              <th className="px-4 py-3 text-left text-[#121516] w-[150px] sm:w-[400px] text-sm font-medium">Medicine</th>
              <th className="px-4 py-3 text-left text-[#121516] w-[150px] sm:w-[400px] text-sm font-medium">Quantity</th>
              <th className="px-4 py-3 text-left text-[#121516] w-[150px] sm:w-[400px] text-sm font-medium">Dosage</th>
              <th className="px-4 py-3 text-left text-[#121516] w-[150px] sm:w-[400px] text-sm font-medium">Date</th>
            </tr>
          </thead>
          <tbody>
            {prescriptions.map((pres, i) => (
              pres.medicine.map((med, j) => (
                <tr key={`${i}-${j}`} className="border-t border-t-[#dde1e3]">
                  <td className="h-[72px] px-4 py-2 w-[150px] sm:w-[400px] text-[#121516] text-sm">{med.medName}</td>
                  <td className="h-[72px] px-4 py-2 w-[150px] sm:w-[400px] text-[#6a7881] text-sm">{med.quantity}</td>
                  <td className="h-[72px] px-4 py-2 w-[150px] sm:w-[400px] text-[#6a7881] text-sm">{med.dosage}</td>
                  <td className="h-[72px] px-4 py-2 w-[150px] sm:w-[400px] text-[#6a7881] text-sm">{new Date(pres.date).toISOString().split("T")[0]}</td>
                </tr>
              ))
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PrescriptionTable;
