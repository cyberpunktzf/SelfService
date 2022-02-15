/**
 * FileName: admin.tradedetails.js
 * Anchor: tangzf
 * Date: 2020-3-23
 * Description: 
 */

 var GLOBAL = {
    MODULENAME : 'SelfServPy.Common.mysql_contral',
    CLASSNAME :'mysqlsql',
    FILEDS:{
        '1':{'title':'*业务日期','id':'business_date','seq':'1'},
        '2':{'title':'登记号 ','id':'his_master_id','seq':'2'},
        '3':{'title':'终端号','id':'usercode','seq':'3'},
        '4':{'title':'流水号','id':'serial_number','seq':'4'},
        '5':{'title':'姓名 ','id':'PatientName','seq':'5'},
        '6':{'title':'交易类型 ','id':'processcode','seq':'6'},
        '7':{'title':'交易结果 ','id':'resultcode','seq':'7'},
        '8':{'title':'主表id ','id':'businessId','seq':'8'},//连表查询用，页面不做显示
    }
}
var GLOBALSon = {
    MODULENAME : 'SelfServPy.Common.mysql_contral',
    CLASSNAME :'mysqlsql',
    FILEDS:{
        '1':{'title':'页面代码','id':'modal_code','seq':'1'},
        '2':{'title':'页面名称','id':'ss_dic_desc','seq':'2'},
        '3':{'title':'时间','id':'business_date','seq':'3'},
        '4':{'title':'页面路径','id':'ss_dic_concode','seq':'4'},
        '5':{'title':'主键','id':'fk_businessmaster_id','seq':'5'},
        '6':{'title':'序号','id':'id','seq':'6'},
    }
}
var GLOBALPageMethod = {
    MODULENAME : 'SelfServPy.Common.mysql_contral',
    CLASSNAME :'mysqlsql',
    FILEDS:{
        '1':{'title':'操作名称','id':'ss_ts_transcodedesc','seq':'1'},
        '2':{'title':'输入报文','id':'intef_input','seq':'2'},
        '3':{'title':'输入时间','id':'business_date','seq':'3'},
        '4':{'title':'输出报文','id':'intef_output','seq':'4'},
        '5':{'title':'输出时间','id':'business_update','seq':'5'},
        '6':{'title':'操作代码','id':'intef_code','seq':'6'},
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
            elem:'#business_date',
            type:'date',
            done: function (value, date) {
                if (value) {
                    //表示选择了时间
                    if (date.hours) {
                        that.editData.ExpiredTime = value;

                    } else {
                        that.editData.ExpiredTime = tools.parseTime(value, '{y}-{m}-{d}') + " 23:59:59";
                    }
                } else {
                    that.editData.ExpiredTime = "";
                }
            }
        });
    }); 
    LoadSelect();
}


