import prisma from '../lib/prisma.js';
import { Guild } from '@prisma/client';

/**
 * Set guild active state
 * @param {string} guildId
 * @param  {boolean} isActive
 * @return {Guild} Guild
 */
async function setGuildActiveState(
	guildId: string,
	isActive: boolean
): Promise<Guild> {
	return await prisma.guild.update({
		where: { id: guildId },
		data: { isActive },
	});
}

export default setGuildActiveState;
