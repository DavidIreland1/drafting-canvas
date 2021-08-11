import { useRouter } from 'next/router';

import Tab from './tab';
import { useEffect, useState } from 'react';

export default function Navbar({ store, actions }) {
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
			id: 'test-1000',
			label: 'test 1000',
		},
	]);

	useEffect(() => {
		if (page && !tabs.find((tab) => tab.id === page)) {
			setTabs(tabs.concat([{ id: String(page), label: String(page) }]));
		}
	}, [page]);

	function newTab() {
		const id = `${tabs.length + 1}${tabs.length + 1}${tabs.length + 1}`;
		setTabs(tabs.concat([{ id: id, label: `page ${tabs.length + 1}` }]));
		router.push(id);
	}

	function droppable(event) {
		event.preventDefault();
	}

	return (
		<div>
			<div id="nav" onDragOver={droppable}>
				<img src="/images/draft.svg" />
				<div id="title">DRAFTING CANVAS</div>

				<div id="tabs" onDragOver={droppable}>
					{tabs.map((tab, i) => (
						<Tab key={i} tab={tab} url={page} />
					))}
				</div>
				<svg onClick={newTab} id="plus" xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 100 100" onDragOver={droppable}>
					<line x1="50" y1="25" x2="50" y2="75" />
					<line x1="25" y1="50" x2="75" y2="50" />
				</svg>
			</div>

			<style jsx>{`
				#nav {
					display: grid;
					grid-auto-flow: column;
					grid-template-columns: min-content max-content min-content auto;
					height: var(--nav-height);
					background: var(--nav-background);
					color: var(--text-color);
					border-bottom: 1px solid var(--selected);
					max-width: 100vw;
				}
				img {
					height: calc(var(--nav-height) - 12px);
					width: calc(var(--nav-height) - 12px);
					box-sizing: border-box;
					background: white;
					padding: 2px;
					margin: 6px;
					border-radius: 5px;
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
					width: 30px;
					border-radius: 4px;
					margin: 5px 0;
				}
				#plus:hover {
					background: var(--hover);
				}
				line {
					stroke: white;
					stroke-width: 6;
				}
			`}</style>
		</div>
	);
}
