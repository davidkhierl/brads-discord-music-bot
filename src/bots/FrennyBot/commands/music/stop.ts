import Bot, { UserCommandError } from '../../../../core/bot/Bot.js';
import BotCommandBuilder from '../../../../core/bot/BotCommandBuilder.js';
import MessageEmbeds from '../../../../core/components/MessageEmbeds.js';
import { isMusic } from '../../../../core/modules/Music/Music.js';
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

		const { queue } = music.init(interaction);

		queue.setData({ interaction });

		if (!queue.isPlaying)
			throw new UserCommandError('🙄   Yow! there are no songs playing');

		queue.stop();

		await queue.data?.interaction.followUp({
			embeds: [MessageEmbeds.Warning({ title: 'Stopping music' })],
		});
	}
}
