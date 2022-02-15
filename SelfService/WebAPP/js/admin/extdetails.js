/**
 * FileName: admin.extdetails.js账单查询
 * Anchor: tangzf
 * Date: 2020-3-23
 * Description: 
 */

var GLOBAL = {
    MODULENAME : 'SelfServPy.Common.mysql_contral',
    CLASSNAME :'mysqlsql',
    FILEDS:{
        '1':{'title':'创建日期','id':'ss_extd_update','seq':'1'},
        '2':{'title':'交易状态','id':'business_status','seq':'2'},
        '3':{'title':'交易渠道','id':'ss_extd_channel','seq':'3'},
        '4':{'title':'交易金额','id':'ss_extd_amt','seq':'4'},
        '5':{'title':'自助机流水号','id':'ss_extd_no','seq':'5'},
        '6':{'title':'HIS交易流水号','id':'ss_extd_hisno','seq':'6'},
        '7':{'title':'交易平台流水号','id':'ss_extd_platno','seq':'7'},
        '8':{'title':'输入报文','id':'ss_extd_ininfo','seq':'8'},
        '9':{'title':'输出报文','id':'ss_extd_outinfo','seq':'9'},
        '10':{'title':'终端号','id':'ss_extd_creator','seq':'10'},
        '11':{'title':'主表id','id':'ss_extd_id','seq':'11'},
        '12':{'title':'最后一步操作','id':'modal_code','seq':'12'}
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
            elem:'#ss_extd_update',
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
    LoadSelect();//加载下拉
}
function LoadSelect(){
    layui.use('form', function() {
        var form = layui.form;
        form.render("select");
    });
}  
function init_btn(){
    $('#QueryBtn').on('click',function(){
        LoadDg();
    });
    $('#ClearBtn').on('click',function(){
        Clear();
    });
    $('#RefundBtn').on('click',function(){
        Refund();
    });
}

function Refund(){
    var selectId = "";
    if(selectRow){
        selectId = selectRow.data.id;
    }else{
        layer.msg('没有选择要退费的数据');
        return;
    } 
/*     layer.confirm('是否继续删除？',function(index){
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
    });  */
}
function Clear(){
    selectRow = null;
    $('.layui-form').find('input').not('#QueryBtn').not('#ClearBtn').not('#ss_extd_update').not('#RefundBtn').val('');
    layui.use('form', function() {
        var form = layui.form;
        var formTable = $('.layui-form').find('select').not('#QueryBtn').not('#ClearBtn').not('#RefundBtn').not('#ss_extd_update');
        $.each(formTable,function(index,select){
            $(select).val('');
            form.render("select");
        });
    });
}
function LoadDg(){
    if($('#ss_extd_update').val() == ''){
        layer.msg('业务日期不能为空');
        return;
    }
    var input = {};
    input['TradeCode'] = "queryQrcodeOrder^"  + GLOBAL.MODULENAME + "^" + GLOBAL.CLASSNAME;
    $.each(GLOBAL.FILEDS,function(index,key){
        input[key.id] = $('#' + key.id).val();
    });
    init_dg(input);
   // CallMethod(input,init_dg,"DoMethod");
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
                defaultToolbar: ['filter','exports','print'],
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
                    {field: GLOBAL.FILEDS[3].id, title: GLOBAL.FILEDS[3].title,width:100},
                    {field: GLOBAL.FILEDS[4].id, title: GLOBAL.FILEDS[4].title,width:100},
                    {field: GLOBAL.FILEDS[5].id, title: GLOBAL.FILEDS[5].title,width:260},
                    {field: GLOBAL.FILEDS[6].id, title: GLOBAL.FILEDS[6].title,width:260},
                    {field: GLOBAL.FILEDS[7].id, title: GLOBAL.FILEDS[7].title,width:260},
                    {field: GLOBAL.FILEDS[10].id, title: GLOBAL.FILEDS[10].title,width:80},
                    {field: GLOBAL.FILEDS[11].id, title: GLOBAL.FILEDS[11].title,width:100},
                    {field: GLOBAL.FILEDS[12].id, title: GLOBAL.FILEDS[12].title,width:150},
                ]]
            });
            //监听行单击事件
            table.on('row(dg)', function(obj){
                //动态添加背景色
                if(selectRow && selectRow.data.id == obj.data.id){ // 取消选中
                     selectRow = null;
       /*               obj.tr.siblings().removeClass('layui-table-click');
                     var formTable = $('.layui-form').find('input').not('#QueryBtn').not('#ClearBtn').not('#RefundBtn').not('#ss_extd_update');
                    $.each(formTable,function(index,input){
                        $(input).val('');
                    });  */ 
                }else{
                    obj.tr.siblings().removeClass('layui-table-click');
                    selectRow = obj;
          /*           var formTable = $('.layui-form').find('input').not('#QueryBtn').not('#ClearBtn').not('#RefundBtn').not('#ss_extd_update');
                    $.each(formTable,function(index,input){
                        var id = $(input).attr('id');
                        $(input).val(obj.data[id]);
                    });  */
                }
                if (selectRow) {
                    obj.tr.addClass('layui-table-click');
                    layui.use('form', function() {
                        var form = layui.form;
                        var formTable = $('.layui-form').find('select').not('#QueryBtn').not('#ClearBtn').not('#RefundBtn').not('#ss_extd_update');
                        $.each(formTable,function(index,select){
                            var id = $(select).attr('id');
                            $(select).val(obj.data[id]);
                            form.render("select");
                        });
                    });

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
