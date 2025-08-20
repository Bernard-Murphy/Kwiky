"use client";

import {
  Routes,
  Route,
  useLocation,
  Navigate,
  useNavigate,
} from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useState, createContext, useContext, useEffect } from "react";
import Navbar from "./components/navbar";
import ThemeSelector from "./components/theme-selector";
import CreatePage from "./pages/create";
import RegisterPage from "./pages/register";
import LoginPage from "./pages/login";
import ForgotPasswordPage from "./pages/forgot-password";
import ResetPasswordPage from "./pages/reset-password";
import CancelPage from "./pages/cancel";
import BrowsePage, {
  type Post,
  type BrowseStatus,
  type BrowseConstraints,
  type ContentFlavor,
} from "./pages/browse";
import ChatPage from "./pages/chat";
import ProfilePage from "./pages/profile";
import Test from "./pages/test";
import { Toaster } from "./components/ui/sonner";
import { io, Socket } from "socket.io-client";
import { type ChatMessage } from "./pages/chat";
import axios from "axios";
import PostHeader from "./pages/post/header";
import PostContent from "./pages/post/content";
import { transitions as t } from "./lib/utils";

const socket: Socket = io(process.env.REACT_APP_API);

type Theme = "light" | "dark" | "red" | "blue" | "pink" | "green";

export type CreateTab = "music" | "images" | "games" | "deepfake";

export const themeClasses = {
  light: "bg-white text-gray-900",
  dark: "bg-gray-900 text-white",
  red: "bg-red-900 text-red-50",
  blue: "bg-blue-900 text-blue-50",
  pink: "bg-pink-900 text-pink-50",
  green: "bg-green-900 text-green-50",
};

interface User {
  username: string;
  email: string;
  bio?: string;
  avatar?: string;
  hrID: number;
}

interface AppContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  user: User | null;
  setUser: (user: User | null) => void;
  authWorking: boolean;
  setAuthWorking: (option: boolean) => void;
  postCount: number;
  showNavMenu: boolean;
  setShowNavMenu: (option: boolean) => void;
}

// const testUser = {
//   hrID: 1,
//   username: "bernard",
//   email: "lilmilk@gmail.com",
//   bio: "",
// };

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within AppProvider");
  }
  return context;
};

