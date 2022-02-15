/**
 * FileName: prereg.predetails.js
 * Anchor: tangzf
 * Date: 2020-3-23
 * Description: 移动收费-预约明细查询
 */
var Global={
	SelectRow :'',
	COL : 1,
	ROW : 2
}
var BGJClass = '';
var perCol = "";
var AdmId = "";
var CurrentPage = 1 ;
var TotalPage = 1;
// 三列间距
var col1 = 6;
var col2 = 4;
var col3 = 2;
var DBClick = "";
$(function () {
	$('#mainBack',parent.document).css('display','block');
   	var role = OSPGetParentVal('client_dict', 'ss_eqlistd_role');
   	if (role == "role2"){
		$("body>div>div").removeClass("pagetitle").css({'padding':'10px 0'});
		$('.bottom-change').css({'position': 'absolute','top': '470px','left': '500px'});
		$('.bottom-change>img').css({'width': '140px', 'margin-bottom':'10px'});
		//
		BGJClass = 'bgj';
		//Global.COL = 1;
		perCol = "6";
		
		col1 = 5;
		col2 = 4;
		col3 = 2;
   	}
   	QueryOrdrInfo();
   	AdmId = "";
});

function QueryOrdrInfo(){
	AddLoading();
	setTimeout(function(){

		//测试用
		var role = OSPGetParentVal('client_dict', 'ss_eqlistd_eqcode');
		//if (role == "BGJ19"){
			var ExceptionInfo = PayServ_GetChgException();	
			if(ExceptionInfo.output !="undefined"){
				ExceptionInfo = ExceptionInfo.output;
				ExceptionInfo = JSON.parse(ExceptionInfo);
				var InvExceptionInfo = ExceptionInfo.invRows;
				var InsuExceptionInfo = ExceptionInfo.divRows;
			}
			$.each(InsuExceptionInfo,function(index,val){
				if(typeof val.divideId != "undefined"){
					if(val.divideId !="" && val.bizType == "F"){
						PayServ_StrikeInsuSingle(val.divideId);
					}
					if(val.divideId !="" && val.bizType == "R"){
						PayServ_StrikeInsuRegSingle(val.divideId);
					}
				}
			});
			$.each(InvExceptionInfo,function(index,val){
				if(typeof val.invoiceId != "undefined"){
					if(val.invoiceId != ""){
						var Input = {
							'InvoiceNoStr':val.invoiceId
						}
						PayServ_CancelPreDivide(Input);
					}
				}
			});
			
		//}
		var jsonObj = PeyServ_ChargeOrder();	
		RemoveLoading();
		AddDocToHtml(jsonObj);
	},100)

}

