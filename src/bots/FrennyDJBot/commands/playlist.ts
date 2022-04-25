import { CommandInteraction, CacheType } from 'discord.js';
import BotCommands from '../../../lib/BotCommands';
import Music from '../Music';

export default class playlist extends BotCommands {
	constructor() {
		super();
		this.slash
			.setName('playlist')
			.setDescription('Play a playlist from YouTube')
			.addStringOption((option) =>
				option
					.setName('url')
					.setDescription(
						'The YouTube URL of the the playlist you wanted to play.'
					)
					.setRequired(true)
			);
	}

	async execute(interaction: CommandInteraction<CacheType>): Promise<void> {
		if (!interaction.isCommand()) return;

		const music = new Music(interaction);

		await music.joinVoiceChannel();

		await music.interaction.followUp({
			content: '⏱ | Loading playlist...',
			ephemeral: true,
		});

		await music.queue
			.playlist(interaction.options.getString('url', true))
			.catch((error) => {
				if (!music.guildQueue) music.queue.stop();
				if (error instanceof Error)
					throw new Error(error.message, { cause: error.cause });
			});

		await music.interaction.followUp({
			content:
				'💿 | Playlist added to the queue, Enjoy your playlist! 🎧',
		});
		return;
	}
}
