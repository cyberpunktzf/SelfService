/**
 * FileName: admin.sysdicconfig.js
 * Anchor: Lizhi
 * Date: 2020-10-23
 * Description: 设备列表维护
 */
var GLOBAL = {
    MODULENAME : 'SelfServPy.Common.ss_eqruleCtl',
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
var GLOBALSon = {
    MODULENAME : 'SelfServPy.Common.ss_eqrdetailsCtl',
    CLASSNAME :'ERC',
    FILEDS:{
        '1':{'title':'规则分类','id':'ss_eqrd_type','seq':'1'},
        '2':{'title':'规则代码','id':'ss_eqrd_code','seq':'2'},
        '3':{'title':'开始值','id':'ss_eqrd_stval','seq':'3'},
        '4':{'title':'结束值','id':'ss_eqrd_endval','seq':'4'},
        '5':{'title':'操作符','id':'ss_eqrd_option','seq':'5'},
        '6':{'title':'规则生效开始日期','id':'ss_eqrd_stdate','seq':'6'},
        '7':{'title':'规则失效结束时间','id':'ss_eqrd_enddate','seq':'7'},
        '8':{'title':'是否有效','id':'ss_eqrd_actflag','seq':'8'},
        '9':{'title':'创建日期','id':'ss_eqrd_createdate','seq':'9'},
        '10':{'title':'创建人','id':'ss_eqrd_creator','seq':'10'},
        '11':{'title':'修改日期','id':'ss_eqrd_update','seq':'11'},
        '12':{'title':'修改人','id':'ss_eqrd_upuser','seq':'12'}
    }
}
var selectRow;
//var DGHeight = 760;
//var RDGHeight = 676;
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
                size: 'sm', //表格尺寸 默认 sm
                height: 750 ,//定义高度
                even:false, //隔行背景
                url:  PYTHONSERVER + 'CallSelfServPY', //数据接口
                //height:DGHeight,
                toolbar:'#LDGTB',
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
                    {field: GLOBAL.FILEDS[1].id, title: GLOBAL.FILEDS[1].title,width:150},
                    {field: GLOBAL.FILEDS[2].id, title: GLOBAL.FILEDS[2].title,width:150},
                    {field: GLOBAL.FILEDS[3].id, title: GLOBAL.FILEDS[3].title,width:200},
                    {field: GLOBAL.FILEDS[4].id, title: GLOBAL.FILEDS[4].title,width:200},
                    {field: GLOBAL.FILEDS[5].id, title: GLOBAL.FILEDS[5].title,width:180},
                    {field: GLOBAL.FILEDS[6].id, title: GLOBAL.FILEDS[6].title,width:180},
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
                    obj.tr.removeClass('layui-table-click');
                    obj.tr.siblings().removeClass('layui-table-click');
                    selectRow = null;
                    var formTable = $('.layui-form').find('input');
                    $.each(formTable,function(index,input){
                        $(input).val('');
                    });
                }else{
                    selectRow = obj;
                    obj.tr.removeClass('layui-table-click');
                    obj.tr.siblings().removeClass('layui-table-click');
                    var formTable = $('.layui-form').find('input');
                    $.each(formTable,function(index,input){
                        var id = $(input).attr('id');
                        $(input).val(obj.data[id]);
                    });
                }
                if (selectRow){
                    var input = {};
                    obj.tr.addClass('layui-table-click');
                    input['TradeCode'] = "query^"  + GLOBALSon.MODULENAME + "^" + GLOBALSon.CLASSNAME;
                    input['ss_eqrd_code']=selectRow.data.ss_eqr_code
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
                //height:RDGHeight,
                align:'center',
                toolbar:'',
                defaultToolbar:false,
                border:'',
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
                    {field: GLOBALSon.FILEDS[1].id, title: GLOBALSon.FILEDS[1].title,width:120},
                    {field: GLOBALSon.FILEDS[2].id, title: GLOBALSon.FILEDS[2].title,width:120},
                    {field: GLOBALSon.FILEDS[3].id, title: GLOBALSon.FILEDS[3].title,width:120},
                    {field: GLOBALSon.FILEDS[4].id, title: GLOBALSon.FILEDS[4].title,width:120},
                    {field: GLOBALSon.FILEDS[5].id, title: GLOBALSon.FILEDS[5].title,width:120},
                    {field: GLOBALSon.FILEDS[6].id, title: GLOBALSon.FILEDS[6].title,width:120},
                    {field: GLOBALSon.FILEDS[7].id, title: GLOBALSon.FILEDS[7].title,width:120},
                    {field: GLOBALSon.FILEDS[8].id, title: GLOBALSon.FILEDS[8].title,width:120},
                    {field: GLOBALSon.FILEDS[9].id, title: GLOBALSon.FILEDS[9].title,width:120},
                    {field: GLOBALSon.FILEDS[10].id, title: GLOBALSon.FILEDS[10].title,width:120},
                    {field: GLOBALSon.FILEDS[11].id, title: GLOBALSon.FILEDS[11].title,width:120},
                    {field: GLOBALSon.FILEDS[12].id, title: GLOBALSon.FILEDS[12].title,width:120},
                    {field: 'id', title: 'id',width:120}
                ]]
            });
            //监听行单击事件
            table.on('row(rdg)', function(obj){
            });
            //监听单元格事件
            table.on('edit(rdg)', function(obj){
                var afterVal = obj.value;
                var rowData = obj.data;
                var field = obj.field;
                if(field == 'Seq'){
                    RSort();
                }
            });
        });
    }catch(e){
        alert(e.ResponseText);
    }    
}