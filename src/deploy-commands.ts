import FrennyAutomateBot from './bots/FrennyAutomateBot/FrennyAutomateBot.js';
import FrennyDJBot from './bots/FrennyDJBot/FrennyDJBot.js';
import Frenny from './core/Frenny.js';

Frenny.setBotsCollection([new FrennyAutomateBot(), new FrennyDJBot()]);

Frenny.deployCommands();
