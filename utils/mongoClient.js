import { MongoClient } from "mongodb";
import dotenv from "dotenv";
import { URL } from "node:url";
import path from "path";

const __dirname = new URL(".", import.meta.url).pathname;
dotenv.config({ path: path.join(__dirname, "..", ".env") });

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

export default client;
