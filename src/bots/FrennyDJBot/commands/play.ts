import { CommandInteraction } from 'discord.js';
import BotCommands from '../../../lib/BotCommands';
import Music from '../Music';

export default class play extends BotCommands {
	constructor() {
		super();
		this.slash
			.setName('play')
			.setDescription('Play a song from YouTube')
			.addStringOption((option) =>
				option
					.setName('song')
					.setDescription(
						'The song name you want to play. you can also paste a link from YouTube!'
					)
					.setRequired(true)
			);
	}

	async execute(interaction: CommandInteraction): Promise<void> {
		if (!interaction.isCommand()) return;

		const music = new Music(interaction);

		await music.joinVoiceChannel();

		await music.interaction.followUp({
			content: `⏱ | Loading track... **[${interaction.options.getString(
				'song'
			)}]**`,
			ephemeral: true,
		});

		await music.queue
			.play(interaction.options.getString('song', true))
			.catch((error) => {
				if (!music.guildQueue) music.queue.stop();
				if (error instanceof Error)
					throw new Error(error.message, { cause: error.cause });
			});

		await music.interaction.followUp({
			content: '💿 | Track added to the queue, Enjoy your music! 🎧',
		});
		return;
	}
}
