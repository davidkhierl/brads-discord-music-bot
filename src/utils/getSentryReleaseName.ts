import dirResolver from '../helpers/dirResolver.js';
import { readFile } from 'node:fs/promises';

/**
 * Read the release name from text file.
 * @returns string
 */
async function getSentryReleaseName() {
	const releaseName = await readFile(
		dirResolver(import.meta.url, '../../sentry-release-name.txt'),
		'utf8'
	);

	return releaseName.trimEnd();
}

export default getSentryReleaseName;
