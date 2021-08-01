import { useRef, useState } from 'react';

export default function Properties(props) {
	const { user_id, store, actions } = props;

	const [elements, setElements] = useState(store.getState());
	console.log();

	store.subscribe(() => {
		setElements(store.getState());
	});

	const container_ref = useRef(null);

	const resize = (event) => {
		const container = container_ref.current;
		const move = (move_event) => {
			container.style.width = window.innerWidth - move_event.clientX + 'px';
		};

		window.addEventListener('mousemove', move);
		window.addEventListener('mouseup', () => window.removeEventListener('mousemove', move), { once: true });
	};

	return (
		<div id="container" ref={container_ref}>
			<div id="handle" onMouseDown={resize}></div>

			<style jsx>{`
				#container {
					position: relative;
					width: 15vw;
					background: var(--panel);
					position: absolute;
					display: grid;
					height: 100%;
					right: 0;
				}
				#handle {
					position: absolute;
					height: 100%;
					width: 6px;
					background: transparent;
					left: -3px;
					cursor: ew-resize;
				}
			`}</style>
		</div>
	);
}
