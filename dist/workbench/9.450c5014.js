(window.webpackJsonp=window.webpackJsonp||[]).push([[9],{270:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=g(a(38)),r=g(a(6)),u=g(a(10)),c=g(a(4)),i=g(a(5)),l=a(1),s=g(l),o=(a(83),a(54)),d=g(a(0)),f=a(281),p=g(a(533)),m=g(a(124)),v=a(296),h=g(a(315));function g(e){return e&&e.__esModule?e:{default:e}}a(521);var b=175,y=function(e){function t(e){(0,r.default)(this,t);var a=(0,c.default)(this,(t.__proto__||(0,n.default)(t)).call(this,e));return a.createScript=function(){var e=a.state.paths,t=document.getElementsByTagName("script"),n=Array.prototype.slice.call(t,0),r=document.getElementsByTagName("body")[0];n=n.map(function(e){if(e.attributes.src)return e.attributes.src.value}),e.map(function(e,a){var u=e.path;if("2"===e.apptype){var c=u,i=n.find(function(e){return e===c});if(void 0===i){var l=document.createElement("script");l.type="text/javascript",l.src=u,r.appendChild(l)}else for(var s=0;s<t.length;s++){var o=t[s];if(o.attributes.src&&o.attributes.src.value===i){r.removeChild(o);var d=document.createElement("script");d.type="text/javascript",d.src=i,r.appendChild(d)}}}})},a.createApp=function(e,t,a){var n=e.image_src,r=e.name,u=e.mountid;e.target_path,e.pk_appregister;return s.default.createElement("div",{className:"grid-item",id:u,style:{width:t,height:a},onClick:function(){window.openNew(e)}},s.default.createElement("div",{className:"app-item"},s.default.createElement("span",{className:"title"},r),s.default.createElement("div",{className:"app-content"},s.default.createElement("div",{className:"icon",style:{background:"url("+n+") no-repeat 0px 0px","background-size":"contain"}}))))},a.createWidgetMountPoint=function(e){return e.map(function(e,t){if(e){var n=e.apptype,r=e.width,u=e.height,c=Number(r)*b+12*(Number(r)-1),i=Number(u)*b+10*(Number(u)-1);if(1===Number(n))return a.createApp(e,c,i);Number(n)}})},a.state={paths:[]},a}return(0,i.default)(t,e),(0,u.default)(t,[{key:"componentDidMount",value:function(){var e=this;this.state.paths;(0,m.default)({url:"/nccloud/platform/appregister/query.do",success:function(t){if(t){var a=t.data,n=a.data,r=a.success;if(r&&n&&n.length>0){e.setState({paths:n},e.createScript);for(var u=document.querySelectorAll(".grid"),c=0;c<u.length;c++){var i=u[c];new p.default(i,{itemSelector:".grid-item",columnWidth:177,gutter:10})}}}}})}},{key:"render",value:function(){var e=this.state.paths;return s.default.createElement("div",{className:"nc-workbench-home-page"},s.default.createElement(h.default,null),s.default.createElement("div",{className:"nc-workbench-home-container"},s.default.createElement(v.Element,{name:"no1",className:"n-col padding-left-70 padding-right-60"},s.default.createElement("div",{className:"title"},"分组一"),s.default.createElement("div",{class:"grid"},e.length>0?this.createWidgetMountPoint(e.map(function(e){return e})):s.default.createElement("div",{className:"grid-item app-item widget-container",style:{width:b+"px",height:b+"px"}},s.default.createElement("div",{className:"app-item"},s.default.createElement("span",{className:"icon"},"loa"),s.default.createElement("span",{className:"title"},"loading")))))))}}]),t}(l.Component);y.PropTypes={formData:d.default.object.isRequired,changeIntlData:d.default.func.isRequired,saveImg:d.default.func.isRequired,clearData:d.default.func.isRequired},t.default=(0,o.connect)(function(e){return{formData:e.formData,proData:e.proData}},{changeIntlData:f.changeIntlData,saveImg:f.saveImg,clearData:f.clearData})(y)},281:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.clearData=void 0;var n=function(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var a in e)Object.prototype.hasOwnProperty.call(e,a)&&(t[a]=e[a]);return t.default=e,t}(a(123));t.clearData=function(){return{type:n.CLEARDATA}}},314:function(e,t,a){},315:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=d(a(38)),r=d(a(6)),u=d(a(10)),c=d(a(4)),i=d(a(5)),l=a(1),s=d(l),o=a(296);function d(e){return e&&e.__esModule?e:{default:e}}a(314);var f=[{anchor:"no1",text:"分组一"}],p=function(e){function t(e,a){(0,r.default)(this,t);var u=(0,c.default)(this,(t.__proto__||(0,n.default)(t)).call(this,e,a));return u.createTabsLink=function(){return f.map(function(e,t){var a=e.anchor,n=e.text;return s.default.createElement("li",null,s.default.createElement(o.Link,{activeClass:"active",to:a,offset:-40,spy:!0,smooth:!0,duration:500},n))})},u}return(0,i.default)(t,e),(0,u.default)(t,[{key:"render",value:function(){return s.default.createElement("ul",{className:"n-tabs"},this.createTabsLink())}}]),t}(l.Component);t.default=p},521:function(e,t,a){}}]);