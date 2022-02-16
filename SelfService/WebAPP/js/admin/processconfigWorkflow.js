/**
 * FileName: admin.processconfigMain.js
 * Anchor: Lizhi
 * Date: 2022-01-03
 * Description: 流程配置页面
 */
var GLOBAL = {
    MODULENAME : 'SelfServPy.Common.mysql_contral',
    CLASSNAME :'mysqlsql',
    FILEDS:{
        '1':{'title':'*配置列表','id':'ss_pc_dictype','seq':'1'},
        '2':{'title':'代码','id':'ss_pc_diccode','seq':'2'},
        '3':{'title':'名称','id':'ss_pc_dicdesc','seq':'3'},
        '4':{'title':'配置值','id':'ss_pc_demo','seq':'4'},
        '5':{'title':'创建日期','id':'ss_pc_createdate','seq':'5'},
        '6':{'title':'流程代码','id':'ss_pc_processcode','seq':'6'},
        '7':{'title':'序号','id':'resid','seq':'7'},
        '8':{'title':'序号','id':'id','seq':'8'},
        '9':{'title':'更新日期','id':'ss_pc_update','seq':'9'}
    }
}

var table;
var selectRow;
var selectRowRigth;
var EDITINDEX = undefined;
var Rightcount=0;
var EDITINDEXRigth = undefined;
var exclickRigth='0';
var exclick='0';
$(function () {
    init_input();
    LoadSelect();
})

// 加载下拉 
function LoadSelect(){
    layui.use(['form'], function() {
        var form = layui.form;
        $("dd").on("click",function(){
            //进行的业务逻辑代码,获取value值
            selectRow = null;
            EDITINDEX = undefined;
            // 字段赋值
            var input = {};
            input['TradeCode'] = "QueryEqlistConfigInfo^"  + GLOBAL.MODULENAME + "^" + GLOBAL.CLASSNAME;
            input['usercode'] =selectId;
        })
 
    });
}

function init_input(){
    $.each(GLOBAL.FILEDS,function(index,key){
        var id = key.id;
        var title = key.title;
        var seq = key.seq;
        $('.title' + seq).text(title);
        $('.id' + seq).attr('id',id);
    });  
    LoadDg();
}

