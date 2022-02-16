/**
 * FileName: charge.main.js
 * Anchor: tangzf
 * Date: 2020-3-23
 * Description: 移动收费主页
 */
var OSPPatGlobal = {
	'SYSDateTime':'', // 系统时间
	"SYSLeftTime": 90, // 使用common中的剩余时间
	'BusinessType' :'', //业务类型	
	'Business':{}, // 业务集合
	'CurrentBusiness': 0, // 当前业务
	'serial_id':'',	// 自助机业务流水id
	'serial_number' : '',	// 自助机业务流水号
	'InsuType':'', // 空表示未选择医保类型 1 表示自费
	'ReadCardType':'', // 0表示身份证 ，1 表示医保卡 ，2 表示条形码,3电子医保卡
	'HisPatInfo' :{},
	'bd_id' :'',
	'CurrentDivide':1,
	'processcode':'', // 流程代码
	'RYLB':'2', // 医保人员类别
	'client_dict':'', // 客户端配置信息
	'MTLB':'',		// 门特类别
	'RebackFlag':'', // 返回标志 返回操作时为Y  返回时继续返回     程序跳过的业务
	'DepInsuType':'', // 科室费别标志 
	'UnableReasonList':'', //科室不允许的费别标志,
	'PayFlag':'', // 最终pay.html界面标志
	"CreatePayFlag":'', // 微信支付宝创建订单标志，
	'CPrintObj':{},
	'TotalDivide':0,
	'CurrentPayOrd':'',
	'DepDesc':'', // 科室
	'DocPage':'1', //医生页码 默认第一页
	"FJHFlag":'' // 附加号标志  如果是附加号 不显示特病
}

 $(function () {
	//DHC_PrintByService("");
	window.setInterval("BuildDatetime()",1000);
	//loadCLodop();
	/*setTimeout(function(){
		var lodopObj = getLodop();
		OSPPatGlobal.CPrintObj = lodopObj;
		//alert(3 + "=" + lodopObj)
	},1500)*/
	return;
	for (key in GLOBALXMLConfig){
		var tmpStr = "";
		if(key==""){
			var RequestStr = '<Request><TradeCode>GetXMLConfig</TradeCode><XMLName>' + key + '</XMLName></Request>';
			var ParamObj = key;
			CallWebService(RequestStr,GetHISXmlConfig,"N",ParamObj);
		}
	}
 });
function GetHISXmlConfig(xmlStr,paramObj){
	GLOBALXMLConfig[paramObj]=xmlStr;
 }
