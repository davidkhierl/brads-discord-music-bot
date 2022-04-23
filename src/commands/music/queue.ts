import {
	CommandContext,
	CommandOptionType,
	SlashCommand,
	SlashCreator,
} from 'slash-create';

import Music from '../../modules/Music/Music';

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
		const music = new Music(ctx);

		await music.ctx.defer();

		if (!music.guildQueue || !music.guildQueue.isPlaying)
			return void ctx.sendFollowUp({
				content: '🥱 | No music is being played my frenny!',
			});

		if (!music.ctx.options.page) music.ctx.options.page = 1;

		const pageStart = 10 * (music.ctx.options.page - 1);
		const pageEnd = pageStart + 10;

		const currentSongPlaying = music.guildQueue.nowPlaying;

		const songs = music.guildQueue.songs
			.slice(pageStart, pageEnd)
			.map((song, index) => `${index + pageStart + 1}. **${song.name}**`);

		return void ctx.sendFollowUp({
			embeds: [
				{
					title: 'Server Queue',
					description: `${songs.join('\n')}${
						music.guildQueue.songs.length > pageEnd
							? `\n...${
									music.guildQueue.songs.length - pageEnd
							  } more track(s)`
							: ''
					}`,
					color: 0x0099ff,
					fields: [
						{
							name: 'Now Playing',
							value: `🎶 | **${currentSongPlaying?.name}**`,
						},
					],
				},
			],
		});
	}
}

export default queue;
