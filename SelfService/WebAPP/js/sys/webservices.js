/**
 * imedical/web/dhcbillinsu/offselfpro/js/common/ dhcbillinsu.offselfpro.webservices.js
 * @description service 前端与webservices交互
 * @param {String} webserviceName webservices名称(类名称)
 * @param {String} methodName 方法名
 * @param {function} funName 回调方法
 * @param {String} input 方法入参
 * @author tangzf
 */
/*tangzf 2021-6-3 
function CallWebService(input,funName,webserviceName,methodName){
	webserviceName = webserviceName ? webserviceName:"DHCBILL.SelfPay.SOAP.SelfPaySoap.cls";
	methodName = methodName ? methodName:"DHCSelfPay";
	var urlPath = "http://81.70.185.88/imedical/web/";
	//var urlPath = "http://127.0.0.1/imedical/web/";
	var cacheInfo = "?CacheUserName=_system&CachePassword=SYS&CacheNoRedirect=1&soap_method=" + methodName + '&';
	//var cacheInfo = "?CacheUserName=_system&CachePassword=SYS&CacheNoRedirect=1&soap_method=" + methodName + '&';
	var url = urlPath + webserviceName +  cacheInfo + "Input=" + input;
	//url= "http://ws.webxml.com.cn/WebServices/MobileCodeWS.asmx"	
	// url = "http://114.242.246.235:28080/imedical/web/DHCBILL.SelfPay.SOAP.DHCOPBillPaySOAP.cls?wsdl=1&CacheUserName=_system&CachePassword=SYS&CacheNoRedirect=1";
	// url = "http://114.251.235.112/imedical/web/DHCBILL.SelfPay.SOAP.DHCOPBillPaySOAP.cls?wsdl=1&CacheUserName=_system&CachePassword=SYS&CacheNoRedirect=1";
	 //url = "http://114.251.235.112/imedical/web/DHCBILL.SelfPay.SOAP.DHCOPBillPaySOAP.cls?CacheUserName=_system&CachePassword=yGiPRcGa&CacheNoRedirect=1&soap_method=DHCNetTest&Input="
	$.ajax({           
		type: "POST",            
		//contentType: "application/json;charset=GB2312",        
		url:encodeURI(url) ,            
		data: '',         
		dataType: "json",
		success: function (result) {                             
			alert('webservices=success');           
		},            
		error:function(error)
		{  
			if (typeof funName =='function'){
				var jsonObj = OSPWebServicesXML2Json(error.responseText,methodName);
				funName(jsonObj);   
			}        
		}        
	});
}*/
function CallWebService(input,funName,parseFlag,paramObj){
	try {
		if(!parseFlag){
			parseFlag="Y";
		}
		var url = PYTHONSERVER + 'CallHISWS';
		var Global = "";
		if(window.parent.OSPPatGlobal){
			Global = window.parent.OSPPatGlobal;
		}
		var Jsoninput = {
			"Input" : input
		}
		$.ajax({           
			type: "POST",                  
			url:url ,  			          
			data: Jsoninput, 
			async: true,
			success: function (XmlStr) {                             
				if (typeof funName =='function'){
					if(parseFlag=="Y"){
						XmlStr = OSPWebServicesXMLStr2Json(XmlStr);
					}
					funName(XmlStr, paramObj);
				}else{
					OSP_Alert("操作失败");
				}
			},            
			error:function(error) {
				OSP_Alert("操作失败");	       
			}
		});
	} catch (error) {
		OSP_Alert("CallMethod方法异常=" + error.responseText);
	}	
}

function tkMakeServerCall(input, parseFlag){
	try {
		if(!parseFlag){
			parseFlag="Y";
		}
		var url = PYTHONSERVER + 'CallHISWS';
		var Jsoninput = {
			"Input" : input
		}
		var rtn = $.ajax({           
			type: "POST",                  
			url:url ,  			          
			data: Jsoninput, 
			async: false,        
			success: function (XmlStr) {                             
								
			},            
			error:function(error) {  
				alert("操作失败");	       
			}
		});
		if(rtn.statusText != "OK"){
			OSPAlert("","调用HIS服务器失败","提示");
			return -1;
		}
		var rtnResp = rtn.responseText;
		rtnResp = rtnResp.substring(1,(rtnResp.length-1));
		if(parseFlag == "Y"){
			var XmlStr = OSPWebServicesXMLStr2Json(rtnResp);
		}else{
			XmlStr = rtnResp;
		}
		return XmlStr;
		//XmlStr = OSPWebServicesXMLStr2Json(XmlStr);
	} catch (error) {
		OSP_Alert("CallMethod方法异常=" + error.responseText);
	}	
}
// 
function CallPythonWebService(funName){
	try {
		var url = PYTHONSERVER + 'CallPythonService';
		var Global = "";
		if(window.parent.OSPPatGlobal){
			Global = window.parent.OSPPatGlobal;
		}
		var Jsoninput = {
			"GlobalParam": JSON.stringify(Global)
		}
		$.ajax({           
			type: "POST",
			url:url ,            
			data: Jsoninput,         
			success: function (XmlStr) {
				if (typeof funName == 'function'){
					var jsonObj = OSPWebServicesXMLStr2Json(XmlStr);
					funName(jsonObj);
				}else{
					OSP_Alert(XmlStr);
				}				
			},
			error:function(error) {  
				OSP_Alert("操作失败");
			}        
		});
	} catch (error) {
		OSP_Alert("CallPythonWebService方法异常=" + error.responseText);
	}
}
