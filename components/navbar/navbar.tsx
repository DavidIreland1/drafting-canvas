import { useRouter } from 'next/router';

import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import Tab from './tab';
import User from './user';
import Plus from '../icons/plus';

import Settings from './../settings';

export default function Navbar({ store, actions }) {
	const router = useRouter();
	const { page } = router.query;

	const [tabs, setTabs] = useState([
		// {
		// 	id: '111',
		// 	label: 'page 1',
		// },
		// {
		// 	id: '222',
		// 	label: 'page 2',
		// },
		// {
		// 	id: '333',
		// 	label: 'page 3',
		// },
		// {
		// 	id: 'test-1000',
		// 	label: 'test 1000',
		// },
	]);

	useEffect(() => {
		if (page && !tabs.find((tab) => tab.id === page)) {
			setTabs(tabs.concat([{ id: String(page), label: 'New Page' }]));
		}
	}, [page]);

	function newTab() {
		const id = `${tabs.length + 1}${tabs.length + 1}${tabs.length + 1}`;
		setTabs(tabs.concat([{ id: id, label: `page ${tabs.length + 1}` }]));
		leavePage();
		router.push(id);
	}

	function droppable(event) {
		event.preventDefault();
	}

	function leavePage() {
		store.dispatch(actions.removeUser({ user_id: Settings.user_id }));
	}

	function closeTab(id) {
		setTabs(tabs.filter((tab) => tab.id !== id));
	}

	const users = useSelector((state) => (state as any).present.cursors);

	function copyLink() {
		navigator.clipboard.writeText(location.href);
	}

	return (
		<div>
			<div id="nav" onDragOver={droppable}>
				<img src="/images/draft.svg" />
				<div id="title">DRAFTING CANVAS</div>

				<div id="tabs" onDragOver={droppable}>
					{tabs.map((tab, i) => (
						<Tab key={i} tab={tab} url={page} leavePage={leavePage} closeTab={closeTab} />
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

				<button onClick={copyLink}>Share</button>

				<a target="_blank" href="https://github.com/DavidIreland1/drafting-canvas">
					<img id="github" src="/images/github.svg" alt="Git" />
				</a>
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

				button {
					margin: 5px;
					background: var(--accent);
					border: 0;
					border-radius: 5px;
					opacity: 0.8;
					height: 30px;
				}
				button:hover {
					opacity: 1;
				}
				#users {
					display: grid;
					grid-auto-flow: column;
				}
				a {
					cursor: default;
					border-radius: 20px;
				}
				#github {
					padding: 3px;
					background: none;
					border-radius: 20px;
					filter: invert(1);
				}
				#github:hover {
					background: #b7b7b7;
				}
			`}</style>
		</div>
	);
}
