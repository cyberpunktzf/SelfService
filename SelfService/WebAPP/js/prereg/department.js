/** 
 * FileName: department.js
 * Anchor: tangzf
 * Date: 2020-4-26
 * Description: 预约挂号-二级科室查询
 */
var Global={
	SelectRow :'',
	COL : 3,
	ROW : 5,
	BOXHEIGHT: '80px'
}
var tmpFlag = 0;
var CurrentPage = 1;
var TotalPage = 1;
 $(function () {
	var role = OSPGetParentVal('client_dict', 'ss_eqlistd_role');
	if (role == "role2"){
		Global.ROW = 3;
		$('.level1-title').css('line-height','0px');
		$('.search-box').css('display','none');
		$('#level1Dep').css('display','none');

		$('.bottom-change').css({'position': 'absolute','top': '490px', 'left': '500px'});
		$('.bottom-change').find('img').css({'width': '140px', 'margin-bottom':'12px'});
	}
	layui.use('carousel', function(){
		carousel = layui.carousel;
		//建造实例
		carousel.render({
			elem: '#TurnPlay',
			width: '100%', //设置容器宽度
			arrow: 'always', //始终显示箭头
			autoplay:false
		});
	});		
	GetHISDepInfo();
	init_keybord();
	OSPSetParentVal('DocPage', '1');
 });
 
 function GetHISDepInfo(){
	tmpFlag++;
	var DepartmentName = INSUGetRequest('DepartmentName');
	DepartmentName = "【" + DepartmentName + "】";
	$('#level1Dep').text(DepartmentName);
	if(!INSUGetRequest('DepartmentName')){
		$('#level1Dep').text(String.fromCharCode(2));
	}
	var jsonObj = PayServ_GetLevel2Dep();
	AddDepToHtml(jsonObj);
 }
