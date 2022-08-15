import BotCommandBuilder from '../../../../core/bot/BotCommandBuilder.js';
import UserCommandError from '../../../../core/bot/UserCommandError.js';
import MessageEmbeds from '../../../../core/components/MessageEmbeds.js';
import prisma from '../../../../lib/prisma.js';
import getGuildDefaultRoleId from '../../../../services/getGuildDefaultRoleId.js';
import updateGuildDefaultRoleId from '../../../../services/updateGuildDefaultRoleId.js';
import { ButtonBuilder } from '@discordjs/builders';
import {
	ActionRowBuilder,
	ButtonStyle,
	ChatInputCommandInteraction,
	ComponentType,
	DiscordAPIError,
	SelectMenuBuilder,
	SelectMenuComponentOptionData,
} from 'discord.js';
import { concat } from 'lodash-es';

class setNewMembersRole extends BotCommandBuilder {
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
		const guild = await prisma.guild.findUnique({
			where: { id: interaction.guild?.id },
		});

		const roles = await prisma.role.findMany({ include: { guild: true } });

		if (!roles.length)
			throw new UserCommandError(
				'No roles found, please make sure to add roles first'
			);

		// select menu component
		const selectMenuRow =
			new ActionRowBuilder<SelectMenuBuilder>().addComponents(
				new SelectMenuBuilder()
					.setCustomId('newMembersRole')
					.setPlaceholder('Select Role')
					.addOptions(
						...concat(
							roles.map(
								(role) =>
									({
										label: role.name,
										value: role.id,
										default:
											role.id ===
											role.guild?.defaultRoleId,
									} as SelectMenuComponentOptionData)
							),
							guild?.defaultRoleId
								? [
										{
											label: 'Unset',
											value: 'unset',
											default: !guild?.defaultRoleId,
											description:
												'Remove the default role',
										},
								  ]
								: []
						)
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

		// display the select menu
		await interaction.followUp({
			content: 'Select roles for new members',
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
						embeds: [MessageEmbeds.Error()],
						content: '',
						components: [],
					});

					selectMenuCollector.stop();

					return;
				}

				await updateGuildDefaultRoleId(
					selectMenuInteraction.guildId,
					selectMenuInteraction.values[0] === 'unset'
						? null
						: selectMenuInteraction.values[0]
				);

				if (selectMenuInteraction.values[0] === 'unset') {
					await selectMenuInteraction.editReply({
						embeds: [MessageEmbeds.Success()],
						content: '',
						components: [],
					});

					return;
				}

				await selectMenuInteraction.editReply({
					embeds: [
						MessageEmbeds.Info({
							title: 'New members roles set!',
							description:
								'Do you want to apply this roles to all existing members?',
						}),
					],
					content: '',

					components: [buttonRow],
				});

				selectMenuCollector.stop();
			} catch (error) {
				selectMenuInteraction.editReply({
					embeds: [MessageEmbeds.Error()],
					content: '',
					components: [],
				});

				console.error(error);

				selectMenuCollector.stop();
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
					if (!buttonInteraction.guildId) return;

					const roleId = await getGuildDefaultRoleId(
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
						embeds: [MessageEmbeds.Success()],
						content: '',
						components: [],
					});

					buttonCollector.stop();
				}

				if (
					buttonInteraction.customId ===
					'newMembersRoleApplyToExistingMembersDecline'
				) {
					buttonInteraction.update({
						embeds: [MessageEmbeds.Success()],
						content: '',
						components: [],
					});

					buttonCollector.stop();
				}
			} catch (error) {
				buttonCollector.stop();

				if (error instanceof DiscordAPIError && error.code === 50013) {
					buttonInteraction.update({
						embeds: [
							MessageEmbeds.Error({
								title: "I can't give the role you selected",
								description: `Please fix it by putting my role **${interaction.client.user?.username}** above all the role you selected`,
							}),
						],
						content: '',
						components: [],
					});

					return;
				}

				buttonInteraction.update({
					embeds: [MessageEmbeds.Error()],
					content: '',
					components: [],
				});

				console.error(error);
			}
		});
	}
}

// noinspection JSUnusedGlobalSymbols
export default setNewMembersRole;
