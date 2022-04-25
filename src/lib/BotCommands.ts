/* eslint-disable no-empty-function */
import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';

export default class BotCommands {
	readonly slash: SlashCommandBuilder;
	constructor() {
		this.slash = new SlashCommandBuilder();
	}

	async execute(interaction: CommandInteraction) {}
}
