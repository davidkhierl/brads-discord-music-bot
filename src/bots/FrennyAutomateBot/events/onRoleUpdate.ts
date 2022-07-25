import { BotEventModule } from '../../../core/BotWithCommands.js';
import prisma from '../../../lib/prisma.js';
import { Role } from 'discord.js';

interface BotEventRoleUpdate<T> extends BotEventModule {
	execute(oldRole: T, newRole: T): Promise<void>;
}

const onRoleUpdate: BotEventRoleUpdate<Role> = {
	name: 'roleUpdate',
	execute: async (_oldRole, newRole) => {
		try {
			console.log('Role Update', newRole.id, newRole.name);
			if (newRole.managed) return;

			await prisma.role.update({
				data: {
					name: newRole.name,
				},
				where: { id: newRole.id },
			});
		} catch (error) {
			if (error instanceof Error) console.log(error);
		}
	},
};

export default onRoleUpdate;
