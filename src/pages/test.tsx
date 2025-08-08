import AnimatedButton from "@/components/animated-button";
import { Socket } from "socket.io-client";
import { useEffect } from "react";

interface TestProps {
  socket: Socket;
}

export default function Test({ socket }: TestProps) {
  useEffect(() => {
    socket.on("test", () => console.log("test"));
  }, []);
  return (
    <div className="space-y-2 flex flex-col">
      <div>
        <AnimatedButton onClick={() => socket.emit("test")} variant="primary">
          primary
        </AnimatedButton>
      </div>
      <div>
        <AnimatedButton variant="secondary">secondary</AnimatedButton>
      </div>
      <div>
        <AnimatedButton variant="destructive">destructive</AnimatedButton>
      </div>
      <div>
        <AnimatedButton variant="outline">outline</AnimatedButton>
      </div>
      <div>
        <AnimatedButton variant="ghost">ghost</AnimatedButton>
      </div>
      <div>
        <AnimatedButton variant="link">link</AnimatedButton>
      </div>
      <div>
        <AnimatedButton variant="custom">custom</AnimatedButton>
      </div>
    </div>
  );
}
