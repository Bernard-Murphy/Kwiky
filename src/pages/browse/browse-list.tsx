import { type Post } from "../browse";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Music as MusicIcon,
  ImageIcon,
  Gamepad2,
  CircleUserRound,
  MessageCircle,
  Speech,
} from "lucide-react";
import {
  abbreviatedText,
  makeDateHR,
  getTimeHR,
  checkSpecial,
} from "@/lib/methods";
import AnimatedButton from "@/components/animated-button";
import { Link } from "react-router-dom";

export interface BrowseProps {
  posts: Post[];
}

export default function BrowseList({ posts }: BrowseProps) {
  console.log(posts);

  return posts.map((post) => {
    switch (post.type) {
      case "deepfake":
        const audioOnly = post?.metadata?.audioOnly;
        return (
          <Link to={"/post/" + post.hrID} className="block h-full w-full">
            <AnimatedButton
              type="button"
              variant="custom"
              className="p-0 px-0 py-0 hover:bg-gray-700 h-full w-full rounded-xl"
            >
              <Card className="bg-black/20 text-white h-full">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div>{audioOnly ? <Speech /> : <CircleUserRound />}</div>
                    <div
                      className={
                        checkSpecial(post.hrID)
                          ? "text-yellow-300 opacity-flash"
                          : "text-white"
                      }
                    >
                      #{post.hrID}
                    </div>
                  </CardTitle>
                  <CardDescription className="flex justify-between mt-2">
                    {post.username ? (
                      <div className="flex">
                        <div className="w-6 h-6 rounded-full bg-gray-600 overflow-hidden hover:ring-2 hover:ring-blue-400 transition-all mr-2">
                          {post?.avatar ? (
                            <img
                              src={post?.avatar || "/blank-avatar.png"}
                              alt="Avatar"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold">
                              {post?.username.charAt(0).toUpperCase()}
                            </div>
                          )}
                        </div>
                        <div>@{post?.username}</div>
                      </div>
                    ) : (
                      "Anonymous"
                    )}
                    <div>
                      <div className="text-muted-foreground text-sm text-right">
                        {makeDateHR(post.timestamp || "")}
                      </div>
                      <div className="text-muted-foreground text-sm text-right">
                        {getTimeHR(post.timestamp || "")}
                      </div>
                    </div>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {!post?.metadata?.audioOnly && (
                    <img
                      className="block mx-auto w-3/4"
                      src={
                        "https://" +
                        process.env.REACT_APP_ASSET_LOCATION +
                        "/thumbnails/" +
                        post.metadata.thumbnail
                      }
                    />
                  )}
                </CardContent>
                <CardFooter className="flex-1">
                  <div className="w-full h-full flex flex-col justify-between">
                    <p>{abbreviatedText(post.prompt || "")}</p>
                    <div className="flex justify-end space-x-2">
                      <MessageCircle />
                      <p className="text-bold">
                        {post.comments?.length || "0"}
                      </p>
                    </div>
                  </div>
                </CardFooter>
              </Card>
            </AnimatedButton>
          </Link>
        );
      case "game":
        return (
          <Link to={"/post/" + post.hrID} className="block h-full w-full">
            <AnimatedButton
              type="button"
              variant="custom"
              className="p-0 px-0 py-0 hover:bg-gray-700 h-full w-full rounded-xl"
            >
              <Card className="bg-black/20 text-white h-full">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div>
                      <Gamepad2 />
                    </div>
                    <div
                      className={
                        checkSpecial(post.hrID)
                          ? "text-yellow-300 opacity-flash"
                          : "text-white"
                      }
                    >
                      #{post.hrID}
                    </div>
                  </CardTitle>
                  <CardDescription className="flex justify-between mt-2">
                    {post.username ? (
                      <div className="flex">
                        <div className="w-6 h-6 rounded-full bg-gray-600 overflow-hidden hover:ring-2 hover:ring-blue-400 transition-all mr-2">
                          {post?.avatar ? (
                            <img
                              src={post?.avatar || "/blank-avatar.png"}
                              alt="Avatar"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold">
                              {post?.username.charAt(0).toUpperCase()}
                            </div>
                          )}
                        </div>
                        <div>@{post?.username}</div>
                      </div>
                    ) : (
                      "Anonymous"
                    )}
                    <div>
                      <div className="text-muted-foreground text-sm text-right">
                        {makeDateHR(post.timestamp || "")}
                      </div>
                      <div className="text-muted-foreground text-sm text-right">
                        {getTimeHR(post.timestamp || "")}
                      </div>
                    </div>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <h5 className="text-center font-bold">
                    {post.metadata.title}
                  </h5>
                </CardContent>
                <CardFooter className="flex-1">
                  <div className="w-full h-full flex flex-col justify-between">
                    <p>{abbreviatedText(post.prompt || "")}</p>
                    <div className="flex justify-end space-x-2">
                      <MessageCircle />
                      <p className="text-bold">
                        {post.comments?.length || "0"}
                      </p>
                    </div>
                  </div>
                </CardFooter>
              </Card>
            </AnimatedButton>
          </Link>
        );
      case "image":
        return (
          <Link to={"/post/" + post.hrID} className="block h-full w-full">
            <AnimatedButton
              type="button"
              variant="custom"
              className="p-0 px-0 py-0 hover:bg-gray-700 h-full w-full rounded-xl"
            >
              <Card className="bg-black/20 text-white h-full">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div>
                      <ImageIcon />
                    </div>
                    <div
                      className={
                        checkSpecial(post.hrID)
                          ? "text-yellow-300 opacity-flash"
                          : "text-white"
                      }
                    >
                      #{post.hrID}
                    </div>
                  </CardTitle>
                  <CardDescription className="flex justify-between mt-2">
                    {post.username ? (
                      <div className="flex">
                        <div className="w-6 h-6 rounded-full bg-gray-600 overflow-hidden hover:ring-2 hover:ring-blue-400 transition-all mr-2">
                          {post?.avatar ? (
                            <img
                              src={post?.avatar || "/blank-avatar.png"}
                              alt="Avatar"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold">
                              {post?.username.charAt(0).toUpperCase()}
                            </div>
                          )}
                        </div>
                        <div>@{post?.username}</div>
                      </div>
                    ) : (
                      "Anonymous"
                    )}
                    <div>
                      <div className="text-muted-foreground text-sm text-right">
                        {makeDateHR(post.timestamp || "")}
                      </div>
                      <div className="text-muted-foreground text-sm text-right">
                        {getTimeHR(post.timestamp || "")}
                      </div>
                    </div>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <img
                    className="block mx-auto w-3/4"
                    src={
                      "https://" +
                      process.env.REACT_APP_ASSET_LOCATION +
                      "/thumbnails/" +
                      post.metadata.thumbnail
                    }
                  />
                </CardContent>
                <CardFooter className="flex-1">
                  <div className="w-full h-full flex flex-col justify-between">
                    <p>{abbreviatedText(post.prompt || "")}</p>
                    <div className="flex justify-end space-x-2">
                      <MessageCircle />
                      <p className="text-bold">
                        {post.comments?.length || "0"}
                      </p>
                    </div>
                  </div>
                </CardFooter>
              </Card>
            </AnimatedButton>
          </Link>
        );
      case "music":
        return (
          <Link to={"/post/" + post.hrID} className="block h-full w-full">
            <AnimatedButton
              type="button"
              variant="custom"
              className="p-0 px-0 py-0 hover:bg-gray-700 h-full w-full rounded-xl"
            >
              <Card className="bg-black/20 text-white h-full">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div>
                      <MusicIcon />
                    </div>
                    <div
                      className={
                        checkSpecial(post.hrID)
                          ? "text-yellow-300 opacity-flash"
                          : "text-white"
                      }
                    >
                      #{post.hrID}
                    </div>
                  </CardTitle>
                  <CardDescription className="flex justify-between mt-2">
                    {post.username ? (
                      <div className="flex">
                        <div className="w-6 h-6 rounded-full bg-gray-600 overflow-hidden hover:ring-2 hover:ring-blue-400 transition-all mr-2">
                          {post?.avatar ? (
                            <img
                              src={post?.avatar || "/blank-avatar.png"}
                              alt="Avatar"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold">
                              {post?.username.charAt(0).toUpperCase()}
                            </div>
                          )}
                        </div>
                        <div>@{post?.username}</div>
                      </div>
                    ) : (
                      "Anonymous"
                    )}
                    <div>
                      <div className="text-muted-foreground text-sm text-right">
                        {makeDateHR(post.timestamp || "")}
                      </div>
                      <div className="text-muted-foreground text-sm text-right">
                        {getTimeHR(post.timestamp || "")}
                      </div>
                    </div>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <h5 className="text-center font-bold">
                    {post.metadata.title}
                  </h5>
                </CardContent>
                <CardFooter className="flex-1">
                  <div className="w-full h-full flex flex-col justify-between">
                    <p>{abbreviatedText(post.metadata.lyrics || "", 250)}</p>
                    <div className="flex justify-end space-x-2">
                      <MessageCircle />
                      <p className="text-bold">
                        {post.comments?.length || "0"}
                      </p>
                    </div>
                  </div>
                </CardFooter>
              </Card>
            </AnimatedButton>
          </Link>
        );
      default:
        console.log("oob post", post);
        return <></>;
    }
  });
}
