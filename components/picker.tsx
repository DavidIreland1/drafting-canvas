import { useState } from 'react';
import Cross from './icons/cross';
import { clamp } from '../utils/utils';
import { useSelector } from 'react-redux';
import { flatten } from './elements/elements';

export default function Picker({ setProperty, prop_type, prop_id, event, setPicker, children }) {
	const [picker_position, setPickerPosition] = useState({ x: event.clientX - 350, y: event.clientY - 80 });
	const dragPicker = (down_event) => {
		if (down_event.target.id !== 'container' && down_event.target.id !== 'header' && down_event.target.id !== 'name') return;
		down_event.preventDefault();
		down_event.target.setPointerCapture(down_event.pointerId);
		const offset_x = picker_position.x - down_event.clientX;
		const offset_y = picker_position.y - down_event.clientY;
		const move = (move_event) => setPickerPosition({ x: move_event.clientX + offset_x, y: Math.max(move_event.clientY + offset_y, 0) });
		down_event.target.addEventListener('pointermove', move);
		down_event.target.addEventListener(
			'pointerup',
			() => {
				down_event.target.removeEventListener('pointermove', move);
				down_event.target.releasePointerCapture(down_event.pointerId);
			},
			{ once: true }
		);
	};

	const property = useSelector((state) => {
		return flatten((state as any).present.elements)
			.filter((element) => element.selected)
			.filter((element) => element.type !== 'group')
			.map((element) => element[prop_type])
			.flat()
			.find((prop) => prop.id === prop_id);
	});

	if (typeof property === 'undefined') {
		// Kinda werid
		setTimeout(() => setPicker(null), 10);
		return null;
	}

	const drag = (down_event, id, callback) => {
		down_event.preventDefault();
		down_event.target.setPointerCapture(down_event.pointerId);
		const element = down_event.nativeEvent.composedPath().find((element) => element.id === id);
		const move = (move_event) => callback(move_event, element.getBoundingClientRect());
		move(down_event);
		down_event.target.addEventListener('pointermove', move);
		down_event.target.addEventListener(
			'pointerup',
			() => {
				down_event.target.releasePointerCapture(down_event.pointerId);
				down_event.target.removeEventListener('pointermove', move);
			},
			{ once: true }
		);
	};

	const hsba = property.color;

	const dragFade = (down_event) => {
		drag(down_event, 'fade', (move_event, bounds) => {
			const saturation = clamp(0, move_event.clientX - bounds.x - 8, bounds.width - 14);
			const brightness = clamp(0, move_event.clientY - bounds.y - 16, bounds.height - 14);
			setColor(hsba[0] * slider_width, saturation, brightness, hsba[3] * slider_width);
		});
	};

	const dragHue = (down_event) => {
		drag(down_event, 'hue', (move_event, bounds) => {
			const new_hue = clamp(0, move_event.clientX - bounds.x - 8, bounds.width - 14);
			setColor(new_hue, hsba[1] * fade_width, (1 - hsba[2]) * fade_width, hsba[3] * slider_width);
		});
	};

	const dragAlpha = (down_event) => {
		drag(down_event, 'checkers', (move_event, bounds) => {
			const new_aplha = clamp(0, move_event.clientX - bounds.x - 8, bounds.width - 14);
			setColor(hsba[0] * slider_width, hsba[1] * fade_width, (1 - hsba[2]) * fade_width, new_aplha);
		});
	};

	const fade_width = 286;
	const slider_width = 266;

	function setColor(hue, saturation, brightness, aplha) {
		const h = hue / slider_width;
		const s = saturation / fade_width;
		const b = 1 - brightness / fade_width;
		const a = aplha / slider_width;

		setProperty({ ...property, color: [h, s, b, a] });
	}

	return (
		<div id="container" onPointerDown={dragPicker}>
			<div id="header">
				{children}
				<Cross onClick={() => setPicker(null)} />
			</div>

			<div id="fade" onPointerDown={dragFade}>
				<div id="fade-handle" className="handle"></div>
			</div>
			<div id="hue" className="slider" onPointerDown={dragHue}>
				<div id="hue-handle" className="handle"></div>
			</div>

			<div id="checkers" className="slider" onPointerDown={dragAlpha}>
				<div id="aplha" className="slider" />
				<div id="aplha-handle" className="handle"></div>
			</div>

			<div id="hsla">
				<div>hsba</div>
				<div>{Math.round(hsba[0] * 360)}</div>
				<div>{Math.round(hsba[1] * 100)}</div>
				<div>{Math.round(hsba[2] * 100)}</div>
				<div>{Math.round(hsba[3] * 100)}%</div>
			</div>

			<style jsx>{`
				#header {
					display: grid;
					grid-template-columns: min-content 30px;
					padding: 0 10px;
					justify-content: space-between;
				}
				#name {
					margin: auto 0;
				}
				#hsla {
					display: grid;
					grid-auto-flow: column;
					width: 100%;
					color: var(--text-color);
					padding: 0 20px;
					box-sizing: border-box;
				}
				#container {
					position: absolute;
					z-index: 7;

					padding: 10px 0 20px 0;
					background: var(--panel);

					top: ${picker_position.y}px;
					left: min(${picker_position.x}px, calc(100vw - 300px));

					box-shadow: 0 0 10px black;

					display: grid;
					grid-gap: 10px;
				}

				#fade {
					position: relative;
					width: 300px;
					height: 300px;
					background: -webkit-linear-gradient(top, hsla(0, 0%, 0%, 0) 0%, hsl(0, 0%, 0%) 100%), -webkit-linear-gradient(left, hsl(0, 0%, 100%) 0%, hsla(0, 0%, 0%, 0) 100%);
					background: -moz-linear-gradient(top, hsla(0, 0%, 0%, 0) 0%, hsl(0, 0%, 0%) 100%), -moz-linear-gradient(left, hsl(0, 0%, 100%) 0%, hsla(0, 0%, 0%, 0) 100%);
					background: -ms-linear-gradient(top, hsla(0, 0%, 0%, 0) 0%, hsl(0, 0%, 0%) 100%), -ms-linear-gradient(left, hsl(0, 0%, 100%) 0%, hsla(0, 0%, 0%, 0) 100%);
					background: -o-linear-gradient(top, hsla(0, 0%, 0%, 0) 0%, hsl(0, 0%, 0%) 100%), -o-linear-gradient(left, hsl(0, 0%, 100%) 0%, hsla(0, 0%, 0%, 0) 100%);
					background-color: hsl(${hsba[0] * 360}, 100%, 50%);
				}
				#fade-handle {
					top: ${fade_width - hsba[2] * fade_width}px;
					left: ${hsba[1] * fade_width}px;
				}
				.handle {
					position: absolute;
					width: 14px;
					height: 14px;
					border-radius: 14px;
					border: 1px solid black;
					box-sizing: border-box;
					z-index: 2;
					background-color: hsb(${hsba[0] * 360}, ${hsba[1] * 100}%, ${hsba[2] * 100}%);
				}
				.handle::before {
					position: absolute;
					content: ' ';
					width: 12px;
					height: 12px;
					border: 1px solid white;
					border-radius: 14px;
					box-sizing: border-box;
					z-index: 1;
				}
				.slider {
					margin: 0 10px;
					width: 280px;
					height: 14px;
					position: relative;
					border-radius: 14px;
				}
				#hue {
					background: -moz-linear-gradient(left, #f00 0%, #ff0 16.66%, #0f0 33.33%, #0ff 50%, #00f 66.66%, #f0f 83.33%, #f00 100%);
					background: -webkit-linear-gradient(left, #f00 0%, #ff0 16.66%, #0f0 33.33%, #0ff 50%, #00f 66.66%, #f0f 83.33%, #f00 100%);
					background: -ms-linear-gradient(left, #f00 0%, #ff0 16.66%, #0f0 33.33%, #0ff 50%, #00f 66.66%, #f0f 83.33%, #f00 100%);
					background: -o-linear-gradient(left, #f00 0%, #ff0 16.66%, #0f0 33.33%, #0ff 50%, #00f 66.66%, #f0f 83.33%, #f00 100%);
				}
				#hue-handle {
					top: 0;
					left: ${hsba[0] * slider_width}px;
					background-color: hsl(${hsba[0] * 360}, 100%, 50%);
				}

				#aplha {
					background: -webkit-linear-gradient(left, hsla(0, 0%, 100%, 0) 0%, hsl(${hsba[0] * 360}, 100%, 50%) 100%);
					background: -moz-linear-gradient(left, hsla(0, 0%, 100%, 0) 0%, hsl(${hsba[0] * 360}, 100%, 50%) 100%);
					background: -ms-linear-gradient(left, hsla(0, 0%, 100%, 0) 0%, hsl(${hsba[0] * 360}, 100%, 50%) 100%);
					background: -o-linear-gradient(left, hsla(0, 0%, 100%, 0) 0%, hsl(${hsba[0] * 360}, 100%, 50%) 100%);
					margin: 0;
				}
				#checkers {
					--checker-color-1: white;
					--checker-color-2: grey;
					--checker-size: 3.5px;
					--checker-gradient: linear-gradient(45deg, var(--checker-color-1) 25%, transparent 0%, transparent 75%, var(--checker-color-1) 75%);
					background-color: var(--checker-color-2);
					background-image: var(--checker-gradient), var(--checker-gradient);
					background-position: 0 0, var(--checker-size) var(--checker-size);
					background-size: calc(var(--checker-size) * 2) calc(var(--checker-size) * 2);
				}
				#aplha-handle {
					top: 0;
					left: ${hsba[3] * slider_width}px;
					background-color: hsl(${hsba[0] * 360}, 100%, ${100 - (hsba[3] * 100) / 2}%);
				}
				.color {
					width: 1em;
					height: 1em;
				}
			`}</style>
		</div>
	);
}
