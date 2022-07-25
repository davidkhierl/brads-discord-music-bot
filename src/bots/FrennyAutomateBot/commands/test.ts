import BotCommandBuilder from '../../../core/BotCommandBuilder.js';
import { CacheType, CommandInteraction } from 'discord.js';

export default class test extends BotCommandBuilder {
	constructor() {
		super({ deferReply: true, ephemeral: true });
		this.slash
			.setName('test')
			.setDescription('Test commands')
			.setDefaultMemberPermissions(0);
	}

	async execute(interaction: CommandInteraction): Promise<void> {
		await interaction.followUp('Test Reply');
	}
}
