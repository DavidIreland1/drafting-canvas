import React, { useEffect } from 'react';
import { Provider } from 'react-redux';

import Canvas from '../components/canvas/canvas';
import Toolbar from '../components/toolbar';
import Structure from '../components/structure';
import Properties from '../components/properties';
import getPage from '../state/dev';

import Settings from './../components/settings';

import stores from '../redux/stores';
import actions from '../reducers/actions';

export default function Sheet() {
	stores.elements.subscribe(() => {
		window.localStorage.setItem('elements', JSON.stringify(stores.elements.getState()));
	});

	useEffect(() => {
		window.addEventListener('keydown', (event) => {
			if (event.metaKey && event.key === 'b') {
				let pages = getPage();
				stores.elements.dispatch(actions.overwrite({ state: pages.elements }));
			}
		});
	}, []);

	return (
		<Provider store={stores.elements as any}>
			<div id="cols">
				<Toolbar />
				<Structure id={Settings.user_id} store={stores.elements} actions={actions} />
				<Canvas user_id={Settings.user_id} store={stores} actions={actions} />
				<Properties store={stores.elements} actions={actions} />

				<style jsx>{`
					#cols {
						position: relative;
						display: grid;
						grid-auto-flow: column;
						grid-template-columns: min-content auto;
					}
				`}</style>
			</div>
		</Provider>
	);
}
