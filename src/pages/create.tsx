"use client";

import { useEffect, useState } from "react";
import { type CreateTab, useApp } from "@/App";
import { motion, AnimatePresence } from "framer-motion";
import {
  Music as MusicIcon,
  ImageIcon,
  Gamepad2,
  CircleUserRound,
} from "lucide-react";
import AnimatedButton from "@/components/animated-button";
import { transitions as t } from "@/lib/utils";
import { toast } from "sonner";
import { Socket } from "socket.io-client";
import Images from "./create/images";
import { type ImageStyle } from "@/lib/imageStyles";
import Games from "./create/games";
import Music from "./create/music";
import { type ImageDimensions } from "./create/images";
import Deepfake from "./create/deepfake";
import axios from "axios";

export interface CreatePageProps {
  socket: Socket;
  activeTab: CreateTab;
  setActiveTab: (option: CreateTab) => void;
}

const api = process.env.REACT_APP_API;

export default function CreatePage({
  socket,
  activeTab,
  setActiveTab,
}: CreatePageProps) {
  const [customLyrics, setCustomLyrics] = useState<string>("");
  const [lyrics, setLyrics] = useState<string>("");
  const [musicStatus, setMusicStatus] = useState<string>("");
  const [musicWorking, setMusicWorking] = useState<boolean>(false);
  const [generateLyrics, setGenerateLyrics] = useState<boolean>(true);
  const [generateStyle, setGenerateStyle] = useState<boolean>(true);
  const [uncensoredMusic, setUncensoredMusic] = useState<boolean>(false);
  const [musicPrompt, setMusicPrompt] = useState<string>("");
  const [musicStyle, setMusicStyle] = useState<string>("");
  const [musicTitle, setMusicTitle] = useState<string>("");
  const [musicLinks, setMusicLinks] = useState<string[]>([]);

  const [imageText, setImageText] = useState<string>("");
  const [imageDimensions, setImageDimensions] = useState<ImageDimensions>({
    height: 1024,
    width: 1024,
  });
  const [imageWorking, setImageWorking] = useState<boolean>(false);
  const [imageStatus, setImageStatus] = useState<string>("");
  const [uncensoredImages, setUncensoredImages] = useState<boolean>(false);
  const [imageStyle, setImageStyle] = useState<ImageStyle>("Digital Art");
  const [imageLink, setImageLink] = useState<string>("");

  const [gameWorking, setGameWorking] = useState<boolean>(false);
  const [gameStatus, setGameStatus] = useState<string>("");
  const [gameText, setGameText] = useState<string>("");
  const [gameTitle, setGameTitle] = useState<string>("");
  const [gameLink, setGameLink] = useState<string>("");

  const [deepfakeMessage, setDeepfakeMessage] = useState<string>("");
  const [deepfakeAudio, setDeepfakeAudio] = useState<File | undefined>();
  const [deepfakeImage, setDeepfakeImage] = useState<File | undefined>();
  const [deepfakeWorking, setDeepfakeWorking] = useState<boolean>(false);
  const [deepfakeStatus, setDeepfakeStatus] = useState<string>("");
  const [deepfakeImagePreview, setDeepfakeImagePreview] = useState<
    string | null
  >(null);
  const [deepfakeAudioPreview, setDeepfakeAudioPreview] = useState<
    string | null
  >(null);
  const [deepfakeVideoLink, setDeepFakeVideoLink] = useState<any>(null);
  const [deepfakeAudioOnly, setDeepfakeAudioOnly] = useState<boolean>(false);

  useEffect(() => {
    socket.on("music-lyrics", (lyrics) => {
      setMusicStatus(`Generating Audio`);
      setLyrics(lyrics);
    });
    socket.on("music-error", () => {
      toast.error("An error occurred while generating the song.", {
        position: "bottom-center",
        duration: 2000,
      });
      setMusicStatus("Errored");
      setMusicWorking(false);
    });
    socket.on("music-links", (links) => {
      setMusicLinks(links);
      setMusicStatus("");
      setMusicWorking(false);
    });

    socket.on("images-link", (link) => {
      setImageLink(link);
      setImageWorking(false);
      setImageStatus("");
    });

    socket.on("images-error", () => {
      toast.error("An error occurred while generating the image.", {
        position: "bottom-center",
        duration: 2000,
      });
      setImageWorking(false);
      setImageStatus("Errored");
    });

    socket.on("images-porn", () => {
      setImageWorking(false);
      setImageStatus("Errored");
      toast.warning(
        "Sexual content detected. Change your prompt and try again",
        {
          position: "bottom-center",
          duration: 2000,
        }
      );
    });

    socket.on("games-status", setGameStatus);

    socket.on("games-link", (link: string) => {
      setGameLink(
        "https://" + process.env.REACT_APP_ASSET_LOCATION + "/" + link
      );
      setGameWorking(false);
      setGameStatus("");
    });

    socket.on("games-error", () => {
      toast.error("An error occurred while generating the game.", {
        position: "bottom-center",
        duration: 2000,
      });
      setGameWorking(false);
      setGameStatus("Errored");
    });

    socket.on("deepfake-status", (status: string) => {
      setDeepfakeStatus(status);
      if (status === "Errored") setDeepfakeWorking(false);
    });

    socket.on("deepfake-video-link", (videoLink) => {
      setDeepFakeVideoLink(videoLink);
      setDeepfakeStatus("");
      setDeepfakeWorking(false);
    });
  }, []);

  useEffect(() => {
    // if (uncensoredMusic)
    //   toast.error(
    //     "Uncensored music is a WIP and currently returns HIGHLY offensive results",
    //     {
    //       position: "bottom-center",
    //       duration: 2000,
    //     }
    //   );
    // if (uncensoredImages)
    //   toast.error(
    //     "Uncensored images is a WIP and currently returns HIGHLY offensive results",
    //     {
    //       position: "bottom-center",
    //       duration: 2000,
    //     }
    //   );

    if (uncensoredImages || uncensoredMusic) {
      toast.error("Uncensored content is currently disabled", {
        position: "bottom-center",
        duration: 2000,
      });
      setUncensoredImages(false);
      setUncensoredMusic(false);
    }
  }, [uncensoredMusic, uncensoredImages]);

  const tabs = [
    { id: "music" as CreateTab, label: "Music", icon: MusicIcon },
    { id: "images" as CreateTab, label: "Images", icon: ImageIcon },
    { id: "games" as CreateTab, label: "Games", icon: Gamepad2 },
    { id: "deepfake" as CreateTab, label: "Deepfake", icon: CircleUserRound },
  ];

  const musicSubmit = () => {
    try {
      if (!musicPrompt)
        return toast.warning("Please enter a prompt", {
          position: "bottom-center",
          duration: 2000,
        });
      setMusicWorking(true);
      setLyrics("");
      setMusicLinks([]);
      setMusicStatus(generateLyrics ? `Generating lyrics` : `Generating song`);
      socket.emit(
        "music-new-song",
        musicPrompt,
        generateLyrics ? "" : customLyrics,
        generateStyle ? "" : musicStyle,
        musicTitle,
        uncensoredMusic
      );
    } catch (err) {
      console.log("musicSubmit error", err);
      setMusicWorking(false);
      setMusicStatus("");
    }
  };

  const imageSubmit = () => {
    try {
      setImageWorking(true);
      setImageStatus("Generating Image");
      socket.emit(
        "images-new",
        imageText,
        imageStyle,
        uncensoredImages,
        imageDimensions
      );
    } catch (err) {
      console.log("imageSubmit error", err);
      setImageWorking(false);
      setImageStatus("");
    }
  };

  const gameSubmit = () => {
    try {
      setGameWorking(true);
      setGameStatus("Creating Game");
      socket.emit("create-game", gameText, gameTitle);
    } catch (err) {
      console.log("gameSubmit error", err);
      setGameWorking(false);
      setGameStatus("");
    }
  };

  const deepfakeSubmit = async () => {
    try {
      console.log(deepfakeAudio);
      console.log(deepfakeAudioOnly);
      console.log(deepfakeImage);
      console.log(deepfakeMessage);
      if (
        !deepfakeAudio ||
        (!deepfakeAudioOnly && !deepfakeImage) ||
        !deepfakeMessage
      )
        return;

      setDeepfakeWorking(true);
      const fd = new FormData();
      fd.append("socketID", socket.id || "");
      fd.append("message", deepfakeMessage);
      fd.append("audio", deepfakeAudio, deepfakeAudio.name);
      if (!deepfakeAudioOnly)
        fd.append("image", deepfakeImage!, deepfakeImage!.name);
      else fd.append("audioOnly", String(deepfakeAudioOnly));

      setDeepfakeStatus("Uploading");

      await axios.post(api + "/deepfake", fd);
    } catch (err) {
      console.log("Deepfake error", err);
      setDeepfakeWorking(false);
      setDeepfakeStatus("");
    }
  };

  const { theme } = useApp();

  return (
    <motion.div
      transition={t.transition}
      exit={t.fade_out_scale_1}
      animate={t.normalize}
      initial={t.fade_out}
      className="container mx-auto px-6 py-8 create-container flex-1"
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
            className={`flex items-center px-4 py-3 rounded-md transition-all cursor-pointer tab-button ${
              activeTab === tab.id
                ? "bg-blue-600 text-white"
                : ` hover:text-white hover:bg-white/10 ${
                    ["light"].includes(theme)
                      ? "text-gray-700"
                      : "text-gray-300"
                  }`
            }`}
          >
            <tab.icon className="w-5 h-5 mr-2 tab-icon" />
            <span>
              <span className="tab-create">Create </span>
              {tab.label}
            </span>
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
            <div className="space-y-6 pt-8 w-full h-full" key="music">
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
                musicTitle={musicTitle}
                setMusicTitle={setMusicTitle}
              />
            </div>
          )}
          {activeTab === "images" && (
            <div className="space-y-6 pt-8 w-full h-full" key="images">
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
                imageLink={imageLink}
                imageDimensions={imageDimensions}
                setImageDimensions={setImageDimensions}
              />
            </div>
          )}
          {activeTab === "games" && (
            <div className="space-y-6 pt-8 w-full h-full" key="games">
              <Games
                gameText={gameText}
                setGameText={setGameText}
                gameTitle={gameTitle}
                setGameTitle={setGameTitle}
                gameWorking={gameWorking}
                gameSubmit={gameSubmit}
                gameStatus={gameStatus}
                gameLink={gameLink}
              />
            </div>
          )}
          {activeTab === "deepfake" && (
            <div className="space-y-6 pt-8 w-full h-full" key="deepfake">
              <Deepfake
                message={deepfakeMessage}
                audioFile={deepfakeAudio}
                imageFile={deepfakeImage}
                setMessage={setDeepfakeMessage}
                setAudioFile={setDeepfakeAudio}
                setImageFile={setDeepfakeImage}
                working={deepfakeWorking}
                submit={deepfakeSubmit}
                status={deepfakeStatus}
                imagePreview={deepfakeImagePreview}
                setImagePreview={setDeepfakeImagePreview}
                audioPreview={deepfakeAudioPreview}
                setAudioPreview={setDeepfakeAudioPreview}
                videoLink={deepfakeVideoLink}
                audioOnly={deepfakeAudioOnly}
                setAudioOnly={setDeepfakeAudioOnly}
                activeTab={activeTab}
              />
            </div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
