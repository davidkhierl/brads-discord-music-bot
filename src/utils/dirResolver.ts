import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

function dirResolver(path: string, ...paths: string[]): string {
	const fileName = fileURLToPath(path);
	return join(dirname(fileName), ...paths);
}

export default dirResolver;
