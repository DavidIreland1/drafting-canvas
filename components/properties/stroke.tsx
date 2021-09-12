import Picker from './picker';
import Elements from './../elements/elements';
import { generateID } from '../../utils/utils';
import Colors from './colors';
import Input from './input';
import Minus from '../icons/minus';
import Plus from '../icons/plus';

export default function Stroke({ selected, store, actions, width, setPicker }) {
	function addStroke() {
		store.dispatch(actions.addStroke({ id: generateID(), width: 4, color: [0, 0, 1, 1] }));
	}

	function removeStroke(id) {
		store.dispatch(actions.removeStroke({ id }));
	}

	function selectColor(event, color_id, color) {
		setPicker(<Picker store={store} actions={actions} color_id={color_id} color={color} event={event} setPicker={setPicker} />);
	}

	function toStroke(stroke) {
		return (
			<>
				<div key={stroke.id} className="property-row">
					<div className="property-color" onClick={(event) => selectColor(event, stroke.id, stroke.color)} style={{ background: Colors.rgbaToString(stroke.color) }} />
					{Colors.rgbaToHex(stroke.color)}
					<Minus onClick={() => removeStroke(stroke.id)} />
				</div>
				<div className="property-row">
					<Input id="width" label="W" selected={selected} store={store} actions={actions} width={width}></Input>
				</div>
			</>
		);
	}

	function dedup(selected) {
		return [...new Set(selected.map((element) => Elements[element.type].getStroke(element)).flat())];
	}

	return (
		<div id="property-container">
			<div className="property-heading">
				<h4>STROKE</h4>

				<Plus onClick={addStroke} />
			</div>

			{dedup(selected).map(toStroke)}

			<style jsx>{``}</style>
		</div>
	);
}
