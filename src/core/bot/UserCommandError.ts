export interface UserCommandErrorOptions {
	description?: string;
	color?: number;
}

/**
 * Error caused by user initiating commands
 */
export default class UserCommandError extends Error {
	public description?: string;
	public color?: number;
	constructor(message?: string, options?: UserCommandErrorOptions) {
		super(message);
		this.description = options?.description;
		this.color = options?.color;
	}
}
