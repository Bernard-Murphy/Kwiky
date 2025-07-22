"use client";

import { motion } from "framer-motion";
import { transitions as t } from "@/lib/utils";
import AnimatedButton from "@/components/animated-button";

export type ImageStyle =
  | "3D Model"
  | "Analog Film"
  | "Anime"
  | "Cinematic"
  | "Comic Book"
  | "Craft Clay"
  | "Digital Art"
  | "Enhance"
  | "Fantasy Art"
  | "Isometric Style"
  | "Line Art"
  | "Lowpoly"
  | "Neon Punk"
  | "Origami"
  | "Photographic"
  | "Pixel Art"
  | "Texture"
  | "Advertising"
  | "Food Photography"
  | "Real Estate"
  | "Abstract"
  | "Cubist"
  | "Graffiti"
  | "Hyperrealism"
  | "Impressionist"
  | "Pointillism"
  | "Pop Art"
  | "Psychedelic"
  | "Renaissance"
  | "Steampunk"
  | "Surrealist"
  | "Typography"
  | "Watercolor"
  | "Fighting Game"
  | "GTA"
  | "Super Mario"
  | "Minecraft"
  | "Pokemon"
  | "Retro Arcade"
  | "Retro Game"
  | "RPG Fantasy Game"
  | "Strategy Game"
  | "Street Fighter"
  | "Legend of Zelda"
  | "Architectural"
  | "Disco"
  | "Dreamscape"
  | "Dystopian"
  | "Fairy Tale"
  | "Gothic"
  | "Grunge"
  | "Horror"
  | "Minimalist"
  | "Monochrome"
  | "Nautical"
  | "Space"
  | "Stained Glass"
  | "Techwear Fashion"
  | "Tribal"
  | "Zentangle"
  | "Collage"
  | "Flat Papercut"
  | "Kirigami"
  | "Paper Mache"
  | "Paper Quilling"
  | "Papercut Collage"
  | "Papercut Shadow Box"
  | "Stacked Papercut"
  | "Thick Layered Papercut"
  | "Alien"
  | "Film Noir"
  | "HDR"
  | "Long Exposure"
  | "Neon Noir"
  | "Silhouette"
  | "Tilt-Shift";

export interface ImageProps {
  imageText: string;
  setImageText: (text: string) => void;
  uncensoredImages: boolean;
  setUncensoredImages: (option: boolean) => void;
  imageStyle: ImageStyle;
  setImageStyle: (option: ImageStyle) => void;
  imageSubmit: () => void;
  imageWorking: boolean;
  imageStatus: string;
}

export default function Images({
  imageText,
  setImageText,
  uncensoredImages,
  setUncensoredImages,
  imageStyle,
  setImageStyle,
  imageWorking,
  imageStatus,
}: ImageProps) {
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
          className="w-full h-32 px-4 py-3 bg-black/20 border border-gray-600 rounded-lg focus:border-blue-500 focus:outline-none resize-none mb-2"
        />
        <label className="block mb-2 flex-1">
          <input
            type="checkbox"
            checked={uncensoredImages}
            onChange={(e) => setUncensoredImages(e.target.checked)}
            className="mr-2"
          />
          Uncensored
        </label>
        <div className="text-center text-red-400">
          You may not use this service to generate porn
        </div>
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
