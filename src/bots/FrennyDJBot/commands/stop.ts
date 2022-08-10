import { UserCommandError } from '../../../core/bot/Bot.js';
import BotCommandBuilder from '../../../core/bot/BotCommandBuilder.js';
import FrennyDJBot from '../FrennyDJBot.js';
import Music from '../Music.js';
import { CommandInteraction } from 'discord.js';

export default class stop extends BotCommandBuilder {
	constructor() {
		super({ deferReply: true, ephemeral: true });
		this.slash.setName('stop').setDescription('Stop playing music');
	}

	async execute(interaction: CommandInteraction): Promise<void> {
		if (!interaction.isChatInputCommand()) return;

		const music = new Music(interaction, FrennyDJBot.player);

		await music.interaction.followUp({
			content: '⏱ | Stopping music',
			ephemeral: true,
		});

		if (!music.queue.isPlaying)
			throw new UserCommandError(
				'🥱 | No music is being played my frenny!'
			);

		music.queue.stop();

		await music.interaction.followUp({
			content: '🛑 | Music stopped!',
		});

		return;
	}
}
