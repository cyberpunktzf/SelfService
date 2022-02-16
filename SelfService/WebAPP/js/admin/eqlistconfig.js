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
        '1':{'title':'*终端号','id':'usercode','seq':'1'},
        '2':{'title':'序号','id':'id','seq':'2'},
        '3':{'title':'终端号','id':'ss_eqlistc_code','seq':'3'},
        '4':{'title':'终端分类','id':'ss_eqlistc_desc','seq':'4'},
        '5':{'title':'分类编码','id':'ss_eqlistc_cfgcode','seq':'5'},
        '6':{'title':'分类名称','id':'ss_eqlistc_cfgdesc','seq':'6'},
        '7':{'title':'创建日期 ','id':'ss_eqlistc_createdate','seq':'7'},
        '8':{'title':'更新日期','id':'ss_eqlistc_update','seq':'8'},
        '9':{'title':'序号','id':'resid','seq':'9'}
    }
}

var GLOBALSon = {
    MODULENAME : 'SelfServPy.Common.mysql_contral',
    CLASSNAME :'mysqlsql',
    FILEDS:{
        '1':{'title':'序号','id':'id','seq':'1'},
        '2':{'title':'终端号','id':'ss_eqlistc_code','seq':'2'},
        '3':{'title':'更新日期','id':'ss_eqlistc_update','seq':'3'},
        '4':{'title':'配置编码','id':'ss_eqlistc_cfgvalue','seq':'4'},
        '5':{'title':'配置名称','id':'ss_dic_desc','seq':'5'},
        '6':{'title':'序号','id':'resid','seq':'6'}
    }
}
var table;
var selectRow;
var selectRowRigth;
var EDITINDEX = undefined;
var EDITINDEXRigth = undefined;
var exclickRigth="0";
var exclick='0';
$(function () {
    init_input();
})
function init_input(){
    $.each(GLOBAL.FILEDS,function(index,key){
        var id = key.id;
        var title = key.title;
        var seq = key.seq;
        $('.title' + seq).text(title);
        $('.id' + seq).attr('id',id);
    });  
    LoadSelect();
}

function SaveLDG(){
    var input = {};
    // 字段赋值
    //input['TradeCode'] = "DeleteEqlistConfigInfo^"  + GLOBAL.MODULENAME + "^" + GLOBAL.CLASSNAME;
    $.each(GLOBAL.FILEDS,function(index,key){
        input[key.id] = $('#' + key.id).val();
    });
    if(selectRow){
        input['id'] = selectRow.data.id;
    }
    CallMethod(input,function(){
        layer.msg('保存成功');
        LoadDg();
    },"DoMethod");
}
 // 封装取表格数据的方法入参是表格id 
