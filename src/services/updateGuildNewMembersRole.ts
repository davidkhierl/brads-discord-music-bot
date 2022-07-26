import prisma from '../lib/prisma.js';

/**
 * Update guilds newMembersRole property
 * @param roleId string
 * @param guildId string
 * @returns Guild
 */
async function updateGuildNewMembersRole(roleId: string, guildId: string) {
	// throw an error when role is not found
	await prisma.role.findUniqueOrThrow({ where: { id: roleId } });

	return await prisma.guild.update({
		where: { id: guildId },
		data: { newMembersRole: roleId },
	});
}

export default updateGuildNewMembersRole;
