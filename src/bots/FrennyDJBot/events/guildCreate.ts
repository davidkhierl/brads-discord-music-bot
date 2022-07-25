import { BotEvent } from '../../../core/BotWithCommands.js';
import saveNewGuild from '../../../services/saveNewGuild.js';
import { getFrennyDJBotInstance } from '../FrennyDJBot.js';
import { Guild } from 'discord.js';

const guildCreate: BotEvent<Guild> = {
	name: 'guildCreate',
	execute: async (guild) => {
		try {
			await saveNewGuild(guild);

			const frennyDJBot = getFrennyDJBotInstance();

			frennyDJBot.deployCommandsToGuild(guild.id);
		} catch (error) {
			if (error instanceof Error) console.log(error);
		}
	},
};

export default guildCreate;
