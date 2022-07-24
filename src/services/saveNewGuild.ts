import prisma from '../lib/prisma.js';
import { Guild } from 'discord.js';

/**
 * Save guild to database including roles
 * that aren't managed by third parties.
 * @param guild Guild
 * @return guild
 */
async function saveNewGuild(guild: Guild) {
	if (!guild.available) throw new Error('Guild not available');

	await prisma.guild.upsert({
		where: { id: guild.id },
		update: { name: guild.name },
		create: {
			id: guild.id,
			name: guild.name,
			bot: { connect: { id: guild.client.user?.id } },
		},
	});

	const rolesFromGuild = guild.roles.cache
		.filter((role) => !role.managed)
		.map((role) => ({
			id: role.id,
			name: role.name,
		}));

	for (const role of rolesFromGuild) {
		await prisma.role.upsert({
			where: { id: role.id },
			update: { name: role.name },
			create: {
				id: role.id,
				name: role.name,
				guild: { connect: { id: guild.id } },
			},
		});
	}

	return await prisma.guild.findUnique({
		where: { id: guild.id },
		include: { roles: true },
	});
}

export default saveNewGuild;
