import prisma from '../lib/prisma.js';

async function getGuildNewMembersRole(guildId: string) {
	const guild = await prisma.guild.findUnique({ where: { id: guildId } });
	return guild?.newMembersRole;
}

export default getGuildNewMembersRole;
