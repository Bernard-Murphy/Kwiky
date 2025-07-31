import { Router } from "express";

const router = Router();

export default function deepfake(io) {
  router.post("/", async (req, res) => {
    try {
      console.log(req.files);
      const socketID = req.body.socketID;
      res.on("finish", async () => {
        try {
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
}