function LoadDg(){
    selectRow = null;
    // 字段赋值
    var input = {};
    input['TradeCode'] = "QueryprocessconfigBusiness^"  + GLOBAL.MODULENAME + "^" + GLOBAL.CLASSNAME;
    $.each(GLOBAL.FILEDS,function(index,key){
       input[key.id] = $('#' + key.id).val();
    });
    init_dg(input);
}
function init_dg(jsonObj){
    try{
        layui.use('table', function(){
            table = layui.table;
            //第一个实例
            table.render({
                id:'dg',
                elem: '#dg',
                field:'id',
                align:'center',
                border:'',
                toolbar: '#toolbarDemo',
                defaultToolbar:false,
                size: 'sm', //表格尺寸 默认 sm
                height: 850 ,//定义高度
                even:false, //隔行背景
                url:  PYTHONSERVER + 'DoMethod', //数据接口
                page: true,
                limits:[100],
                limit: 101,
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
                    //{field: GLOBAL.FILEDS[1].id, title: GLOBAL.FILEDS[1].title,width:150},//,sort:true 排序
                    {field: GLOBAL.FILEDS[7].id, title: GLOBAL.FILEDS[7].title,width:60},
                    {field: GLOBAL.FILEDS[2].id, title: GLOBAL.FILEDS[2].title,width:120, templet: function (d) {
                        //#region    下拉选择
                            retstr= '<select name="logins" class="sel_xlk" lay-filter="stateSelect" lay-verify="required" ' + '" data-value="' + d.id + '" >' ;
                            input={};
                            input['TradeCode'] = "QueryprocessconfigBusinesstype^"  + GLOBAL.MODULENAME + "^" + GLOBAL.CLASSNAME;
                            input['ss_dic_type']="Business";
                            var rtn =CallMethod(input,"","DoMethod","N");
                            var codecfr=d['ss_pc_diccode']
                            if(codecfr!="请选择"){
                                optioncount=1;
                                for(;optioncount<=rtn.output.length;optioncount++){
                                    var jsonboj=JSON.parse(rtn.output[optioncount-1])
                                    if(jsonboj['ss_dic_code']==codecfr){
                                        if(jsonboj['ss_pc_demo']==""){
                                            jsonboj['ss_pc_demo']="null";
                                        }
                                        retstr+=  '<option id = "field'+jsonboj['ss_dic_code'] + '" data='+jsonboj['ss_dic_desc']+' value='+jsonboj['ss_pc_demo']+' selected = "selected">'+jsonboj['ss_dic_code']+'</option>'
                                        continue;
                                    }
                                    retstr+='<option id = "field'+jsonboj['ss_dic_code'] + '" data='+jsonboj['ss_dic_desc']+' value='+jsonboj['ss_pc_demo']+'>'+jsonboj['ss_dic_code']+'</option>'
                                }
                            }
                            else{
                                retstr+=  '<option id = "field'+codecfr + '" data="" '+' value="" selected = "selected">'+codecfr+'</option>'
                                optioncount=1;
                                for(;optioncount<=rtn.output.length;optioncount++){
                                    var jsonboj=JSON.parse(rtn.output[optioncount-1])
                                    retstr+='<option id = "field'+jsonboj['ss_dic_code'] + '" data='+jsonboj['ss_dic_desc']+' value='+jsonboj['ss_pc_demo']+'>'+jsonboj['ss_dic_code']+'</option>'
                                }
                            }
                            return retstr; 
                        }
                        //#endregion
                    },
                    {field: GLOBAL.FILEDS[6].id, title: GLOBAL.FILEDS[6].title,width:200,
                          templet: function (d) {
                        //#region    下拉选择
                            retstr= '<select name="logins" class="sel_xlk" lay-filter="stateSelect" lay-verify="required" ' + '" data-value="' + d.id + '" >' ;
                            input={};
                            input['TradeCode'] = "QueryprocessconfigBusinesstype^"  + GLOBAL.MODULENAME + "^" + GLOBAL.CLASSNAME;
                            input['ss_dic_type']="processcode";
                            var rtn =CallMethod(input,"","DoMethod","N");
                            var codecfr=d['ss_pc_processcode']
                            if(codecfr!="请选择"){
                                optioncount=1;
                                for(;optioncount<=rtn.output.length;optioncount++){
                                    var jsonboj=JSON.parse(rtn.output[optioncount-1])
                                    if(jsonboj['ss_dic_code']==codecfr){
                                        if(jsonboj['ss_pc_demo']==""){
                                            jsonboj['ss_pc_demo']="null";
                                        }
                                        retstr+=  '<option id = "field'+jsonboj['ss_dic_code'] + '" data='+jsonboj['ss_dic_desc']+' value='+jsonboj['ss_pc_demo']+' selected = "selected">'+jsonboj['ss_dic_code']+'</option>'
                                        continue;
                                    }
                                    retstr+='<option id = "field'+jsonboj['ss_dic_code'] + '" data='+jsonboj['ss_dic_desc']+' value='+jsonboj['ss_pc_demo']+'>'+jsonboj['ss_dic_code']+'</option>'
                                }
                            }
                            else{
                                retstr+=  '<option id = "field'+codecfr + '" data="" '+' value="" selected = "selected">'+codecfr+'</option>'
                                optioncount=1;
                                for(;optioncount<=rtn.output.length;optioncount++){
                                    var jsonboj=JSON.parse(rtn.output[optioncount-1])
                                    retstr+='<option id = "field'+jsonboj['ss_dic_code'] + '" data='+jsonboj['ss_dic_desc']+' value='+jsonboj['ss_pc_demo']+'>'+jsonboj['ss_dic_code']+'</option>'
                                }
                            }
                            return retstr; 
                        }
                        //#endregion
                    }, 
                    {field: GLOBAL.FILEDS[3].id, title: GLOBAL.FILEDS[3].title,width:200},//,edit:'text'
                    //{field: GLOBAL.FILEDS[4].id, title: GLOBAL.FILEDS[4].title,width:250},
                    {fixed: 'right', title:'操作', toolbar: '#barDemo', width:120}
                ]],
                 done: function (res, curr, count) {
                    $('td[data-field="ss_pc_processcode"]').find(".layui-table-cell").css('overflow','visible');
                    $('td[data-field="ss_pc_diccode"]').find(".layui-table-cell").css('overflow','visible');
                 } 
            });
            //头工具栏事件
            table.on('toolbar(dg)', function(obj){
                var checkStatus = table.checkStatus(obj.config.id);
                switch(obj.event){
                case 'AddData':
                    if (EDITINDEX) {
                        layer.msg("每次只能添加一条记录！",{icon:5});
                        return;
                    } 
                    var newDataList =table.cache["dg"];
                    EDITINDEX = 1;
                    var time = getFormatDate();
                    var newData = {
                        "id":"",//必须添加一个，不然取key报错
                        "ss_pc_dictype":"Business",
                        "ss_pc_diccode":"请选择",
                        "ss_pc_dicdesc":"",
                        "ss_pc_demo":"",
                        "ss_pc_processcode":"请选择",
                        "ss_pc_update":String(time),
                        "resid":String(newDataList.length),
                        "ss_eqlistc_cfgcode":"请选择",
                        "ss_eqlistc_cfgdesc":"",
                        "ss_pc_createdate":String(time),
                    }
                    newDataList.push(newData);
                    exclick='0';
                    table.reload("dg",{
                        url:'',
                        data: newDataList
                    });
                    break;
                };
            });
              //监听行工具事件
            table.on('tool(dg)', function(obj){
                var data = obj.data;
                if(obj.event === 'del'){
                    var selectId = data.id;
                    exclick='0';
                    selectRow=null;
                    EDITINDEX=undefined;
                    layer.confirm('是否继续删除？',function(index){
                        var TradeCode = "DeleteprocessconfigBusiness^"  + GLOBAL.MODULENAME + "^" + GLOBAL.CLASSNAME;
                        var input = {
                            "TradeCode" : TradeCode,
                            'id':selectId
                        }
                        CallMethod(input,function(){
                        },"DoMethod","N");
                        layer.msg('删除成功');
                        LoadDg();
                        init_rightDG('');
                    });
                }
                else if(obj.event === 'save'){
                    var data = selectRow.data;
                    layer.confirm('是否保存？',function(index){
                        var newDataList =table.cache["dg"];
                        for(i=0;i<newDataList.length;i++)
                        {
                            if(newDataList[i].ss_pc_processcode==data['ss_pc_processcode']&&newDataList[i].ss_pc_diccode==data['ss_pc_diccode']){
                                layer.msg('数据已经存在，请重新检查后保存');
                                return;
                            }
                        }
                        var input = {};
                        exclick='0';
                        for(let key  in data){
                            input[key] = data[key];
                          }
                        EDITINDEX=undefined;
                        input['TradeCode'] = "InsertprocessconfigBusiness^"  + GLOBAL.MODULENAME + "^" + GLOBAL.CLASSNAME;
                        input['ss_pc_processcode']=data['ss_pc_processcode'];
                        CallMethod(input,function(){
                        },"DoMethod","N");
                        layer.msg('保存成功');
                        var input = {};
                        selectRow=null;
                        LoadDg();
                        init_rightDG('');
                    });
                }
            });
            //监听行单击事件
            table.on('row(dg)', function(obj){
                if(exclick=='0') {cellclick();}
                Rightcount=0;
                //动态添加背景色
                 if(selectRow && selectRow.data.resid == obj.data.resid){ // 取消选中
                      //selectRow = obj;
                      obj.tr.siblings().removeClass('layui-table-click');
                 }else{
                     obj.tr.siblings().removeClass('layui-table-click');
                     selectRow = obj;
                 }
                    obj.tr.addClass('layui-table-click');
                    var input = {};
                    selectRowRigth=null;
                    EDITINDEXRigth=undefined 
                    if(selectRow.data.id){//如果左边新增没有保存就没有id
                        init_rightDG(selectRow.data);
                    }
                    else{
                        init_rightDG('');
                    }
            });
        });
    }catch(e){
        alert(e.ResponseText);
    }
}



