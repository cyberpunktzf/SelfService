// js/common/card.js

/**
 * @description  前端调用读卡设备
 * @param {function} funopt 回调方法
 * @return {object} OutPut
 * @author tangzf
 */
var CardTypeStr= "";
function DLLReadCard(funopt){
	// 记录 开始读卡：
    
    // 判断读卡设备类型
    var CmpInfo = OSPGetParentVal('client_dict'); 
    var role = CmpInfo['ss_eqlistd_role'];
    if(role == "role2"){
        init_text(funopt);
    }else if(role == "admin"){
        GetPersonInfo('-1');
    } else{
        var ReadCardType = OSPGetParentVal('ReadCardType');
		if(ReadCardType == "1" ){
			var ImgConfigUrl="/WebAPP/themes/images/card2.gif";
		}else{
			var ImgConfigUrl="/WebAPP/themes/images/card1.gif";
		}
        // 立式自助机读卡设备()
        //var ImgConfigUrl="/WebAPP/themes/images/card12.gif";
        var Business = OSPGetParentVal('Business'); 
		var CurrentBusiness = OSPGetParentVal('CurrentBusiness')
		ImgConfigUrlCFG = Business[CurrentBusiness].config;
		if(ImgConfigUrlCFG && ImgConfigUrlCFG.url){
            ImgConfigUrl = ImgConfigUrlCFG.url;
        }
        CardTypeStr = ImgConfigUrl.split('.')[0];
        if(CardTypeStr.split('card').length>1){
            CardTypeStr = CardTypeStr.split('card')[1];
        }
        if(CardTypeStr == "12"){
            CardTypeStr = "1,2";
        }
        if(CardTypeStr == "123"){
            CardTypeStr = "0";
        }
        if(CardTypeStr == "23"){
            CardTypeStr = "2,3";
        }
        if(CardTypeStr.split(',') < 0 && ImgConfigUrlCFG && ImgConfigUrlCFG.url){
            CardTypeStr = '0'
        }
        if(ReadCardType == "3"){
            CardTypeStr = '3';
        }
        PayServ_SaveBDInfo('StartReadCard',CardTypeStr,''); 
        var areaRs = InsuAutoReadCardAsc(0,1,CardTypeStr,0,"",100000,"test",funopt);
    }    
}
// 条码 身份证
function BuildCardInfo(OutPut){
    // 保存患者基本信息
    OutPut = JSON.stringify(OutPut);
    var OutPut ={
        'card_patinfo': OutPut,
        "TradeCode" : "SavePatInfo"
    }
    var rtn = CallMethod(OutPut,'',"CallPythonService","N");
    OutPut['ResponseStatus'] = rtn.result;
    DLLReadCardCallBack();
}
function BuildBarInfo(OutPut){
    OutPut = JSON.stringify(OutPut);
	var OutPut ={
        'card_patinfo': OutPut,
        "TradeCode" : "SavePatInfo"
    }
    var rtn = CallMethod(OutPut,'',"CallPythonService","N");
    OutPut['ResponseStatus'] = rtn.result;
	DLLReadCardCallBack();
	return false;
}
// 医保卡
function BuildInsuBackStr(rtn){
    var InputObj = {
        'CheckCode':'INSUReadCard',
        'RuleType' :'checkStopInsu'
    }
    var checkFlag = checkStop(InputObj);
    if(checkFlag.result !="0" || !checkFlag){
        return false;
    }
    //alert(rtn)
    //alert('读医保卡:' + areaRs);
    INSUCardNo = rtn;
    PayServ_UpdateHIType("2","N")
    OSPSetParentVal('INSUCardNo', INSUCardNo);  
    if(INSUCardNo == ""){
        OSPAlert('',INSUCardNo + ':读医保卡失败卡号不能为空' + rtn,'提示',function(){
            homePageClick();
            return;
        });
        return;
    }
    /// "10000055^991021000006001997^^10退公务020^2^50^^^CZ0103195307146413^17号文^^^^^^^^^^^^308^^^^^^^^^^991021000006001997^111111^1^1^^^^^^^^^^^^^^||^^^^CZZG^"
	// 记录 开始读医保卡：
    PayServ_SaveBDInfo('StartINSUReadCard',INSUCardNo,''); 
    var ReadCardType = OSPGetParentVal('ReadCardType');
    if(ReadCardType == "3"){
        ReadCardType = "4"
    }
    var rtn = ReadCardPersonInfo(INSUCardNo,'111111',ReadCardType);
    if(rtn==""){
        rtn = ReadCardPersonInfo(INSUCardNo,'111111',ReadCardType);
    }
    if(rtn == ""){
        OSPAlert('','未能读取到有效信息，请返回重新读卡。-101','提示',function(){
            homePageClick();
            return false;
        });
        return false;
    }
	PayServ_SaveBDInfo('EndINSUReadCard','',rtn); 
    if(+rtn.split('^')[0] < 0){
        var MsgInfo = '读医保卡失败：' + rtn;
        
        //if (rtn.indexOf('获取卡系统接口信息失败') > -1){
            //MsgInfo = '未能读取到有效信息，请返回重新读卡。-102';
        //}
        OSPAlert('',MsgInfo,'提示',function(){
            homePageClick();
            return false;
        });
        return false;
    }
    var rtn = DHCP_TextEncoder(rtn);
    var INSUCardInfo = rtn;
    var rtnArr = rtn.split('^');
    var code = 0;
    var idno = rtnArr[8];
    var name = rtnArr[3];
    var Sex = rtnArr[4];
    var Age = rtnArr[5];
    var brdy = '';
    var naty = '';
    var AddDr = '';
    OSPSetParentVal("RYLB",rtnArr[34]); // 人员类别
    var OutPut1 = {
        "ResponseStatus" : code,
        "ResponseText" : "",
        "ReadCardType" : "1", // 
        "CardTypeCode" : '02', // 01.身份证 ,02:医保卡,3:HIS就诊卡
        "IDNo" : idno,
        "Name" : name,
        "Sex" : Sex,
        "Age" : Age,
        "brdy" : brdy,
        "naty" : naty,
        "Address" : AddDr,
        "INSUCardStr" : INSUCardInfo,
        'barCode' : ''
    } 
    // 保存患者基本信息
    OutPut1 = JSON.stringify(OutPut1);
    var OutPut ={
        'card_patinfo': OutPut1,
        "TradeCode" : "SavePatInfo"
    }
    
    var rtn = CallMethod(OutPut,'',"CallPythonService","N");
    OutPut['ResponseStatus'] = rtn.result;
    DLLReadCardCallBack();
}
//立式 读卡回调
function GetPersonInfo(areaRs){
    try{
		//保存回调信息
        PayServ_SaveBDInfo('GetPersonInfo',areaRs,''); 
        $('#CardNo').val('11111111111111111');
        var OutPut = {
            "ResponseStatus" : "-999",
            "ResponseText" : ""
        }
        var code = "";
        var name = "";
        var idno = "";
        var Sex = "";
        var Age = "";
        var AddDr = "";
        var brdy = "";
        var naty = "";
        var CardTypeCode = "";
        var INSUCardNo = "";
        var INSUCardInfo = '';
        var barCode = "";
        var OutPut = {
            "ResponseStatus" : 0,
            "ResponseText" : "",
            "ReadCardType" : "0", // 1.身份证 ,2:医保卡,3:HIS就诊卡
            "CardTypeCode" : CardTypeCode, // 01.身份证 ,02:医保卡,3:HIS就诊卡
            "IDNo" : idno,
            "Name" : name,
            "Sex" : Sex,
            "Age" : Age,
            "brdy" : brdy,
            "naty" : naty,
            "Address" : AddDr,
            "INSUCardStr" : INSUCardInfo,
            'barCode' : barCode
        } 
        //var areaRs="{\"code\":\"0\",\"ResponseText\":\"初始化设备成功！\",\"Name\":\"\\\"李立志\\\"\",\"Sex\":\"\\\"男\\\"\",\"naty\":\"\\\"汉族\\\"\",\"brdy\":\"\\\"1987.10.23\\\"\",\"addr\":\"\\\"天津市西青区中北镇中北大道花溪苑12号楼2门501号\\\"\",\"psn\":\"\\\"120224198710235038\\\"\",\"issucert\":\"\\\"天津市公安局西青分局\\\"\",\"validate\":\"\\\"2015.04.03-2035.04.03\\\"\",\"picfile\":\"\\\"C:\\\\DHCInsurance\\\\DLL\\\\zp.bmp\\\"\"}"
        if(areaRs && areaRs != "-1"){
            //areaRs = areaRs.replace("\\" ,"");
            //areaRs=str.replace(/\\/,"");
            var JsonObj = JSON.parse(areaRs); 
            areaRs = areaRs.replace("\\" ,""); 
            if(JsonObj.code == "-100"){
                OSPAlert('','未能读取到有效信息，请返回重新读卡-100','提示',function(){
                    homePageClick();
                    return;
                })
                return;
            }
            if(JsonObj.CardType == "1"){
                //alert('读身份证:' + areaRs);
                if(JsonObj.Name){
                    name = JsonObj.Name.replace("\\" ,"");
                    name = name.replace('"',"");
                    name = name.replace('"',"");

                    AddDr = JsonObj.addr.replace("\\" ,"");
                    brdy = JsonObj.brdy.replace("\\" ,"");
                    brdy=brdy.replace(".","-");
                    brdy=brdy.replace(".","-");
                    brdy = brdy.replace('"',"");
                    brdy = brdy.replace('"',"");
                    naty = JsonObj.naty.replace("\\" ,"");
                    idno = JsonObj.psn.replace("\\" ,"");
                    idno = idno.replace('"' ,"");
                    idno = idno.replace('"' ,"");
                    Sex = JsonObj.Sex.replace("\\" ,"");
                    OutPut = {
                        "ResponseStatus" : code,
                        "ResponseText" : "",
                        "ReadCardType" : "0", // 1.身份证 ,2:医保卡,3:HIS就诊卡
                        "CardTypeCode" : CardTypeCode, // 01.身份证 ,02:医保卡,3:HIS就诊卡
                        "IDNo" : idno,
                        "Name" : name,
                        "Sex" : Sex,
                        "Age" : Age,
                        "brdy" : brdy,
                        "naty" : naty,
                        "Address" : AddDr,
                        "INSUCardStr" : INSUCardInfo,
                        'barCode' : barCode
                    } 
                    BuildCardInfo(OutPut)
                }          
            }else if(JsonObj.CardType == "2"){
                BuildInsuBackStr(JsonObj.IDCard);
            } 
            else if(JsonObj.CardType == "3"){
                barCode = JsonObj.ScanData;
                var ReadCardType = OSPGetParentVal('ReadCardType')
                if(ReadCardType == "3" || barCode.length == "28"){
                    OSPSetParentVal('ReadCardType','3');
                    BuildInsuBackStr(barCode);
                }else{
                    OutPut = {
                        "ResponseStatus" : '',
                        "ResponseText" : "",
                        "ReadCardType" : "2", // 1.身份证 ,2:医保卡,3:HIS就诊卡
                        "CardTypeCode" : '', // 01.身份证 ,02:医保卡,3:HIS就诊卡
                        "IDNo" : '',
                        "Name" : '',
                        "Sex" : '',
                        "Age" : '',
                        "brdy" : '',
                        "naty" : '',
                        "Address" : '',
                        "INSUCardStr" : '',
                        'barCode' : barCode
                    } 
                    BuildBarInfo(OutPut);
                }
                
            }else{
                OSPAlert('','未能读取到有效信息，卡类型不存在','提示',function(){
                    homePageClick();
                    return;
                })
                return;
            }  
        }else{
			OSPAlert('','未能读取到有效信息，请返回重新读卡。','提示',function(){
				homePageClick();
				return;
			});
            return;
        }
    }catch(e){
        OSPAlert('','未能读取到有效信息，请返回重新读卡','提示',function(){
            homePageClick();
            return;
        });
		setTimeout(function(){
			homePageClick();
		},4000);
    }
}
// 壁挂机入口
// 界面text文本回车事件
function init_text(funopt){
    //刷医保卡 条码
    var ReadCardType = OSPGetParentVal('ReadCardType');
    $('#CardNo').keydown(function(e){
        if(e.keyCode == "13"){
            //ReadCardAbort();
            if(ReadCardType == "1" ){
                var ImgConfigUrl="/WebAPP/themes/images/card2.gif";
            }else{
                var ImgConfigUrl="/WebAPP/themes/images/card1.gif";
            }
            // 立式自助机读卡设备()
            //var ImgConfigUrl="/WebAPP/themes/images/card12.gif";
            var Business = OSPGetParentVal('Business'); 
            var CurrentBusiness = OSPGetParentVal('CurrentBusiness')
            ImgConfigUrlCFG = Business[CurrentBusiness].config;
            if(ImgConfigUrlCFG && ImgConfigUrlCFG.url){
                ImgConfigUrl = ImgConfigUrlCFG.url;
            }
            CardTypeStr = ImgConfigUrl.split('.')[0];
            if(CardTypeStr.split('card').length>1){
                CardTypeStr = CardTypeStr.split('card')[1];
            }
            if(CardTypeStr == "12"){
                CardTypeStr = "1,2";
            }
            if(CardTypeStr == "123"){
                CardTypeStr = "0";
            }
            if(CardTypeStr == "23"){
                CardTypeStr = "2,3";
            }
            if(CardTypeStr.split(',') < 0 && ImgConfigUrlCFG && ImgConfigUrlCFG.url){
                CardTypeStr = '0'
            }
            // 壁挂机自费患者只能使用身份证
            // 医保卡 读卡配置的 不受该控制
            if((ReadCardType == "0" || ReadCardType == "") && CardTypeStr.indexOf('2') == -1 && CardTypeStr.indexOf('3') == -1 && CardTypeStr !="0"){
                OSPAlert('','自费患者只能使用身份证进行操作','提示',function(){
                    homePageClick();
                });
                cancelBubble(e);
                return false;
            }
            //壁挂机 医保患者 只能使用医保卡
            if(ReadCardType == "1"){
                if($('#CardNo').val().length < 19 && CardTypeStr.indexOf('3') == -1){
                    OSPAlert('','医保患者只能使用医保卡进行操作','提示',function(){
                        homePageClick();
                    });
                    cancelBubble(e);
                    return false;
                }
            }
            // 未选择自费医保类型
            if(ReadCardType == ""){
                if($('#CardNo').val().length < 19 && CardTypeStr.indexOf('3') == -1 && CardTypeStr !="0"){
                    OSPAlert('','该业务只能使用医保卡或身份证进行办理','提示',function(){
                        homePageClick();
                    });
                    cancelBubble(e);
                    return false;
                }
            }
            PayServ_SaveBDInfo('StartReadCardBGJID','',''); 
            ReadCardAutoBGJ(funopt);
            cancelBubble(e);
            return false;
        }
    });
		$('#CardNo').blur(function(e){
			$('#CardNo').focus();
		});
		// 读身份证
		PayServ_SaveBDInfo('StartReadCardBGJ','',''); 
	
    
	if (ReadCardType == "" || ReadCardType == "0"){
		var areaRs = InsuAutoReadCardAsc(0,1,1,0,"",100000,"test",funopt);
	}
    //$('#CardNo').val('61222146155812221419');
    //GetPersonInfo(funopt,areaRs);
    
    //$('#CardNo').val('61222146155812221419');
}
// 壁挂机 刷医保卡扫码
function ReadCardAutoBGJ(){
    var ScanData = $('#CardNo').val();
    var rtn = {
        'code' : '',
        'ResponseText':''
    }
    // 有等号为医保卡返回
    if(ScanData.indexOf('=') > -1){
        BuildInsuBackStr(ScanData);
    }else if (ScanData.length == "18"){ // 判断位数 18位 身份证
        rtn = {
            'code' : '0',
            'ResponseText':'',
            'CardType':'1',
            'IDCard': ScanData
        }
        rtn = JSON.stringify(rtn);
        GetPersonInfo(rtn); 
    }else{ // 条码
        // "{\"code\":\"0\",\"ResponseText\":\"OK\",\"CardType\":\"3\",\"ScanData\":\"2337\"}"
        rtn = {
            'code' : '0',
            'ResponseText':'',
            'CardType':'3',
            'ScanData': ScanData
        }
        rtn = JSON.stringify(rtn);
        //RestartINSUService();
        GetPersonInfo(rtn); 
    } 
}