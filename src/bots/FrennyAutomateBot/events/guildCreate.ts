import { BotEventGuild } from '../../../core/BotWithCommands.js';
import saveNewGuild from '../../../services/saveNewGuild.js';
import { getFrennyAutomateBotInstance } from '../FrennyAutomateBot.js';

const guildCreate: BotEventGuild = {
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
