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
        '6':{'title':'流程代码','id':'processcode','seq':'6'} ,
		'7':{'title':'操作员代码','id':'usercode','seq':'7'}
    }
}
var GLOBALSon = {
    MODULENAME : 'SelfServPy.Common.business_detailsCtl',
    CLASSNAME :'BD',
    FILEDS:{
        '1':{'title':'业务主表id','id':'fk_businessmaster_id','seq':'1'},
        '2':{'title':'自助业务流水号','id':'serial_number','seq':'2'},
        '3':{'title':'HIS业务流水号','id':'his_serial_number','seq':'3'},
        '4':{'title':'接口入参','id':'intef_input','seq':'4'},
        '5':{'title':'接口出参','id':'intef_output','seq':'5'},
        '6':{'title':'模块代码','id':'modal_code','seq':'6'},
        '7':{'title':'接口代码','id':'intef_code','seq':'7'},
        '8':{'title':'接口描述','id':'intef_desc','seq':'8'}
    }
}
var GLOBALSon1 = {
    MODULENAME : 'patinfoCtl',
    CLASSNAME :'PT',
    FILEDS:{
        '1':{'title':'业务主表id','id':'fk_businessmaster_id','seq':'1'},
        '2':{'title':'基本信息代码','id':'code','seq':'2'},
        '3':{'title':'基本信息值','id':'code_val','seq':'3'},
        '4':{'title':'his患者唯一号','id':'his_master_id','seq':'4'}
    }
}

var selectRow;
var typeSelect;
var businessId;

$(function () {
    // init_input
    init_input();
    //LoadDg();
    //init_dg(); 
    init_btn(); 

})
function init_input(){
    $.each(GLOBAL.FILEDS, function(index,key){
        var id = key.id;
        var title = key.title;
        var seq = key.seq;
        $('.title' + seq).text(title);
        $('.id' + seq).attr('id', id);
    });
    $.each(GLOBALSon.FILEDS,function(index,key){
        var id = key.id;
        var title = key.title;
        var seq = key.seq;
        $('.dettitle' + seq).text(title);
        $('.detid' + seq).attr('id',"det_"+id);
    }); 
    LoadSelect();
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
    $('#QueryDetBtn').on('click',function(){
        LoadDetDg(businessId);
    });

    $('#ClearDetBtn').on('click',function(){
        ClearDetDg();
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
        CallMethod(input, function(){
            layer.msg('删除成功');
            Clear();
        }, "DoMethod");
    }); 
}
function Clear(){
    selectRow = null;
    businessId = null;
    $('.layui-form').find('input').val('');
    layui.use('form', function() {
        var form = layui.form;
        var formTable = $('.layui-form').find('select');
        $.each(formTable,function(index,select){
            $(select).val('');
            form.render("select");
        });
    });
    typeSelect.update({
        disabled:true
    });
    //LoadDg();
}
function ClearDetDg(){
    selectRow = null;
    $('.detform').find('input').val('');
    $('#terinfo').text('');
    LoadDetDg(businessId);
}

function LoadDg(){
     if($('#business_date').val() == ''){
         layer.msg('业务日期不能为空');
         return;
     }
     if($('#processcode').val() == ''){
        layer.msg('流程代码不能为空');
        return;
    }
    selectRow = null;
    // 字段赋值
    var input = {};    //query_business.py
    input['TradeCode'] = "queryForLog^SelfServPy.Common.query_business^QB";
    $.each(GLOBAL.FILEDS,function(index,key){
        input[key.id] = $('#' + key.id).val();
    });
    //
	//input['UserCode'] = $('#UserCode').val();
	input['hisPatNo'] = $('#hisPatNo').val();
    /*CallMethod(input, init_dg, "DoMethod");*/
    init_dg(input)
}

