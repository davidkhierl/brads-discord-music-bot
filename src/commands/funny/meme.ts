import { CommandContext, SlashCommand, SlashCreator } from 'slash-create';

import axios from 'axios';

class meme extends SlashCommand {
	constructor(creator: SlashCreator) {
		super(creator, {
			name: 'meme',
			description: 'Drop a random meme',
		});
	}

	async run(ctx: CommandContext) {
		await ctx.defer();
		const gimme = await axios.get('https://meme-api.herokuapp.com/gimme');
		await ctx.send({ embeds: [{ image: { url: gimme.data.url } }] });
	}
}

export default meme;
