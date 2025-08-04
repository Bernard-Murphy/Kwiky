import { Router } from "express";
import deepfake from "./deepfake.js";
import chat from "./chat.js";
import browse from "./browse.js";

const router = Router();

const handler = (io) => {
  router.use("/deepfake", deepfake(io));
  router.use("/chat", chat(io));
  router.use("/browse", browse(io));

  return router;
};

export default (io) => handler(io);
