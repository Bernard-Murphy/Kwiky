import { type Post } from "../browse";
import { makeDateHR, getTimeHR } from "@/lib/methods";

interface InfoProps {
  post: Post;
}

export default function Info({ post }: InfoProps) {
  return (
    <>
      <div className="flex justify-between">
        <p>
          {post?.username ? (
            <div className="flex">
              <div className="w-10 h-10 rounded-full bg-gray-600 overflow-hidden hover:ring-2 hover:ring-blue-400 transition-all mr-2">
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
              <div className="text-blue-500 text-lg">@{post?.username}</div>
            </div>
          ) : (
            <div className="text-lg">Anonymous</div>
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
}
