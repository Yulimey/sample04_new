
function clearContent(id) {
    $("#" + id).val("");
    $("#" + id).focus();
}
function seePwd(pwdId,spanId){
    var domObj = document.getElementById(pwdId);
    var domObjStyle = document.getElementById(spanId);
    if(domObj.getAttribute("type")=="password"){
        domObj.setAttribute("type","text");
        domObjStyle.setAttribute("class","iconfont icon_yy_b");
    }else if(domObj.getAttribute("type")=="text"){
        domObj.setAttribute("type","password");
        domObjStyle.setAttribute("class","iconfont icon_yy");
    }
}
function pwdFocus(id){
    $("#"+id).show();
}
function goTo(url){
	
	if(url.indexOf("?")!=-1){
		window.location.href=url+"&t="+Math.random();
	}else{
		window.location.href=url+"?t="+Math.random();
	}
    
}

(function ($) {
	'use strict';
	$.fn.ifsVertifyCode = function(){
		var element = this;
		element.attr("src", routers[setting.imageChannel] + "?d=" + new Date().getTime());
	}
})($);
//数据字典
$.fn.ifsSelect = function(code){
    var codes = [];
    this.each(function(){
        var t = $(this);
        var c = code || t.attr("ifs-select-code");
        if (!c) {
            throw "datadic code not define";
        }
        codes.push(c);
    });
    if (codes.length > 0) {
        return initSelect(codes.join(","), this);
    }
    return {};
}


function convert2tree(citys){
    var arr = citys.list || [];
    var map = {};
    for (var i = 0; i < arr.length; i++) {
        var city = arr[i];
        map[city.i] = city;
        city.children = [];
        
    };
    var roots = [];
    for (var i = 0; i < arr.length; i++) {
        var city = arr[i];
        var id = city.i;
        var pid = city.p;
        if (map[pid] && id != pid) {
            map[pid].children.push(city);
        }
        else {
            roots.push(city);
        }
    };
    return [roots, map];
}

function getCookie(){
    
    var result = {};
    $("<div>").IFSAjax({
        code: setting.getCookie,
        data: null,
        async: true
    });
    return result;
}

function updateOptionCascade(target, treedata, map){
    updateOption(treedata || [], target, map);
    var next = target.attr("ifs-select-cascade");
    while (next) {
        var jnext = $(next);
        updateOption([], jnext, map);
        next = jnext.attr("ifs-select-cascade");
    }
}
function bindOptionCascadeEvent(target, treemap, map){
    var srcs = [];
    var next = target;
    do {
        var nextSel = next.attr("ifs-select-cascade") || "";
        if (nextSel) {
            next.unbind("change.ifs").bind("change.ifs", function(){
                var t = $(this);
                var nxt = t.attr("ifs-select-cascade");
                if (nxt) {
                    var data = treemap[this.value];
                    //updateOption(data ? data.children : [], $(nxt), map);
                    updateOptionCascade($(nxt), data ? data.children : [], map);
                }
                
            });
            
        }
        next = $(nextSel);
    }
    while (next[0]);
    return target;
}
function initCascadeSelect(target, callback){
    $("<div>").IFSAjax({
        code: setting.ALLAREA,
        data: '{"flag":1}',
        async: !!callback,
        complete: function(json, error){
            if (!error) {
                var data = json.body;
                var tmp = convert2tree(data);
                var map = {
                    key: "i",
                    text: "n"
                }
                updateOptionCascade(target, tmp[0], map);
                bindOptionCascadeEvent(target, tmp[1], map);
				callback && callback();
            }
        }
    });
}
$.fn.initCitySelect = function(callback){
    return this.each(function(){
        initCascadeSelect($(this), callback);
    });
}

