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
 var DBClick = "";
 var Amount = 0;
 var OrderNo;
var GSelfAmt = 0;
 $(function () {
	$('.divide-btn').hide();
	var role = OSPGetParentVal('client_dict', 'ss_eqlistd_role');
	if (role == "role2"){
		$("div.pagetitle").css({'padding':'10px 0'});
		$('.divide-show').css({'width': '700px'});
		$('.divide-bottom-row').css({'width':'500px','position':'inherit','margin-left':'0px'});		

		$('.main-divide').css({'display':'flex','margin-top':'25px'});

		$('.divide-foot-row').css({'position':'absolute','top':'390px','left':'720px'});
	}
	//直接跳转
	var ProcessCode = OSPGetParentVal('processcode')
	//if(ProcessCode == "NAReg-Reg"){
	//	QueryOrdInfo();
	//}else{
		AddLoading();
		setTimeout(function(){
			QueryOrdInfo();
			RemoveLoading();
		},1500);
	//}
 });
 // 1.查询待缴费订单 该种支付仅支持 按就诊拆账单
function QueryOrdInfo(){
	var rtn = PeyServ_ChargeOrder();
	
	//var ExceptionInfo = PayServ_GetChgException();	
	QueryOrdInfoCallBack(rtn)
}
//  2.查询缴费订单回调
//  此处会有多个订单返回
function QueryOrdInfoCallBack(jsonObj){
	try {
		if(jsonObj.Response.ResultCode != 0){
			OSPAlert('',jsonObj.Response.ResultMsg,'',function(){
				homePageClick();
			});		
			return;		
		}
		// 2.1总信息
		var TotalNum = jsonObj.Response.PayOrdCount;
		var CurrentDivide = OSPGetParentVal('CurrentDivide');
		var msg = "（正在处理第 " +  1 + " 笔收费/共 " + 1 + " 笔，请勿离开）";
		//$('.middleval').text(msg);
		// 2.2 科室信息
		var SYSpatName = OSPGetParentVal('HisPatInfo').PatientName;
		var patName = "当前付款患者:" + SYSpatName.substring(0,1) + "*" + SYSpatName.substring((SYSpatName.length-1),SYSpatName.length);
		var DepInfo = "【" + patName + "】";
		$('#depDesc').text(DepInfo);
	
		// 2.3费用分类
		BuildFeeCate(jsonObj);
	
		
		//var p = Promise.resolve();
		//p.then(function(){
			// 3.HIS预结算
		var input = {
			"OrderNo" : OrderNo,
			'OrderSum' : Amount
		}
		var rtn = PayServ_PreHisDivide(input);
		if(rtn.Response.ResultCode !=0){
			//OSPAlert('','HIS预结算失败:' + rtn.Response.ResultMsg,'提示');
			return;
		}
		var INSUInfo = rtn.Response.InvoiceList.Invoice.HISInsuInfo;
		var AdmReasonId = ''
		if(typeof INSUInfo != "undefined" && INSUInfo !=""){
			InsuType = 3 //INSUInfo.split('^')[3]
			if(INSUInfo.split('^').length > 3){
				InsuType = INSUInfo.split('^')[3];
			}
			PayServ_UpdateHIType(InsuType,"Y");
		}else{
			PayServ_UpdateHIType(1,"Y");
		}
		//}).then(function(){
		var TotalAmt = +Amount;//+OSPGetParentVal('OrderInfo','OrderSum');
		var INSUSelfAmt = 0;
		var INSUAcountPay = 0;
		var INSUAmt = 0;
		var rtn1 = PayServ_InsuOPDividePre();
		var SelfAmt = TotalAmt;
		var InsuType = OSPGetParentVal('InsuType');
		if(InsuType != '1'){
			if(rtn1.split('^')[0] != 0 ){
				if(rtn1.indexOf('存储过程发生错误') > -1){
					//rtn1 = "诊断太长，医保中心保存失败";
				}
				OSPAlert('',rtn1,'提示|Y',function(){
					homePageClick();
				});
				return;
			}
			INSUSelfAmt = rtn1.split('^')[2];
			INSUAcountPay = 0;//rtn1.split(String.fromCharCode(2))[1].split('^')[1];
			INSUAmt = 0;//TotalAmt - INSUSelfAmt - INSUAcountPay;
			SelfAmt = INSUSelfAmt;
			//
			INSUPayArr = rtn1.split(String.fromCharCode(2));
			$.each(INSUPayArr,function(index,val){
				if(index == 0){
				}else{
					var paymode = val.split('^')[0];
					if(paymode == "33"){
						INSUAcountPay =  val.split('^')[1];
					}else{
						var payamt =  val.split('^')[1];
						INSUAmt = +(+INSUAmt) + (+payamt);
					}	

				}
			});
		}
		GSelfAmt = formatAmt(SelfAmt);
		SelfAmt ='需补金额: ' + formatAmt(SelfAmt);
		$('#SelfAmt').text(formatAmt(SelfAmt));
		$('.totamt').text(formatAmt(TotalAmt));
		$('.insupay').text(formatAmt(INSUAmt));
		$('.acountpay').text(formatAmt(INSUAcountPay));
		$('.divide-btn').show();
	} catch (error) {
		OSPAlert('confirm','获取费用发生异常，是否重试?','提示',function(r){
			if(r){
				location.href=location.href; 
			}else{
				homePageClick();
				return;
			}
		});
	}

	//})

}
// 生成费用分类
function BuildFeeCate(jsonObj){
	if(jsonObj.Response.PayOrdCount == '1'){
		jsonObj.Response.PayOrdCount = 1;
		jsonObj.Response.PayOrdList.PayOrder[0] = jsonObj.Response.PayOrdList.PayOrder;		
	}
	var i = +OSPGetParentVal('CurrentDivide') - 1;
	var OrdInfo = jsonObj.Response.PayOrdList.PayOrder[i];
	OrderNo = OrdInfo.OrderNo;
	Amount = OrdInfo.OrderSum;
	OSPSetParentVal('CurrentPayOrd',OrderNo);
	
	//var ItmListLen = jsonObj.Response.PayOrdList.PayOrder[i].ItemList.Item.length;
	var tmpArr = {};
	if(typeof jsonObj.Response.PayOrdList.PayOrder[i].ItemList.Item.length != "undefined"){
		var ItmListLen = jsonObj.Response.PayOrdList.PayOrder[i].ItemList.Item.length;
		for (var j=0;j < ItmListLen;j++){
			var ItemCategory = jsonObj.Response.PayOrdList.PayOrder[i].ItemList.Item[j].ItemCategory;
			var Amt = +formatAmt(+jsonObj.Response.PayOrdList.PayOrder[i].ItemList.Item[j].ItemSum);
			if(!tmpArr[ItemCategory]){
				tmpArr[ItemCategory] = 0;
			}
			tmpArr[ItemCategory] = +tmpArr[ItemCategory] + Amt;
		}
	}else{
		var ItemCategory = jsonObj.Response.PayOrdList.PayOrder[i].ItemList.Item.ItemCategory;
		var Amt = +formatAmt(jsonObj.Response.PayOrdList.PayOrder[i].ItemList.Item.ItemSum);
		tmpArr[ItemCategory] = +Amt;
	}
	Global.CateInfo = tmpArr;
	var dividelabel = $('.divide-label');
	$('.divide-label').find('label').text();
	var tmpLabelIndex = 0;
	$.each(tmpArr,function(cateLabel,CateAmt){
		var labelStr = cateLabel + ": " + formatAmt(CateAmt);
		$(dividelabel[tmpLabelIndex]).text(labelStr); 
		tmpLabelIndex++;
	});
}
function DivideConfirm(){
	if (DBClick == "Y"){
		return false;
	}
	DBClick = "Y";
	AddLoading();
	setTimeout(function(){
		RemoveLoading();
		Global.ConfirmFlag = "Y";
		if(GSelfAmt == '0' || GSelfAmt == '0.00'){
			$('#mainBack',parent.document).css('display','none');
		}
		GoNextBusiness();
		return false;
	},500);
	return false;
}