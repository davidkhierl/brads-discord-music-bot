import { Client, Intents } from 'discord.js';
import path from 'path';
import { GatewayServer, SlashCreator } from 'slash-create';

/**
 * Main Bot class
 */
export default class Bot {
	/**
	 * Bot instance
	 */
	private static instance: Bot;

	/**
	 * Discord Client
	 */
	readonly client: Client;

	/**
	 * Slash Creator instance for using commands and interactions.
	 */
	readonly creator: SlashCreator;

	/**
	 * Main Bot instance
	 */
	private constructor() {
		this.client = new Client({
			intents: [
				Intents.FLAGS.GUILDS,
				Intents.FLAGS.GUILD_MESSAGES,
				Intents.FLAGS.GUILD_VOICE_STATES,
			],
		});

		this.client.login(process.env.DISCORD_CLIENT_TOKEN);

		this.creator = new SlashCreator({
			applicationID: process.env.DISCORD_CLIENT_ID,
			publicKey: process.env.DISCORD_CLIENT_PUBKEY,
			token: process.env.DISCORD_CLIENT_TOKEN,
			client: this.client,
		});

		this.registerCommands();
	}

	/**
	 * Get the Bot instance
	 * @returns Bot instance
	 */
	public static getInstance(): Bot {
		if (!Bot.instance) {
			Bot.instance = new Bot();
		}

		return Bot.instance;
	}

	/**
	 * Register all slash commands inside src/commands folder
	 */
	private registerCommands() {
		this.creator
			.withServer(
				new GatewayServer((handler) =>
					this.client.ws.on('INTERACTION_CREATE', handler)
				)
			)
			.registerCommandsIn(path.join(__dirname, '../commands'))
			.syncCommands({ deleteCommands: true });
	}
}
