	var completeKeyboard = null;
    var RSA_PUBLIC_KEY = PATHSET.RSA_PUBLIC_KEY;
    var RSA_PUBLIC_KEY_SIG = PATHSET.RSA_PUBLIC_KEY_SIG;
    var serverRandom = null;
    var heightAdd;
    
	function getRandom(){
		var mobTelObj = {"passwdVersion": getCFCAKeyboardVersion()};
		var dataJson = JSON.stringify(mobTelObj);
        $(this).IFSAjax({
            code: setting.getRandom,
            data: dataJson,
            async: false,
            complete: random,
            method: "post"
        });
	}
    
    function random(data) {
        if (data.head._rd == '0000') {
            serverRandom = data.body.random;
        } else {
	        if(data.head._rm instanceof Array){
	        	_showMsg(data.head._rm[0].msg,null);
	    	}else{
	    		_showMsg(data.head._rm,null);
	    	}
	   	}
    }

	function setNeedHide(noNeedHideIds){

		var mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|Opera Mini/i.test(navigator.userAgent);
		setUpEvent(document, mobile ? "touchstart" : "fadeIn", function(e) {
        var elem = e.srcElement || e.target;
       
        while(elem) {
            if(noNeedHideIds.indexOf(elem.id) !== -1) {
                return;
            }
            elem = elem.parentNode;
        }
        completeKeyboard.hideKeyboard();
        contentBack();
		});
	
	}
	
	function setProperty2(sipboxId) {
		var keyboard = getKeyboard(sipboxId);
        var minLength = parseInt(1);
        var maxLength = parseInt(20);
        var inputRegex = "";
        if(CFCA_OK != keyboard.setMinLength(minLength, sipboxId)) alert("setMinLength error");
        if(CFCA_OK != keyboard.setMaxLength(maxLength, sipboxId)) alert("setMaxLength error");
        if(CFCA_OK != keyboard.setServerRandom(serverRandom, sipboxId)) alert("setServerRandom error");
        if(CFCA_OK != keyboard.setInputRegex(inputRegex, sipboxId)) alert("setInputRegex error");
	}
	
	function setProperty(sipboxId) {
        var keyboard = getKeyboard(sipboxId);
        var minLength = parseInt(6);
        var maxLength = parseInt(20);
        var inputRegex = "";
        if(CFCA_OK != keyboard.setMinLength(minLength, sipboxId)) alert("setMinLength error");
        if(CFCA_OK != keyboard.setMaxLength(maxLength, sipboxId)) alert("setMaxLength error");
        if(CFCA_OK != keyboard.setServerRandom(serverRandom, sipboxId)) alert("setServerRandom error");
        if(CFCA_OK != keyboard.setInputRegex(inputRegex, sipboxId)) alert("setInputRegex error");
    }
	
   
    function doneCallback(sipBoxId) {
       contentBack();
    }
    
    function initInput(sipboxId) {
    	var minLength = 6;
    	 initCompleteKeyboard(sipboxId,minLength);
         initSipBoxComplete(sipboxId);
    }
    
    function initInput2(sipboxId) {
    	var minLength = 1;
        initCompleteKeyboard(sipboxId,minLength);
        initSipBoxComplete(sipboxId);
    }
    
    function setUpEvent(elem, eventType, handler) {
        return (elem.attachEvent ? elem.attachEvent("on" + eventType, handler)
                : ((elem.addEventListener) ? elem.addEventListener(eventType, handler, false) : null));
    }
    function initCompleteKeyboard(sipboxId,minLength) {
        if(completeKeyboard == null) {
            completeKeyboard = new CFCAKeyboard("CompleteKeyboard", KEYBOARD_TYPE_COMPLETE);
        }
        completeKeyboard.hideKeyboard();
        // 设置回调
        completeKeyboard.setDoneCallback(doneCallback);
        // 设置随机数
        // 安全控件1和2需要绑定到全键盘
        completeKeyboard.bindInputBox(sipboxId);
        if(CFCA_OK != completeKeyboard.setServerRandom(serverRandom, sipboxId)) alert("setServerRandom error");
        if(CFCA_OK != completeKeyboard.setPublicKey(RSA_PUBLIC_KEY, RSA_PUBLIC_KEY_SIG, sipboxId)) alert("setPublicKey error");
        
        
        // 密码最小长度
        //var minLength = 6;
        // 密码最大长度
        var maxLength = 20;
        // 服务器随机数
        // var serverRandom = "01234567890123456789";
        // 正则表达式
        var inputRegex = "";
        if(CFCA_OK != completeKeyboard.setMinLength(minLength, sipboxId)) alert("setMinLength error");
        if(CFCA_OK != completeKeyboard.setMaxLength(maxLength, sipboxId)) alert("setMaxLength error");
        if(CFCA_OK != completeKeyboard.setInputRegex(inputRegex, sipboxId)) alert("setInputRegex error");
        
    }

//延时弹密码 开始
    function initSipBoxComplete(sipboxId) {
        var sipBox = document.getElementById(sipboxId);
        setUpEvent(sipBox, "click",function(event) {
        	var $sipBox=$(sipBox);
        	function _show(){
        		var errorStr = '<div class="errorbg" id="errorbg"></div>';
        		$("#CompleteKeyboard").before(errorStr);
        		var h=setTimeout(function(){
        			//sipBox.blur();
            		completeKeyboard.bindInputBox(sipboxId);
           	 		completeKeyboard.showKeyboard();
           	 		$("#errorbg").remove();
           	 	},550);
           	 	$sipBox.data('sipTime',h);
        	}
        	if($sipBox.data('sipTime')){
        		clearTimeout($sipBox.data('sipTime'));
        	}
        	_show();
        });
    }
    
