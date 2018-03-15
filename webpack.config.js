const path = require('path');
const fs = require('fs');
const HtmlWebpackPlugin = require('html-webpack-plugin');
fs.readdir(__dirname, (err, files) => {
	// console.log(files);
});
module.exports = {
	/**
	 * mode 
	 * 
	 * production 生产模式
	 * development 开发模式
	 */
	mode: 'development',
	context: path.resolve(__dirname, 'src'),
	entry: './index.js',
	output: {
		path: path.join(__dirname, 'dist'),
		// filename: '[name].[chunkhash:8].js', // 生产环境可以使用
		filename: '[name].[hash:8].js',
		libraryTarget: 'umd'
	},
	devServer: {
		contentBase: path.join(__dirname, 'dist'),
		inline: true,
		port: 3000,
		historyApiFallback: {
			rewrites: { from: /./, to: '/404.html' },
			disableDotRule: true
		},
		overlay: true,
		// 开启报错提示
		stats: 'errors-only',
		proxy: {
			'/': {
				// 代理地址
				target: 'http://10.11.23.78',
				bypass: function(req, res, proxyOptions) {
					if (req.headers.accept.indexOf('html') !== -1) {
						// console.log('Skipping proxy for browser request.');
						return '/index.html';
					}
				}
			}
		}
	},
	// 包(bundle)应该运行的环境
	target: 'web',
	externals: {
		react: 'React',
		'react-dom': 'ReactDOM',
		axios: 'Axios'
	},
	module: {
		rules: [
			{
				test: /\.js[x]?$/,
				include: path.resolve(__dirname, 'src'),
				exclude: /(node_modules)/,
				loader: 'babel-loader'
			},
			{
				test: /\.(png|jpg|jpeg|gif)(\?.+)?$/,
				exclude: /favicon\.png$/,
				use: [
					{
						loader: 'url-loader',
						options: {
							limit: 1,
							name: 'assets/images/[name].[hash:8].[ext]'
						}
					}
				]
			}
		]
	},
	/**
     * devtool 选项
     * source-map 开发模式
     * eval 生产模式
     */
	devtool: 'eval',
	// 不要遵循/打包这些模块，而是在运行时从环境中请求他们
	externals: {
		react: 'React',
		'react-dom': 'ReactDOM',
		axios: 'Axios'
	},
	resolve: {
		extensions: [ '.jsx', '.js' ],
		alias: {
			Components: path.resolve(__dirname, 'src/components/'),
			Assets: path.resolve(__dirname, 'src/assets/'),
			Modules: path.resolve(__dirname, 'src/modules/'),
			Static: path.resolve(__dirname, 'src/static/')
		}
	},
	plugins: [
		new HtmlWebpackPlugin(),
		new HtmlWebpackPlugin({
			filename: 'index.html',
			template: './index.html',
			inject: 'body',
			favicon: './assets/images/favicon.png',
			cache: true,
			showErrors: true
		})
	]
};
