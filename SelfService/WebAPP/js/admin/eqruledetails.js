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
        '1':{'title':'序号','id':'id','seq':'1'},
        '2':{'title':'规则分类','id':'ss_eqrd_type','seq':'2'},
        '3':{'title':'规则代码','id':'ss_eqrd_code','seq':'3'},
        '4':{'title':'规则描述','id':'ss_eqrd_desc','seq':'4'},
        '5':{'title':'创建日期','id':'ss_eqrd_createdate','seq':'5'},
        '6':{'title':'更新日期','id':'ss_eqrd_update','seq':'6'},
        '7':{'title':'开始日期','id':'ss_eqrd_stdate','seq':'7'},
        '8':{'title':'结束日期','id':'ss_eqrd_enddate','seq':'8'},
        '9':{'title':'生效标志','id':'ss_eqrd_actflag','seq':'9'},
        '10':{'title':'分类名称','id':'ss_eqr_desc','seq':'10'},
        '11':{'title':'规则名称','id':'ss_dic_desc','seq':'11'},
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
}

function init_btn(){
    $('#QueryBtn').on('click',function(){
        LoadDg();
    });
    $('#SaveBtn').on('click',function(){
        var input = {};
        if($('#ss_eqrd_type').val() == ''){
            layer.msg('规则分类不能为空');
            return;
        }
        if($('#ss_eqrd_code').val() == ''){
            layer.msg('规则代码不能为空');
            return;
        }
        if($('#ss_eqrd_actflag').val() == ''){
            layer.msg('生效标志不能为空');
            return;
        }
        // 字段赋值
        input['TradeCode'] = "UpdateEqrdetailsInfo^"  + GLOBAL.MODULENAME + "^" + GLOBAL.CLASSNAME;
        $.each(GLOBAL.FILEDS,function(index,key){
            input[key.id] = $('#' + key.id).val();
        });
        if(selectRow){
            input['id'] = selectRow.data.id;
            layer.confirm('是否更新规则？',function(index){
                layer.close(index);
                CallMethod(input,function(){
                    layer.msg('保存成功');
                    LoadDg();
                },"DoMethod");
            }); 
        }
        else if(selectRow==null){
            input['id'] = '';
            layer.confirm('是否新增规则？',function(index){
                layer.close(index);
                CallMethod(input,function(){
                    layer.msg('保存成功');
                    LoadDg();
                },"DoMethod");
            }); 
        }
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
        var TradeCode = "DeleteEqrdetailsInfo^"  + GLOBAL.MODULENAME + "^" + GLOBAL.CLASSNAME;
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
    $('.layui-form').find('#ss_eqrd_actflag').val('');
    LoadDg();
}
function LoadDg(){
    selectRow = null;
    // 字段赋值
    var input = {};
    input['TradeCode'] = "QueryEqrdetailsInfo^"  + GLOBAL.MODULENAME + "^" + GLOBAL.CLASSNAME;
    $.each(GLOBAL.FILEDS,function(index,key){
       input[key.id] = $('#' + key.id).val();
    });
    init_dg(input)
    $('.layui-form').find('input').val('');
    $('.layui-form').find('#ss_eqrd_actflag').val('');
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
                //defaultToolbar:false,
                toolbar:'#LDGTB',
                size: 'sm', //表格尺寸 默认 sm
                height: 750 ,//定义高度
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
                    {field: GLOBAL.FILEDS[1].id, title: GLOBAL.FILEDS[1].title,width:80},//,sort:true 排序
                    {field: GLOBAL.FILEDS[9].id, title: GLOBAL.FILEDS[9].title,width:80},
                    {field: GLOBAL.FILEDS[10].id, title: GLOBAL.FILEDS[10].title,width:200},
                    {field: GLOBAL.FILEDS[2].id, title: GLOBAL.FILEDS[2].title,width:150},
                    {field: GLOBAL.FILEDS[11].id, title: GLOBAL.FILEDS[11].title,width:130},
                    {field: GLOBAL.FILEDS[3].id, title: GLOBAL.FILEDS[3].title,width:150},
                    {field: GLOBAL.FILEDS[4].id, title: GLOBAL.FILEDS[4].title,width:240},
                    {field: GLOBAL.FILEDS[5].id, title: GLOBAL.FILEDS[5].title,width:150},
                    {field: GLOBAL.FILEDS[6].id, title: GLOBAL.FILEDS[6].title,width:150},
                    {field: GLOBAL.FILEDS[7].id, title: GLOBAL.FILEDS[7].title,width:150},
                    {field: GLOBAL.FILEDS[8].id, title: GLOBAL.FILEDS[8].title,width:150},
                ]]
            });
            //监听行单击事件
            table.on('row(dg)', function(obj){
                //动态添加背景色
                 if(selectRow && selectRow.data.id == obj.data.id){ // 取消选中
                      selectRow = null;
                      obj.tr.removeClass('layui-table-click');
                     var formTable = $('.layui-form').find('input').not('#QueryBtn').not('#ClearBtn');
                      $.each(formTable,function(index,input){
                         $(input).val('');
                     }); 
                 }else{
                     obj.tr.siblings().removeClass('layui-table-click');
                     selectRow = obj;
                     var formTable = $('.layui-form').find('input').not('#QueryBtn').not('#ClearBtn');
                      $.each(formTable,function(index,input){
                         var id = $(input).attr('id');
                         $(input).val(obj.data[id]);
                     }); 
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
        });
    }catch(e){
        alert(e.ResponseText);
    }
}