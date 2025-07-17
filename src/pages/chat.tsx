import { useEffect, useState } from "react";
import { toast } from "sonner";
import AnimatedButton from "../components/animated-button";
import { transitions as t } from "../lib/utils";
import { motion } from "framer-motion";

export default function Chat() {
  const [uncensoredChat, setUncensoredChat] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<
    Array<{ text: string; isUser: boolean }>
  >([]);
  useEffect(() => {
    if (uncensoredChat)
      toast.error("Uncensored chat may produce HIGHLY offensive results", {
        duration: 1500,
        closeButton: true,
      });
  }, [uncensoredChat]);

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
      key="chat"
      className="h-[calc(100vh-100px)] flex flex-col p-3 overflow-y-hidden"
    >
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
        className="flex-1 bg-black/20 rounded-lg p-4 mb-4 overflow-y-auto"
      >
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
              <AnimatedButton onClick={handleChatSubmit}>Send</AnimatedButton>
            </div>
          </div>
        </div>
        <label className="flex justify-end mt-2 ml-auto">
          <input
            type="checkbox"
            checked={uncensoredChat}
            onChange={(e) => setUncensoredChat(e.target.checked)}
            className="mr-2"
          />
          Uncensored
        </label>
      </motion.div>
    </motion.div>
  );
}
