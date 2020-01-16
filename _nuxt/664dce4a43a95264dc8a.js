(window.webpackJsonp=window.webpackJsonp||[]).push([[17],{503:function(t,e,r){"use strict";(function(t){r(106);var n=r(32),o=r(20),c=function(){var e=Object(n.a)(regeneratorRuntime.mark((function e(r,n){var c,l,data;return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return c="https://oscar6echo.github.io/nuxt-dashboard-template",t.env.CDN_PORT&&(c+=":"+t.env.CDN_PORT),c+="/cdn/"+n,o.a.funcStart("requestCdn",c),l={method:"get",url:c,headers:{accept:"application/json"}},e.next=8,r.$request(l);case 8:return data=e.sent,o.a.funcEnd("requestCdn",data),e.abrupt("return",data);case 11:case"end":return e.stop()}}),e)})));return function(t,r){return e.apply(this,arguments)}}();e.a=c}).call(this,r(123))},504:function(t,e,r){"use strict";r.d(e,"a",(function(){return o}));var n=r(500),o=function t(e){Object(n.a)(this,t);var output=e;this.data={input:e,output:output}}},530:function(t,e,r){var content=r(615);"string"==typeof content&&(content=[[t.i,content,""]]),content.locals&&(t.exports=content.locals);(0,r(48).default)("ecb1a9bc",content,!0,{sourceMap:!1})},614:function(t,e,r){"use strict";var n=r(530);r.n(n).a},615:function(t,e,r){(e=r(47)(!1)).push([t.i,"[data-v-2132aea3]:export{white:#fff;corpred:#e60028;sapphireblue:#23558c;graybase:#333;grayultralight:#f5f5f5;graylight:#ccc;bluedark:#2f333e;black:#000;brandsuccess:#35bd5b;brandinfo:#009bcd;brandwarning:#f17100;branddanger:#b9292d;greenlight:#bcf7cd;bluelight:#b2e1f0;orangelight:#ffd6b0;redlight:#f7b2be;bluedark2:#444852;bluedark3:#21242b;bluedark4:#191e28;graylighter:#dddedf;gray:#777;graydark:#4c4c4c;red:#dc4941;bluedark2b:#444852;bluegray:#b4bbcb;royalblue:#6488ff;seagreen:#41c49d;slateblue:#5c56e8;sienna:#e88e5e;darkroyalblue:#38699f;darkseagreen:#408182;darkslateblue:#514b90;darksienna:#854b4b}.modt.action-button[data-v-2132aea3],.modt.my-dropdown[data-v-2132aea3]{background-color:#f1f1f1;border:1px solid #bbb;border-radius:0}.modt.my-dropdown[data-v-2132aea3]{padding-left:10px;padding-right:10px}.modt.my-title[data-v-2132aea3]{height:40px;color:#333;font-weight:400;font-size:35px}.modt.my-subtitle[data-v-2132aea3]{color:#333}.my-wrapper-block[data-v-2132aea3]{padding-left:50px;padding-right:50px}",""]),t.exports=e},684:function(t,e,r){"use strict";r.r(e);r(106);var n=r(32),o=r(482),c=r(212),l=r.n(c),d=r(613),h=r.n(d),f=r(503),m=r(504);h()(l.a);var v,y,x,w={name:"TabPlot",components:{},props:{},data:function(){return{chart:null,graphOptions:{},seriesData:[]}},computed:{title:function(){return Object(o.a)("carbon emissions")}},mounted:function(){this.buildChart()},methods:{buildChart:(x=Object(n.a)(regeneratorRuntime.mark((function t(){return regeneratorRuntime.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,this.buildGraphOptions();case 2:this.graphOptions=t.sent,this.chart=l.a.chart(this.graphOptions);case 4:case"end":return t.stop()}}),t,this)}))),function(){return x.apply(this,arguments)}),buildGraphOptions:(y=Object(n.a)(regeneratorRuntime.mark((function t(){var e,r;return regeneratorRuntime.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,this.buildDataCdn();case 2:return e=t.sent,r={chart:{renderTo:"my-plot",type:"packedbubble",height:"100%",width:800},title:{text:"World (2014)"},tooltip:{useHTML:!0,pointFormat:"<b>{point.name}:</b> {point.value}m CO<sub>2</sub>"},plotOptions:{packedbubble:{useSimulation:!1,minSize:"20%",maxSize:"80%",dataLabels:{enabled:!0,format:"{point.name}",filter:{property:"y",operator:">",value:250},style:{color:"black",textOutline:"none",fontWeight:"normal"}}}},credits:{enabled:!1},exporting:{enabled:!1},series:e},t.abrupt("return",r);case 5:case"end":return t.stop()}}),t,this)}))),function(){return y.apply(this,arguments)}),buildDataCdn:(v=Object(n.a)(regeneratorRuntime.mark((function t(){var e,r;return regeneratorRuntime.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=3,Object(f.a)(this.$axios,"my-dashboard-data-plot.json");case 3:return e=t.sent,r=new m.a(e),t.abrupt("return",r.data.output);case 6:case"end":return t.stop()}}),t,this)}))),function(){return v.apply(this,arguments)})}},k=(r(614),r(42)),O={name:"Plot",components:{TabPlot:Object(k.a)(w,(function(){var t=this,e=t.$createElement,r=t._self._c||e;return r("v-container",{staticClass:"my-wrapper-block",attrs:{fluid:""}},[r("div",{staticClass:"d-flex flex-column align-center"},[r("h3",{staticClass:"display-1 modt my-title mt-1 mb-2"},[t._v(t._s(t.title))]),t._v(" "),r("h6",{staticClass:"subtitle-1 modt my-subtitle mb-3"},[r("a",{attrs:{href:"https://www.highcharts.com/demo"}},[t._v("Highcharts")]),t._v(" plot - Straight\n      from\n      "),r("a",{attrs:{href:"https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/highcharts/series-packedbubble/spiral"}},[t._v("this example")]),t._v("\n      - Data from static file\n    ")]),t._v(" "),r("div",{attrs:{id:"my-plot"}})])])}),[],!1,null,"2132aea3",null).exports},data:function(){return{}}},_=Object(k.a)(O,(function(){var t=this.$createElement;return(this._self._c||t)("TabPlot")}),[],!1,null,"d1c6f7e8",null);e.default=_.exports}}]);