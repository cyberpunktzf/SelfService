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
        '1':{'title':'医生姓名','id':'ss_dcp_code','seq':'1'},
        '2':{'title':'医生编码','id':'ss_dcp_code','seq':'2'},
        '3':{'title':'录入时间','id':'ss_dcp_createdate','seq':'3'},
        '4':{'title':'医生照片','id':'ss_dcp_info','seq':'4'},
        '5':{'title':'序号','id':'id','seq':'5'},
        '6':{'title':'更新时间','id':'idss_dcp_update','seq':'6'},
    }
}
var selectRow;
$(function () {
    // init_input
    init_input();
    LoadDg();
    bindAvatar();
    init_btn(); 

})
function bindAvatar() {
    if(window.URL.createObjectURL){
      bindAvatar3();
    }else if(window.FileReader){
      bindAvatar2();
    }else {
      bindAvatar1();
    }
}
  /*Ajax上传至后台并返回图片的url*/
  function bindAvatar1() {
    $("#avatarSlect").change(function () {
    var csrf = $("input[name='csrfmiddlewaretoken']").val();
    var formData=new FormData();
    formData.append("csrfmiddlewaretoken",csrf);
    formData.append('avatar', $("#avatarSlect")[0].files[0]);  /*获取上传的图片对象*/
    $.ajax({
      url: '/upload_avatar/',
          type: 'POST',
          data: formData,
          contentType: false,
          processData: false,
          success: function (args) {
        console.log(args);  /*服务器端的图片地址*/
              $("#avatarPreview").attr('src','/'+args);  /*预览图片*/
              $("#avatar").val('/'+args);  /*将服务端的图片url赋值给form表单的隐藏input标签*/
     }
      })
 })
  }
  /*window.FileReader本地预览*/
  function bindAvatar2() {
    console.log(2);
       $("#avatarSlect").change(function () {
           var obj=$("#avatarSlect")[0].files[0];
           var fr=new FileReader();
           fr.onload=function () {
               $("#avatarPreview").attr('src',this.result);
               console.log(this.result);
               $("#avatar").val(this.result);
      };
      fr.readAsDataURL(obj);
    })
 }
 /*window.URL.createObjectURL本地预览*/
 function bindAvatar3() {
   console.log(3);
      $("#avatarSlect").change(function () {
          var obj=$("#avatarSlect")[0].files[0];
          var wuc=window.URL.createObjectURL(obj);
           $("#avatarPreview").attr('src',wuc);
           $("#avatar").val(wuc);
           $("#avatarPreview").load(function () {    /*当图片加载后释放内存空间，但在jQuery3.2.1中会报错。浏览器关闭后也会自动释放*/
               window.URL.revokeObjectURL(wuc);
      })
   })
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
function init_btn(){
    $('#QueryBtn').on('click',function(){
        LoadDg();
    });
    $('#SaveBtn').on('click',function(){
        var input = {};
        // 字段赋值
        input['TradeCode'] = "insert^"  + GLOBAL.MODULENAME + "^" + GLOBAL.CLASSNAME;
        $.each(GLOBAL.FILEDS,function(index,key){
            input[key.id] = $('#' + key.id).not('#QueryBtn').not('#ClearBtn').val();
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
    $('#UpdateBtn').on('click',function(){
        Update();
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
function Update(){
    var selectId = "";
    if(selectRow){
        selectId = selectRow.data.ss_dcp_code;
    }else{
        layer.msg('没有选择要更新的数据');
        return;
    } 
    layer.confirm('是否更新？',function(index){
        layer.close(index);
        //var TradeCode = "delete^"  + GLOBAL.MODULENAME + "^" + GLOBAL.CLASSNAME;
        var input = {
            "TradeCode" : "PayServUpdateDoc",
            'ss_dcp_code':selectId
        }
        var trn=CallMethod(input,'',"CallPythonService","N");
        layer.msg('更新成功');
    }); 
}

/* function Clear(){
    selectRow = null;
    $('.layui-form').find('input').not('#QueryBtn').not('#ClearBtn').not().val('');
    LoadDg();
} */
function LoadDg(){
    selectRow = null;
    // 字段赋值
    var input = {};
    input['TradeCode'] = "QueryDoctorInfo^"  + GLOBAL.MODULENAME + "^" + GLOBAL.CLASSNAME;
    $.each(GLOBAL.FILEDS,function(index,key){
        input[key.id] = $('#' + key.id).not('#QueryBtn').not('#ClearBtn').val();
    });
    init_dg(input)
    //CallMethod(input,init_dg,"DoMethod");
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
                defaultToolbar:false,
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
                    {field: GLOBAL.FILEDS[5].id, title: GLOBAL.FILEDS[5].title,width:80},
                    {field: GLOBAL.FILEDS[1].id, title: GLOBAL.FILEDS[1].title,width:150},//,sort:true 排序
                    {field: GLOBAL.FILEDS[2].id, title: GLOBAL.FILEDS[2].title,width:150},
                    {field: GLOBAL.FILEDS[3].id, title: GLOBAL.FILEDS[3].title,width:150},
                    {field: GLOBAL.FILEDS[6].id, title: GLOBAL.FILEDS[6].title,width:150},
                    //{field: 'id', title: 'id',width:50}
                ]]
            });
            //监听行单击事件
            table.on('row(dg)', function(obj){
                if(selectRow && selectRow.data.id == obj.data.id){ // 取消选中
                    selectRow = null;
                    obj.tr.siblings().removeClass('layui-table-click');
                   var formTable = $('.layui-form').find('input').not('#QueryBtn').not('#business_date').not('#ClearBtn').not('#DelBtn').not('#UpdateBtn').not('#SaveBtn');
                    $.each(formTable,function(index,input){
                       $(input).val('');
                   }); 
               }else{
                   obj.tr.siblings().removeClass('layui-table-click');
                   selectRow = obj;
                   var formTable = $('.layui-form').find('input').not('#QueryBtn').not('#business_date').not('#ClearBtn').not('#DelBtn').not('#UpdateBtn').not('#SaveBtn');
                    $.each(formTable,function(index,input){
                       var id = $(input).attr('id');
                       $(input).val(obj.data[id]);
                   });
               }
               if (selectRow) {
                   obj.tr.addClass('layui-table-click');
                   if(selectRow.data.ss_dcp_info=="-1")
                   {
                    $("#avatarPreview").attr("src","/WebAPP/themes/images/defdoc.png"); 
                   }
                   else
                   {
                    $("#avatarPreview").attr("src","data:image/jpeg;base64,"+selectRow.data.ss_dcp_info); //'data:image/jpeg;base64,' + base64Str;
                   }
                   layui.use('form', function() {
                       var form = layui.form;
                       var formTable = $('.layui-form').find('select').not('#QueryBtn').not('#business_date').not('#ClearBtn').not('#DelBtn').not('#UpdateBtn').not('#SaveBtn');
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