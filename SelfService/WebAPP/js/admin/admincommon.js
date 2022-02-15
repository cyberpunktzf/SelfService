/**
 * FileName: dhcbillinsu.offselfpro.common.js
 * Anchor: tangzf
 * Date: 2020-3-23
 * Description: 通用js
 */

var OSPSYSCountDownLeftReset = 180;
var RebackFlag = "";
 /*
*	页面跳转
*/

function LoadPage(url,OpertType){
    if(!url){
        return;
    }
    if(typeof OpertType !="undefined"){
        if(OpertType == "Skip" ){ // 标志直接跳过的界面
            window.history.pushState('','',src)
        }
    }
    var src = url; //'layui.charge.order.csp';
    PayServ_SaveOption(url)
    OSPSetParentVal('SYSLeftTime',OSPSYSCountDownLeftReset);
    //top.location.href=src;
    top.frames['main-content'].src = src;
	//modifyTimeLineStyle();
}

// 异常处理
// 供主页使用 主页不需要 判断界面代码
function checkExceptionHome(){
    try {
        var InputObj = {
            "TradeCode" : "CheckSingleData"
        }
        var rtn = CallMethod(InputObj,'',"CallPythonService","N");
        if(rtn.result != 0){
            return;
        }  
        var rtn = rtn.output;
        //# 1.检查是否有需要撤销的医保预挂号
        // 如果做过医保预挂号，并且未进行过医保挂号，或者医保挂号失败
        //  "PreInsuReg" : "",
        // "InsuReg" : "",
        // "PreInsuOPdivide" : "",
        // "InsuOPdivide" : "",
        // "HISOPDivide" : ""
            //
        var HisFlag = rtn.HisFlag;
        if(HisFlag == "Y" ){
            parent.location.reload();
            location.href=location.href; 
            return;
        }
        //
        var PreInsuReg = rtn.PreInsuReg;
        if(PreInsuReg == "Y" ){
            if(typeof childIframe != "undefined"){
                childIframe.window.PayServ_INSUCancelPreReg(); 
            }else{
                PayServ_INSUCancelPreReg();
            }
            
        }
        //# 2.检查是否有需要撤销的医保挂号 
        // 如果做过医保挂号，但未进行过HIS挂号或者HIS挂号失败
        var InsuReg = rtn.InsuReg;
        if(InsuReg == "Y" ){
            if(typeof childIframe != "undefined"){
                childIframe.window.PayServ_INSURegReturn();
            }else{
                PayServ_INSURegReturn();
            }  
        }
        //# 3.检查是否有需要撤销的医保预结算
        // 进行过医保预结算但未调用医保结算或者调用医保结算失败
        var PreInsuOPdivide = rtn.PreInsuOPdivide;
        if(PreInsuOPdivide == "Y" ){
            if(typeof childIframe != "undefined"){
                childIframe.window.PayServ_InsuOPDivideRollBack();
            }else{
                PayServ_InsuOPDivideRollBack();
            } 
            
        }
        //# 4.检查是否有需要撤销的医保结算
        // 进行过医保结算，HIS确认完成失败，或者未进行确认完成
        var InsuOPdivide = rtn.InsuOPdivide;
        if(InsuOPdivide == "Y" ){
            if(typeof childIframe != "undefined"){
                childIframe.window.PayServ_InsuOPDivideStrike();
            }else{
                PayServ_InsuOPDivideStrike();
            } 
            
        }
        //# 5.检查是否有需要撤销的HIS预结算记录
        // HIS确认完成失败或者 未进行确认完成
        var HISOPDivide = rtn.HISOPDivide;
        if(HISOPDivide == "Y"){
            if(typeof childIframe != "undefined"){
                childIframe.window.PayServ_CancelPreDivide();
            }else{
                PayServ_CancelPreDivide();
            } 
        }
        //-------------------------------------------------------
        //# 6.检查是否有是否需要 撤销 的第三方交易
        var ExtCancel = rtn.ExtCancel;
        if(ExtCancel == "Y"){
            if(typeof childIframe != "undefined"){
                childIframe.window.PayServ_CancelExtPayService();
            }else{
                PayServ_CancelExtPayService();
            } 
        }
        //# 7.检查是否有是否需要 关闭 的第三方交易
        var ExtClose = rtn.CloseExtPay;
        if(ExtClose == "Y" ){
            if(typeof childIframe != "undefined"){
                childIframe.window.PayServ_CloseExtPayService();
            }else{
                PayServ_CloseExtPayService();
            } 
        }
        //# 8.检查是否有是否需要退费的第三方交易
        var ExtRefund = rtn.ExtRefund;
        if(ExtRefund == "Y" ){
            if(typeof childIframe != "undefined"){
                childIframe.window.PayServ_RefundExtPayService();
            }else{
                PayServ_RefundExtPayService();
            } 
        }
    } catch (error) {
        OSPAlert('','返回主页时异常撤销失败，确定以继续返回主页','抱歉',function(){
            parent.location.reload();
            location.href=location.href; 
        });
    }
}
// 异常处理
function checkException(){
    try {
        //用来取业务 判断 是否撤销异常
        // 只有在 费用展示界面进行返回  才撤销医保异常
        var OperCode = "";
        var showOperCode = ""
        if(typeof OSPPatGlobal !="undefined"){
            var CurrentBusiness = OSPPatGlobal['CurrentBusiness'];
            var Business = OSPPatGlobal['Business'];
            if(CurrentBusiness >= 1){
                Operation = Business[CurrentBusiness]; 
                OperCode = Operation.code;
            }
            //
            if((CurrentBusiness-1) >= 1){
                Operation = Business[CurrentBusiness-1]; 
                showOperCode = Operation.code;
            }
        }else{
            var CurrentBusiness = OSPGetParentVal('CurrentBusiness');
            var Business = OSPGetParentVal('Business');
            if(CurrentBusiness >= 1){
                Operation = Business[CurrentBusiness]; 
                OperCode = Operation.code;
            }
            //
            if((CurrentBusiness-1) >= 1){
                Operation = Business[CurrentBusiness-1]; 
                showOperCode = Operation.code;
            }
        }
    
        var InputObj = {
            "TradeCode" : "CheckSingleData"
        }
        var rtn = CallMethod(InputObj,'',"CallPythonService","N");
        if(rtn.result != 0){
            return;
        }  
        var rtn = rtn.output;
        //# 1.检查是否有需要撤销的医保预挂号
        // 如果做过医保预挂号，并且未进行过医保挂号，或者医保挂号失败
        //  "PreInsuReg" : "",
        // "InsuReg" : "",
        // "PreInsuOPdivide" : "",
        // "InsuOPdivide" : "",
        // "HISOPDivide" : ""
        var HisFlag = rtn.HisFlag;
        if(HisFlag == "Y" ){
            parent.location.reload();
            location.href=location.href; 
            return;
        }
        //
        var PreInsuReg = rtn.PreInsuReg;
        if(PreInsuReg == "Y" && (OperCode == "showreg" || showOperCode == "showreg")){
            if(typeof childIframe != "undefined"){
                childIframe.window.PayServ_INSUCancelPreReg(); 
            }else{
                PayServ_INSUCancelPreReg();
            }
        }
        //# 2.检查是否有需要撤销的医保挂号 
        // 如果做过医保挂号，但未进行过HIS挂号或者HIS挂号失败
        var InsuReg = rtn.InsuReg;
        if(InsuReg == "Y" && (OperCode == "pay")){
            if(typeof childIframe != "undefined"){
                childIframe.window.PayServ_INSURegReturn();
            }else{
                PayServ_INSURegReturn();
            }  
        }
        //# 3.检查是否有需要撤销的医保预结算
        // 进行过医保预结算但未调用医保结算或者调用医保结算失败
        var PreInsuOPdivide = rtn.PreInsuOPdivide;
        if(PreInsuOPdivide == "Y" && (OperCode == "chargeshow" || showOperCode == "chargeshow" )){
			
            if(typeof childIframe != "undefined"){
                childIframe.window.PayServ_InsuOPDivideRollBack();
            }else{
                PayServ_InsuOPDivideRollBack();
            } 
            
        }
        //# 4.检查是否有需要撤销的医保结算
        // 进行过医保结算，HIS确认完成失败，或者未进行确认完成
        var InsuOPdivide = rtn.InsuOPdivide;
        if(InsuOPdivide == "Y" && (OperCode == "pay")){
            if(typeof childIframe != "undefined"){
                childIframe.window.PayServ_InsuOPDivideStrike();
            }else{
                PayServ_InsuOPDivideStrike();
            }
        }
        //# 5.检查是否有需要撤销的HIS预结算记录
        // HIS确认完成失败或者 未进行确认完成
        var HISOPDivide = rtn.HISOPDivide;
        if(HISOPDivide == "Y" && (OperCode == "chargeshow" || showOperCode == "chargeshow")){
            if(typeof childIframe != "undefined"){
                childIframe.window.PayServ_CancelPreDivide();
            }else{
                PayServ_CancelPreDivide();
            } 
        }
        //-------------------------------------------------------

        //# 6.检查是否有是否需要 撤销 的第三方交易
        var ExtCancel = rtn.ExtCancel;
        if(ExtCancel == "Y" && (OperCode == "pay")){
            if(typeof childIframe != "undefined"){
                childIframe.window.PayServ_CancelExtPayService();
            }else{
                PayServ_CancelExtPayService();
            } 
        }
        //# 7.检查是否有是否需要 关闭 的第三方交易
        var ExtClose = rtn.CloseExtPay;
        if(ExtClose == "Y" && (OperCode == "pay")){
            if(typeof childIframe != "undefined"){
                childIframe.window.PayServ_CloseExtPayService();
            }else{
                PayServ_CloseExtPayService();
            } 
        }
        //# 8.检查是否有是否需要退费的第三方交易
        var ExtRefund = rtn.ExtRefund;
        if(ExtRefund == "Y" && (OperCode == "pay")){
            if(typeof childIframe != "undefined"){
                childIframe.window.PayServ_RefundExtPayService();
            }else{
                PayServ_RefundExtPayService();
            } 
        }

    } catch (error) {
        /*OSPAlert('','撤销异常失败，将直接返回到主页' + error.responseText,'抱歉|Y',function(){
            parent.location.reload();
            location.href=location.href; 
        });*/
    }
}
/*
	首页
*/
function homePageClick(){
    try {
        if(typeof childIframe != "undefined"){
            childIframe.window.RemoveLoading(); 
        }else{
            RemoveLoading();
        }
        checkExceptionHome();
        OSPPatGlobal = '';
        OSPSetParentVal('SYSLeftTime',OSPSYSCountDownLeftReset);
        parent.location.reload();
        location.href=location.href; 
        return; 
    } catch (e) {
        setTimeout(function(){
            parent.location.reload();
            location.href=location.href; 
        },3000)
        OSPAlert('','返回主页失败,3秒后将强制返回主页，','提示',function(){
            parent.location.reload();
            location.href=location.href; 
        })
    }finally{

	}

}
var DBFlag = "0"; //防止连击
function rebackClick(){
	try{
    if(DBFlag == "1"){
        return false;
    }
    DBFlag = "1";
    setTimeout(function(){
        DBFlag = 0;
    },2000)
	RebackFlag = "Y";
    var id = "";
    var tmpClass;
    if(window){
        var e = window.event;
        tmpClass = e;
        if(e){
            if(e.target){
                if (e.target.id){
                    id = e.target.id;			
                }
            }
        }
    }
    if(typeof $('#main-content') != "undefined"){
        if(typeof $('#main-content').contents() != "undefined"){
            var tmpAlertObj = $('#main-content').contents().find('.messager-body');
            if(tmpAlertObj.length > 0 && (id != "" || typeof tmpClass != "undefined")){
                //homePageClick();
                return false;
            }
        }
    }
    $('#mainBack',parent.document).css('display','none');
    setTimeout(function(){
        $('#mainBack',parent.document).css('display','block');
    },5000);
    // 程序里主动调用该函数导致 OSPPatGlobal 不存在，需要取父窗体的OSPPatGlobal
    if(typeof OSPPatGlobal == "undefined"){
        OSPPatGlobal = window.parent.OSPPatGlobal;
    }
    //AddLoading();
    //setTimeout(function(){
    rebackClickCallBack();
    $('#mainBack',parent.document).css('display','block');
    //    setTimeout(function(){
        //       RemoveLoading();
    //    },50);
    //},timeout);
    }catch(e){
        $('#mainBack',parent.document).css('display','block');
		RemoveLoading();
	}
}
/*
	返回
*/
function rebackClickCallBack(){
    try {
        // 返回时进行异常撤销
        checkException();
        setTimeout(function(){
            DBFlag = 0;
        },1500)
		RemoveLoading();
        // 返回时重置时间
        OSPSetParentVal('SYSLeftTime',OSPSYSCountDownLeftReset);
        // 程序里主动调用该函数导致 OSPPatGlobal 不存在，需要取父窗体的OSPPatGlobal
        if(typeof OSPPatGlobal == "undefined"){
            OSPPatGlobal = window.parent.OSPPatGlobal;
        }
        //      取当前业务
        var CurrentBusiness = OSPPatGlobal['CurrentBusiness'];
        //      当前业务-1 为要返回的业务
        CurrentBusiness--;
        //  保证为正数业务
        CurrentBusiness=CurrentBusiness<=0?0:CurrentBusiness;
        OSPPatGlobal['CurrentBusiness'] = CurrentBusiness;
        var BusinessType = OSPGetParentVal('BusinessType');
        var Business = OSPPatGlobal['Business'];
        //设置返回标志 供返回时 处理自动跳转到下一个业务(不是手动操作) 使用
        OSPSetParentVal('RebackFlag','Y');
        //
        //上一个界面为 读卡或者流调直接返回到主页
		var page;
		if(CurrentBusiness >= 1){
			var Operation = Business[CurrentBusiness]; 
            page = Operation.page;
		}
        if(CurrentBusiness >= 1){
            var Operation = Business[CurrentBusiness]; 
            var OperCode = Operation.code;
            if(OperCode == 'srvylist' || OperCode == 'readcard'){
                homePageClick(); // 正常可以不进行调用 调用也没影响
                return false;
            }
        }
        // 取号业务，如果当前页面是预约记录查询 则直接返回到主页
        if(BusinessType == "OBTNO"){
            // +1为当前页面
            if((CurrentBusiness+1) >= 1){
                var Operation = Business[CurrentBusiness+1]; 
                var OperCode = Operation.code;
                if(OperCode == 'getpredetails'){
                    homePageClick(); // 正常可以不进行调用 调用也没影响
                    return false;
                }
            }  
        }
        // 挂号类业务，如果当前页面是一级科室 则直接返回到主页
        if(BusinessType == "Reg"){
            // +1为当前页面
            if((CurrentBusiness+1) >= 1){
                var Operation = Business[CurrentBusiness+1]; 
                var OperCode = Operation.code;
                if(OperCode == 'level1dep'){
                    homePageClick(); // 正常可以不进行调用 调用也没影响
                    return false;
                }
            }  
        }
        // 加号 则直接返回到主页
        if(BusinessType == "DRINCRNO"){
            // +1为当前页面
            if((CurrentBusiness+1) >= 1){
                var Operation = Business[CurrentBusiness+1]; 
                var OperCode = Operation.code;
                if(OperCode == 'input'){
                    homePageClick(); // 正常可以不进行调用 调用也没影响
                    return false;
                }
            }  
        }
		// 加号 则跳过预约查询
        if(BusinessType == "DRINCRNO"){
            // +1为当前页面
            if((CurrentBusiness+1) >= 1){
                var Operation = Business[CurrentBusiness+1]; 
                var OperCode = Operation.code;
                if(OperCode == 'showreg'){
                    OSPPatGlobal['CurrentBusiness'] = 5;
                    top.frames['main-content'].src = '/WebAPP/pages/common/text.input.html?';
                    return false;
                }
            }  
        }
        // 返回时调用关闭读卡器放到最后
        
        if (typeof ReadCardAbort == 'function'){
            ReadCardAbort();
        }
        if (typeof childIframe != 'undefined'){
            if (typeof childIframe.ReadCardAbort == 'function'){
                childIframe.ReadCardAbort();
            } 
            
        }
        // 处理  需要返回主页还是返回上一页
        if(CurrentBusiness == 0){
            homePageClick();
        }else{
			//var CurrentLocation = OSPGetParentVal('CurrentLocation');
			//alert("CurrentLocation==-------------" + CurrentLocation)
			//CurrentLocation = decodeURI(CurrentLocation).replace(/undefined/g,'');
			//alert("decodeURI" + CurrentLocation);
			//top.frames['main-content'].src = CurrentLocation;
            window.history.go(-1);
			return false;
        }
    } catch (e) {
        //alert('返回失败:' + e.responseText + ',将返回到主页');
        //homePageClick();
        RemoveLoading();
        parent.location.reload();
		return;
        //location.href=location.href; 
    }
}
function adminClick(){
    location.href = "admin"; 
}
 /*
 	日期时间时钟
 */
