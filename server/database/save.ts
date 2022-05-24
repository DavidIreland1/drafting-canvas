// import * as fs from 'fs';
// export default async function save(name, data) {
// 		fs.writeFile('./data/' + name + '.json', JSON.stringify(data, null, '\t'), 'utf8', () => {});
// }

import { doc, setDoc } from 'firebase/firestore';
import { db } from './firestore';

export default async function save(name, data) {
	// Add a new document in collection "files"
	await setDoc(doc(db, 'files', name), data);
}
