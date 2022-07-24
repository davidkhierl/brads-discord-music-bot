export default class BotCommandBuilderError extends Error {
	constructor(message?: string, cause?: Error) {
		super(message, { cause: cause });
		this.name = 'BotCommandBuilderError';
	}
}
