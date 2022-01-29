import Head from 'next/head';

import Sheet from './../components/sheet';

export default function Page({ store, actions }): JSX.Element {
	return (
		<>
			<Head>
				<title>Drafting Canvas</title>
				<link rel="icon" href="/favicon.svg" />
				<script src="/primus/primus.js"></script>
			</Head>

			<main>
				<Sheet store={store} actions={actions} />
			</main>

			<style jsx>{`
				main {
					height: calc(100vh - var(--nav-height));
					display: grid;
					grid-template-rows: min-content;
				}
			`}</style>
		</>
	);
}
