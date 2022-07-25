import { BotEvent } from '../../../core/BotWithCommands.js';
import prisma from '../../../lib/prisma.js';
import { Role } from 'discord.js';

const onRoleDelete: BotEvent<Role> = {
	name: 'roleDelete',
	execute: async (role) => {
		try {
			console.log('Role Delete', role.id, role.name);
			if (role.managed) return;

			await prisma.role.delete({ where: { id: role.id } });
		} catch (error) {
			if (error instanceof Error) console.log(error);
		}
	},
};

export default onRoleDelete;
