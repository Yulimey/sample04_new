/**
 * IFS-Ajax 支持ie6+、谷歌、火狐浏览器
 * @arguments 綁定html控件
 * @version 1.0
 * @Depend jQuery 1.9+
 */
!(function($) {
	'use strict';
	var IFSAjax = {
		options : {
			'method' : setting.sumbitMethod,// 提交方式,使用配置文件的参数
			'data' : '',
			'url' : '',
			'token' : false,
			'load' : false,
			'async':true,
			'download' : false,
			'lock':'',
			'transcode' : '',	//fs交易码
			'channel': '',		//fs渠道码
			'envelopDom': '',	//需要自动封包的dom节点
			'timeout' : 60000
		},

		// 表单提交自动封包的表单
		targetForm : null,
		// 绑定的事件,方便扩展
		event : null,
		/**
		 * 初始化 支持a select button submit div span p li
		 * 
		 */
		init : function() {
			// a 标签绑定
			$("a[ifs-code]:not([ifs-bind])").each(function() {
				var link = $(this);
				IFSAjax.setBind(link);
				link.on('click', function() {
					$(this).IFSAjax();
				});
			});
			// 下拉框绑定
			$('select[ifs-code]:not([ifs-bind])').each(function() {
				var select = $(this);
				IFSAjax.setBind(select);
				select.on('change', function() {
					$(this).IFSAjax();
				});
			});
			// 按钮绑定
			$('button[ifs-code]:not([ifs-bind])').each(function() {
				var button = $(this);
				IFSAjax.setBind(button);
				button.on('click', function(e) {
					// submit按钮需要特殊处理,主要表现在自动封装submit form的报文并阻止onSubmit提交
					if ($(this).attr("type") == "submit") {
						// 使用e.preventDefault()阻止submit自动提交
						IFSAjax.event = e;
						// 设置表单数据自动封包
						IFSAjax.targetForm = button.parents("form");
					}
					$(this).IFSAjax();
				});
			});

			// div绑定
			$('div[ifs-code]:not([ifs-bind])').each(function() {
				var div = $(this);
				IFSAjax.setBind(div);
				div.on('click', function() {
					$(this).IFSAjax();
				});
			});
			// span绑定
			$('span[ifs-code]:not([ifs-bind])').each(function() {
				var span = $(this);
				IFSAjax.setBind(span);
				span.on('click', function() {
					$(this).IFSAjax();
				});
			});
			
			// li绑定
			$('li[ifs-code]:not([ifs-bind])').each(function() {
				var li = $(this);
				IFSAjax.setBind(li);
				li.on('click', function() {
					$(this).IFSAjax();
				});
			});
			
			// p绑定
			$('p[ifs-code]:not([ifs-bind])').each(function() {
				var p = $(this);
				IFSAjax.setBind(p);
				p.on('click', function() {
					$(this).IFSAjax();
				});
			});
		},

		/**
		 * 控件绑定 原因： 1
		 * 因为使用live无效，ajax加載的元素，无法使用，所以只能再加载一遍IFSAjax.init()，这里是为了避免重复绑定同一元素 2
		 * 获取options
		 */
		setBind : function($obj) {
			$obj.attr("ifs-bind", 1);
		},
		/**
		 * 赋值
		 * 
		 * @return $this 当前对象
		 */
		setOptions : function(element, option) {
			var $this = $(element);
			if ("undefined" == option || null == option) {
				var options = $.extend({}, IFSAjax.options, {
					// FlowSwitch交易码
					"code" : $this.attr("ifs-code") == undefined ? "" : $this
							.attr("ifs-code"),
					// ajax提交方式,默认POST
					"method" : $this.attr("ifs-method"),
					// ajax回调方法
					"complete" : $this.attr("ifs-complete") == undefined ? ""
							: eval($this.attr("ifs-complete")),
					// 回到结果的提示方式,值为：alert、dialog或html id
					"show" : $this.attr("ifs-show") == undefined ? "" : $this
							.attr("ifs-show"),
					// 回调的报文体显示的html id
					"view" : $this.attr("ifs-show") == undefined ? "" : $this
							.attr("ifs-view"),
					// 超时设置
					"timeout" : $this.attr("ifs-timeout"),
					// 循环调用设置
					"interval" : $this.attr("ifs-interval") == undefined ? ""
							: $this.attr("ifs-interval"),
					// 文件下载设置
					"download" : Boolean($this.attr("ifs-download")),
					// ajax提交的数据,json格式
					// "data": $this.attr("ifs-data") == undefined ? "" :
					// $this.attr("ifs-data")
					"envelopDom" : ($this.attr("ifs-data") != undefined && $this.attr("ifs-data").indexOf("#") == 0) ?  $this.attr("ifs-data") : "",
					"data" : ($this.attr("ifs-data") != undefined && $this.attr("ifs-data").indexOf("#") == -1) ? eval($this.attr("ifs-data"))
							: "",
					// 是否要传递cas token
					"token" : Boolean($this.attr("ifs-token")),
                    "load" : Boolean($this.attr("ifs-load"))
				});
				$(element).data("options", options);
			} else {
				$(element)
						.data("options", $.extend({}, IFSAjax.options, option));
			}
		},
		/**
		 * 发送ajax请求
		 * 
		 * @param options
		 */
		ajaxSend : function(options) {
			var data = options.data;
			var mh = "";
			if(options.data) {
				if(typeof options.data=='object'){
					options.data=$.toJSON(options.data);
				}
				var hexStr = CryptoJS.enc.Utf8.parse(options.data);
				mh = msg_md5(hexStr.toString().toUpperCase());
				
				var txn = options.channel + "_" + options.transcode;
				var index = setting.ENCLIST.indexOf(txn, 0);
				if(index >= 0){
					options.data = msg_encrypt(options.data.toString());
				}
								
			} else {
				options.data = "{}";
			}
			
			$.ajax({
				type : options.method,
				url : options.url,
				dataType : 'json',
				data : options.data,
				timeout : options.timeout,
				cache : false,
				async : options.async,
				contentType : 'application/json; charset=UTF-8',
				// crossDomain:true,
				beforeSend : function(XMLHttpRequest) {
					//取得验证码的值
					var vc = $("#_vc").val();
					if(vc == null || vc == undefined) {
						vc = "";
					}
					// 添加http header
					addHttpHeader(options.transcode, options.channel, XMLHttpRequest, options.token, vc, mh);
                    if(options.load){
                        showLoadingDialog("加载中...");
                    }
					if(options.lock!="" && options.lock!=null){
						$("#"+options.lock).attr("disabled","disabled").attr("class","btn-primary btn-block transButton fontcenter");
					}
				},
				error : function(XMLHttpRequest, status, thrownError) {
					if (!IFSAjax.callErrorBackFunction(options, XMLHttpRequest, status, thrownError))
						return;
				},
				success : function(msg) {
					if(msg!=undefined  && setting.CHECKTOKEN.indexOf(options.transcode)>-1){
						_RANDOM_TOKEN=msg.head? msg.head._token:"";
					}
					if (!IFSAjax.callBackFunction(options, msg))
						return;
				}
			});
		},
		/**
		 * ajax 事件 这里callback特意采用json格式，如果有需要可以在这里修改
		 * 
		 */
		ajaxClick : function(element) {
			var enctype = false;
			var files;
			// 获取当前对象
			// $this = IFSAjax.setOptions($(this));
			var options = $(element).data("options");
			options.method = options.method.toUpperCase();

			// 检查交易码和渠道码,如果没有,阻止提交
			if ((undefined == options.code) || ('' == options.code)) {
				showAlert("没有交易码和渠道码,无法提交");
				return;
			}
			// 检查交易码和渠道码,如果缺少其中之一,阻止提交
			if (options.code.split("_").length < 1 || options.code.split("_").length > 2) {
				showAlert("交易码格式不正确,无法提交");
				return;
			}
			var tmp = options.code.split("_");
			if(tmp.length == 1) {
				options.transcode = tmp[0];
			}else {
				options.channel = tmp[0];
				options.transcode = tmp[1];
			}
			// 阻止submit按钮的onSubmit事件
			if (this.event != null) {
				this.event.preventDefault();
				this.event = null;
			}
			// submit方式表单自动封包
			if (this.targetForm != null) {
				//判断是否为文件提交
				if(this.targetForm.attr("enctype") != null && this.targetForm.attr("enctype") != undefined) {
					enctype = true;
					files = this.targetForm.find("input[type='file'][ifs-muti='false']");
				}
				var param = IFSAjax.targetForm.getJson();
				options.data = param;
				IFSAjax.targetForm = null;
			}
			
			if(options.envelopDom != "") {
				options.data = $(options.envelopDom).getJsonData();
			}

			options.url = router.match(options.code);
			if (options.url == null) {
				showAlert("交易码没有匹配到路由前置,无法提交");
				return;
			}
			/**
			 * 设置参数 v value;t text
			 */
			var _paramsArr = "";
			if (options.params) {
				_paramsArr = IFSAjax.attr2param(options);
				if ("GET" == options.method) {
					options.url += "?" + $.param(_paramsArr);
				} else {
					options.data = $.param(_paramsArr);
				}
			}
			// 阻止submit按钮的onSubmit事件
			//取得验证码的值
			var vc = $("#_vc").val();
			if(vc == null || vc == undefined) {
				vc = "";
			}
			IFSAjax.ajaxSend(options);
			// ajax定时任务set interval
			if ((undefined != options.interval) && ('' != options.interval)) {
				window.setInterval(function() {
					IFSAjax.ajaxSend(options);
				}, options.interval * 1000);
			}
		},
		/**
		 * ajax成功默认执行方法
		 * 
		 */
		callBackFunction : function(options, msg) {
			//console.log(msg);
			//var _result = {result:JSON.parse(msg.result)};
			//msg = _result;
			if(options.lock!="" && options.lock!=null){
				$("#"+options.lock).removeAttr("disabled");
				$("#"+options.lock).attr("class","btn-primary btn-block fontcenter");
			}
            if(options.load){
                cannelLoadingDialog();
            }
			if ((undefined == msg) || (null == msg))
				return false;
			
			if(msg.head._rd != null && msg.head._rd != "") {
				if(msg.head._rd == setting.SESSIONERROR){
					if(window.location.href.indexOf(setting.LOGINPAGE) == -1){
						goTo(setting.LOGINPAGE);
					}
					_showMsg(msg.head._rm);
					return false;
				}else if(msg.head._rd == setting.INPUTERROR){
					if(msg.head._rm instanceof Array){
						_showMsg(msg.head._rm[0].msg);
						return false;
					}
					
				}else if(msg.head._rd == setting.CONNECTERROR){
						_showMsg(msg.head._rm,null);
						return false;
				}else if(msg.head._rd == setting.APPLYERROR){
						_showMsg(msg.head._rm,null);
						return false;
				}else if(msg.head._rd == setting.ERROR){
						window.location.href = "error.html";
						return false;
				}
			}

			if("" != options.show) {
				if("alert" == options.show) {
					if(msg.head._rm != null && msg.head._rm != "") {
						showAlert(msg.head._rm);
						return false;
					}
				}
			}
			
			if (options.complete) {
				// 自定义方法
				// eval(IFSAjax.options.complete + "(msg)");
				options.complete(msg);
				return false;
			}
			return true;
		},
		/**
		 * 自定义错误回调
		 */
		callErrorBackFunction:function(options,XMLHttpRequest, status, thrownError){
			if(options.lock!="" && options.lock!=null){
				$("#"+options.lock).removeAttr("disabled");
				$("#"+options.lock).attr("class","btn-primary btn-block fontcenter");
			}
			if(status == "timeout"){
				showAlert("请求超时！");
			}
			if(status == "error"){
				window.location.href = "error.html";
			}
			if(options.load){
				cannelLoadingDialog();
			}
			if(options.error){
				options.error(status,XMLHttpRequest);
				return;
			}
			return true;
		},
		/**
		 * 属性转换为参数
		 */
		attr2param : function(options) {
			var _paramsArr = {};
			eval('var _eval_params = (' + options.params + ')');
			$.each(_eval_params, function(param, type) {
				var $temp = $("#" + param);// 临时对象
				var _val = "";// 获取值ֵ
				switch (type) {
				case "t":
					_val = $temp.text();
					break;

				case "v":
					_val = $temp.val();
					break;

				default:
					_val = type;

				}
				_paramsArr[param] = _val;
			});
			return _paramsArr;
		}
	};
	// 初始化控件
	IFSAjax.init();
	$.fn.IFSAjax = function(option) {
		// if (!$(this).data("options")) {
		IFSAjax.setOptions(this, option);
		// }
		IFSAjax.ajaxClick(this);
	};
})(jQuery);
