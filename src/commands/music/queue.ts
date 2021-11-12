import {
	CommandContext,
	CommandOptionType,
	SlashCommand,
	SlashCreator,
} from 'slash-create';

import client from '../../client';
import player from '../../player';

class queue extends SlashCommand {
	constructor(creator: SlashCreator) {
		super(creator, {
			name: 'queue',
			description: 'Display songs in queue',
			options: [
				{
					name: 'page',
					type: CommandOptionType.INTEGER,
					description: 'Queue page',
					required: false,
				},
			],
		});
	}

	async run(ctx: CommandContext) {
		try {
			await ctx.defer();
			const guild = client.guilds.cache.get(ctx.guildID!);

			if (!guild) throw new Error('❌ | Error: guild id missing.');
			const guildQueue = player.getQueue(ctx.guildID!);

			if (!guildQueue || !guildQueue.isPlaying)
				return void ctx.sendFollowUp({
					content: '🥱 | No music is being played my frenny!',
				});

			if (!ctx.options.page) ctx.options.page = 1;
			const pageStart = 10 * (ctx.options.page - 1);
			const pageEnd = pageStart + 10;
			const nowPlaying = guildQueue.nowPlaying;
			const songs = guildQueue.songs
				.slice(pageStart, pageEnd)
				.map(
					(song, index) =>
						`${index + pageStart + 1}. **${song.name}**`
				);
			return void ctx.sendFollowUp({
				embeds: [
					{
						title: 'Server Queue',
						description: `${songs.join('\n')}${
							guildQueue.songs.length > pageEnd
								? `\n...${
										guildQueue.songs.length - pageEnd
								  } more track(s)`
								: ''
						}`,
						color: 0x0099ff,
						fields: [
							{
								name: 'Now Playing',
								value: `🎶 | **${nowPlaying?.name}**`,
							},
						],
					},
				],
			});
		} catch (error) {
			if (error instanceof Error)
				return void ctx.sendFollowUp({ content: error.message });
			return void ctx.sendFollowUp({
				content: '☠️ | Oops.. something went wrong.',
			});
		}
	}
}

export default queue;
