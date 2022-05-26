import Link from 'next/link';
// import Image from 'next/image';
import { generateID, toReadableDuration } from '../utils/utils';
import Plus from '../components/icons/plus';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import Menu from '../components/menu/menu';
import canvas from '../components/canvas/canvas';

export default function Index(): JSX.Element {
	const router = useRouter();
	const [canvases, setCanvases] = useState([]);
	const [id, setId] = useState('');

	useEffect(() => {
		const _canvases = JSON.parse(localStorage.getItem('canvases') ?? '[]');
		if (_canvases.length === 0) {
			router.push('/canvas/' + generateID());
			return;
		}
		setCanvases(_canvases);
		setId(generateID());

		const updateCanvases = (event) => event.key === 'canvases' && setCanvases(JSON.parse(localStorage.getItem('canvases') ?? '[]'));
		window.addEventListener('storage', updateCanvases);
		return () => window.removeEventListener('storage', updateCanvases);
	}, [router]);

	useEffect(() => {
		if (canvases.length > 0) localStorage.setItem('canvases', JSON.stringify(canvases));
	}, [canvases]);

	return (
		<main>
			<header>
				<h1>DRAFTING CANVAS</h1>
				<button>
					<Link href={`/canvas/${id}`}>
						<a id="new-button">
							<Plus />
							<div>New Canvas</div>
						</a>
					</Link>
				</button>
			</header>
			<div id="grid-container">
				<div id="grid">
					{canvases.map((canvas, i) => (
						<Card key={i} canvas={canvas} setCanvases={setCanvases} router={router} />
					))}
				</div>
			</div>

			<style jsx>{`
				main {
					height: calc(100vh - var(--nav-height));
					background: var(--nav);
					border-radius: var(--radius);
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
					margin: 10px 0;
					box-shadow: var(--shadow);
				}
				button:hover {
					background: var(--hover);
				}

				#new-button {
					display: grid;
					grid-template-columns: 30px auto;
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
					grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
					gap: 20px;
					padding: 0 20px;
					border-radius: var(--radius);
				}
			`}</style>
		</main>
	);
}

function Card({ canvas, setCanvases, router }) {
	const link = useRef(null);
	return (
		<Link href={`/canvas/${canvas.id}`}>
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
			<li onClick={(event) => router.push('canvas/' + canvas.id) && event.preventDefault()}>Open</li>
			<li onClick={(event) => open('/canvas/' + canvas.id) && event.preventDefault()}>Open in new tab</li>
			<div className="divider" />
			<li onClick={(event) => deleteCanvas(event, canvas.id, setCanvases)}>Delete</li>
		</ul>
	);
}

function deleteCanvas(event, id, setCanvases) {
	event.preventDefault();
	setCanvases(JSON.parse(localStorage.getItem('canvases') ?? '[]').filter((canvas) => canvas.id !== id));
}
