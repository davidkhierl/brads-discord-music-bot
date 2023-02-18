import { Inject, Injectable } from '@nestjs/common';
import { Client } from 'discord.js';

import { BOT_MODULE_OPTIONS_TOKEN } from '@/core/bot/definitions/bot.module-definition';
import { BotModuleOptions } from '@/core/bot/definitions/types/bot-module-options.type';

@Injectable()
export class BotService {
  /**
   * Discord client.
   */
  readonly client: Client<boolean>;

  constructor(
    @Inject(BOT_MODULE_OPTIONS_TOKEN)
    private readonly botModuleOptions: BotModuleOptions,
  ) {
    this.client = new Client(botModuleOptions.clientOptions);
  }

  // noinspection JSUnusedLocalSymbols
  private async onModuleInit() {
    if (this.botModuleOptions.autoLogin)
      await this.client.login(this.botModuleOptions.token);
  }
}
