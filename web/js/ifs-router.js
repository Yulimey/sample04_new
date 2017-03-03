/**
 * 交易码路由配置,可以全字符匹配，也可以正则表达式匹配
 */
var routers = {
		'01_200001' : PATHSET.PEPATH+'/01_200001.do',	//获取用户cookie
		'01_200101' : PATHSET.PEPATH+'/01_200101.do',	//用户注册-短信下发
	    '01_200102' : PATHSET.PEPATH+'/01_200102.do',	//用户注册-短信验证
	    '01_200103' : PATHSET.PEPATH+'/01_200103.do',	//用户注册-注册用户信息（身份证或银行卡）
	    '01_200201' : PATHSET.PEPATH+'/01_200201.do',	//手机用户登录交易
	    '01_200202' : PATHSET.PEPATH+'/01_200202.do',	//手机用户登出交易
	    '01_200301' : PATHSET.PEPATH+'/01_200301.do',	//短信下发
	    '01_200304' : PATHSET.PEPATH+'/01_200304.do',	//密码找回（验证短信验证码）
	    '01_200501' : PATHSET.PEPATH+'/01_200501.do',	//密码修改
	    '01_200307' : PATHSET.PEPATH+'/01_200307.do',	//密码修改（请求短信验证码）
	    '01_200502' : PATHSET.PEPATH+'/01_200502.do',	//密码找回（先验证图片验证码，在下发短信）
	    '01_200503' : PATHSET.PEPATH+'/01_200503.do',	//手机号码更换（原手机验证，请求手机号）
	    '01_200504' : PATHSET.PEPATH+'/01_200504.do',	//基本信息-个人信息查询（页面初始化加载）
	    '01_200505' : PATHSET.PEPATH+'/01_200505.do',	//基本信息-个人信息修改
	    '01_200506' : PATHSET.PEPATH+'/01_200506.do',	//手机号码更换（原手机验证，请求手机号）
	    '01_200507' : PATHSET.PEPATH+'/01_200507.do',	//企业信息-信息查询
	    '01_200508' : PATHSET.PEPATH+'/01_200508.do',	//企业信息-信息修改
	    '01_200509' : PATHSET.PEPATH+'/01_200509.do',	//密码找回（更新新密码）
	    '01_200510' : PATHSET.PEPATH+'/01_200510.do',	//用户中心-展示用户概要信息
	    '01_200511' : PATHSET.PEPATH+'/01_200511.do',	//昵称设置（用户登录名，保存后不可修改）
	    '01_200512' : PATHSET.PEPATH+'/01_200512.do',	//新手机号绑定（验证短信码）
	    '01_200513' : PATHSET.PEPATH+'/01_200513.do',	//昵称设置回显（用户登录名，保存后不可修改）
	    '01_200517' : PATHSET.PEPATH+'/01_200517.do',	//基本信息-个人信息(直系亲属)查询
	    '01_200514' : PATHSET.PEPATH+'/01_200514.do',	//基本信息-个人信息(直系亲属)新增
	    '01_200515' : PATHSET.PEPATH+'/01_200515.do',	//基本信息-个人信息(直系亲属)修改
	    '01_200516' : PATHSET.PEPATH+'/01_200516.do',	//基本信息-个人信息(直系亲属)删除	
	    '01_200518' : PATHSET.PEPATH+'/01_200518.do',	//qq微保存修改
	    '01_200601' : PATHSET.PEPATH+'/01_200601.do',	//贷款申请-正式签约 	
	    '01_200602' : PATHSET.PEPATH+'/01_200602.do',	//贷款申请-弱担保检查
	    '01_200603' : PATHSET.PEPATH+'/01_200603.do',	//授权认证检查
	    '01_200604' : PATHSET.PEPATH+'/01_200604.do',	//银行名称查询
	    '01_200606' : PATHSET.PEPATH+'/01_200606.do',	//贷款申请-确认信息
	    '01_200607' : PATHSET.PEPATH+'/01_200607.do',	//贷款申请-银行卡认证-汇款
	    '01_200608' : PATHSET.PEPATH+'/01_200608.do',	//贷款申请-银行卡认证-验证（同时授权银行可查询用户征信信息）
	    '01_200609' : PATHSET.PEPATH+'/01_200609.do',	//贷款申请-正式申请(回显用户信息)
	    '01_200610' : PATHSET.PEPATH+'/01_200610.do',	//贷款申请-正式申请
	    '01_200611' : PATHSET.PEPATH+'/01_200611.do',	//申请记录查询
	    '01_200612' : PATHSET.PEPATH+'/01_200612.do',	//申请记录查询	
	    '01_200613' : PATHSET.PEPATH+'/01_200613.do',	//申请记录查询
	    '01_200614' : PATHSET.PEPATH+'/01_200614.do',	//贷款申请-确认信息详情
	    '01_200615' : PATHSET.PEPATH+'/01_200615.do',	//贷款申请-确认信息初始化
	    '01_200616' : PATHSET.PEPATH+'/01_200616.do',	//贷款申请-正式签约初始化
	    '01_200701' : PATHSET.PEPATH+'/01_200701.do', 	//数据字典查询
	    '01_200702' : PATHSET.PEPATH+'/01_200702.do', 	//城市地区查询
	    '01_200703' : PATHSET.PEPATH+'/01_200703.do',	//非安全安，注册身份证手机号码校验
	    '01_200704' : PATHSET.PEPATH+'/01_200704.do',	//安全 手机号码，用户名校验
	    '01_200617' : PATHSET.PEPATH+'/01_200617.do',	//申请确认授权书界面
	    '01_200618' : PATHSET.PEPATH+'/01_200618.do',    //查询银行卡认证次数
	    '01_200901' : PATHSET.PEPATH+'/01_200901.do',	//签约查询直系亲属
	    '01_100809' : PATHSET.PEPATH+'/01_100809.do',	//页面访问校验
		'01_100803' : PATHSET.PEPATH+'/01_100803.do',	//身份证号录入校验
		'01_100804' : PATHSET.PEPATH+'/01_100804.do',	//快速注册反显
		'01_100805' : PATHSET.PEPATH+'/01_100805.do',	//快速注册提交
		'01_100806' : PATHSET.PEPATH+'/01_100806.do',	//提示验证反显
		'01_100807' : PATHSET.PEPATH+'/01_100807.do',	//提示验证提交
		'01_100811' : PATHSET.PEPATH+'/01_100811.do',	//提示账号验证
	    '01_100302' : PATHSET.PEPATH+'/01_100302.do',	//动态校验码图片产生器	
	    '01_201000' : PATHSET.PEPATH+'/01_201000.do', 	//检查会话(与其他渠道共用)
	    '01_100111' : PATHSET.PEPATH+'/01_100111.do',	//登录时校验是否显示验证码(与其他渠道共用)
	    '03_100306' : PATHSET.PEPATH+'/03_100306.do',     //获取随机数(与其他渠道共用)
	    '01_200902' : PATHSET.PEPATH+'/01_200902.do',      //wizard查询缓存的值到页面
	    '01_200309' : PATHSET.PEPATH+'/01_200309.do',     //wizard找回密码短信下发
	    '01_200800' : PATHSET.PEPATH+'/01_200800.do',      //签约手机联合登录
	    '01_200705' : PATHSET.PEPATH+'/01_200705.do',      //签约卡号检查联系人身份证
	    '01_200619' : PATHSET.PEPATH+'/01_200619.do',       //贷款申请检查白名单
	    '01_200520' : PATHSET.PEPATH+'/01_200520.do'       //关于我们
};
/**
 * 根据路由配置匹配到fs前置
 */
var router = {
    routes : routers,
    match : function(code) {
        for ( var key in this.routes) {
            // 首先判断是否为正则表达式,如果不是,直接匹配交易码
            if (!router.isReg(key)) {
                if (key == code) {
                    return this.routes[key];
                }
            } else {
                var trimLft = key.substring(1);
                var regKey = trimLft.substring(trimLft.length - 1);
                var pattern = new RegExp(regKey, 'g');
                if (code.match(pattern) != null) {
                    return this.routes[key];
                }
            }
        }
        return null;
    },
    /**
     * 判断是否为正则表达式
     *
     * @param code
     * @returns {Boolean}
     */
    isReg : function(code) {
        var tmp = code.substring(0,1);
        if(tmp == '/') {
            return true;
        } else {
            return false;
        }
        // return Object.prototype.toString.call(code) == '[object ' + RegExp +
        // ']';
    }
};
