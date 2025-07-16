import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useApp } from "../App";
import { transitions as t } from "../lib/utils";

type ProfileTab = "userInfo" | "myContent";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<ProfileTab>("userInfo");
  const { user } = useApp();

  if (!user) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="container mx-auto px-6 py-8 text-center"
      >
        <p>Please log in to view your profile.</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      transition={t.transition}
      exit={t.fade_out_scale_1}
      animate={t.normalize}
      initial={t.fade_out}
      className="container mx-auto px-6 py-8"
    >
      <div className="flex">
        {/* Left Sidebar - Tab Navigation */}
        <motion.div
          transition={t.transition}
          exit={{
            opacity: 0,
            x: -100,
          }}
          animate={t.normalize}
          initial={{
            opacity: 0,
            x: -100,
          }}
          className="w-64 mr-8"
        >
          <div className="space-y-2">
            <button
              onClick={() => setActiveTab("userInfo")}
              className={`w-full text-left px-4 py-3 rounded-lg transition-colors cursor-pointer ${
                activeTab === "userInfo"
                  ? "bg-blue-600 text-white"
                  : "text-gray-300 hover:text-white hover:bg-white/10"
              }`}
            >
              User Info
            </button>
            <button
              onClick={() => setActiveTab("myContent")}
              className={`w-full text-left px-4 py-3 rounded-lg transition-colors cursor-pointer ${
                activeTab === "myContent"
                  ? "bg-blue-600 text-white"
                  : "text-gray-300 hover:text-white hover:bg-white/10"
              }`}
            >
              My Content
            </button>
          </div>
        </motion.div>

        {/* Main Content */}
        <motion.div
          transition={t.transition}
          exit={{
            opacity: 0,
            x: 100,
          }}
          animate={t.normalize}
          initial={{
            opacity: 0,
            x: 100,
          }}
          className="flex-1"
        >
          <div>
            <AnimatePresence mode="wait" initial={false}>
              {activeTab === "userInfo" && (
                <motion.div
                  transition={t.transition}
                  exit={{
                    opacity: 0,
                    x: 100,
                  }}
                  animate={t.normalize}
                  initial={{
                    opacity: 0,
                    x: 100,
                  }}
                  className="space-y-6"
                  key="userInfo"
                >
                  <h2 className="text-2xl font-bold mb-6">User Information</h2>

                  <div className="flex items-center space-x-6">
                    <div className="w-24 h-24 rounded-full bg-gray-600 overflow-hidden">
                      {user.avatar ? (
                        <img
                          src={user.avatar || "/placeholder.svg"}
                          alt="Avatar"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-2xl">
                          {user.username.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold">{user.username}</h3>
                      <p className="text-gray-400">{user.email}</p>
                    </div>
                  </div>

                  {user.bio && (
                    <div>
                      <h4 className="text-lg font-medium mb-2">Bio</h4>
                      <p className="text-gray-300">{user.bio}</p>
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === "myContent" && (
                <motion.div
                  transition={t.transition}
                  exit={{
                    opacity: 0,
                    x: 100,
                  }}
                  animate={t.normalize}
                  initial={{
                    opacity: 0,
                    x: 100,
                  }}
                  key="myContent"
                >
                  <h2 className="text-2xl font-bold mb-6">My Content</h2>
                  <div className="text-center text-gray-400 py-12">
                    <p>Your created content will appear here...</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
