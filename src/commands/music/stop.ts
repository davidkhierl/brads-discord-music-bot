import { CommandContext, SlashCommand, SlashCreator } from 'slash-create';
import Music from '../../modules/Music/Music';

class stop extends SlashCommand {
	constructor(creator: SlashCreator) {
		super(creator, {
			name: 'stop',
			description: 'Stops playing the Music and cleans the Queue',
		});
	}

	async run(ctx: CommandContext) {
		const music = new Music(ctx);

		await music.ctx.defer();

		if (!music.queue.isPlaying)
			return void ctx.sendFollowUp({
				content: '❌ | No music is being played!',
			});

		music.queue.stop();

		return void ctx.sendFollowUp({
			content: '🛑 | Stopped the player!',
		});
	}
}

export default stop;
