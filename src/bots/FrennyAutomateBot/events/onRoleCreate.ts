import { BotEvent } from '../../../core/BotWithCommands.js';
import prisma from '../../../lib/prisma.js';
import saveGuildRole from '../../../services/saveGuildRole.js';
import { Role } from 'discord.js';

/**
 * Save new role to database
 * when user creates new role.
 */
const onRoleCreate: BotEvent<Role> = {
	name: 'roleCreate',
	execute: async (role) => {
		if (role.managed) return;

		await saveGuildRole(role);
	},
};

export default onRoleCreate;
