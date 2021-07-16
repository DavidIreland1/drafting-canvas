module.exports = {
	target: "node",
	mode: "production",
	entry: {
		algorithms: "./reducers/reducers.ts",
	},
	output: {
		path: __dirname + "/reducers/",
		filename: "reducer.js",
		library: "reducer",
		libraryTarget: "umd",
	},
	optimization: {
		minimize: false,
	},
	resolve: {
		extensions: [".ts", ".tsx", ".js"],
	},
	module: {
		rules: [
			{ test: /\.tsx?$/, loader: "ts-loader" },
			{ test: /\.svg$/, loader: "svg-inline-loader" },
		],
	},
};
