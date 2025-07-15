import { Input } from "@/libs/ui/shadcn/input";
import { Button } from "@/libs/ui/shadcn/button";
import { useState, useEffect } from "react";
import axios from "axios";

interface Vitals {
  weight?: number;
  height?: number;
  bmi?: number;
  heartRate?: number;
  bloodSugar?: number;
  bloodPressure?: string;
  temperature?: number;
}

export function VitalsTable({
  initialVitals,
  patientUid,
}: {
  initialVitals: Vitals;
  patientUid: string;
}) {
  const [vitals, setVitals] = useState<Vitals>(initialVitals || {});
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);

  // Auto-calculate BMI
  useEffect(() => {
    const { weight, height } = vitals;
    if (weight && height) {
      const heightInMeters = height / 100;
      const bmi = +(weight / (heightInMeters * heightInMeters)).toFixed(2);
      setVitals((prev) => ({ ...prev, bmi }));
    }
  }, [vitals.weight, vitals.height]);

  const handleChange = (key: keyof Vitals, value: string) => {
    setVitals((prev) => ({
      ...prev,
      [key]: key === "bloodPressure" ? value : parseFloat(value),
    }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      await axios.post("/api/doctor/regular-checkup/update-vitals", {
        patientUid,
        vitals,
      });
      alert("Vitals saved successfully.");
      setEditMode(false);
    } catch (err) {
      alert("Failed to save vitals");
    } finally {
      setLoading(false);
    }
  };

  const fields: { label: string; key: keyof Vitals; type?: string; readonly?: boolean }[] = [
    { label: "Weight (kg)", key: "weight" },
    { label: "Height (cm)", key: "height" },
    { label: "BMI", key: "bmi", readonly: true },
    { label: "Heart Rate (bpm)", key: "heartRate" },
    { label: "Blood Sugar (mg/dL)", key: "bloodSugar" },
    { label: "Blood Pressure", key: "bloodPressure", type: "text" },
    { label: "Temperature (°C)", key: "temperature" },
  ];

  return (
    <div className="mt-4  rounded p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Vitals</h3>
        <Button onClick={() => (editMode ? handleSave() : setEditMode(true))} disabled={loading}>
          {editMode ? "Save" : "Edit"}
        </Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {fields.map(({ label, key, type, readonly }) => (
          <div key={key} className="flex flex-col">
            <label className="text-sm font-medium text-gray-700">{label}</label>
            {editMode && !readonly ? (
              <Input
                type={type || "number"}
                value={vitals[key] ?? ""}
                onChange={(e) => handleChange(key, e.target.value)}
              />
            ) : (
              <p className="mt-1 text-gray-800">{vitals[key] ?? "-"}</p>
            )}
          </div>
        ))}
      </div>
      <hr className="mt-6 border-t border-gray-300 " />
    </div>
  );
}
