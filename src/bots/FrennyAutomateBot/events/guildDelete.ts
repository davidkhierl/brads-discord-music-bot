import { BotEvent } from '../../../core/BotWithCommands.js';
import deleteGuild from '../../../services/deleteGuild.js';
import { Guild } from 'discord.js';

const guildCreate: BotEvent<Guild> = {
	name: 'guildDelete',
	execute: async (guild) => {
		try {
			await deleteGuild(guild);

			// const frennyAutomateBot = getFrennyAutomateBotInstance();

			// frennyAutomateBot.deployCommandsToGuild(guild.id);
		} catch (error) {
			if (error instanceof Error) console.log(error);
		}
	},
};

export default guildCreate;
