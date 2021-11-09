import { CommandContext, SlashCommand, SlashCreator } from 'slash-create';

import player from '../../player';

class skip extends SlashCommand {
	constructor(creator: SlashCreator) {
		super(creator, {
			name: 'skip',
			description: 'Skip to the current song',
			guildIDs: process.env.DISCORD_GUILD_ID
				? [process.env.DISCORD_GUILD_ID]
				: undefined,
		});
	}

	async run(ctx: CommandContext) {
		await ctx.defer();
		const queue = player.getQueue(ctx.guildID!);
		if (!queue || !queue.isPlaying)
			return void ctx.sendFollowUp({
				content: '❌ | No music is being played!',
			});
		const currentTrack = queue.songs[0];
		const success = queue.skip();
		return void ctx.sendFollowUp({
			content: success
				? `✅ | Skipped **${currentTrack}**!`
				: '❌ | Something went wrong!',
		});
	}
}

export default skip;
