// import * as fs from 'fs';

// export default function load(name) {
// 	try {
// 		return JSON.parse(String(fs.readFileSync('./data/' + name + '.json')));
// 	} catch (error) {
// 		return undefined;
// 	}
// }

import { doc, getDoc } from 'firebase/firestore';
import { db } from './firestore';

export default async function load(name) {
	const docRef = doc(db, 'cities', name);
	const docSnap = await getDoc(docRef);

	if (!docSnap.exists()) return undefined;

	return docSnap.data();
}
