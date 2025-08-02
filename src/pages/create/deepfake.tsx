"use client";

import { motion, AnimatePresence } from "framer-motion";
import { UserRound, AudioLines } from "lucide-react";
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
  status: string;
  imagePreview: string | null;
  setImagePreview: (url: string) => void;
  audioPreview: string | null;
  setAudioPreview: (url: string) => void;
  videoLink: string | null;
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
  status,
  imagePreview,
  setImagePreview,
  audioPreview,
  setAudioPreview,
  videoLink,
}: DeepfakeProps) {
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImagefile(file);
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };
  const handleAudioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAudioFile(file);
      const reader = new FileReader();
      reader.onload = () => setAudioPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <motion.div
      transition={t.transition}
      exit={t.fade_out_scale_1}
      animate={t.normalize}
      initial={t.fade_out}
      className="space-y-6 pt-8 h-full"
      key="deepfake"
    >
      <div className="flex mb-4">
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
          className="w-1/2 p-2"
        >
          <div className="relative inline-block w-full h-64">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
              id="image-upload"
            />

            <AnimatedButton
              variant="custom"
              type="button"
              className={`block w-full h-full mx-auto cursor-pointer hover:bg-gray-700 duration-200 overflow-hidden rounded-md pt-4 px-4 pb-2 ${
                imagePreview ? "bg-gray-800" : ""
              }`}
            >
              <label
                className="cursor-pointer h-full w-full block"
                htmlFor="image-upload"
              >
                {imagePreview ? (
                  <div className="w-full h-full flex flex-col justify-evenly align-center">
                    <img
                      src={imagePreview || "/placeholder.svg"}
                      alt="Avatar preview"
                      style={{ height: "80%" }}
                      className="mx-auto block"
                    />
                    <div className="flex items-center w-full">
                      <div className="text-center font-medium text-gray-400 w-full">
                        {imageFile?.name || "Face"}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-full flex flex-col justify-evenly align-center">
                    <UserRound
                      className="w-24 text-gray-400 block mx-auto"
                      style={{ height: "80%" }}
                    />
                    <div className="text-center font-medium text-gray-400">
                      Face
                    </div>
                  </div>
                )}
              </label>
            </AnimatedButton>
          </div>
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
          className="w-1/2 p-2"
        >
          <div className="relative inline-block w-full h-64">
            <input
              type="file"
              accept="audio/*"
              onChange={handleAudioChange}
              className="hidden"
              id="audio-upload"
            />
            <AnimatedButton
              variant="custom"
              type="button"
              className={`block w-full h-full mx-auto cursor-pointer hover:bg-gray-700 duration-200 overflow-hidden rounded-md pt-4 px-4 pb-2  ${
                audioPreview ? "bg-gray-800" : ""
              }`}
            >
              <label
                className="cursor-pointer h-full w-full block"
                htmlFor="audio-upload"
              >
                {audioPreview ? (
                  <div className="w-full h-full flex flex-col justify-evenly align-center">
                    <div
                      className="flex items-center w-full"
                      style={{ height: "80%" }}
                    >
                      <audio src={audioPreview} className="mx-auto" controls />
                    </div>

                    <div className="flex items-center w-full">
                      <div className="text-center font-medium text-gray-400 w-full">
                        {audioFile?.name || "Audio Sample"}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-full flex flex-col justify-evenly align-center">
                    <AudioLines
                      className="w-24 text-gray-400 block mx-auto"
                      style={{ height: "80%" }}
                    />
                    <div className="text-center font-medium text-gray-400">
                      Audio Sample
                    </div>
                  </div>
                )}
              </label>
            </AnimatedButton>
          </div>
        </motion.div>
      </div>
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
        <label className="block text-sm font-medium mb-2">Message</label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Hello, my name is..."
          className="w-full h-32 px-4 py-3 bg-black/20 border border-gray-600 rounded-lg focus:border-blue-500 focus:outline-none resize-none mb-2"
        />
        <AnimatedButton disabled={working} onClick={submit}>
          <AnimatePresence mode="wait">
            <motion.div
              transition={t.transition}
              exit={t.fade_out_scale_1}
              animate={t.normalize}
              initial={t.fade_out}
              className="flex items-center"
              key={status}
            >
              {working ? (
                <>
                  <Spinner size="sm" className="me-2" />
                  {status || "Working"}
                </>
              ) : (
                "Submit"
              )}
            </motion.div>
          </AnimatePresence>
        </AnimatedButton>
        {status === "Errored" && (
          <div className="text-center text-red-400">
            An error occurred. Please try again later.
          </div>
        )}
        {videoLink?.length ? (
          <motion.video
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
            controls
            src={"https://" + process.env.REACT_APP_ASSET_LOCATION + videoLink}
            className="mt-2 block w-full"
          />
        ) : (
          <></>
        )}
      </motion.div>
    </motion.div>
  );
}
