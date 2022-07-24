import BotCommandBuilder from '../../../core/BotCommandBuilder.js';
import { CommandInteraction } from 'discord.js';

export default class test extends BotCommandBuilder {
	constructor() {
		super();
		this.slash.setName('test').setDescription('Test commands');
	}

	async execute(interaction: CommandInteraction): Promise<void> {
		await interaction.reply('Test Reply');
	}
}
