import prisma from '../lib/prisma.js';
import { Command } from '@prisma/client';

/**
 * Save guild commands to database
 * @param commands Command[]
 * @return commands
 */
async function saveGuildCommands(commands: Command[]) {
	return await prisma.command.createMany({ data: commands });
}

export default saveGuildCommands;
