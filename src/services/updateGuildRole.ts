import prisma from '../lib/prisma.js';
import { Role } from 'discord.js';

/**
 * Update guild role
 * @param role Discord Role
 * @returns Role
 */
async function updateGuildRole(role: Role) {
	return await prisma.role.update({
		data: {
			name: role.name,
		},
		where: { id: role.id },
	});
}

export default updateGuildRole;
