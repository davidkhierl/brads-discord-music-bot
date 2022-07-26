import prisma from '../lib/prisma.js';
import { ClientUser } from 'discord.js';

/**
 * Save bot to database
 * @param bot ClientUser
 * @returns Bot
 */
async function saveBot(bot: ClientUser) {
	return await prisma.bot.upsert({
		where: { id: bot.id },
		update: { name: bot.username },
		create: {
			id: bot.id,
			name: bot.username,
		},
	});
}

export default saveBot;
