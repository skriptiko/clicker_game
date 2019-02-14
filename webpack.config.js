const path = require('path');

let conf = {
  	entry: './src/index.js',
  	output: {
    	path: path.resolve(__dirname, 'build'),
		filename: 'main.js',
		publicPath: 'build/'
  	},
  	devServer: {
		overlay: true
  	},
	module: {
		rules: [
	      {
	        test: /\.js$/,
	        exclude: /node_modules/,
	        use: {
	          loader: "babel-loader"
	        }
	      }
	    ]
	},
	devtool: 'eval-sourcemap'
};

module.exports = conf;

module.exports = (_env, _options) => {
	let production = (_options.mode === 'production');
	conf.devtool = production ? false : 'eval-sourcemap';
	return conf;
}