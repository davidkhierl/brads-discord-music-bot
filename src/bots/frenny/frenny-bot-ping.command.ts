import { Injectable } from '@nestjs/common';

import { Command, CommandType } from '@/core/command/command.decorator';

@Command({
  name: 'ping',
  description: 'Replies with pong',
  type: CommandType.CHAT_INPUT,
})
@Injectable()
export class FrennyBotPingCommand {
  ping() {
    return Reflect.getMetadata('COMMAND_DECORATOR', this);
  }
}
