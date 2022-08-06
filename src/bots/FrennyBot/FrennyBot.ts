import Bot from '../../core/bot/Bot.js';
import Frenny from '../../core/bot/BotManager.js';
import dirResolver from '../../utils/dirResolver.js';
import { Client, IntentsBitField } from 'discord.js';

export default class FrennyBot extends Bot {
	constructor() {
		super({
			client: new Client({
				intents: [
					IntentsBitField.Flags.Guilds,
					IntentsBitField.Flags.GuildMembers,
				],
			}),
			commandsDir: dirResolver(import.meta.url, 'commands'),
			eventsDir: dirResolver(import.meta.url, 'events'),
			token: process.env.DISCORD_BOT_TOKEN,
			appId: process.env.DISCORD_APP_ID,
		});

		this.name = FrennyBot.name;
	}
}

/**
 * FrennyBot type guard
 * @param bot Bot
 * @returns boolean
 */
export function isFrennyBot(bot?: Bot): bot is FrennyBot {
	return bot instanceof FrennyBot;
}

/**
 * Get instance of FrennyBot from Frenny bots collection
 * @returns instance of FrennyBot
 */
export function getFrennyBotInstance(): FrennyBot {
	const instance = Frenny.bots.get(FrennyBot.name);

	if (!isFrennyBot(instance))
		throw new Error('No Instance of FrennyBot Found');

	return instance;
}
