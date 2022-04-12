import type { AppProps } from 'next/app';

import Navbar from '../components/navbar/navbar';

import store from './../redux/store';

import './../public/global.css';

import { Provider } from 'react-redux';
import Head from 'next/head';
import Script from 'next/script';

export default function DraftingCanvas({ Component, pageProps }: AppProps) {
	return (
		<>
			<Head>
				<title>Drafting Canvas</title>
				<link rel="icon" href="/favicon.svg" />
				<meta name="description" content="Drafting Canvas is a free real time collaborative design tool created as open source project" />
				<meta name="keywords" content="Design, Vector, Collaborate, Editor, Whiteboard, Draw, Sketch, Create, Draft, Canvas, Board, Pen, Pencil, Ink, Realtime" />
			</Head>
			<Provider store={store as any}>
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
					grid-gap: var(--grid-gap);
					overflow: hidden;
					background: var(--background);
				}
			`}</style>

			<Script strategy="lazyOnload" src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}`} />

			<Script id="google-analytics" strategy="lazyOnload">
				{`
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments)}
                    gtag('js', new Date());
                    gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}', {
                    page_path: window.location.pathname,
                    });
                `}
			</Script>
		</>
	);
}
