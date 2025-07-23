"use client";

import { motion, AnimatePresence } from "framer-motion";
import { transitions as t } from "@/lib/utils";
import AnimatedButton from "@/components/animated-button";
import Spinner from "@/components/ui/spinner";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export interface MusicProps {
  generateLyrics: boolean;
  setGenerateLyrics: (option: boolean) => void;
  generateStyle: boolean;
  setGenerateStyle: (option: boolean) => void;
  uncensoredMusic: boolean;
  setUncensoredMusic: (option: boolean) => void;
  musicPrompt: string;
  setMusicPrompt: (text: string) => void;
  musicStyle: string;
  setMusicStyle: (text: string) => void;
  musicSubmit: () => void;
  working: boolean;
  musicLinks: string[];
  customLyrics: string;
  setCustomLyrics: (text: string) => void;
  musicStatus: string;
  lyrics: string;
  musicTitle: string;
  setMusicTitle: (text: string) => void;
}

export default function Music({
  generateLyrics,
  setGenerateLyrics,
  generateStyle,
  setGenerateStyle,
  uncensoredMusic,
  setUncensoredMusic,
  musicPrompt,
  setMusicPrompt,
  musicStyle,
  setMusicStyle,
  musicSubmit,
  working,
  musicLinks,
  customLyrics,
  setCustomLyrics,
  musicStatus,
  lyrics,
  musicTitle,
  setMusicTitle,
}: MusicProps) {
  const copyText = (string: string) => {
    let textarea = document.createElement("textarea");
    let result;

    try {
      textarea.setAttribute("readonly", "true");
      textarea.setAttribute("contenteditable", "true");
      textarea.style.position = "fixed";
      textarea.value = string;

      document.body.appendChild(textarea);

      textarea.focus();
      textarea.select();

      const range = document.createRange();
      range.selectNodeContents(textarea);

      const sel = window.getSelection();
      if (sel) {
        sel.removeAllRanges();
        sel.addRange(range);
      }

      textarea.setSelectionRange(0, textarea.value.length);
      result = document.execCommand("copy");
    } catch (err) {
      console.error(err);
      result = null;
    } finally {
      document.body.removeChild(textarea);
    }

    if (!result) {
      const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;
      const copyHotkey = isMac ? "⌘C" : "CTRL+C";
      result = prompt(`Press ${copyHotkey}`, string); // eslint-disable-line no-alert
      if (!result) {
        return false;
      }
    }

    toast.success("Copied to clipboard");
  };

  return (
    <motion.div
      transition={t.transition}
      exit={t.fade_out_scale_1}
      animate={t.normalize}
      initial={t.fade_out}
      className="space-y-6 pt-8"
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
          y: 50,
        }}
        animate={t.normalize}
        initial={{
          opacity: 0,
          y: 50,
        }}
      >
        <label className="block text-sm font-medium mb-2">Title</label>
        <input
          type="text"
          value={musicTitle}
          onChange={(e) => setMusicTitle(e.target.value)}
          placeholder="Enter Title"
          className="w-full px-4 py-3 bg-black/20 border border-gray-600 rounded-lg focus:border-blue-500 focus:outline-none mb-2"
        />

        <textarea
          value={generateLyrics ? musicPrompt : customLyrics}
          onChange={(e) =>
            generateLyrics
              ? setMusicPrompt(e.target.value)
              : setCustomLyrics(e.target.value)
          }
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
        <AnimatedButton disabled={working} onClick={musicSubmit}>
          <AnimatePresence mode="wait">
            <motion.div
              transition={t.transition}
              exit={t.fade_out_scale_1}
              animate={t.normalize}
              initial={t.fade_out}
              className="flex items-center"
              key={musicStatus}
            >
              {working ? (
                <>
                  <Spinner size="sm" className="me-2" />
                  {musicStatus || "Working"}
                </>
              ) : (
                "Submit"
              )}
            </motion.div>
          </AnimatePresence>
        </AnimatedButton>
        {musicStatus === "Errored" && (
          <div className="text-center text-red-400">
            An error occurred. Please try again later.
          </div>
        )}
      </motion.div>

      <motion.div
        transition={t.transition}
        exit={{
          opacity: 0,
          y: 70,
        }}
        animate={t.normalize}
        initial={{
          opacity: 0,
          y: 70,
        }}
        className="w-full flex pt-2"
      >
        <div className="w-1/3 p-2">
          {lyrics ? (
            <motion.div
              transition={t.transition}
              exit={t.fade_out_scale_1}
              animate={t.normalize}
              initial={t.fade_out}
            >
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger className="w-full">
                    <AnimatedButton
                      variant="custom"
                      className="w-full border rounded-md p-2 text-left"
                      onClick={() =>
                        copyText((musicTitle || "Untitled") + "\n" + lyrics)
                      }
                    >
                      <h5 className="text-center mb-2">
                        {musicTitle || "Untitled"}
                      </h5>
                      {lyrics.split("\n\n").map((stanza) => (
                        <div className="mb-2">
                          {stanza.split("\n").map((line) => (
                            <p>{line}</p>
                          ))}
                        </div>
                      ))}
                    </AnimatedButton>
                  </TooltipTrigger>
                </Tooltip>
              </TooltipProvider>
            </motion.div>
          ) : (
            <></>
          )}
        </div>
        <div className="w-2/3 p-2">
          {musicLinks.length ? (
            musicLinks.map((link) => {
              return (
                <motion.div
                  transition={t.transition}
                  exit={t.fade_out_scale_1}
                  animate={t.normalize}
                  initial={t.fade_out}
                  key={link}
                  className="mb-4"
                >
                  <audio className="w-full block mb-2" controls src={link} />
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger className="w-full">
                        <AnimatedButton
                          variant="custom"
                          className="w-full px-0 py-0"
                          onClick={() => copyText(link)}
                        >
                          <Input
                            className="cursor-pointer"
                            value={link}
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
                  <hr className="my-2" />
                </motion.div>
              );
            })
          ) : (
            <></>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
