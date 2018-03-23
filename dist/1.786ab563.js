(window.webpackJsonp=window.webpackJsonp||[]).push([[1],{175:function(module,exports,__webpack_require__){"use strict";eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n\tvalue: true\n});\n\nvar _getPrototypeOf = __webpack_require__(25);\n\nvar _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);\n\nvar _classCallCheck2 = __webpack_require__(24);\n\nvar _classCallCheck3 = _interopRequireDefault(_classCallCheck2);\n\nvar _createClass2 = __webpack_require__(23);\n\nvar _createClass3 = _interopRequireDefault(_createClass2);\n\nvar _possibleConstructorReturn2 = __webpack_require__(22);\n\nvar _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);\n\nvar _inherits2 = __webpack_require__(21);\n\nvar _inherits3 = _interopRequireDefault(_inherits2);\n\nvar _react = __webpack_require__(1);\n\nvar _react2 = _interopRequireDefault(_react);\n\nvar _reactRedux = __webpack_require__(39);\n\nvar _propTypes = __webpack_require__(0);\n\nvar _propTypes2 = _interopRequireDefault(_propTypes);\n\nvar _action = __webpack_require__(178);\n\nvar _utils = __webpack_require__(177);\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nvar Ifr = function (_Component) {\n\t(0, _inherits3.default)(Ifr, _Component);\n\n\tfunction Ifr(props) {\n\t\t(0, _classCallCheck3.default)(this, Ifr);\n\t\treturn (0, _possibleConstructorReturn3.default)(this, (Ifr.__proto__ || (0, _getPrototypeOf2.default)(Ifr)).call(this, props));\n\t}\n\n\t(0, _createClass3.default)(Ifr, [{\n\t\tkey: 'render',\n\t\tvalue: function render() {\n\t\t\tconsole.log(this.props.location);\n\t\t\tvar _props$ifrData = this.props.ifrData,\n\t\t\t    ifrID = _props$ifrData.ifrID,\n\t\t\t    ifrName = _props$ifrData.ifrName;\n\n\t\t\tvar _GetQuery = (0, _utils.GetQuery)(this.props.location.search),\n\t\t\t    ifr = _GetQuery.ifr;\n\n\t\t\tvar queryUrl = decodeURIComponent(ifr);\n\n\t\t\treturn _react2.default.createElement('iframe', { id: 'mainiframe', src: queryUrl, frameborder: '0', scrolling: 'yes' });\n\t\t}\n\t}]);\n\treturn Ifr;\n}(_react.Component);\n\nIfr.propTypes = {\n\tifrData: _propTypes2.default.object.isRequired,\n\tinitIfrData: _propTypes2.default.func.isRequired,\n\tclearData: _propTypes2.default.func.isRequired\n};\nexports.default = (0, _reactRedux.connect)(function (state) {\n\treturn {\n\t\tifrData: state.ifrData\n\t};\n}, {\n\tinitIfrData: _action.initIfrData,\n\tclearData: _action.clearData\n})(Ifr);\n\n//# sourceURL=webpack:///./pages/ifr/index.js?")},177:function(module,exports,__webpack_require__){"use strict";eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n\tvalue: true\n});\n/**\n * 获取url参数\n * @param {String} query 当前 url 中传递的参数\n */\nvar GetQuery = exports.GetQuery = function GetQuery(query) {\n\tvar theRequest = {};\n\tif (query.indexOf('?') != -1) {\n\t\tvar str = query.substr(1);\n\t\tif (str.indexOf('&') != -1) {\n\t\t\tvar strs = str.split('&');\n\t\t\tfor (var i = 0; i < strs.length; i++) {\n\t\t\t\ttheRequest[strs[i].split('=')[0]] = strs[i].split('=')[1];\n\t\t\t}\n\t\t} else {\n\t\t\ttheRequest[str.split('=')[0]] = str.split('=')[1];\n\t\t}\n\t}\n\treturn theRequest;\n};\n\n//# sourceURL=webpack:///./static/js/utils.js?")},178:function(module,exports,__webpack_require__){"use strict";eval('\n\nObject.defineProperty(exports, "__esModule", {\n\tvalue: true\n});\nexports.clearData = exports.initIfrData = undefined;\n\nvar _actionType = __webpack_require__(84);\n\nvar ifr = _interopRequireWildcard(_actionType);\n\nfunction _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }\n\n// 初始化数据\nvar initIfrData = exports.initIfrData = function initIfrData(value) {\n\treturn {\n\t\ttype: ifr.INITIFR,\n\t\tvalue: value\n\t};\n};\n\n// 清除数据\nvar clearData = exports.clearData = function clearData() {\n\treturn {\n\t\ttype: ifr.CLEARDATA\n\t};\n};\n\n//# sourceURL=webpack:///./store/ifr/action.js?')}}]);