function updateOption(data, target, map){
    if (!target[0]) 
        return;
    map = $.extend({
        key: "dataNo",
        text: "dataName",
		required : target.prop("required")
    }, map || {});
    var selected = map.selected || target.attr("ifs-select-value");
    var selectCode=target.attr("ifs-select-code");
    var options ="";
    if(selectCode=='XW000001'){
    	options=!map.required ? "<option value=''>请选择户籍归属</option>" : "";
    }else if(selectCode=='IP000017'){
    	options=!map.required ? "<option value=''>请选择婚姻状况</option>" : "";
    }else if(selectCode=='XW000002'){
    	options=!map.required ? "<option value=''>请选择子女状况</option>" : "";
    }else if(selectCode=='IP000018'){
    	options=!map.required ? "<option value=''>请选择住房情况</option>" : "";
    }else if(selectCode=='IP000028'){
    	options=!map.required ? "<option value=''>请选择教育情况</option>" : "";
    }else if(selectCode=='IP000024'){
    	options=!map.required ? "<option value=''>请选择行业信息</option>" : "";
    }else if(selectCode=='XW000010'){
    	options=!map.required ? "<option value=''>请选择雇员人数</option>" : "";
    }else if(selectCode=='XW000062'){
    	options=!map.required ? "<option value=''>请选择每月还款日期</option>" : "";
    }else if(selectCode=='XW000003'){
    	
    }else{
    	options=!map.required ? "<option value=''>请选择...</option>" : "";
    }
    
    if (data) {
        for (var i = 0; i < data.length; i++) {
            var d = data[i];
            options += '<option style="text-align:left;" value="' + d[map.key] + '" ' +
            (selected === d[map.key] ? 'selected' : '') +
            '>' +
            d[map.text] +
            '</option>';
        };
                }
    target.html(options);
}

function initSelect(codes, targets){

    var result = {};
    $("<div>").IFSAjax({
        code: setting.DATADIC,
        data: {
            dataTypeNo: codes
        },
        async: false,
        complete: function(json, error){
            if (!error) {
                var data = json.body;
                result = data.dicMap;
                for (var key in result) {
                    updateOption(result[key], targets.filter("[ifs-select-code='" + key + "']"));
                }
            }
        }
    });
    return result;
}
//使用身份证判断性别
function sexEscapeByIDCard(idCard){
	if(idCard.length==18){
		var str=idCard.substr(idCard.length-2,1);
		if(str%2==1){
			return "1";
		}else if(str%2==0){
			return "2";
		}
	}else{
		return "x";
	}
	
}

/**
 * 等待timeout秒后重试
 */
$.fn.ifsWaitingButton = function(timeout){
    return this.each(function(){
        initWaitingButton($(this), timeout);
    });
};
var w_text = "w_text";
var w_wait = "w_wait";
function initWaitingButton(target, timeout){
    function updateText(timeout){
        if (timeout == 0) {
            target.prop("disabled", false);
            target.text(target.data(w_text));
        }
        else {
            target.prop("disabled", true);
            target.text(timeout + "秒后重试");
            var h = setTimeout(function(){
                updateText(timeout - 1)
            }, 1000);
            target.data(w_wait, h);
        }
    }
    if (!target.data(w_text)) {
        target.data(w_text, target.text());
    }
    if (target.data(w_wait)) {
        clearTimeout(target.data(w_wait));
    }
    updateText(timeout || 90);
}

function resetWaitingButton(target){
	if (target.data(w_wait)) {
        clearTimeout(target.data(w_wait));
        target.prop("disabled", false);
        target.text(target.data(w_text));
    }
}

