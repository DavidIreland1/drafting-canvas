import Link from 'next/link';
import Image from 'next/image';
import { generateID, toReadableDuration } from '../utils/utils';
import Plus from '../components/icons/plus';

export default function Index(): JSX.Element {
	const files = Array(4)
		.fill(0)
		.map((_, i) => ({ id: generateID(), label: 'Canvas ' + (i + 1), time: Date.now() - Math.random() * 1000000000 }));

	return (
		<div>
			<header>
				<h1>DRAFTING CANVAS</h1>
				<button>
					<Link href={`/canvas/${generateID()}`}>
						<a id="new-canvas">
							<Plus />
							<div>New Canvas</div>
						</a>
					</Link>
				</button>
			</header>
			<div className="grid">
				{files.map((file, i) => (
					<Link key={i} href={`/canvas/${file.id}`}>
						<a className="canvas">
							<div style={{ backgroundColor: 'grey' }}></div>
							<label>{file.label}</label>
							<text>Edited {toReadableDuration(Date.now() - file.time)} ago</text>
						</a>
					</Link>
				))}
			</div>

			<style jsx>{`
				header {
					display: flex;
					justify-content: space-between;
					padding: 0 20px;
				}
				h1 {
					font-weight: 100;
					margin: 10px 0;
					color: var(--text);
				}
				button {
					background-color: var(--panel);
					margin: 10px;
				}

				#new-canvas {
					display: grid;
					grid-template-columns: 30px auto;
				}
				.grid {
					display: grid;
					grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
					gap: 20px;
					padding: 0 20px;
					border-radius: var(--radius);
					height: min-content;
				}
				.canvas {
					display: grid;
					grid-template-rows: 180px 3ch 2ch;
					text-align: center;
					background-color: var(--panel);
					border-radius: var(--radius);
					cursor: default;
					box-shadow: var(--shadow);
					padding: 2px;
					overflow: hidden;
				}
				.canvas > div {
					margin: -2px;
				}
				.canvas:hover {
					padding: 0px;
					border: 2px solid var(--selected);
				}
				label {
					font-size: 2ch;
					line-height: 3ch;
				}
				text {
					font-size: 1.2ch;
				}
			`}</style>
		</div>
	);
}
