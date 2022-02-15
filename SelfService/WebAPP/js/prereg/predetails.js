/**
 * FileName: prereg.predetails.js
 * Anchor: tangzf
 * Date: 2020-3-23
 * Description: 移动收费-预约明细查询
 */
var Global={
	SelectRow :'',
	AllowRefundPre : '',
	COL : 1,
	ROW : 3,
	BGJClass: ''
}
var CurrentPage = 1 ;
var TotalPage = 1;
var OnlyFirst= "";
var DBClick = "";
$(function () {
	var role = OSPGetParentVal('client_dict', 'ss_eqlistd_role');
	if (role == "role2") {
		Global.ROW = 2;
		Global.BGJClass = 'bgj';
		$("body>div>div").removeClass("pagetitle").css({'padding':'10px 0'});
		$('.bottom-change').css({'position': 'absolute','top': '470px','left': '500px'});
		$('.bottom-change>img').css({'width': '140px', 'margin-bottom':'10px'});
	}
	Global.AllowRefundPre = INSUGetRequest('AllowReund');
	Global.AllowRefundPre = Global.AllowRefundPre.replace('undefined','');
	setTimeout(function(){
		QueryOrdrInfo();
	},100);
});
function QueryOrdrInfo(){
   var VIPNo = INSUGetRequest("InuputNo");
   var input = {
	   'VIPNo' : VIPNo
   }
   var jsonObj = PeyServ_QueryOrdr(input);
   AddDocToHtml(jsonObj);
}

