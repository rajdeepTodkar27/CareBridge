"use client";

import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";

interface CareCenterCardProps {
  name: string;
  centerId: string;
  branchId: string;
  type: string;
  navRoute: string;
}

export default function CareCenterCard({ name, centerId, branchId, type,navRoute }: CareCenterCardProps) {
  const router = useRouter();

  return (
    <div
      key={centerId}
      className="flex items-center bg-white p-4 rounded-lg shadow hover:shadow-lg cursor-pointer transition-all"
      onClick={() => router.push(`${navRoute}/${centerId}`)}
    >
      <div className="flex-grow">
        <h3 className="font-semibold text-lg">{name}</h3>
        <p className="text-sm text-gray-500">
          {centerId} / {branchId}
        </p>
      </div>

      <div className="hidden sm:flex flex-col items-end mr-4">
        <p className="font-medium text-gray-700">{type.toUpperCase()}</p>
        <p className="text-xs text-gray-400">Click to view</p>
      </div>

      <div className="text-gray-400">
        <ArrowRight size={24} />
      </div>
    </div>
  );
}
