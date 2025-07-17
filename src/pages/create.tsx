"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Music, ImageIcon, Gamepad2 } from "lucide-react";
import AnimatedButton from "../components/animated-button";
import { transitions as t } from "../lib/utils";
import { toast } from "sonner";

type Tab = "music" | "images" | "games" | "chat";

export default function CreatePage() {
  const [activeTab, setActiveTab] = useState<Tab>("music");
  const [generateLyrics, setGenerateLyrics] = useState(true);
  const [generateStyle, setGenerateStyle] = useState(false);
  const [uncensoredMusic, setUncensoredMusic] = useState(false);

  const [musicText, setMusicText] = useState("");
  const [musicStyle, setMusicStyle] = useState("");
  const [imageText, setImageText] = useState("");
  const [gameText, setGameText] = useState("");

  useEffect(() => {
    if (uncensoredMusic)
      toast.error("Uncensored music may produce HIGHLY offensive results", {
        duration: 1500,
        closeButton: true,
      });
  }, [uncensoredMusic]);

  const tabs = [
    { id: "music" as Tab, label: "Create Music", icon: Music },
    { id: "images" as Tab, label: "Create Images", icon: ImageIcon },
    { id: "games" as Tab, label: "Create Games", icon: Gamepad2 },
  ];

  return (
    <motion.div
      transition={t.transition}
      exit={t.fade_out_scale_1}
      animate={t.normalize}
      initial={t.fade_out}
      className="container mx-auto px-6 py-8"
    >
      {/* Tab Navigation */}
      <motion.div
        transition={t.transition}
        exit={{
          opacity: 0,
          y: -30,
        }}
        animate={t.normalize}
        initial={{
          opacity: 0,
          y: -30,
        }}
        className="flex space-x-1 bg-black/20 rounded-lg p-1"
      >
        {tabs.map((tab) => (
          <AnimatedButton
            variant="custom"
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center px-4 py-3 rounded-md transition-all cursor-pointer ${
              activeTab === tab.id
                ? "bg-blue-600 text-white"
                : "text-gray-300 hover:text-white hover:bg-white/10"
            }`}
          >
            <tab.icon className="w-5 h-5 mr-2" />
            <span>{tab.label}</span>
          </AnimatedButton>
        ))}
      </motion.div>

      {/* Tab Content */}
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
        <AnimatePresence mode="wait">
          {activeTab === "music" && (
            <motion.div
              transition={t.transition}
              exit={t.fade_out_scale_1}
              animate={t.normalize}
              initial={t.fade_out}
              className="space-y-6 pt-8"
              key="music"
            >
              <motion.div
                transition={t.transition}
                exit={{
                  opacity: 0,
                  x: -50,
                }}
                animate={t.normalize}
                initial={{
                  opacity: 0,
                  x: -50,
                }}
                className="space-y-4"
              >
                <label className="block">
                  <input
                    type="checkbox"
                    checked={generateLyrics}
                    onChange={(e) => setGenerateLyrics(e.target.checked)}
                    className="mr-2"
                  />
                  Generate Lyrics Automatically
                </label>
                <label className="block">
                  <input
                    type="checkbox"
                    checked={generateStyle}
                    onChange={(e) => setGenerateStyle(e.target.checked)}
                    className="mr-2"
                  />
                  Generate Music Style Automatically
                </label>
                <label className="block">
                  <input
                    type="checkbox"
                    checked={uncensoredMusic}
                    onChange={(e) => setUncensoredMusic(e.target.checked)}
                    className="mr-2"
                  />
                  Uncensored
                </label>
              </motion.div>

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
                  {generateLyrics
                    ? "Make a Song About..."
                    : "Make a Song With These Lyrics..."}
                </label>
                <textarea
                  value={musicText}
                  onChange={(e) => setMusicText(e.target.value)}
                  placeholder={
                    generateLyrics
                      ? "Sitting at my desk making AI music while my cat watches."
                      : "Enter lyrics..."
                  }
                  className="w-full h-32 px-4 py-3 bg-black/20 border border-gray-600 rounded-lg focus:border-blue-500 focus:outline-none resize-none"
                />

                <AnimatePresence>
                  {!generateStyle && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{
                        opacity: { duration: 0.25 },
                        height: { duration: 0.26 },
                      }}
                    >
                      <input
                        type="text"
                        value={musicStyle}
                        onChange={(e) => setMusicStyle(e.target.value)}
                        placeholder="lofi electro, male vocal"
                        className="w-full px-4 py-3 bg-black/20 border border-gray-600 rounded-lg focus:border-blue-500 focus:outline-none"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
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
                <AnimatedButton onClick={() => console.log("Create music")}>
                  Submit
                </AnimatedButton>
              </motion.div>
            </motion.div>
          )}
          {activeTab === "images" && (
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
          )}
          {activeTab === "games" && (
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
                <AnimatedButton onClick={() => console.log("Create game")}>
                  Submit
                </AnimatedButton>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
