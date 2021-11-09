import {
	CommandContext,
	CommandOptionType,
	SlashCommand,
	SlashCreator,
} from 'slash-create';

import client from '../../client';
import player from '../../player';

class playlist extends SlashCommand {
	constructor(creator: SlashCreator) {
		super(creator, {
			name: 'playlist',
			description: 'Play a playlist from youtube',
			options: [
				{
					name: 'url',
					description: 'Playlist URL from youtube to play',
					type: CommandOptionType.STRING,
					required: true,
				},
			],
			guildIDs: process.env.DISCORD_GUILD_ID
				? [process.env.DISCORD_GUILD_ID]
				: undefined,
		});
	}

	async run(ctx: CommandContext) {
		try {
			await ctx.defer();
			const guild = client.guilds.cache.get(ctx.guildID ?? '');
			if (!guild) throw new Error('❌ | Error: guild id missing.');
			const channel = guild.channels.cache.get(ctx.channelID);
			const queue = player.createQueue(guild?.id, { data: channel });
			const guildQueue = player.getQueue(guild.id);
			const member = guild.members.cache.get(ctx.user.id);
			if (!member || !member.voice.channel)
				throw new Error(
					`🥱 ${client.user?.username} failed to join. Please make sure that you're already in a voice channel and try the command again.`
				);
			await queue.join(member.voice.channel);
			await ctx.sendFollowUp({
				content: '⏱ | Loading playlist...',
			});
			await queue.playlist(ctx.options.url).catch((reason) => {
				if (!guildQueue) queue.stop();
				if (reason) throw new Error(`❌ | Error: ${reason}`);
			});
			return;
		} catch (error) {
			if (error instanceof Error)
				return void ctx.sendFollowUp({ content: error.message });
			return void ctx.sendFollowUp({
				content: '☠️ | Oops.. something went wrong.',
			});
		}
	}
}

export default playlist;
