import { BadgeDollarSign, Building2, LayoutGrid, NotebookPen } from "lucide-react";
import { Card } from "@/libs/ui/card";

interface Service {
  serviceName: string;
  centerId: string;
  category: string;
  department: string;
  baseCost: number;
  unit: number;
  description: string;
}

export default function ServicesCard({ service }: { service: Service }) {
  return (
    <Card className="p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
      <h4 className="text-lg font-semibold text-green-700 mb-2 flex items-center gap-2">
        <LayoutGrid className="w-5 h-5" />
        {service.serviceName}
      </h4>

      <p className="text-sm text-gray-500 mb-1 flex items-center gap-2">
        <Building2 className="w-4 h-4 text-gray-400" />
        <span className="font-medium text-gray-700">{service.department}</span>
      </p>

      <p className="text-sm text-gray-500 mb-1 flex items-center gap-2">
        <NotebookPen className="w-4 h-4 text-gray-400" />
        <span className="text-gray-700">{service.category}</span>
      </p>

      <p className="text-sm text-gray-500 mb-3 flex items-center gap-2">
        <BadgeDollarSign className="w-4 h-4 text-gray-400" />
        <span className="text-gray-700 font-medium">
          ₹{service.baseCost} per {service.unit} unit
        </span>
      </p>

      {service.description && (
        <p className="text-xs text-gray-600 mt-2 line-clamp-3">
          {service.description}
        </p>
      )}
    </Card>
  );
}
