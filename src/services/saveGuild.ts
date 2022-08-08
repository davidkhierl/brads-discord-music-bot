import prisma from '../lib/prisma.js';
import { Guild } from '@prisma/client';

/**
 * Save guild to database
 * @param guild Guild
 * @return guild
 */
async function saveGuild(guild: Omit<Guild, 'defaultRoleId' | 'roleId'>) {
	return await prisma.guild.upsert({
		where: { id: guild.id },
		update: { name: guild.name, isActive: guild.isActive },
		create: {
			id: guild.id,
			name: guild.name,
			isActive: guild.isActive,
		},
	});
}

export default saveGuild;
