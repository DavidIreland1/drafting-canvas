import Head from 'next/head';

import Navbar from '../components/navbar/navbar';
import Sheet from './../components/sheet';

import store from './../redux/store';
import actions from '../redux/slice';

import { Provider } from 'react-redux';

export default function OffWhiteCanvas(): JSX.Element {
	return (
		<div>
			<Head>
				<title>Drafting Canvas</title>
				<link rel="icon" href="/favicon.svg" />
				<script src="/primus/primus.js"></script>
			</Head>

			<main>
				<Provider store={store as any}>
					<Navbar store={store} actions={actions} />
					<Sheet store={store} actions={actions} />
				</Provider>
			</main>
			<style jsx>{`
				main {
					height: 100vh;
					display: grid;
					grid-template-rows: min-content;
				}
			`}</style>

			<style jsx global>{`
				:root {
					--nav-background: #1c1b22;

					--panel: #2d2d2f;

					--title-color: #ffffff;
					--text-color: #ffffff;

					--off-white: #a1a1a1;
					--off-white: #f1f1f1;

					--accent: #ea7661;
					--hover: #34343a;
					--selected: #42414d;

					--shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.5);

					--nav-height: 40px;
				}

				html,
				body {
					padding: 0;
					margin: 0;
					height: 100vh;
					font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
					background: var(--off-white);
					overflow: hidden;
				}

				::-webkit-scrollbar {
					width: 10px;
					height: 5px;
				}
				::-webkit-scrollbar-thumb {
					border-radius: 7px;
					background: grey;
				}
				::-webkit-scrollbar-track {
					background: var(--panel);
				}
			`}</style>
		</div>
	);
}
