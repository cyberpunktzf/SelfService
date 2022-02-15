var EnableLocalWeb = '1';
var WEBSYSHTTPSERVERURL = "http://localhost:11996/websys/";
//var defaultDllDir = location.href.slice(0,location.href.indexOf("web/"))+"web/addins/plugin";
var defaultDllDir = "http://10.80.10.10/imedical/web/addins/plugin";
var myXmlHttp = null,debuggerflag=false,isUseGetMethod = false,isMozilla = false;
function websysAjax(bizUrl,data,notReturn,callback){function invkProcessReq(){if(req.readyState === 4 && (req.status === 200||req.status === 500)){ var result = "var rtn="+req.responseText;eval(result); if ("string"==typeof callback && window[callback]){window[callback].call(req,rtn);} if ("function"==typeof callback){callback.call(req,rtn);}}}
  notReturn = notReturn||0; async=false; if (notReturn==1) async=true;	var url = WEBSYSHTTPSERVERURL + bizUrl;	var cspXMLHttp = null;	if (window.XMLHttpRequest) { 	isMozilla = true;		cspXMLHttp = new XMLHttpRequest();	} else if (window.ActiveXObject) { 	isMozilla = false;		try {			cspXMLHttp=new ActiveXObject("Microsoft.XMLHTTP");		} catch (e) {			try { 		 		cspXMLHttp=new ActiveXObject("Msxml2.XMLHTTP");				} catch (E) {				cspXMLHttp=null;			}		}	}	var req = cspXMLHttp;	req.onreadystatechange = invkProcessReq;	var dataArr = [],dataStr = data;	if ("object"==typeof data){	if(data.slice){		for(var i=0;i<data.length;i++){			for(var j in data[i]){				dataArr.push(j+"="+encodeURIComponent(data[i][j]));			}		}	}else{		for(var k in data){			dataArr.push(k+"="+encodeURIComponent(data[k]));		}	}	dataStr = dataArr.join("&");}	if (isUseGetMethod) {		req.open("GET", url+"?"+dataStr, async);		if (isMozilla) {			req.send(null);		} else {			req.send();		}	} else {		req.open("POST", url, async);		req.setRequestHeader("NotReturn-Type", notReturn);		req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");		try{req.send(dataStr);}catch(e){return invkProcessResponse(e);}	}return invkProcessResponse(req);}
function invkProcessResponse(req) {if(debuggerflag){ debugger;}	if("undefined"==typeof req.status) {/*exception*/		var err=req.name+'('+req.message+')'; /*alert(err);*/		return {"msg":err,"status":404,"rtn":null};	}	if(req.status != 200 && req.status != 500) {		var err=req.statusText+ ' (' + req.status + ')';		return {"msg":err,"status":req.status,"rtn":null};	}	var result="var a = "+req.responseText;	eval(result);return a;}
function invokeDll(mode,ass,cls,q,notReturn,callback){	return websysAjax(ass+'/'+cls,q,notReturn,callback);};

function ICls() {this.data=[];this.mode=0;this.notReturn=0;this.ass="";this.cls="";}
ICls.prototype.constructor=ICls;
ICls.prototype.invk = function(c){var rtn = invokeDll(this.mode,this.ass,this.cls,this.data,this.notReturn,c);return rtn ;};
ICls.prototype.clear = function(){this.data.length=2;return this;};
ICls.prototype.prop = function(k,v){var o = {};o[k]=v;this.data.push(o);return this;};
ICls.prototype.getMthParam = function(arg){	if (!arg.length) return "";	var len = arg.length,hasCallback = 0;	if (len>0&&"function"==typeof arg[len-1]){hasCallback=1;};	var param = "";	if (arg.length>0){		param = "P_COUNT="+(len-hasCallback);		for(var i=0; i<arg.length-hasCallback; i++){			param += "&P_"+i+"="+encodeURIComponent(arg[i]);		}	}return param;};
ICls.prototype.cmd = function(c){
	this.data.push({"_cmd":c});
	if(arguments.length>0&&"function"==typeof arguments[arguments.length-1]){return this.invk(arguments[arguments.length-1])};
	return this.invk();
}
   ICls.AssDirList=[];
/*�޸ı���ʱ��*/
ICls.PrjSetTime = function(){
	this.ass = "Interop.PrjSetTime";	this.cls = "PrjSetTime.CLSSETTIMEClass";	this.data.push({"_dllDir":defaultDllDir+"/PrjSetTime/Interop.PrjSetTime.dll,SetTime.dll"});	this.data.push({"_version":"1.0.0.0"});
	this.SetTime=function(){	this.data.push({"M_SetTime":this.getMthParam(arguments)});   if(arguments.length>0&&"function"==typeof arguments[arguments.length-1]){return this.invk(arguments[arguments.length-1]);}	return this.invk();}
}
ICls.PrjSetTime.prototype = new ICls();
ICls.PrjSetTime.prototype.constructor = ICls.PrjSetTime;
var PrjSetTime = new ICls.PrjSetTime();
try{
Object.defineProperty(PrjSetTime,'VYear',{enumerable:true,configrable:true,	get:function(){ return PrjSetTime._VYear||'';},
	set:function(v){PrjSetTime._VYear=v;if("function" !== typeof v){PrjSetTime.prop('VYear',v);}}
});
}catch(exxx){}
try{
Object.defineProperty(PrjSetTime,'VMonth',{enumerable:true,configrable:true,	get:function(){ return PrjSetTime._VMonth||'';},
	set:function(v){PrjSetTime._VMonth=v;if("function" !== typeof v){PrjSetTime.prop('VMonth',v);}}
});
}catch(exxx){}
try{
Object.defineProperty(PrjSetTime,'VDay',{enumerable:true,configrable:true,	get:function(){ return PrjSetTime._VDay||'';},
	set:function(v){PrjSetTime._VDay=v;if("function" !== typeof v){PrjSetTime.prop('VDay',v);}}
});
}catch(exxx){}
try{
Object.defineProperty(PrjSetTime,'VHour',{enumerable:true,configrable:true,	get:function(){ return PrjSetTime._VHour||'';},
	set:function(v){PrjSetTime._VHour=v;if("function" !== typeof v){PrjSetTime.prop('VHour',v);}}
});
}catch(exxx){}
try{
Object.defineProperty(PrjSetTime,'VMinute',{enumerable:true,configrable:true,	get:function(){ return PrjSetTime._VMinute||'';},
	set:function(v){PrjSetTime._VMinute=v;if("function" !== typeof v){PrjSetTime.prop('VMinute',v);}}
});
}catch(exxx){}
try{
Object.defineProperty(PrjSetTime,'VSecond',{enumerable:true,configrable:true,	get:function(){ return PrjSetTime._VSecond||'';},
	set:function(v){PrjSetTime._VSecond=v;if("function" !== typeof v){PrjSetTime.prop('VSecond',v);}}
});
}catch(exxx){}
/*��ӡLODOP*/
ICls.LODOP = function(){
	this.ass = "Interop.Lodop";	this.cls = "Lodop.LodopXClass";	this.data.push({"_dllDir":"http://127.0.0.1/dthealth/web/addins/plugin//lodop/Interop.Lodop.dll,install_lodop32.exe"});	this.data.push({"_version":"1.0.0.0"});
	this.FORMAT=function(){	this.data.push({"M_FORMAT":this.getMthParam(arguments)});	return this;}
	this.PRINT_INIT=function(){	this.data.push({"M_PRINT_INIT":this.getMthParam(arguments)});	return this;}
	this.PRINT=function(){	this.data.push({"M_PRINT":this.getMthParam(arguments)});	return this;}
	this.ADD_PRINT_LINE=function(){	this.data.push({"M_ADD_PRINT_LINE":this.getMthParam(arguments)});	return this;}
	this.ADD_PRINT_IMAGE=function(){	this.data.push({"M_ADD_PRINT_IMAGE":this.getMthParam(arguments)});	return this;}
	this.ADD_PRINT_TEXT=function(){	this.data.push({"M_ADD_PRINT_TEXT":this.getMthParam(arguments)});	return this;}
	this.SET_PRINT_STYLEA=function(){	this.data.push({"M_SET_PRINT_STYLEA":this.getMthParam(arguments)});	return this;}
	this.SET_LICENSES=function(){	this.data.push({"M_SET_LICENSES":this.getMthParam(arguments)});	return this;}
	this.GET_VALUE=function(){	this.data.push({"M_GET_VALUE":this.getMthParam(arguments)});	return this;}
	this.SET_PRINT_STYLE=function(){	this.data.push({"M_SET_PRINT_STYLE":this.getMthParam(arguments)});	return this;}
}
ICls.LODOP.prototype = new ICls();
ICls.LODOP.prototype.constructor = ICls.LODOP;
var LODOP = new ICls.LODOP();
/*�ϵ�xml��ӡ*/
ICls.DHCOPPrint = function(){
	this.ass = "Interop.DHCOPPrint";	this.cls = "DHCOPPrint.ClsBillPrintClass";	this.data.push({"_dllDir":defaultDllDir+"/DHCOPPrint/Interop.DHCOPPrint.dll,DHCOPPrint.dll,QRmaker.ocx"});	this.data.push({"_version":"102.0.0.0"});
	this.ToPrintHDLPStr=function(){		this.clear();	this.data.push({"M_ToPrintHDLPStr":this.getMthParam(arguments)});   if(arguments.length>0&&"function"==typeof arguments[arguments.length-1]){return this.invk(arguments[arguments.length-1]);}	return this.invk();}
	this.ToPrintDoc=function(){	this.data.push({"M_ToPrintDoc":this.getMthParam(arguments)});	return this;}
}
ICls.DHCOPPrint.prototype = new ICls();
ICls.DHCOPPrint.prototype.constructor = ICls.DHCOPPrint;
var DHCOPPrint = new ICls.DHCOPPrint();
/*��ȡ�ͻ�����Ϣ--ԭ��֧��*/
ICls.CmdShell = function(){
	this.ass = "cmd";	this.cls = "cmd";	this.data.push({"_dllDir":defaultDllDir+"/"});	this.data.push({"_version":"1.0.0.0"});
	this.GetInfo=function(){	this.data.push({"M_GetInfo":this.getMthParam(arguments)});	return this;}
	this.GetConfig=function(){		this.clear();	this.data.push({"M_GetConfig":this.getMthParam(arguments)});   if(arguments.length>0&&"function"==typeof arguments[arguments.length-1]){return this.invk(arguments[arguments.length-1]);}	return this.invk();}
	this.Run=function(){		this.clear();	this.data.push({"M_Run":this.getMthParam(arguments)});   if(arguments.length>0&&"function"==typeof arguments[arguments.length-1]){return this.invk(arguments[arguments.length-1]);}	return this.invk();}
	this.EvalJs=function(){		this.clear();	this.data.push({"M_EvalJs":this.getMthParam(arguments)});   if(arguments.length>0&&"function"==typeof arguments[arguments.length-1]){return this.invk(arguments[arguments.length-1]);}	return this.invk();}
	this.CurrentUserEvalJs=function(){		this.clear();	this.data.push({"M_CurrentUserEvalJs":this.getMthParam(arguments)});   if(arguments.length>0&&"function"==typeof arguments[arguments.length-1]){return this.invk(arguments[arguments.length-1]);}	return this.invk();}
}
ICls.CmdShell.prototype = new ICls();
ICls.CmdShell.prototype.constructor = ICls.CmdShell;
var CmdShell = new ICls.CmdShell();
/*���*/
ICls.trakWebEdit3 = function(){
	this.ass = "Interop.trakWebEdit3";	this.cls = "trakWebEdit3.TrakWebClass";	this.data.push({"_dllDir":defaultDllDir+"/trakWebEdit3/Interop.trakWebEdit3.dll,trakWebEdit3.DLL,DhtmlEd.msi"});	this.data.push({"_version":"1.0.0.0"});
	this.ShowLayout=function(){		this.clear();	this.data.push({"M_ShowLayout":this.getMthParam(arguments)});   if(arguments.length>0&&"function"==typeof arguments[arguments.length-1]){return this.invk(arguments[arguments.length-1]);}	return this.invk();}
}
ICls.trakWebEdit3.prototype = new ICls();
ICls.trakWebEdit3.prototype.constructor = ICls.trakWebEdit3;
var trakWebEdit3 = new ICls.trakWebEdit3();
/*���ı�*/
ICls.SpVoice = function(){
	this.ass = "interop.SAPI";	this.cls = "SAPI.SpVoice";	this.data.push({"_dllDir":defaultDllDir+"/SpVoiceX86/DotNetSpeech.dll"});	this.data.push({"_version":"1.0.0.0"});
	this.Speak=function(){	this.data.push({"M_Speak":this.getMthParam(arguments)});	return this;}
}
ICls.SpVoice.prototype = new ICls();
ICls.SpVoice.prototype.constructor = ICls.SpVoice;
var SpVoice = new ICls.SpVoice();
/*������֤*/
ICls.DHCDocReadPerson = function(){
	this.ass = "Interop.DHCDocReadPerson";	this.cls = "DHCDocReadPerson.PublicReadPersonClass";	this.data.push({"_dllDir":defaultDllDir+"/DHCDocReadPerson/Interop.DHCDocReadPerson.dll,DHCDocReadPerson.zip"});	this.data.push({"_version":"1.0.0.9"});
	this.ReadPersonInfo=function(){		this.clear();	this.data.push({"M_ReadPersonInfo":this.getMthParam(arguments)});   if(arguments.length>0&&"function"==typeof arguments[arguments.length-1]){return this.invk(arguments[arguments.length-1]);}	return this.invk();}
	this.PicToBase64=function(){		this.clear();	this.data.push({"M_PicToBase64":this.getMthParam(arguments)});   if(arguments.length>0&&"function"==typeof arguments[arguments.length-1]){return this.invk(arguments[arguments.length-1]);}	return this.invk();}
}
ICls.DHCDocReadPerson.prototype = new ICls();
ICls.DHCDocReadPerson.prototype.constructor = ICls.DHCDocReadPerson;
var PublicReadPerson = new ICls.DHCDocReadPerson();
/*ҽ����*/
ICls.DoctorSheet = function(){
	this.ass = "DHCCDoctorOrderSheet";	this.cls = "DHCCDoctorOrderSheet.WebInterface";	this.data.push({"_dllDir":defaultDllDir+"/DoctorSheet/DHCCDoctorOrderSheet.dll,DoctorSheet.zip"});	this.data.push({"_version":"1.0.0.0"});
	this.showDoctorOrderSheetWindow=function(){		this.clear();	this.data.push({"M_showDoctorOrderSheetWindow":this.getMthParam(arguments)});   if(arguments.length>0&&"function"==typeof arguments[arguments.length-1]){return this.invk(arguments[arguments.length-1]);}	return this.invk();}
}
ICls.DoctorSheet.prototype = new ICls();
ICls.DoctorSheet.prototype.constructor = ICls.DoctorSheet;
var DoctorSheet = new ICls.DoctorSheet();
/*����*/
ICls.DHCCardInfo = function(){
	this.ass = "Interop.DHCCardInfo";	this.cls = "DHCCardInfo.ClsM1CardClass";	this.data.push({"_dllDir":defaultDllDir+"/DHCCardInfo/Interop.DHCCardInfo.dll,dcrf32.dll,DHCCardInfo.dll"});	this.data.push({"_version":"1.0.0.0"});
	this.ReadMagCard=function(){		this.clear();	this.data.push({"M_ReadMagCard":this.getMthParam(arguments)});   if(arguments.length>0&&"function"==typeof arguments[arguments.length-1]){return this.invk(arguments[arguments.length-1]);}	return this.invk();}
}
ICls.DHCCardInfo.prototype = new ICls();
ICls.DHCCardInfo.prototype.constructor = ICls.DHCCardInfo;
var ClsM1Card = new ICls.DHCCardInfo();
/*�м������*/
ICls.CMgr = function(){
	this.ass = "mgr";	this.cls = "mgr";	this.data.push({"_dllDir":defaultDllDir+"/WebsysServerSetup/WebsysServerSetup.zip"});	this.data.push({"_version":"1.0.0.32"});
	this.getVersion=function(){	this.data.push({"M_getVersion":this.getMthParam(arguments)});   if(arguments.length>0&&"function"==typeof arguments[arguments.length-1]){return this.invk(arguments[arguments.length-1]);}	return this.invk();}
}
ICls.CMgr.prototype = new ICls();
ICls.CMgr.prototype.constructor = ICls.CMgr;
var CMgr = new ICls.CMgr();
/*Excel��ӡ�����ȹ���*/
ICls.ExcelSheet = function(){
	this.ass = "MediWay.ExcelSheet";	this.cls = "MediWay.Websys.MWExcelSheet";	this.data.push({"_dllDir":defaultDllDir+"/MWExcelSheet/MediWay.ExcelSheet.dll"});	this.data.push({"_version":"1.0.0.0"});
	this.Run=function(){	this.data.push({"M_Run":this.getMthParam(arguments)});   if(arguments.length>0&&"function"==typeof arguments[arguments.length-1]){return this.invk(arguments[arguments.length-1]);}	return this.invk();}
}
ICls.ExcelSheet.prototype = new ICls();
ICls.ExcelSheet.prototype.constructor = ICls.ExcelSheet;
var xlSheet = new ICls.ExcelSheet();
/*���д���  */
ICls.ScriptControl = function(){
	this.ass = "MWScriptControl";	this.cls = "MWScriptControl.ScriptControl";	this.data.push({"_dllDir":defaultDllDir+"/MWScriptControl/MWScriptControl.dll,Interop.MSScriptControl.dll"});	this.data.push({"_version":"1.0.0.2"});
	this.EvalJs=function(){		this.clear();	this.data.push({"M_EvalJs":this.getMthParam(arguments)});   if(arguments.length>0&&"function"==typeof arguments[arguments.length-1]){return this.invk(arguments[arguments.length-1]);}	return this.invk();}
}
ICls.ScriptControl.prototype = new ICls();
ICls.ScriptControl.prototype.constructor = ICls.ScriptControl;
var scriptCtrl = new ICls.ScriptControl();
/*����trakWebEditCAB��*/
ICls.trakWebEditCAB = function(){
	this.ass = "Interop.trakWebEdit3";	this.cls = "trakWebEdit3.TrakWebClass";	this.data.push({"_dllDir":defaultDllDir+"/trakWebEditCAB/trakWebEdit3.CAB,DhtmlEd.msi"});	this.data.push({"_version":"1.0.0.1"});
}
ICls.trakWebEditCAB.prototype = new ICls();
ICls.trakWebEditCAB.prototype.constructor = ICls.trakWebEditCAB;
var trakWebEditCAB = new ICls.trakWebEditCAB();
/*ȡɫexe��������*/
ICls.qise = function(){
	this.ass = "qise";	this.cls = "qise";	this.data.push({"_dllDir":defaultDllDir+"/qise/qise.zip"});	this.data.push({"_version":"1.0.0.1"});
}
ICls.qise.prototype = new ICls();
ICls.qise.prototype.constructor = ICls.qise;
var qise = new ICls.qise();
/*ҽΪ�����*/
ICls.DHCWebBrowser = function(){
	this.ass = "DHCWebBrowser";	this.cls = "DHCWebBrowser";	this.data.push({"_dllDir":defaultDllDir+"/DHCWebBrowser/makelnk.vbs,DHCWebBrowser.zip"});	this.data.push({"_version":"1.0.0.8"});
}
ICls.DHCWebBrowser.prototype = new ICls();
ICls.DHCWebBrowser.prototype.constructor = ICls.DHCWebBrowser;
var DHCWebBrowser = new ICls.DHCWebBrowser();
