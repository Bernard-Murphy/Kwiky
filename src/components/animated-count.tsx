import { motion, AnimatePresence } from "framer-motion";
import { transitions as t } from "@/lib/utils";

export interface CountProps {
  count: number;
  max: number;
}

export default function AnimatedCount({ count, max }: CountProps) {
  const split = String(count).split("");
  return (
    <div className="flex overflow-hidden">
      {split.map((char, index) => {
        return (
          <AnimatePresence mode="wait" key={String(index)}>
            <motion.div
              transition={{
                x: { duration: 0.13 },
                y: { duration: 0.13 },
                opacity: { duration: 0.08 },
                scale: { duration: 0.08 },
              }}
              key={String(char)}
              exit={{
                opacity: 0,
                y: -10,
              }}
              animate={t.normalize}
              initial={{
                opacity: 0,
                y: 10,
              }}
              className={count > max ? "text-red-400" : ""}
            >
              {char}
            </motion.div>
          </AnimatePresence>
        );
      })}
      <div className="mx-2">/</div>
      <div>{max}</div>
    </div>
  );
}
