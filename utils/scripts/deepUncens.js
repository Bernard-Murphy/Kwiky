import { MongoClient } from "mongodb";
import dotenv from "dotenv";
import { URL } from "node:url";
import path from "path";

const __dirname = new URL(".", import.meta.url).pathname;
dotenv.config({ path: path.join(__dirname, "..", "..", ".env") });

const mongoUrl =
  process.env.MONGO_URL ||
  "mongodb+srv://" +
    process.env.MONGO_USER +
    ":" +
    encodeURIComponent(process.env.MONGO_PASSWORD) +
    "@" +
    process.env.MONGO_HOST +
    "/?retryWrites=true&w=majority";

const client = new MongoClient(mongoUrl);

const badWords = [
  "nigger",
  "faggot",
  "fag",
  "bitch",
  "kike",
  "chink",
  "cunt",
  "spic",
  "gook",
];

const main = async () => {
  try {
    await client.connect();
    console.log("connected");
    const db = client.db("kwiky");
    const deepfakes = await db
      .collection("posts")
      .find({ type: "deepfake" })
      .toArray();
    for (const i in deepfakes) {
      const deepfake = deepfakes[i];
      let uncensored = false;
      badWords.forEach((word) => {
        if (deepfake.prompt.toLowerCase().includes(word)) {
          uncensored = true;
        }
      });
      await db.collection("posts").updateOne(
        {
          _id: deepfake._id,
        },
        {
          $set: {
            "metadata.uncensored": uncensored,
          },
        }
      );
    }
  } catch (err) {
    console.log("main error", err);
  }
  client.close();
};

main();
