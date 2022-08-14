import prisma from '../lib/prisma.js';

/**
 * Delete guild
 * @param {string} guildId
 * @return {Guild} the deleted guild
 */
async function deleteGuild(guildId: string) {
	return await prisma.guild.delete({
		where: { id: guildId },
	});
}

export default deleteGuild;
