import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';

import Canvas from './canvas/canvas';
import Toolbar from './toolbar';
import Structure from './structure/structure';
import Properties from './properties/properties';

import Settings from './settings';
import getFonts from '../utils/fonts';
import actions from '../redux/slice';

export default function Sheet({ store }) {
	const router = useRouter();

	const [picker, setPicker] = useState(null);
	const [fonts, setFonts] = useState(null);

	useEffect(() => {
		const { page } = router.query;
		if (!page) return;

		// Hack fix as adding user before state sync causes error in other users
		const time_delay = window.hasOwnProperty('Primus') ? 4000 : 0;
		setTimeout(() => {
			store.dispatch(actions.addUser({ user_id: Settings.user_id, label: Settings.user_name, color: Settings.user_color }));
		}, time_delay);

		window.addEventListener('beforeunload', () => {
			store.dispatch(actions.removeUser({ user_id: Settings.user_id }));
		});
	}, [router.query, store]);

	useEffect(() => {
		getFonts().then(setFonts);
	}, []);

	const canvas = useRef(null);

	return (
		<div id="sheet">
			{picker}
			<Toolbar store={store} />
			<Structure store={store} onResize={() => canvas.current.onResize()} />
			<Canvas ref={canvas} user_id={Settings.user_id} store={store} />
			<Properties store={store} setPicker={setPicker} fonts={fonts} onResize={() => canvas.current.onResize()} />

			<style jsx>{`
				#sheet {
					position: relative;
					display: grid;
					grid-auto-flow: column;
					grid-template-columns: var(--nav-height) auto auto min-content;
					height: 100%;
					grid-gap: var(--grid-gap);
				}
			`}</style>
		</div>
	);
}
