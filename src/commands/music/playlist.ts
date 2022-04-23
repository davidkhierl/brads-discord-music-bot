import {
	CommandContext,
	CommandOptionType,
	SlashCommand,
	SlashCreator,
} from 'slash-create';

import Music from '../../modules/Music/Music';

class playlist extends SlashCommand {
	constructor(creator: SlashCreator) {
		super(creator, {
			name: 'playlist',
			description: 'Play a playlist from youtube',
			options: [
				{
					name: 'url',
					description: 'Playlist URL from youtube to play',
					type: CommandOptionType.STRING,
					required: true,
				},
			],
		});
	}

	async run(ctx: CommandContext) {
		const music = new Music(ctx);

		await music.ctx.defer();

		await music.joinVoiceChannel();

		await music.ctx.sendFollowUp({
			content: '⏱ | Loading playlist...',
		});

		await music.queue.playlist(ctx.options.url).catch((reason) => {
			if (!music.guildQueue) music.queue.stop();
			if (reason) throw new Error(`❌ | Error: ${reason}`);
		});
	}
}

export default playlist;
