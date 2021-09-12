import Picker from './../picker';
import { generateID, dedup } from './../../../utils/utils';
import Eye from './../../icons/eye';
import Minus from './../../icons/minus';
import Plus from './../../icons/plus';

export default function Effects({ selected, store, actions, width }) {
	function addEffect() {
		return null;
	}

	function toEffect() {
		return null;
	}

	return (
		<div id="property-container">
			<div className="property-heading">
				<h4>EFFECTS</h4>

				<Plus onClick={addEffect} />
			</div>

			{dedup(selected).map(toEffect)}

			<style jsx>{``}</style>
		</div>
	);
}
