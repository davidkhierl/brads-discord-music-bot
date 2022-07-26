import prisma from '../lib/prisma.js';
import { Role } from 'discord.js';

/**
 * Add roles to guild
 * @param roles Discord Role
 * @param guildId string
 * @returns Role
 */
async function saveGuildRoles(roles: Role[]) {
	return Promise.all(
		roles.map((role) =>
			prisma.role.upsert({
				where: { id: role.id },
				update: { name: role.name },
				create: {
					id: role.id,
					name: role.name,
					guild: { connect: { id: role.guild.id } },
				},
			})
		)
	);
}

export default saveGuildRoles;
