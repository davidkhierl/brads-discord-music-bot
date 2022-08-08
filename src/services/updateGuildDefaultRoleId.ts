import prisma from '../lib/prisma.js';

/**
 * Update guilds newMembersRole property
 * @param roleId string
 * @param guildId string
 * @returns Guild
 */
async function updateGuildDefaultRoleId(
	guildId: string,
	roleId: string | null
) {
	// throw an error when role is not found

	return await prisma.guild.update({
		where: { id: guildId },
		data: { defaultRoleId: roleId },
	});
}

export default updateGuildDefaultRoleId;
