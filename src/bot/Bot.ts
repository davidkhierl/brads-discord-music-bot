import { Client, Intents } from 'discord.js';
import path from 'path';
import { GatewayServer, SlashCreator } from 'slash-create';

export default class Bot {
	private static instance: Bot;

	readonly client: Client;

	readonly creator: SlashCreator;

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

	public static getInstance(): Bot {
		if (!Bot.instance) {
			Bot.instance = new Bot();
		}

		return Bot.instance;
	}

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
