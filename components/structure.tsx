import { useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import Element from './element';

export default function Structure(props) {
	const { user_id, store, actions } = props;

	const [elements, setElements] = useState(store.getState().elements);

	store.subscribe(() => {
		setElements(store.getState().elements);
	});

	const container_ref = useRef(null);

	const resize = () => {
		const container = container_ref.current;
		const offset = container.getBoundingClientRect().left;
		const move = (move_event) => {
			container.style.width = move_event.clientX - offset + 'px';
		};

		window.addEventListener('mousemove', move);
		window.addEventListener('mouseup', () => window.removeEventListener('mousemove', move), { once: true });
	};

	return (
		<div id="container" ref={container_ref}>
			<div id="elements">
				{elements.map((element) => (
					<Element key={element.id} element={element} indentation={20}></Element>
				))}
			</div>

			<div id="handle" onMouseDown={resize}></div>

			<style jsx>{`
				#container {
					position: relative;
					width: 15vw;
					background: #b9bdc3;
					position: absolute;
					display: grid;
					height: 100%;
					left: var(--nav-height);
				}
				#elements {
					overflow: hidden;
				}
				#handle {
					position: absolute;
					height: 100%;
					width: 6px;
					background: transparent;
					right: -3px;
					cursor: ew-resize;
				}
			`}</style>
		</div>
	);
}
