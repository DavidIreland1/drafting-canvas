import Head from 'next/head';

import Navbar from './../components/navbar';
import Sheet from './../components/sheet';

import Settings from './../components/settings';

import store from './../redux/store';
import actions from '../redux/slice';

export default function OffWhiteCanvas(): JSX.Element {
	return (
		<div>
			<Head>
				<title>Off White Canvas</title>
				<link rel="icon" href="/favicon.svg" />
				<script src="/primus/primus.js"></script>
			</Head>

			<main>
				<Navbar store={store} actions={actions} />
				<Sheet store={store} actions={actions} />
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

					--off-white: #a1a1a1;

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
