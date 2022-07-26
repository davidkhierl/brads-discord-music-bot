import { BotEventModule } from '../../../core/BotWithCommands.js';
import prisma from '../../../lib/prisma.js';
import updateGuildRole from '../../../services/updateGuildRole.js';
import { Role } from 'discord.js';

interface BotEventRoleUpdate<T> extends BotEventModule {
	execute(oldRole: T, newRole: T): Promise<void>;
}

/**
 * Update guild role on role update
 */
const onRoleUpdate: BotEventRoleUpdate<Role> = {
	name: 'roleUpdate',
	execute: async (_oldRole, newRole) => {
		if (newRole.managed) return;

		await updateGuildRole(newRole);
	},
};

export default onRoleUpdate;
