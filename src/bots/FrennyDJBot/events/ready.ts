import { BotEvent } from '../../../core/BotWithCommands.js';
import Frenny from '../../../core/Frenny.js';
import FrennyDJBot from '../FrennyDJBot.js';

const ready: BotEvent = {
	name: 'ready',
	once: true,
	execute(client) {
		Frenny.spinner.succeed(FrennyDJBot.name, {
			textColor: 'green',
			prefixColor: 'green',
		});
	},
};

export default ready;
