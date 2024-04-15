import type { FrameValidationData } from '@coinbase/onchainkit';

export function getWarpcastUrl(cast: FrameValidationData['raw']['action']['cast']) {
	return `https://warpcast.com/${cast.author.username}/${cast.hash.slice(0, 10)}`;
}
