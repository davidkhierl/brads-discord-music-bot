import { CommandContext, SlashCommand, SlashCreator } from "slash-create";

import client from "../client";
import player from "../player";

class stop extends SlashCommand {
  constructor(creator: SlashCreator) {
    super(creator, {
      name: "stop",
      description: "Stops playing the Music and cleans the Queue",
      guildIDs: process.env.DISCORD_GUILD_ID
        ? [process.env.DISCORD_GUILD_ID]
        : undefined,
    });
  }

  async run(ctx: CommandContext) {
    try {
      await ctx.defer();
      const guild = client.guilds.cache.get(ctx.guildID ?? "");
      if (!guild) throw new Error("❌ | Error: guild id missing.");
      const channel = guild.channels.cache.get(ctx.channelID);
      const queue = player.createQueue(guild?.id, { data: channel });

      if (!queue || !queue.isPlaying)
        return void ctx.sendFollowUp({
          content: "❌ | No music is being played!",
        });

      queue.stop();
      return void ctx.sendFollowUp({ content: "🛑 | Stopped the player!" });
    } catch (error) {
      if (error instanceof Error)
        return void ctx.sendFollowUp({ content: error.message });
      return void ctx.sendFollowUp({
        content: "☠️ | Oops.. something went wrong.",
      });
    }
  }
}

export default stop;
