/* eslint-disable no-empty-function */
import { SlashCommandBuilder } from '@discordjs/builders';
import { ChatInputCommandInteraction } from 'discord.js';

export interface BotCommandBuilderOptions {
	deferReply?: boolean;
	ephemeral?: boolean;
}

export default class BotCommandBuilder {
	/**
	 * Slash command builder
	 */
	public readonly slash: SlashCommandBuilder;

	public readonly deferReply?: boolean;

	public readonly ephemeral?: boolean;

	constructor(options?: BotCommandBuilderOptions) {
		this.slash = new SlashCommandBuilder();
		this.deferReply = options?.deferReply;
		this.ephemeral = options?.ephemeral;
	}

	async execute(interaction: ChatInputCommandInteraction) {}
}
