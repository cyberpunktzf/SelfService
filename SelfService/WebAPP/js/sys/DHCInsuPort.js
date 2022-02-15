///DHCInsuPort.js
/// 版本号：V2.0
var INSUXMLHttp;

var session=new Array();
session['LOGON.TIMEOUT']='3600';
session['LOGON.SITECODE']='DHCHEALTH';
session['LOGON.REGION']='';
session['LOGON.USERID']='1';
session['LOGON.USERCODE']='demo';
session['LOGON.USERNAME']='Demo Group';
session['LOGON.GROUPID']='1';
session['LOGON.GROUPDESC']='Demo Group';
session['LOGON.LANGID']='20';
session['LOGON.CTLOCID']='1';
session['XMONTHSSHORT']='一月,二月,三月,四月,五月,六月,七月,八月,九月,十月,十一月,十二月';
session['CONTEXT']='';
session['LOGON.WARDID']='';
session['LOGON.HOSPID']='2';
session['ContainerName']='';
var ServerNameSpace = 'cn_iptcp:10.3.201.13[1972]:DHC-APP'
var GLOBALFun;
//Zhan 20200620 原来的全局变量太多,放在这里
/*
var INSUPORTGLOBAL={
	SysIp:"",			//中间件IP
	AddDivideFlag:"",	//是否向计费组结算界面添加支付方式
	InsuType:"",		//医保类型
	iniFileName:"",
	fso:"",
	iniServerIP:0,	//是否初始化ECP服务器IP。0不初始化IP，从DHCInsu.ini中取；1初始化传入的IP,
	INSUSerIP:"",
	INSUSerPort:"",
	INSUblltype:"",	//程序自动获取,
	httpFlag:0,		//在字典DLLType中的医保描述中配置,0:默认用传统模式，1:用http模式传参数(此模式时INSU.PORT.GLOBAL.iniServerIP要为0)，2:头菜单模式，3：websocket模式,
	ServerMode:0, 	//0:客户端模式,每个客户端要部署中间件服务程序 1:服务器模式只用在服务器上部署,脱卡时使用，客户端不用装医保环境,需要修改GetInsuSerIPAddress中的服务器IP,
	DHCINSUBLL:null,	//医保动态库对象
	tmpCnt:0,
	isIE:false,		//浏览器是否是IE,程序自动判断
	isSSL:false,	//是否是SSL,程序自动判断
	SerStatus:0,	//中间件服务状态,程序会自动判断
	isWinXP:false,	//是否是XP系统,程序自动判断
	dbEncrypt:"|||", //数据加加密信息串,程序自动在字典表中取
	HospID:session['LOGON.HOSPID'],
	INSULOCALSERVICE:0,
	chromeVersion:0,	//Chrome版本号,程序自动判断
	AutoStartINSUService:0	//是否自动启动中间件,字典表中配置
};
*/
//医保对象定义 DingSH 20201204
var INSU = {};          //INSU             医保对外对象
    INSU.PORT = {};     //INSU.PORT        医保接口对象
    INSU.PORT.GLOBAL =  //INSU.PORT.GLOBAL 医保接口对象全局变量
    {
		SysIp:"",			//中间件IP
		AddDivideFlag:"",	//是否向计费组结算界面添加支付方式
		InsuType:"",		//医保类型
		iniFileName:"",
		fso:"",
		iniServerIP:0,	//是否初始化ECP服务器IP。0不初始化IP，从DHCInsu.ini中取；1初始化传入的IP,
		INSUSerIP:"",
		INSUSerPort:"",
		INSUblltype:"",	//程序自动获取,
		httpFlag:1,		//在字典DLLType中的医保描述中配置,0:默认用传统模式，1:用http模式传参数(此模式时INSU.PORT.GLOBAL.iniServerIP要为0)，2:头菜单模式，3：websocket模式,
		ServerMode:0, 	//0:客户端模式,每个客户端要部署中间件服务程序 1:服务器模式只用在服务器上部署,脱卡时使用，客户端不用装医保环境,需要修改GetInsuSerIPAddress中的服务器IP,
		DHCINSUBLL:null,	//医保动态库对象
		tmpCnt:0,
		isIE:false,		//浏览器是否是IE,程序自动判断
		isSSL:false,	//是否是SSL,程序自动判断
		SerStatus:0,	//中间件服务状态,程序会自动判断
		isWinXP:false,	//是否是XP系统,程序自动判断
		dbEncrypt:"|||", //数据加加密信息串,程序自动在字典表中取
		HospID:session['LOGON.HOSPID'],
		INSULOCALSERVICE:0,
		chromeVersion:0,	//Chrome版本号,程序自动判断
		AutoStartINSUService:0	//是否自动启动中间件,字典表中配置
	};
	
    INSU.MSG =                               //医保消息提醒对象
    {
	    //例子 
	    //INSU.MSG.alertMsg("Hello INSU","温馨提示","info")
	    //INSU.MSG.alertMsg("医保收费金额不等,请联系系统管理员","报错提示","error")
		alertMsg:function(msg,title,shwType)
		{
			if (typeof $.messager.alert =="function")
			{
				$.messager.alert(title,msg,shwType);
			} 
			else if (typeof alert =="function")
			{
				alert(msg);
		    }
		    else
		    {
			    alert(msg);
			    
			}
		}
		// todo 
	
	};
/// 自助机预挂号
function InsuOPRegPre(dhandle, PaadmRowid, UserID, AdmReasonId, ExpStr){
	try{
		//return "0|6003105182^603991952^120000650601001^张?^女^1971-01-01^31^0^888888^宝安洪浪南路??号有限公司^1^1^2^Z000^1175.02^200907^5^0^0^0^0^0^0^0^0^0^^^^^^^1^0^0^0^0^0^综合##2^@@"
	   //var DHCINSUBLL = new ActiveXObject("DHCINSUBLL.INSU_TJ")
	   //var rtn=DHCINSUBLL.ReadCard(1,InsuNo,ExpString)  
	   // ExpString ^^^OPN^Y^N
	   ExpString = ExpStr
	   var rtn="-1";
	   InsuTypeCode="CZZG"
	   if(GetInsuDLLOBJByCode(InsuTypeCode)==false){return rtn}	//Zhan 20181213增加配置并增加中间件功能
	   var ExpStrForNet=BuildInsuExpStrStd(ExpString,5)
	   if(INSU.PORT.GLOBAL.httpFlag!=1){
		   //if(iniServerIP){var ini=DHCINSUBLL.Initialize(ServerNameSpace)}	//Zhan 20170419,var ServerNameSpace = 'cn_iptcp:172.19.19.57[1972]:DHC-APP';
		   rtn=DHCINSUBLL.InsuOPRegPre(dhandle, PaadmRowid, UserID, BAdmReasonId, ExpStr)  
		   DHCINSUBLL= null;
	   }else{
		   var getInStr="dhandle=" + dhandle +"&PaadmRowid="+PaadmRowid+"&UserID="+UserID+"&AdmReasonId="+AdmReasonId+"&ExpStr="+toINSUSafeCode(ExpStr);
		   rtn=CallInsuComGet(INSU.PORT.GLOBAL.INSUblltype,"InsuOPRegPre",getInStr,"")
	   }
   
	   //DHCINSUBLL=null;
	   return rtn;
	}catch(e){
	   alert("调用医保接口发生异常"+e.message);
	   return "-1"
   }finally{
	   
   } 
}
/// 自助机挂号提交
/// ByVal dhandle As String, ByVal AdmInfoDr As String, ByVal UserID As String, ByVal AdmReasonId As String, ByVal ExpStr As String
function InsuOPRegCommit(dhandle, AdmInfoDr, UserID, AdmReasonId, ExpStr){
	try{
		//return "0|6003105182^603991952^120000650601001^张?^女^1971-01-01^31^0^888888^宝安洪浪南路??号有限公司^1^1^2^Z000^1175.02^200907^5^0^0^0^0^0^0^0^0^0^^^^^^^1^0^0^0^0^0^综合##2^@@"
	   //var DHCINSUBLL = new ActiveXObject("DHCINSUBLL.INSU_TJ")
	   //var rtn=DHCINSUBLL.ReadCard(1,InsuNo,ExpString)  
	   // ExpString ^^^OPN^Y^N
	   ExpString = ExpStr
	   var rtn="-1";
	   InsuTypeCode="CZZG"
	   if(GetInsuDLLOBJByCode(InsuTypeCode)==false){return rtn}	//Zhan 20181213增加配置并增加中间件功能
	   var ExpStrForNet=BuildInsuExpStrStd(ExpString,5)
	   if(INSU.PORT.GLOBAL.httpFlag!=1){
		   //if(iniServerIP){var ini=DHCINSUBLL.Initialize(ServerNameSpace)}	//Zhan 20170419,var ServerNameSpace = 'cn_iptcp:172.19.19.57[1972]:DHC-APP';
		   rtn=DHCINSUBLL.InsuOPRegCommit(dhandle, AdmInfoDr, UserID, BAdmReasonId, ExpStr)  
		   DHCINSUBLL= null;
	   }else{
		   var getInStr="dhandle=" + dhandle +"&AdmInfoDr="+AdmInfoDr+"&UserID="+UserID+"&AdmReasonId="+AdmReasonId+"&ExpStr="+toINSUSafeCode(ExpStr);
		   rtn=CallInsuComGet(INSU.PORT.GLOBAL.INSUblltype,"InsuOPRegCommit",getInStr,"")
	   }
   
	   //DHCINSUBLL=null;
	   return rtn;
	}catch(e){
	   alert("调用医保接口发生异常"+e.message);
	   return "-1"
   }finally{
	   
   } 
}
/// 自助机预挂号撤销
/// ByVal dhandle As String, ByVal AdmInfoDr As String, ByVal UserID As String, ByVal AdmReasonId As String, ByVal ExpStr As String
function InsuOPRegRollBack(dhandle, AdmInfoDr, UserID, AdmReasonId, ExpStr){
	try{
		//return "0|6003105182^603991952^120000650601001^张?^女^1971-01-01^31^0^888888^宝安洪浪南路??号有限公司^1^1^2^Z000^1175.02^200907^5^0^0^0^0^0^0^0^0^0^^^^^^^1^0^0^0^0^0^综合##2^@@"
	   //var DHCINSUBLL = new ActiveXObject("DHCINSUBLL.INSU_TJ")
	   //var rtn=DHCINSUBLL.ReadCard(1,InsuNo,ExpString)  
	   // ExpString ^^^OPN^Y^N
	   ExpString = ExpStr
	   var rtn="-1";
	   InsuTypeCode="CZZG"
	   if(GetInsuDLLOBJByCode(InsuTypeCode)==false){return rtn}	//Zhan 20181213增加配置并增加中间件功能
	   var ExpStrForNet=BuildInsuExpStrStd(ExpString,5)
	   if(INSU.PORT.GLOBAL.httpFlag!=1){
		   //if(iniServerIP){var ini=DHCINSUBLL.Initialize(ServerNameSpace)}	//Zhan 20170419,var ServerNameSpace = 'cn_iptcp:172.19.19.57[1972]:DHC-APP';
		   rtn=DHCINSUBLL.InsuOPRegRollBack(dhandle, AdmInfoDr, UserID, BAdmReasonId, ExpStr)  
		   DHCINSUBLL= null;
	   }else{
		   var getInStr="dhandle=" + dhandle +"&AdmInfoDr="+AdmInfoDr+"&UserID="+UserID+"&AdmReasonId="+AdmReasonId+"&ExpStr="+toINSUSafeCode(ExpStr);
		   rtn=CallInsuComGet(INSU.PORT.GLOBAL.INSUblltype,"InsuOPRegRollBack",getInStr,"")
	   }
   
	   //DHCINSUBLL=null;
	   return rtn;
	}catch(e){
	   alert("调用医保接口发生异常"+e.message);
	   return "-1"
   }finally{
	   
   } 
}
/// 自助机退号
/// ByVal dhandle As String, ByVal AdmInfoDr As String, ByVal UserID As String, ByVal AdmReasonId As String, ByVal ExpStr As String
function InsuOPRegDestroy(dhandle, AdmInfoDr, UserID, AdmReasonId, ExpStr){
	try{
		//return "0|6003105182^603991952^120000650601001^张?^女^1971-01-01^31^0^888888^宝安洪浪南路??号有限公司^1^1^2^Z000^1175.02^200907^5^0^0^0^0^0^0^0^0^0^^^^^^^1^0^0^0^0^0^综合##2^@@"
	   //var DHCINSUBLL = new ActiveXObject("DHCINSUBLL.INSU_TJ")
	   //var rtn=DHCINSUBLL.ReadCard(1,InsuNo,ExpString)  
	   // ExpString ^^^OPN^Y^N
	   ExpString = ExpStr
	   var rtn="-1";
	   InsuTypeCode="CZZG"
	   if(GetInsuDLLOBJByCode(InsuTypeCode)==false){return rtn}	//Zhan 20181213增加配置并增加中间件功能
	   var ExpStrForNet=BuildInsuExpStrStd(ExpString,5)
	   if(INSU.PORT.GLOBAL.httpFlag!=1){
		   //if(iniServerIP){var ini=DHCINSUBLL.Initialize(ServerNameSpace)}	//Zhan 20170419,var ServerNameSpace = 'cn_iptcp:172.19.19.57[1972]:DHC-APP';
		   rtn=DHCINSUBLL.InsuOPRegDestroy(dhandle, AdmInfoDr, UserID, BAdmReasonId, ExpStr)  
		   DHCINSUBLL= null;
	   }else{
		   var getInStr="dhandle=" + dhandle +"&AdmInfoDr="+AdmInfoDr+"&UserID="+UserID+"&AdmReasonId="+AdmReasonId+"&ExpStr="+toINSUSafeCode(ExpStr);
		   rtn=CallInsuComGet(INSU.PORT.GLOBAL.INSUblltype,"InsuOPRegDestroy",getInStr,"")
	   }
   
	   //DHCINSUBLL=null;
	   return rtn;
	}catch(e){
	   alert("调用医保接口发生异常"+e.message);
	   return "-1"
   }finally{
	   
   } 
}
/// 自助机预结算
/// ByVal dhandle As String, ByVal UserID As String, ByVal StrInvDr As String, ByVal AdmSource As String, ByVal AdmReasonId As String, ByVal ExpStr As String, ByVal CPPFlag As String
function InsuOPDividePre(dhandle, UserID, StrInvDr, AdmSource,AdmReasonId,ExpStr,CPPFlag){
	try{
		//return "0|6003105182^603991952^120000650601001^张?^女^1971-01-01^31^0^888888^宝安洪浪南路??号有限公司^1^1^2^Z000^1175.02^200907^5^0^0^0^0^0^0^0^0^0^^^^^^^1^0^0^0^0^0^综合##2^@@"
	   //var DHCINSUBLL = new ActiveXObject("DHCINSUBLL.INSU_TJ")
	   //var rtn=DHCINSUBLL.ReadCard(1,InsuNo,ExpString)  
	   // ExpString ^^^OPN^Y^N
	   ExpString = ExpStr
	   var rtn="-1";
	   InsuTypeCode="CZZG"
	   if(GetInsuDLLOBJByCode(InsuTypeCode)==false){return rtn}	//Zhan 20181213增加配置并增加中间件功能
	   var ExpStrForNet=BuildInsuExpStrStd(ExpString,5)
	   if(INSU.PORT.GLOBAL.httpFlag!=1){
		   //if(iniServerIP){var ini=DHCINSUBLL.Initialize(ServerNameSpace)}	//Zhan 20170419,var ServerNameSpace = 'cn_iptcp:172.19.19.57[1972]:DHC-APP';
		   rtn=DHCINSUBLL.InsuOPDividePre(dhandle, UserID, StrInvDr, AdmSource,AdmReasonId,ExpStr,CPPFlag)  
		   DHCINSUBLL= null;
	   }else{
		   var getInStr="dhandle=" + dhandle +"&UserID="+UserID+"&StrInvDr="+StrInvDr+"&AdmSource="+AdmSource+"&AdmReasonId=" + AdmReasonId+"&ExpStr=" +toINSUSafeCode(ExpStr)+"&CPPFlag=" + CPPFlag;
		   rtn=CallInsuComGet(INSU.PORT.GLOBAL.INSUblltype,"InsuOPDividePre",getInStr,"")
	   }
   
	   //DHCINSUBLL=null;
	   return rtn;
	}catch(e){
	   alert("调用医保接口发生异常"+e.message);
	   return "-1"
   }finally{
	   
   } 
}
/// 自助机结算
/// (ByVal dhandle As String, ByVal UserID As String, ByVal InsuDivDr As String, ByVal AdmSource As String, ByVal AdmReasonId As String, ByVal ExpStr As String, ByVal CPPFlag As String) 
function InsuOPDivideCommit(dhandle, UserID, InsuDivDr, AdmSource,AdmReasonId,ExpStr,CPPFlag){
	try{
		//return "0|6003105182^603991952^120000650601001^张?^女^1971-01-01^31^0^888888^宝安洪浪南路??号有限公司^1^1^2^Z000^1175.02^200907^5^0^0^0^0^0^0^0^0^0^^^^^^^1^0^0^0^0^0^综合##2^@@"
	   //var DHCINSUBLL = new ActiveXObject("DHCINSUBLL.INSU_TJ")
	   //var rtn=DHCINSUBLL.ReadCard(1,InsuNo,ExpString)  
	   // ExpString ^^^OPN^Y^N
	   ExpString = ExpStr
	   var rtn="-1";
	   InsuTypeCode="CZZG"
	   if(GetInsuDLLOBJByCode(InsuTypeCode)==false){return rtn}	//Zhan 20181213增加配置并增加中间件功能
	   var ExpStrForNet=BuildInsuExpStrStd(ExpString,5)
	   if(INSU.PORT.GLOBAL.httpFlag!=1){
		   //if(iniServerIP){var ini=DHCINSUBLL.Initialize(ServerNameSpace)}	//Zhan 20170419,var ServerNameSpace = 'cn_iptcp:172.19.19.57[1972]:DHC-APP';
		   rtn=DHCINSUBLL.InsuOPDivideCommit(dhandle, UserID, InsuDivDr, AdmSource,AdmReasonId,ExpStr,CPPFlag)  
		   DHCINSUBLL= null;
	   }else{
		   var getInStr="dhandle=" + dhandle +"&UserID="+UserID+"&InsuDivDr="+InsuDivDr+"&AdmSource="+AdmSource+"&AdmReasonId=" + AdmReasonId+"&ExpStr=" +toINSUSafeCode(ExpStr)+"&CPPFlag=" + CPPFlag;
		   rtn=CallInsuComGet(INSU.PORT.GLOBAL.INSUblltype,"InsuOPDivideCommit",getInStr,"")
	   }
   
	   //DHCINSUBLL=null;
	   return rtn;
	}catch(e){
	   alert("调用医保接口发生异常"+e.message);
	   return "-1"
   }finally{
	   
   } 
}
/// 自助机撤销医保预结算
/// ByVal dhandle As String, ByVal UserID As String, ByVal InsuDivDr As String, ByVal AdmSource As String, ByVal AdmReasonId As String, ByVal ExpStr As String, ByVal CPPFlag As String 
function InsuOPDivideRollBack(dhandle, UserID, InsuDivDr, AdmSource,AdmReasonId,ExpStr,CPPFlag){
	try{
		//return "0|6003105182^603991952^120000650601001^张?^女^1971-01-01^31^0^888888^宝安洪浪南路??号有限公司^1^1^2^Z000^1175.02^200907^5^0^0^0^0^0^0^0^0^0^^^^^^^1^0^0^0^0^0^综合##2^@@"
	   //var DHCINSUBLL = new ActiveXObject("DHCINSUBLL.INSU_TJ")
	   //var rtn=DHCINSUBLL.ReadCard(1,InsuNo,ExpString)  
	   // ExpString ^^^OPN^Y^N
	   ExpString = ExpStr;
	   var rtn="-1";
	   InsuTypeCode="CZZG"
	   if(GetInsuDLLOBJByCode(InsuTypeCode)==false){return rtn}	//Zhan 20181213增加配置并增加中间件功能
	   var ExpStrForNet = BuildInsuExpStrStd(ExpString,5)
	   if(INSU.PORT.GLOBAL.httpFlag!=1){
		   //if(iniServerIP){var ini=DHCINSUBLL.Initialize(ServerNameSpace)}	//Zhan 20170419,var ServerNameSpace = 'cn_iptcp:172.19.19.57[1972]:DHC-APP';
		   rtn=DHCINSUBLL.InsuOPDivideRollBack(dhandle, UserID, InsuDivDr, AdmSource,AdmReasonId,ExpStr,CPPFlag)  
		   DHCINSUBLL= null;
	   }else{
		   var getInStr="dhandle=" + dhandle +"&UserID="+UserID+"&InsuDivDr="+InsuDivDr+"&AdmSource="+AdmSource+"&AdmReasonId=" + AdmReasonId+"&ExpStr=" +toINSUSafeCode(ExpStr)+"&CPPFlag=" + CPPFlag;
		   rtn = CallInsuComGet(INSU.PORT.GLOBAL.INSUblltype,"InsuOPDivideRollBack",getInStr,"")
	   }
   
	   //DHCINSUBLL=null;
	   return rtn;
	}catch(e){
	   alert("调用医保接口发生异常：" + e.message);
	   return "-1"
   }finally{
	   
   } 
}
/// 自助机撤销医保结算
/// ByVal dhandle As String, ByVal UserID As String, ByVal InsuDivid As String, ByVal AdmSource As String, ByVal AdmReasonId As String, ByVal ExpStr As String, ByVal CPPFlag As String
function InsuOPDivideStrike(dhandle, UserID, InsuDivid, AdmSource,AdmReasonId,ExpStr,CPPFlag){
	try{
		//return "0|6003105182^603991952^120000650601001^张?^女^1971-01-01^31^0^888888^宝安洪浪南路??号有限公司^1^1^2^Z000^1175.02^200907^5^0^0^0^0^0^0^0^0^0^^^^^^^1^0^0^0^0^0^综合##2^@@"
	   //var DHCINSUBLL = new ActiveXObject("DHCINSUBLL.INSU_TJ")
	   //var rtn=DHCINSUBLL.ReadCard(1,InsuNo,ExpString)  
	   // ExpString ^^^OPN^Y^N
	   ExpString = ExpStr
	   var rtn="-1";
	   InsuTypeCode="CZZG"
	   if(GetInsuDLLOBJByCode(InsuTypeCode) == false){return rtn}	//Zhan 20181213增加配置并增加中间件功能
	   var ExpStrForNet=BuildInsuExpStrStd(ExpString,5)
	   if(INSU.PORT.GLOBAL.httpFlag!=1){
		   //if(iniServerIP){var ini=DHCINSUBLL.Initialize(ServerNameSpace)}	//Zhan 20170419,var ServerNameSpace = 'cn_iptcp:172.19.19.57[1972]:DHC-APP';
		   rtn=DHCINSUBLL.InsuOPDivideStrike(dhandle, UserID, InsuDivid, AdmSource,AdmReasonId,ExpStr,CPPFlag)  
		   DHCINSUBLL= null;
	   }else{
		   var getInStr="dhandle=" + dhandle +"&UserID="+UserID+"&InsuDivid="+InsuDivid+"&AdmSource="+AdmSource+"&AdmReasonId=" + AdmReasonId+"&ExpStr=" +toINSUSafeCode(ExpStr)+"&CPPFlag=" + CPPFlag;
		   rtn=CallInsuComGet(INSU.PORT.GLOBAL.INSUblltype,"InsuOPDivideStrike",getInStr,"")
	   }
   
	   //DHCINSUBLL=null;
	   return rtn;
	}catch(e){
	   alert("调用医保接口发生异常"+e.message);
	   return "-1"
   }finally{
	   
   } 
}
//----------------医保组和计费组接口标准版----------------
//读医保卡
//入参:病人类型    InsuTypeCode
//出参?
function ReadCardPersonInfo(InsuNo,Password,ExpString)
{  
 try{
 	//return "0|6003105182^603991952^120000650601001^张?^女^1971-01-01^31^0^888888^宝安洪浪南路??号有限公司^1^1^2^Z000^1175.02^200907^5^0^0^0^0^0^0^0^0^0^^^^^^^1^0^0^0^0^0^综合##2^@@"
	//var DHCINSUBLL = new ActiveXObject("DHCINSUBLL.INSU_TJ")
	//var rtn=DHCINSUBLL.ReadCard(1,InsuNo,ExpString)  
	// ExpString ^^^OPN^Y^N
	var rtn="-1";
	InsuTypeCode="CZZG"
	if(GetInsuDLLOBJByCode(InsuTypeCode)==false){return rtn}	//Zhan 20181213增加配置并增加中间件功能
	var ExpStrForNet=BuildInsuExpStrStd(ExpString,5)
	if(INSU.PORT.GLOBAL.httpFlag!=1){
		//if(iniServerIP){var ini=DHCINSUBLL.Initialize(ServerNameSpace)}	//Zhan 20170419,var ServerNameSpace = 'cn_iptcp:172.19.19.57[1972]:DHC-APP';
		rtn=INSU.PORT.GLOBAL.DHCINSUBLL.ReadCardPersonInfo(InsuNo,Password,ExpStrForNet)    
    	DHCINSUBLL= null;
	}else{
		InsuNo = InsuNo.replace('=',String.fromCharCode(2));
		InsuNo = InsuNo.replace('=',String.fromCharCode(2));
		InsuNo = InsuNo.replace('?',String.fromCharCode(3));
		InsuNo = InsuNo.replace('?',String.fromCharCode(3));
		InsuNo = InsuNo.replace('&',String.fromCharCode(4));
		InsuNo = InsuNo.replace('&',String.fromCharCode(4));
		var getInStr="InsuNo=" + InsuNo +"&Password="+Password+"&ExpString="+toINSUSafeCode(ExpStrForNet);
		rtn=CallInsuComGet(INSU.PORT.GLOBAL.INSUblltype,"ReadCardPersonInfo",getInStr,"")
    }

	//DHCINSUBLL=null;
	return rtn;
 }catch(e){
	alert("调用医保接口发生异常"+e.message);
	return "-1"
}finally{
	
} 
}

