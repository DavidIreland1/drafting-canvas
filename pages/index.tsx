import Link from 'next/link';
import { generateID, toReadableDuration } from '../utils/utils';
import Plus from '../components/icons/plus';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import Menu from '../components/menu/menu';
import Persistent from '../utils/persistent';

export default function Index(): JSX.Element {
	const router = useRouter();
	const [canvases, setCanvases] = useState([]);
	const [id, setId] = useState('');

	useEffect(() => {
		const _canvases = Persistent.load('canvases');
		if (_canvases.length === 0) {
			router.push('/editor/' + generateID());
			return;
		}
		setCanvases(_canvases);
		setId(generateID());

		const updateCanvases = (event) => event.key === 'canvases' && setCanvases(Persistent.load('canvases'));
		window.addEventListener('storage', updateCanvases);
		return () => window.removeEventListener('storage', updateCanvases);
	}, [router]);

	useEffect(() => {
		if (canvases.length > 0) Persistent.save('canvases', canvases);
	}, [canvases]);

	return (
		<main>
			<header>
				<h1>DRAFTING CANVAS</h1>
				<button>
					<Link href={`/editor/${id}`}>
						<a id="new-button">
							<Plus />
							<div>New Canvas</div>
						</a>
					</Link>
				</button>
			</header>
			<div id="grid-container">
				<div id="grid">
					{canvases
						.slice(0)
						.sort((a, b) => b.time - a.time)
						.map((canvas, i) => (
							<Card key={i} canvas={canvas} setCanvases={setCanvases} router={router} />
						))}
				</div>
			</div>
			<div id="logo-cover">
				<div id="background">
					<img alt="DC" src="/images/draft.svg" />
				</div>
				<div className="concave" />
				<div className="gap" />
				<div className="involute" />
			</div>

			<style jsx>{`
				main {
					height: calc(100vh - var(--nav-height));
					background: var(--toolbar);
				}
				header {
					display: flex;
					justify-content: space-between;
					padding: 0 20px;
				}
				h1 {
					font-size: 3ch;
					font-weight: 100;
					margin: 10px 0;
					color: var(--text);
				}
				button {
					background: var(--panel);
					margin: auto 0;
					box-shadow: var(--shadow);
				}
				button:hover {
					background: var(--hover);
				}

				#new-button {
					display: grid;
					grid-template-columns: 30px auto;
					cursor: default;
				}
				#new-button > div {
					margin: auto 10px;
				}
				#grid-container {
					height: 100%;
					overflow-y: auto;
					overflow-y: overlay;
				}
				#grid {
					display: grid;
					grid-template-columns: repeat(auto-fit, minmax(300px, 0.333fr));
					gap: 20px;
					padding: 0 20px;
					border-radius: var(--radius);
				}
				@media (max-aspect-ratio: 1/1) {
					#grid {
						grid-template-columns: 1fr;
					}
				}
				#logo-cover {
					position: absolute;
					top: 0;
					left: 0;
					display: grid;
					grid-auto-flow: column;
				}
				#background {
					box-sizing: border-box;
					width: calc(var(--nav-height) + var(--gap));
					height: calc(var(--nav-height) + var(--gap));
					background: var(--toolbar);
					border-radius: 0 calc(var(--radius) * 2) 0 0;
				}
				.concave {
					position: absolute;
					box-sizing: border-box;
					top: calc(var(--gap) * -1);
					top: 0;
					left: 0;
					width: calc(var(--nav-height) + var(--gap));
					height: var(--nav-height);
					border-radius: 0 calc(var(--radius) * 2) 0 0;
					border-style: solid;
					border-width: var(--gap) var(--gap) 0 0;
					border-color: var(--background);
				}
				.gap {
					position: absolute;
					box-sizing: border-box;
					border-style: solid;
					top: calc(var(--nav-height) / 2 + var(--gap));
					left: calc(var(--nav-height) - var(--gap));
					width: calc(var(--nav-height) / 2);
					height: calc(var(--nav-height) / 2 + var(--gap));
					border-width: 0 0 calc(var(--gap) * 2) calc(var(--gap) * 2);
					border-radius: 0 0 0 calc(var(--radius) * 2);
					border-color: var(--toolbar);
				}
				.involute {
					position: absolute;
					box-sizing: border-box;
					border-style: solid;
					top: calc(var(--nav-height) / 2 + var(--gap));
					left: var(--nav-height);
					width: calc(var(--nav-height) / 2);
					height: calc(var(--nav-height) / 2);
					border-width: 0 0 var(--gap) var(--gap);
					border-radius: 0 0 0 calc(var(--radius) * 2);
					border-color: var(--background);
					left: calc(var(--nav-height));
					z-index: 1;
				}
				img {
					height: calc(var(--nav-height) - 12px);
					width: calc(var(--nav-height) - 12px);
					box-sizing: border-box;
					background: white;
					padding: 2px;
					margin: 6px;
					border-radius: var(--radius);
					box-shadow: var(--shadow);
				}
			`}</style>
		</main>
	);
}

function Card({ canvas, setCanvases, router }) {
	const link = useRef(null);
	return (
		<Link href={`/editor/${canvas.id}`}>
			<a ref={link} className="canvas">
				<div style={{ background: 'var(--hover)' }}></div>
				<label>{canvas.label}</label>
				<p>Edited {toReadableDuration(Date.now() - canvas.time)} ago</p>
				<Menu element={link} getContents={getContextMenu} props={{ canvas, setCanvases, router }}></Menu>
				<style jsx>{`
					.canvas {
						display: grid;
						grid-template-rows: 180px 3ch 2ch;
						text-align: center;
						background: var(--panel);
						border-radius: var(--radius);
						cursor: default;
						padding: 2px;
						overflow: hidden;
					}
					.canvas > div {
						margin: -2px;
					}
					.canvas:hover {
						padding: 0px;
						border: 2px solid var(--hover);
						box-shadow: var(--shadow);
					}
					label {
						font-size: 2ch;
						line-height: 3ch;
					}
					p {
						font-size: 1.2ch;
						margin: 0;
					}
				`}</style>
			</a>
		</Link>
	);
}

function getContextMenu(_event, { canvas, setCanvases, router }) {
	return (
		<ul>
			<li onClick={(event) => router.push(`/editor/${canvas.id}`) && event.preventDefault()}>Open</li>
			<li onClick={(event) => open(`/editor/${canvas.id}`) && event.preventDefault()}>Open in new tab</li>
			<div className="divider" />
			<li onClick={(event) => deleteCanvas(event, canvas.id, setCanvases)}>Delete</li>
		</ul>
	);
}

function deleteCanvas(event, id, setCanvases) {
	event.preventDefault();
	setCanvases(Persistent.load('canvases').filter((canvas) => canvas.id !== id));
}
