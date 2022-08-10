import { UserCommandError } from '../../../core/bot/Bot.js';
import BotCommandBuilder from '../../../core/bot/BotCommandBuilder.js';
import FrennyDJBot from '../FrennyDJBot.js';
import Music from '../Music.js';
import { CommandInteraction } from 'discord.js';

export default class queue extends BotCommandBuilder {
	constructor() {
		super({ deferReply: true, ephemeral: true });
		this.slash
			.setName('queue')
			.setDescription('Display songs in queue')
			.addIntegerOption((option) =>
				option.setName('page').setDescription('Queue page')
			);
	}

	async execute(interaction: CommandInteraction): Promise<void> {
		if (!interaction.isChatInputCommand()) return;

		const music = new Music(interaction, FrennyDJBot.player);

		if (!music.guildQueue || !music.guildQueue.isPlaying)
			throw new UserCommandError(
				'🙄 | No song is being played my frenny!'
			);

		await music.interaction.followUp({
			content: '⏱ | Loading queue list...',
			ephemeral: true,
		});

		const optionPage = music.interaction.options.getInteger('page') ?? 1;
		const pageStart = 10 * (optionPage - 1);
		const pageEnd = pageStart + 10;

		const songPlaying = music.guildQueue.nowPlaying;
		const nextSong = music.guildQueue.songs[1];

		const songs = music.guildQueue.songs
			.slice(pageStart, pageEnd)
			.map((song, index) => `**${index + pageStart + 1}**. ${song.name}`);

		await music.interaction.followUp({
			embeds: [
				{
					title: '📄 Music Queue',
					description: `${songs.join('\n')}${
						music.guildQueue.songs.length > pageEnd
							? `\n...${
									music.guildQueue.songs.length - pageEnd
							  } more track(s)`
							: ''
					}`,
					color: 0x0099ff,
				},
				{
					title: '▶️ Now Playing',
					description: `**${songPlaying?.name}**\n`,
					color: 0x1dda1d,
					fields: nextSong
						? [
								{
									name: 'Next Song',
									value: `🎵 | ${nextSong?.name}`,
								},
						  ]
						: undefined,
				},
			],
		});

		return;
	}
}
