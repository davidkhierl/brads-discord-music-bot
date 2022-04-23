import {
	CommandContext,
	CommandOptionType,
	SlashCommand,
	SlashCreator,
} from 'slash-create';
import Music from '../../modules/Music/Music';

class play extends SlashCommand {
	constructor(creator: SlashCreator) {
		super(creator, {
			name: 'play',
			description: 'Play a song from youtube',
			options: [
				{
					name: 'song',
					description: 'Song name or URL from youtube to play',
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
			content: `⏱ | Loading track... **[ ${ctx.options.song} ]**`,
		});

		await music.queue.play(ctx.options.song).catch((reason) => {
			if (!music.guildQueue) music.queue.stop();
			if (reason) throw new Error(`❌ | Error: ${reason}`);
		});

		return;
	}
}

export default play;