function getDataList(tableId) {
    if (table.cache[tableId]) {
        return table.cache[tableId];
    }
    return [];
} 
function DELETDG(){
    var selectId = "";
    if(selectRow){
        selectId = selectRow.data.id;
    }else{
        layer.msg('没有选择要删除的数据');
        return;
    } 
    layer.confirm('是否继续删除？',function(index){
        layer.close(index);
        var TradeCode = "DeleteEqlistConfigInfo^"  + GLOBAL.MODULENAME + "^" + GLOBAL.CLASSNAME;
        var input = {
            "TradeCode" : TradeCode,
            'id':selectId
        }
        CallMethod(input,function(){
            layer.msg('删除成功');
            LoadDg();
        },"DoMethod");
    }); 
}
function LoadDg(){
    selectRow = null;
    // 字段赋值
    var input = {};
    input['TradeCode'] = "QueryEqlistConfigInfo^"  + GLOBAL.MODULENAME + "^" + GLOBAL.CLASSNAME;
    $.each(GLOBAL.FILEDS,function(index,key){
       input[key.id] = $('#' + key.id).val();
    });
    //CallMethod(input,init_dg,"DoMethod");
    init_dg(input)
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
                height: 750 ,//定义高度
                even:false, //隔行背景
                url:  PYTHONSERVER + 'DoMethod', //数据接口
                page: true,
                limits:[20, 50, 100],
                limit:20,
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
                    {field: GLOBAL.FILEDS[9].id, title: GLOBAL.FILEDS[9].title,width:80},
                    {field: GLOBAL.FILEDS[3].id, title: GLOBAL.FILEDS[3].title,width:80},//,edit:'text'
                    {field: GLOBAL.FILEDS[4].id, title: GLOBAL.FILEDS[4].title,width:120},//,edit:'text'
                    {field: GLOBAL.FILEDS[5].id, title: GLOBAL.FILEDS[5].title,width:120, templet: function (d) {
                        //#region    下拉选择
                            retstr= '<select name="logins" class="sel_xlk" lay-filter="stateSelect" lay-verify="required" ' + '" data-value="' + d.id + '" >' ;
                            input={};
                            input['TradeCode'] = "QueryEqlistConfigcfg^"  + GLOBAL.MODULENAME + "^" + GLOBAL.CLASSNAME;
                            var rtn =CallMethod(input,"","DoMethod","N");
                            var codecfr=d['ss_eqlistc_cfgcode']
                            if(codecfr!="请选择"){
                                optioncount=1;
                                for(;optioncount<=rtn.output.length;optioncount++){
                                    var jsonboj=JSON.parse(rtn.output[optioncount-1])
                                    if(jsonboj['ss_eqlistc_cfgcode']==codecfr){
                                        retstr+=  '<option id = "field'+jsonboj['ss_eqlistc_cfgcode'] + '" data='+jsonboj['ss_eqlistc_cfgdesc']+' value="0" selected = "selected">'+jsonboj['ss_eqlistc_cfgcode']+'</option>'
                                        continue;
                                    }
                                    retstr+='<option id = "field'+jsonboj['ss_eqlistc_cfgcode'] + '" data='+jsonboj['ss_eqlistc_cfgdesc']+' value="'+optioncount+'">'+jsonboj['ss_eqlistc_cfgcode']+'</option>'
                                }
                             }
                            else{
                                retstr+=  '<option id = "field'+codecfr + '" data="" '+' value="0" selected = "selected">'+codecfr+'</option>'
                                optioncount=1;
                                for(;optioncount<=rtn.output.length;optioncount++){
                                    var jsonboj=JSON.parse(rtn.output[optioncount-1])
                                    retstr+='<option id = "field'+jsonboj['ss_eqlistc_cfgcode'] + '" data='+jsonboj['ss_eqlistc_cfgdesc']+' value="'+optioncount+'">'+jsonboj['ss_eqlistc_cfgcode']+'</option>'
                                }
                            }

                            return retstr; 
                        }
                        //#endregion
                    },
                    {field: GLOBAL.FILEDS[6].id, title: GLOBAL.FILEDS[6].title,width:150},
                    {field: GLOBAL.FILEDS[7].id, title: GLOBAL.FILEDS[7].title,width:180},
                    {fixed: 'right', title:'操作', toolbar: '#barDemo', width:150}
                ]],
                done: function (res, curr, count) {
                    $(".layui-table-body, .layui-table-box, .layui-table-cell").css('overflow','visible');
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
                    var datalist = getDataList("dg");
                    var index =1;
                    var time = getFormatDate();
                    var newData = {
                        "usercode":$('#usercode').next().find(".layui-this")[0].innerText,
                        "ss_eqlistc_code":$('#usercode').next().find(".layui-this")[0].innerText,
                        "ss_eqlistc_desc":$('#usercode').val(),
                        "resid":String(datalist.length),
                        "ss_eqlistc_cfgcode":"请选择",
                        "ss_eqlistc_cfgdesc":"",
                        "id":"",//必须添加一个，不然取key报错
                        "ss_eqlistc_createdate":String(time),
                        "ss_eqlistc_update":String(time)
                    }
                    var newDataList =table.cache["dg"];
                    newDataList.push(newData);
                    EDITINDEX = index;
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
                        var TradeCode = "DeleteEqlistConfigInfo^"  + GLOBAL.MODULENAME + "^" + GLOBAL.CLASSNAME;
                        var input = {
                            "TradeCode" : TradeCode,
                            'id':selectId,
                            'ss_eqlistc_cfgcode':data.ss_eqlistc_cfgcode,
                            'ss_eqlistc_code':data.ss_eqlistc_code
                        }
                        CallMethod(input,function(){
                        },"DoMethod","N");
                        var input = {};
                        layer.msg('删除成功');
                        input['TradeCode'] = "QueryEqlistConfigInfo^"  + GLOBAL.MODULENAME + "^" + GLOBAL.CLASSNAME;
                        input['usercode'] =data.ss_eqlistc_code;
                        init_dg(input)
                        init_rightDG();
                    });
                }
                else if(obj.event === 'save'){
                    var data = selectRow.data;
                    layer.confirm('是否保存？',function(index){
                        var input = {};
                        exclick='0';
                        EDITINDEX=undefined;
                        for(let key  in data){
                            input[key] = data[key];
                          }
                        input['TradeCode'] = "UpdateEqlistConfigcfg^"  + GLOBAL.MODULENAME + "^" + GLOBAL.CLASSNAME;
                        input['updatetype']="0";
                        CallMethod(input,function(){
                        },"DoMethod","N");
                        layer.msg('保存成功');
                        var input = {};
                        selectRow=null;
                        input['TradeCode'] = "QueryEqlistConfigInfo^"  + GLOBAL.MODULENAME + "^" + GLOBAL.CLASSNAME;
                        input['usercode'] =data.ss_eqlistc_code;
                        init_dg(input)
                    });
                }
            });
            //监听行单击事件
            table.on('row(dg)', function(obj){
                if(exclick=='0') {cellclick();}
                //动态添加背景色
                 if(selectRow && selectRow.data.id == obj.data.id){ // 取消选中
                      //selectRow = obj;
                      obj.tr.siblings().removeClass('layui-table-click');
                 }else{
                     obj.tr.siblings().removeClass('layui-table-click');
                     selectRow = obj;
                 }
                //if (selectRow) {
                    obj.tr.addClass('layui-table-click');
                    var input = {};
                    selectRowRigth=null;
                    EDITINDEXRigth=undefined 
                    input['TradeCode'] = "QueryEqlistConfigDtailInfo^"  + GLOBALSon.MODULENAME + "^" + GLOBALSon.CLASSNAME;
                    for(let key  in selectRow.data){
                        input[key] = selectRow.data[key];
                    }
                    init_rightDG(input);

               // }
            });
        });
    }catch(e){
        alert(e.ResponseText);
    }
}