function init_rightDG(jsonObj){
    try{
        Rightcount=0;//jsonObj无法结算lenth
        if(jsonObj['ss_pc_demo']=="null"||jsonObj['ss_pc_demo']=="")
         { jsonObj='';}
        if(!jsonObj['length'] && jsonObj['length']!=0){
            jsonObj = jsonObj['ss_pc_demo'];
            jsonObj = JSON.parse(jsonObj)
            $.each(jsonObj,function(index,row){
                jsonObj[index]['resid'] = index;
                if(row.config !=""){
                    jsonObj[index].config = JSON.stringify(jsonObj[index].config);
                }
                Rightcount+=1;
            });
        }
        layui.use(['form','layer','table','util'],  function(){
            //第一个实例
            table = layui.table;
            util=layui.util;
            table.render({
                id:'rdg',
                elem: '#rdg',
                field:'id',
                align:'center',
                toolbar: '#toolbarDemoR',
                defaultToolbar:false,
                border:'',
                size: 'sm', //表格尺寸 默认 sm
                height: 850 ,//定义高度
                even:false, //隔行背景
                url:  PYTHONSERVER + 'CallSelfServPY', //数据接口
                page: true,
                limits:[20, 50, 100],
                limit:20, 
                parseData: function(ret){
                    return {	
                        "code":200, //解析接口状态
                        "count":Rightcount, //解析数据长度
                        "data":jsonObj //解析数据列表
                      };
                },
                response: {
                    statusCode: 200 //重新规定成功的状态码为 200，table 组件默认为 0
                  },//Seq,Operation,desc,code,page,config
                
                cols: [[ 
                    {field: 'resid', title: '序号',width:115,align:'center'},//,edit:'text'
                    {field: 'code', title: '功能代码',width:160,align:'center',//edit:'text',
                    templet: function (d) {
                        //#region    下拉选择
                            retstr= '<select name="logins" class="sel_xlkRight" lay-filter="stateSelect" lay-verify="required" ' + '" data-value="' + d.id + '" >' ;
                            input={};
                            input['TradeCode'] = "QueryEqlistConfigtype^"  + GLOBAL.MODULENAME + "^" + GLOBAL.CLASSNAME;
                            input['ss_dic_type']='PageUrl';
                            var rtn =CallMethod(input,"","DoMethod","N");
                            var codecfr=d['code']=="None"?'请选择':d['code'];
                            if(codecfr!="请选择"){
                                optioncount=1;
                                for(;optioncount<=rtn.output.length;optioncount++){
                                    var jsonboj=JSON.parse(rtn.output[optioncount-1])
                                    if(jsonboj['ss_dic_code']==codecfr){
                                        retstr+=  '<option id = "field'+jsonboj['ss_dic_code'] + '" data='+jsonboj['ss_dic_desc']+' value="'+jsonboj['ss_dic_concode']+'" selected = "selected">'+jsonboj['ss_dic_code']+'</option>'
                                        continue;
                                    }
                                    retstr+='<option id = "field'+jsonboj['ss_dic_code'] + '" data='+jsonboj['ss_dic_desc']+' value="'+jsonboj['ss_dic_concode']+'">'+jsonboj['ss_dic_code']+'</option>'
                                }
                             }
                            else{
                                retstr+=  '<option id = "field'+codecfr + '" data="" '+' value="0" selected = "selected">'+codecfr+'</option>'
                                optioncount=1;
                                for(;optioncount<=rtn.output.length;optioncount++){
                                    var jsonboj=JSON.parse(rtn.output[optioncount-1])
                                    retstr+='<option id = "field'+jsonboj['ss_dic_code'] + '" data='+jsonboj['ss_dic_desc']+' value="'+jsonboj['ss_dic_concode']+'">'+jsonboj['ss_dic_code']+'</option>'
                                }
                            }

                            return retstr; 
                        }
                    },
                    {field: 'desc', title: '功能描述',width:260,align:'center'},//edit:'text',
                    {field: 'config', title: '图片配置',width:180,align:'center',edit:'text'},//edit:'text',
                    {fixed: 'right', title:'操作', toolbar: '#barDemoR', width:120}
                ]],
                done: function (res, curr, count) {
                    $('td[data-field="code"]').find(".layui-table-cell").css('overflow','visible');
                 }
            });
            //头工具栏事件
            table.on('toolbar(rdg)', function(obj){
                var checkStatus = table.checkStatus(obj.config.id);
                switch(obj.event){
                case 'AddData':
                    if(!selectRow.data.id){//如果左边新增没有保存就没有id
                        layer.msg("请先保存左边数据！",{icon:5});
                        return;}
                    else if(selectRow.data.ss_pc_processcode!=table.cache["dg"][selectRow.data.resid].ss_pc_processcode&&selectRow.data.ss_pc_processcode!=undefined){//如果左边变化有id,但是变化过没保存也不允许增加.
                        layer.msg("请先保存左边数据！",{icon:5});
                        return;}
                    if (EDITINDEXRigth) {
                        layer.msg("每次只能添加一条记录！",{icon:5});
                        return;
                    } 
                    EDITINDEXRigth = 1;
                    var time = getFormatDate();
                    var newData = {
                        "desc":"",
                        "code":"请选择",
                        "resid":String(Rightcount+1),
                        "config":"",
                        "icons":"",
                        "page":"",
                        "isnew":"1"
                    }
                    if(jsonObj=='')
                      jsonObj={};
                    jsonObj[Rightcount+1]=newData;
                    exclickRigth='0';
                    table.reload("rdg",{
                        data: jsonObj
                    });
                    break;
                };
            });
            //监听行工具事件
            table.on('tool(rdg)', function(obj){
                var data = obj.data;
                if(obj.event === 'del'){
                    if(!selectRow.data.id){//如果左边新增没有保存就没有id
                        layer.msg("请先保存左边数据！",{icon:5});
                        return;}
                    else if(selectRow.data.ss_pc_processcode!=table.cache["dg"][selectRow.data.resid].ss_pc_processcode&&selectRow.data.ss_pc_processcode!=undefined){//如果左边变化有id,但是变化过没保存也不允许增加.
                        layer.msg("请先保存左边数据！",{icon:5});
                        return;}
                    exclickRigth='0';
                    selectRowRigth=null;
                    EDITINDEXRigth=undefined;
                    layer.confirm('是否继续删除？',function(index){
                        var input={};
                        var inputson={};
                        var newDataList =table.cache["rdg"];
                        var isdelet=false;//标记是否删除过，如果删除过，则后面前移
                       for(let key  in newDataList){
                           inputson[key]={};
                           for(let keySon  in newDataList[key]){
                               if(keySon=='resid'||keySon=="LAY_TABLE_INDEX"||keySon=="Seq")//过滤多余数据
                                   continue;
                               else if(obj.data['code']==newDataList[key]['code'])//和选中数据相同，证明同一行
                               {
                                isdelet=true;
                                continue;
                               }
                               else{
                                   if(isdelet){
                                       var keycount=key
                                        inputson[keycount-1][keySon] = newDataList[key][keySon];
                                   }
                                   else{
                                    inputson[key][keySon] = newDataList[key][keySon];
                                   }
                               }
                           }
                       }
                       delete inputson[Rightcount];
                        for(let key  in selectRow.data){
                           input[key]=selectRow.data[key];
                        }
                        insertInfo = JSON.stringify(inputson);
                        input['ss_pc_demo'] = insertInfo; 
                        selectRow.data['ss_pc_demo'] = insertInfo; 
                       //#endregion
                        input['TradeCode'] = "InsertprocessconfigBusiness^"  + GLOBAL.MODULENAME + "^" + GLOBAL.CLASSNAME;
                        var rtn =CallMethod(input,"","DoMethod","N");
                        selectRow.data['ss_pc_demo'] = insertInfo; 
                        table.cache["dg"][selectRow.data.resid]['ss_pc_demo'] = insertInfo; 
                        layer.msg('删除成功');
                        var input = {};
                        selectRowRigth=null;
                        init_rightDG(selectRow.data);
                    });
                }
                else if(obj.event === 'save'){
                    if(!selectRow.data.id){//如果左边新增没有保存就没有id
                        layer.msg("请先保存左边数据！",{icon:5});
                        return;}
                    else if(selectRow.data.ss_pc_processcode!=table.cache["dg"][selectRow.data.resid].ss_pc_processcode&&selectRow.data.ss_pc_processcode!=undefined){//如果左边变化有id,但是变化过没保存也不允许增加.
                        layer.msg("请先保存左边数据！",{icon:5});
                        return;}
                    var data = selectRowRigth.data;
                    layer.confirm('是否保存？',function(index){
                        exclickRigth='0';
                        EDITINDEXRigth=undefined;
                        //#region  拼串
                         var input={};
                         var inputson={};
                         var newDataList =table.cache["rdg"];
                         for(let key  in newDataList)
                         {
                             if(newDataList[key].code==data['code']&&newDataList[key].resid!=data['resid']){
                                 layer.msg('数据已经存在，请重新检查后保存');
                                 return;
                             }
                         }
                        for(let key  in newDataList){
                            inputson[key]={};
                            for(let keySon  in newDataList[key]){
                                if(keySon=='resid'||keySon=="LAY_TABLE_INDEX"||keySon=="Seq")//过滤多余数据
                                    continue;
                                else if(obj.data['code']==newDataList[key]['code'])//和选中数据相同，证明同一行
                                {
                                    for(let keydata  in data)
                                    {
                                        if(keydata=='resid'||keydata=="LAY_TABLE_INDEX"||keydata=="Seq")
                                            continue;
                                        if(keydata=='config')//填写的在临时数据里面取值
                                        {
                                            inputson[key][keydata] = DHCP_TextEncoder(newDataList[key][keydata]);
                                        }
                                        else{
                                            inputson[key][keydata] = data[keydata];
                                        }
                                        
                                    }

                                    break;
                                }
                                else
                                {
                                    if(keySon=='config')//填写的在临时数据里面取值
                                    {
                                        inputson[key][keySon] = DHCP_TextEncoder(newDataList[key][keySon]);
                                    }
                                    else{
                                        inputson[key][keySon] = newDataList[key][keySon];
                                    }
                                }
                            }
                        }
                        for(let key  in selectRow.data){
                            input[key]=selectRow.data[key];
                        }
                        insertInfo = JSON.stringify(inputson);
                        input['ss_pc_demo'] = insertInfo; 
                        selectRow.data['ss_pc_demo'] = insertInfo; 
                        //#endregion
                        input['TradeCode'] = "InsertprocessconfigBusiness^"  + GLOBAL.MODULENAME + "^" + GLOBAL.CLASSNAME;
                        var rtn =CallMethod(input,"","DoMethod","N");
                        selectRow.data['ss_pc_demo'] = insertInfo; 
                        table.cache["dg"][selectRow.data.resid]['ss_pc_demo'] = insertInfo; 
                        layer.msg('保存成功');
                        var input = {};
                        selectRowRigth=null;
                        init_rightDG(selectRow.data);
                    });
                }
            });
            //监听行单击事件
            table.on('row(rdg)', function(obj){
                if(exclickRigth=='0') {Rightcellclick();}
                //动态添加背景色
                if(selectRowRigth && selectRowRigth.data.id == obj.data.id){ // 取消选中
                    selectRowRigth = obj;
                    obj.tr.siblings().removeClass('layui-table-click');
                }else{
                    obj.tr.siblings().removeClass('layui-table-click');
                    selectRowRigth = obj;
                }
            });
        });
    }catch(e){
        alert(e.ResponseText);
    }    
}
function intef_config(d)
{
    if(d.config==''||d.config=='{}'){
        return d.config;
    }
    else{
        return util.escape(d.config);
    }
}

