/**
 * FileName: admin.sysdicconfig.js
 * Anchor: tangzf
 * Date: 2020-3-23
 * Description: 设备列表维护
 */
var GLOBAL = {
    MODULENAME : 'SelfServPy.Common.mysql_contral',
    CLASSNAME :'mysqlsql',
    FILEDS:{
        '1':{'title':'创建日期','id':'ss_extd_update','seq':'1'},
        '2':{'title':'交易类型','id':'ss_extd_type','seq':'2'},
        '3':{'title':'交易渠道','id':'ss_extd_channel','seq':'3'},
        '4':{'title':'自助业务','id':'ss_dic_desc','seq':'4'},
        '5':{'title':'自助机交易流水号','id':'ss_extd_no','seq':'5'},
        '6':{'title':'HIS交易流水号','id':'ss_extd_hisno','seq':'6'},
        '7':{'title':'交易平台流水号','id':'ss_extd_platno','seq':'7'},
        '8':{'title':'输入报文','id':'ss_extd_ininfo','seq':'8'},
        '9':{'title':'输出报文','id':'ss_extd_outinfo','seq':'9'}
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
		$('.id' + seq).attr('lay-filter',id);
    });  
    LoadSelect();
    layui.use('laydate', function(){
        var laydate = layui.laydate;
        laydate.render({
            elem:'#ss_extd_update',
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
    input['TradeCode'] = "queryQrcodeOrder^"  + GLOBAL.MODULENAME + "^" + GLOBAL.CLASSNAME;
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
                    {field: GLOBAL.FILEDS[1].id, title: GLOBAL.FILEDS[1].title,width:200},
                    {field: GLOBAL.FILEDS[2].id, title: GLOBAL.FILEDS[2].title,width:100},
                    {field: GLOBAL.FILEDS[3].id, title: GLOBAL.FILEDS[3].title,width:100},
                    {field: GLOBAL.FILEDS[4].id, title: GLOBAL.FILEDS[4].title,width:100},
                    {field: GLOBAL.FILEDS[5].id, title: GLOBAL.FILEDS[5].title,width:210},
                    {field: GLOBAL.FILEDS[6].id, title: GLOBAL.FILEDS[6].title,width:260},
                    {field: GLOBAL.FILEDS[7].id, title: GLOBAL.FILEDS[7].title,width:240},
                    {field: GLOBAL.FILEDS[8].id, title: GLOBAL.FILEDS[8].title,width:220},
                    {field: GLOBAL.FILEDS[9].id, title: GLOBAL.FILEDS[9].title,width:220}
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
    var CreatorInput={};
    CodeInput['TradeCode'] = "query^" + "SelfServPy.Common.ss_dicdataCtl" + "^" + "DDC";
    CodeInput["ss_dic_type"] = "Business";
    CallMethod(CodeInput,initCodeSelect,"DoMethod");
    CreatorInput['TradeCode'] = "query^"  + "SelfServPy.Common.ss_eqlistdCtl" + "^" + "ELC";
    CreatorInput["ss_eqlistd_eqcode"] ="";
    CallMethod(CreatorInput,initCreatorSelect,"DoMethod");
    
}        
function initCodeSelect(jsonObj) {
    var tmpArr = [];
    var afterTmpArr=[];
    $.each(jsonObj.output,function(key,val){
        var tmpObj = JSON.parse(val);
        tmpArr.push(tmpObj)
    });
    layui.use('form', function() {
        var form = layui.form;
        tmpArr.forEach(function(value){
            $('#ss_extd_code').append(new Option(value.ss_dic_desc,value.ss_dic_code))
        });
        form.render("select");
    });
}
function initCreatorSelect(jsonObj){
    var tmpArr = [];
    $.each(jsonObj.output,function(key,val){
        var tmpObj = JSON.parse(val);
        tmpArr.push(tmpObj)
    });
    layui.use('form', function() {
        var form = layui.form;
        tmpArr.forEach(function(value){
            $('#ss_extd_creator').append(new Option(value.ss_eqlistd_eqcode))
        });
        form.render("select");
    });
}