import { Router } from "express";
import db from "../db.js";
import {
  register_schema,
  login_schema,
  forgot_password_schema,
  set_password_schema,
} from "../validations.js";
import m from "../methods.js";
import bcrypt from "bcrypt";
import mg from "nodemailer-mailgun-transport";
import nodemailer from "nodemailer";
import crypto from "crypto";

const transporter = nodemailer.createTransport(
  mg({
    auth: {
      api_key: process.env.MAILGUN_KEY,
      domain: process.env.MAILGUN_DOMAIN,
    },
  })
);

const router = Router();

const handler = (io) => {
  router.get("/logout", (req, res) => {
    try {
      delete req.session.user;
      res.sendStatus(200);
    } catch (err) {
      console.log("logout error", err, req.session);
      res.sendStatus(500);
    }
  });

  router.post("/login", async (req, res) => {
    try {
      login_schema.validateSync(req.body);
      const user = await db.collection("users").findOne({
        $or: [
          {
            email: new RegExp(`^${req.body.username.trim()}$`, "i"),
          },
          {
            username: new RegExp(`^${req.body.username.trim()}$`, "i"),
          },
        ],
      });
      if (!user) return res.sendStatus(404);
      const check = await bcrypt.compareSync(req.body.password, user.password);
      if (!check) return res.sendStatus(401);
      const sessionUser = {
        _id: user._id,
        username: user.username,
        email: user.email,
        bio: user.bio,
        avatar: user.avatar,
        hrID: user.hrID,
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
      register_schema.validateSync(req.body);
      const check = await db.collection("users").findOne({
        $or: [
          {
            email: req.body.email.trim(),
          },
          {
            username: req.body.username.trim(),
          },
        ],
      });

      if (check) return res.sendStatus(409);
      const passHash = await bcrypt.hash(req.body.password1, 8);
      let avatar;
      if (
        req.files?.avatar &&
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
        username: req.body.username.trim(),
        password: passHash,
        email: req.body.email.trim(),
        bio: req.body.bio,
        hrID: hrIDs.user,
        creationDate: new Date(),
        avatar,
        disabled: false,
      };

      await db.collection("users").insertOne(newUser);
      req.session.user = {
        _id: newUser._id,
        username: newUser.username.trim(),
        email: newUser.email.trim(),
        bio: newUser.bio,
        avatar: newUser.avatar,
        hrID: newUser.hrID,
      };

      res.status(200).json({
        username: newUser.username.trim(),
        email: newUser.email.trim(),
        bio: newUser.bio,
        avatar: newUser.avatar,
        hrID: newUser.hrID,
      });
    } catch (err) {
      console.log("/register error", req.body, err);
      res.sendStatus(500);
    }
  });

  router.get("/init", async (req, res) => {
    try {
      const postCount = await db.collection("hrIDs").findOne({});
      res.status(200).json({
        user: req.session.user,
        postCount: postCount.post - 1,
      });
    } catch (err) {
      console.log("/auth/init error", err);
      res.sendStatus(500);
    }
  });

  router.post("/forgot-password", async (req, res) => {
    try {
      /**
       * Find user with supplied username and email
       * Validate the email
       */
      console.log("forgot password", req.body);
      forgot_password_schema.validateSync(req.body);
      const user = await db.collection("users").findOne({
        username: new RegExp(`^${req.body.username.trim()}$`, "i"),
        email: new RegExp(`^${req.body.email.trim()}$`, "i"),
      });
      console.log("user", user);
      // const captchaCheck = await h.verifyCaptcha(
      //   req.body.captchaKey,
      //   req.socket.remoteAddress
      // );
      if (user) {
        const id = crypto.randomUUID();
        const resetID = crypto.randomUUID();
        /**
         * If email is valid, send an email with a link to reset their password
         * Invalidate any other valid password reset requests
         * Create a new password reset request object and add it to the PasswordResets collection
         */
        await transporter.sendMail({
          from: `"Accounts - Kwiky" ${process.env.ACCOUNT_EMAIL}`,
          to: req.body.email.trim(),
          subject: "Reset your password",
          html: `
                        <p>Dear ${user.username},</p>
                        <p>You are receiving this email because we received a request to reset your password. Your reset link can be found here:</p>
                        <a href="${process.env.ROOT}/set-password/${resetID}">${process.env.ROOT}/set-password/${resetID}</a>
                        <p>If you did not make this request or wish to cancel, <a href="${process.env.ROOT}/cancel/${resetID}">click here</a></p>
                    `,
        });
        await db
          .collection("passwordResets")
          .updateMany({ userID: user._id }, { $set: { valid: false } });
        await db.collection("passwordResets").insertOne({
          _id: id,
          timestamp: new Date(),
          uuid: resetID,
          userID: user._id,
          valid: true,
          email: user.email.trim(),
        });
        res.sendStatus(200);
      } else res.sendStatus(404);
    } catch (err) {
      console.log(err);
      res.sendStatus(500);
    }
  });

  router.post("/set-password", async (req, res) => {
    try {
      console.log("set password", req.body);
      set_password_schema.validateSync(req.body);

      const request = await db.collection("passwordResets").findOne({
        uuid: req.body.resetId,
      });
      if (!request) return res.sendStatus(404);
      const passHash = await bcrypt.hash(req.body.password1, 8);
      await db.collection("passwordResets").updateOne(
        {
          _id: request._id,
        },
        {
          $set: {
            valid: false,
          },
        }
      );
      const newUserInfo = await db.collection("users").findOneAndUpdate(
        { _id: request.userID },
        {
          $set: {
            password: passHash,
          },
        }
      );
      req.session.user = {
        _id: newUserInfo._id,
        username: newUserInfo.username,
        email: newUserInfo.email,
        bio: newUserInfo.bio,
        avatar: newUserInfo.avatar,
        hrID: newUserInfo.hrID,
      };
      res.status(200).json({
        user: req.session.user,
      });
    } catch (err) {
      console.log(err);
      res.sendStatus(500);
    }
  });
  // set-password/b52c7c4e-a231-4e45-ac5f-5d43cf2ec567
  // set-password/b52c7c4e-a231-4e45-ac5f-5d43cf2ec567
  router.get("/cancel/:resetId", async (req, res) => {
    try {
      console.log("cancel-backl");
      const response = await db.collection("passwordResets").updateOne(
        {
          uuid: req.params.resetId,
        },
        {
          $set: {
            valid: false,
          },
        }
      );
      console.log("res", response);
      res.sendStatus(200);
    } catch (err) {
      console.log("cancel error", err);
      res.sendStatus(500);
    }
  });

  return router;
};

export default handler;