//----------------医保组和计费组接口标准版----------------
//读医保卡
//入参:
//     Handle：句柄默认0;UserId:SS_User.SSUSR_RowId;InsuNo:医保编号(身份证号);CardType:卡类型(有、无卡等)
//     ExpString:InsuType^数据库连接串^姓名^业务类型
//出参：参见\09yb\标准版\Doc医保读卡返回固定参数列表V2.00.xls
//      0或-1|^^^^^^^^^^^^^^^|^^^^^^^^^^^^^^^^  "|"的第一部分成功与否标志，第二部分是各个医保公用的串，第三部分是医保读卡剩余返回值的的拼串
function InsuReadCard(Handle,UserId,InsuNo,CardType,ExpString)
{  
 try{
 	//alert("读卡开始:InsuNo="+InsuNo+"^UserId="+UserId+"^ExpString="+ExpString)
 	//return "0|6003105182^603991952^120000650601001^张?^女^1971-01-01^31^0^888888^宝安洪浪南路??号有限公司^1^1^2^Z000^1175.02^200907^5^0^0^0^0^0^0^0^0^0^^^^^^^1^0^0^0^0^0^综合##2^@@"
	//InsuTypeCode=GetInsuTypeCode(AdmReasonId)
    //if (InsuTypeCode=="") {return -1;} 
 
    var ExpStrForNet=BuildInsuExpStrStd(ExpString,1)
        InsuTypeCode=ExpString.split("^")[0]
    var rtn="-1";
	/* Zhan 20181213注释，改为取配置
    switch (InsuTypeCode){ 
	    case "ZZB" :
	    	var DHCINSUBLL = new ActiveXObject("DHCINSUBLL.INSU_HN_ZZB_TEST"); //Zhan 20160615 test 
	    	break;
	    case "YZB" :
	    	var DHCINSUBLL = new ActiveXObject("DHCINSUBLL.INSU_JS_YZA");     //扬中市居民医保
	    	break;
	    default :
	    	alert("此类型不联医保接口,请检查程序或数据;InsuTypeCode="+InsuTypeCode);
	    	return -1;
	    	break;
	    }
		*/
		if(GetInsuDLLOBJByCode(InsuTypeCode)==false){return rtn}	//Zhan 20181213增加配置并增加中间件功能
    	if(INSU.PORT.GLOBAL.httpFlag==0){
    		if(INSU.PORT.GLOBAL.iniServerIP){var ini=INSU.PORT.GLOBAL.DHCINSUBLL.Initialize(ServerNameSpace)}	//Zhan 20170419,var ServerNameSpace = 'cn_iptcp:172.19.19.57[1972]:DHC-APP';
			rtn=INSU.PORT.GLOBAL.DHCINSUBLL.InsuASReadCard(Handle,UserId,InsuNo,CardType,ExpStrForNet)  
	    	DHCINSUBLL= null;
    	}else{
			var getInStr="Handle="+Handle+"&userid="+UserId+"&InsuNo="+InsuNo+"&CardType="+CardType+"&ExpString="+toINSUSafeCode(ExpStrForNet);
			rtn=CallInsuComGet(INSU.PORT.GLOBAL.INSUblltype,"InsuASReadCard",getInStr,"")
	    }
		    return rtn;
 }catch(e){
	alert("调用医保接口发生异常"+e.message);
	return "-1"
}finally{
	
} 
}

//读医保卡(弹窗)
//入参:
//     Handle：句柄默认0;UserId:SS_User.SSUSR_RowId;InsuNo:医保编号(身份证号);CardType:卡类型(有、无卡等)
//     ExpString:InsuType^数据库连接串^姓名^业务类型
//出参：参见\09yb\标准版\Doc医保读卡返回固定参数列表V2.00.xls
//      0或-1|^^^^^^^^^^^^^^^|^^^^^^^^^^^^^^^^  "|"的第一部分成功与否标志，第二部分是各个医保公用的串，第三部分是医保读卡剩余返回值的的拼串
function InsuReadCardFrm(Handle,UserId,InsuNo,CardType,ExpString)
{  
 try{
 	//alert("读卡开始:InsuNo="+InsuNo+"^UserId="+UserId+"^ExpString="+ExpString)
 	//return "0|6003105182^603991952^120000650601001^张?^女^1971-01-01^31^0^888888^宝安洪浪南路??号有限公司^1^1^2^Z000^1175.02^200907^5^0^0^0^0^0^0^0^0^0^^^^^^^1^0^0^0^0^0^综合##2^@@"
	//InsuTypeCode=GetInsuTypeCode(AdmReasonId)
    //if (InsuTypeCode=="") {return -1;} 
	var rtn="-1";
    var ExpStrForNet=BuildInsuExpStrStd(ExpString,1)
        InsuTypeCode=ExpString.split("^")[0]
    
	/* Zhan 20181213注释，改为取配置
    switch (InsuTypeCode){ 
	    case "ZZB" :
	    	var DHCINSUBLL = new ActiveXObject("DHCINSUBLL.INSU_HN_ZZB_TEST"); //Zhan 20160615 test 
	    	break;
	    case "YZB" :
	    	var DHCINSUBLL = new ActiveXObject("DHCINSUBLL.INSU_JS_YZA");     //扬中市居民医保
	    	break;
	    default :
	    	alert("此类型不联医保接口,请检查程序或数据;InsuTypeCode="+InsuTypeCode);
	    	return -1;
	    	break;
	    }
		*/

		if(GetInsuDLLOBJByCode(InsuTypeCode)==false){return rtn}	//Zhan 20181213增加配置并增加中间件功能
    	if(INSU.PORT.GLOBAL.httpFlag==0){
	    	if(INSU.PORT.GLOBAL.iniServerIP){var ini=INSU.PORT.GLOBAL.DHCINSUBLL.Initialize(ServerNameSpace)}	//Zhan 20170419,var ServerNameSpace = 'cn_iptcp:172.19.19.57[1972]:DHC-APP';
			var rtn=INSU.PORT.GLOBAL.DHCINSUBLL.InsuASReadCardFrm(Handle,UserId,InsuNo,CardType,ExpStrForNet)  
		    DHCINSUBLL= null;
    	}else{
			var getInStr="Handle="+Handle+"&userid="+UserId+"&InsuNo="+InsuNo+"&CardType="+CardType+"&ExpStrForNet="+toINSUSafeCode(ExpStrForNet);
			rtn=CallInsuComGet(INSU.PORT.GLOBAL.INSUblltype,"InsuASReadCardFrm",getInStr,"")
	    }

		    return rtn;
 }catch(e){
	alert("调用医保接口发生异常"+e.message);
	return "-1"
}finally{
	
} 
}

///入院登记
///入参:
/// Handle：句柄默认0;UserId:SS_User.SSUSR_RowId;PaadmRowid:Pa_Adm.Rowid;AdmReasonNationCode:Pac_AdmReason.REA_NationalCode
/// AdmReasonId:Pac_AdmReason.Rowid
/// ExpString: 入院类别(普通,急观,家床)^医保诊断编码^医保诊断名称^医保个人编号^就诊日期^就诊时间^治疗方式^补偿方式^医保类型^数据库连接^卡类型^待遇类别
//出参?0或-1
//说明 
function InsuIPReg(Handle,UserId,PaadmRowid,AdmReasonNationCode,AdmReasonId,ExpString)
{
 try{
 	//alert("医保入院登记开始Handle="+Handle+"^UserId="+UserId+"^PaadmRowid="+PaadmRowid+"^AdmReasonNationCode="+AdmReasonNationCode+"^AdmReasonId="+AdmReasonId+"^ExpString="+ExpString)
   // InsuTypeCode=GetInsuTypeCode(AdmReasonId)
      InsuTypeCode=ExpString.split("^")[8] ;
    var ExpStrForNet=BuildInsuExpStrStd(ExpString,9)
	var rtn="-1";
    if (InsuTypeCode=="") 
    {
	    alert("医保类型为空，请选择医保类型")
	    return -1;
	} 
	/* Zhan 20181213注释，改为取配置
    switch (InsuTypeCode){ 
	    case "ZZB" :
	    	var DHCINSUBLL = new ActiveXObject("DHCINSUBLL.INSU_HN_ZZB_TEST"); //Zhan 20160615 test 
	    	break;
	    case "YZB" :
	    	var DHCINSUBLL = new ActiveXObject("DHCINSUBLL.INSU_JS_YZA");     //扬中市居民医保
	    	break;
	    default :
	    	alert("此类型不联医保接口,请检查程序或数据;InsuTypeCode="+InsuTypeCode);
	    	return -1;
	    	break;
	    }
		*/

		if(GetInsuDLLOBJByCode(InsuTypeCode)==false){return rtn}	//Zhan 20181213增加配置并增加中间件功能
    	if(INSU.PORT.GLOBAL.httpFlag==0){
			if(INSU.PORT.GLOBAL.iniServerIP){var ini=INSU.PORT.GLOBAL.DHCINSUBLL.Initialize(ServerNameSpace)} //Zhan 20170419,var ServerNameSpace = 'cn_iptcp:172.19.19.57[1972]:DHC-APP';
			rtn=INSU.PORT.GLOBAL.DHCINSUBLL.InsuIPReg(Handle,UserId,PaadmRowid,AdmReasonNationCode, AdmReasonId,ExpStrForNet);
			DHCINSUBLL= null;
    	}else{
			var getInStr="Handle="+Handle+"&UserId="+UserId+"&PaadmRowid="+PaadmRowid+"&AdmReasonNationCode="+AdmReasonNationCode+"&AdmReasonId="+AdmReasonId+"&ExpString="+toINSUSafeCode(ExpStrForNet);
			rtn=CallInsuComGet(INSU.PORT.GLOBAL.INSUblltype,"InsuIPReg",getInStr,"")
	    }

    return rtn;
  }catch(e){
	alert("调用医保接口发生异常"+e.message);
	return "-1"
  }finally{
	
  }     
    
}


///入院登记修改
///入参:
/// Handle：句柄默认0;UserId:SS_User.SSUSR_RowId;PaadmRowid:Pa_Adm.Rowid;AdmReasonNationCode:Pac_AdmReason.REA_NationalCode
/// AdmReasonId:Pac_AdmReason.Rowid
/// ExpString: 入院类别(普通,急观,家床)^医保诊断编码^医保诊断名称^医保个人编号^就诊日期^就诊时间^治疗方式^补偿方式^医保类型^数据库连接^卡类型^待遇类别
//出参?0或-1
//说明 
function InsuIPRegMod(Handle,UserId,PaadmRowid,AdmReasonNationCode,AdmReasonId,ExpString)
{
 try{
 	//alert("医保入院登记开始Handle="+Handle+"^UserId="+UserId+"^PaadmRowid="+PaadmRowid+"^AdmReasonNationCode="+AdmReasonNationCode+"^AdmReasonId="+AdmReasonId+"^ExpString="+ExpString)
   // InsuTypeCode=GetInsuTypeCode(AdmReasonId)
      InsuTypeCode=ExpString.split("^")[8] ;
	var rtn="-1";
    var ExpStrForNet=BuildInsuExpStrStd(ExpString,9)

    if (InsuTypeCode=="") 
    {
	    alert("医保类型为空，请选择医保类型")
	    return -1;
	} 
	/* Zhan 20181213注释，改为取配置
    switch (InsuTypeCode){ 
	    case "ZZB" :
	    	var DHCINSUBLL = new ActiveXObject("DHCINSUBLL.INSU_HN_ZZB_TEST"); //Zhan 20160615 test 
	    	break;
	    case "YZB" :
	    	var DHCINSUBLL = new ActiveXObject("DHCINSUBLL.INSU_JS_YZA");     //扬中市居民医保
	    	break;
	    default :
	    	alert("此类型不联医保接口,请检查程序或数据;InsuTypeCode="+InsuTypeCode);
	    	return -1;
	    	break;
	    }
		*/
	if(GetInsuDLLOBJByCode(InsuTypeCode)==false){return rtn}	//Zhan 20181213增加配置并增加中间件功能
	if(INSU.PORT.GLOBAL.httpFlag==0){
		if(INSU.PORT.GLOBAL.iniServerIP){var ini=INSU.PORT.GLOBAL.DHCINSUBLL.Initialize(ServerNameSpace)} //Zhan 20170419,var ServerNameSpace = 'cn_iptcp:172.19.19.57[1972]:DHC-APP';
		rtn=INSU.PORT.GLOBAL.DHCINSUBLL.InsuIPRegMod(Handle,UserId,PaadmRowid,AdmReasonNationCode, AdmReasonId,ExpStrForNet);
		DHCINSUBLL= null;
	}else{
		var getInStr="Handle="+Handle+"&UserId="+UserId+"&PaadmRowid="+PaadmRowid+"&AdmReasonNationCode="+AdmReasonNationCode+"&AdmReasonId="+AdmReasonId+"&ExpString="+toINSUSafeCode(ExpStrForNet);
		rtn=CallInsuComGet(INSU.PORT.GLOBAL.INSUblltype,"InsuIPRegMod",getInStr,"")
	}

    return rtn;
  }catch(e){
	alert("调用医保接口发生异常"+e.message);
	return "-1"
  }finally{
	
  }     
    
}

//登记撤销
//入参:
///   Handle：句柄默认0;UserId:SS_User.SSUSR_RowId;PaadmRowid:Pa_Adm.Rowid;AdmReasonNationCode:Pac_AdmReason.REA_NationalCode
///   AdmReasonId:Pac_AdmReason.Rowid
///   ExpString: 医保类型^数据库连接串
//出参?0或-1
//说明?
function InsuIPRegStrike(Handle,UserId,PaadmRowid, AdmReasonNationCode, AdmReasonId,ExpString)
{
  try {	
     //alert("医保登记取消开始")
	//alert("医保入院登记撤销开始"+Handle+"^"+UserId+"^"+PaadmRowid+"^"+AdmReasonNationCode+"^"+AdmReasonId+"^"+ExpString)   
	 var ExpStrForNet=BuildInsuExpStrStd(ExpString,1)
	 InsuTypeCode=GetInsuTypeCode(AdmReasonId)
	var rtn="-1";
    if (InsuTypeCode=="") {return -1;} 		
	/* Zhan 20181213注释，改为取配置
    switch (InsuTypeCode){ 
	    case "ZZB" :
	    	var DHCINSUBLL = new ActiveXObject("DHCINSUBLL.INSU_HN_ZZB_TEST"); //Zhan 20160615 test 
	    	break;
	    case "YZB" :
	    	var DHCINSUBLL = new ActiveXObject("DHCINSUBLL.INSU_JS_YZA");     //扬中市居民医保
	    	break;
	    default :
	    	alert("此类型不联医保接口,请检查程序或数据;InsuTypeCode="+InsuTypeCode);
	    	return -1;
	    	break;
	    }
		*/
	if(GetInsuDLLOBJByCode(InsuTypeCode)==false){return rtn}	//Zhan 20181213增加配置并增加中间件功能
	if(INSU.PORT.GLOBAL.httpFlag==0){
		if(INSU.PORT.GLOBAL.iniServerIP){var ini=INSU.PORT.GLOBAL.DHCINSUBLL.Initialize(ServerNameSpace)} //Zhan 20170419,var ServerNameSpace = 'cn_iptcp:172.19.19.57[1972]:DHC-APP';
		rtn=INSU.PORT.GLOBAL.DHCINSUBLL.InsuIPRegDestroy(Handle,UserId,PaadmRowid, AdmReasonNationCode, AdmReasonId,ExpStrForNet);
		DHCINSUBLL= null;
	}else{
		var getInStr="Handle="+Handle+"&UserId="+UserId+"&PaadmRowid="+PaadmRowid+"&AdmReasonNationCode="+AdmReasonNationCode+"&AdmReasonId="+AdmReasonId+"&ExpString="+toINSUSafeCode(ExpStrForNet);
		rtn=CallInsuComGet(INSU.PORT.GLOBAL.INSUblltype,"InsuIPRegDestroy",getInStr,"")
	}
    return rtn;
 }catch(e){
	alert("调用医保接口发生异常"+e.message);
	return "-1"
}finally{
	
} 

}

//住院预结算
//入参:
///   Handle：句柄默认0;UserId:SS_User.SSUSR_RowId;BillNO:DHC_PatientBill.Rowid;AdmReasonNationCode:Pac_AdmReason.REA_NationalCode
///   AdmReasonId:Pac_AdmReason.Rowid
///   ExpString: 医保类型^数据库连接串
//出参? 0 ?-1
//说明?
function InsuIPDividePre(Handle,UserId,BillNO,AdmReasonNationCode,AdmReasonId,ExpString)
{
	try{
		//alert("医保住院预结算开始"+Handle+"^"+UserId+"^"+BillNO+"^"+AdmReasonNationCode+"^"+AdmReasonId+"^"+ExpString) 
		//return 0;
	 var ExpStrForNet=BuildInsuExpStrStd(ExpString,1)
	 InsuTypeCode=GetInsuTypeCode(AdmReasonId)
	var rtn="-1";
    if (InsuTypeCode=="") {return -1;} 		
	/* Zhan 20181213注释，改为取配置
    switch (InsuTypeCode){ 
	    case "ZZB" :
	    	var DHCINSUBLL = new ActiveXObject("DHCINSUBLL.INSU_HN_ZZB_TEST"); //Zhan 20160615 test 
	    	break;
	    case "YZB" :
	    	var DHCINSUBLL = new ActiveXObject("DHCINSUBLL.INSU_JS_YZA");     //扬中市居民医保
	    	break;
	    default :
	    	alert("此类型不联医保接口,请检查程序或数据;InsuTypeCode="+InsuTypeCode);
	    	return -1;
	    	break;
	    }
		*/
	if(GetInsuDLLOBJByCode(InsuTypeCode)==false){return rtn}	//Zhan 20181213增加配置并增加中间件功能
	if(INSU.PORT.GLOBAL.httpFlag==0){
		if(INSU.PORT.GLOBAL.iniServerIP){var ini=INSU.PORT.GLOBAL.DHCINSUBLL.Initialize(ServerNameSpace)} //Zhan 20170419,var ServerNameSpace = 'cn_iptcp:172.19.19.57[1972]:DHC-APP';
		rtn=INSU.PORT.GLOBAL.DHCINSUBLL.InsuIPDividePre(Handle,UserId,BillNO,AdmReasonNationCode,AdmReasonId,ExpStrForNet);
		DHCINSUBLL= null;
	}else{
		var getInStr="Handle="+Handle+"&UserId="+UserId+"&BillNO="+BillNO+"&AdmReasonNationCode="+AdmReasonNationCode+"&AdmReasonId="+AdmReasonId+"&ExpString="+toINSUSafeCode(ExpStrForNet);
		rtn=CallInsuComGet(INSU.PORT.GLOBAL.INSUblltype,"InsuIPDividePre",getInStr,"")
	}

    if(rtn.split("^")[0]=="0"){
		alert("医保预结算成功");
	}
    return rtn;
	}catch(e){
		alert("调用医保接口发生异常"+e.message);
		return -1;
	}
    
}

///住院明细上传
///入参:
///   Handle：句柄默认0;UserId:SS_User.SSUSR_RowId;BillNO:DHC_PatientBill.Rowid;AdmReasonNationCode:Pac_AdmReason.REA_NationalCode
///   AdmReasonId:Pac_AdmReason.Rowid
///   ExpString: 医保类型^数据库连接串
///出参? 0 ?-1
///说明?
function InsuIPMXUnload(Handle,UserId,BillNO,AdmReasonNationCode,AdmReasonId,ExpString)
{
	try{

	 var ExpStrForNet=BuildInsuExpStrStd(ExpString,1)
	 InsuTypeCode=GetInsuTypeCode(AdmReasonId)
	var rtn="-1";
    if (InsuTypeCode=="") {return -1;} 		
	/* Zhan 20181213注释，改为取配置
    switch (InsuTypeCode){ 
	    case "ZZB" :
	    	var DHCINSUBLL = new ActiveXObject("DHCINSUBLL.INSU_HN_ZZB_TEST"); //Zhan 20160615 test 
	    	break;
	    case "YZB" :
	    	var DHCINSUBLL = new ActiveXObject("DHCINSUBLL.INSU_JS_YZA");     //扬中市居民医保
	    	break;
	    default :
	    	alert("此类型不联医保接口,请检查程序或数据;InsuTypeCode="+InsuTypeCode);
	    	return -1;
	    	break;
	    }
		*/
	if(GetInsuDLLOBJByCode(InsuTypeCode)==false){return rtn}	//Zhan 20181213增加配置并增加中间件功能
	if(INSU.PORT.GLOBAL.httpFlag==0){
		if(INSU.PORT.GLOBAL.iniServerIP){var ini=INSU.PORT.GLOBAL.DHCINSUBLL.Initialize(ServerNameSpace)} //Zhan 20170419,var ServerNameSpace = 'cn_iptcp:172.19.19.57[1972]:DHC-APP';
		var rtn=INSU.PORT.GLOBAL.DHCINSUBLL.InsuIPMXUpload(Handle,UserId ,BillNO,AdmReasonNationCode,AdmReasonId,ExpStrForNet);
		DHCINSUBLL= null;
	}else{
		var getInStr="Handle="+Handle+"&UserId="+UserId+"&BillNO="+BillNO+"&AdmReasonNationCode="+AdmReasonNationCode+"&AdmReasonId="+AdmReasonId+"&ExpString="+toINSUSafeCode(ExpStrForNet);
		rtn=CallInsuComGet(INSU.PORT.GLOBAL.INSUblltype,"InsuIPMXUpload",getInStr,"")
	}
    if(rtn==="0"){
		alert("费用上传成功"); 		   
	}
    return rtn;
	}catch(e){
		alert("调用医保接口发生异常"+e.message);
		return -1;
	}
    
}

///住院明细费用删除
//入参:
///   Handle：句柄默认0;UserId:SS_User.SSUSR_RowId;BillNO:DHC_PatientBill.Rowid;AdmReasonNationCode:Pac_AdmReason.REA_NationalCode
///   AdmReasonId:Pac_AdmReason.Rowid
///   ExpString: 医保类型^数据库连接串
///出参? 0 ?-1
///说明?
function InsuIPMXCancel(Handle,UserId,BillNO,AdmReasonNationCode,AdmReasonId,ExpString)
{
	try{
	InsuTypeCode=GetInsuTypeCode(AdmReasonId)
    if (InsuTypeCode=="") {return -1;} 
    //alert(InsuTypeCode)
	var rtn="-1";
    var ExpStrForNet=BuildInsuExpStrStd(ExpString,1)
	 InsuTypeCode=GetInsuTypeCode(AdmReasonId)
    if (InsuTypeCode=="") {return -1;} 		
	/* Zhan 20181213注释，改为取配置
    switch (InsuTypeCode){ 
	    case "ZZB" :
	    	var DHCINSUBLL = new ActiveXObject("DHCINSUBLL.INSU_HN_ZZB_TEST"); //Zhan 20160615 test 
	    	break;
	    case "YZB" :
	    	var DHCINSUBLL = new ActiveXObject("DHCINSUBLL.INSU_JS_YZA");     //扬中市居民医保
	    	break;
	    default :
	    	alert("此类型不联医保接口,请检查程序或数据;InsuTypeCode="+InsuTypeCode);
	    	return -1;
	    	break;
	    }
		*/
      //return -1
	if(GetInsuDLLOBJByCode(InsuTypeCode)==false){return rtn}	//Zhan 20181213增加配置并增加中间件功能
	if(INSU.PORT.GLOBAL.httpFlag==0){
		if(INSU.PORT.GLOBAL.iniServerIP){var ini=INSU.PORT.GLOBAL.DHCINSUBLL.Initialize(ServerNameSpace)} //Zhan 20170419,var ServerNameSpace = 'cn_iptcp:172.19.19.57[1972]:DHC-APP';
		rtn=INSU.PORT.GLOBAL.DHCINSUBLL.InsuIPMXCancel(Handle,UserId,BillNO,AdmReasonNationCode,AdmReasonId,ExpStrForNet);
		DHCINSUBLL= null;
	}else{
		var getInStr="Handle="+Handle+"&UserId="+UserId+"&BillNO="+BillNO+"&AdmReasonNationCode="+AdmReasonNationCode+"&AdmReasonId="+AdmReasonId+"&ExpString="+toINSUSafeCode(ExpStrForNet);
		rtn=CallInsuComGet(INSU.PORT.GLOBAL.INSUblltype,"InsuIPMXCancel",getInStr,"")
	}
    if(rtn==="0"){
		alert("费用撤销成功"); 		   
	}
    return rtn;
	}catch(e){
		alert("调用医保接口发生异常"+e.message);
		return -1;
	}
    
}

