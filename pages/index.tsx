import Link from 'next/link';
import Image from 'next/image';
import { generateID } from '../utils/utils';
import Plus from '../components/icons/plus';

export default function Home(): JSX.Element {
	const files = Array(4)
		.fill(0)
		.map((_, i) => ({ id: generateID(), label: 'Page ' + i }));

	// useEffect(() => {
	// 	if (router.asPath === '/') {
	// 		router.replace('/file/' + generateID());
	// 	} else {
	// 		router.replace('/' + router.asPath.split('/')[1]);
	// 	}
	// }, [router]);

	return (
		<div>
			<h1>DRAFTING CANVAS</h1>
			<div className="grid">
				{files.map((file, i) => (
					<div key={i}>
						<Link href={`file/${file.id}`}>
							<a className="card">
								<Image alt={file.label} src="/favicon.svg" priority={true} height="100" width="100" />
								<label>{file.label}</label>
							</a>
						</Link>
					</div>
				))}
				{/* <Plus /> */}
			</div>

			<style jsx>{`
				h1 {
					font-weight: 100;
				}
				.grid {
					display: grid;
					grid-auto-flow: column;
					gap: 10px;
					height: 100%;
					border-radius: var(--radius);
				}
				.card {
					display: grid;
					text-decoration: none;
					text-align: center;
					color: var(--text);
					box-shadow: var(--shadow);
				}
			`}</style>
		</div>
	);
}
