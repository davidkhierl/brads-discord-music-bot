import prisma from '../lib/prisma.js';
import { Role } from 'discord.js';

/**
 * Save new guild role
 * @param role Discord Role
 * @returns Role
 */
async function saveGuildRole(role: Role) {
	return await prisma.role.create({
		data: {
			id: role.id,
			name: role.name,
			guild: { connect: { id: role.guild.id } },
		},
	});
}

export default saveGuildRole;
