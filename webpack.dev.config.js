const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OpenBrowserPlugin = require('open-browser-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
fs.readdir(__dirname, (err, files) => {
	// console.log(files);
});
const port = 3000;
const host = '127.0.0.1';
module.exports = {
	/**
	 * mode 
	 * 
	 * production 生产模式
	 * development 开发模式
	 */
	mode: 'development',
	context: path.resolve(__dirname, 'src'),
	entry: './app.js',
	output: {
		path: path.join(__dirname, 'dist'),
		// filename: '[name].[chunkhash:8].js', // 生产环境可以使用
		filename: '[name].[hash:8].js',
		libraryTarget: 'umd'
	},
	devServer: {
		contentBase: path.join(__dirname, 'dist'),
		port: port, // 端口号
		host: host, // 主机地址
		inline: true,
		hot: true,
		open: false,
		lazy: false,
		historyApiFallback: {
			rewrites: { from: /./, to: '/404.html' },
			disableDotRule: true
		},
		overlay: {
			warnings: true,
			errors: true
		},
		clientLogLevel: 'error',
		// 开启报错提示
		stats: 'errors-only',
		proxy: {
			'/': {
				// 代理地址
				target: 'http://10.11.115.25:80',
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
				exclude: /node_modules/,
				loader: 'babel-loader'
			},
			{
				test: /\.(css|less)?$/,
				// exclude: /node_modules/,
				use: [ 'style-loader', 'css-loader', 'postcss-loader', 'less-loader' ]
				// use: [ 'css-loader', 'postcss-loader', 'less-loader' ]
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
	devtool: 'source-map',
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
			Pages: path.resolve(__dirname, 'src/pages/'),
			Static: path.resolve(__dirname, 'src/static/'),
			Store: path.resolve(__dirname, 'src/store/')
		}
	},
	plugins: [
		new HtmlWebpackPlugin({
			filename: 'index.html',
			template: './index.html',
			inject: 'body',
			favicon: './assets/images/favicon.png',
			cache: true,
			showErrors: true
		}),
		new MiniCssExtractPlugin({
			// Options similar to the same options in webpackOptions.output
			// both options are optional
			filename: '[name].css'
			// chunkFilename: '[id].css'
		}),
		new webpack.NamedModulesPlugin(),
		new webpack.HotModuleReplacementPlugin(),
		new OpenBrowserPlugin({ url: `http://${host}:${port}` }),
		new CopyWebpackPlugin([
			{ from: __dirname + '/prod-dist', to: './prod-dist' },
			{ from: __dirname + '/pageInfo.json', to: '' }
		])
	]
};
