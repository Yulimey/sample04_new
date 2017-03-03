var _showMsgStr = '<div class="error fontcenter" id="showMsg"> </div>';
function _showMsg(msg,func){
	if(document.getElementById("showMsg") != null){
		$('#showMsg').remove();
	}
	$('body').append(_showMsgStr);
	$('#showMsg').text(msg);
	setTimeout(function(){
			$("#showMsg").fadeToggle("slow",null);
			if(document.getElementById("showMsg") != null){
				$('#showMsg').remove();
			}
		},1500);
}


function checkEmpty(objValue,msg){
	if($.trim(objValue) == "" || objValue==undefined){
		_showMsg(msg,null);
		return false;
	}
	return true;
}

function checkEmpty2(id,msg){
	var _val = $("#"+id).val();
	if($.trim(_val) == ""){
		var _msg= "";
		if(msg){
			_msg= msg;
		}else{
			_msg = $("#"+id).attr('placeholder');
		}
		_showMsg(_msg,null);
		return false;
	}
	return true;
}
function checkPhone(phoneNumber){
	var regular = /^(1)[0-9]{10}$/;
   	var reg = new RegExp(regular);
   	if(!reg.test(phoneNumber)){
   		_showMsg("请输入正确的手机号码",null);
   		return false;
   	}
   	return true;
}


