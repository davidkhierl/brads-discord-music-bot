import { Inject, Injectable } from '@nestjs/common';
import { Client } from 'discord.js';

import { BOT_MODULE_OPTIONS_TOKEN } from '@/core/bot/bot.module-definition';
import { BotModuleOptions } from '@/core/bot/definitions/types/bot-module-options.type';

@Injectable()
export class BotService {
  /**
   * Bot token, TEMPORARY
   * @deprecated This is temporary implementation.
   */
  private readonly token: string;

  private readonly client;

  constructor(
    @Inject(BOT_MODULE_OPTIONS_TOKEN)
    private readonly botModuleOptions: BotModuleOptions,
  ) {
    this.token = this.botModuleOptions.token;
    this.client = new Client(botModuleOptions.clientOptions);
  }

  // noinspection JSUnusedLocalSymbols
  private async onModuleInit() {
    if (this.botModuleOptions.autoLogin) await this.loginClient();
  }

  /**
   * Get bot client instance.
   * @return Client
   */
  getClient() {
    return this.client;
  }

  async loginClient() {
    await this.client.login(this.botModuleOptions.token);
  }

  /**
   * Get bot token, !!TEMPORARY!!
   * @deprecated This is temporary implementation.
   */
  getToken() {
    return this.token;
  }
}
