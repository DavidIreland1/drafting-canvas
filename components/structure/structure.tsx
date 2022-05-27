import { useRef, useState } from 'react';
import Element from './element';
import { useSelector } from 'react-redux';
import { clone } from '../../utils/utils';
import actions from '../../redux/slice';
import { flatten } from '../canvas/elements/elements';

export default function Structure({ store }) {
	const elements = useSelector(
		(state) => (state as any).present.elements,
		(a, b) => JSON.stringify(a) === JSON.stringify(b)
	);
	const [key, setKey] = useState(Math.random());
	const structure_ref = useRef(null);

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

	return (
		<div id="container" key={key}>
			<div id="structure" ref={structure_ref} onDragOver={(event) => event.preventDefault()}>
				{elements.map((element) => (
					<Element key={element.id} element={element} indentation={0} store={store} restructure={restructure} />
				))}
			</div>

			<style jsx>{`
				#container {
					background: var(--panel);
					height: calc(100vh - var(--nav-height) - var(--gap));
					z-index: 2;
					border-radius: var(--radius);
					overflow-x: hidden;
				}
				#structure {
					height: 100%;
					overflow-y: auto;
					overflow-y: overlay;
				}
			`}</style>
		</div>
	);
}
