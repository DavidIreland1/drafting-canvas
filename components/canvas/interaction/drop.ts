import actions from '../../../redux/slice';
import { DOMToCanvas, generateID } from '../../../utils/utils';
import Rectangle from '../elements/rectangle';

export default function drop(event: DragEvent, canvas, store, user_id) {
	event.preventDefault();
	console.log(event.dataTransfer);
	for (const item of event.dataTransfer.items) {
		if (item.kind === 'string' && item.type.match('^text/plain')) {
			// item.getAsString((s) => {
			// event.target.appendChild(document.getElementById(s));
			// });
		} else if (item.kind === 'string' && item.type.match('^text/html')) {
			const view = store.getState().present.views.find((view) => view.id === user_id);
			const position = DOMToCanvas({ x: event.clientX, y: event.clientY }, canvas, view);

			item.getAsString((data) => {
				const image = new DOMParser().parseFromString(data, 'text/html').querySelector('img');
				if (!image) return;
				document.head.append(image);
				image.onload = () => {
					store.dispatch(
						actions.createElements({
							elements: [
								{
									id: generateID(),
									type: 'rectangle',
									label: 'Image',
									editing: false,
									selected: true, // Might select for other users
									hover: false,
									fill: [{ id: generateID(), type: 'Image', x: 0, y: 0, src: image.src, visible: true, format: 'hex4', color: [0, 0, 0, 0] }],
									stroke: [],
									effect: [],
									points: Rectangle.makePoints(position.x - image.naturalWidth / 2, position.y - image.naturalHeight / 2, image.naturalWidth, image.naturalHeight, 0),
									rotation: 0,
									visible: true,
									locked: false,
								},
							],
						})
					);
					image.remove();
				};
			});
		} else if (item.kind === 'string' && item.type.match('^text/uri-list')) {
			item.getAsString((data) => {
				console.log('... Drop: URI', data);
			});
		} else if (item.kind === 'file' && item.type.match('^image/')) {
			// Drag items item is an image file
			const file = item.getAsFile();
			console.log('... Drop: File ', file);
		}
	}
}
