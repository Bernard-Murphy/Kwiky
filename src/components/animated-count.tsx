import {
  motion,
  AnimatePresence,
  type TargetAndTransition,
} from "framer-motion";
import { transitions as t } from "@/lib/utils";
import { useEffect, useState } from "react";

export interface CountProps {
  count: number;
  max: number;
  fraction?: boolean;
}

export default function AnimatedCount({ count, fraction, max }: CountProps) {
  const [currentCount, setCurrentCount] = useState<number>(count);
  const [entrance, setEntrance] = useState<TargetAndTransition>({ opacity: 0 });
  const [exit, setExit] = useState<TargetAndTransition>({ opacity: 0 });

  useEffect(() => {
    if (fraction) {
      if (count > currentCount) {
        if (exit.y !== -10) {
          setExit({
            opacity: 0,
            y: -10,
          });
        } else setCurrentCount(count);
      } else if (count < currentCount) {
        if (exit.y !== 10) {
          setExit({
            opacity: 0,
            y: 10,
          });
        } else setCurrentCount(count);
      }
    } else {
      if (count > currentCount) {
        if (exit.y !== -10) {
          setExit({
            opacity: 0,
            y: -10,
          });
        } else {
          setCurrentCount(count);
        }
      } else if (count < currentCount) {
        if (exit.y !== 10) {
          setExit({
            opacity: 0,
            y: 10,
          });
        } else setCurrentCount(count);
      }
    }
  }, [count]);

  useEffect(() => {
    if (fraction) {
      if (count > currentCount) {
        if (entrance.y !== -10) {
          setEntrance({
            opacity: 0,
            y: -10,
          });
        } else setCurrentCount(count);
      } else if (count < currentCount) {
        if (entrance.y !== 10) {
          setEntrance({
            opacity: 0,
            y: 10,
          });
        } else setCurrentCount(count);
      }
    } else {
      if (count > currentCount) {
        if (entrance.y !== 10) {
          setEntrance({
            opacity: 0,
            y: 10,
          });
        } else setCurrentCount(count);
      } else if (count < currentCount) {
        if (entrance.y !== -10) {
          setEntrance({
            opacity: 0,
            y: -10,
          });
        } else setCurrentCount(count);
      }
    }
  }, [JSON.stringify(exit)]);

  useEffect(() => {
    setCurrentCount(count);
  }, [JSON.stringify(entrance)]);

  const split = String(fraction ? currentCount : max - currentCount).split("");

  return (
    <div className="flex overflow-hidden">
      {split.map((char, index) => {
        return (
          <AnimatePresence mode="wait" key={String(char) + String(index)}>
            <motion.div
              transition={{
                x: { duration: 0.13 },
                y: { duration: 0.13 },
                opacity: { duration: 0.08 },
                scale: { duration: 0.08 },
              }}
              key={String(char)}
              exit={exit}
              animate={t.normalize}
              initial={entrance}
              className={count > max ? "text-red-400" : ""}
            >
              {char}
            </motion.div>
          </AnimatePresence>
        );
      })}
      {fraction && (
        <>
          <div className="mx-2">/</div>
          <div>{max}</div>
        </>
      )}
    </div>
  );
}
