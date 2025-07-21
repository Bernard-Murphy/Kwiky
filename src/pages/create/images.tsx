"use client";

import { motion } from "framer-motion";
import { transitions as t } from "@/lib/utils";
import AnimatedButton from "@/components/animated-button";

export interface ImageProps {
  imageText: string;
  setImageText: (text: string) => void;
}

export default function Images({ imageText, setImageText }: ImageProps) {
  return (
    <motion.div
      transition={t.transition}
      exit={t.fade_out_scale_1}
      animate={t.normalize}
      initial={t.fade_out}
      className="space-y-6 pt-8"
      key="images"
    >
      <motion.div
        transition={t.transition}
        exit={{
          opacity: 0,
          x: 50,
        }}
        animate={t.normalize}
        initial={{
          opacity: 0,
          x: 50,
        }}
      >
        <label className="block text-sm font-medium mb-2">
          Create the Following Image...
        </label>
        <textarea
          value={imageText}
          onChange={(e) => setImageText(e.target.value)}
          placeholder="Police bust illegal pepperoni operation"
          className="w-full h-32 px-4 py-3 bg-black/20 border border-gray-600 rounded-lg focus:border-blue-500 focus:outline-none resize-none"
        />
      </motion.div>
      <motion.div
        transition={t.transition}
        exit={{
          opacity: 0,
          y: 50,
        }}
        animate={t.normalize}
        initial={{
          opacity: 0,
          y: 50,
        }}
      >
        <AnimatedButton onClick={() => console.log("Create image")}>
          Submit
        </AnimatedButton>
      </motion.div>
    </motion.div>
  );
}
