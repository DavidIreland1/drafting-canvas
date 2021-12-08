import Head from 'next/head';

import { useRouter } from 'next/router';
import { generateID } from '../utils/utils';

export default function Home(): JSX.Element {
	const router = useRouter();

	console.log(router);

	if (typeof window !== 'undefined') {
		if (router.asPath === '/') {
			setTimeout(() => {
				router.replace(generateID());
			}, 100);
		} else {
			router.replace('/' + router.asPath.split('/')[1]);
		}
	}

	return (
		<>
			<Head>
				<title>Drafting Canvas</title>
				<link rel="icon" href="/favicon.svg" />
			</Head>

			<main>
				<div>
					<button onClick={() => router.push('111')}>New Canvas</button>
				</div>
			</main>

			<main></main>

			<style jsx>{`
				button {
					height: 100%;
					width: 100%;
					padding: 20px;
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
