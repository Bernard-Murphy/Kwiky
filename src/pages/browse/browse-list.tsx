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
} from "lucide-react";
import { abbreviatedText } from "@/lib/utils";

export interface BrowseProps {
  posts: Post[];
}

export default function BrowseList({ posts }: BrowseProps) {
  console.log(posts);
  // 'deepfake', 'game', 'image', 'music'

  //   {
  //     "_id": "ab4f40a9-2529-402e-b580-f92f186b198b",
  //     "type": "deepfake",
  //     "hrID": 29,
  //     "userID": null,
  //     "link": "files/e78b46f4678e9466c037b74ed1c4ef64.mp4",
  //     "timestamp": "2025-08-08T09:57:05.608Z",
  //     "prompt": "Hello fans, I am a fat faggot with bitch tits who threatened to murder my own daughter",
  //     "metadata": {}
  // }

  const checkSpecial = (id: number) => {
    if (id === 1) return true;
    const split = String(id).split("");
    if (split.length === 1) return false;
    if (split.every((c) => c === split[0])) return true;
    if (split.length < 3) return false;
    let special = true;
    split.forEach((char, s) => {
      if (s && Number(char)) special = false;
    });
    return special;
  };

  return posts.map((post) => {
    switch (post.type) {
      case "deepfake":
        return (
          <Card className="bg-black/20 text-white">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div>
                  <CircleUserRound />
                </div>
                <div
                  className={
                    checkSpecial(post.hrID)
                      ? "text-yellow-300 opacity-flash"
                      : "text-white"
                  }
                >
                  {post.hrID}
                </div>
              </CardTitle>
              <CardDescription>
                {post.username ? "@" + post.username : "Anonymous"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>Card Content</p>
            </CardContent>
            <CardFooter>
              <p>Card Footer</p>
            </CardFooter>
          </Card>
        );
      case "game":
        return (
          <Card className="bg-black/20 text-white">
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
                  {post.hrID}
                </div>
              </CardTitle>
              <CardDescription>
                {post.username ? "@" + post.username : "Anonymous"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <h5 className="text-center font-bold">{post.metadata.title}</h5>
            </CardContent>
            <CardFooter>
              <p>{abbreviatedText(post.prompt || "")}</p>
            </CardFooter>
          </Card>
        );
      case "image":
        return (
          <Card className="bg-black/20 text-white">
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
                  {post.hrID}
                </div>
              </CardTitle>
              <CardDescription>
                {post.username ? "@" + post.username : "Anonymous"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <img
                className="block mx-auto w-1/2"
                src={
                  "https://" +
                  process.env.REACT_APP_ASSET_LOCATION +
                  "/thumbnails/" +
                  post.metadata.thumbnail
                }
              />
            </CardContent>
            <CardFooter>
              <p>{abbreviatedText(post.prompt || "")}</p>
            </CardFooter>
          </Card>
        );
      case "music":
        return (
          <Card className="bg-black/20 text-white">
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
                  {post.hrID}
                </div>
              </CardTitle>
              <CardDescription>
                {post.username ? "@" + post.username : "Anonymous"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>Card Content</p>
            </CardContent>
          </Card>
        );
      default:
        return (
          <Card className="bg-black/20 text-white">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div></div>
              </CardTitle>
              <CardDescription>Card Description</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Card Content</p>
            </CardContent>
            <CardFooter>
              <p>Card Footer</p>
            </CardFooter>
          </Card>
        );
    }
  });
}
