import BotWithCommands from '../../core/BotWithCommands.js';
import Frenny from '../../core/Frenny.js';
import dirResolver from '../../helpers/dirResolver.js';
import { Client } from 'discord.js';

export default class FrennyAutomateBot extends BotWithCommands {
	constructor() {
		super({
			client: new Client({ intents: [] }),
			commandsDir: dirResolver(import.meta.url, 'commands'),
			eventsDir: dirResolver(import.meta.url, 'events'),
			token: process.env.DISCORD_FRENNY_AUTOMATE_BOT_TOKEN,
			appId: process.env.DISCORD_FRENNY_AUTOMATE_APP_ID,
		});

		this.name = FrennyAutomateBot.name;
	}

	private events() {
		console.log('events');
	}
}

/**
 * FrennyAutomateBot type guard
 * @param bot BotWithCommands
 * @returns boolean
 */
export function isFrennyAutomateBot(
	bot?: BotWithCommands
): bot is FrennyAutomateBot {
	return bot instanceof FrennyAutomateBot;
}

/**
 * Get instance of FrennyAutomateBot from Frenny bots collection
 * @param frenny Frenny
 * @returns instance of FrennyAutomateBot
 */
export function getFrennyAutomateBotInstance(): FrennyAutomateBot {
	const instance = Frenny.bots.get(FrennyAutomateBot.name);

	if (!isFrennyAutomateBot(instance))
		throw new Error('No Instance of FrennyAutomateBot Found');

	return instance;
}
