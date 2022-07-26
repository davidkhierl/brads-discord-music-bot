import prisma from '../lib/prisma.js';
import { Guild } from 'discord.js';

/**
 * Save guild to database
 * @param guild Guild
 * @return guild
 */
async function saveGuild(guild: Guild) {
	return await prisma.guild.upsert({
		where: { id: guild.id },
		update: { name: guild.name },
		create: {
			id: guild.id,
			name: guild.name,
			bot: { connect: { id: guild.client.user?.id } },
		},
	});
}

export default saveGuild;
