import { Client } from 'discord.js';

/**
 * Base bot module
 */
export default class BotModule {
	/**
	 * Bot client
	 */
	public readonly client: Client<true>;

	constructor(client: Client<true>) {
		this.client = client;
	}
}