function AddDepToHtml(jsonObj){
	// init
	TotalPage = 1;
	CurrentPage = 1;
	$('#currentPage').text(CurrentPage);
	//
	$(".HISContent").children().remove();
	//
	if(jsonObj.Response.RecordCount	=="0"){
		OSPAlert('','没有有效科室','提示',function(){ 
            rebackClick();
        });
	}
	var DepArr = jsonObj.Response.Departments.Department ;
	if(!DepArr.length){
		DepArr = [
			DepArr
		]
	}
	var perCol = 4;   //12 / Global.COL;
	var htmlStr = "<div class='TurnPlay layui-this'>";
	//检索
	var Input = $('#CardNo').text();
	var tmpAllLength = 0;
	var tmpDepArr = [];
	var BusinessType = OSPGetParentVal('BusinessType');
	var processcode = OSPGetParentVal('processcode');
	$.each(DepArr, function(index,val){
		if(typeof val == "undefined"){
			return true;
		}
		var SP = makePy(val.DepartmentName);
		if(typeof SP !="string"){
			SP = SP[0];
		}
		if((Input != SP && Input != "" && SP.indexOf(Input) < 0) || ( INSUGetRequest('DepartmentCode') == "13" && BusinessType == "Reg" && val.DepartmentName.indexOf('小儿内分泌') < 0) || ( (processcode == "HXReg")&&(val.DepartmentName !="呼吸科门诊") )){
			//DepArr.splice(index,1)
			//delete DepArr[index];
		}else{
			tmpDepArr.push(val);
		}
	})
	//DepArr.sort();
	//DepArr.length = tmpAllLength;
	DepArr = tmpDepArr;
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
				htmlStr = htmlStr + "<div class='TurnPlay'>";
				TotalPage++;
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
	//1页的不显示上下页
	if(TotalPage == 1){
		$('.changebtn').css('display','none');
	}else{
		$('.changebtn').css('display','');
	}
	$('.HISContent .sys-white-defbutton').bind("click",function(){
		
		var DepCode = $(this).find('label').attr('id');
		var DepInfo = $(this).find('label').attr('data');
		var DepDesc = JSON.parse(DepInfo).DepartmentName;

		var DepartmentNotes = JSON.parse(DepInfo).DepartmentNotes;
		if(DepartmentNotes !=""){
			OSPAlert('',DepartmentNotes,'提示');
			return;
		}
		Disabled(this,'.sys-white-defbutton');
		var DepDesc = JSON.parse(DepInfo).DepartmentName;
		//全自费科室标志
		if(typeof JSON.parse(DepInfo).ATMZFFlag != "undefined"){
			if(JSON.parse(DepInfo).ATMZFFlag == "Y"){
				OSPSetParentVal('InsuType','1');
				// 保存操作日志
				PayServ_SaveBDInfo("insutype","&Param=1","","6666");
			}
		}
		else if(DepDesc.indexOf('生殖') > -1){
			OSPSetParentVal('InsuType','1');
			// 保存操作日志
			PayServ_SaveBDInfo("insutype","&Param=1","","6666");		
		}
		//reg
		var Param = '&DepartmentCode=' + DepCode + '&DepartmentName=' + DepDesc;
		OSPSetParentVal('DepDesc',DepDesc);
		if (DepDesc.indexOf("口腔内科") > -1 ){
			OSPAlert('','主要治疗：治牙、补牙、洗牙','口腔内科',function(){
				GoNextBusiness(Param);
				return false;
			});
		}else if (DepDesc.indexOf("口腔颌") > -1 ){
			OSPAlert('','主要治疗：拔牙、口腔颌面部肿物及外伤','口腔颌面外科',function(){
				GoNextBusiness(Param);
				return false;
			});
		}
		else if (DepDesc.indexOf("口腔综合") > -1 ){
			OSPAlert('','主要治疗：综合治疗','口腔综合科',function(){
				GoNextBusiness(Param);
				return false;
			});
		}
		else if (DepDesc.indexOf("口腔种植") > -1 ){
			OSPAlert('','主要治疗：种牙、植牙','口腔种植科',function(){
				GoNextBusiness(Param);
				return false;
			});
		}
		else if (DepDesc.indexOf("口腔修复") > -1 ){
			OSPAlert('','主要治疗：镶牙、做牙套、牙齿美容','口腔修复科',function(){
				GoNextBusiness(Param);
				return false;
			});
		}
		else if (DepDesc.indexOf("口腔正畸") > -1 ){
			OSPAlert('','主要治疗：牙齿矫正','口腔正畸科',function(){
				GoNextBusiness(Param);
				return false;
			});
		}
		else{
			GoNextBusiness(Param);
			return false;
		}
		/*ayServ_SaveOption(Param)
		var jsonObj = PayServ_GetDocInfo();
		if(jsonObj.Response.RecordCount == "0"){
			OSPAlert('','当前科室没有排班资源','提示');
			return;
		}*/
		//GoNextBusiness(Param);
	});
	function _BuildButton(index,DepArr){
		var htmlStr = "<div class='sys-white-defbutton'>";
		var depName = DepArr[index].DepartmentName;
		if (depName.length > 9){
			htmlStr = htmlStr + "<label style='font-size:28px' class='sys-white-defbutton-label' data='" + JSON.stringify(DepArr[index]) + "' id='" + DepArr[index].DepartmentCode + "' data-options='iconCls:'icon-big-fee-arrow',plain:true'>" + depName + "</label>";
			htmlStr = htmlStr + "</div>";
		}else{
			htmlStr = htmlStr + "<label class='sys-white-defbutton-label' data='" + JSON.stringify(DepArr[index]) + "' id='" + DepArr[index].DepartmentCode + "' data-options='iconCls:'icon-big-fee-arrow',plain:true'>" + depName + "</label>";
			htmlStr = htmlStr + "</div>";
		}

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
		return;
	},500);
	if(changeType == "add"){
		if(CurrentPage==TotalPage){
			return;
		}
		if(tmpFlag > 1){
			var tmpTurnPlay = $('.layui-this');
			$('.layui-this').next().addClass('layui-this');
			$(tmpTurnPlay).removeClass('layui-this');
		}
		CurrentPage++;
		CurrentPage=CurrentPage==(TotalPage+1)?1:CurrentPage;
	}else{
		if(CurrentPage==1){
			return;
		}
		if(tmpFlag > 1){
			var tmpTurnPlay = $('.layui-this');
			$('.layui-this').prev().addClass('layui-this');
			$(tmpTurnPlay).removeClass('layui-this');
		}
		CurrentPage--;
		CurrentPage=CurrentPage<1?TotalPage:CurrentPage;
	}
	$('#currentPage').text(CurrentPage);
	$('.layui-carousel-arrow[lay-type="' + changeType + '"]').click();
}
$('#Query').on('click',function(){
	$('.keybord-region').css('display','block');
	$('.depinfo').css('display','none');
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
				break;
		}	
		var tmpData = $("#CardNo").text();
		if(tmpData == ""){
			$('.tip-placeholder').css('display','block');
		}else{
			$('.tip-placeholder').css('display','none');
		}
	});
}