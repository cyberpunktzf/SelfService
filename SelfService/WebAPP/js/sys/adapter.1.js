// js/common/adapter.js

/**
 * @description  前端与python交互
 * @param {String} input 调用入参
 * @param {function} funName 回调方法
 * @param {String} code 调用代码 例如获取字典=‘DicData’
 * @param {String} ajaxType 非N 为异步调用，缺省：异步调用
 * @return {JsonString} "{"msg":"","result":"0==success","output":"","outputType":"JSON/XML"}"
 * @author tangzf
 */
var PYTHONSERVER = "http://" + location.href.split('/')[2] + "/";//'http://81.70.185.88:8000/';
function CallMethod(input,funName,PythonMethod,ajaxType){
	try {	
		var ParamInput1 = input;
		if(!ajaxType){
			ajaxType = true;
		}else{
			if(ajaxType == "N"){
				ajaxType = false;
			}else{
				ajaxType = true;
			}
		}
		if( PythonMethod == "CallPythonService"){
			input = BuildInput(input);
		}
		// Python Server address
		var url = PYTHONSERVER + PythonMethod;
		if(url.indexOf("favfavicon")>0){
			return;
		}
		var rtn = $.ajax({           
			type: "POST",                  
			url: url ,            
			data: input,   
			async: ajaxType,             
			success: function (jsonObj) {  
				if(!ajaxType){
					return; // 同步退出
				}                      
				//异步处理返回值   
				if(typeof childIframe != "undefined"){
					//childIframe.window.RemoveLoading();
				}else{
					//RemoveLoading();
				}	
				if(jsonObj.result == 0){
					if (typeof funName =='function'){
						funName(jsonObj);
					}				
				}else{
					
					if(ParamInput1["TradeCode"]!="GetExceptionPrint" && ParamInput1["TradeCode"]!="CheckRule"){	
						OSPAlert('',jsonObj.msg,'抱歉');
						//OSPPrintError(jsonObj.msg);
					}
					return jsonObj;
				} 					
			},            
			error:function(error)
			{  
				if(ParamInput1["TradeCode"]!="CheckAutoHandin"){	
					OSPAlert('','服务调用失败','提示');
				}
				return;    
			}        
		});
		//同步处理返回值
		if(!ajaxType){
			//异步处理返回值   
			if(typeof childIframe != "undefined"){
				//childIframe.window.RemoveLoading();
			}else{
				//RemoveLoading();
			}	
			if(rtn.responseJSON){
				return rtn.responseJSON;
			}
			var jsonObj = JSON.parse(rtn.responseText);
			if(!jsonObj.result){
				OSPAlert('','调用方法没有返回值','异常');
				return jsonObj;
			}
			if(jsonObj.result != 0){
				if(jsonObj.result == '6969'){ // 医保网络异常
					OSPAlert('',jsonObj.msg,'抱歉',function(){
						homePageClick();
					});
					return jsonObj;
				}
				if (jsonObj.msg.indexOf('网络异常') > -1){ // 医保网络异常
					OSPAlert('',jsonObj.msg,'抱歉',function(){
						homePageClick();
					});
					return jsonObj;
				}
				if(ParamInput1["TradeCode"]!="GetExceptionPrint" && ParamInput1["TradeCode"]!="CheckRule"){	
					OSPAlert('',jsonObj.msg,'抱歉');
					//OSPPrintError(jsonObj.msg);
				}
				return jsonObj;
			}
			return jsonObj
		}
	} catch (error) {	
		//OSPAlert('',"CallMethod方法异常=" + error.responseText,'提示');
	}finally{
		//RemoveLoading();
	}	
}
function BuildInput(ParamInput){
	var a = OSPGetParentVal('serial_id'); 
	var b = OSPGetParentVal('serial_number'); 
	ParamInput['serial_id'] = a;
	ParamInput['serial_number'] = b;
	var Business = OSPGetParentVal('Business'); 
	var CurrentBusiness = OSPGetParentVal('CurrentBusiness')
	var c = Business[CurrentBusiness]?Business[CurrentBusiness].code:"";
	var d = OSPGetParentVal('bd_id');
	if( !ParamInput['modal_code'] || ParamInput['modal_code'] == ""){
		ParamInput['modal_code'] = c;
	}
	ParamInput['bd_id'] = d;
	var OutPutStr = JSON.stringify(ParamInput)
	var input = {
		"Input" : OutPutStr
	}
	return input;
}