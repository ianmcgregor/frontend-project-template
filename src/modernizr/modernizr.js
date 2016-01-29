/*! modernizr 3.2.0 (Custom Build) | MIT *
 * http://modernizr.com/download/?-addtest-setclasses-shiv !*/
!function(e,n,t){function o(e,n){return typeof e===n}function a(){var e,n,t,a,r,i,l;for(var f in c)if(c.hasOwnProperty(f)){if(e=[],n=c[f],n.name&&(e.push(n.name.toLowerCase()),n.options&&n.options.aliases&&n.options.aliases.length))for(t=0;t<n.options.aliases.length;t++)e.push(n.options.aliases[t].toLowerCase());for(a=o(n.fn,"function")?n.fn():n.fn,r=0;r<e.length;r++)i=e[r],l=i.split("."),1===l.length?Modernizr[l[0]]=a:(!Modernizr[l[0]]||Modernizr[l[0]]instanceof Boolean||(Modernizr[l[0]]=new Boolean(Modernizr[l[0]])),Modernizr[l[0]][l[1]]=a),s.push((a?"":"no-")+l.join("-"))}}function r(e){var n=u.className,t=Modernizr._config.classPrefix||"";if(d&&(n=n.baseVal),Modernizr._config.enableJSClass){var o=new RegExp("(^|\\s)"+t+"no-js(\\s|$)");n=n.replace(o,"$1"+t+"js$2")}Modernizr._config.enableClasses&&(n+=" "+t+e.join(" "+t),d?u.className.baseVal=n:u.className=n)}function i(e,n){if("object"==typeof e)for(var t in e)f(e,t)&&i(t,e[t]);else{e=e.toLowerCase();var o=e.split("."),a=Modernizr[o[0]];if(2==o.length&&(a=a[o[1]]),"undefined"!=typeof a)return Modernizr;n="function"==typeof n?n():n,1==o.length?Modernizr[o[0]]=n:(!Modernizr[o[0]]||Modernizr[o[0]]instanceof Boolean||(Modernizr[o[0]]=new Boolean(Modernizr[o[0]])),Modernizr[o[0]][o[1]]=n),r([(n&&0!=n?"":"no-")+o.join("-")]),Modernizr._trigger(e,n)}return Modernizr}var s=[],c=[],l={_version:"3.2.0",_config:{classPrefix:"",enableClasses:!0,enableJSClass:!0,usePrefixes:!0},_q:[],on:function(e,n){var t=this;setTimeout(function(){n(t[e])},0)},addTest:function(e,n,t){c.push({name:e,fn:n,options:t})},addAsyncTest:function(e){c.push({name:null,fn:e})}},Modernizr=function(){};Modernizr.prototype=l,Modernizr=new Modernizr;var f,u=n.documentElement,d="svg"===u.nodeName.toLowerCase();!function(){var e={}.hasOwnProperty;f=o(e,"undefined")||o(e.call,"undefined")?function(e,n){return n in e&&o(e.constructor.prototype[n],"undefined")}:function(n,t){return e.call(n,t)}}(),l._l={},l.on=function(e,n){this._l[e]||(this._l[e]=[]),this._l[e].push(n),Modernizr.hasOwnProperty(e)&&setTimeout(function(){Modernizr._trigger(e,Modernizr[e])},0)},l._trigger=function(e,n){if(this._l[e]){var t=this._l[e];setTimeout(function(){var e,o;for(e=0;e<t.length;e++)(o=t[e])(n)},0),delete this._l[e]}},Modernizr._q.push(function(){l.addTest=i});d||!function(e,n){function t(e,n){var t=e.createElement("p"),o=e.getElementsByTagName("head")[0]||e.documentElement;return t.innerHTML="x<style>"+n+"</style>",o.insertBefore(t.lastChild,o.firstChild)}function o(){var e=_.elements;return"string"==typeof e?e.split(" "):e}function a(e,n){var t=_.elements;"string"!=typeof t&&(t=t.join(" ")),"string"!=typeof e&&(e=e.join(" ")),_.elements=t+" "+e,l(n)}function r(e){var n=y[e[g]];return n||(n={},v++,e[g]=v,y[v]=n),n}function i(e,t,o){if(t||(t=n),u)return t.createElement(e);o||(o=r(t));var a;return a=o.cache[e]?o.cache[e].cloneNode():p.test(e)?(o.cache[e]=o.createElem(e)).cloneNode():o.createElem(e),!a.canHaveChildren||h.test(e)||a.tagUrn?a:o.frag.appendChild(a)}function s(e,t){if(e||(e=n),u)return e.createDocumentFragment();t=t||r(e);for(var a=t.frag.cloneNode(),i=0,s=o(),c=s.length;c>i;i++)a.createElement(s[i]);return a}function c(e,n){n.cache||(n.cache={},n.createElem=e.createElement,n.createFrag=e.createDocumentFragment,n.frag=n.createFrag()),e.createElement=function(t){return _.shivMethods?i(t,e,n):n.createElem(t)},e.createDocumentFragment=Function("h,f","return function(){var n=f.cloneNode(),c=n.createElement;h.shivMethods&&("+o().join().replace(/[\w\-:]+/g,function(e){return n.createElem(e),n.frag.createElement(e),'c("'+e+'")'})+");return n}")(_,n.frag)}function l(e){e||(e=n);var o=r(e);return!_.shivCSS||f||o.hasCSS||(o.hasCSS=!!t(e,"article,aside,dialog,figcaption,figure,footer,header,hgroup,main,nav,section{display:block}mark{background:#FF0;color:#000}template{display:none}")),u||c(e,o),e}var f,u,d="3.7.3",m=e.html5||{},h=/^<|^(?:button|map|select|textarea|object|iframe|option|optgroup)$/i,p=/^(?:a|b|code|div|fieldset|h1|h2|h3|h4|h5|h6|i|label|li|ol|p|q|span|strong|style|table|tbody|td|th|tr|ul)$/i,g="_html5shiv",v=0,y={};!function(){try{var e=n.createElement("a");e.innerHTML="<xyz></xyz>",f="hidden"in e,u=1==e.childNodes.length||function(){n.createElement("a");var e=n.createDocumentFragment();return"undefined"==typeof e.cloneNode||"undefined"==typeof e.createDocumentFragment||"undefined"==typeof e.createElement}()}catch(t){f=!0,u=!0}}();var _={elements:m.elements||"abbr article aside audio bdi canvas data datalist details dialog figcaption figure footer header hgroup main mark meter nav output picture progress section summary template time video",version:d,shivCSS:m.shivCSS!==!1,supportsUnknownElements:u,shivMethods:m.shivMethods!==!1,type:"default",shivDocument:l,createElement:i,createDocumentFragment:s,addElements:a};e.html5=_,l(n),"object"==typeof module&&module.exports&&(module.exports=_)}("undefined"!=typeof e?e:this,n),a(),r(s),delete l.addTest,delete l.addAsyncTest;for(var m=0;m<Modernizr._q.length;m++)Modernizr._q[m]();e.Modernizr=Modernizr}(window,document);