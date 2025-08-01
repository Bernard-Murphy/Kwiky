import { Router } from "express";
import db from "../db.js";
import m from "../methods.js";
import fs from "fs";
import crypto from "crypto";

const router = Router();

const handler = (io) => {
  router.post("/", async (req, res) => {
    try {
      console.log(req.files);
      console.log(req.body);
      if (!req.body.message || !req.files.audio || !req.files.image)
        return res.sendStatus(400);
      const socketID = req.body.socketID;

      io.to(socketID).emit("deepfake-status", "Processing Media");

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
          const audioKey = await m.writeToStorj(req.files.audio);
          console.log("imageKey", imageKey);
          console.log("audioKey", audioKey);

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
          const videoData = await m.dupdubGenerateVideo(
            `https://${process.env.ASSET_LOCATION}/${imageKey}`,
            `https://${process.env.ASSET_LOCATION}/${speechKey}`,
            facebox
          );
          io.to(socketID).emit("video-data", videoData);
        } catch (err) {
          console.log("An error occurred", err);
          io.to(socketID).emit("deepfake-status", "Errored");
        }
      });
    } catch (err) {
      console.log("new deepfake error", err);
      res.sendStatus(500);
    }
  });

  return router;
};

export default (io) => handler(io);
