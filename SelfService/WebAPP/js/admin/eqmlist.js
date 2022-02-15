/**
 * FileName: admin.sysdicconfig.js
 * Anchor: tangzf
 * Date: 2020-3-23
 * Description: 设备模块列表维护
 */
var GLOBAL = {
    MODULENAME : 'SelfServPy.Common.ss_eqmlistCtl',
    CLASSNAME :'EMLC',
    FILEDS:{
        '1':{'title':'设备编号','id':'ss_eqmlist_eqcode','seq':'1'},
        '2':{'title':'设备名称','id':'ss_eqmlist_eqdesc','seq':'2'},
        '3':{'title':'模块编号','id':'ss_eqmlist_modcode','seq':'3'},
        '4':{'title':'模块名称','id':'ss_eqmlist_moddesc','seq':'4'},
        '5':{'title':'模块状态','id':'ss_eqmlist_modstatus','seq':'5'}
    }
}
var selectRow;
$(function () {
    // init_input
    init_input();
    LoadDg();
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
        $('.id' + seq).attr('lay-filter',id);
    });  
    LoadSelect();
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
                    {field: GLOBAL.FILEDS[1].id, title: GLOBAL.FILEDS[1].title,width:120},
                    {field: GLOBAL.FILEDS[2].id, title: GLOBAL.FILEDS[2].title,width:120},
                    {field: GLOBAL.FILEDS[3].id, title: GLOBAL.FILEDS[3].title,width:120},
                    {field: GLOBAL.FILEDS[4].id, title: GLOBAL.FILEDS[4].title,width:120},
                    {field: GLOBAL.FILEDS[5].id, title: GLOBAL.FILEDS[5].title,width:120},
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
            });
        });
    }catch(e){
        alert(e.ResponseText);
    }
}
// 加载下拉 
function LoadSelect(){
    var input = {};
    input['TradeCode'] = "query^"  + "SelfServPy.Common.ss_eqlistdCtl" + "^" + "ELC";
    input["ss_eqlistd_eqcode"] ="";
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
            $('#ss_eqmlist_eqcode').append(new Option(value.ss_eqlistd_eqcode))
        });
        form.render("select");
        form.on('select(ss_eqmlist_eqcode)',function(data){
            var input = {};
            input['TradeCode'] = "query^"  + "SelfServPy.Common.ss_eqlistdCtl" + "^" + "ELC";
            input["ss_eqlistd_eqcode"] =data.value;
            CallMethod(input,function(jsonObj){
                var tmpArr=[];
                $.each(jsonObj.output,function(key,val){
                    var tmpObj = JSON.parse(val);
                    tmpArr.push(tmpObj);
                });
                $('#ss_eqmlist_eqdesc').val(tmpArr[0].ss_eqlistd_eqdesc);
            },"DoMethod");
        });
        
    });
}
