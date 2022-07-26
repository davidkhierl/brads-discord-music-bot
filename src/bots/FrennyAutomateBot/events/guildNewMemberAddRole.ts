import { BotEvent, BotEventError } from '../../../core/BotWithCommands.js';
import getGuildNewMembersRole from '../../../services/getGuildNewMembersRole.js';
import { GuildMember } from 'discord.js';

/**
 * Apply role to new members
 */
const guildNewMemberAddRole: BotEvent<GuildMember> = {
	name: 'guildMemberAdd',
	execute: async (guildMember) => {
		if (!guildMember.guild.available)
			throw new BotEventError('Guild not available');

		const newMembersRole = await getGuildNewMembersRole(
			guildMember.guild.id
		);

		if (!newMembersRole) return;

		await guildMember.roles.add(newMembersRole);
	},
};

export default guildNewMemberAddRole;
