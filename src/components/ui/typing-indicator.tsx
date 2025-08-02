// import { Dot } from "lucide-react";

export default function TypingIndicator() {
  return (
    <div className="justify-left flex space-x-1 w-20">
      <div className="rounded-lg bg-gray-700 px-2 py-3 w-full">
        <div className="snippet" data-title="dot-falling">
          <div className="stage">
            <div className="dot-falling"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
