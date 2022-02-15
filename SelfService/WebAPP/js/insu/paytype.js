/**
 * FileName: dhcbillinsu.offselfpro.charge.readcard.js
 * Anchor: tangzf
 * Date: 2020-3-23
 * Description: 移动收费读卡
 */
 $(function () {
	var clientdict = OSPGetParentVal('client_dict');
	var role = clientdict['ss_eqlistd_role'];
	if (role == "role2"){
		$('.menu-center-content').addClass('bgj-menu-center-content');
		$('.layui-row').css('margin-right','50px')
	}
	
	var InsuType = OSPGetParentVal('InsuType'); 
	var RYLB = OSPGetParentVal('RYLB');
	var ProcessCode = OSPGetParentVal('processcode');
	// 费别   2 城址  4城特   3城乡门特  1自费 8城乡居民
	if(RYLB == "2"){ // 1 城职   2 城乡 医保返回
		$('div[data=4]').find('label').text('城乡门特');
		$('div[data=4]').attr('data',"3");
		//
		$('div[data=2]').find('label').text('城乡居民');
		$('div[data=2]').attr('data',"8");
	}
	//核酸只能挂自费
	if(ProcessCode == "NAReg-Reg"){
		$('div[data=2]').css('display',"none");
		$('div[data=4]').css('display',"none");
		$('div[data=3]').css('display',"none");
	}
	// 取科室自费标志
	var DepInsuType = OSPGetParentVal('DepInsuType');
	// 自费科室 不走医保接口
	// 不能加 InsuType==1   ，会导致选不了患者类型 直接跳过
	if(InsuType == "" || DepInsuType == "1"){
		var Param = '&Param=1';
		PayServ_UpdateHIType(1,"Y")
		GoNextBusiness(Param,"Skip");
	}
	//科室控制医保类型
	//科室允许哪些医保类型
	var UnableReasonList = OSPGetParentVal('UnableReasonList');
	var AdmReasonDr = "";
	if(UnableReasonList !=""){
		if(RYLB == "2"){ //  城乡  但是科室不允许城乡		
			if(UnableReasonList.indexOf('3') > -1){
				$('div[data=3]').css('display',"none");
			}
		}else{ // 城镇职工
			if(UnableReasonList.indexOf('2') > -1){ // 不允许 城职
				$('div[data=2]').css('display',"none");
			}
			if(UnableReasonList.indexOf('4') > -1){ // 不允许城职门特
				$('div[data=4]').css('display',"none");
			}
		}
	}
	var role = OSPGetParentVal('client_dict', 'ss_eqlistd_eqcode');
	if (role == "BGJ17" || role == "ZZJ40" || role == "ZZJ25") {
		$('div[data=4]').css('display',"none");
	}
	var FJHFlag = OSPSetParentVal('FJHFlag');
	if(FJHFlag == "Y"){
		$('div[data=4]').css('display',"none"); // [data=4/3] HIS费别3和4代表 城职门特 城乡门特
		$('div[data=3]').css('display',"none");
	}
	init_btn();
 })
 
 function init_btn(){
	$('.btnSelect').on("click",function(){
		
		var data = $(this).attr('data');
		PayServ_UpdateHIType(data,"Y")
		//医保患者校验是否允许进行医保结算
		if(data != "1"){
			var InputObj = {
				'CheckCode':'PatType',
				'RuleType' :'checkStopInsu'
			}
			var checkFlag = checkStop(InputObj);
			if(checkFlag.result !="0" || !checkFlag){
				return false;
			}
		}
		var Param = '&Param=' + data;
		GoNextBusiness(Param);
		return false;
	});
}
