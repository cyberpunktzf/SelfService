/**
 * FileName: dhcbillinsu.offselfpro.query.opinv.js
 * Anchor: tangzf
 * Date: 2020-3-23
 * Description: 移动收费-门诊费用查询
 */
 var Global={
	 COL : 1,
	 ROW : 6,
	 RegRow : 4
 }
var CurrentPage = 1;
var TotalPage = 1;
var RegCurrentPage = 1;
var RegTotalPage = 1;
var InvInfo = [];
var RegInfo = [];

$(function () {
	QueryInvInfo();
});

function QueryInvInfo(){
	var role = OSPGetParentVal('client_dict', 'ss_eqlistd_role');
	if (role == "role2") {
		$("div.pagetitle").css({'padding-top': '2px'});
		$("div.pagetitle>img").css({'height': '17px','width':'17px;','padding-bottom': '10px'});
		$("div.pagetitle>label").css({'font-size': '17px'});
		$(".foot>img").css({'width': '100px'});
		$(".foot>label").css({'font-size': '17px'});
		$(".table-title.sys-white-defbutton").css({'height': '32px'});
		$("label.sys-white-defbutton-label").css({'font-size': '16px','line-height': '9px'});
		$(".HISContent .sys-white-defbutton-label").addClass('bgj');
		$(".charge>div.layui-col-md12").css({'height': '290px'});
		$(".reg>div.layui-col-md12").css({'height': '185px'});
		$(".HISContent").addClass('bgj');
		$("#TurnPlay").addClass("list-carousel-chg-bgj");
		$("#TurnPlay2").addClass("list-carousel-reg-bgj");
	}
	var rtn = PeyServ_QueryChargeDet();
	QueryCallBack(rtn);	
}

function QueryCallBack(jsonObj) {
	if (jsonObj.Response.ResultCode != 0) {
		OSPAlert('', jsonObj.Response.ResultMsg, '提示', function() {
			rebackClick();
		});
		return;
	}
	BuildData(jsonObj);
	AddDocToHtml();
	AddRegInfo();
}

