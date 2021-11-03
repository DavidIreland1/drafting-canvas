import Head from 'next/head';

import { useRouter } from 'next/router';

export default function Home(): JSX.Element {
	const router = useRouter();

	return (
		<div className="container">
			<Head>
				<title>Create Next App</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<main>
				<h1>Hello</h1>

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
