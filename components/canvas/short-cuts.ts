import { ActionCreators } from 'redux-undo';
import { generateID } from './../../utils/utils';

export async function shortCuts(event, store, actions): Promise<boolean> {
	switch (event.key) {
		case 'c':
			const selected = JSON.stringify(store.getState().present.elements.filter((element) => element.selected));
			const result = navigator.clipboard.writeText(selected);
			return true;

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
			const data = await navigator.clipboard.readText();

			try {
				const new_elements = JSON.parse(data);
				new_elements.forEach((element) => {
					element.id = generateID();
					element.fill.forEach((fill) => (fill.id = generateID()));
					element.stroke.forEach((stroke) => (stroke.id = generateID()));
					element.effect.forEach((effect) => (effect.id = generateID()));
				});
				store.dispatch(actions.createElements({ elements: new_elements }));
			} catch {}
			console.log(data);

			return true;

		case 'a':
			store.dispatch(actions.selectAll());
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
