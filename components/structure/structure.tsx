import { useRef, useState } from 'react';
import Element from './element';
import { flatten } from '../elements/elements';

export default function Structure({ store, actions }) {
	const [elements, setElements] = useState(store.getState().elements);
	const [key, setKey] = useState(Math.random());

	store.subscribe(() => {
		setElements(store.getState().elements);
	});

	const structure_ref = useRef(null);

	const [width, setWidth] = useState('15vw');

	const resize = (event) => {
		event.preventDefault();
		event.target.setPointerCapture(event.pointerId);
		const structure = structure_ref.current;
		const offset = structure.parentElement.getBoundingClientRect().left;
		const move = (move_event) => setWidth(move_event.clientX - offset + 'px');
		event.target.addEventListener('pointermove', move);
		const end = () => {
			event.target.releasePointerCapture(event.pointerId);
			event.target.removeEventListener('pointermove', move);
		};
		event.target.addEventListener('pointerup', end, { once: true });
	};

	const restructure = () => {
		const structure = structure_ref.current;
		console.log('hella');

		const new_structure = [];
		recurse(structure, new_structure, clone(flatten(elements)));

		// console.log(new_structure);
		setKey(Math.random());
		store.dispatch(actions.overwrite({ state: { elements: new_structure } }));
	};

	const recurse = (dom_element, structure, elements) => {
		Array.from(dom_element.children).forEach((child: HTMLElement) => {
			const id = child.getAttribute('element-id');
			// console.log(child);
			const element = elements.find((element) => element.id === id);

			if (element.type === 'group') element.elements = [];
			structure.push(element);
			if (child.querySelector('#elements')) {
				recurse(child.querySelector('#elements'), element.elements, elements);
			}
		});
	};

	const clone = (data) => JSON.parse(JSON.stringify(data));

	return (
		<div id="container" key={key}>
			<div id="structure" ref={structure_ref} onDragOver={(event) => event.preventDefault()}>
				{elements.map((element) => (
					<Element key={element.id} element={element} indentation={10} store={store} actions={actions} restructure={restructure} />
				))}
			</div>

			<div id="handle" onPointerDown={resize}></div>

			<style jsx>{`
				#container {
					position: relative;
					width: ${width};
					background: var(--panel);
					position: absolute;
					display: grid;
					height: 100%;
					overflow-y: auto;
					left: var(--nav-height);
					border-left: 1px solid var(--selected);
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
