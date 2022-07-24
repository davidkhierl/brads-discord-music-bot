import BotWithCommands from '../../core/BotWithCommands.js';
import Frenny from '../../core/Frenny.js';
import { Client } from 'discord.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default class FrennyAutomateBot extends BotWithCommands {
	constructor() {
		super({
			client: new Client({ intents: [] }),
			commandsDir: path.join(__dirname, 'commands'),
			eventsDir: path.join(__dirname, 'events'),
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