// 加载下拉 
function LoadSelect(){
    var input = {};
    input['TradeCode'] = "queryTerminal^"  + "SelfServPy.Common.mysql_contral" + "^" + "mysqlsql";
    CallMethod(input,initSelect,"DoMethod");
    var inputTradtype = {};
    inputTradtype['TradeCode'] = "queryTradeType^"  + "SelfServPy.Common.mysql_contral" + "^" + "mysqlsql";
    CallMethod(inputTradtype,initSelectTradtype,"DoMethod");
}
//初始化交易类型下拉框
function initSelectTradtype(jsonObj) {
    var tmpArr = [];
    $.each(jsonObj.output,function(key,val){
        var tmpObj = JSON.parse(val);
        tmpArr.push(tmpObj)
    });
    layui.use(['form'], function() {
        var form = layui.form;
        $.each(tmpArr,function(index,value){
            $('#processcode').append(new Option(value.processcode))
        });
        form.render("select");
        form.on('select(processcode)',function(data){
            var input = {};
            input['TradeCode'] = "queryTradeType^"  + "SelfServPy.Common.mysql_contral" + "^" + "mysqlsql";
            input['queryTradeType']=data.value;
            CallMethod(input,function(jsonObj){
                var tmpArr=[];
                $.each(jsonObj.output,function(key,val){
                    var tmpObj = JSON.parse(val);
                    tmpArr.push(tmpObj);
                });
                $('#processcode').val(tmpArr[0].processcode);
            },"DoMethod");
        });
    });
}
//初始化终端号下拉框
function initSelect(jsonObj) {
    var tmpArr = [];
    $.each(jsonObj.output,function(key,val){
        var tmpObj = JSON.parse(val);
        tmpArr.push(tmpObj)
    });
    layui.use(['form'], function() {
        var form = layui.form;
        $.each(tmpArr,function(index,value){
            $('#usercode').append(new Option(value.usercode))
        });
        form.render("select");
        form.on('select(usercode)',function(data){
            var input = {};
            input['TradeCode'] = "queryTerminal^"  + "SelfServPy.Common.mysql_contral" + "^" + "mysqlsql";
            input['usercode']=data.value;
            CallMethod(input,function(jsonObj){
                var tmpArr=[];
                $.each(jsonObj.output,function(key,val){
                    var tmpObj = JSON.parse(val);
                    tmpArr.push(tmpObj);
                });
                $('#usercode').val(tmpArr[0].usercode);
            },"DoMethod");
        });
    });
}
function init_btn(){
    $('#QueryBtn').on('click',function(){
        LoadDg();
    });
    $('#ClearBtn').on('click',function(){
        Clear();
    });
    $('#ExceptionBtn').on('click',function(){
        LoadExceptionDg();
    });
}
//回车事件
document.onkeydown=function(e){
    var ev=(typeof event!='undefined')?window.event:e;
    if(ev.keyCode==13){
        LoadDg();
    }
}
function LoadExceptionDg(){
    if($('#business_date').val() == ''){
        layer.msg('业务日期不能为空');
        return;
    }
    selectRow = null;
    // 字段赋值
    var input = {};
    input['TradeCode'] = "querydetailss_Exceptions^"  + GLOBAL.MODULENAME + "^" + GLOBAL.CLASSNAME;
    $.each(GLOBAL.FILEDS,function(index,key){
       input[key.id] = $('#' + key.id).val();
    });
    //CallMethod(input,init_dg,"DoMethod");
    init_Exceptiondg(input)
}

