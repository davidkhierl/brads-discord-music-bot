import prisma from '../lib/prisma.js';

/**
 * Get the guild default role id
 * @param guildId string
 * @returns string
 */
async function getGuildDefaultRoleId(guildId: string) {
	const guild = await prisma.guild.findUnique({ where: { id: guildId } });

	return guild?.defaultRoleId;
}

export default getGuildDefaultRoleId;