function BuildDatetime() {
    //创建日期时间对象
    var datetime = new Date();
    //获取组件
    var year = datetime.getFullYear();
    var month = datetime.getMonth() + 1;
    var day = datetime.getDate();
    var hour = datetime.getHours();
    var minute = datetime.getMinutes();
    var second = datetime.getSeconds();
    var week = datetime.getDay();
    //转换星期格式
    switch (week) {
	case 0:
		var week = '星期日';
		break;
	case 1:
		var week = '星期一';
		break;
	case 2:
		var week = '星期二';
		break;
	case 3:
		var week = '星期三';
		break;
	case 4:
		var week = '星期四';
		break;
	case 5:
		var week = '星期五';
		break;
	case 6:
		var week = '星期六';
		break;
    }

    //小时,分钟,秒如果小于10加上前导零
    if (hour < 10) {
        var hour = 0 + "" + hour;
    }

    if (minute < 10) {
        var minute = 0 + "" + minute;
    }

    if (second < 10) {
        var second = 0 + "" + second;
    }

    //完整时间
    var now =  year + "年" + month + "月" + day + "日" + " " + week + " " + hour + ":" + minute + ":" + second;
    //更新内容
   $('#SysDate').text(now);;//这里是往p标签中添加
    if(OSPGetParentVal('CurrentBusiness')!="0"){
        //OSPSYSCountDownLeft = 120
        OSPSYSCountDown();  
        $(".main-lefttime").css('display','block')
    }else{
        $(".main-lefttime").css('display','none')
    }
}

