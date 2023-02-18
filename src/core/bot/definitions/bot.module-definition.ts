import { ConfigurableModuleBuilder } from '@nestjs/common';

import { BotModuleOptions } from '@/core/bot/definitions/types/bot-module-options.type';

export const {
  ConfigurableModuleClass: ConfigurableBotModuleClass,
  MODULE_OPTIONS_TOKEN: BOT_MODULE_OPTIONS_TOKEN,
  OPTIONS_TYPE: BOT_MODULE_OPTIONS_TYPE,
  ASYNC_OPTIONS_TYPE: ASYNC_BOT_MODULE_OPTIONS_TYPE,
} = new ConfigurableModuleBuilder<BotModuleOptions>().build();
