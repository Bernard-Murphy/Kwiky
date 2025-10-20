import { Router } from "express";
import db from "../db.js";
import crypto from "crypto";
import { URL } from "node:url";
import path from "path";
import fs from "fs";
import OpenAI from "openai";
import dotenv from "dotenv";

const __dirname = new URL(".", import.meta.url).pathname;
dotenv.config({ path: path.join(__dirname, "..", "..", ".env") });
const promptPath = path.join(__dirname, "..", "..", "prompt.json");

let chatSettings = {
  prompt: false,
  transforms: [],
};

if (fs.existsSync(promptPath))
  chatSettings = JSON.parse(fs.readFileSync(promptPath).toString());

const router = Router();

const handler = (io) => {
  router.get("/clear", async (req, res) => {
    try {
      const chatId = req.session.user?._id || req.session.chatId;
      await db.collection("virgilChad").deleteMany({
        $and: [
          {
            $or: [
              {
                from: chatId,
              },
              {
                to: chatId,
              },
            ],
          },
        ],
      });
      res.sendStatus(200);
    } catch (err) {
      console.log("/clear error", err);
      res.sendStatus(500);
    }
  });

  router.get("/init", async (req, res) => {
    try {
      // console.log(req.session.chatId);
      const chatId = req.session.user?._id || req.session.chatId;
      const messages = await db
        .collection("virgilChad")
        .find({
          $and: [
            {
              $or: [
                {
                  from: chatId,
                },
                {
                  to: chatId,
                },
              ],
            },
          ],
        })
        .toArray();
      res.status(200).json(messages);
    } catch (err) {
      console.log("/chat/init error", err);
      res.sendStatus(500);
    }
  });

  router.post("/ask", async (req, res) => {
    try {
      const chatId = req.session.user?._id || req.session.chatId;
      const message = req.body.message;

      const userMessage = {
        _id: crypto.randomBytes(8).toString("hex"),
        timestamp: new Date(),
        to: "ai",
        removed: false,
        message: message,
        from: chatId,
        decrypted: true,
      };

      const previousMessages = await db
        .collection("virgilChad")
        .find({
          $and: [
            {
              $or: [
                {
                  from: chatId,
                },
                {
                  to: chatId,
                },
              ],
            },
          ],
        })
        .sort({ timestamp: -1 })
        .limit(5)
        .toArray();

      const preReqs = [];
      if (req.body.uncensored) {
        preReqs.push({
          role: "system",
          content: chatSettings.prompt,
        });
      }

      previousMessages
        .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
        .forEach((message) =>
          preReqs.push({
            role: message.from === "ai" ? "assistant" : "user",
            content: message.message,
          })
        );

      let chatCompletion;
      const veniceClient = new OpenAI({
        apiKey: process.env.VENICE_KEY,
        baseURL: "https://api.venice.ai/api/v1",
      });
      chatCompletion = await veniceClient.chat.completions.create({
        model: "venice-uncensored",
        messages: [
          ...preReqs,
          {
            role: "user",
            content: message,
          },
        ],
        venice_parameters: {
          include_venice_system_prompt: false,
        },
      });
      if (typeof chatCompletion === "string")
        chatCompletion = JSON.parse(chatCompletion);
      const aiMessage = {
        _id: crypto.randomBytes(8).toString("hex"),
        timestamp: new Date(),
        to: chatId,
        removed: false,
        message: chatCompletion.choices[0].message.content,
        from: "ai",
        decrypted: true,
      };

      await db.collection("virgilChad").insertMany([userMessage, aiMessage]);
      res.status(200).json({
        text: aiMessage.message,
        isUser: false,
      });
    } catch (err) {
      console.log("/ask error", err);
      res.sendStatus(500);
    }
  });

  return router;
};

export default handler;