///医保病人住院结算
//入参:
///   Handle：句柄默认0;UserId:SS_User.SSUSR_RowId;BillNO:DHC_PatientBill.Rowid;AdmReasonNationCode:Pac_AdmReason.REA_NationalCode
///   AdmReasonId:Pac_AdmReason.Rowid
///   ExpString: 医保类型^数据库连接串
///Return:成功:0,失败:-1
function InsuIPDivide(Handle,UserId,BillNO,AdmReasonNationCode,AdmReasonId,ExpString)
{
	try {
	//alert("医保结算开始")
	//alert("医保结算开始:Handle="+Handle+"^UserId="+UserId+"^BillNO="+BillNO+"^AdmReasonNationCode="+AdmReasonNationCode+"^AdmReasonId="+AdmReasonId+"^ExpString="+ExpString)
	INSU.PORT.GLOBAL.AddDivideFlag=false;	//向计费组结算界面添加费用成功与否的标志
	if(BillNO==""){alert("帐单号不能空!");return;}
	 InsuTypeCode=GetInsuTypeCode(AdmReasonId)
    if (InsuTypeCode=="") {return -1;} 
	 var DivideStr="-1";
     //alert(InsuTypeCode)      
	//alert(0+":"+InsuTypeCode);
     var ExpStrForNet=BuildInsuExpStrStd(ExpString,1)
	 InsuTypeCode=GetInsuTypeCode(AdmReasonId)
    if (InsuTypeCode=="") {return -1;} 		
	/* Zhan 20181213注释，改为取配置
    switch (InsuTypeCode){ 
	    case "ZZB" :
	    	var DHCINSUBLL = new ActiveXObject("DHCINSUBLL.INSU_HN_ZZB_TEST"); //Zhan 20160615 test 
	    	break;
	    case "YZB" :
	    	var DHCINSUBLL = new ActiveXObject("DHCINSUBLL.INSU_JS_YZA");     //扬中市居民医保
	    	break;
	    default :
	    	alert("此类型不联医保接口,请检查程序或数据;InsuTypeCode="+InsuTypeCode);
	    	return -1;
	    	break;
	    }
		*/
		//alert(Handle+"+"+BillNO+"+"+UserId+"+"+AdmReasonNationCode+"+"+AdmReasonId+"+"+ExpString)

		if(GetInsuDLLOBJByCode(InsuTypeCode)==false){return DivideStr}	//Zhan 20181213增加配置并增加中间件功能
    	if(INSU.PORT.GLOBAL.httpFlag==0){
			if(INSU.PORT.GLOBAL.iniServerIP){var ini=INSU.PORT.GLOBAL.DHCINSUBLL.Initialize(ServerNameSpace)} //Zhan 20170419,var ServerNameSpace = 'cn_iptcp:172.19.19.57[1972]:DHC-APP';
			DivideStr=INSU.PORT.GLOBAL.DHCINSUBLL.InsuIPDivide(Handle,UserId,BillNO,AdmReasonNationCode,AdmReasonId,ExpStrForNet);
			//alert(DivideStr)  //标志^总金额^统筹^附加^干保基金^帐户^现金  
			//DivideStr="0^146.7^0^0^0^146.7^0"
			//var	DivideStr="0^200^11.5^"+BillNO+String.fromCharCode(2)+"15^21.5"+String.fromCharCode(2)+"16^1000"+String.fromCharCode(2)+"17^0"+String.fromCharCode(2)+"18^500"
			DHCINSUBLL=null;  
    	}else{
			var getInStr="Handle="+Handle+"&UserId="+UserId+"&BillNO="+BillNO+"&AdmReasonNationCode="+AdmReasonNationCode+"&AdmReasonId="+AdmReasonId+"&ExpString="+toINSUSafeCode(ExpStrForNet);
			DivideStr=CallInsuComGet(INSU.PORT.GLOBAL.INSUblltype,"InsuIPDivide",getInStr,"")
	    }

		if((DivideStr=="")||(DivideStr=="-1")||(DivideStr==undefined))
		{
			return -1;
		}
		if(DivideStr=="-2") //什么情况返回-2,不用添加支付方式?
		{
			return 0;
		}
		
		//-----------如果计费组用的是老版的组件结算的界面，就用下边的添加支付方式的代码----->
		/*
		INSUAdd(DivideStr,1)	//向计费组结算界面添加各支付方式费用
		if(INSU.PORT.GLOBAL.AddDivideFlag==true)
		{
			return 0;
		}	
		else
		{
			return -1;
		}
		*/
		//<---------------------------------------------------------------------------------//
		
		//-------如果计费组用的是新版easyui界面，就用下边的代码，注释上边的不回支付方式的代码-->
		if("1"==GetIusujsMsgFlag("IPDIVIDE")){alert("医保结算完毕,返回值:"+DivideStr)}	//Zhan 20161219 弹窗增加配置
		//alert("DivideStr="+DivideStr)
		return DivideStr
		//<---------------------------------------------------------------------------------//
		
		

 	}catch(e){
		alert("调用医保接口发生异常"+e.message);
		return -1;
	}
}


//医保住院结算单打印
//入参:
///   Handle：句柄默认0;UserId:SS_User.SSUSR_RowId;BillNO:DHC_PatientBill.Rowid;AdmReasonNationCode:Pac_AdmReason.REA_NationalCode
///   AdmReasonId:Pac_AdmReason.Rowid
///   ExpString: 医保类型^数据库连接串
//出参? 0 ?-1
//说明?
function InsuIPJSDPrint(Handle,UserId,BillNO,AdmReasonNationCode,AdmReasonId,ExpString)
{
	try{
		//alert("医保住院结算单打印开始"+Handle+"^"+UserId+"^"+BillNO+"^"+AdmReasonNationCode+"^"+AdmReasonId+"^"+ExpString) 
		//return 0;
	 var ExpStrForNet=BuildInsuExpStrStd(ExpString,1)
	 InsuTypeCode=GetInsuTypeCode(AdmReasonId)
	var rtn="-1";
    if (InsuTypeCode=="") {return -1;} 		
	/* Zhan 20181213注释，改为取配置
    switch (InsuTypeCode){ 
	    case "ZZB" :
	    	var DHCINSUBLL = new ActiveXObject("DHCINSUBLL.INSU_HN_ZZB_TEST"); //Zhan 20160615 test 
	    	break;
	    case "YZB" :
	    	var DHCINSUBLL = new ActiveXObject("DHCINSUBLL.INSU_JS_YZA");     //扬中市居民医保
	    	break;
	    default :
	    	alert("此类型不联医保接口,请检查程序或数据;InsuTypeCode="+InsuTypeCode);
	    	return -1;
	    	break;
	    }
		*/
	if(GetInsuDLLOBJByCode(InsuTypeCode)==false){return rtn}	//Zhan 20181213增加配置并增加中间件功能
	if(INSU.PORT.GLOBAL.httpFlag==0){
		if(INSU.PORT.GLOBAL.iniServerIP){var ini=INSU.PORT.GLOBAL.DHCINSUBLL.Initialize(ServerNameSpace)} //Zhan 20170419,var ServerNameSpace = 'cn_iptcp:172.19.19.57[1972]:DHC-APP';
		rtn=INSU.PORT.GLOBAL.DHCINSUBLL.InsuIPJSDPrint(Handle,UserId,BillNO,AdmReasonNationCode,AdmReasonId,ExpStrForNet);
		DHCINSUBLL= null;
	}else{
		var getInStr="Handle="+Handle+"&UserId="+UserId+"&BillNO="+BillNO+"&AdmReasonNationCode="+AdmReasonNationCode+"&AdmReasonId="+AdmReasonId+"&ExpString="+toINSUSafeCode(ExpStrForNet);
		rtn=CallInsuComGet(INSU.PORT.GLOBAL.INSUblltype,"InsuIPJSDPrint",getInStr,"")
	}
	
	//润乾报表打印方式
	if (rtn.split("^")[0]=="0")
	{
	    var url=rtn.split("^")[1] ; //缺省例子 InsuIPJSDDefault.raq&BillDr=282055&InDivDr=&AdmDr=&ExpStr="
		DHCCPM_RQPrint(url,700,600);//DHCCPMRQCommon.js
	}
    return rtn;
	}catch(e){
		alert("调用医保接口发生异常"+e.message);
		return -1;
	}
    
}



///住院取消结算
//入参:
///   Handle：句柄默认0;UserId:SS_User.SSUSR_RowId;BillNO:DHC_PatientBill.Rowid;AdmReasonNationCode:Pac_AdmReason.REA_NationalCode
///   AdmReasonId:Pac_AdmReason.Rowid
///   ExpString: 医保类型^数据库连接串
///Return:成功:0,失败:-1
function InsuIPDivideCancle(Handle,UserId,BillNO,AdmReasonNationCode,AdmReasonId,ExpString)
{
	try {
		//alert("医保住院退费开始")
		//alert("医保住院退费开始"+Handle+"^"+UserId+"^"+BillNO+"^"+AdmReasonNationCode+"^"+AdmReasonId+"^"+ExpString)
	  	if(BillNO==""){alert("帐单号不能空!");return -1;}
		InsuTypeCode=GetInsuTypeCode(AdmReasonId)
	   var ExpStrForNet=BuildInsuExpStrStd(ExpString,1)
	 InsuTypeCode=GetInsuTypeCode(AdmReasonId)
	var flag="-1"
    if (InsuTypeCode=="") {return -1;} 		
	/* Zhan 20181213注释，改为取配置
    switch (InsuTypeCode){ 
	    case "ZZB" :
	    	var DHCINSUBLL = new ActiveXObject("DHCINSUBLL.INSU_HN_ZZB_TEST"); //Zhan 20160615 test 
	    	break;
	    case "YZB" :
	    	var DHCINSUBLL = new ActiveXObject("DHCINSUBLL.INSU_JS_YZA");     //扬中市居民医保
	    	break;
	    default :
	    	alert("此类型不联医保接口,请检查程序或数据;InsuTypeCode="+InsuTypeCode);
	    	return -1;
	    	break;
	    }
		*/
		if(GetInsuDLLOBJByCode(InsuTypeCode)==false){return flag}	//Zhan 20181213增加配置并增加中间件功能
		if(INSU.PORT.GLOBAL.httpFlag==0){
			if(INSU.PORT.GLOBAL.iniServerIP){var ini=INSU.PORT.GLOBAL.DHCINSUBLL.Initialize(ServerNameSpace)} //Zhan 20170419,var ServerNameSpace = 'cn_iptcp:172.19.19.57[1972]:DHC-APP';
			flag=INSU.PORT.GLOBAL.DHCINSUBLL.InsuIPDivideStrike(Handle,UserId,BillNO,AdmReasonNationCode,AdmReasonId,ExpStrForNet);
			DHCINSUBLL=null;
		}else{
			var getInStr="Handle="+Handle+"&UserId="+UserId+"&BillNO="+BillNO+"&AdmReasonNationCode="+AdmReasonNationCode+"&AdmReasonId="+AdmReasonId+"&ExpString="+toINSUSafeCode(ExpStrForNet);
			flag=CallInsuComGet(INSU.PORT.GLOBAL.INSUblltype,"InsuIPDivideStrike",getInStr,"")
		}
		if ((flag=="0")||(flag=="-2"))
		{
			//alert("医保住院退费成功"); 
			if("1"==GetIusujsMsgFlag("IPDIVIDECANCLE")){alert("医保取消结算成功,返回值:0")}	//Zhan 20161219 弹窗增加配置
			return 0;
		}
		else
		{
			if("1"==GetIusujsMsgFlag("IPDIVIDECANCLE")){alert("医保取消结算失败,返回值:-1")}	//Zhan 20161219 弹窗增加配置
			return -1;
		}
 	}
 	catch(e){
		alert("调用医保接口发生异常"+e.message);
		return -1;
	}
}

///医保病人门诊挂号
///入参 	Handle                    Interger?医保返回的句柄?目前大部分项目部用?不用的地方固定成?0〃
///			UserId                    用户表Rowid
///			PaadmRowid                Paadm表的Rowid
///         AdmReasonAdmSource	      Pac _admreason.rea_AdmSource
///         AdmReasonId               Pac _admreason.Rowid
///		    ExpString(:Type^Name^TotalAmount^HisDepCode^UserId^Doctor^InsuNo^CardType^YLLB^DiagCode^DiagDesc^GHLY^CacheConStr^GroupDr^AccId^AccAmt^GrzfPMDr^AdmDateTime^HisDepDesc!TarItemDr^Code^Desc^Amount!TarItemDr2^Code2^Desc2^Amount2!……	
///Return:成功:0,失败:-1 ?Rtn^InsuAdmInfoDr^InsuDivDr^PayModeDr!PayModeDr1^cash$c(2)PayModeDr2^fund$c(2)PayModeDr3^count                      
function InsuOPReg(Handle,UserId,PaadmRowid,AdmSource,AdmReasonId,ExpString)
{

	try{
	//alert("医保病人门诊挂号:"+Handle+"^"+UserId+"^"+PaadmRowid+"^"+AdmSource+"^"+AdmReasonId+"^"+ExpString)
	//InsuTypeCode=GetInsuTypeCode(AdmReasonId)
    //if (InsuTypeCode=="") {return -1;} 
    //InsuTypeCode="SZ"
	var InsuRegStr="-1";
     var ExpStrForNet=BuildInsuExpStrStd(ExpString,12)
	 InsuTypeCode=GetInsuTypeCode(AdmReasonId)
    if (InsuTypeCode=="") {return -1;} 		
	/* Zhan 20181213注释，改为取配置
    switch (InsuTypeCode){ 
	    case "ZZB" :
	    	var DHCINSUBLL = new ActiveXObject("DHCINSUBLL.INSU_HN_ZZB_TEST"); //Zhan 20160615 test 
	    	break;
	    case "YZB" :
	    	var DHCINSUBLL = new ActiveXObject("DHCINSUBLL.INSU_JS_YZA");     //扬中市居民医保
	    	break;
	    default :
	    	alert("此类型不联医保接口,请检查程序或数据;InsuTypeCode="+InsuTypeCode);
	    	return -1;
	    	break;
	    }
		*/

	if(GetInsuDLLOBJByCode(InsuTypeCode)==false){return InsuRegStr}	//Zhan 20181213增加配置并增加中间件功能
	if(INSU.PORT.GLOBAL.httpFlag==0){
		if(INSU.PORT.GLOBAL.iniServerIP){var ini=INSU.PORT.GLOBAL.DHCINSUBLL.Initialize(ServerNameSpace)} //Zhan 20170419,var ServerNameSpace = 'cn_iptcp:172.19.19.57[1972]:DHC-APP';
		InsuRegStr=INSU.PORT.GLOBAL.DHCINSUBLL.InsuOPReg(Handle,UserId,PaadmRowid,AdmSource,AdmReasonId,ExpStrForNet)  
		//alert("InsuRegStr="+InsuRegStr)
		DHCINSUBLL=null;
	}else{
		var getInStr="Handle="+Handle+"&UserId="+UserId+"&PaadmRowid="+PaadmRowid+"&AdmSource="+AdmSource+"&AdmReasonId="+AdmReasonId+"&ExpString="+toINSUSafeCode(ExpStrForNet);
		InsuRegStr=CallInsuComGet(INSU.PORT.GLOBAL.INSUblltype,"InsuOPReg",getInStr,"")
    }

	if ((InsuRegStr=="")||(InsuRegStr=="-1")||(InsuRegStr==undefined)) {
		if("1"==GetIusujsMsgFlag("OPREG")){alert("门诊挂号失败,返回值:-1")}	//Zhan 20161219 弹窗增加配置
		return "-1";
	}
	if("1"==GetIusujsMsgFlag("OPREG")){alert("门诊挂号成功,返回值:"+InsuRegStr)}	//Zhan 20161219 弹窗增加配置
	return InsuRegStr
	}
	catch(e){
		alert("调用医保接口发生异常"+e.message);
		return -1;
	}
	finally
	{}
}

///医保病人门诊退号
///入参?	Handle                    Interger?医保返回的句柄?目前大部分项目部用?不用的地方固定成?0〃
///			UserId                    用户表Rowid
///			AdmInfoRowid              Insu_AdmInfo表的Rowid
///         AdmReasonAdmSource   	  Pac _admreason.rea_AdmSource
///         AdmReasonId               Pac _admreason.Rowid
///         ExpString:                医保类型^数据库连接串
///Return:成功:0,失败:-1
function InsuOPRegStrike(Handle,UserId,AdmInfoRowid,AdmSource,AdmReasonId,ExpString)
{
	try{
	var ExpStrForNet=BuildInsuExpStrStd(ExpString,1)	
	InsuTypeCode=GetInsuTypeCode(AdmReasonId)
    if (InsuTypeCode=="") {return -1;} 
	var RetStr="-1"
	/* Zhan 20181213注释，改为取配置
    switch (InsuTypeCode){ 
	    case "ZZB" :
	    	var DHCINSUBLL = new ActiveXObject("DHCINSUBLL.INSU_HN_ZZB_TEST"); //Zhan 20160615 test 
	    	break;
	    case "YZB" :
	    	var DHCINSUBLL = new ActiveXObject("DHCINSUBLL.INSU_JS_YZA");     //扬中市居民医保
	    	break;
	    default :
	    	alert("此类型不联医保接口,请检查程序或数据;InsuTypeCode="+InsuTypeCode);
	    	return -1;
	    	break;
	    }
		*/
    //alert(Handle+"^"+AdmInfoRowid+"^"+UserId+"^"+AdmSource+"^"+AdmReasonId+"^"+ExpString)
	if(GetInsuDLLOBJByCode(InsuTypeCode)==false){return RetStr}	//Zhan 20181213增加配置并增加中间件功能
	if(INSU.PORT.GLOBAL.httpFlag==0){
		if(INSU.PORT.GLOBAL.iniServerIP){var ini=INSU.PORT.GLOBAL.DHCINSUBLL.Initialize(ServerNameSpace)} //Zhan 20170419,var ServerNameSpace = 'cn_iptcp:172.19.19.57[1972]:DHC-APP';
		RetStr=INSU.PORT.GLOBAL.DHCINSUBLL.InsuOPRegDestroy(Handle,UserId,AdmInfoRowid,AdmSource,AdmReasonId,ExpStrForNet)
		//var RetStr=INSU.PORT.GLOBAL.DHCINSUBLL.InsuOPRegDestroy(Handle,AdmInfoRowid,UserId,ExpString)
		//InsuOPRegDestroy(ByVal dHandle As Integer, ByVal INADMRowid As String, ByVal UserID As String, ByVal ExpStr As String) As Boolean
		//alert(DivideStr)
		DHCINSUBLL=null;
	}else{
		var getInStr="Handle="+Handle+"&UserId="+UserId+"&AdmInfoRowid="+AdmInfoRowid+"&AdmSource="+AdmSource+"&AdmReasonId="+AdmReasonId+"&ExpString="+toINSUSafeCode(ExpStrForNet);
		RetStr=CallInsuComGet(INSU.PORT.GLOBAL.INSUblltype,"InsuOPRegDestroy",getInStr,"")
    }

	if ((RetStr=="")||(RetStr=="-1")||(RetStr==undefined)) {
		if("1"==GetIusujsMsgFlag("OPREGSTRIKE")){alert("门诊退号失败,返回值:-1")}	//Zhan 20161219 弹窗增加配置
		return "-1";
	}
	if("1"==GetIusujsMsgFlag("OPREGSTRIKE")){alert("门诊退号成功,返回值:"+RetStr)}	//Zhan 20161219 弹窗增加配置
	return RetStr
	}catch(e){
		alert("调用医保接口发生异常"+e.message);
		return -1;
	}
}