/*
* 返回URL请求中的参数
* DingSH 2019-06-06
* input:
* output: 
*			theRequest 将URL的参数解析 成 theRequest['param1'],theRequest['param2'],
*/
function INSUGetRequest(param,url) {
    try {
        if(!url) url = decodeURI(location.search); //获取url中"?"符后的字串 
	    var theRequest = new Object();
	    if (url.indexOf("?") != -1) {
	        var str = url.substr(1);
	        strs = str.split("&");
	        for (var i = 0; i < strs.length; i++) {
	            theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
	        }
	    }
	    if(param){
		    return theRequest[param];
		}else{
	    	return theRequest;
		}
    } catch (error) {
        layer.alert('提示','.common.js中方法:INSUGetRequest()发生错误:' + error,'info');
    }
}
/*
* 返回URL请求中的参数
* input:
* output: 
*			theRequest 将URL的参数解析 成 theRequest['param1'],theRequest['param2'],
*/
function GetURLRequest(param,url) {
    try {
        if(!url) url = decodeURI(location.search); //获取url中"?"符后的字串 
	    var theRequest = new Object();
	    if (url.indexOf("?") != -1) {
	        var str = url.substr(1);
	        strs = str.split("&");
	        for (var i = 0; i < strs.length; i++) {
	            theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
	        }
	    }
	    if(param){
		    return theRequest[param];
		}else{
	    	return theRequest;
		}
    } catch (error) {
        layer.alert('提示','.common.js中方法:INSUGetRequest()发生错误:' + error,'info');
    }
    
}
function OSPSetParentVal(id,val){
	window.parent.OSPPatGlobal[id] = val;
}

