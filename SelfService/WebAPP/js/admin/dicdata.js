/**
 * FileName: admin.sysdicconfig.js
 * Anchor: tangzf
 * Date: 2020-3-23
 * Description: 设备列表维护
 */
var GLOBAL = {
    MODULENAME : 'SelfServPy.Common.ss_dicdataCtl',
    CLASSNAME :'DDC',
    FILEDS:{
        '1':{'title':'字典类型','id':'ss_dic_type','seq':'1'},
        '2':{'title':'字典代码','id':'ss_dic_code','seq':'2'},
        '3':{'title':'字典描述','id':'ss_dic_desc','seq':'3'},
        '4':{'title':'字典备注','id':'ss_dic_demo','seq':'4'}
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
        $('.selectid' + seq).attr('id',"select_"+id);
        $('.selectid' + seq).attr('lay-filter',id);
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
                even:false, //隔行背景
                url:  PYTHONSERVER + 'CallSelfServPY', //数据接口
                toolbar:'dg',
                defaultToolbar: ['filter','exports','print'],
                page: true,
                limits:[50, 100, 150],
                limit:50,
                height: 780 ,//定义高度
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
                    {field: GLOBAL.FILEDS[3].id, title: GLOBAL.FILEDS[3].title,width:220},
                    {field: GLOBAL.FILEDS[4].id, title: GLOBAL.FILEDS[4].title,width:240},
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
    CodeInput['TradeCode'] = "query^"  + GLOBAL.MODULENAME + "^" + GLOBAL.CLASSNAME;
    CodeInput["ss_dic_type"] ="SYS";
    CallMethod(CodeInput,initTypeSelect,"DoMethod");
}
function initTypeSelect(jsonObj) {
    var tmpArr = [];
    var afterTmpArr=[];
    $.each(jsonObj.output,function(key,val){
        var tmpObj = JSON.parse(val);
        tmpArr.push(tmpObj);    //ss_dic_code
    });
    //处理数据去重  ShangXuehao
    tmpArr.forEach(function(value,index,tmpArr){
        var bool = tmpArr.indexOf(value,index+1);
        if (bool == -1){
            afterTmpArr.push(value);
        }
    });
    layui.use('form', function() {
        var form = layui.form;
        afterTmpArr.forEach(function(value){
            $('#select_ss_dic_type').append(new Option(value.ss_dic_code));
        });
        form.render("select");
        form.on('select(ss_dic_type)',function(data){
            // 1.layui下拉不选中不支持输入文本提交，所以利用文本框和下拉框组合，下拉选中给文本赋值，提交时提交文本内容 ShangXuehao
            $('#ss_dic_type').val(data.value);
            $('#select_ss_dic_type').next().find('dl').css({'display':'none'});
        });
        // 2. 监听input,获取input的值来隐藏和现实dd
        $('#ss_dic_type').on('input',function(e){
            var value = e.delegateTarget.value;
            $('#select_ss_dic_type').val(value);
            form.render('select');
            // 3.判断不为空再显示，不然会有bug，关不掉select
            if (value != ""){
                $('#select_ss_dic_type').next().find('dl').css({'display':'block'});
            }
            var dl = $('#select_ss_dic_type').next().find('dl').children();
            var j = -1;
            for (var i =0;i<dl.length;i++){
                if (dl[i].innerHTML.indexOf(value) <= -1){
                    dl[i].style.display="none";
                    j++;
                }
                if (j == dl.length-1) {
                    $('#select_ss_dic_type').next().find('dl').css({'display':'none'});
                }
            }
        });
    });
}