/** *************************** 精确计算 *******************************************/
//JS 精确计算 乘法
	function FloatMul(arg1,arg2){    
	  var m=0,s1=arg1.toString(),s2=arg2.toString();    
	  try{m+=s1.split(".")[1].length}catch(e){}    
	  try{m+=s2.split(".")[1].length}catch(e){}    
	  return Number(s1.replace(".",""))*Number(s2.replace(".",""))/Math.pow(10,m);   
}    
	//JS 精确计算 除法
	function FloatDiv(arg1,arg2){    
	  var t1=0,t2=0,r1,r2;    
  try{t1=arg1.toString().split(".")[1].length}catch(e){}    
  try{t2=arg2.toString().split(".")[1].length}catch(e){}    
	   with(Math){    
	      r1=Number(arg1.toString().replace(".",""));    
	      r2=Number(arg2.toString().replace(".",""));    
	      return (r1/r2)*pow(10,t2-t1);    
	   }    
	}
	//JS 精确计算 加法
	function FloatAdd(arg1,arg2){   
	 var r1,r2,m;   
	 try{r1=arg1.toString().split(".")[1].length}catch(e){r1=0}   
	 try{r2=arg2.toString().split(".")[1].length}catch(e){r2=0}   
	 m=Math.pow(10,Math.max(r1,r2));   
	 return (arg1*m+arg2*m)/m;   
}   
//JS 精确计算 减法   
function FloatSub(arg1,arg2){   
	 var r1,r2,m,n;   
	 try{r1=arg1.toString().split(".")[1].length}catch(e){r1=0}   
	 try{r2=arg2.toString().split(".")[1].length}catch(e){r2=0}   
	 m=Math.pow(10,Math.max(r1,r2));   
	 //动态控制精度长度   
	 n=(r1>=r2)?r1:r2;   
	 return ((arg1*m-arg2*m)/m).toFixed(n);   
} 
		
	//四舍五入
	function JSRound(fNum,fBit,n){
	 var i = 1;
	 var m = 1;
	 var tempNum = fNum;
	 for(i=1;i <= fBit;i++)
	  m = m * 10;
	 tempNum = tempNum * m;
	 tempNum = Math.round(tempNum);
	 tempNum = tempNum / m;
	 return tempNum.toFixed(n);
	}

	
	//自适应高度 开始 

	function getIosRealHeight(array){
			var totalH=0;
			$.each(array, function(k,y) {    
				var o=$(y);
				var pt=0;
				if((o.css('padding-top')+'').indexOf('px')!=-1){
					pt=parseInt((o.css('padding-top')+'').replace('px',''));
				}
				var pb=0;
				if((o.css('padding-bottom')+'').indexOf('px')!=-1){
					pb=parseInt((o.css('padding-bottom')+'').replace('px',''));
				}
				var mt=0;
				if((o.css('margin-top')+'').indexOf('px')!=-1){
					mt=parseInt((o.css('margin-top')+'').replace('px',''));
				}
				var mb=0;
				if((o.css('margin-bottom')+'').indexOf('px')!=-1){
					mb=parseInt((o.css('margin-bottom')+'').replace('px',''));
				}
				
				totalH=totalH+parseInt(o.height())+pt+pb+mt+mb;
			});
			return totalH;
	}

	function initIosPageHeight(){
		if($(".content")[0]){
			var content=$(".content").eq(0);
			var win_h=$(window).height();
			var doc_h=getIosRealHeight(content.children());
			if(doc_h<win_h){
				content.css({height:win_h+"px"});
			}else{
				content.css({height:""});
			}
		}
	}
	
	
	
	//android
	function getAndRealHeight(array){
			var totalH=0;
			$.each(array, function(k,y) {    
				var o=$(y);
				var pt=0;
				if((o.css('padding-top')+'').indexOf('px')!=-1){
					pt=parseInt((o.css('padding-top')+'').replace('px',''));
				}
				var pb=0;
				if((o.css('padding-bottom')+'').indexOf('px')!=-1){
					pb=parseInt((o.css('padding-bottom')+'').replace('px',''));
				}
				var mt=0;
				if((o.css('margin-top')+'').indexOf('px')!=-1){
					mt=parseInt((o.css('margin-top')+'').replace('px',''));
				}
				var mb=0;
				if((o.css('margin-bottom')+'').indexOf('px')!=-1){
					mb=parseInt((o.css('margin-bottom')+'').replace('px',''));
				}
				
				totalH=totalH+parseInt(o.height())+pt+pb+mt+mb;
			});
			return totalH;
	}

	function initAndPageHeight(){
		if($(".content")[0]){
			var content=$(".content").eq(0);
			var win_h=$(window).height();
			var doc_h=getAndRealHeight(content.children());
			if(doc_h<win_h){
				content.css({height:win_h+"px"});
			}else{
				content.css({height:doc_h+"px"});
			}
		}
	}
	
	
	


	//自适应高度 结束 

