import Bot from '../../../../core/bot/Bot.js';
import BotCommandBuilder from '../../../../core/bot/BotCommandBuilder.js';
import Embeds from '../../../../core/components/Embeds.js';
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

		const { join, member, queue, guildQueue } = music.init(interaction);

		await join();

		interaction.editReply({
			embeds: [
				Embeds.InfoMessage({
					title: `🔎 ${song}`,
					description: 'Searching song...',
				}),
			],
			content: '',
		});

		await queue.play(song, {
			requestedBy: interaction.user,
		});
	}
}