function checkpwd(password){
	if(password.length<6 ){
   		_showMsg("密码少于六位",null);
   		return false;
   	}else{
   		var count = 0;
   		reguler = /([A-Za-z]{1,})/;
   		if(reguler.test(password)){
   			count++;
   		}
   		reguler = /[0-9]{1,}/;
   		if(reguler.test(password)){
   			count++;
   		}
   		reguler = /[`~!@#$%^*()_+\-={}\[\]|\\;'<>,.?/]{1,}/;
   		if(reguler.test(password)){
   			count++;
   		}
   		if(count < 2){
   			_showMsg("请按照规则输入密码",null);
       		return false;
   		}
   		return true;
   	}
}

function checkSamePwd(pwd,repwd){
	if(!(pwd == repwd)){
		_showMsg("两次密码不一致",null);
		return false;
	}
	return true;
}

function checkSamePwd2(oldpwd,newpwd){
	if(oldpwd == newpwd){
		_showMsg("原密码不能和新密码一致",null);
		return false;
	}
	return true;
}

function checkUserName(username){
	if(username.length < 2 || username.length > 10){
   		_showMsg("请输入正确的姓名",null);
   		return false;
   	}
	var regular = /^[a-zA-Z\u4e00-\u9fa5·*]{2,20}$/;
	if(!regular.test(username)){
		_showMsg("请输入正确的姓名",null);
		return false;
	}
	return true;
}

function idLastNumRule(id){
	var baseX=[7,9,10,5,8,4,2,1,6,3,7,9,10,5,8,4,2];
	var resRule={'0':'1','1':'0','2':'X','3':'9','4':'8','5':'7','6':'6','7':'5','8':'4','9':'3','10':'2'};
	var sum=0;
	if(!id||id.length!=18){
		return false;
	}
	var s=id.split('');
	for(var i=0;i<17;i++){
		sum+=parseInt(s[i])*baseX[i];
	}
	var resNum=resRule[sum%11+""];
	if(resNum==(id.substring(17)+"").toUpperCase()){
		return true;
	}else{
		return false;
	}
}

function checkIdcard(num){
	var regular = /^((1[1-5])|(2[1-3])|(3[1-7])|(4[1-6])|(5[0-4])|(6[1-5])|71|(8[12])|91)\d{4}(((19|20)\d{2}(0[13-9]|1[012])(0[1-9]|[12]\d|30))|(19\d{2}(0[13578]|1[02])31)|(19\d{2}02(0[1-9]|1\d|2[0-8]))|(19([13579][26]|[2468][048]|0[48])0229))\d{3}(\d|X|x)?$/;
	if(!(regular.test(num) && idLastNumRule(num))){
		_showMsg("身份证号码不合法",null);
		return false;
	}
	return true;
}


function checkPostId(postid){
	var regular = /^[1-9]\d{5}$/;
	if(!regular.test(postid)){
		_showMsg("邮政编码不正确",null);
		return false;
	}
	return true;
}

function checkMsgCode(mobTelCode){
	var regular = /^[0-9]{6}$/;
	if(!regular.test(mobTelCode)){
		_showMsg("短信验证码格式不正确",null);
		return false;
	}
	return true;
}

function checkViewCode(viewcode){
	var regular = /[0-9a-zA-Z]{4}/;
	if(!regular.test(viewcode)){
		_showMsg("图片验证码格式不正确",null);
		return false;
	}
	return true;
}

function checklicNo(licNo){
	var regular = /^\d{15}$/;
	if(!regular.test(licNo)){
		_showMsg("请填写正确的15位营业执照号码",null);
		return false;
	}
	return true;
}

function checkcupShp(cupShp){
	if(!cupShp){
		return true;
	}
	var regular = /^\d{15}$/;
	if(!regular.test(cupShp)){
		_showMsg("请填写正确的15位银联商户号码",null);
		return false;
	}
	return true;
}

function checkcmpnNm(cmpnNm){
	var regular = /^([\u4e00-\u9fa5]|[a-zA-Z0-9()（）]){1,50}$/;
	if(!regular.test(cmpnNm)){
		_showMsg("企业名称格式不正确",null);
		return false;
	}
	return true;
}

function checkrgAdr(cupShp){
	var regular = /^([\u4e00-\u9fa5]|[a-zA-Z0-9]){1,200}$/;
	if(!regular.test(cupShp)){
		_showMsg("详细地址格式不正确",null);
		return false;
	}
	return true;
}

function checklclOprin(cupShp){
	if(!cupShp){
		return true;
	}
	var regular = /^[1-9]\d{0,1}$/;
	if(!regular.test(cupShp)){
		_showMsg("本地经营年限格式不正确",null);
		return false;
	}
	return true;
}

function checkoprtnPrd(cupShp){
	if(!cupShp){
		return true;
	}
	var regular = /^[1-9]\d{0,2}$/;
	if(!regular.test(cupShp)){
		_showMsg("从业年限格式不正确",null);
		return false;
	}
	return true;
}


function checkAndFocusElement(element, message){
	if(element == undefined || $.trim($("#"+element).val()) == ""){
		$("#"+element).focus();
		_showMsg(message,null);
		return false;
	} 
	return true;
}

function checkappAmt(appAmt){
	var regular = /^(?=.*[1-9])\d+(\.\d+)?$/;
	if(!regular.test(appAmt)){
		_showMsg("申请金额格式错误",null);
		return false;
	}
	return true;
}

function checkmsgNumber(msgNumber){
	var regular = /^\d{6}$/;
	if(!regular.test(msgNumber)){
		_showMsg("短信验证码格式不正确",null);
		return false;
	}
	return true;
}

function checkqq(qq){
	if(!qq){
		return true;
	}
	var regular = /\d{5,13}/;
	if(!regular.test(qq)){
		_showMsg("QQ号码格式错误",null);
		return false;
	}
	return true;
}

function checkwechat(wechat){
	if(!wechat){
		return true;
	}
	var regular = /^[a-zA-Z]{1}[a-zA-Z\d_-]{5,19}$/;
	if(!regular.test(wechat)){
		_showMsg("微信号码格式错误",null);
		return false;
	}
	return true;
}

function checkEmail(email){
	if(!email){
		return true;
	}
	var regular = /^(([^<>()\[\]\\.,;:\s@\"]+(\.[^<>()\[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	if(!regular.test(email)){
		_showMsg("邮箱号码格式错误",null);
		return false;
	}
	return true;
}

function checkNickNm(nickNm){
	if(!nickNm){
		_showMsg("用户名由6-20位字母或数字组成，且必须以字母开头",null);
		return false;
	}
	var regular = /^[a-zA-Z][0-9a-zA-Z]{5,19}$/;
	if(!regular.test(nickNm)){
		_showMsg("用户名由6-20位字母或数字组成，且必须以字母开头",null);
		return false;
	}
	return true;
}

function checkHmAdr(adr){
	if(!adr){
		return true;
	}
	var regular = /^([\u4e00-\u9fa5]|[a-zA-Z0-9]){1,100}$/;
	if(!regular.test(adr)){
		_showMsg("详细地址格式不正确",null);
		return false;
	}
	return true;
}
function checkFixedPhone(phone){
	var regular = /^\d{3,4}-\d{7,8}$/;
	if(!regular.test(phone)){
		_showMsg("固定电话格式不正确",null);
		return false;
	}
	return true;
}
function  checkPhoneNum(phone){
	var mobile = /^(13|15|18|17)[0-9]{9}$/;
	var regular = /^\d{3,4}-\d{7,8}$/;
	if(mobile.test(phone) || regular.test(phone) ){
		
		return true;
	}else{
		_showMsg("电话格式不正确",null);
		return false;
	}
	return false;
	
}


function checklicNoVal(licNo){
	if(!(licNo.substring(0,4)=='1301' || licNo.substring(0,4)=='1401' ||  licNo.substring(0,4)=='3505'  || licNo.substring(0,2)=='31' || licNoVal.substring(0,4)=='4401' || licNoVal.substring(0,4)=='5101')){
		_showMsg("请填写企业注册所在地为上海、太原、石家庄、泉州、广州和成都地区的营业执照号。",null);
		return false;
	}
	return true;
}