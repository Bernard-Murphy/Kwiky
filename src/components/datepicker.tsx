"use client";

import * as React from "react";
import { CalendarDays } from "lucide-react";
import { motion } from "framer-motion";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export interface DatepickerProps {
  date: Date | undefined;
  setDate: (d: Date) => void;
  className?: string;
  buttonClasses?: string;
}

export default function Calendar22({
  date,
  setDate,
  className,
  buttonClasses,
}: DatepickerProps) {
  const [open, setOpen] = React.useState(false);

  const [ripples, setRipples] = React.useState<
    Array<{ id: number; x: number; y: number }>
  >([]);
  const [pressing, setPressing] = React.useState<boolean>(false);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setPressing(true);
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newRipple = { id: Date.now(), x, y };
    setRipples((prev) => [...prev, newRipple]);

    setTimeout(() => {
      setRipples((prev) => prev.filter((ripple) => ripple.id !== newRipple.id));
    }, 600);

    setTimeout(() => {
      setPressing(false);
    }, 150);
  };

  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            onClick={handleClick}
            className={`inline-flex items-center gap-2 bg-black/20 whitespace-nowrap rounded-md text-sm transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive border bg-background shadow-xs hover:bg-accent-foreground hover:text-accent dark:bg-input/30 dark:border-input dark:hover:bg-input/50 h-9 px-4 py-2 has-[>svg]:px-3 w-48 justify-between font-normal cursor-pointer relative overflow-hidden rounded-lg px-6 py-3 font-medium transition-all duration-200 cursor-pointer ${buttonClasses} ${
              pressing ? "scale-90" : ""
            }`}
          >
            {date ? date.toLocaleDateString() : "Select date"}
            <CalendarDays />
            {ripples.map((ripple) => (
              <motion.span
                key={ripple.id}
                className="absolute bg-white/30 rounded-full pointer-events-none"
                style={{
                  left: ripple.x - 10,
                  top: ripple.y - 10,
                  width: 20,
                  height: 20,
                }}
                initial={{ scale: 0, opacity: 1 }}
                animate={{ scale: 15, opacity: 0 }}
                transition={{ duration: 0.3 }}
              />
            ))}
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            captionLayout="dropdown"
            onSelect={(date) => {
              console.log("select");
              setDate(date || new Date());
              setOpen(false);
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
