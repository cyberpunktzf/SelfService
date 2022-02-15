// 电子清单打印
$(function () {
    //根据流程代码 获取流配置
    var Input = {
        "TradeCode" : 'GetEInvDetail'
    }
	CallMethod(Input,function(jsonObj){
        var Rtn = jsonObj.output; // 2^12060119^0000121857^eb36f8
        if(Rtn == "##" || Rtn == ""){
            OSPAlert('','没有要打印的数据','提示',function(a){
                homePageClick();
                return;
            });
            return;
        }
        var rtnArr = Rtn.split('##');
        // 总页数^电子票据代码^电子票据号码^电子票据效验码##总页数
        $.each(rtnArr,function(index,val){
            var param = {
                // 2^12060119^0000121857^eb36f8
                'billBatchCode': val.split('^')[1],
                'billNo': val.split('^')[2],
                'random': val.split('^')[3],
                'total': val.split('^')[0],
                'pageNoBgn': '1',
                'pageNoEnd': val.split('^')[0],
                'moduleId': ''
            };
            //AddLoading('请稍后正在打印第' + (index+1) + '项，共' + rtnArr.length + '项目');
            printElectBillList(param);
            //RemoveLoading();
        });
        setTimeout(function(){
            OSPAlert('','打印结束，请拿走您的电子清单明显','提示',function(){
                homePageClick();
                return;
            })
        },5000);
    },"CallPythonService");
 });

//1、本级单位应用接入（单个单位使用）
var industry = new BsIndustryApi({'appId':'TJSDYZXYY7317444',
'appKey':'142c4c9733998db1cbc54a7bf9',
'type':'medical',
'url':'http://10.81.56.1:17001/medical-web/'});

function printElectBillList(param) {
    industry.printElectBillList(param, '1.0', false).then(function (data) {
        if(data&&data.result!='S0000'){
            alert(data.message)
        }
        console.log("success")
    }).fail(function (data) {
        console.log( data)
    });
}