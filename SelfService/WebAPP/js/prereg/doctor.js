/**
 * FileName: offselfpro.query.itemprice.js
 * Anchor: tangzf
 * Date: 2020-4-26
 * Description: 预约挂号-科室查询
 */
var tmpFlag = 0;
var Global = {
	SelectRow :'',
	COL : 2,
	ROW : 3
}
var CurrentPage = 1 ;
var TotalPage = 1;
$(function () {
	var role = OSPGetParentVal('client_dict', 'ss_eqlistd_role');
	if (role == "role2"){
		Global.ROW = 2;
		$(".HISContent").parents(".depinfo").addClass('list-carousel');
		$('.level1-title').css('line-height','0px');
		$('.search-box').css('display','none');
		$('#level1Dep').css('display','none');
		$('.bottom-change').css({'position':'absolute','top':'490px','left':'500px'});
		$('.bottom-change').find('img').css({'width': '140px', 'margin-bottom':'12px'});
	}
	var BusinessType = OSPGetParentVal('BusinessType');
	if (BusinessType == "ORDR"){
		$('#HaveNum').css('display', 'none');
	}
	layui.use('carousel', function(){
		var carousel = layui.carousel;
		//建造实例
		carousel.render({
			elem: '#TurnPlay',
			width: '100%',     //设置容器宽度
			arrow: 'always',   //始终显示箭头
			autoplay: false
		});
	});
	var selDepDesc = OSPGetParentVal('DepDesc');
	$('.doctor-title').text(selDepDesc + '-请选择医生');
	GetHISDepInfo();
	init_keybord();
 });
 
function GetHISDepInfo(){
	AddLoading();
	tmpFlag++;
	setTimeout(function(){
		var jsonObj = PayServ_GetDocInfo();
		RemoveLoading();
		AddDocToHtml(jsonObj);
	},30);
}
 
