import { useRouter } from 'next/router';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Navbar() {
	const router = useRouter();
	const { page } = router.query;

	const [tabs, setTabs] = useState([
		{
			id: '111',
			label: 'page 1',
		},
		{
			id: '222',
			label: 'page 2',
		},
		{
			id: '333',
			label: 'page 3',
		},
		{
			id: 'test-100',
			label: 'test 100',
		},
	]);

	useEffect(() => {
		if (page && !tabs.find((tab) => tab.id === page)) {
			setTabs(tabs.concat([{ id: String(page), label: String(page) }]));
		}
	}, [page]);

	function newTab() {
		const id = `${tabs.length + 1}${tabs.length + 1}${tabs.length + 1}`;
		setTabs(
			tabs.concat([
				{
					id: id,
					label: `page ${tabs.length + 1}`,
				},
			])
		);
		router.push(id);
	}

	const drag = (event) => {
		const page = event.target;

		console.log(page);
		requestAnimationFrame(() => {
			page.classList.add('blank');
		});
		const move = (move_event) => {
			const hover = document.elementFromPoint(move_event.clientX, move_event.clientY);
			if (hover === page || hover === page.nextSibling) return;
			if (hover.tagName === 'A') return hover.parentElement.insertBefore(page, hover);
			if (hover.id === 'plus') return hover.previousElementSibling.append(page);
			if (hover.id === 'nav') return hover.children[2].append(page);
		};
		event.target.addEventListener('drag', move);
		const end = () => {
			page.classList.remove('blank');
			event.target.removeEventListener('drag', move);
			// restructure();
		};
		event.target.addEventListener('dragend', end, { once: true });
	};

	return (
		<div>
			<div id="nav" onDragOver={(event) => event.preventDefault()}>
				<img src="/images/offwhite.svg" />
				<div id="title">RADIUS</div>

				<div id="tabs" onDragOver={(event) => event.preventDefault()}>
					{tabs.map((tab) => (
						<Link key={tab.id} href={'/' + tab.id}>
							<a className={'tab' + (page === tab.id ? ' selected' : '')} draggable="true" onDragStart={drag} onDragOver={(event) => event.preventDefault()}>
								{tab.label}
							</a>
						</Link>
					))}
				</div>
				<svg onClick={newTab} id="plus" xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 100 100" onDragOver={(event) => event.preventDefault()}>
					<line x1="50" y1="25" x2="50" y2="75" />
					<line x1="25" y1="50" x2="75" y2="50" />
				</svg>
			</div>

			<style jsx>{`
				#nav {
					display: grid;
					grid-auto-flow: column;
					grid-template-columns: min-content max-content max-content min-content auto;
					height: var(--nav-height);
					background: var(--nav-background);
					color: var(--text-color);
					border-bottom: 1px solid var(--selected);
				}
				img {
					height: var(--nav-height);
					width: var(--nav-height);
					padding: 2px;
				}
				#title {
					min-width: max-content;
					width: fit-content;
					height: var(--nav-height);
					padding: 0 10px;
					line-height: var(--nav-height);
					font-weight: 200;
					font-size: calc(var(--nav-height) / 2);
				}

				#tabs {
					display: grid;
					grid-gap: 5px;
					grid-auto-flow: column;
					width: fit-content;
					height: var(--nav-height);
					padding: 5px;
					box-sizing: border-box;
					overflow-x: auto;
					overflow-x: overlay;
					overflow-y: hidden;
				}
				#plus {
					height: calc(100% - 10px);
					width: 30px;
					border-radius: 4px;
					margin: 5px;
				}

				line {
					stroke: white;
					stroke-width: 6;
				}

				.tab {
					padding: 0 20px;
					width: max-content;
					border-radius: 4px;
					color: white;
					text-decoration: none;
					box-sizing: border-box;
					display: flex;
					align-items: center;
					cursor: default !impoortant;
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
			`}</style>
		</div>
	);
}
