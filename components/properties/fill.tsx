import Picker from './picker';
import { generateID, dedup } from '../../utils/utils';
import Colors from './colors';
import Eye from '../icons/eye';
import Minus from '../icons/minus';
import Plus from '../icons/plus';

export default function Fill({ selected, store, actions, width, setPicker }) {
	function addFill() {
		store.dispatch(actions.addFill({ id: generateID(), color: [0, 0, 0, 1] }));
	}

	function removeFill(id) {
		store.dispatch(actions.removeFill({ id }));
	}

	function toggleFill(id) {
		store.dispatch(actions.toggleFill({ id }));
	}

	function selectColor(event, color_id, color) {
		setPicker(<Picker store={store} actions={actions} color_id={color_id} color={color} event={event} setPicker={setPicker} />);
	}

	function toFill(fill) {
		return (
			<div key={fill.id} className="property-row">
				<div className="property-color" onClick={(event) => selectColor(event, fill.id, fill.color)} style={{ background: Colors.rgbaToString(fill.color) }} />
				{Colors.rgbaToHex(fill.color)}

				<Eye open={fill.visible} onClick={() => toggleFill(fill.id)} />
				<Minus onClick={() => removeFill(fill.id)} />
			</div>
		);
	}

	return (
		<div id="property-container">
			<div className="property-heading">
				<h4>FILL</h4>

				<Plus onClick={addFill} />
			</div>

			{dedup(selected).map(toFill)}

			<style jsx>{``}</style>
		</div>
	);
}
