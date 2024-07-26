import {
	type GroupProps,
	Group,
	type Rect,
	type TPointerEvent,
	util
} from 'fabric';
import type { Member } from '../../types/members';
import { makeCardChildren } from '../../utils/fabric/members';
import { CustomFabricObjects } from '../../types/renderer';

interface MemberCardArgs {
	member: Member;
	reRender: () => void;
	options: Partial<GroupProps>;
}

export class MemberCard extends Group {
	public readonly username: string;
	private readonly url: string;
	private readonly reRender: () => void;
	private mousedown = false;
	private dragged = false;
	public readonly id: string;

	constructor({ member, reRender, options }: MemberCardArgs) {
		// let's make the items needed to make a card
		const { setupAvatar, container, name, username } = makeCardChildren(member);

		// set up the card with rect container, name and username
		// we cant add the image yet since it might not be loaded yet
		super([container, name, username], {
			...options,
			selectable: true,
			hasControls: false,
			hasBorders: false,
			objectCaching: true,
		});

		this.url = member.url;
		this.username = member.username;
		this.reRender = reRender;
		this.id = CustomFabricObjects.MemberCard;
		this.setup(container);

		// using the setupAvatar function, add image to the group after its loaded
		setupAvatar(options.top || 0, options.left || 0).then((image) => {
			this.add(image);
			this.renderCache();

			// we only want to animate once the image is loaded
			// if we do it before that, image won't be able to figure out the position of group
			this.animate(
				{
					opacity: 1,
					left: 32
				},
				{
					// re-render as items are animating with opacity
					onChange: reRender
				}
			);
		});
	}

	setup(container: Rect) {
		// MouseOver - we want to show border
		this.on('mouseover', this.onMouseOver.bind(this, container));

		// MouseOut - we want to hide border
		this.on('mouseout', this.onMouseOut.bind(this, container));

		this.on('mousedown', this.onMouseDown.bind(this));

		// Move: drag with animation
		this.on('mousemove', this.onMouseMove.bind(this));

		// Click - Take user to GitHub URL
		this.on('mouseup', this.onMouseUp.bind(this));
	}

	removeWithAnimation(onComplete: () => void) {
		// to remove with animation, we reduce opacity to 0 and move item to the left a bit
		// re-render because opacity is changing,
		// when animation completes, we remove the element listeners,
		// and hand back control to whoever is removing the element
		this.animate(
			{
				opacity: 0,
				left: -32
			},
			{
				onChange: this.reRender,
				onComplete: () => {
					super.remove();
					onComplete();
				}
			}
		);
	}

	markMousedown(down: boolean) {
		this.mousedown = down;
	}

	markDragged(drag: boolean) {
		this.dragged = drag;
	}

	onMouseOver(container: Rect, { e }: { e: TPointerEvent }) {
		const event = e as MouseEvent;

		// this is for canvas
		if (event.altKey) {
			return;
		}

		container.stroke = '#84a38c';
		container.strokeWidth = 2;

		// need to re-render because cache doesn't have a border
		this.reRender();
	}

	onMouseOut(container: Rect, { e }: { e: TPointerEvent }) {
		const event = e as MouseEvent;
		// this is for canvas
		if (event.altKey) {
			return;
		}

		container.stroke = '';
		container.strokeWidth = 0;
		this.reRender();
	}

	onMouseDown({ e }: { e: TPointerEvent }) {
		const event = e as MouseEvent;

		// this is for canvas
		if (event.altKey) {
			return;
		}
		this.markMousedown(true);
	}

	onMouseMove({ e }: { e: TPointerEvent }) {
		const event = e as MouseEvent;

		// we dont register the mousedown when ALT is pressed so no check here
		if (this.mousedown) {
			this.markDragged(true);

			this.animate(
				{
					x: event.clientX,
					y: event.clientY
				},
				{
					// here since we are just using the already rendered item, no need to render whole canvas
					onChange: this.renderCache.bind(this),
					easing: util.ease.easeInOutCubic
				}
			);
		}
	}

	onMouseUp({ e }: { e: TPointerEvent }) {
		const event = e as MouseEvent;

		// this is for canvas
		if (event.altKey) {
			return;
		}

		if (this.dragged) {
			this.markMousedown(false);
			this.markDragged(false);
			return;
		}

		this.markMousedown(false);
		// open member in new tab when clicked
		window.open(this.url, '_blank');
	}

	toString(): string {
		const rectString = super.toString();
		// we can just use username as it's unique on GitHub
		return `Rect:${rectString} Member: ${this.username}`;
	}
}
