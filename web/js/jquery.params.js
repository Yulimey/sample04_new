﻿new function(a){var b=a.separator||"&",c=a.spaces===!1?!1:!0;a.suffix===!1?"":"[]";var e=a.prefix===!1?!1:!0,f=e?a.hash===!0?"#":"?":"",g=a.numbers===!1?!1:!0;jQuery.query=new function(){var a=function(a,b){return void 0!=a&&null!==a&&(b?a.constructor==b:!0)},d=function(a){for(var b,c=/\[([^[]*)\]/g,d=/^([^[]+)(\[.*\])?$/.exec(a),e=d[1],f=[];b=c.exec(d[2]);)f.push(b[1]);return[e,f]},e=function(b,c,d){var g=c.shift();if("object"!=typeof b&&(b=null),""===g)if(b||(b=[]),a(b,Array))b.push(0==c.length?d:e(null,c.slice(0),d));else if(a(b,Object)){for(var h=0;null!=b[h++];);b[--h]=0==c.length?d:e(b[h],c.slice(0),d)}else b=[],b.push(0==c.length?d:e(null,c.slice(0),d));else if(g&&g.match(/^\s*[0-9]+\s*$/)){var i=parseInt(g,10);b||(b=[]),b[i]=0==c.length?d:e(b[i],c.slice(0),d)}else{if(!g)return d;var i=g.replace(/^\s*|\s*$/g,"");if(b||(b={}),a(b,Array)){for(var j={},h=0;h<b.length;++h)j[h]=b[h];b=j}b[i]=0==c.length?d:e(b[i],c.slice(0),d)}return b},h=function(a){var b=this;return b.keys={},a.queryObject?jQuery.each(a.get(),function(a,c){b.SET(a,c)}):jQuery.each(arguments,function(){var a=""+this;a=a.replace(/^[?#]/,""),a=a.replace(/[;&]$/,""),c&&(a=a.replace(/[+]/g," ")),jQuery.each(a.split(/[&;]/),function(){var a=decodeURIComponent(this.split("=")[0]||""),c=decodeURIComponent(this.split("=")[1]||"");a&&(g&&(/^[+-]?[0-9]+\.[0-9]*$/.test(c)?c=parseFloat(c):/^[+-]?[0-9]+$/.test(c)&&(c=parseInt(c,10))),c=c||0===c?c:!0,c!==!1&&c!==!0&&"number"!=typeof c&&(c=c),b.SET(a,c))})}),b};return h.prototype={queryObject:!0,has:function(b,c){var d=this.get(b);return a(d,c)},GET:function(b){if(!a(b))return this.keys;for(var c=d(b),e=c[0],f=c[1],g=this.keys[e];null!=g&&0!=f.length;)g=g[f.shift()];return"number"==typeof g?g:g||""},get:function(b){var c=this.GET(b);return a(c,Object)?jQuery.extend(!0,{},c):a(c,Array)?c.slice(0):c},SET:function(b,c){var f=a(c)?c:null,g=d(b),h=g[0],i=g[1],j=this.keys[h];return this.keys[h]=e(j,i.slice(0),f),this},set:function(a,b){return this.copy().SET(a,b)},REMOVE:function(a){return this.SET(a,null).COMPACT()},remove:function(a){return this.copy().REMOVE(a)},EMPTY:function(){var a=this;return jQuery.each(a.keys,function(b){delete a.keys[b]}),a},load:function(a){var b=a.replace(/^.*?[#](.+?)(?:\?.+)?$/,"$1"),c=a.replace(/^.*?[?](.+?)(?:#.+)?$/,"$1");return new h(a.length==c.length?"":c,a.length==b.length?"":b)},empty:function(){return this.copy().EMPTY()},copy:function(){return new h(this)},COMPACT:function(){function b(c){function e(b,c,d){a(b,Array)?b.push(d):b[c]=d}var d="object"==typeof c?a(c,Array)?[]:{}:c;return"object"==typeof c&&jQuery.each(c,function(c,f){return a(f)?(e(d,c,b(f)),void 0):!0}),d}return this.keys=b(this.keys),this},compact:function(){return this.copy().COMPACT()},toString:function(){var e=[],g=[],i=function(a){return a+="",c&&(a=a.replace(/ /g,"+")),encodeURIComponent(a)},j=function(b,c,d){if(a(d)&&d!==!1){var e=[i(c)];d!==!0&&(e.push("="),e.push(i(d))),b.push(e.join(""))}},k=function(a,b){var c=function(a){return b&&""!=b?[b,"[",a,"]"].join(""):[a].join("")};jQuery.each(a,function(a,b){"object"==typeof b?k(b,c(a)):j(g,c(a),b)})};return k(this.keys),g.length>0&&e.push(f),e.push(g.join(b)),e.join("")}},new h(location.search,location.hash)}}(jQuery.query||{});