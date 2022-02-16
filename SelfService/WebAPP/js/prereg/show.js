/**
 * FileName: charge.divide.show.js
 * Anchor: tangzf
 * Date: 2020-3-23
 * Description: 移动收费-缴费信息确认(医保预结算已完成)
 */
var Global={
	InvStr:[],
	CateInfo:[],
	ConfirmFlag : ""
 }
 var ScheInfo;
 var DBClick;
 $(function () {
	 try {
		 $('.divide-btn').hide();
		//壁挂机界面处理
		var role = OSPGetParentVal('client_dict', 'ss_eqlistd_role');
		if (role == "role2"){
			$('.layui-row').css('padding-top','5px');
			$('.divide-foot-row').css({'position': 'absolute','top':'420px','left':'370px'});
			
			$(".divide-show").css({'height': '405px'});
			$(".layui-col-md6").css({'padding-top': '65px'});
			$(".layui-col-md7").removeClass().addClass("layui-col-md6");
			$(".divide-label").css({'font-size': '20px', 'line-height':'27px'});
			$(".divide-show-row:nth-child(1)").css({'padding-top': '20px'});
			$(".sys-defbutton").css({'height': '60px'});
			$(".sys-defbutton-label").css({'line-height': '60px'});
		}
		$(".main-divide-show-def").show();
	
		var BusinessType = OSPGetParentVal('BusinessType');
		if(BusinessType == "DRINCRNO"){
			$('.pagetitle').find('label').text('请确认加号信息');
			$('.pagetitle').find('label').val('请确认加号信息');
		}
		// 业务开始
		var BusinessType = OSPGetParentVal('BusinessType');
		// 判断是否允许取号
		if(BusinessType == "OBTNO"){
			var InputObj = {
				'CheckCode': "OBTNO"
			}
			var checkFlag = checkRules(InputObj,rebackClick);
			if(checkFlag.result != 0 || !checkFlag) {
				return false;
			}
		}
		//测试用
		var role = OSPGetParentVal('client_dict', 'ss_eqlistd_eqcode');
		//if (role == "BGJ19" && BusinessType == "Reg"){
			var ExceptionInfo = PayServ_GetChgException();	
			if(ExceptionInfo.output !="undefined"){
				ExceptionInfo = ExceptionInfo.output;
				ExceptionInfo = JSON.parse(ExceptionInfo);
				var InsuExceptionInfo = ExceptionInfo.divRows;
			}
			$.each(InsuExceptionInfo,function(index,val){
				if(typeof val.divideId != "undefined"){
					if(val.divideId !="" && val.bizType == "R"){
						PayServ_StrikeInsuRegSingle(val.divideId);
					}
					if(val.divideId !="" && val.bizType == "F"){
						PayServ_StrikeInsuSingle(val.divideId);
					}
				}
			});
		if (role == "BGJ19" && BusinessType == "Reg"){

		}
		// 判断是否允许挂号
		AddLoading();
		setTimeout(function(){
			if(BusinessType == "Reg" ){
				var InputObj = {
					'CheckCode' : "RegCheck"
				}
				var checkFlag = checkRules(InputObj,rebackClick);
				if(checkFlag.result != 0 || !checkFlag){
					RemoveLoading();
					return false;
				}
				// 获取排班
				ScheInfo = PeyServ_GetDocDate();
				if(typeof ScheInfo.result != "undefined"){
					if(ScheInfo.result != "0"){
						homePageClick();
						return false;
					}
				}
				if(ScheInfo.Response.ResultCode	!= 0 || ScheInfo.Response.RecordCount < 1){
					RemoveLoading();
					OSPAlert('', ScheInfo.Response.ResultContent,'提示|Y',function(){
						var processcode = OSPGetParentVal('processcode');
						if (processcode == "NAReg-Reg"){
							homePageClick();
						}else{
							rebackClick();
						}
					});
					return;
				}
				if(ScheInfo.Response.RecordCount == 1){
					var tmpB = ScheInfo.Response.Schedules.Schedule;
					ScheInfo.Response.Schedules.Schedule = [tmpB];
				}
				// 保存排班信息
				var InputObj = {};
				InputObj['TradeCode'] = 'SaveBD';
				InputObj['modal_code'] = 'ScheduleInfo';
				InputObj['intef_output'] = JSON.stringify(ScheInfo.Response.Schedules.Schedule[0]);
				var rtn = CallMethod(InputObj,'',"CallPythonService","N");
				if(rtn.result != 0){
					RemoveLoading();
					homePageClick();
					return;
				} 
				//PayServ_UnlockReg();
				// 1.锁号
				var rtn = PayServ_LockReg();  //prereg/show.js
				
				if(rtn.Response.ResultCode != 0){
					RemoveLoading();
					OSPAlert('', rtn.Response.ResultContent, '提示',function(){
						rebackClick();
						return false;
					});
					return;
				}
				if(typeof rtn.Response.TransactionId !="undefined"){
					OSPSetParentVal('CurrentPayOrd',rtn.Response.TransactionId);
				}	
			}
			// 2.医保预结算
			var ProcessCode = OSPGetParentVal('processcode')
			if(ProcessCode == "NAReg-Reg"){ // 核酸只能挂自费号
				PayServ_UpdateHIType("1","Y");
			}
			var INSUPreRegRtn = PayServ_INSUPreReg();  //prereg/show.js
			RemoveLoading();
			if(INSUPreRegRtn.split('^')[0] != 0 ){
				if(INSUPreRegRtn.indexOf('应该是城居医保') > - 1){
					INSUPreRegRtn = "此病人是城居医保，只能用现金支付";
				}
				if(INSUPreRegRtn.indexOf('请选择门特类别') > - 1){
					INSUPreRegRtn = "HIS医生站科室慢病对照未维护";
				}
				OSPAlert('',INSUPreRegRtn,'提示|Y',function(){
					homePageClick();
					return false;
				});
				return;
			}	
			//alert("医保返回串" + rtn);
			init_title(INSUPreRegRtn);
		},150);
	 } catch (error) {
		OSPAlert('confirm','获取挂号费用发生异常，是否重试','提示',function(r){
			if(r){
				location.href=location.href; 
			}else{
				homePageClick();
				return false;
			}
		});
	 }
});

