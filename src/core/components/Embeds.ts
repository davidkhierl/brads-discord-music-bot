import { ColorResolvable, EmbedBuilder, EmbedData } from 'discord.js';

export interface EmbedContent extends EmbedData {
	title: string;
}

function EmbedMessage(content: EmbedContent) {
	return new EmbedBuilder(content);
}

function InfoMessage(content: EmbedContent) {
	return EmbedMessage({
		color: 0x049cf3,
		...content,
	});
}

function SuccessMessage(content?: Partial<EmbedContent>) {
	return EmbedMessage({
		title: 'Success!',
		color: 0x04f308,
		...content,
	});
}

function ErrorMessage(content?: Partial<EmbedContent>) {
	return EmbedMessage({
		title: 'Something went wrong while executing this command',
		color: 0xff0000,
		...content,
	});
}

const Embeds = { ErrorMessage, InfoMessage, SuccessMessage };

export default Embeds;
