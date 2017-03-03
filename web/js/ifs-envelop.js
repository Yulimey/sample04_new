;$.fn.serializeObject = function() {
	var o = {};
	var a = this.serializeArray();
	$.each(a, function() {
		if (o[this.name] !== undefined) {
			if (!o[this.name].push) {
				o[this.name] = [ o[this.name] ];
			}
			o[this.name].push(this.value || '');
		} else {
			o[this.name] = this.value || '';
		}
	});
	return o;
};
// 对于DOM元素的数据构造
(function($) {
	$.fn.getJson = function() {
		var elements = this;
		var json = {};
		initElements(elements.get(0), json);
		return $.toJSON(json);
	};

	$.fn.getJsonData = function() {
		var elements = this;
		var json = {};
		initElements(elements.get(0), json);
		return json;
	};

	function createTreeJson(key, keys, json, type) {
		var o = json;
		var index = 0;
		for (var i = 0; i < keys.length; i++) {
			if (keys[i]) {
				if (!o[keys[i]]) {
					// 针对checkbox的特殊处理
					o[keys[i]] = {};
					o = o[keys[i]];
				} else {
					o = o[keys[i]];
					index++;
				}
			}
		}
		// 如果相同，则表示json中存在同样的属性
		var isHave = index == keys.length;
		if (!o[key]) {
			if (type == 'checkbox') {
				o[key] = [];
			} else {
				o[key] = {};
			}
			isHave = false;
		}
		return isHave;
	}

	function setJsonValue(key, keys, json, value, type) {
		var o = json;
		for (var i = 0; i < keys.length; i++) {
			if (keys[i]) {
				if(!o[keys[i]]){
					o[keys[i]]={};
					o = o[keys[i]];
				}else{
					o = o[keys[i]];
				}
			}
		}
		if (type == 'checkbox') {
			o[key].push(value);
		} else {
			o[key] = value;
		}
	}

	// elements
	function initElements(element, json) {
		var dom = $(element);
		if (dom.attr("ifs_parent")) {
			var key = dom.attr("id");
			getElementValue(element, json, key, dom.attr("ifs_parent"));
			return;
		}
		for (var i = 0; i < element.children.length; i++) {
			initElements(element.children[i], json);
		}
	}

	// getValue
	function getElementValue(element, json, key, ifs_parent) {
		var tagName = element.tagName;
		var object = {};
		// 去掉开头的/
		var keys = ifs_parent.substr(1).split('/');
		switch (tagName) {
		case "INPUT":
			switch (element.type) {
			case "radio":
				key = element.name;
				createTreeJson(key, keys, json, element.type);
				if (element.checked) {
					setJsonValue(key, keys, json, element.value);
				}
				return;
			case "checkbox":
				key = element.name;
				createTreeJson(key, keys, json, element.type);
				setJsonValue(key, keys, json, element.value, element.type);
				return;
			default:
				object = element.value;
			}
			break;
		case "SELECT":
			createTreeJson(key, keys, json, element.type);
			// 多选
			if ($(element).attr("multiple")) {
				var options = element.children;
				object = [];
				for (var i = 0; i < options.length; i++) {
					if (options[i].selected) {
						object.push(options[i].value);
					}
				}
			} else {
				// 单选
				object = element.value;
			}
			break;
		case "TEXTAREA":
		case "DIV":
		case "SPAN":
			createTreeJson(key, keys, json, element.type);
			object = element.innerHTML;
			break;
		}
		setJsonValue(key, keys, json, object, element.type);
		return;
	}
})($);

