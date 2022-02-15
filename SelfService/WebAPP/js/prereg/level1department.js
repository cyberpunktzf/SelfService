/**
 * FileName: prereg.level1department.js
 * Anchor: tangzf
 * Date: 2021-4-26
 * Description: 一级科室查询
 */
var Global={
	SelectRow :'',
	COL : 3,
	ROW : 5
}
var CurrentPage = 1;
var TotalPage = 1;

$(function () {
	var role = OSPGetParentVal('client_dict', 'ss_eqlistd_role');
	if (role == "role2"){
		Global.ROW = 3;
		$('.level1-title').css({'line-height': '0'});
		$('.bottom-change').css({'position':'absolute','top':'490px','left':'500px'});
		$('.bottom-change>img').css({'width': '140px', 'margin-bottom':'12px'});
	}
	GetHISDepInfo();
});
 
function GetHISDepInfo(){
	var jsonObj = PayServ_GetLevel1Dep();
	AddDepToHtml(jsonObj);	
}

function AddDepToHtml(jsonObj){
	if(!jsonObj.Response.Departments){
		OSPAlert('',"没有维护一级科室信息",'提示',function(){	
			homePageClick();
			return;
		});
	}
	var DepArr = jsonObj.Response.Departments.Department;
	if(typeof DepArr.length == "undefined"){
		DepArr = [
			DepArr
		]
	}
	layui.use('carousel', function(){
		var carousel = layui.carousel;
		//建造实例
		carousel.render({
		  elem: '#TurnPlay',
		  width: '100%',     //设置容器宽度
		  arrow: 'always',   //始终显示箭头
		  //anim: 'updown',  //切换动画方式
		  autoplay:false
		});
	});
	//var DepArr = jsonObj.Response.Departments.Department;
	var perCol = 4;   //12 / Global.COL;
	var htmlStr = "<div class='TurnPlay'>";
	//检索
	var processcode = OSPGetParentVal('processcode');
	var BusinessType = OSPGetParentVal('BusinessType');	
	var tmpAllLength = 0;
	var tmpArrDep = [];
	$.each(DepArr, function(index,val){
		if(typeof val == "undefined"){
			return true;
		}
		var UnionInfoFlag = OSPGetParentVal('UnionFlag');
		if(typeof UnionInfoFlag =="undefined"){
			UnionInfoFlag = "";
		}
		var tempMENU = OSPGetParentVal('client_dict')['ss_eqlistd_eqcode'];
		if((processcode == "UnionOP-ORDR" && val.DepartmentName.indexOf('联合') < 0) || (UnionInfoFlag != "Y" && val.DepartmentName.indexOf('联合') > -1)  || (processcode == "HXReg" && val.DepartmentName !='内科类') || (val.DepartmentName.indexOf('核酸退费') > -1) || ( processcode !="TJReg" && val.DepartmentName.indexOf('体检') > -1) ) { // 此处添加过滤条件
			//delete DepArr[index];
		}else{
			tmpArrDep.push(val);
			//tmpAllLength++;
		}
	});
	
	//DepArr.sort();
	//DepArr.length = tmpAllLength;
	// 检索结束
	DepArr = tmpArrDep;
	$.each(DepArr, function(index, val){
		if(index == 0){		
			htmlStr = htmlStr + "<div class='layui-row'>"
				htmlStr = htmlStr + "<div class='layui-col-md" + perCol + " '>";
				htmlStr = htmlStr + _BuildButton(index, DepArr);
				htmlStr = htmlStr + "</div>";
		}else if((index / Global.COL) % 1 === 0) {
			htmlStr = htmlStr + "</div>";
			if((index / (Global.COL * Global.ROW)) % 1 === 0){
				htmlStr = htmlStr + "</div>";  // TurnPlay
				htmlStr = htmlStr + "<div class='TurnPlay'>";
				TotalPage++;
			}
			htmlStr = htmlStr + "<div class='layui-row'>";
				htmlStr = htmlStr + "<div class='layui-col-md" + perCol + " '>";
				htmlStr = htmlStr + _BuildButton(index,DepArr);
				htmlStr = htmlStr + "</div>";
		}else if(index == DepArr[index].length - 1) {
				htmlStr = htmlStr + "<div class='layui-col-md" + perCol + " '>";
				htmlStr = htmlStr + _BuildButton(index, DepArr);
				htmlStr = htmlStr + "</div>";
			htmlStr = htmlStr + "</div>";
			htmlStr = htmlStr + "</div>";
		}else{
			htmlStr = htmlStr + "<div class='layui-col-md" + perCol + " '>";
			htmlStr = htmlStr + _BuildButton(index, DepArr);
			htmlStr = htmlStr + "</div>";
		}	
	});
	htmlStr = htmlStr + "</div>";
	$(".HISContent").prepend(htmlStr);
	$('#pageNum').text('/' + TotalPage);

	$('.sys-white-defbutton').on("click", function() {
		Disabled(this, '.sys-white-defbutton');
		var DepCode = $(this).find('label').attr('id');
		var DepInfo = $(this).find('label').attr('data');
		var DepDesc = JSON.parse(DepInfo).DepartmentName;
		var Param = '&DepartmentCode=' + DepCode + '&DepartmentName=' + DepDesc; 
		GoNextBusiness(Param);
		return false;
	});
	
	function _BuildButton(index, DepArr){
		var htmlStr = "<div class='sys-white-defbutton'>";
		htmlStr = htmlStr + "<label class='sys-white-defbutton-label' data='" + JSON.stringify(DepArr[index]) + "' id='" + DepArr[index].DepartmentCode + "'>" + DepArr[index].DepartmentName + "</label>";
		htmlStr = htmlStr + "</div>";
		return htmlStr;
	}
}

function ChangePage(changeType) {
	var tmpPro = $('#NextButton').attr('disabled');
	if(tmpPro){
		return;
	}
	$('#NextButton,#BackButton').attr('disabled','disabled');
	setTimeout(function(){
		$('#NextButton,#BackButton').removeAttr('disabled');
	},500)
	if (changeType == "add") {
		if (CurrentPage == TotalPage) {
			return;
		}
		CurrentPage++;
		CurrentPage = CurrentPage == (TotalPage + 1)  ? 1 : CurrentPage;
	}else{
		if(CurrentPage == 1) {
			return;
		}
		CurrentPage--;
		CurrentPage = CurrentPage < 1 ? TotalPage : CurrentPage;
	}
	$('.layui-carousel-arrow[lay-type="' + changeType + '"]').click();
	$('#currentPage').text(CurrentPage);

}