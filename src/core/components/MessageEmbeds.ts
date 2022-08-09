import { EmbedBuilder, EmbedData } from 'discord.js';

export enum MESSAGE_EMBED_COLORS {
	info = 0x049cf3,
	success = 0x04f308,
	error = 0xff0000,
	warning = 0xffbf00,
}

export interface EmbedContent extends EmbedData {
	title: string;
}
function EmbedMessage(content: EmbedContent) {
	return new EmbedBuilder(content);
}

function Info(content: EmbedContent) {
	return EmbedMessage({
		color: MESSAGE_EMBED_COLORS.info,
		...content,
	});
}

function Success(content?: Partial<EmbedContent>) {
	return EmbedMessage({
		title: '🥳   Success!',
		color: MESSAGE_EMBED_COLORS.success,
		...content,
	});
}

function Error(content?: Partial<EmbedContent>) {
	return EmbedMessage({
		title: '🥵   Something went wrong while executing this command',
		color: MESSAGE_EMBED_COLORS.error,
		...content,
	});
}

function Warning(content?: Partial<EmbedContent>) {
	return EmbedMessage({
		title: '😯   Wait hold up! there might be an error happened',
		color: MESSAGE_EMBED_COLORS.warning,
		...content,
	});
}

const MessageEmbeds = {
	Error,
	Info,
	Success,
	Warning,
};

export default MessageEmbeds;
