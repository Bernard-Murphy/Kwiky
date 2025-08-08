"use client";

import { type ReactNode, useState } from "react";
import { motion } from "framer-motion";
import { transitions as t } from "@/lib/utils";

export interface CreatePageProps {
  children: ReactNode;
  className?: string;
}

export default function CreatePage({ children, className }: CreatePageProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  return (
    <motion.div
      transition={t.transition}
      exit={t.fade_out_scale_1}
      animate={t.normalize}
      initial={t.fade_out}
      onAnimationStart={() => setIsAnimating(true)}
      onAnimationEnd={() => setIsAnimating(false)}
      className={`space-y-6 pt-8 w-full h-full ${className} ${
        false ? " overflow-x-hidden overflow-y-hidden" : ""
      }`}
    >
      {children}
    </motion.div>
  );
}
