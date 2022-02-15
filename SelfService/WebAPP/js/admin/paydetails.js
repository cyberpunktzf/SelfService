/**
 * FileName: admin.paydetails.js
 * Anchor: tangzf
 * Date: 2020-3-23
 * Description: 缴费明细查询
 */
var GLOBAL = {
    MODULENAME : 'SelfServPy.Common.mysql_contral',
    CLASSNAME :'mysqlsql',
    FILEDS:{
        '1':{'title':'姓名 ','id':'PatientName','seq':'1'},
        '2':{'title':'登记号 ','id':'his_master_id','seq':'2'},
        '3':{'title':'金额 ','id':'ss_td_amt','seq':'3'},
        '4':{'title':'平台流水号','id':'ss_td_no','seq':'4'},
        '5':{'title':'业务日期','id':'ss_td_update','seq':'5'},
        '6':{'title':'终端号','id':'UserCode','seq':'6'},
        '7':{'title':'交易结果 ','id':'resultcode','seq':'7'},
 
    }
}
var GLOBALSon = {
    MODULENAME : 'SelfServPy.Common.mysql_contral',
    CLASSNAME :'mysqlsql',
    FILEDS:{
        '1':{'title':'交易渠道 ','id':'ss_tdp_code','seq':'1'},
        '2':{'title':'交易金额','id':'ss_tdp_amt','seq':'2'},
        '3':{'title':'平台流水号','id':'Tradno','seq':'3'},
        '4':{'title':'支付','id':'SucessState','seq':'4'},
        '5':{'title':'取消','id':'CancelState','seq':'5'},
        '6':{'title':'退费','id':'RefundState','seq':'6'},
    }
}

var selectRow;
$(function () {
    init_input();
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
    layui.use('laydate', function(){
        var laydate = layui.laydate;
        laydate.render({
            elem:'#ss_td_update',
            type:'datetime'
        });
    }); 
    LoadSelect();
}


// 加载下拉 
function LoadSelect(){
    var input = {};
    input['TradeCode'] = "queryTerminal^"  + "SelfServPy.Common.mysql_contral" + "^" + "mysqlsql";
    CallMethod(input,initSelect,"DoMethod");
}
function initSelect(jsonObj) {
    var tmpArr = [];
    $.each(jsonObj.output,function(key,val){
        var tmpObj = JSON.parse(val);
        tmpArr.push(tmpObj)
    });
    layui.use(['form'], function() {
        var form = layui.form;
        $.each(tmpArr,function(index,value){
            $('#UserCode').append(new Option(value.UserCode))
        });
        form.render("select");
        form.on('select(UserCode)',function(data){
            var input = {};
            input['TradeCode'] = "queryTerminal^"  + "SelfServPy.Common.mysql_contral" + "^" + "mysqlsql";
            input['UserCode']=data.value;
            CallMethod(input,function(jsonObj){
                var tmpArr=[];
                $.each(jsonObj.output,function(key,val){
                    var tmpObj = JSON.parse(val);
                    tmpArr.push(tmpObj);
                });
                $('#UserCode').val(tmpArr[0].UserCode);
            },"DoMethod");
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
        input['code']="Charge";
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
}
function LoadDg(){
    selectRow = null;
    // 字段赋值
    var input = {};
    input['TradeCode'] = "queryTrade^"  + GLOBAL.MODULENAME + "^" + GLOBAL.CLASSNAME;
    $.each(GLOBAL.FILEDS,function(index,key){
       input[key.id] = $('#' + key.id).val();
    });
    input['code']="Charge";
    CallMethod(input,init_dg,"DoMethod");
}
function init_dg(jsonObj){
    try{
        var tmpArr = [];
        //组织后台查询出来的数据
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
                toolbar: '',
                defaultToolbar:false,
                size: 'sm', //表格尺寸 默认 sm
                even:false, //隔行背景
                url:  PYTHONSERVER + 'CallSelfServPY', //数据接口
                page: true,
                limits:[50, 100, 150],
                limit:50,
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
                    {field: GLOBAL.FILEDS[1].id, title: GLOBAL.FILEDS[1].title,width:100},
                    {field: GLOBAL.FILEDS[2].id, title: GLOBAL.FILEDS[2].title,width:100},
                    {field: GLOBAL.FILEDS[3].id, title: GLOBAL.FILEDS[3].title,width:100},
                    {field: GLOBAL.FILEDS[4].id, title: GLOBAL.FILEDS[4].title,width:200},
                    {field: GLOBAL.FILEDS[5].id, title: GLOBAL.FILEDS[5].title,width:150},
                    {field: GLOBAL.FILEDS[6].id, title: GLOBAL.FILEDS[6].title,width:100},
                    {field: GLOBAL.FILEDS[7].id, title: GLOBAL.FILEDS[7].title,width:100},
                    {field: 'id', title: 'id',width:50}
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
                if (selectRow) {
                    layui.use('form', function() {
                        var form = layui.form;
                        var formTable = $('.layui-form').find('select');
                        $.each(formTable,function(index,select){
                            var id = $(select).attr('id');
                            $(select).val(obj.data[id]);
                            form.render("select");
                        });
                    });
                    var input = {};
                    input['TradeCode'] = "queryTradedetail^"  + GLOBALSon.MODULENAME + "^" + GLOBALSon.CLASSNAME;
                    input['ss_tdp_no']=selectRow.data.ss_td_no;
                    CallMethod(input,init_rightDG,"DoMethod");
                }
            });
        });
    }catch(e){
        alert(e.ResponseText);
    }
}
function init_rightDG(jsonObj){
    try{
        var tmpArr = [];
        $.each(jsonObj.output,function(key,val){
             var tmpObj = JSON.parse(val);
             tmpArr.push(tmpObj)
        });
        layui.use('table', function(){
            //第一个实例
            table = layui.table;
            table.render({
                id:'rdg',
                elem: '#rdg',
                field:'id',
                align:'center',
                toolbar:'',
                defaultToolbar:false,
                border:'',
                size: 'lg', //表格尺寸 默认 sm
                even:false, //隔行背景
                url:  PYTHONSERVER + 'CallSelfServPY', //数据接口
                page: true,
                limits:[50, 100, 150],
                limit:50,
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
                    {field: GLOBALSon.FILEDS[1].id, title: GLOBALSon.FILEDS[1].title,width:120},
                    {field: GLOBALSon.FILEDS[2].id, title: GLOBALSon.FILEDS[2].title,width:100},
                    {field: GLOBALSon.FILEDS[3].id, title: GLOBALSon.FILEDS[3].title,width:240},
                    {field: GLOBALSon.FILEDS[4].id, title: GLOBALSon.FILEDS[4].title,width:60},
                    {field: GLOBALSon.FILEDS[5].id, title: GLOBALSon.FILEDS[5].title,width:60},
                    {field: GLOBALSon.FILEDS[6].id, title: GLOBALSon.FILEDS[6].title,width:60},
                ]],
            });
            //监听行单击事件
            table.on('row(rdg)', function(obj){
                if(selectRow && selectRow.data.id == obj.data.id){ // 取消选中
                    selectRow = null;
                    var formTable = $('.form').find('input');
                    $.each(formTable,function(index,input){
                        $(input).val('');
                    });
                }else{
                    selectRow = obj;
                }
            });
            //监听单元格事件
            table.on('edit(rdg)', function(obj){
            });
        });
    }catch(e){
        alert(e.ResponseText);
    }    
}
