/**
 * FileName: offselfpro.query.itemprice.js
 * Anchor: tangzf
 * Date: 2020-3-23
 * Description: 物价查询
 */
 var Global={
	COL : 1,
	ROW : 8,
	BGJClass: '',
	IsMedicine: false    //是否药品
}
var CurrentPage = 1 ;
var TotalPage = 1;

$(function () {
	var role = OSPGetParentVal('client_dict', 'ss_eqlistd_role');
	if (role == "role2") {
		Global.BGJClass = 'bgj';
		$(".layui-carousel").addClass('list-carousel');
		$("body>div.pagetitle").css({'padding':'5px 0'});
		$(".sys-white-defbutton").addClass('bgj');
		$(".sys-white-defbutton .sys-white-defbutton-label").addClass('bgj');
		$('.bottom-change').css({'position': 'absolute','top': '495px','left': '500px'});
		$('.bottom-change>img').css({'width': '140px', 'margin-bottom':'10px'});
	}
	var bizType = OSPGetParentVal('processcode');
	Global.IsMedicine = (bizType == 'MedPrice');
	//药品需要显示规格
	if (Global.IsMedicine) {
		$("div.pagetitle").attr("title", "药价查询");
		$("div.pagetitle>label").text("药价查询");
		var reguHTML = "<div class='row-col' style='width:180px;'>"
							+ "<div>"
								+ "<label class='sys-white-defbutton-label' style='color:white;'>规格</label>"
							+ "</div>"
						+ "</div>";
		$(".sys-white-defbutton div.row-col:nth-child(1)").css({'width': '480px'});
		$(".sys-white-defbutton div.row-col:nth-child(2)").after(reguHTML);
	}
	QueryInvInfo();
});

function QueryInvInfo() {
	var ParamInput = INSUGetRequest('InuputNo');
	var input = {
		'ParamInput': ParamInput
	}
	var rtn = PeyServ_QueryItmPrice(input);
	BuildFirstCol(rtn);
}

function BuildFirstCol(jsonObj){
	if(!jsonObj.Response.MedItemS){
		OSPAlert('', '没有要查询的信息', '提示',function(){
			rebackClick();
		});
		return;
	}
	if(jsonObj.Response.MedItemS.MedItem.length == 1){
		var tmpData = jsonObj.Response.MedItemS.MedItem;
		jsonObj.Response.MedItemS.MedItem = {0:tmpData};		
	}
	setTimeout(function(){
		AddDocToHtml(jsonObj);
	}, 100);
}

function AddDocToHtml(jsonObj){
	if(jsonObj.Response.ResultCode != 0){
		OSPAlert('',jsonObj.Response.ErrorMsg,'提示',function(){
			rebackClick();
		});
		return;
	}

	$(".HISContent").empty();
	layui.use('carousel', function(){
		var carousel = layui.carousel;
		//建造实例
		carousel.render({
		  elem: '#TurnPlay',
		  width: '100%',    //设置容器宽度
		  arrow: 'always',  //始终显示箭头
		  autoplay: false
		});
	});
	if(typeof jsonObj.Response.MedItemS.MedItem.length == "undefined"){
		jsonObj.Response.MedItemS.MedItem[0] = jsonObj.Response.MedItemS.MedItem;
		jsonObj.Response.MedItemS.MedItem['length'] = 1;
	}
	if(typeof jsonObj.Response.MedItemS.MedItem.length == "undefined" || jsonObj.Response.MedItemS.MedItem.length == 0){
		OSPAlert('','没有要查询的信息','提示', function(){
			rebackClick();
		});
		return;
	}
	var DepArr = jsonObj.Response.MedItemS.MedItem;
	var perCol = 6;   //12 / Global.COL;
	var htmlStr = "<div class='TurnPlay'>";
	$.each(DepArr, function(index, val){
		if(index == 0){
			htmlStr = htmlStr + "<div class='layui-row'>";
				htmlStr = htmlStr + "<div class='layui-col-md" + perCol + "'>";
				htmlStr = htmlStr + _BuildButton(index, DepArr);
				htmlStr = htmlStr + "</div>";
		}else if((index / Global.COL) % 1 === 0){ //
			htmlStr = htmlStr + "</div>"; // box
			if((index / (Global.COL * Global.ROW)) % 1 === 0) {
				htmlStr = htmlStr + "</div>";   //TurnPlay
				TotalPage++;
				htmlStr = htmlStr + "<div class='TurnPlay'>";
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
	
	function _BuildButton(index, DepArr) {
		var Uom = DepArr[index].Uom == "" ? "无" : DepArr[index].Uom;
		var ItmDesc = DepArr[index].ItemDesc;
		var Price = DepArr[index].Price;
		var IncRegu = DepArr[index].IncRegu || "";   //规格
		var htmlStr = "<div class='sys-white-defbutton " + Global.BGJClass + "'>";
			//ItmDesc
			htmlStr = htmlStr + "<div class='row-col' style='width:" + (Global.IsMedicine ? '480px;' : '600px;') + "'>";
				htmlStr = htmlStr + "<div>";
					htmlStr = htmlStr + "<label class='sys-white-defbutton-label'>" +  ItmDesc + "</label><hr style='margin-left:25px;'/>";
				htmlStr = htmlStr + "</div>";
			htmlStr = htmlStr + "</div>";
			//Uom
			htmlStr = htmlStr + "<div class='row-col' style='width:120px;'>";
				htmlStr = htmlStr + "<div>";
					htmlStr = htmlStr + "<label class='sys-white-defbutton-label'>" + Uom + "</label><hr/>";					
				htmlStr = htmlStr + "</div>";
			htmlStr = htmlStr + "</div>";
			//IncRegu
			if (Global.IsMedicine) {
				//药品显示规格
				htmlStr = htmlStr + "<div class='row-col' style='width:180px;'>";
					htmlStr = htmlStr + "<div>";
						htmlStr = htmlStr + "<label class='sys-white-defbutton-label'>" + IncRegu + "</label><hr/>";
					htmlStr = htmlStr + "</div>";
				htmlStr = htmlStr + "</div>";
			}
			//price
			htmlStr = htmlStr + "<div class='row-col' style='width:120px;text-align:right;'>";
				htmlStr = htmlStr + "<div>";
					htmlStr = htmlStr + "<label class='sys-white-defbutton-label'>" + Price + "</label><hr style='width:230px;'/>";
				htmlStr = htmlStr + "</div>";
			htmlStr = htmlStr + "</div>";
			
		htmlStr = htmlStr + "</div>";
		return htmlStr;
	}
}

function ChangePage(changeType) {
	var tmpPro = $('#NextButton').attr('disabled');
	if (tmpPro){
		return;
	}
	$('#NextButton').attr('disabled','disabled');
	$('#BackButton').attr('disabled','disabled');
	setTimeout(function(){
		$('#NextButton').removeAttr('disabled');
		$('#BackButton').removeAttr('disabled');
	}, 500);
	if(changeType == "add"){
		if(CurrentPage == TotalPage){
			return;
		}
		CurrentPage++;
		CurrentPage=CurrentPage==(TotalPage+1)?1:CurrentPage;
	}else{
		if(CurrentPage == 1) {
			return;
		}
		CurrentPage--;
		CurrentPage=CurrentPage<1?TotalPage:CurrentPage;
	}
	$('#currentPage').text(CurrentPage);
	$('.layui-carousel-arrow[lay-type="' + changeType + '"]').click();
}