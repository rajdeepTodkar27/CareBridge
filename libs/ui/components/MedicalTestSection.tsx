"use client";
import React from "react";

interface MedicalTest {
  nameOfTest: string;
  testfile: string;
}

interface Props {
  testName: string;
  setTestName: (value: string) => void;
  selectedFile: File | null;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleUpload: () => void;
  medicalTests: MedicalTest[];
  handleDelete: (index: number) => void;
}

const MedicalTestSection: React.FC<Props> = ({
  testName,
  setTestName,
  selectedFile,
  handleFileChange,
  handleUpload,
  medicalTests,
  handleDelete,
}) => {
  return (
    <div className="mt-10">
      <h2 className="text-xl font-bold">Medical Tests</h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:items-end mt-4">
        <div className="flex flex-col gap-1">
          <label htmlFor="test-name" className="text-sm text-gray-600">Test Name</label>
          <input
            id="test-name"
            type="text"
            placeholder="e.g. Blood Test"
            value={testName}
            onChange={(e) => setTestName(e.target.value)}
            className="border px-3 py-2 rounded-md text-sm w-full"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="upload-input" className="text-sm text-gray-600">Upload File</label>
          <input
            id="upload-input"
            type="file"
            accept="application/pdf,image/*"
            onChange={handleFileChange}
            className="text-sm w-full"
          />
        </div>

        <div className="flex sm:justify-end">
          <button
            onClick={handleUpload}
            className="mt-2 sm:mt-0 bg-green-500 text-white px-4 py-2 rounded-md text-sm hover:bg-green-700 w-full sm:w-auto"
          >
            Upload Report
          </button>
        </div>
      </div>

      <div className="flex overflow-x-auto rounded-xl border border-[#dde1e3] bg-white mt-6">
        <table className="flex-1 min-w-[600px]">
          <thead>
            <tr className="bg-white">
              <th className="px-4 py-3 text-left text-[#121516] w-[200px] text-sm font-medium">Test Name</th>
              <th className="px-4 py-3 text-left text-[#121516] w-[200px] text-sm font-medium">Report</th>
              <th className="px-4 py-3 text-left text-[#121516] w-20 text-sm font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {medicalTests.map((test, i) => (
              <tr key={i} className="border-t border-t-[#dde1e3]">
                <td className="h-[72px] px-4 py-2 text-sm text-[#121516]">{test.nameOfTest}</td>
                <td className="h-[72px] px-4 py-2 text-sm text-[#6a7881] font-bold tracking-[0.015em]">
                  <a href={test.testfile} target="_blank" className="hover:underline">View Report</a>
                </td>
                <td className="h-[72px] px-4 py-2 text-sm text-red-600 font-medium">
                  <button onClick={() => handleDelete(i)} className="hover:underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MedicalTestSection;
