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
        .aggregate([
          {
            $lookup: {
              from: "users",
              localField: "userID",
              foreignField: "_id",
              as: "user",
            },
          },
          {
            $unwind: {
              path: "$user",
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $sort: {
              timestamp: -1,
            },
          },
          {
            $limit: 49,
          },
          {
            $project: {
              _id: 1,
              type: 1,
              hrID: 1,
              link: 1,
              links: 1,
              timestamp: 1,
              userID: 1,
              username: "$user.username",
              prompt: 1,
              metadata: 1,
            },
          },
        ])
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
