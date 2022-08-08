import { Client } from 'discord.js';

/**
 * Base bot module
 */
export default class BotModule {
	/**
	 * Bot client
	 */
	public readonly client: Client;

	constructor(client: Client) {
		this.client = client;
	}
}
