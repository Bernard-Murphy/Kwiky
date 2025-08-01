import { Router } from "express";
import db from "../db.js";
import m from "../methods.js";
import fs from "fs";
import crypto from "crypto";

const router = Router();

const handler = (io) => {
  router.post("/", async (req, res) => {
    try {
      const user = req.session?.user;
      if (!req.body.message || !req.files.audio || !req.files.image)
        return res.sendStatus(400);
      const socketID = req.body.socketID;

      io.to(socketID).emit("deepfake-status", "Processing Media");
      res.sendStatus(200);

      res.on("finish", async () => {
        try {
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
          await db.collection("posts").insertOne({
            _id: crypto.randomUUID(),
            type: "deepfake",
            hrID: hrIDs.post,
            userID: user?._id,
            link,
            timestamp: new Date(),
            userID: user?._id,
            prompt: req.body.message,
            metadata: {},
          });
          fs.unlinkSync(videoFile);
          io.to(socketID).emit(
            "deepfake-video-link",
            "https://" + process.env.ASSET_LOCATION + "/" + link
          );
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
