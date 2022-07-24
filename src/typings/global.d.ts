export {};

declare global {
	namespace NodeJS {
		interface ProcessEnv {
			NODE_ENV: string;
			DEPLOY_COMMANDS?: 'guild' | 'global';
			DISCORD_FRENNY_DJ_APP_ID: string;
			DISCORD_FRENNY_DJ_PUBKEY: string;
			DISCORD_FRENNY_DJ_BOT_TOKEN: string;
			DISCORD_FRENNY_AUTOMATE_APP_ID: string;
			DISCORD_FRENNY_AUTOMATE_PUBKEY: string;
			DISCORD_FRENNY_AUTOMATE_BOT_TOKEN: string;
			DISCORD_FRENNY_DEV_GUILD_ID: string;
			DISCORD_GUILD_ID: string;
			SENTRY_DSN: string;
		}

		interface Global {
			__rootdir__: string;
		}
	}
}
