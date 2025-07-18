"use client";

import { useParams } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { useState } from "react";
import axios from "axios";
import { Input } from "@/libs/ui/shadcn/input";
import { Button } from "@/libs/ui/shadcn/button";
import { Label } from "@/libs/ui/shadcn/label";
import { Card } from "@/libs/ui/card";

interface MedicineInput {
  medName: string;
  quantity: string;
  dosage: string;
  time: string[];
  mealRelation: string;
}

interface FormValues {
  startingDate: string;
  endingDate: string;
  medicine: MedicineInput[];
}

export default function PrescriptionFormPage() {
  const { id } = useParams();
  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    reset ,
  } = useForm<FormValues>({
    defaultValues: {
      startingDate: "",
      endingDate: "",
      medicine: [
        {
          medName: "",
          quantity: "",
          dosage: "",
          time: [],
          mealRelation: "after meal",
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "medicine",
  });

  const [loading, setLoading] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");

  const onSubmit = async (data: FormValues) => {
    try {
      setLoading(true);
      const payload = {
        patientUid:id,
        ...data,
      };
      const res = await axios.post(`/api/doctor/prescription`, payload);
      setResponseMessage(res.data.message || "Success");
      reset()
    } catch (error: any) {
      console.error(error);
      setResponseMessage("Error submitting data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6">
      <h2 className="text-2xl font-semibold mb-6 text-center">Add Prescription for Patient</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Starting Date</Label>
            <Input type="date" {...register("startingDate")} required />
          </div>
          <div>
            <Label>Ending Date</Label>
            <Input type="date" {...register("endingDate")} required />
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-xl font-semibold">Medicines</h3>

          {fields.map((field, index) => (
            <Card key={field.id} className="p-4 relative space-y-4">
              <button
                type="button"
                onClick={() => remove(index)}
                className="absolute top-2 right-2 text-red-500 text-sm"
              >
                ❌ Remove
              </button>

              <div>
                <Label>Medicine Name</Label>
                <Input {...register(`medicine.${index}.medName`)} required />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Quantity</Label>
                  <Input {...register(`medicine.${index}.quantity`)} required />
                </div>
                <div>
                  <Label>Dosage</Label>
                  <Input {...register(`medicine.${index}.dosage`)} required />
                </div>
              </div>

              <div>
                <Label className="mb-2 block">Time Schedule</Label>
                {watch(`medicine.${index}.time`)?.map((t, tIndex) => (
                  <div key={tIndex} className="flex items-center gap-2 mb-2">
                    <Input
                      type="time"
                      value={t}
                      onChange={(e) => {
                        const updated = [...(watch(`medicine.${index}.time`) || [])];
                        updated[tIndex] = e.target.value;
                        setValue(`medicine.${index}.time`, updated);
                      }}
                      className="w-[140px]"
                    />
                    <Button
                    className="bg-white border-gray-300 hover:bg-gray-100"
                      type="button"
                      onClick={() => {
                        const updated = [...(watch(`medicine.${index}.time`) || [])];
                        updated.splice(tIndex, 1);
                        setValue(`medicine.${index}.time`, updated);
                      }}
                    >
                      ❌
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  onClick={() => {
                    const current = watch(`medicine.${index}.time`) || [];
                    setValue(`medicine.${index}.time`, [...current, ""]);
                  }}
                >
                  ➕ Add Time
                </Button>
              </div>

              <div>
                <Label>Meal Relation</Label>
                <select
                  {...register(`medicine.${index}.mealRelation`)}
                  className="border rounded-md w-full h-10 px-2"
                >
                  <option value="before meal">Before Meal</option>
                  <option value="after meal">After Meal</option>
                </select>
              </div>
            </Card>
          ))}

          <Button
            type="button"
            onClick={() =>
              append({
                medName: "",
                quantity: "",
                dosage: "",
                time: [],
                mealRelation: "after meal",
              })
            }
          >
            ➕ Add Medicine
          </Button>
        </div>

        <div className="pt-6">
          <Button type="submit" disabled={loading}>
            {loading ? "Submitting..." : "Submit Prescription"}
          </Button>
          {responseMessage && (
            <p className="text-center mt-4 text-sm text-gray-600">{responseMessage}</p>
          )}
        </div>
      </form>
    </div>
  );
}
