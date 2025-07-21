import Datepicker from "../components/datepicker";
import { useState } from "react";

export default function Test() {
  const [date, setDate] = useState<Date | undefined>(undefined);
  console.log("date", date);
  return (
    <div className="flex items-center">
      <Datepicker date={date} setDate={setDate} />
    </div>
  );
}
