import type { Member, MemberList } from '../../../types/members';
import { type Canvas } from 'fabric';
import { MemberCard } from '$lib/fabric/member-card';
import { getRenderedMemberCards, sortPerUsername } from '../members';

// This function takes in members that are to be shown on canvas and the canvas itself
// and renders/removes the card from canvas, while animating them as needed
// returns cards that are finally to be shown on canvas
export const renderMembers = (members: MemberList, canvas: Canvas) => {
	const membersUsernames = new Set(members.map((card) => card.username));

	const reRender = () => {
		canvas.renderAll();
	};

	// get currently shown cards on canvas
	const shownCards = getRenderedMemberCards(canvas);
	const shownUsernames = new Set(shownCards.map((card) => card.username));

	// new cards to be added to canvas
	const cardToAdd = new Array<Member>();

	// cards already present on canvas, that will be removed
	const cardsToRemove = new Array<MemberCard>();

	// cards already present on canvas, which need to be readjusted
	const cardsToStay = new Array<MemberCard>();

	for (let i = 0; i < members.length; i++) {
		const member = members[i];

		const isRendered = shownUsernames.has(member.username);

		if (!isRendered) {
			cardToAdd.push(member);
		}
	}

	for (let i = 0; i < shownCards.length; i++) {
		const card = shownCards[i];

		const shouldStay = membersUsernames.has(card.username);

		if (!shouldStay) {
			cardsToRemove.push(card);
		} else {
			cardsToStay.push(card);
		}
	}

	// all combined cards and members on cards, sorted before animation
	const finalCardsOnCanvas = [...cardsToStay, ...cardToAdd].sort(sortPerUsername);

	const addedCards = finalCardsOnCanvas.map((member, i) => {
		// if member is already present, then it will instance of MemberCard
		// we need to animate it to the right position from wherever it is
		if (member instanceof MemberCard) {
			member.animate(
				{
					top: i * 116 + 32,
					left: 32
				},
				{
					onChange: reRender,
					duration: 100
				}
			);
		} else {
			// if it's a member that needs to be added, create card and add to canvas
			const card = new MemberCard({
				member,
				reRender,
				options: {
					top: i * 116 + 32,
					left: 32,
					opacity: 0
				}
			});

			canvas.add(card);
			return card;
		}
	});

	// cards that are not needed should be removed with custom removeWithAnimation function
	cardsToRemove.forEach((card) => {
		card.removeWithAnimation(() => {
			canvas.remove(card);
		});
	});

	return addedCards;
};
