/**
 * FileName: admin.sysdicconfig.js
 * Anchor: tangzf
 * Date: 2020-3-23
 * Description: 设备列表维护
 */
var GLOBAL = {
    MODULENAME : 'SelfServPy.Common.ss_eqrdetailsCtl',
    CLASSNAME :'ERC',
    FILEDS:{
        '1':{'title':'规则分类','id':'ss_eqr_type','seq':'1'},
        '2':{'title':'规则代码','id':'ss_eqr_code','seq':'2'},
        '3':{'title':'规则描述','id':'ss_eqr_desc','seq':'3'},
        '4':{'title':'规则备注','id':'ss_eqr_demo','seq':'4'},
        '5':{'title':'生效日期','id':'ss_eqr_stdate','seq':'5'},
        '6':{'title':'失效日期','id':'ss_eqr_enddate','seq':'6'},
        '7':{'title':'保存模式','id':'ss_eqr_savemode','seq':'7'},
        '8':{'title':'保存值','id':'ss_eqr_saveval','seq':'8'},
        '9':{'title':'控制类型','id':'ss_eqr_conflag','seq':'9'},
        '10':{'title':'生效标志','id':'ss_eqr_actflag','seq':'10'}
    }
}
var selectRow;
var DGHeight = 760;
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
    });  
    layui.use('laydate', function(){
       var laydate = layui.laydate;
           laydate.render({
            elem: '#ss_eqr_stdate',
            type: 'datetime'
           });
           laydate.render({
            elem: '#ss_eqr_enddate',
            type: 'datetime'
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
                height:DGHeight,
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
                    {field: GLOBAL.FILEDS[6].id, title: GLOBAL.FILEDS[6].title,width:120},
                    {field: GLOBAL.FILEDS[7].id, title: GLOBAL.FILEDS[7].title,width:120},
                    {field: GLOBAL.FILEDS[8].id, title: GLOBAL.FILEDS[8].title,width:120},
                    {field: GLOBAL.FILEDS[9].id, title: GLOBAL.FILEDS[9].title,width:120},
                    {field: GLOBAL.FILEDS[10].id, title: GLOBAL.FILEDS[10].title,width:120},
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