///医保病人门诊收费
///入参?	Handle                  Interger?医保返回的句柄?目前大部分项目部用?不用的地方固定成?0〃
///			UserId                  用户表Rowid
///			StrInvDr                DHC_InvPrtDr表的Rowid的串   分割符为?^〃
///     AdmReasonAdmSource   		Pac_admreason.rea_AdmSource
///     AdmReasonId             	Pac_admreason.Rowid
///     ExpString                   StrikeFlag^安全组Dr^InsuNo^CardType^YLLB^DicCode^DicDesc^总金额^结算来源^数据库连接串^待遇类型^院内账户ID^院区指针^GrzfPMDr！Money^MoneyType
///											StrikeFlag：S代表退费重收的发票，如果是磁条卡需要传医保号,安全组Dr：操作员当前安全组,InsuNo：医保个人编号、医保卡号、医保号的加密串 供磁卡的地方用 
///											CardType：有无医保卡,YLLB：医疗类别（普通门诊、门诊特病、门诊工伤、门诊生育）,DicCode：病种代码,总金额：各种卡的余额合计
///										    DYLB：医保待遇类别（"131"门诊特殊病、"161"特殊检查、"162"特殊治疗）,Money:卡余额,MoneyType：卡类型 His就诊卡，银行卡。。。
///                                         GrzfPMDr: 门诊收费界面选择的支付方式Dr             
///		CPPFlag					    集中打印发票标志(Y:集中打印;NotCPPFlag:非预交金;ECPP:急诊留观)
///Return:成功:0,失败:-1
///注：给计费返回-3，计费不删除发票信息；返回-4，计费删除发票信息。
function InsuOPDivide(Handle , UserId, StrInvDr, AdmSource, AdmReasonId,ExpString,CPPFlag)
{
	try {
	OutStr="-3"
	Handle=0
	//alert("医保门诊收费开始")
	//alert("医保门诊收费开始:StrInvDr="+StrInvDr+"^UserId="+UserId+"^AdmSource="+AdmSource+"^AdmReasonId="+AdmReasonId+"^ExpString="+ExpString+"^CPPFlag="+CPPFlag)
	if (ExpString.split("!")[0].split("^").length<8) {
		alert("扩展参数串ExpString位数不够"+ExpString) 
		return OutStr
	}
	var DivideStr="-1";
	var ExpStrForNet=BuildInsuExpStrStd(ExpString,9)
	//alert("ExpStrForNet:"+ExpStrForNet)
	InsuTypeCode=GetInsuTypeCode(AdmReasonId)
    if (InsuTypeCode=="") {return OutStr;} 
    //alert(InsuTypeCode)
	/* Zhan 20181213注释，改为取配置
    switch (InsuTypeCode){ 
	    case "ZZB" :
	    	var DHCINSUBLL = new ActiveXObject("DHCINSUBLL.INSU_HN_ZZB_TEST"); //Zhan 20160615 test 
	    	break;
	    case "YZB" :
	    	var DHCINSUBLL = new ActiveXObject("DHCINSUBLL.INSU_JS_YZA");     //扬中市居民医保
	    	break;
	    default :
	    	alert("此类型不联医保接口,请检查程序或数据;InsuTypeCode="+InsuTypeCode);
	    	return -1;
	    	break;
	    }
		*/
	if(GetInsuDLLOBJByCode(InsuTypeCode)==false){return OutStr}	//Zhan 20181213增加配置并增加中间件功能
	if(INSU.PORT.GLOBAL.httpFlag==0){
		if(INSU.PORT.GLOBAL.iniServerIP){var ini=INSU.PORT.GLOBAL.DHCINSUBLL.Initialize(ServerNameSpace)} //Zhan 20170419,var ServerNameSpace = 'cn_iptcp:172.19.19.57[1972]:DHC-APP';
		//alert("医保调门诊医保接口开始:StrInvDr="+StrInvDr+"^UserId="+UserId+"^AdmSource="+AdmSource+"^AdmReasonId="+AdmReasonId+"^ExpString="+ExpString+"^CPPFlag="+CPPFlag)
		DivideStr=INSU.PORT.GLOBAL.DHCINSUBLL.InsuOPDivide(Handle,UserId,StrInvDr,AdmSource,AdmReasonId,ExpStrForNet,CPPFlag)

		//ExpString=ExpString+"2"
		//alert("ExpString="+ExpString)

		//alert(DivideStr)
		//var DivideStr="0^200^11.5^"+StrInvDr+String.fromCharCode(2)+"15^21.5"+String.fromCharCode(2)+"16^1000"+String.fromCharCode(2)+"17^0"+String.fromCharCode(2)+"18^500"
		DHCINSUBLL=null;
	}else{
		var getInStr="Handle="+Handle+"&UserId="+UserId+"&StrInvDr="+StrInvDr+"&AdmSource="+AdmSource+"&AdmReasonId="+AdmReasonId+"&ExpString="+toINSUSafeCode(ExpStrForNet)+"&CPPFlag="+CPPFlag;
		DivideStr=CallInsuComGet(INSU.PORT.GLOBAL.INSUblltype,"InsuOPDivide",getInStr,"")
		if(DivideStr==""){DivideStr="-3"}
    }
	if ((DivideStr=="")||(DivideStr=="-3")||(DivideStr==undefined)) {
		if(GetIusujsMsgFlag("OPDIVIDE")=="1"){alert("医保结算失败,返回值:"+OutStr)}	//Zhan 20161219 弹窗增加配置
		return OutStr;
	}
	if(GetIusujsMsgFlag("OPDIVIDE")=="1"){alert("医保结算成功,返回值:"+DivideStr)}	//Zhan 20161219 弹窗增加配置
	return DivideStr
	
	}catch(e){
		alert("调用医保接口发生异常"+e.message);
		return -4 ;		//计费-4调用删除
	}
}
///医保病人门诊结算单打印
///入参?	Handle                   	Interger?医保返回的句柄?目前大部分项目部用?不用的地方固定成?0〃
///			UserId                    	用户表Rowid
///			StrInvDr                  	DHC_INVPRT.Rowid或进程号或DHC_PE_INVPRT.Rowid
///         AdmReasonAdmSource   		Pac_admreason.rea_AdmSource
///         AdmReasonId             	Pac_admreason.Rowid
///         ExpString:                  医保类型^数据库连接串
///			CPPFlag						集中打印发票标志
///Return:成功:0,失败:-1
function InsuOPJSDPrint(Handle,UserId,StrInvDr,AdmSource,AdmReasonId,ExpString,CPPFlag)
{
	try {
	OutStr="-1"
	Handle=0
	//alert("医保门诊结算单打印开始:StrInvDr="+StrInvDr"^UserId="+UserId+"^AdmReasonId="+AdmReasonId+"^ExpString="+ExpString+"^CPPFlag="+CPPFlag)
    var ExpStrForNet=BuildInsuExpStrStd(ExpString,1)
	InsuTypeCode=GetInsuTypeCode(AdmReasonId)
    if (InsuTypeCode=="") {return -1;} 
	var DivideStr="-1";
	/* Zhan 20181213注释，改为取配置
    switch (InsuTypeCode){ 
	    case "ZZB" :
	    	var DHCINSUBLL = new ActiveXObject("DHCINSUBLL.INSU_HN_ZZB_TEST"); //Zhan 20160615 test 
	    	break;
	    case "YZB" :
	    	var DHCINSUBLL = new ActiveXObject("DHCINSUBLL.INSU_JS_YZA");     //扬中市居民医保
	    	break;
	    default :
	    	alert("此类型不联医保接口,请检查程序或数据;InsuTypeCode="+InsuTypeCode);
	    	return -1;
	    	break;
	    }
		*/
	if(GetInsuDLLOBJByCode(InsuTypeCode)==false){return DivideStr}	//Zhan 20181213增加配置并增加中间件功能
	if(INSU.PORT.GLOBAL.httpFlag==0){
		if(INSU.PORT.GLOBAL.iniServerIP){var ini=INSU.PORT.GLOBAL.DHCINSUBLL.Initialize(ServerNameSpace)} //Zhan 20170419,var ServerNameSpace = 'cn_iptcp:172.19.19.57[1972]:DHC-APP';
		DivideStr=INSU.PORT.GLOBAL.DHCINSUBLL.InsuOPJSDPrint(Handle,UserId,StrInvDr,AdmSource,AdmReasonId,ExpStrForNet,CPPFlag)
		DHCINSUBLL=null;
	}else{
		var getInStr="Handle="+Handle+"&UserId="+UserId+"&StrInvDr="+StrInvDr+"&AdmSource="+AdmSource+"&AdmReasonId="+AdmReasonId+"&ExpString="+toINSUSafeCode(ExpStrForNet)+"&CPPFlag="+CPPFlag;
		DivideStr=CallInsuComGet(INSU.PORT.GLOBAL.INSUblltype,"InsuOPJSDPrint",getInStr,"")
		if(DivideStr==""){DivideStr="-3"}
    }
	return DivideStr
	}catch(e){
		alert("调用医保接口发生异常"+e.message);
		return -1;
	}
}
///医保病人门诊退费
///入参?	Handle                   	Interger?医保返回的句柄?目前大部分项目部用?不用的地方固定成?0〃
///			UserId                    	用户表Rowid
///			DivRowid                  	Insu_Divide表的Rowid的
///         AdmReasonAdmSource   		Pac_admreason.rea_AdmSource
///         AdmReasonId             	Pac_admreason.Rowid
///         ExpString:                  医保类型^计费异常回滚标识(Y,)^医保组异常回滚标识(Y,)^读卡标识^结算来源^数据库连接串
///			CPPFlag						集中打印发票标志
///Return:成功:0,失败:-1
function InsuOPDivideStrike(Handle,UserId,DivRowid,AdmSource,AdmReasonId,ExpString,CPPFlag)
{
	try {
	OutStr="-1"
	Handle=0
	//alert("医保门诊撤销开始")
	//alert("医保门诊退费开始:DivRowid="+DivRowid+"^UserId="+UserId+"^AdmReasonId="+AdmReasonId+"^ExpString="+ExpString+"^CPPFlag="+CPPFlag)
    var ExpStrForNet=BuildInsuExpStrStd(ExpString,5)
	InsuTypeCode=GetInsuTypeCode(AdmReasonId)
    if (InsuTypeCode=="") {return -1;} 

	/* Zhan 20181213注释，改为取配置
    switch (InsuTypeCode){ 
	    case "ZZB" :
	    	var DHCINSUBLL = new ActiveXObject("DHCINSUBLL.INSU_HN_ZZB_TEST"); //Zhan 20160615 test 
	    	break;
	    case "YZB" :
	    	var DHCINSUBLL = new ActiveXObject("DHCINSUBLL.INSU_JS_YZA");     //扬中市居民医保
	    	break;
	    default :
	    	alert("此类型不联医保接口,请检查程序或数据;InsuTypeCode="+InsuTypeCode);
	    	return -1;
	    	break;
	    }
		*/
	if(GetInsuDLLOBJByCode(InsuTypeCode)==false){return OutStr}	//Zhan 20181213增加配置并增加中间件功能
	if(INSU.PORT.GLOBAL.httpFlag==0){
		if(INSU.PORT.GLOBAL.iniServerIP){var ini=INSU.PORT.GLOBAL.DHCINSUBLL.Initialize(ServerNameSpace)} //Zhan 20170419,var ServerNameSpace = 'cn_iptcp:172.19.19.57[1972]:DHC-APP';
		var DivideStr=INSU.PORT.GLOBAL.DHCINSUBLL.InsuOPDivideStrike(Handle,UserId,DivRowid,AdmSource,AdmReasonId,ExpStrForNet,CPPFlag)
		//var DivideStr=INSU.PORT.GLOBAL.DHCINSUBLL.InsuOPDivideStrike(Handle,DivRowid,UserId,ExpString)
		
		DHCINSUBLL=null;
	}else{
		var getInStr="Handle="+Handle+"&UserId="+UserId+"&DivRowid="+DivRowid+"&AdmSource="+AdmSource+"&AdmReasonId="+AdmReasonId+"&ExpString="+toINSUSafeCode(ExpStrForNet)+"&CPPFlag="+CPPFlag;
		DivideStr=CallInsuComGet(INSU.PORT.GLOBAL.INSUblltype,"InsuOPDivideStrike",getInStr,"")
		if(DivideStr==""){DivideStr="-1"}
    }
	if ((DivideStr=="")||(DivideStr=="-1")||(DivideStr==undefined)) {
		if(GetIusujsMsgFlag("OPDIVIDECANCLE")==""){alert("医保取消结算失败,返回值:"+OutStr)}	//Zhan 20161219 弹窗增加配置
		return OutStr;
	}
	if(GetIusujsMsgFlag("OPDIVIDECANCLE")==""){alert("医保取消结算成功,返回值:"+DivideStr)}	//Zhan 20161219 弹窗增加配置
	return DivideStr
	}catch(e){
		alert("调用医保接口发生异常"+e.message);
		return -1;
	}
}



///医保病人门诊体检收费
///入参?	Handle                   Interger?医保返回的句柄?目前大部分项目部用?不用的地方固定成?0〃
///			UserId                    用户表Rowid
///			StrInvDr                  DHC_PE_INVPRT表的RowID^RowID1^RowID2
///     AdmReasonAdmSource   		Pac_admreason.rea_AdmSource
///     AdmReasonId             	Pac_admreason.Rowid
///     ExpString(JS)               StrikeFlag^安全组Dr^InsuNo^CardType^YLLB^DicCode^DicDesc^总金额^结算来源^待遇类型！Money^MoneyType
///     ExpString                   StrikeFlag^安全组Dr^InsuNo^CardType^YLLB^DicCode^DicDesc^总金额^结算来源^数据库连接串^待遇类型^院内账户ID^院区指针^GrzfPMDr！Money^MoneyType
///											StrikeFlag：S代表退费重收的发票，如果是磁条卡需要传医保号,安全组Dr：操作员当前安全组,InsuNo：医保个人编号、医保卡号、医保号的加密串 供磁卡的地方用 
///											CardType：有无医保卡,YLLB：医疗类别（普通门诊、门诊特病、门诊工伤、门诊生育）,DicCode：病种代码,总金额：各种卡的余额合计
///										    DYLB：医保待遇类别（"131"门诊特殊病、"161"特殊检查、"162"特殊治疗）,Money:卡余额,MoneyType：卡类型 His就诊卡，银行卡。。。
///                                         GrzfPMDr: 门诊收费界面选择的支付方式Dr   
///			CPPFlag					集中打印发票标志
///Return:0：成功，-1：失败（可以直接出自费发票）-3：失败 （需要删除自费结算的数据）
function InsuPEDivide(Handle,UserId,StrInvDr,AdmSource, AdmReasonId,ExpString,CPPFlag)
{ 
	try {
	OutStr="-3"
	Handle=0
	//alert("医保门诊收费开始:StrInvDr="+StrInvDr+"^UserId="+UserId+"^AdmSource="+AdmSource+"^AdmReasonId="+AdmReasonId+"^ExpString="+ExpString+"^CPPFlag="+CPPFlag)
	if (ExpString.split("!")[0].split("^").length<7) {
		alert("扩展参数串ExpString位数不够"+ExpString) 
		return OutStr
	}
	var DivideStr="-1";
    var ExpStrForNet=BuildInsuExpStrStd(ExpString,9)
	InsuTypeCode=GetInsuTypeCode(AdmReasonId)
    if (InsuTypeCode=="") {return OutStr;} 
    //alert(InsuTypeCode)
	/* Zhan 20181213注释，改为取配置
    switch (InsuTypeCode){ 
	    case "ZZB" :
	    	var DHCINSUBLL = new ActiveXObject("DHCINSUBLL.INSU_HN_ZZB_TEST"); //Zhan 20160615 test 
	    	break;
	    case "YZB" :
	    	var DHCINSUBLL = new ActiveXObject("DHCINSUBLL.INSU_JS_YZA");     //扬中市居民医保
	    	break;
	    default :
	    	alert("此类型不联医保接口,请检查程序或数据;InsuTypeCode="+InsuTypeCode);
	    	return -1;
	    	break;
	    }
		*/
	if(GetInsuDLLOBJByCode(InsuTypeCode)==false){return OutStr}	//Zhan 20181213增加配置并增加中间件功能
	if(INSU.PORT.GLOBAL.httpFlag==0){
		if(INSU.PORT.GLOBAL.iniServerIP){var ini=INSU.PORT.GLOBAL.DHCINSUBLL.Initialize(ServerNameSpace)} //Zhan 20170419,var ServerNameSpace = 'cn_iptcp:172.19.19.57[1972]:DHC-APP';
		DivideStr=INSU.PORT.GLOBAL.DHCINSUBLL.InsuPEDivide(Handle,UserId,StrInvDr,AdmSource,AdmReasonId,ExpStrForNet,CPPFlag)

		DHCINSUBLL=null;
	}else{
		var getInStr="Handle="+Handle+"&UserId="+UserId+"&StrInvDr="+StrInvDr+"&AdmSource="+AdmSource+"&AdmReasonId="+AdmReasonId+"&ExpString="+toINSUSafeCode(ExpStrForNet)+"&CPPFlag="+CPPFlag;
		DivideStr=CallInsuComGet(INSU.PORT.GLOBAL.INSUblltype,"InsuPEDivide",getInStr,"")
		if(DivideStr==""){DivideStr="-3"}
    }
	if ((DivideStr=="")||(DivideStr=="-3")||(DivideStr==undefined)) {
		if(GetIusujsMsgFlag("PEDIVIDE")==""){alert("医保结算失败,返回值:"+OutStr)}	//Zhan 20161219 弹窗增加配置
		return OutStr;
	}
	if(GetIusujsMsgFlag("PEDIVIDE")==""){alert("医保结算成功,返回值:"+DivideStr)}	//Zhan 20161219 弹窗增加配置
	return DivideStr
	
	}catch(e){
		alert("调用医保接口发生异常"+e.message);
		return -4 ;		//计费-4调用删除
	}  
}

///医保病人体检退费
///入参?	Handle                   	Interger?医保返回的句柄?目前大部分项目部用?不用的地方固定成?0〃
///			UserId                    	用户表Rowid
///			DivRowid                  	Insu_Divide表的Rowid的
///         AdmReasonAdmSource   		Pac_admreason.rea_AdmSource
///         AdmReasonId             	Pac_admreason.Rowid
///         ExpString:                  医保类型^计费异常回滚标识(Y,)^医保组异常回滚标识(Y,)^读卡标识^结算来源^数据库连接串
///			CPPFlag						集中打印发票标志
///Return:成功:0,失败:-1
function InsuPEDivideStrike(Handle,UserId,DivRowid,AdmSource,AdmReasonId,ExpString,CPPFlag)
{
	try {
	OutStr="-1"
	Handle=0
	//alert("医保门诊退费开始:DivRowid="+DivRowid+"^UserId="+UserId+"^AdmReasonId="+AdmReasonId+"^ExpString="+ExpString+"^CPPFlag="+CPPFlag)
    var ExpStrForNet=BuildInsuExpStrStd(ExpString,5)
	InsuTypeCode=GetInsuTypeCode(AdmReasonId)
    if (InsuTypeCode=="") {return -1;} 
	var DivideStr="-1";
	/* Zhan 20181213注释，改为取配置
    switch (InsuTypeCode){ 
	    case "ZZB" :
	    	var DHCINSUBLL = new ActiveXObject("DHCINSUBLL.INSU_HN_ZZB_TEST"); //Zhan 20160615 test 
	    	break;
	    case "YZB" :
	    	var DHCINSUBLL = new ActiveXObject("DHCINSUBLL.INSU_JS_YZA");     //扬中市居民医保
	    	break;
	    default :
	    	alert("此类型不联医保接口,请检查程序或数据;InsuTypeCode="+InsuTypeCode);
	    	return -1;
	    	break;
	    }
		*/
	if(GetInsuDLLOBJByCode(InsuTypeCode)==false){return DivideStr}	//Zhan 20181213增加配置并增加中间件功能
	if(INSU.PORT.GLOBAL.httpFlag==0){
		if(INSU.PORT.GLOBAL.iniServerIP){var ini=INSU.PORT.GLOBAL.DHCINSUBLL.Initialize(ServerNameSpace)} //Zhan 20170419,var ServerNameSpace = 'cn_iptcp:172.19.19.57[1972]:DHC-APP';
		DivideStr=INSU.PORT.GLOBAL.DHCINSUBLL.InsuPEDivideStrike(Handle,UserId,DivRowid,AdmSource,AdmReasonId,ExpStrForNet,CPPFlag)
		//var DivideStr=INSU.PORT.GLOBAL.DHCINSUBLL.InsuOPDivideStrike(Handle,DivRowid,UserId,ExpString)
		
		DHCINSUBLL=null;
	}else{
		var getInStr="Handle="+Handle+"&UserId="+UserId+"&DivRowid="+DivRowid+"&AdmSource="+AdmSource+"&AdmReasonId="+AdmReasonId+"&ExpString="+toINSUSafeCode(ExpStrForNet)+"&CPPFlag="+CPPFlag;
		DivideStr=CallInsuComGet(INSU.PORT.GLOBAL.INSUblltype,"InsuPEDivideStrike",getInStr,"")
		if(DivideStr==""){DivideStr="-1"}
    }
	if ((DivideStr=="")||(DivideStr=="-1")||(DivideStr==undefined)) {
		if(GetIusujsMsgFlag("PEDivideStrike")==""){alert("医保体检取消结算失败,返回值:"+OutStr)}
		return OutStr;
	}
	if(GetIusujsMsgFlag("PEDivideStrike")==""){alert("医保体检取消结算成功,返回值:"+DivideStr)}
	return DivideStr
	}catch(e){
		alert("调用医保接口发生异常"+e.message);
		return -1;
	}
}


/// 医保目录下载
///入参 	Handle                   	Interger?医保返回的句柄?目前大部分项目部用?不用的地方固定成?0〃
///			UserId                    	用户表Rowid
///         ExpString:                  医保类型^数据库连接串
///出参:成功:0,失败:-1
function InsuTarItmDL(Handle,UserId,ExpString) 
{
	try {
	OutStr="-1"
	//alert("医保目录下载开始Handle="+Handle+"UserId="+UserId+"ExpString="+ExpString)
	InsuTypeCode=ExpString.split("^")[0]
	var ExpStrForNet=BuildInsuExpStrStd(ExpString,1)
    if (InsuTypeCode=="") 
    {
	    alert("扩展参数医保类型为空")
	    return -1;
	 } 
	var rtn="-1";
	/* Zhan 20181213注释，改为取配置
    switch (InsuTypeCode){ 
	    case "ZZB" :
	    	var DHCINSUBLL = new ActiveXObject("DHCINSUBLL.INSU_HN_ZZB_TEST"); //Zhan 20160615 test 
	    	break;
	    case "YZB" :
	    	var DHCINSUBLL = new ActiveXObject("DHCINSUBLL.INSU_JS_YZA");     //扬中市居民医保
	    	break;
	    default :
	    	alert("此类型不联医保接口,请检查程序或数据;InsuTypeCode="+InsuTypeCode);
	    	return -1;
	    	break;
	    }
		*/
	if(GetInsuDLLOBJByCode(InsuTypeCode)==false){return rtn}	//Zhan 20181213增加配置并增加中间件功能
	if(INSU.PORT.GLOBAL.httpFlag==0){
		if(INSU.PORT.GLOBAL.iniServerIP){var ini=INSU.PORT.GLOBAL.DHCINSUBLL.Initialize(ServerNameSpace)} //Zhan 20170419,var ServerNameSpace = 'cn_iptcp:172.19.19.57[1972]:DHC-APP';
		rtn=INSU.PORT.GLOBAL.DHCINSUBLL.InsuTarItmDL(Handle,UserId,ExpStrForNet)
		DHCINSUBLL=null;
	}else{
		var getInStr="Handle="+Handle+"&UserId="+UserId+"&ExpString="+toINSUSafeCode(ExpStrForNet);
		rtn=CallInsuComGet(INSU.PORT.GLOBAL.INSUblltype,"InsuTarItmDL",getInStr,"")
		if(rtn==""){rtn="-1"}
    }
	if ((rtn=="")||(rtn=="-1")||(rtn==undefined)) {return OutStr;}
	return rtn
	}catch(e){
		alert("调用医保接口发生异常"+e.message);
		return -1;
	}
	
}

/// 医保诊断下载
///入参 	Handle                   	Interger?医保返回的句柄?目前大部分项目部用?不用的地方固定成?0〃
///			UserId                    	用户表Rowid
///         ExpString:                 医保类型^数据库连接串
///出参:成功:0,失败:-1
function InsuDiagnosisDL(Handle,UserId,ExpString) 
{
	try {
	OutStr="-1"
	//alert("医保诊断下载开始Handle="+Handle+"UserId="+UserId+"ExpString="+ExpString)
	InsuTypeCode=ExpString.split("^")[0]
	var ExpStrForNet=BuildInsuExpStrStd(ExpString,1)
    if (InsuTypeCode=="") 
    {
	    alert("扩展参数医保类型为空")
	    return -1;
	 } 
	var rtn="-1";
	/* Zhan 20181213注释，改为取配置
    switch (InsuTypeCode){ 
	    case "ZZB" :
	    	var DHCINSUBLL = new ActiveXObject("DHCINSUBLL.INSU_HN_ZZB_TEST"); //Zhan 20160615 test 
	    	break;
	    case "YZB" :
	    	var DHCINSUBLL = new ActiveXObject("DHCINSUBLL.INSU_JS_YZA");     //扬中市居民医保
	    	break;
	    default :
	    	alert("此类型不联医保接口,请检查程序或数据;InsuTypeCode="+InsuTypeCode);
	    	return -1;
	    	break;
	    }
		*/
	if(GetInsuDLLOBJByCode(InsuTypeCode)==false){return rtn}	//Zhan 20181213增加配置并增加中间件功能
	if(INSU.PORT.GLOBAL.httpFlag==0){
		if(INSU.PORT.GLOBAL.iniServerIP){var ini=INSU.PORT.GLOBAL.DHCINSUBLL.Initialize(ServerNameSpace)} //Zhan 20170419,var ServerNameSpace = 'cn_iptcp:172.19.19.57[1972]:DHC-APP';
		rtn=INSU.PORT.GLOBAL.DHCINSUBLL.InsuDiagnosisDL(Handle,UserId,ExpStrForNet)
		DHCINSUBLL=null;
	}else{
		var getInStr="Handle="+Handle+"&UserId="+UserId+"&ExpString="+toINSUSafeCode(ExpStrForNet);
		rtn=CallInsuComGet(INSU.PORT.GLOBAL.INSUblltype,"InsuDiagnosisDL",getInStr,"")
		if(rtn==""){rtn="-1"}
    }
	if ((rtn=="")||(rtn=="-1")||(rtn==undefined)) {return OutStr;}
	return rtn
	}catch(e){
		alert("调用医保接口发生异常"+e.message);
		return -1;
	}
	
}

/// 医保字典下载
///入参 	Handle                   	Interger?医保返回的句柄?目前大部分项目部用?不用的地方固定成?0〃
///			UserId                    	用户表Rowid
///         ExpString:                  医保类型^数据库连接串
///出参:成功:0,失败:-1
function InsuBasDicDL(Handle,UserId,ExpString) 
{
	try {
	OutStr="-1"
	//alert("医保字典下载开始Handle="+Handle+"UserId="+UserId+"ExpString="+ExpString)
	InsuTypeCode=ExpString.split("^")[0]
	var ExpStrForNet=BuildInsuExpStrStd(ExpString,1)
    if (InsuTypeCode=="") 
    {
	    alert("扩展参数医保类型为空")
	    return -1;
	 } 
	 var rtn="-1";
	/* Zhan 20181213注释，改为取配置
    switch (InsuTypeCode){ 
	    case "ZZB" :
	    	var DHCINSUBLL = new ActiveXObject("DHCINSUBLL.INSU_HN_ZZB_TEST"); //Zhan 20160615 test 
	    	break;
	    case "YZB" :
	    	var DHCINSUBLL = new ActiveXObject("DHCINSUBLL.INSU_JS_YZA");     //扬中市居民医保
	    	break;
	    default :
	    	alert("此类型不联医保接口,请检查程序或数据;InsuTypeCode="+InsuTypeCode);
	    	return -1;
	    	break;
	    }
		*/
	if(GetInsuDLLOBJByCode(InsuTypeCode)==false){return rtn}	//Zhan 20181213增加配置并增加中间件功能
	if(INSU.PORT.GLOBAL.httpFlag==0){
		if(INSU.PORT.GLOBAL.iniServerIP){var ini=INSU.PORT.GLOBAL.DHCINSUBLL.Initialize(ServerNameSpace)} //Zhan 20170419,var ServerNameSpace = 'cn_iptcp:172.19.19.57[1972]:DHC-APP';
		rtn=INSU.PORT.GLOBAL.DHCINSUBLL.InsuBasDicDL(Handle,UserId,ExpStrForNet)
		DHCINSUBLL=null;
	}else{
		var getInStr="Handle="+Handle+"&UserId="+UserId+"&ExpString="+toINSUSafeCode(ExpStrForNet);
		rtn=CallInsuComGet(INSU.PORT.GLOBAL.INSUblltype,"InsuBasDicDL",getInStr,"")
		if(rtn==""){rtn="-1"}
    }
	if ((rtn=="")||(rtn=="-1")||(rtn==undefined)) {return OutStr;}
	return rtn
	}catch(e){
		alert("调用医保接口发生异常"+e.message);
		return -1;
	}
	
}
/// 医保目录对照关系下载
///入参 	Handle                   	Interger?医保返回的句柄?目前大部分项目部用?不用的地方固定成?0〃
///			UserId                    	用户表Rowid
///         ConDr                       INSU_TarContrast.Rowid(可为空)
///         ExpString:                  医保类型^数据库连接串
///出参:成功:0,失败:-1
function InsuTarConDL(Handle,UserId,ConDr,ExpString)
{
	try {
	OutStr="-1"
	//alert("医保对照关系下载开始Handle="+Handle+"UserId="+UserId+"ConDr="+ConDr+"ExpString="+ExpString)
	InsuTypeCode=ExpString.split("^")[0]
	var ExpStrForNet=BuildInsuExpStrStd(ExpString,1)
    if (InsuTypeCode=="") 
    {
	    alert("扩展参数医保类型为空")
	    return -1;
	 } 
	 var rtn="-1";
	/* Zhan 20181213注释，改为取配置
    switch (InsuTypeCode){ 
	    case "ZZB" :
	    	var DHCINSUBLL = new ActiveXObject("DHCINSUBLL.INSU_HN_ZZB_TEST"); //Zhan 20160615 test 
	    	break;
	    case "YZB" :
	    	var DHCINSUBLL = new ActiveXObject("DHCINSUBLL.INSU_JS_YZA");     //扬中市居民医保
	    	break;
	    default :
	    	alert("此类型不联医保接口,请检查程序或数据;InsuTypeCode="+InsuTypeCode);
	    	return -1;
	    	break;
	    }
		*/
	if(GetInsuDLLOBJByCode(InsuTypeCode)==false){return rtn}	//Zhan 20181213增加配置并增加中间件功能
	if(INSU.PORT.GLOBAL.httpFlag==0){
		if(INSU.PORT.GLOBAL.iniServerIP){var ini=INSU.PORT.GLOBAL.DHCINSUBLL.Initialize(ServerNameSpace)} //Zhan 20170419,var ServerNameSpace = 'cn_iptcp:172.19.19.57[1972]:DHC-APP';
		rtn=INSU.PORT.GLOBAL.DHCINSUBLL.InsuTarConDL(Handle,UserId,ConDr,ExpStrForNet)
		DHCINSUBLL=null;
	}else{
		var getInStr="Handle="+Handle+"&UserId="+UserId+"&ConDr="+ConDr+"&ExpString="+toINSUSafeCode(ExpStrForNet);
		rtn=CallInsuComGet(INSU.PORT.GLOBAL.INSUblltype,"InsuTarConDL",getInStr,"")
		if(rtn==""){rtn="-1"}
    }
	if ((rtn=="")||(rtn=="-1")||(rtn==undefined)) {return OutStr;}
	return rtn
	}catch(e){
		alert("调用医保接口发生异常"+e.message);
		return -1;
	}
	
}

