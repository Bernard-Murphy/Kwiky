import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Palette } from "lucide-react";
import { useApp } from "../App";

const themes = [
  { name: "Light", value: "light" as const, color: "bg-white border-gray-300" },
  {
    name: "Dark",
    value: "dark" as const,
    color: "bg-gray-900 border-gray-600",
  },
  { name: "Red", value: "red" as const, color: "bg-red-900 border-red-600" },
  {
    name: "Blue",
    value: "blue" as const,
    color: "bg-blue-900 border-blue-600",
  },
  {
    name: "Pink",
    value: "pink" as const,
    color: "bg-pink-900 border-pink-600",
  },
  {
    name: "Green",
    value: "green" as const,
    color: "bg-green-900 border-green-600",
  },
];

export default function ThemeSelector() {
  const { theme, setTheme } = useApp();
  const [isOpen, setIsOpen] = useState(false);

  const handleThemeSelect = (newTheme: typeof theme) => {
    setTheme(newTheme);
    setIsOpen(false);
  };

  return (
    <div
      className="fixed bottom-4 left-4 z-50"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <motion.div
        className="bg-black/20 backdrop-blur-sm rounded-full p-3 cursor-pointer hover:bg-black/30 transition-colors"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <Palette className="w-6 h-6" />
      </motion.div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-full mb-2 bg-black/80 backdrop-blur-sm rounded-lg p-2 space-y-1"
          >
            {themes.map((themeOption) => (
              <motion.button
                key={themeOption.value}
                onClick={() => handleThemeSelect(themeOption.value)}
                className={`flex items-center space-x-2 w-full px-3 py-2 rounded-md hover:bg-white/10 transition-colors ${
                  theme === themeOption.value ? "bg-white/20" : ""
                }`}
                whileHover={{ x: 4 }}
              >
                <div
                  className={`w-4 h-4 rounded-full border-2 ${themeOption.color}`}
                />
                <span className="text-sm">{themeOption.name}</span>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
