import { transitions as t } from "@/lib/utils";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams } from "react-router-dom";
import axios from "axios";
import Spinner from "@/components/ui/spinner";
import { type Post } from "../browse";
import { toast } from "sonner";
import Body from "./body";

const api = process.env.REACT_APP_API;

export interface PostContentProps {
  animationDirection: "left" | "right" | undefined;
  setAnimationDirection: (option: "left" | "right" | undefined) => void;
}

export default function PostContent({
  animationDirection,
  setAnimationDirection,
}: PostContentProps) {
  const params = useParams();
  const [loading, setLoading] = useState<boolean>(true);
  const [post, setPost] = useState<Post | undefined>();
  const postId = Number(params.postId);

  const load = () =>
    axios
      .get(api + "/browse/post/" + postId)
      .then((res) => {
        setPost(res.data.post);
        setLoading(false);
      })
      .catch((err) => {
        console.log("load error", err);
        if (err?.response?.status === 404) {
          toast.error("Post not found", {
            position: "bottom-center",
            duration: 1500,
          });
          setLoading(false);
        } else setTimeout(load, 2000);
      });

  useEffect(() => {
    load();
    setAnimationDirection(undefined);
  }, []);

  return (
    <motion.div
      transition={t.transition}
      exit={
        animationDirection === "right"
          ? t.fade_out_right
          : animationDirection === "left"
          ? t.fade_out_left
          : t.fade_out_scale_1
      }
      animate={t.normalize}
      initial={
        animationDirection === "right"
          ? t.fade_out_left
          : animationDirection === "left"
          ? t.fade_out_right
          : t.fade_out_scale_1
      }
      className="flex-1"
    >
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            transition={{
              x: { duration: 0.2 },
              y: { duration: 0.2 },
              opacity: { duration: 0.12 },
              scale: { duration: 0.16 },
            }}
            exit={{
              opacity: 0,
              y: 30,
            }}
            animate={t.normalize}
            initial={{
              opacity: 0,
              y: 30,
            }}
            key="loading"
            className="flex items-center justify-center w-full h-full pt-10 overflow-hidden"
          >
            <Spinner size="lg" />
          </motion.div>
        ) : (
          location.pathname.includes("/post/") &&
          post && (
            <Body
              key={post.type}
              post={post}
              setPost={setPost}
              animationDirection={animationDirection}
            />
          )
        )}
      </AnimatePresence>
    </motion.div>
  );
}
