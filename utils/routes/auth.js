import { Router } from "express";
import db from "../db.js";
import { register_schema } from "../validations.js";
import m from "../methods.js";
import bcrypt from "bcrypt";

const router = Router();

const handler = (io) => {
  router.post("/login", async (req, res) => {
    try {
      console.log(req.body);
      const user = await db.collection("users").findOne({
        $or: [
          {
            email: req.body.username,
          },
          {
            username: req.body.username,
          },
        ],
      });
      if (!user) return res.sendStatus(404);
      const check = await bcrypt.compareSync(req.body.password, user.password);
      if (!check) return res.sendStatus(401);
      const sessionUser = {
        username: user.username,
        email: user.email,
        bio: user.bio,
        avatar: user.avatar,
      };
      req.session.user = sessionUser;
      res.status(200).json({
        user: sessionUser,
      });
    } catch (err) {
      console.log("/login error", err);
      res.sendStatus(500);
    }
  });

  router.post("/register", async (req, res) => {
    try {
      console.log("register", req.body);
      console.log(req.files);
      register_schema.validateSync(req.body);
      const check = await db.collection("users").findOne({
        $or: [
          {
            email: req.body.email,
          },
          {
            username: req.body.username,
          },
        ],
      });

      if (check) return res.sendStatus(409);
      const passHash = await bcrypt.hash(req.body.password1, 8);
      let avatar;
      if (
        req.files.avatar &&
        req.files.avatar.mimetype.split("/")[0] === "image"
      ) {
        avatar = await m.writeToStorj(req.files.avatar);
      }
      const hrIDs = await db.collection("hrIDs").findOneAndUpdate(
        {},
        {
          $inc: {
            user: 1,
          },
        }
      );

      const newUser = {
        _id: crypto.randomUUID(),
        username: req.body.username,
        password: passHash,
        email: req.body.email,
        bio: req.body.bio,
        hrID: hrIDs.user,
        creationDate: new Date(),
        avatar,
        disabled: false,
      };

      await db.collection("users").insertOne(newUser);
      req.session.user = {
        username: newUser.username,
        email: newUser.email,
        bio: newUser.bio,
        avatar: newUser.avatar,
      };

      res.status(200).json({
        username: newUser.username,
        email: newUser.email,
        bio: newUser.bio,
        avatar: newUser.avatar,
      });
    } catch (err) {
      console.log("/register error", req.body, err);
      res.sendStatus(500);
    }
  });

  router.get("/init", (req, res) => {
    try {
      console.log("auth init");
      res.status(200).json({
        user: req.session.user,
      });
    } catch (err) {
      console.log("/auth/init error", err);
      res.sendStatus(500);
    }
  });

  return router;
};

export default handler;
