import BotCommandBuilder from '../../../core/BotCommandBuilder.js';
import FrennyDJBot from '../FrennyDJBot.js';
import Music from '../Music.js';
import { CommandInteraction } from 'discord.js';

export default class play extends BotCommandBuilder {
	constructor() {
		super({ deferReply: true, ephemeral: true });
		this.slash
			.setName('play')
			.setDescription('Play a song from YouTube')
			.addStringOption((option) =>
				option
					.setName('song')
					.setDescription(
						'The song name you want to play. you can also paste a link from YouTube!'
					)
					.setRequired(true)
			);
	}

	async execute(interaction: CommandInteraction): Promise<void> {
		if (!interaction.isChatInputCommand()) return;

		const music = new Music(interaction, FrennyDJBot.player);

		await music.joinVoiceChannel();

		await music.interaction.followUp({
			content: `⏱ | Loading track... **[${interaction.options.getString(
				'song'
			)}]**`,
			ephemeral: true,
		});

		// TODO: convert to try catch
		await music.queue
			.play(interaction.options.getString('song', true))
			.catch((error) => {
				if (!music.guildQueue) music.queue.stop();
				if (error instanceof Error)
					throw new Error(error.message, { cause: error.cause });
			});

		await music.interaction.followUp({
			content: '💿 | Track added to the queue, Enjoy your music! 🎧',
		});
		return;
	}
}
