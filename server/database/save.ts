import * as fs from 'fs';
import { doc, setDoc } from 'firebase/firestore';

export default async function save(name, data) {
	// fs.writeFile('./data/' + name + '.json', JSON.stringify(data, null, '\t'), 'utf8', () => {});

	// Add a new document in collection "cities"
	await setDoc(doc(db, 'cities', 'LA'), {
		name: 'Los Angeles',
		state: 'CA',
		country: 'USA',
	});
}
