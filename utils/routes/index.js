import { Router } from "express";
import deepfake from "./deepfake.js";
import chat from "./chat.js";

const router = Router();

const handler = (io) => {
  router.use("/deepfake", deepfake(io));
  router.use("/chat", chat(io));

  return router;
};

export default (io) => handler(io);
