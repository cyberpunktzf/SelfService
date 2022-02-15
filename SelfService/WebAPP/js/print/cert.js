/**
 * FileName: charge.print.main.js
 * Anchor: tangzf
 * Date: 2021-3-23
 * Description: 移动收费凭条打印
 */
$(function () {
	var count = 0;
	$("#Reg").bind("click", function() {
		if (++count == 1) {
			RegPrint("Reg");
		}
	});
	
	count = 0;
	$("#Charge").bind("click",function() {
		if (++count == 1) {
			RegPrint("Charge");
		}
	});
});

function RegPrint(PrintType){
	var rtn = PayServ_CertPrint(PrintType);
	if (rtn.output == ""){
		OSPAlert('', '没有需要打印的信息', '提示');
		return;
	}
	/*
	if(rtn.output.split('##').length <= 1){
		OSPAlert('','获取HIS打印数据失败，HIS未返回数据：' + rtn.output, '提示');
		return;
	}
	*/
	var PrintInfo = rtn.output.split('##');
	var regNum = 0;
	var invNum = 0;
	var printTimes = 0;
	var isRePrint = false;
	$.each(PrintInfo, function(index, val){
		if (!val) {
			return true;
		}
		var myAry = val.split('^');
		var PrintId = myAry[0];
		var tmpPrintType = myAry[1];
		printTimes = myAry[2];
		if (PrintType != tmpPrintType) {
			return true;
		}
		if (printTimes > 0) {
			isRePrint = true;
			return true;
		}
		if(PrintType == "Reg"){
			regNum++;
		}else{
			invNum++;
		}
		AddLoading('请稍后，正在打印第' + (index + 1) + '项，共' + PrintInfo.length + '项目');
		OSPPrintByLodop(PrintType, PrintId);
		RemoveLoading();
	});
	if (isRePrint) {
		OSPAlert('', '您已成功打印一次凭证，当前仅支持打印一次', '提示');
		return;
	}
	if ((regNum > 0) || (invNum > 0)) {
		OSPAlert('', '您已成功打印该凭条，请取走您的相关证件和凭证', '提示',function(){
			homePageClick();
		});
		setTimeout(function(){
			homePageClick();
		},2000)
		return;
	}
	if((PrintType == "Reg") && (regNum == 0)) {
		OSPAlert('', '无有效挂号记录', '提示');
		return;
	}
	if((PrintType == "Charge") && (invNum == 0)) {
		OSPAlert('', '无有效缴费记录', '提示');
		return;
	}
}

/*
	回调方法处理返回值
*/
 function PrintCallBack(jsonObj){
	
}









