"use client";
import React from "react";

interface Surgery {
  nameOfSurgery: string;
  dateOfSurgery: string;
  reportFile: string;
}

interface Props {
  surgeries: Surgery[];
  newSurgery: Surgery & { file?: File | null };
  setNewSurgery: (s: Surgery & { file?: File | null }) => void;
  handleAddSurgery: () => void;
  handleDeleteSurgery: (index: number) => void;
}

const SurgerySection: React.FC<Props> = ({
  surgeries,
  newSurgery,
  setNewSurgery,
  handleAddSurgery,
  handleDeleteSurgery,
}) => {
  return (
    <div className="px-4 py-3">
      <div className="grid grid-cols-1 sm:flex sm:flex-row gap-3 px-4 mb-4">
        <input
          type="text"
          placeholder="Surgery Name"
          value={newSurgery.nameOfSurgery}
          onChange={(e) =>
            setNewSurgery({ ...newSurgery, nameOfSurgery: e.target.value })
          }
          className="border px-3 py-2 rounded-md text-sm w-full"
        />
        <input
          type="date"
          value={newSurgery.dateOfSurgery}
          onChange={(e) =>
            setNewSurgery({ ...newSurgery, dateOfSurgery: e.target.value })
          }
          className="border px-3 py-2 rounded-md text-sm w-full"
        />
        <input
          id="surgery-input"
          type="file"
          accept="application/pdf,image/*"
          onChange={(e) =>
            setNewSurgery({ ...newSurgery, file: e.target.files?.[0] || null })
          }
          className="text-sm w-full"
        />
        <button
          onClick={handleAddSurgery}
          className="bg-green-500 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm w-full sm:w-auto"
        >
          Add
        </button>
      </div>

      <div className="flex overflow-x-auto rounded-xl border border-[#dde1e3] bg-white">
        <table className="flex-1 min-w-[600px]">
          <thead>
            <tr className="bg-white">
              <th className="px-4 py-3 text-left text-[#121516] w-[200px] text-sm font-medium">Surgery Name</th>
              <th className="px-4 py-3 text-left text-[#121516] w-[200px] text-sm font-medium">Date</th>
              <th className="px-4 py-3 text-left text-[#121516] w-40 text-sm font-medium">Report</th>
              <th className="px-4 py-3 text-left text-[#121516] w-20 text-sm font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {surgeries.map((surg, i) => (
              <tr key={i} className="border-t border-t-[#dde1e3]">
                <td className="h-[72px] px-4 py-2 text-sm text-[#121516]">{surg.nameOfSurgery}</td>
                <td className="h-[72px] px-4 py-2 text-sm text-[#6a7881]">{surg.dateOfSurgery}</td>
                <td className="h-[72px] px-4 py-2 text-sm text-[#6a7881] font-bold tracking-[0.015em]">
                  <a href={surg.reportFile} target="_blank" className="hover:underline">View Report</a>
                </td>
                <td className="h-[72px] px-4 py-2 text-sm text-red-600 font-medium">
                  <button onClick={() => handleDeleteSurgery(i)} className="hover:underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SurgerySection;
