import { BotEvent } from '../../../core/BotWithCommands.js';
import Frenny from '../../../core/Frenny.js';
import FrennyAutomateBot from '../FrennyAutomateBot.js';

const ready: BotEvent = {
	name: 'ready',
	once: true,
	execute(client) {
		Frenny.spinner.succeed(FrennyAutomateBot.name, {
			textColor: 'green',
			prefixColor: 'green',
		});
	},
};

export default ready;
