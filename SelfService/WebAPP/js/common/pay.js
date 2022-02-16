/**
 * FileName: dhcbillinsu.offselfpro.charge.readcard.js
 * Anchor: tangzf
 * Date: 2020-3-23
 * Description: 移动收费-支付方式
 */
var OrderCode = "";
var selectPayModeInfo = "";
var LockInfo = "";
var CancelFlag = "Y";
var QueryTime = 3000; // 轮询间隔 单位毫秒
var timer; 
var qcodewidth = 256;
var qcodeheight = 256;
$(function () {
		$('#mainBack',parent.document).css('display','none');
		//AddLoading();
		setTimeout(function(){
			$('#mainBack',parent.document).css('display','block');
		},(QueryTime + 1000));
		//倒计时
		var tmpLeftTime = INSUGetRequest("lefttime");
		if(typeof tmpLeftTime == "undefined" || tmpLeftTime == ""){
			tmpLeftTime = '180';
		}
		OSPSetParentVal('SYSLeftTime',tmpLeftTime);
		//
		$('#qrcode').css('display','none');
		var role = OSPGetParentVal('client_dict', 'ss_eqlistd_role');
		if (role == "role2"){
			$('.level1-title').css('line-height','0px');
			qcodewidth = 206;
			qcodeheight = 206;
			$('.sys-white-defbutton').css('width','450');
			$('.sys-white-defbutton').css('height','478');
			$('.pay-body').css('padding-top','0px');
			$('#qrcode').css('width','250px');
			$('#qrcode').css('height','278px');
			$('#qrcode').css('margin-left','105px');
		}
		// 标题
		var SYSpatName = OSPGetParentVal('HisPatInfo').PatientName;;
		var patName = "当前付款患者:" + SYSpatName.substring(0,1) + "*" + SYSpatName.substring((SYSpatName.length-1),SYSpatName.length);
		$('.patname').text(patName);
		let p0 = Loading();
		p0.then(data=>{
			selectButton();
			RemoveLoading();
		});
});
// 生成二维码
function BuildQRCode(title){
	$('#qrcode').css('display','block');
	$('.title1').text('请您核对付款人姓名后扫码 ');
	$('.title2').text('手机支付中不要点击返回按钮！');
	var qrcode = new QRCode('qrcode', { 
		text: title, 
		width: qcodewidth, 
		height: qcodeheight, 
		colorDark : '#000000', 
		colorLight : '#ffffff', 
		correctLevel : QRCode.CorrectLevel.H 
	}); 
}
function selectButton(){
		var PayFlag = OSPGetParentVal('PayFlag');
		if(PayFlag == "Y"){
			return false;
		}
		OSPSetParentVal('PayFlag','Y');
		var BusinessType = OSPGetParentVal("BusinessType");
		var PayModeCode = INSUGetRequest('PayModeCode');
		switch (BusinessType) {
			case "Reg":
			case "OBTNO":
			case 'DRINCRNO':
				if (PayModeCode != "WECHAT" && PayModeCode != "AlIPAY"){
					// 4.医保结算
					var rtn = PayServ_INSUReg();
					// 5.挂号
					if(rtn){
						PayServ_OPReg();
					}
				}else{
					var rtn = PayServ_ExtPayService();
					timer = setInterval(function(){
						// 支付结果查询
						rtn = PayServ_QueryExtPayService();
						if(rtn == "0"){
							clearInterval(timer);
							// 4.医保结算
							var rtn = PayServ_INSUReg();
							// 5.挂号
							if(rtn){
								PayServ_OPReg();
							}
						}
					},QueryTime)
				}
				break;
			case "Charge": // 收费
				// 1.HIS预结算
				//PayServ_PreHisDivide();
				// 2.医保预结算
				//PayServ_INSUPreDivide();
				// 3.第三方支付
				if (PayModeCode != "WECHAT" && PayModeCode != "AlIPAY"){
					// 4.医保结算
					var rtnINSUDivide = PayServ_InsuOPDivideCommit();
					if(rtnINSUDivide.split('^')[0] != '0'){
						OSPAlert('','医保结算失败:' + rtnINSUDivide,'提示|Y',function(){
							homePageClick();
						});
						return;
					}
					// 5.HIS确认完成
					if(rtnINSUDivide.split('^')[0] == "0"){
						PayServ_CompleteCharge();
					} 
				}else{
					var rtn = PayServ_ExtPayService();
					timer = setInterval(function(){
						// 支付结果查询
						rtn = PayServ_QueryExtPayService();
						if(rtn == "0"){
							clearInterval(timer);
							// 4.医保结算
							var rtnINSUDivide = PayServ_InsuOPDivideCommit();
							if(rtnINSUDivide.split('^')[0] != '0'){
								OSPAlert('','医保结算失败:' + rtnINSUDivide,'提示|Y',function(){
									homePageClick();
								});
								return;
							}
							// 5.HIS确认完成
							if(rtnINSUDivide.split('^')[0] == "0"){
								PayServ_CompleteCharge();
							} 
						}
					},QueryTime)
				}
				break;
			case "ORDR": // 预约
				// 1.预约
				$('.pay-body').css('display','none');
				PayServ_OPPreReg();
				break;
			default:
				OSPAlert('','不存在的业务代码','提示|Y',function(){
					homePageClick();
				});
				break;
		}
}
 window.onbeforeunload = function(e){
	OSPSetParentVal('PayFlag','');
	OSPSetParentVal('CreatePayFlag','');
}