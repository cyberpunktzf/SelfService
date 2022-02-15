/**
 * FileName: dhcbillinsu.offselfpro.charge.readcard.js
 * Anchor: tangzf
 * Date: 2020-3-23
 * Description: 移动收费-支付方式
 */
 var LockInfo = "";
 //1.预约
 function PayServ_OPPreReg(){
    try {
        var jsonObj = "";
        var OutPut = {
            "TradeCode" : "1000"
        }
        var rtn = CallMethod(OutPut,'',"CallPythonService","N");
        if(rtn.result != 0){	
            OSPAlert('','-100861000网络波动，自助机业务发生错误，请返回主页并重试一次，谢谢','提示',function(){ 
                homePageClick();
                return;
            });
            return;
        }else{
            jsonObj = OSPWebServicesXMLStr2Json(rtn.output);
        }   
        OSPOPPreReg_Result(jsonObj);
    } catch (e) {
        OSPAlert('','预约异常：' + e.responseText,'提示',function(){
            homePageClick();
        });
    }
 }
 //1.预约回调
 function OSPOPPreReg_Result(jsonObj){
    try {
        if(jsonObj.Response.ResultCode != 0){
            OSPAlert('',jsonObj.Response.ResultContent,'提示',function(){
               homePageClick();
            })
       }else{
           OSPAlert('','预约成功,请拿走您的预约凭条','提示',function(){ 
               homePageClick();
           });
           var PrintArr = jsonObj.Response.OrderCode.split('^');
           //var OrderCodeStr = jsonObj.Response.OrderCodeStr;
           //if(OrderCodeStr){
            //   PrintArr = OrderCodeStr.split('^');
            //}
           for (var tmpOrdrIndex = 0;tmpOrdrIndex<PrintArr.length;tmpOrdrIndex++){
               var val = PrintArr[tmpOrdrIndex];
               OSPPrintByLodop('Order', val);
           }
            setTimeout(function(){
                homePageClick();
            },10000);
       } 
    } catch (error) {
        OSPAlert('','预约回调异常：' + error,'提示|Y',function(){
            homePageClick();
        });
    }
 }
 // 2.锁号
 function PayServ_LockReg(){
    try {
        var input = {
            TradeCode : '10015'
        }
        var rtn = CallMethod(input,'',"CallPythonService","N");
        if(rtn.result != 0){
            RemoveLoading();
            OSPAlert('','-10086因网络波动，自助机业务发生错误，请返回主页并重试一次，谢谢','提示',function(){ 
                homePageClick();
                return false;
            });
            return false;
        }else{
            rtn = OSPWebServicesXMLStr2Json(rtn.output);
        }   
        LockReg_Result(rtn)
        return rtn;
    } catch (error) {
        OSPAlert('','自助机锁号失败：' + error,'提示|Y',function(){
            homePageClick();
        });
    }

 }
 // 2.1.1锁号回调
 function LockReg_Result(jsonObj){
     try {
        if(jsonObj.Response.ResultCode != 0){
            OSPAlert('',jsonObj.Response.ResultContent,'提示',function(){
               CancelFlag = "N";
               homePageClick();
               return;
            });
        }else{
            CancelFlag = "N";
            //OSPAlert('','锁号成功','提示');
        }
     } catch (error) {
        OSPAlert('','自助机锁号回调失败：' + error,'提示|Y',function(){
            homePageClick();
        });
     }
 }

 // 2.3第三方支付--------------------------------------------------------------------------------------------
 // -1 未知错误
 // 0 不需要第三方支付
 // 1 需要调用支付查询接口
 function PayServ_ExtPayService(){
     try {
        var CreatePayFlag = OSPGetParentVal('CreatePayFlag');
        if(CreatePayFlag == "Y"){
            return false;
        }
        OSPSetParentVal('CreatePayFlag',"Y");
        var InputObj = {
            'TradeCode' : 'ExtPay'
        }
        var rtn = CallMethod(InputObj,'',"CallPythonService","N");
        // 保存业务操作返回值
        InputObj['TradeCode'] = 'SaveBD';
        InputObj['modal_code'] = 'ExtPayBack';
        InputObj['intef_output'] = rtn;
        var rtn1 = CallMethod(InputObj,'',"CallPythonService","N");
        
        if(rtn.result == "1"){
            BuildQRCode(rtn.output);
            return 1;
        }else if(rtn.result == "0"){
            return 0
        }else{
            if(rtn.msg.indexOf('重复的商户订单') > -1){

            }else{
                OSPAlert('','创建订单失败:' + rtn.msg,'微信支付失败|Y');
            }
            return -1;
        }
     } catch (error) {
        OSPAlert('','自助机创建订单：' + error,'提示|Y',function(){
            homePageClick();
        });
     }

 }
 // 2.4 第三方支付 查询
 // 1 支付失败 需要继续循环
 // 0 支付成功
 function PayServ_QueryExtPayService(){
    try {
        var InputObj = {
            'TradeCode' : 'QueryExtPay'
        }
        var rtn = CallMethod(InputObj,'',"CallPythonService","N");
        // 保存返回值
        InputObj['TradeCode'] = 'SaveBD';
        InputObj['modal_code'] = 'QueryExtPayBack';
        InputObj['intef_output'] = rtn;
        var rtn1 = CallMethod(InputObj,'',"CallPythonService","N");    
        return rtn.result; 
    } catch (error) {
        OSPAlert('','自助机第三方支付查询失败' + error,'提示|Y',function(){
            homePageClick();
        });
    }

 }
 // 2.4 第三方支付 撤销
 // 1 支付失败 需要继续循环
 // 0 支付成功
 function PayServ_CancelExtPayService(){
    var InputObj = {
        'TradeCode' : 'CancelExtPay'
    }
    var rtn = CallMethod(InputObj,'',"CallPythonService","N");
    // 保存返回值
    InputObj['TradeCode'] = 'SaveBD';
    InputObj['modal_code'] = 'CancelExtPayBack';
    InputObj['intef_output'] = rtn;
    var rtn1 = CallMethod(InputObj,'',"CallPythonService","N");    
    return rtn.result;
 }
  // 2.4 第三方支付 关闭
 // 1 支付失败 需要继续循环
 // 0 支付成功
 function PayServ_CloseExtPayService(){
    var InputObj = {
        'TradeCode' : 'CloseExtPay'
    }
    var rtn = CallMethod(InputObj,'',"CallPythonService","N");
    // 保存返回值
    InputObj['TradeCode'] = 'SaveBD';
    InputObj['modal_code'] = 'CloseExtPayBack';
    InputObj['intef_output'] = rtn;
    var rtn1 = CallMethod(InputObj,'',"CallPythonService","N");    
    return rtn.result;
 }
   // 2.4 第三方支付 退费
 // 1 HIS二次确认成功，需要继续完成以后流程
 // 0 微信支付宝进行退费
 function PayServ_RefundExtPayService(){
    try {
        var ckResult = PayServ_CheckHISResult();
        if (ckResult.result !='0'){
            return ckResult.result; // 校验不成功不退费
        }
        var jsonObj = OSPWebServicesXMLStr2Json(ckResult.output);
        // HIS不是异常，并且HIS二次校验 未成功的进行退费
        if(jsonObj.Response.ResultCode != "0" && jsonObj.Response.ResultCode != "-99"){
            var InputObj = {
                'TradeCode' : 'RefundExtPay'
            }
            var rtn = CallMethod(InputObj,'',"CallPythonService","N");
            // 保存返回值
            InputObj['TradeCode'] = 'SaveBD';
            InputObj['modal_code'] = 'RefundExtPayBack';
            InputObj['intef_output'] = rtn;
            var rtn1 = CallMethod(InputObj,'',"CallPythonService","N");    
            return rtn.result;
        }
        return 
    } catch (error) {
        return "-10086"
    }
 }
 // 3.HIS 挂号
 function PayServ_OPReg(){
     try {
        $('#BillCharge').attr('disable',true);

        var input = {
            'TradeCode' : '1101'
        }
        var rtn = CallMethod(input,'',"CallPythonService","N");
        if(rtn.result != 0){
            OSPAlert('','自助机挂号发生错误：' + rtn.msg +'，请重试一次','提示|Y',function(){ 
                rebackClick();
                return false;
            });
            return false;;
        }else{
            rtn = OSPWebServicesXMLStr2Json(rtn.output);
        }  
        var jsonObj = rtn;
        OSPOPBillChargeResult(jsonObj);
     } catch (error) {
        OSPAlert('','自助机挂号异常' + error,'提示|Y',function(){
            homePageClick();
        });
     }
 }
  /*
     3.1.1挂号/取号成功回掉
 */
