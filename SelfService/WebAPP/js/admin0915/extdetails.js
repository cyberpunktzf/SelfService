/**
 * FileName: admin.sysdicconfig.js
 * Anchor: tangzf
 * Date: 2020-3-23
 * Description: 设备列表维护
 */
var GLOBAL = {
    MODULENAME : 'SelfServPy.Common.ss_extdetailsCtl',
    CLASSNAME :'EXTC',
    FILEDS:{
        '1':{'title':'交易代码','id':'ss_extd_code','seq':'1'},
        '2':{'title':'交易类型','id':'ss_extd_type','seq':'2'},
        '3':{'title':'自助机交易流水号','id':'ss_extd_no','seq':'3'},
        '4':{'title':'HIS交易流水号','id':'ss_extd_hisno','seq':'4'},
        '5':{'title':'交易平台流水号','id':'ss_extd_platno','seq':'5'},
        '6':{'title':'交易渠道','id':'ss_extd_channel','seq':'6'},
        '7':{'title':'创建日期','id':'ss_extd_createdate','seq':'7'},
        '8':{'title':'创建人','id':'ss_extd_creator','seq':'8'}
    }
}
var selectRow;

$(function () {
    // init_input
    init_input();
    //rederSelect();
    //LoadDg();
    //init_dg(); 
    init_btn(); 

})
function init_input(){
    $.each(GLOBAL.FILEDS,function(index,key){
        var id = key.id;
        var title = key.title;
        var seq = key.seq;
        $('.title' + seq).text(title);
        $('.id' + seq).attr('id',id);
    });  
    LoadSelect();
    layui.use('laydate', function(){
        var laydate = layui.laydate;
        laydate.render({
            elem:'#ss_extd_createdate',
            type:'datetime'
        });
    });
}
function init_btn(){
    $('#QueryBtn').on('click',function(){
        LoadDg();
    });
    $('#SaveBtn').on('click',function(){
        var input = {};
        // 字段赋值
        input['TradeCode'] = "insert^"  + GLOBAL.MODULENAME + "^" + GLOBAL.CLASSNAME;
        $.each(GLOBAL.FILEDS,function(index,key){
            input[key.id] = $('#' + key.id).val();
        });
        //
        if(selectRow){
            input['id'] = selectRow.data.id;
        }
        CallMethod(input,function(){
            layer.msg('保存成功');
            LoadDg();
        },"DoMethod");
    });
    $('#DelBtn').on('click',function(){
        Del();
    });
    $('#ClearBtn').on('click',function(){
        Clear();
    });
}
function Del(){
    var selectId = "";
    if(selectRow){
        selectId = selectRow.data.id;
    }else{
        layer.msg('没有选择要删除的数据');
        return;
    } 
    layer.confirm('是否继续删除？',function(index){
        layer.close(index);
        var TradeCode = "delete^"  + GLOBAL.MODULENAME + "^" + GLOBAL.CLASSNAME;
        var input = {
            "TradeCode" : TradeCode,
            'id':selectId
        }
        CallMethod(input,function(){
            layer.msg('删除成功');
            Clear();
        },"DoMethod");
        
    }); 
}
function Clear(){
    selectRow = null;
    $('.layui-form').find('input').val('');
    layui.use('form', function() {
        var form = layui.form;
        var formTable = $('.layui-form').find('select');
        $.each(formTable,function(index,select){
            $(select).val('');
            form.render("select");
        });
    });
    LoadDg();
}
function LoadDg(){
    selectRow = null;
    // 字段赋值
    var input = {};
    input['TradeCode'] = "query^"  + GLOBAL.MODULENAME + "^" + GLOBAL.CLASSNAME;
    $.each(GLOBAL.FILEDS,function(index,key){
        input[key.id] = $('#' + key.id).val();
    });
    //
    CallMethod(input,init_dg,"DoMethod");
}
function init_dg(jsonObj){
    try{
        var tmpArr = [];
        $.each(jsonObj.output,function(key,val){
            var tmpObj = JSON.parse(val);
            tmpArr.push(tmpObj)
        });
        layui.use('table', function(){
            var table = layui.table;
            //第一个实例
            table.render({
                id:'dg',
                elem: '#dg',
                field:'id',
                align:'center',
                border:'',
                size: 'lg', //表格尺寸 默认 sm
                even:false, //隔行背景
                url:  PYTHONSERVER + 'CallSelfServPY', //数据接口
                page: true,
                limits:[50, 100, 150],
                limit:50,
                done:function(res,curr,count){
                    $("table").css("width","100%")
                },
                parseData: function(ret){
                    return {	
                        "code":200, //解析接口状态
                        "count": jsonObj.output.length, //解析数据长度
                        "data":tmpArr //解析数据列表
                      };
                },
                response: {
                    statusCode: 200 //重新规定成功的状态码为 200，table 组件默认为 0
                  },
                cols: [[ //表头
                    {field: "ss_extd_code", title: "交易代码",width:120},
                    {field: "ss_extd_amt", title: "交易金额",width:120},
                    {field: "ss_extd_type", title: "交易类型",width:120},
                    {field: "ss_extd_status", title: "交易结果",width:120},
                    {field: "ss_extd_id", title: "自助机交易主表ID",width:120},
                    {field: "ss_extd_no", title: "自助机交易流水号",width:120},
                    {field: "ss_extd_hisno", title: "HIS交易流水号",width:120},
                    {field: "ss_extd_platno", title: "交易平台流水号",width:120},
                    {field: "ss_extd_extno", title: "支付机构交易流水号",width:120},
                    {field: "ss_extd_channel", title: "交易渠道",width:120},
                    {field: "ss_extd_outinfo", title: "第三方返回信息",width:120},
                    {field: "ss_extd_ininfo", title: "入参",width:120},
                    {field: "ss_extd_createdate", title: "创建日期",width:120},
                    {field: "ss_extd_creator", title: "创建人",width:120},
                    {field: "ss_extd_update", title: "修改日期",width:120},
                    {field: "ss_extd_upuser", title: "修改人",width:120},
                    {field: 'id', title: 'id',width:120}
                ]]
            });
            //监听行单击事件
            table.on('row(dg)', function(obj){
                if(selectRow && selectRow.data.id == obj.data.id){ // 取消选中
                    selectRow = null;
                    var formTable = $('.layui-form').find('input');
                    $.each(formTable,function(index,input){
                        $(input).val('');
                    });
                }else{
                    selectRow = obj;
                    var formTable = $('.layui-form').find('input');
                    $.each(formTable,function(index,input){
                        var id = $(input).attr('id');
                        $(input).val(obj.data[id]);
                    });
                }
                if (selectRow){
                    layui.use('form', function() {
                        var form = layui.form;
                        var formTable = $('.layui-form').find('select');
                        $.each(formTable,function(index,select){
                            var id = $(select).attr('id');
                            $(select).val(obj.data[id]);
                            form.render("select");
                        });
                    });
                }
            });
        });
    }catch(e){
        alert(e.ResponseText);
    }
}
// 加载下拉 ShangXuehao
function LoadSelect(){
    var CodeInput = {};
    var CreatorInput={};
    CodeInput['TradeCode'] = "query^"  + "SelfServPy.Common.ss_extdetailsCtl" + "^" + "EXTC";
    CodeInput["ss_extd_code"] ="";
    CallMethod(CodeInput,initCodeSelect,"DoMethod");
    CreatorInput['TradeCode'] = "query^"  + "SelfServPy.Common.ss_extdetailsCtl" + "^" + "EXTC";
    CreatorInput["ss_extd_creator"] ="";
    CallMethod(CreatorInput,initCreatorSelect,"DoMethod");
    
}        
//处理数据去重  ShangXuehao
function initCodeSelect(jsonObj) {
    var tmpArr = [];
    var afterTmpArr=[];
    $.each(jsonObj.output,function(key,val){
        var tmpObj = JSON.parse(val);
        tmpArr.push(tmpObj.ss_extd_code)
    });
    tmpArr.forEach(function(value,index,tmpArr){
        var bool = tmpArr.indexOf(value,index+1);
        if (bool == -1){
            afterTmpArr.push(value);
        }
    });
    layui.use('form', function() {
        var form = layui.form;
        afterTmpArr.forEach(function(value){
            $('#ss_extd_code').append(new Option(value))
        });
        form.render("select");
    });
}
function initCreatorSelect(jsonObj){
    var tmpArr = [];
    var afterTmpArr=[];
    $.each(jsonObj.output,function(key,val){
        var tmpObj = JSON.parse(val);
        tmpArr.push(tmpObj.ss_extd_creator)
    });
    tmpArr.forEach(function(value,index,tmpArr){
        var bool = tmpArr.indexOf(value,index+1);
        if (bool == -1){
            afterTmpArr.push(value);
        }
    });
    layui.use('form', function() {
        var form = layui.form;
        afterTmpArr.forEach(function(value){
            $('#ss_extd_creator').append(new Option(value))
        });
        form.render("select");
    });
}