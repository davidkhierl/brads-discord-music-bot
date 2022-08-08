import BotCommandBuilder from '../../../../core/bot/BotCommandBuilder.js';
import { ChatInputCommandInteraction } from 'discord.js';

export default class play extends BotCommandBuilder {
	constructor() {
		super({ deferReply: true, ephemeral: true });
		this.slash
			.setName('play')
			.setDescription('Play a song')
			.addStringOption((option) =>
				option
					.setName('song')
					.setDescription(
						'Name of the song or a url from YouTube or Spotify.'
					)
					.setRequired(true)
			);
	}

	async execute(interaction: ChatInputCommandInteraction): Promise<void> {
		return;
		// if (!interaction.isChatInputCommand()) return;

		// const music = new Music(interaction, FrennyDJBot.player);

		// await music.joinVoiceChannel();

		// await music.interaction.followUp({
		// 	content: `⏱ | Loading track... **[${interaction.options.getString(
		// 		'song'
		// 	)}]**`,
		// 	ephemeral: true,
		// });

		// await music.queue
		// 	.play(interaction.options.getString('song', true))
		// 	.catch((error) => {
		// 		if (!music.guildQueue) music.queue.stop();
		// 		if (error instanceof Error)
		// 			throw new Error(error.message, { cause: error.cause });
		// 	});

		// await music.interaction.followUp({
		// 	content: '💿 | Track added to the queue, Enjoy your music! 🎧',
		// });
		// return;
	}
}
