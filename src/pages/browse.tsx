"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";
import AnimatedButton from "../components/animated-button";

export default function BrowsePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchOptions, setShowSearchOptions] = useState(false);
  const [filters, setFilters] = useState({
    music: true,
    images: true,
    games: true,
  });
  const [author, setAuthor] = useState("");
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
    console.log("Searching with:", { searchQuery, filters, author, dateRange });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="container mx-auto px-6 py-8"
    >
      <div className="max-w-2xl mx-auto">
        <div className="space-y-6">
          <div className="flex space-x-4">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for content..."
              className="flex-1 px-4 py-3 bg-black/20 border border-gray-600 rounded-lg focus:border-blue-500 focus:outline-none"
            />
            <AnimatedButton onClick={handleSearch}>Search</AnimatedButton>
          </div>

          <div>
            <AnimatedButton
              onClick={() => setShowSearchOptions(!showSearchOptions)}
              variant="secondary"
              className="flex items-center space-x-2"
            >
              <span>Search Options</span>
              {showSearchOptions ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </AnimatedButton>

            <AnimatePresence>
              {showSearchOptions && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 p-6 bg-black/20 rounded-lg border border-gray-600 space-y-4"
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
                      Author
                    </label>
                    <input
                      type="text"
                      value={author}
                      onChange={(e) => setAuthor(e.target.value)}
                      placeholder="Enter author name..."
                      className="w-full px-4 py-3 bg-black/20 border border-gray-600 rounded-lg focus:border-blue-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Date Range
                    </label>
                    <div className="flex space-x-4">
                      <input
                        type="date"
                        value={dateRange.start}
                        onChange={(e) =>
                          setDateRange((prev) => ({
                            ...prev,
                            start: e.target.value,
                          }))
                        }
                        className="flex-1 px-4 py-3 bg-black/20 border border-gray-600 rounded-lg focus:border-blue-500 focus:outline-none"
                      />
                      <input
                        type="date"
                        value={dateRange.end}
                        onChange={(e) =>
                          setDateRange((prev) => ({
                            ...prev,
                            end: e.target.value,
                          }))
                        }
                        className="flex-1 px-4 py-3 bg-black/20 border border-gray-600 rounded-lg focus:border-blue-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Search Results Placeholder */}
        <div className="mt-8 text-center text-gray-400">
          <p>Search results will appear here...</p>
        </div>
      </div>
    </motion.div>
  );
}
