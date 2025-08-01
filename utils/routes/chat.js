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
  router.post("/ask", async (req, res) => {
    try {
      const message = req.body.message;

      const userMessage = {
        _id: crypto.randomBytes(8).toString("hex"),
        timestamp: new Date(),
        to: "ai",
        removed: false,
        message: message,
        from: req.session.chatId,
        decrypted: true,
      };

      const previousMessages = await db
        .collection("virgilChad")
        .find({
          $and: [
            {
              $or: [
                {
                  from: req.session.chatId,
                },
                {
                  to: req.session.chatId,
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
        model: "dolphin-2.9.2-qwen2-72b",
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
        to: req.session.chatId,
        id: crypto.randomUUID(),
        removed: false,
        message: chatCompletion.choices[0].message.content,
        from: "ai",
        decrypted: true,
      };

      await db
        .collection("virgilChad")
        .insertMany([
          userMessage,
          { ...aiMessage, message: aiMessage.message },
        ]);
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
