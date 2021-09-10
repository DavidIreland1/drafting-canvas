import { ActionCreators } from 'redux-undo';
import { generateID } from './../../utils/utils';

export function shortCuts(event, store, actions): boolean {
	switch (event.key) {
		// case 'c':
		// 	console.log('copy');
		// 	return true;

		case 'z':
			if (store.getState().past.length > 1) {
				store.dispatch(ActionCreators.undo());
			}
			return true;

		case 'y':
			store.dispatch(ActionCreators.redo());
			return true;
		case 'v':
			console.log('paste');
			return true;
		case 's':
			event.preventDefault();
			console.log('save');
			return true;

		case 'g':
			store.dispatch(actions.group({ id: generateID() }));
			return true;

		case 'd':
			download('store', store.getState().present);
			return true;

		default:
			return false;
	}
}

function download(filename, data) {
	const a = document.createElement('a');
	a.href = 'data:' + 'text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(data, null, '\t'));
	a.download = filename + '.json';
	document.body.appendChild(a);
	a.click();
	a.remove();
}
