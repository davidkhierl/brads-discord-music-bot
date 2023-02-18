import { Module } from '@nestjs/common';

import { CommandService } from '@/core/command/command.service';

@Module({
  providers: [CommandService],
  exports: [CommandService],
})
export class CommandModule {}
