"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";

interface Hospital {
  _id: string;
  name: string;
  branchId: string;
  centerId: string;
  type: string;
}

const BranchListPage = () => {
  const [branches, setBranches] = useState<Hospital[]>([]);
  const [errMessage, setErrMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const router = useRouter();

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        setErrMessage("");
        const res = await axios.get("/api/admin/createBranchH");
        const sorted = res.data.data.sort((a: Hospital, b: Hospital) =>
          a.branchId.localeCompare(b.branchId)
        );
        setBranches(sorted);
      } catch (error: any) {
        console.error(error);
        setErrMessage(error?.response?.data?.message || "Something went wrong.");
      }
    };

    fetchBranches();
  }, []);

  // Pagination logic
  const totalPages = Math.ceil(branches.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const selectedBranches = branches.slice(startIndex, startIndex + itemsPerPage);

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#f8fafc] to-[#e2e8f0] py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">All Care Centers</h2>

        {errMessage && (
          <p className="text-red-600 text-center font-semibold mb-4">{errMessage}</p>
        )}

        <div className="space-y-4">
          {selectedBranches.map((branch) => (
            <div
              key={branch.centerId}
              className="flex items-center bg-white p-4 rounded-lg shadow hover:shadow-lg cursor-pointer transition-all"
              onClick={() => router.push(`/admin/view-carecenter/${branch.centerId}`)}
            >
              <div className="flex-grow">
                <h3 className="font-semibold text-lg">{branch.name}</h3>
                <p className="text-sm text-gray-500">
                  {branch.centerId} / {branch.branchId}
                </p>
              </div>

              <div className="hidden sm:flex flex-col items-end mr-4">
                <p className="font-medium text-gray-700">{branch.type.toUpperCase()}</p>
                <p className="text-xs text-gray-400">Click to view</p>
              </div>

              <div className="text-gray-400">
                <ArrowRight size={24} />
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Controls */}
        <div className="flex justify-center mt-8 gap-4">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
          >
            Prev
          </button>
          <span className="font-medium">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </main>
  );
};

export default BranchListPage;
