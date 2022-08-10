import Bot from '../../../../core/bot/Bot.js';
import BotCommandBuilder from '../../../../core/bot/BotCommandBuilder.js';
import MessageEmbeds from '../../../../core/components/MessageEmbeds.js';
import { isMusic } from '../../../../core/modules/Music.js';
import { ChatInputCommandInteraction } from 'discord.js';

export default class stop extends BotCommandBuilder {
	constructor() {
		super({ deferReply: false, ephemeral: false });
		this.slash.setName('stop').setDescription('Stop playing music');
	}

	async execute(
		interaction: ChatInputCommandInteraction,
		bot: Bot
	): Promise<void> {
		const music = bot.modules.get('music');

		if (!isMusic(music) || !interaction.guildId) return;

		const { join, queue, guildQueue } = music.init(interaction);

		queue.setData({ interaction });

		if (!queue.isPlaying) {
			interaction.reply({
				embeds: [
					MessageEmbeds.Warning({
						title: '🙄 Yow! there are no songs playing',
					}),
				],
				content: '',
			});

			return;
		}

		queue.stop();
	}
}
