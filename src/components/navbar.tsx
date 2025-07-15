"use client";

import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useApp } from "../App";
import { Dot } from "lucide-react";

export default function Navbar() {
  const location = useLocation();
  const { user, setUser } = useApp();
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    setUser(null);
    setShowDropdown(false);
    navigate("/");
  };

  const handleProfileClick = () => {
    setShowDropdown(false);
    navigate("/profile");
  };

  return (
    <nav className="bg-black/20 backdrop-blur-sm border-b border-white/10 px-6 py-4">
      <div className="flex justify-between items-center">
        <div className="flex space-x-6">
          <Link
            to="/"
            className={`text-lg font-medium hover:text-blue-400 transition-colors ${
              location.pathname === "/" ? "text-blue-400" : ""
            }`}
          >
            Create
          </Link>
          <Link
            to="/browse"
            className={`text-lg font-medium hover:text-blue-400 transition-colors ${
              location.pathname === "/browse" ? "text-blue-400" : ""
            }`}
          >
            Browse
          </Link>
        </div>

        <div className="relative">
          {user ? (
            <div>
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="w-10 h-10 rounded-full bg-gray-600 overflow-hidden hover:ring-2 hover:ring-blue-400 transition-all cursor-pointer"
              >
                {user.avatar ? (
                  <img
                    src={user.avatar || "/placeholder.svg"}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                )}
              </button>

              <AnimatePresence>
                {showDropdown && (
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
            </div>
          ) : (
            <div className="space-x-1">
              <Link
                to="/login"
                className={`text-lg font-medium hover:text-blue-400 transition-colors ${
                  location.pathname === "/login" ? "text-blue-400" : ""
                }`}
              >
                Login
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
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