function OSPOPBillChargeResult(jsonObj){
    try {
        var BusinessType = OSPGetParentVal("BusinessType");
        var msg = BusinessType == "OBTNO" ? "取号成功":"挂号成功";
        if(jsonObj.result == "0" || jsonObj.Response.ResultCode == '0' ){
            CancelFlag = "Y"; // 取消锁号标志 非Y 时 离开界面取消锁号
            var msg = "挂号成功，请拿走挂号凭证"
            var processcode = OSPGetParentVal("processcode");
            var checkProcesscode = processcode.split('-')[0];
            if(checkProcesscode == "NAReg"){
                msg = "挂号成功，请拿走挂号凭证，请确认继续缴纳核酸费用";
                PayServ_Speed(msg);
            }
            
            OSPAlert('',msg,'提示',function(){
                if(processcode == "NAReg"){
                    PayServ_RepeatInit("Charge",processcode);
                }
                GoNextBusiness(""); 
                return false;
            });
            OSPPrintByLodop(BusinessType,jsonObj.Response.RegistrationID);
            //AddLoading('正在打印单据，请稍后');    
            //RemoveLoading();           
            setTimeout(function(){
                PayServInvocieBill();
            },60);
            if(checkProcesscode != "NAReg"){
                setTimeout(function(){
                    homePageClick();
                },5000);
            }
            if(checkProcesscode == "NAReg"){
                setTimeout(function(){
                    PayServ_RepeatInit("Charge",processcode);
                    GoNextBusiness();
                },3000);
            }
        }else{ 
             OSPAlert('','挂号失败:' + jsonObj.Response.ResultContent,'提示|Y',function(){
                homePageClick();
             });
        }    
    } catch (error) {
        OSPAlert('','自助机挂号/取号回调异常' + error,'提示|Y',function(){
            homePageClick();
        });
    }
}

 // 4.1 HIS预结算
function PayServ_PreHisDivide(InputObj){
    try {
        if(!InputObj){
            InputObj = {}
        }
        InputObj["TradeCode"]= "4905";
        var rtn = CallMethod(InputObj,'',"CallPythonService","N");
        if(rtn.result != 0){
            OSPAlert('','自助机预结算发生错误：' + rtn.msg +'，请重试一次','提示|Y',function(){ 
                rebackClick();
                return false;
            });
        }else{
            rtn = OSPWebServicesXMLStr2Json(rtn.output);
        }   
        PreChargeHISCallBack(rtn)
        return rtn;	
    } catch (error) {
        OSPAlert('','HIS预结算异常' + error,'提示|Y',function(){
            homePageClick();
        });
    }
}
// 4.2预结算回调
function PreChargeHISCallBack(jsonObj){
    try {
        var rtn = jsonObj.Response.ResultCode ;
        if(rtn != '0'){
            OSPAlert('','抱歉，'+'HIS预结算失败:' + jsonObj.Response.ResultMsg,'提示|Y',function(){
                homePageClick();
                return;
            });
            return;
        } 
    } catch (error) {
        OSPAlert('','HIS预结算回调异常' + error,'提示|Y',function(){
            homePageClick();
        });
    }

}
// 5.1HIS确认完成
function PayServ_CompleteCharge(InputObj){
    try {
        if(!InputObj){
            InputObj = {}
        }
        InputObj["TradeCode"]= "4906";
        var rtn = CallMethod(InputObj,'',"CallPythonService","N");
        if(rtn.result != 0){
            OSPAlert('','自助机HIS确认完成发生错误：' + rtn.msg +'，请重试一次','提示|Y',function(){ 
                homePageClick();
                return false;
            });
            return false;
        }else{
            rtn = OSPWebServicesXMLStr2Json(rtn.output);
        }   
        CompleteCharge_Result(rtn)

    } catch (error) {
        OSPAlert('','HIS确认完成异常' + error,'提示|Y',function(){
            homePageClick();
        });
    }

}
 // 5.1.2确认完成回调
