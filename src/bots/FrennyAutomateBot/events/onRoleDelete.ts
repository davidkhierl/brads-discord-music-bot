import { BotEvent } from '../../../core/BotWithCommands.js';
import SentryHelper from '../../../helpers/SentryHelper.js';
import deleteRole from '../../../services/deleteRole.js';
import * as Sentry from '@sentry/node';
import { Role } from 'discord.js';

/**
 * Delete guild role on role delete
 */
const onRoleDelete: BotEvent<Role> = {
	name: 'roleDelete',
	execute: async (role) => {
		const transaction = SentryHelper.startGuildEventTransaction({
			op: 'roleDelete',
		});

		Sentry.setTag('guild_event', 'roleDelete');

		Sentry.configureScope((scope) => {
			scope.setSpan(transaction);
		});

		Sentry.setContext('role', {
			name: role.name,
			id: role.id,
		});

		Sentry.setContext('guild', {
			name: role.guild.name,
			id: role.guild.id,
		});

		try {
			await deleteRole(role.id);
		} catch (error) {
			Sentry.captureException(error);
		}

		transaction.finish();
	},
};

export default onRoleDelete;
