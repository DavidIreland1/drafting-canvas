import { useRouter } from 'next/router';

import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import Tab from './tab';
import User from './user';
import Plus from '../icons/plus';

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
			setTabs(tabs.concat([{ id: String(page), label: 'New Page' }]));
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

	const users = useSelector((state) => (state as any).present.cursors);

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

				<div id="plus" onDragOver={droppable}>
					<Plus onClick={newTab} />
				</div>

				<div id="users">
					{users.map((user, i) => (
						<User key={i} user={user} />
					))}
				</div>
			</div>

			<style jsx>{`
				#nav {
					display: grid;
					grid-auto-flow: column;
					grid-template-columns: min-content max-content min-content 1fr min-content;
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
					padding: 5px;
				}

				line {
					stroke: white;
					stroke-width: 6;
				}

				#users {
					display: grid;
					grid-auto-flow: column;
				}
			`}</style>
		</div>
	);
}
