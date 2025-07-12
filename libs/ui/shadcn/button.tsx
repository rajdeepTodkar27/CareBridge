import { cn } from "@/libs/helper";
import { ButtonHTMLAttributes, forwardRef } from "react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center rounded-md bg-green-600 text-white px-4 py-2 text-sm font-medium shadow hover:bg-green-700 transition-colors focus:outline-none disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
);

Button.displayName = "Button";
