import music from "./sockets/music.js";
import games from "./sockets/games.js";
import images from "./sockets/images.js";

export default async function socketHandler(io, socket) {
  try {
    console.log("connection");
    music(io, socket);
    games(io, socket);
    images(io, socket);
  } catch (err) {
    console.log("socket error", err);
  }
}
