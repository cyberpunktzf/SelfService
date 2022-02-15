/**
 * FileName: prereg.doctor.timeinfo.js
 * Anchor: tangzf
 * Date: 2020-4-26
 * Description: 查询菜单
 */

$(function () { 
	$('#mainBack',parent.document).css('display','block');
	OSPSetParentVal('UnionFlag',"Y");
	$('.sys-white-defbutton').bind("click",function(){
		var buttonId = $(this).attr('id');		
		OSPSetParentVal('processcode', buttonId);	
		//根据流程代码 获取流配置
		var input = {
			"ss_pc_dictype" : "Business",
			"ss_pc_processcode" : buttonId,
			"TradeCode" : "GetDicDataDemoByTypeCode"
		}
		CallMethod(input,BuildProcess,"DoMethod");
	});
 });
function BuildProcess(jsonObj){
	var json = JSON.parse(jsonObj.output[0]);
	var ConfigObj = JSON.parse(json.ss_pc_demo); 
	OSPSetParentVal('Business', ConfigObj); 
	//根据流程所属的业务类型 进行初始化 业务类型
	OSPSetParentVal('BusinessType', json.ss_pc_diccode);
	OSPSetParentVal('CurrentBusiness', 0);
	// 生产自助服务业务流水号
	var rtn = PayServ_Init();
	if(rtn.result == 0){
		GoNextBusiness('');
		return false;
	}else{
		OSPAlert('',rtn.msg,'提示');
		return;
	}
}