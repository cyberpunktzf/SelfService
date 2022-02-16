/**
 * FileName: dhcbillinsu.offselfpro.charge.readcard.js
 * Anchor: tangzf
 * Date: 2020-3-23
 * Description: 移动收费-支付方式
 */
var SelfAmt;
$(function () {
	var tmpLeftTime = INSUGetRequest("lefttime");
    if(typeof tmpLeftTime == "undefined" || tmpLeftTime == ""){
        tmpLeftTime = '180';
    }
	OSPSetParentVal('SYSLeftTime',tmpLeftTime);
	$(".sys-white-defbutton-icon").hide();
	var role = OSPGetParentVal('client_dict', 'ss_eqlistd_role');
	if (role == "role2") {
		$("div.pagetitle").css({'padding':'10px 0'});
		$("div.pagetitle + div").css({'padding-top':'90px'});
		$('#YHK').css('display','none');
	}
	//取支付金额
	var ScheInfoDet = PayServ_GetInsuAmt();
	if(ScheInfoDet.result != 0){
		OSPAlert('',ScheInfoDet.msg + ",请返回主页并且重新尝试",'提示',function(){
			homePageClick();
			return;
		});
		return;
	}
	SelfAmt = ScheInfoDet.output.split('^')[0];
	if(+SelfAmt == "0"){
		var ParamInput = "&PayModeCode=&PayModeId=";
		GoNextBusiness(ParamInput,"Skip");
		return false;
	}
	$(".sys-white-defbutton-icon").show();
	//根据配置显示支付方式
	var payMInfo = PayServ_GetPayMode();
	if(payMInfo.result != "0"){
		OSPAlert('','生成支付方式列表失败','提示',function(){
			homePageClick();
		});
		return;
	}
	for (let index = 0; index < payMInfo.output.length; index++) {
		const val = payMInfo.output[index];
		var PayModeCode = val['PayModeCode'];
		var PayModeDesc = val['PayModeDesc'];
		var PayModeID = val['PayModeId'];
		var payMStr = PayModeID + '^' + PayModeCode + '^' + PayModeDesc;
		var payMHtmlStr =	'<div class="layui-col-md4"> \
								<div class="sys-white-defbutton-icon" data-options="icons:icon-btn-' + PayModeCode + '" title="' + PayModeDesc + '" data="' + payMStr + '"></div>\
							</div>'
		$('.payMInfo').prepend(payMHtmlStr);
	}
	BuildSYSIconBtn()
	//按钮
	init_btn();
});
function init_btn(){
	//初始化按钮
	$(".sys-white-defbutton-icon").on("click",function(e){
		try {
			// 隐藏其他支付方式
			$(".sys-white-defbutton-icon").hide();
			// 隐藏返回
			$("#mainBack", parent.document).css('display','none');
			var Param = $(this).attr('data');
			AddLoading();
			var CurrentPayOrd = OSPGetParentVal('CurrentPayOrd');
			var ParamInput = "&PayModeCode=" + Param.split('^')[1] + "&PayModeId=" + Param.split('^')[0] + '&CurrentPayOrd=' + CurrentPayOrd + '&OrderAmt=' + SelfAmt;
			//业务处理
			// 银行卡业务处理
			setTimeout(function(){
				PayServ_SaveBDInfo('paymode',ParamInput,'',"6666"); 
				// 48	AdapayCPP	聚合支付银行卡
				if( Param.split('^')[1] == "JHZFYHK"){
					var input = {
						"TradeCode" : 'PayServ_POSPay',
						'SelfAmt' : SelfAmt
					}				
					var rtn = PayServ_POSPay(input);
					RemoveLoading();
					if(!rtn){
						OSPAlert('','银行卡支付失败，请更换其他支付方式，谢谢','抱歉',function(){
							$("#mainBack", parent.document).css('display','block');
							$(".sys-white-defbutton-icon").show();
						});
					}else{
						OSPAlert('','银行卡支付成功，单击确认继续！','提示',function(){
							DBFlag = "";		
							GoNextBusiness(ParamInput);
							return false;
						});
					}
					return;
				}
				//非银行卡支付 进行跳转
				$("#mainBack", parent.document).css('display','block');
				RemoveLoading();
				GoNextBusiness(ParamInput);

			},16)
			return false;
		} catch (error) {
			RemoveLoading();
			OSPAlert('','支付失败，请重试','提示|Y',function(){
				homePageClick();
			});
			
		}
		
	});
}