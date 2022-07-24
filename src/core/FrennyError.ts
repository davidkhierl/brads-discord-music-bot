export default class FrennyError extends Error {
	constructor(message?: string, cause?: Error) {
		super(message, { cause: cause });
		this.name = 'FrennyError';
	}
}
