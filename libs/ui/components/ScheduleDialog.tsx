"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/libs/ui/dialog";
import { Input } from "@/libs/ui/shadcn/input";
import { Button } from "@/libs/ui/shadcn/button";
import { useForm } from "react-hook-form";
import { CalendarIcon, Clock } from "lucide-react";

interface ScheduleDialogProps {
  open: boolean;
  onOpenChange: (val: boolean) => void;
  onSubmit: (data: any) => void;
  type: "accept" | "reject";
}

export default function ScheduleDialog({
  open,
  onOpenChange,
  onSubmit,
  type,
}: ScheduleDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const title =
    type === "accept" ? "Schedule Appointment" : "Reject Appointment";

  const handleClose = () => {
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-800">
            {title}
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit((data) => {
            onSubmit(data);
            reset();
          })}
          className="space-y-4 mt-2"
        >
          {type === "accept" && (
            <>
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Schedule Date
                </label>
                <div className="relative">
                  <Input
                    type="date"
                    {...register("sheduledDate", { required: true })}
                    className="pl-10"
                  />
                  <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Schedule Time
                </label>
                <div className="relative">
                  <Input
                    type="time"
                    {...register("sheduledTime", { required: true })}
                    className="pl-10"
                  />
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Response from Hospital
            </label>
            <Input
              placeholder="Enter your response..."
              {...register("responceFromH", { required: true })}
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            {type === "accept" ? "Approve Request" : "Reject Request"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
