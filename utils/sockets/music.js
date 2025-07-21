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

const __dirname = new URL(".", import.meta.url).pathname;
dotenv.config({ path: __dirname + "/.env" });
const promptPath = path.join(__dirname, "..", "..", "prompt.json");

let musicSettings = {
  prompt: false,
  transforms: [],
};

if (fs.existsSync(promptPath))
  musicSettings = JSON.parse(fs.readFileSync(promptPath).toString());

const normal = String(process.env.NORMAL) === "true";

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

const uploadToS3 = async (audioFile, lyrics) => {
  try {
    console.log(audioFile);
    console.log(
      `${__dirname.includes("C:/") ? "." : __dirname}/temp/${
        audioFile.split("/")[audioFile.split("/").length - 1]
      }`
    );
    const audio = fs.readFileSync(
      `${__dirname.includes("C:/") ? "." : __dirname}/temp/${
        audioFile.split("/")[audioFile.split("/").length - 1]
      }`
    );
    const md5_audio =
      crypto.createHash("md5").update(audioFile).digest("hex") +
      crypto.randomBytes(4).toString("hex");
    await s3.send(
      new PutObjectCommand({
        Body: audio,
        Bucket: process.env.STORJ_BUCKET,
        Key: "files/" + md5_audio + ".mp3",
        ACL: "public-read",
        ContentType: "audio/mp3",
      })
    );

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
          console.log("res", res.statusCode, filename);
          if (res.statusCode !== 200) {
            return reject(res);
          }
          console.log(
            `${__dirname.includes("C:/") ? "." : __dirname}/temp/${
              url.split("/")[url.split("/").length - 1]
            }`
          );
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
      console.log("https://api.mureka.ai/v1/song/query/" + trace_id);
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
            console.log("res", res.data);
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
      console.log("body", body);
    } catch (err) {
      console.log(err?.response?.data || err, "murekaQuery error");
      reject(err);
    }
  });

export default async function music(io, socket) {
  try {
    socket.on(
      "music-new-song",
      async (musicPrompt, customLyrics, musicStyle, uncensoredMusic) => {
        try {
          let lyrics = customLyrics;
          if (!lyrics) {
            const venicePrompt = `
          Write a funny${
            normal ? "" : ", racist, obscene, and offensive"
          } poem that incorporates the following:
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
              model: "dolphin-2.9.2-qwen2-72b",
              messages,
              venice_parameters: {
                include_venice_system_prompt: false,
              },
            });
            if (typeof chatCompletion === "string")
              chatCompletion = JSON.parse(chatCompletion);
            lyrics = chatCompletion.choices[0].message.content;
          }

          console.log(lyrics);
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
          console.log("after", lyrics);

          const songData = await murekaQuery(lyrics, musicStyle);

          const links = [];
          for (let c = 0; c < songData.choices.length; c++) {
            const song = songData.choices[c];
            console.log("song", song);
            try {
              const audioFile = await fetchAndWriteFile(song.url);
              console.log("audio", audioFile);

              const feednanaLink = await uploadToS3(audioFile, originalLyrics);
              console.log(feednanaLink);
              links.push(feednanaLink);
            } catch (err) {
              console.log("song error", err);
            }
          }
          socket.emit("music-links", links);
        } catch (err) {
          console.log("music-new-song error", err);
        }
      }
    );
  } catch (err) {
    console.log("music socket error", err);
  }
}
