import BotCommandBuilder from '../../../core/BotCommandBuilder.js';
import { UserCommandError } from '../../../core/BotWithCommands.js';
import prisma from '../../../lib/prisma.js';
import getGuildNewMembersRole from '../../../services/getGuildNewMembersRole.js';
import updateGuildNewMembersRole from '../../../services/updateGuildNewMembersRole.js';
import { ButtonBuilder } from '@discordjs/builders';
import {
	ActionRowBuilder,
	ButtonStyle,
	ChatInputCommandInteraction,
	ComponentType,
	DiscordAPIError,
	SelectMenuBuilder,
} from 'discord.js';

export default class setNewMembersRole extends BotCommandBuilder {
	constructor() {
		super({ deferReply: true, ephemeral: true });
		try {
			this.slash
				.setName('set-new-members-role')
				.setDescription('Set role when user join your server.')
				.setDefaultMemberPermissions(0);
		} catch (error) {
			if (error instanceof Error) console.log(error);
		}
	}

	async execute(interaction: ChatInputCommandInteraction): Promise<void> {
		const roles = await prisma.role.findMany({ include: { guild: true } });

		if (!roles)
			throw new UserCommandError(
				'Found 0 roles, make sure to add new roles'
			);

		// select menu component
		const selectMenuRow =
			new ActionRowBuilder<SelectMenuBuilder>().addComponents(
				new SelectMenuBuilder()
					.setCustomId('newMembersRole')
					.setPlaceholder('Select Role')
					.addOptions(
						...roles.map((role) => ({
							label: role.name,
							value: role.id,
							default: role.id === role.guild?.newMembersRole,
						}))
					)
					.setMaxValues(1)
			);

		// button component
		const buttonRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
			new ButtonBuilder()
				.setCustomId('newMembersRoleApplyToExistingMembersAccept')
				.setLabel('Yes')
				.setStyle(ButtonStyle.Secondary),
			new ButtonBuilder()
				.setCustomId('newMembersRoleApplyToExistingMembersDecline')
				.setLabel('No')
				.setStyle(ButtonStyle.Primary)
		);

		// display the selectmenu
		await interaction.followUp({
			content:
				'Select the role to be applied when users join your server',
			components: [selectMenuRow],
		});

		// select menu collector
		const selectMenuCollector =
			interaction.channel?.createMessageComponentCollector({
				componentType: ComponentType.SelectMenu,
				time: 60000,
			});

		// listen on select menu event
		selectMenuCollector?.on('collect', async (selectMenuInteraction) => {
			try {
				await selectMenuInteraction.deferUpdate();

				if (!selectMenuInteraction.guildId) {
					selectMenuInteraction.editReply({
						content:
							'Something went wrong while executing this command',
						components: [],
					});

					selectMenuCollector.stop();

					return;
				}

				await updateGuildNewMembersRole(
					selectMenuInteraction.values[0],
					selectMenuInteraction.guildId
				);

				await selectMenuInteraction.editReply({
					content:
						'New members role updated! do you want to apply this to all existing members?',
					components: [buttonRow],
				});

				selectMenuCollector.stop();
			} catch (error) {
				console.log(error);
				selectMenuCollector.stop();
				selectMenuInteraction.editReply({
					content:
						'Something went wrong while executing this command',
					components: [],
				});
			}
		});

		const buttonCollector =
			interaction.channel?.createMessageComponentCollector({
				componentType: ComponentType.Button,
				time: 60000,
			});

		buttonCollector?.on('collect', async (buttonInteraction) => {
			try {
				if (
					buttonInteraction.customId ===
					'newMembersRoleApplyToExistingMembersAccept'
				) {
					if (!buttonInteraction.guildId)
						throw new Error('guildId is null');

					const roleId = await getGuildNewMembersRole(
						buttonInteraction.guildId
					);

					if (!roleId) return;

					const members = buttonInteraction.guild?.members.cache
						.filter((member) => !member.user.bot)
						.toJSON();

					if (!members) return;

					for (const member of members) {
						await member.roles.add(roleId);
					}

					buttonInteraction.update({
						content: 'Success!',
						components: [],
					});
					buttonCollector.stop();
				}

				if (
					buttonInteraction.customId ===
					'newMembersRoleApplyToExistingMembersDecline'
				) {
					buttonInteraction.update({
						content: 'Done!',
						components: [],
					});
					buttonCollector.stop();
				}
			} catch (error) {
				if (error instanceof DiscordAPIError) {
					buttonInteraction.update({
						content:
							'Frenny Automate Bot lacks permission. Please make sure to set bot role higher than all the roles in this server',
						components: [],
					});

					return;
				}
				console.log(error);
				buttonCollector.stop();
				buttonInteraction.update({
					content:
						'Something went wrong while executing this command',
					components: [],
				});
			}
		});
	}
}
