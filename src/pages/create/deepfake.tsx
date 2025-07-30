"use client";

import { motion, AnimatePresence } from "framer-motion";
import { transitions as t } from "@/lib/utils";
import AnimatedButton from "@/components/animated-button";
import Spinner from "@/components/ui/spinner";

export interface DeepfakeProps {
  message: string;
  audioFile: File | undefined;
  imageFile: File | undefined;
  setMessage: (text: string) => void;
  setAudioFile: (file: File) => void;
  setImagefile: (file: File) => void;
  working: boolean;
  submit: () => void;
  deepfakeStatus: string;
}

export default function Deepfake({
  message,
  audioFile,
  imageFile,
  setMessage,
  setAudioFile,
  setImagefile,
  working,
  submit,
  deepfakeStatus,
}: DeepfakeProps) {
  console.log(
    message,
    audioFile,
    imageFile,
    setMessage,
    setAudioFile,
    setImagefile,
    working,
    submit,
    deepfakeStatus
  );
  return (
    <motion.div
      transition={t.transition}
      exit={t.fade_out_scale_1}
      animate={t.normalize}
      initial={t.fade_out}
      className="space-y-6 pt-8"
      key="deepfake"
    >
      Deepfake
    </motion.div>
  );
}