//    function stopPropagation(e) {
//        if (e.stopPropagation) 
//            e.stopPropagation();
//        else 
//            e.cancelBubble = true;
//    }
    
//    $("body").on("click",":not(li)",function(e){
//    	stopPropagation(e);
//    	if(this.className == "_nothing"){
//    		return;
//    	}
//    	var $sipBoxAry = $("._nothing");
//    	for(var i = 0 ; i < $sipBoxAry.length; i++){
//    		if($($sipBoxAry[i]).data('sipTime')){
//    			clearTimeout($($sipBoxAry[i]).data('sipTime'));
//    		}
//    	}
//    	$("#errorbg").hide();
//    });
//延时弹密码 结束

    function getKeyboard(sipboxId) {
        
        return completeKeyboard;        
        
    }
    
    function contentMove(obj){
    		var kbH=$("#CompleteKeyboard").height();
    		var objH=$(window).height()-obj.offset().top;
    		if((kbH+60)>objH){
    			$('.content').eq(0).animate({top:-(kbH-objH+60)+'px'},'fast');
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
    		}
  		
    }
    
    function contentBack(){
  		$('.content').eq(0).animate({top:'0px'},'fast');
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
    }
    
    function clearInput(sipboxId) {
        var keyboard = getKeyboard(sipboxId);
        keyboard.clearInputValue(sipboxId);
    }
    
    function getEncrypt(sipboxId) {
   
        var keyboard = getKeyboard(sipboxId);
        // 获取加密结果数据
        var encryptedInputValue = keyboard.getEncryptedInputValue(sipboxId);
        // 获取加密相应码
        var errorCode = keyboard.getErrorCode(sipboxId).toString(16);
        //取到提示信息
        var placeholder=$("#"+sipboxId).attr('placeholder');
        if(errorCode != CFCA_OK) {
        	if(errorCode == '1004'){
        		_showMsg(placeholder,null);
        	}else if(errorCode=='1003'){
        		_showMsg("密码长度不能少于6位",null);
        	}else{
        		_showMsg(errorCode,null);
        	}
            return;
        } else{
        	return encryptedInputValue;
        }
    }
    
    function getLoginEncrypt(sipboxId) {
    	   
        var keyboard = getKeyboard(sipboxId);
        // 获取加密结果数据
        var encryptedInputValue = keyboard.getEncryptedInputValue(sipboxId);
        // 获取加密相应码
        var errorCode = keyboard.getErrorCode(sipboxId).toString(16);
        //取到提示信息
        var placeholder=$("#"+sipboxId).attr('placeholder');
        if(errorCode != CFCA_OK) {
        	if(errorCode == '1004'){
        		_showMsg(placeholder,null);
        	}else if(errorCode=='1003'){
        		_showMsg(placeholder,null);
        	}else{
        		_showMsg(errorCode,null);
        	}
            return;
        } else{
        	return encryptedInputValue;
        }
    }
    
    function getRangeSingle(start, end) {
        return new CFCAKeyboard.Range(
         parseInt(start, 10),
         parseInt(end, 10) );
    }

    function checkStrength(sipboxId){
	
		 var keyboard = getKeyboard(sipboxId);
		   	 
		 var flag = false;
		 var rt = getRangeSingle(6,20);
		 var rd = null;
		 var rl = null;
		 var ru = null;
		 var rs = null;
		 
		 //-----------------------------------------------------------------
		 //数字+小写
		 rd = getRangeSingle(1,20);
		 rl = getRangeSingle(1,20);
		 ru = null;
		 rs = null;
		 flag = keyboard.checkPasswordStrength(sipboxId, rt, rd, rl, ru, rs);
		 if(flag){
		    return true;
		 }
		 
		 //-----------------------------------------------------------------
		 //数字+大写
		 rd = getRangeSingle(1,20);
		 rl = null;
		 ru = getRangeSingle(1,20);
		 rs = null;
		 flag = keyboard.checkPasswordStrength(sipboxId, rt, rd, rl, ru, rs);
		 if(flag){
		    return true;
		 }
		     	 
		 //-----------------------------------------------------------------
		 //特殊字符+小写
		 rd = null;
		 rl = getRangeSingle(1,20);
		 ru = null;
		 rs = getRangeSingle(1,20);
		 flag = keyboard.checkPasswordStrength(sipboxId, rt, rd, rl, ru, rs);
		 if(flag){
		    return true;
		 }
		 
		 //-----------------------------------------------------------------
		 //特殊字符+大写
		 rd = null;
		 rl = null;
		 ru = getRangeSingle(1,20);
		 rs = getRangeSingle(1,20);
		 flag = keyboard.checkPasswordStrength(sipboxId, rt, rd, rl, ru, rs);
		 if(flag){
		    return true;
		 }
		 
		 //-----------------------------------------------------------------
		 //特殊字符+数字
		 rd = getRangeSingle(1,20);
		 rl = null;
		 ru = null;
		 rs = getRangeSingle(1,20);
		 flag = keyboard.checkPasswordStrength(sipboxId, rt, rd, rl, ru, rs);
		 if(flag){
		    return true;
		 }
		 
		 return false;
	
    }
    
    function getVersion() {
    	alert("Version: " + getCFCAKeyboardVersion()); 
    }