function getFormatDate(){
    var nowDate = new Date();
    var year = nowDate.getFullYear();
    var month = nowDate.getMonth() + 1 < 10 ? "0" + (nowDate.getMonth() + 1) : nowDate.getMonth() + 1;
    var date = nowDate.getDate() < 10 ? "0" + nowDate.getDate() : nowDate.getDate();
    var hour = nowDate.getHours()< 10 ? "0" + nowDate.getHours() : nowDate.getHours();
    var minute = nowDate.getMinutes()< 10 ? "0" + nowDate.getMinutes() : nowDate.getMinutes();
    var second = nowDate.getSeconds()< 10 ? "0" + nowDate.getSeconds() : nowDate.getSeconds();
    return year + "-" + month + "-" + date+" "+hour+":"+minute+":"+second;
}
function cellclick()
{
    exclick='1';//$($(".layui-table-body")[0])
    $('td[data-field="ss_pc_diccode"]').find('dd').on("click",function(){
        selectRow.data["ss_pc_diccode"]=this.innerText;  
        exclickRigth='0';
        selectRowRigth=null;
        EDITINDEXRigth=undefined
        if(selectRow.data.id){//如果左边新增的没有保存就没有id
            init_rightDG(selectRow.data);
        }
        else{
            init_rightDG('');
        }

    });
    $('td[data-field="ss_pc_processcode"]').find('dd').on("click",function(){
        selectRow.data["ss_pc_processcode"]=this.innerText;
        selectRow.data["ss_pc_dicdesc"]=typeof $("#field"+this.innerText).attr('data')=='undefined'?"":$("#field"+this.innerText).attr('data');
        getCellVal(selectRow.data.resid,'ss_pc_dicdesc',typeof $("#field"+this.innerText).attr('data')=='undefined'?"":$("#field"+this.innerText).attr('data'));
        selectRow.data["ss_pc_demo"]=typeof $("#field"+this.innerText).attr('value')=='undefined'?"":$("#field"+this.innerText).attr('value');
        exclickRigth='0';
        selectRowRigth=null;
        EDITINDEXRigth=undefined
        if(selectRow.data.id){//如果左边新增的没有保存就没有id
            init_rightDG(selectRow.data);
        }
        else{
            init_rightDG('');
        }
    });
}
function Rightcellclick()
{
    exclickRigth='1';
    $($(".layui-table-body")[2]).find('dd').on("click",function(){
       selectRowRigth.data["code"]=this.innerText;
       selectRowRigth.data["page"]=typeof $("#field"+this.innerText).attr('value')=='undefined'?"":$("#field"+this.innerText).attr('value');
       selectRowRigth.data["desc"]=typeof $("#field"+this.innerText).attr('data')=='undefined'?"":$("#field"+this.innerText).attr('data');
       getCellValRight(selectRowRigth.data.resid,'desc',typeof $("#field"+this.innerText).attr('data')=='undefined'?"":$("#field"+this.innerText).attr('data'));
    });
}

