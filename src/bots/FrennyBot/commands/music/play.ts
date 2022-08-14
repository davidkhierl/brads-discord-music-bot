import Bot from '../../../../core/bot/Bot.js';
import BotCommandBuilder from '../../../../core/bot/BotCommandBuilder.js';
import MessageEmbeds from '../../../../core/components/MessageEmbeds.js';
import { isMusic } from '../../../../core/modules/Music/Music.js';
import { ChatInputCommandInteraction } from 'discord.js';

export default class play extends BotCommandBuilder {
	constructor() {
		super({ deferReply: true, ephemeral: true });
		this.slash
			.setName('play')
			.setDescription('Play a song from YouTube, Spotify or Apple Music')
			.addStringOption((option) =>
				option
					.setName('song')
					.setDescription(
						'Name of the song or a you can paste the url from YouTube, Spotify or Apple Music.'
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

		queue.setData({ interaction });

		await join();

		await interaction.editReply({
			embeds: [
				MessageEmbeds.Info({
					title: `🤔   Searching song: __${song}__`,
				}),
			],
			content: '',
		});

		await queue
			.play(song, {
				requestedBy: interaction.user,
				data: {
					interaction,
				},
			})
			.catch((error) => {
				if (!guildQueue) queue.stop();

				console.log(error);

				throw new Error(error);
			});
	}
}
