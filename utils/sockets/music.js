import { OpenAI } from "openai";
import axios from "axios";
import allGenres from "../../lib/genres.js";
import allMoods from "../../lib/moods.js";
import { URL } from "node:url";
import fs from "fs";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import dotenv from "dotenv";
import crypto from "crypto";
import https from "https";
import path from "path";
import db from "../db.js";

const __dirname = new URL(".", import.meta.url).pathname;
dotenv.config({ path: path.join(__dirname, "..", "..", ".env") });
const promptPath = path.join(__dirname, "..", "..", "prompt.json");

let musicSettings = {
  prompt: false,
  transforms: [],
};

if (fs.existsSync(promptPath))
  musicSettings = JSON.parse(fs.readFileSync(promptPath).toString());

const s3 = new S3Client({
  endpoint: process.env.STORJ_ENDPOINT,
  credentials: {
    accessKeyId: process.env.STORJ_SECRET_ACCESS_ID,
    secretAccessKey: process.env.STORJ_SECRET_ACCESS_KEY,
  },
  region: process.env.REGION,
});

const randomElements = (arr) => {
  let numerator = 2;
  let denominator = 3;
  let toPick = 1;
  let finished = false;
  const elements = [];
  let clone = Array.from(arr);
  while (!finished && toPick < arr.length) {
    const random = Math.random();
    if (random < numerator / denominator) {
      toPick++;
      numerator++;
      denominator += 2;
    } else finished = true;
  }
  Array.from(Array(toPick).keys()).forEach(() => {
    const item = clone[Math.floor(Math.random() * clone.length)];
    elements.push(item);
    clone = clone.filter((i) => i !== item);
  });
  return elements;
};

const uploadToS3 = async (audioFile) => {
  try {
    const filePath = `${__dirname.includes("C:/") ? "." : __dirname}/temp/${
      audioFile.split("/")[audioFile.split("/").length - 1]
    }`;
    const audio = fs.readFileSync(filePath);
    const md5_audio = crypto.createHash("md5").update(audioFile).digest("hex");
    await s3.send(
      new PutObjectCommand({
        Body: audio,
        Bucket: process.env.STORJ_BUCKET,
        Key: "files/" + md5_audio + ".mp3",
        ACL: "public-read",
        ContentType: "audio/mp3",
      })
    );
    fs.unlinkSync(filePath);
    return `https://${process.env.ASSET_LOCATION}/files/${md5_audio}.mp3`;
  } catch (err) {
    console.log("upload to feed nana error", err);
    return "";
  }
};

const fetchAndWriteFile = (url) =>
  new Promise((resolve, reject) => {
    try {
      https.get(url, (res) => {
        try {
          const filename = `${
            __dirname.includes("C:/") ? "." : __dirname
          }/temp/${url.split("/")[url.split("/").length - 1]}`;

          if (res.statusCode !== 200) {
            return reject(res);
          }

          const fileWriter = fs
            .createWriteStream(
              `${__dirname.includes("C:/") ? "." : __dirname}/temp/${
                url.split("/")[url.split("/").length - 1]
              }`
            )
            .on("finish", () => resolve(filename))
            .on("error", reject);
          res.pipe(fileWriter);
        } catch (err) {
          console.log("fetchAndWriteFile error", err);
          reject(err);
        }
      });
    } catch (err) {
      console.log("fetchAndWriteFile error", err);
      reject(err);
    }
  });

const getMurekaJob = (trace_id) =>
  new Promise((resolve, reject) => {
    try {
      setTimeout(
        () =>
          axios
            .get("https://api.mureka.ai/v1/song/query/" + trace_id, {
              headers: {
                Authorization: `Bearer ${process.env.MUREKA_KEY}`,
              },
            })
            .then(async (res) => {
              try {
                switch (res.data.status) {
                  case "succeeded":
                    return resolve(res.data);
                  case "preparing":
                  case "running":
                    const murekaJob = await getMurekaJob(trace_id);
                    return resolve(murekaJob);
                  default:
                    console.log("oob mureka status", res.data);
                    return reject("");
                }
              } catch (err) {
                console.log("getMurekaJob error", err);
                reject(err);
              }
            })
            .catch((err) => {
              console.log("getMurekaJob error", err);
              reject(err);
            }),
        10000
      );
    } catch (err) {
      console.log("getMurekaJob error", err);
      reject(err);
    }
  });