function OSPGetParentVal(id,node){
	if(!node){
		return window.parent.OSPPatGlobal[id];
	}else{
		return window.parent.OSPPatGlobal[id][node];
	}
}
function OSPSYSCountDown() {
    var SYSLeftTime = OSPPatGlobal['SYSLeftTime'];
    SYSLeftTime--;
    OSPPatGlobal['SYSLeftTime'] = SYSLeftTime;
    $("#OSPSYSCountDown").html(SYSLeftTime);
    if (SYSLeftTime <= 0) {  
        $("#OSPSYSCountDown").html(OSPSYSCountDownLeftReset);  
        OSPSYSCountDownLeft = OSPSYSCountDownLeftReset;  
        homePageClick();
        return;  
    }  
} 
/**
 * 格式化金额
 * @method formatAmt
 * @param {String} val
 * @author tangzf
 * formatAmt(123.455)
 */
function formatAmt(val) {
    if(val=='0'){return "0.00"}
	if ((!val) || (isNaN(val))) {
		return val;
	}
	return parseFloat(val).toFixed(2);
}
/**
 * @method getDefStDate
 * @param {String} space
 * @author tangzf
 * getDefStDate(-1)
 */
function getDefStDate(space) {
	if (isNaN(space)) {
		space = -30;
	}
	var dateObj = new Date();
	dateObj.setDate(dateObj.getDate() + space);
	var myYear = dateObj.getFullYear();
	var myMonth = (dateObj.getMonth() + 1) < 10 ? "0" + (dateObj.getMonth() + 1) : (dateObj.getMonth() + 1);
	var myDay = (dateObj.getDate()) < 10 ? "0" + (dateObj.getDate()) : (dateObj.getDate());
	var dateStr = "";
	var sysDateFormat =3;
	if (sysDateFormat == 1) {
		dateStr = myMonth + '/' + myDay + '/' + myYear;
	} else if (sysDateFormat == 3) {
		dateStr = myYear + '-' + myMonth + '-' + myDay;
	} else {
		dateStr = myDay + '/' + myMonth + '/' + myYear;
	}
	return dateStr;
}
function GoNextBusiness(ParamInput,OpertType){
    try { 
        // 自动跳过的页面  并且目前操作是返回
        if(typeof OpertType !="undefined"){
            var RebackFlag = OSPGetParentVal('RebackFlag');
            if(OpertType == "Skip" && RebackFlag == "Y"){ // 标志直接跳过的界面
                rebackClick();
                return false;
            }
        }
        //返回标志
        OSPSetParentVal('RebackFlag',"");
        //
		if (typeof ParamInput == "undefined"){
			ParamInput = "";
		}
        var index = OSPGetParentVal('CurrentBusiness');
        index++;
        OSPSetParentVal('CurrentBusiness',index);
        var Business = OSPGetParentVal('Business');
        
        if(!Business[index]){
            homePageClick();
            return;
        }
        var CurrentData = Business[index].page + ParamInput;
    
        var InputObj = {}
        var checkFlag = checkRules(InputObj);
        if(checkFlag.result !="0" || !checkFlag){
            //OSPAlert('',checkFlag.msg,'提示')
            return false;
        }
		OSPSetParentVal('CurrentLocation',window.location.href);
        LoadPage(encodeURI(CurrentData),OpertType);  
    } catch (error) {
        
    }finally{
    }
}
function GoPrevBusiness(){
    var index = OSPGetParentVal('CurrentBusiness');
	var Business = OSPGetParentVal('Business');
    var CurrentData = Business[index].page;
	
	LoadPage(encodeURI(CurrentData));
}
function getToday(){
    //创建日期时间对象
    var datetime = new Date();
    //获取组件
    var year = datetime.getFullYear();
    var month = datetime.getMonth() + 1;
    var day = datetime.getDate();
    var hour = datetime.getHours();
    var minute = datetime.getMinutes();
    var second = datetime.getSeconds();
    var week = datetime.getDay();
    //转换星期格式
    switch (week) {
        case 0:
            var week = '星期日';
            break;
        case 1:
            var week = '星期一';
            break;
        case 2:
            var week = '星期二';
            break;
        case 3:
            var week = '星期三';
            break;
        case 4:
            var week = '星期四';
            break;
        case 5:
            var week = '星期五';
            break;
        case 6:
            var week = '星期六';
            break;
    }

    //小时,分钟,秒如果小于10加上前导零
    if (hour < 10) {
        var hour = 0 + "" + hour;
    }

    if (minute < 10) {
        var minute = 0 + "" + minute;
    }

    if (second < 10) {
        var second = 0 + "" + second;
    }

    //完整时间
    var now =  year + "年" + month + "月" + day + "日" + " " + week + " " + hour + ":" + minute + ":" + second;
    return now;
}
/**
 * 规则检查
 * @param {*} Options 
 */