function init_Exceptiondg(jsonObj){
    try{
        layui.use('table', function(){
            var table = layui.table;
            //第一个实例
            table.render({
                id:'dg',
                elem: '#dg',
                field:'id',
                align:'center',
                border:'',
                //toolbar: '',
                defaultToolbar:false,
                size: 'sm', //表格尺寸 默认 sm
                height: 550 ,//定义高度
                even:false, //隔行背景
                url:  PYTHONSERVER + 'DoMethod', //数据接口
                page: true,
                limits:[15, 50, 100],
                limit:15,
                where:jsonObj,
                method:'post',
                parseData: function(ret){
                    var tmpArr = [];
                    $.each(ret.output['ResultSql'],function(key,val){
                        var tmpObj = JSON.parse(val);
                        tmpArr.push(tmpObj)
                    });
                    return {	
                        "code":200, //解析接口状态
                        "count": ret.output['TableCount'], //解析数据长度
                        //组织后台查询出来的数据
                        "data":tmpArr //解析数据列表
                      };
                },
                response: {
                    statusCode: 200 //重新规定成功的状态码为 200，table 组件默认为 0
                  },
                cols: [[ //表头
                    {field: GLOBAL.FILEDS[1].id, title: GLOBAL.FILEDS[1].title,width:150},//,sort:true 排序
                    {field: GLOBAL.FILEDS[2].id, title: GLOBAL.FILEDS[2].title,width:100},
                    {field: GLOBAL.FILEDS[3].id, title: GLOBAL.FILEDS[3].title,width:80},
                    {field: GLOBAL.FILEDS[4].id, title: GLOBAL.FILEDS[4].title,width:250},
                    {field: GLOBAL.FILEDS[5].id, title: GLOBAL.FILEDS[5].title,width:80},
                    {field: GLOBAL.FILEDS[6].id, title: GLOBAL.FILEDS[6].title,width:150},
                    {field: GLOBAL.FILEDS[7].id, title: GLOBAL.FILEDS[7].title,width:100},
                    {field: 'id', title: 'id',width:50}
                ]]
            });
            //监听行单击事件
            table.on('row(dg)', function(obj){
                //动态添加背景色
                 if(selectRow && selectRow.data.id == obj.data.id){ // 取消选中
                      selectRow = null;
                      obj.tr.siblings().removeClass('layui-table-click');
                     var formTable = $('.layui-form').find('input').not('#QueryBtn').not('#business_date').not('#ClearBtn');
           /*           $.each(formTable,function(index,input){
                         $(input).val('');
                     }); */ 
                 }else{
                     obj.tr.siblings().removeClass('layui-table-click');
                     selectRow = obj;
                     var formTable = $('.layui-form').find('input').not('#QueryBtn').not('#business_date').not('#ClearBtn');
          /*            $.each(formTable,function(index,input){
                         var id = $(input).attr('id');
                         $(input).val(obj.data[id]);
                     }); */
                 }
                if (selectRow) {
                    obj.tr.addClass('layui-table-click');
        /*             layui.use('form', function() {
                        var form = layui.form;
                        var formTable = $('.layui-form').find('select').not('#QueryBtn').not('#business_date').not('#ClearBtn');
                        $.each(formTable,function(index,select){
                            var id = $(select).attr('id');
                            $(select).val(obj.data[id]);
                            form.render("select");
                        }); 
                    });*/

                    var input = {};
                    input['TradeCode'] = "querybusiness_details^"  + GLOBALSon.MODULENAME + "^" + GLOBALSon.CLASSNAME;
                    input['fk_businessmaster_id']=selectRow.data.businessId;
                    init_rightDG(input);
                    init_leftDG("");
                }
            });
        });
    }catch(e){
        alert(e.ResponseText);
    }
}
function Clear(){
    selectRow = null;
    $('.layui-form').find('input').not('#QueryBtn').not('#ClearBtn').not('#business_date').val('');
    layui.use('form', function() {
        var form = layui.form;
        var formTable = $('.layui-form').find('select').not('#QueryBtn').not('#ClearBtn').not('#business_date').not('#ExceptionBtn');
        $.each(formTable,function(index,select){
            $(select).val('');
            form.render("select");
        });
    });
}
function LoadDg(){
    if($('#business_date').val() == ''){
        layer.msg('业务日期不能为空');
        return;
    }
    if(($('#his_master_id').val() == '')&&($('#usercode').val() == '')&&($('#PatientName').val() == '')&&($('#processcode').val() == '')&&($('#serial_number').val() == '')){
        layer.msg('姓名、终端号、登记号、流水号、交易类型、不能同时为空');
        return;
    }
    selectRow = null;
    // 字段赋值
    var input = {};
    input['TradeCode'] = "queryMasterLog^"  + GLOBAL.MODULENAME + "^" + GLOBAL.CLASSNAME;
    $.each(GLOBAL.FILEDS,function(index,key){
       input[key.id] = $('#' + key.id).val();
    });
    //CallMethod(input,init_dg,"DoMethod");
    init_dg(input)
}
function init_dg(jsonObj){
    try{
        layui.use('table', function(){
            var table = layui.table;
            //第一个实例
            table.render({
                id:'dg',
                elem: '#dg',
                field:'id',
                align:'center',
                border:'',
                //toolbar: '',
                defaultToolbar:false,
                size: 'sm', //表格尺寸 默认 sm
                height: 550 ,//定义高度
                even:false, //隔行背景
                url:  PYTHONSERVER + 'DoMethod', //数据接口
                page: true,
                limits:[15, 50, 100],
                limit:15,
                where:jsonObj,
                method:'post',
                parseData: function(ret){
                    var tmpArr = [];
                    $.each(ret.output['ResultSql'],function(key,val){
                        var tmpObj = JSON.parse(val);
                        tmpArr.push(tmpObj)
                    });
                    return {	
                        "code":200, //解析接口状态
                        "count": ret.output['TableCount'], //解析数据长度
                        //组织后台查询出来的数据
                        "data":tmpArr //解析数据列表
                      };
                },
                response: {
                    statusCode: 200 //重新规定成功的状态码为 200，table 组件默认为 0
                  },
                cols: [[ //表头
                    {field: GLOBAL.FILEDS[1].id, title: GLOBAL.FILEDS[1].title,width:150},//,sort:true 排序
                    {field: GLOBAL.FILEDS[2].id, title: GLOBAL.FILEDS[2].title,width:100},
                    {field: GLOBAL.FILEDS[3].id, title: GLOBAL.FILEDS[3].title,width:80},
                    {field: GLOBAL.FILEDS[4].id, title: GLOBAL.FILEDS[4].title,width:250},
                    {field: GLOBAL.FILEDS[5].id, title: GLOBAL.FILEDS[5].title,width:80},
                    {field: GLOBAL.FILEDS[6].id, title: GLOBAL.FILEDS[6].title,width:150},
                    {field: GLOBAL.FILEDS[7].id, title: GLOBAL.FILEDS[7].title,width:100},
                    {field: 'id', title: 'id',width:50}
                ]]
            });
            //监听行单击事件
            table.on('row(dg)', function(obj){
                //动态添加背景色
                 if(selectRow && selectRow.data.id == obj.data.id){ // 取消选中
                      selectRow = null;
                      obj.tr.siblings().removeClass('layui-table-click');
                     var formTable = $('.layui-form').find('input').not('#QueryBtn').not('#business_date').not('#ClearBtn');
           /*           $.each(formTable,function(index,input){
                         $(input).val('');
                     }); */ 
                 }else{
                     obj.tr.siblings().removeClass('layui-table-click');
                     selectRow = obj;
                     var formTable = $('.layui-form').find('input').not('#QueryBtn').not('#business_date').not('#ClearBtn');
          /*            $.each(formTable,function(index,input){
                         var id = $(input).attr('id');
                         $(input).val(obj.data[id]);
                     }); */
                 }
                if (selectRow) {
                    obj.tr.addClass('layui-table-click');
        /*             layui.use('form', function() {
                        var form = layui.form;
                        var formTable = $('.layui-form').find('select').not('#QueryBtn').not('#business_date').not('#ClearBtn');
                        $.each(formTable,function(index,select){
                            var id = $(select).attr('id');
                            $(select).val(obj.data[id]);
                            form.render("select");
                        }); 
                    });*/

                    var input = {};
                    input['TradeCode'] = "querybusiness_details^"  + GLOBALSon.MODULENAME + "^" + GLOBALSon.CLASSNAME;
                    input['fk_businessmaster_id']=selectRow.data.businessId;
                    init_rightDG(input);
                    init_leftDG("");
                }
            });
        });
    }catch(e){
        alert(e.ResponseText);
    }
}