function init_rightDG(jsonObj){
    try{
        layui.use('table', function(){
            table = layui.table;
            //第一个实例
            table.render({
                id:'rdg',
                elem: '#rdg',
                field:'id',
                align:'center',
                border:'',
                toolbar: '#toolbarDemoR',
                defaultToolbar:false,
                size: 'sm', //表格尺寸 默认 sm
                height: 750 ,//定义高度
                even:false, //隔行背景
                url:  PYTHONSERVER + 'DoMethod', //数据接口
                page: true,
                limits:[100],
                limit:100,
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
                        "data":tmpArr //解析数据列表
                      };
                },
                response: {
                    statusCode: 200 //重新规定成功的状态码为 200，table 组件默认为 0
                  },
                cols: [[ //表头
                    //{field: GLOBAL.FILEDS[1].id, title: GLOBAL.FILEDS[1].title,width:150},//,sort:true 排序
                    {field: GLOBALSon.FILEDS[6].id, title: GLOBALSon.FILEDS[6].title,width:80,},
                    {field: GLOBALSon.FILEDS[2].id, title: GLOBALSon.FILEDS[2].title,width:80,},
                    {field: GLOBALSon.FILEDS[3].id, title: GLOBALSon.FILEDS[3].title,width:150,},//edit:'text'
                    {field: GLOBALSon.FILEDS[4].id, title: GLOBALSon.FILEDS[4].title,width:120, templet: function (d) {
                        //#region    下拉选择
                            retstr= '<select name="logins" class="sel_xlkRight" lay-filter="stateSelect" lay-verify="required" ' + '" data-value="' + d.id + '" >' ;
                            input={};
                            input['TradeCode'] = "QueryEqlistConfigtype^"  + GLOBALSon.MODULENAME + "^" + GLOBALSon.CLASSNAME;
                            input['ss_eqlistc_cfgcode']=jsonObj["ss_eqlistc_cfgcode"];
                            var rtn =CallMethod(input,"","DoMethod","N");
                            var codecfr=d['ss_eqlistc_cfgvalue']=="None"?'请选择':d['ss_eqlistc_cfgvalue'];
                            if(codecfr!="请选择"){
                                optioncount=1;
                                for(;optioncount<=rtn.output.length;optioncount++){
                                    var jsonboj=JSON.parse(rtn.output[optioncount-1])
                                    if(jsonboj['ss_dic_code']==codecfr){
                                        retstr+=  '<option id = "field'+jsonboj['ss_dic_code'] + '" data='+jsonboj['ss_dic_desc']+' value="0" selected = "selected">'+jsonboj['ss_dic_code']+'</option>'
                                        continue;
                                    }
                                    retstr+='<option id = "field'+jsonboj['ss_dic_code'] + '" data='+jsonboj['ss_dic_desc']+' value="'+optioncount+'">'+jsonboj['ss_dic_code']+'</option>'
                                }
                             }
                            else{
                                retstr+=  '<option id = "field'+codecfr + '" data="" '+' value="0" selected = "selected">'+codecfr+'</option>'
                                optioncount=1;
                                for(;optioncount<=rtn.output.length;optioncount++){
                                    var jsonboj=JSON.parse(rtn.output[optioncount-1])
                                    retstr+='<option id = "field'+jsonboj['ss_dic_code'] + '" data='+jsonboj['ss_dic_desc']+' value="'+optioncount+'">'+jsonboj['ss_dic_code']+'</option>'
                                }
                            }

                            return retstr; 
                        }
                        //#endregion
                    },
                    {field: GLOBALSon.FILEDS[5].id, title: GLOBALSon.FILEDS[5].title,width:120,},
                    {fixed: 'right', title:'操作', toolbar: '#barDemoR', width:150}
                ]],
                done: function (res, curr, count) {
                    $(".layui-table-body, .layui-table-box, .layui-table-cell").css('overflow','visible');
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
                    else if(selectRow.data.ss_eqlistc_cfgcode!=table.cache["dg"][selectRow.data.resid].ss_eqlistc_cfgcode&&selectRow.data.ss_eqlistc_cfgcode!=undefined){//如果左边变化有id,但是变化过没保存也不允许增加.
                        layer.msg("请先保存左边数据！",{icon:5});
                        return;}
                    if (exclickRigth=="1") {
                        layer.msg("每次只能添加一条记录！",{icon:5});
                        return;
                    } 
                    var datalist = getDataList("rdg");
                    var index = 1;
                    var time = getFormatDate();
                    var newData = {
                        "ss_eqlistc_code":$('#usercode').next().find(".layui-this")[0].innerText,
                        "ss_eqlistc_desc":$('#usercode').val(),
                        "resid":String(datalist.length),
                        "ss_eqlistc_cfgvalue":"请选择",
                        "ss_dic_desc":"",
                        "id":"",//必须添加一个，不然取key报错
                        "ss_eqlistc_update":String(time),
                    }
                    var newDataList =table.cache["rdg"];
                    newDataList.push(newData);
                    EDITINDEX = index;
                    exclickRigth='0';
                    table.reload("rdg",{
                        url:'',
                        data: newDataList
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
                    else if(selectRow.data.ss_eqlistc_cfgcode!=table.cache["dg"][selectRow.data.resid].ss_eqlistc_cfgcode&&selectRow.data.ss_eqlistc_cfgcode!=undefined){//如果左边变化有id,但是变化过没保存也不允许增加.
                        layer.msg("请先保存左边数据！",{icon:5});
                        return;}
                    var selectId = data.id;
                    exclickRigth='0';
                    selectRowRigth=null;
                    EDITINDEXRigth=undefined;
                    layer.confirm('是否继续删除？',function(index){
                        var TradeCode = "DeleteEqlistConfigDetailInfo^"  + GLOBAL.MODULENAME + "^" + GLOBAL.CLASSNAME;
                        var input = {
                            "TradeCode" : TradeCode,
                            'id':selectId,
                            'ss_eqlistc_cfgcode':data.ss_eqlistc_cfgcode,
                            'ss_eqlistc_code':data.ss_eqlistc_code

                        }
                        CallMethod(input,function(){
                        },"DoMethod","N");
                        var input = {};
                        layer.msg('删除成功');
                        input['TradeCode'] = "QueryEqlistConfigDtailInfo^"  + GLOBALSon.MODULENAME + "^" + GLOBALSon.CLASSNAME;
                        input['ss_eqlistc_code']=jsonObj["ss_eqlistc_code"];
                        input['ss_eqlistc_cfgcode']=selectRow.data.ss_eqlistc_cfgcode;
                        init_rightDG(input);
                    });
                }
                else if(obj.event === 'save'){
                    if(!selectRow.data.id){//如果左边新增没有保存就没有id
                        layer.msg("请先保存左边数据！",{icon:5});
                        return;}
                    else if(selectRow.data.ss_eqlistc_cfgcode!=table.cache["dg"][selectRow.data.resid].ss_eqlistc_cfgcode&&selectRow.data.ss_eqlistc_cfgcode!=undefined){//如果左边变化有id,但是变化过没保存也不允许增加.
                        layer.msg("请先保存左边数据！",{icon:5});
                        return;}
                    var data = selectRowRigth.data;
                    layer.confirm('是否保存？',function(index){
                        var input = {};
                        exclickRigth='0';
                        EDITINDEXRigth=undefined;
                        for(let key  in jsonObj){
                           input[key] = jsonObj[key];
                        }
                        input['TradeCode'] = "UpdateEqlistConfigcfg^"  + GLOBAL.MODULENAME + "^" + GLOBAL.CLASSNAME;
                        for(let key  in data){
                            input[key] = data[key];
                          }
                        input['updatetype']='1';
                        CallMethod(input,function(){
                            },"DoMethod","N");
                        layer.msg('保存成功');
                        var input = {};
                        selectRowRigth=null;
                        input['TradeCode'] = "QueryEqlistConfigDtailInfo^"  + GLOBALSon.MODULENAME + "^" + GLOBALSon.CLASSNAME;
                        input['ss_eqlistc_code']=jsonObj["ss_eqlistc_code"];
                        input['ss_eqlistc_cfgcode']=selectRow.data.ss_eqlistc_cfgcode;
                        init_rightDG(input);
                    });
                }
            });
            //监听行单击事件
            table.on('row(rdg)', function(obj){
                if(exclickRigth=='0') {Rightcellclick();}
                //动态添加背景色
                 if(selectRowRigth && selectRowRigth.data.id == obj.data.id){ // 取消选中
                      //selectRow = obj;
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
    exclick='1';
    $($(".layui-table-body")[0]).find('dd').on("click",function(){

    /*     var newDataList =table.cache["dg"];
        for(newDataListCount=0; newDataListCount<newDataList.length;newDataListCount++){
            if(newDataList[newDataListCount].id==selectRow.data.id){
                newDataList[newDataListCount].ss_eqlistc_cfgcode=this.innerText;
                newDataList[newDataListCount].ss_eqlistc_cfgdesc=typeof $("#field"+this.innerText).attr('data')=='undefined'?"":$("#field"+this.innerText).attr('data');
            }
        }
        table.reload("dg",{
            url:'',
            data: newDataList
            
        });
        exclick='0'; */
        selectRow.data["ss_eqlistc_cfgcode"]=this.innerText;
        selectRow.data["ss_eqlistc_cfgdesc"]=typeof $("#field"+this.innerText).attr('data')=='undefined'?"":$("#field"+this.innerText).attr('data');
        getCellVal(selectRow.data.resid,'ss_eqlistc_cfgdesc',typeof $("#field"+this.innerText).attr('data')=='undefined'?"":$("#field"+this.innerText).attr('data'));
        var input = {};
        exclickRigth='0';
        selectRowRigth=null;
        EDITINDEXRigth=undefined
        input['TradeCode'] = "QueryEqlistConfigDtailInfo^"  + GLOBALSon.MODULENAME + "^" + GLOBALSon.CLASSNAME;
        input['ss_eqlistc_code']=selectRow.data.ss_eqlistc_code;
        input['ss_eqlistc_cfgcode']=selectRow.data.ss_eqlistc_cfgcode;
        init_rightDG(input);
    });
}
function Rightcellclick()
{
    $($(".layui-table-body")[2]).find('dd').on("click",function(){
    /*     var newDataList =table.cache["dg"];
        for(newDataListCount=0; newDataListCount<newDataList.length;newDataListCount++){
            if(newDataList[newDataListCount].id==selectRow.data.id){
                newDataList[newDataListCount].ss_eqlistc_cfgcode=this.innerText;
                newDataList[newDataListCount].ss_eqlistc_cfgdesc=typeof $("#field"+this.innerText).attr('data')=='undefined'?"":$("#field"+this.innerText).attr('data');
            }
        }
        table.reload("dg",{
            url:'',
            data: newDataList
            
        });
        exclick='0'; */
       selectRowRigth.data["ss_dic_code"]=this.innerText;
       selectRowRigth.data["ss_dic_desc"]=typeof $("#field"+this.innerText).attr('data')=='undefined'?"":$("#field"+this.innerText).attr('data');
       getCellValRight(selectRowRigth.data.resid,'ss_dic_desc',typeof $("#field"+this.innerText).attr('data')=='undefined'?"":$("#field"+this.innerText).attr('data'));
    });
}

// 加载下拉 
function LoadSelect(){
    var input = {};
    input['TradeCode'] = "queryTerminal^"  + "SelfServPy.Common.mysql_contral" + "^" + "mysqlsql";
    CallMethod(input,initSelect,"DoMethod");
}


function initSelect(jsonObj) {
    var tmpArr = [];
    $.each(jsonObj.output,function(key,val){
        var tmpObj = JSON.parse(val);
        tmpArr.push(tmpObj)
    });
    layui.use(['form'], function() {
        var form = layui.form;
        $.each(tmpArr,function(index,value){
            $('#usercode').append(new Option(value.usercode,value.usercodeaddr))
        });
        form.render("select");
        var input = {};
        input['TradeCode'] = "QueryEqlistConfigInfo^"  + GLOBAL.MODULENAME + "^" + GLOBAL.CLASSNAME;
        input['usercode'] =tmpArr[0].usercode;
        init_dg(input)
        $("dd").on("click",function(){
            //进行的业务逻辑代码,获取value值
            var selectId =$('#usercode').next().find(".layui-this").text();
            selectRow = null;
            EDITINDEX = undefined;
            // 字段赋值
            var input = {};
            input['TradeCode'] = "QueryEqlistConfigInfo^"  + GLOBAL.MODULENAME + "^" + GLOBAL.CLASSNAME;
            input['usercode'] =selectId;
      /*       $.each(GLOBAL.FILEDS,function(index,key){
                input[key.id] = $('#' + key.id).val();
            }); */
            //CallMethod(input,init_dg,"DoMethod");
            init_dg(input)
        })
 
    });
}

function  getCellValRight(index,field,text) {
    var rtn = '';
    // 
    var Field = $($(".layui-table-body")[2]).find('td[data-field="' + field + '"]')[index];
     $(Field).find('.layui-table-cell')[0].innerText=text;
}

function  getCellVal(index,field,text) {
    var rtn = '';
    // 
    var Field = $($(".layui-table-body")[0]).find('td[data-field="' + field + '"]')[index];
     $(Field).find('.layui-table-cell')[0].innerText=text;
}
