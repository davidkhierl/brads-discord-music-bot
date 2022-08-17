import Bot from '../../../../core/bot/Bot.js';
import BotCommandBuilder from '../../../../core/bot/BotCommandBuilder.js';
import MessageEmbeds from '../../../../core/components/MessageEmbeds.js';
import { isMusic } from '../../../../core/modules/Music/isMusic.js';
import { ChatInputCommandInteraction } from 'discord.js';

class playlist extends BotCommandBuilder {
	constructor() {
		super({ deferReply: true, ephemeral: true });
		this.slash
			.setName('playlist')
			.setDescription(
				'Play a playlist from YouTube, Spotify or Apple Music'
			)
			.addStringOption((option) =>
				option
					.setName('url')
					.setDescription(
						'Url playlist from YouTube, Spotify or Apple Music'
					)
					.setRequired(true)
			);
	}

	async execute(
		interaction: ChatInputCommandInteraction,
		bot: Bot
	): Promise<void> {
		const playlistUrl = interaction.options.getString('url', true);

		const music = bot.modules.get('music');

		if (!isMusic(music) || !interaction.guildId) return;

		const { join, queue, guildQueue } = music.init(interaction);

		queue.setData({ interaction });

		await join();

		await interaction.editReply({
			embeds: [
				MessageEmbeds.Info({
					title: '',
					description: `${playlistUrl}`,
					url: playlistUrl,
					author: {
						name: '🤔   Searching playlist',
					},
				}),
			],
			content: '',
		});

		await queue
			.playlist(playlistUrl, {
				requestedBy: interaction.user,
				data: {
					interaction,
					playlistUrl,
				},
			})
			.catch((error) => {
				if (!guildQueue) queue.stop();

				console.log(error);
			});
	}
}

// noinspection JSUnusedGlobalSymbols
export default playlist;
