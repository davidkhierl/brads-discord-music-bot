export {};

declare global {
	namespace NodeJS {
		interface ProcessEnv {
			NODE_ENV: string;
			DISCORD_CLIENT_ID: string;
			DISCORD_CLIENT_TOKEN: string;
			DISCORD_CLIENT_PUBKEY: string;
			DISCORD_GUILD_ID: string;
		}

		interface Global {
			__rootdir__: string;
		}
	}
}
