import { BotEvent } from '../../../core/BotWithCommands.js';
import saveNewGuild from '../../../services/saveNewGuild.js';
import { getFrennyAutomateBotInstance } from '../FrennyAutomateBot.js';
import { Guild } from 'discord.js';

const guildCreate: BotEvent<Guild> = {
	name: 'guildCreate',
	execute: async (guild) => {
		try {
			await saveNewGuild(guild);

			const frennyAutomateBot = getFrennyAutomateBotInstance();

			frennyAutomateBot.deployCommandsToGuild(guild.id);
		} catch (error) {
			if (error instanceof Error) console.log(error);
		}
	},
};

export default guildCreate;
