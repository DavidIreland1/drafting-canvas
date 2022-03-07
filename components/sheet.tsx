import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';

import Canvas from './canvas/canvas';
import Toolbar from './toolbar';
import Structure from './structure/structure';
import Properties from './properties/properties';

import Settings from './settings';
import getFonts from '../utils/fonts';

export default function Sheet({ store, actions }) {
	const router = useRouter();

	const [picker, setPicker] = useState(null);
	const [fonts, setFonts] = useState(null);

	useEffect(() => {
		const { page } = router.query;
		if (!page) return;

		// fetch(`./page/${page}`).then(async (res) => {
		// const state = await res.json();
		// store.dispatch(actions.overwrite({ state: state }));
		// store.dispatch(actions.overwrite({ state: { elements: state.elements } }));
		// });
		store.dispatch(actions.addUser({ user_id: Settings.user_id, label: Settings.user_name, color: Settings.user_color }));

		window.addEventListener('beforeunload', () => {
			store.dispatch(actions.removeUser({ user_id: Settings.user_id }));
		});
	}, [router.query.page]);

	useEffect(() => {
		getFonts().then(setFonts);
	}, []);

	// useEffect(() => {
	// 	window.addEventListener('keydown', (event) => {
	// 		if (event.key === 'b') {
	// 			store.dispatch(actions.overwrite({ state: { elements: devElements(undefined).elements } }));
	// 		}
	// 		if (event.key === 'l') {
	// 			store.dispatch(actions.overwrite({ state: { elements: loadTest(1000).elements } }));
	// 		}
	// 	});
	// }, []);

	// store.subscribe(() => {
	// 	window.localStorage.setItem('elements', JSON.stringify(store.getState()));
	// });

	const canvas = useRef(null);

	return (
		<div id="sheet">
			{picker}
			<Toolbar store={store} actions={actions} />
			<Structure store={store} actions={actions} onResize={() => canvas.current.onResize()} />
			<Canvas ref={canvas} user_id={Settings.user_id} store={store} actions={actions} />
			<Properties store={store} actions={actions} setPicker={setPicker} fonts={fonts} onResize={() => canvas.current.onResize()} />

			<style jsx>{`
				#sheet {
					position: relative;
					display: grid;
					grid-auto-flow: column;
					height: calc(100vh - var(--nav-height));
					overflow: hidden;
				}
			`}</style>
		</div>
	);
}
