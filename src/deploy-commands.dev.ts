import FrennyDJBot from './bots/FrennyDJBot/FrennyDJBot';

/**
 * Deploy Frenny DJ Bot commands to
 * Frenny Development Guild
 */
FrennyDJBot.deployCommandsToGuild(
	process.env.DISCORD_FRENNY_DEV_GUILD_ID,
	() => {
		console.log('Successfully deployed command');
	}
);
