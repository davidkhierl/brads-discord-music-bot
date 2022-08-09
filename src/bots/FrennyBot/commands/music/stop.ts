import Bot from '../../../../core/bot/Bot.js';
import BotCommandBuilder from '../../../../core/bot/BotCommandBuilder.js';
import MessageEmbeds from '../../../../core/components/MessageEmbeds.js';
import { isMusic } from '../../../../core/modules/Music.js';
import { ChatInputCommandInteraction } from 'discord.js';

export default class stop extends BotCommandBuilder {
	constructor() {
		super({ deferReply: true, ephemeral: true });
		this.slash.setName('stop').setDescription('Stop playing music');
	}

	async execute(
		interaction: ChatInputCommandInteraction,
		bot: Bot
	): Promise<void> {
		const music = bot.modules.get('music');

		if (!isMusic(music) || !interaction.guildId) return;

		const { join, queue, guildQueue } = music.init(interaction);

		if (!queue.isPlaying)
			interaction.followUp({
				embeds: [
					MessageEmbeds.Warning({
						title: '🙄 Yow! there are no songs playing',
					}),
				],
				content: '',
			});

		queue.stop();

		interaction.followUp({
			embeds: [MessageEmbeds.Success({ title: '🥳   Music stopped!' })],
		});
	}
}
