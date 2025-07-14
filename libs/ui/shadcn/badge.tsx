// components/ui/badge.tsx
import { cn } from "@/libs/helper";
import React from "react";

export function Badge({
  children,
  className,
  variant = "default",
}: {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "outline";
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium",
        variant === "default" && "bg-gray-100 text-gray-800",
        variant === "outline" && "border border-gray-300 text-gray-700",
        className
      )}
    >
      {children}
    </span>
  );
}
