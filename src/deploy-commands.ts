import FrennyAutomateBot from './bots/FrennyAutomateBot/FrennyAutomateBot.js';
import FrennyDJBot from './bots/FrennyDJBot/FrennyDJBot.js';
import Frenny from './core/Frenny.js';

Frenny.setBotsCollection([new FrennyAutomateBot(), new FrennyDJBot()]);
Frenny.deployCommands();

// Frenny.setBotsCollection([new FrennyAutomateBot()]);
// import { REST } from '@discordjs/rest';
// import { Routes } from 'discord-api-types/v10';
// const rest = new REST({ version: '10' }).setToken(
// 	process.env.DISCORD_FRENNY_AUTOMATE_BOT_TOKEN
// );
// rest.put(
// 	Routes.applicationGuildCommands(
// 		process.env.DISCORD_FRENNY_AUTOMATE_APP_ID,
// 		process.env.DISCORD_FRENNY_DEV_GUILD_ID
// 	),
// 	{ body: [] }
// )
// 	.then(() => console.log('Successfully deleted all guild commands.'))
// 	.catch(console.error);

// import { REST } from '@discordjs/rest';
// import { Routes } from 'discord-api-types/v10';

// const rest = new REST({ version: '10' }).setToken(
// 	process.env.DISCORD_FRENNY_DJ_BOT_TOKEN
// );

// rest.put(
// 	Routes.applicationGuildCommands(
// 		process.env.DISCORD_FRENNY_DJ_APP_ID,
// 		process.env.DISCORD_FRENNY_DEV_GUILD_ID
// 	),
// 	{ body: [] }
// )
// 	.then(() => console.log('Successfully deleted all guild commands.'))
// 	.catch(console.error);
