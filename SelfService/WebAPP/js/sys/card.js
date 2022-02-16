// js/common/card.js

/**
 * @description  前端调用读卡设备
 * @param {function} funopt 回调方法
 * @return {object} OutPut
 * @author tangzf
 */
function DLLReadCard(funopt){
    // 判断读卡设备类型
    var CmpInfo = OSPGetParentVal('client_dict'); 
    var role = CmpInfo['ss_eqlistd_role'];
    if(role == "role2"){
        init_text(funopt);
    }else if(role == "admin"){
        GetPersonInfo('-1');
    } else{
        // 立式自助机读卡设备()
        var areaRs = InsuAutoReadCardAsc(0,1,0,0,"",100000,"test",funopt);
    }    
}
function GetPersonInfo(areaRs){
    try{
        $('#CardNo').val('61222146155812221419');
        var OutPut = {
            "ResponseStatus" : "-999",
            "ResponseText" : ""
        }
        var code = "";
        var name = "陈雨琴测试";
        var idno = "120104199001010622";
        var Sex = "女";
        var Age = "25";
        var AddDr = "";
        var brdy = "1994-12-13";
        var naty = "a";
        var CardTypeCode = "01";
        var INSUCardNo = "";
        var INSUCardInfo = '';
        var barCode = "";
        code = 0;
        if(areaRs == "-1" || areaRs == ""){
            areaRs = undefined;
        }
        //var areaRs="{\"code\":\"0\",\"ResponseText\":\"初始化设备成功！\",\"Name\":\"\\\"李立志\\\"\",\"Sex\":\"\\\"男\\\"\",\"naty\":\"\\\"汉族\\\"\",\"brdy\":\"\\\"1987.10.23\\\"\",\"addr\":\"\\\"天津市西青区中北镇中北大道花溪苑12号楼2门501号\\\"\",\"psn\":\"\\\"120224198710235038\\\"\",\"issucert\":\"\\\"天津市公安局西青分局\\\"\",\"validate\":\"\\\"2015.04.03-2035.04.03\\\"\",\"picfile\":\"\\\"C:\\\\DHCInsurance\\\\DLL\\\\zp.bmp\\\"\"}"
        if(areaRs){
            //areaRs = areaRs.replace("\\" ,"");
            //areaRs=str.replace(/\\/,"");
            var JsonObj = JSON.parse(areaRs); 
            areaRs = areaRs.replace("\\" ,""); 
            if(JsonObj.code == "-100"){
                OSPAlert('','未能读取到有效信息，请重试','提示',function(){
                    homePageClick();
                    return;
                });
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
                }          
            }else if(JsonObj.CardType == "2"){
                //alert('读医保卡:' + areaRs);
                INSUCardNo = JsonObj.IDCard.split('=')[0];
                PayServ_UpdateHIType("2","N")
                OSPSetParentVal('INSUCardNo', INSUCardNo);  
                /// "10000055^991021000006001997^^10退公务020^2^50^^^CZ0103195307146413^17号文^^^^^^^^^^^^308^^^^^^^^^^991021000006001997^111111^1^1^^^^^^^^^^^^^^||^^^^CZZG^"
                var rtn = ReadCardPersonInfo(INSUCardNo,'111111','');
                if(rtn==""){
                    rtn = ReadCardPersonInfo(INSUCardNo,'111111','');
                }
                //alert(rtn)
                rtn = DHCP_TextEncoder(rtn);
                INSUCardInfo = rtn;
                if(rtn != "-1"){
                    rtnArr = rtn.split('^');
                    code = 0;
                    idno = rtnArr[8];
                    name = rtnArr[3];
                    Sex = rtnArr[4];
                    Age = rtnArr[5];
                    brdy = '2000-1-1';
                    naty = '';
                    AddDr = '';
                    OSPSetParentVal("RYLB",rtnArr[34]); // 人员类别
                }else{
                    OSPAlert('','读医保卡失败：' + rtn,'提示',function(){
                        return false;
                    })
                }
            } 
            else if(JsonObj.CardType == "3"){
                // "{\"code\":\"0\",\"ResponseText\":\"OK\",\"CardType\":\"3\",\"ScanData\":\"2337\"}"
                barCode = JsonObj.ScanData;
                alert('条形码:' + JsonObj.ScanData);
            }else{
                OSPAlert('','未能读取到有效信息，请重试','提示',function(){
                    homePageClick();
                    return;
                })
                return;
            }  
        }else{
            OSPAlert('','未能读取到有效信息，请重试,将使用固定患者进行测试','提示',function(){
            // homePageClick();
            //return;
            });
            //return;
        }
        /* 
        INSUCardNo = "991021000006001997";
        OSPSetParentVal('INSUCardNo', INSUCardNo);  
        alert('开始读卡')
        var INSUCardInfo = ReadCardPersonInfo('991021000006001997','111111',''); 
        alert('读卡结束' + INSUCardInfo)
        INSUCardInfo = DHCP_TextEncoder(INSUCardInfo);
        rtnArr = INSUCardInfo.split('^');
        code = 0;
        idno = rtnArr[8];
        name = rtnArr[3];
        Sex = rtnArr[4];
        Age = rtnArr[5];
        brdy = '2000-1-1';
        naty = '';
        AddDr = '';
        */
        //
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
        // 保存患者基本信息
        var OutPut ={
            'card_patinfo': JSON.stringify(OutPut),
            "TradeCode" : "SavePatInfo"
        }
        var rtn = CallMethod(OutPut,'',"CallPythonService","N");
        OutPut['ResponseStatus'] = rtn.result;
    }catch(e){
        OutPut = {
            "ResponseStatus" : "-999",
            "ResponseText" : ""
        }
    }finally{
        DLLReadCardCallBack(OutPut);
    }
}
// 界面text文本回车事件
function init_text(funopt){
    $('#CardNo').keydown(function(e){
        if(e.keyCode == "13"){
            //ReadCardAbort();
            ReadCardAutoBGJ(funopt);
            cancelBubble(e);
            return false;
        }
    });
    var areaRs = InsuAutoReadCardAsc(0,1,0,0,"",100000,"test",funopt);
    //$('#CardNo').val('61222146155812221419');
    //GetPersonInfo(funopt,areaRs);
    
    //$('#CardNo').val('61222146155812221419');
}
// 壁挂机 刷医保卡扫码
function ReadCardAutoBGJ(funopt){
    var ScanData = $('#CardNo').val();
    var rtn = {
        'code' : '',
        'ResponseText':''
    }
    // 有等号为医保卡返回
    if(ScanData.indexOf('=') > -1){
        rtn = {
            'code' : '0',
            'ResponseText':'',
            'CardType':'2',
            'IDCard': ScanData
        }
    }else if (ScanData.length == "18"){ // 判断位数 18位 身份证
        rtn = {
            'code' : '0',
            'ResponseText':'',
            'CardType':'1',
            'IDCard': ScanData
        }
    }else{ // 条码
        // "{\"code\":\"0\",\"ResponseText\":\"OK\",\"CardType\":\"3\",\"ScanData\":\"2337\"}"
        rtn = {
            'code' : '0',
            'ResponseText':'',
            'CardType':'3',
            'ScanData': ScanData
        }
    }
    rtn = JSON.stringify(rtn);
    GetPersonInfo(rtn); 
}
function DataTrans(indata,type){
    return output;
}