function  getCellValRight(index,field,text) {
    index=index-1;
    var Field = $($(".layui-table-body")[2]).find('td[data-field="' + field + '"]')[index];
     $(Field).find('.layui-table-cell')[0].innerText=text;
}

function  getCellVal(index,field,text) {
    var Field = $($(".layui-table-body")[0]).find('td[data-field="' + field + '"]')[index];
     $(Field).find('.layui-table-cell')[0].innerText=text;
}
function DHCP_TextEncoder(transtr){
	if (transtr.length==0){
		return "";
	}
	var dst=transtr;
	try{
		dst = DHCP_replaceAll(dst, '\\"', '\"');
		dst = DHCP_replaceAll(dst, "\\r\\n", "\r\t");
		dst = DHCP_replaceAll(dst, "\\r", "\r");
		dst = DHCP_replaceAll(dst, "\\n", "\n");
		dst = DHCP_replaceAll(dst, "\\t", "\t");
        dst = DHCP_replaceAll(dst, '"', "");
        dst = DHCP_replaceAll(dst, "'", '"');
	}catch(e){
		alert(e.message);
		return "";
	}
	return dst;
}
function DHCP_replaceAll(src,fnd,rep) 
{ 
	//rep:replace
	//src:source
	//fnd:find
	if (src.length==0) 
	{ 
		return ""; 
	} 
	try{
		var myary=src.split(fnd);
		var dst=myary.join(rep);
	}catch(e){
		alert(e.message);
		return ""
	}
	return dst; 
} 