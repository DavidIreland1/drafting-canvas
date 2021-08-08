import creation from './creation';
import modifications from './modifications/modifications';
import tools from './tools';
import user from './user';

export default {
	...creation,
	...modifications,
	...tools,
	...user,
};
