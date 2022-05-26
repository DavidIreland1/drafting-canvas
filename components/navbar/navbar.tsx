/* eslint-disable @next/next/no-img-element */
import { useRouter } from 'next/router';

import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import Tab from './tab';
import Users from './users';
import Plus from '../icons/plus';

import Settings from './../settings';
import Theme from '../icons/theme';
import actions from '../../redux/slice';
import { generateID } from '../../utils/utils';
import { RootState } from '../../redux/store';
import Link from 'next/link';

export default function Navbar({ store }) {
	const router = useRouter();
	const { page } = router.query;

	const [tabs, setTabs] = useState([]);

	useEffect(() => {
		if (page && !tabs.find((tab) => tab.id === page)) {
			setTabs(tabs.concat([{ id: String(page), label: 'New Canvas' }]));
		}
	}, [page, tabs]);

	function newTab() {
		const id = generateID();
		setTabs([...tabs, { id: id, label: `New Canvas ${tabs.length}` }]);
		removeUser();
		router.push('/canvas/' + id);
	}

	function droppable(event) {
		event.preventDefault();
	}

	function removeUser() {
		store.dispatch(actions.removeUser({ user_id: Settings.user_id }));
	}

	function closeTab(event, id) {
		event.preventDefault();
		event.stopPropagation();
		const open_tabs = tabs.filter((tab) => tab.id !== id);
		setTabs(open_tabs);
		if (page === id) router.push(open_tabs.length ? '/canvas/' + tabs[0].id : '/');
	}

	const page_label = useSelector(
		(state) => (state as RootState).present.page.label,
		(a, b) => JSON.stringify(a) === JSON.stringify(b)
	);

	return (
		<>
			<nav id="nav" onDragOver={droppable}>
				<Link href="/">
					<a>
						<img alt="DC" src="/images/draft.svg" />
					</a>
				</Link>

				<div id="tabs" onDragOver={droppable}>
					{tabs.map((tab, i) => (
						<Tab key={i} id={tab.id} label={page === tab.id ? page_label : tab.label} selected={page === tab.id} store={store} onClick={removeUser} closeTab={closeTab} />
					))}
				</div>

				<div id="plus" onDragOver={droppable}>
					<Plus onClick={newTab} />
				</div>
				<Users />
				<Share />
				<Theme />
				<a id="github" target="_blank" rel="noreferrer" href="https://github.com/DavidIreland1/drafting-canvas" aria-label="Github">
					<svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
						<path
							fillRule="evenodd"
							clipRule="evenodd"
							d="M8 0C3.58 0 0 3.58 0 8C0 11.54 2.29 14.53 5.47 15.59C5.87 15.66 6.02 15.42 6.02 15.21C6.02 15.02 6.01 14.39 6.01 13.72C4 14.09 3.48 13.23 3.32 12.78C3.23 12.55 2.84 11.84 2.5 11.65C2.22 11.5 1.82 11.13 2.49 11.12C3.12 11.11 3.57 11.7 3.72 11.94C4.44 13.15 5.59 12.81 6.05 12.6C6.12 12.08 6.33 11.73 6.56 11.53C4.78 11.33 2.92 10.64 2.92 7.58C2.92 6.71 3.23 5.99 3.74 5.43C3.66 5.23 3.38 4.41 3.82 3.31C3.82 3.31 4.49 3.1 6.02 4.13C6.66 3.95 7.34 3.86 8.02 3.86C8.7 3.86 9.38 3.95 10.02 4.13C11.55 3.09 12.22 3.31 12.22 3.31C12.66 4.41 12.38 5.23 12.3 5.43C12.81 5.99 13.12 6.7 13.12 7.58C13.12 10.65 11.25 11.33 9.47 11.53C9.76 11.78 10.01 12.26 10.01 13.01C10.01 14.08 10 14.94 10 15.21C10 15.42 10.15 15.67 10.55 15.59C13.71 14.53 16 11.53 16 8C16 3.58 12.42 0 8 0Z"
							transform="scale(64)"
						/>
					</svg>
				</a>
			</nav>

			<style jsx>{`
				nav {
					--nav: #202021;
					--panel: #262628;
					--title: #ffffff;
					--text: #ffffff;
					--icon: #f1f1f1;
					--border: #42414d;
					--accent: #1a83ee;
					--hover: #34343a;
					--selected: #3a3943;
					--invalid: #6f3939;

					display: grid;
					grid-auto-flow: column;
					grid-template-columns: min-content min-content 1fr min-content min-content min-content;
					height: var(--nav-height);
					background: var(--nav);
					color: var(--text);
					max-width: 100vw;
				}
				img {
					height: calc(var(--nav-height) - 12px);
					width: calc(var(--nav-height) - 12px);
					box-sizing: border-box;
					background: white;
					padding: 2px;
					margin: 6px;
					border-radius: var(--radius);
				}
				#title {
					min-width: max-content;
					width: fit-content;
					height: var(--nav-height);
					padding: 0 10px;
					line-height: var(--nav-height);
					font-weight: 200;
					font-size: calc(var(--nav-height) / 2);
					margin: 0;
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
					height: 30px;
					padding: 5px;
				}
				line {
					stroke: white;
					stroke-width: 6;
				}
				a {
					cursor: default;
					border-radius: 20px;
					height: 40px;
				}
				#github > svg {
					padding: 4px;
					margin: 4px;
					height: 32px;
					width: 32px;
					background: none;
					border-radius: 20px;
					box-sizing: border-box;
					fill: var(--icon);
					opacity: 0.8;
				}
				#github > svg:hover {
					opacity: 1;
				}
			`}</style>
		</>
	);
}

function Share() {
	function copyLink() {
		navigator.clipboard.writeText(location.href);
		setDisplay('block');
		setTimeout(() => setDisplay('none'), 3000);
	}

	const [display, setDisplay] = useState('none');
	return (
		<>
			<button onClick={copyLink}>Share</button>

			<div id="notice" style={{ display, opacity: display ? 1 : 0 }}>
				Link copied to clipboard
			</div>
			<style jsx>{`
				button {
					margin: 5px;
					background: var(--accent);
					border: 0;
					border-radius: 5px;
					opacity: 0.8;
					height: 30px;
					color: var(--text);
				}
				button:hover {
					opacity: 1;
				}
				#notice {
					position: absolute;
					bottom: 100px;
					left: 50%;
					width: max-content;
					padding: 4px 10px;
					background: var(--panel);
					z-index: 4;
					transform: translateX(-50%);
					border-radius: var(--radius);
					transition: opacity 500ms;
				}
			`}</style>
		</>
	);
}