/// 医保目录对照关系上传
///入参 	Handle                   	Interger?医保返回的句柄?目前大部分项目部用?不用的地方固定成?0〃
///			UserId                    	用户表Rowid
///         ConDr                       INSU_TarContrast.Rowid
///         ExpString:                  医保类型^数据库连接串
///出参:成功:0,失败:-1
function InsuTarConUL(Handle,UserId,ConDr,ExpString)
{
	try {
	OutStr="-1"
	//alert("医保目录对照关系上传开始Handle="+Handle+"UserId="+UserId+"ConDr="+ConDr+"ExpString="+ExpString)
	InsuTypeCode=ExpString.split("^")[0]
	var ExpStrForNet=BuildInsuExpStrStd(ExpString,1)
    if (InsuTypeCode=="") 
    {
	    alert("扩展参数医保类型为空")
	    return -1;
	 } 
	 var rtn="-1";
	/* Zhan 20181213注释，改为取配置
    switch (InsuTypeCode){ 
	    case "ZZB" :
	    	var DHCINSUBLL = new ActiveXObject("DHCINSUBLL.INSU_HN_ZZB_TEST"); //Zhan 20160615 test 
	    	break;
	    case "YZB" :
	    	var DHCINSUBLL = new ActiveXObject("DHCINSUBLL.INSU_JS_YZA");     //扬中市居民医保
	    	break;
	    default :
	    	alert("此类型不联医保接口,请检查程序或数据;InsuTypeCode="+InsuTypeCode);
	    	return -1;
	    	break;
	    }
		*/
	if(GetInsuDLLOBJByCode(InsuTypeCode)==false){return rtn}	//Zhan 20181213增加配置并增加中间件功能
	if(INSU.PORT.GLOBAL.httpFlag==0){
		if(INSU.PORT.GLOBAL.iniServerIP){var ini=INSU.PORT.GLOBAL.DHCINSUBLL.Initialize(ServerNameSpace)} //Zhan 20170419,var ServerNameSpace = 'cn_iptcp:172.19.19.57[1972]:DHC-APP';
		rtn=INSU.PORT.GLOBAL.DHCINSUBLL.InsuTarConUL(Handle,UserId,ConDr,ExpStrForNet)
		DHCINSUBLL=null;
	}else{
		var getInStr="Handle="+Handle+"&UserId="+UserId+"&ConDr="+ConDr+"&ExpString="+toINSUSafeCode(ExpStrForNet);
		rtn=CallInsuComGet(INSU.PORT.GLOBAL.INSUblltype,"InsuTarConUL",getInStr,"")
		if(rtn==""){rtn="-1"}
    }
	if ((rtn=="")||(rtn=="-1")||(rtn==undefined)) {return OutStr;}
	return rtn
	}catch(e){
		alert("调用医保接口发生异常"+e.message);
		return -1;
	}
	
}

/// 医保目录对照关系删除
///入参 	Handle                   	Interger?医保返回的句柄?目前大部分项目部用?不用的地方固定成?0〃
///			UserId                    	用户表Rowid
///         ConDr                       INSU_TarContrast.Rowid
///         ExpString:                  医保类型^数据库连接串
///出参:成功:0,失败:-1
function InsuTarConDelete(Handle,UserId,ConDr,ExpString)
{
	try {
	OutStr="-1"
	var rtn="-1";
	//alert("医保目录对照关系删除开始Handle="+Handle+"UserId="+UserId+"ConDr="+ConDr+"ExpString="+ExpString)
	InsuTypeCode=ExpString.split("^")[0]
	var ExpStrForNet=BuildInsuExpStrStd(ExpString,1)
    if (InsuTypeCode=="") 
    {
	    alert("扩展参数医保类型为空")
	    return -1;
	 } 
	/* Zhan 20181213注释，改为取配置
    switch (InsuTypeCode){ 
	    case "ZZB" :
	    	var DHCINSUBLL = new ActiveXObject("DHCINSUBLL.INSU_HN_ZZB_TEST"); //Zhan 20160615 test 
	    	break;
	    case "YZB" :
	    	var DHCINSUBLL = new ActiveXObject("DHCINSUBLL.INSU_JS_YZA");     //扬中市居民医保
	    	break;
	    default :
	    	alert("此类型不联医保接口,请检查程序或数据;InsuTypeCode="+InsuTypeCode);
	    	return -1;
	    	break;
	    }
		*/
	if(GetInsuDLLOBJByCode(InsuTypeCode)==false){return rtn}	//Zhan 20181213增加配置并增加中间件功能
	if(INSU.PORT.GLOBAL.httpFlag==0){
		if(INSU.PORT.GLOBAL.iniServerIP){var ini=INSU.PORT.GLOBAL.DHCINSUBLL.Initialize(ServerNameSpace)} //Zhan 20170419,var ServerNameSpace = 'cn_iptcp:172.19.19.57[1972]:DHC-APP';
		rtn=INSU.PORT.GLOBAL.DHCINSUBLL.InsuTarConDelete(Handle,UserId,ConDr,ExpStrForNet)
		DHCINSUBLL=null;
	}else{
		var getInStr="Handle="+Handle+"&UserId="+UserId+"&ConDr="+ConDr+"&ExpString="+toINSUSafeCode(ExpStrForNet);
		rtn=CallInsuComGet(INSU.PORT.GLOBAL.INSUblltype,"InsuTarConDelete",getInStr,"")
		if(rtn==""){rtn="-1"}
    }
	if ((rtn=="")||(rtn=="-1")||(rtn==undefined)) {return OutStr;}
	return rtn
	}catch(e){
		alert("调用医保接口发生异常"+e.message);
		return -1;
	}
	
}

/// 医保字典对照上传
///入参 	Handle                   	Interger?医保返回的句柄?目前大部分项目部用?不用的地方固定成?0〃
///			UserId                    	用户表Rowid
///         ExpString:                  医保类型^数据库连接串
///出参:成功:0,失败:-1
function InsuBasDicUL(Handle,UserId,ExpString)
{
	try {
	OutStr="-1"
	var rtn="-1";
	//alert("医保字典对照上传开始Handle="+Handle+"UserId="+UserId+"ExpString="+ExpString)
	InsuTypeCode=ExpString.split("^")[0]
	var ExpStrForNet=BuildInsuExpStrStd(ExpString,1)
    if (InsuTypeCode=="") 
    {
	    alert("扩展参数医保类型为空")
	    return -1;
	 } 
	/* Zhan 20181213注释，改为取配置
    switch (InsuTypeCode){ 
	    case "ZZB" :
	    	var DHCINSUBLL = new ActiveXObject("DHCINSUBLL.INSU_HN_ZZB_TEST"); //Zhan 20160615 test 
	    	break;
	    case "YZB" :
	    	var DHCINSUBLL = new ActiveXObject("DHCINSUBLL.INSU_JS_YZA");     //扬中市居民医保
	    	break;
	    default :
	    	alert("此类型不联医保接口,请检查程序或数据;InsuTypeCode="+InsuTypeCode);
	    	return -1;
	    	break;
	    }
		*/
	if(GetInsuDLLOBJByCode(InsuTypeCode)==false){return rtn}	//Zhan 20181213增加配置并增加中间件功能
	if(INSU.PORT.GLOBAL.httpFlag==0){
		if(INSU.PORT.GLOBAL.iniServerIP){var ini=INSU.PORT.GLOBAL.DHCINSUBLL.Initialize(ServerNameSpace)} //Zhan 20170419,var ServerNameSpace = 'cn_iptcp:172.19.19.57[1972]:DHC-APP';
		rtn=INSU.PORT.GLOBAL.DHCINSUBLL.InsuBasDicUL(Handle,UserId,ExpStrForNet)
		DHCINSUBLL=null;
	}else{
		var getInStr="Handle="+Handle+"&UserId="+UserId+"&ExpString="+toINSUSafeCode(ExpStrForNet);
		rtn=CallInsuComGet(INSU.PORT.GLOBAL.INSUblltype,"InsuBasDicUL",getInStr,"")
		if(rtn==""){rtn="-1"}
    }
	if ((rtn=="")||(rtn=="-1")||(rtn==undefined)) {return OutStr;}
	return rtn
	}catch(e){
		alert("调用医保接口发生异常"+e.message);
		return -1;
	}
	
}

/// 医护人员信息上传
///入参 	Handle                   	Interger?医保返回的句柄?目前大部分项目部用?不用的地方固定成?0〃
///			UserId                    	用户表Rowid
///         ExpString:                  医保类型^数据库连接串
///出参:成功:0,失败:-1
function InsuDicCTCareprovUL(Handle,UserId,ExpString)
{
	try {
	OutStr="-1"
	var rtn="-1";
	//alert("医保医护人员信息上传开始Handle="+Handle+"UserId="+UserId+"ExpString="+ExpString)
	InsuTypeCode=ExpString.split("^")[0]
	var ExpStrForNet=BuildInsuExpStrStd(ExpString,1)
    if (InsuTypeCode=="") 
    {
	    alert("扩展参数医保类型为空")
	    return -1;
	 } 
	/* Zhan 20181213注释，改为取配置
    switch (InsuTypeCode){ 
	    case "ZZB" :
	    	var DHCINSUBLL = new ActiveXObject("DHCINSUBLL.INSU_HN_ZZB_TEST"); //Zhan 20160615 test 
	    	break;
	    case "YZB" :
	    	var DHCINSUBLL = new ActiveXObject("DHCINSUBLL.INSU_JS_YZA");     //扬中市居民医保
	    	break;
	    default :
	    	alert("此类型不联医保接口,请检查程序或数据;InsuTypeCode="+InsuTypeCode);
	    	return -1;
	    	break;
	    }
		*/
	if(GetInsuDLLOBJByCode(InsuTypeCode)==false){return rtn}	//Zhan 20181213增加配置并增加中间件功能
	if(INSU.PORT.GLOBAL.httpFlag==0){
		if(INSU.PORT.GLOBAL.iniServerIP){var ini=INSU.PORT.GLOBAL.DHCINSUBLL.Initialize(ServerNameSpace)} //Zhan 20170419,var ServerNameSpace = 'cn_iptcp:172.19.19.57[1972]:DHC-APP';
		rtn=INSU.PORT.GLOBAL.DHCINSUBLL.InsuDicCTCareprovUL(Handle,UserId,ExpStrForNet)
		DHCINSUBLL=null;
	}else{
		var getInStr="Handle="+Handle+"&UserId="+UserId+"&ExpString="+toINSUSafeCode(ExpStrForNet);
		rtn=CallInsuComGet(INSU.PORT.GLOBAL.INSUblltype,"InsuDicCTCareprovUL",getInStr,"")
		if(rtn==""){rtn="-1"}
    }
	if ((rtn=="")||(rtn=="-1")||(rtn==undefined)) {return OutStr;}
	return rtn
	}catch(e){
		alert("调用医保接口发生异常"+e.message);
		return -1;
	}
	
}



/// 医护人员信息下载
///入参 	Handle                   	Interger?医保返回的句柄?目前大部分项目部用?不用的地方固定成?0〃
///			UserId                    	用户表Rowid
///         ExpString:                  医保类型^数据库连接串
///出参:成功:0,失败:-1
function InsuDicCTCareprovDL(Handle,UserId,ExpString)
{
	try {
	OutStr="-1"
	var rtn="-1";
	//alert("医保医护人员信息下载开始Handle="+Handle+"UserId="+UserId+"ExpString="+ExpString)
	InsuTypeCode=ExpString.split("^")[0]
	var ExpStrForNet=BuildInsuExpStrStd(ExpString,1)
    if (InsuTypeCode=="") 
    {
	    alert("扩展参数医保类型为空")
	    return -1;
	 } 
	/* Zhan 20181213注释，改为取配置
    switch (InsuTypeCode){ 
	    case "ZZB" :
	    	var DHCINSUBLL = new ActiveXObject("DHCINSUBLL.INSU_HN_ZZB_TEST"); //Zhan 20160615 test 
	    	break;
	    case "YZB" :
	    	var DHCINSUBLL = new ActiveXObject("DHCINSUBLL.INSU_JS_YZA");     //扬中市居民医保
	    	break;
	    default :
	    	alert("此类型不联医保接口,请检查程序或数据;InsuTypeCode="+InsuTypeCode);
	    	return -1;
	    	break;
	    }
		*/
	if(GetInsuDLLOBJByCode(InsuTypeCode)==false){return rtn}	//Zhan 20181213增加配置并增加中间件功能
	if(INSU.PORT.GLOBAL.httpFlag==0){
		if(INSU.PORT.GLOBAL.iniServerIP){var ini=INSU.PORT.GLOBAL.DHCINSUBLL.Initialize(ServerNameSpace)} //Zhan 20170419,var ServerNameSpace = 'cn_iptcp:172.19.19.57[1972]:DHC-APP';
		rtn=INSU.PORT.GLOBAL.DHCINSUBLL.InsuDicCTCareprovUL(Handle,UserId,ExpStrForNet)
		DHCINSUBLL=null;
	}else{
		var getInStr="Handle="+Handle+"&UserId="+UserId+"&ExpString="+toINSUSafeCode(ExpStrForNet);
		rtn=CallInsuComGet(INSU.PORT.GLOBAL.INSUblltype,"InsuDicCTCareprovDL",getInStr,"")
		if(rtn==""){rtn="-1"}
    }
	if ((rtn=="")||(rtn=="-1")||(rtn==undefined)) {return OutStr;}
	return rtn
	}catch(e){
		alert("调用医保接口发生异常"+e.message);
		return -1;
	}
	
}




/// 剂型信息上传
///入参 	Handle                   	Interger?医保返回的句柄?目前大部分项目部用?不用的地方固定成?0〃
///			UserId                    	用户表Rowid
///         ExpString:                  医保类型^数据库连接串
///出参:成功:0,失败:-1
function InsuDicJXUL(Handle,UserId,ExpString)
{
	try {
	OutStr="-1"
	var rtn="-1";
	//alert("医保剂型信息上传开始Handle="+Handle+"UserId="+UserId+"ExpString="+ExpString)
	InsuTypeCode=ExpString.split("^")[0]
	var ExpStrForNet=BuildInsuExpStrStd(ExpString,1)
    if (InsuTypeCode=="") 
    {
	    alert("扩展参数医保类型为空")
	    return -1;
	 } 
	/* Zhan 20181213注释，改为取配置
    switch (InsuTypeCode){ 
	    case "ZZB" :
	    	var DHCINSUBLL = new ActiveXObject("DHCINSUBLL.INSU_HN_ZZB_TEST"); //Zhan 20160615 test 
	    	break;
	    case "YZB" :
	    	var DHCINSUBLL = new ActiveXObject("DHCINSUBLL.INSU_JS_YZA");     //扬中市居民医保
	    	break;
	    default :
	    	alert("此类型不联医保接口,请检查程序或数据;InsuTypeCode="+InsuTypeCode);
	    	return -1;
	    	break;
	    }
		*/
	if(GetInsuDLLOBJByCode(InsuTypeCode)==false){return rtn}	//Zhan 20181213增加配置并增加中间件功能
	if(INSU.PORT.GLOBAL.httpFlag==0){
		if(INSU.PORT.GLOBAL.iniServerIP){var ini=INSU.PORT.GLOBAL.DHCINSUBLL.Initialize(ServerNameSpace)} //Zhan 20170419,var ServerNameSpace = 'cn_iptcp:172.19.19.57[1972]:DHC-APP';
		rtn=INSU.PORT.GLOBAL.DHCINSUBLL.InsuDicJXUL(Handle,UserId,ExpStrForNet)
		DHCINSUBLL=null;
	}else{
		var getInStr="Handle="+Handle+"&UserId="+UserId+"&ExpString="+toINSUSafeCode(ExpStrForNet);
		rtn=CallInsuComGet(INSU.PORT.GLOBAL.INSUblltype,"InsuDicJXUL",getInStr,"")
		if(rtn==""){rtn="-1"}
    }
	if ((rtn=="")||(rtn=="-1")||(rtn==undefined)) {return OutStr;}
	return rtn
	}catch(e){
		alert("调用医保接口发生异常"+e.message);
		return -1;
	}
	
}

/// 科室信息上传
///入参 	Handle                   	Interger?医保返回的句柄?目前大部分项目部用?不用的地方固定成?0〃
///			UserId                    	用户表Rowid
///         ExpString:                  医保类型^数据库连接串
///出参:成功:0,失败:-1
function InsuDicCTLocUL(Handle,UserId,ExpString)
{
	try {
	OutStr="-1"
	var rtn="-1";
	//alert("医保科室信息上传开始Handle="+Handle+"UserId="+UserId+"ExpString="+ExpString)
	InsuTypeCode=ExpString.split("^")[0]
	var ExpStrForNet=BuildInsuExpStrStd(ExpString,1)
    if (InsuTypeCode=="") 
    {
	    alert("扩展参数医保类型为空")
	    return -1;
	 } 
	/* Zhan 20181213注释，改为取配置
    switch (InsuTypeCode){ 
	    case "ZZB" :
	    	var DHCINSUBLL = new ActiveXObject("DHCINSUBLL.INSU_HN_ZZB_TEST"); //Zhan 20160615 test 
	    	break;
	    case "YZB" :
	    	var DHCINSUBLL = new ActiveXObject("DHCINSUBLL.INSU_JS_YZA");     //扬中市居民医保
	    	break;
	    default :
	    	alert("此类型不联医保接口,请检查程序或数据;InsuTypeCode="+InsuTypeCode);
	    	return -1;
	    	break;
	    }
		*/
	if(GetInsuDLLOBJByCode(InsuTypeCode)==false){return rtn}	//Zhan 20181213增加配置并增加中间件功能
	if(INSU.PORT.GLOBAL.httpFlag==0){
		if(INSU.PORT.GLOBAL.iniServerIP){var ini=INSU.PORT.GLOBAL.DHCINSUBLL.Initialize(ServerNameSpace)} //Zhan 20170419,var ServerNameSpace = 'cn_iptcp:172.19.19.57[1972]:DHC-APP';
		rtn=INSU.PORT.GLOBAL.DHCINSUBLL.InsuDicCTLocUL(Handle,UserId,ExpStrForNet)
		DHCINSUBLL=null;
	}else{
		var getInStr="Handle="+Handle+"&UserId="+UserId+"&ExpString="+toINSUSafeCode(ExpStrForNet);
		rtn=CallInsuComGet(INSU.PORT.GLOBAL.INSUblltype,"InsuDicCTLocUL",getInStr,"")
		if(rtn==""){rtn="-1"}
    }
	if ((rtn=="")||(rtn=="-1")||(rtn==undefined)) {return OutStr;}
	return rtn
	}catch(e){
		alert("调用医保接口发生异常"+e.message);
		return -1;
	}
	
}



/// 医保签到
///入参 	Handle                   	Interger?医保返回的句柄?目前大部分项目部用?不用的地方固定成?0〃
///			UserId                    	用户表Rowid
///         ExpString):                 医保类型^数据库连接串^部门性质(1:门诊，2：住院)
///出参:成功:0,失败:-1
function InsuASSignIn(Handle,UserId,ExpString)
{
	try {
	OutStr="-1"
	var rtn="-1";
	//alert("医保签到开始Handle="+Handle+"UserId="+UserId+"ExpString="+ExpString)
	InsuTypeCode=ExpString.split("^")[0]
	var ExpStrForNet=BuildInsuExpStrStd(ExpString,1)
    if (InsuTypeCode=="") 
    {
	    alert("扩展参数医保类型为空")
	    return -1;
	 } 
	/* Zhan 20181213注释，改为取配置
    switch (InsuTypeCode){ 
	    case "ZZB" :
	    	var DHCINSUBLL = new ActiveXObject("DHCINSUBLL.INSU_HN_ZZB_TEST"); //Zhan 20160615 test 
	    	break;
	    case "YZB" :
	    	var DHCINSUBLL = new ActiveXObject("DHCINSUBLL.INSU_JS_YZA");     //扬中市居民医保
	    	break;
	    default :
	    	alert("此类型不联医保接口,请检查程序或数据;InsuTypeCode="+InsuTypeCode);
	    	return -1;
	    	break;
	    }
		*/
	if(GetInsuDLLOBJByCode(InsuTypeCode)==false){return rtn}	//Zhan 20181213增加配置并增加中间件功能
	if(INSU.PORT.GLOBAL.httpFlag==0){
		if(INSU.PORT.GLOBAL.iniServerIP){var ini=INSU.PORT.GLOBAL.DHCINSUBLL.Initialize(ServerNameSpace)} //Zhan 20170419,var ServerNameSpace = 'cn_iptcp:172.19.19.57[1972]:DHC-APP';
		rtn=INSU.PORT.GLOBAL.DHCINSUBLL.InsuASSignIn(Handle,UserId,ExpStrForNet)
		DHCINSUBLL=null;
	}else{
		var getInStr="Handle="+Handle+"&UserId="+UserId+"&ExpString="+toINSUSafeCode(ExpStrForNet);
		rtn=CallInsuComGet(INSU.PORT.GLOBAL.INSUblltype,"InsuASSignIn",getInStr,"")
		if(rtn==""){rtn="-1"}
    }
	if ((rtn=="")||(rtn=="-1")||(rtn==undefined)) {return OutStr;}
	return rtn
	}catch(e){
		alert("调用医保接口发生异常"+e.message);
		return -1;
	}
	
}



// 医保签退
///入参 	Handle                   	Interger?医保返回的句柄?目前大部分项目部用?不用的地方固定成?0〃
///			UserId                    	用户表Rowid
///         ExpString:                  医保类型^数据库连接串^部门性质(1:门诊，2：住院)^业务周期号
///出参:成功:0,失败:-1
function InsuASSignOut(Handle,UserId,ExpString)
{
	try {
	OutStr="-1"
	var rtn="-1";
	//alert("医保签退开始Handle="+Handle+"UserId="+UserId+"ExpString="+ExpString)
	InsuTypeCode=ExpString.split("^")[0]
	var ExpStrForNet=BuildInsuExpStrStd(ExpString,1)
    if (InsuTypeCode=="") 
    {
	    alert("扩展参数医保类型为空")
	    return -1;
	 } 
	/* Zhan 20181213注释，改为取配置
    switch (InsuTypeCode){ 
	    case "ZZB" :
	    	var DHCINSUBLL = new ActiveXObject("DHCINSUBLL.INSU_HN_ZZB_TEST"); //Zhan 20160615 test 
	    	break;
	    case "YZB" :
	    	var DHCINSUBLL = new ActiveXObject("DHCINSUBLL.INSU_JS_YZA");     //扬中市居民医保
	    	break;
	    default :
	    	alert("此类型不联医保接口,请检查程序或数据;InsuTypeCode="+InsuTypeCode);
	    	return -1;
	    	break;
	    }
		*/
	if(GetInsuDLLOBJByCode(InsuTypeCode)==false){return rtn}	//Zhan 20181213增加配置并增加中间件功能
	if(INSU.PORT.GLOBAL.httpFlag==0){
		if(INSU.PORT.GLOBAL.iniServerIP){var ini=INSU.PORT.GLOBAL.DHCINSUBLL.Initialize(ServerNameSpace)} //Zhan 20170419,var ServerNameSpace = 'cn_iptcp:172.19.19.57[1972]:DHC-APP';
		rtn=INSU.PORT.GLOBAL.DHCINSUBLL.InsuASSignOut(Handle,UserId,ExpStrForNet)
		DHCINSUBLL=null;
	}else{
		var getInStr="Handle="+Handle+"&UserId="+UserId+"&ExpString="+toINSUSafeCode(ExpStrForNet);
		rtn=CallInsuComGet(INSU.PORT.GLOBAL.INSUblltype,"InsuASSignOut",getInStr,"")
		if(rtn==""){rtn="-1"}
    }
	if ((rtn=="")||(rtn=="-1")||(rtn==undefined)) {return OutStr;}
	return rtn
	}catch(e){
		alert("调用医保接口发生异常"+e.message);
		return -1;
	}
	
}


