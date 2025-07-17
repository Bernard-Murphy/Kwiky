"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import AnimatedButton from "../components/animated-button";
import { transitions as t } from "../lib/utils";
import { DatePicker } from "../components/date-picker";

export default function BrowsePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchOptions, setShowSearchOptions] = useState(false);
  const [filters, setFilters] = useState({
    music: true,
    images: true,
    games: true,
  });
  const [keywords, setKeywords] = useState("");
  const [dateRange, setDateRange] = useState({
    start: "",
    end: "",
  });

  const handleFilterChange = (filter: keyof typeof filters) => {
    setFilters((prev) => ({
      ...prev,
      [filter]: !prev[filter],
    }));
  };

  const handleSearch = () => {
    console.log("Searching with:", {
      searchQuery,
      filters,
      keywords,
      dateRange,
    });
  };

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
        <div className="space-y-6">
          <div className="flex space-x-4">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for content..."
              className="flex-1 px-4 py-3 bg-black/20 border border-gray-600 rounded-lg focus:border-blue-500 focus:outline-none"
            />
            <AnimatedButton onClick={handleSearch}>Submit</AnimatedButton>
          </div>

          <div>
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

            <AnimatePresence>
              {showSearchOptions && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 p-6 bg-black/20 rounded-lg border border-gray-600 space-y-4 overflow-hidden"
                >
                  <div>
                    <label className="block text-sm font-medium mb-3">
                      Filter
                    </label>
                    <div className="space-y-2">
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
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={filters.games}
                          onChange={() => handleFilterChange("games")}
                          className="mr-2"
                        />
                        Games
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Keywords
                    </label>
                    <input
                      type="text"
                      value={keywords}
                      onChange={(e) => setKeywords(e.target.value)}
                      placeholder="Enter keywords..."
                      className="w-full px-4 py-3 bg-black/20 border border-gray-600 rounded-lg focus:border-blue-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Date Range
                    </label>
                    <div className="flex space-x-4">
                      <DatePicker
                        date={new Date(dateRange.start || new Date())}
                        setDate={(e) => {
                          console.log(e);
                          setDateRange((prev) => ({
                            ...prev,
                            start: e?.toISOString() || "",
                          }));
                        }}
                        className="flex-1 px-4 py-3"
                      />
                      <DatePicker
                        date={new Date(dateRange.end || new Date())}
                        setDate={(e) =>
                          setDateRange((prev) => ({
                            ...prev,
                            end: e?.toISOString() || "",
                          }))
                        }
                        className="flex-1 px-4 py-3"
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