function init_dg(jsonObj){
    try{
        /*var tmpArr = [];
        $.each(jsonObj.output,function(key,val){
            var tmpObj = JSON.parse(val);
            tmpArr.push(tmpObj)
        });*/
        layui.use('table', function(){
            var table = layui.table;
            //第一个实例
            table.render({
                id:'dg',
                elem: '#dg',
                field:'id',
                align:'center',
                border:'',
                //toolbar: 'logTool',
                //defaultToolbar: ['filter','print','exports'],
                size: 'lg', //表格尺寸 默认 sm
                even: false, //隔行背景
                height: 500,
                url:  PYTHONSERVER + 'DoMethod', //数据接口
                page: true,
                method:'post',
                where:jsonObj,
                limits:[50, 100, 150],
                limit: 50,
                parseData: function(ret){
                    return {	
                        "code": 200,   //解析接口状态
                        "count": jsonObj.output.length, //解析数据长度
                        "data":tmpArr      //解析数据列表
                      };
                },
                response: {
                    statusCode: 200   //重新规定成功的状态码为 200，table 组件默认为 0
                  },
                cols: [[ //表头
                    {field: GLOBAL.FILEDS[1].id, title: GLOBAL.FILEDS[1].title, width:120},
                    {field: GLOBAL.FILEDS[2].id, title: GLOBAL.FILEDS[2].title, width:120},
                    {field: GLOBAL.FILEDS[3].id, title: GLOBAL.FILEDS[3].title, width:120, hide:true},
                    {field: GLOBAL.FILEDS[4].id, title: GLOBAL.FILEDS[4].title, width:120, hide:true},
                    {field: GLOBAL.FILEDS[5].id, title: GLOBAL.FILEDS[5].title, width:300},
                    {field: GLOBAL.FILEDS[6].id, title: GLOBAL.FILEDS[6].title, width:120},
					{field: GLOBAL.FILEDS[7].id, title: GLOBAL.FILEDS[7].title, width:120},
                    {field: 'id', title: 'id', width:120, hide:true}
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
                    layui.use('form', function() {
                        var form = layui.form;
                        var formTable = $('.layui-form').find('select');
                        $.each(formTable,function(index,select){
                            var id = $(select).attr('id');
                            $(select).val(obj.data[id]);
                            var UserCode = JSON.parse(selectRow.data.terminal_info).UserCode;
                            $('#UserCode').val(UserCode);
                            form.render("select");
                        });
                    });
                    var input = {};
                    input['TradeCode'] = "query^"  + GLOBALSon.MODULENAME + "^" + GLOBALSon.CLASSNAME;
                    input['fk_businessmaster_id']=selectRow.data.id 
                    CallMethod(input,init_patDG,"DoMethod");
                    businessId = selectRow.data.id;
                    LoadDetDg(businessId);
                    //子表下拉变为可选
                    typeSelect.update({
                        disabled:false
                    }); 
                    $('#det_intef_code').removeAttr('disabled');
                }else{

                }
            });
        });
    }catch(e){
        alert(e.ResponseText);
    }
}

function LoadDetDg(busId){
    selectRow = null;
    // 字段赋值
    var input = {};
    input['TradeCode'] = "query^"  + GLOBALSon.MODULENAME + "^" + GLOBALSon.CLASSNAME;
    input['fk_businessmaster_id'] = busId;
    input['modal_code']=$('#det_modal_code').val();
    input['intef_code']=$('#det_intef_code').val();
    CallMethod(input, init_detDG, "DoMethod");
}

function init_detDG(jsonObj){
    try{
        var tmpArr = [];
        $.each(jsonObj.output, function(key,val){
             var tmpObj = JSON.parse(val);
             tmpArr.push(tmpObj);
        });
        layui.use('table', function(){
            //第一个实例
            table = layui.table;
            table.render({
                id:'detRdg',
                elem: '#detRdg',
                field:'id',
                align:'center',
                toolbar:'',
                defaultToolbar: false,
                border:'',
                size: 'lg', //表格尺寸 默认 sm
                even:false, //隔行背景
                url:  PYTHONSERVER + 'CallSelfServPY', //数据接口
                page: true,
                limits:[50, 100, 150],
                limit:50,
                parseData: function(ret){
                    return {
                        "code":200,   //解析接口状态
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
                    {field: GLOBALSon.FILEDS[4].id, title: GLOBALSon.FILEDS[4].title,width:200,
                        templet:function(d){
                            return "<lable id='input"+ d.id +"'onmouseover=\"showInput('"+ d.id+"');\"'>" + d.intef_input + "</label>";
                        }
                    },
                    {field: GLOBALSon.FILEDS[5].id, title: GLOBALSon.FILEDS[5].title,width:180,
                        templet:function(d){
                            return "<lable id='output"+ d.id +"'onmouseover=\"showOutput('"+ d.id+"');\"'>" + d.intef_output + "</label>";
                        }
                    },
                    {field: GLOBALSon.FILEDS[6].id, title: GLOBALSon.FILEDS[6].title,width:120},
                    {field: GLOBALSon.FILEDS[7].id, title: GLOBALSon.FILEDS[7].title,width:120},
                    {field: GLOBALSon.FILEDS[8].id, title: GLOBALSon.FILEDS[8].title,width:120},
                    {field: 'id', title: 'id',width:120,hide:true}
                ]],
            });
            //监听行单击事件
            table.on('row(detRdg)', function(obj){
                if(selectRow && selectRow.data.id == obj.data.id){    //取消选中
                    selectRow = null;
                    var formTable = $('.detform').find('input');
                    $.each(formTable, function(index, input) {
                        $(input).val('');
                    });
                }else{
                    selectRow = obj;
                }
                if (selectRow){
                    $('#det_intef_code').val(obj.data.intef_code);
                    layui.use('form', function() {
                        var form = layui.form;
                        $('#det_modal_code').val(obj.data.modal_code);
                        form.render("select");
                    });
                }
            });
            //监听单元格事件
            table.on('edit(detRdg)', function(obj){
            });
        });
    }catch(e){
        alert(e.ResponseText);
    }    
}

function init_patDG(jsonObj) {
    try{
        var tmpArr = [];
        $.each(jsonObj.output, function(key, val){
             var tmpObj = JSON.parse(val);
             tmpArr.push(tmpObj);
        });
        layui.use('table', function(){
            //第一个实例
            table = layui.table;
            table.render({
                id:'patRdg',
                elem: '#patRdg',
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
                    {field: 'id', title: 'id',width:120,hide:true}
                ]],
            });
            //监听行单击事件
            table.on('row(patRdg)', function(obj){
				
            });
            //监听单元格事件
            table.on('edit(patRdg)', function(obj){
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

function LoadSelect() {
	//layui.use('form');
	//return;
    var input = {};
    var pageUrl = {};
    var business = {};
    var processcode={};
    input['TradeCode'] = "query^"  + "SelfServPy.Common.ss_eqlistdCtl" + "^" + "ELC";
    input["ss_eqlistd_eqcode"] ="";
    CallMethod(input, initSelect, "DoMethod");
	
    pageUrl['TradeCode'] = "query^" + "SelfServPy.Common.ss_dicdataCtl" + "^" + "DDC";
    pageUrl["ss_dic_type"] = "PageUrl";
    CallMethod(pageUrl, initTypeSelect, "DoMethod");

    business['TradeCode'] = "query^" + "SelfServPy.Common.ss_dicdataCtl" + "^" + "DDC";
    business["ss_dic_type"] = "Business";
    CallMethod(business, initBusSelect, "DoMethod");

    processcode['TradeCode'] = "query^" + "SelfServPy.Common.ss_dicdataCtl" + "^" + "DDC";
    processcode["ss_dic_type"] = "processcode";
    CallMethod(processcode, initProSelect, "DoMethod");
}

function initSelect(jsonObj){
    var tmpArr = [];
    $.each(jsonObj.output,function(key,val){
        var tmpObj = JSON.parse(val);
        tmpArr.push(tmpObj);    //ss_dic_code
    });
    layui.use('form', function() {
        var form = layui.form;
        tmpArr.forEach(function(value){
            $('#usercode').append(new Option(value.ss_eqlistd_eqdesc,value.ss_eqlistd_eqcode));
        });
        form.render("select");
    });
}
function initTypeSelect(jsonObj){
    var tmpArr = [];
    $.each(jsonObj.output, function(key,val){
        var tmpObj = JSON.parse(val);
        var data = {'name': tmpObj.ss_dic_desc, 'value': tmpObj.ss_dic_code};
        tmpArr.push(data);    
    });
    // 引用了xmSelect.js ShangXuehao
    typeSelect = xmSelect.render({
        el: '#det_modal_code', 
        filterable: true,
        toolbar: {show: true},
        data: [],
        disabled: true
    });
    typeSelect.update({
		data: tmpArr
	})
}
function initBusSelect(jsonObj) {
    var tmpArr = [];
    $.each(jsonObj.output,function(key,val){
        var tmpObj = JSON.parse(val);
        tmpArr.push(tmpObj);    //ss_dic_code
    });
    layui.use('form', function() {
        var form = layui.form;
        tmpArr.forEach(function(value){
            $('#code').append(new Option(value.ss_dic_desc,value.ss_dic_code));
        });
        form.render("select");
    });
}
function initProSelect(jsonObj){
    var tmpArr = [];
    $.each(jsonObj.output,function(key,val){
        var tmpObj = JSON.parse(val);
        tmpArr.push(tmpObj);    //ss_dic_code
    });
    layui.use('form', function() {
        var form = layui.form;
        tmpArr.forEach(function(value){
            $('#processcode').append(new Option(value.ss_dic_desc,value.ss_dic_code));
        });
        form.render("select");
    });
}

var InputTip;
var OutputTip;
function showInput(id){
    var input={};
    input['TradeCode'] = "query^"  + GLOBALSon.MODULENAME + "^" + GLOBALSon.CLASSNAME;
    input['id'] = id;
    CallMethod(input, function(jsonObj) {
        var tmpArr = [];
        $.each(jsonObj.output,function(key,val){
            var tmpObj = JSON.parse(val);
            tmpArr.push(tmpObj);    //ss_dic_code
        });
        $('#terinfo').text(tmpArr[0].intef_input);
    }, "DoMethod");
}

function showOutput(id){
    var input={};
    input['TradeCode'] = "query^"  + GLOBALSon.MODULENAME + "^" + GLOBALSon.CLASSNAME;
    input['id'] = id;
    CallMethod(input, function(jsonObj){
        var tmpArr = [];
        $.each(jsonObj.output,function(key,val){
            var tmpObj = JSON.parse(val);
            tmpArr.push(tmpObj);    //ss_dic_code
        });
        $('#terinfo').text(tmpArr[0].intef_output);
    }, "DoMethod");  
}

function closeTips(){
    $('#terinfo').text('');
}