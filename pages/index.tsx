import Link from 'next/link';
import Image from 'next/image';
import { generateID } from '../utils/utils';
import Plus from '../components/icons/plus';

export default function Index(): JSX.Element {
	const files = Array(4)
		.fill(0)
		.map((_, i) => ({ id: generateID(), label: 'Canvas ' + (i + 1) }));

	return (
		<div>
			<div>
				<h1>DRAFTING CANVAS</h1>
				<button id="new-canvas">
					<Link href={`/canvas/${generateID()}`}>
						<a>
							<Plus />
							<label>New Canvas</label>
						</a>
					</Link>
				</button>
			</div>
			<div className="grid">
				{files.map((file, i) => (
					<div key={i}>
						<Link href={`/canvas/${file.id}`}>
							<a className="card">
								<div style={{ background: 'grey' }}></div>
								<label>{file.label}</label>
							</a>
						</Link>
					</div>
				))}
			</div>

			<style jsx>{`
				h1 {
					font-weight: 100;
					color: var(--text);
				}
				button {
					background: var(--panel);
				}
				.grid {
					display: grid;
					grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
					gap: 20px;
					padding: 20px;
					border-radius: var(--radius);
					height: min-content;
				}
				.card {
					display: grid;
					grid-template-rows: 180px 4ch;
					text-align: center;
					box-shadow: var(--shadow);
					background: var(--panel);
					border-radius: var(--radius);
				}
				label {
					border-top: 1px solid grey;
					line-height: 4ch;
				}
			`}</style>
		</div>
	);
}
