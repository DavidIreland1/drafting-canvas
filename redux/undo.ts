import { modification_actions } from '../reducers/modifications/modifications';
import { interaction_actions } from '../reducers/modifications/interactions';

export function filterActions(action) {
	return modification_actions.includes(action.type.slice(7));
}

const last_action = { type: '', time: Date.now() };

export function groupActions(action) {
	const now = Date.now();
	if (interaction_actions.includes(action.type.slice(7)) && last_action.type === action.type && last_action.time > now - 500) {
		last_action.time = now;
		return action.type;
	}
	last_action.type = action.type;
	last_action.time = now;

	return null;
}
