import type React from "react";
import { transitions as t } from "../lib/utils";
import { motion } from "framer-motion";
import { useState } from "react";

interface AnimatedButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  className?: string;
  variant?: "primary" | "secondary";
}

export default function AnimatedButton({
  children,
  onClick,
  type = "button",
  disabled = false,
  className = "",
  variant = "primary",
}: AnimatedButtonProps) {
  const [ripples, setRipples] = useState<
    Array<{ id: number; x: number; y: number }>
  >([]);
  const [pressing, setPressing] = useState<boolean>(false);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;
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

    onClick?.();
  };

  const baseClasses =
    "relative overflow-hidden rounded-lg px-6 py-3 font-medium transition-all duration-200 cursor-pointer";
  const variantClasses = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-400",
    secondary:
      "bg-gray-200 text-gray-900 hover:bg-gray-300 disabled:bg-gray-100",
  };

  return (
    <motion.button
      type={type}
      disabled={disabled}
      onClick={handleClick}
      className={`${baseClasses} ${variantClasses[variant]} ${className} ${
        pressing ? "scale-90" : ""
      }`}
      // whileHover={{ scale: 1.02 }}
      // whileTap={{ scale: 0.33 }}
      // transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      {children}
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
    </motion.button>
  );
}
