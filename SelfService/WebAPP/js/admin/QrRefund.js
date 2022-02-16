/**
 * FileName: admin.QrRefund.js退费查询
 * Anchor: tangzf
 * Date: 2020-3-23
 * Description: 
 */

var GLOBAL = {
    MODULENAME : 'SelfServPy.Common.mysql_contral',
    CLASSNAME :'mysqlsql',
    FILEDS:{
        '1':{'title':'主表id','id':'fk_businessmaster_id','seq':'1'},
        '2':{'title':'姓名','id':'ss_ref_patname','seq':'2'},
        '3':{'title':'门诊号','id':'ss_ref_patno','seq':'3'},
        '4':{'title':'交易金额','id':'ss_ref_amt','seq':'4'},
        '5':{'title':'订单号','id':'ss_ref_platno','seq':'5'},
        '6':{'title':'输入报文','id':'ss_ref_input','seq':'6'},
        '7':{'title':'输出报文','id':'ss_ref_output','seq':'7'},
        '8':{'title':'*订单时间','id':'ss_ref_createdate','seq':'8'},
        '9':{'title':'更新时间','id':'ss_ref_creator','seq':'9'},
        '10':{'title':'his订单号','id':'ss_ref_hisno','seq':'10'},
        '11':{'title':'状态','id':'ss_ref_status','seq':'11'},
        '12':{'title':'支付方式','id':'ss_extd_channel','seq':'12'},
    }
}
var selectRow;
$(function () {
    init_input();
    init_btn(); 

})

document.onkeydown=function(e){
    var ev=(typeof event!='undefined')?window.event:e;
    if(ev.keyCode==13){
        LoadDg();
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
    layui.use('laydate', function(){
        var laydate = layui.laydate;
        laydate.render({
            elem:'#ss_ref_createdate',
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
    LoadDg();
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
        selectId = selectRow.data.ss_ref_platno;
    }else{
        layer.msg('没有选择要退费的数据');
        return;
    } 
     layer.confirm('是否执行退费？',function(index){
        layer.close(index);
        var TradeCode = "AutoRefund^"  + "SelfServPy.CheckSingle" + "^" + "CS";
        var input = {
            "TradeCode" : TradeCode,
            'ss_ref_platno':selectId
        }
        CallMethod(input,function(){
            layer.msg('删除成功');
            Clear();
        },"DoMethod");
    });  
}
function Clear(){
    selectRow = null;
    $('.layui-form').find('input').not('#QueryBtn').not('#ClearBtn').not('#ss_ref_createdate').not('#RefundBtn').val('');
    layui.use('form', function() {
        var form = layui.form;
        var formTable = $('.layui-form').find('select').not('#QueryBtn').not('#ClearBtn').not('#RefundBtn').not('#ss_ref_createdate');
        $.each(formTable,function(index,select){
            $(select).val('');
            form.render("select");
        });
    });
}
function LoadDg(){
    var input = {};
    input['TradeCode'] = "queryRefundOrder^"  + GLOBAL.MODULENAME + "^" + GLOBAL.CLASSNAME;
    $.each(GLOBAL.FILEDS,function(index,key){
        input[key.id] = $('#' + key.id).val();
    });
    init_dg(input);
   // CallMethod(input,init_dg,"DoMethod");
}
//回车事件
document.onkeydown=function(e){
    var ev=(typeof event!='undefined')?window.event:e;
    if(ev.keyCode==13){
        LoadDg();
    }
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
                height: 800 ,//定义高度
                even:false, //隔行背景
                url:  PYTHONSERVER + 'DoMethod', //数据接口
                page: true,
                limits:[25, 50, 100],
                limit:25,
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
                    {field: GLOBAL.FILEDS[8].id, title: GLOBAL.FILEDS[8].title,width:260},
                    {field: GLOBAL.FILEDS[6].id, title: GLOBAL.FILEDS[6].title,width:140},
                    {field: GLOBAL.FILEDS[7].id, title: GLOBAL.FILEDS[7].title,width:140},
                    {field: GLOBAL.FILEDS[10].id, title: GLOBAL.FILEDS[10].title,width:150},
                    {field: GLOBAL.FILEDS[11].id, title: GLOBAL.FILEDS[11].title,width:100},
                    {field: GLOBAL.FILEDS[12].id, title: GLOBAL.FILEDS[12].title,width:100},
                ]]
            });
            //监听行单击事件
            table.on('row(dg)', function(obj){
                //动态添加背景色
                if(selectRow && selectRow.data.fk_businessmaster_id == obj.data.fk_businessmaster_id){ // 取消选中
                    selectRow = null;
                    obj.tr.removeClass('layui-table-click');
                    obj.tr.siblings().removeClass('layui-table-click');
                   var formTable = $('.layui-form').find('input').not('#QueryBtn').not('#RefundBtn').not('#ClearBtn');
                    $.each(formTable,function(index,input){
                       $(input).val('');
                   }); 
               }else{
                   obj.tr.siblings().removeClass('layui-table-click');
                   selectRow = obj;
                   var formTable = $('.layui-form').find('input').not('#QueryBtn').not('#RefundBtn').not('#ClearBtn');
                    $.each(formTable,function(index,input){
                       var id = $(input).attr('id');
                       $(input).val(obj.data[id]);
                   }); 
               }
              if (selectRow) {
                  obj.tr.addClass('layui-table-click');
                   layui.use('form', function() {
                      var form = layui.form;
                      var formTable = $('.layui-form').find('select').not('#QueryBtn').not('#RefundBtn').not('#ClearBtn');
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
