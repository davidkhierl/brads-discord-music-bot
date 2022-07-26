import prisma from '../lib/prisma.js';

/**
 * Get the guild new members role id
 * @param guildId string
 * @returns string
 */
async function getGuildNewMembersRole(guildId: string) {
	const guild = await prisma.guild.findUnique({ where: { id: guildId } });
	return guild?.newMembersRole;
}

export default getGuildNewMembersRole;
