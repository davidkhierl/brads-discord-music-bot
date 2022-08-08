import FrennyBot from './bots/FrennyBot/FrennyBot.js';
import BotManager from './core/bot/BotManager.js';

BotManager.setBotsCollection([new FrennyBot()]);
await BotManager.deployCommands();