$(function(){
	$(".table-view>.table-view-cell").on('focusin','input',function(){
		var er=$(this).parent().parent().find(".icon_yy");
		if(er.length > 1)
			er = $(this).parent().find(".icon_yy");
		var val=$(this).val();
		if(val){
			er.fadeIn();
		}	
	});
	$(".table-view>.table-view-cell").on('focusout','input',function(){
		var er=$(this).parent().parent().find(".icon_yy");
		if(er.length > 1)
			er = $(this).parent().find(".icon_yy");
		if(!$(this).val())
		er.fadeOut();
		
	});
	
	$(".table-view>.table-view-cell").on('keyup change','input',function(){
		var er=$(this).parent().parent().find(".icon_yy");
		if(er.length > 1)
			er = $(this).parent().find(".icon_yy");
		var val=$(this).val();
		if(val){
			er.fadeIn();
		}else{
			er.fadeOut();
		}	
	});
	
	$(".table-view>.table-view-cell").on('click','.icon_yy',function(){
		$(this).parent().find('input').val('');
		$(this).fadeOut();
		$(this).parent().find('input').focus();
	});
	
	 if(browser.versions.mobile && browser.versions.webKit){
        if(browser_version.android){
        	initAndPageHeight();
        }else if(browser.versions.iPhone && browser.versions.ios){
        	initIosPageHeight();
        }else{
        	initIosPageHeight();
        }
    }else{
    	initIosPageHeight();
    }
});
function errorTip(data){
    if(data.head._rm instanceof Array){
        _showMsg(data.head._rm[0].msg,null);
    }else{
        _showMsg(data.head._rm,null);
    }
}

function msg_encrypt(word){
    
    var key = CryptoJS.enc.Utf8.parse(setting.KEY);
    var iv = CryptoJS.enc.Utf8.parse(setting.IV);
     var words = CryptoJS.enc.Utf8.parse(word);
     var encrypted = CryptoJS.AES.encrypt(words, key, {
         iv: iv,
         mode: CryptoJS.mode.CBC
     });
     var encryptedStr = encrypted.ciphertext.toString();
     var encryptedHexStr = CryptoJS.enc.Hex.parse(encryptedStr);
     
     var encryptedBase64Str = base64encode(encryptedHexStr.toString());
     return encryptedBase64Str.toString();
}

function msg_md5(word){
    var srcs = CryptoJS.enc.Utf8.parse(word);
    var hash = CryptoJS.MD5(srcs);
    return hash;
}


function formatMoney(obj, n, length){
    var maxM = "";
    var maxR = "";
    for (var i = 0; i < length; i++) {
        maxM += "9";
    }
    for (var i = 0; i < n; i++) {
        maxR += "9";
    }
    maxM = maxM + "." + maxR;
    if (obj == null || obj == "" || obj == undefined || obj == 'undefined' ||
    obj == 'null') {
        return fmoney2(0, n);
    }
    else {
        obj = obj + "";
        obj = obj.replace(/([^0-9.])+/g, "");
        obj = obj.replace(/([^0-9])+/, ".");
        if (obj == "" || obj == ".") 
            return fmoney2(0, n);
        else {
            var money = parseFloat(obj);
            if (money <= parseFloat(maxM)) 
                return fmoney2(money, n);
            else 
                return fmoney2(maxM, n);
        }
    }
}

function fmoney2(s, n){
    n = n >= 0 && n <= 20 ? n : 2;
    s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";
    var l = s.split(".")[0].split("").reverse();
    var t = "";
    if (n > 0) {
        var r = s.split(".")[1];
        for (var i = 0; i < l.length; i++) {
            t += l[i] +
            ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");
        }
        return t.split("").reverse().join("") + "." + r;
    }
    else {
        for (var i = 0; i < l.length; i++) {
            t += l[i] +
            ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");
        }
        return t.split("").reverse().join("");
    }
}

