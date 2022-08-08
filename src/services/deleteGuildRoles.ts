import prisma from '../lib/prisma.js';

/**
 * Delete guild roles from database
 * @param guildId Guild ID
 * @returns Role[]
 */
async function deleteGuildRoles(guildId: string) {
	return await prisma.role.deleteMany({ where: { guildId } });
}

export default deleteGuildRoles;
