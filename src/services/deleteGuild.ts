import prisma from '../lib/prisma.js';
import { Guild } from 'discord.js';

/**
 * Save guild to database including roles
 * that aren't managed by third parties.
 * @param guild Guild
 * @return guild
 */
async function deleteGuild(guild: Guild) {
	if (!guild.available) throw new Error('Guild not available');

	return await prisma.guild.delete({
		where: { id: guild.id },
	});
}

export default deleteGuild;
