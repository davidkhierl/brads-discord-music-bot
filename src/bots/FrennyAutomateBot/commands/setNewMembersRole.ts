import BotCommandBuilder from '../../../core/BotCommandBuilder.js';
import BotCommandBuilderError from '../../../core/BotCommandBuilderError.js';
import UserCommandError from '../../../core/UserCommandError.js';
import prisma from '../../../lib/prisma.js';
import {
	ActionRowBuilder,
	ChatInputCommandInteraction,
	SelectMenuBuilder,
} from 'discord.js';

export default class setNewMembersRole extends BotCommandBuilder {
	constructor() {
		super({ deferReply: true, ephemeral: true });
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

	async execute(interaction: ChatInputCommandInteraction): Promise<void> {
		const roles = await prisma.role.findMany();

		if (!roles)
			throw new UserCommandError(
				'Found 0 roles, make sure to add new roles'
			);

		const row = new ActionRowBuilder<SelectMenuBuilder>().addComponents(
			new SelectMenuBuilder()
				.setCustomId('newMembersRole')
				.setPlaceholder('Select Role')
				.addOptions(
					...roles.map((role) => ({
						label: role.name,
						value: role.id,
					}))
				)
		);

		await interaction.followUp({
			content: 'Select the role to be applied when users join',
			components: [row],
		});
	}
}
