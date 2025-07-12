"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import * as SelectPrimitive from "@radix-ui/react-select";
import { ChevronDown, ChevronUp, Check, Loader2 } from "lucide-react";
import CareCenterCard from "@/libs/ui/components/CareCenterCard";

function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

interface CareCenter {
  branchId: string;
  centerId: string;
  name: string;
  type: string;
}

interface FormValues {
  branchId: string;
}

export default function BranchFilterPage() {
 
  const [careCenters, setCareCenters] = useState<CareCenter[]>([]);
  const [branchIds, setBranchIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const { setValue, watch } = useForm<FormValues>();
  const selectedBranchId = watch("branchId");

 
  useEffect(() => {
    const fetchBranchIds = async () => {
      try {
        const res = await axios.get("/api/patient/carecenter");
        setBranchIds(res.data.data);
        setLoading(false);
      } catch (err: any) {
       
        setLoading(false);
        console.error(err);
      }
    };
    fetchBranchIds();
  }, []);

  
  useEffect(() => {
    const fetchCenters = async () => {
      if (!selectedBranchId) return;
      try {
        const res = await axios.put("/api/patient/carecenter", {
          branchId: selectedBranchId,
        });
        setCareCenters(res.data.data);
      } catch (err) {
        console.error(err);
        setCareCenters([]);
      }
    };

    fetchCenters();
  }, [selectedBranchId]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-semibold mb-4 text-center">Care centers</h1>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <Loader2 className="animate-spin w-8 h-8 text-blue-500" />
        </div>
      ) : (
        <>
          <SelectPrimitive.Root onValueChange={(value) => setValue("branchId", value)}>
            <SelectPrimitive.Trigger
              className="flex h-10 w-full md:w-64 mx-auto items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <SelectPrimitive.Value placeholder="Select a Branch ID" />
              <SelectPrimitive.Icon>
                <ChevronDown className="h-4 w-4 text-gray-500" />
              </SelectPrimitive.Icon>
            </SelectPrimitive.Trigger>

            <SelectPrimitive.Portal>
              <SelectPrimitive.Content className="z-50 rounded-md border bg-white shadow-md">
                <SelectPrimitive.ScrollUpButton className="flex items-center justify-center py-1">
                  <ChevronUp className="h-4 w-4 text-gray-500" />
                </SelectPrimitive.ScrollUpButton>

                <SelectPrimitive.Viewport className="p-1">
                  {branchIds.map((branchId) => (
                    <SelectPrimitive.Item
                      key={branchId}
                      value={branchId}
                      className="relative flex w-full cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm text-gray-700 hover:bg-blue-100 focus:bg-blue-100"
                    >
                      <SelectPrimitive.ItemText>{branchId}</SelectPrimitive.ItemText>
                      <SelectPrimitive.ItemIndicator className="absolute right-2">
                        <Check className="h-4 w-4 text-blue-600" />
                      </SelectPrimitive.ItemIndicator>
                    </SelectPrimitive.Item>
                  ))}
                </SelectPrimitive.Viewport>

                <SelectPrimitive.ScrollDownButton className="flex items-center justify-center py-1">
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                </SelectPrimitive.ScrollDownButton>
              </SelectPrimitive.Content>
            </SelectPrimitive.Portal>
          </SelectPrimitive.Root>

          <div className="space-y-4 mt-6">
            {careCenters.map((CareCenter) => (
              <CareCenterCard
                key={CareCenter.centerId}
                name={CareCenter.name}
                branchId={CareCenter.branchId}
                centerId={CareCenter.centerId}
                type={CareCenter.type}
                navRoute= "/patient/care-center"
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
