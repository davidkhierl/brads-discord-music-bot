import Bot from '../bot/Bot';

export interface IBradsModule {
	readonly bot: Bot;
}

export default class BradsModule implements IBradsModule {
	readonly bot: Bot;

	constructor() {
		this.bot = Bot.getInstance();
	}

	// eslint-disable-next-line no-empty-function
	register() {}
}
