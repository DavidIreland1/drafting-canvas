import Picker from '../picker';
import Elements, { flatten } from '../elements/elements';
import { generateID } from '../../utils/utils';
import Colors from './colors';
import Eye from '../icons/eye';
import Minus from '../icons/minus';
import Plus from '../icons/plus';
import Select from './inputs/select';
import Text from './inputs/text';
import { useState } from 'react';

export default function Fill({ selected, store, actions, setPicker }) {
	const selected_ids = selected.map((element) => element.id);

	const fills = selected.map((element) => Elements[element.type].getFill(element)).flat();
	return (
		<div id="property-container">
			<div className="property-heading">
				<h4>FILL</h4>
				<Plus onClick={addFill} />
			</div>

			{fills.map((fill) => toFill(fill, setPicker, selected_ids, store, actions))}
		</div>
	);
}

function addFill(selected_ids, store, actions) {
	store.dispatch(actions.addFill({ selected_ids, props: { id: generateID(), type: 'Solid', color: [0, 0, 0, 1], format: 'hex4', visible: true } }));
}

function removeFill(fill, store, actions) {
	store.dispatch(actions.removeFill({ id: fill.id }));
}

function toggleFill(fill, selected_ids, store, actions) {
	store.dispatch(actions.setFill({ selected_ids, props: { id: fill.id, visible: !fill.visible } }));
}

function openPicker(event, fill, setPicker, selected_ids, store, actions) {
	const setProperty = (fill) => {
		store.dispatch(actions.setFill({ selected_ids, props: fill }));
	};

	const selector = (state) =>
		flatten(state.present.elements)
			.filter((element) => element.type !== 'group' && element.selected)
			.map((element) => element.fill)
			.flat()
			.find((prop) => prop.id === fill.id);

	setPicker(
		<Picker setProperty={setProperty} selector={selector} event={event} setPicker={setPicker}>
			<Select id="type" value={fill.type} onChange={(event) => setProperty({ ...fill, type: event.target.value })}>
				<option value="Solid">Solid</option>
				<option value="Image">Image</option>
			</Select>
		</Picker>
	);
}

let target;

function setTarget(event) {
	target = event.target;
}

const drag = (event) => {
	if (target.id !== 'handle') return event.preventDefault();
	event.stopPropagation();
	// event.dataTransfer.effectAllowed = 'move';
	requestAnimationFrame(() => target.parentElement.classList.add('blank'));
};

function dragOver(event) {
	const selected = target.parentElement;

	const hover = event.nativeEvent.composedPath().find((element) => (element.id = 'prop'));
	if (!hover || hover === selected) return;
	console.log(hover);

	const box = hover.getBoundingClientRect();
	if (event.clientY > box.top + box.height / 2) {
		hover.parentElement.insertBefore(selected, hover);
	} else {
		hover.parentElement.insertBefore(selected, hover.nextSibling);
	}
}

function dragEnd() {
	target.parentElement.classList.remove('blank');
}

let previous_color = '';
function toFill(fill, setPicker, selected_ids, store, actions) {
	// const hex = Colors.rgbaToHex8(Colors.hslaToRgba(Colors.hsbaToHsla(fill.color)));
	const hex = Colors.toString(fill.color, fill.format);

	const [color, setColor] = useState(hex);

	if (previous_color !== hex) {
		previous_color = hex;
		setColor(hex);
	}
	// if (color !== hex) setColor(hex);

	function changeColor(event) {
		const new_color = event.target.value;
		setColor(new_color);
		if (Colors.isValid(new_color)) {
			console.log(Colors.getFormat(new_color));
			store.dispatch(
				actions.setFill({
					selected_ids,
					props: {
						...fill,
						color: Colors.hslaToHsba(Colors.rgbaToHsla(Colors.stringToRgba(new_color))),
						format: Colors.getFormat(new_color),
					},
				})
			);
		}
	}

	return (
		<div key={fill.id} id="prop" className="property-row" draggable={true} onDragStart={drag} onDragEnd={dragEnd} onMouseDown={setTarget} onDragOver={dragOver}>
			<div id="handle">::</div>

			{fill.type === 'Solid' || fill.type === 'Text' ? (
				// Color Picker
				<div className="checker-background">
					<div className="property-color" onClick={(event) => openPicker(event, fill, setPicker, selected_ids, store, actions)} style={{ background: Colors.toString(Colors.hsbaToHsla(fill.color)) }} />
				</div>
			) : (
				// Image
				<img className="property-color" src={fill.src} onClick={(event) => openPicker(event, fill, setPicker, selected_ids, store, actions)} />
			)}

			<Text id="color" placeholder="Color" className={Colors.isValid(color) || 'invalid'} onChange={changeColor}>
				{color}
			</Text>
			<Eye open={fill.visible} onClick={() => toggleFill(fill, selected_ids, store, actions)} />
			<Minus onClick={() => removeFill(fill, store, actions)} />

			<style jsx>{`
					.blank > *,
					.blank > * > * {
						visibility: collapse;
					}
					input {
						min-width: 10px;
						border
					}
					#handle {
						cursor: default;
						border-radius: 4px;
						padding: 0 5px;

					}
					#handle:hover {
						background: var(--hover)
					}
				`}</style>
		</div>
	);
}
