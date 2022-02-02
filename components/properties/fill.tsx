import Picker from '../picker';
import Elements, { flatten } from '../elements/elements';
import { generateID } from '../../utils/utils';
import Colors from './colors';
import Eye from '../icons/eye';
import Minus from '../icons/minus';
import Plus from '../icons/plus';
import Select from './inputs/select';
import Text from './inputs/text';

export default function Fill({ selected, store, actions, setPicker }) {
	const selected_ids = selected.map((element) => element.id);

	function addFill() {
		store.dispatch(actions.addFill({ selected_ids, props: { id: generateID(), type: 'Solid', color: [0, 0, 0, 1], visible: true } }));
	}

	function removeFill(fill) {
		store.dispatch(actions.removeFill({ id: fill.id }));
	}

	function toggleFill(fill) {
		store.dispatch(actions.setFill({ selected_ids, props: { id: fill.id, visible: !fill.visible } }));
	}

	function openPicker(event, fill) {
		const setProperty = (fill) => {
			store.dispatch(actions.setFill({ selected_ids, props: fill }));
		};
		function setType(event) {
			setProperty({ ...fill, type: event.target.value });
		}

		const selector = (state) => {
			return flatten(state.present.elements)
				.filter((element) => element.type !== 'group' && element.selected)
				.map((element) => element.fill)
				.flat()
				.find((prop) => prop.id === fill.id);
		};
		setPicker(
			<Picker setProperty={setProperty} selector={selector} event={event} setPicker={setPicker}>
				<Select id="type" label="" value={fill.type} onChange={setType}>
					<option id="Solid">Solid</option>
					<option id="Image">Image</option>
				</Select>
			</Picker>
		);
	}

	function getFills(selected) {
		return selected.map((element) => Elements[element.type].getFill(element)).flat();
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

	function toFill(fill) {
		return (
			<div key={fill.id} id="prop" className="property-row" draggable={true} onDragStart={drag} onDragEnd={dragEnd} onMouseDown={setTarget} onDragOver={dragOver}>
				<div id="handle">::</div>
				{fill.type === 'Solid' || fill.type === 'Text' ? (
					// Color Picker
					<div className="property-color" onClick={(event) => openPicker(event, fill)} style={{ background: Colors.hslaToString(Colors.hsbaToHsla(fill.color)) }} />
				) : (
					// Image
					<img className="property-color" src={fill.src} onClick={(event) => openPicker(event, fill)} />
				)}

				<div>
					<Text id="color" placeholder="Color" onChange={console.log}>
						{Colors.rgbaToHex(fill.color)}
					</Text>
				</div>
				<div>
					<Eye open={fill.visible} onClick={() => toggleFill(fill)} />
				</div>
				<div>
					<Minus onClick={() => removeFill(fill)} />
				</div>

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

	return (
		<div id="property-container">
			<div className="property-heading">
				<h4>FILL</h4>
				<Plus onClick={addFill} />
			</div>

			{getFills(selected).map(toFill)}
		</div>
	);
}
