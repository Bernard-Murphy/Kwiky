"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, RotateCcw } from "lucide-react";
import AnimatedButton from "@/components/animated-button";
import { transitions as t } from "@/lib/utils";
import DatePicker from "@/components/datepicker";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Spinner from "@/components/ui/spinner";
import { useApp, themeClasses } from "@/App";

export interface Post {
  _id: string;
  type: string;
  hrID: string;
  link: string;
  timestamp: Date | string;
  userID?: string | undefined;
  prompt?: string;
  metadata: {
    title?: string;
    uncensored?: boolean;
    style?: string;
    lyrics?: string;
  };
}

export type BrowseStatus = "working" | "errored" | "complete";

type ContentFlavor = "music" | "images" | "games" | "deepfakes";

export interface BrowseConstraints {
  filters?: {
    [key in ContentFlavor]: boolean;
  };
  keywords?: string;
  dateRange?: {
    start: Date | undefined;
    end: Date | undefined;
  };
}

export interface BrowseProps {
  browseItems: Post[];
  browseStatus: BrowseStatus;
  setBrowseStatus: (option: BrowseStatus) => void;
  browseQuery: (constraints?: BrowseConstraints) => void;
}

export default function BrowsePage({
  browseItems,
  browseStatus,
  setBrowseStatus,
  browseQuery,
}: BrowseProps) {
  const [showSearchOptions, setShowSearchOptions] = useState(false);
  const [filters, setFilters] = useState<{ [key in ContentFlavor]: boolean }>({
    music: true,
    images: true,
    games: true,
    deepfakes: true,
  });
  const [keywords, setKeywords] = useState("");
  const [dateRange, setDateRange] = useState<{
    start: Date | undefined;
    end: Date | undefined;
  }>({
    start: undefined,
    end: undefined,
  });

  const { theme } = useApp();

  const handleFilterChange = (filter: keyof typeof filters) => {
    setFilters((prev) => ({
      ...prev,
      [filter]: !prev[filter],
    }));
  };

  const triggerQuery = () => {
    setBrowseStatus("working");
    const constraints: BrowseConstraints = {
      filters,
      keywords,
      dateRange,
    };
    browseQuery(constraints);
  };

  console.log(browseItems);
  console.log(browseStatus);

  return (
    <div className="container mx-auto px-6 py-8">
      <motion.div
        transition={t.transition}
        exit={{
          opacity: 0,
          y: -25,
        }}
        animate={t.normalize}
        initial={{
          opacity: 0,
          y: -25,
        }}
        className="max-w-2xl mx-auto"
      >
        <div className="space-y-6 relative w-full">
          <div className="flex space-x-4">
            <input
              type="text"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              placeholder="Search for content..."
              className="flex-1 px-4 py-3 bg-black/20 border border-gray-600 rounded-lg focus:border-blue-500 focus:outline-none"
            />
            <AnimatedButton onClick={triggerQuery}>Submit</AnimatedButton>
          </div>
          <AnimatedButton
            onClick={() => setShowSearchOptions(!showSearchOptions)}
            variant="ghost"
            className="flex items-center"
          >
            <span>Search Options</span>
            <ChevronDown
              className={`w-4 h-4 duration-300 ml-2 ${
                showSearchOptions ? "rotate-180" : ""
              }`}
            />
          </AnimatedButton>
          <div className="absolute w-full z-10">
            <AnimatePresence>
              {showSearchOptions && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className={`p-6 bg-black/20 rounded-lg border border-gray-600 space-y-4 overflow-hidden ${themeClasses[theme]}`}
                >
                  <div>
                    <label className="block text-sm font-medium mb-3">
                      Filter
                    </label>
                    <div className="space-y-2 space-x-2 flex items-center justify-between">
                      <div>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={filters.music}
                            onChange={() => handleFilterChange("music")}
                            className="mr-2"
                          />
                          Music
                        </label>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={filters.images}
                            onChange={() => handleFilterChange("images")}
                            className="mr-2"
                          />
                          Images
                        </label>
                      </div>

                      <div>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={filters.games}
                            onChange={() => handleFilterChange("games")}
                            className="mr-2"
                          />
                          Games
                        </label>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={filters.deepfakes}
                            onChange={() => handleFilterChange("deepfakes")}
                            className="mr-2"
                          />
                          Deepfakes
                        </label>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Date Range
                    </label>
                    <div className="flex space-x-4">
                      <div className="flex-1">
                        <DatePicker
                          buttonClasses="w-full"
                          className="w-full"
                          date={dateRange.start}
                          setDate={(d) =>
                            setDateRange((prev) => ({
                              ...prev,
                              start: d,
                            }))
                          }
                        />
                      </div>
                      <div className="flex-1">
                        <DatePicker
                          buttonClasses="w-full"
                          className="w-full"
                          date={dateRange.end}
                          setDate={(d) =>
                            setDateRange((prev) => ({
                              ...prev,
                              end: d,
                            }))
                          }
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
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
            className="w-full flex pt-2"
          >
            <AnimatePresence mode="wait">
              {browseStatus === "working" && (
                <motion.div
                  transition={t.transition}
                  exit={{
                    opacity: 0,
                    y: -50,
                  }}
                  animate={t.normalize}
                  initial={{
                    opacity: 0,
                    y: -50,
                  }}
                  className="flex justify-center w-full mt-5"
                  key="working"
                >
                  <Spinner />
                </motion.div>
              )}

              {browseStatus === "errored" && (
                <motion.div
                  transition={t.transition}
                  exit={{
                    opacity: 0,
                  }}
                  animate={t.normalize}
                  initial={{
                    opacity: 0,
                  }}
                  className="w-full mt-5"
                  key="errored"
                >
                  <h5 className="text-center text-red-400">
                    An error occurred. Please try again.
                  </h5>
                  <AnimatedButton
                    variant="ghost"
                    onClick={triggerQuery}
                    className="flex items-center mx-auto mt-4"
                  >
                    <RotateCcw className="me-2" />
                    Retry
                  </AnimatedButton>
                </motion.div>
              )}

              {browseStatus === "complete" && (
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
                  className="w-full mt-5"
                  key="complete"
                >
                  <h5 className="text-center">
                    No results found (Work in progress)
                  </h5>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
