"use strict";function t(t,e){var s="undefined"!=typeof Symbol&&t[Symbol.iterator]||t["@@iterator"];if(!s){if(Array.isArray(t)||(s=i(t))||e&&t&&"number"==typeof t.length){s&&(t=s);var n=0,a=function(){};return{s:a,n:function(){return n>=t.length?{done:!0}:{done:!1,value:t[n++]}},e:function(t){throw t},f:a}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var r,o=!0,l=!1;return{s:function(){s=s.call(t)},n:function(){var t=s.next();return o=t.done,t},e:function(t){l=!0,r=t},f:function(){try{o||null==s.return||s.return()}finally{if(l)throw r}}}}function i(t,i){if(t){if("string"==typeof t)return e(t,i);var s=Object.prototype.toString.call(t).slice(8,-1);return"Object"===s&&t.constructor&&(s=t.constructor.name),"Map"===s||"Set"===s?Array.from(t):"Arguments"===s||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(s)?e(t,i):void 0}}function e(t,i){(null==i||i>t.length)&&(i=t.length);for(var e=0,s=new Array(i);e<i;e++)s[e]=t[e];return s}function s(t){for(var i=Object.create(null),e=t.split(","),s=e.length;s--;)i[e[s]]=!0;return i}function n(t,i){for(var e=t.indexOf("&");-1!==e;){var s=t.indexOf(";",e+3),n=void 0;if(-1===s)break;"#"===t[e+1]?(n=parseInt(("x"===t[e+2]?"0":"")+t.substring(e+2,s)),isNaN(n)||(t=t.substr(0,e)+String.fromCharCode(n)+t.substr(s+1))):(n=t.substring(e+1,s),(l.entities[n]||"amp"===n&&i)&&(t=t.substr(0,e)+(l.entities[n]||"&")+t.substr(s+1))),e=t.indexOf("&",e+1)}return t}function a(t){for(var i=t.length-1,e=i;e>=-1;e--)(-1===e||t[e].c||!t[e].name||"div"!==t[e].name&&"p"!==t[e].name&&"h"!==t[e].name[0]||(t[e].attrs.style||"").includes("inline"))&&(i-e>=5&&t.splice(e+1,i-e,{name:"div",attrs:{},children:t.slice(e+1,i+1)}),i=e-1)}function r(t){this.options=t.data||{},this.tagStyle=Object.assign({},l.tagStyle,this.options.tagStyle),this.imgList=t.imgList||[],this.imgList._unloadimgs=0,this.plugins=t.plugins||[],this.attrs=Object.create(null),this.stack=[],this.nodes=[],this.pre=(this.options.containerStyle||"").includes("white-space")&&this.options.containerStyle.includes("pre")?2:0}function o(t){this.handler=t}var l={trustTags:s("a,abbr,ad,audio,b,blockquote,br,code,col,colgroup,dd,del,dl,dt,div,em,fieldset,h1,h2,h3,h4,h5,h6,hr,i,img,ins,label,legend,li,ol,p,q,ruby,rt,source,span,strong,sub,sup,table,tbody,td,tfoot,th,thead,tr,title,ul,video"),blockTags:s("address,article,aside,body,caption,center,cite,footer,header,html,nav,pre,section"),ignoreTags:s("area,base,canvas,embed,frame,head,iframe,input,link,map,meta,param,rp,script,source,style,textarea,title,track,wbr"),voidTags:s("card,area,base,br,col,circle,ellipse,embed,frame,hr,img,input,line,link,meta,param,path,polygon,rect,source,track,use,wbr"),entities:{lt:"<",gt:">",quot:'"',apos:"'",ensp:" ",emsp:" ",nbsp:" ",semi:";",ndash:"–",mdash:"—",middot:"·",lsquo:"‘",rsquo:"’",ldquo:"“",rdquo:"”",bull:"•",hellip:"…",larr:"←",uarr:"↑",rarr:"→",darr:"↓"},tagStyle:{address:"font-style:italic",big:"display:inline;font-size:1.2em",caption:"display:table-caption;text-align:center",center:"text-align:center",cite:"font-style:italic",dd:"margin-left:40px",mark:"background-color:yellow",pre:"font-family:monospace;white-space:pre",s:"text-decoration:line-through",small:"display:inline;font-size:0.8em",strike:"text-decoration:line-through",u:"text-decoration:underline"},svgDict:{animatetransform:"animateTransform",lineargradient:"linearGradient",viewbox:"viewBox",attributename:"attributeName",repeatcount:"repeatCount",repeatdur:"repeatDur",foreignobject:"foreignObject"}},h={},c=wx.getSystemInfoSync(),d=c.windowWidth,p=c.system,u=s(" ,\r,\n,\t,\f"),f=0;r.prototype.parse=function(t){for(var i=this.plugins.length;i--;)this.plugins[i].onUpdate&&(t=this.plugins[i].onUpdate(t,l)||t);for(new o(this).parse(t);this.stack.length;)this.popNode();return this.nodes.length>50&&a(this.nodes),this.nodes},r.prototype.expose=function(){for(var t=this.stack.length;t--;){var i=this.stack[t];if(i.c||"a"===i.name||"video"===i.name||"audio"===i.name)return;i.c=1}},r.prototype.hook=function(t){for(var i=this.plugins.length;i--;)if(this.plugins[i].onParse&&!1===this.plugins[i].onParse(t,this))return!1;return!0},r.prototype.getUrl=function(t){var i=this.options.domain;return"/"===t[0]?"/"===t[1]?t=(i?i.split("://")[0]:"http")+":"+t:i&&(t=i+t):!i||t.includes("data:")||t.includes("://")||(t=i+"/"+t),t},r.prototype.parseStyle=function(t){var i=t.attrs,e=(this.tagStyle[t.name]||"").split(";").concat((i.style||"").split(";")),s={},n="";i.id&&!this.xml&&(this.options.useAnchor?this.expose():"img"!==t.name&&"a"!==t.name&&"video"!==t.name&&"audio"!==t.name&&(i.id=void 0)),i.width&&(s.width=parseFloat(i.width)+(i.width.includes("%")?"%":"px"),i.width=void 0),i.height&&(s.height=parseFloat(i.height)+(i.height.includes("%")?"%":"px"),i.height=void 0);for(var a=0,r=e.length;a<r;a++){var o=e[a].split(":");if(!(o.length<2)){var l=o.shift().trim().toLowerCase(),h=o.join(":").trim();if("-"===h[0]&&h.lastIndexOf("-")>0||h.includes("safe"))n+=";".concat(l,":").concat(h);else if(!s[l]||h.includes("import")||!s[l].includes("import")){if(h.includes("url")){var c=h.indexOf("(")+1;if(c){for(;'"'===h[c]||"'"===h[c]||u[h[c]];)c++;h=h.substr(0,c)+this.getUrl(h.substr(c))}}else h.includes("rpx")&&(h=h.replace(/[0-9.]+\s*rpx/g,function(t){return parseFloat(t)*d/750+"px"}));s[l]=h}}}return t.attrs.style=n,s},r.prototype.onTagName=function(t){this.tagName=this.xml?t:t.toLowerCase(),"svg"===this.tagName&&(this.xml=(this.xml||0)+1,l.ignoreTags.style=void 0)},r.prototype.onAttrName=function(t){t=this.xml?t:t.toLowerCase(),"data-"===t.substr(0,5)?"data-src"!==t||this.attrs.src?"img"===this.tagName||"a"===this.tagName?this.attrName=t:this.attrName=void 0:this.attrName="src":(this.attrName=t,this.attrs[t]="T")},r.prototype.onAttrVal=function(t){var i=this.attrName||"";"style"===i||"href"===i?this.attrs[i]=n(t,!0):i.includes("src")?this.attrs[i]=this.getUrl(n(t,!0)):i&&(this.attrs[i]=t)},r.prototype.onOpenTag=function(t){var i=Object.create(null);i.name=this.tagName,i.attrs=this.attrs,this.attrs=Object.create(null);var e=i.attrs,s=this.stack[this.stack.length-1],n=s?s.children:this.nodes,a=this.xml?t:l.voidTags[i.name];if(h[i.name]&&(e.class=h[i.name]+(e.class?" "+e.class:"")),"embed"===i.name){var r=e.src||"";r.includes(".mp4")||r.includes(".3gp")||r.includes(".m3u8")||(e.type||"").includes("video")?i.name="video":(r.includes(".mp3")||r.includes(".wav")||r.includes(".aac")||r.includes(".m4a")||(e.type||"").includes("audio"))&&(i.name="audio"),e.autostart&&(e.autoplay="T"),e.controls="T"}if("video"!==i.name&&"audio"!==i.name||("video"!==i.name||e.id||(e.id="v"+f++),e.controls||e.autoplay||(e.controls="T"),i.src=[],e.src&&(i.src.push(e.src),e.src=void 0),this.expose()),a){if(!this.hook(i)||l.ignoreTags[i.name])return void("base"!==i.name||this.options.domain?"source"===i.name&&s&&("video"===s.name||"audio"===s.name)&&e.src&&s.src.push(e.src):this.options.domain=e.href);var o=this.parseStyle(i);if("img"===i.name){if(e.src&&(e.src.includes("webp")&&(i.webp="T"),e.src.includes("data:")&&!e["original-src"]&&(e.ignore="T"),!e.ignore||i.webp||e.src.includes("cloud://"))){for(var c=this.stack.length;c--;){var p=this.stack[c];"table"!==p.name||i.webp||e.src.includes("cloud://")||(!o.display||o.display.includes("inline")?i.t="inline-block":i.t=o.display,o.display=void 0);var u=p.attrs.style||"";if(!u.includes("flex:")||u.includes("flex:0")||u.includes("flex: 0")||o.width&&!(parseInt(o.width)>100))if(u.includes("flex")&&"100%"===o.width)for(var g=c+1;g<this.stack.length;g++){var m=this.stack[g].attrs.style||"";if(!m.includes(";width")&&!m.includes(" width")&&0!==m.indexOf("width")){o.width="";break}}else u.includes("inline-block")&&(o.width&&"%"===o.width[o.width.length-1]?(p.attrs.style+=";max-width:"+o.width,o.width=""):p.attrs.style+=";max-width:100%");else{o.width="100% !important",o.height="";for(var v=c+1;v<this.stack.length;v++)this.stack[v].attrs.style=(this.stack[v].attrs.style||"").replace("inline-","")}"a"===p.name?i.a=p.attrs:p.c=1}i.i=this.imgList.length;var y=e["original-src"]||e.src;if(this.imgList.includes(y)){var b=y.indexOf("://");if(-1!==b){b+=3;for(var x=y.substr(0,b);b<y.length&&"/"!==y[b];b++)x+=Math.random()>.5?y[b].toUpperCase():y[b];x+=y.substr(b),y=x}}this.imgList.push(y),i.t||(this.imgList._unloadimgs+=1)}"inline"===o.display&&(o.display=""),e.ignore&&(o["max-width"]=o["max-width"]||"100%",e.style+=";-webkit-touch-callout:none"),parseInt(o.width)>d&&(o.height=void 0),isNaN(parseInt(o.width))||(i.w="T"),!isNaN(parseInt(o.height))&&(!o.height.includes("%")||s&&(s.attrs.style||"").includes("height"))&&(i.h="T")}else if("svg"===i.name)return n.push(i),this.stack.push(i),void this.popNode();for(var w in o)o[w]&&(e.style+=";".concat(w,":").concat(o[w].replace(" !important","")));e.style=e.style.substr(1)||void 0}else("pre"===i.name||(e.style||"").includes("white-space")&&e.style.includes("pre"))&&2!==this.pre&&(this.pre=i.pre=1),i.children=[],this.stack.push(i);n.push(i)},r.prototype.onCloseTag=function(t){t=this.xml?t:t.toLowerCase();var i;for(i=this.stack.length;i--&&this.stack[i].name!==t;);if(-1!==i)for(;this.stack.length>i;)this.popNode();else if("p"===t||"br"===t){var e=this.stack.length?this.stack[this.stack.length-1].children:this.nodes;e.push({name:t,attrs:{class:h[t],style:this.tagStyle[t]}})}},r.prototype.popNode=function(){var i=this.options.editable,e=this.stack.pop(),s=e.attrs,n=e.children,r=this.stack[this.stack.length-1],o=r?r.children:this.nodes;if(!this.hook(e)||l.ignoreTags[e.name])return"title"===e.name&&n.length&&"text"===n[0].type&&this.options.setTitle&&wx.setNavigationBarTitle({title:n[0].text}),void o.pop();if(e.pre&&2!==this.pre){this.pre=e.pre=void 0;for(var h=this.stack.length;h--;)this.stack[h].pre&&(this.pre=1)}if("svg"===e.name){if(this.xml>1)return void this.xml--;var c="",p=s.style;return s.style="",s.xmlns="http://www.w3.org/2000/svg",function i(e){if("text"===e.type)return void(c+=e.text);var s=l.svgDict[e.name]||e.name;if("foreignObject"===s){var n,a=t(e.children||[]);try{for(a.s();!(n=a.n()).done;){var r=n.value;if(r.attrs&&!r.attrs.xmlns){r.attrs.xmlns="http://www.w3.org/1999/xhtml";break}}}catch(t){a.e(t)}finally{a.f()}}c+="<"+s;for(var o in e.attrs){var h=e.attrs[o];h&&(c+=" ".concat(l.svgDict[o]||o,'="').concat(h,'"'))}if(e.children){c+=">";for(var d=0;d<e.children.length;d++)i(e.children[d]);c+="</"+s+">"}else c+="/>"}(e),e.name="img",e.attrs={src:"data:image/svg+xml;utf8,"+c.replace(/#/g,"%23"),style:p,ignore:"T"},e.children=void 0,this.xml=!1,void(l.ignoreTags.style=!0)}var u={};if(s.align&&("table"===e.name?"center"===s.align?u["margin-inline-start"]=u["margin-inline-end"]="auto":u.float=s.align:u["text-align"]=s.align,s.align=void 0),s.dir&&(u.direction=s.dir,s.dir=void 0),"font"===e.name&&(s.color&&(u.color=s.color,s.color=void 0),s.face&&(u["font-family"]=s.face,s.face=void 0),s.size)){var f=parseInt(s.size);isNaN(f)||(f<1?f=1:f>7&&(f=7),u["font-size"]=["x-small","small","medium","large","x-large","xx-large","xxx-large"][f-1]),s.size=void 0}if((s.class||"").includes("align-center")&&(u["text-align"]="center"),Object.assign(u,this.parseStyle(e)),"table"!==e.name&&parseInt(u.width)>d&&(u["max-width"]="100%",u["box-sizing"]="border-box"),l.blockTags[e.name])i||(e.name="div");else if(l.trustTags[e.name]||this.xml)if("a"===e.name||"ad"===e.name)this.expose();else if("video"===e.name||"audio"===e.name)(u.height||"").includes("auto")&&(u.height=void 0),e.children=void 0;else if("ul"!==e.name&&"ol"!==e.name||!e.c&&!i){if("table"===e.name){var g=parseFloat(s.cellpadding),m=parseFloat(s.cellspacing),v=parseFloat(s.border),y=u["border-color"],b=u["border-style"];if((e.c||i)&&(isNaN(g)&&(g=2),isNaN(m)&&(m=2)),v&&(s.style+=";border:".concat(v,"px ").concat(b||"solid"," ").concat(y||"gray")),e.flag&&(e.c||i)){e.flag=void 0,u.display="grid",m?(u["grid-gap"]=m+"px",u.padding=m+"px"):v&&(s.style+=";border-left:0;border-top:0");var x=[],w=[],k=[],N={};!function t(i){for(var e=0;e<i.length;e++)"tr"===i[e].name?w.push(i[e]):t(i[e].children||[])}(n);for(var T=1;T<=w.length;T++){for(var O=1,S=0;S<w[T-1].children.length;S++){var C=w[T-1].children[S];if("td"===C.name||"th"===C.name){for(;N[T+"."+O];)O++;i&&(C.r=T),C.c=1;var j=C.attrs.style||"",A=j.indexOf("width")?j.indexOf(";width"):0;if(-1!==A){var I=j.indexOf(";",A+6);-1===I&&(I=j.length),C.attrs.colspan||(x[O]=j.substring(A?A+7:6,I)),j=j.substr(0,A)+j.substr(I)}if(j+=";display:flex",-1!==(A=j.indexOf("vertical-align"))){var L=j.substr(A+15,10);L.includes("middle")?j+=";align-items:center":L.includes("bottom")&&(j+=";align-items:flex-end")}else j+=";align-items:center";if(-1!==(A=j.indexOf("text-align"))){var z=j.substr(A+11,10);z.includes("center")?j+=";justify-content: center":z.includes("right")&&(j+=";justify-content: right")}if(j=(v?";border:".concat(v,"px ").concat(b||"solid"," ").concat(y||"gray")+(m?"":";border-right:0;border-bottom:0"):"")+(g?";padding:".concat(g,"px"):"")+";"+j,C.attrs.colspan&&(j+=";grid-column-start:".concat(O,";grid-column-end:").concat(O+parseInt(C.attrs.colspan)),C.attrs.rowspan||(j+=";grid-row-start:".concat(T,";grid-row-end:").concat(T+1)),O+=parseInt(C.attrs.colspan)-1),C.attrs.rowspan){j+=";grid-row-start:".concat(T,";grid-row-end:").concat(T+parseInt(C.attrs.rowspan)),C.attrs.colspan||(j+=";grid-column-start:".concat(O,";grid-column-end:").concat(O+1));for(var U=1;U<C.attrs.rowspan;U++)for(var q=0;q<(C.attrs.colspan||1);q++)N[T+U+"."+(O-q)]=1}j&&(C.attrs.style=j),k.push(C),O++}}if(1===T){for(var F="",V=1;V<O;V++)F+=(x[V]?x[V]:"auto")+" ";u["grid-template-columns"]=F}}e.children=k}else(e.c||i)&&(u.display="table"),isNaN(m)||(u["border-spacing"]=m+"px"),(v||g||e.c||i)&&function t(s){for(var n=0;n<s.length;n++){var a=s[n];(e.c||i)&&(a.c=1),"th"===a.name||"td"===a.name?(v&&(a.attrs.style="border:".concat(v,"px ").concat(b||"solid"," ").concat(y||"gray",";").concat(a.attrs.style||"")),g&&(a.attrs.style="padding:".concat(g,"px;").concat(a.attrs.style||""))):a.children&&t(a.children)}}(n);if(this.options.scrollTable&&!(s.style||"").includes("inline")){var D=Object.assign({},e);e.name="div",e.attrs={style:"overflow-x:auto;padding:1px"},e.children=[D],s=D.attrs}}else if("td"!==e.name&&"th"!==e.name||!s.colspan&&!s.rowspan){if("ruby"===e.name){e.name="span";for(var B=0;B<n.length-1;B++)"text"===n[B].type&&"rt"===n[B+1].name&&(n[B]={name:"span",attrs:{style:"display:inline-block;text-align:center"},children:[{name:"div",attrs:{style:"font-size:50%;"+(n[B+1].attrs.style||"")},children:n[B+1].children},n[B]]},n.splice(B+1,1))}}else for(var M=this.stack.length;M--;)if("table"===this.stack[M].name){this.stack[M].flag=1;break}}else{var P={a:"lower-alpha",A:"upper-alpha",i:"lower-roman",I:"upper-roman"};P[s.type]&&(s.style+=";list-style-type:"+P[s.type],s.type=void 0),e.c=1;for(var Z=n.length;Z--;)"li"===n[Z].name&&(n[Z].c=1)}else e.name="span";if((u.display||"").includes("flex")&&!e.c&&!i)for(var _=n.length;_--;){var E=n[_];E.f&&(E.attrs.style=(E.attrs.style||"")+E.f,E.f=void 0)}var G=r&&((r.attrs.style||"").includes("flex")||(r.attrs.style||"").includes("grid"))&&!(e.c||i)&&!(u.display||"").includes("inline");G&&(e.f=";max-width:100%"),n.length>=50&&(e.c||i)&&!(u.display||"").includes("flex")&&a(n);for(var W in u)if(u[W]){var $=";".concat(W,":").concat(u[W].replace(" !important",""));G&&(W.includes("flex")&&"flex-direction"!==W||"align-self"===W||W.includes("grid")||"-"===u[W][0]||W.includes("width")&&$.includes("%"))?(e.f+=$,"width"===W&&(s.style+=";width:100%")):s.style+=$}s.style=s.style.substr(1)||void 0},r.prototype.onText=function(t){if(!this.pre){for(var i,e="",s=0,a=t.length;s<a;s++)u[t[s]]?(" "!==e[e.length-1]&&(e+=" "),"\n"!==t[s]||i||(i=!0)):e+=t[s];if(" "===e&&i)return;t=e}var r=Object.create(null);if(r.type="text",r.text=n(t),this.hook(r)){"force"===this.options.selectable&&p.includes("iOS")&&!wx.canIUse("rich-text.user-select")&&this.expose();(this.stack.length?this.stack[this.stack.length-1].children:this.nodes).push(r)}},o.prototype.parse=function(t){this.content=t||"",this.i=0,this.start=0,this.state=this.text;for(var i=this.content.length;-1!==this.i&&this.i<i;)this.state()},o.prototype.checkClose=function(t){var i="/"===this.content[this.i];return!!(">"===this.content[this.i]||i&&">"===this.content[this.i+1])&&(t&&this.handler[t](this.content.substring(this.start,this.i)),this.i+=i?2:1,this.start=this.i,this.handler.onOpenTag(i),"script"===this.handler.tagName?(this.i=this.content.indexOf("</",this.i),-1!==this.i&&(this.i+=2,this.start=this.i),this.state=this.endTag):this.state=this.text,!0)},o.prototype.text=function(){if(this.i=this.content.indexOf("<",this.i),-1===this.i)return void(this.start<this.content.length&&this.handler.onText(this.content.substring(this.start,this.content.length)));var t=this.content[this.i+1];if(t>="a"&&t<="z"||t>="A"&&t<="Z")this.start!==this.i&&this.handler.onText(this.content.substring(this.start,this.i)),this.start=++this.i,this.state=this.tagName;else if("/"===t||"!"===t||"?"===t){this.start!==this.i&&this.handler.onText(this.content.substring(this.start,this.i));var i=this.content[this.i+2];if("/"===t&&(i>="a"&&i<="z"||i>="A"&&i<="Z"))return this.i+=2,this.start=this.i,void(this.state=this.endTag);var e="--\x3e";"!"===t&&"-"===this.content[this.i+2]&&"-"===this.content[this.i+3]||(e=">"),this.i=this.content.indexOf(e,this.i),-1!==this.i&&(this.i+=e.length,this.start=this.i)}else this.i++},o.prototype.tagName=function(){if(u[this.content[this.i]]){for(this.handler.onTagName(this.content.substring(this.start,this.i));u[this.content[++this.i]];);this.i<this.content.length&&!this.checkClose()&&(this.start=this.i,this.state=this.attrName)}else this.checkClose("onTagName")||this.i++},o.prototype.attrName=function(){var t=this.content[this.i];if(u[t]||"="===t){this.handler.onAttrName(this.content.substring(this.start,this.i));for(var i="="===t,e=this.content.length;++this.i<e;)if(t=this.content[this.i],!u[t]){if(this.checkClose())return;if(i)return this.start=this.i,void(this.state=this.attrVal);if("="!==this.content[this.i])return this.start=this.i,void(this.state=this.attrName);i=!0}}else this.checkClose("onAttrName")||this.i++},o.prototype.attrVal=function(){var t=this.content[this.i],i=this.content.length;if('"'===t||"'"===t){if(this.start=++this.i,this.i=this.content.indexOf(t,this.i),-1===this.i)return;this.handler.onAttrVal(this.content.substring(this.start,this.i))}else for(;this.i<i;this.i++){if(u[this.content[this.i]]){this.handler.onAttrVal(this.content.substring(this.start,this.i));break}if(this.checkClose("onAttrVal"))return}for(;u[this.content[++this.i]];);this.i<i&&!this.checkClose()&&(this.start=this.i,this.state=this.attrName)},o.prototype.endTag=function(){var t=this.content[this.i];if(u[t]||">"===t||"/"===t){if(this.handler.onCloseTag(this.content.substring(this.start,this.i)),">"!==t&&(this.i=this.content.indexOf(">",this.i),-1===this.i))return;this.start=++this.i,this.state=this.text}else this.i++},module.exports=r;