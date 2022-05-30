import { useRef, useEffect, useImperativeHandle, forwardRef } from 'react';
import initCanvas from './init-canvas';
import draw from './draw';
import TextLayer from './text-layer';
import actions from '../../redux/slice';
import Menu from '../menu/menu';

export default forwardRef(Canvas);

const active = {
	editing: [],
	hovering: [],
	selected: [],
	altering: [],
};

function Canvas({ user_id, store, toggleUI }, ref) {
	const canvas_ref = useRef(null);

	useImperativeHandle(
		ref,
		() => ({
			onResize: () => onResize(canvas_ref.current, store, user_id),
		}),
		[canvas_ref, store, user_id]
	);

	useEffect(() => {
		const canvas: HTMLCanvasElement = canvas_ref.current;
		const context: CanvasRenderingContext2D = canvas.getContext('2d'); //, { alpha: false } makes it flash black but is more efficient?

		const { width, height } = canvas.getBoundingClientRect();
		canvas.width = width * window.devicePixelRatio;
		canvas.height = height * window.devicePixelRatio;

		// Just for console debugging
		(window as any).canvas = canvas;
		(window as any).context = context;

		window.addEventListener('resize', () => onResize(canvas, store, user_id));

		draw(context, store.getState().present, active, user_id);
		store.subscribe(() => draw(context, store.getState().present, active, user_id));
		(window as any).redraw = () => draw(context, store.getState().present, active, user_id);

		return initCanvas(canvas, user_id, store, active);
	}, [canvas_ref, store, user_id]);

	const svg = `
		<svg xmlns="http://www.w3.org/2000/svg" width='24' height='24' version="1.1" viewBox="0 0 100 100" stroke="white" stroke-width="4" >
			<path d="M 2 0 l 0 70 l 23 -15 l 32 -3 L 2 0" style="filter: drop-shadow( 2px 3px 2px)" />
		</svg>`;
	const cursor = `url("data:image/svg+xml,${encodeURIComponent(svg)}") 0 0, auto`;

	return (
		<div id="container">
			<TextLayer canvas={canvas_ref} user_id={user_id} store={store} />
			<canvas className="checkers" ref={canvas_ref} />

			<Menu element={canvas_ref} getContents={getContextMenu} props={{ active, toggleUI }} />
			<style jsx>{`
				#container {
					position: relative;
					height: calc(100vh - var(--nav-height) - var(--gap));
				}
				canvas {
					width: 100%;
					height: calc(100vh - var(--nav-height) - var(--gap));
					outline: none;
					cursor: ${cursor};
					border-radius: var(--radius);
				}
				.checkers {
					--checker-size: 8px;
					--checker-gradient: linear-gradient(45deg, var(--checker-color-1) 25%, transparent 0%, transparent 75%, var(--checker-color-1) 75%);
					background: var(--checker-color-2);
					background-image: var(--checker-gradient), var(--checker-gradient);
					background-position: 0 0, var(--checker-size) var(--checker-size);
					background-size: calc(var(--checker-size) * 2) calc(var(--checker-size) * 2);
				}
				canvas::after {
					content: 'Drop Here';
					position: absolute;
					background: red;
					display: block;
					width: 100px;
					height: 100px;
					background: #ff0000;
					margin-left: 5px;
				}
			`}</style>
		</div>
	);
}

let left = null;
function onResize(canvas, store, user_id) {
	const bounds = canvas.getBoundingClientRect();
	if (bounds.left === 0) return;
	if (left === null) {
		left = bounds.left;
		return setTimeout(() => onResize(canvas, store, user_id), 100);
	}
	canvas.width = bounds.width * window.devicePixelRatio;
	canvas.height = bounds.height * window.devicePixelRatio;
	store.dispatch(actions.view({ user_id, delta_x: (left - bounds.left) * 2 }));
	left = bounds.left;
}

function getContextMenu(event, { active, toggleUI }) {
	const element = active.hovering[0];
	return (
		<ul>
			{element && (
				<li onClick={() => console.log(element)}>
					Copy <span>⌘C</span>
				</li>
			)}

			<li onClick={() => console.log({ x: event.clientX, y: event.clientY })}>
				Paste <span>⌘V</span>
			</li>
			<div className="divider" />
			<li onClick={toggleUI}>Show / Hide UI</li>
			<li>Hello</li>
		</ul>
	);
}
