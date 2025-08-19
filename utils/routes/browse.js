import { Router } from "express";
import db from "../db.js";
import { comment_schema } from "../validations.js";
import crypto from "crypto";
import dotenv from "dotenv";
import path from "path";
import { URL } from "node:url";

const __dirname = new URL(".", import.meta.url).pathname;
dotenv.config({ path: path.join(__dirname, "..", "..", "./env") });

const router = Router();

const testEnv = String(process.env.LOCAL_TEST) === "true";
const testUser = {
  _id: "36bf2765-73fc-40a2-a4e4-ef734359f162",
  username: "bernard",
  email: "lilmilk@gmail.com",
  bio: "",
  avatar: null,
};

const assetRoute = "https://" + process.env.ASSET_LOCATION + "/";

const handler = (io) => {
  router.post("/fetch", async (req, res) => {
    try {
      const constraints = req.body.constraints
        ? req.body.constraints
        : { includeUncensored: false };

      let aggregation = [
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
          $lookup: {
            as: "comments",
            from: "comments",
            let: { id: "$hrID" },
            pipeline: [
              {
                $match: {
                  $expr: { $eq: ["$postID", "$$id"] },
                },
              },
              {
                $sort: {
                  hrID: -1,
                },
              },
              {
                $lookup: {
                  from: "users",
                  localField: "userID",
                  foreignField: "_id",
                  as: "userInfo",
                },
              },
              {
                $unwind: {
                  path: "$userInfo",
                  preserveNullAndEmptyArrays: true,
                },
              },
              {
                $project: {
                  _id: 1,
                  postID: 1,
                  userID: 1,
                  timestamp: 1,
                  username: "$userInfo.username",
                  avatar: "$userInfo.avatar",
                  hrID: 1,
                  body: 1,
                  hidden: 1,
                  metadata: 1,
                },
              },
            ],
          },
        },
      ];

      const match = {
        $match: {},
      };

      if (constraints && Object.keys(constraints).length) {
        if (!constraints.includeUncensored)
          match.$match["metadata.uncensored"] = {
            $ne: true,
          };
        if (constraints.filters) {
          match.$match.type = {
            $in: [],
          };
          if (constraints.filters.music) match.$match.type.$in.push("music");
          if (constraints.filters.images) match.$match.type.$in.push("image");
          if (constraints.filters.games) match.$match.type.$in.push("game");
          if (constraints.filters.deepfake)
            match.$match.type.$in.push("deepfake");
        }
        if (constraints.dateRange?.start) {
          match.$match.timestamp = {
            $gte: new Date(constraints.dateRange?.start),
          };
        }
        if (constraints.dateRange?.end) {
          if (match.$match.timestamp)
            match.$match.timestamp = {
              ...match.$match.timestamp,
              $lte: new Date(constraints.dateRange?.end),
            };
          else
            match.$match.timestamp = {
              $lte: new Date(constraints.dateRange?.end),
            };
        }

        if (constraints.keywords) {
          match.$match.$or = [
            {
              prompt: new RegExp(constraints.keywords, "i"),
            },
            {
              "metadata.title": new RegExp(constraints.keywords, "i"),
            },
            {
              "metadata.style": new RegExp(constraints.keywords, "i"),
            },
            {
              "metadata.lyrics": new RegExp(constraints.keywords, "i"),
            },
          ];
        }
        if (Object.keys(match.$match).length) aggregation.push(match);
      }

      aggregation = aggregation.concat([
        {
          $sort: {
            timestamp: -1,
          },
        },
        {
          $skip: req.body.skip,
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
            avatar: "$user.avatar",
            comments: "$comments",
            prompt: 1,
            metadata: 1,
          },
        },
      ]);

      let posts = await db.collection("posts").aggregate(aggregation).toArray();
      posts = posts.map((post) => {
        if (post.avatar) post.avatar = assetRoute + post.avatar;
        if (post.comments?.length)
          post.comments = post.comments.map((comment) => {
            if (comment.avatar) comment.avatar = assetRoute + comment.avatar;
            return comment;
          });
        return post;
      });
      const count = await db.collection("posts").countDocuments(match.$match);
      const data = { posts, maxPages: Math.ceil(count / 49) };
      if (req.body.constraints) data.resultsFound = count;

      res.status(200).json(data);
    } catch (err) {
      console.log("init error", err);
      res.sendStatus(500);
    }
  });

  router.get("/by-user/:userID", async (req, res) => {
    try {
      let posts = await db
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
            $lookup: {
              as: "comments",
              from: "comments",
              let: { id: "$hrID" },
              pipeline: [
                {
                  $match: {
                    $expr: { $eq: ["$postID", "$$id"] },
                  },
                },
                {
                  $lookup: {
                    from: "users",
                    localField: "userID",
                    foreignField: "_id",
                    as: "userInfo",
                  },
                },
                {
                  $unwind: {
                    path: "$userInfo",
                    preserveNullAndEmptyArrays: true,
                  },
                },
                {
                  $project: {
                    _id: 1,
                    postID: 1,
                    userID: 1,
                    timestamp: 1,
                    username: "$userInfo.username",
                    avatar: "$userInfo.avatar",
                    hrID: 1,
                    body: 1,
                    hidden: 1,
                    metadata: 1,
                  },
                },
              ],
            },
          },
          {
            $match: {
              userID: Number(req.params.userID),
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
              avatar: "$user.avatar",
              comments: "$comments",
              prompt: 1,
              metadata: 1,
            },
          },
        ])
        .toArray();
      posts = posts.map((post) => {
        if (post.avatar) post.avatar = assetRoute + post.avatar;
        if (post.comments?.length)
          post.comments = post.comments.map((comment) => {
            if (comment.avatar) comment.avatar = assetRoute + comment.avatar;
            return comment;
          });
        return post;
      });
      res.status(200).json({ posts });
    } catch (err) {
      console.log("error", err);
      res.sendStatus(500);
    }
  });

  router.get("/post/:postID", async (req, res) => {
    try {
      let post = await db
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
            $lookup: {
              as: "comments",
              from: "comments",
              let: { id: "$hrID" },
              pipeline: [
                {
                  $match: {
                    $expr: { $eq: ["$postID", "$$id"] },
                  },
                },
                {
                  $sort: {
                    hrID: -1,
                  },
                },
                {
                  $lookup: {
                    from: "users",
                    localField: "userID",
                    foreignField: "_id",
                    as: "userInfo",
                  },
                },
                {
                  $unwind: {
                    path: "$userInfo",
                    preserveNullAndEmptyArrays: true,
                  },
                },
                {
                  $project: {
                    _id: 1,
                    postID: 1,
                    userID: 1,
                    timestamp: 1,
                    username: "$userInfo.username",
                    avatar: "$userInfo.avatar",
                    hrID: 1,
                    body: 1,
                    hidden: 1,
                    metadata: 1,
                  },
                },
              ],
            },
          },
          {
            $unwind: {
              path: "$user",
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $match: { hrID: Number(req.params.postID) },
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
              avatar: "$user.avatar",
              comments: "$comments",
              prompt: 1,
              metadata: 1,
            },
          },
        ])
        .toArray();
      if (!post?.length) {
        console.log("not found", req.params.postID);
        return res.sendStatus(404);
      }
      post = post[0];
      if (post.avatar) post.avatar = assetRoute + post.avatar;
      if (post.comments?.length)
        post.comments = post.comments.map((comment) => {
          if (comment.avatar) comment.avatar = assetRoute + comment.avatar;
          return comment;
        });

      res.status(200).json({ post });
    } catch (err) {
      console.log("fetch post error", err);
      res.sendStatus(500);
    }
  });

  router.post("/comment", async (req, res) => {
    try {
      const user = testEnv ? testUser : req.session?.user;
      comment_schema.validateSync(req.body);
      const { postID, text } = req.body;
      const hrIDs = await db.collection("hrIDs").findOneAndUpdate(
        {},
        {
          $inc: {
            comment: 1,
          },
        }
      );
      const comment = {
        _id: crypto.randomUUID(),
        postID,
        timestamp: new Date(),
        userID: user?._id,
        hrID: hrIDs.comment,
        body: text,
        hidden: false,
        metadata: {
          notes: "",
        },
      };
      await db.collection("comments").insertOne(comment);

      if (user) {
        comment.username = user.username;
        comment.avatar = user.avatar;
      }

      res.status(200).json({
        comment,
      });
    } catch (err) {
      console.log("/comment error", err);
      res.sendStatus(500);
    }
  });

  return router;
};

export default handler;
