import creation from './creation';
import modifications from './modifications/modifications';
import tools from './tools';
import user from './user';

const reducers = {
	...creation,
	...modifications,
	...tools,
	...user,
};

export default reducers;