function checkRules(InputObj,funOpt){
    // ZZJ23
    // OSPGetParentVal('client_dict', 'ss_eqlistd_role');
    var UserCode = OSPGetParentVal('client_dict', 'ss_eqlistd_eqcode');
    if(UserCode != "undefined"){
        if(UserCode == "BGJ19" || UserCode == "ZZJ48" || UserCode == "ZZJ49" || UserCode == "BGJ21"){
            var rtn = {
                "result":'0'
            }
            return rtn;
        }
        var BusinessType = OSPGetParentVal('BusinessType')
        if(BusinessType == "Reg" && (UserCode == 'ZZJ50' || UserCode == 'ZZJ43' || UserCode == 'BGJ21' || UserCode == 'ZZJ49'|| UserCode == 'ZZJ48')){
            var rtn = {
                "result":'0'
            }
            return rtn;
        }
    }
    InputObj['TradeCode'] = 'CheckRule';
    if (typeof InputObj['CheckCode'] == "undefined"){
        InputObj['CheckCode'] = '';
    }
    var rtn = CallMethod(InputObj,'',"CallPythonService","N"); 
    if(rtn.result !="0" || !rtn){
        OSPAlert('',rtn.msg,'抱歉',function(){
            if(funOpt){
                funOpt(rtn);
            }
        });
        //setTimeout(rebackClick(),3000);
        return rtn;
    }
    return rtn;
}
function cancelBubble(e) {
    if (e.stopPropagation) {
        e.stopPropagation();
    } else {
        e.cancelBubble = true;
    }
}

