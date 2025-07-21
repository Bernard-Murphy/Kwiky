"use client";

import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { useState, createContext, useContext } from "react";
import Navbar from "./components/navbar";
import ThemeSelector from "./components/theme-selector";
import CreatePage from "./pages/create";
import RegisterPage from "./pages/register";
import LoginPage from "./pages/login";
import ForgotPasswordPage from "./pages/forgot-password";
import BrowsePage from "./pages/browse";
import ChatPage from "./pages/chat";
import ProfilePage from "./pages/profile";
import Test from "./pages/test";
import { Toaster } from "./components/ui/sonner";
import { io, Socket } from "socket.io-client";

const socket: Socket = io(process.env.REACT_APP_API);

type Theme = "light" | "dark" | "red" | "blue" | "pink" | "green";

interface User {
  username: string;
  email: string;
  bio?: string;
  avatar?: string;
}

interface AppContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  user: User | null;
  setUser: (user: User | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within AppProvider");
  }
  return context;
};

export default function App() {
  const [theme, setTheme] = useState<Theme>("dark");
  const [user, setUser] = useState<User | null>(null);
  // const [user, setUser] = useState<User | null>({
  //   username: "",
  //   email: "",
  //   bio: "",
  //   avatar: "https://f.feednana.com/files/17876e5242334ad298034dd01dca8276.PNG",
  // });

  const location = useLocation();

  const themeClasses = {
    light: "bg-white text-gray-900",
    dark: "bg-gray-900 text-white",
    red: "bg-red-900 text-red-50",
    blue: "bg-blue-900 text-blue-50",
    pink: "bg-pink-900 text-pink-50",
    green: "bg-green-900 text-green-50",
  };

  return (
    <AppContext.Provider value={{ theme, setTheme, user, setUser }}>
      <div
        className={`min-h-screen transition-colors duration-300 ${themeClasses[theme]}`}
      >
        <Navbar />
        <AnimatePresence mode="wait">
          <Routes key={location.pathname} location={location}>
            <Route path="/" element={<CreatePage socket={socket} />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/browse" element={<BrowsePage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/chat" element={<ChatPage />} />
            <Route path="/test" element={<Test />} />
            <Route path="*" element={<Navigate replace to="/" />} />
          </Routes>
        </AnimatePresence>
        <ThemeSelector />
        <div
          className={`fixed bottom-4 ${
            location.pathname !== "/register"
              ? "left-0 text-center right-0"
              : "right-5"
          }  text-xs opacity-75`}
        >
          Created by Bernard Murphy
        </div>
        <Toaster position="bottom-right" richColors />
      </div>
    </AppContext.Provider>
  );
}
