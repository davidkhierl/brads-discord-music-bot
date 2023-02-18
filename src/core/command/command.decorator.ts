import { SlashCommandBuilder } from 'discord.js';

export enum CommandType {
  CHAT_INPUT = 'CHAT_INPUT',
}

export function Command(options: {
  name: string;
  description: string;
  type: CommandType;
}): ClassDecorator {
  const command = new SlashCommandBuilder()
    .setName(options.name)
    .setDescription(options.description);

  return (target) => {
    Reflect.defineMetadata('COMMAND_DECORATOR', command, target.prototype);
    return target;
  };
}
