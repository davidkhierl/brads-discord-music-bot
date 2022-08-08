import prisma from '../lib/prisma.js';

/**
 * Delete guild commands from database
 * @param guildId Guild ID
 * @returns Command[]
 */
async function deleteGuildCommands(guildId: string) {
	return await prisma.command.deleteMany({ where: { guildId } });
}

export default deleteGuildCommands;
