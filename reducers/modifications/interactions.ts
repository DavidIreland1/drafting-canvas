import Elements, { flatten, forEachElement, selected } from '../../components/elements/elements';

import { slice } from './../../redux/slice';

import Settings from '../../components/settings';
import { clone } from '../../utils/utils';

const interactions = {
	resize: (state, props) => {
		const { position, last_position, selected_ids } = props.payload;

		selected(state.elements, selected_ids).forEach((element) => Elements[element.type].resize(element, position, last_position));
	},
	rotate: (state, props) => {
		const { position, last_position, selected_ids } = props.payload;

		selected(state.elements, selected_ids).forEach((element) => Elements[element.type].rotate(element, position, last_position));
	},
	stretch: (state, props) => {
		const { position, last_position, selected_ids } = props.payload;

		selected(state.elements, selected_ids).forEach((element) => Elements[element.type].stretch(element, position, last_position));
	},
	move: (state, props) => {
		const { position, last_position, selected_ids } = props.payload;
		selected(state.elements, selected_ids).forEach((element) => Elements[element.type].move(element, position, last_position));
	},
	edit: (state, props) => {
		const { position, last_position, selected_ids, dot } = props.payload;
		selected(state.elements, selected_ids).forEach((element) => Elements[element.type].edit(element, position, last_position, dot));
	},

	createElements: (state, props) => {
		slice.caseReducers.unselectAll(state);
		state.elements = props.payload.elements.concat(state.elements);
	},
	createElement: (state, props) => {
		const { user_id, id, type, position } = props.payload;

		slice.caseReducers.unselectAll(state);
		// console.log(props.payload); // Sync error created here from bad payload

		const selected = Settings.user_id === user_id;
		state.elements.unshift(Elements[type].create(id, position, selected));

		const props_clone: any = clone(props);
		props_clone.payload = { user_id, mode: 'edit' };
		slice.caseReducers.cursor(state, props_clone);
	},
	toggleVisible: (state, props) => {
		const { id } = props.payload;
		const element = flatten(state.elements).find((element) => element.id === id);
		if (element) {
			element.visible = !element.visible;
			element.selected = element.visible;
		}
	},
	toggleLocked: (state, props) => {
		const { id } = props.payload;
		const element = flatten(state.elements).find((element) => element.id === id);
		if (element) {
			element.locked = !element.locked;
			element.selected = !element.locked;
		}
	},
	group: (state, props) => {
		const { id, selected_ids } = props.payload;
		console.log(id, selected_ids);

		const location_id = selected_ids[0];

		forEachElement(state.elements, (element, i, elements) => {
			if (element.id === location_id)
				elements[i] = {
					id: id,
					label: 'Group',
					type: 'group',
					selected: false,
					hover: false,
					rotation: 0,
					visible: true,
					locked: false,
					elements: selected(state.elements, selected_ids),
				};
		});

		// Remove selected elements, aside from in new group
		forEachElementUntil(
			state.elements,
			(element, i, elements) => {
				if (selected_ids.includes(element.id)) elements.splice(i, 1);
			},
			id
		);
	},
};

export default interactions;

export const interaction_actions = Object.keys(interactions);

// Stops recursing at given id
function forEachElementUntil(elements, callback, stop_id) {
	elements.forEach((element, index, array) => {
		callback(element, index, array);
		if (element.type === 'group' && element.id !== stop_id) {
			forEachElementUntil(element.elements, callback, stop_id);
		}
	});
}
