"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Music as MusicIcon, ImageIcon, Gamepad2 } from "lucide-react";
import AnimatedButton from "@/components/animated-button";
import { transitions as t } from "@/lib/utils";
import { toast } from "sonner";
import { Socket } from "socket.io-client";
import Images from "./create/images";
import { type ImageStyle } from "./create/images";
import Games from "./create/games";
import Music from "./create/music";

type Tab = "music" | "images" | "games" | "chat";

export default function CreatePage({ socket }: { socket: Socket }) {
  const [activeTab, setActiveTab] = useState<Tab>("music");
  const [generateLyrics, setGenerateLyrics] = useState<boolean>(true);
  const [generateStyle, setGenerateStyle] = useState<boolean>(true);
  const [uncensoredMusic, setUncensoredMusic] = useState(false);
  const [uncensoredImages, setUncensoredImages] = useState(false);
  const [uncensoredGames, setUncensoredGames] = useState(false);
  const [musicWorking, setMusicWorking] = useState(false);
  const [imageWorking, setImageWorking] = useState(false);
  const [musicLinks, setMusicLinks] = useState<string[]>([]);
  const [customLyrics, setCustomLyrics] = useState<string>("");
  const [lyrics, setLyrics] = useState<string>("");
  const [musicStatus, setMusicStatus] = useState<string>("");
  const [imageStatus, setImageStatus] = useState<string>("");
  const [imageStyle, setImageStyle] = useState<ImageStyle>("Digital Art");

  const [musicPrompt, setMusicPrompt] = useState("");
  const [musicStyle, setMusicStyle] = useState("");
  const [imageText, setImageText] = useState("");
  const [gameText, setGameText] = useState("");

  useEffect(() => {
    socket.on("music-lyrics", (lyrics) => {
      console.log("lyrics", lyrics);
      setMusicStatus(`Generating song`);
      setLyrics(lyrics);
    });
    socket.on("music-error", (err) => {
      try {
        console.log("error", err);
        toast.error(
          "An error occurred while generating the song. Check the console for more details.",
          {
            position: "bottom-center",
            duration: 1500,
          }
        );
      } catch (err) {
        console.log("music-error err", err);
      }
      setMusicStatus("Errored");
      setMusicWorking(false);
    });
    socket.on("music-links", (links) => {
      try {
        console.log("music links", links);
        setMusicLinks(links);
        setMusicStatus("");
      } catch (err) {
        console.log("music links error", err);
        setCustomLyrics("");
        setMusicStatus("Errored");
      }
      setMusicWorking(false);
    });
  }, []);

  useEffect(() => {
    if (uncensoredMusic)
      toast.error("Uncensored music may produce HIGHLY offensive results", {
        position: "bottom-center",
        duration: 1500,
      });
  }, [uncensoredMusic]);

  useEffect(() => {
    if (uncensoredImages)
      toast.error("Uncensored images may produce HIGHLY offensive results", {
        position: "bottom-center",
        duration: 1500,
      });
  }, [uncensoredImages]);

  useEffect(() => {
    if (uncensoredGames)
      toast.error("Uncensored games may produce HIGHLY offensive results", {
        position: "bottom-center",
        duration: 1500,
      });
  }, [uncensoredGames]);

  const tabs = [
    { id: "music" as Tab, label: "Create Music", icon: MusicIcon },
    { id: "images" as Tab, label: "Create Images", icon: ImageIcon },
    { id: "games" as Tab, label: "Create Games", icon: Gamepad2 },
  ];

  const musicSubmit = () => {
    try {
      setMusicWorking(true);
      setLyrics("");
      setMusicLinks([]);
      setMusicStatus(generateLyrics ? `Generating lyrics` : `Generating song`);
      socket.emit(
        "music-new-song",
        musicPrompt,
        generateLyrics ? "" : customLyrics,
        generateStyle ? "" : musicStyle,
        uncensoredMusic
      );
    } catch (err) {
      console.log("musicSubmit error", err);
    }
  };

  const imageSubmit = () => {
    try {
      setImageWorking(true);
      setImageStatus(generateLyrics ? `Generating lyrics` : `Generating song`);
      socket.emit("image-new-image", imageText, uncensoredImages);
    } catch (err) {
      console.log("imageSubmit error", err);
    }
  };

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
        className="p-1"
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
            <Music
              generateLyrics={generateLyrics}
              setGenerateLyrics={setGenerateLyrics}
              generateStyle={generateStyle}
              setGenerateStyle={setGenerateStyle}
              uncensoredMusic={uncensoredMusic}
              setUncensoredMusic={setUncensoredMusic}
              musicPrompt={musicPrompt}
              setMusicPrompt={setMusicPrompt}
              musicStyle={musicStyle}
              setMusicStyle={setMusicStyle}
              working={musicWorking}
              musicSubmit={musicSubmit}
              musicLinks={musicLinks}
              customLyrics={customLyrics}
              setCustomLyrics={setCustomLyrics}
              musicStatus={musicStatus}
              lyrics={lyrics}
              key="music"
            />
          )}
          {activeTab === "images" && (
            <Images
              imageText={imageText}
              setImageText={setImageText}
              uncensoredImages={uncensoredImages}
              setUncensoredImages={setUncensoredImages}
              imageStyle={imageStyle}
              setImageStyle={setImageStyle}
              imageWorking={imageWorking}
              imageStatus={imageStatus}
              imageSubmit={imageSubmit}
              key="images"
            />
          )}
          {activeTab === "games" && (
            <Games
              gameText={gameText}
              setGameText={setGameText}
              key="games"
              uncensoredGames={uncensoredGames}
              setUncensoredGames={setUncensoredGames}
            />
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
