(window.webpackJsonp=window.webpackJsonp||[]).push([[8],{471:function(t,e,r){var content=r(473);"string"==typeof content&&(content=[[t.i,content,""]]),content.locals&&(t.exports=content.locals);(0,r(48).default)("0c391848",content,!0,{sourceMap:!1})},472:function(t,e,r){"use strict";var n=r(471);r.n(n).a},473:function(t,e,r){(e=r(47)(!1)).push([t.i,"[data-v-aed2c704]:export{white:#fff;corpred:#e60028;sapphireblue:#23558c;graybase:#333;grayultralight:#f5f5f5;graylight:#ccc;bluedark:#2f333e;black:#000;brandsuccess:#35bd5b;brandinfo:#009bcd;brandwarning:#f17100;branddanger:#b9292d;greenlight:#bcf7cd;bluelight:#b2e1f0;orangelight:#ffd6b0;redlight:#f7b2be;bluedark2:#444852;bluedark3:#21242b;bluedark4:#191e28;graylighter:#dddedf;gray:#777;graydark:#4c4c4c;red:#dc4941;bluedark2b:#444852;bluegray:#b4bbcb;royalblue:#6488ff;seagreen:#41c49d;slateblue:#5c56e8;sienna:#e88e5e;darkroyalblue:#38699f;darkseagreen:#408182;darkslateblue:#514b90;darksienna:#854b4b}.modt.action-button[data-v-aed2c704],.modt.my-dropdown[data-v-aed2c704]{background-color:#f1f1f1;border:1px solid #bbb;border-radius:0}.modt.my-dropdown[data-v-aed2c704]{padding-left:10px;padding-right:10px}.modt.my-title[data-v-aed2c704]{height:40px;color:#333;font-weight:400;font-size:35px}.modt.my-subtitle[data-v-aed2c704]{color:#333}.orient-v[data-v-aed2c704]{-webkit-box-orient:vertical;flex-direction:column}.orient-h[data-v-aed2c704],.orient-v[data-v-aed2c704]{display:-webkit-box;display:flex;-webkit-box-direction:normal}.orient-h[data-v-aed2c704]{-webkit-box-orient:horizontal;flex-direction:row}.btn-tab[data-v-aed2c704]{background-color:#f1f1f1;border:1px solid #bbb;font-weight:400}.btn-tab[data-v-aed2c704]:hover{background-color:#dddedf}.btn-tab.active[data-v-aed2c704]{background-color:#cdcdcd}.my-tabs-v[data-v-aed2c704],my-tabs-h[data-v-aed2c704]{-webkit-box-align:center;align-items:center;-webkit-box-pack:center;justify-content:center}.my-tabs-v>a:not(:last-child)>label[data-v-aed2c704]{border-bottom:0}.my-tabs-h>a:not(:last-child)>label[data-v-aed2c704]{border-right:0}.my-tab[data-v-aed2c704]{border-radius:0;width:100%;height:60px;display:-webkit-box;display:flex;-webkit-box-pack:center;justify-content:center;-webkit-box-align:center;align-items:center}.no-underline[data-v-aed2c704]{text-decoration:none;color:#000}",""]),t.exports=e},476:function(t,e,r){"use strict";r(231);var n=r(232),c=r(20),o=r(122),d={name:"Tabs",props:{pathObj:{type:Object,required:!0}},data:function(){return{pathIdx:null,conf:{}}},computed:{classOrient:function(){var t=this.conf.vertical?"v":"h";return"orient-".concat(t," my-tabs-").concat(t)},styleTabs:function(){return this.conf.style.width?{width:this.conf.style.width}:{}},styleTab:function(){return this.conf.style.height?{width:this.conf.style.width,height:this.conf.style.height}:{}},prefix:function(){return 1===this.pathObj.level?"/":"/"+this.pathObj.path+"/"},activeTab:function(){return this.$store.getters["dashboard/activeTab"]},selected:function(){return 1===this.pathObj.level?this.$store.getters["dashboard/activeTab"].tab:this.$store.getters["dashboard/activeTab"].sub[this.pathIdx]},query:function(){return this.$route.query||{}},links:function(){var t=this;return this.conf.tabs.map((function(e){var path=t.prefix+e.path;return Object(o.a)({path:path,query:t.query})}))}},watch:{},created:function(){var t=this;c.a.hookStart(this,"created");var e=this.$store.getters["dashboard/conf"];this.pathIdx=n.a.getIdxFromPath(e,this.pathObj);var r,o,d=e.defaultStyle;if(1===this.pathObj.level)r=e,o=d.level1;else{var l=e.tabs.filter((function(e){return e.path===t.pathObj.path}))[0];r=l,o=l.style||d.level2}var h=r.tabs,f=o,v=f.vertical,style={width:f.width,height:f.height};this.conf={tabs:h,style:style,vertical:v},c.a.hookEnd(this,"created")},methods:{linkTo:function(t,path){return t+path}}},l=(r(472),r(42)),component=Object(l.a)(d,(function(){var t=this,e=t.$createElement,r=t._self._c||e;return r("div",{class:t.classOrient,style:t.styleTabs},t._l(t.conf.tabs,(function(e,n){return r("nuxt-link",{key:n,staticClass:"no-underline",attrs:{to:t.links[n]}},[r("label",{staticClass:"btn-tab my-0 py-0 my-tab",class:{active:t.selected==n},style:t.styleTab},[t._v(t._s(e.title))])])})),1)}),[],!1,null,"aed2c704",null);e.a=component.exports},511:function(t,e,r){var content=r(584);"string"==typeof content&&(content=[[t.i,content,""]]),content.locals&&(t.exports=content.locals);(0,r(48).default)("03ff3d68",content,!0,{sourceMap:!1})},583:function(t,e,r){"use strict";var n=r(511);r.n(n).a},584:function(t,e,r){(e=r(47)(!1)).push([t.i,".my-container[data-v-75a70d56]{height:100%}",""]),t.exports=e},692:function(t,e,r){"use strict";r.r(e);var n={components:{Tabs:r(476).a},data:function(){return{pathObj:{level:2,path:"bitcoin"}}}},c=(r(583),r(42)),component=Object(c.a)(n,(function(){var t=this.$createElement,e=this._self._c||t;return e("v-container",{staticClass:"d-flex flex-column pt-0",attrs:{fluid:""}},[e("Tabs",{staticClass:"align-self-start",attrs:{"path-obj":this.pathObj}}),this._v(" "),e("div",{staticClass:"debug"},[e("nuxt-child",{attrs:{"keep-alive":""}})],1)],1)}),[],!1,null,"75a70d56",null);e.default=component.exports}}]);