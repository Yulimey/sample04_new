!(function($){var IFSAjax={options:{method:setting.sumbitMethod,data:"",url:"",token:false,load:false,async:true,download:false,lock:"",transcode:"",channel:"",envelopDom:"",timeout:60000},targetForm:null,event:null,init:function(){$("a[ifs-code]:not([ifs-bind])").each(function(){var link=$(this);IFSAjax.setBind(link);link.on("click",function(){$(this).IFSAjax()})});$("select[ifs-code]:not([ifs-bind])").each(function(){var select=$(this);IFSAjax.setBind(select);select.on("change",function(){$(this).IFSAjax()})});$("button[ifs-code]:not([ifs-bind])").each(function(){var button=$(this);IFSAjax.setBind(button);button.on("click",function(e){if($(this).attr("type")=="submit"){IFSAjax.event=e;IFSAjax.targetForm=button.parents("form")}$(this).IFSAjax()})});$("div[ifs-code]:not([ifs-bind])").each(function(){var div=$(this);IFSAjax.setBind(div);div.on("click",function(){$(this).IFSAjax()})});$("span[ifs-code]:not([ifs-bind])").each(function(){var span=$(this);IFSAjax.setBind(span);span.on("click",function(){$(this).IFSAjax()})});$("li[ifs-code]:not([ifs-bind])").each(function(){var li=$(this);IFSAjax.setBind(li);li.on("click",function(){$(this).IFSAjax()})});$("p[ifs-code]:not([ifs-bind])").each(function(){var p=$(this);IFSAjax.setBind(p);p.on("click",function(){$(this).IFSAjax()})})},setBind:function($obj){$obj.attr("ifs-bind",1)},setOptions:function(element,option){var $this=$(element);if("undefined"==option||null==option){var options=$.extend({},IFSAjax.options,{code:$this.attr("ifs-code")==undefined?"":$this.attr("ifs-code"),method:$this.attr("ifs-method"),complete:$this.attr("ifs-complete")==undefined?"":eval($this.attr("ifs-complete")),show:$this.attr("ifs-show")==undefined?"":$this.attr("ifs-show"),view:$this.attr("ifs-show")==undefined?"":$this.attr("ifs-view"),timeout:$this.attr("ifs-timeout"),interval:$this.attr("ifs-interval")==undefined?"":$this.attr("ifs-interval"),download:Boolean($this.attr("ifs-download")),envelopDom:($this.attr("ifs-data")!=undefined&&$this.attr("ifs-data").indexOf("#")==0)?$this.attr("ifs-data"):"",data:($this.attr("ifs-data")!=undefined&&$this.attr("ifs-data").indexOf("#")==-1)?eval($this.attr("ifs-data")):"",token:Boolean($this.attr("ifs-token")),load:Boolean($this.attr("ifs-load"))});$(element).data("options",options)}else{$(element).data("options",$.extend({},IFSAjax.options,option))}},ajaxSend:function(options){var data=options.data;var mh="";if(options.data){if(typeof options.data=="object"){options.data=$.toJSON(options.data)}var hexStr=CryptoJS.enc.Utf8.parse(options.data);mh=msg_md5(hexStr.toString().toUpperCase());var txn=options.channel+"_"+options.transcode;var index=setting.ENCLIST.indexOf(txn,0);if(index>=0){options.data=msg_encrypt(options.data.toString())}}else{options.data="{}"}$.ajax({type:options.method,url:options.url,dataType:"json",data:options.data,timeout:options.timeout,cache:false,async:options.async,contentType:"application/json; charset=UTF-8",beforeSend:function(XMLHttpRequest){var vc=$("#_vc").val();if(vc==null||vc==undefined){vc=""}addHttpHeader(options.transcode,options.channel,XMLHttpRequest,options.token,vc,mh);if(options.load){showLoadingDialog("加载中...")}if(options.lock!=""&&options.lock!=null){$("#"+options.lock).attr("disabled","disabled").attr("class","btn-primary btn-block transButton fontcenter")}},error:function(XMLHttpRequest,status,thrownError){if(!IFSAjax.callErrorBackFunction(options,XMLHttpRequest,status,thrownError)){return}},success:function(msg){if(msg!=undefined&&setting.CHECKTOKEN.indexOf(options.transcode)>-1){_RANDOM_TOKEN=msg.head?msg.head._token:""}if(!IFSAjax.callBackFunction(options,msg)){return}}})},ajaxClick:function(element){var enctype=false;var files;var options=$(element).data("options");options.method=options.method.toUpperCase();if((undefined==options.code)||(""==options.code)){showAlert("没有交易码和渠道码,无法提交");return}if(options.code.split("_").length<1||options.code.split("_").length>2){showAlert("交易码格式不正确,无法提交");return}var tmp=options.code.split("_");if(tmp.length==1){options.transcode=tmp[0]}else{options.channel=tmp[0];options.transcode=tmp[1]}if(this.event!=null){this.event.preventDefault();this.event=null}if(this.targetForm!=null){if(this.targetForm.attr("enctype")!=null&&this.targetForm.attr("enctype")!=undefined){enctype=true;files=this.targetForm.find("input[type='file'][ifs-muti='false']")}var param=IFSAjax.targetForm.getJson();options.data=param;IFSAjax.targetForm=null}if(options.envelopDom!=""){options.data=$(options.envelopDom).getJsonData()}options.url=router.match(options.code);if(options.url==null){showAlert("交易码没有匹配到路由前置,无法提交");return}var _paramsArr="";if(options.params){_paramsArr=IFSAjax.attr2param(options);if("GET"==options.method){options.url+="?"+$.param(_paramsArr)}else{options.data=$.param(_paramsArr)}}var vc=$("#_vc").val();if(vc==null||vc==undefined){vc=""}IFSAjax.ajaxSend(options);if((undefined!=options.interval)&&(""!=options.interval)){window.setInterval(function(){IFSAjax.ajaxSend(options)},options.interval*1000)}},callBackFunction:function(options,msg){if(options.lock!=""&&options.lock!=null){$("#"+options.lock).removeAttr("disabled");$("#"+options.lock).attr("class","btn-primary btn-block fontcenter")}if(options.load){cannelLoadingDialog()}if((undefined==msg)||(null==msg)){return false}if(msg.head._rd!=null&&msg.head._rd!=""){if(msg.head._rd==setting.SESSIONERROR){if(window.location.href.indexOf(setting.LOGINPAGE)==-1){goTo(setting.LOGINPAGE)}_showMsg(msg.head._rm);return false}else{if(msg.head._rd==setting.INPUTERROR){if(msg.head._rm instanceof Array){_showMsg(msg.head._rm[0].msg);return false}}else{if(msg.head._rd==setting.CONNECTERROR){_showMsg(msg.head._rm,null);return false}else{if(msg.head._rd==setting.APPLYERROR){_showMsg(msg.head._rm,null);return false}else{if(msg.head._rd==setting.ERROR){window.location.href="error.html";return false}}}}}}if(""!=options.show){if("alert"==options.show){if(msg.head._rm!=null&&msg.head._rm!=""){showAlert(msg.head._rm);return false}}}if(options.complete){options.complete(msg);return false}return true},callErrorBackFunction:function(options,XMLHttpRequest,status,thrownError){if(options.lock!=""&&options.lock!=null){$("#"+options.lock).removeAttr("disabled");$("#"+options.lock).attr("class","btn-primary btn-block fontcenter")}if(status=="timeout"){showAlert("请求超时！")}if(status=="error"){window.location.href="error.html"}if(options.load){cannelLoadingDialog()}if(options.error){options.error(status,XMLHttpRequest);return}return true},attr2param:function(options){var _paramsArr={};eval("var _eval_params = ("+options.params+")");$.each(_eval_params,function(param,type){var $temp=$("#"+param);var _val="";switch(type){case"t":_val=$temp.text();break;case"v":_val=$temp.val();break;default:_val=type}_paramsArr[param]=_val});return _paramsArr}};IFSAjax.init();$.fn.IFSAjax=function(option){IFSAjax.setOptions(this,option);IFSAjax.ajaxClick(this)}})(jQuery);function clearContent(id){$("#"+id).val("");$("#"+id).focus()}function seePwd(pwdId,spanId){var domObj=document.getElementById(pwdId);var domObjStyle=document.getElementById(spanId);if(domObj.getAttribute("type")=="password"){domObj.setAttribute("type","text");domObjStyle.setAttribute("class","iconfont icon_yy_b")}else{if(domObj.getAttribute("type")=="text"){domObj.setAttribute("type","password");domObjStyle.setAttribute("class","iconfont icon_yy")}}}function pwdFocus(id){$("#"+id).show()}function goTo(url){if(url.indexOf("?")!=-1){window.location.href=url+"&t="+Math.random()}else{window.location.href=url+"?t="+Math.random()}}(function($){$.fn.ifsVertifyCode=function(){var element=this;element.attr("src",routers[setting.imageChannel]+"?d="+new Date().getTime())}})($);$.fn.ifsSelect=function(code){var codes=[];this.each(function(){var t=$(this);var c=code||t.attr("ifs-select-code");if(!c){throw"datadic code not define"}codes.push(c)});if(codes.length>0){return initSelect(codes.join(","),this)}return{}};function convert2tree(citys){var arr=citys.list||[];var map={};for(var i=0;i<arr.length;i++){var city=arr[i];map[city.i]=city;city.children=[]}var roots=[];for(var i=0;i<arr.length;i++){var city=arr[i];var id=city.i;var pid=city.p;if(map[pid]&&id!=pid){map[pid].children.push(city)}else{roots.push(city)}}return[roots,map]}function getCookie(){var result={};$("<div>").IFSAjax({code:setting.getCookie,data:null,async:true});return result}function updateOptionCascade(target,treedata,map){updateOption(treedata||[],target,map);var next=target.attr("ifs-select-cascade");while(next){var jnext=$(next);updateOption([],jnext,map);next=jnext.attr("ifs-select-cascade")}}function bindOptionCascadeEvent(target,treemap,map){var srcs=[];var next=target;do{var nextSel=next.attr("ifs-select-cascade")||"";if(nextSel){next.unbind("change.ifs").bind("change.ifs",function(){var t=$(this);var nxt=t.attr("ifs-select-cascade");if(nxt){var data=treemap[this.value];updateOptionCascade($(nxt),data?data.children:[],map)}})}next=$(nextSel)}while(next[0]);return target}function initCascadeSelect(target,callback){$("<div>").IFSAjax({code:setting.ALLAREA,data:'{"flag":1}',async:!!callback,complete:function(json,error){if(!error){var data=json.body;var tmp=convert2tree(data);var map={key:"i",text:"n"};updateOptionCascade(target,tmp[0],map);bindOptionCascadeEvent(target,tmp[1],map);callback&&callback()}}})}$.fn.initCitySelect=function(callback){return this.each(function(){initCascadeSelect($(this),callback)})};function updateOption(data,target,map){if(!target[0]){return}map=$.extend({key:"dataNo",text:"dataName",required:target.prop("required")},map||{});var selected=map.selected||target.attr("ifs-select-value");var selectCode=target.attr("ifs-select-code");var options="";if(selectCode=="XW000001"){options=!map.required?"<option value=''>请选择户籍归属</option>":""}else{if(selectCode=="IP000017"){options=!map.required?"<option value=''>请选择婚姻状况</option>":""}else{if(selectCode=="XW000002"){options=!map.required?"<option value=''>请选择子女状况</option>":""}else{if(selectCode=="IP000018"){options=!map.required?"<option value=''>请选择住房情况</option>":""}else{if(selectCode=="IP000028"){options=!map.required?"<option value=''>请选择教育情况</option>":""}else{if(selectCode=="IP000024"){options=!map.required?"<option value=''>请选择行业信息</option>":""}else{if(selectCode=="XW000010"){options=!map.required?"<option value=''>请选择雇员人数</option>":""}else{if(selectCode=="XW000062"){options=!map.required?"<option value=''>请选择每月还款日期</option>":""}else{if(selectCode=="XW000003"){}else{options=!map.required?"<option value=''>请选择...</option>":""}}}}}}}}}if(data){for(var i=0;i<data.length;i++){var d=data[i];options+='<option style="text-align:left;" value="'+d[map.key]+'" '+(selected===d[map.key]?"selected":"")+">"+d[map.text]+"</option>"}}target.html(options)}function initSelect(codes,targets){var result={};$("<div>").IFSAjax({code:setting.DATADIC,data:{dataTypeNo:codes},async:false,complete:function(json,error){if(!error){var data=json.body;result=data.dicMap;for(var key in result){updateOption(result[key],targets.filter("[ifs-select-code='"+key+"']"))}}}});return result}function sexEscapeByIDCard(idCard){if(idCard.length==18){var str=idCard.substr(idCard.length-2,1);if(str%2==1){return"1"}else{if(str%2==0){return"2"}}}else{return"x"}}$.fn.ifsWaitingButton=function(timeout){return this.each(function(){initWaitingButton($(this),timeout)})};var w_text="w_text";var w_wait="w_wait";function initWaitingButton(target,timeout){function updateText(timeout){if(timeout==0){target.prop("disabled",false);target.text(target.data(w_text))}else{target.prop("disabled",true);target.text(timeout+"秒后重试");var h=setTimeout(function(){updateText(timeout-1)},1000);target.data(w_wait,h)}}if(!target.data(w_text)){target.data(w_text,target.text())}if(target.data(w_wait)){clearTimeout(target.data(w_wait))}updateText(timeout||90)}function resetWaitingButton(target){if(target.data(w_wait)){clearTimeout(target.data(w_wait));target.prop("disabled",false);target.text(target.data(w_text))}}function FloatMul(arg1,arg2){var m=0,s1=arg1.toString(),s2=arg2.toString();try{m+=s1.split(".")[1].length}catch(e){}try{m+=s2.split(".")[1].length}catch(e){}return Number(s1.replace(".",""))*Number(s2.replace(".",""))/Math.pow(10,m)}function FloatDiv(arg1,arg2){var t1=0,t2=0,r1,r2;try{t1=arg1.toString().split(".")[1].length}catch(e){}try{t2=arg2.toString().split(".")[1].length}catch(e){}with(Math){r1=Number(arg1.toString().replace(".",""));r2=Number(arg2.toString().replace(".",""));return(r1/r2)*pow(10,t2-t1)}}function FloatAdd(arg1,arg2){var r1,r2,m;try{r1=arg1.toString().split(".")[1].length}catch(e){r1=0}try{r2=arg2.toString().split(".")[1].length}catch(e){r2=0}m=Math.pow(10,Math.max(r1,r2));return(arg1*m+arg2*m)/m}function FloatSub(arg1,arg2){var r1,r2,m,n;try{r1=arg1.toString().split(".")[1].length}catch(e){r1=0}try{r2=arg2.toString().split(".")[1].length}catch(e){r2=0}m=Math.pow(10,Math.max(r1,r2));n=(r1>=r2)?r1:r2;return((arg1*m-arg2*m)/m).toFixed(n)}function JSRound(fNum,fBit,n){var i=1;var m=1;var tempNum=fNum;for(i=1;i<=fBit;i++){m=m*10}tempNum=tempNum*m;tempNum=Math.round(tempNum);tempNum=tempNum/m;return tempNum.toFixed(n)}function getIosRealHeight(array){var totalH=0;$.each(array,function(k,y){var o=$(y);var pt=0;if((o.css("padding-top")+"").indexOf("px")!=-1){pt=parseInt((o.css("padding-top")+"").replace("px",""))}var pb=0;if((o.css("padding-bottom")+"").indexOf("px")!=-1){pb=parseInt((o.css("padding-bottom")+"").replace("px",""))}var mt=0;if((o.css("margin-top")+"").indexOf("px")!=-1){mt=parseInt((o.css("margin-top")+"").replace("px",""))}var mb=0;if((o.css("margin-bottom")+"").indexOf("px")!=-1){mb=parseInt((o.css("margin-bottom")+"").replace("px",""))}totalH=totalH+parseInt(o.height())+pt+pb+mt+mb});return totalH}function initIosPageHeight(){if($(".content")[0]){var content=$(".content").eq(0);var win_h=$(window).height();var doc_h=getIosRealHeight(content.children());if(doc_h<win_h){content.css({height:win_h+"px"})}else{content.css({height:""})}}}function getAndRealHeight(array){var totalH=0;$.each(array,function(k,y){var o=$(y);var pt=0;if((o.css("padding-top")+"").indexOf("px")!=-1){pt=parseInt((o.css("padding-top")+"").replace("px",""))}var pb=0;if((o.css("padding-bottom")+"").indexOf("px")!=-1){pb=parseInt((o.css("padding-bottom")+"").replace("px",""))}var mt=0;if((o.css("margin-top")+"").indexOf("px")!=-1){mt=parseInt((o.css("margin-top")+"").replace("px",""))}var mb=0;if((o.css("margin-bottom")+"").indexOf("px")!=-1){mb=parseInt((o.css("margin-bottom")+"").replace("px",""))}totalH=totalH+parseInt(o.height())+pt+pb+mt+mb});return totalH}function initAndPageHeight(){if($(".content")[0]){var content=$(".content").eq(0);var win_h=$(window).height();var doc_h=getAndRealHeight(content.children());if(doc_h<win_h){content.css({height:win_h+"px"})}else{content.css({height:doc_h+"px"})}}}$(function(){$(".table-view>.table-view-cell").on("focusin","input",function(){var er=$(this).parent().parent().find(".icon_yy");if(er.length>1){er=$(this).parent().find(".icon_yy")}var val=$(this).val();if(val){er.fadeIn()}});$(".table-view>.table-view-cell").on("focusout","input",function(){var er=$(this).parent().parent().find(".icon_yy");if(er.length>1){er=$(this).parent().find(".icon_yy")}if(!$(this).val()){er.fadeOut()}});$(".table-view>.table-view-cell").on("keyup change","input",function(){var er=$(this).parent().parent().find(".icon_yy");if(er.length>1){er=$(this).parent().find(".icon_yy")}var val=$(this).val();if(val){er.fadeIn()}else{er.fadeOut()}});$(".table-view>.table-view-cell").on("click",".icon_yy",function(){$(this).parent().find("input").val("");$(this).fadeOut();$(this).parent().find("input").focus()});if(browser.versions.mobile&&browser.versions.webKit){if(browser_version.android){initAndPageHeight()}else{if(browser.versions.iPhone&&browser.versions.ios){initIosPageHeight()}else{initIosPageHeight()}}}else{initIosPageHeight()}});function errorTip(data){if(data.head._rm instanceof Array){_showMsg(data.head._rm[0].msg,null)}else{_showMsg(data.head._rm,null)}}function msg_encrypt(word){var key=CryptoJS.enc.Utf8.parse(setting.KEY);var iv=CryptoJS.enc.Utf8.parse(setting.IV);var words=CryptoJS.enc.Utf8.parse(word);var encrypted=CryptoJS.AES.encrypt(words,key,{iv:iv,mode:CryptoJS.mode.CBC});var encryptedStr=encrypted.ciphertext.toString();var encryptedHexStr=CryptoJS.enc.Hex.parse(encryptedStr);var encryptedBase64Str=base64encode(encryptedHexStr.toString());return encryptedBase64Str.toString()}function msg_md5(word){var srcs=CryptoJS.enc.Utf8.parse(word);var hash=CryptoJS.MD5(srcs);return hash}function formatMoney(obj,n,length){var maxM="";var maxR="";for(var i=0;i<length;i++){maxM+="9"}for(var i=0;i<n;i++){maxR+="9"}maxM=maxM+"."+maxR;if(obj==null||obj==""||obj==undefined||obj=="undefined"||obj=="null"){return fmoney2(0,n)}else{obj=obj+"";obj=obj.replace(/([^0-9.])+/g,"");obj=obj.replace(/([^0-9])+/,".");if(obj==""||obj=="."){return fmoney2(0,n)}else{var money=parseFloat(obj);if(money<=parseFloat(maxM)){return fmoney2(money,n)}else{return fmoney2(maxM,n)}}}}function fmoney2(s,n){n=n>=0&&n<=20?n:2;s=parseFloat((s+"").replace(/[^\d\.-]/g,"")).toFixed(n)+"";var l=s.split(".")[0].split("").reverse();var t="";if(n>0){var r=s.split(".")[1];for(var i=0;i<l.length;i++){t+=l[i]+((i+1)%3==0&&(i+1)!=l.length?",":"")}return t.split("").reverse().join("")+"."+r}else{for(var i=0;i<l.length;i++){t+=l[i]+((i+1)%3==0&&(i+1)!=l.length?",":"")}return t.split("").reverse().join("")}}function startApplyWizard(appno){var form=document.createElement("FORM");form.method="post";form.action=PATHSET.WEBPATH+"/sec/gotoapply";form.insertAdjacentHTML("beforeEnd",'<input type="hidden" name="appNo" value="'+(appno||"")+'">');document.body.appendChild(form);form.submit();document.body.removeChild(form)}function nextApplyStep(custNm,mobTel,encryptMobTel,bsnessTyp,n,m){var form=document.createElement("FORM");form.method="post";form.action=PATHSET.WEBPATH+"/sec/lnappl";var l=getUrlParam("l")||"";form.insertAdjacentHTML("beforeEnd",'<input type="hidden" name="custNm" value="'+(custNm||"")+'">');form.insertAdjacentHTML("beforeEnd",'<input type="hidden" name="mobTel" value="'+(mobTel||"")+'">');form.insertAdjacentHTML("beforeEnd",'<input type="hidden" name="encryptMobTel" value="'+(encryptMobTel||"")+'">');form.insertAdjacentHTML("beforeEnd",'<input type="hidden" name="bsnessTyp" value="'+(bsnessTyp||"")+'">');form.insertAdjacentHTML("beforeEnd",'<input type="hidden" name="l" value="'+l+'">');form.insertAdjacentHTML("beforeEnd",'<input type="hidden" name="n" value="'+(n||"next")+'">');document.body.appendChild(form);form.submit();document.body.removeChild(form)}function startLoanApplyWizard(appno){var form=document.createElement("FORM");form.method="post";form.action=PATHSET.WEBPATH+"/sec/gotoLoanApply";form.insertAdjacentHTML("beforeEnd",'<input type="hidden" name="appNo" value="'+(appno||"")+'">');document.body.appendChild(form);form.submit();document.body.removeChild(form)}function nextLoanApplyStep(appno,n){var form=document.createElement("FORM");form.method="post";form.action=PATHSET.WEBPATH+"/sec/loanApply";var l=getUrlParam("l")||"";form.insertAdjacentHTML("beforeEnd",'<input type="hidden" name="appNo" value="'+(appno||"")+'">');form.insertAdjacentHTML("beforeEnd",'<input type="hidden" name="l" value="'+l+'">');form.insertAdjacentHTML("beforeEnd",'<input type="hidden" name="n" value="'+(n||"next")+'">');document.body.appendChild(form);form.submit();document.body.removeChild(form)}function getUrlParam(argName){var args=location.href.split("?");var retval="";var str=decodeURI(args[1]);if(str){var _args=str.split("#")[0];args=_args.split("&");for(var i=0;i<args.length;i++){_args=args[i];var arg=_args.split("=");if(arg.length<=1){continue}if(arg[0]==argName){retval=arg[1]}}}return retval}function nextChangePhoneStep(oldMobTel,n,m){var form=document.createElement("FORM");form.method="post";form.action=PATHSET.WEBPATH+"/sec/chphone";var l=getUrlParam("l")||"";form.insertAdjacentHTML("beforeEnd",'<input type="hidden" name="oldMobTel" value="'+(oldMobTel||"")+'">');form.insertAdjacentHTML("beforeEnd",'<input type="hidden" name="l" value="'+l+'">');form.insertAdjacentHTML("beforeEnd",'<input type="hidden" name="n" value="'+(n||"next")+'">');document.body.appendChild(form);form.submit();document.body.removeChild(form)}function nextRegisterStep(custNm,idNo,mobTel,n,m){var form=document.createElement("FORM");form.method="post";form.action=PATHSET.WEBPATH+"/sec/register";var l=getUrlParam("l")||"";form.insertAdjacentHTML("beforeEnd",'<input type="hidden" name="mobTel" value="'+(mobTel||"")+'">');form.insertAdjacentHTML("beforeEnd",'<input type="hidden" name="custNm" value="'+(custNm||"")+'">');form.insertAdjacentHTML("beforeEnd",'<input type="hidden" name="idNo" value="'+(idNo||"")+'">');form.insertAdjacentHTML("beforeEnd",'<input type="hidden" name="l" value="'+l+'">');form.insertAdjacentHTML("beforeEnd",'<input type="hidden" name="n" value="'+(n||"next")+'">');document.body.appendChild(form);form.submit();document.body.removeChild(form)}var _showMsgStr='<div class="error fontcenter" id="showMsg"> </div>';function _showMsg(msg,func){if(document.getElementById("showMsg")!=null){$("#showMsg").remove()}$("body").append(_showMsgStr);$("#showMsg").text(msg);setTimeout(function(){$("#showMsg").fadeToggle("slow",null);if(document.getElementById("showMsg")!=null){$("#showMsg").remove()}},1500)}function checkEmpty(objValue,msg){if($.trim(objValue)==""||objValue==undefined){_showMsg(msg,null);return false}return true}function checkEmpty2(id,msg){var _val=$("#"+id).val();if($.trim(_val)==""){var _msg="";if(msg){_msg=msg}else{_msg=$("#"+id).attr("placeholder")}_showMsg(_msg,null);return false}return true}function checkPhone(phoneNumber){var regular=/^(13|15|18|17)[0-9]{9}$/;var reg=new RegExp(regular);if(!reg.test(phoneNumber)){_showMsg("请输入正确的手机号码",null);return false}return true}function checkpwd(password){if(password.length<6){_showMsg("密码少于六位",null);return false}else{var count=0;reguler=/([A-Za-z]{1,})/;if(reguler.test(password)){count++}reguler=/[0-9]{1,}/;if(reguler.test(password)){count++}reguler=/[`~!@#$%^*()_+\-={}\[\]|\\;'<>,.?/]{1,}/;if(reguler.test(password)){count++}if(count<2){_showMsg("请按照规则输入密码",null);return false}return true}}function checkSamePwd(pwd,repwd){if(!(pwd==repwd)){_showMsg("两次密码不一致",null);return false}return true}function checkSamePwd2(oldpwd,newpwd){if(oldpwd==newpwd){_showMsg("原密码不能和新密码一致",null);return false}return true}function checkUserName(username){if(username.length<2||username.length>10){_showMsg("请输入正确的姓名",null);return false}var regular=/^[a-zA-Z\u4e00-\u9fa5·*]{2,20}$/;if(!regular.test(username)){_showMsg("请输入正确的姓名",null);return false}return true}function idLastNumRule(id){var baseX=[7,9,10,5,8,4,2,1,6,3,7,9,10,5,8,4,2];var resRule={"0":"1","1":"0","2":"X","3":"9","4":"8","5":"7","6":"6","7":"5","8":"4","9":"3","10":"2"};var sum=0;if(!id||id.length!=18){return false}var s=id.split("");for(var i=0;i<17;i++){sum+=parseInt(s[i])*baseX[i]}var resNum=resRule[sum%11+""];if(resNum==(id.substring(17)+"").toUpperCase()){return true}else{return false}}function checkIdcard(num){var regular=/^((1[1-5])|(2[1-3])|(3[1-7])|(4[1-6])|(5[0-4])|(6[1-5])|71|(8[12])|91)\d{4}(((19|20)\d{2}(0[13-9]|1[012])(0[1-9]|[12]\d|30))|(19\d{2}(0[13578]|1[02])31)|(19\d{2}02(0[1-9]|1\d|2[0-8]))|(19([13579][26]|[2468][048]|0[48])0229))\d{3}(\d|X|x)?$/;if(!(regular.test(num)&&idLastNumRule(num))){_showMsg("身份证号码不合法",null);return false}return true}function checkPostId(postid){var regular=/^[1-9]\d{5}$/;if(!regular.test(postid)){_showMsg("邮政编码不正确",null);return false}return true}function checkMsgCode(mobTelCode){var regular=/^[0-9]{6}$/;if(!regular.test(mobTelCode)){_showMsg("短信验证码格式不正确",null);return false}return true}function checkViewCode(viewcode){var regular=/[0-9a-zA-Z]{4}/;if(!regular.test(viewcode)){_showMsg("图片验证码格式不正确",null);return false}return true}function checklicNo(licNo){var regular=/^\d{15}$/;if(!regular.test(licNo)){_showMsg("请填写正确的15位营业执照号码",null);return false}return true}function checkcupShp(cupShp){if(!cupShp){return true}var regular=/^\d{15}$/;if(!regular.test(cupShp)){_showMsg("请填写正确的15位银联商户号码",null);return false}return true}function checkcmpnNm(cmpnNm){var regular=/^([\u4e00-\u9fa5]|[a-zA-Z0-9()（）]){1,50}$/;if(!regular.test(cmpnNm)){_showMsg("企业名称格式不正确",null);return false}return true}function checkrgAdr(cupShp){var regular=/^([\u4e00-\u9fa5]|[a-zA-Z0-9]){1,200}$/;if(!regular.test(cupShp)){_showMsg("详细地址格式不正确",null);return false}return true}function checklclOprin(cupShp){if(!cupShp){return true}var regular=/^[1-9]\d{0,1}$/;if(!regular.test(cupShp)){_showMsg("本地经营年限格式不正确",null);return false}return true}function checkoprtnPrd(cupShp){if(!cupShp){return true}var regular=/^[1-9]\d{0,2}$/;if(!regular.test(cupShp)){_showMsg("从业年限格式不正确",null);return false}return true}function checkAndFocusElement(element,message){if(element==undefined||$.trim($("#"+element).val())==""){$("#"+element).focus();_showMsg(message,null);return false}return true}function checkappAmt(appAmt){var regular=/^(?=.*[1-9])\d+(\.\d+)?$/;if(!regular.test(appAmt)){_showMsg("申请金额格式错误",null);return false}return true}function checkmsgNumber(msgNumber){var regular=/^\d{6}$/;if(!regular.test(msgNumber)){_showMsg("短信验证码格式不正确",null);return false}return true}function checkqq(qq){if(!qq){return true}var regular=/\d{5,13}/;if(!regular.test(qq)){_showMsg("QQ号码格式错误",null);return false}return true}function checkwechat(wechat){if(!wechat){return true}var regular=/^[a-zA-Z]{1}[a-zA-Z\d_-]{5,19}$/;if(!regular.test(wechat)){_showMsg("微信号码格式错误",null);return false}return true}function checkEmail(email){if(!email){return true}var regular=/^(([^<>()\[\]\\.,;:\s@\"]+(\.[^<>()\[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;if(!regular.test(email)){_showMsg("邮箱号码格式错误",null);return false}return true}function checkNickNm(nickNm){if(!nickNm){_showMsg("用户名由6-20位字母或数字组成，且必须以字母开头",null);return false}var regular=/^[a-zA-Z][0-9a-zA-Z]{5,19}$/;if(!regular.test(nickNm)){_showMsg("用户名由6-20位字母或数字组成，且必须以字母开头",null);return false}return true}function checkHmAdr(adr){if(!adr){return true}var regular=/^([\u4e00-\u9fa5]|[a-zA-Z0-9]){1,100}$/;if(!regular.test(adr)){_showMsg("详细地址格式不正确",null);return false}return true}function checkFixedPhone(phone){var regular=/^\d{3,4}-\d{7,8}$/;if(!regular.test(phone)){_showMsg("固定电话格式不正确",null);return false}return true}function checkPhoneNum(phone){var mobile=/^(13|15|18|17)[0-9]{9}$/;var regular=/^\d{3,4}-\d{7,8}$/;if(mobile.test(phone)||regular.test(phone)){return true}else{_showMsg("电话格式不正确",null);return false}return false}function checklicNoVal(licNo){if(!(licNo.substring(0,4)=="1301"||licNo.substring(0,4)=="1401"||licNo.substring(0,4)=="3505"||licNo.substring(0,2)=="31"||licNo.substring(0,4)=="4401"||licNo.substring(0,4)=="5101")){_showMsg("请填写企业注册所在地为上海、太原、石家庄、泉州、广州和成都地区的营业执照号。",null);return false}return true}$.fn.serializeObject=function(){var o={};var a=this.serializeArray();$.each(a,function(){if(o[this.name]!==undefined){if(!o[this.name].push){o[this.name]=[o[this.name]]}o[this.name].push(this.value||"")}else{o[this.name]=this.value||""}});return o};(function($){$.fn.getJson=function(){var elements=this;var json={};initElements(elements.get(0),json);return $.toJSON(json)};$.fn.getJsonData=function(){var elements=this;var json={};initElements(elements.get(0),json);return json};function createTreeJson(key,keys,json,type){var o=json;var index=0;for(var i=0;i<keys.length;i++){if(keys[i]){if(!o[keys[i]]){o[keys[i]]={};o=o[keys[i]]}else{o=o[keys[i]];index++}}}var isHave=index==keys.length;if(!o[key]){if(type=="checkbox"){o[key]=[]}else{o[key]={}}isHave=false}return isHave}function setJsonValue(key,keys,json,value,type){var o=json;for(var i=0;i<keys.length;i++){if(keys[i]){if(!o[keys[i]]){o[keys[i]]={};o=o[keys[i]]}else{o=o[keys[i]]}}}if(type=="checkbox"){o[key].push(value)}else{o[key]=value}}function initElements(element,json){var dom=$(element);if(dom.attr("ifs_parent")){var key=dom.attr("id");getElementValue(element,json,key,dom.attr("ifs_parent"));return}for(var i=0;i<element.children.length;i++){initElements(element.children[i],json)}}function getElementValue(element,json,key,ifs_parent){var tagName=element.tagName;var object={};var keys=ifs_parent.substr(1).split("/");switch(tagName){case"INPUT":switch(element.type){case"radio":key=element.name;createTreeJson(key,keys,json,element.type);if(element.checked){setJsonValue(key,keys,json,element.value)}return;case"checkbox":key=element.name;createTreeJson(key,keys,json,element.type);setJsonValue(key,keys,json,element.value,element.type);return;default:object=element.value}break;case"SELECT":createTreeJson(key,keys,json,element.type);if($(element).attr("multiple")){var options=element.children;object=[];for(var i=0;i<options.length;i++){if(options[i].selected){object.push(options[i].value)}}}else{object=element.value}break;case"TEXTAREA":case"DIV":case"SPAN":createTreeJson(key,keys,json,element.type);object=element.innerHTML;break}setJsonValue(key,keys,json,object,element.type);return}})($);(function($){$.fn.bindData=function(json){var elements=this;initElements(elements.get(0),json)};function initElements(element,json){var dom=$(element);var ifs_parent=dom.attr("ifs_parent");if(ifs_parent){var keys=ifs_parent.substr(1).split("/");setElementValue(element,json,keys);return}for(var i=0;i<element.children.length;i++){initElements(element.children[i],json)}}function setElementValue(element,json,keys){var type=element.type;var key;if(type=="radio"){key=element.name}else{if(type=="checkbox"){key=element.name}else{key=element.id}}var o=json;for(var i=0;i<keys.length;i++){if(keys[i]){o=o[keys[i]]}}if(!(typeof(o[key])=="undefined")){switch(element.tagName){case"INPUT":switch(element.type){case"radio":element.checked=false;if(element.value==o[key]){element.checked=true}break;case"checkbox":element.checked=false;for(var i=0;i<o[key].length;i++){if(element.value==o[key][i]){element.checked=true;break}}break}element.value=o[key];break;case"SELECT":if($(element).attr("multiple")){if(toString.apply(o[key])=="[object Array]"){var options=element.children;var os=o[key];for(var i=0;i<options.length;i++){options[i].selected=false;for(var j=0;j<os.length;j++){if(options[i].value==os[j]){options[i].selected=true;break}}}}}else{var options=element.children;for(var i=0;i<options.length;i++){if(options[i].value==o[key]){options[i].selected=true}}}if($(element).attr("ifs-select-cascade")){$(element).trigger("change.ifs")}break;case"TEXTAREA":case"DIV":case"SPAN":case"TABLE":default:element.innerHTML=o[key]}}}})($);function getNode(node,nodeName){var nodes=nodeName.split("/");var str="";for(var i=0;i<nodes.length;i++){if(nodes[i]){str=str+"."+nodes[i]}}return eval("node"+str)}function envelop(node){function _addField(id,xpath){var element=$("#"+id);var nodes=xpath.split("/");var o=_json;for(var i=0;i<nodes.length;i++){if(nodes[i]){o[nodes[i]]={};o=o[nodes[i]]}}o[id]=_getElementValue(element.get(0))}function _getElementValue(element){var tagName=element.tagName;var object;switch(tagName){case"INPUT":object=element.value;break;case"SELECT":if($(element).attr("multiple")){var options=element.children;object=[];for(var i=0;i<options.length;i++){if(options[i].selected){object.push(options[i].value)}}}else{object=element.value}break;case"TEXTAREA":case"DIV":case"SPAN":object=element.innerHTML;break}return object}function _getJsonData(){return _json}function _getJsonString(){return $.toJSON(_json)}var _this=this;var _json={};var _data=[];_this.addField=_addField;_this.getJsonData=_getJsonData;_this.getJsonString=_getJsonString}function customJson(node){function _init(){if(node){_json=node}}function _addChildNode(k,v){if(typeof(v)=="undefined"){_json[k]={}}else{_json[k]=v}return new customJson(_json[k])}function _addNode(k,v){if(typeof(v)=="undefined"){_json[k]={}}else{_json[k]=v}return new customJson(_json[k])}function _getJsonData(){return _json}function _getJsonString(){return $.toJSON(_json)}var _this=this;var _json={};_this.addChildNode=_addChildNode;_this.addNode=_addNode;_this.getJsonData=_getJsonData;_this.getJsonString=_getJsonString;_init()}var WangYin={topage:"_to_page",custNo:"",procError:function(json){var code=json.head._rd;var tp=json.body?json.body[this.topage]:null;if(tp){window.location.href=tp}else{showAlert(json.head._rm)}},checkIsLogin:function(){getLoginFlag()},checkPage:function(){var t=this;$("<div>").IFSAjax({code:"01_100809",data:{},async:false,show:"",complete:function(json){var error=json.head._rd!="0000";if(error){t.custNo="";t.procError(json)}else{t.custNo=json.body.custNo}}})},submitIdNo:function(idNo){var t=this;$("<div>").IFSAjax({code:"01_100803",data:{idNo:idNo,custNo:t.custNo},show:"",complete:function(json){var error=json.head._rd!="0000";if(error){t.procError(json)}else{window.location.href=json.body[t.topage]}}})},fastRegisterLoad:function(callback){var t=this;$("<div>").IFSAjax({code:"01_100804",data:{custNo:t.custNo},show:"",complete:function(json){var error=json.head._rd!="0000";if(error){t.procError(json)}else{callback(json)}}})},fastRegisterSubmit:function(jsonObj){var t=this;jsonObj.custNo=t.custNo;$("<div>").IFSAjax({code:"01_100805",data:jsonObj,show:"",lock:"fastRegSubmit",complete:function(json){var error=json.head._rd!="0000";if(error){t.procError(json)}else{showAlert("注册成功!");window.setTimeout(function(){window.location.href=json.body[t.topage]},2000)}}})},mobileVaildLoad:function(callback){var t=this;$("<div>").IFSAjax({code:"01_100806",data:{custNo:t.custNo},show:"",complete:function(json){var error=json.head._rd!="0000";if(error){t.procError(json)}else{callback(json)}}})},mobileVaildSubmit:function(msgNum,mobTel){var t=this;$("<div>").IFSAjax({code:"01_100807",data:{custNo:t.custNo,msgNumber:msgNum,mobTel:mobTel},show:"",complete:function(json){var error=json.head._rd!="0000";if(error){t.procError(json)}else{window.location.href=json.body[t.topage]}}})}};+function($){var Carousel=function(element,options){this.$element=$(element);this.$indicators=this.$element.find(".carousel-indicators");this.options=options;this.paused=null;this.sliding=null;this.interval=null;this.$active=null;this.$items=null;this.options.keyboard&&this.$element.on("keydown.bs.carousel",$.proxy(this.keydown,this));this.options.pause=="hover"&&!("ontouchstart" in document.documentElement)&&this.$element.on("mouseenter.bs.carousel",$.proxy(this.pause,this)).on("mouseleave.bs.carousel",$.proxy(this.cycle,this))};Carousel.VERSION="3.3.5";Carousel.TRANSITION_DURATION=600;Carousel.DEFAULTS={interval:5000,pause:"hover",wrap:true,keyboard:true};Carousel.prototype.keydown=function(e){if(/input|textarea/i.test(e.target.tagName)){return}switch(e.which){case 37:this.prev();break;case 39:this.next();break;default:return}e.preventDefault()};Carousel.prototype.cycle=function(e){e||(this.paused=false);this.interval&&clearInterval(this.interval);this.options.interval&&!this.paused&&(this.interval=setInterval($.proxy(this.next,this),this.options.interval));return this};Carousel.prototype.getItemIndex=function(item){this.$items=item.parent().children(".item");return this.$items.index(item||this.$active)};Carousel.prototype.getItemForDirection=function(direction,active){var activeIndex=this.getItemIndex(active);var willWrap=(direction=="prev"&&activeIndex===0)||(direction=="next"&&activeIndex==(this.$items.length-1));if(willWrap&&!this.options.wrap){return active}var delta=direction=="prev"?-1:1;var itemIndex=(activeIndex+delta)%this.$items.length;return this.$items.eq(itemIndex)};Carousel.prototype.to=function(pos){var that=this;var activeIndex=this.getItemIndex(this.$active=this.$element.find(".item.active"));if(pos>(this.$items.length-1)||pos<0){return}if(this.sliding){return this.$element.one("slid.bs.carousel",function(){that.to(pos)})}if(activeIndex==pos){return this.pause().cycle()}return this.slide(pos>activeIndex?"next":"prev",this.$items.eq(pos))};Carousel.prototype.pause=function(e){e||(this.paused=true);if(this.$element.find(".next, .prev").length&&$.support.transition){this.$element.trigger($.support.transition.end);this.cycle(true)}this.interval=clearInterval(this.interval);return this};Carousel.prototype.next=function(){if(this.sliding){return}return this.slide("next")};Carousel.prototype.prev=function(){if(this.sliding){return}return this.slide("prev")};Carousel.prototype.slide=function(type,next){var $active=this.$element.find(".item.active");var $next=next||this.getItemForDirection(type,$active);var isCycling=this.interval;var direction=type=="next"?"left":"right";var that=this;if($next.hasClass("active")){return(this.sliding=false)}var relatedTarget=$next[0];var slideEvent=$.Event("slide.bs.carousel",{relatedTarget:relatedTarget,direction:direction});this.$element.trigger(slideEvent);if(slideEvent.isDefaultPrevented()){return}this.sliding=true;isCycling&&this.pause();if(this.$indicators.length){this.$indicators.find(".active").removeClass("active");var $nextIndicator=$(this.$indicators.children()[this.getItemIndex($next)]);$nextIndicator&&$nextIndicator.addClass("active")}var slidEvent=$.Event("slid.bs.carousel",{relatedTarget:relatedTarget,direction:direction});if($.support.transition&&this.$element.hasClass("slide")){$next.addClass(type);$next[0].offsetWidth;$active.addClass(direction);$next.addClass(direction);$active.one("bsTransitionEnd",function(){$next.removeClass([type,direction].join(" ")).addClass("active");$active.removeClass(["active",direction].join(" "));that.sliding=false;setTimeout(function(){that.$element.trigger(slidEvent)},0)}).emulateTransitionEnd(Carousel.TRANSITION_DURATION)}else{$active.removeClass("active");$next.addClass("active");this.sliding=false;this.$element.trigger(slidEvent)}isCycling&&this.cycle();return this};function Plugin(option){return this.each(function(){var $this=$(this);var data=$this.data("bs.carousel");var options=$.extend({},Carousel.DEFAULTS,$this.data(),typeof option=="object"&&option);var action=typeof option=="string"?option:options.slide;if(!data){$this.data("bs.carousel",(data=new Carousel(this,options)))}if(typeof option=="number"){data.to(option)}else{if(action){data[action]()}else{if(options.interval){data.pause().cycle()}}}})}var old=$.fn.carousel;$.fn.carousel=Plugin;$.fn.carousel.Constructor=Carousel;$.fn.carousel.noConflict=function(){$.fn.carousel=old;return this};var clickHandler=function(e){var href;var $this=$(this);var $target=$($this.attr("data-target")||(href=$this.attr("href"))&&href.replace(/.*(?=#[^\s]+$)/,""));if(!$target.hasClass("carousel")){return}var options=$.extend({},$target.data(),$this.data());var slideIndex=$this.attr("data-slide-to");if(slideIndex){options.interval=false}Plugin.call($target,options);if(slideIndex){$target.data("bs.carousel").to(slideIndex)}e.preventDefault()};$(document).on("click.bs.carousel.data-api","[data-slide]",clickHandler).on("click.bs.carousel.data-api","[data-slide-to]",clickHandler);$(window).on("load",function(){$('[data-ride="carousel"]').each(function(){var $carousel=$(this);Plugin.call($carousel,$carousel.data())})})}(jQuery);