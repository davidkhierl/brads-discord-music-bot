import Discord from 'discord.js';

const Intents = Discord.Intents;

const client = new Discord.Client({
	intents: [
		Intents.FLAGS.GUILDS,
		Intents.FLAGS.GUILD_MESSAGES,
		Intents.FLAGS.GUILD_VOICE_STATES,
	],
});

export default client;
