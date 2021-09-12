import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import Canvas from './canvas/canvas';
import Toolbar from './toolbar';
import Structure from './structure/structure';
import Properties from './properties/properties';
import getPage from '../state/dev';

import Settings from './settings';

export default function Sheet({ store, actions }) {
	const router = useRouter();

	const [picker, setPicker] = useState(null);

	useEffect(() => {
		const { page } = router.query;
		if (!page) return;

		// fetch(`./page/${page}`).then(async (res) => {
		// const state = await res.json();
		// store.dispatch(actions.overwrite({ state: state }));
		// store.dispatch(actions.overwrite({ state: { elements: state.elements } }));
		// });
		store.dispatch(actions.addUser({ user_id: Settings.user_id, label: Settings.user_name, color: Settings.user_color }));

		window.addEventListener('beforeunload', async () => {
			store.dispatch(actions.removeUser({ user_id: Settings.user_id }));
		});
	}, [router.query.page]);

	useEffect(() => {
		window.addEventListener('keydown', (event) => {
			if (event.key === 'b') {
				// window.location.reload();
				store.dispatch(actions.overwrite({ state: { elements: getPage(undefined).elements } }));
			}
			if (event.key === 'm') {
				// window.location.reload();
				store.dispatch(actions.overwrite({ state: { elements: getPage('red').elements } }));
			}
		});
	}, []);

	// store.subscribe(() => {
	// 	window.localStorage.setItem('elements', JSON.stringify(store.getState()));
	// });

	return (
		<div id="cols">
			{picker}
			<Toolbar store={store} actions={actions} />
			<Structure store={store} actions={actions} />
			<Canvas user_id={Settings.user_id} store={store} actions={actions} />
			<Properties store={store} actions={actions} setPicker={setPicker} />

			<style jsx>{`
				#cols {
					position: relative;
					display: grid;
					grid-auto-flow: column;
					grid-template-columns: min-content auto;
					height: calc(100vh - var(--nav-height));
					overflow: hidden;
				}
			`}</style>
		</div>
	);
}