function CompleteCharge_Result(jsonObj){
    try {
        if(jsonObj.Response.ResultCode != 0){
            OSPAlert('',jsonObj.Response.ResultMsg,'提示',function(){
                homePageClick();
            });
        }else{
            AfterChargeService(jsonObj);
        } 
    } catch (error) {
        OSPAlert('','HIS确认完成回调异常' + error,'提示|Y',function(){
            homePageClick();
        }); 
    }
}
//缴费后服务
function　AfterChargeService (jsonObj){
    var InvoiceNoStr = jsonObj.Response.InvId;
    var TotalDivide = OSPGetParentVal('TotalDivide');
    TotalDivide--;
    var msgInfo = '请取走您的相关证件或卡片,请您取走打印凭证';
    if(+TotalDivide > 0){
        msgInfo = '取走您的相关证件或卡片,请您取走打印凭证,请继续缴纳下一个订单费用';
    }
    OSPAlert('',msgInfo,'缴费成功',function(){           
        if (+TotalDivide > 0){
            var processcode = OSPGetParentVal('processcode');
            if(processcode == "Charge"){
                PayServ_RepeatInit("Charge",processcode);
                OSPSetParentVal('CurrentBusiness','2');
                top.frames['main-content'].src = '/WebAPP/pages/charge/orderlist.html?';
                return false;
            }
        }else{
            homePageClick();
        }
    });
    OSPPrintByLodop('Charge', InvoiceNoStr);
    
    setTimeout(function(){
        PayServInvocieBill();
    },60);
    //
    setTimeout(function(){
        if(+TotalDivide > 0){
            PayServ_RepeatInit("Charge",processcode);
            OSPSetParentVal('CurrentBusiness','2');
            top.frames['main-content'].src = '/WebAPP/pages/charge/orderlist.html?';
            return false;
        }else{
            homePageClick();  
        }
    },6000);
}
 // 微信支付回调
 function WeChatResult(jsonObj){
     $("#qrcode").empty();
     /*if(!jsonObj || jsonObj.result!="0"){
         alert("获取支付码失败：",jsonObj.msg.errorText);
         return;
     }*/
     var qrcode = new QRCode('qrcode', { 
         text: 'asdasdasdasdasd', 
         width: 176, 
         height: 176, 
         colorDark : '#000000', 
         colorLight : '#ffffff', 
         correctLevel : QRCode.CorrectLevel.H 
       }); 
       OSPOPBillCharge();  
     //$('.ScanCode').find('label').text('扫描二维码进行支付，5分钟内有效');
     //$('.ScanCode').find('img').attr('src','../themes/images/weChatPay.png');
 }
 // 取消锁号
 function PayServ_UnlockReg(){
    try {
        var input = {
            'TradeCode' : '10016'
        }
        var rtn = CallMethod(input,'',"CallPythonService","N");
        if(rtn.result != 0){
        }else{
            rtn = OSPWebServicesXMLStr2Json(rtn.output);
        }  
        return rtn 
    } catch (error) {
        OSPAlert('','HIS取消锁号异常' + error,'提示|Y',function(){
            homePageClick();
        }); 
    }
}
 //取消HIS预结算
