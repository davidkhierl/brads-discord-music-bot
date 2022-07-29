import { BotEvent } from '../../../core/BotWithCommands.js';
import SentryHelper from '../../../helpers/SentryHelper.js';
import saveGuildRole from '../../../services/saveGuildRole.js';
import * as Sentry from '@sentry/node';
import { Role } from 'discord.js';

/**
 * Save new role to database
 * when user creates new role.
 */
const onRoleCreate: BotEvent<Role> = {
	name: 'roleCreate',
	execute: async (role) => {
		const transaction = SentryHelper.startBotEventTransaction({
			op: 'roleCreate',
		});

		Sentry.setContext('role', {
			id: role.id,
			name: role.name,
			managed: role.managed,
		});

		Sentry.setContext('guild', {
			id: role.guild.id,
			name: role.guild.name,
		});

		try {
			// ignore managed role
			if (role.managed) {
				transaction.setStatus('cancelled');
				transaction.finish();
				return;
			}

			await saveGuildRole(role);

			transaction.setStatus('ok');
		} catch (error) {
			console.log(error);

			transaction.setStatus('internal_error');

			Sentry.captureException(error);
		}

		transaction.finish();
	},
};

export default onRoleCreate;