// 数据回填
(function($) {
	$.fn.bindData = function(json) {
		var elements = this;
		initElements(elements.get(0), json);
	};
	function initElements(element, json) {
		var dom = $(element);
		var ifs_parent = dom.attr('ifs_parent');
		if (ifs_parent) {
			var keys = ifs_parent.substr(1).split('/');
			setElementValue(element, json, keys);
			return;
		}
		for (var i = 0; i < element.children.length; i++) {
			initElements(element.children[i], json);
		}
	}
	function setElementValue(element, json, keys) {
		var type = element.type;
		var key;
		if (type == 'radio') {
			key = element.name;
		} else if (type == 'checkbox') {
			key = element.name;
		} else {
			key = element.id;
		}
		var o = json;
		for (var i = 0; i < keys.length; i++) {
			if (keys[i]) {
				o = o[keys[i]];
			}
		}
		if (!(typeof (o[key]) == 'undefined')) {
			switch (element.tagName) {
			case 'INPUT':
				switch (element.type) {
				case 'radio':
					element.checked = false;
					if (element.value == o[key]) {
						element.checked = true;
					}
					break;
				case 'checkbox':
					element.checked = false;
					for (var i = 0; i < o[key].length; i++) {
						if (element.value == o[key][i]) {
							element.checked = true;
							break;
						}
					}
					break;
				}
				element.value = o[key];
				break;
			case 'SELECT':
				if ($(element).attr("multiple")) {
					// 多选
					if (toString.apply(o[key]) == '[object Array]') {
						var options = element.children;
						var os = o[key];
						for (var i = 0; i < options.length; i++) {
							// 重置每个选项状态
							options[i].selected = false;
							for (var j = 0; j < os.length; j++) {
								if (options[i].value == os[j]) {
									options[i].selected = true;
									break;
								}
							}
						}
					}
				} else {
					// 单选
					var options = element.children;
					for (var i = 0; i < options.length; i++) {
						if (options[i].value == o[key]) {
							options[i].selected = true;
						}
					}
				}
				if ($(element).attr("ifs-select-cascade")) {
					$(element).trigger("change.ifs")
				}
				break;
			case "TEXTAREA":
			case "DIV":
			case "SPAN":
			case "TABLE":
			default:
				element.innerHTML = o[key];
			}
		}
	}

})($);
function getNode(node, nodeName) {
	var nodes = nodeName.split("/");
	var str = "";
	for (var i = 0; i < nodes.length; i++) {
		if (nodes[i]) {
			str = str + "." + nodes[i];
		}
	}
	return eval('node' + str);
}
function envelop(node) {
	function _addField(id, xpath) {
		var element = $("#" + id);
		var nodes = xpath.split("/");
		var o = _json;
		for (var i = 0; i < nodes.length; i++) {
			if (nodes[i]) {
				o[nodes[i]] = {};
				o = o[nodes[i]];
			}
		}
		o[id] = _getElementValue(element.get(0));
	}
	function _getElementValue(element) {
		var tagName = element.tagName;
		var object;
		switch (tagName) {
		case "INPUT":
			object = element.value;
			break;
		case "SELECT":
			if ($(element).attr("multiple")) {
				var options = element.children;
				object = [];
				for (var i = 0; i < options.length; i++) {
					if (options[i].selected) {
						object.push(options[i].value);
					}
				}
			} else {
				object = element.value;
			}
			break;
		case "TEXTAREA":
		case "DIV":
		case "SPAN":
			object = element.innerHTML;
			break;
		}
		return object;
	}

	function _getJsonData() {
		return _json;
	}

	function _getJsonString(){
		return $.toJSON(_json);
	}
	var _this = this;
	var _json = {};
	var _data = [];
	_this.addField = _addField;
	_this.getJsonData = _getJsonData;
	_this.getJsonString = _getJsonString;

}
function customJson(node) {
	function _init() {
		if (node) {
			_json = node;
		}
	}
	function _addChildNode(k, v) {
		if (typeof (v) == 'undefined') {
			_json[k] = {};
		} else {
			_json[k] = v;
		}
		return new customJson(_json[k]);
	}
	function _addNode(k, v) {
		if (typeof (v) == 'undefined') {
			_json[k] = {};
		} else {
			_json[k] = v;
		}
		return new customJson(_json[k]);
	}
	function _getJsonData() {
		return _json;
	}
	function _getJsonString(){
		return $.toJSON(_json);
	}
	var _this = this;
	var _json = {};
	_this.addChildNode = _addChildNode;
	_this.addNode = _addNode;
	_this.getJsonData = _getJsonData;
	_this.getJsonString = _getJsonString;
	_init();
}