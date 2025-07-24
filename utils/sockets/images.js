import axios from "axios";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import dotenv from "dotenv";
import { URL } from "node:url";
import path from "path";
import crypto from "crypto";
import mongoClient from "../mongoClient.js";
import { OpenAI } from "openai";

const __dirname = new URL(".", import.meta.url).pathname;
dotenv.config({ path: path.join(__dirname, "..", "..", ".env") });

const s3 = new S3Client({
  endpoint: process.env.STORJ_ENDPOINT,
  credentials: {
    accessKeyId: process.env.STORJ_SECRET_ACCESS_ID,
    secretAccessKey: process.env.STORJ_SECRET_ACCESS_KEY,
  },
  region: process.env.REGION,
});

const veniceClient = new OpenAI({
  apiKey: process.env.VENICE_KEY,
  baseURL: "https://api.venice.ai/api/v1",
});

export default async function images(io, socket) {
  try {
    const user = socket.request.session?.user;
    socket.on("images-new", async (prompt, style, uncensored) => {
      try {
        let chatCompletion = await veniceClient.chat.completions.create({
          model: "venice-uncensored",
          messages: [
            {
              role: "user",
              content: `If the following prompt is requesting sexual content, respond with a single word: "yes". Otherwise, respond with "no". Prompt: ${prompt}`,
            },
          ],
          venice_parameters: {
            include_venice_system_prompt: false,
          },
        });
        if (typeof chatCompletion === "string")
          chatCompletion = JSON.parse(chatCompletion);
        const pornCheck = chatCompletion.choices[0].message.content;
        if (pornCheck.toLowerCase().includes("yes"))
          return socket.emit("images-porn");
        axios
          .post(
            "https://api.venice.ai/api/v1/image/generate",
            {
              model: uncensored ? "flux-dev-uncensored" : "flux-dev",
              prompt,
              cfg_scale: 19,
              embed_exif_metadata: false,
              format: "png",
              height: 1024,
              width: 1024,
              hide_watermark: true,
              safe_mode: !uncensored,
              style_preset: style,
            },
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + process.env.VENICE_KEY,
              },
            }
          )
          .then(async (res) => {
            const md5 = crypto
              .createHash("md5")
              .update(res.data.images[0])
              .digest("hex");
            await s3.send(
              new PutObjectCommand({
                Body: Buffer.from(res.data.images[0], "base64"),
                Bucket: process.env.STORJ_BUCKET,
                Key: "files/" + md5 + ".png",
                ACL: "public-read",
                ContentType: "image/png",
              })
            );
            await mongoClient
              .db("kwiky")
              .collection("posts")
              .insertOne({
                _id: crypto.randomUUID(),
                type: "image",
                userID: user?._id,
                link: `https://${process.env.ASSET_LOCATION}/files/${md5}.png`,
                timestamp: new Date(),
                userID: user?._id,
                prompt,
                metadata: {
                  style,
                  uncensored,
                },
              });
            socket.emit(
              "images-link",
              `https://${process.env.ASSET_LOCATION}/files/${md5}.png`
            );
          })
          .catch((err) => {
            console.log("error", err);
            socket.emit("images-error");
          });
      } catch (err) {
        console.log("images-new error", err);
        socket.emit("images-error");
      }
    });
  } catch (err) {
    console.log("images socket error", err);
    socket.emit("images-error");
  }
}
