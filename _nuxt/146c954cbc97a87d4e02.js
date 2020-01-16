(window.webpackJsonp=window.webpackJsonp||[]).push([[33],{479:function(t,e,n){"use strict";var r=n(475),o=n(689),l=n(715),c=n(491),m=n(670),d=n(671),f=n(494),h=n(676),v=n(691),x=n(672),w=n(673),y=n(493),D=n(492),F=n(713),_=n(560),A=n(669),O=n(674),R=n(690),T=n(714),C=n(585);e.a={format:o.a,timeFormat:l.a,range:r.j,extent:r.d,mean:r.f,max:r.e,min:r.h,zip:r.n,scaleLinear:c.a,scaleLog:c.b,scaleTime:c.c,select:m.a,selectAll:d.a,axisBottom:f.a,axisLeft:f.b,geoOrthographic:h.a,geoPath:v.a,geoCentroid:x.a,geoInterpolate:w.a,json:y.a,tsv:y.b,transition:D.a,Delaunay:F.a,dsvFormat:_.a,tsvParse:A.a,pointRadial:O.a,lineRadial:R.a,interpolateRainbow:T.a,rgb:C.f}},482:function(t,e,n){"use strict";var r=n(5);function o(t){return t.toLowerCase()}var l=[/([a-z0-9])([A-Z])/g,/([A-Z])([A-Z][a-z])/g],c=/[^A-Z0-9]+/gi;function m(input,t,e){return t instanceof RegExp?input.replace(t,e):t.reduce((function(input,t){return input.replace(t,e)}),input)}function d(input){return function(input){return input.charAt(0).toUpperCase()+input.substr(1)}(input.toLowerCase())}function f(input,t){return void 0===t&&(t={}),function(input,t){void 0===t&&(t={});for(var e=t.splitRegexp,n=void 0===e?l:e,r=t.stripRegexp,d=void 0===r?c:r,f=t.transform,h=void 0===f?o:f,v=t.delimiter,x=void 0===v?" ":v,w=m(m(input,n,"$1\0$2"),d,"\0"),y=0,D=w.length;"\0"===w.charAt(y);)y++;for(;"\0"===w.charAt(D-1);)D--;return w.slice(y,D).split("\0").map(h).join(x)}(input,Object(r.__assign)({delimiter:" ",transform:d},t))}n.d(e,"a",(function(){return f}))},523:function(t,e,n){"use strict";n(524),n(291),n(206);var r=n(479),o=r.a.timeFormat("%a %d-%b-%y %H:%M:%S"),l={integer:r.a.format(",d"),float:r.a.format(",.2f"),float0:r.a.format(",.0f"),float2:r.a.format(",.2f"),float3:r.a.format(",.3f"),boolean:function(t){return t?"TRUE":"FALSE"},text:function(t){return t},json:function(t){return t?JSON.stringify(t,null,2):null},timestamp:function(t){return o(new Date(t))}};e.a={formatFloat:function(t,e){return"number"==typeof t?t.toLocaleString("en",{minimumFractionDigits:e,maximumFractionDigits:e}):"NaN"},dicFormat:l,timeStrToNum:function(t){return new Date(t).valueOf()},syntaxHighlightJson:function(t){return(t=t.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")).replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?)/g,(function(t){var e="number";return t.startsWith('"')?e=t.endsWith(":")?"key":"string":/true|false/.test(t)?e="boolean":/null/.test(t)&&(e="null"),'<span class="'+e+'">'+t+"</span>"}))},compareStringAsc:function(a,b){return a<b?-1:a>b?1:0},compareStringDes:function(a,b){return a<b?1:a>b?-1:0},shiftDate:function(t,e){var n=e.day,r=e.hour,o=e.minute,l=1e3*(e.second||0)+1e3*(o||0)*60+1e3*(r||0)*60*60+1e3*(n||0)*60*60*24,c=t.getTime();return new Date(c+l)}}},524:function(t,e,n){"use strict";var r=n(31),o=n(73),l=n(234),c="".endsWith;r(r.P+r.F*n(235)("endsWith"),"String",{endsWith:function(t){var e=l(this,t,"endsWith"),n=arguments.length>1?arguments[1]:void 0,r=o(e.length),m=void 0===n?r:Math.min(o(n),r),d=String(t);return c?c.call(e,d,m):e.slice(m-d.length,m)===d}})},687:function(t,e,n){"use strict";n.r(e);var r=n(482),o=n(212),l=n.n(o),c=n(523),m={name:"TabRealtime",components:{},props:{},data:function(){return{chart:null,graphOptions:{},seriesData:[]}},computed:{title:function(){return Object(r.a)("real time")}},mounted:function(){this.buildChart()},methods:{buildChart:function(){this.graphOptions=this.buildGraphOptions(),this.chart=l.a.chart(this.graphOptions)},buildGraphOptions:function(){return{chart:{renderTo:"my-plot",type:"line",height:500,width:800,events:{load:this.buildLoadFunc()}},time:{useUTC:!1},title:{text:"Live random data"},credits:{enabled:!1},xAxis:{type:"datetime",tickPixelInterval:150},yAxis:{title:{text:"Value"},min:0,max:1},tooltip:{headerFormat:"<b>{series.name}</b><br/>",pointFormat:"{point.x:%Y-%m-%d %H:%M:%S}<br/>{point.y:.2f}"},legend:{enabled:!1},exporting:{enabled:!1},series:[{name:"Random data",data:this.buildInitData()}]}},buildInitData:function(){var i,data=[],time=(new Date).getTime();for(i=-8;i<=0;i+=1)data.push({x:time+1e3*i,y:Math.random()});return data},buildLoadFunc:function(){var t=this,e=c.a.dicFormat.float2;return function(n){var r=this.series[0];setInterval((function(){var n=(new Date).getTime(),o=Math.random();r.addPoint([n,o],!0,!0),t.seriesData=r.data.map((function(t){return e(t.y)})).slice()}),1e3)}}}},d=n(42),f={name:"RealTime",components:{TabRealtime:Object(d.a)(m,(function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"my-wrapper-block"},[n("div",{staticClass:"d-flex flex-column align-center"},[n("div",{staticClass:"display-1 modt my-title mt-1 mb-2"},[t._v(t._s(t.title))]),t._v(" "),n("div",{staticClass:"subtitle-1 modt my-subtitle mb-3"},[t._v("\n      "+t._s(t.seriesData)+" -\n      "),n("a",{attrs:{href:"https://www.highcharts.com/demo"}},[t._v("Highcharts")]),t._v(" Plot\n    ")]),t._v(" "),n("div",{attrs:{id:"my-plot"}})])])}),[],!1,null,"97df3876",null).exports},data:function(){return{}}},h=Object(d.a)(f,(function(){var t=this.$createElement;return(this._self._c||t)("TabRealtime")}),[],!1,null,"426d95c4",null);e.default=h.exports}}]);