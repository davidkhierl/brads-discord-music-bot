import Bot from '../../../../core/bot/Bot.js';
import BotCommandBuilder from '../../../../core/bot/BotCommandBuilder.js';
import MessageEmbeds from '../../../../core/components/MessageEmbeds.js';
import { isMusic } from '../../../../core/modules/Music.js';
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

	async execute(
		interaction: ChatInputCommandInteraction,
		bot: Bot
	): Promise<void> {
		const song = interaction.options.getString('song', true);

		const music = bot.modules.get('music');

		if (!isMusic(music) || !interaction.guildId) return;

		const { join, queue, guildQueue } = music.init(interaction);

		await join();

		console.log(guildQueue?.isPlaying);

		if (!queue.isPlaying)
			interaction.followUp({
				embeds: [
					MessageEmbeds.Info({
						title: '🤔   Searching song...',
						description: `${song}`,
					}),
				],
				content: '',
			});

		await queue
			.play(song, {
				requestedBy: interaction.user,
			})
			.catch((error) => {
				if (!guildQueue) queue.stop();

				console.log(error);

				throw new Error(error);
			});
	}
}
