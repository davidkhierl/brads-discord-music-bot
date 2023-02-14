import { ClientOptions } from 'discord.js';

/**
 * Bot module options.
 */
export interface BotModuleOptions {
  /**
   * Client options.
   */
  clientOptions: ClientOptions;
  /**
   * Bot token.
   */
  token: string;
  /**
   * Discord application id.
   */
  appId: string;
  /**
   * Enable autologin when the application starts.
   */
  autoLogin?: boolean;
}
