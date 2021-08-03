import { useRouter } from 'next/router';

import Link from 'next/link';
import { useState } from 'react';

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
	]);

	function newTab() {
		setTabs(
			tabs.concat([
				{
					id: `page_id_${tabs.length + 1}`,
					label: `page ${tabs.length + 1}`,
				},
			])
		);
	}

	return (
		<div>
			<div id="nav">
				<img src="/images/offwhite.svg" />
				<div id="title">OFF WHITE CANVAS</div>

				<div id="tabs">
					{tabs.map((tab) => (
						<Link key={tab.id} href={'/' + tab.id}>
							<a className={'tab' + (page === tab.id ? ' selected' : '')}>{tab.label}</a>
						</Link>
					))}
					<svg onClick={newTab} id="plus" xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 100 100">
						<line x1="50" y1="25" x2="50" y2="75" />
						<line x1="25" y1="50" x2="75" y2="50" />
					</svg>
				</div>
			</div>

			<style jsx>{`
				#nav {
					display: grid;
					grid-auto-flow: column;
					grid-template-columns: min-content max-content 1fr auto;
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
					grid-gap: 4px;
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
					height: 100%;
					width: 30px;
					border-radius: 4px;
				}

				line {
					stroke: white;
					stroke-width: 6;
				}

				.tab {
					padding: 0 20px;
					width: max-content;
					border-radius: 4px;
					cursor: default;
					color: white;
					text-decoration: none;
					box-sizing: border-box;
					display: flex;
					align-items: center;
				}
				.tab:hover,
				#plus:hover {
					background: var(--hover);
				}
				.tab.selected {
					background: var(--selected);
				}
			`}</style>
		</div>
	);
}