function startApplyWizard(appno) {
	var form = document.createElement("FORM");
	form.method = "post";
	form.action = PATHSET.WEBPATH + "/sec/gotoapply";
	form.insertAdjacentHTML("beforeEnd", '<input type="hidden" name="appNo" value="'+(appno||'')+'">');
	document.body.appendChild(form);
	form.submit();
	document.body.removeChild(form);
}
function nextApplyStep(custNm,mobTel,encryptMobTel,bsnessTyp, n, m) {
	var form = document.createElement("FORM");
	form.method = "post";
	form.action = PATHSET.WEBPATH+"/sec/lnappl";//(appno ? "gotoapply":"lnappl");
	var l = getUrlParam("l") || "";
	form.insertAdjacentHTML("beforeEnd", '<input type="hidden" name="custNm" value="'+(custNm||'')+'">');
	form.insertAdjacentHTML("beforeEnd", '<input type="hidden" name="mobTel" value="'+(mobTel||'')+'">');
	form.insertAdjacentHTML("beforeEnd", '<input type="hidden" name="encryptMobTel" value="'+(encryptMobTel||'')+'">');
	form.insertAdjacentHTML("beforeEnd", '<input type="hidden" name="bsnessTyp" value="'+(bsnessTyp||'')+'">');
	form.insertAdjacentHTML("beforeEnd", '<input type="hidden" name="l" value="'+l+'">');
	form.insertAdjacentHTML("beforeEnd", '<input type="hidden" name="n" value="'+(n||'next')+'">');
	document.body.appendChild(form);
	form.submit();
	document.body.removeChild(form);
}


//贷款申请wizard
function startLoanApplyWizard(appno) {
	var form = document.createElement("FORM");
	form.method = "post";
	form.action = PATHSET.WEBPATH + "/sec/gotoLoanApply";
	form.insertAdjacentHTML("beforeEnd", '<input type="hidden" name="appNo" value="'+(appno||'')+'">');
	document.body.appendChild(form);
	form.submit();
	document.body.removeChild(form);
}


function nextLoanApplyStep(appno, n) {
	var form = document.createElement("FORM");
	form.method = "post";
	form.action = PATHSET.WEBPATH+"/sec/loanApply";//(appno ? "gotoapply":"lnappl");
	var l = getUrlParam("l") || "";
	form.insertAdjacentHTML("beforeEnd", '<input type="hidden" name="appNo" value="'+(appno||'')+'">');
	form.insertAdjacentHTML("beforeEnd", '<input type="hidden" name="l" value="'+l+'">');
	form.insertAdjacentHTML("beforeEnd", '<input type="hidden" name="n" value="'+(n||'next')+'">');
	document.body.appendChild(form);
	form.submit();
	document.body.removeChild(form);
}

function getUrlParam(argName){
    var args = location.href.split("?");
    var retval = "";
    var str = decodeURI(args[1]);
    if (str) {
        var _args = str.split("#")[0];
        args = _args.split("&");
        for (var i = 0; i < args.length; i++) {
            _args = args[i];
            var arg = _args.split("=");
            if (arg.length <= 1) 
                continue;
            if (arg[0] == argName) 
                retval = arg[1];
        }
    }
    return retval;
}


function nextChangePhoneStep(oldMobTel, n, m) {
	var form = document.createElement("FORM");
	form.method = "post";
	form.action = PATHSET.WEBPATH+"/sec/chphone";//(appno ? "gotoapply":"lnappl");
	var l = getUrlParam("l") || "";
	form.insertAdjacentHTML("beforeEnd", '<input type="hidden" name="oldMobTel" value="'+(oldMobTel||'')+'">');
	form.insertAdjacentHTML("beforeEnd", '<input type="hidden" name="l" value="'+l+'">');
	form.insertAdjacentHTML("beforeEnd", '<input type="hidden" name="n" value="'+(n||'next')+'">');
	document.body.appendChild(form);
	form.submit();
	document.body.removeChild(form);
}



function nextRegisterStep(custNm,idNo,mobTel, n, m) {
	var form = document.createElement("FORM");
	form.method = "post";
	form.action = PATHSET.WEBPATH+"/sec/register";//(appno ? "gotoapply":"lnappl");
	var l = getUrlParam("l") || "";
	form.insertAdjacentHTML("beforeEnd", '<input type="hidden" name="mobTel" value="'+(mobTel||'')+'">');
	form.insertAdjacentHTML("beforeEnd", '<input type="hidden" name="custNm" value="'+(custNm||'')+'">');
	form.insertAdjacentHTML("beforeEnd", '<input type="hidden" name="idNo" value="'+(idNo||'')+'">');
	form.insertAdjacentHTML("beforeEnd", '<input type="hidden" name="l" value="'+l+'">');
	form.insertAdjacentHTML("beforeEnd", '<input type="hidden" name="n" value="'+(n||'next')+'">');
	document.body.appendChild(form);
	form.submit();
	document.body.removeChild(form);
}