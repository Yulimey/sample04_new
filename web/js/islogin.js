$(function() {
	$(this).IFSAjax({
		code : '01_201000',//session检查
		data : null,
		method : "post",
		async : false,
		complete : function(result) {
			if(result.head!=undefined){
				_RANDOM_TOKEN=result.head? result.head._token:"";
			};
			if (result.head._rd == "0000") {
			} else {
				goTo("../login.html");
			}
		}
	});
	
	
})

