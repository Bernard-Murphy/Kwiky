"use client";

import { motion, AnimatePresence } from "framer-motion";
import { transitions as t } from "@/lib/utils";
import AnimatedButton from "@/components/animated-button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { type ImageStyle } from "@/lib/imageStyles";
import { imageStyles } from "@/lib/imageStyles";
import Spinner from "@/components/ui/spinner";

export interface ImageDimensions {
  height: number;
  width: number;
}

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
  imageLink?: string;
  imageDimensions: ImageDimensions;
  setImageDimensions: (dimensions: ImageDimensions) => void;
}

export default function Images({
  imageText,
  setImageText,
  uncensoredImages,
  setUncensoredImages,
  imageStyle,
  setImageStyle,
  imageSubmit,
  imageWorking,
  imageStatus,
  imageLink,
  imageDimensions,
  setImageDimensions,
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
        <div className="my-4 flex align-center">
          <div className="mr-2">
            <label>Width</label>
            <br />
            <input
              type="number"
              value={imageDimensions.width}
              onChange={(e) =>
                setImageDimensions({
                  ...imageDimensions,
                  width: Number(e.target.value),
                })
              }
              className="px-4 py-3 bg-black/20 border border-gray-600 rounded-lg focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label>Height</label>
            <br />
            <input
              type="number"
              value={imageDimensions.height}
              onChange={(e) =>
                setImageDimensions({
                  ...imageDimensions,
                  height: Number(e.target.value),
                })
              }
              className="px-4 py-3 bg-black/20 border border-gray-600 rounded-lg focus:border-blue-500 focus:outline-none"
            />
          </div>
        </div>

        <Select value={imageStyle} onValueChange={setImageStyle}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Music Style" className="text-white" />
          </SelectTrigger>
          <SelectContent className="bg-gray-900 text-white">
            <SelectGroup>
              {imageStyles.map((style) => (
                <SelectItem key={style} value={style}>
                  {style}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <div className="text-center text-red-400">
          {imageStatus === "Errored"
            ? "An error occurred. Please try again later."
            : "You may not use this service to generate porn"}
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
        <AnimatedButton disabled={imageWorking} onClick={imageSubmit}>
          <AnimatePresence mode="wait">
            <motion.div
              transition={t.transition}
              exit={t.fade_out_scale_1}
              animate={t.normalize}
              initial={t.fade_out}
              className="flex items-center"
              key={imageStatus}
            >
              {imageWorking ? (
                <>
                  <Spinner size="sm" className="me-2" />
                  {imageStatus || "Working"}
                </>
              ) : (
                "Submit"
              )}
            </motion.div>
          </AnimatePresence>
        </AnimatedButton>
        {imageLink && (
          <motion.img
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
            src={imageLink}
            alt="Generated Image"
            className="mt-4 d-block mx-auto max-w-full"
          />
        )}
      </motion.div>
    </motion.div>
  );
}
