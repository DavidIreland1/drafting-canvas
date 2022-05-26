import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import Sheet from './../../components/sheet';

export default function Page({ store }): JSX.Element {
	const router = useRouter();
	const { page } = router.query;

	useEffect(() => {
		const canvases = JSON.parse(localStorage.getItem('canvases') ?? '[]');
		canvases.unshift({
			id: page,
			label: store.getState().present.page.label,
			time: Date.now(),
		});
		localStorage.setItem('canvases', JSON.stringify([...new Map(canvases.map((canvas) => [canvas.id, canvas])).values()]));
	}, [store, page]);

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
