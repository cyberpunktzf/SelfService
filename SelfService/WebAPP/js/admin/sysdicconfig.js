/**
 * FileName: admin.sysdicconfig.js
 * Anchor: tangzf
 * Date: 2020-3-23
 * Description: 移动收费-订单
 */
$(function () {
    //OSP_Init_layui();
    init_DicCombobox();
    init_dg();  
})
function init_DicCombobox(){
    var Param = {
        "MethodName" : "query", 
        'DicType': 'SYS'
    }
    CallMethod(Param ,ComboboxCallBack,"CallDicData");
    form = layui.form;
    form.on('select(DicCode)', function(data){
        LoadDatagrid();
    });
    
}
function ComboboxCallBack(jsonObj){    
    $.each(jsonObj, function (index,items) {
        var tmpitem = items.fields
        //$('#QDicCode').append(new Option(tmpitem.DicCode,tmpitem.DicDesc))
        $('#DicType').append(new Option(tmpitem.DicCode,tmpitem.DicDesc))
    });
    layui.form.render("select");
    LoadDatagrid(); 
}
function LoadDatagrid(){
    alert( $('#QDicCode').val())
    var table = layui.table;
        table.reload('dg', {
            method: 'POST',
            url: PYTHONSERVER + 'CallDicData?MethodName=query&DicType=' + $('#QDicCode').val()
        }, 'data');
    /*layui.use('table', function(){
        var table = layui.table;
        table.reload('dg', {
            url: 'http://127.0.0.1:8000/QueryDicData?DicType=' + $('#DicCode').val()
        }, 'data');
    })*//*
    var Param = {
        "MethodName" : "query",
        "DicType": $('#QDicCode').val()
        }
    CallMethod(Param ,function(data){     
        
        

        $.each(data, function (index,items) {
            var tmpitem = items.fields
            $('#QDicCode').append(new Option(tmpitem.DicCode,tmpitem.DicDesc))
            $('#DicType').append(new Option(tmpitem.DicCode,tmpitem.DicDesc))
        });
        layui.form.render("select");

    },"CallDicData");*/
}
function init_dg(){
    try{
        var table = layui.table;
        //第一个实例
        table.render({
            //id:'dg',
            elem: '#dg',
            field:'id',
            align:'center',
            border:'',
            //toolbar:'#toolBar',
            height: 'full-1', // fit:true
            //totalRow: true,
            //skin:'line',// 表格风格 line （行边框风格） row （列边框风格）  nob （无边框风格）
            size: 'lg', //表格尺寸 默认 sm
            even:false, //隔行背景
            parseData: function(ret){
                return {	
                    "code": ret.result, //解析接口状态
                    "count": Object.keys(ret.msg.output).length, //解析数据长度
                    "data":ret.msg.output //解析数据列表
                };
            },
            cols: [[ //表头
                {field: 'id', title: 'id',align:'center',width:120,align:'center'},
                {field: 'DicType', title: '字典类型',width:120,align:'center'},
                {field: 'DicCode', title: '字典代码',width:260,align:'center',edit: 'text'},
                {field: 'DicDesc', title: '字典值',width:120,align:'center'},
                {field: 'Demo', title: '备注',align:'center'},
                {field: 'Business', title: '业务',width:120,align:'center'},
                {field: 'Demo', title: '操作',align:'center',toolbar:'#rowEditBar'},
            ]]
        });
        //头工具栏事件
        /*table.on('toolbar(dg)', function(obj){
            var checkStatus = table.checkStatus(obj.config.id);
                switch(obj.event){
                    case 'chargeOrder':
                        if(!Global.SelectRow || Global.SelectRow.OrderNo ==''){
                            layer.alert('选择结算的数据');
                            return;
                        }
                        PreChargeHIS();
                        break;
                    default:
                        layer.alert('抱歉，结算失败：结算按钮异常');
            };
        });*/
        //监听行单击事件
        table.on('row(dg)', function(obj){
        });
        //监听行工具事件
        table.on('tool(dg)', function(obj){
            var data = obj.data;
            switch(obj.event){
                case 'save':
                    var Param = {
                        "MethodName" : "AddDicData"
                    }
                    $.each(obj.data, function(index, val){
                        //alert(item.value)
                        Param[index] = val;
                    });
                    //CallMethod(Param ,LoadDatagrid,"CallDicData");
                break;
                case 'del':
                    var Param = {
                        "MethodName" : "DeleteDicData",
                        "id" : obj.data.id
                    }
                    CallMethod(Param ,LoadDatagrid,"CallDicData");
                break;

            };
        // layerTable options 初始化
        // 注意：如果没有加main，默认都是指子表的参数
        // 因为需要传递包括 obj, $(this), $(this).parents('tr') 这些参数
        // 所以初始化需要在 table.on 中完成
        });
    }catch(e){
        alert(e.ResponseText);
    }
}
function addDicInfo(){
    layer.open({
        type: 1, // 1=div 2 = url
        title: '添加字典',
        content: $(".addWindow").html(),
        maxmin: true,
        area: ['500px', '400px'],
        btn: ['确定', '取消'],
        yes: function(index, layero){
            var form = $('.layui-layer-page .layui-input-inline input');
            var Param = {
                "MethodName" : "AddDicData"
            }
            $.each(form, function(index, item){
                //alert(item.value)
                Param[item.id == "" ? "DicType":item.id] = item.value;
            });
            layer.closeAll();
            CallMethod(Param ,LoadDatagrid ,"CallDicData");
        },
        success: function() {
            form.render('select');
        }
    });      
}