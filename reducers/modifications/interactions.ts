import Elements, { flatten, selected } from '../../components/elements/elements';

import { slice } from './../../redux/slice';
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
		// const target = flatten(state.elements).find((element) => id === element.id);

		selected.forEach((element) => Elements[element.type].rotate(element, position, last_position));

		// const cursor = state.cursors.find((cursor) => user_id === cursor.id);
		// cursor.rotation += rotation;
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

	createElement: (state, props) => {
		const { user_id, id, type, position } = props.payload;
		slice.caseReducers.unselectAll(state);
		state.elements.unshift(Elements[type].create(id, position));

		props.payload = { id: user_id, mode: 'edit' };
		slice.caseReducers.cursor(state, props);
	},
	toggleVisible: (state, props) => {
		const { id } = props.payload;
		const element = flatten(state.elements).find((element) => element.id === id);
		if (element) element.visible = !element.visible;
	},
	toggleLocked: (state, props) => {
		const { id } = props.payload;
		const element = flatten(state.elements).find((element) => element.id === id);
		if (element) element.locked = !element.locked;
	},
};

export default interactions;

export const interaction_types = Object.keys(interactions);
