import Head from 'next/head';

import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function Home(): JSX.Element {
	const router = useRouter();

	useEffect(() => {
		console.log(router);
		if (router.route !== '/') router.push(router.route);
	}, []);

	return (
		<>
			<Head>
				<title>Drafting Canvas</title>
				<link rel="icon" href="/favicon.svg" />
			</Head>

			<main>
				<button onClick={() => router.push('111')}>New Canvas</button>
			</main>

			<style jsx>{`
				button {
					height: 100%;
					width: 100%;
					padding: 20px;
					margin: 30%;
					box-sizing: border-box;
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
		</>
	);
}