//住院，只取消医保结算
///Input:
///         Handle                      除合肥外固定为0
///         BillNo                      DHC_PatientBill.Rowid              
///         AdmReasonNationCode    		pa_admreason.rea_nationcode
///         AdmReasonId             	pa_admreason.Rowid
///         ExpString                   医保类型^结算单据流水号^发送方交易流水发送方交易流水号^数据库连接串
///Return:成功:0,失败:-1
function InsuIPDivideCancleForInsu(Handle,UserId,djlsh0,AdmReasonNationCode,AdmReasonId,ExpString)
{
	try {
		//alert("医保住院退费[只退医保]开始"+Handle+"^"+UserId+"^"+djlsh0+"^"+AdmReasonNationCode+"^"+AdmReasonId+"^"+ExpString)
	  	if(djlsh0==""){alert("单据流水号不能空!");return -1;}
	  	var ExpStrForNet=BuildInsuExpStrStd(ExpString,3)
		InsuTypeCode=GetInsuTypeCode(AdmReasonId)
	    if (InsuTypeCode=="") {return -1;} 
		var rtn="-1";
	   	//alert(InsuTypeCode)
	/* Zhan 20181213注释，改为取配置
    switch (InsuTypeCode){ 
	    case "ZZB" :
	    	var DHCINSUBLL = new ActiveXObject("DHCINSUBLL.INSU_HN_ZZB_TEST"); //Zhan 20160615 test 
	    	break;
	    case "YZB" :
	    	var DHCINSUBLL = new ActiveXObject("DHCINSUBLL.INSU_JS_YZA");     //扬中市居民医保
	    	break;
	    default :
	    	alert("此类型不联医保接口,请检查程序或数据;InsuTypeCode="+InsuTypeCode);
	    	return -1;
	    	break;
	    }
		*/
			if(GetInsuDLLOBJByCode(InsuTypeCode)==false){return rtn}	//Zhan 20181213增加配置并增加中间件功能
			if(INSU.PORT.GLOBAL.httpFlag==0){
				if(INSU.PORT.GLOBAL.iniServerIP){var ini=INSU.PORT.GLOBAL.DHCINSUBLL.Initialize(ServerNameSpace)} //Zhan 20170419,var ServerNameSpace = 'cn_iptcp:172.19.19.57[1972]:DHC-APP';
				var flag=INSU.PORT.GLOBAL.DHCINSUBLL.InsuIPDivideStrikeForInsu(Handle,UserId,djlsh0,AdmReasonNationCode,AdmReasonId,ExpStrForNet);
				DHCINSUBLL=null;
			}else{
				var getInStr="Handle="+Handle+"&UserId="+UserId+"&djlsh0="+djlsh0+"&AdmReasonNationCode="+AdmReasonNationCode+"&AdmReasonId="+AdmReasonId+"&ExpString="+toINSUSafeCode(ExpStrForNet);
				flag=CallInsuComGet(INSU.PORT.GLOBAL.INSUblltype,"InsuIPDivideStrikeForInsu",getInStr,"")
			}
	  		if ((flag=="0")||(flag=="-2"))
	  		{
		  		//alert("医保住院退费[只退医保]成功"); 
		  		if(GetIusujsMsgFlag("IPDIVIDECANCLE")=="1"){alert("医保住院退费[只退医保]成功,返回值:0")}	//Zhan 20161219 弹窗增加配置 
	    		return 0;
	  		}
	  		else
			{
				if(GetIusujsMsgFlag("IPDIVIDECANCLE")=="1"){alert("医保住院退费[只退医保]失败,返回值:-1")}	//Zhan 20161219 弹窗增加配置 
				return -1;
			}
 	}
 	catch(e){
		alert("调用医保接口发生异常"+e.message);
		return -1;
	}
}




///住院，只取消His结算
///Input:
///         Handle                      除合肥外固定为0 
///         BillNo                      DHC_PatientBill.Rowid              
///         AdmReasonNationCode    		pa_admreason.rea_nationcode
///         AdmReasonId             	pa_admreason.Rowid
///         ExpString                   医保类型^结算单据流水号^发送方交易流水发送方交易流水号^数据库连接串
///Return:成功:0,失败:-1
function InsuIPDivideCancleForHis(Handle,UserId,BillNo,AdmReasonNationCode,AdmReasonId,ExpString)
{
	try {
		var rtn="-1";
		var flag="-1";
		//alert("医保住院退费[只退HIS]开始"+Handle+"^"+UserId+"^"+djlsh0+"^"+AdmReasonNationCode+"^"+AdmReasonId+"^"+ExpString)
	  	if(BillNo==""){alert("账单号不能空!");return -1;}
	  	var ExpStrForNet=BuildInsuExpStrStd(ExpString,3)
		InsuTypeCode=GetInsuTypeCode(AdmReasonId)
	    if (InsuTypeCode=="") {return -1;} 
	   	//alert(InsuTypeCode)
	/* Zhan 20181213注释，改为取配置
    switch (InsuTypeCode){ 
	    case "ZZB" :
	    	var DHCINSUBLL = new ActiveXObject("DHCINSUBLL.INSU_HN_ZZB_TEST"); //Zhan 20160615 test 
	    	break;
	    case "YZB" :
	    	var DHCINSUBLL = new ActiveXObject("DHCINSUBLL.INSU_JS_YZA");     //扬中市居民医保
	    	break;
	    default :
	    	alert("此类型不联医保接口,请检查程序或数据;InsuTypeCode="+InsuTypeCode);
	    	return -1;
	    	break;
	    }
		*/
			if(GetInsuDLLOBJByCode(InsuTypeCode)==false){return flag}	//Zhan 20181213增加配置并增加中间件功能
			if(INSU.PORT.GLOBAL.httpFlag==0){
				if(INSU.PORT.GLOBAL.iniServerIP){var ini=INSU.PORT.GLOBAL.DHCINSUBLL.Initialize(ServerNameSpace)} //Zhan 20170419,var ServerNameSpace = 'cn_iptcp:172.19.19.57[1972]:DHC-APP';
				flag=INSU.PORT.GLOBAL.DHCINSUBLL.InsuIPDivideStrikeForHis(Handle,UserId,BillNo,AdmReasonNationCode,AdmReasonId,ExpStrForNet);
				DHCINSUBLL=null;
			}else{
				var getInStr="Handle="+Handle+"&UserId="+UserId+"&BillNo="+BillNo+"&AdmReasonNationCode="+AdmReasonNationCode+"&AdmReasonId="+AdmReasonId+"&ExpString="+toINSUSafeCode(ExpStrForNet);
				flag=CallInsuComGet(INSU.PORT.GLOBAL.INSUblltype,"InsuIPDivideStrikeForHis",getInStr,"")
			}
	  		if ((flag=="0")||(flag=="-2"))
	  		{
		  		//alert("医保住院退费[只退HIS]成功");
		  		if(GetIusujsMsgFlag("IPDIVIDECANCLE")=="1"){alert("医保住院退费[只退HIS]成功,返回值:0")}	//Zhan 20161219 弹窗增加配置 
	    		return 0;
	  		}
	  		else
			{
				if(GetIusujsMsgFlag("IPDIVIDECANCLE")=="1"){alert("医保住院退费[只退HIS]失败,返回值:-1")}	//Zhan 20161219 弹窗增加配置 
				return -1;
			}
 	}
 	catch(e){
		alert("调用医保接口发生异常"+e.message);
		return -1;
	}
}


//门诊，只取消医保结算
///Input:
///         Handle                      除合肥外固定为0
///         djlsh0                      结算单据流水号
///         AdmSource    		         pa_admreason.AdmSource
///         AdmReasonId             	pa_admreason.Rowid
///         ExpString                   医保类型^发送方交易流水号^数据库连接串
///         CPPFlag                     集中打印标识
///Return:成功:0,失败:-1
function InsuOPDivideCancleForInsu(Handle,UserId,djlsh0,AdmSource,AdmReasonId,ExpString,CPPFlag)
{
	try {
		//alert("医保住院退费[只退医保]开始"+Handle+"^"+UserId+"^"+djlsh0+"^"+AdmReasonNationCode+"^"+AdmReasonId+"^"+ExpString)
	  	if(djlsh0==""){alert("单据流水号不能空!");return -1;}
		var flag="-1";
	  	var ExpStrForNet=BuildInsuExpStrStd(ExpString,2)
		InsuTypeCode=GetInsuTypeCode(AdmReasonId)
	    if (InsuTypeCode=="") {return -1;} 
	   	//alert(InsuTypeCode)
	/* Zhan 20181213注释，改为取配置
    switch (InsuTypeCode){ 
	    case "ZZB" :
	    	var DHCINSUBLL = new ActiveXObject("DHCINSUBLL.INSU_HN_ZZB_TEST"); //Zhan 20160615 test 
	    	break;
	    case "YZB" :
	    	var DHCINSUBLL = new ActiveXObject("DHCINSUBLL.INSU_JS_YZA");     //扬中市居民医保
	    	break;
	    default :
	    	alert("此类型不联医保接口,请检查程序或数据;InsuTypeCode="+InsuTypeCode);
	    	return -1;
	    	break;
	    }
		*/
			if(GetInsuDLLOBJByCode(InsuTypeCode)==false){return flag}	//Zhan 20181213增加配置并增加中间件功能
			if(INSU.PORT.GLOBAL.httpFlag==0){
				if(INSU.PORT.GLOBAL.iniServerIP){var ini=INSU.PORT.GLOBAL.DHCINSUBLL.Initialize(ServerNameSpace)} //Zhan 20170419,var ServerNameSpace = 'cn_iptcp:172.19.19.57[1972]:DHC-APP';
				flag=INSU.PORT.GLOBAL.DHCINSUBLL.InsuOPDivideStrikeForInsu(Handle,UserId,djlsh0,AdmSource,AdmReasonId,ExpStrForNet,CPPFlag);
				DHCINSUBLL=null;
			}else{
				var getInStr="Handle="+Handle+"&UserId="+UserId+"&djlsh0="+djlsh0+"&AdmSource="+AdmSource+"&AdmReasonId="+AdmReasonId+"&ExpString="+toINSUSafeCode(ExpStrForNet)+"&CPPFlag="+CPPFlag;
				flag=CallInsuComGet(INSU.PORT.GLOBAL.INSUblltype,"InsuOPDivideStrikeForInsu",getInStr,"")
			}
	  		if ((flag=="0")||(flag=="-2"))
	  		{
		  		//alert("医保住院退费[只退医保]成功"); 
		  		if(GetIusujsMsgFlag("OPDIVIDECANCLE")==""){alert("医保退费[只退医保]成功,返回值:0")}	//Zhan 20161219 弹窗增加配置
	    		return 0;
	  		}
	  		else
			{
				if(GetIusujsMsgFlag("OPDIVIDECANCLE")==""){alert("医保退费[只退医保]失败,返回值:-1")}	//Zhan 20161219 弹窗增加配置
				return -1;
			}
 	}
 	catch(e){
		alert("调用医保接口发生异常"+e.message);
		return -1;
	}
}

///门诊，只取消His结算
///Input:
///         Handle                      除合肥外固定为0
///         DivRowid                    Insu_Divide.Rowid   
///         AdmSource    		        pa_admreason.rea_AdmSource
///         AdmReasonId             	pa_admreason.Rowid
///         ExpString                   医保类型^数据库连接串
///         CPPFlag                     集中打印标识
///Return:成功:0,失败:-1
function InsuOPDivideCancleForHis(Handle,UserId,DivRowid,AdmSource,AdmReasonId,ExpString,CPPFlag)
{
	try {
		//alert("医保住院退费[只退HIS]开始"+Handle+"^"+UserId+"^"+DivRowid+"^"+AdmSource+"^"+AdmReasonId+"^"+ExpString)
	  	if(DivRowid==""){alert("Insu_Divide.Rowid不能空!");return -1;}
	  	var ExpStrForNet=BuildInsuExpStrStd(ExpString,1)
		InsuTypeCode=GetInsuTypeCode(AdmReasonId)
		var flag="-1";
	    if (InsuTypeCode=="") {return -1;} 
	   	//alert(InsuTypeCode)
	/* Zhan 20181213注释，改为取配置
    switch (InsuTypeCode){ 
	    case "ZZB" :
	    	var DHCINSUBLL = new ActiveXObject("DHCINSUBLL.INSU_HN_ZZB_TEST"); //Zhan 20160615 test 
	    	break;
	    case "YZB" :
	    	var DHCINSUBLL = new ActiveXObject("DHCINSUBLL.INSU_JS_YZA");     //扬中市居民医保
	    	break;
	    default :
	    	alert("此类型不联医保接口,请检查程序或数据;InsuTypeCode="+InsuTypeCode);
	    	return -1;
	    	break;
	    }
		*/
			if(GetInsuDLLOBJByCode(InsuTypeCode)==false){return flag}	//Zhan 20181213增加配置并增加中间件功能
			if(INSU.PORT.GLOBAL.httpFlag==0){
				if(INSU.PORT.GLOBAL.iniServerIP){var ini=INSU.PORT.GLOBAL.DHCINSUBLL.Initialize(ServerNameSpace)} //Zhan 20170419,var ServerNameSpace = 'cn_iptcp:172.19.19.57[1972]:DHC-APP';
				flag=INSU.PORT.GLOBAL.DHCINSUBLL.InsuOPDivideStrikeForHis(Handle,UserId,DivRowid,AdmSource,AdmReasonId,ExpStrForNet,CPPFlag);
				DHCINSUBLL=null;
			}else{
				var getInStr="Handle="+Handle+"&UserId="+UserId+"&DivRowid="+DivRowid+"&AdmSource="+AdmSource+"&AdmReasonId="+AdmReasonId+"&ExpString="+toINSUSafeCode(ExpStrForNet)+"&CPPFlag="+CPPFlag;
				flag=CallInsuComGet(INSU.PORT.GLOBAL.INSUblltype,"InsuOPDivideStrikeForHis",getInStr,"")
			}
	  		if ((flag=="0")||(flag=="-2"))
	  		{
		  		//alert("医保住院退费[只退HIS]成功"); 
		  		if(GetIusujsMsgFlag("OPDIVIDECANCLE")==""){alert("医保退费[只退HIS]成功,返回值:0")}	//Zhan 20161219 弹窗增加配置
	    		return 0;
	  		}
	  		else
			{
				if(GetIusujsMsgFlag("OPDIVIDECANCLE")==""){alert("医保退费[只退HIS]失败,返回值:-1")}	//Zhan 20161219 弹窗增加配置
				return -1;
			}
 	}
 	catch(e){
		alert("调用医保接口发生异常"+e.message);
		return -1;
	}
}


///****************************公共函数*****************


///根据病人类型得到医保类型XZA,XZB等
function GetInsuTypeCode(AdmreaonDr)
	{
		return "CZZG"
	var VerStr="";
	VerStr=tkMakeServerCallHIS("web.INSUDicDataCom","QueryByCode","AdmReasonDrToDLLType",AdmreaonDr,INSU.PORT.GLOBAL.HospID);
	if ((VerStr=="0")||(VerStr=="")){
		alert(VerStr + "根据费别表rowid未取到医保类型。\n\n请核对病人费别是否改成自费了,或者检查AdmReasonDrToDLLType对照")
		return "";
	}
    InsuTypeCode=VerStr.split("^")[5]    //得到医保类型代码  XZA,XZB.XZC等 
	return InsuTypeCode
	} 
//获取数据加密串
function GetINSUdbEncrypt()
{
	var VerStr="";
	try{
		VerStr="3345^SYS^DBEncrypt^用户名和密码配置信息^GlobalEMR^dhwebservice^dhwebservice^^^N^^WEB^^^"; //tkMakeServerCallHIS("web.INSUDicDataCom","QueryByCode","SYS","DBEncrypt",INSU.PORT.GLOBAL.HospID);
		if ((VerStr=="0")||(VerStr=="")){
			alert(VerStr + "未取到数据库连接加密信息串,请在医保字典的系统中配置DBEncrypt")
			return "";
		}else{
			INSU.PORT.GLOBAL.dbEncrypt="|"+VerStr.split("^")[5]+"|"+VerStr.split("^")[6]+"|"+VerStr.split("^")[4]+"|"+VerStr.split("^")[11]+"|"+document.location.port+"|"+"HOSPID:"+INSU.PORT.GLOBAL.HospID+"|"+((window.location.href.indexOf("https")!==-1)?"HTTPS":"HTTP")
		}
	}catch(e){
		return false;
	}
	

	return INSU.PORT.GLOBAL.dbEncrypt
} 
//读取字典配置信息
function GetINSUDicInfo(qdicType,qdicCode,ind)
{
	var dicStr="";
	try{
		dicStr=tkMakeServerCallHIS("web.INSUDicDataCom","QueryByCode",qdicType,qdicCode,INSU.PORT.GLOBAL.HospID);
		if ((dicStr=="0")||(dicStr=="")){
			alert(dicStr + "未取到数据信息串,请在医保字典的系统中配置"+qdicCode)
			return "";
		}else{
			var tmpdicarr=dicStr.split("^")
			if(tmpdicarr.length>=ind){
				dicStr=tmpdicarr[ind]
			}
		}	
	
	}catch(e){}

	return dicStr
} 
// 功能描述:获取医保类型对应的医保DLL相关配置
// Zhan 20181213
// 入参:InsuTypeCode:医保类别代码如ZZB
// 返回:true或false
function GetInsuDLLOBJByCode(InsuTypeCode)
{
	try{
		var VerStr="";
		INSU.PORT.GLOBAL.httpFlag="";
		INSU.PORT.GLOBAL.INSUblltype="";
		var ModeDesc=""
		VerStr= "5639^DLLType^CZZG^城镇职工^医保描述说明: 0:默认用传统模式，1:用中间件模式，2:头菜单模式^DHCINSUBLL.INSU_TJ^1^^^^^^^^";//tkMakeServerCallHIS("web.INSUDicDataCom","QueryByCode","DLLType",InsuTypeCode,INSU.PORT.GLOBAL.HospID);
		if ((VerStr=="0")||(VerStr=="")){
			//alert(VerStr + "根据InsuTypeCode医保类型的DLL配置信息！请检查DLLType(医保接口DLL)配置")
			INSU.MSG.alertMsg("根据InsuTypeCode医保类型的DLL配置信息！请检查DLLType(医保接口DLL)配置","提示","info");
			return false;
		}
		if(VerStr.indexOf("DHCINSUBLL.")==-1){
			//alert(VerStr + InsuTypeCode+"的医保类型未配置DLL信息，请联系管理员处理")		
			INSU.MSG.alertMsg(VerStr + InsuTypeCode+"的医保类型未配置DLL信息，请联系管理员处理","提示","info");
			return false;
		}
		var VerStrArr=VerStr.split("^")
		INSU.PORT.GLOBAL.httpFlag=VerStrArr[6]
		//如果配置了中间件模式且是自动启动
		if((INSU.PORT.GLOBAL.httpFlag=="1")&&(INSU.PORT.GLOBAL.SerStatus!="1")){
			if(INSU.PORT.GLOBAL.AutoStartINSUService=="1"){
				//启动中间件
				//openINSUSers("")
				//INSU.MSG.alertMsg("正在启动医保中间件服务程序，稍后请重新操作！","提示","info");
			}else{
				//INSU.MSG.alertMsg("请启动医保中间件服务程序！","提示","info");
			}
			
		}

		if ((INSU.PORT.GLOBAL.SerStatus!="1")&&(INSU.PORT.GLOBAL.isWinXP)){
	      	INSU.PORT.GLOBAL.httpFlag="0"
		}
		//INSU.PORT.GLOBAL.httpFlag="0"
		//alert(INSU.PORT.GLOBAL.isWinXP+"-"+INSU.PORT.GLOBAL.httpFlag)
		switch (INSU.PORT.GLOBAL.httpFlag){ 
			/*
			case "2" :
				//头菜单或窗体调用模式，山东地纬的项目有用，以后准备用中间件实现
				ModeDesc="头菜单对象模式，DLL不重复加载"
				var parent=window.dialogArguments; 
				if (parent==undefined) { DHCINSUBLL=top.GetInsuObj(InsuTypeCode,session['LOGON.USERID'],"^"+ServerNameSpace);} //头菜单直接调用
				else {DHCINSUBLL=parent.top.GetInsuObj(InsuTypeCode,session['LOGON.USERID'],"^"+ServerNameSpace)} //非头菜单弹出窗体调用 
				break;
				*/
			case "1" :case "3" :case "2" :
				//中间件模式,1:http模式,加载DLL后释放模式,2:http模式,加载DLL后不释放模式,3:websocket模式,加载DLL后释放模式
				ModeDesc="中间件"
				INSU.PORT.GLOBAL.INSUblltype=VerStrArr[5].split(".")[1]
				break;
			default :
				ModeDesc="DLL";
				INSU.PORT.GLOBAL.DHCINSUBLL = new ActiveXObject(VerStrArr[5]);	//默认为ActiveXObject调用方式
		    	break;	
			}
			//alert(INSU.PORT.GLOBAL.httpFlag+"_"+INSU.PORT.GLOBAL.INSUblltype+"\n"+VerStr)
		return true
	}catch(e){
		alert("GetInsuDLLOBJByCode调用"+ModeDesc+"时发生异常："+e.message);
		return false;
	}
} 

  ///通过字符串自动填充对象 行分割符 "!"  列分割符 "^"
function FillTypeList(obj,InsuDicQuery,IPType){
	var i,n=1;
	var VerArr1=VerStr.split("!");
	var ArrTxt= new Array(VerArr1.length-2);
	var ArrValue = new Array(VerArr1.length-2);
	for(i=1;i<VerArr1.length;i++){
		var VerArr2=VerArr1[i].split("^");
		if (VerArr2[5]==IPType){   //区分门诊和住院
			ArrTxt[n-1]=VerArr2[3];
		    ArrValue[n-1]=VerArr2[2];	
			n++;
		 }	
		}
	 for(i=1;i<n;i++){ 
	    obj.options[i-1]=new Option(ArrTxt[i-1],ArrValue[i-1]);
		}
	}


function GetIusujsMsgFlag(dicCode)
{
	//调试时使用的
	/*var VerStr="";
	VerStr=tkMakeServerCallHIS("web.INSUDicDataCom","QueryByCode","INSUJSMSGFLAG",dicCode,INSU.PORT.GLOBAL.HospID);
	if ((VerStr=="0")||(VerStr=="")){
		return "";
	}
	return VerStr.split("^")[5]*/
    return "2"
} 

/*
//功能描述: 生成新ExpStr ExpStr中增加数据库连接串
//DingSH    20180419
// 入参 ExpStr 扩展串;Ind:第几位插入字符数据库连接串ServerNameSpace
// 出参:新ExpStr串
function BuildInsuExpStrStd(ExpStr,Ind)
{
	if (ExpStr==""){ExpStr="^"}
	var NewExpStr=ExpStr
	try
	{
		
	var TAry=ExpStr.split("^")
	var Len=TAry.length;
	var PreExpStr  = ""
	var LastExpStr  =""
	for (var i=0;i<Len;i++)
	{
		if (i<Ind)
		{
			if(PreExpStr==""){PreExpStr=TAry[i]}
			else{PreExpStr=PreExpStr+"^"+TAry[i]}
		}else{
			if(LastExpStr==""){LastExpStr=TAry[i]}
			else{LastExpStr=LastExpStr+"^"+TAry[i]}
			}
		 	
					
	}
	NewExpStr=PreExpStr+"^"+ServerNameSpace+"^"+LastExpStr
	}
	catch(e)
	{
		alert("拼ExpStr发生异常! \n错误内容:"+e.message);
		return NewExpStr
	}
	finally
	{
       return NewExpStr
	 } 
	
	
}
*/
//Zhan 20180620,重写上边BuildInsuExpStrStd函数
// 入参 ExpStr 扩展串;Ind:第几位插入字符数据库连接串ServerNameSpace
// 出参:新ExpStr串
function BuildInsuExpStrStd(ExpStr,Ind)
{
	var NewExpStr=ExpStr;
	ServerNameSpace = "cn_iptcp:10.80.7.10[1972]:DHC-APP";
	//ServerNameSpace = "";
	if (ExpStr==""){return ExpStr+"^"+ServerNameSpace+INSU.PORT.GLOBAL.dbEncrypt;}
	if("undefined"==typeof(Ind)){return NewExpStr ;}
	if(Ind<1){return NewExpStr;}
	try
	{
		var tmpArr=ExpStr.split("^")
		if((tmpArr.length-1)==Ind){NewExpStr=ExpStr+"^"+ServerNameSpace+INSU.PORT.GLOBAL.dbEncrypt; return NewExpStr;}
		var tmpNewArr=tmpArr.slice(0,Ind)
		var tmprightArr=tmpArr.slice(Ind+1)
		tmpNewArr.push(ServerNameSpace+INSU.PORT.GLOBAL.dbEncrypt)
		NewExpStr=tmpNewArr.concat(tmprightArr).join("^")
	}
	catch(e)
	{
		alert("拼ExpStr发生异常! \n错误内容:"+e.message);
	}
	finally
	{
       return NewExpStr
	} 
}

