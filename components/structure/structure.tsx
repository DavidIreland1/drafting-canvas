import { useRef, useState } from 'react';
import Element from './element';
import { flatten } from '../elements/elements';
import { useSelector } from 'react-redux';

export default function Structure({ store, actions, onResize }) {
	const elements = useSelector(
		(state) => (state as any).present.elements,
		(a, b) => JSON.stringify(a) === JSON.stringify(b)
	);
	const [key, setKey] = useState(Math.random());
	const structure_ref = useRef(null);
	const [width, setWidth] = useState('max(15vw, 150px)');

	const resize = (event) => {
		event.preventDefault();
		event.target.setPointerCapture(event.pointerId);
		const structure = structure_ref.current;
		const offset = structure.parentElement.getBoundingClientRect().left;

		const move = (move_event) => {
			setWidth(`max(${((move_event.clientX - offset) / window.innerWidth) * 100}vw, 3px)`);
			onResize();
		};
		event.target.addEventListener('pointermove', move);
		const end = () => {
			event.target.releasePointerCapture(event.pointerId);
			event.target.removeEventListener('pointermove', move);
		};
		event.target.addEventListener('pointerup', end, { once: true });
	};

	const restructure = () => {
		const structure = structure_ref.current;

		const new_structure = [];
		recurse(structure, new_structure, clone(flatten(elements)));

		setKey(Math.random());
		store.dispatch(actions.overwrite({ state: { elements: new_structure } }));
	};

	const recurse = (dom_element, structure, elements) => {
		Array.from(dom_element.children).forEach((child: HTMLElement) => {
			const id = child.getAttribute('element-id');
			const element = elements.find((element) => element.id === id);

			if (element.type === 'group' || element.type === 'frame') element.elements = [];
			structure.push(element);
			if (child.querySelector('#elements')) {
				recurse(child.querySelector('#elements'), element.elements, elements);
			}
		});
	};

	const clone = (data) => JSON.parse(JSON.stringify(data));

	return (
		<div id="container" key={key} style={{ width: width }}>
			<div id="structure" ref={structure_ref} onDragOver={(event) => event.preventDefault()}>
				{elements.map((element) => (
					<Element key={element.id} element={element} indentation={10} store={store} actions={actions} restructure={restructure} />
				))}
			</div>

			<div id="handle" onPointerDown={resize} />

			<style jsx>{`
				#container {
					position: relative;
					background: var(--panel);
					display: grid;
					height: 100%;
					overflow-y: auto;
					overflow-x: hidden;
					border-left: 1px solid var(--selected);
					z-index: 2;
				}
				#structure {
					overflow-x: hidden;
					overflow-y: auto;
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
