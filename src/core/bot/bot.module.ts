import { DynamicModule, Module } from '@nestjs/common';

import { BotService } from '@/core/bot/bot.service';
import {
  ASYNC_BOT_MODULE_OPTIONS_TYPE,
  BOT_MODULE_OPTIONS_TYPE,
  ConfigurableBotModuleClass,
} from '@/core/bot/definitions/bot.module-definition';
import { CommandModule } from '@/core/command/command.module';

@Module({
  imports: [CommandModule],
  providers: [BotService],
  exports: [BotService],
})
export class BotModule extends ConfigurableBotModuleClass {
  static register(options: typeof BOT_MODULE_OPTIONS_TYPE): DynamicModule {
    return {
      ...super.register(options),
    };
  }

  static registerAsync(
    options: typeof ASYNC_BOT_MODULE_OPTIONS_TYPE,
  ): DynamicModule {
    return {
      ...super.registerAsync(options),
    };
  }
}
