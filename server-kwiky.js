import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import http from "http";
import fileUpload from "express-fileupload";
import session from "express-session";
import MongoDBStore from "connect-mongodb-session";
import { URL } from "node:url";
import fs from "fs";
import { Server as ioServer } from "socket.io";
import socketHandler from "./utils/socketHandler.js";
import { createAdapter } from "@socket.io/mongo-adapter";
import db from "./utils/db.js";
import routes from "./utils/routes/index.js";
import crypto from "crypto";

const __dirname = new URL(".", import.meta.url).pathname;

dotenv.config({ path: __dirname + "/.env" });

const mongoUrl =
  process.env.MONGO_URL ||
  "mongodb+srv://" +
    process.env.MONGO_USER +
    ":" +
    encodeURIComponent(process.env.MONGO_PASSWORD) +
    "@" +
    process.env.MONGO_HOST +
    "/?retryWrites=true&w=majority";

const port = process.env.SERVER_PORT || 4141;

const app = express();
const sessionStore = new MongoDBStore(session)({
  uri: mongoUrl,
  databaseName: process.env.DATABASE,
  collection: "sessions",
});
const sessionConfig = {
  name: "Kwiky",
  secret: process.env.COOKIE_SECRET,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 365,
    secure: false,
    httpOnly: false,
  },
  store: sessionStore,
  resave: true,
  saveUninitialized: false,
};
const sessionObj = session(sessionConfig);

app.use(sessionObj);
app.use(express.json());
app.use(cors());
app.use(fileUpload());
app.use((req, res, next) => {
  if (req.session && !req?.session.chatId)
    req.session.chatId = crypto.randomUUID();
  next();
});
app.use(express.static(__dirname + "/dist"));

const server = http.createServer(app);
const io = new ioServer(server, {
  cors: true,
});

const socketCollection = db.collection("sockets");

io.adapter(createAdapter(socketCollection));
const wrapSocketMiddleware = (middleware) => (socket, next) =>
  middleware(socket.request, {}, next);
io.use(wrapSocketMiddleware(sessionObj));
io.on("connection", (socket) => socketHandler(io, socket));

app.use("/", routes(io));

server.listen(port, async () => {
  try {
    if (!fs.existsSync("dist/games")) fs.mkdirSync("dist/games");
    if (!fs.existsSync("utils/sockets/temp"))
      fs.mkdirSync("utils/sockets/temp");
    if (!fs.existsSync("utils/routes/temp")) fs.mkdirSync("utils/routes/temp");
    const hrIDs = await db.collection("hrIDs").findOne({});
    if (!hrIDs)
      await db.collection("hrIDs").insertOne({
        _id: crypto.randomBytes(8).toString("hex"),
        user: 1,
        post: 1,
      });
    console.log("Kwiky running on port", port);
  } catch (err) {
    console.log("Main error", err);
  }
});
