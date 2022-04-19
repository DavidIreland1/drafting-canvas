import Picker from '../picker';
import Elements, { flatten } from '../canvas/elements/elements';
import { generateID } from '../../utils/utils';
import Colors from './colors';
import Eye from '../icons/eye';
import Minus from '../icons/minus';
import Plus from '../icons/plus';
import Select from '../inputs/select';
import Text from '../inputs/text';
import { useEffect, useState } from 'react';
import actions from '../../redux/slice';

export default function Fill({ selected, store, setPicker }) {
	const selected_ids = selected.map((element) => element.id);

	const fills = selected.map((element) => Elements[element.type].getFill(element)).flat();
	return (
		<div id="property-container">
			<div className="property-heading">
				<h4>FILL</h4>
				<Plus onClick={() => addFill(selected_ids, store)} />
			</div>

			{fills.map((fill) => (
				<FillInput key={fill.id} fill={fill} setPicker={setPicker} selected_ids={selected_ids} store={store} />
			))}
		</div>
	);
}

function addFill(selected_ids, store) {
	store.dispatch(actions.addFill({ selected_ids, props: { id: generateID(), type: 'Solid', color: [0, 0, 0, 1], format: 'hex4', visible: true } }));
}

function removeFill(fill, store) {
	store.dispatch(actions.removeFill({ id: fill.id }));
}

function toggleFill(fill, selected_ids, store) {
	store.dispatch(actions.setFill({ selected_ids, props: { id: fill.id, visible: !fill.visible } }));
}

function openPicker(event, fill, setPicker, selected_ids, store) {
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
			<Select id="type" value={fill.type} onChange={(event) => setProperty({ ...fill, type: event.target.value, x: 0, y: 0, src: '/images/draft.svg' })}>
				{fill.type === 'Text' ? (
					<div style={{ color: 'white', lineHeight: '30px', width: 'max-content' }}>Text</div>
				) : (
					<>
						<option value="Solid">Solid</option>
						<option value="Image">Image</option>
					</>
				)}
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

function FillInput({ fill, setPicker, selected_ids, store }) {
	const color_string = Colors.toString(fill.color, fill.format);
	const [color, setColor] = useState(color_string);
	useEffect(() => setColor(color_string), [color_string]);

	function changeColor(event) {
		const new_color = event.target.value;
		setColor(new_color);
		if (Colors.isValid(new_color)) {
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

			<div className="checker-background">
				{fill.type === 'Solid' || fill.type === 'Text' ? (
					// Color Picker
					<div className="property-color" onClick={(event) => openPicker(event, fill, setPicker, selected_ids, store)} style={{ background: Colors.toString(fill.color) }} />
				) : (
					// Image
					<img alt="" className="property-color" src={fill.src} onClick={(event) => openPicker(event, fill, setPicker, selected_ids, store)} />
				)}
			</div>

			<Text placeholder="Color" className={Colors.isValid(color) || 'invalid'} onChange={changeColor}>
				{color}
			</Text>
			<Eye open={fill.visible} onClick={() => toggleFill(fill, selected_ids, store)} />
			<Minus onClick={() => removeFill(fill, store)} />

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
