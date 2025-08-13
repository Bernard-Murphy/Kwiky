import { transitions as t } from "@/lib/utils";
import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import AnimatedButton from "@/components/animated-button";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useApp } from "@/App";

let postId = 1;

export interface PostHeaderProps {
  animationDirection: "left" | "right" | undefined;
  setAnimationDirection: (direction: "left" | "right") => void;
}

export default function PostPage({
  animationDirection,
  setAnimationDirection,
}: PostHeaderProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { postCount } = useApp();
  postId = Number(location.pathname.split("/post/")[1]);

  useEffect(() => {
    if (animationDirection === "right") navigate(`/post/${postId + 1}`);
    else if (animationDirection === "left") navigate(`/post/${postId - 1}`);
  }, [animationDirection]);

  const goTo = (post: number) => {
    if (post > postId) {
      if (animationDirection === "right") navigate(`/post/${postId + 1}`);
      else setAnimationDirection("right");
    } else {
      if (animationDirection === "left") navigate(`/post/${postId - 1}`);
      else setAnimationDirection("left");
    }
  };

  return (
    <div className="pt-6 flex items-center justify-between container mx-auto">
      <div className="w-1/3 flex items-center justify-center">
        <AnimatePresence mode="wait">
          {postCount > postId && (
            <motion.div
              transition={t.transition}
              exit={t.fade_out_scale_1}
              animate={t.normalize}
              initial={t.fade_out}
            >
              <AnimatedButton
                onClick={() => goTo(postId + 1)}
                variant="ghost"
                className="block"
              >
                <div className="flex items-center justify-center">
                  <ChevronLeftIcon className="block mr-2" />
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={postId}
                      transition={t.transition}
                      exit={
                        animationDirection === "right"
                          ? t.fade_out_right
                          : animationDirection === "left"
                          ? t.fade_out_left
                          : t.fade_out
                      }
                      animate={t.normalize}
                      initial={
                        animationDirection === "right"
                          ? t.fade_out_left
                          : animationDirection === "left"
                          ? t.fade_out_right
                          : t.fade_out
                      }
                    >
                      {postId + 1}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </AnimatedButton>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className="w-1/3 flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.h2
            key={postId}
            transition={t.transition}
            exit={
              animationDirection === "right"
                ? t.fade_out_right
                : animationDirection === "left"
                ? t.fade_out_left
                : t.fade_out
            }
            animate={t.normalize}
            initial={
              animationDirection === "right"
                ? t.fade_out_left
                : animationDirection === "left"
                ? t.fade_out_right
                : t.fade_out
            }
            className="text-center text-2xl"
          >
            #{postId}
          </motion.h2>
        </AnimatePresence>
      </div>
      <div className="w-1/3 flex items-center justify-center">
        <AnimatePresence mode="wait">
          {postId > 1 && (
            <motion.div
              transition={t.transition}
              exit={t.fade_out_scale_1}
              animate={t.normalize}
              initial={t.fade_out}
            >
              <AnimatedButton
                onClick={() => goTo(postId - 1)}
                variant="ghost"
                className="block"
              >
                <div className="flex items-center justify-center">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={postId}
                      transition={t.transition}
                      exit={
                        animationDirection === "right"
                          ? t.fade_out_right
                          : animationDirection === "left"
                          ? t.fade_out_left
                          : t.fade_out
                      }
                      animate={t.normalize}
                      initial={
                        animationDirection === "right"
                          ? t.fade_out_left
                          : animationDirection === "left"
                          ? t.fade_out_right
                          : t.fade_out
                      }
                    >
                      {postId - 1}
                    </motion.div>
                  </AnimatePresence>
                  <ChevronRightIcon className="block ml-2" />
                </div>
              </AnimatedButton>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
