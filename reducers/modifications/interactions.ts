import Elements, { flatten, forEachElement, selected } from '../../components/canvas/elements/elements';
import Settings from '../../components/settings';
import Group from '../../components/canvas/elements/group';

const interactions = {
	resize: (state, props) => {
		const { position, last_position, selected_ids } = props.payload;
		if (selected_ids.length === 1) {
			selected(state.elements, selected_ids).forEach((element) => Elements[element.type].resize(element, position, last_position));
		} else {
			Group.resize({ elements: selected(state.elements, selected_ids), type: 'group', rotation: 0 }, position, last_position);
		}
	},
	rotate: (state, props) => {
		const { position, last_position, selected_ids } = props.payload;

		if (selected_ids.length === 1) {
			selected(state.elements, selected_ids).forEach((element) => Elements[element.type].rotate(element, position, last_position));
		} else {
			Group.rotate({ elements: selected(state.elements, selected_ids), type: 'group', rotation: 0 }, position, last_position);
		}
	},
	stretch: (state, props) => {
		const { position, last_position, selected_ids } = props.payload;
		if (selected_ids.length === 1) {
			selected(state.elements, selected_ids).forEach((element) => Elements[element.type].stretch(element, position, last_position));
		} else {
			Group.stretch({ elements: selected(state.elements, selected_ids), type: 'group', rotation: 0 }, position, last_position);
		}
	},
	spread: (state, props) => {
		const { position, last_position, selected_ids } = props.payload;
		if (selected_ids.length === 1) {
			selected(state.elements, selected_ids).forEach((element) => Elements[element.type].spread(element, position, last_position));
		} else {
			Group.spread({ elements: selected(state.elements, selected_ids), type: 'group', rotation: 0 }, position, last_position);
		}
	},
	move: (state, props) => {
		const { position, last_position, selected_ids } = props.payload;
		selected(state.elements, selected_ids).forEach((element) => Elements[element.type].move(element, position, last_position));
	},
	edit: (state, props) => {
		const { position, last_position, selected_ids, point } = props.payload;
		selected(state.elements, selected_ids).forEach((element) => Elements[element.type].edit(element, position, last_position, point));
	},
	label: (state, props) => {
		state.page.label = props.payload;
	},

	createElements: (state, props) => {
		flatten(state.elements).forEach((element) => {
			element.selected = false;
			element.editing = false;
		});
		state.elements = props.payload.elements.concat(state.elements);
	},
	createElement: (state, props) => {
		const { user_id, id, type, position } = props.payload;

		flatten(state.elements).forEach((element) => {
			element.selected = false;
			element.editing = false;
		});
		// console.log(props.payload); // Sync error created here from bad payload

		const selected = Settings.user_id === user_id;
		state.elements.unshift(Elements[type].create(id, position, selected));

		const cursor = state.cursors.find((cursor) => user_id === cursor.id);
		if (!cursor) return; // Not great
		cursor.mode = 'edit';
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

		const location_id = selected_ids[0];

		flatten(state.elements).forEach((element) => {
			element.selected = false;
			element.editing = false;
		});

		forEachElement(state.elements, (element, i, elements) => {
			if (element.id === location_id)
				elements[i] = {
					id: id,
					label: 'Group',
					type: 'group',
					selected: true,
					hover: false,
					rotation: 0,
					visible: true,
					locked: false,
					elements: selected(state.elements, selected_ids),
				};
		});

		// Remove selected elements, aside from in new group
		forEachElementUntil(state.elements, (element, i, elements) => selected_ids.includes(element.id) && elements.splice(i, 1), id);
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
