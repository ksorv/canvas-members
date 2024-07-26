import type { Member } from '../../types/members';
import { type Canvas, FabricImage, FabricText, Rect } from 'fabric';
import { CustomFabricObjects } from '../../types/renderer';
import type { MemberCard } from '$lib/fabric/member-card';

// This function makes the four things we render on card -> rect, name, username & image
// As images are async and can't be added to group before they are loaded
// it returns a fn, setupAvatar, which sets up the image as per other card objects once its loaded
export const makeCardChildren = (member: Member) => {
	const container = new Rect({
		left: 0,
		top: 0,
		fill: '#84a38c60',
		rx: 4,
		ry: 4,
		width: 240,
		height: 100
	});

	const name = new FabricText(member.name, {
		left: container.left + 100,
		top: container.top + container.height / 2 - 12,
		fontSize: 16,
		originY: 'center',
		fontFamily: 'sans-serif',
		fill: 'black'
	});

	const username = new FabricText(`@${member.username}`, {
		left: container.left + 100,
		top: container.top + container.height / 2 + 12,
		fontSize: 16,
		originY: 'center',
		fontFamily: 'sans-serif',
		fill: 'black'
	});

	const size = 72;
	const avatar = FabricImage.fromURL(
		member.avatar,
		{ crossOrigin: 'anonymous' },
		{
			originY: 'center',
			objectCaching: true
		}
	);

	const setupAvatar = async (top = 0, left = 0) => {
		const image = await avatar;
		const padding = (container.height - size) / 2;
		image.scaleToWidth(size);
		image.scaleToHeight(size);

		image.top = top + size / 2 + padding;
		image.left = left + padding;

		return image;
	};

	return {
		container,
		name,
		username,
		setupAvatar
	};
};

// Simple function to return objects rendered on canvas with MemberCard id
export const getRenderedMemberCards = (canvas: Canvas) => {
	return canvas.getObjects().filter((obj) => {
		if ('id' in obj && typeof obj.id === 'string') {
			return obj.id.includes(CustomFabricObjects.MemberCard);
		}
	}) as Array<MemberCard>;
};

// Function to sort two items with username
export function sortPerUsername<T extends { username: string }>(a: T, b: T) {
	return a.username.localeCompare(b.username);
}
