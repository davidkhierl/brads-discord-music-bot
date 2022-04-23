import { Client } from 'discord.js';
import Bot from '../bot/Bot';
import BradsModule from './BradsModule';

export default class Brads {
	readonly client: Client;

	constructor() {
		this.client = Bot.getInstance().client;
	}

	public static registerModule(...modules: BradsModule[]) {
		modules.forEach((module) => module.register());
	}
}
