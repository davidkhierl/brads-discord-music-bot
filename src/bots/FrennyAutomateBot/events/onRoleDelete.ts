import { BotEvent } from '../../../core/BotWithCommands.js';
import deleteRole from '../../../services/deleteRole.js';
import { Role } from 'discord.js';

/**
 * Delete guild role on role delete
 */
const onRoleDelete: BotEvent<Role> = {
	name: 'roleDelete',
	execute: async (role) => {
		await deleteRole(role.id);
	},
};

export default onRoleDelete;
