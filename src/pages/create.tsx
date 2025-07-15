"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Music, ImageIcon, Gamepad2, MessageCircle } from "lucide-react";
import AnimatedButton from "../components/animated-button";
import { transitions as t } from "../lib/utils";

type Tab = "music" | "images" | "games" | "chat";

export default function CreatePage() {
  const [activeTab, setActiveTab] = useState<Tab>("music");
  const [generateLyrics, setGenerateLyrics] = useState(true);
  const [generateStyle, setGenerateStyle] = useState(false);
  const [uncensoredMusic, setUncensoredMusic] = useState(false);
  const [uncensoredChat, setUncensoredChat] = useState(false);
  const [musicText, setMusicText] = useState("");
  const [musicStyle, setMusicStyle] = useState("");
  const [imageText, setImageText] = useState("");
  const [gameText, setGameText] = useState("");
  const [chatMessages, setChatMessages] = useState<
    Array<{ text: string; isUser: boolean }>
  >([]);
  const [chatInput, setChatInput] = useState("");

  const tabs = [
    { id: "music" as Tab, label: "Create Music", icon: Music },
    { id: "images" as Tab, label: "Create Images", icon: ImageIcon },
    { id: "games" as Tab, label: "Create Games", icon: Gamepad2 },
    { id: "chat" as Tab, label: "Chat", icon: MessageCircle },
  ];

  const handleChatSubmit = () => {
    if (chatInput.trim()) {
      setChatMessages((prev) => [...prev, { text: chatInput, isUser: true }]);
      setChatInput("");
      // Simulate AI response
      setTimeout(() => {
        setChatMessages((prev) => [
          ...prev,
          { text: "This is a simulated AI response.", isUser: false },
        ]);
      }, 1000);
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
      <div className="flex space-x-1 bg-black/20 rounded-lg p-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center space-x-2 px-4 py-3 rounded-md transition-all cursor-pointer ${
              activeTab === tab.id
                ? "bg-blue-600 text-white"
                : "text-gray-300 hover:text-white hover:bg-white/10"
            }`}
          >
            <tab.icon className="w-5 h-5" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div>
        <AnimatePresence mode="wait" initial={false}>
          {activeTab === "music" && (
            <motion.div
              transition={t.transition}
              exit={t.fade_out_scale_1}
              animate={t.normalize}
              initial={t.fade_out}
              className="space-y-6 pt-8"
              key="music"
            >
              <div className="space-y-4">
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
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  {generateLyrics
                    ? "Make a Song About..."
                    : "Make a Song With These Lyrics..."}
                </label>
                <textarea
                  value={musicText}
                  onChange={(e) => setMusicText(e.target.value)}
                  placeholder={
                    generateLyrics
                      ? "Sitting at my desk making AI music while my cat watches."
                      : "Enter lyrics..."
                  }
                  className="w-full h-32 px-4 py-3 bg-black/20 border border-gray-600 rounded-lg focus:border-blue-500 focus:outline-none resize-none"
                />
              </div>
              <AnimatePresence>
                {!generateStyle && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
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

              <AnimatedButton onClick={() => console.log("Create music")}>
                Submit
              </AnimatedButton>
            </motion.div>
          )}
          {activeTab === "images" && (
            <motion.div
              transition={t.transition}
              exit={t.fade_out_scale_1}
              animate={t.normalize}
              initial={t.fade_out}
              className="space-y-6 pt-8"
              key="images"
            >
              <div>
                <label className="block text-sm font-medium mb-2">
                  Create the Following Image...
                </label>
                <textarea
                  value={imageText}
                  onChange={(e) => setImageText(e.target.value)}
                  placeholder="Police bust illegal pepperoni operation"
                  className="w-full h-32 px-4 py-3 bg-black/20 border border-gray-600 rounded-lg focus:border-blue-500 focus:outline-none resize-none"
                />
              </div>
              <AnimatedButton onClick={() => console.log("Create image")}>
                Submit
              </AnimatedButton>
            </motion.div>
          )}
          {activeTab === "games" && (
            <motion.div
              transition={t.transition}
              exit={t.fade_out_scale_1}
              animate={t.normalize}
              initial={t.fade_out}
              className="space-y-6 pt-8"
              key="games"
            >
              <div>
                <label className="block text-sm font-medium mb-2">
                  Create the Following Game...
                </label>
                <textarea
                  value={gameText}
                  onChange={(e) => setGameText(e.target.value)}
                  placeholder="Shooting Game"
                  className="w-full h-32 px-4 py-3 bg-black/20 border border-gray-600 rounded-lg focus:border-blue-500 focus:outline-none resize-none"
                />
              </div>
              <AnimatedButton onClick={() => console.log("Create game")}>
                Submit
              </AnimatedButton>
            </motion.div>
          )}
          {activeTab === "chat" && (
            <motion.div
              transition={t.transition}
              exit={t.fade_out_scale_1}
              animate={t.normalize}
              initial={t.fade_out}
              key="chat"
              className="h-[calc(100vh-200px)] flex flex-col pt-2"
            >
              <div className="flex-1 bg-black/20 rounded-lg p-4 mb-4 overflow-y-auto">
                {chatMessages.length === 0 ? (
                  <div className="text-gray-400 text-center mt-8">
                    Start a conversation...
                  </div>
                ) : (
                  <div className="space-y-4">
                    {chatMessages.map((message, index) => (
                      <div
                        key={index}
                        className={`flex ${
                          message.isUser ? "justify-end" : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                            message.isUser
                              ? "bg-blue-600 text-white"
                              : "bg-gray-700 text-gray-100"
                          }`}
                        >
                          {message.text}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex space-x-4 items-end">
                <div className="flex-1 relative">
                  <textarea
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyPress={(e) =>
                      e.key === "Enter" &&
                      !e.shiftKey &&
                      (e.preventDefault(), handleChatSubmit())
                    }
                    placeholder="Type your message..."
                    className="w-full px-4 py-3 bg-black/20 border border-gray-600 rounded-lg focus:border-blue-500 focus:outline-none resize-none"
                    rows={2}
                  />
                  <div className="absolute right-3 top-3">
                    <AnimatedButton onClick={handleChatSubmit}>
                      Send
                    </AnimatedButton>
                  </div>
                </div>
              </div>
              <label className="flex items-center mt-2 ml-auto">
                <input
                  type="checkbox"
                  checked={uncensoredChat}
                  onChange={(e) => setUncensoredChat(e.target.checked)}
                  className="mr-2"
                />
                Uncensored
              </label>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