function AddDocToHtml(jsonObj){
	// init
	try {
		TotalPage = 1;
	CurrentPage = 1;
	$('#currentPage').text(CurrentPage);
	//
	$(".HISContent").children().remove();
	if(jsonObj.Response.ResultCode !="0"){
		OSPAlert('',jsonObj.Response.ResultContent,'提示',function(){
			rebackClick();
			return;
		});
	}
	if(jsonObj.Response.RecordCount == "0"){
		OSPAlert('','当前科室没有排班资源','提示',function(){
			rebackClick();
			return;
		});
		return;
	}

	var DepArr = jsonObj.Response.Doctors.Doctor;
	if(!DepArr.length){
		DepArr = [
			DepArr
		]
	}
	//直接跳转
	var ProcessCode = OSPGetParentVal('processcode')
	if(ProcessCode == "NAReg-Reg"){
		//BtnData = JSON.stringify(DepArr[0]);
		//var Param = "&Param=" + BtnData;
		//GoNextBusiness(Param,"Skip");
		//return false;
	}

	//
	var perCol = "6"; //12 / Global.COL;
	var htmlStr = "<div class='TurnPlay layui-this'>";
	//检索
	var Input = $('#CardNo').text();
	var tmpAllLength = 0;
	var tmpDocArr = [];
	$.each(DepArr, function(index,val){
		//过滤有号无号
		var status = $('#HaveNum').attr('data');
		var exitFlag = 'Y';
		if(status == "no"){ //说明要查有号
			LeftNum = val.EffectiveSeqNo;		
			if(LeftNum){	
				if(LeftNum.split(':').length > 1){
					LeftNum = LeftNum.split(':')[1];
					if(LeftNum == 0) {
						exitFlag = "N";
					}
				}
			}else{
				exitFlag = "N";
			}	
		}

		//检索
		var SP = makePy(val.DoctorName);
		if(typeof SP !="string"){
			SP = SP[0];
		}
		// 过滤无联合门诊的排班
		var UnionFlag = "N";
		// 在此处过滤医生
		if(Input != SP && Input != "" && SP.indexOf(Input) < 0 || exitFlag != "Y" || UnionFlag == "Y"){ // || val.DoctorName == "附加号专用"){
			//delete DepArr[index];
		}else{
			//tmpAllLength++;
			tmpDocArr.push(val)
		}
	})
	//DepArr.sort();
	//DepArr.length = tmpAllLength;
	//检索结束
	$.each(tmpDocArr, function(index,val){
		if(index == 0){		
			htmlStr = htmlStr + "<div class='layui-row'>";
				htmlStr = htmlStr + "<div class='layui-col-md" + perCol + " '>";
				htmlStr = htmlStr + _BuildButton(index,tmpDocArr);
				htmlStr = htmlStr + "</div>";
		}else if((index / Global.COL) %1 === 0){ //
			htmlStr = htmlStr + "</div>"; // box
			if((index / (Global.COL * Global.ROW)) %1 === 0){
				htmlStr = htmlStr + "</div>"; // TurnPlay
				TotalPage++;
				htmlStr = htmlStr + "<div class='TurnPlay'>";				
			}
			htmlStr = htmlStr + "<div class='layui-row'>";
				htmlStr = htmlStr + "<div class='layui-col-md" + perCol + " '>";
				htmlStr = htmlStr + _BuildButton(index,tmpDocArr);
				htmlStr = htmlStr + "</div>";
		}else if(index == tmpDocArr[index].length - 1){
				htmlStr = htmlStr + "<div class='layui-col-md" + perCol + " '>";
				htmlStr = htmlStr + _BuildButton(index,tmpDocArr);
				htmlStr = htmlStr + "</div>";
			htmlStr = htmlStr + "</div>";
			htmlStr = htmlStr + "</div>";
		}else{
			htmlStr = htmlStr + "<div class='layui-col-md" + perCol + " '>";
			htmlStr = htmlStr + _BuildButton(index,tmpDocArr);
			htmlStr = htmlStr + "</div>";
		}	
	});
	htmlStr = htmlStr + "</div'>";
	$(".HISContent").prepend(htmlStr);

	$('#pageNum').text('/' + TotalPage);
	//1页的不显示上下页
	if(TotalPage == 1){
		$('.changebtn').css('display','none');
	}else{
		$('.changebtn').css('display','');
	}
	var DocPage = OSPGetParentVal('DocPage');
	//返回时 保证当前页码为上次选的
	if(DocPage =="2"){
		setTimeout(function(){
			ChangePage("add");
		},100);
	}
	$('.doc-defbutton').on("click",function(){
		var tempCls = $(this).find('.nonum');
		if(tempCls.length > 0){
			return;
		}
		var BtnData = $(this).find('label').attr('data');
		var Input = {
			"CheckCode": "checkDoctor",
			"Input": BtnData
		}
		var jsonObj = checkRules(Input)
		if (jsonObj.result != 0) {
			return;
		}
		var BtnObj = JSON.parse(BtnData);
		//
		var LeftNum = "";   // DepArr[index].EffectiveSeqNo;
		var BusinessType = OSPGetParentVal('BusinessType');		
		if(BusinessType == "Reg"){
			LeftNum = BtnObj.EffectiveSeqNo;		
			if(!LeftNum) {
				return;
			}
			if(LeftNum.split(':').length > 1){
				LeftNum = LeftNum.split(':')[1];
				if(LeftNum == 0){
					return;
				}
			}	
		}
		//附加号 时 不显示门特
		if(BtnObj.DoctorName.indexOf("附加号") > -1){
			OSPSetParentVal('FJHFlag','Y');
		}else{
			OSPSetParentVal('FJHFlag','');
		}

		Disabled(this,'.doc-defbutton');	
		var Param = "&Param=" + BtnData;
		GoNextBusiness(Param);
	});
	
	function _BuildButton(index, DepArr){
		var LeftNum = ""; //DepArr[index].EffectiveSeqNo;
		var BusinessType = OSPGetParentVal('BusinessType');
		var nonum = "";
		var LabelTitle = DepArr[index].DoctotLevelCode;
		var WaitNum = 0;
		var displayFlag = ";display:none;";
		if(BusinessType == "Reg"){
			displayFlag = "";
			LeftNum = DepArr[index].EffectiveSeqNo;	
				
			if(!LeftNum){
				LeftNum = "无号";
				nonum = "nonum"
			}
			nonum = "nonum";
			$.each(LeftNum.split('^'),function(index,val){
				if(LeftNum.split(':').length > 1){
					var tmpLeftNum = LeftNum.split(':')[1];
					if(tmpLeftNum != 0){
						nonum = "";
					}
				}
			})
			LeftNum = LeftNum.replace('^','');
			if(LeftNum.split(':').length > 1){
				LeftNum = LeftNum.split(':')[0] + ':' + LeftNum.split(':')[1];
			}
			if(DepArr[index].EffectiveSeqNo.split(':').length > 2){
				WaitNum = DepArr[index].EffectiveSeqNo.split(':')[2];
			}
			//LeftNum = "剩余:" + LeftNum;
		}else{
			LeftNum = DepArr[index].DoctotLevelCode;
			var LeftNum1 = DepArr[index].EffectiveSeqNo;					
			if(!LeftNum1){
				LeftNum1 = "无号";
				LeftNum1 = "nonum"
			}
			nonum = "nonum";
			$.each(LeftNum1.split('^'),function(index,val){
				if(LeftNum1.split(':').length > 1){
					var tmpLeftNum = LeftNum1.split(':')[1];
					if(tmpLeftNum != 0){
						nonum = "";
					}
				}
			})
		}

		var OutPut ={
			"TradeCode": "GetDoctorPicture",
			"DoctorCode" : DepArr[index].UserCode,
			"DoctorDesc": DepArr[index].DoctorName
		}
		var base64Str = -1;//
		var rtn = CallMethod(OutPut,'',"CallPythonService","N");
		if(typeof rtn == "string"){
			base64Str = rtn.replace("b'","");
		}
			
		if(base64Str == "-1"){
			src='/WebAPP/themes/images/defdoc.png';
			var imgHtml = "<img style='height:93px;margin:24px 0 23px 18px;width:94px;' src='/WebAPP/themes/images/defdoc.png' /> ";
		}else{
			base64Str = 'data:image/jpeg;base64,' + base64Str;
			var imgHtml = "<img style='width:114px;height:133px;margin:4px 7px 18px;border-radius: 480px;' src='" + base64Str + "' /> ";
		}
		// 按钮提示字 
		var BtnLabelText = "选择";
		var BusinessType = OSPGetParentVal('BusinessType');
		if (BusinessType == "ORDR"){
			BtnLabelText = "预约";
		}else{
			// 挂号
			if (nonum !=""){
				BtnLabelText = "无号"
			}

			
		}
		var htmlStr = "<div class='doc-defbutton'>";
			//img
			htmlStr = htmlStr + "<div class='layui-col-md2'>";
				htmlStr = htmlStr + "<div>";
					htmlStr = htmlStr + imgHtml;
				htmlStr = htmlStr + "</div>";
			htmlStr = htmlStr + "</div>";
			//name
			htmlStr = htmlStr + "<div class='layui-col-md6' style='margin-top:8px;'>";
				htmlStr = htmlStr + "<div>";
					htmlStr = htmlStr + "<label class='doc-defbutton-label' style='font-size:34px;padding-left:14px;line-height:50px;' data='" + JSON.stringify(DepArr[index]) + "' id='" + DepArr[index].DoctorCode + "'>" + DepArr[index].DoctorName + "</label>";				
				htmlStr = htmlStr + "</div>";	
				htmlStr = htmlStr + "<div>";
					htmlStr = htmlStr + "<label class='doc-defbutton-title' style='font-size:24px;padding-left:14px;line-height:20px;' >" + LabelTitle + "</label>";				
				htmlStr = htmlStr + "</div>";
				//htmlStr = htmlStr + "<div>";
				//	htmlStr = htmlStr + "<label class='doc-defbutton-title' style='font-size:24px;padding-left:14px;line-height:30px;" + displayFlag + "' >" + LeftNum + "</label>";				
				//htmlStr = htmlStr + "</div>";
				htmlStr = htmlStr + "<div>";
					htmlStr = htmlStr + "<label class='doc-defbutton-title' style='font-size:24px;padding-left:14px;line-height:20px;" + displayFlag + "' >等候人数:" + WaitNum + "</label>";				
				htmlStr = htmlStr + "</div>";	
			htmlStr = htmlStr + "</div>";
			// button
			htmlStr = htmlStr + "<div class='layui-col-md4'>";
				htmlStr = htmlStr + "<div class='sys-defbutton " +  nonum + "' style='width:130px;height:70px;margin-top:35px;'>";
					htmlStr = htmlStr + "<label class='sys-defbutton-label' style='line-height:65px;'>" + BtnLabelText + "</label>";				
				htmlStr = htmlStr + "</div>";		
			htmlStr = htmlStr + "</div>";
		htmlStr = htmlStr + "</div>";
		return htmlStr;
	}
	} catch (error) {
		OSPAlert('','查询医生失败，请重试','提示',function(){
			rebackClick();
			return;
		});
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
		return;
	},500)
	if(changeType == "add"){
		if(CurrentPage==TotalPage){
			return;
		}
		
		var tmpTurnPlay = $('.layui-this');
		$('.layui-this').next().addClass('layui-this');
		$(tmpTurnPlay).removeClass('layui-this');
		
		CurrentPage++;
		CurrentPage=CurrentPage==(TotalPage+1)?1:CurrentPage;
	}else{
		if(CurrentPage==1){
			return;
		}
		var tmpTurnPlay = $('.layui-this');
		$('.layui-this').prev().addClass('layui-this');
		$(tmpTurnPlay).removeClass('layui-this');
		
		CurrentPage--;
		CurrentPage=CurrentPage<1?TotalPage:CurrentPage;
	}
	//当前页码
	OSPSetParentVal('DocPage', CurrentPage);
	$('#currentPage').text(CurrentPage);
	$('.layui-carousel-arrow[lay-type="' + changeType + '"]').click();
}

$('#Query').on('click',function(){
	$('.keybord-region').css('display','block');
	$('.depinfo').css('display','none');
})
$('#HaveNum').on('click',function(){
	var status = $('#HaveNum').attr('data');
	if(status == "have"){
		$('#HaveNum').attr('data','no');
		$('#HaveNum').find('label').text('全部');
	}else{
		location.reload();
		return;
		$('#HaveNum').attr('data','have');
		$('#HaveNum').find('label').text('有号');
	}
	//alert('还没做呢');
	GetHISDepInfo();
});
function init_keybord(){
	$('.keybord').on('click',function(){
		var keyId = $(this).text();
		var data = $(this).attr('data');
		if(data){
			keyId = data;
		}
		switch (keyId)  {
		case 'confirm':
			$('.keybord-region').css('display','none');
			$('.depinfo').css('display','block');
			GetHISDepInfo();
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
		}
		var tmpData = $("#CardNo").text();
		if(tmpData == ""){
			$('.tip-placeholder').css('display','block');
		}else{
			$('.tip-placeholder').css('display','none');
		}	
	});
}
