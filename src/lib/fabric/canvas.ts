import { Canvas, Point, type TPointerEventInfo } from 'fabric';
import type { CanvasOptions } from 'fabric';

interface ZoomArgs {
	x: number;
	y: number;
	zoom?: number;
}

// A layer over fabric.Canvas which sets up Pan, Zoom, Resize on the canvas
export class CustomCanvas extends Canvas {
	private readonly minZoom = 0.25;
	private readonly maxZoom = 4;
	private isDragging = false;
	private lastPosX = 0;
	private lastPosY = 0;

	constructor(canvas: HTMLCanvasElement, options: Partial<CanvasOptions>) {
		super(canvas, options);

		this.setup();
	}

	private resize() {
		this.set('width', window.innerWidth);
		this.set('height', window.innerWidth - 50);
		this.renderAll();
	}

	private zoom({ x, y, zoom = 0 }: ZoomArgs) {
		if (zoom > this.maxZoom) zoom = this.maxZoom;
		if (zoom < this.minZoom) zoom = this.minZoom;

		const zoomPoint = new Point({
			x,
			y
		});
		this.zoomToPoint(zoomPoint, zoom);
	}

	public zoomIn() {
		let zoom = this.getZoom();
		zoom += 0.5;

		this.zoom({
			x: 0,
			y: 0,
			zoom
		});
	}

	public zoomOut() {
		let zoom = this.getZoom();
		zoom -= 0.5;

		this.zoom({
			x: 0,
			y: 0,
			zoom
		});
	}

	public resetZoom() {
		this.zoom({
			x: 0,
			y: 0,
			zoom: 1
		});
	}

	private handleZoomEvent({ e: event }: TPointerEventInfo<WheelEvent>) {
		event.preventDefault();
		event.stopPropagation();

		const delta = event.deltaY;
		let zoom = this.getZoom();

		zoom *= 0.999 ** delta;

		this.zoom({
			x: event.clientX,
			y: event.clientY,
			zoom
		});
	}

	private handleMouseDownEvent({ e }: TPointerEventInfo) {
		const event = e as MouseEvent;
		if (event.altKey) {
			this.isDragging = true;
			this.selection = false;
			this.lastPosX = event.clientX;
			this.lastPosY = event.clientY;
		}
	}

	private handleMouseMoveEvent({ e }: TPointerEventInfo) {
		const event = e as MouseEvent;
		if (this.isDragging) {
			const vpt = this.viewportTransform;
			vpt[4] += event.clientX - this.lastPosX;
			vpt[5] += event.clientY - this.lastPosY;
			this.requestRenderAll();
			this.lastPosX = event.clientX;
			this.lastPosY = event.clientY;
		}
	}

	private handleMouseUpEvent() {
		this.setViewportTransform(this.viewportTransform);
		this.isDragging = false;
		this.selection = true;
	}

	private setup() {
		// handle mouse scroll event
		this.on('mouse:wheel', this.handleZoomEvent.bind(this));

		this.on('mouse:down', this.handleMouseDownEvent.bind(this));
		this.on('mouse:move', this.handleMouseMoveEvent.bind(this));
		this.on('mouse:up', this.handleMouseUpEvent.bind(this));

		// attach event listener for window resize
		window.addEventListener('resize', this.resize.bind(this));
	}

	public destroy() {
		window.removeEventListener('resize', this.resize.bind(this));
		super.destroy();
	}
}
