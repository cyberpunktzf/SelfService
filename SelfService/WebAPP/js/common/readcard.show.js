/**
 * FileName: charge.readcard.show.js
 * Anchor: tangzf
 * Date: 2020-3-23
 * Description: 移动收费读卡
 */
var ReadCardInfo;

$(function () {
	try {
		$('#CardNo').blur(function(e){
			$('#CardNo').focus();
		});
		var role = OSPGetParentVal('client_dict', 'ss_eqlistd_role');
		if (role == "role2"){
			$('#picture').css({'height':'440px','width':'850px'});

			$('.readcard-show-title').css({'heigth':'14px','font-size': '24px'});
			
			$('img').css('padding','0px');
			$('.layui-row').css({'padding-top': '0','margin-top':'10px'});
			$('.flex-1').css('padding-bottom','0px');
			$("#CardNo").css({'width': '740px', 'height': '42px', 'line-height': '42px', 'font-size': '30px'});
		}

		$('#CardNo').keydown(function(e){
			if(e.keyCode == 20) {
				cancelBubble(e);
				return false;
			}
		});

		// 医保卡图片优先级最高
		// 0身份证 ，1 医保卡
		var ReadCardType = OSPGetParentVal('ReadCardType');
		if(ReadCardType == "1" ){
			var ImgConfigUrl="/WebAPP/themes/images/card2.gif";
		}else{
			var ImgConfigUrl="/WebAPP/themes/images/card1.gif";
		}
		//1.根据配置替换读卡图片
		var Business = OSPGetParentVal('Business'); 
		var CurrentBusiness = OSPGetParentVal('CurrentBusiness')
		ImgConfigUrlCFG = Business[CurrentBusiness].config;
		if(ImgConfigUrlCFG && ImgConfigUrlCFG.url){
			ImgConfigUrl = ImgConfigUrlCFG.url;
		}
		 

		$('#picture').attr("src",ImgConfigUrl);
		//2.读卡
		//DHCINSUPort.js
		$('#CardNo').focus();
		DLLReadCard(DLLReadCardCallBack);
	} catch (error) {
		//alert("读卡失败" + error.responseText);
	}	
});
function DLLReadCardCallBack(){
	var rtn = PayServ_GetHisPatInfo();
	ReadAdmCardResult(rtn);	
}

/*
	回调方法处理返回值
	下一个功能
*/
 function ReadAdmCardResult(jsonObj){
	var rtn = jsonObj.Response.ResultCode;
	if(rtn=="-330002"){ // 无卡时自动建卡
		var Src = "/WebAPP/pages/common/text.input.html?KeyType=number&CreateFlag=Y";
		LoadPage(Src);
		return;
	}
	if(rtn != "0"){ // 无卡时自动建卡
		OSPAlert('',jsonObj.Response.ResultContent,'提示',function(){		
			homePageClick();	
			return;
		});
	} 
	var BlackFlag = jsonObj.Response.PatInfos.PatInfo['BlackFlag'];
	var BusinessType = OSPGetParentVal('BusinessType');
	if (typeof BlackFlag != "undefined" && BlackFlag == "1" && (BusinessType == "ORDR" )){
		OSPAlert('',"取消预约或爽约次数过多，您已被列入黑名单",'提示',function(){		
			homePageClick();	
			return;
		});
		return false;
	}
	var SexDesc = jsonObj.Response.PatInfos.PatInfo.SexCode=="1"?"男":"女";
	jsonObj.Response.PatInfos.PatInfo['Sex'] = SexDesc;
	OSPSetParentVal('HisPatInfo',jsonObj.Response.PatInfos.PatInfo);
	OSPAlert('',"请取走您的医保卡或身份证！",'提示',function(){		
		GoNextBusiness('');		
		return false;
	});	
	setTimeout(function(){
		GoNextBusiness('');	
		return false;
	},3000);	
	return false;
}