///把费用添加到计费组结算页面上
///Input:费用拼串
function INSUAdd(DivideStr,InsuTypeCode)
{
	//alert(DivideStr)
	//标志^总金额^统筹^大病^帐户^现金
	//0|0^1003^0^2028686^45
    //0^结算表Rowid^现金支付^发票rowid Chr(2)^10^账户Chr(2)^11^大病支付Chr(2)^8^卡支付Chr(2)
   //DivideStr="0^887^10806^19921410^011^08^390.8"
    //alert(DivideStr.split(String.fromCharCode(2)))
	if(DivideStr.slice(0,1)=="0")
	//if(DivideStr.split("|")[0]=="0")
	{
		var INSUFeeslength=DivideStr.split(String.fromCharCode(2)).length
		//alert(INSUFeeslength)
		var PayRowid,PayAmount
		for (i=1;i<=INSUFeeslength-1;i++)
		{   
			PayAmount=DivideStr.split(String.fromCharCode(2))[i].split("^")[1]
			PayRowid=DivideStr.split(String.fromCharCode(2))[i].split("^")[0]
		    amounttopayobj.value="";
		    paymodeobj.value="";
			//alert(PayRowid+"^"+PayAmount)	
		   if(eval(PayAmount)>0){
				switch (PayRowid)				//支付方式表rowid
				{		
					/*
					case "15":  
				       paymodeobj.value="医保账户支付" 	//和CT_PayMode表里的支付方式的描述一样
					   amounttopayobj.value=PayAmount
					   PayModeRowIDObj.value=PayRowid
					   Addtabrow();
					   break;
					   */
					case "6":			//支付方式表rowid
					   paymodeobj.value="统筹支付" 	//和CT_PayMode表里的支付方式的描述一样
					   amounttopayobj.value=PayAmount
					   PayModeRowIDObj.value=PayRowid
					   
					   InsuPayM="Y";  //add 2014-11-24  计费界面增加医保标识
					   Addtabrow();
					   break;
					 /*
					 case "17":
					   paymodeobj.value="大病救助支付" 	//和CT_PayMode表里的支付方式的描述一样
					   amounttopayobj.value=PayAmount
					   PayModeRowIDObj.value=PayRowid
					   InsuPayM="Y";  //add 2014-11-24  计费界面增加医保标识
					   Addtabrow();
					   break;
					case "18":
					   paymodeobj.value="公务员补助支付" 	//和CT_PayMode表里的支付方式的描述一样
					   amounttopayobj.value=PayAmount
					   PayModeRowIDObj.value=PayRowid
					   InsuPayM="Y";  //add 2014-11-24  计费界面增加医保标识
					   Addtabrow();
					   break;
					   */
				}		      	 
			}
		}
		//alert(depositsumobj.value)
		amounttopayobj.value=eval(eval(DivideStr.split("^")[2])-depositsumobj.value)   //医保返回的现金支付-预交金	
		amounttopayobj.value=eval(amounttopayobj.value).toFixed(2).toString(10)
		balanceobj.value=amounttopayobj.value;
		paymodeobj.value="现金";
		PayModeRowIDObj.value="1"   			//支付方式表rowid  现金
		//pay=balanceobj.value
		tmppay=amounttopayobj.value
		INSU.PORT.GLOBAL.AddDivideFlag=true;
		if (tmppay<0)
		{ 
			balanceobj.style.color="red";
		}	
		InsuPayM="N"   //add 2014-11-24  计费界面增加医保标识
	}
}
/*
自助机自动寻卡、读卡
ZhanMingchao 202010709
入参:
	Handle:句柄，默认为0，目前没用
	UserId:操作员,目前没用
	rCardType:读卡设备类型，0:自动读寻卡并读卡(任意一个先读到数据就返回),1:身份证,2:自动卡机,3:扫码,4:POS,5:获取热敏打印机状态
	Mode:读卡模式，是否立刻释放设备，目前没用
	Args:参数
	TimeOut:设备超时时间(毫秒)，1000为1秒
	ExpStr:扩展参数
*/
function InsuAutoReadCard(Handle,UserId,rCardType,Mode,Args,TimeOut,ExpStr)
{
 try{
	var getInStr="rCardType="+rCardType+"&Mode="+Mode+"&Args="+Args+"&TimeOut="+TimeOut+"&ExpStr="+toINSUSafeCode(ExpStr);
	rtn=CallInsuComLocalGet("DHCInterface.Interface","AutoReadCard",getInStr,"")
    return rtn;
  }catch(e){
	alert("调用医保接口发生异常"+e.message);
	return "-1"
  }finally{
	
  }     
    
}


///****************************不常用函数*****************
function ReadCardNew(InsuNo,Type)
{
	try{
		var dHandle=0;
		var RtnStr="";
		UserID=session['LOGON.USERID']
		//return "0|6003105182^603991952^120000650601001^张?^女^1971-01-01^31^0^888888^宝安洪浪南路??号有限公司^1^1^2^Z000^1175.02^200907^5^0^0^0^0^0^0^0^0^0^^^^^^^1^0^0^0^0^0^综合##2^@@"
		//医疗证号1^电脑号2^身份证号(可以取自数据库)3^姓名(可以取自数据库)4^性别?代码?性别??(可以取自数据库)5^出生时间(可以取自数据库)6^年龄(可以取自数据库)7^特殊人群?代码?8^单位编码9^单位名称10^就业状态?代码?就业状态??11^参保类型?代码?参保类型??12^经费来源?代码?经费来源??13^管理属地?代码?管理属地??14^帐户余额15^年月16^连续参保月数17^基本医疗保险共济基金支付最高限额?当前?18^基本医疗保险共济基金已用金额?本年度内?19^基本医疗保险共济基金可用余额?当前?20^地方补充医疗保险共济基金支付最高限额?当前?21^地方补充医疗保险共济基金已用金额?本年度内?22^地方补充医疗保险共济基金可用余额?当前?23^?帐户?不足自付限额?当前?24^?帐户?自付已用金额?本年度内?25^?帐户?自付可用余额?当前?26^监护人1电脑号*27^监护人2电脑号*28^监护人1身份证号*29^监护人2身份证号*30^监护人1姓名*31^监护人2姓名*32^医保参加情况?"0"未参加,"1"参加?33^统筹参加情况?"0"未参加,"1"参加?34^离休参加情况?"0"未参加,"1"参加?35^生育参加情况?"0"未参加,"1"参加?36^工伤参加情况?"0"未参加,"1"参加?37^少儿参加情况?"0"未参加,"1"参加?*38
	    
    	if(INSU.PORT.GLOBAL.httpFlag==0){
			insuDHCINSUBLL = new ActiveXObject("DHCINSUBLL.INSU_HN_ZZB_TEST");
			if(INSU.PORT.GLOBAL.iniServerIP){var ini=INSU.PORT.GLOBAL.DHCINSUBLL.Initialize(ServerNameSpace)} //Zhan 20170419,var ServerNameSpace = 'cn_iptcp:172.19.19.57[1972]:DHC-APP';
			RtnStr=insuDHCINSUBLL.InsuASReadCard(dHandle,UserID,InsuNo,Type);
			insuDHCINSUBLL=null
    	}else{
			var getInStr="Handle="+Handle+"&userid="+UserId+"&InsuNo="+InsuNo+"&Type="+Type;
			RtnStr=CallInsuComGet(INSU.PORT.GLOBAL.INSUblltype,"InsuASReadCard",getInStr,"")
	    }
	    return RtnStr
	}catch(e){
		alert("调用医保接口发生异常,请检查你的医保环境是否正常。\n错误内容:"+e.message);
		return ""
	}finally{

	} 
}


function InsuReport(Handle,Indata,UserId,ExpString){
	try{
 	//alert("读卡开始:InsuNo="+InsuNo+"^UserId="+UserId+"^ExpString="+ExpString)
 	//return "0|6003105182^603991952^120000650601001^张?^女^1971-01-01^31^0^888888^宝安洪浪南路??号有限公司^1^1^2^Z000^1175.02^200907^5^0^0^0^0^0^0^0^0^0^^^^^^^1^0^0^0^0^0^综合##2^@@"
	//InsuTypeCode=GetInsuTypeCode(AdmReasonId)
    //if (InsuTypeCode=="") {return -1;} 
	var rtn="-1";
    var ExpStrForNet=BuildInsuExpStrStd(ExpString,1)
        InsuTypeCode=ExpString.split("^")[0]
    
	/* Zhan 20181213注释，改为取配置
    switch (InsuTypeCode){ 
	    case "ZZB" :
	    	var DHCINSUBLL = new ActiveXObject("DHCINSUBLL.INSU_HN_ZZB_TEST"); //Zhan 20160615 test 
	    	break;
	    case "YZB" :
	    	var DHCINSUBLL = new ActiveXObject("DHCINSUBLL.INSU_JS_YZA");     //扬中市居民医保
	    	break;
	    default :
	    	alert("此类型不联医保接口,请检查程序或数据;InsuTypeCode="+InsuTypeCode);
	    	return -1;
	    	break;
	    }
		*/
		if(GetInsuDLLOBJByCode(InsuTypeCode)==false){return rtn}	//Zhan 20181213增加配置并增加中间件功能
    	if(INSU.PORT.GLOBAL.httpFlag==0){
	    	if(INSU.PORT.GLOBAL.iniServerIP){var ini=INSU.PORT.GLOBAL.DHCINSUBLL.Initialize(ServerNameSpace)}	//Zhan 20170419,var ServerNameSpace = 'cn_iptcp:172.19.19.57[1972]:DHC-APP';
			var rtn=INSU.PORT.GLOBAL.DHCINSUBLL.InsuApplyItems(Handle,Indata,UserId,ExpStrForNet)  
		    DHCINSUBLL= null;
    	}else{
			var getInStr="Handle="+Handle+"&Indata="+Indata+"&UserId="+UserId+"&ExpStrForNet="+toINSUSafeCode(ExpStrForNet);
			rtn=CallInsuComGet(INSU.PORT.GLOBAL.INSUblltype,"InsuApplyItems",getInStr,"");
	    }

		    return rtn;
 }catch(e){
	alert("调用医保接口发生异常"+e.message);
	return "-1"
}finally{
	
} 

}

//读二代身份证作废
//入参:病人类型    InsuTypeCode
//出参?
function ReadIDCard()
{  
 try{
	 var CardNo="";
	var rtn="-1";
	if(INSU.PORT.GLOBAL.httpFlag==0){
		 var DHCINSUBLL = new ActiveXObject("DHCINSUBLL.INSU_HN_ZZB"); 
		 if(INSU.PORT.GLOBAL.iniServerIP){var ini=INSU.PORT.GLOBAL.DHCINSUBLL.Initialize(ServerNameSpace)} //Zhan 20170419,var ServerNameSpace = 'cn_iptcp:172.19.19.57[1972]:DHC-APP';
		 rtn=INSU.PORT.GLOBAL.DHCINSUBLL.ReadIDCard(1,CardNo) 
		 DHCINSUBLL= null; 
	}else{
		var getInStr="Handle="+Handle+"&InsuNo="+InsuNo;
		rtn=CallInsuComGet(INSU.PORT.GLOBAL.INSUblltype,"ReadIDCard",getInStr,"")
	}
    return rtn;
 }catch(e){
	alert("调用医保接口发生异常"+e.message);
	return "-1"
}finally{
	
} 
 
}

//登记查询
//入参: ExpStr(医保卡号^登记类别^大病代码)
//出参?查询串(卡类别标志|卡号|姓名|帐户标志|登记类别|登记号|开始日期|结束日期|诊断编码|大病项目代码|登记医院标志|登记医院名称)
//说明 帐户标志(职退情况|保健对象|公务员|特殊待遇标识|封存标志|在职享受退休标志|适用医保办法标志|等待期标识|特殊标识)
function InsuIPRegQuery(UserDr,ExpStr,AdmReasonNationCode,AdmReasonId)
{
	var flag="-1"
	var rtn="-1"
	if (AdmReasonId=="") {AdmReasonNationCode="01"}//可能直接输入医保号来查,没有获得nationalcode
	/*
	switch (AdmReasonNationCode){
	    case "01":
	    	var DHCINSUBLL = new ActiveXObject("DHCINSUBLL.INSU_SH"); //实时结算
	    	break;
	    default:
	    	alert("此类型不联医保接口,请检查程序或数据;AdmReasonNationCode="+AdmReasonNationCode);
	    	return -1;
	    	break;
	    }
	*/
	InsuTypeCode=GetInsuTypeCode(AdmReasonId)
	if(GetInsuDLLOBJByCode(InsuTypeCode)==false){return flag}	//Zhan 20181213增加配置并增加中间件功能
	if(INSU.PORT.GLOBAL.httpFlag==0){
		if(INSU.PORT.GLOBAL.iniServerIP){var ini=INSU.PORT.GLOBAL.DHCINSUBLL.Initialize(ServerNameSpace)} //Zhan 20170419,var ServerNameSpace = 'cn_iptcp:172.19.19.57[1972]:DHC-APP';
		rtn=INSU.PORT.GLOBAL.DHCINSUBLL.InsuIPRegQuery(1,UserDr,ExpStr);
		DHCINSUBLL= null;
	}else{
		var getInStr="Handle="+Handle+"&UserId="+UserId+"&ExpString="+toINSUSafeCode(ExpStr);
		rtn=CallInsuComGet(INSU.PORT.GLOBAL.INSUblltype,"InsuIPRegQuery",getInStr,"")
	}
    return rtn;
}


//医保零结算 为了医保病人取消结算后医保中心变为出院结算状态 Lou 2010-02
function InsuIPDivideOut(Handle,UserId,BillNO,AdmReasonNationCode,AdmReasonId,ExpString)
{
	var DivideStr="-1";
	//alert("医保结算开始"+Handle+"^"+UserId+"^"+BillNO+"^"+AdmReasonNationCode+"^"+AdmReasonId+"^"+ExpString)
	if (AdmReasonNationCode!="01"){
		alert("实时结算病人才可以做零结算!");
		return -1;
		}
    var truthOut = window.confirm("确定进行医保零结算?");
    if (!truthOut) {return -1;}
	
	INSU.PORT.GLOBAL.AddDivideFlag=false;	//向计费组结算界面添加费用成功与否的标志
	if(BillNO==""){alert("帐单号不能空!");return;}
	InsuTypeCode=GetInsuTypeCode(AdmReasonId)
	if(GetInsuDLLOBJByCode(InsuTypeCode)==false){return flag}	//Zhan 20181213增加配置并增加中间件功能
	if(INSU.PORT.GLOBAL.httpFlag==0){
		var DHCINSUBLL = new ActiveXObject("DHCINSUBLL.INSU_SH");
		if(INSU.PORT.GLOBAL.iniServerIP){var ini=INSU.PORT.GLOBAL.DHCINSUBLL.Initialize(ServerNameSpace)} //Zhan 20170419,var ServerNameSpace = 'cn_iptcp:172.19.19.57[1972]:DHC-APP';
		DivideStr=INSU.PORT.GLOBAL.DHCINSUBLL.InsuIPDivideOut(Handle,BillNO,UserId,ExpString);
		DHCINSUBLL=null;  
	}else{
		var getInStr="Handle="+Handle+"&BillNO="+BillNO+"&UserId="+UserId+"&ExpString="+toINSUSafeCode(ExpString);
		DivideStr=CallInsuComGet(INSU.PORT.GLOBAL.INSUblltype,"InsuIPDivideOut",getInStr,"")
	}
	if(DivideStr=="0") //???什么情况返回-2,不用添加支付方式?
	{
		return 0;
	}
	else {return -1;}
	
}


///动态显示不同医保病人的医疗类别
///入参?HIS收费类型Rowid?Pac_Admreason的Rowid,IPType:OP/IP
///出参?失败或者直接填写下拉框?
///作者?耿昌金 2010-08-11
///说明?
function InsuTypeOnchangeLink(AdmreaonDr,IPType){
	var obj=document.getElementById("PatType");   ///设置填充的对象
	if(obj){
		ClearAllList(obj)       	  
		obj.size=1; 
		obj.multiple=false;
	   	///设置默认值
	   	if(IPType=="IP"){obj.options[0]=new Option("普通住院","");}
	   	else{obj.options[0]=new Option("普通门诊","");}
	   }
	InsuTypeCode=GetInsuTypeCode(AdmreaonDr)
	if (InsuTypeCode=="") return false;  
	
    var InsuDicQuery ="AKA130"+InsuTypeCode;
	var VerStr="";
	VerStr=tkMakeServerCallHIS("web.INSUDicDataCom","GetSys","","",InsuDicQuery,INSU.PORT.GLOBAL.HospID);
	if ((VerStr=="0")||(VerStr=="")){
		return false;
	   }
    FillTypeList(obj,VerStr,IPType)
}
function InsuNotice(Guser,NowDate){
	alert("无数据")
	return 0
}

//上传对照审批
function INSUUpLoadConAudit(InsuType) {
	try {
	OutStr="-1"
	Handle=0
	var rtn="-1";
	//alert("医保对照审批上报开始InsuType="+InsuType)
	//InsuTypeCode=GetInsuTypeCode(AdmReasonId)
    //if (InsuTypeCode=="") {return -1;} 
	/*
    switch (InsuType){ 
	     case "SZ" :
	    	var DHCINSUBLL = new ActiveXObject("DHCINSUBLL.INSU_GD_SZ"); //扬中市职工医保
	    	break;
	    case "SZA" :
	    	var DHCINSUBLL = new ActiveXObject("DHCINSUBLL.INSU_GD_SZA"); //扬中市居民医保
	    	break;		    	
	    default :
	    	alert("此类型不联医保接口,请检查程序或数据;AdmReasonId="+AdmReasonId);
	    	return -1;
	    	break;
	    }
	*/
	if(GetInsuDLLOBJByCode(InsuType)==false){return rtn}	//Zhan 20181213增加配置并增加中间件功能
	if(INSU.PORT.GLOBAL.httpFlag==0){
		if(INSU.PORT.GLOBAL.iniServerIP){var ini=INSU.PORT.GLOBAL.DHCINSUBLL.Initialize(ServerNameSpace)} //Zhan 20170419,var ServerNameSpace = 'cn_iptcp:172.19.19.57[1972]:DHC-APP';
		rtn=INSU.PORT.GLOBAL.DHCINSUBLL.InsuUpLoadConAudit()
		DHCINSUBLL=null;
	}else{
		var getInStr="";
		rtn=CallInsuComGet(INSU.PORT.GLOBAL.INSUblltype,"InsuUpLoadConAudit",getInStr,"")
    }
	if ((rtn=="")||(rtn=="-1")||(rtn==undefined)) {return OutStr;}
	return rtn
	}catch(e){
		alert("调用医保接口发生异常"+e.message);
		return -1;
	}
	
}

//下载对照审批
function INSUDownLoadConAudit(InsuType) {
	try {
	OutStr="-1"
	Handle=0
	var rtn="-1";
	//alert("医保对照审批下载开始InsuType="+InsuType)
	//InsuTypeCode=GetInsuTypeCode(AdmReasonId)
    //if (InsuTypeCode=="") {return -1;} 
	/*
    switch (InsuType){ 
	     case "SZ" :
	    	var DHCINSUBLL = new ActiveXObject("DHCINSUBLL.INSU_GD_SZ"); //扬中市职工医保
	    	break;
	    case "SZA" :
	    	var DHCINSUBLL = new ActiveXObject("DHCINSUBLL.INSU_GD_SZA"); //扬中市居民医保
	    	break;		    	
	    default :
	    	alert("此类型不联医保接口,请检查程序或数据;AdmReasonId="+AdmReasonId);
	    	return -1;
	    	break;
	    }
	*/
	if(GetInsuDLLOBJByCode(InsuType)==false){return rtn}	//Zhan 20181213增加配置并增加中间件功能
	if(INSU.PORT.GLOBAL.httpFlag==0){
		if(INSU.PORT.GLOBAL.iniServerIP){var ini=INSU.PORT.GLOBAL.DHCINSUBLL.Initialize(ServerNameSpace)} //Zhan 20170419,var ServerNameSpace = 'cn_iptcp:172.19.19.57[1972]:DHC-APP';
		rtn=INSU.PORT.GLOBAL.DHCINSUBLL.InsuDownLoadConAudit()
		DHCINSUBLL=null;
	}else{
		var getInStr="";
		rtn=CallInsuComGet(INSU.PORT.GLOBAL.INSUblltype,"InsuDownLoadConAudit",getInStr,"")
    }
	if ((rtn=="")||(rtn=="-1")||(rtn==undefined)) {return OutStr;}
	return rtn
	}catch(e){
		alert("调用医保接口发生异常"+e.message);
		return -1;
	}
	
//注释掉，否则与计费函数重名冲突
/*function getpath()
{
	var PaMasNO="VERSION"
  	encmeth="TMkA852NIjVG153Mv4vv1fKyu5yin0784Ded1TVYOkL0tNdqsfXN1yQDdnn78rmk"
 	var OutStr=cspRunServerMethod(encmeth,PaMasNO);
 	alert(OutStr)
	}
	*/
	
}

function InsuBasDL(InsuType,ExpString)
{
	try {	
		var rtn="-1";
		/*
	    switch (InsuType){ 
		    case "YZA" :
		    	var DHCINSUBLL = new ActiveXObject("DHCINSUBLL.INSU_JS_YZA"); //扬中市职工医保
		    	break;
		    case "YZB" :
		    	var DHCINSUBLL = new ActiveXObject("DHCINSUBLL.INSU_JS_YZB"); //扬中市居民医保
		    	break;    				    	
		    default :
		    	alert("此类型不联医保接口,请检查程序或数据;InsuType="+InsuType);
		    	return -1;
		    	break;
		    }
		*/
		if(GetInsuDLLOBJByCode(InsuType)==false){return rtn}	//Zhan 20181213增加配置并增加中间件功能
		if(INSU.PORT.GLOBAL.httpFlag==0){
			if(INSU.PORT.GLOBAL.iniServerIP){var ini=INSU.PORT.GLOBAL.DHCINSUBLL.Initialize(ServerNameSpace)} //Zhan 20170419,var ServerNameSpace = 'cn_iptcp:172.19.19.57[1972]:DHC-APP';
			rtn=INSU.PORT.GLOBAL.DHCINSUBLL.InsuBasDL(InsuType,"");
			DHCINSUBLL= null;
		}else{
			var getInStr="InsuType="+InsuType+"&ExpString="+toINSUSafeCode(ExpString);
			rtn=CallInsuComGet(INSU.PORT.GLOBAL.INSUblltype,"InsuBasDL",getInStr,"")
		}
	    return rtn;
	}catch(e){
		alert("调用医保接口发生异常"+e.message);
		return "-1"
	}finally{
	} 

}
//----------------医保中间件相关----------------

//获取中间件服务IP
function GetInsuSerIPAddress() {
    var obj = null;
	var rslt=""
    INSU.PORT.GLOBAL.INSUSerIP = "127.0.0.1";	//不用rcbdyctl.dll取本机IP了,如果是服务器模式就填服务器IP
	return INSU.PORT.GLOBAL.INSUSerIP
	/*
	if("undefined" != typeof ClientIPAddress){
		INSU.PORT.GLOBAL.INSUSerIP=ClientIPAddress	//ClientIPAddress是系统JS中的变量		
	}
	if(INSU.PORT.GLOBAL.INSUSerIP!=""){return INSU.PORT.GLOBAL.INSUSerIP};
    try {
        obj = new ActiveXObject("rcbdyctl.Setting");
        rslt = obj.GetIPAddress;
        if(rslt!=""){
	    	if(rslt.split(";").length>1){rslt=rslt.split(";")[0]}
	    }
        INSU.PORT.GLOBAL.INSUSerIP=rslt;
        obj = null;
    } catch(e) {
	    alert("获取客户端IP失败。\n错误内容:"+e.message);
        //异常发生
    }
	*/
    return rslt;
}

//启动医保中间件服务程序,支持IE8+,Chrome
//Zhan 20181123,配合20181123及以后版本的服务程序
function openINSUSers(strPath)
{
	try{
		if(INSU.PORT.GLOBAL.AutoStartINSUService!="1"){return;}
		if(INSU.PORT.GLOBAL.tmpCnt>0){			
			return;
		}
		if((INSU.PORT.GLOBAL.isIE)||(INSU.PORT.GLOBAL.chromeVersion>71)){
			if(document.getElementById('openINSUSers')) {
				document.body.removeChild(document.getElementById('openINSUSers'));
			}else{

			}
			var openINSUSers = document.body.appendChild(document.createElement('openINSUSers'));
			openINSUSers.innerHTML = '<a href="INSUshell://" id="openINSUSerlk">';
			INSU.PORT.GLOBAL.tmpCnt=INSU.PORT.GLOBAL.tmpCnt+1
			document.getElementById('openINSUSerlk').click();
			//alert("正在启动中间件服务,稍后可能需要重新办理……")
			return true;
		}else{
			INSU.PORT.GLOBAL.tmpCnt=INSU.PORT.GLOBAL.tmpCnt+1
			try{
				var aw=window.open("INSUshell://");
				//aw.opener = null;
				//aw.location.href ="INSUshell://";
				aw.close();
				//alert("正在启动中间件服务,稍后可能需要重新办理……")
				aw=null;
			}catch(ex){
			}		
			return true;
		}

		//var element= $('<a id="INSUshell" href="INSUshell://test">insushell</a>')
		//element.trigger("click");
		//document.getElementById("")
		//var wo=window.open("INSUshell://");
		//wo.close();		


	}catch(e)
	{
		alert('INSUShell:'+e.message);
		return false
	}
	return false;
	//下边的方法不推荐
	try{
		var wsa = new ActiveXObject("wscript.shell");    
		wsa.run(strPath); 
		wsa=null;
	}catch(e)
	{
		alert('发生错误:' + e.message+',启动'+strPath+'失败,请检查文件是否存在或是否有权限启动!' );
	}
}
//创建XMLHttp
function createInsuXMLHttpRequest() {  
	//var xmlHttp;
    if (window.XMLHttpRequest) {  
		try{
			INSUXMLHttp = new XMLHttpRequest();  
			if (INSUXMLHttp.overrideMimeType)  
				INSUXMLHttp.overrideMimeType('text/xml');  
		}catch(e){
		}
    } else if (window.ActiveXObject) {  
        try {  
            INSUXMLHttp = new ActiveXObject("Msxml2.XMLHTTP");  
        } catch (e) {  
            try {  
                INSUXMLHttp = new ActiveXObject("Microsoft.XMLHTTP");  
            } catch (e) {  
            }  
        }  
    }  
    return INSUXMLHttp;  
} 
// HTTP get 方法,Zhan 20170412
// blltype:医保类名，如：INSU_HN_ZZB
// funName:.NET中的函数名
// inUrl:函数的参数拼串
// ExpStr:扩展参数
function CallInsuComGet(blltype,funName,inUrl,ExpStr)
{
	INSU.PORT.GLOBAL.httpFlag=1
	var RtnINSUComStr="";
	try{
		if(INSU.PORT.GLOBAL.INSUSerIP==""){GetInsuSerIPAddress();}
        var childurl="";
        childurl=window.location.href.split("/web/")[0]
		var tmpArgs={ 
			test:Insubtoa(INSU.PORT.GLOBAL.httpFlag+":"+Date.now()+"/"+blltype+"/"+funName+"?"+inUrl),
			win:window 
		}			
		var tmpurlArgs=Insubtoa(INSU.PORT.GLOBAL.httpFlag+":"+Date.now()+"/"+blltype+"/"+funName+"?"+inUrl);
		var urlArgs=""
		if(INSU.PORT.GLOBAL.httpFlag==3){
			//websocket
	        if(INSU.PORT.GLOBAL.isSSL && INSU.PORT.GLOBAL.isIE){
		        urlArgs=childurl+"/web/INSUModalOpen.html?temps="+Math.random()+"&url="+childurl.replace(/https/, "http")+"/web/INSUModalLocal.html?tmpurlArgs="+tmpurlArgs; 
			}else{
				urlArgs=childurl+"/web/INSUModalchild.html?temps="+Math.random()+"&tmpurlArgs="+tmpurlArgs; 
			}
			RtnINSUComStr=InsuWebsocket(urlArgs,tmpArgs,"")
		}else{
			RtnINSUComStr=InsuHTTPGetA(tmpurlArgs,tmpArgs,"")
		}
		RtnINSUComStr = Insuatob(RtnINSUComStr);
	    return RtnINSUComStr
	}catch(e){
		alert("服务状态异常:"+e.message)	
	}finally{
	} 
}

