import { BotEvent } from '../../../core/BotWithCommands.js';
import prisma from '../../../lib/prisma.js';
import { Role } from 'discord.js';

const onRoleCreate: BotEvent<Role> = {
	name: 'roleCreate',
	execute: async (role) => {
		try {
			console.log('Role Create', role.id, role.name);
			if (role.managed) return;

			await prisma.role.create({
				data: {
					id: role.id,
					name: role.name,
					guild: { connect: { id: role.guild.id } },
				},
			});
		} catch (error) {
			if (error instanceof Error) console.log(error);
		}
	},
};

export default onRoleCreate;
