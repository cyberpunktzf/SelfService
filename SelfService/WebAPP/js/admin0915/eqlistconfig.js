/**
 * FileName: admin.sysdicconfig.js
 * Anchor: tangzf
 * Date: 2020-3-23
 * Description: 设备列表维护
 */
var GLOBAL = {
    MODULENAME : 'SelfServPy.Common.ss_eqlistcfgCtl',
    CLASSNAME :'ELCFG',
    FILEDS:{
        '1':{'title':'设备编号','id':'ss_eqlistc_code','seq':'1'},
        '2':{'title':'设备名称','id':'ss_eqlistc_desc','seq':'2'},
        '3':{'title':'配置代码','id':'ss_eqlistc_cfgcode','seq':'3'},
        '4':{'title':'配置名称','id':'ss_eqlistc_cfgdesc','seq':'4'},
        '5':{'title':'配置值','id':'ss_eqlistc_cfgvalue','seq':'5'},
        '6':{'title':'创建日期','id':'ss_eqlistc_createdate','seq':'6'},
        '7':{'title':'创建人','id':'ss_eqlistc_creator','seq':'7'},
        '8':{'title':'修改日期','id':'ss_eqlistc_update','seq':'8'},
        '9':{'title':'修改人','id':'ss_eqlistc_upuser','seq':'9'}
    }
}
var selectRow;

$(function () {
    // init_input
    init_input();
    //rederSelect();
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
    layui.use('laydate', function(){
        var laydate = layui.laydate;
        laydate.render({
            elem:'#ss_eqlistc_createdate',
            type:'datetime'
        });
    });
    layui.use('laydate', function(){
        var laydate = layui.laydate;
        laydate.render({
            elem:'#ss_eqlistc_update',
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
                    {field: GLOBAL.FILEDS[1].id, title: GLOBAL.FILEDS[1].title,width:120},
                    {field: GLOBAL.FILEDS[2].id, title: GLOBAL.FILEDS[2].title,width:120},
                    {field: GLOBAL.FILEDS[3].id, title: GLOBAL.FILEDS[3].title,width:120},
                    {field: GLOBAL.FILEDS[4].id, title: GLOBAL.FILEDS[4].title,width:120},
                    {field: GLOBAL.FILEDS[5].id, title: GLOBAL.FILEDS[5].title,width:120},
                    {field: GLOBAL.FILEDS[6].id, title: GLOBAL.FILEDS[6].title,width:120},
                    {field: GLOBAL.FILEDS[7].id, title: GLOBAL.FILEDS[7].title,width:120},
                    {field: GLOBAL.FILEDS[8].id, title: GLOBAL.FILEDS[8].title,width:120},
                    {field: GLOBAL.FILEDS[9].id, title: GLOBAL.FILEDS[9].title,width:120},
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
            $('#ss_eqlistc_code').append(new Option(value.ss_eqlistd_eqcode))
        });
        form.render("select");
        form.on('select(ss_eqlistc_code)',function(data){
            var input = {};
            input['TradeCode'] = "query^"  + "SelfServPy.Common.ss_eqlistdCtl" + "^" + "ELC";
            input["ss_eqlistd_eqcode"] =data.value;
            CallMethod(input,function(jsonObj){
                var tmpArr=[];
                $.each(jsonObj.output,function(key,val){
                    var tmpObj = JSON.parse(val);
                    tmpArr.push(tmpObj);
                });
                $('#ss_eqlistc_desc').val(tmpArr[0].ss_eqlistd_eqdesc);
            },"DoMethod");
        });
        
    });
}


