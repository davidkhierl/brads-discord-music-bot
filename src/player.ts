import { Player } from "discord-music-player";
import client from "./client";

const player = new Player(client, {
  leaveOnEmpty: true,
});

export default player;
