import { ActionCreators } from 'redux-undo';

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
	}
	return false;
}