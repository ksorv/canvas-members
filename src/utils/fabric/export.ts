import type { Canvas } from 'fabric';
import { getRenderedMemberCards } from './members';
import { dataURItoBlob } from '../download';

// this cache contains username --> blob url map
// for now this seems like a good solution
// later on we can move it to localstorage ig
const cardCache = new Map<string, string>();

// This function takes canvas
// filters out the current shown cards, checks if image is already stored in cache & returns
// else it creates an image blob url and stores that to cache, returning the same
export const exportCards = (canvas: Canvas) => {
	const shownCards = getRenderedMemberCards(canvas);

	return shownCards.map((card) => {
		if (cardCache.has(card.username)) {
			return {
				username: card.username,
				url: cardCache.get(card.username)!
			};
		}

		const img = card.toDataURL({
			format: 'jpeg',
			quality: 100,
			multiplier: 2,
			enableRetinaScaling: true
		});
		const blob = dataURItoBlob(img)

		const url = URL.createObjectURL(blob);

		cardCache.set(card.username, url);

		return {
			username: card.username,
			url,
		};
	});
};