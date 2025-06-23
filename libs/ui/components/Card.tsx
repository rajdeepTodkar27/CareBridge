import React from "react";
import { ArrowRight } from "lucide-react";

interface CardProps {
  title: string;
  icon: React.ReactNode;
  onClick: () => void;
}

const Card = ({ title, icon, onClick }: CardProps) => (
  <div
    onClick={onClick}
    className="bg-white shadow-lg rounded-xl p-6 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition"
  >
    <div className="flex items-center gap-3">
      {icon}
      <span className="text-lg font-semibold text-gray-800">{title}</span>
    </div>
    <ArrowRight className="w-5 h-5 text-gray-500" />
  </div>
);

export default Card;
