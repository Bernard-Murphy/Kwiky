import { Router } from "express";
import deepfake from "./deepfake";

const router = Router();

export default function index(io) {
  router.use("/deepfake", deepfake(io));
}
