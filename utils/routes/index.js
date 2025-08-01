import { Router } from "express";
import deepfake from "./deepfake.js";

const router = Router();

const handler = (io) => {
  router.use("/deepfake", deepfake(io));

  return router;
};

export default (io) => handler(io);
