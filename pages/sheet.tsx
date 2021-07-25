import React, { useEffect } from 'react';

import Canvas from '../components/canvas/canvas';
import Toolbar from '../components/toolbar';
import Structure from '../components/structure';
import Properties from '../components/properties';
import getPage from '../state/dev';

import Settings from './../components/settings';

import store from '../redux/store';
import actions from '../reducers/actions';

export default function Sheet() {
	store.subscribe(() => {
		window.localStorage.setItem('elements', JSON.stringify(store.getState()));
	});

	useEffect(() => {
		window.addEventListener('keydown', (event) => {
			if (event.metaKey && event.key === 'b') {
				let pages = getPage();
				store.dispatch(actions.overwrite({ state: pages }));
			}
		});
	}, []);

	return (
		<div id="cols">
			<Toolbar />
			<Structure id={Settings.user_id} store={store} actions={actions} />
			<Canvas user_id={Settings.user_id} store={store} actions={actions} />
			<Properties store={store} actions={actions} />

			<style jsx>{`
				#cols {
					position: relative;
					display: grid;
					grid-auto-flow: column;
					grid-template-columns: min-content auto;
				}
			`}</style>
		</div>
	);
}
