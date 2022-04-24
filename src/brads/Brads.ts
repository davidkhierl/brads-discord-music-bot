import { Client } from 'discord.js';
import Bot from '../bot/Bot';
import BradsModule from './BradsModule';

/**
 * Brads class
 */
export default class Brads {
	/**
	 * Bot Client
	 */
	readonly client: Client;

	/**
	 * Main Brads discord bot instance
	 */
	constructor() {
		this.client = Bot.getInstance().client;
	}

	/**
	 * Register and enables a Brads Module
	 * @param modules Bot modules and functionalities
	 */
	public static registerModule(...modules: BradsModule[]) {
		modules.forEach((module) => module.register());
	}
}
