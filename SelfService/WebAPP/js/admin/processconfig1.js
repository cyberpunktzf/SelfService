/**
 * FileName: admin.sysdicconfig.js
 * Anchor: tangzf
 * Date: 2020-3-23
 * Description: 设备列表维护
 */

var GLOBAL = {
    MODULENAME : 'SelfServPy.Common.ss_processconfigCtl',
    CLASSNAME :'PCC',
    FILEDS:{
        '1':{'title':'类型','id':'ss_pc_dictype','seq':'1'},
        '2':{'title':'代码','id':'ss_pc_diccode','seq':'2'},
        '3':{'title':'描述','id':'ss_pc_dicdesc','seq':'3'},
        '4':{'title':'流程代码','id':'ss_pc_processcode','seq':'4'},
        '5':{'title':'值','id':'ss_pc_demo','seq':'5'},
        '6':{'title':'保存模式','id':'ss_pc_savemode','seq':'6'},
        '7':{'title':'保存值','id':'ss_pc_saveval','seq':'7'}
    }
}
var selectRow;
var table;
var defPW = 'root';
var EDITINDEX = undefined;

$(function () {
    // init_input
    init_input();
    LoadDg();
})
function init_rightDG(jsonObj){
    try{
        if(!jsonObj['length'] && jsonObj['length']!=0){
            jsonObj = jsonObj['ss_pc_demo'];
            jsonObj = JSON.parse(jsonObj)
            $.each(jsonObj,function(index,row){
                jsonObj[index]['Seq'] = index;
                if(row.config !=""){
                    jsonObj[index].config = JSON.stringify(jsonObj[index].config);
                }
            });
        }
        layui.use('table', function(){
            //第一个实例
            table = layui.table;
            table.render({
                id:'rdg',
                elem: '#rdg',
                field:'Seq',
                align:'center',
                toolbar:'#RDGTB',
                defaultToolbar:false,
                border:'',
                size: 'sm', //表格尺寸 默认 sm
                height: 750 ,//定义高度
                even:false, //隔行背景
                url:  PYTHONSERVER + 'CallSelfServPY', //数据接口
                page: true,
                limits:[50, 100, 150],
                limit:50,
                parseData: function(ret){
                    return {	
                        "code":200, //解析接口状态
                        "count": jsonObj.length, //解析数据长度
                        "data":jsonObj //解析数据列表
                      };
                },
                response: {
                    statusCode: 200 //重新规定成功的状态码为 200，table 组件默认为 0
                  },//Seq,Operation,desc,code,page,config
                cols: [[ //表头 {"1":{"desc":"读卡","code":"readcard","page":"/WebAPP/pages/common/readcard.show.html?","config":{"url":"/WebAPP/themes/images/card12.gif","cardmode":"1"}},"2":{"desc":"流调表","code":"srvylist","page":"/WebAPP/pages/common/srvylist.html?","config":""},"3":{"desc":"选择一级科室","code":"level1dep","page":"/WebAPP/pages/prereg/level1department.html?","config":""},"4":{"desc":"选择二级科室","code":"level2dep","page":"/WebAPP/pages/prereg/department.html?","config":""},"5":{"desc":"选择医生","code":"predoc","page":"/WebAPP/pages/prereg/doctor.html?","config":""},"6":{"desc":"选择日期","code":"predocdat","page":"/WebAPP/pages/prereg/doctordetails.html?","config":""},"7":{"desc":"选择时间","code":"predoctime","page":"/WebAPP/pages/prereg/doctor.timeinfo.html?","config":""},"8":{"desc":"确认联系方式","code":"modifypat","page":"/WebAPP/pages/common/modifypatinfo.html?","config":""},"9":{"desc":"确认完成","code":"pay","page":"/WebAPP/pages/common/pay.html?","config":""}}
                    {field: 'Seq', title: '序号',width:60,edit:'text',align:'center'},
                    {field: 'desc', title: '描述',edit:'text',width:160,align:'center'},
                    {field: 'code', title: '代码',edit:'text',width:120,align:'center'},
                    {field: 'page', title: '界面URL',edit:'text',width:370,align:'center'},
                    {field: 'config', title: '读卡图片地址',edit:'text',width:410,align:'center'}
                ]]
            });
            //监听行单击事件
            table.on('row(rdg)', function(obj){
                console.log(1);
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
            table.on('tool(rdg)',function(obj){
                var event = obj.event;
                alert(obj);
                console.log("yyy"+obj.data)
            });
        });
    }catch(e){
        alert(e.ResponseText);
    }    
}
function init_input(){
    $.each(GLOBAL.FILEDS,function(index,key){
        var id = key.id;
        var title = key.title;
        var seq = key.seq;
        $('.title' + seq).text(title);
        $('.id' + seq).attr('id',id);
    });  
}

function SaveLDG(){
    layer.prompt(function(val,index,elem){  
        if(val != defPW){
            layer.msg('验证失败');
            layer.close(index);
            return;
        }else{
            layer.close(index);
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
            },"DoMethod");
        }
        
    })

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
    loadRDG([]);
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
            table = layui.table;
            //第一个实例
            table.render({
                id:'dg',
                elem: '#dg',
                field:'id',
                align:'center',
                border:'',
                toolbar:'#LDGTB',
                defaultToolbar:false,
                size: 'sm', //表格尺寸 默认 sm
                even:false, //隔行背景
                url:  PYTHONSERVER + 'CallSelfServPY', //数据接口
                page: true,
                limits:[50, 100, 150],
                limit:50,
                height:750,
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
                    {field: GLOBAL.FILEDS[1].id, title: GLOBAL.FILEDS[1].title,width:100,align:'center'},
                    {field: GLOBAL.FILEDS[2].id, title: GLOBAL.FILEDS[2].title,width:140,align:'center'},
                    {field: GLOBAL.FILEDS[3].id, title: GLOBAL.FILEDS[3].title,width:160,align:'center'},
                    {field: GLOBAL.FILEDS[4].id, title: GLOBAL.FILEDS[4].title,width:100,align:'center'},
                    {field: GLOBAL.FILEDS[5].id, title: GLOBAL.FILEDS[5].title,width:160,align:'center'},
                    {field: GLOBAL.FILEDS[6].id, title: GLOBAL.FILEDS[6].title,width:100,align:'center'},
                    {field: GLOBAL.FILEDS[7].id, title: GLOBAL.FILEDS[7].title,width:100,align:'center'},
                    {field: 'id', title: 'id',width:60,align:'center'}
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
                    loadRDG(selectRow.data);
                }else{
                    loadRDG([])
                }
                
            });
        });
    }catch(e){
        alert(e.ResponseText);
    }
}
function loadRDG(jsonObj){
    init_rightDG(jsonObj);
}
function SaveRDG(){
    var input = {};
    input['TradeCode'] = "insert^"  + GLOBAL.MODULENAME + "^" + GLOBAL.CLASSNAME;
    if(selectRow){
        input['id'] = selectRow.data.id;
    }else{
        layer.msg(' 未选择数据');
    }
   
    var rowInfo = table.cache['rdg'];
    var insertInfo = {};
    $.each(rowInfo,function(index,rowData){
        var tmpRowData = JSON.parse(JSON.stringify(rowData));
        delete tmpRowData.Seq;
        delete tmpRowData.LAY_TABLE_INDEX;
        insertInfo[rowData.Seq] = tmpRowData;
    })
    insertInfo = JSON.stringify(insertInfo);
    input['ss_pc_demo'] = insertInfo;
    CallMethod(input,function(){
        layer.msg('保存成功');
        EDITINDEX = undefined;
    },"DoMethod");
}
function UP(){
    var datalist = getDataList("rdg");
    var tr = $("#UP").parent().parent().parent();
    console.log(2);
    var prev = tr.prev();
    var tem = datalist[tr.index()];
    var tem2 = datalist[prev.index()];
    console.log(3);
    $(tr).insertBefore($(prev));
}
function DOWN(){

}
function RSort(){

}
function AddRDG(){
    if (EDITINDEX) {
        layer.msg("每次只能添加一条记录！",{icon:5});
        return;
    }
    var datalist = getDataList("rdg");
    var index = Object.keys(datalist).length;
    var newData = {
            desc: "",
            code: "",
            page: "",
            config: "",
            Seq: ""
    }
    var newDataList = createJson(datalist,Object.keys(datalist).length+1,newData);
    EDITINDEX = index;
    table.reload("rdg",{
       data: newDataList
    });

}
// 封装新增一行空数据的方法 ShangXuehao
function createJson(json,prop,val){
    if (typeof val == "undefined"){
        delete json[prop];
    } else {
        json[prop] = val;
    }
}