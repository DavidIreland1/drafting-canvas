module.exports = {
	target: 'node',
	mode: 'production',
	entry: './reducers/reducers.ts',
	output: {
		path: __dirname + '/reducers/',
		filename: 'reducers.min.js',
		library: 'reducer',
		libraryTarget: 'umd',
	},
	optimization: {
		minimize: false,
	},
	resolve: {
		extensions: ['.ts', '.js'],
	},
	module: {
		rules: [{ test: /\.tsx?$/, loader: 'ts-loader' }],
	},
};
