import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import dotenv from "dotenv";
import path from "path";
import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";
import { Readable } from "stream";
import fs from "fs";
import axios from "axios";
import https from "https";

const __dirname = new URL(".", import.meta.url).pathname;
dotenv.config({ path: path.join(__dirname, "..", "..", ".env") });

const elevenlabs = new ElevenLabsClient({
  apiKey: process.env.ELEVENLABS_KEY, // Defaults to process.env.ELEVENLABS_API_KEY
});

const s3 = new S3Client({
  endpoint: process.env.STORJ_ENDPOINT,
  credentials: {
    accessKeyId: process.env.STORJ_SECRET_ACCESS_ID,
    secretAccessKey: process.env.STORJ_SECRET_ACCESS_KEY,
  },
  region: process.env.REGION,
});

const dupdubOptions = {
  headers: {
    "Content-Type": "application/json",
    dupdub_token: process.env.DUPDUB_KEY,
  },
};

const m = {};

m.writeToStorj = (file) =>
  new Promise(async (resolve, reject) => {
    try {
      const Key = "files/" + file.md5 + path.extname(file.name);
      await s3.send(
        new PutObjectCommand({
          Body: file.data,
          Bucket: process.env.STORJ_BUCKET,
          Key,
          ACL: "public-read",
          ContentType: file.mimetype,
        })
      );
      return resolve(Key);
    } catch (err) {
      console.log("writeToStorj error", err);
      reject(err);
    }
  });

m.createElevenlabsVoice = (audioFile) =>
  new Promise(async (resolve, reject) => {
    try {
      const createResult = await elevenlabs.voices.ivc.create({
        name: audioFile.md5,
        files: [audioFile.data],
      });
      return resolve(createResult.voiceId);
    } catch (err) {
      console.log("createElevenlabsVoice error", err);
      reject(err);
    }
  });

m.generateElevenlabsSpeech = (voiceId, text, filename) =>
  new Promise(async (resolve, reject) => {
    try {
      const audioData = await elevenlabs.textToSpeech.convert(voiceId, {
        text,
        outputFormat: "mp3_44100_128",
      });
      const filePath = __dirname + "/sockets/temp/" + filename;
      const readableStream = Readable.from(audioData);
      readableStream.pipe(fs.createWriteStream(filePath));

      readableStream.on("end", () => resolve(filePath));
      readableStream.on("error", () => {
        console.log("Error writing generated speech file", err);
        reject(err);
      });
    } catch (err) {
      console.log("generateElevenlabsSpeech error", err);
      reject();
    }
  });

m.dupdubDetectFace = (imageLocation) =>
  new Promise(async (resolve, reject) => {
    try {
      const detectBody = {
        photoUrl: imageLocation,
      };
      const detected = await axios.post(
        "https://moyin-gateway.dupdub.com/tts/v1/photoProject/detectAvatar",
        detectBody,
        dupdubOptions
      );
      return resolve(detected.data.data.boxes[0]);
    } catch (err) {
      console.log("dupdubDetectFace error", err);
      reject(err);
    }
  });

m.dupdubCheckStatus = (projectID) =>
  new Promise(async (resolve, reject) => {
    try {
      const status = await axios.get(
        "https://moyin-gateway.dupdub.com/tts/v1/photoProject/" + projectID,
        dupdubOptions
      );
      console.log("status", status);
      if (!status.data?.data?.videoUrl)
        setTimeout(async () => {
          try {
            const status = await m.dupdubCheckStatus(projectID);
            resolve(status);
          } catch (err) {
            console.log("dupdubCheckStatus timeout error", err);
            reject(err);
          }
        }, 2000);
      else resolve(status.data?.data?.videoUrl);
    } catch (err) {
      console.log("dupdubCheckStatus error", err);
      reject(err);
    }
  });

m.dupdubGenerateVideo = (photoUrl, audioUrl, box) =>
  new Promise(async (resolve, reject) => {
    try {
      const avatarBody = {
        photoUrl,
        info: [
          {
            audioUrl,
            box,
          },
        ],
        watermark: 0,
        useSr: false,
      };
      const avatar = await axios.post(
        "https://moyin-gateway.dupdub.com/tts/v1/photoProject/createMulti",
        avatarBody,
        dupdubOptions
      );
      const projectID = avatar.data.data.id;
      const videoUrl = await m.dupdubCheckStatus(projectID);
      return resolve(videoUrl);
    } catch (err) {
      console.log("dupdubGenerateVideo error", err);
      return reject(err);
    }
  });

m.fetchAndWriteFile = (url) =>
  new Promise((resolve, reject) => {
    try {
      https.get(url, (res) => {
        try {
          const filename = `${
            __dirname.includes("C:/") ? "." : __dirname
          }/routes/temp/${url.split("/")[url.split("/").length - 1]}`;

          if (res.statusCode !== 200) {
            return reject(res);
          }

          const fileWriter = fs
            .createWriteStream(
              `${__dirname.includes("C:/") ? "." : __dirname}/routes/temp/${
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

export default m;
