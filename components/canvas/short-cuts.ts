import { ActionCreators } from 'redux-undo';
import actions from '../../redux/slice';
import { generateID } from './../../utils/utils';
import Elements from './elements/elements';

export default function shortCuts(event, store): boolean {
	if (event.metaKey === false && event.ctrlKey === false) return;
	switch (event.key) {
		case 'c':
			const selected = JSON.stringify(store.getState().present.elements.filter((element) => element.selected));
			if (selected.length === 0) return false;
			navigator.clipboard.writeText(selected);
			return true;

		case 'z':
			if (store.getState().past.length) store.dispatch(ActionCreators.undo());
			return true;

		case 'y':
			store.dispatch(ActionCreators.redo());
			return true;
		case 'v':
			navigator.clipboard.readText().then((data) => {
				const new_elements = JSON.parse(data);
				new_elements.forEach((element) => {
					element.id = generateID();
					Elements[element.type].getFill(element).forEach((fill) => (fill.id = generateID()));
					Elements[element.type].getStroke(element).forEach((stroke) => (stroke.id = generateID()));
					Elements[element.type].getEffect(element).forEach((effect) => (effect.id = generateID()));
					Elements[element.type].getPoints(element).forEach((point) => (point.id = generateID()));
				});
				store.dispatch(actions.createElements({ elements: new_elements }));
			});

			return true;

		case 'a':
			store.dispatch(actions.selectAll());
			return true;
		case 's':
			event.preventDefault();
			console.log('save');
			return true;

		case 'g':
			store.dispatch(
				actions.group({
					id: generateID(),
					selected_ids: store
						.getState()
						.present.elements.filter((element) => element.selected)
						.map((element) => element.id),
				})
			);
			return true;

		case 'd':
			const state = store.getState().present;
			const content = {
				elements: state.elements,
				page: state.page,
			};
			download(state.page.label || 'Untitled', content);
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
