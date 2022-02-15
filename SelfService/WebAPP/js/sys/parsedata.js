/**
 * parsedata.js
 * @description service 解析后端返回的数据->json
 * @author tangzf
 */
//xml数据转成json
function OSPWebServicesXML2Json(xmlstr,methodName) {
	var x2js = new X2JS();
	var jsonObj = x2js.xml_str2json(xmlstr);
	var result = jsonObj.Envelope.Body[methodName + 'Response'][methodName + 'Result'];
	if(result.__cdata){
		result=result.__cdata[0]+result.__cdata[1];
	}
	var rtn=x2js.xml_str2json( result );
	if(!rtn){
		alert('抱歉：数据处理时网络波动1：请稍后重试：' + xmlstr);
		homePageClick();
	}
	return rtn;
}
function OSPWebServicesXMLStr2Json(xmlstr) {
	var x2js = new X2JS();
	var rtn=x2js.xml_str2json( xmlstr );
	if(!rtn){	
		alert('抱歉：数据处理时网络波动：请稍后重试：' + xmlstr);
		homePageClick();
	}
	return rtn;
}
function OSPWeChatXML(input){
	var x2js = new X2JS();
	var jsonObj = x2js.xml_str2json(input);
	//input.replace("![CDATA","");
	//input.replace("]","");
	//input.replace("[","");
	return jsonObj;
}
function OSPJsonStr2JsonObj(jsonStr){
	var jsonObj = JSON.parse(jsonStr);
	return jsonObj;
}
function OSPJsonObj2JsonStr(jsonObj){
	var jsonStr = JSON.stringify(jsonObj);
	return jsonStr;
}
function SelfServJsonObj2XMLStr(jsonObj){
	var x2js = new X2JS();
	var xmlStr = x2js.json2xml_str(jsonObj);
	return xmlStr;
}
