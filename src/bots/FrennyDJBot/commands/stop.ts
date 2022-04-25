import { CommandInteraction } from 'discord.js';
import BotCommands from '../../../lib/BotCommands';
import UserCommandError from '../../../utils/UserCommandError';
import Music from '../Music';

export default class stop extends BotCommands {
	constructor() {
		super();
		this.slash.setName('stop').setDescription('Stop playing music');
	}

	async execute(interaction: CommandInteraction): Promise<void> {
		if (!interaction.isCommand()) return;
		const music = new Music(interaction);

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
