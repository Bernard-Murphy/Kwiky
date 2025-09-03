import {
  type Dispatch,
  type SetStateAction,
  useEffect,
  useState,
  Fragment,
} from "react";
import { toast } from "sonner";
import AnimatedButton from "@/components/animated-button";
import { transitions as t } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import TypingIndicator from "@/components/ui/typing-indicator";
import { MessageCircleMore, Eraser } from "lucide-react";
import Spinner from "@/components/ui/spinner";
import { useApp } from "@/App";

const api = process.env.REACT_APP_API;

export interface ChatMessage {
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export interface ChatProps {
  chatMessages: ChatMessage[];
  setChatMessages: Dispatch<SetStateAction<ChatMessage[]>>;
  awaitingChatResponse: boolean;
  setAwaitingChatResponse: (option: boolean) => void;
  chatInitialized: boolean;
}

export default function Chat({
  chatMessages,
  setChatMessages,
  awaitingChatResponse,
  setAwaitingChatResponse,
  chatInitialized,
}: ChatProps) {
  const [uncensoredChat, setUncensoredChat] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [clearAllOpen, setClearAllOpen] = useState<boolean>(false);

  const { showNavMenu } = useApp();

  useEffect(() => {
    if (uncensoredChat) {
      toast.error("Uncensored chat is currently disabled", {
        position: "bottom-center",
        duration: 1500,
      });
      setUncensoredChat(false);
    }
    // toast.error(
    //   "Uncensored chat is a WIP and currently produces HIGHLY offensive results",
    //   {
    //     position: "bottom-center",
    //     duration: 1500,
    //   }
    // );
  }, [uncensoredChat]);

  useEffect(() => {
    const container = document.getElementById("chat-container");
    if (container) container.scrollTop = container.scrollHeight;
  }, [chatMessages.length]);

  const clearAll = () => {
    setChatMessages([]);
    setClearAllOpen(false);
    axios
      .get(api + "/chat/clear")
      .catch(() =>
        console.log("an error occurred while clearing the messages")
      );
  };

  const handleChatSubmit = () => {
    if (chatInput.trim()) {
      setChatMessages((prev) => [
        ...prev,
        { text: chatInput, isUser: true, timestamp: new Date() },
      ]);
      setChatInput("");
      setAwaitingChatResponse(true);
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
        })
        .finally(() => setAwaitingChatResponse(false));
    }
  };

  if (!chatInitialized)
    return (
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
        key="chat-loader"
      >
        <Spinner />
      </motion.div>
    );

  return (
    <motion.div
      transition={t.transition}
      exit={t.fade_out_scale_1}
      animate={t.normalize}
      initial={t.fade_out}
      key="chat"
      // className="h-[calc(100vh-100px)] flex flex-col p-3 overflow-y-hidden"
      className="h-full flex flex-col p-3 overflow-y-hidden flex-1"
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
        className={`flex-1 bg-black/20 rounded-lg p-4 mb-4 overflow-y-auto ${
          showNavMenu ? "" : "relative"
        }`}
        id="chat-container"
        style={{
          scrollBehavior: "smooth",
        }}
      >
        <AnimatePresence mode="wait">
          {!showNavMenu && (
            <motion.div
              transition={t.transition}
              exit={t.fade_out_scale_1}
              animate={t.normalize}
              initial={t.fade_out}
              className="absolute left-5"
            >
              <div className="relative">
                <AnimatePresence mode="wait">
                  {chatMessages.length === 0 ? (
                    <Fragment key="no-messages"></Fragment>
                  ) : (
                    <motion.div
                      transition={t.transition}
                      exit={t.fade_out_scale_1}
                      animate={t.normalize}
                      initial={t.fade_out}
                      key="yes-messages"
                    >
                      <AnimatedButton
                        variant="ghost"
                        onClick={() => setClearAllOpen((curr) => !curr)}
                        className="flex items-center"
                      >
                        <Eraser className="me-2" />
                        Clear All
                      </AnimatedButton>
                      <AnimatePresence>
                        {clearAllOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="mt-2 w-48 bg-gray-800 rounded-lg shadow-lg border border-gray-700 py-2"
                          >
                            <h5 className="px-4">Are you sure?</h5>
                            <button
                              onClick={clearAll}
                              className="w-full text-left px-4 py-2 hover:bg-red-200 text-red-400 transition-colors cursor-pointer"
                            >
                              Yes
                            </button>
                            <button
                              onClick={() => setClearAllOpen(false)}
                              className="w-full text-left px-4 py-2 hover:bg-gray-700 transition-colors cursor-pointer"
                            >
                              No
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {chatMessages.length === 0 ? (
            <motion.div
              className="w-full"
              transition={t.transition}
              exit={t.fade_out_scale_1}
              animate={t.normalize}
              initial={t.fade_out}
              key="no-messages"
            >
              <MessageCircleMore
                className="text-gray-400 block mx-auto mt-8"
                size={100}
              />
            </motion.div>
          ) : (
            <motion.div
              transition={t.transition}
              exit={t.fade_out_scale_1}
              animate={t.normalize}
              initial={t.fade_out}
              key="yes-messages"
              className="space-y-4 "
            >
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
              {awaitingChatResponse && <TypingIndicator />}
            </motion.div>
          )}
        </AnimatePresence>
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
