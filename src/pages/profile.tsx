import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useApp } from "@/App";
import { transitions as t } from "@/lib/utils";
import AnimatedButton from "@/components/animated-button";
import { User, Palette } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Spinner from "@/components/ui/spinner";
import { type Post } from "./browse";
import BrowseList from "./browse/browse-list";

type ProfileTab = "userInfo" | "myContent";

const api = process.env.REACT_APP_API;

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<ProfileTab>("userInfo");
  const [loadingPosts, setLoadingPosts] = useState<boolean>(true);
  const [posts, setPosts] = useState<Post[]>([]);
  const { user } = useApp();

  const navigate = useNavigate();

  const loadPosts = () =>
    axios
      .get(api + "/browse/by-user/" + user!.hrID)
      .then((res) => {
        setPosts(res.data.posts);
        setLoadingPosts(false);
      })
      .catch((err) => {
        console.log("error loading posts", err);
        setTimeout(loadPosts, 2000);
      });

  useEffect(() => {
    if (user) loadPosts();
  }, []);

  useEffect(() => {
    if (!user) navigate("/");
  }, [user?.username]);

  return (
    <motion.div
      transition={t.transition}
      exit={t.fade_out_scale_1}
      animate={t.normalize}
      initial={t.fade_out}
      className="flex-1"
    >
      <AnimatePresence mode="wait">
        {user ? (
          <motion.div
            transition={t.transition}
            exit={t.fade_out_scale_1}
            animate={t.normalize}
            initial={t.fade_out_scale_1}
            className="container mx-auto px-6 py-8 profile-container"
            key="profile"
          >
            <div className="flex">
              {/* Left Sidebar - Tab Navigation */}
              <motion.div
                transition={{
                  x: { duration: 0.2 },
                  opacity: { duration: 0.14 },
                }}
                exit={{
                  opacity: 0,
                  x: -100,
                }}
                animate={t.normalize}
                initial={{
                  opacity: 0,
                  x: -100,
                }}
                className="w-64 mr-8 profile-menu"
              >
                <div className="space-y-2">
                  <AnimatedButton
                    onClick={() => setActiveTab("userInfo")}
                    variant="custom"
                    className={`flex items-center w-full text-left px-4 py-3 rounded-lg cursor-pointer ${
                      activeTab === "userInfo"
                        ? "bg-blue-600 text-white"
                        : "text-gray-300 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    <User className="w-5 h-5 mr-2 profile-item-icon" />
                    <span className="profile-menu-item-text">User Info</span>
                  </AnimatedButton>
                  <AnimatedButton
                    onClick={() => setActiveTab("myContent")}
                    variant="custom"
                    className={`flex items-center w-full text-left px-4 py-3 rounded-lg cursor-pointer ${
                      activeTab === "myContent"
                        ? "bg-blue-600 text-white"
                        : "text-gray-300 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    <Palette className="w-5 h-5 mr-2 profile-item-icon" />
                    <span className="profile-menu-item-text">My Content</span>
                  </AnimatedButton>
                </div>
              </motion.div>

              {/* Main Content */}
              <motion.div
                transition={{
                  x: { duration: 0.2 },
                  opacity: { duration: 0.14 },
                }}
                exit={{
                  opacity: 0,
                  x: 100,
                }}
                animate={t.normalize}
                initial={{
                  opacity: 0,
                  x: 100,
                }}
                className="flex-1 overflow-hidden"
              >
                <div>
                  <AnimatePresence mode="wait" initial={false}>
                    {activeTab === "userInfo" && (
                      <motion.div
                        transition={t.transition_fast}
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
                        <h2 className="text-2xl font-bold mb-6">
                          User Information
                        </h2>

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
                            <h3 className="text-xl font-semibold">
                              {user.username}
                            </h3>
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
                        className="profile-items-screen"
                      >
                        <AnimatePresence mode="wait">
                          {loadingPosts ? (
                            <motion.div
                              key="loading"
                              transition={t.transition}
                              exit={{
                                opacity: 0,
                                y: -30,
                              }}
                              animate={t.normalize}
                              initial={{
                                opacity: 0,
                                y: -30,
                              }}
                              className="flex w-full justify-center pt-5"
                            >
                              <Spinner size="lg" />
                            </motion.div>
                          ) : (
                            <motion.div
                              key="loaded"
                              transition={t.transition}
                              exit={t.fade_out_scale_1}
                              animate={t.normalize}
                              initial={t.fade_out_scale_1}
                            >
                              {posts.length ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 browse-list-container">
                                  <BrowseList posts={posts} />
                                </div>
                              ) : (
                                <h5 className="text-center mt-5 text-xl">
                                  No posts found
                                </h5>
                              )}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            transition={t.transition}
            exit={t.fade_out_scale_1}
            animate={t.normalize}
            initial={t.fade_out_scale_1}
          ></motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
