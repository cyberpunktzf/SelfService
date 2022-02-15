/**
 * FileName: prereg.doctor.timeinfo.js
 * Anchor: tangzf
 * Date: 2020-4-26
 * Description: 预约挂号-分时段查询
 */
var GV = {
	DocInfo: '',
	BGJClass: ''
}
$(function () {
	var role = OSPGetParentVal('client_dict', 'ss_eqlistd_role');
	if (role == "role2") {
		GV.BGJClass = 'bgj';
		$('.pagetitle').css('padding', '0');
		//$('.timeinfo').css({'display': 'flex', 'flex-wrap': 'wrap'});
	}

	var ParamStr = INSUGetRequest('Param');
	var ParamObj = JSON.parse(ParamStr);
	GetHISDocTimeInfo(ParamObj);
});
 
//1 查询日期
 function GetHISDocTimeInfo(){
	var ParamStr = INSUGetRequest('Param');
	var rtnInfo = JSON.parse(ParamStr);
	var RBASSessionCode  = rtnInfo.SessionCode;
	var ScheduleItemCode  = rtnInfo.ScheduleItemCode;
	var ServiceDate = rtnInfo.ServiceDate;
	GV.DocInfo = rtnInfo
	var OutPut ={

	}
	var jsonObj = PayServ_GetSchedule(OutPut);
	AddDocToHtml(jsonObj);
 }
function AddDocToHtml(jsonObj){
	$('.DeptName').text('【您所选的医生号别为：' + GV.DocInfo.DoctorTitle + '】');
	var htmlStr="";
	if(!jsonObj.Response.TimeRanges){
		OSPAlert('',jsonObj.Response.ResultContent,'提示',function(){
			rebackClick();
		});
		return;
	}
	var TimeArr = jsonObj.Response.TimeRanges.TimeRange;
	if(!TimeArr.length){
		TimeArr = [
			TimeArr
		]
	}
	if(TimeArr.length > 6){
		$('body').css('overflow-y','scroll') ;
	}
	$.each(TimeArr, function(index, val){
		var ButtonText  = TimeArr[index].StartTime.substring(0,5)  + '-' + TimeArr[index].EndTime.substring(0,5);
		htmlStr = htmlStr + "<div class='sys-white-defbutton " + GV.BGJClass + "'>";
		htmlStr = htmlStr + "	<label class='sys-white-defbutton-label' data='" + JSON.stringify(TimeArr[index]) + "'>" + ButtonText + "</label>";
		htmlStr = htmlStr + "</div>";
	});
	$(".timeinfo").prepend(htmlStr);
	$(".sys-white-defbutton").bind("click",function(){
		Disabled(this,'.sys-white-defbutton');
		var InputObj = $(this).find('.sys-white-defbutton-label').attr('data');
		if(!InputObj){
			return;
		}
		Charge(InputObj);
	});
}

function Charge(InputObj){
	var BusinessType = OSPGetParentVal('BusinessType');
	var rtnInfo = JSON.parse(InputObj);
	var ScheduleItemCode = rtnInfo.ScheduleItemCode;
	var Param = "&";
	if(BusinessType == "ORDR"){
		var AdmitRange = rtnInfo.StartTime + '-' +  rtnInfo.EndTime;
		var LockQueueNo = "";
		var TransactionId = "";
		Param = "&AdmitRange=" + AdmitRange + "&TransactionId=" + TransactionId + "&LockQueueNo=" + LockQueueNo + "&ScheduleItemCode=" + ScheduleItemCode;
	}
	GoNextBusiness(Param);
	return false;
 }