const murekaQuery = (lyrics, musicStyle) =>
  new Promise((resolve, reject) => {
    try {
      let prompt = musicStyle;
      if (!prompt) {
        const genres = randomElements(allGenres);
        const moods = randomElements(allMoods);
        prompt = `${genres.join(", ")} ${moods.join(", ")}`;
      }

      const options = {
        headers: {
          Authorization: `Bearer ${process.env.MUREKA_KEY}`,
          "Content-Type": "application/json",
        },
      };
      const body = {
        lyrics,
        model: "auto",
        prompt,
      };
      axios
        .post("https://api.mureka.ai/v1/song/generate", body, options)
        .then(async (res) => {
          try {
            const job = await getMurekaJob(res.data.id);
            resolve(job);
          } catch (err) {
            console.log("murekaQuery error", err?.response?.data || err);
            reject(err);
          }
        })
        .catch((err) => {
          console.log("murekaQuery error", err?.response?.data || err);
          reject(err);
        });
    } catch (err) {
      console.log(err?.response?.data || err, "murekaQuery error");
      reject(err);
    }
  });

export default async function music(io, socket) {
  try {
    const user = socket.request.session?.user;
    socket.on(
      "music-new-song",
      async (musicPrompt, customLyrics, musicStyle, title, uncensoredMusic) => {
        try {
          if (!title) title = "Untitled";
          let lyrics = customLyrics;
          if (!lyrics) {
            const venicePrompt = `
          Write a funny poem that incorporates the following:
          ${musicPrompt}
  
          Make it 4 or more stanzas long. Respond with only the poem itself - do not include the title, author, description, commentary, or any other information.
          `;
            let chatCompletion;
            const veniceClient = new OpenAI({
              apiKey: process.env.VENICE_KEY,
              baseURL: "https://api.venice.ai/api/v1",
            });
            const messages = [];

            if (uncensoredMusic && musicSettings?.prompt)
              messages.push({
                role: "system",
                content: musicSettings.prompt,
              });
            messages.push({
              role: "user",
              content: venicePrompt,
            });
            chatCompletion = await veniceClient.chat.completions.create({
              model: "venice-uncensored",
              messages,
              venice_parameters: {
                include_venice_system_prompt: false,
              },
            });
            if (typeof chatCompletion === "string")
              chatCompletion = JSON.parse(chatCompletion);
            lyrics = chatCompletion.choices[0].message.content;
          }

          socket.emit("music-lyrics", lyrics);

          const originalLyrics = lyrics;

          if (musicSettings?.transforms) {
            Object.keys(musicSettings.transforms).forEach(
              (key) =>
                (lyrics = lyrics.replaceAll(
                  new RegExp(key, "gi"),
                  musicSettings.transforms[key]
                ))
            );
          }

          const songData = await murekaQuery(lyrics, musicStyle);

          const links = [];
          for (let c = 0; c < songData.choices.length; c++) {
            const song = songData.choices[c];
            try {
              const audioFile = await fetchAndWriteFile(song.url);

              const link = await uploadToS3(audioFile, originalLyrics);
              links.push(link);
              const hrIDs = await db.collection("hrIDs").findOneAndUpdate(
                {},
                {
                  $inc: {
                    post: 1,
                  },
                }
              );
              await db.collection("posts").insertOne({
                _id: crypto.randomUUID(),
                type: "music",
                hrID: hrIDs.post,
                userID: user?._id,
                link: link,
                timestamp: new Date(),
                userID: user?._id,
                prompt: musicPrompt,
                metadata: {
                  title,
                  lyrics: originalLyrics,
                  style: musicStyle,
                  uncensored: uncensoredMusic,
                },
              });
            } catch (err) {
              console.log("song error", err);
            }
          }
          socket.emit("music-links", links);
        } catch (err) {
          console.log("music-new-song error", err);
          socket.emit("music-error");
        }
      }
    );
  } catch (err) {
    console.log("music socket error", err);
    socket.emit("music-error");
  }
}
