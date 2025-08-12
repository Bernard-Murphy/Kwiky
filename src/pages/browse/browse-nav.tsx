import { transitions as t } from "@/lib/utils";
import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AnimatedButton from "@/components/animated-button";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

export interface BrowseNavProps {
  animationDirection: "left" | "right" | undefined;
  setAnimationDirection: (direction: "left" | "right") => void;
  maxPages: number;
  currentPage: number;
  setPage: (page: number) => void;
}

export default function BrowseNav({
  animationDirection,
  setAnimationDirection,
  maxPages,
  currentPage,
  setPage,
}: BrowseNavProps) {
  useEffect(() => {
    if (animationDirection === "left") setPage(currentPage + 1);
    else if (animationDirection === "right") setPage(currentPage - 1);
  }, [animationDirection]);

  const goTo = (page: number) => {
    if (page > currentPage) {
      if (animationDirection === "left") setPage(currentPage + 1);
      else setAnimationDirection("left");
    } else {
      if (animationDirection === "right") setPage(currentPage - 1);
      else setAnimationDirection("right");
    }
  };

  return (
    <>
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
        className="pb-4 flex items-center justify-between container mx-auto"
      >
        <div className="w-1/3 flex items-center justify-center">
          <AnimatePresence mode="wait">
            {currentPage > 1 && (
              <motion.div
                transition={t.transition}
                exit={t.fade_out_scale_1}
                animate={t.normalize}
                initial={t.fade_out}
              >
                <AnimatedButton
                  onClick={() => goTo(currentPage - 1)}
                  variant="ghost"
                  className="block"
                >
                  <div className="flex items-center justify-center">
                    <ChevronLeftIcon className="block mr-2" />
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={String(currentPage)}
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
                        {currentPage - 1}
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
              key={String(currentPage)}
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
              Page {currentPage}
            </motion.h2>
          </AnimatePresence>
        </div>
        <div className="w-1/3 flex items-center justify-center">
          <AnimatePresence mode="wait">
            {maxPages > currentPage && (
              <motion.div
                transition={t.transition}
                exit={t.fade_out_scale_1}
                animate={t.normalize}
                initial={t.fade_out}
              >
                <AnimatedButton
                  onClick={() => goTo(currentPage + 1)}
                  variant="ghost"
                  className="block"
                >
                  <div className="flex items-center justify-center">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={String(currentPage)}
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
                        {currentPage + 1}
                      </motion.div>
                    </AnimatePresence>
                    <ChevronRightIcon className="block ml-2" />
                  </div>
                </AnimatedButton>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
      <hr className="mb-6 container mx-auto" />
    </>
  );
}
