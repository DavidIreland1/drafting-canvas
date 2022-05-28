import * as fs from 'fs';
import path from 'path';

export async function load(name) {
	const file = path.join(__dirname, `./data/${name}.json`);
	try {
		return JSON.parse(String(fs.readFileSync(file)));
	} catch (error) {
		return undefined;
	}
}

export async function save(name, data) {
	const file = path.join(__dirname, `./data/${name}.json`);
	fs.writeFileSync(file, JSON.stringify(data, null, '\t'), 'utf8');
}
