export default class UserCommandError extends Error {
	constructor(message?: string, cause?: Error) {
		super(message, { cause: cause });
		this.name = 'UserCommandError';
	}
}