// <Response><ResultCode>0</ResultCode><RecordCount>1</RecordCount><Schedules><Schedule><ScheduleItemCode>56||12</ScheduleItemCode><ServiceDate>2021-07-23</ServiceDate><WeekDay>5</WeekDay><SessionCode>06</SessionCode><SessionName>24小时</SessionName><StartTime>00:00</StartTime><EndTime>23:59</EndTime><DepartmentCode>149</DepartmentCode><
// >肾内科门诊</DepartmentName><DoctorCode>56</DoctorCode><DoctorName>翟留玉</DoctorName><DoctorTitleCode>81</DoctorTitleCode><DoctorTitle>普通号</DoctorTitle><DoctorSessTypeCode>81</DoctorSessTypeCode><DoctorSessType>普通号</DoctorSessType><Fee>15</Fee><RegFee>0</RegFee><CheckupFee>15</CheckupFee><OtherFee>0</OtherFee><AvailableNumStr>5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,96,97,98,99,100,101</AvailableNumStr><AdmitAddress>2层内科诊区11诊室</AdmitAddress><ScheduleStatus>1</ScheduleStatus><AvailableTotalNum>100</AvailableTotalNum><AvailableLeftNum>96</AvailableLeftNum><TimeRangeFlag>1</TimeRangeFlag><JointFlag>N</JointFlag></Schedule></Schedules></Response>
function init_title(INSURtn){ 
	try {
		var BusinessType = OSPGetParentVal('BusinessType');
		var Fee = 0;
		if(BusinessType != "Reg"){
			var InputObj = {};
			InputObj['TradeCode'] = 'GetShowInfo';
			var rtn = CallMethod(InputObj,'',"CallPythonService","N");
			var ScheInfoDet = OSPWebServicesXMLStr2Json(rtn.output).Response;
			Fee = ScheInfoDet.Fee;
		}else {
			var InputObj = {};
			InputObj['TradeCode'] = 'GetShowInfo';
			var rtn = CallMethod(InputObj,'',"CallPythonService","N");
			var ScheInfoDet = OSPWebServicesXMLStr2Json(rtn.output).Response;
			Fee = ScheInfoDet.Fee;
			var ScheInfoDet = ScheInfo.Response.Schedules.Schedule[0];
		}
		//OSPSetParentVal('CurrentPayOrd',OrderNo);
		var name = OSPGetParentVal('HisPatInfo').PatientName;
		var sex = OSPGetParentVal('HisPatInfo').SexCode == 1 ? "男" : "女";
		var age = OSPGetParentVal('HisPatInfo')['Age'];
		var loc = ScheInfoDet.DepartmentName;
		var doc = ScheInfoDet.DoctorName;
		var title = ScheInfoDet.DoctorTitle;
		var admdatetime = ScheInfoDet.SessionName;
		if(ScheInfoDet.StartTime){admdatetime = (ScheInfoDet.StartTime||"") + "-" + (ScheInfoDet.EndTime||"");}
		
		var regfee = Fee;
		var insupay = 0;
		var insuaccout = 0;
		var InsuType = OSPGetParentVal('InsuType');
		var RYLB = OSPGetParentVal('RYLB');
		var insutypeDesc = "";
		var MTLB = OSPGetParentVal('MTLB');
		var diag = "";
		if(MTLB !=""){
			diag = "门特"
		}
		if(RYLB == "1"){
			insutypeDesc = "城镇职工" + diag;
		}else if(RYLB == "2"){
			insutypeDesc = "城乡居民" + diag;
		}else{
			insutypeDesc = "自费";
		}
		if(InsuType == "" || InsuType == "1" ){
			insutypeDesc = "自费";
		}
		var INSUSelfAmt = regfee;
	
		var INSUSelfAmt = regfee;
		//标志为医保
		if(InsuType != '' && InsuType != '1' ){
			if(INSURtn.split('^')[0] != 0 ){
				OSPAlert('',INSURtn,'提示');
				return;
			}
			var INSUInfo = INSURtn.split('!')[1];
			//
			INSUSelfAmt = INSUInfo.split(String.fromCharCode(2))[0].split('^')[1];
			insupay = 0 ;//INSUInfo.split(String.fromCharCode(2))[1].split('^')[1];
			insuaccout =0 ;// INSUInfo.split(String.fromCharCode(2))[2].split('^')[1];
			//20210929add
			INSUPayArr = INSUInfo.split(String.fromCharCode(2));
			$.each(INSUPayArr,function(index,val){
				if(index == 0){
				}else{
					var paymode = val.split('^')[0];
					if(paymode == "33"){
						insuaccout =  val.split('^')[1];
					}else{
						var payamt =  val.split('^')[1];
						insupay = +(+insupay) + (+payamt);
					}	

				}
			});
			//insupay = insupay + INSUInfo.split(String.fromCharCode(2))[1].split('^')[1];
		}
		if(+INSUSelfAmt == 0){
			//GoNextBusiness()
			//return;
		}
		var processcode =  OSPGetParentVal('processcode');
		if(BusinessType == "DRINCRNO" || processcode == "NAReg-Reg" || processcode == "Reg"){
			admdatetime = ScheInfoDet.SessionName;
		}else if(processcode == "NAReg-Reg"){
			admdatetime = "";
		}
		setTimeout(function(){
			$('#name').text(name);
			$('#sex').text(sex);
			$('#age').text(age);
			$('#loc').text(loc);
			$('#doc').text(doc);
			$('#title').text(title);
			$('#admdatetime').text(admdatetime);
			$('#insutype').text(insutypeDesc);
			$('#regfee').text(formatAmt(regfee));
			$('#insupay').text(formatAmt(insupay));
			$('#insuaccout').text(formatAmt(insuaccout));
			$('#SelfAmt').text(formatAmt(INSUSelfAmt));
		
			$('.name').text(name);
			$('.sex').text(sex);
			$('.age').text(age);
			$('.loc').text(loc);
			$('.doc').text(doc);
			$('.title').text(title);
			$('.admdatetime').text(admdatetime);
			$('.insutype').text(insutypeDesc);
			$('.regfee').text(formatAmt(regfee));
			$('.insupay').text(formatAmt(insupay));
			$('.insuaccout').text(formatAmt(insuaccout));
			$('.SelfAmt').text(formatAmt(INSUSelfAmt));
			$('.divide-btn').show();
		},300);
	} catch (error) {
		OSPAlert('confirm','获取挂号费用发生异常，是否重试？','提示',function(){
			location.href=location.href; 
		});
	}
}

function DivideConfirm() {
	var css = $(this).attr('class');
	Disabled(this,css);
	var BusinessType = OSPGetParentVal('BusinessType');
	if(BusinessType == "Reg"){
		var tmpA = ScheInfo.Response.Schedules.Schedule[0];
		var param = "&Param= " + JSON.stringify(tmpA);
	}else {
		var param = "";
	}
	if(DBClick == "Y"){
		return false;
	}
	DBClick = "Y";
	setTimeout(function(){
		GoNextBusiness(param);
		return false;
	},500)
	return false;
}