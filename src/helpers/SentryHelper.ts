import * as Sentry from '@sentry/node';
import { Transaction, TransactionContext } from '@sentry/types';
import { Client, ClientEvents, CommandInteraction } from 'discord.js';

export interface GuildEventTransactionContext
	extends Omit<TransactionContext, 'name'> {
	op: keyof ClientEvents;
	name?: string;
}

export default class SentryHelper {
	public static startCommandInteractionCreate(
		interaction: CommandInteraction,
		client: Client
	): Transaction {
		const transaction = Sentry.startTransaction({
			name: `${client.user?.username} [${interaction.commandName}] command`,
			op: 'command',
			tags: {
				bot: client.user?.username,
			},
		});

		Sentry.configureScope((scope) => scope.setSpan(transaction));

		Sentry.setUser({
			id: interaction.user.id,
			username: interaction.user.username,
		});

		return transaction;
	}

	public static startGuildEventTransaction({
		name = 'Guild Event',
		...context
	}: GuildEventTransactionContext): Transaction {
		const transaction = Sentry.startTransaction({ name, ...context });
		return transaction;
	}
}
