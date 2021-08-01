import Head from 'next/head';

import Navbar from './../components/navbar';
import Sheet from './../components/sheet';

import Settings from './../components/settings';

import store from './../redux/store';

export default function OffWhiteCanvas(): JSX.Element {
	const initial_state = {
		views: [{ id: Settings.user_id, x: 0, y: 0, scale: 1 }],
		cursors: [
			{ id: Settings.user_id, label: Settings.user_name, x: 0, y: 0, rotation: 0, type: 'none' },
			{ id: '234', label: 'Irene', x: 100, y: 100, rotation: 0, type: 'none' },
		],
		elements: [],
	};

	// const store = initStore(initial_state);

	return (
		<div>
			<Head>
				<title>Off White Canvas</title>
				<link rel="icon" href="/favicon.svg" />
				<script src="/primus/primus.js"></script>
			</Head>

			<main>
				<Navbar />
				<Sheet store={store} />
			</main>
			<style jsx>{`
				main {
					height: 100vh;
					display: grid;
					grid-template-rows: min-content;
				}
			`}</style>

			<style jsx global>{`
				html,
				body {
					padding: 0;
					margin: 0;
					height: 100vh;
					font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
					background: var(--off-white);
					overflow: hidden;
				}
				* {
					box-sizing: border-box;
				}
				:root {
					--nav-background: #1c1b22;

					--panel: #2d2d2f;

					--title-color: #ffffff;
					--text-color: #ffffff;

					--off-white: #f1f1f1;

					--accent: #ea7661;
					--hover: #34343a;
					--selected: #42414d;

					--shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.5);

					--nav-height: 40px;
				}
			`}</style>
		</div>
	);
}