function PayServ_CancelPreDivide(InputObj){
    try {
        if(!InputObj){
            InputObj = {}
        }
        InputObj["TradeCode"]= "4910";
        var rtn = CallMethod(InputObj,'',"CallPythonService","N");
        if(rtn.result != 0){
        }else{
            rtn = OSPWebServicesXMLStr2Json(rtn.output);
        }   
        return rtn;
    } catch (error) {
        OSPAlert('','取消HIS预结算异常' + error,'提示|Y',function(){
            homePageClick();
        }); 
    }

}
 // 查询就诊记录
 function PayServ_QueryAdmList(InputObj){
    try {
        if(!InputObj){
            InputObj = {}
        }
        InputObj["TradeCode"]= "4902";
        var rtn = CallMethod(InputObj,'',"CallPythonService","N");
        if(rtn.result != 0){
        }else{
            rtn = OSPWebServicesXMLStr2Json(rtn.output);
        }   
        return rtn;  
    } catch (error) {
        OSPAlert('','查询就诊记录异常' + error,'提示|Y',function(){
            homePageClick();
        }); 
    }
}
// 初始化 Init
function PayServ_Init(){
    try {
        var Operation = OSPGetParentVal('BusinessType');
        var processcode = OSPGetParentVal('processcode');
        var OutPut = {
            'UserID':'19401',
            'UserCode': '',
            'HospId': '2',
            'GroupId': '238',
            'Terminal': '',
            "TradeCode" : "Init",
            'Business' : Operation,
            'processcode':processcode
        }
        var rtn = CallMethod(OutPut,'',"CallPythonService","N");
        if(rtn.result == 0){
            jsonObj = rtn.output;
            OSPSetParentVal('serial_id', jsonObj.serial_id); 
            OSPSetParentVal('serial_number', jsonObj.serial_number); 	
            OSPSetParentVal('BusinessType', Operation);
        }else{
            OSPAlert('',rtn.msg,'提示');
            return rtn;
        }
        return rtn;
    } catch (error) {
        OSPAlert('','自助机初始化异常' + error,'提示');
    }
}
// 二次初始化初始化 Init
//# 根据第一次业务信息，生成业务主表
//# 用于患者需要多次业务时，不返回主页，重新读卡
//# 场景： 1.核酸 挂号-缴费，2.结算多笔费用时
//# 功能：插 bm 主表，插患者信息表patinfo
function PayServ_RepeatInit(Operation,processcode){
    try {
        var OutPut = {
            "TradeCode" : "RepeatInit",
            'Business' : Operation, // 业务代码
            'processcode':processcode   //流程代码
        }
        var rtn = CallMethod(OutPut,'',"CallPythonService","N");
        jsonObj = rtn.output;
        ClearGlobal("Y");
        //设置主表信息
        OSPSetParentVal('serial_id', jsonObj.serial_id); 
        OSPSetParentVal('serial_number', jsonObj.serial_number);
        return rtn;
    } catch (error) {
        homePageClick();
        OSPAlert('','自助机二次初始化异常' + error,'提示|Y');
    }
}
function GetDeviceInfo(){
    try {
        // 生成客户端配置信息
        var InputObj = {
            "TradeCode" : "GetDeviceInfo"
        }
        var rtn = CallMethod(InputObj,'',"CallPythonService","N");
        OSPSetParentVal('client_dict',rtn.output);
        return rtn;
    } catch (error) {
        OSPAlert('','生成客户端配置信息异常' + error,'提示');
    }
}
// 获取HIS患者信息
function PayServ_GetHisPatInfo(){
    var jsonObj = "";
    var OutPut ={
        "TradeCode" : "3300"
    }
    var rtn = CallMethod(OutPut,'',"CallPythonService","N");
    if(rtn.result != 0){	
        
    }else{
        jsonObj = OSPWebServicesXMLStr2Json(rtn.output);
    }   
    return jsonObj;
}
// 患者建档
function PayServ_CreatePat(InputObj){
    if(!InputObj){
        InputObj = {}
    }
    InputObj["TradeCode"]= "3014";
	var rtn = CallMethod(InputObj,'',"CallPythonService","N");
    if(rtn.result != 0){
    }else{
        rtn = OSPWebServicesXMLStr2Json(rtn.output);
    }   
    return rtn;
}
// 获取HIS一级科室
function PayServ_GetLevel1Dep(){
	var OutPut ={
		"TradeCode" : "1011"
	}
	var rtn = CallMethod(OutPut,'',"CallPythonService","N");
    if(rtn.result != 0){
    }else{
        rtn = OSPWebServicesXMLStr2Json(rtn.output);
    }   
    return rtn;
}
// 获取HIS二级科室
function PayServ_GetLevel2Dep(){
	var OutPut ={
        "TradeCode" : "1012"
	}
	var rtn = CallMethod(OutPut,'',"CallPythonService","N");
    if(rtn.result != 0){
    }else{
        rtn = OSPWebServicesXMLStr2Json(rtn.output);
    }   
    return rtn;
}
// 获取HIS医生信息
function PayServ_GetDocInfo(InputObj){
	var OutPut ={
        "TradeCode" : "1013"
	}
	var rtn = CallMethod(OutPut,'',"CallPythonService","N");
    if(rtn.result != 0){
    }else{
        rtn = OSPWebServicesXMLStr2Json(rtn.output);
    }   
    return rtn;
}
// 获取HIS排班信息
function PayServ_GetSchedule(InputObj){
    InputObj["TradeCode"]= "10041";
	var rtn = CallMethod(InputObj,'',"CallPythonService","N");
    if(rtn.result != 0){
    }else{
        rtn = OSPWebServicesXMLStr2Json(rtn.output);
    }   
    return rtn;
}
// 更新患者信息
function PayServ_UpdatePatInfo(InputObj){
    InputObj["TradeCode"]= "3016";
	var rtn = CallMethod(InputObj,'',"CallPythonService","N");
    if(rtn.result != 0){
    }else{
        rtn = OSPWebServicesXMLStr2Json(rtn.output);
    }   
    return rtn;
}
// 保存用户操作
function PayServ_SaveOption(url){
    //alert('传毒' + url)
    const p = new Promise((resolve,reject)=>{
        var str = "";//url.substr(1);
        if (url.indexOf("?") != -1) {
            str = url.split("?")[1];
            str = decodeURI(str);
        }
        //alert('参数' + str + 'url=' + url)
        if( str == "" || typeof str == "undefined"){
            resolve();
            return;
        }
        var InputObj = {
            "TradeCode" : "6666",
            "intef_input" : str
        }
        var tmpIndex = OSPGetParentVal('CurrentBusiness');
        tmpIndex--;
        OSPSetParentVal('CurrentBusiness',tmpIndex);
        var rtn = CallMethod(InputObj,'',"CallPythonService","N");
        var tmpIndex = OSPGetParentVal('CurrentBusiness');
        tmpIndex++;
        OSPSetParentVal('CurrentBusiness',tmpIndex);
        if(rtn.result != 0){
            OSPAlert('','保存用户操作失败:' + rtn.msg ,'提示');
        }else{
            OSPSetParentVal('bd_id',rtn.output['bd_id']);
        }
        resolve();
    })
    return p;
}
 /*
   获取号源
 */ 
function PeyServ_GetDocDate(){
    var InputObj = {
        'TradeCode' : "1004"
    }
	var rtn = CallMethod(InputObj,'',"CallPythonService","N");
    if(rtn.result != 0){
    }else{
        rtn = OSPWebServicesXMLStr2Json(rtn.output);
    }   
    return rtn;
}
 /*
   取消预约
 */ 
function PeyServ_CancelOrdr(InputObj,funOpt){
    InputObj['TradeCode'] = '1108'
    var Ajax = "N";
    if(funOpt){
        Ajax = "Y";
    }
	var rtn = CallMethod(InputObj,funOpt,"CallPythonService",Ajax);
    if(rtn.result != 0){
    }else{
        rtn = OSPWebServicesXMLStr2Json(rtn.output);
    }   
    return rtn;
}
 /*
   查询预约信息
 */ 
function PeyServ_QueryOrdr(InputObj){
    InputObj['TradeCode'] = '1005'
	var rtn = CallMethod(InputObj,'',"CallPythonService","N");
    if(rtn.result != 0){
    }else{
        rtn = OSPWebServicesXMLStr2Json(rtn.output);
    }   
    return rtn;
}
 /*
   HIS缴费订单查询
 */ 
function PeyServ_ChargeOrder(InputObj){
    if(!InputObj){
        InputObj = {}
    }
    InputObj['TradeCode'] = '4904'
	var rtn = CallMethod(InputObj,'',"CallPythonService","N");
    if(rtn.result != 0){
    }else{
        rtn = OSPWebServicesXMLStr2Json(rtn.output);
    }   
    return rtn;
}
 /*
   物价查询
 */ 
function PeyServ_QueryItmPrice(InputObj){
    if(!InputObj){
        InputObj = {}
    }
    InputObj['TradeCode'] = '90013'
	var rtn = CallMethod(InputObj,'',"CallPythonService","N");
    if(rtn.result != 0){
    }else{
        rtn = OSPWebServicesXMLStr2Json(rtn.output);
    }   
    return rtn;
}
 /*
   HIS缴费信息查询
 */ 
