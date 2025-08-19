import { transitions as t } from "@/lib/utils";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AnimatedButton from "@/components/animated-button";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export interface BrowseNavProps {
  animationDirection: "left" | "right" | undefined;
  setAnimationDirection: (direction: "left" | "right") => void;
  maxPages: number;
  currentPage: number;
  setPage: (page: number) => void;
  resultsFound: number;
}

export default function BrowseNav({
  animationDirection,
  setAnimationDirection,
  maxPages,
  currentPage,
  setPage,
  resultsFound,
}: BrowseNavProps) {
  const [navPage, setNavPage] = useState<number>(1);
  const [popoverOpen, setPopoverOpen] = useState<boolean>(false);

  const goTo = (page: number, e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (page > currentPage) {
      setAnimationDirection("left");
    } else {
      setAnimationDirection("right");
    }
    setPopoverOpen(false);
    setTimeout(() => setPage(page), 0);
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
          <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
            <PopoverTrigger>
              <AnimatedButton variant="custom" className="px-6 py-3 rounded-lg">
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
              </AnimatedButton>
            </PopoverTrigger>
            <PopoverContent className="bg-gray-900" side="top">
              <form
                onSubmit={(e: React.FormEvent) => {
                  goTo(navPage, e);
                }}
              >
                <div className="flex flex-col items-center p-2 text-white gap-y-4">
                  <label>Page:</label>
                  <input
                    type="number"
                    value={navPage}
                    onChange={(e) => setNavPage(Number(e.target.value))}
                    style={{
                      maxWidth: "50vw",
                    }}
                    min={1}
                    max={maxPages}
                    className="px-4 py-3 bg-black/20 border border-gray-600 rounded-lg focus:border-blue-500 focus:outline-none"
                  />
                  <AnimatedButton type="submit" variant="outline">
                    Go
                  </AnimatedButton>
                </div>
              </form>
            </PopoverContent>
          </Popover>
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
      {resultsFound ? (
        <p className="text-right opacity-75 mb-2">
          {resultsFound} results found
        </p>
      ) : (
        <></>
      )}
    </>
  );
}