function init_rightDG(jsonObj){
    try{
        layui.use('table', function(){
            //第一个实例
            table = layui.table,
            table.render({
                id:'rdg',
                elem: '#rdg',
                field:'id',
                align:'center',
                //toolbar:'',
                defaultToolbar:false,
                size: 'sm', //表格尺寸 默认 sm
                even:false, //隔行背景
                height: 550 ,//定义高度
                url:  PYTHONSERVER + 'DoMethod', //数据接口
                page: true,
                limits:[15, 50, 100],
                limit:15,
                where:jsonObj,
                method:'post',
                parseData: function(ret){
                    var tmpArr = [];
                    $.each(ret.output['ResultSql'],function(key,val){
                        var tmpObj = JSON.parse(val);
                        tmpArr.push(tmpObj)
                    });
                    return {	
                        "code":200, //解析接口状态
                        "count": ret.output['TableCount'], //解析数据长度
                        //组织后台查询出来的数据
                        "data":tmpArr //解析数据列表
                      };
                },
                response: {
                    statusCode: 200 //重新规定成功的状态码为 200，table 组件默认为 0
                  },
                cols: [[ //表头
                    {field: GLOBALSon.FILEDS[1].id, title: GLOBALSon.FILEDS[1].title,width:120},
                    {field: GLOBALSon.FILEDS[2].id, title: GLOBALSon.FILEDS[2].title,width:200},
                    {field: GLOBALSon.FILEDS[3].id, title: GLOBALSon.FILEDS[3].title,width:180},
                    {field: GLOBALSon.FILEDS[4].id, title: GLOBALSon.FILEDS[4].title,width:120},
                    //{field: GLOBALSon.FILEDS[5].id, title: GLOBALSon.FILEDS[5].title,width:120},
                ]],
            });
            //监听行单击事件
            table.on('row(rdg)', function(obj){
                if(selectRow && selectRow.data.id == obj.data.id){ // 取消选中
                    obj.tr.siblings().removeClass('layui-table-click');
                    selectRow = null;
                    var formTable = $('.form').find('input').not('#QueryBtn').not('#ClearBtn');
                    $.each(formTable,function(index,input){
                        $(input).val('');
                    });
                }else{
                    obj.tr.siblings().removeClass('layui-table-click');
                    selectRow = obj;
                }
                if (selectRow) {
                    obj.tr.addClass('layui-table-click');
                    layui.use('form', function() {
                        var form = layui.form;
                        var formTable = $('.layui-form').find('select').not('#QueryBtn').not('#ClearBtn');
                        $.each(formTable,function(index,select){
                            var id = $(select).attr('id');
                            $(select).val(obj.data[id]);
                            form.render("select");
                        });
                    });
                    var input = {};
                    input['TradeCode'] = "querybusiness_PageMethod^"  + GLOBALSon.MODULENAME + "^" + GLOBALSon.CLASSNAME;
                    input['fk_businessmaster_id']=selectRow.data.fk_businessmaster_id;
                    input['id']=selectRow.data.id;
                    input['modal_code']=selectRow.data.modal_code;
                    CallMethod(input,init_leftDG,"DoMethod");
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
function intef_outputformat(d)
{
    return util.escape(d.intef_output);
}
function intef_inputformat(d)
{
    return util.escape(d.intef_input);
}

function init_leftDG(jsonObj){
    try{
        if(jsonObj=="")
        {
            jsonObj={'output':[]}
            tmpArr=[];
        }
        else
     {    var tmpArr = [];
        $.each(jsonObj.output,function(key,val){
                var tmpObj = JSON.parse(val);
                tmpArr.push(tmpObj)
        });}

        
        layui.use(['form','layer','table','util'], function(){
            //第一个实例
            table = layui.table;
            util=layui.util;
            table.render({
                id:'lefg',
                elem: '#lefg',
                field:'id',
                align:'center',
                toolbar:'',
                defaultToolbar:false,
                border:'',
                height: 220 ,//定义高度
                size: 'sm', //表格尺寸 默认 sm
                even:false, //隔行背景
                url:  PYTHONSERVER + 'CallSelfServPY', //数据接口
                page: true,
                limits:[10, 50, 100],
                limit:10,
                parseData: function(ret){
                    return {	
                        "code":200, //解析接口状态
                        "count":jsonObj.output.length, //解析数据长度
                        "data":tmpArr //解析数据列表
                        };
                },
                response: {
                    statusCode: 200 //重新规定成功的状态码为 200，table 组件默认为 0
                    },
                cols: [[ //表头
                    {field: GLOBALPageMethod.FILEDS[1].id, title: GLOBALPageMethod.FILEDS[1].title,width:200},
                    {field: GLOBALPageMethod.FILEDS[2].id, title: GLOBALPageMethod.FILEDS[2].title,width:450,templet:intef_inputformat},
                    {field: GLOBALPageMethod.FILEDS[3].id, title: GLOBALPageMethod.FILEDS[3].title,width:180},
                    {field: GLOBALPageMethod.FILEDS[4].id, title: GLOBALPageMethod.FILEDS[4].title,width:450,templet:intef_outputformat},
                    {field: GLOBALPageMethod.FILEDS[5].id, title: GLOBALPageMethod.FILEDS[5].title,width:180},
                    {field: GLOBALPageMethod.FILEDS[6].id, title: GLOBALPageMethod.FILEDS[6].title,width:180},
                ]],
            });
            //监听行单击事件
/*             table.on('row(lefg)', function(obj){
                if(selectRow && selectRow.data.id == obj.data.id){ // 取消选中
                    obj.tr.siblings().removeClass('layui-table-click');
                    selectRow = null;
                    var formTable = $('.form').find('input').not('#QueryBtn').not('#ClearBtn');
                    $.each(formTable,function(index,input){
                        $(input).val('');
                    });
                }else{
                    obj.tr.siblings().removeClass('layui-table-click');
                    selectRow = obj;
                }
                if (selectRow) {
                    obj.tr.addClass('layui-table-click');
                }
            }); */
        });
    }catch(e){
        alert(e.ResponseText);
    }    
}