function PeyServ_QueryChargeDet(InputObj){
    if(!InputObj){
        InputObj = {}
    }
    InputObj['TradeCode'] = '4908'
	var rtn = CallMethod(InputObj,'',"CallPythonService","N");
    if(rtn.result != 0){
    }else{
        rtn = OSPWebServicesXMLStr2Json(rtn.output);
    }   
    return rtn;
}
 /*
   获取流调表信息
 */ 
function PeyServ_QuerySurvList(InputObj){
    if(!InputObj){
        InputObj = {}
    }
    InputObj['TradeCode'] = 'GetSurvlist'
	var rtn = CallMethod(InputObj,'',"CallPythonService","N");
    if(rtn.result != 0){
    }  
    return rtn;
}
 /*
   保存流调表信息
 */ 
function PeyServ_SaveSurvList(InputObj){
    InputObj['TradeCode'] = 'SaveSurvList'
	var rtn = CallMethod(InputObj,'',"CallPythonService","N");
    if(rtn.result != 0){
    }  
    return rtn;
}
///// ---------------------医保
// 调用医保预挂号接口 
function PayServ_INSUPreReg(InputObj){
    try {
        var InsuType = OSPGetParentVal('InsuType');
        if(InsuType == '1' || InsuType == ''){
            return "0^";
        }
    
        if(!InputObj){
            InputObj = {}
        }
        InputObj['TradeCode'] = 'PayServ_INSUPreReg'
        var rtn = CallMethod(InputObj,'',"CallPythonService","N");
        if(rtn.result != 0){
            OSPAlert('',rtn.msg,'提示');
            return;
        }  
        var jsonStr = rtn.output;
        var jsonObj = JSON.parse(jsonStr)
        var dhandle = jsonObj.dhandle;
        var PaadmRowid = jsonObj.PaadmRowid;
        var UserID = jsonObj.UserID;
        var AdmReasonId = jsonObj.AdmReasonId;
        var ExpStr = jsonObj.ExpStr;
        var rtn1 = InsuOPRegPre(dhandle, PaadmRowid, UserID, AdmReasonId, ExpStr);
        //
        InputObj['TradeCode'] = 'SaveBD'
        InputObj['modal_code'] = 'INSUPreRegBack'
        InputObj['intef_input'] = dhandle + ',' + PaadmRowid + ',' +  UserID + ',' + AdmReasonId + ',' + ExpStr;
        InputObj['intef_output'] = rtn1
        var rtn = CallMethod(InputObj,'',"CallPythonService","N");
        if(rtn1 == ""){
            OSPAlert('','调用医保预挂号接口异常：请返回主页并且重试','提示|Y',function(){
                homePageClick();
            });
            return "-1^调用医保预挂号接口异常：请返回主页并且重试2";
        }
        return rtn1;
    } catch (error) {
        OSPAlert('','-10086PRE网络异常，请返回主页并重试','抱歉|Y',function(){
            homePageClick();
        });
    }

}
/// 挂号接口
function PayServ_INSUReg(InputObj){
    try {
        // InsuOPRegCommit
        // dhandle, AdmInfoDr, UserID, AdmReasonId, ExpStr
        var InsuType = OSPGetParentVal('InsuType');
        if(InsuType == '1' || InsuType == ''){
            return true;
        }

        if(!InputObj){
            InputObj = {}
        }
        InputObj['TradeCode'] = 'PayServ_INSUReg'
        var rtn = CallMethod(InputObj,'',"CallPythonService","N");
        if(rtn.result != 0){
            return false;
        }  
        var jsonStr = rtn.output;
        var jsonObj = JSON.parse(jsonStr)
        //Param
        var dhandle = jsonObj.dhandle;
        var AdmInfoDr = jsonObj.AdmInfoDr;
        var UserID = jsonObj.UserID;
        var AdmReasonId = jsonObj.AdmReasonId;
        var ExpStr = jsonObj.ExpStr;
        var rtn1 = InsuOPRegCommit(dhandle, AdmInfoDr, UserID, AdmReasonId, ExpStr);

        InputObj['TradeCode'] = 'SaveBD';
        InputObj['modal_code'] = 'INSURegBack';
        InputObj['intef_input'] = dhandle + ',' + AdmInfoDr + ',' +  UserID + ',' + AdmReasonId + ',' + ExpStr;
        InputObj['intef_output'] = rtn1;
        var rtn = CallMethod(InputObj,'',"CallPythonService","N");
        if(rtn1.split('^')[0] < 0 ){
            OSPAlert('',rtn1,'提示|Y',function(){
                homePageClick();
                return false;
            });
            return false;
        }
        if(rtn.result != 0){
            return false;
        }   
        return true;  
    } catch (error) {
        OSPAlert('','-100861101R网络异常，请返回主页并重试','提示|Y',function(){
            homePageClick();
        });
    }
}
/// 撤销预挂号
function PayServ_INSUCancelPreReg(InputObj){
    try {
        // InsuOPRegCommit
        var InsuType = OSPGetParentVal('InsuType');
        if(InsuType == '1' || InsuType == ''){
            return "";
        }

        if(!InputObj){
            InputObj = {}
        }
        InputObj['TradeCode'] = 'PayServ_INSUCancelPreReg'
        var rtn = CallMethod(InputObj,'',"CallPythonService","N");
        if(rtn.result != 0){
            return;
        }  
        var jsonStr = rtn.output;
        var jsonObj = JSON.parse(jsonStr)
        //Param
        var dhandle = jsonObj.dhandle;
        var AdmInfoDr = jsonObj.AdmInfoDr;
        var UserID = jsonObj.UserID;
        var AdmReasonId = jsonObj.AdmReasonId;
        var ExpStr = jsonObj.ExpStr;
        var rtn1 = InsuOPRegRollBack(dhandle, AdmInfoDr, UserID, AdmReasonId, ExpStr);

        //
        InputObj['TradeCode'] = 'SaveBD';
        InputObj['modal_code'] = 'INSUCancelPreRegBack';
        InputObj['intef_input'] = dhandle + ',' + AdmInfoDr + ',' +  UserID + ',' + AdmReasonId + ',' + ExpStr;
        InputObj['intef_output'] = rtn1;
        var rtn = CallMethod(InputObj,'',"CallPythonService","N");
        if(rtn1.split('^')[0] < 0 ){
            OSPAlert('',rtn1,'提示|Y');
            return;
        }
        if(rtn.result != 0){
            return;
        } 
    } catch (error) {
        OSPAlert('','-10010CP网络异常，请返回主页并重试','提示|Y',function(){
            homePageClick();
            return false;
        });
    }
}
/// 退号
function PayServ_INSURegReturn(InputObj){
    try {
            // InsuOPRegCommit
        var InsuType = OSPGetParentVal('InsuType');
        if(InsuType == '1' || InsuType == ''){
            return "";
        }

        if(!InputObj){
            InputObj = {}
        }
        InputObj['TradeCode'] = 'PayServ_INSURegReturn'
        var rtn = CallMethod(InputObj,'',"CallPythonService","N");
        if(rtn.result != 0){
            return;
        }  
        var jsonStr = rtn.output;
        var jsonObj = JSON.parse(jsonStr)
        //Param
        var dhandle = jsonObj.dhandle;
        var AdmInfoDr = jsonObj.AdmInfoDr;
        var UserID = jsonObj.UserID;
        var AdmReasonId = jsonObj.AdmReasonId;
        var ExpStr = jsonObj.ExpStr;
        var rtn1 = InsuOPRegDestroy(dhandle, AdmInfoDr, UserID, AdmReasonId, ExpStr);

        //
        InputObj['TradeCode'] = 'SaveBD';
        InputObj['modal_code'] = 'INSURegReturnBack';
        InputObj['intef_input'] = dhandle + ',' + AdmInfoDr + ',' +  UserID + ',' + AdmReasonId + ',' + ExpStr;
        InputObj['intef_output'] = rtn1;
        var rtn = CallMethod(InputObj,'',"CallPythonService","N");
        if(rtn1.split('^')[0] < 0 ){
            OSPAlert('',rtn1,'提示|Y');
            return;
        }
        if(rtn.result != 0){
            return;
        } 
    } catch (error) {
        OSPAlert('','退号接口异常：' + error,'提示|Y',function(){
            homePageClick();
            return false;
        });
    }

}
/// 医保预结算
function PayServ_InsuOPDividePre(InputObj){
    try {
            // InsuOPRegCommit
        var InsuType = OSPGetParentVal('InsuType');
        if(InsuType == '1' || InsuType == ''){
            return "";
        }

        if(!InputObj){
            InputObj = {}
        }
        InputObj['TradeCode'] = 'PayServ_InsuOPDividePre'
        var rtn = CallMethod(InputObj,'',"CallPythonService","N");
        if(rtn.result != 0){
            return;
        }  
        //{"dhandle": "0", "UserID": "19401", "StrInvDr": "40902", "AdmSource": "1", "AdmReasonId": "2", "ExpStr": "N^238^^^^^Y^^111111^", "CPPFlag": "NotCPPFlag"}
        var jsonStr = rtn.output;
        var jsonObj = JSON.parse(jsonStr)
        //Param
        var dhandle = jsonObj.dhandle;
        var StrInvDr = jsonObj.StrInvDr;
        var UserID = jsonObj.UserID;
        var AdmReasonId = jsonObj.AdmReasonId;
        var AdmSource = jsonObj.AdmSource;
        var ExpStr = jsonObj.ExpStr;
        var CPPFlag = jsonObj.CPPFlag;
        var rtn1 = InsuOPDividePre(dhandle, UserID, StrInvDr, AdmSource,AdmReasonId,ExpStr,CPPFlag);
        //
        InputObj['TradeCode'] = 'SaveBD';
        InputObj['modal_code'] = 'InsuOPDividePreBack';
        InputObj['intef_input'] = dhandle + ',' + UserID + ',' +  StrInvDr + ',' + AdmSource+ ',' + AdmReasonId + ',' + ExpStr + ',' + CPPFlag;
        InputObj['intef_output'] = rtn1;
        var rtn = CallMethod(InputObj,'',"CallPythonService","N");
        
        if(rtn1.split('^')[0] < 0 ){
            return rtn1;
        }
        //
        if(rtn.result != 0){
            return rtn1;
        } 
        return rtn1;
    } catch (error) {
        OSPAlert('','医保预结算接口异常：' + error,'提示|Y',function(){
            homePageClick();
            return false;
        });
    }

}
/// 取消医保结算
function PayServ_InsuOPDivideRollBack(InputObj){
    try {
        // InsuOPRegCommit
        var InsuType = OSPGetParentVal('InsuType');
        if(InsuType == '1' || InsuType == ''){
            return "";
        }

        if(!InputObj){
            InputObj = {}
        }
        InputObj['TradeCode'] = 'PayServ_InsuOPDivideRollBack'
        var rtn = CallMethod(InputObj,'',"CallPythonService","N");
        if(rtn.result != 0){
            return;
        }  
        var jsonStr = rtn.output;
        var jsonObj = JSON.parse(jsonStr)
        //Param
        var dhandle = jsonObj.dhandle;
        var InsuDivDr = jsonObj.InsuDivDr;
        var UserID = jsonObj.UserID;
        var AdmReasonId = jsonObj.AdmReasonId;
        var AdmSource = jsonObj.AdmSource;
        var ExpStr = jsonObj.ExpStr;
        var CPPFlag = jsonObj.CPPFlag;
        var rtn1 = InsuOPDivideRollBack(dhandle, UserID, InsuDivDr, AdmSource,AdmReasonId,ExpStr,CPPFlag);
        InputObj['intef_input'] = dhandle + ',' + UserID + ',' +  InsuDivDr + ',' + AdmSource+ ',' + AdmReasonId + ',' + ExpStr + ',' + CPPFlag;
        //
        InputObj['TradeCode'] = 'SaveBD'
        InputObj['modal_code'] = 'InsuOPDivideRollBackBack'
        InputObj['intef_output'] = rtn1
        var rtn = CallMethod(InputObj,'',"CallPythonService","N");
        if(rtn1.split('^')[0] < 0 ){
            OSPAlert('',rtn1,'提示');
            return;
        }
        if(rtn.result != 0){
            return;
        } 
    } catch (error) {
        OSPAlert('','-100861001医保网络波动，请返回主页并重试一次，谢谢','提示',function(){
            homePageClick();
            return false;
        });
    }

}
/// 医保结算
/// -1 获取医保结算入参失败
/// -2 医保结算接口提交失败
/// -3 自助机保存医保结算数据失败
function PayServ_InsuOPDivideCommit(InputObj){
    try {
        // InsuOPRegCommit
        var rtnFlag = "Start"
        var InsuType = OSPGetParentVal('InsuType');
        if(InsuType == '1' ||InsuType == ''){
            return "0^";
        }

        if(!InputObj){
            InputObj = {}
        }
        InputObj['TradeCode'] = 'PayServ_InsuOPDivideCommit'
        var rtn = CallMethod(InputObj,'',"CallPythonService","N");
        if(rtn.result != 0){
            return '-1^';
        }  
        rtnFlag = "Param"
        var jsonStr = rtn.output;
        var jsonObj = JSON.parse(jsonStr)
        //Param
        // {"dhandle": "0", "UserID": "19401", "InsuDivDr": "16485", "AdmSource": "1", "AdmReasonId": "2", "ExpStr": "", "CPPFlag": "NotCPPFlag"}
        var dhandle = jsonObj.dhandle;
        var InsuDivDr = jsonObj.InsuDivDr;
        var UserID = jsonObj.UserID;
        var AdmReasonId = jsonObj.AdmReasonId;
        var AdmSource = jsonObj.AdmSource;
        var ExpStr = jsonObj.ExpStr;
        var CPPFlag = jsonObj.CPPFlag;
        var rtn1 = InsuOPDivideCommit(dhandle, UserID, InsuDivDr, AdmSource,AdmReasonId,ExpStr,CPPFlag);
        rtnFlag = "Success"
        //
        InputObj['TradeCode'] = 'SaveBD'
        InputObj['modal_code'] = 'InsuOPDivideCommitBacak'
        InputObj['intef_input'] = dhandle + ',' + UserID + ',' +  InsuDivDr + ',' + AdmSource+ ',' + AdmReasonId + ',' + ExpStr + ',' + CPPFlag;
        InputObj['intef_output'] = rtn1
        var rtn = CallMethod(InputObj,'',"CallPythonService","N");
        rtnFlag = "Save"
        if(rtn1.split('^')[0] < 0 ){
            return rtn1;
        }
        if(rtn.result != 0){
            return "-98^医保结算网络异常，请返回主页并重试";
        } 
        return "0^"
    } catch (error) {
        OSPAlert('','医保结算接口异常e：'  + rtnFlag + ':' + error,'提示|Y',function(){
            homePageClick();
            return "-99^";
        });   
    }

}
/// 取消医保结算
function PayServ_InsuOPDivideStrike(InputObj){
    try {
       // InsuOPRegCommit
        var InsuType = OSPGetParentVal('InsuType');
        if(InsuType == '1' || InsuType == ''){
            return "";
        }

        if(!InputObj){
            InputObj = {}
        }
        InputObj['TradeCode'] = 'PayServ_InsuOPDivideStrike';
        var rtn = CallMethod(InputObj,'',"CallPythonService","N");
        if(rtn.result != 0){
            return;
        }  
        var jsonStr = rtn.output;
        var jsonObj = JSON.parse(jsonStr)
        //Param
        var dhandle = jsonObj.dhandle;
        var InsuDivid = jsonObj.InsuDivid;
        var UserID = jsonObj.UserID;
        var AdmReasonId = jsonObj.AdmReasonId;
        var AdmSource = jsonObj.AdmSource;
        var ExpStr = jsonObj.ExpStr;
        var CPPFlag = jsonObj.CPPFlag;
        var rtn1 = InsuOPDivideStrike(dhandle, UserID, InsuDivid, AdmSource,AdmReasonId,ExpStr,CPPFlag);

        //
        InputObj['TradeCode'] = 'SaveBD';
        InputObj['modal_code'] = 'InsuOPDivideStrikeBack';
        InputObj['intef_input'] = dhandle + ',' + UserID + ',' +  InsuDivid + ',' + AdmSource+ ',' + AdmReasonId + ',' + ExpStr + ',' + CPPFlag;
        InputObj['intef_output'] = rtn1;
        var rtn = CallMethod(InputObj,'',"CallPythonService","N");
        if(rtn1.split('^')[0] < 0 ){
            OSPAlert('',rtn1,'提示');
            return;
        }
        if(rtn.result != 0){
            return;
        }  
    } catch (error) {
        OSPAlert('','取消医保结算接口异常：' + error,'提示|Y',function(){
            homePageClick();
            return false;
        });   
    }  
}
/// 取消医保结算
function PayServ_StrikeInsuSingle(InsuDivid){
    try{
        var rtn1 = InsuOPDivideStrike('0', '20131', InsuDivid, '','','',''); 
    } catch (error) {
        return true;
    }  
}
/// 取消医保预挂号
function PayServ_StrikeInsuRegSingle(InsuDivid){
    try{
        var rtn1 = InsuOPRegRollBack('0', InsuDivid,'20131','',''); 
    } catch (error) {
        return true;
    }  
}
//银行卡支付
//InputObj['TradeCode'] = 'PayServ_POSPay';
//InputObj['SelfAmt'] = SelfAmt;
function PayServ_POSPay(InputObj){
    try {
        var SelfAmt = InputObj['SelfAmt'];
        var rtn = CallMethod(InputObj,'',"CallPythonService","N");
        // 接口调用
        var rtn1 = SelfPayService(SelfAmt);
        if(!rtn1){
            return false;
        }
        //
        InputObj['intef_output'] = rtn1;
        CallMethod(InputObj,'',"CallPythonService","N");
        if(rtn1.split('|')[0] != '000000'){
            var msg = rtn1
            if(rtn1.split('|')[0] == "51"){
                msg = "余额不足";
            }else if (rtn1.split('|')[0]=="55"){
                msg = "密码错误";
            }else if (rtn1.split('|')[0]=="13"){
                msg = "交易金额超限";
            }
            // 用户取消 不打印
            if(rtn1.split('|')[0] == "-01"){
                OSPAlert('','银行卡支付失败：','提示',function(){
                    return false;
                });
                return false;
            }
            OSPAlert('','银行卡支付失败：','提示|Y',function(){
                return false;
            });
            return false;
        }
        //OSPPrintError("银行卡返回：" + rtn1);
        return true;  
    } catch (error) {
        return false;
    }
}
// 获取医保字典数据
function PayServ_GetDicInfo(InputObj){
    InputObj["TradeCode" ]= "PayServ_GetDicInfo"
	var rtn = CallMethod(InputObj,'',"CallPythonService","N");
    if(rtn.result != 0){
    }else{
        if (rtn.output !=""){
            rtn = OSPWebServicesXMLStr2Json(rtn.output);
        }     
    }   
    return rtn;
}
function PayServ_GetMenuBtn(){
    var InputObj = {
        "TradeCode" : "GetMenuBtn"
    }
	var rtn = CallMethod(InputObj,'',"CallPythonService","N");
    return rtn;
}
// 获取凭条打印数据
function PayServ_CertPrint(RegType){
    var InputObj = {
        "TradeCode" : "GetCertPrint",
        "RegType":RegType
    }
	var rtn = CallMethod(InputObj,'',"CallPythonService","N");
    return rtn;
}
// 获取自助机自动结账标志
function PayServ_CheckAutoHandin(RegType){
    try {
        var InputObj = {
            "TradeCode" : "CheckAutoHandin"
        }
        var rtn = CallMethod(InputObj,'',"CallPythonService","N");
        return rtn;
    } catch (error) {
        
    }
}
// 校验HIS是否结算成功
function PayServ_CheckHISResult(){
    try {
        var InputObj = {
            "TradeCode" : "4909"
        }
        var rtn = CallMethod(InputObj,'',"CallPythonService","N");
        return rtn;
    } catch (error) {
        
    }
}
function PayServ_GetInsuAmt(){
    var InputObj = {
        "TradeCode" : "GetInsuAmt"
    }
	var rtn = CallMethod(InputObj,'',"CallPythonService","N");
    return rtn;
}
 // 4.1 电子发票开票
