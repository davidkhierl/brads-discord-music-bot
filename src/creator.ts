import { SlashCreator } from "slash-create";

const creator = new SlashCreator({
  applicationID: process.env.DISCORD_CLIENT_ID,
  publicKey: process.env.DISCORD_CLIENT_PUBKEY,
  token: process.env.DISCORD_CLIENT_TOKEN,
});

export default creator;
