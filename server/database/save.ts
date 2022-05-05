import fs from 'fs';

export default function save(name, data) {
	fs.writeFile('./data/' + name + '.json', JSON.stringify(data, null, '\t'), 'utf8', () => {});
}
