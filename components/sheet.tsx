import React, { useEffect } from 'react';
import { useRouter } from 'next/router';

import Canvas from './canvas/canvas';
import Toolbar from './toolbar';
import Structure from './structure/structure';
import Properties from './properties/properties';
import getPage from '../state/dev';

import Settings from './settings';

import actions from '../reducers/actions';
import { Provider } from 'react-redux';

export default function Sheet({ store }) {
	const router = useRouter();

	useEffect(() => {
		const { page } = router.query;
		console.log(page);
		// const page = location.href.split('/').pop();
		fetch(`./page/${page}`).then(async (res) => {
			const state = await res.json();

			console.log(state);
			store.dispatch(actions.overwrite({ state: state }));
			// store.dispatch(actions.addUser({ user_id: '312', label: 'dad' }));
		});
	}, [router.query.page]);

	useEffect(() => {
		window.addEventListener('keydown', (event) => {
			if (event.metaKey && event.key === 'b') {
				store.dispatch(actions.overwrite({ state: getPage() }));
			}
		});
	}, []);

	// store.subscribe(() => {
	// 	window.localStorage.setItem('elements', JSON.stringify(store.getState()));
	// });

	return (
		<div id="cols">
			<Provider store={store}>
				<Toolbar />
				<Structure store={store} actions={actions} />
				<Canvas user_id={Settings.user_id} store={store} actions={actions} />
				<Properties store={store} actions={actions} />
			</Provider>

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