function PayServInvocieBill(){
    try {
        setTimeout(function(){
            var InputObj = {}
            InputObj["TradeCode"]= "PayServInvocieBill";
            var rtn = CallMethod(InputObj,'',"CallPythonService","N"); 
        },1000)
    } catch (error) {  
        return true;
    }
}
// 保存操作日志
function PayServ_SaveBDInfo(a,b,c,d){
    try{
        var InputObj = {};
        if(typeof d !="undefined"){
            InputObj['TradeCode'] = d;
        }else{
            InputObj['TradeCode'] = 'SaveBD';
        }
        InputObj['modal_code'] = a; //操作类型
        InputObj['intef_input'] = b;    // 入参
        InputObj['intef_output'] = c;   // 出参
        var rtn1 = CallMethod(InputObj,'',"CallPythonService","N");
    }catch (error){
        return;
    }
}
// 获取HIS异常信息
function PayServ_GetChgException(){
    var InputObj = {
        "TradeCode" : "GetChgException"
    }
	var rtn = CallMethod(InputObj,'',"CallPythonService","N");
    return rtn;
}
// 保存设备模块信息
function PayServ_SaveDeviceInfo(modcode,moddesc,info){
    try {
        // 保存缺纸状态
        var input = {
            // 字段赋值
                'TradeCode': "insert^SelfServPy.Common.ss_eqmfaultCtl^EMFC",
                'ss_eqmf_eqcode' : OSPGetParentVal('client_dict')['ss_eqlistd_eqcode'],
                'ss_eqmf_modcode' :modcode,
                'ss_eqmf_moddesc' : moddesc ,
                'ss_eqmf_modstatus' : '-1' ,
                'ss_eqmf_faultcode' : '-1' ,
                'ss_eqmf_faultdesc' : info
            }
            CallMethod(input,'',"DoMethod","N");
            //return false;
    }catch (error) {  
        return true;
    }
}
// 更新动态库
function PayServ_UpdateDLL(){
    try {
        var InputObj = {
            "TradeCode" : "UpdateDLL"
        }
        var rtn = CallMethod(InputObj,'',"CallPythonService","N");
        return rtn;
    }catch (error) {  
        return true;
    }
}
//获取系统时间
function PayServ_GetSYSDateTime(){
    try {
        var InputObj = {
            "TradeCode" : "GetSYSDateTime"
        }
        var rtn = CallMethod(InputObj,'',"CallPythonService","N");
        OSPSetParentVal('SYSDateTime',rtn.output)
        return rtn;
    }catch (error) {  
        return true;
    }
}
//更新患者医保类型
// updatetype 是否更新表中的医保类型 Y更新 
function PayServ_UpdateHIType(hi_type,updatetype){
    try {
        if (updatetype=="Y"){
            var InputObj = {
                "TradeCode" : "UpdateHIType",
                "hi_type" : hi_type
            }
            CallMethod(InputObj,'',"CallPythonService","N");  
        }
        OSPSetParentVal('InsuType',hi_type); 
    } catch (error) {
        
    }
}
// 延迟方法
function PayServ_Sleep(seconds){
    var InputObj = {
        "TradeCode" : "sleep",
        'seconds':seconds
    }
	var rtn = CallMethod(InputObj,'',"CallPythonService","N");
    return rtn;
}
// 是否在自助机主界面显示自助机设备信息
function PayServ_GetShowEQInfo(){
    try {
        var InputObj = {}
        InputObj.TradeCode = "query^SelfServPy.Common.ss_dicdataCtl^DDC";
        InputObj.ss_dic_type = 'SYS';
        InputObj.ss_dic_code = 'ShowEQInfo';
        var rtn = CallMethod(InputObj,'',"DoMethod","N");
        return JSON.parse(rtn.output);
    } catch (error) {
        return {}
    }
}
//根据自助机获取配置的支付方式
function PayServ_GetPayMode(){
    var InputObj = {
        "TradeCode" : "PayServGetPayMode"
    }
	var rtn = CallMethod(InputObj,'',"CallPythonService","N");
    return rtn;
} 
function PayServ_Speed(msg){
    try {
        if(msg == ""){
            return;
        }
        $.ajax({
            type:'GET',
            url:'http://127.0.0.1:456',
            data:encodeURIComponent('{"type":"read","msg":"' + msg + '"}')
        }) 
    } catch (error) {
        return;
    }  
}
// 住院记录查询
function PayServ_GetIpAdmList(){
    try {
        var InputObj = {
            "TradeCode" : "GetIpAdmList"
        }
        var rtn = CallMethod(InputObj,'',"CallPythonService","N");
        return rtn;
    } catch (error) {
        return;
    }  
}