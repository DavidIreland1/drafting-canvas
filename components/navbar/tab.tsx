import Link from 'next/link';

export default function Tab({ tab, url }) {
	const drag = (event) => {
		const tab = event.target;

		requestAnimationFrame(() => tab.classList.add('blank'));
		const move = (move_event) => {
			const hover = document.elementFromPoint(move_event.clientX, move_event.clientY);
			if (hover === tab || hover === tab.nextSibling) return;
			if (hover.tagName === 'A') return hover.parentElement.insertBefore(tab, hover);
			if (hover.id === 'plus') return hover.previousElementSibling.append(tab);
			if (hover.id === 'nav') return hover.children[2].append(tab);
		};
		event.target.addEventListener('drag', move);
		const end = () => {
			tab.classList.remove('blank');
			event.target.removeEventListener('drag', move);
		};
		event.target.addEventListener('dragend', end, { once: true });
	};

	return (
		<div>
			<Link key={tab.id} href={'/' + tab.id}>
				<a className={'tab' + (tab.id === url ? ' selected' : '')} draggable="true" onDragStart={drag} onDragOver={(event) => event.preventDefault()}>
					{tab.label}

					<svg className="cross" viewBox="0 0 100 100">
						<line x1="25" y1="25" x2="75" y2="75" />
						<line x1="25" y1="75" x2="75" y2="25" />
					</svg>
				</a>
			</Link>

			<style jsx>{`
				line {
					stroke: white;
					stroke-width: 6;
				}

				.tab {
					padding: 0 5px 0 20px;
					width: max(max-content, 10%);
					border-radius: 4px;
					color: white;
					text-decoration: none;
					box-sizing: border-box;
					display: flex;
					align-items: center;
					display: grid;
					grid-gap: 5px;
					grid-template-columns: max-content 20px;
					height: 100%;
				}

				.tab:-webkit-any-link {
					cursor: default;
				}

				.tab:hover,
				#plus:hover {
					background: var(--hover);
				}
				.tab.selected {
					background: var(--selected);
				}
				.tab.blank {
					color: transparent;
					background: transparent;
				}
				.tab.blank > * {
					visibility: collapse;
				}

				.cross {
					width: 20px;
					height: 20px;
					border-radius: 4px;
					padding: 2px;
					box-sizing: border-box;
					margin: auto;
				}

				.cross:hover {
					background: var(--nav-background);
				}
			`}</style>
		</div>
	);
}
