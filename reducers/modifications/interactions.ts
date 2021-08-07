import Elements, { flatten, selected } from '../../components/elements/elements';
import { round } from '../../utils/utils';

const interactions = {
	resize: (state, props) => {
		const { id, position, last_position } = props.payload;

		const selected = state.elements.filter((element) => element.selected);

		selected.forEach((element) => Elements[element.type].resize(element, position, last_position));
	},
	rotate: (state, props) => {
		const { user_id, id, position, last_position } = props.payload;

		const selected = state.elements.filter((element) => element.selected);

		const target = flatten(state.elements).find((element) => id === element.id);

		const center = Elements[target.type].center(target);

		const rotation = Math.atan2(center.y - position.y, center.x - position.x) - Math.atan2(center.y - last_position.y, center.x - last_position.x);

		selected.forEach((element) => Elements[element.type].rotate(element, rotation));

		const cursor = state.cursors.find((cursor) => user_id === cursor.id);
		cursor.rotation += rotation;
	},
	stretch: (state, props) => {
		const { id, position, last_position } = props.payload;

		const selected = state.elements.filter((element) => element.selected);

		selected.forEach((element) => Elements[element.type].stretch(element, position, last_position));
	},
	propertyRelative: (state, props) => {
		selected(state.elements).forEach((element) => {
			Object.entries(props.payload).forEach(([key, value]) => {
				element[key] += round(value, 2);
			});
		});
	},
	move: (state, props) => {
		const { position, last_position } = props.payload;
		selected(state.elements).forEach((element) => Elements[element.type].move(element, position, last_position));
	},
};

export default interactions;

export const interaction_types = Object.keys(interactions);
