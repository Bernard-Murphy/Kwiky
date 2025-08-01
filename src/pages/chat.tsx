import { useEffect, useState } from "react";
import { toast } from "sonner";
import AnimatedButton from "@/components/animated-button";
import { transitions as t } from "@/lib/utils";
import { motion } from "framer-motion";
import axios from "axios";

const api = process.env.REACT_APP_API;

export default function Chat() {
  const [uncensoredChat, setUncensoredChat] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<
    Array<{ text: string; isUser: boolean; timestamp: Date }>
  >([]);
  useEffect(() => {
    if (uncensoredChat)
      toast.error("Uncensored chat may produce HIGHLY offensive results", {
        position: "bottom-center",
        duration: 1500,
      });
  }, [uncensoredChat]);

  useEffect(() => {
    const container = document.getElementById("chat-container");
    if (container) container.scrollTop = container.scrollHeight;
  }, [chatMessages.length]);

  const handleChatSubmit = () => {
    if (chatInput.trim()) {
      setChatMessages((prev) => [
        ...prev,
        { text: chatInput, isUser: true, timestamp: new Date() },
      ]);
      setChatInput("");
      // Simulate AI response
      axios
        .post(api + "/chat/ask", {
          message: chatInput,
          uncensored: uncensoredChat,
        })
        .then((res) => {
          setChatMessages((prev) => [
            ...prev,
            {
              text: res.data.text,
              isUser: false,
              timestamp: new Date(),
            },
          ]);
        })
        .catch((err) => {
          console.log("error", err);
          toast.error("An error occurred. Please try again later.", {
            position: "bottom-center",
            duration: 1500,
          });
        });
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
        id="chat-container"
        style={{
          scrollBehavior: "smooth",
        }}
      >
        {chatMessages.length === 0 ? (
          <div className="text-gray-400 text-center mt-8">
            Start a conversation...
          </div>
        ) : (
          <div className="space-y-4">
            {chatMessages.map((message, index) => (
              <motion.div
                transition={t.transition}
                exit={t.fade_out_scale_1}
                animate={t.normalize}
                initial={t.fade_out}
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
              </motion.div>
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
              <AnimatedButton variant="outline" onClick={handleChatSubmit}>
                Send
              </AnimatedButton>
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
