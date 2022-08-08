import prisma from '../lib/prisma.js';

/**
 * Get guild commands from database
 * @param guildId Guild ID
 * @param group Command Group
 * @returns Command[]
 */
async function getGuildCommands(guildId: string, group?: string) {
	return await prisma.command.findMany({ where: { guildId, group } });
}

export default getGuildCommands;
