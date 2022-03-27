import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';

import Canvas from './rust/canvas';
// import Canvas from './canvas/canvas';
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

		store.dispatch(actions.addUser({ user_id: Settings.user_id, label: Settings.user_name, color: Settings.user_color }));

		window.addEventListener('beforeunload', () => {
			store.dispatch(actions.removeUser({ user_id: Settings.user_id }));
		});
	}, [router.query.page]);

	useEffect(() => {
		getFonts().then(setFonts);
	}, []);

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
					grid-template-columns: var(--nav-height) auto auto min-content;
					height: 100%;
					grid-gap: var(--grid-gap);
				}
			`}</style>
		</div>
	);
}