function AddDocToHtml(jsonObj){
   if(jsonObj.Response.ResultCode != 0){
	   OSPAlert('', jsonObj.Response.ResultMsg , '提示',function() {
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
   var processcode = OSPGetParentVal('processcode');
   var DepArr = jsonObj.Response.PayOrdList.PayOrder;
   if(typeof DepArr.length == "undefined" ){
	   DepArr = [DepArr];
   }
    if(DepArr.length == 0){
	   DepArr = [DepArr];
   }
   OSPSetParentVal('TotalDivide',DepArr.length);
   var htmlStr = "<div class='TurnPlay'>";
   	//检索
	var tmpAllLength = 0;
	$.each(DepArr, function(index,val){
		//过滤有号无号
		var UnionFlag = "N";

		// 在此处过滤医生
		if(val.AdmDept != "感染科" && processcode == "NAReg-Reg"){ // || val.DoctorName == "附加号专用"){
			delete DepArr[index];
		}else{
			tmpAllLength++;
		}
	})
	DepArr.sort();
	DepArr.length = tmpAllLength;
	//检索结束
   $.each(DepArr, function(index, val){
	   if(index == 0){		
		   htmlStr = htmlStr + "<div class='layui-row'>";
			   htmlStr = htmlStr + "<div class='layui-col-md" + perCol + "'>";
			   htmlStr = htmlStr + _BuildButton(index, DepArr);
			   htmlStr = htmlStr + "</div>";
	   }else if((index / Global.COL) % 1 === 0){
		   htmlStr = htmlStr + "</div>"; // box
		   if((index / (Global.COL * Global.ROW)) % 1 === 0){
			   htmlStr = htmlStr + "</div>"; // TurnPlay
			   TotalPage++;
			   htmlStr = htmlStr + "<div class='TurnPlay'>";
		   }
		   htmlStr = htmlStr + "<div class='layui-row'>";
			   htmlStr = htmlStr + "<div class='layui-col-md" + perCol + "'>";
			   htmlStr = htmlStr + _BuildButton(index, DepArr);
			   htmlStr = htmlStr + "</div>";
	   }else if(index == DepArr[index].length - 1) {
			   htmlStr = htmlStr + "<div class='layui-col-md" + perCol + "'>";
			   htmlStr = htmlStr + _BuildButton(index, DepArr);
			   htmlStr = htmlStr + "</div>";
		   htmlStr = htmlStr + "</div>";
		   htmlStr = htmlStr + "</div>";
	   }else{
		   htmlStr = htmlStr + "<div class='layui-col-md" + perCol + "'>";
		   htmlStr = htmlStr + _BuildButton(index, DepArr);
		   htmlStr = htmlStr + "</div>";
	   }	
   });
   htmlStr = htmlStr + "</div>";
   $(".HISContent").prepend(htmlStr);

   $('#pageNum').text('/' + TotalPage);

   $('.pre-button').bind("click",function(e){
		var BtnData = $(this).attr('data');
		var BtnObj = JSON.parse(BtnData);
		if(typeof BtnObj.InsType !="undefined"){
			var InputObj = {
				'CheckCode':BtnObj.InsType,
				'RuleType' :'checkStopInsuType'
			}
			var checkFlag = checkStop(InputObj);
			if(checkFlag.result !="0" || !checkFlag){
				return false;
			}
			/*if(BtnObj.InsType == "5"  || BtnObj.InsType == "7"){
				OSPAlert('','生育患者只能在窗口缴费','提示');
				return false;
			}*/
		}
		if(DBClick=="Y"){
			return false;
		}
		cancelBubble(e);
		Disabled(this,'.pre-button');
		DBClick = "Y"
		var Param = "&PayingList=" + BtnData;
		AddLoading();   
		setTimeout(function(){
			RemoveLoading();
		 	GoNextBusiness(Param);
		 	return false;
		},500);
		return false;
   });

   function _BuildButton(index, DepArr){
	   var btnText = "缴费";
	   var htmlStr = "<div class='sys-white-defbutton " + BGJClass + "'>";
		   //col
		   htmlStr = htmlStr + "<div class='layui-col-md" + col1 + " row-col'>";
			   htmlStr = htmlStr + "<div>";
				   htmlStr = htmlStr + "<label class='sys-white-defbutton-label'>姓名: " + OSPGetParentVal('HisPatInfo').PatientName + "</label>";				
			   htmlStr = htmlStr + "</div>";	
			   htmlStr = htmlStr + "<div class='middle-label'>";
				   htmlStr = htmlStr + "<label class='sys-white-defbutton-label middle-label'>科室: " + DepArr[index].AdmDept + "</label>";					
			   htmlStr = htmlStr + "</div>";
			   htmlStr = htmlStr + "<div>";
				   htmlStr = htmlStr + "<label class='sys-white-defbutton-label'>就诊日期: " + DepArr[index].AdmDate + "</label>";					
			    htmlStr = htmlStr + "</div>";
			    htmlStr = htmlStr + "<div class='middle-label'>";
			   		htmlStr = htmlStr + "<label class='sys-white-defbutton-label middle-label'>金额: " + DepArr[index].OrderSum + "</label>";					
		   		htmlStr = htmlStr + "</div>";
		   htmlStr = htmlStr + "</div>";
		   //name
		   htmlStr = htmlStr + "<div class='layui-col-md" + col2 + " row-col'>";
			   htmlStr = htmlStr + "<div>";
				   htmlStr = htmlStr + "<label class='sys-white-defbutton-label'>性别: " + OSPGetParentVal('HisPatInfo').Sex + "</label>";				
			   htmlStr = htmlStr + "</div>";	
			   htmlStr = htmlStr + "<div class='middle-label'>";
				   htmlStr = htmlStr + "<label class='sys-white-defbutton-label'>医生: " + DepArr[index].AdmDoctor + "</label>";					
			   htmlStr = htmlStr + "</div>";
			   htmlStr = htmlStr + "<div>";
				   htmlStr = htmlStr + "<label class='sys-white-defbutton-label'>就诊时间: " + DepArr[index].AdmTime + "</label>";					
			   htmlStr = htmlStr + "</div>";
			   htmlStr = htmlStr + "<div class='middle-label'>";
			   		htmlStr = htmlStr + "<label class='sys-white-defbutton-label middle-label'>费别: " + DepArr[index].OrderInsType + "</label>";					
		   		htmlStr = htmlStr + "</div>";
		   htmlStr = htmlStr + "</div>";
		   // button
		   htmlStr = htmlStr + "<div class='layui-col-md" + col3 + " row-col'>";
			   htmlStr = htmlStr + "<div class='sys-defbutton pre-button sys-pre-btn'  data='" + JSON.stringify(DepArr[index]) + "'>";
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
	var tmpPro = $('#BackButton').attr('disabled');
	if(tmpPro){
		return;
	}
	$('#NextButton').attr('disabled','disabled');
	$('#BackButton').attr('disabled','disabled');
	setTimeout(function(){
		$('#NextButton').removeAttr('disabled');
		$('#BackButton').removeAttr('disabled');
	},1500)
   if(changeType == "add"){
		if(CurrentPage == TotalPage){
			return;
		}
		CurrentPage++;
		CurrentPage = CurrentPage == (TotalPage + 1) ? 1 : CurrentPage;
   }else{
		if(CurrentPage == 1){
			return;
		}
		CurrentPage--;
		CurrentPage = CurrentPage<1?TotalPage:CurrentPage;
   }
   $('#currentPage').text(CurrentPage);
   $('.layui-carousel-arrow[lay-type="' + changeType + '"]').click();
}
