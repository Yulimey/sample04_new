/**
 * 全局默认设置
 */
var setting = {
	sumbitMethod : "post",
	callBackShow : "alert",
	callBackView : "show",
	originalAlert : false,
    countDownIntervalTime:90,
    getCookie : '01_200001',
    getRandom : '03_100306',
    imageChannel : '01_100302',
    DATADIC :"01_200701",
	ALLAREA:"01_200702",
	ISLOGIN: '03_100812',
	SESSIONERROR: 'PE97',
	ESLEERROR: 'PE93',
	CONNECTERROR: 'PE94',
	INPUTERROR: 'PE98',
	APPLYERROR: 'PE99',
	LOGINPAGE: '../login.html',
	SUCCESS:"0000",
	BUSINESSERROR:"1111",
	ENCLIST:"01_200201,01_200101,01_200103,01_200502,01_200301,01_200304,01_200509,01_200607,01_200608,01_200610,01_200601",
	CHECKTOKEN:"01_200607,01_200608,01_200610,01_200601,01_200617",
	ERROR:"4000",
	KEY: "8D4F16E8F94796FC",
    IV :"0102030405060708",
	unionLoginBeforeUrl:window.location.origin+PATHSET.WEBPATH+"/index.html",
	unionLoginToUrl:window.location.origin+PATHSET.PEPATH+"/mobileLogin.do",
	unionLoanBeforeUrl:window.location.origin+PATHSET.WEBPATH+"/sec/loanlist02.html",
	unionLoanToUrl:window.location.origin+PATHSET.PEPATH+"/01_200812.do"
};

function closeAlert(id) {
	$("#"+id).hide();
}

var _RANDOM_TOKEN = "";

/**
 * 将交易码、渠道码以及会话id添加到http header
 * 
 * @param transCode
 * @param XMLHttpRequest
 */
function addHttpHeader(transCode, channel, XMLHttpRequest, token, vc, mh) {
	// 将交易码添加到自定义http header
	XMLHttpRequest.setRequestHeader("_si", transCode);
	// 将渠道码添加到自定义http header
	XMLHttpRequest.setRequestHeader("_cn", channel);
	// 将验证码添加到http header
	XMLHttpRequest.setRequestHeader("_vc", vc);
	// body的hash值
	XMLHttpRequest.setRequestHeader("_mh", mh);
	
	//后台返回防止重复提交的token
	XMLHttpRequest.setRequestHeader("_ck", _RANDOM_TOKEN);
}
// 移除Cookie
function removeCookie(name, options) {
	addCookie(name, null, options);
}

//添加Cookie
function addCookie(name, value, options) {
	if (arguments.length > 1 && name != null) {
		if (options == null) {
			options = {};
		}
		if (value == null) {
			options.expires = -1;
		}
		if (typeof options.expires == "number") {
			var time = options.expires;
			var expires = options.expires = new Date();
			expires.setTime(expires.getTime() + time * 1000);
		}
		document.cookie = encodeURIComponent(String(name)) + "=" + encodeURIComponent(String(value)) + (options.expires ? "; expires=" + options.expires.toUTCString() : "") + (options.path ? "; path=" + options.path : "") + (options.domain ? "; domain=" + options.domain : ""), (options.secure ? "; secure" : "");
	}
}

/**
 * alert提示消息,根据全局配置originalAlert可以使用浏览器自带的alert模式和bootstrap的alert模式
 * 
 * @param message
 * 
 */
function showAlert(message) {
	if (setting.originalAlert) {
		alert(message);
	} else {
        _showMsg(message,null);
	}
}

/**
 * 使用Loading加载层
 * @param message
 */
function showLoadingDialog(message) {
    layer.load(message);
}

/**
 * 数据加载完成取消加载层
 */
function cannelLoadingDialog(){
    layer.closeAll();
}
/**
 * 数据字典的下拉
 * 
 * @param message
 */
// 针对有ifs_parent的，API的回填暂时还不行
$.fn.dataDic = function(dicNo) {
	var element=$(this);
	element.IFSAjax({
		code : "DATADIC",
		data : {
			'dicNo' : dicNo
		},
		complete : function(data) {
			if (data.body && data.body.data) {
				var datas = data.body.data;
				var strHtml = "";
				$.each(datas, function(k, v) {
					strHtml += "<option value='"+v.key+"'>" + v.name + "</option>";
				});
				element.html(strHtml);
			}
		}
	});
};

