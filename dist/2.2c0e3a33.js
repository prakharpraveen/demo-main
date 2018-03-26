(window.webpackJsonp=window.webpackJsonp||[]).push([[2],{176:function(module,exports,__webpack_require__){"use strict";eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n\tvalue: true\n});\n\nvar _getPrototypeOf = __webpack_require__(25);\n\nvar _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);\n\nvar _classCallCheck2 = __webpack_require__(24);\n\nvar _classCallCheck3 = _interopRequireDefault(_classCallCheck2);\n\nvar _createClass2 = __webpack_require__(23);\n\nvar _createClass3 = _interopRequireDefault(_createClass2);\n\nvar _possibleConstructorReturn2 = __webpack_require__(22);\n\nvar _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);\n\nvar _inherits2 = __webpack_require__(21);\n\nvar _inherits3 = _interopRequireDefault(_inherits2);\n\nvar _react = __webpack_require__(1);\n\nvar _react2 = _interopRequireDefault(_react);\n\nvar _reactRouterDom = __webpack_require__(60);\n\nvar _reactRedux = __webpack_require__(39);\n\nvar _propTypes = __webpack_require__(0);\n\nvar _propTypes2 = _interopRequireDefault(_propTypes);\n\nvar _action = __webpack_require__(184);\n\nvar _PageLayout = __webpack_require__(183);\n\nvar _PageLayout2 = _interopRequireDefault(_PageLayout);\n\n__webpack_require__(180);\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\n// 工作桌面单页通用布局\nvar paths = [{ apptype: 'wedget', mountid: 'app', row: '2', column: '4', path: '/prod-dist/component1/index.c5bef5d2.js' }, { apptype: 'wedget', mountid: 'app2', row: '2', column: '2', path: '/prod-dist/component2/index.8b9900d6.js' }, { apptype: 'app', mountid: 'app3', row: '1', column: '1', path: '/prod-dist/component3/index.621db434.js' }, { apptype: 'app', mountid: 'app4', row: '1', column: '1', path: '/prod-dist/component4/index.9ec8102a.js' }];\n/**\r\n * 工作桌面 首页 页面\r\n * 各个此贴应用及工作台中的小部件 通过 js 片段进行加载渲染\r\n */\n\nvar Home = function (_Component) {\n\t(0, _inherits3.default)(Home, _Component);\n\n\tfunction Home(props) {\n\t\t(0, _classCallCheck3.default)(this, Home);\n\n\t\tvar _this = (0, _possibleConstructorReturn3.default)(this, (Home.__proto__ || (0, _getPrototypeOf2.default)(Home)).call(this, props));\n\n\t\t_this.createWidgetMountPoint = function (widgets) {\n\t\t\treturn widgets.map(function (item, index) {\n\t\t\t\tvar apptype = item.apptype,\n\t\t\t\t    mountid = item.mountid,\n\t\t\t\t    row = item.row,\n\t\t\t\t    column = item.column;\n\n\t\t\t\tif (apptype === 'app') {\n\t\t\t\t\treturn _react2.default.createElement('div', { className: 'widget-container n-6-' + column + ' n-r-' + row, id: mountid });\n\t\t\t\t} else if (apptype === 'wedget') {\n\t\t\t\t\treturn _react2.default.createElement('div', { className: 'widget-container n-3-' + column + ' n-r-' + row, id: mountid });\n\t\t\t\t}\n\t\t\t});\n\t\t};\n\n\t\treturn _this;\n\t}\n\n\t(0, _createClass3.default)(Home, [{\n\t\tkey: 'componentDidMount',\n\t\tvalue: function componentDidMount() {\n\t\t\tvar scripts = document.getElementsByTagName('script');\n\t\t\t// 将 HTMLCollection 类数组对象转换成真正的数组\n\t\t\tvar scriptsArray = Array.prototype.slice.call(scripts, 0);\n\t\t\tvar bodyDOM = document.getElementsByTagName('body')[0];\n\t\t\t// 将所有的 script 标签 src 值数组\n\t\t\tscriptsArray = scriptsArray.map(function (scriptItem) {\n\t\t\t\t// script 标签上真正书写的 src 字符串\n\t\t\t\treturn scriptItem.attributes.src.value;\n\t\t\t});\n\t\t\t// paths 后台返回的当前用户首页所有小部件相关内容\n\t\t\tpaths.map(function (item, index) {\n\t\t\t\tvar scriptPath = item.path;\n\t\t\t\t// 查找后台提供的小部件 js 路径是否已经加载到 dom 中\n\t\t\t\tvar flag = scriptsArray.find(function (scriptsSrc) {\n\t\t\t\t\treturn scriptsSrc === scriptPath;\n\t\t\t\t});\n\t\t\t\t// 如果没有，进行 script 标签创建及加载指定 js 文件\n\t\t\t\tif (typeof flag === 'undefined') {\n\t\t\t\t\tvar script = document.createElement('script');\n\t\t\t\t\tscript.type = 'text/javascript';\n\t\t\t\t\tscript.src = item.path;\n\t\t\t\t\tbodyDOM.appendChild(script);\n\t\t\t\t}\n\t\t\t});\n\t\t}\n\t\t/**\r\n   * 动态创建小部件挂载容器\r\n   * @param {Object} widgets // 小部件类型 \r\n   */\n\n\t}, {\n\t\tkey: 'render',\n\t\tvalue: function render() {\n\t\t\treturn _react2.default.createElement(\n\t\t\t\t_PageLayout2.default,\n\t\t\t\tnull,\n\t\t\t\t_react2.default.createElement(\n\t\t\t\t\t'div',\n\t\t\t\t\t{ className: 'nc-workbench-home-container' },\n\t\t\t\t\t_react2.default.createElement(\n\t\t\t\t\t\t'div',\n\t\t\t\t\t\t{ className: 'n-col' },\n\t\t\t\t\t\t_react2.default.createElement(\n\t\t\t\t\t\t\t'div',\n\t\t\t\t\t\t\t{ className: 'title' },\n\t\t\t\t\t\t\t'\\u5E94\\u7528'\n\t\t\t\t\t\t),\n\t\t\t\t\t\t_react2.default.createElement(\n\t\t\t\t\t\t\t'div',\n\t\t\t\t\t\t\t{ className: 'n-row' },\n\t\t\t\t\t\t\tthis.createWidgetMountPoint(paths.map(function (item) {\n\t\t\t\t\t\t\t\tif (item.apptype === 'app') {\n\t\t\t\t\t\t\t\t\treturn item;\n\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t}))\n\t\t\t\t\t\t)\n\t\t\t\t\t),\n\t\t\t\t\t_react2.default.createElement(\n\t\t\t\t\t\t'div',\n\t\t\t\t\t\t{ className: 'n-col' },\n\t\t\t\t\t\t_react2.default.createElement(\n\t\t\t\t\t\t\t'div',\n\t\t\t\t\t\t\t{ className: 'title' },\n\t\t\t\t\t\t\t'\\u76D1\\u63A7\\u5206\\u6790'\n\t\t\t\t\t\t),\n\t\t\t\t\t\t_react2.default.createElement(\n\t\t\t\t\t\t\t'div',\n\t\t\t\t\t\t\t{ className: ' n-row' },\n\t\t\t\t\t\t\t_react2.default.createElement(\n\t\t\t\t\t\t\t\t'div',\n\t\t\t\t\t\t\t\t{ className: 'n-row' },\n\t\t\t\t\t\t\t\tthis.createWidgetMountPoint(paths.map(function (item) {\n\t\t\t\t\t\t\t\t\tif (item.apptype === 'wedget') {\n\t\t\t\t\t\t\t\t\t\treturn item;\n\t\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t\t}))\n\t\t\t\t\t\t\t)\n\t\t\t\t\t\t)\n\t\t\t\t\t)\n\t\t\t\t)\n\t\t\t);\n\t\t}\n\t}]);\n\treturn Home;\n}(_react.Component);\n\nHome.PropTypes = {\n\tformData: _propTypes2.default.object.isRequired,\n\tchangeIntlData: _propTypes2.default.func.isRequired,\n\tsaveImg: _propTypes2.default.func.isRequired,\n\tclearData: _propTypes2.default.func.isRequired\n};\nexports.default = (0, _reactRedux.connect)(function (state) {\n\treturn {\n\t\tformData: state.formData,\n\t\tproData: state.proData\n\t};\n}, {\n\tchangeIntlData: _action.changeIntlData,\n\tsaveImg: _action.saveImg,\n\tclearData: _action.clearData\n})(Home);\n\n//# sourceURL=webpack:///./pages/home/index.js?")},180:function(module,exports,__webpack_require__){eval("// extracted by mini-css-extract-plugin\n\n//# sourceURL=webpack:///./pages/home/index.less?")},182:function(module,exports,__webpack_require__){eval("// extracted by mini-css-extract-plugin\n\n//# sourceURL=webpack:///./components/PageLayout/index.less?")},183:function(module,exports,__webpack_require__){"use strict";eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n\tvalue: true\n});\n\nvar _getPrototypeOf = __webpack_require__(25);\n\nvar _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);\n\nvar _classCallCheck2 = __webpack_require__(24);\n\nvar _classCallCheck3 = _interopRequireDefault(_classCallCheck2);\n\nvar _createClass2 = __webpack_require__(23);\n\nvar _createClass3 = _interopRequireDefault(_createClass2);\n\nvar _possibleConstructorReturn2 = __webpack_require__(22);\n\nvar _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);\n\nvar _inherits2 = __webpack_require__(21);\n\nvar _inherits3 = _interopRequireDefault(_inherits2);\n\nvar _react = __webpack_require__(1);\n\nvar _react2 = _interopRequireDefault(_react);\n\nvar _propTypes = __webpack_require__(0);\n\nvar _propTypes2 = _interopRequireDefault(_propTypes);\n\n__webpack_require__(182);\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\n/**\r\n * 工作桌面中页面布局组件\r\n */\nvar PageLayout = function (_Component) {\n\t(0, _inherits3.default)(PageLayout, _Component);\n\n\tfunction PageLayout() {\n\t\t(0, _classCallCheck3.default)(this, PageLayout);\n\t\treturn (0, _possibleConstructorReturn3.default)(this, (PageLayout.__proto__ || (0, _getPrototypeOf2.default)(PageLayout)).apply(this, arguments));\n\t}\n\n\t(0, _createClass3.default)(PageLayout, [{\n\t\tkey: 'render',\n\t\tvalue: function render() {\n\t\t\treturn _react2.default.createElement(\n\t\t\t\t'div',\n\t\t\t\t{ className: 'page-scroll' },\n\t\t\t\t_react2.default.createElement(\n\t\t\t\t\t'div',\n\t\t\t\t\t{ className: 'page-layout' },\n\t\t\t\t\tthis.props.children\n\t\t\t\t)\n\t\t\t);\n\t\t}\n\t}]);\n\treturn PageLayout;\n}(_react.Component);\n\nPageLayout.propTypes = {\n\t// breadcrumb: PropTypes.array,\n\tchildren: _propTypes2.default.any.isRequired\n};\n\nexports.default = PageLayout;\n\n//# sourceURL=webpack:///./components/PageLayout/index.js?")},184:function(module,exports,__webpack_require__){"use strict";eval('\n\nObject.defineProperty(exports, "__esModule", {\n\tvalue: true\n});\nexports.clearData = undefined;\n\nvar _actionType = __webpack_require__(85);\n\nvar home = _interopRequireWildcard(_actionType);\n\nfunction _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }\n\n// 保存图片地址\nvar clearData = exports.clearData = function clearData() {\n\treturn {\n\t\ttype: home.CLEARDATA\n\t};\n};\n\n//# sourceURL=webpack:///./store/home/action.js?')}}]);