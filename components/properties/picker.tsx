import { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';

export default function Picker({ store, actions, from_color, event, setPicker }) {
	function saveColor(event) {
		if (!event.target.classList.contains('color')) return;
		store.dispatch(actions.setColor({ from: from_color, to: event.target.style.background }));
		setPicker(null);
	}

	// window.addEventListener('mousedown', () => setPicker(null), { once: true });

	const selected = useSelector((state: RootState) => (state as any).present.elements.filter((element) => element.selected));

	const [color, setColor] = useState(from_color);

	const [picker_position, setPickerPosition] = useState({ x: event.clientX - 350, y: event.clientY });

	const dragPicker = (down_event) => {
		if (down_event.target.id !== 'container') return;
		down_event.preventDefault();
		down_event.target.setPointerCapture(down_event.pointerId);
		const offset_x = picker_position.x - down_event.clientX;
		const offset_y = picker_position.y - down_event.clientY;
		const move = (move_event) => setPickerPosition({ x: move_event.clientX + offset_x, y: Math.max(move_event.clientY + offset_y, -40) });
		down_event.target.addEventListener('pointermove', move);
		down_event.target.addEventListener('pointerup', () => down_event.target.removeEventListener('pointermove', move), { once: true });
	};

	const [fade_position, setFadePosition] = useState({ x: 0, y: 0 });
	const dragFade = (down_event) => {
		down_event.preventDefault();
		down_event.target.setPointerCapture(down_event.pointerId);

		const offset_x = fade_position.x;
		const offset_y = fade_position.y;
		const move = (move_event) => setFadePosition({ x: move_event.clientX, y: move_event.clientY });
		down_event.target.addEventListener('pointermove', move);
		down_event.target.addEventListener('pointerup', () => down_event.target.removeEventListener('pointermove', move), { once: true });
	};

	const selectBar = (down_event) => {};

	return (
		<div id="container" onClick={saveColor} onPointerDown={dragPicker}>
			<div id="fade">
				<div id="fade-handle" className="handle" onPointerDown={dragFade}></div>
			</div>
			<div id="color-bar" onMouseDown={selectBar}>
				<div id="bar-handle" className="handle"></div>
			</div>
			<div className="color" style={{ background: 'red' }} />
			<div className="color" style={{ background: 'blue' }} />
			<div className="color" style={{ background: 'orange' }} />
			<div className="color" style={{ background: 'green' }} />

			<style jsx>{`
				#container {
					position: absolute;
					z-index: 7;

					padding: 40px 0 20px 0;
					background: var(--panel);

					top: ${picker_position.y}px;
					left: ${picker_position.x}px;

					box-shadow: 0 0 10px black;

					display: grid;
					grid-gap: 10px;
				}

				#fade {
					position: relative;
					width: 300px;
					height: 300px;
					background: -webkit-linear-gradient(top, hsla(0, 0%, 100%, 0) 0%, hsl(0, 0%, 0%) 100%), -webkit-linear-gradient(left, hsl(0, 0%, 100%) 0%, hsla(0, 0%, 50%, 0) 100%);
					background: -moz-linear-gradient(top, hsla(0, 0%, 100%, 0) 0%, hsl(0, 0%, 0%) 100%), -moz-linear-gradient(left, hsl(0, 0%, 100%) 0%, hsla(0, 0%, 50%, 0) 100%);
					background: -ms-linear-gradient(top, hsla(0, 0%, 100%, 0) 0%, hsl(0, 0%, 0%) 100%), -ms-linear-gradient(left, hsl(0, 0%, 100%) 0%, hsla(0, 0%, 50%, 0) 100%);
					background: -o-linear-gradient(top, hsla(0, 0%, 100%, 0) 0%, hsl(0, 0%, 0%) 100%), -o-linear-gradient(left, hsl(0, 0%, 100%) 0%, hsla(0, 0%, 50%, 0) 100%);
					background-color: ${color};
				}
				#fade-handle {
					top: 0;
					left: 0;
				}
				.handle {
					position: absolute;
					width: 14px;
					height: 14px;
					border-radius: 14px;
					border: 1px solid black;
					box-sizing: border-box;
					z-index: 2;
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
				#color-bar {
					margin: 0 10px;
					position: relative;
					width: 280px;
					height: 14px;
					border-radius: 14px;
					background: -moz-linear-gradient(left, #f00 0%, #ff0 16.66%, #0f0 33.33%, #0ff 50%, #00f 66.66%, #f0f 83.33%, #f00 100%);
					background: -webkit-linear-gradient(left, #f00 0%, #ff0 16.66%, #0f0 33.33%, #0ff 50%, #00f 66.66%, #f0f 83.33%, #f00 100%);
					background: -ms-linear-gradient(left, #f00 0%, #ff0 16.66%, #0f0 33.33%, #0ff 50%, #00f 66.66%, #f0f 83.33%, #f00 100%);
					background: -o-linear-gradient(left, #f00 0%, #ff0 16.66%, #0f0 33.33%, #0ff 50%, #00f 66.66%, #f0f 83.33%, #f00 100%);
				}

				#bar-handle {
					top: 0;
					left: 0;
				}

				.color {
					width: 1em;
					height: 1em;
				}
			`}</style>
		</div>
	);
}
