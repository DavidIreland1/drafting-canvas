import './../public/global.css';
import './../public/menu.css';

import Navbar from '../components/navbar/navbar';
import makeStore from './../redux/store';

import { Provider } from 'react-redux';
import Head from 'next/head';
import Script from 'next/script';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function App({ Component, pageProps }) {
	const router = useRouter();
	const { canvas_id } = router.query;

	const [store, setStore] = useState(makeStore(undefined)[0]);

	// For console debugging
	if (typeof window !== 'undefined') {
		(window as any).store = store;
	}

	useEffect(() => {
		const [new_store, cleanUp] = makeStore(canvas_id);
		setStore(new_store);

		return () => {
			cleanUp();
		};
	}, [canvas_id]);

	return (
		<>
			<Head>
				<meta charSet="utf-8" />
				<meta httpEquiv="X-UA-Compatible" content="IE=edge" />
				<meta name="viewport" content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no" />
				<meta name="description" content="Drafting Canvas is a free real time collaborative design tool created as open source project" />
				<meta name="keywords" content="Design, Vector, Collaborate, Editor, Whiteboard, Draw, Sketch, Create, Draft, Canvas, Board, Pen, Pencil, Ink, Realtime" />
				<title>Drafting Canvas</title>

				<link rel="manifest" href="/manifest.json" />
				<link href="/favicon.svg" rel="icon" type="image/svg" />
				<link rel="apple-touch-icon" href="/images/icon-512x512.png"></link>
				<meta name="theme-color" content="#1b1b1d" />
				{/* eslint-disable-next-line @next/next/no-sync-scripts */}
				<script src="https://drafting-canvas.uc.r.appspot.com/primus/primus.js"></script>
			</Head>

			<div id="scrub-cursor">
				<svg width="27" height="12" viewBox="0 0 27 12" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path d="M16.6439 7.50057H16.644H19.5384V9.58657V10.5842L20.3377 9.98714L25.1378 6.40114L25.6741 6.00052L25.1378 5.59997L20.3376 2.01497L19.5384 1.4181V2.41557V4.52057H16.644H7.49642V2.41357V1.41926L6.69825 2.01221L1.8698 5.59921L1.32945 6.00063L1.86985 6.40198L6.69831 9.98798L7.49642 10.5807V9.58657V7.49963L16.6439 7.50057Z" fill="black" stroke="white" />
				</svg>
			</div>
			<div id="portal" />

			<Provider store={store}>
				<div id="grid">
					<Navbar store={store} />
					<Component {...pageProps} store={store} />
				</div>
			</Provider>

			<style jsx>{`
				#grid {
					display: grid;
					height: 100vh;
					grid-template-rows: var(--nav-height) 1fr;
					gap: var(--gap);
					overflow: hidden;
					background: var(--background);
				}
				#scrub-cursor {
					position: absolute;
					pointer-events: none;
					display: none;
					z-index: 5;
					width: 16px;
					height: 8px;
				}
				svg {
					transform: translateX(-50%) translateY(-75%);
				}
			`}</style>

			<Script strategy="lazyOnload" src={`https://www.googletagmanager.com/gtag/js?id=G-BFF4BH7DGZ`} />

			<Script id="google-analytics" strategy="lazyOnload">
				{`
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments)}
                    gtag('js', new Date());
                    gtag('config', 'G-BFF4BH7DGZ', {
                    page_path: window.location.pathname,
                    });
                `}
			</Script>
		</>
	);
}
