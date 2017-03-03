var collectDevInfo = true;
var browser_version = browser.versions;
function loadCss(fileUrl){
    if(browser_version.mobile && browser_version.webKit){
        if(browser_version.android){
            //document.write("<link rel='stylesheet' href='"+fileUrl+"css/android/ratchet.css?v=<VER>'>");
           // document.write("<link rel='stylesheet' href='"+fileUrl+"css/android/ratchet-theme-ios.css?v=<VER>'>");
           // document.write("<link rel='stylesheet' href='"+fileUrl+"css/android/cmbc.css?v=<VER>'>");
        	document.write("<link rel='stylesheet' href='"+fileUrl+"css/android/andriod-all.css?v=<VER>'>");
        }else if(browser_version.iPhone && browser_version.ios){
            //document.write("<link rel='stylesheet' href='"+fileUrl+"css/ios/ratchet.css?v=<VER>'>");
            //document.write("<link rel='stylesheet' href='"+fileUrl+"css/ios/ratchet-theme-ios.css?v=<VER>'>");
            //document.write("<link rel='stylesheet' href='"+fileUrl+"css/ios/cmbc.css?v=<VER>'>");
        	 document.write("<link rel='stylesheet' href='"+fileUrl+"css/ios/ios-all.css?v=<VER>'>");
        }else{
           // document.write("<link rel='stylesheet' href='"+fileUrl+"css/ios/ratchet.css?v=<VER>'>");
           // document.write("<link rel='stylesheet' href='"+fileUrl+"css/ios/ratchet-theme-ios.css?v=<VER>'>");
           // document.write("<link rel='stylesheet' href='"+fileUrl+"css/ios/cmbc.css?v=<VER>'>");
        	 document.write("<link rel='stylesheet' href='"+fileUrl+"css/ios/ios-all.css?v=<VER>'>");
        }
    }else{
       // document.write("<link rel='stylesheet' href='"+fileUrl+"css/ios/ratchet.css?v=<VER>'>");
        //document.write("<link rel='stylesheet' href='"+fileUrl+"css/ios/ratchet-theme-ios.css?v=<VER>'>");
        //document.write("<link rel='stylesheet' href='"+fileUrl+"css/ios/cmbc.css?v=<VER>'>");
    	 document.write("<link rel='stylesheet' href='"+fileUrl+"css/ios/ios-all.css?v=<VER>'>");
    }
}
function loadJs(fileUrl){
    //document.write("<script language='javascript' src='"+fileUrl+"js/core.js'></script>");
   // document.write("<script language=javascript src='"+fileUrl+"js/cipher-core.js'></script>");
   // document.write("<script language=javascript src='"+fileUrl+"js/aes.js' ></script>");
   // document.write("<script language=javascript src='"+fileUrl+"js/base64.js'></script>");
   // document.write("<script language=javascript src='"+fileUrl+"js/md5.js'></script>");
	document.write("<script language=javascript src='"+fileUrl+"js/encrypt-all.js?v=<VER>'></script>");
	// document.write("<script language=javascript src='"+fileUrl+"js/ratchet.js'></script>");
    //document.write("<script language=javascript src='"+fileUrl+"js/jquery.js'></script>");
    //document.write("<script language=javascript src='"+fileUrl+"js/jquery.json-2.4.js'></script>");
    // document.write("<script language=javascript src='"+fileUrl+"js/jquery.params.js'></script>");
	document.write("<script language=javascript src='"+fileUrl+"js/context.js?v=<VER>'></script>");
	document.write("<script language=javascript src='"+fileUrl+"js/jquery-ratchet-all.js?v=<VER>'></script>");
    document.write("<script language=javascript src='"+fileUrl+"js/ifs-router.js?v=<VER>'></script>");
    document.write("<script language=javascript src='"+fileUrl+"js/ifs-config.js?v=<VER>'></script>");
    //document.write("<script language=javascript src='"+fileUrl+"js/ifs-ajax.js'></script>");
   // document.write("<script language=javascript src='"+fileUrl+"js/common.js'></script>");
    //document.write("<script language=javascript src='"+fileUrl+"js/ifs-regular.js'></script>");
    //document.write("<script language=javascript src='"+fileUrl+"js/ifs-envelop.js'></script>");
    //document.write("<script language=javascript src='"+fileUrl+"js/wangyin.js'></script>");
    //document.write("<script language=javascript src='"+fileUrl+"js/carousel.js'></script>");
    document.write("<script language=javascript src='"+fileUrl+"js/ifs-all.js'></script>");
}
function setPageTitle(v){
    var title={
        "title": v.title,
        "leftButton":{
            "exist":"true",
            "func":"goToPage()"//左侧按钮回调事件
        }
    };
    try{
    	setTitleBar(title);//调用手机银行cmbcForClient.js方法
    }catch(e){}
}
function setPageTitleToNav(v){
    var title={
        "title": v.title,
        "leftButton":{
            "exist":"false" //如果左侧按钮不需要回调事件，点击该按钮返回到手机银行
        }
    };
    try{
    	setTitleBar(title);//调用手机银行cmbcForClient.js方法
    }catch(e){}
}
function setIndexPageTitle(v){
    var title={
        "title": v.title,
        "leftButton":{
            "exist":"false"
        }
        /*,
         "rightButton":{
         "exist":"true",
         "name":"返回上一级",
         "func":"goToPage()"
         }*/
        //如果需要右侧按钮放开以上注释，根据手机银行提供的接口说明文档定义相关属性
    };
    try{
    	setTitleBar(title);//调用手机银行cmbcForClient.js方法
	}catch(e){}
}
var pageUrl;
function goToPage(){ //左侧按钮回调事件
    window.location.href= pageUrl;
}

var info={}; //接收获取到手机银行信息
function getClientInfo(){ //获取手机银行信息（设备、客户端、经纬度信息）
    if(collectDevInfo){ //sit测试用为true，uat为false
    	try{
	        getDeviceMessage();//获取设备信息-调用手机银行cmbcForClient.js方法-异步执行
	        getClientInformation("setClientInformation");//获取客户端信息-调用手机银行cmbcForClient.js方法-异步执行
	        getLatLongitude("setLatLongitudeCallBack");//获取经纬度-调用手机银行cmbcForClient.js方法-异步执行
    	}catch(e){}
    }
}

function setLatLongitudeCallBack(lat,lng){//获取经纬度信息回调
    info["lat"]=lat;
    info["lng"]=lng;
}
function deviceMessage(message){//获取设备信息回调
    var phoneType = getPhoneType();
    var _m = JSON.parse(message);//ios与android获取的信息不同
    if(phoneType == "1"){
        info["opSys"]="ios";
        info["iosId"] = _m.md5ID;
        info["iosIdfa"] = _m.idfa;
    }else if(phoneType == "2"){
        info["opSys"]="android";
        info["andrdMac"] = _m.MAC;
        info["andrdId"] = _m.ID;
        info["andrdImsnd"] = _m.IMSI;
        info["andrdImei"] = _m.IMEI;
    }
}
function setClientInformation(clientInformation){//获取客户端信息回调
    var _m = JSON.parse(clientInformation);
    info["appId"]=_m.CMBCAppType;
}