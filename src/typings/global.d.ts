export {};

declare global {
	namespace NodeJS {
		interface ProcessEnv {
			NODE_ENV: string;
			DISCORD_FRENNY_DJ_APP_ID: string;
			DISCORD_FRENNY_DJ_PUBKEY: string;
			DISCORD_FRENNY_DJ_BOT_TOKEN: string;
			DISCORD_FRENNY_DEV_GUILD_ID: string;
			DISCORD_GUILD_ID: string;
		}

		interface Global {
			__rootdir__: string;
		}
	}
}