function CallInsuComLocalGet(blltype,funName,inUrl,ExpStr)
{
	var RtnINSUComStr="";
	try{
		INSU.PORT.GLOBAL.httpFlag=2
		if(INSU.PORT.GLOBAL.httpFlag==""){INSU.PORT.GLOBAL.httpFlag=2}
		if(INSU.PORT.GLOBAL.INSUSerIP==""){GetInsuSerIPAddress();}
		var tmpurlArgs=Insubtoa(INSU.PORT.GLOBAL.httpFlag+":"+Date.now()+"/"+blltype+"/"+funName+"?"+inUrl);
		var urlArgs=""
		var tmpArgs;
		RtnINSUComStr=InsuHTTPGet123(tmpurlArgs,tmpArgs,"")
		//RestartINSUService();
	    return RtnINSUComStr
	}catch(e){
		alert("服务状态异常:"+e.message)	
	}finally{
		
	} 
}
//中间件调用封装
//urlArgs:实际的url参数，由各个调用函数决定
//tmpArgs:暂时不用 
// 读卡专用
function InsuHTTPGet123(urlArgs,tmpArgs,ExpStr)
{
	var RtnHTTPStr="";
	try{
		var tmpuserAgent = navigator.userAgent; //取得浏览器的userAgent字符串
		//var INSUURL="http://" + INSU.PORT.GLOBAL.INSUSerIP + ":888/"+urlArgs;
		var INSUURL=(INSU.PORT.GLOBAL.isSSL?"HTTPS://":"HTTP://")+ INSU.PORT.GLOBAL.INSUSerIP + ":"+INSU.PORT.GLOBAL.INSUSerPort+"/"+urlArgs;
		if(INSUXMLHttp==""||INSUXMLHttp==undefined) {createInsuXMLHttpRequest()};  
		createInsuXMLHttpRequest();
		var tmpFlag = false;
		if (typeof GLOBALFun != "undefined"){
			if(GLOBALFun){
				tmpFlag = true;
			}
			
		}
		INSUXMLHttp.open("GET", INSUURL, tmpFlag); 
		INSUXMLHttp.onreadystatechange =function() {
	        if (INSUXMLHttp.readyState == 4) {
				if (INSUXMLHttp.status == 200) {
					var tmpdata=INSUXMLHttp.responseText
					//RtnHTTPStr = tmpdata.replace(/[\r\n]$/g,"");
					//alert("tmpdata:"+tmpdata)
					tmpdata = Insuatob(tmpdata);
					if(tmpdata.split(String.fromCharCode(13)).length>0){
						RtnHTTPStr = tmpdata.split(String.fromCharCode(13))[0];
					}else{
						RtnHTTPStr = tmpdata;
					}
					if (typeof GLOBALFun != "undefined"){
						if (GLOBALFun){
							GetPersonInfo(RtnHTTPStr);
							//document.getElementById('testAreaRs').value=RtnHTTPStr;
						}		
					}
				}  
				if(((INSUXMLHttp.status==12029)||(INSUXMLHttp.status==0))&& tmpArgs!="12029"){
					GetPersonInfo(RtnHTTPStr);
					//alert("status:"+INSUXMLHttp.status)
					if(INSU.PORT.GLOBAL.tmpCnt>1){
						INSU.PORT.GLOBAL.SerStatus="0"
						//alert("启动医保服务程序失败1");
						return;
					}
					openINSUSers("")
					//if(INSU.PORT.GLOBAL.AutoStartINSUService=="1") alert("正在启动中间件服务,稍后可能需要重新办理……")
				}
				
	        }  
		}
		/*
		if (tmpuserAgent.indexOf("compatible") > -1 && tmpuserAgent.indexOf("MSIE") > -1 && tmpuserAgent.indexOf("Opera")==-1) { //判断是否IE浏览器
			INSUXMLHttp.setRequestHeader("If-Modified-Since", "0");
		}
		*/

		//
		INSUXMLHttp.setRequestHeader("Content-Type","application/x-www-form-urlencoded;charset=utf-8");  
		INSUXMLHttp.send();  
		INSU.PORT.GLOBAL.SerStatus="1"
	    return RtnHTTPStr
	}catch(e){
		return;
		if(INSU.PORT.GLOBAL.tmpCnt>1){
			INSU.PORT.GLOBAL.SerStatus="0"
			return;alert("启动医保服务程序失败2");
		}else{INSU.PORT.GLOBAL.tmpCnt=INSU.PORT.GLOBAL.tmpCnt+1}
		if(tmpArgs!="12029"){
			var tmpmsg=e.message.toUpperCase()
			if((tmpmsg.indexOf("NETWORK")!=-1)||(tmpmsg.indexOf("FAILED")!=-1)) {
				
				openINSUSers("")
				//alert("服务状态异常2:"+e.message+",正在启动服务,稍后可能需要重新办理……")
			}else{
				//alert("服务状态异常2:"+e.message)
				
				return RtnHTTPStr
			}
			return InsuHTTPGet(urlArgs,tmpArgs,ExpStr)
		}INSU.PORT.GLOBAL.SerStatus="0"
		return RtnHTTPStr;
	}finally{
	} 
}
//中间件调用封装
//urlArgs:实际的url参数，由各个调用函数决定
//tmpArgs:暂时不用
function InsuHTTPGetA(urlArgs,tmpArgs,ExpStr)
{
	var RtnHTTPStr="";
	try{
		var tmpuserAgent = navigator.userAgent; //取得浏览器的userAgent字符串
		//var INSUURL="http://" + INSU.PORT.GLOBAL.INSUSerIP + ":888/"+urlArgs;
		var INSUURL=(INSU.PORT.GLOBAL.isSSL?"HTTPS://":"HTTP://")+ INSU.PORT.GLOBAL.INSUSerIP + ":"+INSU.PORT.GLOBAL.INSUSerPort+"/"+urlArgs;
		if(INSUXMLHttp==""||INSUXMLHttp==undefined) {createInsuXMLHttpRequest()};  
		createInsuXMLHttpRequest();
		var tmpFlag = false;
		INSUXMLHttp.open("GET", INSUURL, tmpFlag); 
		INSUXMLHttp.onreadystatechange =function() {
	        if (INSUXMLHttp.readyState == 4) {
				if (INSUXMLHttp.status == 200) {
					var tmpdata=INSUXMLHttp.responseText
					//RtnHTTPStr = tmpdata.replace(/[\r\n]$/g,"");
					//alert("tmpdata:"+tmpdata)
					if(tmpdata.split(String.fromCharCode(13)).length>0){
						RtnHTTPStr = tmpdata.split(String.fromCharCode(13))[0];
					}else{
						RtnHTTPStr = tmpdata;
					}	
				}  
				if(((INSUXMLHttp.status==12029)||(INSUXMLHttp.status==0))&& tmpArgs!="12029"){
					//alert("status:"+INSUXMLHttp.status)	
					if(INSU.PORT.GLOBAL.tmpCnt>1){
						INSU.PORT.GLOBAL.SerStatus="0"
						//alert("启动医保服务程序失败1");
						return;
					}
					openINSUSers("")
					//if(INSU.PORT.GLOBAL.AutoStartINSUService=="1") alert("正在启动中间件服务,稍后可能需要重新办理……")
				}
				
	        }  
		}
		/*
		if (tmpuserAgent.indexOf("compatible") > -1 && tmpuserAgent.indexOf("MSIE") > -1 && tmpuserAgent.indexOf("Opera")==-1) { //判断是否IE浏览器
			INSUXMLHttp.setRequestHeader("If-Modified-Since", "0");
		}
		*/

		//
		INSUXMLHttp.setRequestHeader("Content-Type","application/x-www-form-urlencoded;charset=utf-8");  
		INSUXMLHttp.send();  
		INSU.PORT.GLOBAL.SerStatus="1"
	    return RtnHTTPStr
	}catch(e){
		return;
		if(INSU.PORT.GLOBAL.tmpCnt>1){
			INSU.PORT.GLOBAL.SerStatus="0"
			return;alert("启动医保服务程序失败2");
		}else{INSU.PORT.GLOBAL.tmpCnt=INSU.PORT.GLOBAL.tmpCnt+1}
		if(tmpArgs!="12029"){
			var tmpmsg=e.message.toUpperCase()
			if((tmpmsg.indexOf("NETWORK")!=-1)||(tmpmsg.indexOf("FAILED")!=-1)) {
				
				openINSUSers("")
				//alert("服务状态异常2:"+e.message+",正在启动服务,稍后可能需要重新办理……")
			}else{
				//alert("服务状态异常2:"+e.message)
				
				return RtnHTTPStr
			}
			return InsuHTTPGet(urlArgs,tmpArgs,ExpStr)
		}INSU.PORT.GLOBAL.SerStatus="0"
		return RtnHTTPStr;
	}finally{
	} 
}
//内部调用中间件的websocket
function InsuWebsocket(urlArgs,tmpArgs,ExpStr)
{
	//
	var RtnwebStr="";
	
	try{
		//if(INSU.PORT.GLOBAL.isIE)
		RtnwebStr=window.showInsuModalDialog(urlArgs,tmpArgs,"dialogWidth:300px;dialogHeight:200px;toolbar:no;location:no;directories:no;menubar:no"); 
		//
	    return RtnwebStr
	    //
	}catch(e){
		alert("Websocket服务状态异常:"+e.message)
		return RtnwebStr
		//
	}finally{
	} 
	
	
}
// 替换参数中的特殊字符
function toINSUSafeCode(inArg)
{
	try{
		/*
		inArg=inArg.replace(/\+/g, '%2B');
		inArg=inArg.replace(/\s/g, '%20');
		inArg=inArg.replace(/\//g, '%2F');
		inArg=inArg.replace(/\?/g, '%3F');
		inArg=inArg.replace(/\%/g, '%25');
		inArg=inArg.replace(/\#/g, '%23');
		inArg=inArg.replace(/\&/g, '%26');
		inArg=inArg.replace(/\=/g, '%3D');
		
	    return inArg
	    */
	    return Insubtoa(inArg)
	}catch(e){
		alert("替换参数中的特殊字符。\n错误内容:"+e.message);
		return inArg
	}finally{
	} 
}
//加密函数
function Insubtoa(INSUinArgs){
	try{
		//return window.btoa(unescape(encodeURIComponent(inArgs)))
		return window.btoa(encodeURIComponent(INSUinArgs))
	}catch(ex){
		return INSUinArgs
	}
}
//解密
function Insuatob(INSUinArgs){
	try{
		//return decodeURIComponent(escape(window.atob(inArgs)))
		return decodeURIComponent(window.atob(INSUinArgs))
	}catch(ex){
		return INSUinArgs
	}
}
//获取中间件的服务状态
function GetInsuStatus(cFlag)
{
	//urlArgs,tmpArgs,ExpStr
	var tmpArgs=""
	var ExpStr=""
	if(INSU.PORT.GLOBAL.INSUSerIP==""){GetInsuSerIPAddress();}
	var tmpurlArgs="/test/GetStatus?";		
	try{
		var tmpuserAgent = navigator.userAgent; //取得浏览器的userAgent字符串
		//var INSUURL="http://" + INSU.PORT.GLOBAL.INSUSerIP + ":888/"+tmpurlArgs;
		var INSUURL=(INSU.PORT.GLOBAL.isSSL?"HTTPS://":"HTTP://")+ INSU.PORT.GLOBAL.INSUSerIP + ":"+INSU.PORT.GLOBAL.INSUSerPort+"/"+tmpurlArgs;
		if(INSUXMLHttp==""||INSUXMLHttp==undefined) {createInsuXMLHttpRequest()};  
		var tmpFlag = false;
		if (GLOBALFun){
			tmpFlag = true
		}
		INSUXMLHttp.open("GET", INSUURL, tmpFlag); 
		INSUXMLHttp.onreadystatechange =function() {
	        if (INSUXMLHttp.readyState == 4) {
				if (INSUXMLHttp.status == 200) {
					var tmpdata=INSUXMLHttp.responseText
					if(tmpdata.split(String.fromCharCode(13)).length>0){
						INSU.PORT.GLOBAL.SerStatus = tmpdata.split(String.fromCharCode(13))[0];
					}else{
						INSU.PORT.GLOBAL.SerStatus = tmpdata;
					}
					
				}  
				if(((INSUXMLHttp.status==12029)||(INSUXMLHttp.status==0))&& tmpArgs!="12029"){
					//alert("status:"+INSUXMLHttp.status)
					if(INSU.PORT.GLOBAL.tmpCnt>1){return;}
					if(cFlag) openINSUSers("")
					//alert("正在启动中间件服务,稍后可能需要重新办理……")
				}
				
	        }  
		}
		INSUXMLHttp.setRequestHeader("Content-Type","application/x-www-form-urlencoded;charset=utf-8");  
		INSUXMLHttp.send(); 
		/* 
		$.get(INSUURL,function(tmpdata){
			if(tmpdata.split(String.fromCharCode(13)).length>0){
				INSU.PORT.GLOBAL.SerStatus = tmpdata.split(String.fromCharCode(13))[0];
			}else{
				INSU.PORT.GLOBAL.SerStatus = tmpdata;
			}
		});
		*/
		
	    return INSU.PORT.GLOBAL.SerStatus
	}catch(e){
		return;
		if(INSU.PORT.GLOBAL.tmpCnt>1){return;}
		if(tmpArgs!="12029"){
			var tmpmsg=e.message.toUpperCase()
			if((tmpmsg.indexOf("NETWORK")!=-1)||(tmpmsg.indexOf("FAILED")!=-1)) {
				if(cFlag) openINSUSers("")
				//alert("服务状态异常2:"+e.message+",正在启动服务,稍后可能需要重新办理……")
			}else{
				//alert("服务状态异常2:"+e.message)
				return INSU.PORT.GLOBAL.SerStatus
			}
			return GetInsuStatus(0)
		}
		return INSU.PORT.GLOBAL.SerStatus;
	}finally{
	} 
}
//重启中间件服务
function RestartINSUService()
{
	//urlArgs,tmpArgs,ExpStr
	var tmpArgs=""
	var ExpStr=""
	var RtnCode="-1"
	if(INSU.PORT.GLOBAL.INSUSerIP==""){GetInsuSerIPAddress();}
	var tmpurlArgs="/test/RestartService?";		
	try{
		var tmpuserAgent = navigator.userAgent; //取得浏览器的userAgent字符串
		var INSUURL=(INSU.PORT.GLOBAL.isSSL?"HTTPS://":"HTTP://") + INSU.PORT.GLOBAL.INSUSerIP + ":"+INSU.PORT.GLOBAL.INSUSerPort+"/"+tmpurlArgs;
		if(INSUXMLHttp=="") {createInsuXMLHttpRequest()}; 
		var tmpFlag = false;
		if (GLOBALFun){
			tmpFlag = true
		} 
		INSUXMLHttp.open("GET", INSUURL, tmpFlag); 
		INSUXMLHttp.onreadystatechange =function() {
	        if (INSUXMLHttp.readyState == 4) {
				if (INSUXMLHttp.status == 200) {
					var tmpdata=INSUXMLHttp.responseText
					if(tmpdata.split(String.fromCharCode(13)).length>0){
						RtnCode = tmpdata.split(String.fromCharCode(13))[0];
					}else{
						RtnCode = tmpdata;
					}
					
				}  
	        }  
		}
		INSUXMLHttp.setRequestHeader("Content-Type","application/x-www-form-urlencoded;charset=utf-8");  
		INSUXMLHttp.send(); 
	    return RtnCode
	}catch(e){
		return RtnCode;
	}finally{
	} 
}
//下边代码不影响其它产品组,不用动
(function() {
	//setTimeout("GetINSUdbEncrypt()",600);
	GetINSUdbEncrypt();
	//INSU.PORT.GLOBAL.AutoStartINSUService=GetINSUDicInfo("SYS","AutoStartINSUService",5)
	INSU.PORT.GLOBAL.AutoStartINSUService=1
	var sUserAgent = navigator.userAgent;
	try{
		if ("ActiveXObject" in window){
			INSU.PORT.GLOBAL.isIE=true;
		}
		
		try{
			// 获取谷歌浏览器版本,72以上版本
		    var arr = sUserAgent.split(' '); 
		    var tmpchromeVersion = '';
		    for(var i=0;i < arr.length;i++){
		        if(/chrome/i.test(arr[i]))
		        tmpchromeVersion = arr[i]
		    }
		    if(tmpchromeVersion){INSU.PORT.GLOBAL.chromeVersion=Number(tmpchromeVersion.split('/')[1].split('.')[0]);}

		}catch(ees){
		}
		
		if((window.location.href.indexOf("https")!==-1) && (INSU.PORT.GLOBAL.chromeVersion<72)){
		   INSU.PORT.GLOBAL.isSSL=true;
		   INSU.PORT.GLOBAL.INSUSerPort="2443"
		}else{
		   INSU.PORT.GLOBAL.isSSL=false;
		   INSU.PORT.GLOBAL.INSUSerPort="888"
		}
		INSU.PORT.GLOBAL.SysIp=document.location.hostname;
	}catch(ee){
	}
	GetInsuSerIPAddress();	
	
	try{
		var newscript = document.createElement('script');
		newscript.setAttribute('type','text/javascript');
		if(INSU.PORT.GLOBAL.isSSL){
			newscript.setAttribute('src',"HTTPS://"+INSU.PORT.GLOBAL.INSUSerIP+":"+INSU.PORT.GLOBAL.INSUSerPort+"/insulocalservice.js");
			var insuhead = document.getElementsByTagName('head')[0];
			insuhead.appendChild(newscript);
		}else{
			newscript.setAttribute('src',"HTTP://"+INSU.PORT.GLOBAL.INSUSerIP+":"+INSU.PORT.GLOBAL.INSUSerPort+"/insulocalservice.js");
			var insuhead = document.getElementsByTagName('head')[0];
			insuhead.appendChild(newscript);
		}
		

	}catch(e){
		//alert("newscript发生异常"+e.message);
		return "-1"
	}finally{

	}   
	
	
	INSU.PORT.GLOBAL.isWinXP = sUserAgent.indexOf("Windows NT 5.1") > -1 || sUserAgent.indexOf("Windows XP") > -1;
  	if (INSU.PORT.GLOBAL.isWinXP){
      	//Zhan 20190318XP系统不启用中间件
      	INSU.PORT.GLOBAL.SerStatus="0"
	}else{
		try{
			GetInsuStatus(0);
		}catch(eex){
			
		}
	}


})();
//s
function tkMakeServerCallHIS(cls,meth,dicType,dicCode ,HospID){
	var DicStr = "";
	var RequestStr = '<Request><DicType>' + dicType + '</DicType><DicCode>' + dicCode + '</DicCode><HospID>' + HospID + '</HospID><TradeCode>GetDicData</TradeCode></Request>'
	var rtn = tkMakeServerCall(RequestStr);
	if(rtn.Response){
		DicStr = rtn.Response.output;
	}
	return DicStr;
}
/*
自助机银行卡支付
ZhanMingchao 202010709
入参:
	Handle:句柄，默认为0，目前没用
	UserId:操作员,目前没用
	rCardType:读卡设备类型，0:自动读寻卡并读卡(任意一个先读到数据就返回),1:身份证,2:自动卡机,3:扫码,4:POS,5:获取热敏打印机状态
	Mode:读卡模式，是否立刻释放设备，目前没用
	Args:参数
	TimeOut:设备超时时间(毫秒)，1000为1秒
	ExpStr:扩展参数
*/
function SelfPayService(TradeAmt)
{
 try{
		//
		TradeAmt = formatAmt(TradeAmt);
		var getInStr="TradeAmt=" + TradeAmt + "&patientName=" + OSPGetParentVal('HisPatInfo').PatientName;
		rtn=CallInsuComLocalGet("SelfPay.PosPayNew","SelfPosPay",getInStr,""); // 工程类名 , SelfPosPay 函数名
		//rtn = "000000|00|001000|105120080620204|00012092|0815|153120|6222621******11603#NjIyMjYyMTA3MDAwMDIxMTYwMw==|000000000001|2200015100050|122745122160|942122";
		var UserCode = OSPGetParentVal('client_dict', 'ss_eqlistd_eqcode');
		if(UserCode != "undefined"){
			if(UserCode == "ZZJ15" ||UserCode == "ZZJ16" ||UserCode == "ZZJ35" || UserCode == "ZZJ18" || UserCode == "ZZJ19" || UserCode == "ZZJ20" || UserCode == "ZZJ31" || UserCode == "ZZJ33" || UserCode == "ZZJ48" || UserCode == "ZZJ21" || UserCode == "ZZJ29" || UserCode == "ZZJ43" || UserCode == "ZZJ50" || UserCode == "ZZJ49" || UserCode == "BGJ21" || UserCode == "ZZJ36" || UserCode == "ZZJ3"|| UserCode == "ZZJ2"|| UserCode == "ZZJ26"  ){
				return rtn;
			}
			if(UserCode == "ZZJ4" ||UserCode == "ZZJ14" || UserCode == "ZZJ30" || UserCode== "ZZJ34" || UserCode== "ZZJ23" || UserCode== "ZZJ22" || UserCode== "ZZJ24" || UserCode== "ZZJ37" || UserCode== "ZZJ10" || UserCode== "ZZJ8"|| UserCode== "ZZJ52"|| UserCode== "ZZJ53"|| UserCode== "ZZJ41"|| UserCode== "ZZJ45"|| UserCode== "ZZJ46"){
				return rtn;
			}
		}
		RestartINSUService();
		return rtn;
	}catch(e){
		alert("调用支付接口发生异常，将使用测试数据"+e.message);
		var rtn = "-1|";
		return rtn;
	}finally{
	
	}       
}
function SelfPayServiceBak(TradeAmt)
{
 try{
	 	//alert(TradeAmt)
		//
		TradeAmt = formatAmt(TradeAmt);
		var getInStr="TradeAmt=000000000001&patientName=张三";
		//alert("调用银行卡动态库:" + TradeAmt);
		var obj= new ActiveXObject("SelfPay.PosPayNew");
		var sum = obj.SelfPosPay(TradeAmt,OSPGetParentVal('HisPatInfo').PatientName);
		//rtn = "000000|00|001000|105120080620204|00012092|0815|153120|6222621******11603#NjIyMjYyMTA3MDAwMDIxMTYwMw==|000000000001|2200015100050|122745122160|942122";
		return sum;
	}catch(e){
		alert("调用支付接口发生异常，将使用测试数据"+e.message);
		var rtn = "000000|00|001000|105120080620204|00012092|0815|153120|6222621******11603#NjIyMjYyMTA3MDAwMDIxMTYwMw==|000000000001|2200015100050|122745122160|942122";
		return rtn;
	}finally{
	
	}       
}
/*
自助机自动寻卡、读卡
ZhanMingchao 202010709
入参:
	Handle:句柄，默认为0，目前没用
	UserId:操作员,目前没用
	rCardType:读卡设备类型，0:自动读寻卡并读卡(任意一个先读到数据就返回),1:身份证,2:自动卡机,3:扫码,4:POS,5:获取热敏打印机状态
	Mode:读卡模式，是否立刻释放设备，目前没用
	Args:参数
	TimeOut:设备超时时间(毫秒)，1000为1秒
	ExpStr:扩展参数
*/
function InsuAutoReadCardAsc(Handle,UserId,rCardType,Mode,Args,TimeOut,ExpStr,funOpt)
{
 try{
	GLOBALFun = funOpt;
	var getInStr="rCardType="+rCardType+"&Mode="+Mode+"&Args="+Args+"&TimeOut="+TimeOut+"&ExpStr="+toINSUSafeCode(ExpStr);
	rtn=CallInsuComLocalGet("DHCInterface.Interface","AutoReadCard",getInStr,"")
    return rtn;
  }catch(e){
	alert("调用医保接口发生异常"+e.message);
	return "-1"
  }finally{
	
  }       
}
function ReadCardAbort()
{
 try{
	var getInStr="rCardType=6&Mode="+""+"&Args="+""+"&TimeOut="+""+"&ExpStr=";
	var rtn = CallInsuComLocalGet("DHCInterface.Interface","ReadCardAbort",getInStr,"");
    return rtn;
  }catch(e){
	alert("调用医保接口发生异常"+e.message);
	return "-1"
  }finally{
	
  }       
}
function ExcuteCmd(FileName,ParamInput)
{
 try{
	var getInStr="calc";
	var rtn = CallInsuComLocalGet("ExecuteFile","cmd.exe",getInStr,"");
    return rtn;
  }catch(e){
	alert("调用医保接口发生异常" + e.message);
	return "-1"
  }finally{
	
  }       
}