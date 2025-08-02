"use client";

import { motion, AnimatePresence } from "framer-motion";
import { transitions as t } from "@/lib/utils";
import AnimatedButton from "@/components/animated-button";
import Spinner from "@/components/ui/spinner";
import { copyText } from "@/lib/methods";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input";

export interface GameProps {
  gameText: string;
  setGameText: (text: string) => void;
  gameTitle: string;
  setGameTitle: (text: string) => void;
  gameWorking: boolean;
  gameSubmit: () => void;
  gameStatus: string;
  gameLink: string;
}

export default function Games({
  gameText,
  setGameText,
  gameTitle,
  setGameTitle,
  gameWorking,
  gameSubmit,
  gameStatus,
  gameLink,
}: GameProps) {
  return (
    <motion.div
      transition={t.transition}
      exit={t.fade_out_scale_1}
      animate={t.normalize}
      initial={t.fade_out}
      className="space-y-6 pt-8 h-full"
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
        <label className="block text-sm font-medium mb-2">Title</label>
        <input
          type="text"
          value={gameTitle}
          onChange={(e) => setGameTitle(e.target.value)}
          placeholder="Enter Title"
          className="w-full px-4 py-3 bg-black/20 border border-gray-600 rounded-lg focus:border-blue-500 focus:outline-none mb-4"
        />
        <label className="block text-sm font-medium mb-2">
          Create the Following Game...
        </label>
        <textarea
          value={gameText}
          onChange={(e) => setGameText(e.target.value)}
          placeholder="A Hangman Game"
          className="w-full h-32 px-4 py-3 bg-black/20 border border-gray-600 rounded-lg focus:border-blue-500 focus:outline-none resize-none mb-2"
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
        <AnimatedButton disabled={gameWorking} onClick={gameSubmit}>
          <AnimatePresence mode="wait">
            <motion.div
              transition={t.transition}
              exit={t.fade_out_scale_1}
              animate={t.normalize}
              initial={t.fade_out}
              className="flex items-center"
              key={gameStatus}
            >
              {gameWorking ? (
                <>
                  <Spinner size="sm" className="me-2" />
                  {gameStatus || "Working"}
                </>
              ) : (
                "Submit"
              )}
            </motion.div>
          </AnimatePresence>
        </AnimatedButton>
        {gameStatus === "Errored" && (
          <div className="text-center text-red-400">
            An error occurred. Please try again later.
          </div>
        )}
        {gameLink.length ? (
          <>
            <h5 className="mt-4">Link to Game:</h5>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger className="w-full mt-2">
                  <AnimatedButton
                    variant="custom"
                    className="w-full px-0 py-0"
                    onClick={() => copyText(gameLink)}
                  >
                    <Input
                      className="cursor-pointer"
                      value={gameLink}
                      readOnly
                      type="text"
                    />
                  </AnimatedButton>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Click to Copy</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </>
        ) : (
          <></>
        )}
      </motion.div>
    </motion.div>
  );
}
