"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "../lib/utils";
import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

interface DatePickerProps {
  date: Date;
  setDate: (d: Date | undefined) => void;
  className?: string;
  label?: string;
}

export function DatePicker({
  date,
  setDate,
  className,
  label,
}: DatePickerProps) {
  const [datet, setDatet] = React.useState<Date>();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          data-empty={!date}
          className={`data-[empty=true]:text-muted-foreground w-[280px] justify-start text-left font-normal ${
            className || ""
          }`}
        >
          <CalendarIcon />
          {date ? format(date, "PPP") : <span>{label || "Pick a date"}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar mode="single" selected={datet} onSelect={setDatet} />
      </PopoverContent>
    </Popover>
  );
}
