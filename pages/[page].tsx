import Head from 'next/head';

import Sheet from './../components/sheet';

export default function Page({ store }): JSX.Element {
	return (
		<>
			<Head>
				{/* eslint-disable-next-line @next/next/no-sync-scripts */}
				<script src="/primus/primus.js"></script>
			</Head>

			<main>
				<Sheet store={store} />
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
