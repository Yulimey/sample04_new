/**
 * @author rm_shaohu
 * 网银交互
 */
var WangYin={
	topage : "_to_page",
	custNo:"",
	procError : function(json){
		var code = json.head._rd;
		var tp = json.body?json.body[this.topage]:null;
		if (tp) {
			window.location.href = tp;
		}else{
			showAlert(json.head._rm);
		}
	},
	//判断客户端是否登录
	checkIsLogin:function(){
		getLoginFlag();
	},
	//对特定页面进行操作检查
	checkPage:function(){
		var t = this;
		$("<div>").IFSAjax({
            code: "01_100809",
            data: {},
			async:false,
			show:"",
            complete: function(json){
				var error = json.head._rd!="0000";
                if (error) {
					t.custNo = "";
					t.procError(json);
                }else{
					t.custNo = json.body.custNo;
				}
            }
        });
	},
	submitIdNo:function(idNo){
		var t = this;
		$("<div>").IFSAjax({
            code: "01_100803",
            data: {"idNo":idNo,"custNo":t.custNo},
			show: "",
            complete: function(json){
				var error = json.head._rd!="0000";
				if (error) {
					t.procError(json);
                }else{
					window.location.href = json.body[t.topage];
				}
            }
        });
	},
	fastRegisterLoad:function(callback){
		var t = this;
		$("<div>").IFSAjax({
            code: "01_100804",
            data: {"custNo":t.custNo},
			show: "",
            complete: function(json){
				var error = json.head._rd!="0000";
                if (error) {
					t.procError(json);
                }else{
					callback(json);
				}
            }
        });
	},
	fastRegisterSubmit:function(jsonObj){
		var t = this;
		jsonObj.custNo = t.custNo;
		$("<div>").IFSAjax({
            code: "01_100805",
            data: jsonObj,
			show: "",
			lock:"fastRegSubmit",
            complete: function(json){
				var error = json.head._rd!="0000";
				if(error){
					t.procError(json);
				}else{
					showAlert("注册成功!");
					window.setTimeout(function(){
						window.location.href = json.body[t.topage];
					},2000);
				}
            }
        });
	},
	mobileVaildLoad:function(callback){
		var t = this;
		$("<div>").IFSAjax({
            code: "01_100806",
            data: {"custNo":t.custNo},
			show: "",
            complete: function(json){
				var error = json.head._rd!="0000";
                if (error) {
					t.procError(json);
                }else{
					callback(json);
				}
            }
        });
	},
	mobileVaildSubmit:function(msgNum,mobTel){
		var t = this;
		$("<div>").IFSAjax({
            code: "01_100807",
            data: {"custNo":t.custNo,"msgNumber":msgNum,"mobTel":mobTel},
			show: "",
            complete: function(json){
				var error = json.head._rd!="0000";
                if (error) {
					t.procError(json);
                }else{
					window.location.href = json.body[t.topage];
				}
            }
        });
	}
};