// Reg
function AddRegInfo(){
	$(".reg .HISContent").empty();
	layui.use('carousel', function(){
		var carousel = layui.carousel;
		//建造实例
		carousel.render({
		  elem: '#TurnPlay2',
		  width: '100%', //设置容器宽度
		  arrow: 'always', //始终显示箭头
		  autoplay: false
		});
	});
	var perCol = 12;  //12 / Global.COL;
	var htmlStr = "<div class='TurnPlay'>";
	var DepArr = RegInfo;
	$.each(DepArr, function(index, val){
		if(index == 0){		
			htmlStr = htmlStr + "<div class='layui-row'>";
				htmlStr = htmlStr + "<div class='md" + perCol + "'>";
				htmlStr = htmlStr + _BuildButton(index, DepArr);
				htmlStr = htmlStr + "</div>";
		}else if((index / Global.COL) % 1 === 0){
			htmlStr = htmlStr + "</div>"; // box
			if((index / (Global.COL * Global.RegRow)) % 1 === 0){
				htmlStr = htmlStr + "</div>"; // TurnPlay
				RegTotalPage++;
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
	htmlStr = htmlStr + "</div'>";
	$(".reg .HISContent").prepend(htmlStr);

	$('#RegpageNum').text('/' + RegTotalPage);
	function _BuildButton(index, DepArr){
		var AdmNo = DepArr[index].AdmNo;
		var AdmDept = DepArr[index].AdmDept;
		var QueMark = DepArr[index].QueMark;
		var TotalAmt = DepArr[index].TotalAmt;
		var SelfPayAmt = DepArr[index].SelfPayAmt;
		var InvDate = DepArr[index].InvDate;
		var Status = DepArr[index].BillFlag;
		
		var htmlStr = "<div class='sys-white-defbutton'>";
			//col
			htmlStr = htmlStr + "<div class='row-col' style='width:180px;'>";
				htmlStr = htmlStr + "<div>";
					htmlStr = htmlStr + "<label  class='sys-white-defbutton-label'>" +  AdmNo + "</label><hr style='margin-left:25px'/>";				
				htmlStr = htmlStr + "</div>";		
			htmlStr = htmlStr + "</div>";
			htmlStr = htmlStr + "<div class='row-col' style='width:180px;'>";
				htmlStr = htmlStr + "<div>";
					htmlStr = htmlStr + "<label class='sys-white-defbutton-label'>" + AdmDept + "</label><hr/>";					
				htmlStr = htmlStr + "</div>";
			htmlStr = htmlStr + "</div>";
			htmlStr = htmlStr + "<div class='row-col' style='width:120px;'>";
				htmlStr = htmlStr + "<div>";
					htmlStr = htmlStr + "<label class='sys-white-defbutton-label'>" + QueMark + "</label><hr/>";					
				htmlStr = htmlStr + "</div>";
			htmlStr = htmlStr + "</div>";
			htmlStr = htmlStr + "<div class='row-col' style='width:120px;'>";
				htmlStr = htmlStr + "<div>";
					htmlStr = htmlStr + "<label class='sys-white-defbutton-label'>" + TotalAmt + "</label><hr/>";					
				htmlStr = htmlStr + "</div>";
			htmlStr = htmlStr + "</div>";
			htmlStr = htmlStr + "<div class='row-col' style='width:120px;'>";
				htmlStr = htmlStr + "<div>";
					htmlStr = htmlStr + "<label class='sys-white-defbutton-label'>" + SelfPayAmt + "</label><hr/>";					
				htmlStr = htmlStr + "</div>";
			htmlStr = htmlStr + "</div>";
			htmlStr = htmlStr + "<div class='row-col' style='width:120px;'>";
				htmlStr = htmlStr + "<div>";
					htmlStr = htmlStr + "<label class='sys-white-defbutton-label'>" +  InvDate + "</label><hr/>";				
				htmlStr = htmlStr + "</div>";		
			htmlStr = htmlStr + "</div>";
			htmlStr = htmlStr + "<div class='row-col' style='width:100px;'>";
				htmlStr = htmlStr + "<div>";
					htmlStr = htmlStr + "<label class='sys-white-defbutton-label'>" + Status + "</label><hr style='width:70px;'/>";
				htmlStr = htmlStr + "</div>";
			htmlStr = htmlStr + "</div>";
		htmlStr = htmlStr + "</div>";
		
		return htmlStr;
	}
}

//Charge
function AddDocToHtml(){
	$(".charge .HISContent").empty();
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

	var perCol = 12;   //12 / Global.COL;
	var htmlStr = "<div class='TurnPlay'>";
	var DepArr = InvInfo;
	$.each(DepArr, function(index,val){
		if(index == 0) {
			htmlStr = htmlStr + "<div class='layui-row'>"
				htmlStr = htmlStr + "<div class='md" + perCol + "'>";
				htmlStr = htmlStr + _BuildButton(index, DepArr);
				htmlStr = htmlStr + "</div>";
		}else if((index / Global.COL) %1 === 0) {
			htmlStr = htmlStr + "</div>";
			if((index / (Global.COL * Global.ROW)) % 1 === 0){
				htmlStr = htmlStr + "</div>";
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
	htmlStr = htmlStr + "</div'>";
	$(".charge .HISContent").prepend(htmlStr);

	$('#pageNum').text('/' + TotalPage);
	function _BuildButton(index,DepArr){
		var AdmNo = DepArr[index].AdmNo;		
		var Uom = DepArr[index].ItemUom == "" ? "无" : DepArr[index].ItemUom;
		var ItmDesc = DepArr[index].ItemName.substring(0,10);
		var Price = DepArr[index].ItemPrice;	
		var Num = DepArr[index].ItemQty;
		var TotalAmt = DepArr[index].ItemSum;
		var Status = DepArr[index].BillFlag;
		var htmlStr = "<div class='sys-white-defbutton'>";
			//col
			htmlStr = htmlStr + "<div class='row-col' style='width:120px;'>";
				htmlStr = htmlStr + "<div>";
					htmlStr = htmlStr + "<label  class='sys-white-defbutton-label'>" +  AdmNo + "</label><hr style='margin-left:25px'/>";
				htmlStr = htmlStr + "</div>";
			htmlStr = htmlStr + "</div>";
			//name
			htmlStr = htmlStr + "<div class='row-col' style='width:220px;'>";
				htmlStr = htmlStr + "<div>";
					htmlStr = htmlStr + "<label class='sys-white-defbutton-label'>" + ItmDesc + "</label><hr/>";					
				htmlStr = htmlStr + "</div>";
			htmlStr = htmlStr + "</div>";
			htmlStr = htmlStr + "<div class='row-col' style='width:150px;'>";
				htmlStr = htmlStr + "<div>";
					htmlStr = htmlStr + "<label class='sys-white-defbutton-label'>" + Price + "</label><hr/>";					
				htmlStr = htmlStr + "</div>";
			htmlStr = htmlStr + "</div>";
			//col
			htmlStr = htmlStr + "<div class='row-col' style='width:120px;'>";
				htmlStr = htmlStr + "<div>";
					htmlStr = htmlStr + "<label class='sys-white-defbutton-label'>" +  Num + "</label><hr/>";				
				htmlStr = htmlStr + "</div>";		
			htmlStr = htmlStr + "</div>";
			//name
			htmlStr = htmlStr + "<div class='row-col' style='width:150px;'>";
				htmlStr = htmlStr + "<div>";
					htmlStr = htmlStr + "<label class='sys-white-defbutton-label'>" + TotalAmt + "</label><hr/>";					
				htmlStr = htmlStr + "</div>";
			htmlStr = htmlStr + "</div>";
			htmlStr = htmlStr + "<div class='row-col' style='width:120px;'>";
				htmlStr = htmlStr + "<div>";
					htmlStr = htmlStr + "<label class='sys-white-defbutton-label'>" + Uom + "</label><hr style='width:170px;'/>";					
				htmlStr = htmlStr + "</div>";
			htmlStr = htmlStr + "</div>";
			htmlStr = htmlStr + "<div class='row-col' style='width:100px;'>";
				htmlStr = htmlStr + "<div>";
					htmlStr = htmlStr + "<label class='sys-white-defbutton-label'>" + Status + "</label><hr style='width:70px;'/>";
				htmlStr = htmlStr + "</div>";
			htmlStr = htmlStr + "</div>";
		htmlStr = htmlStr + "</div>";
		return htmlStr;
	}
}
function BuildData(jsonObj) {
	if(jsonObj.Response.RecordCount == 1) {
		var data = [{
			FairType: jsonObj.Response.RecordList.Record.FairType,
			OrderNo:  jsonObj.Response.RecordList.Record.OrderNo,
			InvoiceNo:  jsonObj.Response.RecordList.Record.AdmNo,
			InvDate:  jsonObj.Response.RecordList.Record.InvDate,
			InvTime:  jsonObj.Response.RecordList.Record.InvTime,
			DurgWin:  jsonObj.Response.RecordList.Record.DurgWin,
			TotalAmt:  jsonObj.Response.RecordList.Record.TotalAmt,
			PatShareAmt: jsonObj.Response.RecordList.Record.PatShareAmt,
			InsuShareAmt: jsonObj.Response.RecordList.Record.InsuShareAmt,
			ItemList:  jsonObj.Response.RecordList.Record.ItemList,
			QueMark: jsonObj.Response.RecordList.Record.QueMark,      //2021-09-23 ZhYW 号别
			AdmDept: jsonObj.Response.RecordList.Record.AdmDept,      //科室
			BillStatus: jsonObj.Response.RecordList.Record.BillStatus,
			AdmNo: jsonObj.Response.RecordList.Record.AdmNo
		}]
		jsonObj.Response.RecordCount = 1;
		jsonObj.Response.RecordList.Record = data;
	}
	
	//挂号记录
	jsonObj.Response.RecordList.Record.forEach(function(item, index) {
		var fairType = item.FairType;
		if (fairType != 'R') {
			return true;
		}
		var tmpRegJson = {
			'AdmNo': item.AdmNo,
			'AdmDept': item.AdmDept,
			'QueMark': item.QueMark,
			'TotalAmt': item.TotalAmt,
			'SelfPayAmt': item.PatShareAmt,
			'InvDate': item.InvDate,
			'BillFlag': item.BillStatus
		}
		RegInfo = RegInfo.concat(tmpRegJson);
	});
	
	for (var i = 0; i < jsonObj.Response.RecordCount; i++) {
		var MainList = 	jsonObj.Response.RecordList;
		if (MainList.Record[i].FairType == "R") {
			continue;
		}
		if (MainList.Record[i].ItemList.Item.length){
			for (var j = 0; j < MainList.Record[i].ItemList.Item.length; j++){
				var tmpItemInfo = MainList.Record[i].ItemList.Item[j];
				var tmpInvJson = {
					'AdmNo': MainList.Record[i].AdmNo,
					'ItemName': tmpItemInfo.ItemName,
					'ItemPrice': tmpItemInfo.ItemPrice,
					'ItemQty': tmpItemInfo.ItemQty,
					'ItemSum': tmpItemInfo.ItemSum,
					'ItemUom': tmpItemInfo.ItemUom,
					'BillFlag': MainList.Record[i].BillStatus
				}
				InvInfo = InvInfo.concat(tmpInvJson);
			}
		}else {
			var tmpItemInfo = MainList.Record[i].ItemList.Item;
			var tmpInvJson = {
				'AdmNo': MainList.Record[i].AdmNo,
				'ItemName': tmpItemInfo.ItemName,
				'ItemPrice': tmpItemInfo.ItemPrice,
				'ItemQty': tmpItemInfo.ItemQty,
				'ItemSum': tmpItemInfo.ItemSum,
				'ItemUom': tmpItemInfo.ItemUom,
				'BillFlag': MainList.Record[i].BillStatus
			}
			InvInfo = InvInfo.concat(tmpInvJson);
		}
	}
}

function ChangePage(changeType, optType) {
	if (optType){
		if(changeType == "add") {
			if (RegCurrentPage == RegTotalPage) {
				return;
			}
			RegCurrentPage++;
			RegCurrentPage = (RegCurrentPage == (RegTotalPage + 1)) ? 1 : RegCurrentPage;
		}else {
			if (RegCurrentPage == 1) {
				return;
			}
			RegCurrentPage--;
			RegCurrentPage = (RegCurrentPage < 1) ? RegCurrentPage : RegCurrentPage;
		}
		$('#RegcurrentPage').text(RegCurrentPage);
		//if ((RegTotalPage.length > 0) && (RegInfo.length > 0)) {
		if ((TotalPage > 1) && (RegTotalPage > 1)) {
			$('.layui-carousel-arrow[lay-type="' + changeType + '"]').eq(1).click();
		}else {
			$('.layui-carousel-arrow[lay-type="' + changeType + '"]').eq(0).click();
		}
	}else{
		if(changeType == "add") {
			if(CurrentPage == TotalPage){
				return;
			}
			CurrentPage++;
			CurrentPage=CurrentPage == (TotalPage + 1) ? 1 : CurrentPage;
		}else{
			if(CurrentPage == 1){
				return;
			}
			CurrentPage--;
			CurrentPage = (CurrentPage < 1) ? TotalPage : CurrentPage;
		}
		$('#currentPage').text(CurrentPage);
		$('.layui-carousel-arrow[lay-type="' + changeType + '"]').eq(0).click();
	}
}