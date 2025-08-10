import { transitions as t } from "@/lib/utils";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams } from "react-router-dom";
import AnimatedButton from "@/components/animated-button";
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import axios from "axios";
import Spinner from "@/components/ui/spinner";
import { type Post } from "../browse";
import { toast } from "sonner";
import { copyText, makeDateHR, getTimeHR } from "@/lib/methods";
import { Input } from "@/components/ui/input";

const api = process.env.REACT_APP_API;

export interface PostContentProps {
  animationDirection: "left" | "right" | undefined;
}

export default function PostContent({ animationDirection }: PostContentProps) {
  const params = useParams();
  const [loading, setLoading] = useState<boolean>(true);
  const [post, setPost] = useState<Post | undefined>();
  const postId = Number(params.postId);
  console.log(post);

  const Info = () => {
    return (
      <>
        <div className="flex justify-between">
          <p>
            Posted by{" "}
            {post?.username ? (
              <span className="text-blue-500">@{post?.username}</span>
            ) : (
              "Anonymous"
            )}
          </p>
          <div>
            <div className="text-muted-foreground text-sm text-right">
              {makeDateHR(post?.timestamp || "")}
            </div>
            <div className="text-muted-foreground text-sm text-right">
              {getTimeHR(post?.timestamp || "")}
            </div>
          </div>
        </div>
        <hr className="mt-5" />
      </>
    );
  };

  const Body = () => {
    let link: string = "";
    switch (post?.type) {
      case "deepfake":
        link =
          "https://" + process.env.REACT_APP_ASSET_LOCATION + "/" + post.link;
        return (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-2 px-2">
            <div
              className="col-span-4 lg:col-span-3"
              style={{ maxHeight: "75vh" }}
            >
              <video controls src={link} className="mt-2 block w-full" />
            </div>

            <div className="col-span-4 lg:col-span-1 pt-5">
              <Info />
              <p className="mt-5">Video Link:</p>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger className="w-full my-1">
                    <AnimatedButton
                      variant="custom"
                      className="w-full px-0 py-0"
                      onClick={() => copyText(link)}
                    >
                      <Input
                        className="cursor-pointer"
                        value={link}
                        readOnly
                        type="text"
                      />
                    </AnimatedButton>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Click to Copy</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <p className="mt-5">Speech:</p>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger className="w-full">
                    <AnimatedButton
                      variant="custom"
                      className="w-full border rounded-md p-2 text-left"
                      onClick={() => copyText(post.prompt || "")}
                    >
                      {post.prompt || ""}
                    </AnimatedButton>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Click to Copy</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        );
      case "game":
        link =
          "https://" + process.env.REACT_APP_ASSET_LOCATION + "/" + post.link;
        return (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-2 px-2 mt-6">
            <div
              className="col-span-4 lg:col-span-3"
              style={{ height: "75vh" }}
            >
              <embed className="w-full h-full" src={link} />
            </div>
            <div className="col-span-4 lg:col-span-1 pt-5">
              <Info />
              <h5 className="mt-5">Link to Game:</h5>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger className="w-full mt-2">
                    <AnimatedButton
                      variant="custom"
                      className="w-full px-0 py-0"
                      onClick={() => copyText(link)}
                    >
                      <Input
                        className="cursor-pointer"
                        value={link}
                        readOnly
                        type="text"
                      />
                    </AnimatedButton>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Click to Copy</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <div className="w-full mt-5 border rounded-md p-2 text-left">
                <h5 className="text-center mb-2">
                  {post?.metadata?.title || "Untitled"}
                </h5>
                <hr className="mb-2" />
                {(post?.prompt || "").split("\n\n").map((stanza) => (
                  <div className="mb-2">
                    {stanza.split("\n").map((line) => (
                      <p>{line}</p>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case "music":
        const links = post?.links;
        if (!links?.length) return <></>;
        return (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-2 px-2 mt-6">
            <div
              className="col-span-4 lg:col-span-3 w-3/4 mx-auto"
              style={{ maxHeight: "75vh" }}
            >
              {links.map((link) => {
                const fullLink =
                  "https://" +
                  process.env.REACT_APP_ASSET_LOCATION +
                  "/" +
                  link;
                return (
                  <motion.div
                    transition={t.transition}
                    exit={t.fade_out_scale_1}
                    animate={t.normalize}
                    initial={t.fade_out}
                    key={fullLink}
                    className="my-6"
                  >
                    <audio
                      className="w-full block mb-2"
                      controls
                      src={fullLink}
                    />
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger className="w-full my-1">
                          <AnimatedButton
                            variant="custom"
                            className="w-full px-0 py-0"
                            onClick={() => copyText(fullLink)}
                          >
                            <Input
                              className="cursor-pointer"
                              value={fullLink}
                              readOnly
                              type="text"
                            />
                          </AnimatedButton>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Click to Copy</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </motion.div>
                );
              })}
            </div>

            <div className="col-span-4 lg:col-span-1 pt-5">
              <Info />
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger className="w-full mt-5">
                    <AnimatedButton
                      variant="custom"
                      className="w-full border rounded-md p-2 text-left"
                      onClick={() =>
                        copyText(
                          (post?.metadata?.title || "Untitled") +
                            "\n" +
                            post?.metadata?.lyrics
                        )
                      }
                    >
                      <h5 className="text-center mb-2">
                        {post?.metadata?.title || "Untitled"}
                      </h5>
                      <hr className="mb-2" />
                      {(post?.metadata?.lyrics || "")
                        .split("\n\n")
                        .map((stanza) => (
                          <div className="mb-2">
                            {stanza.split("\n").map((line) => (
                              <p>{line}</p>
                            ))}
                          </div>
                        ))}
                    </AnimatedButton>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Click to Copy</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        );
      case "image":
        link =
          "https://" + process.env.REACT_APP_ASSET_LOCATION + "/" + post.link;
        return (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-2 px-2">
            <div className="col-span-4 lg:col-span-3 mt-2">
              <img
                src={link}
                className="block max-w-full mx-auto"
                style={{ maxHeight: "75vh" }}
              />
            </div>

            <div className="col-span-4 lg:col-span-1 pt-5">
              <Info />
              <p className="my-5">
                Style:{" "}
                <span className="font-bold">{post?.metadata?.style || ""}</span>
              </p>
              <p>Image Link:</p>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger className="w-full my-1">
                    <AnimatedButton
                      variant="custom"
                      className="w-full px-0 py-0"
                      onClick={() => copyText(link)}
                    >
                      <Input
                        className="cursor-pointer"
                        value={link}
                        readOnly
                        type="text"
                      />
                    </AnimatedButton>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Click to Copy</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <p className="mt-5">Prompt:</p>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger className="w-full">
                    <AnimatedButton
                      variant="custom"
                      className="w-full border rounded-md p-2 text-left"
                      onClick={() => copyText(post.prompt || "")}
                    >
                      {post.prompt || ""}
                    </AnimatedButton>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Click to Copy</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        );
      default:
        console.log("oob post type", post);
        return <h2 className="text-3xl text-center mt-6">Not Found</h2>;
    }
  };

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
  }, []);

  return (
    <motion.div
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
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            transition={t.transition}
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
          <motion.div
            transition={t.transition}
            exit={t.fade_out_scale_1}
            animate={t.normalize}
            initial={t.fade_out}
            key="loaded"
          >
            <Body />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
