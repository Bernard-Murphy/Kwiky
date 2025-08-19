"use client";

import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useApp } from "@/App";
import { Dot } from "lucide-react";
import AnimatedButton from "./animated-button";
import Spinner from "./ui/spinner";
import axios from "axios";
import Toggler from "./ui/toggler";
import { transitions as t } from "@/lib/utils";

const api = process.env.REACT_APP_API;

export default function Navbar() {
  const location = useLocation();
  const {
    user,
    setUser,
    authWorking,
    setAuthWorking,
    showNavMenu,
    setShowNavMenu,
  } = useApp();

  const navigate = useNavigate();
  const [expanded, setExpanded] = useState<boolean>(false);

  useEffect(() => {
    setExpanded(false);
  }, [location.pathname]);

  const closeDropdown = () => {
    setShowNavMenu(false);
    window.removeEventListener("click", closeDropdown);
  };

  useEffect(() => {
    if (showNavMenu)
      setTimeout(() => window.addEventListener("click", closeDropdown), 0);
  }, [showNavMenu]);

  const handleLogout = () => {
    setAuthWorking(true);
    axios
      .get(api + "/auth/logout")
      .catch((err) => {
        console.log("logout error", err);
      })
      .finally(() => {
        setAuthWorking(false);
        setUser(null);
        setShowNavMenu(false);
        navigate("/");
      });
  };

  const handleProfileClick = () => {
    setShowNavMenu(false);
    navigate("/profile");
  };

  return (
    <nav className="bg-black/20 backdrop-blur-sm border-b border-white/10 px-6 py-4">
      <div
        className={`flex justify-between ${
          window.innerWidth > 547 ? "items-center" : ""
        }`}
      >
        <div style={{ alignSelf: "center" }}>
          {window.innerWidth <= 547 && (
            <AnimatedButton
              variant="custom"
              onClick={() => setExpanded(!expanded)}
              className="px-4 py-3 rounded-lg"
            >
              <Toggler open={expanded} />
            </AnimatedButton>
          )}

          <AnimatePresence mode="wait">
            {(expanded || window.innerWidth > 547) && (
              <motion.div
                transition={t.transition}
                exit={{ height: 0 }}
                animate={{ height: "auto" }}
                initial={{ height: 0 }}
                className="flex space-x-2 overflow-hidden nav-main-items"
              >
                <Link
                  to="/"
                  className={`text-lg font-medium  transition-colors duration-200`}
                >
                  <AnimatedButton
                    variant="custom"
                    className={`text-left px-4 py-3 rounded-lg cursor-pointer hover:bg-gray-700 disabled:bg-gray-500 hover:text-blue-400  ${
                      location.pathname === "/" ? "text-blue-400" : ""
                    }`}
                  >
                    Create
                  </AnimatedButton>
                </Link>
                <Link
                  to="/browse"
                  className={`text-lg font-medium  transition-colors duration-200`}
                >
                  <AnimatedButton
                    variant="custom"
                    className={`text-left px-4 py-3 rounded-lg cursor-pointer hover:bg-gray-700 disabled:bg-gray-500 hover:text-blue-400  ${
                      location.pathname === "/browse" ? "text-blue-400" : ""
                    }`}
                  >
                    Browse
                  </AnimatedButton>
                </Link>
                <Link
                  to="/chat"
                  className={`text-lg font-medium  transition-colors duration-200`}
                >
                  <AnimatedButton
                    variant="custom"
                    className={`text-left px-4 py-3 rounded-lg cursor-pointer hover:bg-gray-700 disabled:bg-gray-500 hover:text-blue-400  ${
                      location.pathname === "/chat" ? "text-blue-400" : ""
                    }`}
                  >
                    AI Chat
                  </AnimatedButton>
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div style={{ zIndex: 5000 }} className="relative">
          <AnimatePresence mode="wait">
            {authWorking ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                key="spinner"
                className="flex items-center justify-center"
              >
                <Spinner size="sm" />
              </motion.div>
            ) : (
              <>
                {user ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    key="user"
                  >
                    <AnimatedButton
                      variant="custom"
                      onClick={() => setShowNavMenu(!showNavMenu)}
                      className="w-10 h-10 rounded-full bg-gray-600 overflow-hidden hover:ring-2 hover:ring-blue-400 transition-all cursor-pointer"
                    >
                      {user.avatar ? (
                        <img
                          src={user.avatar || "/blank-avatar.png"}
                          alt="Avatar"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold">
                          {user.username.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </AnimatedButton>

                    <AnimatePresence mode="wait">
                      {showNavMenu && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg border border-gray-700 py-2"
                        >
                          <button
                            onClick={handleProfileClick}
                            className="w-full text-left px-4 py-2 hover:bg-gray-700 transition-colors cursor-pointer"
                          >
                            Profile
                          </button>
                          <button
                            onClick={handleLogout}
                            className="w-full text-left px-4 py-2 hover:bg-gray-700 transition-colors text-red-400 cursor-pointer"
                          >
                            Logout
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    key="options"
                    className="space-x-1"
                  >
                    <Link
                      to="/login"
                      className={`text-lg font-medium hover:text-blue-400 transition-colors ${
                        location.pathname === "/login" ? "text-blue-400" : ""
                      }`}
                    >
                      <AnimatedButton
                        className="text-left px-4 py-3 rounded-lg cursor-pointer hover:bg-gray-700 disabled:bg-gray-500 hover:text-blue-400"
                        variant="custom"
                      >
                        Login
                      </AnimatedButton>
                    </Link>

                    <span>
                      <Dot className="inline" />
                    </span>
                    <Link
                      className={`text-lg font-medium hover:text-blue-400 transition-colors ${
                        location.pathname === "/register" ? "text-blue-400" : ""
                      }`}
                      to="/register"
                    >
                      <AnimatedButton
                        className="text-left px-4 py-3 rounded-lg cursor-pointer hover:bg-gray-700 disabled:bg-gray-500 hover:text-blue-400"
                        variant="custom"
                      >
                        Register
                      </AnimatedButton>
                    </Link>
                  </motion.div>
                )}
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </nav>
  );
}
