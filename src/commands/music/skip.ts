import { CommandContext, SlashCommand, SlashCreator } from 'slash-create';
import Music from '../../modules/Music/Music';

class skip extends SlashCommand {
	constructor(creator: SlashCreator) {
		super(creator, {
			name: 'skip',
			description: 'Skip to the current song',
		});
	}

	async run(ctx: CommandContext) {
		const music = new Music(ctx);

		await music.ctx.defer();

		if (!music.guildQueue || !music.guildQueue.isPlaying)
			return void ctx.sendFollowUp({
				content: '❌ | No music is being played!',
			});

		const currentTrack = music.guildQueue.songs[0];

		const song = music.guildQueue.skip();

		return void ctx.sendFollowUp({
			content: song
				? `✅ | Skipped **${currentTrack}**!`
				: '❌ | Something went wrong!',
		});
	}
}

export default skip;