function AddLoading(title){

    if(!title){
        title = "处理中请稍后";
    }
    var htmlStr = '\
    <div class="main-loading" style="display: block">\
        <div class="main-loading-msg">\
            <div class="layui-row" style="margin-top:20px;">\
                <label style="font-size:40px;" >' + title + '</label>\
            </div>\
            <div class="layui-row">\
                <img  src="/WebAPP/themes/images/hourglass.gif" />\
            </div>\
        </div>\
    </div>';
    // $('body').prepend(htmlStr);
    var role = OSPGetParentVal('client_dict', 'ss_eqlistd_role');
    if (role == "role2"){
        $(".main-loading-msg", parent.document).css('top', '250px');
        $(".main-loading-msg", parent.document).css('left', '430px');
    }

	$(".main-loading", parent.document).css('display', 'block');
    $(".main-loading", parent.document).find('label').text(title);
    if(typeof childIframe != "undefined"){
        $(".main-loading").css('display', 'block');
        $(".main-loading").find('label').text(title);
    }
}

function RemoveLoading() {
    $(".main-loading", parent.document).css('display', 'none');
    if(typeof childIframe != "undefined"){
        $(".main-loading").css('display', 'none');
    }
}

/*
* @ ZhYW
* @ 元素事件触发后禁用，1s后自动启用
*/
$.fn.extend({
	toggleAble: function() {
		return this.each(function () {
			$(this).attr("disabled", true);
			var handler = setInterval(function() {
				clearInterval(handler);
				$(this).attr("disabled", false);
			}, 1000);
		});
	}
});

window.onbeforeunload = function(e){
    OSPSetParentVal('PayFlag','');
	if(RebackFlag == "Y"){
		RebackFlag = "";
        checkException();
        $('#mainBack',parent.document).css('display','block');
	}
}