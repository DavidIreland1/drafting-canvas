import { useRef, useState } from 'react';
import Link from 'next/link';
import Cross from '../icons/cross';
import Text from '../inputs/text';
import actions from '../../redux/slice';

export default function Tab({ id, label, selected, store, onClick, closeTab }) {
	const tab_ref = useRef(null);
	const [editing, setEditing] = useState(false);

	const drag = (event) => {
		const tab = tab_ref.current;

		requestAnimationFrame(() => tab.classList.add('blank'));
		const move = (move_event) => {
			const hover = document.elementFromPoint(move_event.clientX, move_event.clientY);
			if (hover === tab || hover === tab.nextSibling) return;
			if (hover.tagName === 'A' && hover.classList.contains('tab')) return hover.parentElement.parentElement.insertBefore(tab, hover.parentElement);
			if (hover.tagName === 'SVG') return hover.parentElement.parentElement.parentElement.insertBefore(tab, hover.parentElement.parentElement.parentElement);
			if (hover.id === 'plus') return hover.previousElementSibling.append(tab);
			if (hover.id === 'nav') return hover.children[1].append(tab);
		};
		event.target.addEventListener('drag', move);
		const end = () => {
			tab.classList.remove('blank');
			event.target.removeEventListener('drag', move);
		};
		event.target.addEventListener('dragend', end, { once: true });
	};

	return (
		<div ref={tab_ref}>
			<Link href={'/canvas/' + id}>
				<a onClick={onClick} className={'tab' + (selected ? ' selected' : '')} draggable="true" onDragStart={drag} onDragOver={(event) => event.preventDefault()}>
					{editing ? (
						<Text id="props" highlight={true} onBlur={() => setEditing(false)} onChange={(event) => store.dispatch(actions.label(event.target.value))}>
							{label}
						</Text>
					) : (
						<div onDoubleClick={() => setEditing(true)}>{label}</div>
					)}

					<Cross onClick={(event) => closeTab(event, id)} />
				</a>
			</Link>

			<style jsx>{`
				line {
					stroke: white;
					stroke-width: 6;
				}
				.tab {
					padding: 2px 5px 2px 20px;
					width: max(max-content, 10%);
					border-radius: var(--radius);
					box-sizing: border-box;
					display: flex;
					align-items: center;
					display: grid;
					gap: 5px;
					grid-template-columns: max-content 23px;
					height: 100%;
					opacity: 0.999; /* for circular nodes with html draggable */
				}
				.tab:-webkit-any-link {
					cursor: default;
				}
				.tab:hover,
				#plus:hover {
					background-color: var(--hover);
				}
				.tab.selected {
					background-color: var(--selected);
				}
				.blank {
					color: transparent;
					background-color: transparent;
				}
				.blank > * {
					visibility: collapse;
				}
			`}</style>
		</div>
	);
}
