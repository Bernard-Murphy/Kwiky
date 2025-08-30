import { type Comment, type Post } from "../browse";
import { useEffect, useState } from "react";
import { transitions as t } from "@/lib/utils";
import { checkSpecial, makeDateHR, getTimeHR } from "@/lib/methods";
import { motion, AnimatePresence } from "framer-motion";
import AnimatedCount from "@/components/animated-count";
import AnimatedButton from "@/components/animated-button";
import Spinner from "@/components/ui/spinner";
import { toast } from "sonner";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const maxCommentLength = 1000;

const api = process.env.REACT_APP_API;

export interface CommentsProps {
  post: Post;
  setPost: (post: Post) => void;
}

export default function CommentSection({ post, setPost }: CommentsProps) {
  const comments = post.comments;
  const postID = post.hrID;
  const [commentText, setCommentText] = useState<string>("");
  const [working, setWorking] = useState<boolean>(false);
  const [loaded, setLoaded] = useState<boolean>(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  const submit = () => {
    if (working) return;
    if (!commentText.length)
      return toast.error("Please enter a comment", {
        position: "bottom-center",
        duration: 2000,
      });
    if (commentText.length > maxCommentLength)
      return toast.error("Please enter a shorter comment", {
        position: "bottom-center",
        duration: 2000,
      });
    setWorking(true);
    const body = {
      postID,
      text: commentText,
    };
    axios
      .post(api + "/browse/comment", body)
      .then((res) => {
        setPost({
          ...post,
          comments: [res.data.comment as Comment, ...post.comments],
        });
      })
      .catch((err) => {
        console.log("error", err);
        toast.error("An error occurred. Please try again later.", {
          position: "bottom-center",
          duration: 2000,
        });
      })
      .finally(() => setWorking(false));
  };

  if (!post?.comments) return <></>;

  return (
    <div className="mt-5">
      <textarea
        value={commentText}
        onChange={(e) => setCommentText(e.target.value)}
        placeholder="Enter Comment..."
        className="w-full h-32 px-4 py-3 bg-black/20 border border-gray-600 rounded-lg focus:border-blue-500 focus:outline-none resize-none"
      />
      <div className="flex justify-between mt-2">
        <AnimatedCount
          count={commentText.length}
          max={maxCommentLength}
          fraction={true}
        />
        <AnimatedButton
          className="submit-button"
          disabled={working}
          onClick={submit}
        >
          <AnimatePresence mode="wait">
            <motion.div
              transition={t.transition}
              exit={t.fade_out_scale_1}
              animate={t.normalize}
              initial={t.fade_out}
              className="flex items-center"
              key={String(working)}
            >
              {working ? (
                <>
                  <Spinner size="sm" className="me-2" />
                  Working
                </>
              ) : (
                "Submit"
              )}
            </motion.div>
          </AnimatePresence>
        </AnimatedButton>
      </div>
      {comments.length ? (
        <>
          <hr className="my-4" />
          {comments.map((comment: Comment) => (
            <motion.div
              key={comment._id}
              transition={t.transition}
              exit={t.fade_out_scale_1}
              initial={{
                opacity: 0,
                height: loaded ? 0 : "auto",
                marginTop: loaded ? 0 : "calc(var(--spacing) * 2)",
              }}
              animate={{
                opacity: 1,
                height: "auto",
                marginTop: "calc(var(--spacing) * 2)",
              }}
              className="w-full overflow-y-hidden"
            >
              <Card className="bg-black/20 text-white w-full">
                <CardHeader>
                  <CardTitle className="flex justify-between">
                    {comment.username ? (
                      <div className="flex">
                        <div className="w-6 h-6 rounded-full bg-gray-600 overflow-hidden hover:ring-2 hover:ring-blue-400 transition-all mr-2">
                          {comment?.avatar ? (
                            <img
                              src={comment?.avatar || "/blank-avatar.png"}
                              alt="Avatar"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold">
                              {comment?.username.charAt(0).toUpperCase()}
                            </div>
                          )}
                        </div>
                        <div>@{comment?.username}</div>
                      </div>
                    ) : (
                      <div>Anonymous</div>
                    )}
                    <div>
                      <div
                        className={`text-right ${
                          checkSpecial(comment.hrID)
                            ? "text-yellow-300 opacity-flash"
                            : "text-white"
                        }`}
                      >
                        #{comment.hrID}
                      </div>
                      <div>
                        <div className="text-muted-foreground text-sm text-right">
                          {makeDateHR(comment.timestamp || "")}
                        </div>
                        <div className="text-muted-foreground text-sm text-right">
                          {getTimeHR(comment.timestamp || "")}
                        </div>
                      </div>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>{comment.body}</CardContent>
              </Card>
            </motion.div>
          ))}
        </>
      ) : (
        <></>
      )}
    </div>
  );
}
