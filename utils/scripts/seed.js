import { MongoClient } from "mongodb";
import dotenv from "dotenv";
import { URL } from "node:url";
import path from "path";
import crypto from "crypto";

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

const main = async () => {
  try {
    await client.connect();
    console.log("connected");
    const nanaDB = client.db("nanaimg");
    const kwikyDB = client.db("kwiky");

    const audioWithManifesto = await nanaDB
      .collection("images")
      .aggregate([
        {
          $lookup: {
            from: "commentSections",
            localField: "commentSection",
            foreignField: "_id",
            as: "cs",
          },
        },
        {
          $unwind: "$cs",
        },
        {
          $match: {
            type: "audio",
            "cs.manifesto": {
              $ne: "",
            },
          },
        },
        {
          $sort: {
            image_id: 1,
          },
        },
        {
          $project: {
            _id: 1,
            image_id: 1,
            manifesto: "$cs.manifesto",
            type: 1,
            timestamp: 1,
            filename: 1,
          },
        },
      ])
      .toArray();
    console.log(audioWithManifesto.length);

    let postNumber = 1;
    for (let i = 0; i < audioWithManifesto.length; i++) {
      console.log(`${i + 1}/${audioWithManifesto.length}`);
      const post = audioWithManifesto[i];
      const links = ["/files/" + post.filename];
      const lyrics = post.manifesto;
      const newPost = {
        _id: crypto.randomUUID(),
        type: "music",
        hrID: postNumber,
        userID: null,
        link: "",
        links,
        timestamp: new Date(post.timestamp),
        prompt: "",
        metadata: {
          title: "Untitled",
          lyrics,
          style: "legacy",
          uncensored: true,
        },
      };
      await kwikyDB.collection("posts").insertOne(newPost);
      const newSearchBlob = {
        type: "music",
        hrID: String(postNumber),
        link: links.join(", "),
        username: "Anonymous",
        timestamp: new Date().toISOString(),
        prompt: "",
        metadata: String(lyrics || "") + " legacy",
      };
      await kwikyDB.collection("searchBlobs").insertOne(newSearchBlob);
      postNumber++;
    }
    await kwikyDB.collection("hrIDs").updateOne(
      {},
      {
        $set: {
          post: postNumber,
        },
      }
    );
  } catch (err) {
    console.log("main error", err);
  }
  client.close();
};

main();
