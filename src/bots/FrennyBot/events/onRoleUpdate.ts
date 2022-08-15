import { BotEventModule } from '../../../core/bot/Bot.js';
import SentryHelper from '../../../helpers/SentryHelper.js';
import updateGuildRole from '../../../services/updateGuildRole.js';
import * as Sentry from '@sentry/node';
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
		const transaction = SentryHelper.startBotEventTransaction({
			op: 'roleUpdate',
		});

		Sentry.setContext('role', {
			id: newRole.id,
			name: newRole.name,
			managed: newRole.managed,
		});

		Sentry.setContext('guild', {
			id: newRole.guild.id,
			name: newRole.guild.name,
		});

		try {
			// ignore managed role
			if (newRole.managed) {
				transaction.setStatus('cancelled');
				SentryHelper.finishTransaction(transaction);
				return;
			}
			await updateGuildRole(newRole);

			transaction.setStatus('ok');
		} catch (error) {
			if (error instanceof Error) console.log(error);

			transaction.setStatus('internal_error');

			Sentry.captureException(error);
		}

		SentryHelper.finishTransaction(transaction);
	},
};

// noinspection JSUnusedGlobalSymbols
export default onRoleUpdate;
