import BotWithCommands from '../../core/BotWithCommands.js';
import Frenny from '../../core/Frenny.js';
import dirResolver from '../../utils/dirResolver.js';
import { Client, IntentsBitField } from 'discord.js';

export default class FrennyAutomateBot extends BotWithCommands {
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
			token: process.env.DISCORD_FRENNY_AUTOMATE_BOT_TOKEN,
			appId: process.env.DISCORD_FRENNY_AUTOMATE_APP_ID,
		});

		this.name = FrennyAutomateBot.name;
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
 * @returns instance of FrennyAutomateBot
 */
export function getFrennyAutomateBotInstance(): FrennyAutomateBot {
	const instance = Frenny.bots.get(FrennyAutomateBot.name);

	if (!isFrennyAutomateBot(instance))
		throw new Error('No Instance of FrennyAutomateBot Found');

	return instance;
}
