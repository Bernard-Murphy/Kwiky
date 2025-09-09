import { transitions as t } from "@/lib/utils";
import { motion } from "framer-motion";
import AnimatedButton from "@/components/animated-button";
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { type Post } from "../browse";
import { copyText } from "@/lib/methods";
import { Input } from "@/components/ui/input";
import CommentSection from "./comments";
import Info from "./info";

interface BodyProps {
  post: Post;
  setPost: (post: Post) => void;
  animationDirection: "left" | "right" | undefined;
}

export default function Body({ animationDirection, post, setPost }: BodyProps) {
  if (post?.metadata?.uncensored)
    return (
      <motion.h2
        transition={t.transition}
        exit={{
          opacity: 0,
        }}
        animate={t.normalize}
        initial={{
          opacity: 0,
        }}
        className="text-center mt-16 text-xl"
      >
        Uncensored results are currently disabled and will not be displayed
      </motion.h2>
    );

  let link: string = "";
  switch (post?.type) {
    case "deepfake":
      link =
        "https://" + process.env.REACT_APP_ASSET_LOCATION + "/" + post.link;
      const audioOnly = post?.metadata?.audioOnly;
      return (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-2 px-2">
          {audioOnly ? (
            <motion.div
              transition={t.transition}
              exit={{
                opacity: 0,
                x: animationDirection || window.innerWidth < 1024 ? 0 : -50,
              }}
              animate={t.normalize}
              initial={{
                opacity: 0,
                x: animationDirection || window.innerWidth < 1024 ? 0 : -50,
              }}
              className="col-span-4 lg:col-span-3 w-3/4 mx-auto"
              style={{ maxHeight: "66vh" }}
            >
              <div className="my-6">
                <audio className="w-full block mb-2" controls src={link} />
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
              </div>
            </motion.div>
          ) : (
            <motion.div
              transition={t.transition}
              exit={{
                opacity: 0,
                x: animationDirection || window.innerWidth < 1024 ? 0 : -50,
              }}
              animate={t.normalize}
              initial={{
                opacity: 0,
                x: animationDirection || window.innerWidth < 1024 ? 0 : -50,
              }}
              className="col-span-4 lg:col-span-3"
              style={{ maxHeight: "66vh" }}
            >
              <video
                controls
                src={link}
                className="my-2 block w-full h-full mx-auto"
              />
            </motion.div>
          )}

          <motion.div
            transition={t.transition}
            exit={{
              opacity: 0,
              x: animationDirection || window.innerWidth < 1024 ? 0 : 50,
            }}
            animate={t.normalize}
            initial={{
              opacity: 0,
              x: animationDirection || window.innerWidth < 1024 ? 0 : 50,
            }}
            className="col-span-4 lg:col-span-1 pt-5"
          >
            <Info post={post} />
            <p className="mt-5">{audioOnly ? "Audio" : "Video"} Link:</p>
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
            <CommentSection post={post} setPost={setPost} />
          </motion.div>
        </div>
      );
    case "game":
      link =
        "https://" + process.env.REACT_APP_ASSET_LOCATION + "/" + post.link;
      return (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-2 px-2 mt-6">
          <motion.div
            transition={t.transition}
            exit={{
              opacity: 0,
              x: animationDirection || window.innerWidth < 1024 ? 0 : -50,
            }}
            animate={t.normalize}
            initial={{
              opacity: 0,
              x: animationDirection || window.innerWidth < 1024 ? 0 : -50,
            }}
            className="col-span-4 lg:col-span-3"
            style={{ height: "66vh" }}
          >
            <embed className="w-full h-full" src={link} />
          </motion.div>
          <motion.div
            transition={t.transition}
            exit={{
              opacity: 0,
              x: animationDirection || window.innerWidth < 1024 ? 0 : 50,
            }}
            animate={t.normalize}
            initial={{
              opacity: 0,
              x: animationDirection || window.innerWidth < 1024 ? 0 : 50,
            }}
            className="col-span-4 lg:col-span-1 pt-5"
          >
            <Info post={post} />
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
            <CommentSection post={post} setPost={setPost} />
          </motion.div>
        </div>
      );
    case "music":
      const links = post?.links;
      if (!links?.length) return <></>;
      return (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-2 px-2 mt-6">
          <motion.div
            transition={t.transition}
            exit={{
              opacity: 0,
              x: animationDirection || window.innerWidth < 1024 ? 0 : -50,
            }}
            animate={t.normalize}
            initial={{
              opacity: 0,
              x: animationDirection || window.innerWidth < 1024 ? 0 : -50,
            }}
            className="col-span-4 lg:col-span-3 w-3/4 mx-auto"
            style={{ maxHeight: "66vh" }}
          >
            {links.map((link) => {
              const fullLink =
                "https://" + process.env.REACT_APP_ASSET_LOCATION + "/" + link;
              return (
                <div key={fullLink} className="my-6">
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
                </div>
              );
            })}
          </motion.div>

          <motion.div
            transition={t.transition}
            exit={{
              opacity: 0,
              x: animationDirection || window.innerWidth < 1024 ? 0 : 50,
            }}
            animate={t.normalize}
            initial={{
              opacity: 0,
              x: animationDirection || window.innerWidth < 1024 ? 0 : 50,
            }}
            className="col-span-4 lg:col-span-1 pt-5"
          >
            <Info post={post} />
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
            <CommentSection post={post} setPost={setPost} />
          </motion.div>
        </div>
      );
    case "image":
      link =
        "https://" + process.env.REACT_APP_ASSET_LOCATION + "/" + post.link;
      return (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-2 px-2">
          <motion.div
            transition={t.transition}
            exit={{
              opacity: 0,
              x: animationDirection || window.innerWidth < 1024 ? 0 : -50,
            }}
            animate={t.normalize}
            initial={{
              opacity: 0,
              x: animationDirection || window.innerWidth < 1024 ? 0 : -50,
            }}
            className="col-span-4 lg:col-span-3 mt-2"
          >
            <img
              src={link}
              className="block max-w-full mx-auto cursor-pointer"
              style={{ maxHeight: "66vh" }}
              onClick={() => window.open(link)}
            />
          </motion.div>

          <motion.div
            transition={t.transition}
            exit={{
              opacity: 0,
              x: animationDirection || window.innerWidth < 1024 ? 0 : 50,
            }}
            animate={t.normalize}
            initial={{
              opacity: 0,
              x: animationDirection || window.innerWidth < 1024 ? 0 : 50,
            }}
            className="col-span-4 lg:col-span-1 pt-5"
          >
            <Info post={post} />
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
            <CommentSection post={post} setPost={setPost} />
          </motion.div>
        </div>
      );
    default:
      console.log("oob post type", post);
      return <h2 className="text-3xl text-center mt-6">Not Found</h2>;
  }
}
