/**
 * FileName: text.input.js
 * Anchor: tangzf
 * Date: 2020-3-23
 * Description: 移动收费读卡
 */
 $(function () {
	/*
	$("#CardNo").keydown(function (e) {
		if(e.keyCode==13){
			ReadAdmCardShow();
			return false;
		}
	});
	*/
	var CreateFlag = INSUGetRequest('CreateFlag');

	
	var BusinessType = OSPGetParentVal('BusinessType');
	if(BusinessType == "DRINCRNO"){
		$('.pagetitle').find('label').text('请输入取号码');
	}
	if(CreateFlag && CreateFlag=="Y"){
		$('.pagetitle').find('label').text('建档中-请输入电话号码');
	}
	var role = OSPGetParentVal('client_dict', 'ss_eqlistd_role');
	if (role == "role2") {
		$("div.pagetitle").css({'padding':'10px 0'});
		$("div.pagetitle + div").css({'margin':'0 0 20px 0'});
		$("div.pagetitle + div>.sys-white-defbutton").css({'height':'55px'});
		$(".sys-white-defbutton-label").css({'line-height': '55px'});
		$(".keybord-region .keybord:not(.confirm)").css({'width': '110px', 'height':'60px'});
		$(".layui-btn[data]").css({'font-size': '30px'});
		$("div.sys-defbutton.confirm").css({'margin-top': '30px', 'height': '60px', 'width': '250px'});
		$("label.sys-defbutton-label").css({'line-height': '60px'});
	}
	$(".keybord-region").show();
	
	var KeyType = INSUGetRequest('KeyType');
    switch (KeyType) {
        case "letter":
            $('.letter').css('display','inherit');
            $('.Number').css('display','none')
            break;
		case "number":
			$('.letter').css('display','none');
			$('.Number').css('display','inherit')
			break;	
        default:
            break;
    }
	init_keybord();
 })
 

function init_keybord(){
	$('.keybord').on('click',function(){
		var keyId = $(this).text();
		var data = $(this).attr('data');
		if(data){
			keyId = data;
		}
		switch (keyId)  {
			case 'confirm':

				break;
			case 'clear':
				$("#CardNo").text('');
				break;
			case 'back':
				var InputVal = $("#CardNo").text();
				InputVal = InputVal.substring(0,InputVal.length - 1);
				$("#CardNo").text(InputVal);
				break;
			default:
				var InputVal = $("#CardNo").text();
				if(InputVal==""){
					InputVal = $(this).text();
				}else{
					InputVal = InputVal + $(this).text();
				}
				$("#CardNo").text(InputVal);
				break;
		}		
	});
	$('#confirm').on('click',function(){
		var tmpPro = $('#confirm').attr('disabled');
		if(tmpPro){
			return;
		}

		$('#confirm').attr('disabled','disabled');
		setTimeout(function(){
			$('#confirm').removeAttr('disabled');
		},3000)
		var CreateFlag = INSUGetRequest('CreateFlag');
		if(CreateFlag && CreateFlag=="Y"){
			CreatePatInfo();
			return false;
		}
		var BusinessType = OSPGetParentVal('BusinessType');
		if(BusinessType == "DRINCRNO" && $("#CardNo").text().length != 6 ){
			OSPAlert('','请输入6位加号码','提示',function(){
				return;
			});
			return;
		}
		if($("#CardNo").text() == ""){
			OSPAlert('','查询信息不能为空','提示',function(){
				return;
			});
			return;
		}
		Disabled(this,'confirm');
		var CurrentData =  "&InuputNo=" + $("#CardNo").text();
		GoNextBusiness(CurrentData);
		return false;
	});
}
function CreatePatInfo(){
	/*var ReadCardInfo = OSPGetParentVal("ReadCardInfo");
	var PatientName = ReadCardInfo.Name;
	var Sex = ReadCardInfo.Sex =="男"?"2":"1";
	var DOB = ReadCardInfo.brdy;
	var naty = ReadCardInfo.naty;
	var addr = ReadCardInfo.Address;
	var IDNo = ReadCardInfo.IDNo;
	var IDType = "01";
	var CardTypeCode = "01";
	var PatientType = "01";
	var Mobile = $("#CardNo").text();
	var RequestStr = "<Request><TradeCode>3014</TradeCode><Mobile>" + Mobile + "</Mobile><PatientType>" + PatientType + "</PatientType><CardTypeCode>" + CardTypeCode + "</CardTypeCode><IDNo>" + IDNo + "</IDNo><PatientName>" + PatientName +  "</PatientName><Sex>" + Sex + "</Sex><DOB>" + DOB + "</DOB><IDType>" + IDType + "</IDType><HospitalId>" + OSPGetParentVal('HospId') + "</HospitalId><UserID>" + OSPGetParentVal('UserCode')  + "</UserID></Request>"
	var jsonObj = tkMakeServerCall(RequestStr);
	rtn = jsonObj.Response.ResultCode;	
	if(rtn != '0'){
		OSPAlert('','建卡失败:' + jsonObj.Response.ResultContent,'提示' );
		return;
	}*/
	var Mobile = $("#CardNo").text();
	if(Mobile.length != 11){
		OSPAlert('',"请输入正确的手机号",'提示');
		return;
	}
	/*if(!(/^1[3|4|5|8][0-9]\d{4,8}$/.test(Mobile))){
		OSPAlert('',"请输入正确的手机号",'提示');
		return;
	}*/
	//return;
	var Input = {
		'TelePhoneNo' :Mobile
	}
	var jsonObj = PayServ_CreatePat(Input)
	if(jsonObj.Response.ResultCode !='0'){	
		OSPAlert('','患者建档失败:'+jsonObj.Response.ResultContent,'提示',function(){
			homePageClick();
			return;
		});
	}
	// 读HIS患者信息
	var jsonObj = PayServ_GetHisPatInfo();
	OSPSetParentVal('HisPatInfo',jsonObj.Response.PatInfos.PatInfo);
	//
	GoNextBusiness('');		
	return false;
}
