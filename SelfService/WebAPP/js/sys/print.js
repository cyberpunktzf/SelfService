/// sys/print.js
///DHCPrtComm.js
PrtAryData=new Array()
/**
*@author : wanghc
*@date : 2017-2-9
*@param : {int} printWidth 打印纸宽度
*@param : {String} str 打印内容 
*@param : {int} wordWidth 一个字的宽度
* var x  = getCenterX(190,"北京地坛医院",4)
*/
function getCenterX(printWidth, str, wordWidth){
	var titleLen = str.length * wordWidth;
	var x = (printWidth-titleLen)/2;
	return x;
}
/**
*@author : wanghc
*@date : 2017-2-9
*@param : {String} str 超过一行长的字符串
*@param : {int} lineWordNum  一行显示多少个汉字。一个汉字相当二个字母
*@other label不能自动换行,要加\n能换行
*var str = "处理方法：1.	关闭报表工具2.	把东华智能报表工具安装下jdbc目录打开注释p8以下的驱动包(CacheDB.jar)如图 3.	在cache2010安装目录下如：\Dev\java\lib\JDK15 复制cacheDB.jar（文件大小是2098kb）到东华智能报表工具安装下jdbc中；（不能用JDK16下的cacheDB.jar）4.	在通过studio打开您报错的query类，修改您所调用的query 中sqlproc属性（如果为false请设置成true 编译此类 p5与2010需要设置）如图："
*str = autoWordEnter(str,46);
*/
function autoWordEnter(str,lineWordNum){
    var charWordNum = lineWordNum*2;  //一汉字长度为二个char长度
	if (str == null) return str;
	if (typeof str != "string"){
		return str;
	}
	var tmp, rtn="";
	var arr=[];
	var charLen=0 ;
	for(var i=0;i<str.length;i++){
	    var chr = str.charAt(i);
	    arr.push(chr);
	    if (chr.charCodeAt(0)>127 || chr.charCodeAt(0)==9) {  
            charLen += 2;  //汉字
        }else{  
            charLen ++;  
        }  
	    if (charLen>=charWordNum){
	        arr.push('\n');
	        charLen=0;
	    }
	}
	return arr.join('');
}
function evalXMLVal(val){
	return val.replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/&/g,"&amp;").replace(/'/g,"&apos;").replace(/\"/g,"&quot;");
}
/**
*@author : wanghc 
*@date : 2016-03-10
*@param : {ClsBillPrint} VB打印对象 
*          如: <object ID='ClsBillPrint' WIDTH=0 HEIGHT=0 CLASSID='CLSID:F30DC1D4-5E29-4B89-902F-2E3DC81AE46D' CODEBASE='../addins/client/DHCOPPrint.CAB#version=1,0,0,43' VIEWASTEXT></object>
*          或: d ##Class(web.DHCBillPrint).InvBillPrintCLSID()
*		   或: var PObj = new ActiveXObject("DHCOPPrint.ClsBillPrint");
*
*@param : {String}   文本数据   $c(2)分割键与值, ^为多组键值分割符. 
*          如: name_$c(2)_王二^patno_$c(2)_000009
*
*@param : {String}   列表数据	^分割列, $c(2)为行间分割符. 
*          如: DrugName^Price^DrugUnit^Qty^PaySum_$c(2)_DrugName2^Price2^DrugUnit2^Qty2^PaySum2
*
*@param : {Object} jsonArr 增加的自定义打印数据   可以不传, 2017-10-25 可以修改打印机
*          如: [{type:"invoice",PrtDevice:"pdfprinter"},{type:"line",sx:1,sy:1,ex:100,ey:100},{type:"text",name:"patno",value:"0009",x:10,y:10,isqrcode:true,lineHeigth:5}]
*              text类型name,value,x,y为必填,
* 			可选属性有: fontsize,fontbold,fontname, 默认值为12,false,宋体
*@param : invHeight 票据的高度----cab中判断打印换页是：发现元素位置top超过height就会换页打印，如果发现一个元素超过一页后，后面元素top-height就可以实现分页打印
* 2018-09-20 增加invHeight 分页处理
*
*/
function DHCP_XMLPrint(PObj, inpara, inlist, jsonArr,invHeight){
	var c2 = String.fromCharCode(2);
	jsonArr = jsonArr||[];
	try{
		var mystr="";
		for (var i= 0; i<PrtAryData.length;i++){
			mystr=mystr + PrtAryData[i];
		}
		inpara=DHCP_TextEncoder(inpara);
		inlist=DHCP_TextEncoder(inlist);
		/*处理inpara中换行数据,对齐问题,生成jsonArr*/
		var inparaArr = inpara.split('^');
		var tmpArr = [];
		for(var tmpInd=0; tmpInd<inparaArr.length; tmpInd++){
			var inParaItemArr = inparaArr[tmpInd].split(c2);
			var itemName = inParaItemArr[0];
			if(inParaItemArr.length>1 && inParaItemArr[1].indexOf("\n")>-1){
				var ritem = new RegExp('txtdatapara.+?name=\\"'+itemName+'\\"(.+)>');
				var tmprItem = mystr.match(ritem);
				if (tmprItem!=null){
					//alert(tmprItem[1])
					//var rx = new RegExp('name=\\"'+inParaItemArr[0]+'\\".+?xcol=\\"(.+?)\\"');
					var rx = tmprItem[1].match(/xcol=\"(.+?)\"/)[1];
					var ry = tmprItem[1].match(/yrow=\"(.+?)\"/)[1];
					var rfs = tmprItem[1].match(/fontsize=\"(.+?)\"/)[1];
					var rfb = tmprItem[1].match(/fontbold=\"(.+?)\"/)[1];
					var rfn = tmprItem[1].match(/fontname=\"(.+?)\"/)[1];
					//alert(rx+","+ry+","+rfs+","+rfb+","+rfn);	
					var inParaItemValueArr = inParaItemArr[1].split('\n');
					for (var j=1;j<inParaItemValueArr.length;j++){
						jsonArr.push({
							type:'text',name:itemName+'ntr'+j,value:inParaItemValueArr[j],
							x:rx,y:parseFloat(ry)+(j*5),fontsize:rfs,fontbold:rfb,fontname:rfn
						});
					}
					tmpArr.push(itemName+c2+inParaItemValueArr[0]);
					
				}
			}else{
				tmpArr.push(inparaArr[tmpInd]);
			}
		}
		inpara = tmpArr.join('^');
		//-----jsonArr处理
		if (jsonArr.length>0){
			if (jsonArr.length>0 && jsonArr[0].type.toLowerCase()=="invoice"){
				var invObj = jsonArr[0];
				for (var p in invObj){
					if (p!="type"){
						mystr = mystr.replace(new RegExp(p+'=".*?"','mi'), function(){
							return p+"=\""+invObj[p]+"\"";
						})
					}
				}
			}
			var itemJson="", exLineXml = "",exTextXml="";
			for(var j = 0; j < jsonArr.length; j++){
			    itemJson = jsonArr[j];
			    if (itemJson.value){ itemJson.value = evalXMLVal(itemJson["value"]);}
				if (itemJson["type"]){
					if (itemJson["type"].toLowerCase()=="invoice"){
					}else if (itemJson["type"].toLowerCase()=="line"){
						exLineXml += '<PLine BeginX="'+itemJson.sx+'" BeginY="'+itemJson.sy+'" EndX="'+itemJson.ex+'" EndY="'+itemJson.ey+'"></PLine>'
					}else if (itemJson["type"].toLowerCase()=="text"){
						if (itemJson.isqrcode){
							exTextXml += '<txtdatapara width="'+(itemJson.width||100)+'" height="'+(itemJson.height||100)+'" name="'+itemJson.name+'" xcol="'+itemJson.x+'" yrow="'+itemJson.y+'" fontsize="'+(itemJson.fontsize||12)+'" fontbold="'+(itemJson.fontbold||"false")+'" fontname="'+(itemJson.fontname||"宋体")+'" defaultvalue="" printvalue="'+(itemJson.value)+'" isqrcode="true"></txtdatapara>';
						}else{
							var textValueArr = itemJson.value.split("\n");
							var tmpStartY = itemJson.y;
							for (var tmpInd=0; tmpInd<textValueArr.length; tmpInd++){
								exTextXml += '<txtdatapara name="'+itemJson.name+tmpInd+'" xcol="'+itemJson.x+'" yrow="'+tmpStartY+'" fontsize="'+(itemJson.fontsize||12)+'" fontbold="'+(itemJson.fontbold||"false")+'" fontname="'+(itemJson.fontname||"宋体")+'" defaultvalue="'+(textValueArr[tmpInd])+'" printvalue="'+(textValueArr[tmpInd])+'"></txtdatapara>';
								tmpStartY += parseInt(itemJson.lineHeigth||5);
							}
							//exTextXml += '<txtdatapara name="'+itemJson.name+'" xcol="'+itemJson.x+'" yrow="'+itemJson.y+'" fontsize="'+(itemJson.fontsize||12)+'" fontbold="'+(itemJson.fontbold||"false")+'" fontname="'+(itemJson.fontname||"宋体")+'" defaultvalue="'+(itemJson.value)+'" printvalue="'+(itemJson.value)+'"></txtdatapara>';
						}
					}
				}
			}
			//console.log(exLineXml+","+exTextXml);
			var txtDataIndex = mystr.indexOf("</TxtData>");
			mystr = mystr.slice(0,txtDataIndex)+exTextXml+mystr.slice(txtDataIndex);
			var lineDataIndex = mystr.indexOf("</PLData>");
			mystr = mystr.slice(0,lineDataIndex)+exLineXml+mystr.slice(lineDataIndex);
			//console.log(mystr);
		}
		// 处理分页
		var page2 = false; //是否是第二页
		var mystr = mystr.replace(/\syrow\s*?=\s*?"(.+?)"\s/ig,function(str,str2){
			if (parseFloat(str2)>invHeight){
				if (page2){
					return ' yrow="'+(parseFloat(str2)-invHeight)+'" '; 
				}else{
					page2 = true;
				}
			}
			return ' yrow="'+str2+'" ';
		})
		if ("undefined"==typeof EnableLocalWeb || 0==EnableLocalWeb ){ //("undefined"==typeof isIECore || isIECore){
			var docobj=new ActiveXObject("MSXML2.DOMDocument.4.0");
			//docobj.async = false;    //
			var rtn=docobj.loadXML(mystr); 
			if (rtn){
				var rtn=PObj.ToPrintHDLP(inpara,inlist,docobj);
			}
		}else{
			if ('undefined'!=typeof PObj.ToPrintHDLPStr){
				var rtn = PObj.ToPrintHDLPStr(inpara,inlist,mystr);
			}else{
				var rtn = DHCOPPrint.ToPrintHDLPStr(inpara,inlist,mystr);
			}
		}
	}catch(e){
		alert(e.message);
		return;
	}
}

function DHCP_XMLPrintDoc(PObj, inpara, inlist, jsonArr){
	try{
		var mystr="";
		for (var i= 0; i<PrtAryData.length;i++){
			mystr=mystr + PrtAryData[i];
		}
		inpara=DHCP_TextEncoder(inpara)
		inlist=DHCP_TextEncoder(inlist)
		if (arguments.length>3 && jsonArr!==""){
			if (jsonArr.length>0 && jsonArr[0].type.toLowerCase()=="invoice"){
				var invObj = jsonArr[0];
				for (var p in invObj){
					if (p!="type"){
						mystr = mystr.replace(new RegExp(p+'=".*?"','mi'), function(){
							return p+"=\""+invObj[p]+"\"";
						})
					}
				}
			}
			var itemJson="", exLineXml = "",exTextXml="";
			for(var j = 0; j < jsonArr.length; j++){
			    itemJson = jsonArr[j];
				if(itemJson["type"]){
					if (itemJson["type"].toLowerCase()=="invoice"){
					}else if (itemJson["type"].toLowerCase()=="line"){
						exLineXml += '<PLine BeginX="'+itemJson.sx+'" BeginY="'+itemJson.sy+'" EndX="'+itemJson.ex+'" EndY="'+itemJson.ey+'"></PLine>'
					}else if (itemJson["type"].toLowerCase()=="text"){
						exTextXml += '<txtdatapara name="'+itemJson.name+'" xcol="'+itemJson.x+'" yrow="'+itemJson.y+'" fontsize="'+(itemJson.fontsize||12)+'" fontbold="'+(itemJson.fontbold||"false")+'" fontname="'+(itemJson.fontname||"宋体")+'" defaultvalue="'+(itemJson.value)+'" printvalue="'+(itemJson.value)+'"></txtdatapara>'
					}
				}
			}
			//console.log(exLineXml+","+exTextXml);
			var txtDataIndex = mystr.indexOf("</TxtData>");
			mystr = mystr.slice(0,txtDataIndex)+exTextXml+mystr.slice(txtDataIndex);
			var lineDataIndex = mystr.indexOf("</PLData>");
			mystr = mystr.slice(0,lineDataIndex)+exLineXml+mystr.slice(lineDataIndex);
			//console.log(mystr);
		}
		var docobj=new ActiveXObject("MSXML2.DOMDocument.4.0");
		//docobj.async = false;    //
		var rtn=docobj.loadXML(mystr);
		if (rtn){
			//ToPrintHDLP
			var rtn=PObj.ToPrintDoc(inpara,inlist,docobj);
		}
	}catch(e){
		alert(e.message);
		return;
	}
}
// name^小二$c(2)age^24岁
function DHCP_PrintFun(PObj,inpara,inlist){
	////myframe=parent.frames["DHCOPOEOrdInput"];
	////DHCPrtComm.js

	try{
		var mystr="";
		for (var i= 0; i<PrtAryData.length;i++){
			mystr=mystr + PrtAryData[i];
		}

		inpara=DHCP_TextEncoder(inpara)
		inlist=DHCP_TextEncoder(inlist)			
		var docobj=new ActiveXObject("MSXML2.DOMDocument.4.0");
		docobj.async = false;    //
		var rtn=docobj.loadXML(mystr);

		if ((rtn)){
			// 打印条码时如果值没有二边带*,则自动补*,加*后可以扫码。2019-4-1兰大一院start
			var barcodeItemNameObj = {}; 
			var inv = docobj.documentElement.childNodes[0];
			var xmlTxtData = inv.getElementsByTagName("TxtData");
			var txtDatas=  xmlTxtData[0].getElementsByTagName("txtdatapara");
			if (txtDatas){
				for (var j=0;j<txtDatas.length; j++){
					var item = txtDatas[j];
					var fontname = item.getAttribute('fontname');
					if (fontname=="C39P36DmTt"){
						barcodeItemNameObj[item.getAttribute('name')]=true ;
						
					}
				}
			}
			// inpara拆成对象
			var c2 = String.fromCharCode(2);
			var inparaArr = inpara.split('^');
			for(var i=0; i<inparaArr.length; i++){
				var arr = inparaArr[i].split(c2);
				if (barcodeItemNameObj[arr[0]] && arr[1].indexOf("*")==-1) {
					inparaArr[i] = arr[0]+c2+"*"+arr[1]+"*";
				}
			}
			inpara = inparaArr.join("^");
			// end
			////ToPrintDoc(ByVal inputdata As String, ByVal ListData As String, InDoc As MSXML2.DOMDocument40)
			var rtn=PObj.ToPrintDoc(inpara,inlist,docobj);
		
			////var rtn=PObj.ToPrintDoc(myinstr,myList,docobj);
		}
	}catch(e){
		//alert(e.message);
		//return;
	}
}
function DHCP_PrintFunNew(PObj,inpara,inlist){
	////myframe=parent.frames["DHCOPOEOrdInput"];
	////DHCPrtComm.js
	try{
		var mystr="";
		for (var i= 0; i<PrtAryData.length;i++){
			mystr=mystr + PrtAryData[i];
		}
		inpara=DHCP_TextEncoder(inpara)
		inlist=DHCP_TextEncoder(inlist)
				
		var docobj=new ActiveXObject("MSXML2.DOMDocument.4.0");
		docobj.async = false;    //
		var rtn=docobj.loadXML(mystr);
		
		if ((rtn)){
			// 打印条码时如果值没有二边带*,则自动补*。兰大一院start
			var barcodeItemNameObj = {}; 
			var inv = docobj.documentElement.childNodes[0];
			var xmlTxtData = inv.getElementsByTagName("TxtData");
			var txtDatas=  xmlTxtData[0].getElementsByTagName("txtdatapara");
			if (txtDatas){
				for (var j=0;j<txtDatas.length; j++){
					var item = txtDatas[j];
					var fontname = item.getAttribute('fontname');
					if (fontname=="C39P36DmTt"){
						barcodeItemNameObj[item.getAttribute('name')]=true ;
					}
				}
			}
			// inpara拆成对象
			var c2 = String.fromCharCode(2);
			var inparaArr = inpara.split('^');
			for(var i=0; i<inparaArr.length; i++){
				var arr = inparaArr[i].split(c2);
				if (barcodeItemNameObj[arr[0]] && arr[1].indexOf("*")==-1) {
					inparaArr[i] = arr[0]+c2+"*"+arr[1]+"*";
				}
			}
			inpara = inparaArr.join("^");
			// end
			////ToPrintDoc(ByVal inputdata As String, ByVal ListData As String, InDoc As MSXML2.DOMDocument40)
			var rtn=PObj.ToPrintDocNew(inpara,inlist,docobj);
			
			////var rtn=PObj.ToPrintDoc(myinstr,myList,docobj);
		}
	}catch(e){
		alert(e.message);
		return;
	}
}
function DHCP_GetXMLConfig(encName,PFlag){
	////
	/////InvPrintEncrypt
	try{		
		PrtAryData.length=0
		var obj=document.getElementById(encName);
		if (obj){
			var encmeth=obj.value;
			var PrtConfig=cspRunServerMethod(encmeth,"DHCP_RecConStr",PFlag);
		}else{
			var PrtConfig=tkMakeServerCall("web.DHCXMLIO", "ReadXML","DHCP_RecConStr",PFlag);
		}
		for (var i= 0; i<PrtAryData.length;i++){
			PrtAryData[i]=DHCP_TextEncoder(PrtAryData[i]) ;
		}
	}catch(e){
		alert(e.message);
		return;
	}
}

function PisDHCP_GetXMLConfig(encName,PFlag){
	////
	/////InvPrintEncrypt
	try{		
		PrtAryData.length=0
		var PrtConfig=tkMakeServerCall("web.DHCXMLIO", "ReadXML","DHCP_RecConStr",PFlag); //"DHCPisLabel");
		for (var i= 0; i<PrtAryData.length;i++){
			PrtAryData[i]=DHCP_TextEncoder(PrtAryData[i]) ;
		}
	}catch(e){
		alert(e.message);
		return;
	}
}
function DHCP_mytest(encmeth,PFlag,PObj){
	////myframe=parent.frames["DHCOPOEOrdInput"];
	////DHCPrtComm.js
	////
	try{		
		
		var mystr="";
		for (var i= 0; i<PrtAryData.length;i++){
			mystr=mystr + PrtAryData[i];
		}
		var docobj=new ActiveXObject("MSXML2.DOMDocument.4.0");
		docobj.async = false;    //
		var rtn=docobj.loadXML(mystr);
		if ((rtn)){
			////ToPrintDoc(ByVal inputdata As String, ByVal ListData As String, InDoc As MSXML2.DOMDocument40)
			var rtn=PObj.ToPrintDoc(myinstr,myList,docobj);			
		}
	}catch(e){
		alert(e.message);
		return;
	}
	return rtn;
}

function DHCP_RecConStr(ConStr){
	///var myIdx=PrtAryData.length
	PrtAryData[PrtAryData.length]=ConStr;
	
}

function DHCP_TextEncoder(transtr){
	if (transtr.length==0){
		return "";
	}
	var dst=transtr;
	try{
		dst = DHCP_replaceAll(dst, '\\"', '\"');
		dst = DHCP_replaceAll(dst, "\\r\\n", "\r\t");
		dst = DHCP_replaceAll(dst, "\\r", "\r");
		dst = DHCP_replaceAll(dst, "\\n", "\n");
		dst = DHCP_replaceAll(dst, "\\t", "\t");
	}catch(e){
		alert(e.message);
		return "";
	}
	return dst;
}

function DHCP_replaceAll(src,fnd,rep) 
{ 
	//rep:replace
	//src:source
	//fnd:find
	if (src.length==0) 
	{ 
		return ""; 
	} 
	try{
		var myary=src.split(fnd);
		var dst=myary.join(rep);
	}catch(e){
		alert(e.message);
		return ""
	}
	return dst; 
} 
function DHCWeb_replaceAll(src,fnd,rep) 
{ 
	return DHCP_replaceAll(src,fnd,rep);
}
function strlen(str){
	var len = 0;
	for (var i=0; i<str.length; i++) { 
		var c = str.charCodeAt(i); 
		//单字节加1 
		if ((c >= 0x0001 && c <= 0x007e) || (0xff60<=c && c<=0xff9f)) { 
			len++; 
		} 
		else { 
			len+=2; 
		} 
	} 
	return len;

}

function GetStrInfo(str,Needlen){
	var Output1="",Output2=""
	var len = 0;
	for (var i=0; i<str.length; i++) { 
		var c = str.charCodeAt(i); 
		//单字节加1 
		if ((c >= 0x0001 && c <= 0x007e) || (0xff60<=c && c<=0xff9f)) { 
			len++; 
		} 
		else { 
			len+=2; 
		}
		//alert("c======:"+c)
		if (len<Needlen){
			Output1=Output1+String.fromCharCode(c)
		}else{
			Output2=Output2+String.fromCharCode(c)
		}
		//alert(Output1+"^^^^^"+Output2)
	} 
	return Output1+"^"+Output2;

}
function DHCP_PrintFunHDLP(PObj,inpara,inlist){
	try{
		var mystr="";
		for (var i= 0; i<PrtAryData.length;i++){
			mystr=mystr + PrtAryData[i];
		}
		inpara=DHCP_TextEncoder(inpara)
		inlist=DHCP_TextEncoder(inlist)
		if ("undefined"==typeof EnableLocalWeb || 0==EnableLocalWeb ){ //if ("undefined"==typeof isIECore || isIECore){	
			var docobj=new ActiveXObject("MSXML2.DOMDocument.4.0");
			docobj.async = false;    //
			var rtn=docobj.loadXML(mystr);
			if ((rtn)){
				var rtn=PObj.ToPrintHDLP(inpara,inlist,docobj);
			}
		}else{
			if ('undefined'!=typeof PObj.ToPrintHDLPStr){
				var rtn = PObj.ToPrintHDLPStr(inpara,inlist,mystr);
			}else{
				var rtn = DHCOPPrint.ToPrintHDLPStr(inpara,inlist,mystr);
			}
			
		}
	}catch(e){
		alert(e.message);
		return;
	}
}

function GetGifInfo(USERID)
{
	var ImgBase64=tkMakeServerCall("web.UDHCPrescript","GetDocGifCode",USERID)
	//alert(ImgBase64)
	//读取流数据写入c盘成为.gif文件
	var myobj=document.getElementById('ClsSaveBase64IMG');
	if ((myobj)&&(ImgBase64!=""))
	{
		var sReigstNo = USERID
		var sFiletype= "gif"
		var rtn=myobj.WriteFile(sReigstNo,ImgBase64,sFiletype);
		if(!rtn)
		{
			alert("\u7B7E\u540D\u56FE\u7247\u8F6C\u6362\u9519\u8BEF");
			return -1;
		}
		return 0;
	}
	return -1;
}
/// SaveImg("http://127.0.0.1/dthealth/web/images/logon_btn.bmp","D:\\Signature\\btn.bmp")
function SaveImg(httpName,pathName){
    try {
		cspXMLHttp=new ActiveXObject("Microsoft.XMLHTTP");
	} catch (e) {
		try {
	 		cspXMLHttp=new ActiveXObject("Msxml2.XMLHTTP");
		} catch (E) {
			cspXMLHttp=null;
		}
	}
	cspXMLHttp.open("GET", httpName, false);
	cspXMLHttp.send();
	var adodbStream=new ActiveXObject("ADODB.Stream"); 
	adodbStream.Type=1;//1=adTypeBinary 
	adodbStream.Open(); //"http://127.0.0.1/dthealth/web/images/logon_btn.bmp"); 
	adodbStream.write(cspXMLHttp.responseBody); 
	adodbStream.SaveToFile(pathName,2); 
	adodbStream.Close(); 
	adodbStream=null; 
}
/*
{type:'line', sy:1,sx:1,ey:11,ex:11,rePrtHeadFlag:"Y"},
{type:'img', name:'', x:1, y:2, rePrtHeadFlag:"Y", value:"http://xx.png", width:24, height:24 },
{type:"text",name:"patno",value:"1024988919",x:10,y:10},
{type:"text",name:"invno",value:"1024988919",x:140,y:12,width:24,height:11,barcodetype:"128C",LetterSpacing:"-2"},
{type:"text",name:"invno",value:"1024988919",x:140,y:12,width:24,height:11,isqrcode:"true",qrcodeversion:1,LetterSpacing:"-2"},
{type:"img", y:(col.ptop+padTop)+"mm", x:col.pleft+"mm",  width:"800mm",  height:rowHeight+"mm",  value:pval,  FontSize:col.pfsize,  FontName:col.pfname, Bold:col.pfbold } 
*/
function LODOP_PrintItem(LODOP, item){
	var height = item.height||20, width = item.width||20;
	if ("string"==typeof item.height){
		if (item.height.indexOf('mm')>-1 || item.height.indexOf('%')>-1){
			height = item.height;
		}else{
			height = parseFloat(height) + "mm";
		}
	}else{
		height = parseFloat(height) + "mm";
	}
	if ("string"==typeof item.width){
		if (item.width.indexOf('mm')>-1 || item.width.indexOf('%')>-1){
			width = item.width;
		}else{
			width = parseFloat(width) + "mm";
		}
	}else{
		width = width + "mm";
	}
	var x = item.x||0, y = item.y||0, value = item.value||"";
	var fname = item.fname||"宋体", fbold = item.fbold||"false", fsize = item.fsize||12,fcolor=item.fcolor||"";
	var rePrtHeadFlag = item.rePrtHeadFlag || "N";
	var barcodetype = item.barcodetype||null, isqrcode = item.isqrcode||null, qrcodeversion=item.qrcodeversion||"Auto";
	
	var isshowtext = item.isshowtext||"Y", angle=item.angle||0;
	if(item["type"]){
		if (item["type"].toLowerCase()=="img"){
				if (value.indexOf("http:")==0 || value.indexOf("data:")==0){
					value = "<img border='0' src='"+value+"'/>" //"URL:"+pval;--导致浏览器崩溃
				}
				if (value!=""){
					LODOP.ADD_PRINT_IMAGE(item.y+"mm",item.x+"mm",width,height,value);
					if(value.indexOf("http")>-1) LODOP.SET_PRINT_STYLEA(0,"HtmWaitMilSecs",500);
					if (height=="100%" && width=="100%"){
						//LODOP.SET_PRINT_STYLEA(0,"HtmWaitMilSecs",100);//延迟100毫秒
						//LODOP.SET_PRINT_STYLEA(0,"Stretch",2);//图片显示原大小
					}else{
						LODOP.SET_PRINT_STYLEA(0,"Stretch",1);//(可变形)扩展缩放模式
					}
				}
		}else if (item["type"].toLowerCase()=="line"){
			LODOP.ADD_PRINT_LINE(item.sy+"mm",item.sx+"mm",item.ey+"mm",item.ex+"mm",0,1); //0=实线,1=线宽
			if (fcolor!="") LODOP.SET_PRINT_STYLEA(0,"FontColor", fcolor);
		}else{
			if ('string'==typeof barcodetype){
				if (barcodetype=="128C") value = value.replace(/\D/gi,function(word){return "";})
				LODOP.ADD_PRINT_BARCODE(y+"mm",x+"mm",width, height ,barcodetype,value);
				if (isshowtext=="N") LODOP.SET_PRINT_STYLEA(0,"ShowBarText",0);
			}else if('string'==typeof isqrcode ){
				if (isqrcode=="true"){
						LODOP.ADD_PRINT_BARCODE(y+"mm",x+"mm",width, height, "QRCode",value);
						if(",1,2,3,5,7,10,14,".indexOf(","+qrcodeversion+",")>-1){
							LODOP.SET_PRINT_STYLEA(0,"QRCodeVersion",qrcodeversion);		
						}else{
							//LODOP.SET_PRINT_STYLEA(0,"QRCodeVersion",3);
						}
					}
			}else{ /*label*/
				LODOP.ADD_PRINT_TEXT(y+"mm",x+"mm",width, height, value);
				LODOP.SET_PRINT_STYLEA(0,"FontSize",fsize);
				LODOP.SET_PRINT_STYLEA(0,"FontName",fname);
				if (fbold=="true"){LODOP.SET_PRINT_STYLEA(0,"Bold",1);}
			}
			if (fcolor!="") LODOP.SET_PRINT_STYLEA(0,"FontColor", fcolor);
			if ("undefined"!=typeof item && !!item.LetterSpacing) {
				LODOP.SET_PRINT_STYLEA(0, "LetterSpacing", item.LetterSpacing);
			}
		}
		LODOP.SET_PRINT_STYLEA(0,"Angle",0);
		if (angle>0) LODOP.SET_PRINT_STYLEA(0,"Angle",angle);
		if (rePrtHeadFlag=="Y") LODOP.SET_PRINT_STYLEA(0,"ItemType",1); //1=页眉页脚
	}
};
function LODOP_CreateLine(LODOP,invXMLDoc,inpara,inlist,jsonArr){
	//lodop推荐先打画线
	var xmlPLine = invXMLDoc.getElementsByTagName("PLData");
	if (xmlPLine && xmlPLine.length>0){
		for(var myind=0; myind<xmlPLine.length; myind++){
			var xmlPlineRePrtHeadFlag = xmlPLine[myind].getAttribute("RePrtHeadFlag");
			var pLines = xmlPLine[myind].getElementsByTagName("PLine");
			for (var j=0;j<pLines.length;j++){
				var item = pLines[j]
				var pleft1 = item.getAttribute("BeginX");	
				var ptop1 = item.getAttribute("BeginY");	
				var pleft2 = item.getAttribute("EndX");	
				var ptop2 = item.getAttribute("EndY");
				var pfontcolor = item.getAttribute("fontcolor");
				LODOP_PrintItem(LODOP, {
					type:'line',
					sy:ptop1,
					sx:pleft1,
					ey:ptop2,
					ex:pleft2,
					rePrtHeadFlag:xmlPlineRePrtHeadFlag,
					fcolor:pfontcolor
				});
			}
		}
	}
}
function LODOP_CreateImg(LODOP,invXMLDoc,inpara,inlist,jsonArr){
	// inpara拆成对象
	var c2 = String.fromCharCode(2);
	var inparaArr = inpara.split('^');
	var inparaObj = {};
	for(var i=0; i<inparaArr.length; i++){
		var arr = inparaArr[i].split(c2);
		inparaObj[arr[0]] = arr[1];
	}
	var xmlPICData = invXMLDoc.getElementsByTagName("PICData");
	if (xmlPICData && xmlPICData.length>0){
		for(var myind=0; myind<xmlPICData.length; myind++){
			var xmlPICDataRePrtHeadFlag = xmlPICData[myind].getAttribute("RePrtHeadFlag");
			var picDataParas = xmlPICData[myind].getElementsByTagName("PICdatapara");
			for (var j=0;j<picDataParas.length;j++){
				var item = picDataParas[j]
				var pname = item.getAttribute("name");	
				var pleft = item.getAttribute("xcol");	
				var ptop = item.getAttribute("yrow");	
				var pheight = item.getAttribute("height");
				var pwidth = item.getAttribute("width");
				var pdval = item.getAttribute("defaultvalue");	
				var ppval = item.getAttribute("printvalue");	
				var pfbold = item.getAttribute("fontbold");	//false
				var pfname = item.getAttribute("fontname");
				var pfsize = item.getAttribute("fontsize");
				var pval = inparaObj[pname]||pdval;
				if (null == pheight){
					pheight = 20
				}
				if (null==pwidth){
					pwidth = 20
				}
				LODOP_PrintItem(LODOP,{type:"img", value:pval, x:pleft, y:ptop, width: pwidth, height:pheight, fname:pfname, fbold:pfbold, fsize:pfsize});
			}
		}
	}
}
function LODOP_CreateTxt(LODOP,invXMLDoc,inpara,inlist,jsonArr,otherCfg){
	// inpara拆成对象
	var c2 = String.fromCharCode(2);
	var inparaArr = inpara.split('^');
	var inparaObj = {};
	for(var i=0; i<inparaArr.length; i++){
		var arr = inparaArr[i].split(c2);
		inparaObj[arr[0]] = arr[1];
	}
	var invAttr = invXMLDoc.attributes;
	var invOrient = "X";
	if (invAttr.getNamedItem("LandscapeOrientation")){ //老版设计器,默认情况下没有此属性
		invOrient = invAttr.getNamedItem("LandscapeOrientation").value; //X=纵向,Y=横向,Z=即打即停
	}
	var xmlTxtData = invXMLDoc.getElementsByTagName("TxtData");
	if (xmlTxtData && xmlTxtData.length>0){
		for(var myInd =0; myInd<xmlTxtData.length; myInd++){
			var xmlTxtDataRePrtHeadFlag = xmlTxtData[myInd].getAttribute("RePrtHeadFlag");
			var txtDataParas = xmlTxtData[myInd].getElementsByTagName("txtdatapara");
			for (var j=0;j<txtDataParas.length;j++){
				var itm = txtDataParas[j]
				var pname = itm.getAttribute("name");	
				var pleft = itm.getAttribute("xcol");	
				var ptop = itm.getAttribute("yrow");	
				var pdval = itm.getAttribute("defaultvalue");	
				var ppval = itm.getAttribute("printvalue");	
				var pfbold = itm.getAttribute("fontbold");	//false
				var pfname = itm.getAttribute("fontname");
				var pfsize = itm.getAttribute("fontsize");
				var pcolor = itm.getAttribute("fontcolor");
				var pisqrcode = itm.getAttribute("isqrcode");
				var pbarcodetype = itm.getAttribute("barcodetype");
				var pqrcodeversion = itm.getAttribute("qrcodeversion");
				var pval = inparaObj[pname]||pdval;
				var pangle = itm.getAttribute("angle");
				var isshowtext = itm.getAttribute("isshowtext");
				var pheight = "800";
				if (invOrient=="Z"){pheight="30";}
				var pwidth = "800";
				try{
					//=null
					if (itm.getAttribute("height")>0) pheight = itm.getAttribute("height");
					if (itm.getAttribute("width")>0) pwidth = itm.getAttribute("width");
				}catch(e){}
				//LODOP.SET_PRINT_STYLEA(0,"AngleOfPageInside",90) //angle
				var printItem = {type:'text',y:ptop, x:pleft, width:pwidth, height:pheight, value:pval, angle:pangle, rePrtHeadFlag:xmlTxtDataRePrtHeadFlag,fcolor:pcolor};
				if (pisqrcode=="true"){
					if (pval!=""){
						printItem.isqrcode = pisqrcode;
						printItem.qrcodeversion = pqrcodeversion;
						LODOP_PrintItem(LODOP, printItem);
					}
				}else if (("undefined"!=typeof pbarcodetype) &&( pbarcodetype!=null)){
					if (pval!=""){
						printItem.barcodetype = pbarcodetype;
						printItem.isshowtext = isshowtext;
						LODOP_PrintItem(LODOP,printItem);
					}					
				}else{
					//console.log(pleft+"mm"+","+ptop+"mm"+",pfbold="+pfbold+",80cm"+","+"5mm"+","+pval);
					printItem.LetterSpacing = otherCfg.LetterSpacing;
					printItem.fsize = pfsize;
					printItem.fname = pfname;
					printItem.fbold = pfbold;
					printItem.isshowtext = isshowtext;
					LODOP_PrintItem(LODOP,printItem);
				}
			}
		}
	}
}
///按照TEXT模式打印List数据
function LODOP_CreateListByText(LODOP,invXMLDoc,inpara,inlist,jsonArr,otherCfg){
	var c2 = String.fromCharCode(2);
	var c1 = String.fromCharCode(1);
	var xmlListData = invXMLDoc.getElementsByTagName("ListData");
	if (xmlListData && xmlListData.length>0){  
		var xmlYStep = parseFloat( xmlListData[0].getAttribute("YStep") );
		var xmlPageRows = parseInt( xmlListData[0].getAttribute("PageRows"));
		var xmlBackSlashWidth = parseInt( xmlListData[0].getAttribute("BackSlashWidth") );
		var rowHeight = xmlYStep;
//		<ListData PrintType="List" YStep="9.524" XStep="0" CurrentRow="1" PageRows="6" RePrtHeadFlag="Y" BackSlashWidth="150">
//		<Listdatapara name="Listdatapara0" xcol="17.196" yrow="36.772" defaultvalue="第一列" printvalue="" fontbold="false" fontname="宋体" fontsize="11" />
//		<Listdatapara name="Listdatapara1" xcol="42.063" yrow="36.772" defaultvalue="第二列" printvalue="" fontbold="false" fontname="宋体" fontsize="12" />
//		<Listdatapara name="Listdatapara2" xcol="71.958" yrow="36.772" defaultvalue="第三列" printvalue="" fontbold="false" fontname="宋体" fontsize="12" />
//		<Listdatapara name="listItem3" xcol="106.085" yrow="42.063" defaultvalue="第四列" printvalue="" fontbold="false" fontname="宋体" fontsize="11" />
//		<Listdatapara name="listItem4" xcol="137.302" yrow="42.328" defaultvalue="第五列" printvalue="" fontbold="false" fontname="宋体" fontsize="11" />
//		<Listdatapara name="listItem5" xcol="169.048" yrow="43.651" defaultvalue="第六列" printvalue="" fontbold="false" fontname="宋体" fontsize="11" />
//		</ListData>
		var tableTop = 0,tableLeft=0, colsArr=[];
		var Listdataparas = xmlListData[0].getElementsByTagName("Listdatapara");
		for(var j=0;j<Listdataparas.length;j++){
			var itm = Listdataparas[j];
			var pname = itm.getAttribute("name");	
			var pleft = itm.getAttribute("xcol");	
			var ptop = itm.getAttribute("yrow");	
			var pdval = itm.getAttribute("defaultvalue");	
			var ppval = itm.getAttribute("printvalue");	
			var pfbold = itm.getAttribute("fontbold");	//false
			var pfname = itm.getAttribute("fontname");
			var pfsize = itm.getAttribute("fontsize");
			var pfcolor = itm.getAttribute("fontcolor");
			var pcoltype = itm.getAttribute("coltype")||"text";
			var pwidth = itm.getAttribute("width")||"";
			var pheight = itm.getAttribute("height")||"";
			var pbarcodetype = itm.getAttribute("barcodetype")||"";
			var pisshowtext = itm.getAttribute("isshowtext")||"";
			var pqrcodeversion = itm.getAttribute("qrcodeversion")||"";
			colsArr.push({
							pname:pname,
							pleft:parseFloat(pleft),
							ptop:parseFloat(ptop),
							pdval:pdval,
							ppval:ppval,
							pfbold:pfbold,pfcolor:pfcolor,
							pfname:pfname,
							pfsize:parseFloat(pfsize),
							pcoltype:pcoltype, pwidth:pwidth, pheight:pheight, pbarcodetype:pbarcodetype, pisshowtext:pisshowtext, pqrcodeversion:pqrcodeversion
						});
			if (tableTop>0) tableTop=Math.min(tableTop,ptop);
			else  tableTop=ptop;
			if (tableLeft>0) tableLeft=Math.min(tableLeft,pleft);
			else  tableLeft=pleft;
			
		}
		var inlistArr = inlist.split(c2);
		var inlistDataArr = [],tableStr="",inlistArrValidCount=0;
		var currRowNo=0,currPageRowNo=0,currPage=0;
		for(var i=0; i<inlistArr.length; i++){
			if(inlistArr[i]!=""){
				currRowNo++;  //当前总行号
				currPage=Math.floor((currRowNo-1)/xmlPageRows)+1;  //当前页数
				currPageRowNo=((currRowNo-1)%xmlPageRows)+1;  //当前页当前行
				
				var dataArr = inlistArr[i].split("^");
				var padTop=currPageRowNo*xmlYStep;  
				
				for(var j=0;j<colsArr.length;j++){
					var col=colsArr[j];
					if (typeof dataArr[j]=="undefined") var pval=col.ppval;
					else  var pval=dataArr[j];
					
					if (""==col.pwidth){
						if ('undefined'!=typeof otherCfg && otherCfg.tdnowrap==false){
							if ('undefined' != typeof colsArr[j+1]) {
								pwidth = colsArr[j+1].pleft - col.pleft;
							}
						}else{
							pwidth = 800;
						}
					}else{
						pwidth = col.pwidth;
					}
					if (""==col.pheight){
						pheight = rowHeight;
					}else{
						pheight = col.pheight;
					}
					var prtItem = {
						type:'text',y:(col.ptop+padTop), x:col.pleft,  width:pwidth,  height:pheight,  value:pval,  
						fsize:col.pfsize,  fname:col.pfname,fbold:col.pfbold,fcolor:col.pfcolor 
					};
					if (typeof dataArr[j]!="undefined"&&dataArr[j].indexOf(c1)>-1){ // 1234_c1_qrcode ^ c:\1.jpg_c1_img ^ 1234_c1_barcode:128C 
						var ptype = dataArr[j].split(c1)[1];
						if (ptype=='img'){
							prtItem.type = ptype;
							prtItem.value = dataArr[j].split(c1)[0];
						}else if (ptype.indexOf("barcode:")>-1){
							prtItem.barcodetype = ptype.split(':')[1];
							prtItem.height = rowHeight;
							if ('undefined' != typeof colsArr[j+1]) {
								prtItem.width = colsArr[j+1].pleft - col.pleft;
							}else{
								prtItem.width = "30";
							}
							prtItem.value = dataArr[j].split(c1)[0];
						}
					}else{  //colitem - coltype
						if (col.pcoltype=="img"){
							prtItem.type = col.pcoltype;
						}else if (col.pcoltype=="barcode"){
							prtItem.barcodetype = col.pbarcodetype;
							prtItem.isshowtext = col.pisshowtext;
						}else if (col.pcoltype=="qrcode"){
							prtItem.isqrcode = "true";
							prtItem.qrcodeversion = col.pqrcodeversion;
						}
					}
					LODOP_PrintItem(LODOP, prtItem);
				}
				if ( (currPageRowNo==xmlPageRows)&&(i!=inlistArr.length-1)){
					LODOP.NEWPAGE();
				}
				if ( (i==inlistArr.length-1) && ( currPageRowNo!=xmlPageRows) && (xmlBackSlashWidth>0) ){ //到了最后 且不满行 且 斜线宽度大于0
					var slash2Top =  parseInt(tableTop) + ((currPageRowNo+1)*rowHeight);
					var slash2Left = parseInt(tableLeft) + parseInt(xmlBackSlashWidth);
					var slash1Top = parseInt(tableTop)+parseInt((xmlPageRows+1)*rowHeight);
					var slash1Left = tableLeft ;
					LODOP.ADD_PRINT_LINE(slash2Top+"mm",slash2Left+"mm",slash1Top+"mm",slash1Left+"mm",0,1); //0=实线,1=线宽
				}
				
			}
		}
	}
}
function LODOP_CreateList(LODOP,invXMLDoc,inpara,inlist,jsonArr){
	var c2 = String.fromCharCode(2);
	var xmlListData = invXMLDoc.getElementsByTagName("ListData");
	if (xmlListData && xmlListData.length>0){
		var xmlYStep = xmlListData[0].getAttribute("YStep");
		var xmlPageRows = xmlListData[0].getAttribute("PageRows");
		var xmlBackSlashWidth = xmlListData[0].getAttribute("BackSlashWidth");
		var rowHeight = xmlYStep;
		var tableOneHeight = parseInt(rowHeight*xmlPageRows); //一页表格高度
		// PrintType="List" YStep="4.762" XStep="0" CurrentRow="1" PageRows="20" RePrtHeadFlag="Y" BackSlashWidth="150"
		var tableTop = 0,tableLeft=0, colsArr=[];
		var Listdataparas = xmlListData[0].getElementsByTagName("Listdatapara");
		for(var j=0;j<Listdataparas.length;j++){
			var itm = Listdataparas[j];
			var pname = itm.getAttribute("name");	
			var pleft = itm.getAttribute("xcol");	
			var ptop = itm.getAttribute("yrow");	
			var pdval = itm.getAttribute("defaultvalue");	
			var ppval = itm.getAttribute("printvalue");	
			var pfbold = itm.getAttribute("fontbold");	//false
			var pfname = itm.getAttribute("fontname");
			var pfsize = itm.getAttribute("fontsize");
			if(j==0){tableTop=ptop;tableLeft=pleft;}
			colsArr.push({left:pleft,fbold:pfbold,fsize:pfsize,fname:pfname});
		}
		colsArr.sort(function(a,b){return a.left-b.left});
		for(var j=0;j<colsArr.length-1;j++){
			colsArr[j].width = colsArr[j+1].left - colsArr[j].left;
		}
		//inlist拆分
		var inlistArr = inlist.split(c2);
		var inlistDataArr = [],tableStr="",inlistArrValidCount=0;
		for(var i=0; i<inlistArr.length; i++){
			if(inlistArr[i]!=""){
				var tr='<tr>';
				var arr = inlistArr[i].split("^");
				for(var j=0;j<arr.length;j++){
					if (colsArr.length>j){
						tr += '<td style="';
						if (colsArr[j]["width"]){tr+="width:"+(colsArr[j]["width"]/0.68*1).toFixed(1)+"mm;";}
						if (colsArr[j]["fname"]!=""){tr+="font-family:'"+colsArr[j]["fname"]+"';";}
						if (colsArr[j]["fsize"]){tr+="font-size:"+(colsArr[j]["fsize"]/0.68).toFixed(1)+"pt;";}
						if (colsArr[j]["fbold"]=="true"){tr+='font-weight:700;';}
						tr += '" >'+arr[j]+'</td>'
					}else{
						tr+='<td>'+arr[j]+"</td>";
					}
				}
				if (colsArr.length>arr.length){ //如果xml定义中多出列加上空内容列,解决最后一列宽度问题
					tr+='<td></td>';
				}
				tr+="</tr>";
				tableStr += tr;
				inlistArrValidCount++;
				if (((inlistArrValidCount%xmlPageRows)==0) || i==(inlistArr.length-1)) {
					LODOP.ADD_PRINT_TABLE(tableTop+"mm",tableLeft+"mm","2000mm",tableOneHeight+"mm","<table cellpadding='0' padding='0' margin='0' border='0'>"+tableStr+"</table>");
					if (i!=(inlistArr.length-1)) {LODOP.NEWPAGE();}
					
					tableStr="";
				}
			}
		}	
		if (inlistArr.length>0 && xmlBackSlashWidth>0){ // && invOrient!="Z"){
			if ((inlistArrValidCount%xmlPageRows)!=0){ //没打满才打印slash
				var remainRow = inlistArrValidCount%xmlPageRows;
				var slash2Top =  parseInt(tableTop) + (remainRow*rowHeight);
				var slash2Left = parseInt(tableLeft) + parseInt(xmlBackSlashWidth);
				var slash1Top = parseInt(tableTop)+parseInt(tableOneHeight);
				var slash1Left = tableLeft ;
				/*
				var tableCount = Math.ceil(inlistArrValidCount / xmlPageRows); //会打印出n张
				var tableTotalMaxHeight = parseInt(tableCount * tableOneHeight); //n张表格的高度
				var tableTotalHeight = parseInt(inlistArrValidCount * rowHeight) ; //打印数据的总高度
				var slash2Top = parseInt(tableTop)+parseInt(tableTotalHeight);  //表格结束处top
				var slash2Left = parseInt(tableLeft) + parseInt(xmlBackSlashWidth);
				var slash1Top = parseInt(tableTop)+parseInt(tableTotalMaxHeight);
				var slash1Left = tableLeft ;*/
				
				LODOP.ADD_PRINT_LINE(slash2Top+"mm",slash2Left+"mm",slash1Top+"mm",slash1Left+"mm",0,1); //0=实线,1=线宽
				//var lastTop = parseFloat(LODOP.GET_VALUE("ItemTop",'last')); //只有设计时才能用
				//var lastLeft = parseFloat(LODOP.GET_VALUE("ItemLeft",'last'));
			}
		}
	}
}
// link只从json中取
function LODOP_CreateLink(LODOP,inv,inpara,inlist,jsonArr){
	// jsonArr!="" jsonArr为xmlObj时,在IE6下会报"对象不支持此属性或方法",修改成jsonArr!==""即可,业务调用时把xmlObj传到jsonAr中了
	if (arguments.length>4 && jsonArr!==null&& jsonArr!=="" && "undefined"!==typeof jsonArr){
		for(var j = 0; j < jsonArr.length; j++){
		    var item = jsonArr[j];
			if(item["type"]){
				if (item["type"].toLowerCase()=="linkedqrcode"){
					LODOP.ADD_PRINT_BARCODE(item['y']+"mm",item['x']+"mm",item['width']+"mm",item['height']+"mm","QRCode",item['value']);
					LODOP.SET_PRINT_STYLEA(0,"LinkedItem",item['linkedItem']); 
				}else if (item["type"].toLowerCase()=="linkedtext"){
					LODOP.ADD_PRINT_TEXT(item['y']+"mm",item['x']+"mm",item['width']+"mm",item['height']+"mm",item['value']);
					LODOP.SET_PRINT_STYLEA(0,"LinkedItem",item['linkedItem']); 
				}		
			}
		}		
	}
}
/*大小与方向*/
function LODOP_CreateInv(LODOP,invXMLDoc){
	var rtn = {notFindPrtDevice:false};
	var invAttr = invXMLDoc.attributes;
	var invHeight = invAttr.getNamedItem("height").value;
	var invWidth = invAttr.getNamedItem("width").value;
	var invOrient = "X"; 
	if (invAttr.getNamedItem("LandscapeOrientation")){ //老版设计器,默认情况下没有此属性
		invOrient = invAttr.getNamedItem("LandscapeOrientation").value; //X=纵向,Y=横向
	}
	//var invPrtDirect = invAttr.getNamedItem("PrtDirection").value; //Y----无效
	var invPrtPaperSet = invAttr.getNamedItem("PrtPaperSet").value; //WIN
	var invPrtDevice = invAttr.getNamedItem("PrtDevice").value; //xps
	var invPrtPage = invAttr.getNamedItem("PrtPage").value; //A5
	//var invPrtDesc = invAttr.getNamedItem("PaperDesc").value; //----无效
	// 2021-05-20 header ,footer
	//var invPageHeader = invAttr.getNamedItem("PageHeader").value;
	var invPageFooterVal = "",invNotFindPrtDeviceVal="",invDuplexVal="";
	var invPageFooter = invAttr.getNamedItem("PageFooter");
	if (invPageFooter) invPageFooterVal = invPageFooter.value;
	var invNotFindPrtDevice = invAttr.getNamedItem("NotFindPrtDevice");
	if (invNotFindPrtDevice) invNotFindPrtDeviceVal = invNotFindPrtDevice.value;
	var invDuplex = invAttr.getNamedItem("Duplex");
	if (invDuplex) invDuplexVal = invDuplex.value;	
	
	var intOrient=1 ;//默认1=纵向
	if (invOrient=="Y") intOrient=2;
	else if(invOrient=="X") intOrient=1;
	else if(invOrient=="Z"){intOrient=3;/*按内容高度算*/}
	if (invPrtPaperSet=="HAND"){
		var lodopPageWidth = invWidth*10+"mm"
		var lodopPageHeight = invHeight*10+"mm";
		var lodopPageName = "";	
	}else{
		var lodopPageWidth = 0 //表示无效
		var lodopPageHeight = 0;
		var lodopPageName = invPrtPage;
	}
	if (invPageFooterVal!=""){
		LODOP.ADD_PRINT_TEXT("92mm","8mm","40mm","10mm",invPageFooterVal);
		LODOP.SET_PRINT_STYLEA(0,"ItemType",2);
		LODOP.SET_PRINT_STYLEA(0,"Horient",2);//0-左边距锁定 1-右边距锁定 2-水平方向居中 3-左边距和右边距同时锁定-中间拉伸
		LODOP.SET_PRINT_STYLEA(0,"Vorient",1);//0-上边距锁定 1-下边距锁定 2-垂直方向居中 3-上边距和下边距同时锁定-中间拉伸
	}
	if (invDuplexVal!=""){
		LODOP.SET_PRINT_MODE("PRINT_DUPLEX",invDuplexVal);
	}
	//alert(intOrient+","+lodopPageWidth+","+lodopPageHeight+","+lodopPageName);
	LODOP.SET_PRINT_PAGESIZE(intOrient,lodopPageWidth,lodopPageHeight,lodopPageName);
	//LODOP.SET_PRINT_PAGESIZE(3,1385,45,""); //这里3表示纵向打印且纸高“按内容的高度”；1385表示纸宽138.5mm；45表示页底空白4.5mm
	if (invPrtDevice!=""){
		invPrtDevice = invPrtDevice.toUpperCase();
		var myPrtDeviceIndex = -1;
		// containt invPrtDevice
		for(var i=0;i< LODOP.GET_PRINTER_COUNT(); i++){
			if (LODOP.GET_PRINTER_NAME(i).toUpperCase().indexOf(invPrtDevice)>-1){ 
				myPrtDeviceIndex = i;
				break;
			}
		}
		//alert(invPrtDevice+" printer index="+myPrtDeviceIndex);
		if (myPrtDeviceIndex==-1 && invNotFindPrtDeviceVal=="SELF"){
			//LODOP.SELECT_PRINTER(false);
			rtn.notFindPrtDevice = true;
		}else{
			LODOP.SET_PRINTER_INDEX(myPrtDeviceIndex);
		}
	}else{
		LODOP.SET_PRINTER_INDEX(-1); //set default printer
	}
	return rtn;
}
/**
*@author : wanghc 
*@date : 2018-09-29
* 通这xml模板生成lodop打印内容

*@param : {DLLObject} LODOP对象  getLodop()获得
*
*@param :  mystr --- xml模板内容
*
*@param : {String}   inpara文本数据   $c(2)分割键与值, ^为多组键值分割符. 
*          如: name_$c(2)_王二^patno_$c(2)_000009
*
*@param : {String}   inlist列表数据	^分割列, $c(2)为行间分割符. 
*          如: DrugName^Price^DrugUnit^Qty^PaySum_$c(2)_DrugName2^Price2^DrugUnit2^Qty2^PaySum2
*
*@param : {Object} jsonArr 增加的自定义打印数据   可以不传, 2017-10-25 可以修改打印机
*          如: [{type:"invoice",PrtDevice:"pdfprinter"},{type:"line",sx:1,sy:1,ex:100,ey:100},{type:"text",name:"patno",value:"0009",x:10,y:10,isqrcode:true,lineHeigth:5}]
*              text类型name,value,x,y为必填,
*@param : {String}  reportNote  打印名称
*
*@param : {Object}  otherCfg  其它配置项  otherCfg.printListByText true以text形式打印list数据 默认false
*
*/
function DHC_CreateByXMLStr(LODOP,mystr,inpara,inlist,jsonArr,reportNote,otherCfg){
	var rtn = {};
	otherCfg=otherCfg||{};
	if ((LODOP==null)||(typeof(LODOP.VERSION)=="undefined" && ("undefined"==typeof EnableLocalWeb || 0==EnableLocalWeb))){ //("undefined"==typeof isIECore || isIECore))){
		return -404 ;
	}
	// inpara拆成对象
	var c2 = String.fromCharCode(2);
	var inparaArr = inpara.split('^');
	var myNewInpara = "";
	if (inpara!=""){
		for(var i=0; i<inparaArr.length; i++){
			var arr = inparaArr[i].split(c2);
			if (myNewInpara=="") {myNewInpara=arr[0]+c2+evalXMLVal(arr[1]);}
			else{myNewInpara +="^"+arr[0]+c2+evalXMLVal(arr[1]);}
		}
		inpara = myNewInpara;
	}
	//try{
		if (arguments.length>4 && jsonArr!==null&& jsonArr!=="" && "undefined"!==typeof jsonArr){
			if (jsonArr.length>0 && jsonArr[0].type.toLowerCase()=="invoice"){
				var invObj = jsonArr[0];
				for (var p in invObj){
					if (p!="type"){
						mystr = mystr.replace(new RegExp(p+'=".*?"','mi'), function(){
							return p+"=\""+invObj[p]+"\"";
						})
					}
				}
			}
			var itemJson="", exLineXml = "",exTextXml="",exImgXml="";
			for(var j = 0; j < jsonArr.length; j++){
			    itemJson = jsonArr[j];
				if(itemJson["type"]){
					if (itemJson.value){ itemJson.value = evalXMLVal(itemJson["value"]);}
					if (itemJson["type"].toLowerCase()=="invoice"){
					}else if (itemJson["type"].toLowerCase()=="line"){
						exLineXml += '<PLine BeginX="'+itemJson.sx+'" BeginY="'+itemJson.sy+'" EndX="'+itemJson.ex+'" EndY="'+itemJson.ey+'"></PLine>'
					}else if (itemJson["type"].toLowerCase()=="text"){
						if (itemJson["isqrcode"]){
							exTextXml += '<txtdatapara name="'+itemJson.name+'" xcol="'+itemJson.x+'" yrow="'+itemJson.y+'" isqrcode="'+itemJson.isqrcode+'" width="'+itemJson.width+'" height="'+itemJson.height+'" fontsize="'+(itemJson.fontsize||12)+'" fontbold="'+(itemJson.fontbold||"false")+'" fontname="'+(itemJson.fontname||"宋体")+'" defaultvalue="'+(itemJson.value)+'" printvalue="'+(itemJson.value)+'" qrcodeversion="'+(itemJson.qrcodeversion||"")+'" ></txtdatapara>'
						}else{
							exTextXml += '<txtdatapara name="'+itemJson.name+'" xcol="'+itemJson.x+'" yrow="'+itemJson.y+'" '
							if (itemJson.width>0) exTextXml +='width="'+itemJson.width+'" ';
							if (itemJson.height>0) exTextXml +='height="'+itemJson.height+'" ';
							if (itemJson["barcodetype"]) exTextXml +='barcodetype="'+itemJson["barcodetype"]+'" ';
							exTextXml += 'fontsize="'+(itemJson.fontsize||12)+'" fontbold="'+(itemJson.fontbold||"false")+'" fontname="'+(itemJson.fontname||"宋体")+'" defaultvalue="'+(itemJson.value)+'" printvalue="'+(itemJson.value)+'"></txtdatapara>'
						}
					}else if (itemJson["type"].toLowerCase()=="img"){
						exImgXml += '<PICdatapara name="'+itemJson.name+'" xcol="'+itemJson.x+'" yrow="'+itemJson.y+'" width="'+itemJson.width+'" height="'+itemJson.height+'" defaultvalue="'+(itemJson.value)+'" printvalue="" />'
					}
				}
			}
			//console.log(exLineXml+","+exTextXml);
			var txtDataIndex = mystr.indexOf("</TxtData>");
			mystr = mystr.slice(0,txtDataIndex)+exTextXml+mystr.slice(txtDataIndex);
			var lineDataIndex = mystr.indexOf("</PLData>");
			mystr = mystr.slice(0,lineDataIndex)+exLineXml+mystr.slice(lineDataIndex);
			var imgDataIndex = mystr.indexOf("</PICData>");
			mystr = mystr.slice(0,imgDataIndex)+exImgXml+mystr.slice(imgDataIndex);
			//console.log(mystr);
		}
		inpara=DHCP_TextEncoder(inpara)
		inlist=DHCP_TextEncoder(inlist)
		//一个xml模板多次打印但希望在同一次任务中,多次调用当前方法 2018-10-31 
		if ("undefined"!=typeof reportNote){
			if (LODOP.strHostURI){  //LODOP.webskt
				if (LODOP.ItemDatas.count==0){
					//LODOP.PRINT_INIT(reportNote); //一次任务,不用多次init。
					LODOP.PRINT_INITA(0,0,"100mm","100mm",reportNote); //2021-05-20 默认纸张与边距，后面重设置，为了实现底部眉脚
				}
			}else if(LODOP.GET_VALUE("ItemCount",1)==0) {
				//LODOP.PRINT_INIT(reportNote); //一次任务,不用多次init。
				LODOP.PRINT_INITA(0,0,"100mm","100mm",reportNote); //2021-05-20
			}
		}
		
		/*var docobj=new ActiveXObject("MSXML2.DOMDocument.4.0");
		//docobj.async = false;    //
		var rtn=docobj.loadXML(mystr);*/
		var docobj=DHC_parseXml(mystr);
		if (docobj){
			if (docobj.parsed){
				//LODOP.SET_PRINT_MODE("FULL_WIDTH_FOR_OVERFLOW",true);    //宽度溢出缩放
				LODOP.SET_LICENSES('\u4E1C\u534E\u533B\u4E3A\u79D1\u6280\u6709\u9650\u516C\u53F8',"4EF6E3D5AB0D478F5A07D05CDDDE2365","\u6771\u83EF\u91AB\u70BA\u79D1\u6280\u6709\u9650\u516C\u53F8","7C4A2B70D17D01CCD5CB2A3A6B4D3200");
	        		LODOP.SET_LICENSES("THIRD LICENSE","","DHC Medical Science & Technology Co., Ltd.","604523CF08513643CB90BACED8EFF303");
				var inv = docobj.documentElement.childNodes[0];
				var createInvRtn = {};
				if (LODOP.strHostURI){  //LODOP.webskt
					if (LODOP.ItemDatas.count==0){
						createInvRtn = LODOP_CreateInv(LODOP,inv);
					}
				}else if(LODOP.GET_VALUE("ItemCount",1)==0) {
					createInvRtn = LODOP_CreateInv(LODOP,inv);
				}
				rtn.notFindPrtDevice = createInvRtn.notFindPrtDevice;
				//lodop推荐再打印图片
				LODOP_CreateImg(LODOP,inv,inpara,inlist,jsonArr,otherCfg);

				// 一次任务,纸张不会多种 //CLodop返回有值 20200319去掉判断
				// if (LODOP.GET_VALUE("ItemCount",1)==0) LODOP_CreateInv(LODOP,inv);
				//lodop推荐先打印线
				LODOP_CreateLine(LODOP,inv,inpara,inlist,jsonArr,otherCfg);
				
				//lodop打印文本
				LODOP_CreateTxt(LODOP,inv,inpara,inlist,jsonArr,otherCfg);

				//lodop打印列表
				if (otherCfg.printListByText==true){
					LODOP_CreateListByText(LODOP,inv,inpara,inlist,jsonArr,otherCfg);
				}else{
					LODOP_CreateList(LODOP,inv,inpara,inlist,jsonArr);
				}
				
				//LODOP.ADD_PRINT_TEXT(15,200,200,25,"制表人:guest");
				//LODOP.SET_PRINT_STYLEA(0,"LinkedItem-1); 		",-1); 
				LODOP_CreateLink(LODOP,inv,inpara,inlist,jsonArr);
			}
		}
	/*}catch(e){
		alert(e.message);
		return;
	}*/
	return rtn;
}
///移除对象中的text节点
function DHC_removeTextNode(doc) {
	if (!doc.childNodes) return;
	for (var i = 0; i < doc.childNodes.length; i++) {
		var node = doc.childNodes[i];
		if (node.nodeName == "#text") {
			doc.removeChild(node);
			i--;
		} else {
			DHC_removeTextNode(node);
		}
	}
}
///解析xml字符串为对象
function DHC_parseXml(strXml){
	if (!!window.ActiveXObject || "ActiveXObject" in window){
		var docobj=new ActiveXObject("MSXML2.DOMDocument.4.0");
		//docobj.async = false;    //
		var rtn=docobj.loadXML(strXml);
		if (rtn) return docobj;
	}else{  //Chrome 
		var parser=new DOMParser();
		var docobj=parser.parseFromString(strXml,"text/xml");
		DHC_removeTextNode(docobj);
		docobj.parsed=true;  //后面有判断docobj.parsed  强行赋值
		return docobj;
	}
	return null;
}
function DHC_CreateByXMLName(LODOP,XMLName,inpara,inlist,jsonArr,otherCfg){
	//var mystr = tkMakeServerCall("web.DHCXMLPConfig","ReadXmlByName",XMLName);
	//DHC_CreateByXMLStr(LODOP,mystr,inpara,inlist,jsonArr,XMLName);
}
function DHC_CreateByXML(LODOP,inpara,inlist,jsonArr,reportNote,otherCfg){
	var mystr="";
	for (var i= 0; i<PrtAryData.length;i++){
		mystr=mystr + PrtAryData[i];
	}
	return DHC_CreateByXMLStr(LODOP,mystr,inpara,inlist,jsonArr,reportNote,otherCfg)
}
/*
入参见DHC_CreateByXML方法
@return 
成功 返回打印内容保存图片后对应的BASE64字符串
失败 返回""
*/
function DHC_GetBase64ByLodop(LODOP,inpara,inlist,jsonArr,reportNote,otherCfg){
	var mystr="";
	for (var i= 0; i<PrtAryData.length;i++){
		mystr=mystr + PrtAryData[i];
	}
	return DHC_GetBase64ByLodopByStr(LODOP,mystr,inpara,inlist,jsonArr,reportNote,otherCfg);
}
/* myxmlstr-->base64 */
function DHC_GetBase64ByLodopByStr(LODOP,mystr,inpara,inlist,jsonArr,reportNote,otherCfg){
	if ((LODOP==null)||(typeof(LODOP.VERSION)=="undefined" && ("undefined"==typeof EnableLocalWeb || 0==EnableLocalWeb))){
		return -404 ;
	}
	LODOP.PRINT_INIT(""); //清除上次打印元素
	DHC_CreateByXMLStr(LODOP,mystr,inpara,inlist,jsonArr,reportNote,otherCfg);
	LODOP.SET_SAVE_MODE("FILE_PROMPT","0");
	LODOP.SET_SAVE_MODE("SAVEAS_IMGFILE_EXENAME",".png");
	LODOP.SET_SAVE_MODE("RETURN_FILE_NAME","1");
	var diskName = "D"; //LODOP.GET_SYSTEM_INFO("DiskDrive.1.Label"); //有电脑取的是1121i221_12
	if (LODOP.SAVE_TO_FILE(diskName+":\dhclodop.png")){
		return LODOP.FORMAT("FILE:EncodeBase64",diskName+":\dhclodop.png");
	}else{
		alert("\u4FDD\u5B58\u6253\u5370\u56FE\u7247\u5931\u8D25!");
		return "";
	}
	//LODOP.FORMAT("FILE:WAVE,c:/lodoptest.wav","Hello,您好！")
	return ;
}

/**
*@author : wanghc 

*@param : {DLLObject} LODOP 
*		   expample: var LODOP = getLodop();

*@param : {String}   inpara 
*          expample: name_$c(2)_zhangsha^patno_$c(2)_000009
*
*@param : {String}   inlist 
*         expample: DrugName^Price^DrugUnit^Qty^PaySum_$c(1)_img_$c(2)_DrugName2^Price2^DrugUnit2^Qty2^PaySum2
*
*@param : {Object} jsonArr
*         expample: [
					{type:"invoice",PrtDevice:"pdfprinter"},
					{type:"line",sx:1,sy:1,ex:100,ey:100},
					{type:"text",name:"patno",value:"1024988919",x:10,y:10,isqrcode:true,lineHeigth:5},
					{type:"text",name:"invno",value:"1024988919",x:140,y:12,width:24,height:11,barcodetype:"128C"}
					]
*        <text>=>name,value,x,y is require
*@param : {String}  reportNote     print task name,  example: PrintText
*
*@param : {Object}  otherCfg  
          example: {LetterSpacing:-2,printListByText:false,tdnowrap:true, preview:0}
		  
		  tdnowrap:true ---> not break line 
*
*/
function DHC_PrintByLodop(LODOP,inpara,inlist,jsonArr,reportNote,otherCfg){
	var rtn = "";
	if ((LODOP==null)||(typeof(LODOP.VERSION)=="undefined" &&("undefined"==typeof EnableLocalWeb || 0==EnableLocalWeb))){
		return -404;
	}
	otherCfg = otherCfg||{};
	/* 打印完后,不刷新界面再打印时，走打印机不对---add 2018-12-11*/
	LODOP.PRINT_INIT(""); /*清除上次打印元素*/
	var createByXMLRtn = DHC_CreateByXML(LODOP,inpara,inlist,jsonArr,reportNote,otherCfg);
	
	if ("undefined"!=typeof otherCfg.preview && 1==otherCfg.preview) {
		LODOP.SET_SHOW_MODE("LANDSCAPE_DEFROTATED",true);
		rtn = LODOP.PREVIEW();
	}else{
		if ("object"==typeof createByXMLRtn && createByXMLRtn.notFindPrtDevice){
			rtn = LODOP.PRINTA();
		}else{
			rtn = LODOP.PRINT();
		}
	}
	return rtn;
}
/**
通过打印机名获得打印机索引,查询是包含查找
@param : {String} 打印机名称
@return : {Int} 打印机索引,从0开始。如果未找到返回-1
*/
function GetPrintIndexByLodop(LODOP,printName){
	printName = printName.toUpperCase();
	for(var i=0;i<LODOP.GET_PRINTER_COUNT(); i++){
		if (LODOP.GET_PRINTER_NAME(i).toUpperCase().indexOf(printName)>-1){ 
			return i;
		}
	}
	return -1
}
/**
*@author : wanghc 

*@param : {DLLObject} LODOP 
*		   expample: var LODOP = getLodop();

*@param : {String}   inpara 
*          expample: name_$c(2)_zhangsha^patno_$c(2)_000009
*
*@param : {String}   inlist 
*         expample: DrugName^Price^DrugUnit^Qty^PaySum_$c(1)_img_$c(2)_DrugName2^Price2^DrugUnit2^Qty2^PaySum2
*
*@param : {Object} jsonArr
*         expample: [
					{type:"invoice",PrtDevice:"pdfprinter"},
					{type:"line",sx:1,sy:1,ex:100,ey:100},
					{type:"text",name:"patno",value:"1024988919",x:10,y:10,isqrcode:true,lineHeigth:5},
					{type:"text",name:"invno",value:"1024988919",x:140,y:12,width:24,height:11,barcodetype:"128C"}
					]
*        <text>=>name,value,x,y is require
*@param : {String}  reportNote     print task name,  example: PrintText
*
*@param : {Object}  otherCfg  
          example: {LetterSpacing:-2,printListByText:false,tdnowrap:true, preview:0}
		  
		  tdnowrap:true ---> not break line 
*
*/

/**
通过打印机名获得打印机索引,查询是包含查找
@param : {String} 打印机名称
@return : {Int} 打印机索引,从0开始。如果未找到返回-1
*/
function GetPrintIndexByLodop(LODOP,printName){
	printName = printName.toUpperCase();
	for(var i=0;i<LODOP.GET_PRINTER_COUNT(); i++){
		if (LODOP.GET_PRINTER_NAME(i).toUpperCase().indexOf(printName)>-1){ 
			return i;
		}
	}
	return -1
}
function OSPPrintByLodop(PrintType,PrintID){
	try {
		if(PrintType == ""){
			PayServ_SaveBDInfo('PrintType','打印类型不能为空','',"6666"); 
			OSPAlert("","打印类型不能为空","提示");
			return;
		}
		//PayServ_SaveBDInfo('Begain','开始打印','',"6666"); 
		// 1.
		var XmlConfigInput = "<Request><TradeCode>GetXMLConfig</TradeCode><XMLName>" + 'DHCOPBillDirect' + "</XMLName></Request>";
		var XmlConfig = tkMakeServerCall(XmlConfigInput,"N");
		if(XmlConfig && XmlConfig == ""){
			PayServ_SaveBDInfo('GetXMLConfig','获取打印模板失败','',"6666"); 
			OSPAlert("","获取打印模板失败","提示");
			return;
		}
		XmlConfig = DHCP_TextEncoder(XmlConfig);
		PrtAryData[0] = XmlConfig;
		// 2.
		var PrintDataInput = "<Request><UserId>" + OSPGetParentVal('client_dict','ss_eqlistd_eqcode') + "</UserId><TradeCode>GetPrtData</TradeCode><PrtType>" + PrintType + "</PrtType><PrintID>" + PrintID +  "</PrintID></Request>";
		var PrtData = tkMakeServerCall(PrintDataInput,"N");
		PrtData = DHCP_TextEncoder(PrtData);
		if(PrtData && PrtData == ""){
			PayServ_SaveBDInfo('GetPrintData','获取打印数据失败','',"6666"); 
			OSPAlert("","获取打印数据失败","提示");
			return;
		}
		var DataObj = eval("(" + PrtData + ")");
		PayServ_SaveBDInfo('StartPrint','',PrtData,"6666"); 
		var lodopObj = OSPGetParentVal('CPrintObj'); //getLodop();
		var inpara = "";
		var inlist = "";
		var reportNote = "";
		var otherCfg = "";
		DHC_PrintByService(PrtData);
		//var printrtn = DHC_PrintByLodop(lodopObj, inpara, inlist, DataObj, reportNote, otherCfg);			
	} catch (error) {	
		OSPAlert("",error.responseText + ",打印凭条失败，请到窗口打印","提示");
		return;
	}
}
/**
 * 异常数据打印
 * @param {} PrintType 
 * @param {*} PrintID 
 */
function OSPPrintError(PrtData){
	//loadCLodop();
	//setTimeout(function(){
		var lodopObj = OSPGetParentVal('CPrintObj');// getLodop();
		//alert(lodopObj)
		PrtAryData[0] = '<?xml version="1.0" encoding="gb2312" ?><appsetting><invoice LandscapeOrientation="Z" PrtPaperSet="WIN" width="25" height="1" PrtDevice="" PrtPage="" PaperDesc="" XMLClassMethod="" XMLClassQuery=""><ListData PrintType="List" YStep="4.497" XStep="0" CurrentRow="1" PageRows="30" RePrtHeadFlag="N" BackSlashWidth="0"></ListData><PLData RePrtHeadFlag="N"></PLData><PICData RePrtHeadFlag="N"></PICData><TxtData RePrtHeadFlag="N"></TxtData></invoice></appsetting>';
		// 2.
		var inpara = "";
		var inlist = "";
		var reportNote = "";
		var otherCfg = "";
		PrtData = DHCP_TextEncoder(PrtData);
		var input = {
			'TradeCode' : 'GetExceptionPrint',
			'PrtData' : PrtData
		}
		var rtn = CallMethod(input,'',"CallPythonService","N");
		if(rtn.result != 0){
		}else{
			PrtData = rtn.output;
		}
		var DataObj = JSON.parse(PrtData)
		DHC_PrintByLodop(lodopObj, inpara, inlist, DataObj, reportNote, otherCfg);
	//},300)	
}
function DHC_PrintByService(jsonArr){
	//
	//jsonArr = '[{"fontbold":"true","fontname":"","fontsize":12,"height":"40","isqrcode":"","name":"QdNo","type":"text","value":"【无支付】","width":"250","x":1,"y":2},{"fontbold":"true","fontname":"","fontsize":12,"height":"40","isqrcode":"","name":"HospName","type":"text","value":" 天津市第一中心医院","width":"250","x":2,"y":8},{"fontbold":"true","fontname":"","fontsize":16,"height":"40","isqrcode":"","name":"OPPZ","type":"text","value":"自费挂号","width":"250","x":2,"y":15},{"fontbold":"true","fontname":"","fontsize":16,"height":"40","isqrcode":"","name":"OPPZ1","type":"text","value":"凭证","width":"250","x":40,"y":15},{"fontbold":"true","fontname":"","fontsize":16,"height":"40","isqrcode":"","name":"AddreDesc","type":"text","value":"就诊地点：","width":"250","x":2,"y":22},{"fontbold":"","fontname":"","fontsize":16,"height":"40","isqrcode":"","name":"AddreDesc1","type":"text","value":"请到","width":"250","x":2,"y":29},{"fontbold":"","fontname":"","fontsize":16,"height":"40","isqrcode":"","name":"AddreDesc2","type":"text","value":"医院正门入口右侧","width":"250","x":2,"y":36},{"fontbold":"","fontname":"","fontsize":16,"height":"40","isqrcode":"","name":"AddreDesc2","type":"text","value":"核酸检测区域","width":"250","x":2,"y":43},{"fontbold":"","fontname":"","fontsize":16,"height":"40","isqrcode":"","name":"AddreDesc3","type":"text","value":"就诊","width":"250","x":2,"y":50},{"fontbold":"false","fontname":"宋体","fontsize":9,"height":"26.5","isqrcode":"true","name":"visitplaceqrCode","type":"text","value":"https://m.locnavi.com/?id=kivqn33XQY&poi=HSJCMZ&appKey=jZW2f3cYqp","width":"26.5","x":45,"y":22},{"fontbold":"","fontname":"","fontsize":13,"height":"40","isqrcode":"","name":"Bz0","type":"text","value":"扫描二维码可定位指引","width":"250","x":1,"y":57},{"ex":80,"ey":65,"sx":1,"sy":65,"type":"line"},{"fontbold":"","fontname":"","fontsize":12,"height":"40","isqrcode":"","name":"PatientID","type":"text","value":"门诊号：00661195","width":"250","x":1,"y":66},{"fontbold":"true","fontname":"","fontsize":19,"height":"40","isqrcode":"","name":"SeqNo","type":"text","value":"就诊号:176(全天)","width":"250","x":2,"y":73},{"ex":80,"ey":81,"sx":1,"sy":81,"type":"line"},{"fontbold":"true","fontname":"","fontsize":14,"height":"40","isqrcode":"","name":"PatName","type":"text","value":"姓名：李志","width":"250","x":2,"y":83},{"fontbold":"true","fontname":"","fontsize":14,"height":"40","isqrcode":"","name":"Sex","type":"text","value":"性别：男","width":"250","x":2,"y":90},{"fontbold":"true","fontname":"","fontsize":14,"height":"40","isqrcode":"","name":"Sex","type":"text","value":"年龄：26岁","width":"250","x":35,"y":90},{"fontbold":"true","fontname":"","fontsize":14,"height":"40","isqrcode":"","name":"Loc","type":"text","value":"科室：核酸检测门诊","width":"250","x":2,"y":97},{"fontbold":"true","fontname":"","fontsize":14,"height":"40","isqrcode":"","name":"DepDoc","type":"text","value":"医师：核酸检测(混检)","width":"250","x":2,"y":104},{"fontbold":"true","fontname":"","fontsize":14,"height":"40","isqrcode":"","name":"DepDoc","type":"text","value":"号别:核酸混检号","width":"250","x":2,"y":111},{"fontbold":"true","fontname":"","fontsize":14,"height":"40","isqrcode":"","name":"mtbz","type":"text","value":"门特病种：","width":"250","x":2,"y":118},{"fontbold":"","fontname":"","fontsize":12,"height":"40","isqrcode":"","name":"ID","type":"text","value":"登记号：62015755","width":"250","x":2,"y":125},{"ex":80,"ey":132,"sx":1,"sy":132,"type":"line"},{"fontbold":"true","fontname":"","fontsize":14,"height":"40","isqrcode":"","name":"Amount","type":"text","value":"总金额：0.00","width":"250","x":1,"y":133},{"fontbold":"true","fontname":"","fontsize":14,"height":"40","isqrcode":"","name":"InsuZH","type":"text","value":"医保支付：0.00","width":"250","x":1,"y":140},{"fontbold":"true","fontname":"","fontsize":14,"height":"40","isqrcode":"","name":"Grzh","type":"text","value":"医保个人账户支付：0.00","width":"250","x":1,"y":147},{"fontbold":"true","fontname":"","fontsize":14,"height":"40","isqrcode":"","name":"QtZf","type":"text","value":"实际支付：0.00","width":"250","x":1,"y":154},{"ex":80,"ey":161,"sx":1,"sy":161,"type":"line"},{"fontbold":"","fontname":"","fontsize":10,"height":"40","isqrcode":"","name":"UserCode","type":"text","value":"来源：自助机现场挂号","width":"250","x":1,"y":162},{"fontbold":"","fontname":"","fontsize":12,"height":"40","isqrcode":"","name":"UserCode1","type":"text","value":"80701","width":"250","x":50,"y":162},{"fontbold":"","fontname":"","fontsize":10,"height":"40","isqrcode":"","name":"ZZJAdress","type":"text","value":"自助机位置：1","width":"250","x":1,"y":167},{"fontbold":"","fontname":"","fontsize":10,"height":"40","isqrcode":"","name":"PayMode","type":"text","value":"支付方式：","width":"250","x":1,"y":172},{"fontbold":"","fontname":"","fontsize":10,"height":"40","isqrcode":"","name":"PayNumber","type":"text","value":"流水号：20211222807010001","width":"250","x":1,"y":177},{"fontbold":"","fontname":"","fontsize":10,"height":"40","isqrcode":"","name":"PayNumber","type":"text","value":"银行卡号：","width":"250","x":1,"y":182},{"fontbold":"","fontname":"","fontsize":10,"height":"40","isqrcode":"","name":"PrtDate","type":"text","value":"打印时间：2021-12-22 10:26:13","width":"250","x":1,"y":187},{"ex":80,"ey":192,"sx":1,"sy":192,"type":"line"},{"fontbold":"true","fontname":"","fontsize":10,"height":"40","isqrcode":"","name":"Bz","type":"text","value":"提示：1、挂号条当日有效","width":"250","x":1,"y":207},{"fontbold":"true","fontname":"","fontsize":10,"height":"40","isqrcode":"","name":"Bz1","type":"text","value":"2、如果需要正式票据，请持卡或者缴费","width":"250","x":1,"y":212},{"fontbold":"true","fontname":"","fontsize":10,"height":"40","isqrcode":"","name":"Bz2","type":"text","value":"凭条于14日內到一卡通打票窗口打印，","width":"250","x":1,"y":217},{"fontbold":"true","fontname":"","fontsize":8,"height":"40","isqrcode":"","name":"Bz3","type":"text","value":"过期不补。","width":"250","x":1,"y":222},{"fontbold":"true","fontname":"","fontsize":10,"height":"40","isqrcode":"","name":"Bz4","type":"text","value":"3、如有需要，请去一楼自助打印电子","width":"250","x":1,"y":227},{"fontbold":"true","fontname":"","fontsize":10,"height":"40","isqrcode":"","name":"Bz4","type":"text","value":"票据，或使用微信小程序【电子票夹】","width":"250","x":1,"y":232},{"fontbold":"true","fontname":"","fontsize":8,"height":"40","isqrcode":"","name":"Bz5","type":"text","value":"进行查看","width":"250","x":1,"y":237},{"fontbold":"","fontname":"","fontsize":13,"height":"40","isqrcode":"","name":"BillBatchCode","type":"text","value":"电子票据代码：12060119","width":"250","x":1,"y":244},{"fontbold":"","fontname":"","fontsize":13,"height":"40","isqrcode":"","name":"BillNo","type":"text","value":"电子票据号码：0026896566","width":"250","x":1,"y":251},{"fontbold":"","fontname":"","fontsize":13,"height":"40","isqrcode":"","name":"Random","type":"text","value":"电子票据校验码：c748a8","width":"250","x":1,"y":258},{"fontbold":"","fontname":"","fontsize":13,"height":"40","isqrcode":"","name":"BillAdres","type":"text","value":"天津市财政局官网：","width":"250","x":1,"y":265},{"fontbold":"","fontname":"","fontsize":13,"height":"40","isqrcode":"","name":"BillAdres1","type":"text","value":"http://cz.tj.gov.cn/","width":"250","x":1,"y":272},{"barcodetype":"128A","fontbold":"false","fontname":"","fontsize":15,"height":"17","isqrcode":"","name":"PatientIDBarCode","type":"text","value":"00661195","width":"43","x":20,"y":279},{"fontbold":"true","fontname":"","fontsize":10,"height":"40","isqrcode":"","name":"Bz6","type":"text","value":"提示：该条码为电子票据自助打印码","width":"250","x":1,"y":299},{"fontbold":"","fontname":"","fontsize":13,"height":"40","isqrcode":"","name":"Bz9","type":"text","value":"根据社保局规定，该凭条无法","width":"250","x":1,"y":306},{"fontbold":"","fontname":"","fontsize":13,"height":"40","isqrcode":"","name":"Bz10","type":"text","value":"进行扫凭条码进行医保结算","width":"250","x":1,"y":313}]';
	//jsonArr='[{"fontbold":"true","fontname":"","fontsize":16,"height":"40","isqrcode":"","name":"HospName","type":"text","value":"天津市第一中心医院","width":"250","x":4,"y":1},{"fontbold":"true","fontname":"","fontsize":16,"height":"40","isqrcode":"","name":"OPPZ","type":"text","value":"预约挂号凭证（约）","width":"250","x":4,"y":10},{"fontbold":"","fontname":"","fontsize":12,"height":"40","isqrcode":"","name":"PatientID","type":"text","value":"患者ID：232330********2415","width":"250","x":4,"y":17},{"fontbold":"","fontname":"","fontsize":12,"height":"40","isqrcode":"","name":"PatientID1","type":"text","value":"登记号：62015755","width":"250","x":4,"y":24},{"ex":80,"ey":31,"sx":1,"sy":31,"type":"line"},{"fontbold":"true","fontname":"","fontsize":16,"height":"40","isqrcode":"","name":"PatName","type":"text","value":"姓名：李志","width":"250","x":2,"y":32},{"fontbold":"true","fontname":"","fontsize":16,"height":"40","isqrcode":"","name":"Sex","type":"text","value":"性别：男 年龄：26岁","width":"250","x":2,"y":39},{"fontbold":"true","fontname":"","fontsize":16,"height":"40","isqrcode":"","name":"Loc","type":"text","value":"科室：内分泌科门诊","width":"250","x":2,"y":46},{"fontbold":"true","fontname":"","fontsize":16,"height":"40","isqrcode":"","name":"DepDoc","type":"text","value":"号别：主任号","width":"250","x":2,"y":53},{"fontbold":"true","fontname":"","fontsize":16,"height":"40","isqrcode":"","name":"DepDoc1","type":"text","value":"医师：段丽君","width":"250","x":2,"y":60},{"ex":80,"ey":67,"sx":1,"sy":67,"type":"line"},{"fontbold":"true","fontname":"","fontsize":16,"height":"40","isqrcode":"","name":"DateDesc","type":"text","value":"最早报到时间：","width":"250","x":1,"y":68},{"fontbold":"true","fontname":"","fontsize":16,"height":"40","isqrcode":"","name":"hd","type":"text","value":"2021-12-31 15:00:00","width":"250","x":4,"y":75},{"fontbold":"true","fontname":"","fontsize":16,"height":"40","isqrcode":"","name":"DateDesc2","type":"text","value":"报到截止日期：","width":"250","x":1,"y":82},{"fontbold":"true","fontname":"","fontsize":16,"height":"40","isqrcode":"","name":"hd1","type":"text","value":"2021-12-31 16:00:00","width":"250","x":4,"y":89},{"fontbold":"true","fontname":"","fontsize":16,"height":"40","isqrcode":"","name":"AdmDate1","type":"text","value":"号段：下午 15:30-16:00","width":"250","x":4,"y":96},{"ex":80,"ey":103,"sx":1,"sy":103,"type":"line"},{"fontbold":"","fontname":"","fontsize":13,"height":"40","isqrcode":"","name":"PrtDate","type":"text","value":"操作时间2021-12-22 10:32:31","width":"250","x":1,"y":110},{"fontbold":"","fontname":"","fontsize":13,"height":"40","isqrcode":"","name":"UserCode","type":"text","value":"来源：自助机预约挂号 80701","width":"250","x":1,"y":117},{"fontbold":"","fontname":"","fontsize":13,"height":"40","isqrcode":"","name":"ZZJAdress","type":"text","value":"自助机位置：1","width":"250","x":1,"y":124},{"fontbold":"true","fontname":"","fontsize":10,"height":"40","isqrcode":"","name":"Bz5","type":"text","value":"我院自2021年7月31日起，执行如下预约系统规","width":"250","x":1,"y":131},{"fontbold":"true","fontname":"","fontsize":10,"height":"40","isqrcode":"","name":"Bz6","type":"text","value":"则：","width":"250","x":1,"y":138},{"fontbold":"true","fontname":"","fontsize":10,"height":"40","isqrcode":"","name":"Bz","type":"text","value":"1、患者在30天内退预约号累计达到4次。","width":"250","x":4,"y":145},{"fontbold":"true","fontname":"","fontsize":10,"height":"40","isqrcode":"","name":"Bz1","type":"text","value":"2、患者在30天内爽约次数累计达到3次。","width":"250","x":4,"y":152},{"fontbold":"true","fontname":"","fontsize":10,"height":"40","isqrcode":"","name":"Bz2","type":"text","value":"当患者达到以上任意一条时，系统将自动","width":"250","x":4,"y":159},{"fontbold":"true","fontname":"","fontsize":10,"height":"40","isqrcode":"","name":"Bz3","type":"text","value":"限制您的预约资格14天，为保证您的预约诊疗","width":"250","x":1,"y":166},{"fontbold":"true","fontname":"","fontsize":10,"height":"40","isqrcode":"","name":"Bz4","type":"text","value":"不受影响，请关注您的诚信度。","width":"250","x":1,"y":173},{"fontbold":"false","fontname":"C39P36DmTt","fontsize":28,"height":"40","isqrcode":"","name":"PatientIDBarCode","type":"text","value":"*232330199508162415*","width":"250","x":5,"y":180}]'
	jsonArr = DHCP_replaceAll(jsonArr, "?", String.fromCharCode(2));
	jsonArr = DHCP_replaceAll(jsonArr, "&", String.fromCharCode(3));
	jsonArr = DHCP_replaceAll(jsonArr, "=", String.fromCharCode(4));
	var getInStr="printstr=" + jsonArr;
	var rtn=CallInsuComLocalGet("SelfPrint.MainClass","CallPrint",getInStr,""); // 工程类名 , SelfPosPay 函数名
	return rtn;
}