export default function App() {
  const navigate = useNavigate();
  const [theme, setTheme] = useState<Theme>("dark");
  const [createTab, setCreateTab] = useState<CreateTab>("music");
  const [showNavMenu, setShowNavMenu] = useState(false);

  const [authWorking, setAuthWorking] = useState<boolean>(true);
  const [user, setUser] = useState<User | null>(null);
  // const [user, setUser] = useState<User | null>(testUser);

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInitialized, setChatInitialized] = useState<boolean>(false);
  const [awaitingChatResponse, setAwaitingChatResponse] =
    useState<boolean>(false);

  const [browseItems, setBrowseItems] = useState<Post[]>([]);
  const [browseStatus, setBrowseStatus] = useState<BrowseStatus>("working");
  const [browsePage, setBrowsePage] = useState<number>(1);
  const [maxBrowsePages, setMaxBrowsePages] = useState<number>(1);
  const [browseFilters, setBrowseFilters] = useState<{
    [key in ContentFlavor]: boolean;
  }>({
    music: true,
    images: true,
    games: true,
    deepfake: true,
  });
  const [browseIncludeUncensored, setBrowseIncludeUncensored] =
    useState<boolean>(false);
  const [browseKeywords, setBrowseKeywords] = useState<string>("");
  const [browseDateRange, setBrowseDateRange] = useState<{
    start: Date | undefined;
    end: Date | undefined;
  }>({
    start: undefined,
    end: undefined,
  });
  const [browseResultsFound, setBrowseResultsFound] = useState<number>(0);

  const [postAnimationDirection, setPostAnimationDirection] = useState<
    "left" | "right" | undefined
  >();
  const [postCount, setPostCount] = useState<number>(0);

  const location = useLocation();

  useEffect(() => {
    socket.disconnect();
    socket.connect();
  }, [user?.username]);

  const chatInit = () =>
    axios
      .get(process.env.REACT_APP_API + "/chat/init")
      .then((res) => {
        setChatMessages(res.data);
      })
      .catch((err) => {
        console.log("error getting initial chats", err);
      })
      .finally(() => setChatInitialized(true));

  const browseQuery = (
    constraints?: BrowseConstraints,
    keepPrevious?: boolean
  ) => {
    axios
      .post(process.env.REACT_APP_API + "/browse/fetch", {
        constraints,
        skip: keepPrevious ? (browsePage - 1) * 49 : 0,
      })
      .then((res) => {
        setBrowseItems(
          keepPrevious
            ? browseItems.concat(
                res.data.posts.map((post: Post) => ({
                  ...post,
                  page: browsePage,
                }))
              )
            : res.data.posts.map((post: Post) => ({
                ...post,
                page: 1,
              }))
        );
        if (!keepPrevious) {
          setBrowsePage(1);
          setMaxBrowsePages(res.data.maxPages);
        }
        if (res.data.resultsFound) setBrowseResultsFound(res.data.resultsFound);
        setBrowseStatus("complete");
      })
      .catch((err) => {
        console.log("error getting initial browse items", err);
        setBrowseStatus("errored");
      });
    // .finally(() => navigate("/post/1805"));
  };

  const authInit = () => {
    axios
      .get(process.env.REACT_APP_API + "/auth/init")
      .then((res) => {
        setPostCount(res.data.postCount);
        if (res.data.user) {
          if (res.data.user.avatar)
            res.data.user.avatar =
              "https://" +
              process.env.REACT_APP_ASSET_LOCATION +
              "/" +
              res.data.user.avatar;
          setUser(res.data.user);
        }
      })
      .catch((err) => {
        console.log("authInit error", err);
      })
      .finally(() => setAuthWorking(false));
  };

  const browseReset = () => {
    setBrowseStatus("working");
    const constraints: BrowseConstraints = {
      filters: browseFilters,
      keywords: browseKeywords,
      dateRange: browseDateRange,
      includeUncensored: browseIncludeUncensored,
    };
    browseQuery(constraints);
  };

  useEffect(() => {
    socket.on("post-count", setPostCount);
    socket.on("new-post", (postID: string | number) => {
      navigate("/post/" + String(postID));
      browseReset();
    });
    authInit();
    chatInit();
    browseQuery();
  }, []);

  useEffect(() => {
    setPostAnimationDirection(undefined);
  }, [location.pathname.includes("/post/")]);

  return (
    <AppContext.Provider
      value={{
        theme,
        setTheme,
        user,
        setUser,
        authWorking,
        setAuthWorking,
        postCount,
        showNavMenu,
        setShowNavMenu,
      }}
    >
      <div
        className={`min-h-screen transition-colors duration-300 overflow-hidden flex flex-col ${themeClasses[theme]}`}
      >
        <Navbar />
        <AnimatePresence mode="wait">
          <motion.div
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
            key={String(location.pathname.includes("/post/"))}
          >
            {location.pathname.includes("/post/") && (
              <PostHeader
                animationDirection={postAnimationDirection}
                setAnimationDirection={setPostAnimationDirection}
              />
            )}
          </motion.div>
        </AnimatePresence>

        <AnimatePresence mode="wait">
          <Routes key={location.pathname} location={location}>
            <Route
              path="/"
              element={
                <CreatePage
                  socket={socket}
                  activeTab={createTab}
                  setActiveTab={setCreateTab}
                />
              }
            />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route
              path="/browse"
              element={
                <BrowsePage
                  browseItems={browseItems}
                  browseStatus={browseStatus}
                  setBrowseStatus={setBrowseStatus}
                  browseQuery={browseQuery}
                  browsePage={browsePage}
                  setBrowsePage={setBrowsePage}
                  maxBrowsePages={maxBrowsePages}
                  includeUncensored={browseIncludeUncensored}
                  setIncludeUncensored={setBrowseIncludeUncensored}
                  keywords={browseKeywords}
                  setKeywords={setBrowseKeywords}
                  filters={browseFilters}
                  setFilters={setBrowseFilters}
                  dateRange={browseDateRange}
                  setDateRange={setBrowseDateRange}
                  resultsFound={browseResultsFound}
                />
              }
            />
            <Route
              path="/set-password/:resetId"
              element={<ResetPasswordPage />}
            />
            <Route path="/cancel/:resetId" element={<CancelPage />} />
            <Route
              path="/post/:postId"
              element={
                <PostContent
                  animationDirection={postAnimationDirection}
                  setAnimationDirection={setPostAnimationDirection}
                />
              }
            />
            <Route path="/profile" element={<ProfilePage />} />
            <Route
              path="/chat"
              element={
                <ChatPage
                  chatMessages={chatMessages}
                  setChatMessages={setChatMessages}
                  awaitingChatResponse={awaitingChatResponse}
                  setAwaitingChatResponse={setAwaitingChatResponse}
                  chatInitialized={chatInitialized}
                />
              }
            />
            <Route path="/test" element={<Test socket={socket} />} />
            <Route path="*" element={<Navigate replace to="/" />} />
          </Routes>
        </AnimatePresence>
        <ThemeSelector createTab={createTab} />
        <div
          className={`py-2 px-2 flex-1 flex items-end  ${
            ["/register", "/browse"].includes(location.pathname) ||
            location.pathname.includes("/post/")
              ? "justify-end"
              : "justify-center"
          } text-xs opacity-75`}
        >
          Created by Bernard Murphy
        </div>
        <Toaster position="bottom-right" richColors />
      </div>
    </AppContext.Provider>
  );
}
