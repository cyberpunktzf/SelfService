/**
 * FileName: prereg.level1department.js
 * Anchor: tangzf
 * Date: 2021-4-26
 * Description: 一级科室查询
 */
var Global={
	SelectRow :'',
	COL : 3,
	ROW : 5,
	BOXHEIGHT: '80px'
}
var CurrentPage = 1;
var TotalPage = 1;
 $(function () {
	var role = OSPGetParentVal('client_dict', 'ss_eqlistd_role');
	if (role == "role2"){
		Global.ROW = 3;
		$('.level1-title').css('line-height', '0px');
		$('.search-box').css('display', 'none');
		$('#level1Dep').css('display', 'none');
		$('.bottom-change').css({'position':'absolute','top':'495px','left':'500px'});
		$('.bottom-change>img').css({'width': '140px', 'margin-bottom': '10px'});
	}else {
		$('.bottom-change').hide();
	}
	GetHISDepInfo();
});

function GetHISDepInfo(){
	var InputObj = {
		'DicType' :'MTLBA'
	}
	var jsonObj = PayServ_GetDicInfo(InputObj);
	AddDepToHtml(jsonObj);
}
 
function AddDepToHtml(jsonObj){
	if(typeof jsonObj.Response == "undefined"){
		GoNextBusiness("","Skip");
		return false;
	}
	if(typeof jsonObj.Response.output == "undefined"){
		GoNextBusiness("","Skip");
		return false;
	}
	if(typeof jsonObj.output == "undefined"){
		//GoNextBusiness();
	}
	if(jsonObj.Response.output == "[]"){
		OSPAlert('',"HIS医生站科室慢病对照未维护",'提示|Y',function(){
			rebackClick();
			return false;
		});
		return false;
	}
	//var DicInfo = jsonObj.Response.output;

	//var DepArr = jsonObj.Response.Departments.Department;
	var DepArr = JSON.parse(jsonObj.Response.output);
	if(!DepArr.length){
		DepArr = [
			DepArr
		]
	}
	layui.use('carousel', function(){
		var carousel = layui.carousel;
		//建造实例
		carousel.render({
		  elem: '#TurnPlay',
		  width: '100%', //设置容器宽度
		  arrow: 'always', //始终显示箭头
		  //anim: 'updown', //切换动画方式
		  autoplay: false
		});
	});
	var perCol = 4;    //12 / Global.COL;
	var htmlStr = "<div class='TurnPlay'>";
	$.each(DepArr, function(index, val){
		if(index == 0){		
			htmlStr = htmlStr + "<div class='layui-row'>";
				htmlStr = htmlStr + "<div class='layui-col-md" + perCol + "'>";
				htmlStr = htmlStr + _BuildButton(index, DepArr);
				htmlStr = htmlStr + "</div>";
		}else if((index / Global.COL) % 1 === 0){ //
			htmlStr = htmlStr + "</div>";  // box
			if((index / (Global.COL * Global.ROW)) % 1 === 0){
				htmlStr = htmlStr + "</div>"; // TurnPlay
				htmlStr = htmlStr + "<div class='TurnPlay'>";
				TotalPage++;
			}
			htmlStr = htmlStr + "<div class='layui-row'>";
				htmlStr = htmlStr + "<div class='layui-col-md" + perCol + "'>";
				htmlStr = htmlStr + _BuildButton(index, DepArr);
				htmlStr = htmlStr + "</div>";
		}else if(index == DepArr[index].length - 1){
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

	$('.sys-white-defbutton').on("click", function(){
		Disabled(this, '.sys-white-defbutton');
		var DepInfo = $(this).find('label').attr('data');
		var Param = '&Param=' + DepInfo;
		OSPSetParentVal('MTLB',JSON.parse(DepInfo).INDIDDicCode);
		GoNextBusiness(Param);
		return false;
	});
	function _BuildButton(index,DepArr){
		var htmlStr = "<div class='sys-white-defbutton'>";
		htmlStr = htmlStr + "<label class='sys-white-defbutton-label' data='" + JSON.stringify(DepArr[index]) + "' id='" + DepArr[index].INDIDDicCode + "'>" + DepArr[index].INDIDDicDesc.substring(0,5) + "</label>";
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
	},500);
	if(changeType == "add"){
		if(CurrentPage == TotalPage){
			return;
		}
		/*
		var tmpTurnPlay = $('.layui-this');
		$('.layui-this').next().addClass('layui-this');
		$(tmpTurnPlay).removeClass('layui-this');
		*/
		CurrentPage++;
		CurrentPage = CurrentPage == (TotalPage + 1) ? 1 : CurrentPage;
	}else{
		if(CurrentPage == 1) {
			return;
		}
		/*
		var tmpTurnPlay = $('.layui-this');
		$('.layui-this').prev().addClass('layui-this');
		$(tmpTurnPlay).removeClass('layui-this');
		*/
		CurrentPage--;
		CurrentPage = CurrentPage < 1 ? TotalPage : CurrentPage;
	}
	$('#currentPage').text(CurrentPage);
	$('.layui-carousel-arrow[lay-type="' + changeType + '"]').click();
}