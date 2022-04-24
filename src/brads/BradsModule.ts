import Bot from '../bot/Bot';

/**
 * BradsModule interface
 */
export interface IBradsModule {
	/**
	 * Main Bot instance
	 */
	readonly bot: Bot;
}

/**
 * Brads Module class
 */
export default class BradsModule implements IBradsModule {
	/**
	 * Main Bot instance
	 */
	readonly bot: Bot;

	/**
	 * Class for creating a Brads Module
	 */
	constructor() {
		this.bot = Bot.getInstance();
	}

	/**
	 * Function to initialize this module, make sure
	 * to implement all initialization on this method.
	 * This will be called when registering the module
	 */
	// eslint-disable-next-line no-empty-function
	register() {}
}
