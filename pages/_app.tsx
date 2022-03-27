import type { AppProps } from 'next/app';

import Navbar from '../components/navbar/navbar';

import store from './../redux/store';
import actions from '../redux/slice';

import './../public/global.css';

import { Provider } from 'react-redux';

export default function DraftingCanvas({ Component, pageProps }: AppProps) {
	return (
		<>
			<Provider store={store as any}>
				<div id="grid">
					<Navbar store={store} actions={actions} />
					<Component {...pageProps} store={store} actions={actions} />
				</div>
			</Provider>

			<style jsx>{`
				#grid {
					display: grid;
					height: 100vh;
					grid-template-rows: var(--nav-height) 1fr;
					grid-gap: var(--grid-gap);
					overflow: hidden;
					background: var(--background);
				}
			`}</style>
		</>
	);
}
