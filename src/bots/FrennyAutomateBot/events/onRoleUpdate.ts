import { BotEventModule } from '../../../core/BotWithCommands.js';
import prisma from '../../../lib/prisma.js';
import { Role } from 'discord.js';

interface BotEventRoleUpdate<T> extends BotEventModule {
	execute(oldRole: T, newRole: T): Promise<void>;
}

const onRoleUpdate: BotEventRoleUpdate<Role> = {
	name: 'roleUpdate',
	execute: async (_oldRole, newRole) => {
		if (newRole.managed) return;

		await prisma.role.update({
			data: {
				name: newRole.name,
			},
			where: { id: newRole.id },
		});
	},
};

export default onRoleUpdate;
