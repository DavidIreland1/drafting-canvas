import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import Persistent from '../../utils/persistent';
import { generateID } from '../../utils/utils';
import Sheet from './../../components/sheet';

export default function Page({ store }): JSX.Element {
	const router = useRouter();
	const { page } = router.query;

	useEffect(() => {
		if (page === 'undefined') router.push(`/editor/${generateID()}`);
		const canvases = Persistent.load('canvases');
		const canvas = canvases.find((canvas) => canvas.id === page);
		if (canvas) {
			canvas.time = Date.now();
		} else {
			canvases.unshift({
				id: page,
				label: 'Untitled',
				time: Date.now(),
			});
		}
		Persistent.save('canvases', canvases);
	}, [router, store, page]);

	return (
		<>
			<main>
				<Sheet store={store} />
			</main>

			<style jsx>{`
				main {
					height: calc(100vh - var(--nav-height));
				}
			`}</style>
		</>
	);
}
