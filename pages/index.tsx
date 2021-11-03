import Head from 'next/head';

import { useRouter } from 'next/router';

export default function Home(): JSX.Element {
	const router = useRouter();

	if (router.route !== '/') router.push(router.route);

	return (
		<div className="container">
			<Head>
				<title>Drafting Canvas</title>
				<link rel="icon" href="/favicon.svg" />
			</Head>

			<main>
				<button onClick={() => router.push('111')}>Create New Page</button>
			</main>

			<style jsx>{`
				canvas {
					width: 100vw;
					height: 100vh;
					background: #f1f1f1;
				}
			`}</style>

			<style jsx global>{`
				html,
				body {
					padding: 0;
					margin: 0;
					font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
				}

				* {
					box-sizing: border-box;
				}
			`}</style>
		</div>
	);
}
