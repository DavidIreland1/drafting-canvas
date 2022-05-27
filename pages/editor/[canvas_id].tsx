import { useRouter } from 'next/router';
import { useEffect } from 'react';
import Persistent from '../../utils/persistent';
import { generateID } from '../../utils/utils';
import Sheet from './../../components/sheet';

export default function Page({ store }): JSX.Element {
	const router = useRouter();
	const { canvas_id } = router.query;

	useEffect(() => {
		if (canvas_id === 'undefined') router.push(`/editor/${generateID()}`);
		const canvases = Persistent.load('canvases');
		const canvas = canvases.find((canvas) => canvas.id === canvas_id);
		if (canvas) {
			canvas.time = Date.now();
		} else {
			canvases.unshift({
				id: canvas_id,
				label: 'Untitled',
				time: Date.now(),
			});
		}
		Persistent.save('canvases', canvases);
	}, [router, store, canvas_id]);

	return (
		<main>
			<Sheet store={store} />
		</main>
	);
}