function AddDocToHtml(jsonObj){
   var VIPNo = INSUGetRequest("InuputNo");
   var Msg = '没有有效预约信息';
   var BusinessType = OSPGetParentVal('BusinessType');
   if(BusinessType == "DRINCRNO"){		
	   Msg = "非有效预约取号码";
   }
    if(typeof jsonObj.result != 'undefined'){
		if (jsonObj.result != 0){
			OSPAlert('','-10010网络波动，自助机业务发生错误，请返回主页并重试一次，谢谢','提示',function(){
				homePageClick();
			});
		    return;
		}
   }
   if(jsonObj.Response.RecordCount == 0){
		OSPAlert('',Msg,'提示',function(){
			homePageClick();
		});
	   return;
   }
   $(".HISContent").empty();
   layui.use('carousel', function(){
	   var carousel = layui.carousel;
	   //建造实例
	   carousel.render({
		 elem: '#TurnPlay',
		 width: '100%', //设置容器宽度
		 arrow: 'always', //始终显示箭头
		 autoplay:false
	   });
   });
   
   var DepArr = [];
   if ($.isArray(jsonObj.Response.Orders.Order)) {
	   DepArr = jsonObj.Response.Orders.Order;
   }else {
	   DepArr.push(jsonObj.Response.Orders.Order);
	   OnlyFirst = "Y";
   }
   /*
   var DepArr = jsonObj.Response.Orders.Order;
   if (!DepArr.length){
	   DepArr = {
		   "0": DepArr
	   }
   }
   */
   // 医生加号-------------------------------------------------------
	var BusinessType = OSPGetParentVal('BusinessType');
	if(BusinessType == "DRINCRNO"){		
		var obj = DepArr[0];
		if(typeof obj.OrderContent !="undefined"){
			if (obj.OrderContent !=""){
				OSPAlert('',obj.OrderContent,'提示',function(){
					rebackClick();
				});
				return;
			}
		}
		GetPreoRDER(JSON.stringify(DepArr[0]));
		return false;
	}

   var perCol = "";   //12 / Global.COL;
   var htmlStr = "<div class='TurnPlay'>";
   	//检索
	var processcode = OSPGetParentVal('processcode');
	var tmpAllLength = 0;
	$.each(DepArr, function(index,val){
		// 在此处过滤
		var JointFlag = val['JointFlag'];
		var MainSchedule = val['LinkApptID'];
		var QuitFlag = "";
		if (JointFlag == "Y" && MainSchedule == "" ){
			QuitFlag = "Y";
		}
		if((processcode == 'UnionOP-CANCORDR' && val['JointFlag'] != 'Y' )){ 
			delete DepArr[index];
		}else {
			tmpAllLength++;
		}
	});
	if (DepArr.length > 1) {
		DepArr.sort();
	}
	DepArr.length = tmpAllLength;
	//检索结束
   $.each(DepArr, function(index,val){
	   if(index == 0){
		   htmlStr = htmlStr + "<div class='layui-row'>";
			   htmlStr = htmlStr + "<div class='layui-col-md" + perCol + " '>";
			   htmlStr = htmlStr + _BuildButton(index,DepArr);
			   htmlStr = htmlStr + "</div>";
	   }else if((index / Global.COL) %1 === 0){
		   htmlStr = htmlStr + "</div>"; // box
		   if((index / (Global.COL * Global.ROW)) %1 === 0){
			   htmlStr = htmlStr + "</div>"; // TurnPlay
			   TotalPage++;
			   htmlStr = htmlStr + "<div class='TurnPlay' >";
		   }
		   htmlStr = htmlStr + "<div class='layui-row'>";
			   htmlStr = htmlStr + "<div class='layui-col-md" + perCol + " '>";
			   htmlStr = htmlStr + _BuildButton(index,DepArr);
			   htmlStr = htmlStr + "</div>";
	   }else if(index == DepArr[index].length - 1){
			   htmlStr = htmlStr + "<div class='layui-col-md" + perCol + " '>";
			   htmlStr = htmlStr + _BuildButton(index,DepArr);
			   htmlStr = htmlStr + "</div>";
		   htmlStr = htmlStr + "</div>";
		   htmlStr = htmlStr + "</div>";
	   }else{
		   htmlStr = htmlStr + "<div class='layui-col-md" + perCol + " '>";
		   htmlStr = htmlStr + _BuildButton(index,DepArr);
		   htmlStr = htmlStr + "</div>";
	   }
   });
   htmlStr = htmlStr + "</div>";
   $(".HISContent").prepend(htmlStr);

   $('#pageNum').text('/' + TotalPage);

   $('.pre-button').bind("click",function(){	
	   var BtnData = $(this).attr('data');
	   if(Global.AllowRefundPre == "N"){
		   return;
	   }else if (Global.AllowRefundPre=="Y"){
		   OSPAlert('confirm','是否继续取消预约？','提示',function(r){
			   if(r){
				   Return(BtnData);
			   }
		   });
	   }else if(Global.AllowRefundPre == "GET") {
			var BtnDataObj = JSON.parse(BtnData);
			var OrderContent = BtnDataObj['OrderContent'];
			if( OrderContent != ""){
				var ContinueFlag = OrderContent.split('^')[0];
				if(ContinueFlag == '0'){
					OSPAlert('',OrderContent.split('^')[1],'提示',function(){
						if(OrderContent.indexOf('未到取号时间') > -1){
							location.reload();
							return;
						}
					});
					return;
				}
				OSPAlert('',OrderContent.split('^')[1],'提示',function(){
					GetPreoRDER(BtnData);
					return;
				});
			}else{
				GetPreoRDER(BtnData);
				return false;
			}
		   return;
	   }	
   });

   function _BuildButton(index,DepArr){
	   var btnText = "操作";
	   if(Global.AllowRefundPre == "N"){
		   btnText = "未报到";
	   }else if (Global.AllowRefundPre == "Y"){
		   btnText = "取消";
	   }else if(Global.AllowRefundPre == "GET"){			
		   btnText = "取号";
	   }
	   var RANGE = DepArr[index].AdmitRange;
	   var ShowDesc = DepArr[index].SessionName;
	   if(RANGE.split(' ').length > 1){
		   ShowDesc = DepArr[index].AdmitRange.split(' ')[1];
	   }
	   var htmlStr = "<div class='sys-white-defbutton " + Global.BGJClass + "'>";
		   //col
		   htmlStr = htmlStr + "<div class='layui-col-md6 row-col'>";
			   htmlStr = htmlStr + "<div>";
				   htmlStr = htmlStr + "<label class='sys-white-defbutton-label'>姓名: " + OSPGetParentVal('HisPatInfo').PatientName + "</label>";				
			   htmlStr = htmlStr + "</div>";
			   htmlStr = htmlStr + "<div class='middle-label'>";
				   htmlStr = htmlStr + "<label class='sys-white-defbutton-label middle-label'>预约科室: " + DepArr[index].Department + "</label>";					
			   htmlStr = htmlStr + "</div>";
			   htmlStr = htmlStr + "<div>";
				   htmlStr = htmlStr + "<label class='sys-white-defbutton-label'>预约就诊日期: " + DepArr[index].AdmitDate + "</label>";					
			   htmlStr = htmlStr + "</div>";
		   htmlStr = htmlStr + "</div>";
		   //name
		   htmlStr = htmlStr + "<div class='layui-col-md4 row-col'>";
			   htmlStr = htmlStr + "<div>";
				   htmlStr = htmlStr + "<label class='sys-white-defbutton-label'>性别: " + OSPGetParentVal('HisPatInfo').Sex + "</label>";				
			   htmlStr = htmlStr + "</div>";	
			   htmlStr = htmlStr + "<div class='middle-label'>";
				   htmlStr = htmlStr + "<label class='sys-white-defbutton-label'>预约医生: " + DepArr[index].Doctor + "</label>";					
			   htmlStr = htmlStr + "</div>";
			   htmlStr = htmlStr + "<div>";
				   htmlStr = htmlStr + "<label class='sys-white-defbutton-label'>时段: " + ShowDesc + "</label>";					
			   htmlStr = htmlStr + "</div>";
		   htmlStr = htmlStr + "</div>";
		   // button
		   htmlStr = htmlStr + "<div class='layui-col-md2 row-col'>";
			   htmlStr = htmlStr + "<div class='sys-defbutton pre-button sys-pre-btn' data='" + JSON.stringify(DepArr[index]) + "'>";
				   htmlStr = htmlStr + "<label class='sys-defbutton-label'>" + btnText + "</label>";
			   htmlStr = htmlStr + "</div>";
		   htmlStr = htmlStr + "</div>";
	   htmlStr = htmlStr + "</div>";
	   return htmlStr;
   }
}
function ChangePage(changeType){
	var tmpPro = $('#NextButton').attr('disabled');
	if(tmpPro){
		return;
	}
	$('#NextButton').attr('disabled','disabled');
	$('#BackButton').attr('disabled','disabled');
	setTimeout(function(){
		$('#NextButton').removeAttr('disabled');
		$('#BackButton').removeAttr('disabled');
	},500)
	if(changeType == "add"){
		if(CurrentPage==TotalPage){
			return;
		}
		CurrentPage++;
		CurrentPage = CurrentPage == (TotalPage + 1) ? 1 : CurrentPage;
   }else {
		if(CurrentPage == 1){
			return;
		}
		CurrentPage--;
		CurrentPage = CurrentPage < 1 ? TotalPage : CurrentPage;
   }
   $('#currentPage').text(CurrentPage);
   $('.layui-carousel-arrow[lay-type="' + changeType + '"]').click();
}
function BuildFirstCol(jsonObj){
   if(jsonObj.Response.RecordCount=='1'){
	   var tmpData = jsonObj.Response.Orders.Order;
	   jsonObj.Response.Orders.Order = {0:tmpData};		
   }
   return jsonObj;
}
function Return(obj){
   obj = JSON.parse(obj);
   var OrderCode = obj.OrderCode;
   var input = {
	   'OrderCode' : OrderCode,
	   'JointFlag': obj.JointFlag
   }
   PeyServ_CancelOrdr(input,ReturnCallBack)	
   return false;
}
function ReturnCallBack(jsonObj){
   jsonObj = jsonObj.output;
   jsonObj = OSPWebServicesXMLStr2Json(jsonObj);
   if(jsonObj.Response.ResultCode == 0){
	   OSPAlert('',"取消预约成功",'提示',function(){
		   if(OnlyFirst == "Y"){
				homePageClick();
			}else{
				location.reload();
				return false;
		   }	   
	   });		
   }else{
	   OSPAlert('',jsonObj.Response.ResultContent,'提示',function(){
		   location.reload();
		   return false;
	   });
   }
}
function GetPreoRDER(objStr){
	if(DBClick == "Y"){
		return false;
	}
	DBClick = "Y";
	var obj = JSON.parse(objStr);
	//全自费科室标志
	if(typeof obj.ATMZFFlag != "undefined"){
		if(obj.ATMZFFlag == "Y"){
			PayServ_UpdateHIType("1","Y")
			// 保存操作日志
			PayServ_SaveBDInfo("insutype","&Param=1","","6666")
		}
	}
	var OrderID = "";
	OSPSetParentVal('CurrentPayOrd',obj.OrderCode);
   	var Param = "&OrderCode=" + obj.OrderCode + "&PayAmt=" + obj.RegFee+"&Schedule=" + objStr + '&JointFlag=' + obj.JointFlag;
	AddLoading();
   	setTimeout(function(){
		RemoveLoading();
		GoNextBusiness(Param);
		return false;
   	},500);
   	return false;
}