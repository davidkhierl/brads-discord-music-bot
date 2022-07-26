import prisma from '../lib/prisma.js';
import { Guild } from 'discord.js';

/**
 * Delete guild
 * @param guildId string
 * @return Guild
 */
async function deleteGuild(guild: string) {
	return await prisma.guild.delete({
		where: { id: guild },
	});
}

export default deleteGuild;
