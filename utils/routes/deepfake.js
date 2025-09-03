import { Router } from "express";
import db from "../db.js";
import m from "../methods.js";
import fs from "fs";
import crypto from "crypto";
import { URL } from "node:url";
import path from "path";
import dotenv from "dotenv";
import generateThumbnail from "../generateThumbnail.js";

const __dirname = new URL(".", import.meta.url).pathname;
dotenv.config({ path: path.join(__dirname, "..", "..", ".env") });

const router = Router();

const testEnv = String(process.env.LOCAL_TEST) === "true";
const testUser = {
  _id: "36bf2765-73fc-40a2-a4e4-ef734359f162",
  username: "bernard",
  email: "lilmilk@gmail.com",
  bio: "",
  avatar: null,
};

const badWords = [
  "nigger",
  "faggot",
  "fag",
  "bitch",
  "kike",
  "chink",
  "cunt",
  "spic",
  "gook",
];

const handler = (io) => {
  router.post("/", async (req, res) => {
    const socketID = req.body.socketID;
    try {
      const audioOnly = String(req.body.audioOnly) === "true";
      const user = testEnv ? testUser : req.session?.user;
      if (
        !req.body.message ||
        !req.files.audio ||
        (!audioOnly && !req.files.image)
      )
        return res.sendStatus(400);

      io.to(socketID).emit("deepfake-status", "Processing Media");
      res.sendStatus(200);

      res.on("finish", async () => {
        try {
          if (audioOnly) {
            io.to(socketID).emit("deepfake-status", "Generating Audio");
            const voiceId = await m.createElevenlabsVoice(req.files.audio);
            const audioPath = await m.generateElevenlabsSpeech(
              voiceId,
              req.body.message,
              req.files.audio.md5
            );
            const audioData = fs.readFileSync(audioPath);
            const speechData = {
              data: audioData,
              md5: crypto
                .createHash("md5")
                .update(Buffer.from(audioData))
                .digest("hex"),
              name: req.files.audio.name,
              mimetype: req.files.audio.mimetype,
            };
            const speechKey = await m.writeToStorj(speechData);

            const hrIDs = await db.collection("hrIDs").findOneAndUpdate(
              {},
              {
                $inc: {
                  post: 1,
                },
              }
            );
            let metadata = {
              audioOnly: true,
              uncensored: false,
            };
            badWords.forEach((word) => {
              if (String(req.body.message).toLowerCase().includes(word)) {
                metadata.uncensored = true;
              }
            });
            await db.collection("posts").insertOne({
              _id: crypto.randomUUID(),
              type: "deepfake",
              hrID: hrIDs.post,
              userID: user?.hrID,
              link: speechKey,
              timestamp: new Date(),
              prompt: req.body.message,
              metadata,
            });
            io.emit("post-count", hrIDs.post);
            await db.collection("searchBlobs").insertOne({
              type: "deepfake",
              hrID: String(hrIDs.post),
              link: String(speechKey || ""),
              username: user?.username || "Anonymous",
              timestamp: new Date().toISOString(),
              prompt: req.body.message || "",
              metadata: metadata.thumbnail,
            });
            io.to(socketID).emit("new-post", hrIDs.post);
            try {
              fs.unlinkSync(audioPath);
            } catch (err) {
              console.log("error deleting temp audio file", audioPath, err);
            }
          } else {
            /**
             * Write audio and image to storj
             * Elevenlabs create voice
             * Elevenlabs audio
             * Elevenlabs write to s3
             * Dupdub detect face
             * Dupdub create multi
             * Dupdub check status until done, return url
             * Write dupdub to s3
             */
            const imageKey = await m.writeToStorj(req.files.image);
            const thumbnail = await generateThumbnail(req.files.image);

            io.to(socketID).emit("deepfake-status", "Generating Audio");
            const voiceId = await m.createElevenlabsVoice(req.files.audio);
            const audioPath = await m.generateElevenlabsSpeech(
              voiceId,
              req.body.message,
              req.files.audio.md5
            );
            const audioData = fs.readFileSync(audioPath);
            const speechData = {
              data: audioData,
              md5: crypto
                .createHash("md5")
                .update(Buffer.from(audioData))
                .digest("hex"),
              name: req.files.audio.name,
              mimetype: req.files.audio.mimetype,
            };
            const speechKey = await m.writeToStorj(speechData);

            io.to(socketID).emit("deepfake-status", "Generating Video");
            const facebox = await m.dupdubDetectFace(
              `https://${process.env.ASSET_LOCATION}/${imageKey}`
            );
            const videoUrl = await m.dupdubGenerateVideo(
              `https://${process.env.ASSET_LOCATION}/${imageKey}`,
              `https://${process.env.ASSET_LOCATION}/${speechKey}`,
              facebox
            );
            const videoFile = await m.fetchAndWriteFile(videoUrl);
            const md5 = crypto
              .createHash("md5")
              .update(Buffer.from(videoUrl))
              .digest("hex");
            const videoData = {
              data: fs.readFileSync(videoFile),
              md5,
              name: md5 + ".mp4",
              mimetype: "video/mp4",
            };

            const link = await m.writeToStorj(videoData);
            const hrIDs = await db.collection("hrIDs").findOneAndUpdate(
              {},
              {
                $inc: {
                  post: 1,
                },
              }
            );
            const metadata = {
              thumbnail,
              uncensored: false,
            };
            badWords.forEach((word) => {
              if (String(req.body.message).toLowerCase().includes(word)) {
                metadata.uncensored = true;
              }
            });
            await db.collection("posts").insertOne({
              _id: crypto.randomUUID(),
              type: "deepfake",
              hrID: hrIDs.post,
              userID: user?.hrID,
              link,
              timestamp: new Date(),
              prompt: req.body.message,
              metadata,
            });
            io.emit("post-count", hrIDs.post);
            await db.collection("searchBlobs").insertOne({
              type: "deepfake",
              hrID: String(hrIDs.post),
              link: String(link || ""),
              username: user?.username || "Anonymous",
              timestamp: new Date().toISOString(),
              prompt: req.body.message || "",
              metadata: metadata.thumbnail,
            });
            try {
              fs.unlinkSync(audioPath);
            } catch (err) {
              console.log("error deleting temp audio file", audioPath, err);
            }
            try {
              fs.unlinkSync(videoFile);
            } catch (err) {
              console.log("error deleting temp video file", videoFile, err);
            }
            io.to(socketID).emit("new-post", hrIDs.post);
          }
        } catch (err) {
          console.log("An error occurred", err);
          io.to(socketID).emit("deepfake-status", "Errored");
        }
      });
    } catch (err) {
      console.log("new deepfake error", err);
      io.to(socketID).emit("deepfake-status", "Errored");
      res.sendStatus(500);
    }
  });

  return router;
};

export default handler;
