"use client";

import { motion } from "framer-motion";
import { transitions as t } from "@/lib/utils";
import AnimatedButton from "@/components/animated-button";

export interface GameProps {
  gameText: string;
  setGameText: (text: string) => void;
  uncensoredGames: boolean;
  setUncensoredGames: (option: boolean) => void;
}

export default function Games({
  gameText,
  setGameText,
  uncensoredGames,
  setUncensoredGames,
}: GameProps) {
  return (
    <motion.div
      transition={t.transition}
      exit={t.fade_out_scale_1}
      animate={t.normalize}
      initial={t.fade_out}
      className="space-y-6 pt-8"
      key="games"
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
          Create the Following Game...
        </label>
        <textarea
          value={gameText}
          onChange={(e) => setGameText(e.target.value)}
          placeholder="Shooting Game"
          className="w-full h-32 px-4 py-3 bg-black/20 border border-gray-600 rounded-lg focus:border-blue-500 focus:outline-none resize-none mb-2"
        />
        <label className="block mb-2">
          <input
            type="checkbox"
            checked={uncensoredGames}
            onChange={(e) => setUncensoredGames(e.target.checked)}
            className="mr-2"
          />
          Uncensored
        </label>
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
        <AnimatedButton onClick={() => console.log("Create game")}>
          Submit
        </AnimatedButton>
      </motion.div>
    </motion.div>
  );
}
