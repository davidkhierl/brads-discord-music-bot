import { UserCommandError } from '../../../../core/bot/Bot.js';
import BotCommandBuilder from '../../../../core/bot/BotCommandBuilder.js';
import Embeds from '../../../../core/components/Embeds.js';
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
						embeds: [Embeds.ErrorMessage()],
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
						embeds: [Embeds.SuccessMessage()],
						content: '',
						components: [],
					});

					return;
				}

				await selectMenuInteraction.editReply({
					embeds: [
						Embeds.InfoMessage({
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
					embeds: [Embeds.ErrorMessage()],
					content: '',
					components: [],
				});

				console.log(error);

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
					if (!buttonInteraction.guildId)
						throw new Error('guildId is null');

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
						embeds: [Embeds.SuccessMessage()],
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
						embeds: [Embeds.SuccessMessage()],
						content: '',
						components: [],
					});

					buttonCollector.stop();
				}
			} catch (error) {
				if (error instanceof DiscordAPIError && error.code === 50013) {
					buttonInteraction.update({
						embeds: [
							Embeds.ErrorMessage({
								title: "I can't give one fo the role you selected",
								description:
									'Please fix it by putting my role **Frenny** above all the roles you selected',
							}),
						],
						content: '',
						components: [],
					});

					console.log(error);

					return;
				}
				console.log(error);

				buttonCollector.stop();

				buttonInteraction.update({
					embeds: [Embeds.ErrorMessage()],
					content: '',
					components: [],
				});
			}
		});
	}
}
