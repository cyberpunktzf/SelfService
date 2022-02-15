// 电子发票打印
var rtnArr;
$(function () {
    //根据流程代码 获取流配置
    var Input = {
        "TradeCode" : 'GetEIPrintInfo'
    }
    var Rtn = CallMethod(Input,'',"CallPythonService","N");
    if(Rtn.output == "##"){
        OSPAlert('',"没有需要打印的数据",'提示',function(){
            homePageClick();
            return;
        })   
    }
    var rtnArr = Rtn.output.split('##');
    var Printindex = 0;
    //AddLoading('请稍后正在打印第' + (Printindex+1) + '项');
    //setTimeout(function(){
    // 打印第一个
    printElectBillSet(rtnArr,0);
    var PrintMsg = "单击确认，打印下一张";
    if(rtnArr.length == 1){
        PrintMsg = "打印结束，请拿走您的电子发票";
    }
    setTimeout(function(){
        OSPAlert('',PrintMsg,'提示',function(){    
            if(rtnArr.length == 1){
                homePageClick();
                return;
            }
            //打第二个
            printElectBillSet(rtnArr,1);
            if(rtnArr.length == 2){
                OSPAlert('',"打印结束，请拿走您的电子发票",'提示',function(){
                    homePageClick();
                    return;
                })    
            }
            // 打第三个
            setTimeout(function(){
                OSPAlert('',PrintMsg,'提示',function(){
                    // 打第三个
                    printElectBillSet(rtnArr,2);
                    if(rtnArr.length == 3){
                        OSPAlert('',"打印结束，请拿走您的电子发票",'提示',function(){
                            homePageClick();
                            return;
                        })    
                    }
                    //打印第四个
                    setTimeout(function(){
                        OSPAlert('',PrintMsg,'提示',function(){
                            printElectBillSet(rtnArr,3);
                            if(rtnArr.length == 4){
                                OSPAlert('',"打印结束，请拿走您的电子发票",'提示',function(){
                                    homePageClick();
                                    return;
                                }) 
                            }  
                        })
                    },5000);
                })
            },5000);
        })
    },5000);
 });

//1、本级单位应用接入（单个单位使用）
var industry = new BsIndustryApi({'appId':'TJSDYZXYY7317444',
'appKey':'142c4c9733998db1cbc54a7bf9',
'type':'medical',
'url':'http://10.81.56.1:17001/medical-web/'});
//2、直管单位创建的应用接入下级单位（多个单位使用）
//    var industry = new BsIndustryApi({'region':'region',
//        'deptcode':'deptcode',
//        'appId':'WZDCSDW2385373',
//        'appKey':'fdbcc2b3300cf8a289c759fe29',
//        'type':'medical',
//        'url':'http://127.0.0.1:8081/industry-web'});



/**
* 打印电子票据(打印A4)，可按照票种设置打印机
* @param {String} billBatchCode  电子票据批次代码
* @param {String} billNo         电子票据号码
* @param {String} random         电子票据校验码
* @param {String} moduleId       票据种类编码（打印设置中设置的编码）
*/
function printElectBillSet(rtnArr,Printindex) {
    if(rtnArr[Printindex].split('^')[0] == ""){
        return;
    }
    var param = {
        'billBatchCode': rtnArr[Printindex].split('^')[2],
        'billNo': rtnArr[Printindex].split('^')[3],
        'random': rtnArr[Printindex].split('^')[4],
        'moduleId': ''
    };
    if(!param){
        param = {
            'billBatchCode': '12060119',
            'billNo': '0000110889',
            'random': '5196cb',
            'moduleId': '000000001'
        }
    }
	industry.printElectBill(param, '1.0', false).then(function (data) {
		if(data&&data.result != 'S0000'){
			alert(data.message);
		}
		//console.log("success")
	}).fail(function (data) {
		alert('打印失败')
		//console.log( data)
	});
}