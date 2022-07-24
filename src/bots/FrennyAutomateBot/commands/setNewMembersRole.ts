import BotCommandBuilder from '../../../core/BotCommandBuilder.js';
import BotCommandBuilderError from '../../../core/BotCommandBuilderError.js';
import { CommandInteraction } from 'discord.js';

export default class setNewMembersRole extends BotCommandBuilder {
	constructor() {
		super();
		try {
			this.slash
				.setName('set-new-members-role')
				.setDescription(
					'Automatically apply role for when user join your server.'
				)
				.setDefaultMemberPermissions(0);
		} catch (error) {
			if (error instanceof Error) console.log(error);
		}
	}

	async execute(interaction: CommandInteraction): Promise<void> {
		await interaction.reply('Set New Members Role');
	}
}
