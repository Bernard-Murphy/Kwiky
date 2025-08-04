import AnimatedButton from "@/components/animated-button";

export default function Test() {
  return (
    <div className="space-y-2 flex flex-col">
      <div>
        <AnimatedButton variant="primary">primary</AnimatedButton>
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
