import { Router } from "express";
import db from "../db.js";
import m from "../methods.js";
import crypto from "crypto";

const router = Router();

const handler = (io) => {
  router.post("/fetch", async (req, res) => {
    try {
      const constraints = req.body;
      console.log("constraints", constraints);
      const posts = await db
        .collection("posts")
        .find({})
        .sort({ timestamp: -1 })
        .limit(49)
        .toArray();

      res.status(200).json(posts);
    } catch (err) {
      console.log("init error", err);
      res.sendStatus(500);
    }
  });

  return router;
};

export default handler;
