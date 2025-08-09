import { motion } from "framer-motion";
import { transitions as t } from "@/lib/utils";

interface PostProps {}

export default function Post({}: PostProps) {
  return (
    <motion.div
      transition={t.transition}
      exit={t.fade_out_scale_1}
      animate={t.normalize}
      initial={t.fade_out}
    >
      POST
    </motion.div>
  );
}
