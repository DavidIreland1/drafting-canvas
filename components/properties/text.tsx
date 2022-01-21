import DataList from './inputs/datalist';
import Fonts from '../../utils/fonts';
import Input from './inputs/input';
import { useEffect, useRef } from 'react';
import Select from './inputs/select';

export default function Text({ selected, store, actions, width }) {
	const selected_ids = selected.map((element) => element.id);

	function updateText(event, alter = (value) => value) {
		store.dispatch(actions.property({ selected_ids, props: { [event.target.id]: alter(event.target.value) } }));
	}

	if (typeof selected[0].text !== 'string') return null;

	const textarea = useRef(null);

	useEffect(() => {
		updateTextarea(textarea.current);
	}, [textarea, width]);

	return (
		<div id="property-container">
			<div className="property-heading">
				<h4>TEXT</h4>
			</div>
			<div id="properties">
				<textarea ref={textarea} id="text" onChange={updateText} placeholder="Text..." value={selected[0].text === 'Text...' ? undefined : selected[0].text} onInput={(event) => updateTextarea(event.target)} />

				<DataList id="family" label="Font Family" value={selected[0].family} onChange={updateText}>
					{Fonts.map((font, i) => (
						<option key={i} value={font}></option>
					))}
				</DataList>

				<Input id="size" label="Size" value={selected[0].size} onChange={(event) => updateText(event, (value) => Math.max(value, 0))} width={width} />

				<Select id="weight" label="" value={selected[0].weight} onChange={updateText}>
					<option value="lighter">Lighter</option>
					<option value="normal">Normal</option>
					<option value="bold">Bold</option>
					<option value="bolder">Bolder</option>
				</Select>

				<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', height: '28px' }} onClick={(event) => updateText({ target: { id: 'justified', value: (event.target as SVGElement).id } })}>
					<svg id="left" className={selected[0].justified === 'left' ? 'selected' : ''} viewBox="0 0 10 10">
						<line x1="1" y1="2" x2="9" y2="2" />
						<line x1="1" y1="5" x2="5" y2="5" />
						<line x1="1" y1="8" x2="7" y2="8" />
					</svg>
					<svg id="center" className={selected[0].justified === 'center' ? 'selected' : ''} viewBox="0 0 10 10">
						<line x1="1" y1="2" x2="9" y2="2" />
						<line x1="3" y1="5" x2="7" y2="5" />
						<line x1="2" y1="8" x2="8" y2="8" />
					</svg>
					<svg id="right" className={selected[0].justified === 'right' ? 'selected' : ''} viewBox="0 0 10 10">
						<line x1="1" y1="2" x2="9" y2="2" />
						<line x1="5" y1="5" x2="9" y2="5" />
						<line x1="3" y1="8" x2="9" y2="8" />
					</svg>
				</div>

				<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', height: '28px' }} onClick={(event) => updateText({ target: { id: 'align', value: (event.target as SVGElement).id } })}>
					<svg id="top" className={selected[0].align === 'top' ? 'selected' : ''} viewBox="0 0 10 10">
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
					<svg id="bottom" className={selected[0].align === 'bottom' ? 'selected' : ''} viewBox="0 0 10 10">
						<line x1="5" y1="1" x2="5" y2="7" />
						<line x1="3" y1="5" x2="5" y2="7" />
						<line x1="7" y1="5" x2="5" y2="7" />
						<line x1="2" y1="8" x2="8" y2="8" />
					</svg>
				</div>
			</div>

			<div className="divider" />

			<style jsx>{`
				#properties {
					display: grid;
					gap: 8px calc(${width} / 20);
					height: min-content;
					width: fit-content;
					width: 100%;
					box-sizing: border-box;
					padding: 0 10px;
					overflow: hidden;
				}
				textarea {
					width: 100%;
					resize: none;
					background: transparent;
					border: none;
					color: var(--text-color);
					font-size: 16px;
					width: 100%;
					font-size: inherit;
					font-weight: inherit;
					font-family: inherit;
					background: var(--hover);
					border-bottom: 1px solid var(--hover);
				}
				textarea:focus {
					outline: none;
				}

				textarea:hover {
					background: var(--hover);
				}
				textarea:focus-within {
					background: var(--hover);
					border-bottom: 1px solid white;
				}
				svg {
					fill: none;
					stroke: var(--text-color);
					stroke-width: 0.5;
					height: 100%;
					width: 100%;
					padding: 4px 0;
					box-sizing: border-box;
				}
				svg:hover {
					background: var(--hover);
				}
				svg.selected {
					background: var(--selected);
				}
				.divider {
					height: 2px;
					background: var(--selected);
					margin: 10px 0;
				}
			`}</style>
		</div>
	);
}

function updateTextarea(target) {
	target.style.height = '';
	target.style.height = target.scrollHeight + 'px';
}
