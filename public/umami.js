!function(){"use strict";function e(e){var t=this.constructor;return this.then((function(n){return t.resolve(e()).then((function(){return n}))}),(function(n){return t.resolve(e()).then((function(){return t.reject(n)}))}))}var t=setTimeout;function n(e){return Boolean(e&&void 0!==e.length)}function r(){}function o(e){if(!(this instanceof o))throw new TypeError("Promises must be constructed via new");if("function"!=typeof e)throw new TypeError("not a function");this._state=0,this._handled=!1,this._value=void 0,this._deferreds=[],f(e,this)}function i(e,t){for(;3===e._state;)e=e._value;0!==e._state?(e._handled=!0,o._immediateFn((function(){var n=1===e._state?t.onFulfilled:t.onRejected;if(null!==n){var r;try{r=n(e._value)}catch(e){return void a(t.promise,e)}u(t.promise,r)}else(1===e._state?u:a)(t.promise,e._value)}))):e._deferreds.push(t)}function u(e,t){try{if(t===e)throw new TypeError("A promise cannot be resolved with itself.");if(t&&("object"==typeof t||"function"==typeof t)){var n=t.then;if(t instanceof o)return e._state=3,e._value=t,void c(e);if("function"==typeof n)return void f((r=n,i=t,function(){r.apply(i,arguments)}),e)}e._state=1,e._value=t,c(e)}catch(t){a(e,t)}var r,i}function a(e,t){e._state=2,e._value=t,c(e)}function c(e){2===e._state&&0===e._deferreds.length&&o._immediateFn((function(){e._handled||o._unhandledRejectionFn(e._value)}));for(var t=0,n=e._deferreds.length;t<n;t++)i(e,e._deferreds[t]);e._deferreds=null}function s(e,t,n){this.onFulfilled="function"==typeof e?e:null,this.onRejected="function"==typeof t?t:null,this.promise=n}function f(e,t){var n=!1;try{e((function(e){n||(n=!0,u(t,e))}),(function(e){n||(n=!0,a(t,e))}))}catch(e){if(n)return;n=!0,a(t,e)}}o.prototype["catch"]=function(e){return this.then(null,e)},o.prototype.then=function(e,t){var n=new this.constructor(r);return i(this,new s(e,t,n)),n},o.prototype["finally"]=e,o.all=function(e){return new o((function(t,r){if(!n(e))return r(new TypeError("Promise.all accepts an array"));var o=Array.prototype.slice.call(e);if(0===o.length)return t([]);var i=o.length;function u(e,n){try{if(n&&("object"==typeof n||"function"==typeof n)){var a=n.then;if("function"==typeof a)return void a.call(n,(function(t){u(e,t)}),r)}o[e]=n,0==--i&&t(o)}catch(e){r(e)}}for(var a=0;a<o.length;a++)u(a,o[a])}))},o.resolve=function(e){return e&&"object"==typeof e&&e.constructor===o?e:new o((function(t){t(e)}))},o.reject=function(e){return new o((function(t,n){n(e)}))},o.race=function(e){return new o((function(t,r){if(!n(e))return r(new TypeError("Promise.race accepts an array"));for(var i=0,u=e.length;i<u;i++)o.resolve(e[i]).then(t,r)}))},o._immediateFn="function"==typeof setImmediate&&function(e){setImmediate(e)}||function(e){t(e,0)},o._unhandledRejectionFn=function(e){"undefined"!=typeof console&&console&&console.warn("Possible Unhandled Promise Rejection:",e)};var l=function(){if("undefined"!=typeof self)return self;if("undefined"!=typeof window)return window;if("undefined"!=typeof global)return global;throw new Error("unable to locate global object")}();"Promise"in l?l.Promise.prototype["finally"]||(l.Promise.prototype["finally"]=e):l["Promise"]=o,self.fetch||(self.fetch=function(e,t){return t=t||{},new Promise((function(n,r){var o=new XMLHttpRequest,i=[],u=[],a={},c=function(){return{ok:2==(o.status/100|0),statusText:o.statusText,status:o.status,url:o.responseURL,text:function(){return Promise.resolve(o.responseText)},json:function(){return Promise.resolve(JSON.parse(o.responseText))},blob:function(){return Promise.resolve(new Blob([o.response]))},clone:c,headers:{keys:function(){return i},entries:function(){return u},get:function(e){return a[e.toLowerCase()]},has:function(e){return e.toLowerCase()in a}}}};for(var s in o.open(t.method||"get",e,!0),o.onload=function(){o.getAllResponseHeaders().replace(/^(.*?):[^\S\n]*([\s\S]*?)$/gm,(function(e,t,n){i.push(t=t.toLowerCase()),u.push([t,n]),a[t]=a[t]?a[t]+","+n:n})),n(c())},o.onerror=r,o.withCredentials="include"==t.credentials,t.headers)o.setRequestHeader(s,t.headers[s]);o.send(t.body||null)}))});var h=function(e,t){return function(e,t,n){return fetch(t,{method:e,cache:"no-cache",headers:{Accept:"application/json","Content-Type":"application/json"},body:n}).then((function(t){return t.ok?t.json():["post","put","delete"].includes(e)?t.text():null}))}("post",e,JSON.stringify(t))},p=function(e,t,n){var r=e[t];return function(){for(var t=[],o=arguments.length;o--;)t[o]=arguments[o];return n.apply(null,t),r.apply(e,t)}};!function(e){var t=e.screen,n=t.width,r=t.height,o=e.navigator.language,i=e.location,u=i.hostname,a=i.pathname,c=i.search,s=e.document,f=e.history,l=s.querySelector("script[data-website-id]");if(l&&"1"!==navigator.doNotTrack){var d=l.getAttribute("data-website-id"),v=new URL(l.src).origin,y=n+"x"+r,m=[],w=""+a+c,_=s.referrer,g=function(e,t){var n={url:w,referrer:_,website:d,hostname:u,screen:y,language:o};return t&&Object.keys(t).forEach((function(e){n[e]=t[e]})),h(v+"/api/collect",{type:e,payload:n})},b=function(){return g("pageview").then((function(){return setTimeout(T,300)}))},j=function(e,t,n){P(),_=w,w=n,b()};f.pushState=p(f,"pushState",j),f.replaceState=p(f,"replaceState",j);var P=function(){m.forEach((function(e){var t=e[0],n=e[1],r=e[2];t&&t.removeEventListener(n,r,!0)})),m.length=0},T=function(){s.querySelectorAll("[class*='umami--']").forEach((function(e){e.className.split(" ").forEach((function(t){if(/^umami--([a-z]+)--([a-z0-9_]+[a-z0-9-_]+)$/.test(t)){var n=t.split("--"),r=n[1],o=n[2],i=function(){return g("event",{event_type:r,event_value:o})};m.push([e,r,i]),e.addEventListener(r,i,!0)}}))}))};b()}}(window)}();
