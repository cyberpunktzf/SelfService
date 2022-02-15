/**
 * FileName: admin.logquery.js
 * Anchor: tangzf
 * Date: 2020-3-23
 * Description: 日志查询
 */
var GLOBAL = {
    MODULENAME : 'SelfServPy.Common.business_masterCtl',
    CLASSNAME :'BM',
    FILEDS:{
        '1':{'title':'业务流水号','id':'serial_number','seq':'1'},
        '2':{'title':'业务代码','id':'code','seq':'2'},
        '3':{'title':'业务描述','id':'desc','seq':'3'},
        '4':{'title':'业务日期','id':'business_date','seq':'4'},
        '5':{'title':'终端信息','id':'terminal_info','seq':'5'},
        '6':{'title':'流程代码','id':'processcode','seq':'6'} 
    }
}
var GLOBALSon = {
    MODULENAME : 'SelfServPy.Common.business_detailsCtl',
    CLASSNAME :'BD',
    FILEDS:{
        '1':{'title':'业务主表id','id':'fk_businessmaster_id','seq':'1'},
        '2':{'title':'自助业务流水号','id':'serial_number','seq':'2'},
        '3':{'title':'HIS业务流水号','id':'his_serial_number','seq':'3'},
        '4':{'title':'模块代码','id':'modal_code','seq':'4'},
        '5':{'title':'接口代码','id':'intef_code','seq':'5'},
        '6':{'title':'接口描述','id':'intef_desc','seq':'6'},
        '7':{'title':'接口入参','id':'intef_input','seq':'7'},
        '8':{'title':'接口出参','id':'intef_output','seq':'8'}   
    }
}
var GLOBALSon1 = {
    MODULENAME : 'patinfoCtl',
    CLASSNAME :'PT',
    FILEDS:{
        '1':{'title':'业务主表id','id':'fk_businessmaster_id','seq':'1'},
        '2':{'title':'基本信息代码','id':'code','seq':'2'},
        '3':{'title':'基本信息值','id':'code_val','seq':'3'},
        '4':{'title':'his患者唯一号','id':'his_master_id','seq':'4'},  
    }
}
var selectRow;
$(function () {
    // init_input
    init_input();
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
    layui.use('laydate', function(){
        var laydate = layui.laydate;
        laydate.render({
            elem:'#business_date',
            type:'datetime'
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
    //LoadDg();
}
function LoadDg(){
    selectRow = null;
    // 字段赋值
    var input = {};
    input['TradeCode'] = "queryForLog^query_business^QB";
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
                toolbar: '',
                defaultToolbar:false,
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
                    {field: GLOBAL.FILEDS[6].id, title: GLOBAL.FILEDS[6].title,width:120},
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
                if(selectRow){
                    var input = {};
                    input['TradeCode'] = "query^"  + GLOBALSon.MODULENAME + "^" + GLOBALSon.CLASSNAME;
                    input['fk_businessmaster_id']=selectRow.data.id
                    CallMethod(input,init_rightDG,"DoMethod");
                    CallMethod(input,init_rightDG1,"DoMethod");
                }else{

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
                    {field: GLOBALSon.FILEDS[2].id, title: GLOBALSon.FILEDS[2].title,width:120},
                    {field: GLOBALSon.FILEDS[3].id, title: GLOBALSon.FILEDS[3].title,width:120},
                    {field: GLOBALSon.FILEDS[4].id, title: GLOBALSon.FILEDS[4].title,width:120},
                    {field: GLOBALSon.FILEDS[5].id, title: GLOBALSon.FILEDS[5].title,width:120},
                    {field: GLOBALSon.FILEDS[6].id, title: GLOBALSon.FILEDS[6].title,width:120},
                    {field: GLOBALSon.FILEDS[7].id, title: GLOBALSon.FILEDS[7].title,width:120},
                    {field: GLOBALSon.FILEDS[8].id, title: GLOBALSon.FILEDS[8].title,width:120},
                    {field: 'id', title: 'id',width:120}
                ]],
                done:function(res,curr,count){
                    $('.layui-table').find("[data-field='fk_businessmaster_id'],[data-field='id']").css("display","none");
                }
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
function init_rightDG1(jsonObj){
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
                id:'rdg1',
                elem: '#rdg1',
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
                    {field: GLOBALSon1.FILEDS[1].id, title: GLOBALSon1.FILEDS[1].title,width:120},
                    {field: GLOBALSon1.FILEDS[2].id, title: GLOBALSon1.FILEDS[2].title,width:120},
                    {field: GLOBALSon1.FILEDS[3].id, title: GLOBALSon1.FILEDS[3].title,width:120},
                    {field: GLOBALSon1.FILEDS[4].id, title: GLOBALSon1.FILEDS[4].title,width:120},
                    {field: 'id', title: 'id',width:120}
                ]],
                done:function(res,curr,count){
                    $('.layui-table').find("[data-field='fk_businessmaster_id'],[data-field='id']").css("display","none");
                }
            });
            //监听行单击事件
            table.on('row(rdg1)', function(obj){

            });
            //监听单元格事件
            table.on('edit(rdg1)', function(obj){
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