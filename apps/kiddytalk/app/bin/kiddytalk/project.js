//     Underscore.js 1.8.3
//     http://underscorejs.org
//     (c) 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
//     Underscore may be freely distributed under the MIT license.
(function(){function n(n){function t(t,r,e,u,i,o){for(;i>=0&&o>i;i+=n){var a=u?u[i]:i;e=r(e,t[a],a,t)}return e}return function(r,e,u,i){e=b(e,i,4);var o=!k(r)&&m.keys(r),a=(o||r).length,c=n>0?0:a-1;return arguments.length<3&&(u=r[o?o[c]:c],c+=n),t(r,e,u,o,c,a)}}function t(n){return function(t,r,e){r=x(r,e);for(var u=O(t),i=n>0?0:u-1;i>=0&&u>i;i+=n)if(r(t[i],i,t))return i;return-1}}function r(n,t,r){return function(e,u,i){var o=0,a=O(e);if("number"==typeof i)n>0?o=i>=0?i:Math.max(i+a,o):a=i>=0?Math.min(i+1,a):i+a+1;else if(r&&i&&a)return i=r(e,u),e[i]===u?i:-1;if(u!==u)return i=t(l.call(e,o,a),m.isNaN),i>=0?i+o:-1;for(i=n>0?o:a-1;i>=0&&a>i;i+=n)if(e[i]===u)return i;return-1}}function e(n,t){var r=I.length,e=n.constructor,u=m.isFunction(e)&&e.prototype||a,i="constructor";for(m.has(n,i)&&!m.contains(t,i)&&t.push(i);r--;)i=I[r],i in n&&n[i]!==u[i]&&!m.contains(t,i)&&t.push(i)}var u=this,i=u._,o=Array.prototype,a=Object.prototype,c=Function.prototype,f=o.push,l=o.slice,s=a.toString,p=a.hasOwnProperty,h=Array.isArray,v=Object.keys,g=c.bind,y=Object.create,d=function(){},m=function(n){return n instanceof m?n:this instanceof m?void(this._wrapped=n):new m(n)};"undefined"!=typeof exports?("undefined"!=typeof module&&module.exports&&(exports=module.exports=m),exports._=m):u._=m,m.VERSION="1.8.3";var b=function(n,t,r){if(t===void 0)return n;switch(null==r?3:r){case 1:return function(r){return n.call(t,r)};case 2:return function(r,e){return n.call(t,r,e)};case 3:return function(r,e,u){return n.call(t,r,e,u)};case 4:return function(r,e,u,i){return n.call(t,r,e,u,i)}}return function(){return n.apply(t,arguments)}},x=function(n,t,r){return null==n?m.identity:m.isFunction(n)?b(n,t,r):m.isObject(n)?m.matcher(n):m.property(n)};m.iteratee=function(n,t){return x(n,t,1/0)};var _=function(n,t){return function(r){var e=arguments.length;if(2>e||null==r)return r;for(var u=1;e>u;u++)for(var i=arguments[u],o=n(i),a=o.length,c=0;a>c;c++){var f=o[c];t&&r[f]!==void 0||(r[f]=i[f])}return r}},j=function(n){if(!m.isObject(n))return{};if(y)return y(n);d.prototype=n;var t=new d;return d.prototype=null,t},w=function(n){return function(t){return null==t?void 0:t[n]}},A=Math.pow(2,53)-1,O=w("length"),k=function(n){var t=O(n);return"number"==typeof t&&t>=0&&A>=t};m.each=m.forEach=function(n,t,r){t=b(t,r);var e,u;if(k(n))for(e=0,u=n.length;u>e;e++)t(n[e],e,n);else{var i=m.keys(n);for(e=0,u=i.length;u>e;e++)t(n[i[e]],i[e],n)}return n},m.map=m.collect=function(n,t,r){t=x(t,r);for(var e=!k(n)&&m.keys(n),u=(e||n).length,i=Array(u),o=0;u>o;o++){var a=e?e[o]:o;i[o]=t(n[a],a,n)}return i},m.reduce=m.foldl=m.inject=n(1),m.reduceRight=m.foldr=n(-1),m.find=m.detect=function(n,t,r){var e;return e=k(n)?m.findIndex(n,t,r):m.findKey(n,t,r),e!==void 0&&e!==-1?n[e]:void 0},m.filter=m.select=function(n,t,r){var e=[];return t=x(t,r),m.each(n,function(n,r,u){t(n,r,u)&&e.push(n)}),e},m.reject=function(n,t,r){return m.filter(n,m.negate(x(t)),r)},m.every=m.all=function(n,t,r){t=x(t,r);for(var e=!k(n)&&m.keys(n),u=(e||n).length,i=0;u>i;i++){var o=e?e[i]:i;if(!t(n[o],o,n))return!1}return!0},m.some=m.any=function(n,t,r){t=x(t,r);for(var e=!k(n)&&m.keys(n),u=(e||n).length,i=0;u>i;i++){var o=e?e[i]:i;if(t(n[o],o,n))return!0}return!1},m.contains=m.includes=m.include=function(n,t,r,e){return k(n)||(n=m.values(n)),("number"!=typeof r||e)&&(r=0),m.indexOf(n,t,r)>=0},m.invoke=function(n,t){var r=l.call(arguments,2),e=m.isFunction(t);return m.map(n,function(n){var u=e?t:n[t];return null==u?u:u.apply(n,r)})},m.pluck=function(n,t){return m.map(n,m.property(t))},m.where=function(n,t){return m.filter(n,m.matcher(t))},m.findWhere=function(n,t){return m.find(n,m.matcher(t))},m.max=function(n,t,r){var e,u,i=-1/0,o=-1/0;if(null==t&&null!=n){n=k(n)?n:m.values(n);for(var a=0,c=n.length;c>a;a++)e=n[a],e>i&&(i=e)}else t=x(t,r),m.each(n,function(n,r,e){u=t(n,r,e),(u>o||u===-1/0&&i===-1/0)&&(i=n,o=u)});return i},m.min=function(n,t,r){var e,u,i=1/0,o=1/0;if(null==t&&null!=n){n=k(n)?n:m.values(n);for(var a=0,c=n.length;c>a;a++)e=n[a],i>e&&(i=e)}else t=x(t,r),m.each(n,function(n,r,e){u=t(n,r,e),(o>u||1/0===u&&1/0===i)&&(i=n,o=u)});return i},m.shuffle=function(n){for(var t,r=k(n)?n:m.values(n),e=r.length,u=Array(e),i=0;e>i;i++)t=m.random(0,i),t!==i&&(u[i]=u[t]),u[t]=r[i];return u},m.sample=function(n,t,r){return null==t||r?(k(n)||(n=m.values(n)),n[m.random(n.length-1)]):m.shuffle(n).slice(0,Math.max(0,t))},m.sortBy=function(n,t,r){return t=x(t,r),m.pluck(m.map(n,function(n,r,e){return{value:n,index:r,criteria:t(n,r,e)}}).sort(function(n,t){var r=n.criteria,e=t.criteria;if(r!==e){if(r>e||r===void 0)return 1;if(e>r||e===void 0)return-1}return n.index-t.index}),"value")};var F=function(n){return function(t,r,e){var u={};return r=x(r,e),m.each(t,function(e,i){var o=r(e,i,t);n(u,e,o)}),u}};m.groupBy=F(function(n,t,r){m.has(n,r)?n[r].push(t):n[r]=[t]}),m.indexBy=F(function(n,t,r){n[r]=t}),m.countBy=F(function(n,t,r){m.has(n,r)?n[r]++:n[r]=1}),m.toArray=function(n){return n?m.isArray(n)?l.call(n):k(n)?m.map(n,m.identity):m.values(n):[]},m.size=function(n){return null==n?0:k(n)?n.length:m.keys(n).length},m.partition=function(n,t,r){t=x(t,r);var e=[],u=[];return m.each(n,function(n,r,i){(t(n,r,i)?e:u).push(n)}),[e,u]},m.first=m.head=m.take=function(n,t,r){return null==n?void 0:null==t||r?n[0]:m.initial(n,n.length-t)},m.initial=function(n,t,r){return l.call(n,0,Math.max(0,n.length-(null==t||r?1:t)))},m.last=function(n,t,r){return null==n?void 0:null==t||r?n[n.length-1]:m.rest(n,Math.max(0,n.length-t))},m.rest=m.tail=m.drop=function(n,t,r){return l.call(n,null==t||r?1:t)},m.compact=function(n){return m.filter(n,m.identity)};var S=function(n,t,r,e){for(var u=[],i=0,o=e||0,a=O(n);a>o;o++){var c=n[o];if(k(c)&&(m.isArray(c)||m.isArguments(c))){t||(c=S(c,t,r));var f=0,l=c.length;for(u.length+=l;l>f;)u[i++]=c[f++]}else r||(u[i++]=c)}return u};m.flatten=function(n,t){return S(n,t,!1)},m.without=function(n){return m.difference(n,l.call(arguments,1))},m.uniq=m.unique=function(n,t,r,e){m.isBoolean(t)||(e=r,r=t,t=!1),null!=r&&(r=x(r,e));for(var u=[],i=[],o=0,a=O(n);a>o;o++){var c=n[o],f=r?r(c,o,n):c;t?(o&&i===f||u.push(c),i=f):r?m.contains(i,f)||(i.push(f),u.push(c)):m.contains(u,c)||u.push(c)}return u},m.union=function(){return m.uniq(S(arguments,!0,!0))},m.intersection=function(n){for(var t=[],r=arguments.length,e=0,u=O(n);u>e;e++){var i=n[e];if(!m.contains(t,i)){for(var o=1;r>o&&m.contains(arguments[o],i);o++);o===r&&t.push(i)}}return t},m.difference=function(n){var t=S(arguments,!0,!0,1);return m.filter(n,function(n){return!m.contains(t,n)})},m.zip=function(){return m.unzip(arguments)},m.unzip=function(n){for(var t=n&&m.max(n,O).length||0,r=Array(t),e=0;t>e;e++)r[e]=m.pluck(n,e);return r},m.object=function(n,t){for(var r={},e=0,u=O(n);u>e;e++)t?r[n[e]]=t[e]:r[n[e][0]]=n[e][1];return r},m.findIndex=t(1),m.findLastIndex=t(-1),m.sortedIndex=function(n,t,r,e){r=x(r,e,1);for(var u=r(t),i=0,o=O(n);o>i;){var a=Math.floor((i+o)/2);r(n[a])<u?i=a+1:o=a}return i},m.indexOf=r(1,m.findIndex,m.sortedIndex),m.lastIndexOf=r(-1,m.findLastIndex),m.range=function(n,t,r){null==t&&(t=n||0,n=0),r=r||1;for(var e=Math.max(Math.ceil((t-n)/r),0),u=Array(e),i=0;e>i;i++,n+=r)u[i]=n;return u};var E=function(n,t,r,e,u){if(!(e instanceof t))return n.apply(r,u);var i=j(n.prototype),o=n.apply(i,u);return m.isObject(o)?o:i};m.bind=function(n,t){if(g&&n.bind===g)return g.apply(n,l.call(arguments,1));if(!m.isFunction(n))throw new TypeError("Bind must be called on a function");var r=l.call(arguments,2),e=function(){return E(n,e,t,this,r.concat(l.call(arguments)))};return e},m.partial=function(n){var t=l.call(arguments,1),r=function(){for(var e=0,u=t.length,i=Array(u),o=0;u>o;o++)i[o]=t[o]===m?arguments[e++]:t[o];for(;e<arguments.length;)i.push(arguments[e++]);return E(n,r,this,this,i)};return r},m.bindAll=function(n){var t,r,e=arguments.length;if(1>=e)throw new Error("bindAll must be passed function names");for(t=1;e>t;t++)r=arguments[t],n[r]=m.bind(n[r],n);return n},m.memoize=function(n,t){var r=function(e){var u=r.cache,i=""+(t?t.apply(this,arguments):e);return m.has(u,i)||(u[i]=n.apply(this,arguments)),u[i]};return r.cache={},r},m.delay=function(n,t){var r=l.call(arguments,2);return setTimeout(function(){return n.apply(null,r)},t)},m.defer=m.partial(m.delay,m,1),m.throttle=function(n,t,r){var e,u,i,o=null,a=0;r||(r={});var c=function(){a=r.leading===!1?0:m.now(),o=null,i=n.apply(e,u),o||(e=u=null)};return function(){var f=m.now();a||r.leading!==!1||(a=f);var l=t-(f-a);return e=this,u=arguments,0>=l||l>t?(o&&(clearTimeout(o),o=null),a=f,i=n.apply(e,u),o||(e=u=null)):o||r.trailing===!1||(o=setTimeout(c,l)),i}},m.debounce=function(n,t,r){var e,u,i,o,a,c=function(){var f=m.now()-o;t>f&&f>=0?e=setTimeout(c,t-f):(e=null,r||(a=n.apply(i,u),e||(i=u=null)))};return function(){i=this,u=arguments,o=m.now();var f=r&&!e;return e||(e=setTimeout(c,t)),f&&(a=n.apply(i,u),i=u=null),a}},m.wrap=function(n,t){return m.partial(t,n)},m.negate=function(n){return function(){return!n.apply(this,arguments)}},m.compose=function(){var n=arguments,t=n.length-1;return function(){for(var r=t,e=n[t].apply(this,arguments);r--;)e=n[r].call(this,e);return e}},m.after=function(n,t){return function(){return--n<1?t.apply(this,arguments):void 0}},m.before=function(n,t){var r;return function(){return--n>0&&(r=t.apply(this,arguments)),1>=n&&(t=null),r}},m.once=m.partial(m.before,2);var M=!{toString:null}.propertyIsEnumerable("toString"),I=["valueOf","isPrototypeOf","toString","propertyIsEnumerable","hasOwnProperty","toLocaleString"];m.keys=function(n){if(!m.isObject(n))return[];if(v)return v(n);var t=[];for(var r in n)m.has(n,r)&&t.push(r);return M&&e(n,t),t},m.allKeys=function(n){if(!m.isObject(n))return[];var t=[];for(var r in n)t.push(r);return M&&e(n,t),t},m.values=function(n){for(var t=m.keys(n),r=t.length,e=Array(r),u=0;r>u;u++)e[u]=n[t[u]];return e},m.mapObject=function(n,t,r){t=x(t,r);for(var e,u=m.keys(n),i=u.length,o={},a=0;i>a;a++)e=u[a],o[e]=t(n[e],e,n);return o},m.pairs=function(n){for(var t=m.keys(n),r=t.length,e=Array(r),u=0;r>u;u++)e[u]=[t[u],n[t[u]]];return e},m.invert=function(n){for(var t={},r=m.keys(n),e=0,u=r.length;u>e;e++)t[n[r[e]]]=r[e];return t},m.functions=m.methods=function(n){var t=[];for(var r in n)m.isFunction(n[r])&&t.push(r);return t.sort()},m.extend=_(m.allKeys),m.extendOwn=m.assign=_(m.keys),m.findKey=function(n,t,r){t=x(t,r);for(var e,u=m.keys(n),i=0,o=u.length;o>i;i++)if(e=u[i],t(n[e],e,n))return e},m.pick=function(n,t,r){var e,u,i={},o=n;if(null==o)return i;m.isFunction(t)?(u=m.allKeys(o),e=b(t,r)):(u=S(arguments,!1,!1,1),e=function(n,t,r){return t in r},o=Object(o));for(var a=0,c=u.length;c>a;a++){var f=u[a],l=o[f];e(l,f,o)&&(i[f]=l)}return i},m.omit=function(n,t,r){if(m.isFunction(t))t=m.negate(t);else{var e=m.map(S(arguments,!1,!1,1),String);t=function(n,t){return!m.contains(e,t)}}return m.pick(n,t,r)},m.defaults=_(m.allKeys,!0),m.create=function(n,t){var r=j(n);return t&&m.extendOwn(r,t),r},m.clone=function(n){return m.isObject(n)?m.isArray(n)?n.slice():m.extend({},n):n},m.tap=function(n,t){return t(n),n},m.isMatch=function(n,t){var r=m.keys(t),e=r.length;if(null==n)return!e;for(var u=Object(n),i=0;e>i;i++){var o=r[i];if(t[o]!==u[o]||!(o in u))return!1}return!0};var N=function(n,t,r,e){if(n===t)return 0!==n||1/n===1/t;if(null==n||null==t)return n===t;n instanceof m&&(n=n._wrapped),t instanceof m&&(t=t._wrapped);var u=s.call(n);if(u!==s.call(t))return!1;switch(u){case"[object RegExp]":case"[object String]":return""+n==""+t;case"[object Number]":return+n!==+n?+t!==+t:0===+n?1/+n===1/t:+n===+t;case"[object Date]":case"[object Boolean]":return+n===+t}var i="[object Array]"===u;if(!i){if("object"!=typeof n||"object"!=typeof t)return!1;var o=n.constructor,a=t.constructor;if(o!==a&&!(m.isFunction(o)&&o instanceof o&&m.isFunction(a)&&a instanceof a)&&"constructor"in n&&"constructor"in t)return!1}r=r||[],e=e||[];for(var c=r.length;c--;)if(r[c]===n)return e[c]===t;if(r.push(n),e.push(t),i){if(c=n.length,c!==t.length)return!1;for(;c--;)if(!N(n[c],t[c],r,e))return!1}else{var f,l=m.keys(n);if(c=l.length,m.keys(t).length!==c)return!1;for(;c--;)if(f=l[c],!m.has(t,f)||!N(n[f],t[f],r,e))return!1}return r.pop(),e.pop(),!0};m.isEqual=function(n,t){return N(n,t)},m.isEmpty=function(n){return null==n?!0:k(n)&&(m.isArray(n)||m.isString(n)||m.isArguments(n))?0===n.length:0===m.keys(n).length},m.isElement=function(n){return!(!n||1!==n.nodeType)},m.isArray=h||function(n){return"[object Array]"===s.call(n)},m.isObject=function(n){var t=typeof n;return"function"===t||"object"===t&&!!n},m.each(["Arguments","Function","String","Number","Date","RegExp","Error"],function(n){m["is"+n]=function(t){return s.call(t)==="[object "+n+"]"}}),m.isArguments(arguments)||(m.isArguments=function(n){return m.has(n,"callee")}),"function"!=typeof/./&&"object"!=typeof Int8Array&&(m.isFunction=function(n){return"function"==typeof n||!1}),m.isFinite=function(n){return isFinite(n)&&!isNaN(parseFloat(n))},m.isNaN=function(n){return m.isNumber(n)&&n!==+n},m.isBoolean=function(n){return n===!0||n===!1||"[object Boolean]"===s.call(n)},m.isNull=function(n){return null===n},m.isUndefined=function(n){return n===void 0},m.has=function(n,t){return null!=n&&p.call(n,t)},m.noConflict=function(){return u._=i,this},m.identity=function(n){return n},m.constant=function(n){return function(){return n}},m.noop=function(){},m.property=w,m.propertyOf=function(n){return null==n?function(){}:function(t){return n[t]}},m.matcher=m.matches=function(n){return n=m.extendOwn({},n),function(t){return m.isMatch(t,n)}},m.times=function(n,t,r){var e=Array(Math.max(0,n));t=b(t,r,1);for(var u=0;n>u;u++)e[u]=t(u);return e},m.random=function(n,t){return null==t&&(t=n,n=0),n+Math.floor(Math.random()*(t-n+1))},m.now=Date.now||function(){return(new Date).getTime()};var B={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#x27;","`":"&#x60;"},T=m.invert(B),R=function(n){var t=function(t){return n[t]},r="(?:"+m.keys(n).join("|")+")",e=RegExp(r),u=RegExp(r,"g");return function(n){return n=null==n?"":""+n,e.test(n)?n.replace(u,t):n}};m.escape=R(B),m.unescape=R(T),m.result=function(n,t,r){var e=null==n?void 0:n[t];return e===void 0&&(e=r),m.isFunction(e)?e.call(n):e};var q=0;m.uniqueId=function(n){var t=++q+"";return n?n+t:t},m.templateSettings={evaluate:/<%([\s\S]+?)%>/g,interpolate:/<%=([\s\S]+?)%>/g,escape:/<%-([\s\S]+?)%>/g};var K=/(.)^/,z={"'":"'","\\":"\\","\r":"r","\n":"n","\u2028":"u2028","\u2029":"u2029"},D=/\\|'|\r|\n|\u2028|\u2029/g,L=function(n){return"\\"+z[n]};m.template=function(n,t,r){!t&&r&&(t=r),t=m.defaults({},t,m.templateSettings);var e=RegExp([(t.escape||K).source,(t.interpolate||K).source,(t.evaluate||K).source].join("|")+"|$","g"),u=0,i="__p+='";n.replace(e,function(t,r,e,o,a){return i+=n.slice(u,a).replace(D,L),u=a+t.length,r?i+="'+\n((__t=("+r+"))==null?'':_.escape(__t))+\n'":e?i+="'+\n((__t=("+e+"))==null?'':__t)+\n'":o&&(i+="';\n"+o+"\n__p+='"),t}),i+="';\n",t.variable||(i="with(obj||{}){\n"+i+"}\n"),i="var __t,__p='',__j=Array.prototype.join,"+"print=function(){__p+=__j.call(arguments,'');};\n"+i+"return __p;\n";try{var o=new Function(t.variable||"obj","_",i)}catch(a){throw a.source=i,a}var c=function(n){return o.call(this,n,m)},f=t.variable||"obj";return c.source="function("+f+"){\n"+i+"}",c},m.chain=function(n){var t=m(n);return t._chain=!0,t};var P=function(n,t){return n._chain?m(t).chain():t};m.mixin=function(n){m.each(m.functions(n),function(t){var r=m[t]=n[t];m.prototype[t]=function(){var n=[this._wrapped];return f.apply(n,arguments),P(this,r.apply(m,n))}})},m.mixin(m),m.each(["pop","push","reverse","shift","sort","splice","unshift"],function(n){var t=o[n];m.prototype[n]=function(){var r=this._wrapped;return t.apply(r,arguments),"shift"!==n&&"splice"!==n||0!==r.length||delete r[0],P(this,r)}}),m.each(["concat","join","slice"],function(n){var t=o[n];m.prototype[n]=function(){return P(this,t.apply(this._wrapped,arguments))}}),m.prototype.value=function(){return this._wrapped},m.prototype.valueOf=m.prototype.toJSON=m.prototype.value,m.prototype.toString=function(){return""+this._wrapped},"function"==typeof define&&define.amd&&define("underscore",[],function(){return m})}).call(this);
//# sourceMappingURL=underscore-min.map
(function(t){var e=typeof self=="object"&&self.self==self&&self||typeof global=="object"&&global.global==global&&global;if(typeof define==="function"&&define.amd){define(["underscore","jquery","exports"],function(i,r,n){e.Backbone=t(e,n,i,r)})}else if(typeof exports!=="undefined"){var i=require("underscore"),r;try{r=require("jquery")}catch(n){}t(e,exports,i,r)}else{e.Backbone=t(e,{},e._,e.jQuery||e.Zepto||e.ender||e.$)}})(function(t,e,i,r){var n=t.Backbone;var s=Array.prototype.slice;e.VERSION="1.2.3";e.$=r;e.noConflict=function(){t.Backbone=n;return this};e.emulateHTTP=false;e.emulateJSON=false;var a=function(t,e,r){switch(t){case 1:return function(){return i[e](this[r])};case 2:return function(t){return i[e](this[r],t)};case 3:return function(t,n){return i[e](this[r],h(t,this),n)};case 4:return function(t,n,s){return i[e](this[r],h(t,this),n,s)};default:return function(){var t=s.call(arguments);t.unshift(this[r]);return i[e].apply(i,t)}}};var o=function(t,e,r){i.each(e,function(e,n){if(i[n])t.prototype[n]=a(e,n,r)})};var h=function(t,e){if(i.isFunction(t))return t;if(i.isObject(t)&&!e._isModel(t))return u(t);if(i.isString(t))return function(e){return e.get(t)};return t};var u=function(t){var e=i.matches(t);return function(t){return e(t.attributes)}};var l=e.Events={};var c=/\s+/;var f=function(t,e,r,n,s){var a=0,o;if(r&&typeof r==="object"){if(n!==void 0&&"context"in s&&s.context===void 0)s.context=n;for(o=i.keys(r);a<o.length;a++){e=f(t,e,o[a],r[o[a]],s)}}else if(r&&c.test(r)){for(o=r.split(c);a<o.length;a++){e=t(e,o[a],n,s)}}else{e=t(e,r,n,s)}return e};l.on=function(t,e,i){return d(this,t,e,i)};var d=function(t,e,i,r,n){t._events=f(v,t._events||{},e,i,{context:r,ctx:t,listening:n});if(n){var s=t._listeners||(t._listeners={});s[n.id]=n}return t};l.listenTo=function(t,e,r){if(!t)return this;var n=t._listenId||(t._listenId=i.uniqueId("l"));var s=this._listeningTo||(this._listeningTo={});var a=s[n];if(!a){var o=this._listenId||(this._listenId=i.uniqueId("l"));a=s[n]={obj:t,objId:n,id:o,listeningTo:s,count:0}}d(t,e,r,this,a);return this};var v=function(t,e,i,r){if(i){var n=t[e]||(t[e]=[]);var s=r.context,a=r.ctx,o=r.listening;if(o)o.count++;n.push({callback:i,context:s,ctx:s||a,listening:o})}return t};l.off=function(t,e,i){if(!this._events)return this;this._events=f(g,this._events,t,e,{context:i,listeners:this._listeners});return this};l.stopListening=function(t,e,r){var n=this._listeningTo;if(!n)return this;var s=t?[t._listenId]:i.keys(n);for(var a=0;a<s.length;a++){var o=n[s[a]];if(!o)break;o.obj.off(e,r,this)}if(i.isEmpty(n))this._listeningTo=void 0;return this};var g=function(t,e,r,n){if(!t)return;var s=0,a;var o=n.context,h=n.listeners;if(!e&&!r&&!o){var u=i.keys(h);for(;s<u.length;s++){a=h[u[s]];delete h[a.id];delete a.listeningTo[a.objId]}return}var l=e?[e]:i.keys(t);for(;s<l.length;s++){e=l[s];var c=t[e];if(!c)break;var f=[];for(var d=0;d<c.length;d++){var v=c[d];if(r&&r!==v.callback&&r!==v.callback._callback||o&&o!==v.context){f.push(v)}else{a=v.listening;if(a&&--a.count===0){delete h[a.id];delete a.listeningTo[a.objId]}}}if(f.length){t[e]=f}else{delete t[e]}}if(i.size(t))return t};l.once=function(t,e,r){var n=f(p,{},t,e,i.bind(this.off,this));return this.on(n,void 0,r)};l.listenToOnce=function(t,e,r){var n=f(p,{},e,r,i.bind(this.stopListening,this,t));return this.listenTo(t,n)};var p=function(t,e,r,n){if(r){var s=t[e]=i.once(function(){n(e,s);r.apply(this,arguments)});s._callback=r}return t};l.trigger=function(t){if(!this._events)return this;var e=Math.max(0,arguments.length-1);var i=Array(e);for(var r=0;r<e;r++)i[r]=arguments[r+1];f(m,this._events,t,void 0,i);return this};var m=function(t,e,i,r){if(t){var n=t[e];var s=t.all;if(n&&s)s=s.slice();if(n)_(n,r);if(s)_(s,[e].concat(r))}return t};var _=function(t,e){var i,r=-1,n=t.length,s=e[0],a=e[1],o=e[2];switch(e.length){case 0:while(++r<n)(i=t[r]).callback.call(i.ctx);return;case 1:while(++r<n)(i=t[r]).callback.call(i.ctx,s);return;case 2:while(++r<n)(i=t[r]).callback.call(i.ctx,s,a);return;case 3:while(++r<n)(i=t[r]).callback.call(i.ctx,s,a,o);return;default:while(++r<n)(i=t[r]).callback.apply(i.ctx,e);return}};l.bind=l.on;l.unbind=l.off;i.extend(e,l);var y=e.Model=function(t,e){var r=t||{};e||(e={});this.cid=i.uniqueId(this.cidPrefix);this.attributes={};if(e.collection)this.collection=e.collection;if(e.parse)r=this.parse(r,e)||{};r=i.defaults({},r,i.result(this,"defaults"));this.set(r,e);this.changed={};this.initialize.apply(this,arguments)};i.extend(y.prototype,l,{changed:null,validationError:null,idAttribute:"id",cidPrefix:"c",initialize:function(){},toJSON:function(t){return i.clone(this.attributes)},sync:function(){return e.sync.apply(this,arguments)},get:function(t){return this.attributes[t]},escape:function(t){return i.escape(this.get(t))},has:function(t){return this.get(t)!=null},matches:function(t){return!!i.iteratee(t,this)(this.attributes)},set:function(t,e,r){if(t==null)return this;var n;if(typeof t==="object"){n=t;r=e}else{(n={})[t]=e}r||(r={});if(!this._validate(n,r))return false;var s=r.unset;var a=r.silent;var o=[];var h=this._changing;this._changing=true;if(!h){this._previousAttributes=i.clone(this.attributes);this.changed={}}var u=this.attributes;var l=this.changed;var c=this._previousAttributes;for(var f in n){e=n[f];if(!i.isEqual(u[f],e))o.push(f);if(!i.isEqual(c[f],e)){l[f]=e}else{delete l[f]}s?delete u[f]:u[f]=e}this.id=this.get(this.idAttribute);if(!a){if(o.length)this._pending=r;for(var d=0;d<o.length;d++){this.trigger("change:"+o[d],this,u[o[d]],r)}}if(h)return this;if(!a){while(this._pending){r=this._pending;this._pending=false;this.trigger("change",this,r)}}this._pending=false;this._changing=false;return this},unset:function(t,e){return this.set(t,void 0,i.extend({},e,{unset:true}))},clear:function(t){var e={};for(var r in this.attributes)e[r]=void 0;return this.set(e,i.extend({},t,{unset:true}))},hasChanged:function(t){if(t==null)return!i.isEmpty(this.changed);return i.has(this.changed,t)},changedAttributes:function(t){if(!t)return this.hasChanged()?i.clone(this.changed):false;var e=this._changing?this._previousAttributes:this.attributes;var r={};for(var n in t){var s=t[n];if(i.isEqual(e[n],s))continue;r[n]=s}return i.size(r)?r:false},previous:function(t){if(t==null||!this._previousAttributes)return null;return this._previousAttributes[t]},previousAttributes:function(){return i.clone(this._previousAttributes)},fetch:function(t){t=i.extend({parse:true},t);var e=this;var r=t.success;t.success=function(i){var n=t.parse?e.parse(i,t):i;if(!e.set(n,t))return false;if(r)r.call(t.context,e,i,t);e.trigger("sync",e,i,t)};z(this,t);return this.sync("read",this,t)},save:function(t,e,r){var n;if(t==null||typeof t==="object"){n=t;r=e}else{(n={})[t]=e}r=i.extend({validate:true,parse:true},r);var s=r.wait;if(n&&!s){if(!this.set(n,r))return false}else{if(!this._validate(n,r))return false}var a=this;var o=r.success;var h=this.attributes;r.success=function(t){a.attributes=h;var e=r.parse?a.parse(t,r):t;if(s)e=i.extend({},n,e);if(e&&!a.set(e,r))return false;if(o)o.call(r.context,a,t,r);a.trigger("sync",a,t,r)};z(this,r);if(n&&s)this.attributes=i.extend({},h,n);var u=this.isNew()?"create":r.patch?"patch":"update";if(u==="patch"&&!r.attrs)r.attrs=n;var l=this.sync(u,this,r);this.attributes=h;return l},destroy:function(t){t=t?i.clone(t):{};var e=this;var r=t.success;var n=t.wait;var s=function(){e.stopListening();e.trigger("destroy",e,e.collection,t)};t.success=function(i){if(n)s();if(r)r.call(t.context,e,i,t);if(!e.isNew())e.trigger("sync",e,i,t)};var a=false;if(this.isNew()){i.defer(t.success)}else{z(this,t);a=this.sync("delete",this,t)}if(!n)s();return a},url:function(){var t=i.result(this,"urlRoot")||i.result(this.collection,"url")||F();if(this.isNew())return t;var e=this.get(this.idAttribute);return t.replace(/[^\/]$/,"$&/")+encodeURIComponent(e)},parse:function(t,e){return t},clone:function(){return new this.constructor(this.attributes)},isNew:function(){return!this.has(this.idAttribute)},isValid:function(t){return this._validate({},i.defaults({validate:true},t))},_validate:function(t,e){if(!e.validate||!this.validate)return true;t=i.extend({},this.attributes,t);var r=this.validationError=this.validate(t,e)||null;if(!r)return true;this.trigger("invalid",this,r,i.extend(e,{validationError:r}));return false}});var b={keys:1,values:1,pairs:1,invert:1,pick:0,omit:0,chain:1,isEmpty:1};o(y,b,"attributes");var x=e.Collection=function(t,e){e||(e={});if(e.model)this.model=e.model;if(e.comparator!==void 0)this.comparator=e.comparator;this._reset();this.initialize.apply(this,arguments);if(t)this.reset(t,i.extend({silent:true},e))};var w={add:true,remove:true,merge:true};var E={add:true,remove:false};var k=function(t,e,i){i=Math.min(Math.max(i,0),t.length);var r=Array(t.length-i);var n=e.length;for(var s=0;s<r.length;s++)r[s]=t[s+i];for(s=0;s<n;s++)t[s+i]=e[s];for(s=0;s<r.length;s++)t[s+n+i]=r[s]};i.extend(x.prototype,l,{model:y,initialize:function(){},toJSON:function(t){return this.map(function(e){return e.toJSON(t)})},sync:function(){return e.sync.apply(this,arguments)},add:function(t,e){return this.set(t,i.extend({merge:false},e,E))},remove:function(t,e){e=i.extend({},e);var r=!i.isArray(t);t=r?[t]:i.clone(t);var n=this._removeModels(t,e);if(!e.silent&&n)this.trigger("update",this,e);return r?n[0]:n},set:function(t,e){if(t==null)return;e=i.defaults({},e,w);if(e.parse&&!this._isModel(t))t=this.parse(t,e);var r=!i.isArray(t);t=r?[t]:t.slice();var n=e.at;if(n!=null)n=+n;if(n<0)n+=this.length+1;var s=[];var a=[];var o=[];var h={};var u=e.add;var l=e.merge;var c=e.remove;var f=false;var d=this.comparator&&n==null&&e.sort!==false;var v=i.isString(this.comparator)?this.comparator:null;var g;for(var p=0;p<t.length;p++){g=t[p];var m=this.get(g);if(m){if(l&&g!==m){var _=this._isModel(g)?g.attributes:g;if(e.parse)_=m.parse(_,e);m.set(_,e);if(d&&!f)f=m.hasChanged(v)}if(!h[m.cid]){h[m.cid]=true;s.push(m)}t[p]=m}else if(u){g=t[p]=this._prepareModel(g,e);if(g){a.push(g);this._addReference(g,e);h[g.cid]=true;s.push(g)}}}if(c){for(p=0;p<this.length;p++){g=this.models[p];if(!h[g.cid])o.push(g)}if(o.length)this._removeModels(o,e)}var y=false;var b=!d&&u&&c;if(s.length&&b){y=this.length!=s.length||i.some(this.models,function(t,e){return t!==s[e]});this.models.length=0;k(this.models,s,0);this.length=this.models.length}else if(a.length){if(d)f=true;k(this.models,a,n==null?this.length:n);this.length=this.models.length}if(f)this.sort({silent:true});if(!e.silent){for(p=0;p<a.length;p++){if(n!=null)e.index=n+p;g=a[p];g.trigger("add",g,this,e)}if(f||y)this.trigger("sort",this,e);if(a.length||o.length)this.trigger("update",this,e)}return r?t[0]:t},reset:function(t,e){e=e?i.clone(e):{};for(var r=0;r<this.models.length;r++){this._removeReference(this.models[r],e)}e.previousModels=this.models;this._reset();t=this.add(t,i.extend({silent:true},e));if(!e.silent)this.trigger("reset",this,e);return t},push:function(t,e){return this.add(t,i.extend({at:this.length},e))},pop:function(t){var e=this.at(this.length-1);return this.remove(e,t)},unshift:function(t,e){return this.add(t,i.extend({at:0},e))},shift:function(t){var e=this.at(0);return this.remove(e,t)},slice:function(){return s.apply(this.models,arguments)},get:function(t){if(t==null)return void 0;var e=this.modelId(this._isModel(t)?t.attributes:t);return this._byId[t]||this._byId[e]||this._byId[t.cid]},at:function(t){if(t<0)t+=this.length;return this.models[t]},where:function(t,e){return this[e?"find":"filter"](t)},findWhere:function(t){return this.where(t,true)},sort:function(t){var e=this.comparator;if(!e)throw new Error("Cannot sort a set without a comparator");t||(t={});var r=e.length;if(i.isFunction(e))e=i.bind(e,this);if(r===1||i.isString(e)){this.models=this.sortBy(e)}else{this.models.sort(e)}if(!t.silent)this.trigger("sort",this,t);return this},pluck:function(t){return i.invoke(this.models,"get",t)},fetch:function(t){t=i.extend({parse:true},t);var e=t.success;var r=this;t.success=function(i){var n=t.reset?"reset":"set";r[n](i,t);if(e)e.call(t.context,r,i,t);r.trigger("sync",r,i,t)};z(this,t);return this.sync("read",this,t)},create:function(t,e){e=e?i.clone(e):{};var r=e.wait;t=this._prepareModel(t,e);if(!t)return false;if(!r)this.add(t,e);var n=this;var s=e.success;e.success=function(t,e,i){if(r)n.add(t,i);if(s)s.call(i.context,t,e,i)};t.save(null,e);return t},parse:function(t,e){return t},clone:function(){return new this.constructor(this.models,{model:this.model,comparator:this.comparator})},modelId:function(t){return t[this.model.prototype.idAttribute||"id"]},_reset:function(){this.length=0;this.models=[];this._byId={}},_prepareModel:function(t,e){if(this._isModel(t)){if(!t.collection)t.collection=this;return t}e=e?i.clone(e):{};e.collection=this;var r=new this.model(t,e);if(!r.validationError)return r;this.trigger("invalid",this,r.validationError,e);return false},_removeModels:function(t,e){var i=[];for(var r=0;r<t.length;r++){var n=this.get(t[r]);if(!n)continue;var s=this.indexOf(n);this.models.splice(s,1);this.length--;if(!e.silent){e.index=s;n.trigger("remove",n,this,e)}i.push(n);this._removeReference(n,e)}return i.length?i:false},_isModel:function(t){return t instanceof y},_addReference:function(t,e){this._byId[t.cid]=t;var i=this.modelId(t.attributes);if(i!=null)this._byId[i]=t;t.on("all",this._onModelEvent,this)},_removeReference:function(t,e){delete this._byId[t.cid];var i=this.modelId(t.attributes);if(i!=null)delete this._byId[i];if(this===t.collection)delete t.collection;t.off("all",this._onModelEvent,this)},_onModelEvent:function(t,e,i,r){if((t==="add"||t==="remove")&&i!==this)return;if(t==="destroy")this.remove(e,r);if(t==="change"){var n=this.modelId(e.previousAttributes());var s=this.modelId(e.attributes);if(n!==s){if(n!=null)delete this._byId[n];if(s!=null)this._byId[s]=e}}this.trigger.apply(this,arguments)}});var S={forEach:3,each:3,map:3,collect:3,reduce:4,foldl:4,inject:4,reduceRight:4,foldr:4,find:3,detect:3,filter:3,select:3,reject:3,every:3,all:3,some:3,any:3,include:3,includes:3,contains:3,invoke:0,max:3,min:3,toArray:1,size:1,first:3,head:3,take:3,initial:3,rest:3,tail:3,drop:3,last:3,without:0,difference:0,indexOf:3,shuffle:1,lastIndexOf:3,isEmpty:1,chain:1,sample:3,partition:3,groupBy:3,countBy:3,sortBy:3,indexBy:3};o(x,S,"models");var I=e.View=function(t){this.cid=i.uniqueId("view");i.extend(this,i.pick(t,P));this._ensureElement();this.initialize.apply(this,arguments)};var T=/^(\S+)\s*(.*)$/;var P=["model","collection","el","id","attributes","className","tagName","events"];i.extend(I.prototype,l,{tagName:"div",$:function(t){return this.$el.find(t)},initialize:function(){},render:function(){return this},remove:function(){this._removeElement();this.stopListening();return this},_removeElement:function(){this.$el.remove()},setElement:function(t){this.undelegateEvents();this._setElement(t);this.delegateEvents();return this},_setElement:function(t){this.$el=t instanceof e.$?t:e.$(t);this.el=this.$el[0]},delegateEvents:function(t){t||(t=i.result(this,"events"));if(!t)return this;this.undelegateEvents();for(var e in t){var r=t[e];if(!i.isFunction(r))r=this[r];if(!r)continue;var n=e.match(T);this.delegate(n[1],n[2],i.bind(r,this))}return this},delegate:function(t,e,i){this.$el.on(t+".delegateEvents"+this.cid,e,i);return this},undelegateEvents:function(){if(this.$el)this.$el.off(".delegateEvents"+this.cid);return this},undelegate:function(t,e,i){this.$el.off(t+".delegateEvents"+this.cid,e,i);return this},_createElement:function(t){return document.createElement(t)},_ensureElement:function(){if(!this.el){var t=i.extend({},i.result(this,"attributes"));if(this.id)t.id=i.result(this,"id");if(this.className)t["class"]=i.result(this,"className");this.setElement(this._createElement(i.result(this,"tagName")));this._setAttributes(t)}else{this.setElement(i.result(this,"el"))}},_setAttributes:function(t){this.$el.attr(t)}});e.sync=function(t,r,n){var s=H[t];i.defaults(n||(n={}),{emulateHTTP:e.emulateHTTP,emulateJSON:e.emulateJSON});var a={type:s,dataType:"json"};if(!n.url){a.url=i.result(r,"url")||F()}if(n.data==null&&r&&(t==="create"||t==="update"||t==="patch")){a.contentType="application/json";a.data=JSON.stringify(n.attrs||r.toJSON(n))}if(n.emulateJSON){a.contentType="application/x-www-form-urlencoded";a.data=a.data?{model:a.data}:{}}if(n.emulateHTTP&&(s==="PUT"||s==="DELETE"||s==="PATCH")){a.type="POST";if(n.emulateJSON)a.data._method=s;var o=n.beforeSend;n.beforeSend=function(t){t.setRequestHeader("X-HTTP-Method-Override",s);if(o)return o.apply(this,arguments)}}if(a.type!=="GET"&&!n.emulateJSON){a.processData=false}var h=n.error;n.error=function(t,e,i){n.textStatus=e;n.errorThrown=i;if(h)h.call(n.context,t,e,i)};var u=n.xhr=e.ajax(i.extend(a,n));r.trigger("request",r,u,n);return u};var H={create:"POST",update:"PUT",patch:"PATCH","delete":"DELETE",read:"GET"};e.ajax=function(){return e.$.ajax.apply(e.$,arguments)};var $=e.Router=function(t){t||(t={});if(t.routes)this.routes=t.routes;this._bindRoutes();this.initialize.apply(this,arguments)};var A=/\((.*?)\)/g;var C=/(\(\?)?:\w+/g;var R=/\*\w+/g;var j=/[\-{}\[\]+?.,\\\^$|#\s]/g;i.extend($.prototype,l,{initialize:function(){},route:function(t,r,n){if(!i.isRegExp(t))t=this._routeToRegExp(t);if(i.isFunction(r)){n=r;r=""}if(!n)n=this[r];var s=this;e.history.route(t,function(i){var a=s._extractParameters(t,i);if(s.execute(n,a,r)!==false){s.trigger.apply(s,["route:"+r].concat(a));s.trigger("route",r,a);e.history.trigger("route",s,r,a)}});return this},execute:function(t,e,i){if(t)t.apply(this,e)},navigate:function(t,i){e.history.navigate(t,i);return this},_bindRoutes:function(){if(!this.routes)return;this.routes=i.result(this,"routes");var t,e=i.keys(this.routes);while((t=e.pop())!=null){this.route(t,this.routes[t])}},_routeToRegExp:function(t){t=t.replace(j,"\\$&").replace(A,"(?:$1)?").replace(C,function(t,e){return e?t:"([^/?]+)"}).replace(R,"([^?]*?)");return new RegExp("^"+t+"(?:\\?([\\s\\S]*))?$")},_extractParameters:function(t,e){var r=t.exec(e).slice(1);return i.map(r,function(t,e){if(e===r.length-1)return t||null;return t?decodeURIComponent(t):null})}});var M=e.History=function(){this.handlers=[];this.checkUrl=i.bind(this.checkUrl,this);if(typeof window!=="undefined"){this.location=window.location;this.history=window.history}};var N=/^[#\/]|\s+$/g;var O=/^\/+|\/+$/g;var U=/#.*$/;M.started=false;i.extend(M.prototype,l,{interval:50,atRoot:function(){var t=this.location.pathname.replace(/[^\/]$/,"$&/");return t===this.root&&!this.getSearch()},matchRoot:function(){var t=this.decodeFragment(this.location.pathname);var e=t.slice(0,this.root.length-1)+"/";return e===this.root},decodeFragment:function(t){return decodeURI(t.replace(/%25/g,"%2525"))},getSearch:function(){var t=this.location.href.replace(/#.*/,"").match(/\?.+/);return t?t[0]:""},getHash:function(t){var e=(t||this).location.href.match(/#(.*)$/);return e?e[1]:""},getPath:function(){var t=this.decodeFragment(this.location.pathname+this.getSearch()).slice(this.root.length-1);return t.charAt(0)==="/"?t.slice(1):t},getFragment:function(t){if(t==null){if(this._usePushState||!this._wantsHashChange){t=this.getPath()}else{t=this.getHash()}}return t.replace(N,"")},start:function(t){if(M.started)throw new Error("Backbone.history has already been started");M.started=true;this.options=i.extend({root:"/"},this.options,t);this.root=this.options.root;this._wantsHashChange=this.options.hashChange!==false;this._hasHashChange="onhashchange"in window&&(document.documentMode===void 0||document.documentMode>7);this._useHashChange=this._wantsHashChange&&this._hasHashChange;this._wantsPushState=!!this.options.pushState;this._hasPushState=!!(this.history&&this.history.pushState);this._usePushState=this._wantsPushState&&this._hasPushState;this.fragment=this.getFragment();this.root=("/"+this.root+"/").replace(O,"/");if(this._wantsHashChange&&this._wantsPushState){if(!this._hasPushState&&!this.atRoot()){var e=this.root.slice(0,-1)||"/";this.location.replace(e+"#"+this.getPath());return true}else if(this._hasPushState&&this.atRoot()){this.navigate(this.getHash(),{replace:true})}}if(!this._hasHashChange&&this._wantsHashChange&&!this._usePushState){this.iframe=document.createElement("iframe");this.iframe.src="javascript:0";this.iframe.style.display="none";this.iframe.tabIndex=-1;var r=document.body;var n=r.insertBefore(this.iframe,r.firstChild).contentWindow;n.document.open();n.document.close();n.location.hash="#"+this.fragment}var s=window.addEventListener||function(t,e){return attachEvent("on"+t,e)};if(this._usePushState){s("popstate",this.checkUrl,false)}else if(this._useHashChange&&!this.iframe){s("hashchange",this.checkUrl,false)}else if(this._wantsHashChange){this._checkUrlInterval=setInterval(this.checkUrl,this.interval)}if(!this.options.silent)return this.loadUrl()},stop:function(){var t=window.removeEventListener||function(t,e){return detachEvent("on"+t,e)};if(this._usePushState){t("popstate",this.checkUrl,false)}else if(this._useHashChange&&!this.iframe){t("hashchange",this.checkUrl,false)}if(this.iframe){document.body.removeChild(this.iframe);this.iframe=null}if(this._checkUrlInterval)clearInterval(this._checkUrlInterval);M.started=false},route:function(t,e){this.handlers.unshift({route:t,callback:e})},checkUrl:function(t){var e=this.getFragment();if(e===this.fragment&&this.iframe){e=this.getHash(this.iframe.contentWindow)}if(e===this.fragment)return false;if(this.iframe)this.navigate(e);this.loadUrl()},loadUrl:function(t){if(!this.matchRoot())return false;t=this.fragment=this.getFragment(t);return i.some(this.handlers,function(e){if(e.route.test(t)){e.callback(t);return true}})},navigate:function(t,e){if(!M.started)return false;if(!e||e===true)e={trigger:!!e};t=this.getFragment(t||"");var i=this.root;if(t===""||t.charAt(0)==="?"){i=i.slice(0,-1)||"/"}var r=i+t;t=this.decodeFragment(t.replace(U,""));if(this.fragment===t)return;this.fragment=t;if(this._usePushState){this.history[e.replace?"replaceState":"pushState"]({},document.title,r)}else if(this._wantsHashChange){this._updateHash(this.location,t,e.replace);if(this.iframe&&t!==this.getHash(this.iframe.contentWindow)){var n=this.iframe.contentWindow;if(!e.replace){n.document.open();n.document.close()}this._updateHash(n.location,t,e.replace)}}else{return this.location.assign(r)}if(e.trigger)return this.loadUrl(t)},_updateHash:function(t,e,i){if(i){var r=t.href.replace(/(javascript:|#).*$/,"");t.replace(r+"#"+e)}else{t.hash="#"+e}}});e.history=new M;var q=function(t,e){var r=this;var n;if(t&&i.has(t,"constructor")){n=t.constructor}else{n=function(){return r.apply(this,arguments)}}i.extend(n,r,e);var s=function(){this.constructor=n};s.prototype=r.prototype;n.prototype=new s;if(t)i.extend(n.prototype,t);n.__super__=r.prototype;return n};y.extend=x.extend=$.extend=I.extend=M.extend=q;var F=function(){throw new Error('A "url" property or function must be specified')};var z=function(t,e){var i=e.error;e.error=function(r){if(i)i.call(e.context,t,r,e);t.trigger("error",t,r,e)}};return e});
//# sourceMappingURL=backbone-min.map
!function(){"use strict";function g(a){a[c]||(a[c]=0===f.length?++d:f.pop());var b=a[c];return e[b]||(e[b]=[])}function h(a){var b=a[c];e[b]&&(e[b]=null,a[c]=null,f.push(b))}function i(c,d,e,f){"function"==typeof e&&(f=e,e=null);var h=a.exec(d);d=h[1]||null;var i=h[2]||null;if(d){var j=f,k=f;j=e?function(a){for(var d=a.target;d&&d!==c;d=d.parentElement)if(b.call(d,e)){var f=k.call(d,a,d);return f===!1&&(a.stopPropagation(),a.preventDefault()),f}}:function(a){var b=k.call(c,a,c);return b===!1&&(a.stopPropagation(),a.preventDefault()),b},c.addEventListener(d,j,!1),g(c).push({eventName:d,callback:f,handler:j,namespace:i,selector:e})}}function j(b,c,d,e){"function"==typeof d&&(e=d,d=null);var f=a.exec(c||"");c=f[1];var i=f[2],j=g(b)||[];if(c||i||d||e){var k=j.filter(function(a){return!(i&&a.namespace!==i||c&&a.eventName!==c||e&&a.callback!==e||d&&a.selector!==d)});k.forEach(function(a){b.removeEventListener(a.eventName,a.handler,!1),j.splice(j.indexOf(a),1)}),0===j.length&&h(b)}else j.forEach(function(a){b.removeEventListener(a.eventName,a.handler,!1)}),h(b)}function k(a,b){if(b=b||document,!(this instanceof k))return new k(a,b);if(a)if("string"==typeof a)if(/^\s*</.test(a)){var c=document.createElement("div");c.innerHTML=a,this[0]=c.firstChild,c.removeChild(c.firstChild),this.length=1}else a=b.querySelector(a),null!==a?(this[0]=a,this.length=1):this.length=0;else this[0]=a,this.length=1;else this.length=0}var a=/^([^.]+)?(?:\.([^.]+))?$/,b=Element.prototype.matchesSelector||null;b||["webkit","moz","o","ms"].forEach(function(a){var c=Element.prototype[a+"MatchesSelector"];c&&(b=c)});var c="backboneNativeKey"+Math.random(),d=1,e={},f=[];if(k.prototype={hide:null,appendTo:null,find:null,attr:function(a){return Object.keys(a).forEach(function(b){switch(b){case"html":this[0].innerHTML=a[b];break;case"text":this[0].textContent=a[b];break;case"class":this[0].className=a[b];break;default:this[0].setAttribute(b,a[b])}},this),this},html:function(a){return this[0].innerHTML=a,this},remove:function(){var a=this[0];return a.parentElement&&a.parentElement.removeChild(a),function b(a){j(a);for(var c=0,d=a.childNodes.length;d>c;c++)a.childNodes[c].nodeType!==Node.TEXT_NODE&&b(a.childNodes[c])}(a),this},on:function(a,b,c){return i(this[0],a,b,c),this},off:function(a,b,c){return j(this[0],a,b,c),this},bind:function(a,b){return this.on(a,b)},unbind:function(a,b){return this.off(a,b)},delegate:function(a,b,c){return this.on(b,a,c)},undelegate:function(a,b,c){return this.off(b,a,c)}},k.ajax=function(a){a=a||{};var b=a.type||"GET",c=a.url,d=void 0===a.processData?!0:!!a.processData,e=a.contentType||"application/x-www-form-urlencoded; charset=UTF-8",f=a.data;if(d&&"object"==typeof f){var g=Object.keys(f).map(function(a){return encodeURIComponent(a)+"="+encodeURIComponent(f[a])});f=g.join("&")}!f||"GET"!==b&&"HEAD"!==b||(c+=(-1===c.indexOf("?")?"?":"&")+f,f=void 0);var h=new XMLHttpRequest;return h.open(b,c,!0),h.setRequestHeader("Content-Type",e),a.beforeSend&&a.beforeSend(h),h.onload=function(){var b=!1,c=h.responseText;if("json"===a.dataType)try{c=JSON.parse(c)}catch(d){b=!0}!b&&h.status>=200&&h.status<300?a.success&&a.success(c,h.statusText,h):a.error&&a.error(h)}.bind(this),h.onerror=h.onabort=function(){a.error&&a.error(h)},h.send(f),h},k.on=i,k.off=j,"undefined"!=typeof exports)module.exports=k;else{var l=this,m=l.Backbone?l.Backbone.Native:null,n=l.$;l.Backbone&&(l.Backbone.Native=k),l.$=k,k.noConflict=function(a){return l.$=n,a&&(l.Backbone.Native=m),k},l.Backbone&&(l.Backbone.setDomLibrary?l.Backbone.setDomLibrary(k):l.Backbone.$=k)}}.call(this);
!function(){window.__&&console.error("Another instance of lean detected")}();var __={env:{},onLoad:function(e){if(__.env.supportNative)document.addEventListener("deviceready",e,!1),__.env.loaded&&__.attachFile("cordova.js","js");else{if("complete"===document.readyState)return e();window.addEventListener("load",e,!1)}__.env.loaded=!0},dummyCB:function(){},refChain:function(e,t){if(!t||!t.length)return e;var n=e[t.shift()];return n?arguments.callee(n,t):0},querystring:function(e){return Object.keys(e).reduce(function(t,n){return t.push(encodeURIComponent(n)+"="+encodeURIComponent(e[n])),t},[]).join("&")},ajax:function(e,t,n,r,o,a){if(o=o||function(e){e&&console.error(e)},!t)return o("url not defined");r=r||{};var i=XMLHttpRequest?new XMLHttpRequest:new ActiveXObject("Microsoft.XMLHTTP"),s="POST"===(e=e.toUpperCase()),c="string"==typeof n?1:n instanceof FormData?3:2;if(t=encodeURI(t),!s&&(t+="?appVer="+__.env.appVer,n)){switch(t+="&",c){case 1:t+=encodeURIComponent(n);break;case 2:t+=__.querystring(n);break;case 3:return o("FormData with GET method is not supported yet")}n=null}i.open(e,t,void 0===r.async?!0:r.async,r.un,r.passwd),i.onreadystatechange=function(){if(1<i.readyState){var t,s=i.status;return s>=300&&400>s&&(t=i.getResponseHeader("location"))?__.ajax(e,t,n,r,o,a):o(300>s||!s?null:{error:i.statusText,code:i.status},i.readyState,i.responseText,a)}},i.onerror=function(e){o({error:i.statusText,code:i.status,params:arguments},i.readyState,null,a)},s&&n&&3!==c&&i.setRequestHeader("Content-Type","text/plain");var u=r.headers;for(var d in u)i.setRequestHeader(d,u[d]);switch(c){case 1:i.send(n);break;case 2:i.send(JSON.stringify(n));break;case 3:i.send(n)}},createEvent:function(e,t,n,r){var o=document.createEvent("CustomEvent");return o.initCustomEvent(e,n||!1,r||!1,t),o},detectEvent:function(e,t){var n=document.createElement(t||"div");e="on"+e;var r=e in n||e in window;return r||(n.setAttribute(e,""),r="function"==typeof n[e],n[e]=void 0,n.removeAttribute(e)),n=void 0,r},attachFile:function(e,t,n){var r,o=document.getElementsByTagName("head")[0];switch(t){case"js":return r=document.createElement("script"),r.setAttribute("src",e),r.onload=n,r.onerror=n,void o.insertBefore(r,o.lastChild);case"css":return r=document.createElement("link"),r.setAttribute("rel","stylesheet"),r.setAttribute("href",e),o.insertBefore(r,o.lastChild),setTimeout(n,0);default:return n()}},detachFile:function(e,t){var n,r;switch(t){case"js":r=document.getElementsByTagName("script"),n="src";break;case"css":r=document.getElementsByTagName("link"),n="href";break;default:r=[]}for(var o,a=r.length;o=r[a];a--)o&&null!=o.getAttribute(n)&&-1!=o.getAttribute(n).indexOf(e)&&o.parentNode.removeChild(o)}};!function(){var e=__.env,t=document.querySelector("meta[name=app-version]"),n="transitionend",r="webkitTransitionEnd";e.transitionEnd=__.detectEvent(n)?n:__.detectEvent(r.toLowerCase())?r:void 0,e.supportPassive=!1;try{window.addEventListener("t",null,Object.defineProperty({},"passive",{get:function(){e.supportPassive=!0}}))}catch(o){}if(e.appVer=t?t.getAttribute("content"):"0",e.supportNative=!1,-1===document.URL.indexOf("http://")&&-1===document.URL.indexOf("https://")){var a=document.querySelector("meta[name=app-support-native]");e.supportNative=a?"1"===a.getAttribute("content").toLowerCase():!1}}(),!function(){function e(e){var t=e.target,n=e.detail.page,r=t.querySelector(".__page");if(t&&n){if(!r)return n.classList.add("__page"),t.appendChild(n),t.dispatchEvent(__.createEvent("__flipped"));switch(r.addEventListener(__.env.transitionEnd,function o(e){r.removeEventListener(__.env.transitionEnd,o),t.dispatchEvent(__.createEvent("__flipped",{page:r})),r=void 0},!1),e.detail.from){case"right":attr="left",px=r.offsetWidth;break;case"left":attr="left",px=-r.offsetWidth;break;case"bottom":attr="top",px=r.offsetHeight;break;case"top":attr="top",px=-r.offsetHeight}n.style[attr]=px+"px",n.classList.add("__page"),t.appendChild(n),n.offsetWidth,n.style[attr]="",r.style[attr]=-px+"px"}}function t(){for(var t,n=0,r=document.querySelectorAll(".__book");t=r[n];n++)t.addEventListener("__flip",e,!1)}t(),document.addEventListener("__reset",t,!1)}(),!function(){function e(){var e=__.refChain(window,["navigator","notification"]);e?__.dialogs={alert:function(t,n,r,o){e.alert(t,o||__.dummyCB,n,r)},confirm:function(t,n,r,o){e.confirm(t,o,n,r)},prompt:function(t,n,r,o,a){e.prompt(t,a,n,r,o)},beep:function(t){e.beep(t)}}:__.dialogs={alert:function(e,t,n,r){setTimeout(function(){alert(e),(r||__.dummyCB)()},0)},confirm:function(e,t,n,r){setTimeout(function(){r(confirm(e)?1:2)},0)},prompt:function(e,t,n,r,o){setTimeout(function(){var t=prompt(e,r);o({buttonIndex:t?1:2,input1:t})},0)},beep:function(){console.log("beep")}}}__.onLoad(e)}(),!function(){if(!__.detectEvent("touchstart")){var e=__.env.supportPassive?{capture:!0,passive:!0}:!0,t="mousedown",n="mouseup",r="mousemove",o="mouseout",a="touchstart",i="touchend",s="touchmove",c="touchcancel",u=function(e){var u;switch(e.type){case t:u=a;break;case n:u=i;break;case r:u=s;break;case o:u=c;break;default:return console.error("wrong event: "+e.type)}var d=e.target,f=[{pageX:e.pageX,pageY:e.pageY,target:d}],v=new Event(u,{bubbles:e.bubbles,cancelable:e.cancelable});v.pageX=e.pageX,v.pageY=e.pageY,v.touches=v.changedTouches=v.targetTouches=f,v.mouseToTouch=!0,d.dispatchEvent(v)},d=function(){document.removeEventListener(t,f),document.removeEventListener(r,v),document.removeEventListener(n,p),document.removeEventListener(o,l)},f=function(t){d(),document.addEventListener(r,v,e),document.addEventListener(n,p,e),document.addEventListener(o,l,e),u(t)},v=function(e){u(e)},p=function(n){d(),document.addEventListener(t,f,e),u(n)},l=function(n){d(),document.addEventListener(t,f,e),u(n)};document.addEventListener(t,f,e)}}(),!function(){function e(t){var n=t.target;n.removeEventListener(__.env.transitionEnd,e),n.dispatchEvent(__.createEvent("__transited"))}function t(t){var n,r,o=t.target,a=t.detail;if(o.removeEventListener(__.env.transitionEnd,e),o.addEventListener(__.env.transitionEnd,e,!1),!a)return o.style.cssText="";switch(a.from){case"top":n="top",r=a.ref.offsetHeight;break;case"bottom":n="top",r=-a.ref.offsetHeight;break;case"left":n="left",r=a.ref.offsetWidth;break;case"right":n="left",r=-a.ref.offsetWidth;break;default:return}o.style.cssText=n+":"+r+"px"}function n(){for(var e,n=0,r=document.querySelectorAll(".__slider");e=r[n];n++)e.addEventListener("__transit",t,!1)}n(),document.addEventListener("__reset",n,!1)}(),!function(){var e,t,n=__.env.supportPassive?{capture:!0,passive:!0}:!0,r=!1,o=0,a=0,i=function(e){return[e.pageX,e.pageY]},s=function(e){r||(r=!0,e.target.dispatchEvent(__.createEvent("longTap",null,!0)))},c=function(n){r=!1,t=e=i(n.touches[0]),o=window.setTimeout(s,2e3,n)},u=function(e){if(window.clearTimeout(o),!r){var t=Date.now();300>t-a?(e.target.dispatchEvent(__.createEvent("taps",null,!0)),a=0):(e.target.dispatchEvent(__.createEvent("tap",null,!0)),a=t)}},d=function(n){var o=i(n.touches[0]);r?(o[0]>t[0]+9||o[1]>t[1]+9)&&n.target.dispatchEvent(__.createEvent("rub",[o[0]-t[0],o[1]-t[1]],!0)):(o[0]>e[0]+9||o[1]>e[1]+9)&&(r=!0),t=o},f=function(e){r=!0,window.clearTimeout(o)};document.addEventListener("touchstart",c,n),document.addEventListener("touchend",u,n),document.addEventListener("touchmove",d,n),document.addEventListener("touchcancel",f,n)}();
//# sourceMappingURL=/opt/lean/lean.min.js.map
(function(e,r,t){var n,i,o=function(){},a=function(){arguments[arguments.length-1]()},u={run:o,build:o,reload:o,parse:o,define:o,"import":o,"export":o,env:o,ajax:o},s={"'":"&#039;","\n":"\\n","\r":"\\n"},c=function(e){return s[e]},l={},f=[],p=".js",d=".json",h="pico.define('URL','FUNC')\n",g='"use strict";\n',v="//# sourceURL=",m="return arguments.callee.__proto__.apply(this,arguments)",y={},b={},S={},k=function(){return"undefined"==typeof requestAnimationFrame?function(e){return setTimeout(e,100)}:requestAnimationFrame}(),x=function(e){return e.substring(e.indexOf("{")+1,e.lastIndexOf("}"))},w=function(e){if(!e)return null;var r=e.lastIndexOf(".");return-1!==r&&-1===e.indexOf("/",r)?e.substr(r):null},I=function(e,r){return e.length?void T(e.shift(),function(t){return t?r(t):void I(e,r)}):r()},T=function(e,r){if(l[e])return r(null,l[e]);var t=w(e),i=e.indexOf("/"),o=y[-1===i?e:e.substr(0,i)];o||(i=-1,o=y["*"]||"");var a=-1===i?e:e.substr(i+1);o instanceof Function?o(a,function(t,n){return t?r(t):(l[e]=n,void r(null,n))}):n("get",o+a+(t?"":p),null,null,function(n,i,o){if(n)return r(n);if(4===i)switch(t||p){case p:return M(e,o,r);default:return r(null,D(e,o))}})},O=function(){return Function(m)},F=function(e,r){var t=l[e];return t?(setTimeout(r||o,0,null,t),t):r?T(e,r):l[e]=O()},N=function(e,r,t,n,i){i=i||u;var a=e?g+r+(b.live?"":v+e):r,s=function(e){return l[e]||t.push(e),l[e]},c=function(e){n.unshift(e),s(e)};try{var f=Function("exports","require","module","define","inherit","pico",a)}catch(p){return console.error(e,p.message)}return f.call({},{},s,{},o,c,i),f},D=function(e,r,t,n){var i=w(e)||p,a=S[i];switch(a&&(r=a(e,r)),i){case p:var u={exports:{}},s={},c=r.call(n?{}:s,u.exports,F,u,D,o,E)||u.exports;if(t&&(c.__proto__=t),s.load&&s.load(),"function"==typeof s.update&&f.push(s.update),!e)return c;var h=l[e];return h?(h.prototype=c.prototype,h.__proto__=c,l[e]=h):l[e]=c;case d:try{return l[e]=JSON.parse(r)}catch(g){return console.error(e,g.message)}default:return l[e]=r}},M=function(e,r,t){if(t=t||o,l[e])return t(null,l[e]);var n=[],i=[],a=N(e,r,n,i);e&&(l[e]=O()),I(n,function(r){return r?t(r):void t(null,D(e,a,l[i[0]]))})},J=function(e){k(J);for(var r,t=0;r=f[t];t++)r(e)},E=e[r]={run:function(e,r){E.ajax=n=e.ajax||n,y=e.paths||y,b=e.env||b,S=e.preprocessors||S;var t;for(var o in l)t=S[w(o)||p],t&&(l[o]=t(o,l[o]));(e.onLoad||a)(function(){M(e.name||null,x(r.toString()),function(e,r){return e?console.error(e):(r instanceof Function&&r(),i&&i(),void k(J))})})},build:function(e){var r=t("fs"),n=e.entry,a=e.output,u=e.exclude,s=D,l=function(e,t){t&&t.length&&(r.appendFileSync(e,r.readFileSync(t.shift())),r.appendFileSync(e,"\n"),l(e,t))},f=function(e,r){return e&&e.length?void T(e.shift(),function(t){f(e,r)}):r()};J=o,D=function(e,t,n){if(s(e,t,n,!0),e&&-1===u.indexOf(e))switch(w(e)||p){case p:return r.appendFileSync(a,h.replace("URL",e).replace("'FUNC'",t.toString()));case d:return r.appendFileSync(a,h.replace("URL",e).replace("FUNC",JSON.stringify(JSON.parse(t)).replace(/['\n\r]/g,c)));default:return r.appendFileSync(a,h.replace("URL",e).replace("FUNC",t.replace(/['\n\r]/g,c)))}},r.unlink(a,function(){l(a,e.deps),r.readFile(n,"utf8",function(t,o){if(t)return console.error(t);var s=N(null,o,[],[],E);-1===u.indexOf(n)&&(i=function(){r.appendFileSync(a,x(s.toString())),f(e.include,function(e){e&&console.error(e),process.exit()})})})})},reload:function(e,r,t){"function"==typeof r&&(t=r),t=t||o;var n=l[e];if(delete l[e],p!==(w(e)||p))return t(null,n);var i=function(r,i){return r?t(r):n?(n.prototype=i.prototype,n.__proto__=i,t(null,l[e]=n)):t(null,i)};"string"==typeof r?M(e,r,i):T(e,i)},parse:M,define:D,"import":t,"export":F,env:function(e){return b[e]}};"object"==typeof process&&(n=n||function(e,r,n,i,o,a){var u=t("fs").readFileSync(r,"utf8");return u?setImmediate(o,null,4,u,a):void setImmediate(o,"failed",2,null,a)}),D("pico/json",function(e,r,t,n,i,o){return{parse:function(e,r){return JSON.parse(e[0],function(t,n){switch(t[0]){case"$":if(r)return JSON.parse(e[n]);case"_":return e[n];default:return n}})},stringify:function(e,r){var t=[];return t.unshift(JSON.stringify(e,function(e,n){switch(e[0]){case"$":if(r)return t.push(JSON.stringify(n));case"_":return t.push(n);default:return n}})),t}}}),D("pico/obj",function(){var e=["object","function"];return{extend:function(r,t,n){var i=e.indexOf(typeof r);if(-1===i)return t;var o=e.indexOf(typeof t);if(-1===o)return r;if(1===o&&o===i)return t;n=n||{};var a,u,s=n.tidy,c=arguments.callee;if(1===o||void 0===t.length)for(a in t)u=t[a],void 0===u&&s||(r[a]=c(r[a],u,n));else if(n.mergeArr){var l,f,p={};for(l=0,f=r.length;f>l;l++)void 0===(u=r[l])&&s||(p[u]=u);for(l=0,f=t.length;f>l;l++)void 0===(u=t[l])&&s||(p[u]=u);r=[];for(a in p)r.push(p[a])}else r=t;return r},"extends":function(e,r,t){for(var n,i=this.extend,o=0;n=r[o];o++)e=i(e,n,t);return e},parseInts:function(e){for(var r=0,t=e.length;t>r;r++)e[r]=parseInt(e[r]);return e},pluck:function(e,r){var t=[];if(e.length){var n,i,o,a,u,s={};for(o=0,a=e.length;a>o;o++)n=e[o],n&&(i=n[r],void 0!==i&&(s[i]=i));for(u in s)t.push(s[u])}return t},strip:function(e,r){if(e.length)for(var t,n=0;t=e[n];n++)t[r]=void 0;return e},keyValues:function(e,r,t){for(var n,i={},o=0;n=e[o];o++)i[n[r]]=n[t];return i},map:function(e,r,t,n){for(var i,o={},a=0;i=e[a];a++)o[r[i[t]]]=i[n];return o},replace:function(e,r,t){for(var n,i=0;n=e[i];i++)n[t]=r[n[t]];return e},group:function(e,r,t){var n={};t=t||{};for(var i,o,a=0;i=e[a];a++)o=i[r],o=t[o]||o,n[o]=n[o]||[],n[o].push(i);return n},values:function(e,r){for(var t,n=[],i=0;t=r[i];i++)n.push(e[t]);return n},merge:function(e,r){if(!e)return r;if(!r)return e;for(var t,n=0,i=Object.keys(r);t=i[n];n++)e[t]=r[t];return e},mergeByKey:function(e,r,t){var n,i=this.merge,o={},a=[];if(e)for(var u,s=0;u=e[s];s++)n=u[t],void 0!==n&&(o[n]=u);if(r)for(var c,l=0;c=r[l];l++)n=c[t],void 0!==n&&(u=o[n],o[n]=u?i(u,c):c);for(n in o)a.push(o[n]);return a},filter:function(e,r,t){for(var n,i,o=[],a=0;i=e[a];a++)n=i[t],n&&-1===r.indexOf(n)&&o.push(i);return o},insert:function(e,r){for(var t,n=this.merge,i=0;t=e[i];i++)t=n(t,r);return e}}}),D("pico/str",function(){var e=(Math.ceil,Math.random),r=function(e,r){var t=r[0];return"["+(t.getFunctionName()||t.getTypeName()+"."+t.getMethodName())+"@"+t.getFileName()+":"+t.getLineNumber()+":"+t.getColumnNumber()+"]"};return{codec:function(e,r){for(var t,n=0,i="";t=r.charCodeAt(n);n++)i+=String.fromCharCode(t^e);return i},hash:function(e){for(var r,t=0,n=0;r=e.charCodeAt(t);t++)n=31*n+r|0;return n},rand:function(){return e().toString(36).substr(2)},pad:function(e,r,t){return this.tab(e,r,t)+e},tab:function(e,r,t){return Array(r-String(e).length+1).join(t||"0")},log:function(){var e=Error.prepareStackTrace,t=Error.stackTraceLimit;Error.prepareStackTrace=r,Error.stackTraceLimit=1;var n=new Error;Error.captureStackTrace(n,arguments.callee);var i=[(new Date).toISOString(),n.stack];console.log.apply(console,i.concat(Array.prototype.slice.call(arguments))),Error.prepareStackTrace=e,Error.stackTraceLimit=t},error:function(){var e=Error.stackTraceLimit;Error.stackTraceLimit=4;var r=new Error;Error.captureStackTrace(r,arguments.callee);var t=[(new Date).toISOString()];t=t.concat(Array.prototype.slice.call(arguments)),t.push("\n"),console.error.apply(console,t.concat(r.stack)),Error.stackTraceLimit=e}}}),D("pico/test",function(){var e=E["export"]("pico/str"),r="undefined"==typeof t?JSON.stringify:t("util").inspect;return{ensure:function(t,n){n(function(n,i){return n?console.error(t+":"+e.tab(t,100,"-")+n):void console.log(t+":"+e.tab(t,100,".")+r(i,{colors:!0}))})}}}),D("pico/time",function(){var e=Math.max,r=Math.min,t=Math.floor,n=Math.ceil,i=864e5,o=36e5,a=6e4,u=1e3,s=function(e,r){return(e-r)/i},c=function(e,r,t){var i=r?1:0,o=new Date(e.getFullYear()+(t||0),0,1),a=(7-o.getDay())%7+i,u=s(e,o);return u>a?n((u-a)/7):c(e,r,-1)},l=function(e,r,t){var n=e.split("/"),i=n[0];if("*"===i)n[0]=r;else if(i=n[0]=parseInt(i),r>i||i>t)return;return 1===n.length?n.push(0):n[1]=parseInt(n[1]),n},f=function(e,r,t){if("*"===e)return 0;var n=[];list=e.split(",");for(var i,o,a,u,s,c,f,p=0;i=list[p];p++){if(a=i.split("-"),!a.length)return null;if(u=l(a[0],r,t),1!==a.length)if(s=l(a[1],r,t),o=u[0],c=s[0],f=s[1]||1,o>c){for(c=t;c>=o;o+=f)n.push(o);for(o=r,c=s[0];c>=o;o+=f)n.push(o)}else for(;c>=o;o+=f)n.push(o);else if(f=u[1])for(o=u[0];t>=o;o+=f)n.push(o);else n.push(u[0])}return n.sort(function(e,r){return e-r}),n},p=function(t,n,i){if(!n)return t;if(e.apply(Math,n.concat(t))===t)return t+(i-t)+r.apply(Math,n);for(var o=0,a=n.length;a>o;o++)if(n[o]>=t)return n[o];console.error("not suppose to be here",t,n,i)},d=function(e,r,n,u,s,c,l,f,h){if(r++>1)return h(0);var g=p(e.getMinutes(),n,60),v=p(e.getHours()+t(g/60),u,24),m=e.getDate(),y=e.getMonth(),b=e.getFullYear(),S=new Date(b,y,0).getDate();if(l){var k=e.getDay()+t(v/24),x=p(k,l,7);m+=x-k}else m=p(m+t(v/24),s,S);if(y=p(y+1+t(m/S),c,12),e.getMonth()+1!==y)return d(new Date(b,y-1),r,n,u,s,c,l,f,h);if(b=p(b+t((y-1)/12),f,0),e.getFullYear()!==b)return d(new Date(b,y-1),r,n,u,s,c,l,f,h);var w=new Date(b,(y-1)%12).getTime();return w+=(m%S-1)*i,w+=v%24*o,w+=g%60*a,h(w)};return{deltaToNext:function(e,r,t,n,i){var s=new Date,c=s.getTime()%o-((t||0)*a+(n||0)*u+(i||0)),l=(r||0)+24*e-s.getHours();return l*o-c},timeOfNext:function(e,r,t,n,i){return new Date(Date.now()+this.deltaToNext(e,r,t,n,i)).getTime()},parse:function(e){var r=e.split(" ");if(r.length<6)return 0;var t=f(r[0],0,59);if(null==t)return 0;var n=f(r[1],0,23);if(null==n)return 0;var i=f(r[2],1,31);if(null==i)return 0;var o=f(r[3],1,12);if(null==o)return 0;var a=f(r[4],0,6);if(null==a)return 0;var u=f(r[5],1975,2075);return null==u?0:[t,n,i,o,a,u]},nearest:function(e,r,t,n,i,o){var u=new Date,s=p(u.getFullYear(),o,0),c=p(u.getMonth()+1,n,12)-1;if(u.getFullYear()!==s||u.getMonth()!==c)u=new Date(s,c);else{var l=u.getTime();u=new Date(l+a)}return d(u,0,e,r,t,n,i,o,function(e){return e})},daynum:s,weeknum:c,day:function(e,r){var t=new Date,n=new Date(t.getFullYear(),t.getMonth(),t.getDate(),12,0,0),o=n-e,a=1.5*i;return o>=0&&a>=o||0>=o&&o>-a?t.getDate()===e.getDate()?"Today":t>e?"Yesterday":"Tomorrow":(r=r||"en-US",t.getFullYear()===e.getFullYear()&&c(t)===c(e)?e.toLocaleDateString(r,{weekday:"long"}):e.toLocaleDateString(r,{weekday:"short",month:"short",day:"numeric"}))}}}),D("pico/web",function(e,r,t,i,o,a){function u(e){return e.url?(w(this,e),this.reqId=1+l(1e3*f()),this.inbox=[],this.outbox=[],this.uploads=[],this.callbacks={},this.acks=[],this.reqs=[],this.resEndPos=0,this.head=null,this.body=[],this.currPT=d,this.serverTime=0,this.serverTimeAtClient=0,void(this.beatId=0)):console.error("url is not set")}var s=r("pico/json"),c=Math.abs,l=Math.floor,f=Math.random,p="ack",d=1,h=2,g=!0,v=function(e){e&&console.error(e)},m=function(e,r,t){e.append(r,t)},y=function(e,r,t){e[r]=t},b=function(e,r){r=r||v,n("get",e.url,null,null,function(t,n,i){if(4===n){if(t)return r(t);var o=parseInt(i);if(isNaN(o))return r("invalid timesync response");e.serverTime=o,e.serverTimeAtClient=Date.now(),e.beatId=setInterval(k,e.beatRate,e),r()}})},S=function(e,r,t,n){if(e){if(4!==r)return;var i,o;if(t){try{i=JSON.parse(t).reqId}catch(a){return console.error(a)}return o=n.callbacks[i],void(o&&(delete n.callbacks[i],o(e)))}for(var u,l=n.reqs,f=n.delimiter,g=0,v=l.length;v>g;g++)if(u=l[g]){try{i=JSON.parse(u.split(f)[0]).reqId}catch(a){console.error(a);continue}o=n.callbacks[i],o&&(delete n.callbacks[i],o(e))}return l.length=0,b(n)}switch(r){case 2:n.head=null,n.currPT=d;break;case 3:break;case 4:n.beatId||(n.beatId=setInterval(k,n.beatRate,n))}var m,y=n.resEndPos,S=-1,f=n.delimiter,x=f.length,w=n.body;try{for(;;){if(S=t.indexOf(f,y),-1===S)break;switch(n.currPT){case d:n.head=JSON.parse(t.substring(y,S)),w.length=0,n.currPT=h;break;case h:w.push(t.substring(y,S))}if(m=n.head,m&&m.len===w.length){if(n.currPT=d,m.resId&&n.request(p,{resId:m.resId}),!m.reqId)return void console.error("incomplete response header: "+JSON.stringify(m));if(n.cullAge&&n.cullAge<c(n.getServerTime()-m.date))return void console.error("invalid server time: "+JSON.stringify(m)+" "+c(n.getServerTime()-m.date));if(n.secretKey&&w.length){for(var I=CryptoJS.algo.HMAC.create(CryptoJS.algo.MD5,n.secretKey+m.date),g=0,v=w.length;v>g;g++)I.update(w[g]);if(m.key!==I.finalize().toString(CryptoJS.enc.Base64))return void console.error("invalid server key: "+JSON.stringify(m))}m.len&&(m.data=s.parse(w,!0)),n.inbox.push(m),n.head=null}y=S+x}}catch(a){console.error(a)}n.resEndPos=y},k=function(e){if(e.inbox.length)for(var r,t,i,o=e.inbox,a=e.callbacks;i=o.pop();)r=i.reqId,t=a[r],t&&(delete a[r],t(i.error,i.data));if(g&&(e.uploads.length||e.outbox.length||e.acks.length)){if(e.resEndPos=0,e.uploads.length)n("post",e.url,e.uploads.shift(),null,S,e);else{var u=e.reqs=e.acks.concat(e.outbox);e.acks.length=e.outbox.length=0,n("post",e.url,u.join(e.delimiter)+e.delimiter,null,S,e)}return clearInterval(e.beatId),void(e.beatId=0)}},x=function(e,r,t,n){n=n||"";for(var i,o,a,u,s=t instanceof FormData?m:y,c=e.baseURI,l=0,f=e.elements;u=f[l];l++)if(u.hasAttribute("name"))if(i=u.hasAttribute("type")?u.getAttribute("type").toUpperCase():"TEXT","FILE"===i)for(o=0,a=u.files.length;a>o;s(t,n+u.name,u.files[o++]));else("RADIO"!==i&&"CHECKBOX"!==i||u.checked)&&s(t,n+u.name,u.value);for(var p in r)s(t,n+p,r[p]);return c=c.substring(0,c.lastIndexOf("/")+1),e.action.substr(c.length)},w=function(e,r){e.url=r.url||e.url,e.secretKey=r.secretKey||e.secretKey,e.cullAge=r.cullAge||e.cullAge||0,e.delimiter=r.delimiter?JSON.stringify(r.delimiter):e.delimiter||JSON.stringify(["&"]),e.beatRate=!r.beatRate||r.beatRate<100?e.beatRate||5e3:r.beatRate},I=function(e){e.resEndPos=e.outbox.length=e.acks.length=0,e.currPT=d};return u.prototype={reconnect:function(e,r){w(this,e),I(this),b(this,function(e){r(e,this)})},submit:function(e,r,t){if(!("undefined"!=typeof window&&e&&e instanceof HTMLFormElement))return console.error("No HTMLFormElement submitted");var n=0;t&&(n=this.reqId++,this.callbacks[n]=t);var i=new FormData;i.append("api",x(e,r,i,"data/")),i.append("reqId",n),this.uploads.push(i),this.beatId||(this.beatId=setInterval(k,this.beatRate,this))},request:function(e,r,t,n){switch(arguments.length){case 2:r instanceof Function&&(n=r,r=t=void 0);break;case 3:t instanceof Function&&(n=t,t=void 0);break;case 4:break;default:return console.error("wrong request params!")}if("undefined"!=typeof window&&r instanceof HTMLFormElement){var i={};e=x(r,t,i),r=i}else if(t)for(var o in t)r[o]=t[o];if(!e)return console.error("Missing api,  data["+JSON.stringify(r)+"]");var a=this.acks;if(e!==p&&(a=this.outbox,a.length)){var u=a.shift();-1===u.indexOf(e)&&a.unshift(u)}var c=0;n&&(c=this.reqId++,this.callbacks[c]=n);var l=r?s.stringify(r,!0):[];if(l.length&&this.secretKey){for(var f=this.getServerTime(),d=CryptoJS.algo.HMAC.create(CryptoJS.algo.MD5,this.secretKey+f),h=0,g=l.length;g>h;h++)d.update(l[h]);l.unshift(JSON.stringify({api:e,reqId:c,len:l.length,date:f,key:d.finalize().toString(CryptoJS.enc.Base64)}))}else l.unshift(JSON.stringify({api:e,reqId:c,len:l.length}));a.push(l.join(this.delimiter)),this.beatId||(this.beatId=setInterval(k,this.beatRate,this))},getServerTime:function(){return this.serverTime+(Date.now()-this.serverTimeAtClient)}},{create:function(e,r){var t=new u(e);b(t,function(e){r(e,t)})},ajax:n,online:function(){g=!0},offline:function(){g=!1}}})}).apply(null,"undefined"==typeof window?[module,"exports",require]:[window,"pico"]);
//# sourceMappingURL=/opt/pico/common/pico.min.js.map
pico.define('js/Model',function anonymous(exports,require,module,define,inherit,pico
/**/) {
"use strict";
return Backbone.Collection.extend({
	// config is always initialized by bb, config.comparator is consumed by bb
    initialize: function(models, config, name){
        this.name=name
        this.url = config.list
        this.model = Backbone.Model.extend({
            idAttribute: config.idAttribute || 'id',
            sync: function(method, model, options){
                if(!options.url) options.url=config[method]
                if (options.url) return Backbone.sync(method, model, options)
                return options.success()
            }
        })
        if (config.preload) this.fetch()
    },
    retrieve: function(ids, field, cb){
        var
        coll = this,
        criteria = {},
        search
        
        if (3 === arguments.length){
            search = function(n){criteria[field] = n; return !coll.findWhere(criteria)}
        }else{
            cb = field
            field = 'id'
            search = function(n){return !coll.get(n)}
        }
        var nf = _.filter(_.without(_.uniq(ids), undefined, null), search)

        if (0 === nf.length) return cb(null, coll)

        coll.fetch({
            data:{ set: nf, field:field },
            remove: false,
            success: function(coll, raw){cb(null, coll, raw)},
            error: function(coll, raw){cb(raw)}
        })
    },
    read: function(data, cb){
        var
        self=this,
        model=new this.model
        model.fetch({
            data:data,
            success:function(model, raw){
                self.add(model)
                cb(null, model, raw)
            },
            error:function(model, err){
                cb(err)
            }
        })
    }
})
//# sourceURL=js/Model
})
pico.define('js/network',function anonymous(exports,require,module,define,inherit,pico
/**/) {
"use strict";
var
web=require('pico/web'),
picoObj=require('pico/obj'),
channels = {}, directory={},
addon,
create = function(keys, domains, cb){
    if (!keys.length) return cb()

    var
    k=keys.pop(),
    c=domains[k]

    web.create({
        url: c.url,
        delimiter: c.delimiter || ['&'],
        beatRate: c.beatRate || 500,
    }, function(err, client){
        if (err) return cb(err)
        channels[k]=client
        create(keys, domains, cb)
    })
},
getKey=function(p){ 
    var i=p.indexOf('/')
    return -1===i ? p : p.substr(0, i)
}

Backbone.ajax = function(req){
    if (!req) return
    var
    api = req.url,
    c = channels[getKey(api)],
    reqData = req.data || {},
    onReceive = function(err, data){
        if (err) {
            Backbone.trigger('networkErr', err)
            return req.error(err)
        }
        Backbone.trigger('networkRecv', null, api, data)
        return req.success(data, 'success')
    }

    if (!c) return

    if (reqData.charAt){
        try {reqData=JSON.parse(reqData)}
        catch(e){console.error(e)}
    }

    if (reqData instanceof HTMLFormElement){
        api = reqData.action
        var hasFile = req.hasFile 
        for(var i=0,es=reqData.elements,e; e=es[i]; i++){
            if (e.hasAttribute('type') && 'FILE' === e.getAttribute('type').toUpperCase()){
                hasFile = true
                break
            }
        }
        if (hasFile){
            c.submit(reqData, addon, onReceive)
        }else{
            c.request(null, reqData, addon, onReceive)
        }
    }else{
        c.request(api, reqData, addon, onReceive)
    }
    Backbone.trigger('networkSend', null, api)
}

return{
    create:function(domains,cb){
        if (!domains) return cb()
        directory=picoObj.extend(directory, domains)
        create(Object.keys(domains), domains, cb)
    },
    addon:function(){ addon = arguments[0] },
    getAddon:function(){ return addon ? JSON.parse(JSON.stringify(addon)) : ''},
    getDomain:function(url){ return directory[getKey(url)] || {} }
}
//# sourceURL=js/network
})
pico.define('js/Stream',function anonymous(exports,require,module,define,inherit,pico
/**/) {
"use strict";
// TODO:
// authentication(header or cookies) with withCredentials=true
// how to get sep["&"] from pico/web?
var
network=require('js/network'),
PJSON=require('pico/json'),
callbacks=function(self){
    return [
    function(e){
		self.dcCount=0
        self.trigger(e.type)
    },
    function(e){
		self.dcCount++
        switch(e.target.readyState){
        case EventSource.CONNECTING: self.trigger('connecting',self.dcCount); break
        case EventSource.CLOSED:
        default:
            self.trigger('closed',self.dcCount);
            break
        }       
    },
	function(e){
        var data
        try{ data=PJSON.parse(e.data.split('["&"]'),true) }
        catch(exp){ data=e.data }
        self.trigger(e.type, data, e.lastEventId)
    }
    ]
}

function Stream(options){
    init(this, options.channel, options.path, options.events, options.withCredentials)
}           
            
function init(self, channel, path, events, withCredentials, dcCount){
    self.channel=channel
    self.events=events
	self.dcCount=dcCount||0
    if (!path) return

    var
    cbList=callbacks(self),
    s=new EventSource(
            encodeURI(-1===path.indexOf('//')?network.getDomain(channel).url+path:path)+
            (-1===path.lastIndexOf('?')?'?':'&')+
            __.querystring(network.getAddon()),
            {withCredentials:withCredentials})

    s.addEventListener('open', cbList[0], false)   
    s.addEventListener('error', cbList[1], false)   
    for(var i=0,e; e=events[i]; i++){
        s.addEventListener(e,cbList[2],false)
    }
	self.sse=s
}       

_.extend(Stream.prototype, Backbone.Events,{
    reconnect:function(channel, path, events, withCredentials){
        var s=this.sse
        if (s){
            s.close()
            init(
                this,
                channel||this.channel,
                path||s.url,
                events||this.events,
                withCredentials||s.withCredentials,
                this.dcCount)
        }else{
            init(
                this,
                channel||this.channel,
                path,
                events||this.events,
                withCredentials)
        }
    },
    close:function(){
        var s=this.sse
        if (!s) return
        s.close()
    }
})

return Stream
//# sourceURL=js/Stream
})
pico.define('js/Socket',function anonymous(exports,require,module,define,inherit,pico
/**/) {
"use strict";
var network=require('js/network')

function Socket(opt){
    init(this, opt.channel, opt.path, opt.protocols, opt.auto)
}           
            
function init(self, channel, path, protocols, auto){
    self.channel=channel
    self.path=path
    self.protocols=protocols
    if (!path || !auto) return

    var
	url=(-1===path.indexOf('://')?network.getDomain(channel).url+path:path).replace('http','ws'),
    s=new WebSocket(
            encodeURI(url)+'?'+__.querystring(network.getAddon()),
            protocols)

    s.addEventListener('open', function(e){
        self.trigger(e.type)
    }, false)   
    s.addEventListener('error', function(e){
		self.trigger(e.type, e)
    }, false)   
    s.addEventListener('close', function(e){
		self.trigger(e.type, e)
    }, false)   
    s.addEventListener('message', function(e){
		var data
		try{ data=JSON.parse(e.data) }
		catch(exp){ data=e.data }
		self.trigger(e.type, data)
    }, false)   
	self.ws=s
}       

_.extend(Socket.prototype, Backbone.Events,{
    reconnect:function(channel, path, protocols){
        var s=this.ws
        if (s){
            s.close()
            init(
                this,
                channel||this.channel,
                path||s.url||this.path,
                protocols||s.protocol||this.protocols,
				true)
        }else{
            init(
                this,
                channel||this.chanel,
                path||this.path,
                protocols||this.protocol,
				true)
        }
    },
	readyState:function(){
		return this.ws ? this.ws.readyState : 0
	},
	send:function(buff){
		if (1 !== this.readyState()) return false
		this.ws.send(buff)
		return true
	},
    close:function(code, reason){
        var s=this.ws
        if (!s) return
        s.close(code, reason)
    }
})

return Socket
//# sourceURL=js/Socket
})
pico.define('js/specMgr',function anonymous(exports,require,module,define,inherit,pico
/**/) {
"use strict";
var
picoObj=require('pico/obj'),
Model= require('js/Model'),
Stream= require('js/Stream'),
Socket= require('js/Socket'),
ID=0,TYPE=1,VALUE=2,EXTRA=3,
ERR1='ref of REF not found',ERR2='record RECORD of ref of REF not found',
create = function(id, type, value){ return [id, type, value] },
getId = function(spec){return spec[ID]},
getType = function(spec){return spec[TYPE]},
getValue = function(spec){return spec[VALUE]},
getExtra = function(spec,idx){return spec[EXTRA+(idx||0)]},
find = function(id, list){ for(var i=0,o; o=list[i]; i++){ if (id === o[ID]) return o } },
findAll = function(cond, list, by, all){
    var arr = []
    for(var i=0,o; o=list[i]; i++){ if (cond === o[by]) arr.push(all?o:o[VALUE]) }
    return arr
},
loadDeps = function(links, idx, klass, cb){
    if (!links || links.length <= idx) return cb(null, klass)
    if (links.charAt) return require(links, cb)
    require(links[idx++], function(err, mod){
        if (err) return cb(err)
        loadDeps(links, idx, picoObj.extend(klass, mod), cb)
    })
},
load = function(host, params, spec, idx, deps, cb, userData){
    if (spec.length <= idx) return cb(null, deps, userData)

    var
    context = host ? host.spec : [],
    s = spec[idx++],
    t = s[TYPE],
    f

    switch(t){
    case 'ref': //ID[id] TYPE[ref] VALUE[orgId]
        f = find(s[VALUE], context)
		if (!f) return cb(ERR1.replace('REF', s[VALUE]), deps, userData)
        deps.push(create(s[ID], f[TYPE], f[VALUE]))
        break
    case 'refs': // ID[id] TYPE[refs] VALUE[orgType]
        Array.prototype.push.apply(deps, findAll(s[VALUE], context, TYPE, 1))
        break
    case 'model': // ID[id] TYPE[model/field] VALUE[models] EXTRA[paramId] EXTRA1[field name]
		f = find(s[VALUE], context)
		if (!f) return cb(ERR1.replace('REF', s[VALUE]), deps, userData)
		var m = f[VALUE].get(params[s[EXTRA]])
		if (!m || !m.get) return cb(ERR2.replace('REF', s[VALUE]).replace('RECORD',params[s[EXTRA]]), deps, userData)
		'field' === t ? deps.push(create(s[ID], t, m.get(s[EXTRA+1]))) : deps.push(create(s[ID], t, m)) 
		break
    case 'models': // ID[id] TYPE[models] VALUE[options] EXTRA[default value]
        deps.push(create(s[ID], t, new Model(s[EXTRA], s[VALUE], s[ID])))
        break
	case 'fields': // ID[id] TYPE[fields] VALUE[models] EXTRA[filter] EXTRA1[field names]
		f = find(s[VALUE], context)
		if (!f) return cb(ERR1.replace('REF', s[VALUE]), deps, userData)
		var m = s[EXTRA] ? new Model(f[VALUE].where(s[EXTRA])) : f[VALUE]
		if (!m || !m.pluck) return cb(ERR2.replace('REF', s[VALUE]).replace('RECORD',s[EXTRA]), deps, userData)
		deps.push(create(s[ID], t, m.pluck(s[EXTRA+1])))
		break
    case 'ctrl':
    case 'view': // ID[id/path] TYPE[ctrl/view] VALUE[spec] EXTRA[path/path+mixins]
        loadDeps(s[EXTRA]||s[ID], 0, {}, function(err, klass){
            if (err) return cb(err, deps, userData)
            f=s[ID]
            deps.push(create(f, t, {name:f, type:t, spec:s[VALUE], Class:klass}))
            load(host, params, spec, idx, deps, cb, userData)
        })
        return
    case 'file': // ID[id] TYPE[file] VALUE[path]
        require(s[VALUE], function(err, mod){
            if (err) return cb(err, deps, userData)
            deps.push(create(s[ID], t, mod))
            load(host, params, spec, idx, deps, cb, userData)
        })
        return
    case 'stream': // ID[id] TYPE[stream] VALUE[config]
        deps.push(create(s[ID], t, new Stream(s[VALUE])))
        break
    case 'socket': // ID[id] TYPE[socket] VALUE[config]
        deps.push(create(s[ID], t, new Socket(s[VALUE])))
        break
    case 'param': // ID[id] TYPE[param] VALUE[index]
        deps.push(create(s[ID], t, params[s[VALUE]]))
        break
    case 'time':
    case 'date':
    case 'datetime': // ID[id] TYPE[date/datetime] VALUE[unixtime/time in string]
        deps.push(create(s[ID], t, new Date(s[VALUE])))
        break
    default:
        deps.push(create(s[ID], t, s[VALUE]))
        break
    }
    load(host, params, spec, idx, deps, cb, userData)
},
// need to get original spec, the one before spec.load, no way to diff ref and models
unload = function(rawSpec, spec){
    if (!spec || !spec.length) return
    var j,s
    for(var i=0,r; r=rawSpec[i]; i++){
        switch(r[TYPE]){
        case 'models':
        case 'stream':
            for(j=0; s=spec[j]; j++){
                if (r[ID] === s[ID]) {
                    switch(s[TYPE]){
                    case 'models': s[VALUE].reset(); break
                    case 'stream': s[VALUE].close(); break
                    }
                }
            }
            break
        }
    }
    for(j=0; s=spec[j]; j++){
        delete s[VALUE]
    }
    spec.length = 0
}

return {
    load:function(host, params, spec, cb, userData){
        if (!spec) return cb(null, [], userData)
        setTimeout(load,0,host, params, spec, 0, [], cb, userData)
    },
    unload:unload,
    findAllById: function(cond, list, all){ return findAll(cond, list, ID, all) },
    findAllByType:function(cond, list, all){ return findAll(cond, list, TYPE, all) },
    create:create,
    getId:getId,
    getType:getType,
    getValue:getValue,
    getExtra:getExtra
}
//# sourceURL=js/specMgr
})
pico.define('js/sigslot',function anonymous(exports,require,module,define,inherit,pico
/**/) {
"use strict";
var
picoObj=require('pico/obj'),
trigger = Backbone.Events.trigger,
evts=[],
sigslot = function(self, def){
    var
    ss = picoObj.extend(self.signals, def || [], {mergeArr:1}),
    signals = {}
    
    ss.forEach(function(evt){
        var sender = this
        signals[evt] = function(){
            return {
                args: Array.prototype.slice.call(arguments),
                sender: sender,
                evt: evt,
                queue: false,
                send: send,
                sendNow: dispatch
            }
        }
    }, self)

    self.on('all', recv, self)
        
    return signals
},      
send = function(a, from){
    this.queue=true
    evts.push([this, a, from||this.sender])
},      
recv = function(evt, from, params){
    var 
    func = this.slots[evt],
    forward = true 
                
    if (func) forward = func.apply(this, [from, params.sender].concat(params.args))
    if (forward) (params.queue?send:dispatch).call(params, [from], this)
},
dispatch = function(a, from){
    var isArr=a&&a.length
    if (!isArr && a) return trigger.call(a, this.evt, from, this)

    from=from||this.sender

    var
    host = from.host,
    modules = from.modules

    modules = host ? modules.concat([host]) : modules

    if (isArr){
        for(var i=0,m; m=modules[i]; i++) if (-1 === a.indexOf(m)) trigger.call(m, this.evt, from, this);
    }else{
        for(var i=0,m; m=modules[i]; i++) trigger.call(m, this.evt, from, this);
    }
}

this.update= function(){
    if (evts.length){
        var e=evts.shift()
        dispatch.call(e[0], e[1], e[2])
    }
}

return sigslot
//# sourceURL=js/sigslot
})
pico.define('js/Module',function anonymous(exports,require,module,define,inherit,pico
/**/) {
"use strict";
var ID=0,TYPE=1,VALUE=2,EXTRA=3,
REFS='refs',
specMgr = require('js/specMgr'),
sigslot= require('js/sigslot'),
dummyCB=function(){},
refs=function(id,spec,rawSpec){
    var
    ret={},
    i,s,t
    for(i=0; s=rawSpec[i]; i++){
        if(REFS===s[TYPE] && id===s[ID]){
            t=s[VALUE]
            break
        }
    }
    if (!t) return ret
    for(i=0; s=spec[i]; i++){
        if(t===s[TYPE]){ ret[s[EXTRA]||s[ID]]=s[VALUE] }
    }
    return ret
},
specLoaded = function(err, spec, userData){
    var
    self=userData[0],
    chains=userData[1]

    if (self._removed) return self.remove()
    if (err){
		__.dialogs.alert(err, 'Load Error')
        return console.warn(err)
    }

    self.spec = spec

    var
    d = {},
    deps = self.deps || {}

    for(var i=0,keys=Object.keys(deps),s,k,v; k=keys[i]; i++){
        v=deps[k]
        v=Array.isArray(v) ? v : [v]
        switch(v[0]){
        case REFS:
            d[k]=refs(k,spec,self._rawSpec)
            break
        default:
            s=specMgr.findAllById(k, spec)
            if (1 === s.length){ d[k]=s[0] }
            else if (!s.length){ d[k]=v[1] }
            else{ d[k] = s }
            break
        }
    }

    self.deps = d
    self.create(d,self.params)

    var h=self.host
    self.signals.moduleAdded().send(h)

    if (h){
        if (self._show && self.show) h.show(self, self._show[0], self._show[1])
        if (chains){
            var m=chains.shift()
            if (1===chains.length){
				chains.length=0
                if(m) m.call(h, null, self)
                return
            }
            h.spawn(m, self.params, chains[chains.length-1], !self._show, chains)
        }
    }
},
// dun remove mod here, mod may be removed
hideByIndex= function(self, i, host){
    host = host || self.el

    var oldEl = self._elements[i]

    if (oldEl && host.contains(oldEl)){
        host.removeChild(oldEl)
    }
    return oldEl
},
Module= {
    create: function(deps, params, hidden, cb){
        var
		el=this.el,
		spec = this.spec

		if(el){ // ctrl has no el
			if (deps.html) el.innerHTML=deps.html
			else for(var i=0,s; s=spec[i]; i++) if('html'===s[ID]){ el.innerHTML=s[VALUE]; break }
		}
        this.spawnAsync(spec, params, null, hidden, cb || dummyCB)
    },
    addSpec: function(rawSpec, cb){
        this._rawSpec=(this._rawSpec||[]).concat(rawSpec)
        specMgr.load(this.host, [], rawSpec, function(err, spec, self){
            if (err) return cb(err)
            self.spec=(self.spec||[]).concat(spec)
            cb(null, spec)
        }, this)
    },
    remove: function(){
        this._removed = true 
        this.off()
        this.stopListening()
        this.dumpAll()
        specMgr.unload(this._rawSpec, this.spec)
    },
    // ctrl can't spawn view
    spawn: function(Mod, params, spec, hidden, chains){
        if (!Mod || !Mod.spec) return

        var m = new (Ctrl.extend(Mod.Class))(
			Mod,
			spec && spec.length ? Mod.spec.concat(spec) : Mod.spec,
			params,
			this,
            !hidden,
			chains instanceof Function ? [chains, spec] : chains)

        this.modules.push(m)

        return m
    },
    spawnAsync: function(Mods, params, spec, hidden, cb){
        var list=[]
        for(var i=0,m; m=Mods[i]; i++){
            switch(m[TYPE]){
            case 'ctrl': 
            case 'view': list.push(m[VALUE]); break
            }
        }
        if (!list.length) {
			if (cb) cb()
			return
		}
        list.push(cb,spec)
        return this.spawn(list.shift(), params, spec, hidden, list)
    },
    dump: function(mod){
        if (!mod) return -1
        var i = this.modules.indexOf(mod)
        mod.remove()
        this.modules.splice(i, 1)
        return i
    },
    dumpAll:function(){
        var ms=this.modules
        while(ms.length){
            this.dump(ms[0])
        }
    },
    slots:{}
}

function Ctrl(prop, rawSpec, params, host, show, chains){
    this.name = prop.name
    this.host = host
    this.ancestor = Ctrl.prototype
    this.modules = []
    this.params = params
    this._rawSpec = rawSpec
    this._removed = false 
    this._show=show?[host.el,false]:null // view in chains migh need to show

    this.signals = sigslot(this, ['moduleAdded'])
    specMgr.load(host, params || [], rawSpec, specLoaded, [this,chains])
}

Ctrl.extend = Backbone.View.extend

_.extend(Ctrl.prototype, Backbone.Events, Module)

var View = Backbone.View.extend(_.extend(Module, {
    initialize: function(options, prop, spec, params, host, show, chains){
        this._elements = []
		this._el=options && options.el

        Ctrl.call(this, prop, spec, params, host, show, chains)

        this.ancestor = View.prototype
    },
    remove: function(){
        Ctrl.prototype.remove.call(this)
		// remove if not base on existing el
		if (!this._el) Backbone.View.prototype.remove.apply(this, arguments)
    },
    // view can spawn ctrl and view
    spawn: function(Mod, params, spec, hidden, chains){
        if (!Mod || !Mod.spec) return

        if ('ctrl'===Mod.type) return Ctrl.prototype.spawn.call(this, Mod, params, spec, hidden, chains)

        var s=spec && spec.length ? Mod.spec.concat(spec) : Mod.spec

        for(var i=0,o; o=s[i]; i++){ if ('options'===o[ID]) break }

        var m = new (View.extend(Mod.Class))(
			o?o[VALUE]:o,
			Mod,
			s,
			params,
			this,
			!hidden,
			chains instanceof Function ? [chains,spec]:chains)
        this.modules.push(m)
        return m
    },
    dump: function(mod){
        var i=Ctrl.prototype.dump.call(this,mod)
        if (i<0) return i
        hideByIndex(this, i)
        this._elements.splice(i, 1)
        return i
    },
    show: function(mod, container, first){
        if (!mod) return
        container = container || this.el
        mod._show=[container, first]

        if (!mod.spec) return mod.el

        var
        i = this.modules.indexOf(mod),
        oldEl = this._elements[i],
        el = mod.render()
        if (el){
            if (container.contains(oldEl)){
                container.replaceChild(el, oldEl)
            }else{
                if (first) container.insertBefore(el, container.firstChild)
                else container.appendChild(el)
            }
            this._elements[i] = el
            el.dataset.viewName=mod.name
			mod.rendered()
        }
        return el
    },
    hide: function(mod, host){
        mod._show=null
        return hideByIndex(this,this.modules.indexOf(mod),host)
    },
    render: function(){
        return this.el
    },
	rendered: function(){
	},
    slots:{
        // seldom use, useful only after BB's setElement
        invalidate: this.show
    }
}))

return {
    Ctrl:Ctrl,
    View:View
}
//# sourceURL=js/Module
})
pico.define('js/Router',function anonymous(exports,require,module,define,inherit,pico
/**/) {
"use strict";
var
trigger = {trigger:true},
triggerReplace = {trigger:true, replace:true},
context, dirList, lastIndex, index, currPath,
changeRoute = function(path){
    currPath = path
    lastIndex = index 
    if (path === dirList[index-1]){
        index = index-1
    }else{
        dirList.length = index+1
        dirList.push(path)
        index = dirList.length-1
    }
},
// keep this instance clean, any method name used in route might crashed with routes defined in config
Router= Backbone.Router.extend({
    initialize: function(paths){
        context = this
        dirList = []
        lastIndex = index = -1
        currPath=window.location.hash.substr(1)
        this.on('route', changeRoute)
        Router.add(paths)
    }
},{
    go: function(url, replace){
        window.setTimeout(function(){
            // BUG: android reverse the replace url
            // http://stackoverflow.com/questions/15193359/does-android-support-window-location-replace-or-any-equivalent
            context.navigate(url, trigger)//, replace ? triggerReplace : trigger)
        }, 0)
    },
    back: function(step){
        window.history.go(step || -1)
    },
    home: function(replace){ Router.go('', replace) },
    add: function(paths){
        for(var i=paths.length-1,p; p=paths[i]; i--){
            context.route(p, p)
        }
    },
    currPath: function(){ return currPath },
    isBack: function(){ return index < lastIndex }
})

return Router
//# sourceURL=js/Router
})
pico.define('js/Frame',function anonymous(exports,require,module,define,inherit,pico
/**/) {
"use strict";
var
DEPS=0,STYLE=1,SPEC=2,PAGES=3,FLYERS=4,
ID=0,TYPE=1,VALUE=2,EXTRA=3,
EVT_RESIZE='frameresize',
EVT_RESIZE_LEN=EVT_RESIZE.length,
Floor=Math.floor,Random=Math.random,
Router = require('js/Router'),
Module = require('js/Module'),
network = require('js/network'),
attachJS = function(deps, cb){
    if (!deps || !deps.length) return cb()
    __.attachFile(deps.shift(), 'js', function(){ attachJS(deps, cb) })
},
attachCSS = function(styles, cb){
    if (!styles || !styles.length) return cb()
    __.attachFile(styles.shift(), 'css', function(){ attachCSS(styles, cb) })
},
resized=function(self, paneCount){
    if (paneCount === self.deps.paneCount) return
    self.deps.paneCount=paneCount
    if (Backbone.History.started && self.currPath) changeRoute.call(self, self.currPath, self.currParams)
	self.signals.paneCount(paneCount).send()
},
changeRoute = function(path, params){
    var f = this.flyers[path]

    if (!f) {
        console.warn('path not found',path,params)
        return Router.home()
    }

    var
    pages=this.pages,
    pc=this.deps.paneCount || 1,
    i=f.length < pc ? 0 : f.length-pc

    for(var j=0,p; i<pc; i++,j++){
        p=f[i]
        if (p) this.signals.paneUpdate(j, path+'.'+p, pages[p], params).send()
        else this.signals.paneUpdate(j, '', pages[''], params).send()
    }

    this.signals.changeRoute(path, params).send()
    this.currPath=path
    this.currParams=params
},
netstat=function(self){
	window.addEventListener('online',function(){
		self.signals.online().send()
	})
	window.addEventListener('offline',function(){
		self.signals.offline().send()
	})
}

return Module.View.extend({
    el: 'body',
    signals:['online','offline','changeRoute','frameAdded','paneAdded','paneUpdate','paneCount'],
    deps:{
        html:   ['file','<div class=frame><div class=layer></div><div class=layer></div></div>'],
        layers: ['list', ['.frame>div:nth-child(1)','.frame>div:nth-child(2)']],
		paneCount:['int',1]
    },
    initialize: function(p, e){
        var self = this
        
        this.pages= p[PAGES]
        this.flyers= p[FLYERS]

        document.addEventListener('animationstart', function(e){
            console.log(e.animationName)
            if (-1 === e.animationName.indexOf(EVT_RESIZE)) return
            resized(self, parseInt(e.animationName.substr(EVT_RESIZE_LEN)))
        })

        network.create(e.domains, function(err){
            if (err) return console.error(err)

            var r = new Router(Object.keys(self.flyers))
            r.on('route', changeRoute, self)

            attachCSS(p[STYLE], function(){
                attachJS(p[DEPS], function(){
                    Module.View.prototype.initialize.call(self, null, {name:'Frame'}, 
						p[SPEC].concat([
							['env','map',e]
						]))
                })
            })
        })
    },

    create: function(deps, params){
        var self=this
		this.ancestor.create.call(this, deps, params, true, function(){
			var
			el=self.el,
			layers=deps.layers,
			list=[]

			for(var i=0,l; l=layers[i]; i++){
				list.push(el.querySelector(l))
			}
			self.layers=list

			self.signals.frameAdded().send()
		})
    },

    slots: {
        paneAdd: function(from, sender, paneId){
            this.signals.paneAdded(paneId).send()
        },
        layerShow: function(from, sender, where, first){
            if (!sender || -1 === this.modules.indexOf(sender)) return

            var c=this.layers[where]||this.layers[0]
            // force reflow for safari bug, which not show new content
            c.style.zIndex=(where||0)*(1000+Floor(100*Random()))
            this.show(sender, c, first)
        },
        layerHide: function(from, sender, where){
            if (!sender || -1 === this.modules.indexOf(sender)) return

            var c=this.layers[where||1]
            this.hide(sender, c)
        },
        frameResized:resized,
        modelReady: function(from, sender){
            if (!Backbone.History.started){
                Backbone.history.start()
				netstat(this)
                return true //  continue propagation
            }
            return false
        }
    }
})
//# sourceURL=js/Frame
})
pico.define('cfg/project.json','[[],["kiddytalk.css"],[["html","file","Frame.html"],["layers","list",[".frame"]],["contacts","models",{},[{"id":1,"name":"Bella Wa","tel":"123","img":"dat/img/dog.jpg","snd":"dat/snd/dog.wav"}]],["recents","models",{}],["auth/NoSession","ctrl",[]],["js/Pane","view",[["options","map",{"el":".frame"}],["paneId","int",0],["html","file","Pane.html"],["allmodels","refs","models"]]],["Header","view",[["options","map",{"el":".frame>#header"}],["paneId","int",0],["tpl","file","Header.asp"]]],["Page","view",[["options","map",{"el":".frame>#page"}],["paneId","int",0]]],["Footer","view",[["options","map",{"el":".frame>#footer"}],["paneId","int",0],["tpl","file","Footer.asp"],["list","list",[{"name":"Keypad","id":"keypad","icon":"keyboard","url":""},{"name":"Contacts","id":"contacts","icon":"address-book","url":"contacts"},{"name":"Recents","id":"recents","icon":"clock","url":"recents"}]]]]],{"keypad":[["options","map",{"el":".frame>#page"}],["contacts","ref","contacts"],[["Keypad","KeypadMixin"],"view",[["html","file","Keypad.html"],["contacts","ref","contacts"]]]],"recents":[["options","map",{"el":".frame>#page"}],["recents","ref","recents"],["contacts","ref","contacts"],["PageCtrl","ctrl",[["title","text","All Recents"]]],["scrollable/ListView","view",[["options","map",{"className":"scrollable"}],["list","ref","recents"],["contacts","ref","contacts"],["Cell","view",[["options","map",{"className":"row recent"}],["tpl","file","RowRecent.asp"],["contacts","ref","contacts"]],["Row","RowRecent"]]]]],"contacts":[["options","map",{"el":".frame>#page"}],["contacts","ref","contacts"],["PageCtrl","ctrl",[["title","text","All Contacts"]]],["scrollable/ListView","view",[["options","map",{"className":"scrollable"}],["list","ref","contacts"],["Cell","view",[["options","map",{"className":"row contact"}],["tpl","file","RowContact.asp"]],["Row","RowContact"]]]]],"callin":[["options","map",{"el":".frame>#page"}],["contacts","ref","contacts"],["recents","ref","recents"],["Call","view",[["tpl","file","Call.asp"],["maxDelay","int",0],["contact","model","contacts",0],["recents","ref","recents"],["Keypad","view",[["html","file","CallinKeypad.html"]],["Keypad","CallKeypadMixin"]]]]],"callout":[["options","map",{"el":".frame>#page"}],["contacts","ref","contacts"],["recents","ref","recents"],["Call","view",[["tpl","file","Call.asp"],["contact","model","contacts",0],["recents","ref","recents"],["Keypad","view",[["html","file","CalloutKeypad.html"]],["Keypad","CallKeypadMixin"]]]]]},{"recents":["recents"],"contacts":["contacts"],"callin/:contactId":["callin"],"callout/:contactId":["callout"],"*action":["keypad"]}]')
pico.define('cfg/env.json','{"domains":{}}')

var opt={variable:'d'}
pico.run({
    name: 'main',
    ajax: __.ajax,
    onLoad: __.onLoad,
    env:{
        live:false
    },
    preprocessors:{
        '.asp':function(url,txt){ return _.template(txt,opt) }
    },
    paths:{
        '*': 'mod/',
        root: './',
        cfg: 'cfg/',
        js: 'js/',
        json: 'json/'
    }
},function(){
    require('js/Module') //preload
    var
    Frame= require('js/Frame'),
    project = require('cfg/project.json'),
    env = require('cfg/env.json')

    this.load=function(){
        new Frame(project, env)
    }
})

pico.define('Frame.html','<svg class=hidden>\n<symbol id="icon-phone" viewBox="0 0 32 32">\n<path d="M22 20c-2 2-2 4-4 4s-4-2-6-4-4-4-4-6 2-2 4-4-4-8-6-8-6 6-6 6c0 4 4.109 12.109 8 16s12 8 16 8c0 0 6-4 6-6s-6-8-8-6z"/>\n</symbol>\n<symbol id="icon-phone-hang-up" viewBox="0 0 32 32">\n<path d="M31.793 18c0.25 1.734 0.413 4.106-0.364 5.014-1.286 1.501-9.428 1.501-9.428-1.501 0-1.512 1.339-2.504 0.053-4.006-1.265-1.477-3.532-1.501-6.054-1.501s-4.789 0.024-6.054 1.501c-1.286 1.501 0.054 2.493 0.054 4.006 0 3.003-8.143 3.003-9.429 1.501-0.777-0.908-0.615-3.28-0.364-5.014 0.193-1.157 0.679-2.406 2.236-4 0-0 0-0 0-0 2.336-2.179 5.87-3.961 13.432-3.999v-0.001c0.042 0 0.083 0 0.125 0s0.083-0 0.125-0v0.001c7.562 0.038 11.096 1.82 13.432 3.999 0 0 0 0 0 0 1.557 1.594 2.043 2.842 2.236 4z"/>\n</symbol>\n<symbol id="icon-address-book" viewBox="0 0 32 32">\n<path d="M6 0v32h24v-32h-24zM18 8.010c2.203 0 3.99 1.786 3.99 3.99s-1.786 3.99-3.99 3.99-3.99-1.786-3.99-3.99 1.786-3.99 3.99-3.99v0zM24 24h-12v-2c0-2.209 1.791-4 4-4v0h4c2.209 0 4 1.791 4 4v2z"/>\n<path d="M2 2h3v6h-3v-6z"/>\n<path d="M2 10h3v6h-3v-6z"/>\n<path d="M2 18h3v6h-3v-6z"/>\n<path d="M2 26h3v6h-3v-6z"/>\n</symbol>\n<symbol id="icon-clock" viewBox="0 0 32 32">\n<path d="M20.586 23.414l-6.586-6.586v-8.828h4v7.172l5.414 5.414zM16 0c-8.837 0-16 7.163-16 16s7.163 16 16 16 16-7.163 16-16-7.163-16-16-16zM16 28c-6.627 0-12-5.373-12-12s5.373-12 12-12c6.627 0 12 5.373 12 12s-5.373 12-12 12z"/>\n</symbol>\n<symbol id="icon-keyboard" viewBox="0 0 36 32">\n<path d="M34 4h-32c-1.1 0-2 0.9-2 2v20c0 1.1 0.9 2 2 2h32c1.1 0 2-0.9 2-2v-20c0-1.1-0.9-2-2-2zM20 8h4v4h-4v-4zM26 14v4h-4v-4h4zM14 8h4v4h-4v-4zM20 14v4h-4v-4h4zM8 8h4v4h-4v-4zM14 14v4h-4v-4h4zM4 8h2v4h-2v-4zM4 14h4v4h-4v-4zM6 24h-2v-4h2v4zM24 24h-16v-4h16v4zM32 24h-6v-4h6v4zM32 18h-4v-4h4v4zM32 12h-6v-4h6v4z"/>\n</symbol>\n</svg>\n<div class=frame></div>\n')
pico.define('auth/NoSession',function anonymous(exports,require,module,define,inherit,pico
/**/) {
"use strict";
return{
    signals: ['modelReady'],
    create: function(deps){
    },
    slots:{
        frameAdded:function(){
            this.signals.modelReady().send()
        }
    }
}
//# sourceURL=auth/NoSession
})
pico.define('js/Pane',function anonymous(exports,require,module,define,inherit,pico
/**/) {
"use strict";
var
ID=0,TYPE=1,VALUE=2,EXTRA=3,
Router = require('js/Router'),
specMgr= require('js/specMgr'),
removeOldPage=function(from, sender, paneId){
    if (paneId !== this.deps.paneId) return
    if (this.oldPage) this.dump(this.oldPage)
    this.oldPage = undefined
    var el=this.el
}

return {
    signals:['paneAdd','pageAdd','moduleAdded'],
    deps:{
        html:   ['file','<div class=layer></div><div class=layer></div>'],
        paneId: 'int'
    },
    create: function(deps, params){
        var self=this
		this.ancestor.create.call(this, deps, params, true, function(){
			self.signals.paneAdd(deps.paneId).send()
		})
    },

    slots: {
        paneUpdate: function(from, sender, paneId, name, pageConfig, params){
            if (this.deps.paneId !== paneId) return
            if (name === this.name && this.params && params && _.isEqual(this.params,params)) return
            this.name=name
            this.params=params
            if (this.oldPage) removeOldPage.call(this, null, null, paneId)
            this.oldPage = this.currPage
            this.currPage = this.spawn({
                name:(name || '')+'@'+paneId,
                spec:pageConfig,
                Class:{},
                }, params, null, true)

            this.el.style.cssText = ''
            this.signals.pageAdd(paneId, this.currPage.render(), Router.isBack()).send()
        },
        pageAdded:removeOldPage,
		moduleAdded:function(from, sender){
			if (-1===this.modules.indexOf(from)) return // not child
			this.signals.moduleAdded(this.deps.paneId).send(this.host) // repropagate with paneId
		}
    }
}
//# sourceURL=js/Pane
})
pico.define('Pane.html','<div id=header></div>\n<div id=page></div>\n<ul id=footer></ul>\n')
pico.define('Header',function anonymous(exports,require,module,define,inherit,pico
/**/) {
"use strict";
var
Router=require('js/Router'),
DUMMY_BTN={icon:'',url:''},
setBtn=function(ele, btn){
    if (!ele || !btn) return
    ele.setAttributeNS('http://www.w3.org/1999/xlink', 'href','#'+btn.icon)
    if(btn.url)ele.setAttributeNS('http://www.w3.org/1999/xlink', 'role',btn.url)
}   
    
return{
    signals:['menu','headerButtonClicked'],
    deps:{
        paneId:'int',
        tpl:'file'
    },
    create: function(deps){
        this.el.innerHTML=deps.tpl({title:''})
		this.title=this.el.querySelector('h1')
		this.btnLeft=this.el.querySelector('svg.icon.left use')
		this.btnRight=this.el.querySelector('svg.icon.right use')
		this.el.classList.add('hidden')
    },
    events: {
        'tap svg': function(e){
            var
            use='svg'===e.target.tagName?e.target.querySelector('use'):e.target,
            hash=use.getAttributeNS('http://www.w3.org/1999/xlink', 'href')
            if (!hash) return
            hash=hash.substr(6)
            switch(hash){
            case 'menu':
                this.signals.menu('left').sendNow(this.host)
                this.el.dispatchEvent(__.createEvent('transit', params[2])); break
                break
            case 'back':
                Router.back()
                break
            case 'search':
                break
            default:
                var url=use.getAttributeNS('http://www.w3.org/1999/xlink', 'role')
                if(url) Router.go(url)
                else this.signals.headerButtonClicked(hash).sendNow(this.host)
                break
            }
        } 
    },
    slots: {
        header: function(from, sender, title, left, right){
			if (!title) return this.el.classList.add('hidden')
            this.el.classList.remove('hidden')

            this.title.textContent=title
  
            setBtn(this.btnLeft,left||DUMMY_BTN)
            setBtn(this.btnRight,right||DUMMY_BTN)
        }
    }
}
//# sourceURL=Header
})
pico.define('Header.asp','<svg class="icon left"><use xlink:href="#" /></svg>\n<svg class="icon right"><use xlink:href="#" /></svg>\n<h1><%=d.title%></h1>\n')
pico.define('Page',function anonymous(exports,require,module,define,inherit,pico
/**/) {
"use strict";
return{
    signals:['pageAdded'],
    deps:{
        paneId:'int'
    },
    slots:{
        frameAdded: function(){},
        pageAdd: function(from, sender, paneId, page, isBack){
            if (this.deps.paneId !== paneId) return
            this.signals.pageAdded(paneId).sendNow(this.host)
        },
        moduleAdded: function(from, sender, paneId){
            if (this.deps.paneId !== paneId) return
            document.dispatchEvent(__.createEvent('__reset'))
        },
        pageTransit: function(from, sender, paneId, options){
            if (this.deps.paneId !== paneId) return
            this.el.dispatchEvent(__.createEvent('__transit', options))
        }
    }
}
//# sourceURL=Page
})
pico.define('Footer',function anonymous(exports,require,module,define,inherit,pico
/**/) {
"use strict";
var Router=require('js/Router')
return {
	signals:[],
    deps:{
        paneId:'int',
		tpl:'file',	
		list:'list'
    },
    create: function(deps){
        this.el.innerHTML=deps.tpl(deps.list)
    },
	slots:{
		pageAdd:function(from,sender){
			var arr=sender.name.split('.')
			if (!arr || arr.length < 2) return
			var
			id=arr[1],
			ul=this.el.querySelectorAll('li'),
			hide=true
			for(var i=0,li; li=ul[i]; i++){
				if(id===li.id){
					li.classList.add('selected')
					hide=false
				}else{
					li.classList.remove('selected')
				}
			}
			if (hide) this.el.classList.add('hidden')
			else this.el.classList.remove('hidden')
		}
	},

    events: {
		'tap li':function(e){
			var use='use'===e.target.tagName?e.target:e.target.querySelector('use')
			Router.go(use.getAttributeNS('http://www.w3.org/1999/xlink', 'role'))
        }
    }
}
//# sourceURL=Footer
})
pico.define('Footer.asp','<%for(var i=0,btn; btn=d[i]; i++){%>\n<li id="<%=btn.id%>">\n    <svg class="icon <%=btn.url?btn.url:""%>"><use xlink:href="#icon-<%=btn.icon%>" xlink:role="<%=btn.url%>"/></svg>\n	<span><%=btn.name%></span>\n</li>\n<%}%>\n')
pico.define('Keypad',function anonymous(exports,require,module,define,inherit,pico
/**/) {
"use strict";
return {
	className:'keypad',
	deps:{
		html:'file',
		keypadCtrl:'ctrl'
	},
	create:function(deps){
		this.el.innerHTML=deps.html
	},
	events:{
		'touchstart .btn':function(e){
			this.selectBtn(e.target).classList.add('down')
		},
		'touchend .btn':function(e){
			this.selectBtn(e.target).classList.remove('down')
		}
	},
	selectBtn:function(target){
		var btn=target
		while(btn && !btn.classList.contains('btn')){
			btn=btn.parentElement
		}
		return btn
	}
}
//# sourceURL=Keypad
})
pico.define('KeypadMixin',function anonymous(exports,require,module,define,inherit,pico
/**/) {
"use strict";
var Router=require('js/Router')

return {
	deps:{
		contacts:'models'
	},
	create:function(deps){
		var el=this.el
		el.innerHTML=deps.html
		this.display=el.querySelector('.display')
		this.value=[]
	},
	events:{
		'touchend .btn':function(e){
			var
			t=this.selectBtn(e.target),
			value=this.value,
			cl=t.classList

			cl.remove('down')

			if (cl.contains('plus')){
				if ('+'===value[0]) value.shift()
				else value.unshift('+')
			}else if (cl.contains('del')){
				value.pop()
			}else if (cl.contains('call')){
				Router.go('callout/1')
			}else{
				var span=t.querySelector('span')
				value.push(span.textContent)
			}

			this.display.textContent=value.join('')
		}
	}
}
//# sourceURL=KeypadMixin
})
pico.define('Keypad.html','<ul class=row><li class=display></li></ul>\n<ul class=row><li class=btn><span>1</span></li><li class=btn><span>2</span></li><li class=btn><span>3</span></li></ul>\n<ul class=row><li class=btn><span>4</span></li><li class=btn><span>5</span></li><li class=btn><span>6</span></li></ul>\n<ul class=row><li class=btn><span>7</span></li><li class=btn><span>8</span></li><li class=btn><span>9</span></li></ul>\n<ul class=row><li class="btn plus"><span>+</span></li><li class=btn><span>0</span></li><li class="btn del"><span>&lt;</span></li></ul>\n<ul class=row><li class="btn call"><svg class="icon"><use xlink:href="#icon-phone"/></svg></li></ul>\n')
pico.define('PageCtrl',function anonymous(exports,require,module,define,inherit,pico
/**/) {
"use strict";
return {
	signals:['header'],
	deps:{
		title:'text'
	},
	create:function(deps){
		this.signals.header(deps.title).sendNow(this.host)
	}
}
//# sourceURL=PageCtrl
})
pico.define('scrollable/ListView',function anonymous(exports,require,module,define,inherit,pico
/**/) {
"use strict";
var
Ceil=Math.ceil,
scrolls=[],
lastUpdate=Date.now(),
scrollTo=function(arr){
	var
	el=arr[0],
	to=arr[1],
	step=arr[2],
	oldFrom=el.scrollTop,
	newFrom=oldFrom+(step*this)

	arr[3]--

	if (!arr[3] || (oldFrom <= to && newFrom >= to)||(oldFrom >= to && newFrom <= to)){
		el.scrollTop=to
		return false
	}
	el.scrollTop=newFrom
	return true
},
removeExisting=function(arr){
	return (arr[0]===this) ? false : true
},
loadDependencies=function(model,coll){
    var self=this
    this.loadDependencies(coll,function(){
        addRow.call(self,model)
    })
},
addRow=function(model){
	if (this.filter(model.attributes)) this.spawn(this.deps.Cell, [model.id], [['data','model','list',0]])
}

this.update=function(){
	var
	now=Date.now(),
	d=now-lastUpdate

	lastUpdate=now
	if (!scrolls.length) return
	scrolls=scrolls.filter(scrollTo, d)
}

return{
    tagName:'ul',
	className:'scrollable',
	deps:{
		emptyMsg:['file','There are no items at this time'],
		list:'models',
		Cell:'view'
	},
	create: function(deps){
        var list=deps.list
		this.listenTo(list,'add',loadDependencies)
		this.listenTo(list,'reset',this.rendered)
	},
	remove:function(){
		scrolls.filter(removeExisting,this.el)
		this.ancestor.remove.call(this)
	},
	rendered:function(){
        this.dumpAll()

		var
        self=this,
		deps=this.deps,
		list=deps.list

        var li=document.createElement('li')
        li.classList.add('empty-message')
        li.innerHTML=deps.emptyMsg
        this.el.appendChild(li)

		this.loadDependencies(list,function(){
            list.each(addRow,self)
        })
	},
	slots:{
		scrollTo:function(from, sender, to, duration){
			var el=this.el
			scrolls=scrolls.filter(removeExisting,el)
			scrolls.push([el, to, (to-el.scrollTop)/duration,Ceil(duration/10)])
		}
	},
	events:{
	},
    loadDependencies:function(list, cb){
        cb()
    },
	filter:function(model){
		return true
	}
}
//# sourceURL=scrollable/ListView
})
pico.define('Row',function anonymous(exports,require,module,define,inherit,pico
/**/) {
"use strict";
var         
change=function(model){
	var self=this
	this.parseData(model.attributes, function(err, d){
		if (err) return console.error(err)
    	self.el.innerHTML=self.deps.tpl(d)
	})
}       
        
return{     
    tagName:'li',
    deps:{  
        data:'model',
        tpl:'file'
    },      
    create: function(deps){
		var data=deps.data
		change.call(this, data)
		this.listenTo(data,'change',change)
		this.listenTo(data,'destroy',this.remove)
    },      
    parseData:function(data,cb){
        cb(null,data)
    }           
}               
//# sourceURL=Row
})
pico.define('RowRecent',function anonymous(exports,require,module,define,inherit,pico
/**/) {
"use strict";
var
Router=require('js/Router'),
pTime=require('pico/time')

return {
	deps:{
		contacts:'models'
	},
	events:{
		'click':function(e){
			var c=this.deps.contacts.get(data.contactId)
			Router.go('callout/'+c.id)
		}
	},
	parseData:function(data,cb){
		var c=this.deps.contacts.get(data.contactId)
		return cb(null, {name:c.name, datetime:pTime.day(new Date(data.id))})	
	}
}
//# sourceURL=RowRecent
})
pico.define('RowRecent.asp','<p class="title"><%=d.name%></p>\n<span class="info"><%=d.recent%></span>\n')
pico.define('RowContact',function anonymous(exports,require,module,define,inherit,pico
/**/) {
"use strict";
var Router=require('js/Router')

return {
	events:{
		'click':function(e){
			Router.go('callout/'+this.deps.data.id)
		}
	}
}
//# sourceURL=RowContact
})
pico.define('RowContact.asp','<p class="title"><%=d.name%></p>\n<span class="info"><%=d.tel%></span>\n')
pico.define('Call',function anonymous(exports,require,module,define,inherit,pico
/**/) {
"use strict";
var
Rand=Math.random,Ceil=Math.ceil,
talk=function(self){
	self.el.querySelector('.profile').classList.add('invisible')
	self.el.style.backgroundImage='url('+self.deps.contact.get('img')+')'
	self.deps.contacts.get(self.recentId).state=0
},
connected=function(self){
	self.el.querySelector('.profile .state').textContent='connected'
	setTimeout(talk,1000,self)
}

return {
	className:'callscr',
	deps:{
		tpl:'file',
		maxDelay:['int',10000],
		contact:'model',
		recents:'models',
		Keypad:'view'
	},
	create:function(deps,params){
		var el=this.el
		el.innerHTML=deps.tpl(deps.contact.attributes)
		if (deps.maxDelay)setTimeout(connected,Ceil(deps.maxDelay*Rand()),this)
		this.spawn(deps.Keypad,params)
		this.recentId=Date.now()
		deps.recents.add({contactId:params[0],id:this.recentId,period:0,state:0})
	},
	slots:{
		callAccepted:function(){
			talk(this)
		}
	}
}
//# sourceURL=Call
})
pico.define('Call.asp','<ul class="profile">\n<li class=name><%=d.name%></li>\n<li class=state>calling...</li>\n<li class=picture style="background-image:url(<%=d.img%>)"></li>\n</ul>\n')
pico.define('CallKeypadMixin',function anonymous(exports,require,module,define,inherit,pico
/**/) {
"use strict";
var Router=require('js/Router')

return {
	signals:['callAccepted','header'],
	create:function(deps){
		this.el.innerHTML=deps.html
		this.signals.header().send(this.host)
	},
	events:{
		'touchend .btn':function(e){
			var btn=this.selectBtn(e.target)
			if (!btn) return
			var cl=btn.classList
			cl.remove('down')

			if (cl.contains('call')){
				cl.add('hidden')
				this.signals.callAccepted().send()
			}else{
				Router.go('keypad')
			}
		}
	}
}
//# sourceURL=CallKeypadMixin
})
pico.define('CallinKeypad.html','<ul class=row>\n<li class="btn call"><svg class="icon"><use xlink:href="#icon-phone"/></svg></li>\n<li class="btn endcall"><svg class="icon"><use xlink:href="#icon-phone-hang-up"/></svg></li>\n</ul>\n')
pico.define('CalloutKeypad.html','<ul class=row><li class="btn endcall"><svg class="icon"><use xlink:href="#icon-phone-hang-up"/></svg></li></ul>\n')
