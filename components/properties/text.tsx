import { useState } from 'react';
import actions from '../../redux/slice';
import DataList from './../inputs/datalist';
import Input from './../inputs/input';
import Select from './../inputs/select';

async function importFont(fontFamily, variants = 'regular') {
	const link = document.createElement('link');
	link.setAttribute('rel', 'stylesheet');
	link.setAttribute('type', 'text/css');
	link.setAttribute('href', `https://fonts.googleapis.com/css?family=${encodeURIComponent(fontFamily)}:${variants}`);

	document.head.appendChild(link);

	await new Promise((resolve) => {
		link.onload = () => resolve(0);
	});
}

export default function Text({ selected, store, fonts }) {
	const selected_ids = selected.map((element) => element.id);

	function updateText(event, alter = (value) => value) {
		store.dispatch(actions.property({ selected_ids, props: { [event.target.id]: [alter(event.target.value), 0] } }));
	}

	async function updateFont(event) {
		const font_family = event.target.value;
		const font = fonts.find((font) => font.family === font_family);
		if (!font) return;
		setWeights(font.variants);

		(document as any).fonts.onloadingdone = () => {
			updateText({ target: { id: 'style', value: 'normal' } });
			updateText({ target: { id: 'family', value: font_family } });
		};

		await importFont(font_family);

		// Force font load by using it in a div
		const div = document.createElement('div');
		div.innerText = 'hello';
		div.style.fontFamily = font_family;
		div.style.height = '0';
		document.body.append(div);
		requestAnimationFrame(() => div.remove());
	}

	const [weights, setWeights] = useState(['Lighter', 'Normal', 'Bold', 'Bolder']);

	if (typeof selected[0].text !== 'string') return null;

	return (
		<div className="property-container">
			<div className="property-heading">
				<h4>TEXT</h4>
			</div>
			<div className="properties">
				<DataList id="family" label="Font Family" value={selected[0].family} onChange={updateFont}>
					{fonts.map((font, i) => (
						<option key={i} value={font.family} />
					))}
				</DataList>
				<Select id="weight" value={selected[0].weight} onChange={updateText}>
					{weights.map((weight, i) => (
						<option key={i} value={weight}>
							{weight}
						</option>
					))}
				</Select>

				<Input id="size" label="Size" value={selected[0].size} onChange={(event) => updateText(event, (value) => Math.max(value, 0))} />

				<Input id="line_height" label="Line Height" step={0.01} value={selected[0].line_height} onChange={(event) => updateText(event, (value) => Math.max(value, 0))} />

				<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', height: '28px' }} onClick={(event) => updateText({ target: { id: 'justify', value: (event.target as SVGElement).id } })}>
					<svg id="left" className={selected[0].justify === 'left' ? 'selected' : ''} viewBox="0 0 10 10">
						<line x1="1" y1="2" x2="9" y2="2" />
						<line x1="1" y1="5" x2="5" y2="5" />
						<line x1="1" y1="8" x2="7" y2="8" />
					</svg>
					<svg id="center" className={selected[0].justify === 'center' ? 'selected' : ''} viewBox="0 0 10 10">
						<line x1="1" y1="2" x2="9" y2="2" />
						<line x1="3" y1="5" x2="7" y2="5" />
						<line x1="2" y1="8" x2="8" y2="8" />
					</svg>
					<svg id="right" className={selected[0].justify === 'right' ? 'selected' : ''} viewBox="0 0 10 10">
						<line x1="1" y1="2" x2="9" y2="2" />
						<line x1="5" y1="5" x2="9" y2="5" />
						<line x1="3" y1="8" x2="9" y2="8" />
					</svg>
				</div>

				<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', height: '28px' }} onClick={(event) => updateText({ target: { id: 'align', value: (event.target as SVGElement).id } })}>
					<svg id="start" className={selected[0].align === 'start' ? 'selected' : ''} viewBox="0 0 10 10">
						<line x1="2" y1="2" x2="8" y2="2" />
						<line x1="5" y1="3" x2="5" y2="9" />
						<line x1="3" y1="5" x2="5" y2="3" />
						<line x1="7" y1="5" x2="5" y2="3" />
					</svg>
					<svg id="center" className={selected[0].align === 'center' ? 'selected' : ''} viewBox="0 0 10 10">
						<line x1="5" y1="0" x2="5" y2="4" />
						<line x1="3" y1="2" x2="5" y2="4" />
						<line x1="7" y1="2" x2="5" y2="4" />

						<line x1="2" y1="5" x2="8" y2="5" />

						<line x1="5" y1="10" x2="5" y2="6" />
						<line x1="3" y1="8" x2="5" y2="6" />
						<line x1="7" y1="8" x2="5" y2="6" />
					</svg>
					<svg id="end" className={selected[0].align === 'end' ? 'selected' : ''} viewBox="0 0 10 10">
						<line x1="5" y1="1" x2="5" y2="7" />
						<line x1="3" y1="5" x2="5" y2="7" />
						<line x1="7" y1="5" x2="5" y2="7" />
						<line x1="2" y1="8" x2="8" y2="8" />
					</svg>
				</div>
			</div>

			<div className="divider" />

			<style jsx>{`
				svg {
					fill: none;
					stroke: var(--text);
					stroke-width: 0.5;
					height: 100%;
					width: 100%;
					padding: 4px 0;
					box-sizing: border-box;
				}
				svg > * {
					pointer-events: none;
				}
				svg:hover {
					background: var(--hover);
				}
				svg.selected {
					background: var(--selected);
				}
				.divider {
					height: 1px;
					background: var(--border);
					margin: 10px 0;
				}
			`}</style>
		</div>
	);
}
