import Groq from "groq-sdk";
import dotenv from "dotenv";
import mime from "mime-types";
import crypto from "crypto";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import db from "../db.js";
import { URL } from "node:url";
import path from "path";

const __dirname = new URL(".", import.meta.url).pathname;
dotenv.config({ path: path.join(__dirname, "..", "..", ".env") });

const testEnv = String(process.env.LOCAL_TEST) === "true";
const testUser = {
  _id: "36bf2765-73fc-40a2-a4e4-ef734359f162",
  username: "bernard",
  email: "lilmilk@gmail.com",
  bio: "",
  avatar: null,
};

const groqClient = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const s3 = new S3Client({
  endpoint: process.env.STORJ_ENDPOINT,
  credentials: {
    accessKeyId: process.env.STORJ_SECRET_ACCESS_ID,
    secretAccessKey: process.env.STORJ_SECRET_ACCESS_KEY,
  },
  region: process.env.REGION,
});

export default async function games(io, socket) {
  try {
    const user = testEnv ? testUser : socket.request.session?.user;
    socket.on("create-game", async (prompt, title) => {
      try {
        let chatCompletion = await groqClient.chat.completions.create({
          messages: [
            {
              role: "user",
              content: `Create a game using JavaScript, HTML, and CSS, described by the following:
              
              ${prompt}
              
              Return ONLY an array of JSON objects. Do not return anything else. Do not show your work or explain your line of thinking. The first key in each object, called "path", will be the path to the file, and the second key, called "content", will be the content of the file. If any graphics or sprites are required that cannot be represented using simple colors and shapes, use svg images.`,
            },
          ],
          model: "qwen/qwen3-32b",
        });
        if (typeof chatCompletion === "string")
          chatCompletion = JSON.parse(chatCompletion);
        let data = chatCompletion.choices[0].message.content;
        const json = JSON.parse(data.split("</think>")[1].trim());
        const gameID = crypto.randomUUID();
        for (let i = 0; i < json.length; i++) {
          const file = json[i];
          await s3.send(
            new PutObjectCommand({
              Body: file.content,
              Bucket: process.env.STORJ_BUCKET,
              Key: "files/" + gameID + "/" + file.path,
              ACL: "public-read",
              ContentType: mime.lookup(file.path),
            })
          );
        }
        const hrIDs = await db.collection("hrIDs").findOneAndUpdate(
          {},
          {
            $inc: {
              post: 1,
            },
          }
        );
        await db.collection("posts").insertOne({
          _id: gameID,
          hrID: hrIDs.post,
          link: `files/${gameID}/index.html`,
          type: "game",
          userID: user?.hrID,
          timestamp: new Date(),
          prompt,
          metadata: {
            title,
          },
        });
        io.emit("post-count", hrIDs.post);
        await db.collection("searchBlobs").insertOne({
          type: "game",
          hrID: hrIDs.post,
          link: `files/${gameID}/index.html`,
          username: user?.username || "Anonymous",
          timestamp: new Date().toISOString(),
          prompt: String(prompt || ""),
          metadata: String(title || ""),
        });
        socket.emit("new-post", hrIDs.post);
      } catch (err) {
        console.log("create-game error", err);
        socket.emit("games-error");
      }
    });
  } catch (err) {
    console.log("games socket error", err);
  }
}
