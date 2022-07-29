import { SENTRY_BOT_TAG, SENTRY_BOT_TRANSACTION } from '../utils/enums.js';
import * as Sentry from '@sentry/node';
import { Transaction, TransactionContext } from '@sentry/types';
import {
	ChatInputCommandInteraction,
	Client,
	ClientEvents,
	CommandInteraction,
} from 'discord.js';

export interface BotTransactionContext
	extends Omit<TransactionContext, 'name'> {
	bot?: string;
	op: keyof ClientEvents;
}
export interface BotCommandTransactionContext
	extends Omit<BotTransactionContext, 'op'> {
	op: string;
	user?: {
		id: string;
		username: string;
	};
}

export default class SentryHelper {
	/**
	 * Start bot command sentry transaction
	 * @param context BotCommandTransactionContext
	 * @returns Transaction
	 */
	public static startBotCommandTransaction({
		bot,
		user,
		...context
	}: BotCommandTransactionContext): Transaction {
		const transaction = Sentry.startTransaction({
			...context,
			name: SENTRY_BOT_TRANSACTION.BotCommand,
		});

		Sentry.configureScope((scope) => scope.setSpan(transaction));

		Sentry.setTag('bot', bot);

		Sentry.setTag(SENTRY_BOT_TAG.BotCommand, context.op);

		if (user)
			Sentry.setUser({
				id: user.id,
				username: user.username,
			});

		return transaction;
	}

	/**
	 * Start bot event sentry transaction
	 * @param context BotTransactionContext
	 * @returns Transaction
	 */
	public static startBotEventTransaction({
		bot,
		...context
	}: BotTransactionContext): Transaction {
		const transaction = Sentry.startTransaction({
			...context,
			name: SENTRY_BOT_TRANSACTION.BotEvent,
		});

		Sentry.configureScope((scope) => {
			scope.setSpan(transaction);
		});

		Sentry.setTag('bot', bot);

		Sentry.setTag(SENTRY_BOT_TAG.BotEvent, context.op);

		return transaction;
	}
}
