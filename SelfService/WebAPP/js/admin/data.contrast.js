/**
 * FileName: dhcinsu/mi.main.js
 * Anchor: tangzf
 * Date: 2021-02-02
 * Description: 国家版-医保数据上传
 */
var Global = {
	Com : {
		ClassName :'INSU.COM.BaseData' // Global.Com.ClassName
	},
	PortConfig:{
		ClassName :'INSU.MI.PortConfig' // Global.PortConfig.ClassName
	},
	PortList:{
		ClassName :''
	},
	PortInArgs:{
		ClassName :''
	},
	PortNode:{
		ClassName :'INSU.MI.PortNodeCom'
	},
	QueryStr:'',
	Operator:'',
	wdgSeq:[],
	edgSeq:[]
}

$(function(){
	// hospital
	//init_hosp();
	
	// insutype
	init_insuType();
	
	// AuditFlag
	//init_auditFlag();
	
	// center
	init_dg();
	
	// west 
	init_wdg();
	
	// east
	init_edg();

	// PortCommon  - window
	//init_PortCommonDg();

	// PortRoot - window 
	//init_PortRootDg();
	
	//init_INSUMIType(); // 配置类型 0：线下，1：线上
	// dg 
	init_dgEvent();
	//init_wdgEvent();
	//init_edgEvent();
	//init_Keyup();
});
function init_dgEvent(){
	$HUI.linkbutton("#btnFind", {
		onClick: function () {
			Load_dg_DataGrid();
		}
	});
	$HUI.linkbutton("#btnAdd", {
		onClick: function () {
			dg_addRow();
		}
	});
	$HUI.linkbutton("#btnEndEdit", {
		onClick: function () {
			DG_EndEdit();
		}
	});
	$HUI.linkbutton("#btnSaveSingle", {
		onClick: function () {
			SaveSingle();
		}
	});
	$HUI.linkbutton("#btnSaveAll", {
		onClick: function () {
			SaveMult();
		}
	});
	
	$HUI.linkbutton("#btnPubConfig", {
		onClick: function () {
			var HospID = $('#Hospital').combobox('getValue');
			var InsuType = $('#InsuType').combobox('getValue');
			if(HospID == ""){
				$.messager.alert('提示','请选择院区','info');
				return;	
			}
			if(InsuType == ""){
				$.messager.alert('提示','请选择医保类型','info');
				return;	
			}
			$('#PubConfigWin').show(); 
			$HUI.dialog("#PubConfigWin",{
					title:'公共参数配置',
					height:667,
					width:871,
					collapsible:false,
					modal:true,
				    iconCls: 'icon-w-edit'
			})
			$("#addInfo").form("clear");
			var HospID = $('#Hospital').combobox('getText');
			var InsuType = $('#InsuType').combobox('getText'); 
		    $('#PortCom-HOSPID').val(HospID);
		    $('#PortCom-HITYPE').val(InsuType);
			LoadPubDG();
		}
	});
	$HUI.linkbutton("#btnPointConfig", {
		onClick: function () {
			var dgSelected = $('#dg').datagrid('getSelected');
			if(!dgSelected){
				$.messager.alert('提示','请选择接口','info');
				return;		
			}
			if(dgSelected.ROWID == ''){
				$.messager.alert('提示','请选择有效的接口','info');
				return;	
			}
			var HospID = dgSelected.HOSPID;
			var InsuType = dgSelected.HITYPE;
			if(HospID == ""){
				$.messager.alert('提示','接口未维护院区','info');
				return;	
			}
			if(InsuType == ""){
				$.messager.alert('提示','接口未维护医保类型','info');
				return;	
			}
			$('#PointConfigWin').show(); 
			$HUI.dialog("#PointConfigWin",{
					title:'根节点配置',
					height:667,
					width:871,
					collapsible:false,
					modal:true,
				    iconCls: 'icon-w-edit'
			});
			$("#addInfoRoot").form("clear");
			var dgIndex = $('#dg').datagrid('getRowIndex',dgSelected);
			var HOSPID = INSUMIDataGrid.getCellVal('dg',dgIndex,'HOSPID');
			var HITYPE = INSUMIDataGrid.getCellVal('dg',dgIndex,'HITYPE');
			$('#PortRoot-HOSPID').val(HOSPID);
			$('#PortRoot-HITYPE').val(HITYPE);
			
			var INFNO = INSUMIDataGrid.getCellVal('dg',dgIndex,'INFNO');
			var INFNAME = INSUMIDataGrid.getCellVal('dg',dgIndex,'INFNAME');
			$('#PortRoot-INFNO').val(INFNO);
			$('#PortRoot-INFNAME').val(INFNAME);
			
			LoadPortRoot();
		}
	});
	$HUI.linkbutton("#btnStedit", {
		onClick: function () {
			stEdit();
		}
	});
	$HUI.linkbutton("#btnDelDG", {
		onClick: function () {
			var edgSelect = $('#dg').datagrid('getSelected');
			if(!edgSelect){
				INSUMIAlert('请选择要删除的数据' , 'error');
		        return ;	
			}
			if (!edgSelect.ROWID){
				var Index = $('#dg').datagrid('getRowIndex',edgSelect);
				$('#dg').datagrid('deleteRow',Index);	
				return;
			}
			$.messager.confirm('提示','是否继续删除该数据?该操作会删除对应的参数',function(r){
				if(r){
					$.messager.confirm('确认','是否继续删除该数据?该操作会删除接口以及(左下角、右下角数据)',function(r){
						if(r){
							var rtn = $.m({ClassName: "INSU.MI.PortListCom", MethodName: "DeleteListNodeArgs", id: edgSelect.ROWID}, false);
							if(rtn == '0'){
								INSUMIPOP('删除成功' , 'success');
							}else{
								INSUMIPOP('删除失败' , 'error');
							}
							Load_dg_DataGrid();
						}		
					});
				}		
			});
		}
	});
	$HUI.linkbutton("#btnBuildData", {
		onClick: function () {
			var edgSelect = $('#dg').datagrid('getSelected');
			if(!edgSelect){
				INSUMIAlert('请选择要生成的数据' , 'error');
		        return ;	
			}
			$.messager.confirm('提示','是否继续生成数据',function(r){
				if(r){
	        		var rtn = $.m({ClassName: Global.PortConfig.ClassName, MethodName: "BuildDefaultPortNodeData", PARNODETYPE:'' ,PortListID: edgSelect.ROWID}, false);
					if(rtn == '0'){
						INSUMIPOP('生成成功' , 'success');
					}else{
						INSUMIPOP('生成失败' , 'error');
					}
					Load_wdg_DataGrid();
				}		
			});
		}
	});
	$HUI.linkbutton("#btnAudit", {
		onClick: function () {
			var edgSelect = $('#dg').datagrid('getSelected');
			if(!edgSelect){
				INSUMIAlert('请选择要审核的数据' , 'error');
		        return ;	
			}
			if(getValueById('AuditFlag') == ""){
				INSUMIAlert('审核标志不能为空' , 'error');
		        return ;	
			}
			var Msg = '是否继续将该数据审核成【' + $('#AuditFlag').combobox('getText') + '】';
			if(getValueById('AuditFlag') == '2'){
				Msg = Msg + '，审核为发布以后将不允许修改任何数据。'	
			}
			$.messager.confirm('提示',Msg,function(r){
				if(r){
	        		var rtn = $.m({ClassName: 'INSU.MI.PortListCom', MethodName: "Audit",PUBLISHSTATUS:getValueById('AuditFlag'), SessionStr:session['LOGON.USERID'],RowId: edgSelect.ROWID}, false);
					if(rtn == '0'){
						INSUMIPOP('审核成功' , 'success');
					}else{
						INSUMIPOP('审核失败' , 'error');
					}
					Load_dg_DataGrid();
				}		
			});
		}
	});
	$HUI.linkbutton("#btnExport", {
		onClick: function () {
			ExportALLData();		
		}
	});
	$HUI.linkbutton("#btnImport", {
		onClick: function () {
			ImportAllData();		
		}
	});
	// 参数展示
	$HUI.linkbutton("#btnParamShow", {
		onClick: function () {
			var dgSelected = $('#dg').datagrid('getSelected');
			if(!dgSelected){
				$.messager.alert('提示','请选择接口','info');	
				return;
			}
			var ClassName = dgSelected.CLASSNAME;
			var MethodName = dgSelected.METHODNAME;
			if(ClassName == ""){
				$.messager.alert('提示','接口列表中类不能为空','info');
				return;
			}
			if(MethodName == ""){
				$.messager.alert('提示','接口列表中方法不能为空','info');
				return;
			}
			showParamWindow();		
		}
	});	
	$HUI.linkbutton("#BuildParam", {
		onClick: function () {
			BuildOutputParam();		
		}
	});
}
// 生成参数
function BuildOutputParam(){
	var dgSelected = $('#dg').datagrid('getSelected');
	if(!dgSelected){
		$.messager.alert('提示','请选择接口','info');
		return;	
	}
	var ClassName = dgSelected.CLASSNAME;
	var MethodName = dgSelected.METHODNAME;
	var INFNO = dgSelected.INFNO;
	var HospId = dgSelected.HOSPID;
	var CONTENTTYPE = dgSelected.CONTENTTYPE;
	if(ClassName == ""){
		$.messager.alert('提示','接口列表中类不能为空','info');
		return;
	}
	if(MethodName == ""){
		$.messager.alert('提示','接口列表中方法不能为空','info');
		return;
	}
	if(CONTENTTYPE == ""){
		$.messager.alert('提示','参数内容类型不能为空','info');
		return;
	}
	var inputArr = $('#addInfoParamShow').find('input');
	var inputArrLen = inputArr.length;
	var InputParam = {
		ClassName: ClassName,
		MethodName: MethodName
	};
	var parentInput = $('.tb300');
	for (var index = 0;index < parentInput.length;index++){
		var parentVal = parentInput[index].value;
		var parentid = parentInput[index].id;
		var ChildNodeArr = $('.ChildNode');
		
		for (var ChildNodeindex = 0;ChildNodeindex < ChildNodeArr.length;ChildNodeindex++){
			var childData = $(ChildNodeArr[ChildNodeindex]).attr('data');
			var childVal = $(ChildNodeArr[ChildNodeindex]).val();
			if(childData == parentid){
				if (parentVal=="") parentVal=childVal;
				else parentVal = parentVal + '^' +childVal;
			}	
		}
		parentVal = parentVal==""?parentInput[index].value:parentVal;
		InputParam[parentid] = parentVal;
		
	}
	var InputInfo = $.m(InputParam, false);
	$('#OutPutParam').val(InputInfo);	
}
// 参数信息展示
function showParamWindow(){
	try{
		var dgSelected = $('#dg').datagrid('getSelected');
		if(!dgSelected){
			$.messager.alert('提示','请选择接口','info');
			return;	
		}
		var INFNO = dgSelected.INFNO;
		var HospId = dgSelected.HOSPID; // InfoNo, HospId, InsuType, PortRootNode
		var InsuType = dgSelected.HITYPE;
		if(HospId == "" || InsuType == ""){
			$.messager.alert('提示','接口的医保类型或者院区不能为空','info')	;
			return;
		}
		var InputInfo = $.m({ClassName: "INSU.MI.PortRoot", MethodName: "GetConinfoByInfoNoHospInsuType", InfoNo:INFNO,HospId:HospId,InsuType:InsuType,PortRootNode:'InputParam'}, false);
		var htmlStr = "";
		if(InputInfo.split('^')[0] < 0){
			$.messager.alert('提示','未配置接口类方法或者未在根节点配置InputParam参数','info')	;
			return;
		}
		InputInfo = InputInfo.split('^')[7];
		var InputConfigObj = JSON.parse(InputInfo);
		
		var ColLen = 5; // three col 此处配置列数
		var tmpCol = 1;
		var totalRow = 0;
		
		
		var tmpIndex = 0;
		
		//遍历配置
		for (key in InputConfigObj){
			var LabelId = key;
			var defVal = "";
			var LabelText = InputConfigObj[key];
			var keyVal = InputConfigObj[key];
			var parentClass = '';
			if (typeof keyVal == "object"){
					//单独一行
					htmlStr = htmlStr + "<tr class='auto'>";
					totalRow++;
					tmpCol = ColLen;
					LabelText = LabelId;
					buildData('tb300');
					//单独一行
					for (j in keyVal){
						parentClass = key;
						LabelId = j;
						LabelText = j;
						defVal = keyVal[j];	
						if(keyVal[j].split('=').length > 1){ // 维护了默认值
							defVal = keyVal[j].split('=')[1];
							LabelText = keyVal[j].split('=')[0];
						}
						buildData('');
					}
			}else{
				
				if(LabelText.split('=').length > 1){ // 维护了默认值
					defVal = LabelText.split('=')[1];
					LabelText = LabelText.split('=')[0];
					LabelId = key;
				}
				//单独一行
				htmlStr = htmlStr + "<tr class='auto'>";
				totalRow++;
				tmpCol = ColLen;
				LabelText = LabelId;
				buildData('tb300');
				//单独一行	
			}
		}
		var InputInfoLen = InputInfo.split('$').length;

		var defaultHeight = 463 + (totalRow-1) * 38; // 默认一行高度556px 每多一行参数+38
		$('.auto').remove();
		$("#addInfoParamShow").prepend(htmlStr);	 
		//    
		$('#ParamShowWin').show(); 
		$HUI.dialog("#ParamShowWin",{
				title:'参数展示',
				height:defaultHeight,
				width:990,
				collapsible:false,
				modal:true,
			    iconCls: 'icon-w-edit'
		});
	}catch(e){
		$.messager.alert('提示','生成界面发生异常:' + e.responseText,'info')
	}
	// 生成数据
	function buildData(SingleParam){
		var FirstCol = '';
		if(tmpCol==1){
			htmlStr = htmlStr + "<tr class='auto'>";	
			FirstCol = "r-label-1";
			totalRow++;
		}
		var colspan = "";
		var PaChLabel = '(子)';
		if(SingleParam != ""){
			colspan = "colspan=99";
			PaChLabel = '(主)';
		}
		LabelText = PaChLabel + LabelText;
		var ChildNode = parentClass == "" ?ChildNode="":"ChildNode";
		
		htmlStr = htmlStr + "<td class='auto r-label " + FirstCol +  "'><label>" + LabelText + "</label><td>";
		htmlStr	= htmlStr + "<td class='auto' " +colspan+  " ><input data='" + parentClass + "' placeholder='" + LabelId +"' class='auto textbox " + SingleParam + ' ' + ChildNode + "' id='" + LabelId +  "' value='" + defVal + "' /></td>";	
		if((tmpCol == ColLen ) || ((tmpIndex+1)==InputInfoLen)){
			htmlStr = htmlStr + "</tr>";	
		}
		if(tmpCol == ColLen){
			tmpCol = 1;	
		}else{
			tmpCol++;
		}
		
	}
}
function init_wdgEvent(){
	// west EVent
	$HUI.linkbutton("#west-btnFind", {
		onClick: function () {
			Load_wdg_DataGrid();
		}
	});
	// west EVent
	$HUI.linkbutton("#west-add", {
		onClick: function () {
			wdg_addRow();
		}
	});
	$HUI.linkbutton("#west-endEdit", {
		onClick: function () {
			WestEndEdit();
		}
	});
	$HUI.linkbutton("#west-save", {
		onClick: function () {
			wdg_SaveMultRow();
		}
	});
	$HUI.linkbutton("#west-comp", {
		onClick: function () {
			var url = "dhcinsu.mi.portargsdic.csp";
			websys_showModal({
				url: url,
				title: "数据元字典维护",
				iconCls: "icon-w-edit",
				width: "1120",
				height: "660",
				onClose: function()
				{
				}
			});
		}
	});
	$HUI.linkbutton("#west-imp", {
		onClick: function () {
			var dgSelect = $('#dg').datagrid('getSelected');
			if(!dgSelect){
				INSUMIAlert('请先选择接口' , 'error');
		        return ;	
			}
			INSUMIFileOpenWindow(import_PortNode);
		}
	});
	$HUI.linkbutton("#west-del", {
		onClick: function () {
			var edgSelect = $('#wdg').datagrid('getSelected');
			if(!edgSelect){
				INSUMIAlert('请选择要删除的数据' , 'error');
		        return ;	
			}
			if (!edgSelect.ROWID){
				var Index = $('#wdg').datagrid('getRowIndex',edgSelect);
				var tmpSeq = INSUMIDataGrid.getCellVal('wdg',Index,'SEQ');
				$('#wdg').datagrid('deleteRow',Index);	
				Global.wdgSeq.splice(Global.wdgSeq.indexOf(tmpSeq), 1);
				return;
			}
			$.messager.confirm('提示','是否继续删除该数据?该操作会删除对应的参数',function(r){
				if(r){
					$.messager.confirm('提示','是否继续删除该数据?该操作会删除选中节点以及其右下角的数据',function(r){
						if(r){
							var rtn = $.m({ClassName: "INSU.MI.PortNodeCom", MethodName: "DeleteNodeAndInargs", id: edgSelect.ROWID}, false);
							if(rtn == '0'){
								INSUMIPOP('删除成功' , 'success');
							}else{
								INSUMIPOP('删除失败' , 'error');
							}
							Load_wdg_DataGrid();
						}		
					});
				}		
			});
			
		}
	});
}
function init_edgEvent(){
	$HUI.linkbutton("#east-deleteALLCon", {
		onClick: function () {
			var edgSelect = $('#wdg').datagrid('getSelected'); //父节点ID
			if(!edgSelect){
				INSUMIAlert('请在左边选择一行' , 'error');
		        return ;	
			}
			$.messager.confirm('提示','是否继续删除该对照关系?',function(r){
				if(r){
					var rtn = $.m({ClassName: "INSU.MI.PortInArgsCom", MethodName: "DeleteALLConByRowId", RowId: edgSelect.ROWID}, false);
					if(rtn == '0'){
						INSUMIPOP('删除成功' , 'success');
					}else{
						INSUMIPOP('删除失败' , 'error');
					}
					Load_edg_DataGrid();			
				}
					
			});
		}
	});
	$HUI.linkbutton("#east-deleteCon", {
		onClick: function () {
			var edgSelect = $('#edg').datagrid('getSelected');
			if(!edgSelect){
				INSUMIAlert('请选择要删除的数据' , 'error');
		        return ;	
			}
			$.messager.confirm('提示','是否继续删除该对照关系?',function(r){
				var rtn = $.m({ClassName: "INSU.MI.PortInArgsCom", MethodName: "DeleteConByRowId", RowId: edgSelect.ROWID}, false);
				if(rtn == '0'){
					INSUMIPOP('删除成功' , 'success');
				}else{
					INSUMIPOP('删除失败' , 'error');
				}
				Load_edg_DataGrid();	
			});
		}
	});
	$HUI.linkbutton("#east-delete", {
		onClick: function () {
			var edgSelect = $('#edg').datagrid('getSelected');
			if(!edgSelect){
				INSUMIAlert('请选择要删除的数据' , 'error');
		        return ;	
			}
			if (!edgSelect.ROWID){
				var Index = $('#edg').datagrid('getRowIndex',edgSelect);
				var tmpSeq = INSUMIDataGrid.getCellVal('edg',Index,'SEQ');
				$('#edg').datagrid('deleteRow',Index);	
				Global.edgSeq.splice(Global.edgSeq.indexOf(tmpSeq), 1);
				return;
			}
			$.messager.confirm('提示','是否继续删除该数据?',function(r){
				if(r){
					var rtn = $.m({ClassName: "INSU.MI.PortInArgsCom", MethodName: "DeleteByRowId", RowId: edgSelect.ROWID}, false);
					if(rtn == '0'){
						INSUMIPOP('删除成功' , 'success');
					}else{
						INSUMIPOP('删除失败' , 'error');
					}
					Load_edg_DataGrid();
				}		
			});
		}
	});
	$HUI.linkbutton("#east-stedit", {
		onClick: function () {
			EastBeginEdit("","");
		}
	});
	$HUI.linkbutton("#east-btnFind", {
		onClick: function () {
			Load_edg_DataGrid();
		}
	});
	$HUI.linkbutton("#east-add", {
		onClick: function () {
			edg_addRow();
		}
	});
	$HUI.linkbutton("#east-endEdit", {
		onClick: function () {
			EastEndEdit();
		}
	});	
	$HUI.linkbutton("#east-save", {
		onClick: function () {
			edg_SaveSingle();
		}
	});	
	$HUI.linkbutton("#east-imp", {
		onClick: function () {
			var dgSelect = $('#wdg').datagrid('getSelected');
			if(!dgSelect){
				INSUMIAlert('请先选择内容节点' , 'error');
		        return ;	
			}
			INSUMIFileOpenWindow(import_PortInArgs);
		}
	});	
}


// 线上线下
 function init_INSUMIType(){
	$('#TYPE').combobox({
		defaultFilter: 4,
		valueField: 'cCode',
		textField: 'cDesc',
		url:$URL,
		mode:'remote',
		onBeforeLoad:function(param){
	      	param.ClassName = 'INSU.COM.BaseData';
	      	param.QueryName = 'QueryDic1';
	      	param.Type = 'INSUMIType';
	      	param.HospDr = '';
	      	param.ResultSetType = 'array';
	      	return true;

		},
		onSelect: function (data) {
		},onLoadSuccess:function(){

		}
	});		 
	 
}
/**
 * Creator: tangzf
 * CreatDate: 
 * Description: 
 */
function init_Keyup() {
	$("#edgKeyInput").keydown(function (e) {
		Load_edg_DataGrid();
	});
	$("#ParamPortInfo").keydown(function (e) {
		if(e.keyCode==13){
			Load_dg_DataGrid();
		}
	});
}
// 
function init_dg() { 
	$('#dg').datagrid({
		autoSizeColumn:false,
		fit:true,	
		striped:true,
		singleSelect: true,
		pageSize: 10,
		data: [],
		toolbar:'#dgTB',
		pagination:true,
		rownumbers:false,
		columns:[[
			// 
			{field:'INFNO',title:'交易编号',width:80,editor:{
				type: 'combogrid',
				options: {
					idField: 'INFNO',
					textField: 'INFNAME',
					url:$URL,
					required:true,
					panelWidth:350, 
					mode:'remote',  
					columns:[[   
						{field:'INFNO',title:'交易编号',width:150},
						{field:'INFNAME',title:'交易名称',width:150}
				    ]],
					onBeforeLoad:function(param){
				      	param.ClassName = 'INSU.MI.PortFunListCom';
				      	param.QueryName = 'QueryPortFunList';
				      	param.ExpStr = '||' + param.q;
				      	param.page = 1;
				      	param.rows = 9999;
				      	return true;
					},
					onSelect: function (index,data) {		
						var SelectIndex = INSUMIGetEditRowIndexByID('dg');		
						INSUMIDataGrid.setGridVal('dg',SelectIndex,'INFNAME',data.INFNAME);
					}
				}
			}},
			{field:'INFNAME',title:'交易名称',width:130,editor:{
				type: 'validatebox',
				options: {
					required:true
				}
			}},
			{field:'Timeout',title:'超时',width:65,editor:{
				type: 'text'
			},hidden:true},
			{field:'HISVER',title:'接口版本',width:70,editor:{
				type: 'text'
			}},
			{field:'URL',title:'调用路径',width:120,editor:{
				type: 'text'
			}},
			{field:'CONTENTTYPE',title:'参数内容类型',width:120,editor:{
				type: 'combobox',
				options: {
					defaultFilter: 4,
					valueField: 'cCode',
					textField: 'cDesc',
					url:$URL,
					editable:false,
					mode:'remote',
					onBeforeLoad:function(param){
				      	param.ClassName = 'INSU.COM.BaseData';
				      	param.QueryName = 'QueryDic1';
				      	param.Type = 'CONTENTTYPE';
				      	param.HospDr = '';
				      	param.ResultSetType = 'array';
				      	return true;

					},
					onSelect: function (data) {
						
					}
				}
			},formatter:function(value, data,index){
				var rtn = GLOBAL.CONTENTTYPE[value];
				return rtn ;	
			}},
			
			{field:'TYPE',title:'配置类型',width:70,editor:{
				type: 'combobox',
				options: {
					defaultFilter: 4,
					valueField: 'cCode',
					textField: 'cDesc',
					url:$URL,
					mode:'remote',
					editable:false,
					onBeforeLoad:function(param){
				      	param.ClassName = 'INSU.COM.BaseData';
				      	param.QueryName = 'QueryDic1';
				      	param.Type = 'INSUMIType';
				      	param.HospDr = '';
				      	param.ResultSetType = 'array';
				      	return true;

					},
					onSelect: function (data) {
						
					}
				}
			},formatter:function(value, data,index){
				var rtn = GLOBAL.INSUMIType[value];
				return rtn ;	
			}	
			},
			{field:'CLASSNAME',title:'类名',width:110,editor:{
				type: 'text'
			}},
			{field:'METHODNAME',title:'方法名',width:110,editor:{
				type: 'text'
			}},
			{field:'SIGNTYPE',title:'加密类型',width:70,editor:{
				type: 'combobox',
				options: {
					defaultFilter: 4,
					valueField: 'cCode',
					textField: 'cDesc',
					url:$URL,
					editable:false,
					mode:'remote',
					onBeforeLoad:function(param){
				      	param.ClassName = 'INSU.COM.BaseData';
				      	param.QueryName = 'QueryDic1';
				      	param.Type = 'SIGNTYPE';
				      	param.HospDr = '';
				      	param.ResultSetType = 'array';
				      	return true;

					},
					onSelect: function (data) {
						
					}
				}
			}
			,formatter:function(value, data,index){
				var rtn = GLOBAL.SIGNTYPE[value];
				return rtn ;	
			}
			},
			{field:'EFFTFLAG',title:'是否启用',width:70,editor:{
				type: 'combobox',
				options: {
					defaultFilter: 4,
					valueField: 'cCode',
					textField: 'cDesc',
					url:$URL,
					editable:false,
					mode:'remote',
					onBeforeLoad:function(param){
				      	param.ClassName = 'INSU.COM.BaseData';
				      	param.QueryName = 'QueryDic1';
				      	param.Type = 'EFFTFLAG';
				      	param.HospDr = '';
				      	param.ResultSetType = 'array';
				      	return true;

					},
					onSelect: function (data) {
						
					}
				}
			},formatter:function(value, data,index){
				var rtn = GLOBAL.EFFTFLAG[value];
				return rtn ;	
			}
			},
			{field:'AutoUp',title:'自动上传',width:70,editor:{
				type: 'text'
			},hidden:true},
			{field:'SucUp',title:'成功再重传',width:70,editor:{
				type: 'text'
			},hidden:true},
			{field:'RecSYSCode',title:'接收方系统代码',width:120,editor:{
				type: 'text'
			},hidden:true},
			{field:'OUTNODECODE',title:'节点代码',width:80,editor:{
				type: 'text'
			},hidden:true},
			{field:'BUILDINPUT',title:'是否生产input',width:95,editor:{
				type: 'combobox',
				options: {
					defaultFilter: 4,
					valueField: 'cCode',
					textField: 'cDesc',
					url:$URL,
					editable:false,
					mode:'remote',
					onBeforeLoad:function(param){
				      	param.ClassName = 'INSU.COM.BaseData';
				      	param.QueryName = 'QueryDic1';
				      	param.Type = 'CODEFLAG';
				      	param.HospDr = '';
				      	param.ResultSetType = 'array';
				      	return true;

					},
					onSelect: function (data) {
						
					}
				}
			},formatter:function(value, data,index){
				var rtn = GLOBAL.CODEFLAG[value];
				return rtn ;	
			}
			
			},
			{field:'MDTRTTYPE',title:'适用病人',width:80,editor:{
				type: 'combobox',
				options: {
					defaultFilter: 4,
					valueField: 'cCode',
					textField: 'cDesc',
					url:$URL,
					editable:false,
					mode:'remote',
					onBeforeLoad:function(param){
				      	param.ClassName = 'INSU.COM.BaseData';
				      	param.QueryName = 'QueryDic1';
				      	param.Type = 'MDTRTTYPE';
				      	param.HospDr = '';
				      	param.ResultSetType = 'array';
				      	return true;

					},
					onSelect: function (data) {
						
					}
				}
			},formatter:function(value, data,index){
				var rtn = GLOBAL.MDTRTTYPE[value];
				return rtn ;	
			}
			,hidden:true
			},
			{field:'HOSPID',title:'适用医院',width:140,editor:{
				type: 'combobox',
				options: {
					defaultFilter: 4,
					valueField: 'Rowid',
					textField: 'Desc',
					editable:false,
					required:true,
					url:$URL,
					mode:'remote',
					onBeforeLoad:function(param){
						param.ClassName = Global.Com.ClassName;
						param.QueryName= 'QueryHospInfo';
						param.ResultSetType = 'array';
						return true;
					},
					onSelect: function (data) {
						
						
					},
					onLoadSuccess:function(data){

					}
				}
			},formatter:function(value, data,index){
				//var rtn = $.m({ClassName: Global.PortConfig.ClassName, MethodName: "GetHospDescById", HospId:$('#Hospital').combobox('getValue')}, false);
				return value ;	
			}
			
			},
			{field:'HITYPE',title:'适用医保',width:120,editor:{
				type: 'combobox',
				options: {
					defaultFilter: 4,
					valueField: 'cCode',
					textField: 'cDesc',
					url:$URL,
					mode:'remote',
					editable:false,
					required:true,
					onBeforeLoad:function(param){
				      	param.ClassName = 'INSU.COM.BaseData';
				      	param.QueryName = 'QueryDic1';
				      	param.Type = 'DLLType';
				      	param.HospDr = $('#Hospital').combobox('getValue');
				      	param.ResultSetType = 'array';
				      	return true;

					},
					onSelect: function (data) {
						
					}
				}
			},formatter:function(value, data,index){
				//var rtn = $.m({ClassName: "INSU.COM.BaseData", MethodName: "GetDicByCodeAndInd", SysType: 'DLLType',Code: value,Ind:4,HospDr:$('#Hospital').combobox('getValue')}, false);
				return value ;	
			}
			
			},
			{field:'CHKFLAG',title:'审核标志',width:80
			,formatter:function(value, data,index){
				var rtn = GLOBAL.PUBLISHSTATUS[value] || value;
				return rtn ;
			}
			},
			{field:'ROWID',title:'ROWID',width:10,hidden:true}

		]],
        onSelect : function(rowIndex, rowData) {
	        ChangeButtonByPublishStatus();
			Load_wdg_DataGrid();
        },
        onUnselect: function(rowIndex, rowData) {
        },
        onBeforeLoad:function(param){

	    },
		onDblClickRow:function(index,row){
			stEdit(index,row);
			
		},
	    onLoadSuccess:function(data){
			alert(data)
		},
		onBeginEdit:function(rowIndex, rowData){
			if(rowData.HOSPID ==""){
				INSUMIDataGrid.setGridVal('dg',rowIndex,'HOSPID',$('#Hospital').combobox('getValue'));
			}
			if(rowData.HITYPE ==""){
				INSUMIDataGrid.setGridVal('dg',rowIndex,'HITYPE',$('#InsuType').combobox('getValue'));
			}
			focusEditRow('dg'); 		
		},
		onBeforeEdit:function(rowIndex,rowData){
		},
		onAfterEdit:function(){
		},
		onClickCell:function(){
		}
	});	
}
function Load_dg_DataGrid(){
	INSUMIClearGrid('wdg');
	INSUMIClearGrid('edg');
	var queryParams = {}
	queryParams.TradeCode = "query^SelfServPy.Common.data_contrast_port_listCtl^DCPLC";
	//queryParams.ss_dic_type = 'HI_TYPE';
	queryParams.ReturnType = "JsonArray"
    loadDataGridStore('dg',queryParams);	
}
// 新增
function dg_addRow(){
	var SelectIndex = INSUMIGetEditRowIndexByID('dg');
	if(SelectIndex > -1){
		if (!$('#dg').datagrid('validateRow', SelectIndex)) {
			$.messager.popover({msg: '数据验证不通过', type: 'error'});
			return;
		}
		$('#dg').datagrid('endEdit',SelectIndex);
	}
	var lastRows = $('#dg').datagrid('getRows').length;
	$('#dg').datagrid('appendRow', {
			INFNO: '',
			INFNAME: '',
			Timeout: '',
			HISVER: '',
			URL: '',
			TYPE: '',
			SIGNTYPE: '',
			EFFTFLAG: '',
			AutoUp : '',
			SucUp : '',
			RecSYSCode : '',
			MDTRTTYPE : '',
			HOSPID : '' ,
			HITYPE : '',
			METHODNAME:'',
			OUTNODECODE:'',
			CLASSNAME:'',
			CONTENTTYPE:'',
			CHKFLAG: '',
			BUILDINPUT: ''
				
	});
	$('#dg').datagrid('beginEdit', lastRows);
	$('#dg').datagrid('scrollTo', lastRows);
	$('#dg').datagrid('selectRow', lastRows);
}

// 结束编辑
function dg_endEditRow(){
		
}
// 保存单行
function SaveSingle(){
	var dgSelect = $('#dg').datagrid('getSelected');
	if(!dgSelect){
		INSUMIAlert('请先选择要保存的数据' , 'error');
        return ;	
	}	
	var dgSelectIndex = $('#dg').datagrid('getRowIndex',dgSelect);
	
	var editor = $('#dg').datagrid('getEditor', {
      	index: dgSelectIndex,
      	field: 'INFNO'
	});
	if(!editor){
		INSUMIPOP('没有需要保存的数据' , 'error');
        return ;				
	}
	
	var dgSelectRowId = dgSelect.ROWID || '';
	var editorRow = {
			INFNO: INSUMIDataGrid.getCellVal('dg',dgSelectIndex,'INFNO'),
			INFNAME: INSUMIDataGrid.getCellVal('dg',dgSelectIndex,'INFNAME'),
			Timeout: INSUMIDataGrid.getCellVal('dg',dgSelectIndex,'Timeout'),
			HISVER: INSUMIDataGrid.getCellVal('dg',dgSelectIndex,'HISVER'),
			URL: INSUMIDataGrid.getCellVal('dg',dgSelectIndex,'URL'),
			TYPE: INSUMIDataGrid.getCellVal('dg',dgSelectIndex,'TYPE'),
			SIGNTYPE: INSUMIDataGrid.getCellVal('dg',dgSelectIndex,'SIGNTYPE'),
			EFFTFLAG: INSUMIDataGrid.getCellVal('dg',dgSelectIndex,'EFFTFLAG'),
			AutoUp : INSUMIDataGrid.getCellVal('dg',dgSelectIndex,'AutoUp'),
			SucUp : INSUMIDataGrid.getCellVal('dg',dgSelectIndex,'SucUp'),
			RecSYSCode : INSUMIDataGrid.getCellVal('dg',dgSelectIndex,'RecSYSCode'),
			MDTRTTYPE : INSUMIDataGrid.getCellVal('dg',dgSelectIndex,'MDTRTTYPE') ,
			HOSPID : INSUMIDataGrid.getCellVal('dg',dgSelectIndex,'HOSPID') ,
			HITYPE : INSUMIDataGrid.getCellVal('dg',dgSelectIndex,'HITYPE'),
			CLASSNAME: INSUMIDataGrid.getCellVal('dg',dgSelectIndex,'CLASSNAME'),
			METHODNAME: INSUMIDataGrid.getCellVal('dg',dgSelectIndex,'METHODNAME'),
			OUTNODECODE: INSUMIDataGrid.getCellVal('dg',dgSelectIndex,'OUTNODECODE'),
			CONTENTTYPE: INSUMIDataGrid.getCellVal('dg',dgSelectIndex,'CONTENTTYPE'),
			ROWID : dgSelectRowId,
			CHKFLAG: INSUMIDataGrid.getCellVal('dg',dgSelectIndex,'CHKFLAG'),
			BUILDINPUT: INSUMIDataGrid.getCellVal('dg',dgSelectIndex,'BUILDINPUT')
				
		}
	var InJson = JSON.stringify(editorRow);
	var rtn = $.m({ClassName: "INSU.MI.PortListCom", MethodName: "Save", InJson: InJson,SessionStr: session['LOGON.USERID']}, false);
	if (rtn.split('^')[0] == '0'){
		$('#dg').datagrid('updateRow',{
			index : dgSelectIndex,
			row: editorRow
		});
		INSUMIAlert('保存成功' , 'success');
		Load_dg_DataGrid();
	}else{
		INSUMIAlert('保存失败：'  + rtn , 'error');
	}
}
// 保存多行
function SaveMult(){
	var SelectIndex = INSUMIGetEditRowIndexByID('dg');
	if(SelectIndex > -1){
		$('#dg').datagrid('endEdit',SelectIndex);
	}
	if (!$('#dg').datagrid('validateRow', SelectIndex)) {
		$.messager.popover({msg: '数据验证不通过', type: 'error'});
		return;
	}
	var TotalNum = 0;
	var SuccessNum = 0;
	var ErrorNum = 0;
	var dgRows = $('#dg').datagrid('getChanges');
	for (var rowIndex = 0; rowIndex < dgRows.length; rowIndex++) {
		var dgRow = dgRows[rowIndex];
		if(dgRow){
			TotalNum++;
			var dgSelectRowId = dgRow.ROWID || '';
			var dgSelectIndex = $('#dg').datagrid('getRowIndex',dgRow);
			$('#dg').datagrid('beginEdit',dgSelectIndex);
			var editorRow = {
				INFNO: INSUMIDataGrid.getCellVal('dg',dgSelectIndex,'INFNO'),
				INFNAME: INSUMIDataGrid.getCellVal('dg',dgSelectIndex,'INFNAME'),
				Timeout: INSUMIDataGrid.getCellVal('dg',dgSelectIndex,'Timeout'),
				HISVER: INSUMIDataGrid.getCellVal('dg',dgSelectIndex,'HISVER'),
				URL: INSUMIDataGrid.getCellVal('dg',dgSelectIndex,'URL'),
				TYPE: INSUMIDataGrid.getCellVal('dg',dgSelectIndex,'TYPE'),
				SIGNTYPE: INSUMIDataGrid.getCellVal('dg',dgSelectIndex,'SIGNTYPE'),
				EFFTFLAG: INSUMIDataGrid.getCellVal('dg',dgSelectIndex,'EFFTFLAG'),
				AutoUp : INSUMIDataGrid.getCellVal('dg',dgSelectIndex,'AutoUp'),
				SucUp : INSUMIDataGrid.getCellVal('dg',dgSelectIndex,'SucUp'),
				RecSYSCode : INSUMIDataGrid.getCellVal('dg',dgSelectIndex,'RecSYSCode'),
				MDTRTTYPE : INSUMIDataGrid.getCellVal('dg',dgSelectIndex,'MDTRTTYPE') ,
				HOSPID : INSUMIDataGrid.getCellVal('dg',dgSelectIndex,'HOSPID') ,
				HITYPE : INSUMIDataGrid.getCellVal('dg',dgSelectIndex,'HITYPE'),
				CLASSNAME:INSUMIDataGrid.getCellVal('dg',dgSelectIndex,'CLASSNAME'),
				METHODNAME:INSUMIDataGrid.getCellVal('dg',dgSelectIndex,'METHODNAME'),
				OUTNODECODE:INSUMIDataGrid.getCellVal('dg',dgSelectIndex,'OUTNODECODE'),
				CONTENTTYPE: INSUMIDataGrid.getCellVal('dg',dgSelectIndex,'CONTENTTYPE'),
				CHKFLAG: INSUMIDataGrid.getCellVal('dg',dgSelectIndex,'CHKFLAG'),
				BUILDINPUT: INSUMIDataGrid.getCellVal('dg',dgSelectIndex,'BUILDINPUT'),
				ROWID : dgSelectRowId
			}
			$('#dg').datagrid('endEdit',dgSelectIndex);
			var InJson = JSON.stringify(editorRow);
			var rtn = $.m({ClassName: "INSU.MI.PortListCom", MethodName: "Save", InJson: InJson,SessionStr: session['LOGON.USERID']}, false);	
			if(rtn.split('^')[0] == '0'){
				SuccessNum++;
				editorRow.ROWID = rtn.split('^')[1];
				$('#dg').datagrid('updateRow',{
					index : dgSelectIndex,
					row: editorRow
				});
			}else{
				ErrorNum++;
			}			
		}
	}
	INSUMIAlert('本次共保存:' + TotalNum + '条，' + '成功:' + SuccessNum + '，失败：' + ErrorNum +'条');
	
}
// ---dg end
// 
function init_wdg() { 
	var Columns= [[   
		{field:'SEQ',title:'顺序号',width:50,align:'center',editor:{
				type: 'numberbox',
				options: {
					precision:0,
					min:0,
					required:true	
				}
			}},
		{field:'NODECODE',title:'节点代码',width:70,editor:{
				type: 'validatebox',
				options: {
					required:true	
				}
			}},
		{field:'NODENAME',title:'节点名称',width:100,editor:{
				type: 'text'
			}},
		{field:'NODETYPE',title:'节点类型',width:65,editor:{
				type: 'combobox',
				options: {
					defaultFilter: 4,
					valueField: 'cCode',
					textField: 'cDesc',
					url:$URL,
					mode:'remote',
					editable:false,
					onBeforeLoad:function(param){
				      	param.ClassName = 'INSU.COM.BaseData';
				      	param.QueryName = 'QueryDic1';
				      	param.Type = 'NODETYPE';
				      	param.HospDr = '';
				      	param.ResultSetType = 'array';
				      	return true;

					},
					onSelect: function (data) {
						
					}
				}
			}
			,formatter:function(value, data,index){
				var rtn = GLOBAL.NODETYPE[value];
				return rtn ;	
			}	
			},
		{field:'CLASSNAME',title:'类名',width:120,editor:{
				type: 'text'
			}},
		{field:'METHODNAME',title:'方法名',width:120,editor:{
				type: 'combogrid',
				options: {
					defaultFilter: 4,
					idField: 'METHODNAME',
					textField: 'METHODNAME',
					url:$URL,
					panelWidth:350,   
					mode:'remote',
					columns:[[   
						{field:'CLASSNAME',title:'类名',width:150},
						{field:'METHODNAME',title:'方法名',width:150},
						{field:'METHODTYP',title:'方法类型',width:80},
						{field:'METHODDESC',title:'方法描述',width:100},
						{field:'DEMO',title:'备注',width:150},
						{field:'EFFTFLAG',title:'生效标志',width:120},
						{field:'MULTSPLIT',title:'出参多行分隔符',width:100},
						{field:'DATASPLIT',title:'数据分割符',width:100},
						{field:'OUTPUTTYPE',title:'返回值类型',width:120},
						{field:'ROWID',title:'ROWID',width:120,hidden:true}
				    ]],
					onBeforeLoad:function(param){
				      	param.ClassName = 'INSU.MI.ClassMethodCom';
				      	param.QueryName = 'QueryClassMethod';
				      	//param.ParamInput = '|' + param.q;
				      	return true;
					},
					onSelect: function (index,data) {
						selectClassMethod(data);
					}
				}
			}},
		{field:'METHODTYPE',title:'方法类型',width:65,editor:{
				type: 'combobox',
				options: {
					defaultFilter: 4,
					valueField: 'cCode',
					textField: 'cDesc',
					url:$URL,
					mode:'remote',
					onBeforeLoad:function(param){
				      	param.ClassName = 'INSU.COM.BaseData';
				      	param.QueryName = 'QueryDic1';
				      	param.Type = 'METHODTYPE';
				      	param.HospDr = '';
				      	param.ResultSetType = 'array';
				      	return true;

					},
					onSelect: function (data) {
						
					}
				}
			}
			,formatter:function(value, data,index){
				var rtn = GLOBAL.METHODTYPE[value];
				return rtn ;	
			}	
			},
		{field:'CONFLAG',title:'对照标志',width:70,editor:{
				type: 'combobox',
				options: {
					defaultFilter: 4,
					valueField: 'cCode',
					textField: 'cDesc',
					url:$URL,
					mode:'remote',
					onBeforeLoad:function(param){
				      	param.ClassName = 'INSU.COM.BaseData';
				      	param.QueryName = 'QueryDic1';
				      	param.Type = 'CONFLAG';
				      	param.HospDr = '';
				      	param.ResultSetType = 'array';
				      	return true;

					},
					onSelect: function (data) {
						
					}
				}
			}
			,formatter:function(value, data,index){
				var rtn = GLOBAL.CONFLAG[value];
				return rtn ;	
			
			}},	
		{field:'EFFTFLAG',title:'生效标志',width:70,editor:{
				type: 'combobox',
				options: {
					defaultFilter: 4,
					valueField: 'cCode',
					textField: 'cDesc',
					url:$URL,
					mode:'remote',
					onBeforeLoad:function(param){
				      	param.ClassName = 'INSU.COM.BaseData';
				      	param.QueryName = 'QueryDic1';
				      	param.Type = 'EFFTFLAG';
				      	param.HospDr = '';
				      	param.ResultSetType = 'array';
				      	return true;

					},
					onSelect: function (data) {
						
					}
				}
		},formatter:function(value, data,index){
				var rtn = GLOBAL.EFFTFLAG[value] || value;
				return rtn ;	
			}},
		{field:'MultRow',title:'多行分隔符',width:80,editor:{
				type: 'text'
			}},
		{field:'SUBFLAG',title:'子节点标志',width:80,editor:{
				type: 'combobox',
				options: {
					valueField: 'cCode',
					textField: 'cDesc',
					url:$URL,
					editable:false,
					mode:'remote',
					onBeforeLoad:function(param){
				      	param.ClassName = 'INSU.COM.BaseData';
				      	param.QueryName = 'QueryDic1';
				      	param.Type = 'CODEFLAG';
				      	param.HospDr = '';
				      	param.ResultSetType = 'array';
				      	return true;
					},
					onSelect: function (data) {
						
					}
			}
			},formatter:function(value, data,index){
				var rtn = GLOBAL.CODEFLAG[value] || value;
				return rtn ;	
			}},
		{field:'ClassMethodArgs',title:'ClassMethodArgs',width:10,hidden:true}, // 隐藏元素   供数据源对照使用
		{field:'ROWID',title:'ROWID',width:60,hidden:true}
		
	]]
	$('#wdg').datagrid({  
		border: false,
		striped:true,
		singleSelect: true,
		fit:true,
		columns:Columns,
		toolbar:'#wdgTB',
		onSelect : function(rowIndex, rowData) {
			Load_edg_DataGrid();		
		},
		onLoadSuccess:function(data){
			Global.wdgSeq = [];
			var dataRowsLen = data.rows.length;
			if(dataRowsLen > 0){
				for (var tmpIndex=0;tmpIndex < dataRowsLen;tmpIndex++){
					var seq = data.rows[tmpIndex].SEQ;
					Global.wdgSeq.push(seq);
				}	
			}
		},
		onDblClickRow:function(index,row){
			WestBeginEdit(index,row);			
		},onBeginEdit:function(){
			focusEditRow('wdg');		
		}	

	}); 
}
function Load_wdg_DataGrid(){
	INSUMIClearGrid('edg');
	var dgSelect = $('#dg').datagrid('getSelected');
	if(!dgSelect){
		$.messager.alert('提示', '请先选择接口','error');
        return ;	
	}
	if(dgSelect.ROWID==""){
		return;
	}
	//alert(dgSelect.ROWID)
	/*
	var queryParams = {
	    ClassName : Global.PortNode.ClassName,
	    QueryName : 'QueryPortNode',
	    PortId : dgSelect.ROWID,
	    ParamPARNODETYPE : $('#btnPARNODETYPE').attr('data')
	}
	*/	
    //loadDataGridStore('wdg',queryParams);
    //改为直接异步调用 20210318
	$cm({
		ClassName:Global.PortNode.ClassName,
		QueryName:'QueryPortNode',
		PortId : dgSelect.ROWID,
		ParamPARNODETYPE : $('#btnPARNODETYPE').attr('data')
	},function(jsonData){
		$('#wdg').datagrid('loadData',jsonData);
	});
}
// 新增
function wdg_addRow(){
	var dgSelect = $('#dg').datagrid('getSelected');
	if(!dgSelect){
		INSUMIAlert('请先选择接口' , 'error');
        return ;	
	}
	var SelectIndex = INSUMIGetEditRowIndexByID('wdg');
	if(SelectIndex > -1 ){
		if (!$('#wdg').datagrid('validateRow', SelectIndex)) {
			$.messager.popover({msg: '数据验证不通过', type: 'error'});
			return;
		}
		$('#wdg').datagrid('endEdit', SelectIndex);
	}
	var Lastrows = $('#wdg').datagrid('getRows').length;
	var nextSeq = GetWDGNextSeq();
	
	$('#wdg').datagrid('appendRow',{
			NODECODE: '',
			NODENAME: '',
			NODETYPE: '',
			CLASSNAME : '',
			METHODNAME : '',
			METHODTYPE : '',
			CONFLAG : '' ,
			SUBFLAG : '' ,
			EFFTFLAG : '' ,
			SEQ : nextSeq 
	});
	$('#wdg').datagrid('beginEdit', Lastrows);	
	$('#wdg').datagrid('selectRow', Lastrows);		
}
function GetWDGNextSeq(){
	Global.wdgSeq = Global.wdgSeq.sort(sortNumber)
	var rtn = 1;
	if(Global.wdgSeq.length == 0){
		Global.wdgSeq.push(rtn.toString());	
	}else{
		for (key in Global.wdgSeq){
			var nextSeq = +Global.wdgSeq[key] + 1;
			if(Global.wdgSeq.indexOf(nextSeq.toString(),0) == -1) {
				Global.wdgSeq.push(nextSeq.toString());
				rtn = nextSeq;
				break;	
			}
		}
	}
	function sortNumber(a, b) {
					return a - b
				}
				
	return rtn;		
}
function GetEDGNextSeq(){
	Global.edgSeq = Global.edgSeq.sort(sortNumber)
	var rtn = 1;
	if(Global.edgSeq.length == 0){
		Global.edgSeq.push(rtn.toString());	
	}else{
		for (key in Global.edgSeq){
			var nextSeq = +Global.edgSeq[key] + 1;
			if(Global.edgSeq.indexOf(nextSeq.toString(),0) == -1) {
				Global.edgSeq.push(nextSeq.toString());
				rtn = nextSeq;
				break;	
			}
		}
	}
	function sortNumber(a, b) {
					return a - b
				}
				
	return rtn;		
}
// 结束编辑
function wdg_endEditRow(){
		
}
// 保存单行
function wdg_SaveSingle(){
	var dgSelect = $('#dg').datagrid('getSelected');
	if(!dgSelect){
		INSUMIAlert('请先选择接口' , 'error');
        return ;	
	}
	var wdgSelect = $('#wdg').datagrid('getSelected');	
	var wdgSelectIndex = $('#wdg').datagrid('getRowIndex',wdgSelect);
	
	var wdgSelectRowId = wdgSelect.ROWID || '';
	var editorRow = {
			NODECODE: INSUMIDataGrid.getCellVal('wdg',wdgSelectIndex,'NODECODE'),
			NODENAME: INSUMIDataGrid.getCellVal('wdg',wdgSelectIndex,'NODENAME'),
			NODETYPE: INSUMIDataGrid.getCellVal('wdg',wdgSelectIndex,'NODETYPE'),
			CLASSNAME: INSUMIDataGrid.getCellVal('wdg',wdgSelectIndex,'CLASSNAME'),
			METHODNAME: INSUMIDataGrid.getCellVal('wdg',wdgSelectIndex,'METHODNAME'),
			METHODTYPE: INSUMIDataGrid.getCellVal('wdg',wdgSelectIndex,'METHODTYPE'),
			CONFLAG: INSUMIDataGrid.getCellVal('wdg',wdgSelectIndex,'CONFLAG'),
			SUBFLAG: INSUMIDataGrid.getCellVal('wdg',wdgSelectIndex,'SUBFLAG'),
			SEQ: INSUMIDataGrid.getCellVal('wdg',wdgSelectIndex,'SEQ'), 
			EFFTFLAG: INSUMIDataGrid.getCellVal('wdg',wdgSelectIndex,'EFFTFLAG'), 
			PARID:dgSelect.ROWID,
			ROWID : wdgSelect.ROWID,
			PARNODETYPE:$('#btnPARNODETYPE').attr('data')
		}

	var InJson = JSON.stringify(editorRow);
	var rtn = $.m({ClassName: "INSU.MI.PortNodeCom", MethodName: "Save", InJson: InJson,SessionStr: session['LOGON.USERID']}, false);
	if (rtn.split('^')[0] == '0'){
		$('#wdg').datagrid('updateRow',{
			index : wdgSelectIndex,
			row: editorRow
		});
		INSUMIPOP('保存成功' , 'success');
		Load_wdg_DataGrid();
	}else{
		INSUMIPOP('保存失败：'  + rtn , 'error');
	}
}
function wdg_SaveMultRow(){
	var dgSelect = $('#dg').datagrid('getSelected');
	if(!dgSelect){
		INSUMIAlert('请先选择接口' , 'error');
        return ;	
	}
	var SelectIndex = INSUMIGetEditRowIndexByID('wdg');
	if(SelectIndex > -1){
		$('#wdg').datagrid('endEdit',SelectIndex);
	}
	if (!$('#wdg').datagrid('validateRow', SelectIndex)) {
			$.messager.popover({msg: '数据验证不通过', type: 'error'});
			return;
		}
	var TotalNum = 0;
	var SuccessNum = 0;
	var ErrorNum = 0;
	var dgRows = $('#wdg').datagrid('getChanges');
	for (var rowIndex = 0; rowIndex < dgRows.length; rowIndex++) {
		var dgRow = dgRows[rowIndex];
		if(dgRow){
			TotalNum++;
			var dgSelectRowId = dgRow.ROWID || '';
			var wdgSelectIndex = $('#wdg').datagrid('getRowIndex',dgRow);
			$('#wdg').datagrid('beginEdit',wdgSelectIndex); // For Get Editor value
			var editorRow = {
				NODECODE: INSUMIDataGrid.getCellVal('wdg',wdgSelectIndex,'NODECODE'),
				NODENAME: INSUMIDataGrid.getCellVal('wdg',wdgSelectIndex,'NODENAME'),
				NODETYPE: INSUMIDataGrid.getCellVal('wdg',wdgSelectIndex,'NODETYPE'),
				CLASSNAME: INSUMIDataGrid.getCellVal('wdg',wdgSelectIndex,'CLASSNAME'),
				METHODNAME: INSUMIDataGrid.getCellVal('wdg',wdgSelectIndex,'METHODNAME'),
				METHODTYPE: INSUMIDataGrid.getCellVal('wdg',wdgSelectIndex,'METHODTYPE'),
				CONFLAG: INSUMIDataGrid.getCellVal('wdg',wdgSelectIndex,'CONFLAG'),
				SUBFLAG: INSUMIDataGrid.getCellVal('wdg',wdgSelectIndex,'SUBFLAG'),
				SEQ: INSUMIDataGrid.getCellVal('wdg',wdgSelectIndex,'SEQ'), 
				EFFTFLAG: INSUMIDataGrid.getCellVal('wdg',wdgSelectIndex,'EFFTFLAG'), 
				PARID:dgSelect.ROWID,
				ROWID : dgSelectRowId,
				PARNODETYPE:$('#btnPARNODETYPE').attr('data')
			}
			$('#wdg').datagrid('endEdit',wdgSelectIndex); // For Get Editor value
			var InJson = JSON.stringify(editorRow);
			var rtn = $.m({ClassName: "INSU.MI.PortNodeCom", MethodName: "Save", InJson: InJson,SessionStr: session['LOGON.USERID']}, false);
			if(rtn.split('^')[0] == '0'){
				SuccessNum++;
				editorRow.ROWID = rtn.split('^')[1];
				$('#wdg').datagrid('updateRow',{
					index : wdgSelectIndex,
					row: editorRow
				});
			}else{
				ErrorNum++;
			}			
		}
	}
	INSUMIAlert('本次共保存:' + TotalNum + '条，' + '成功:' + SuccessNum + '，失败：' + ErrorNum +'条');	
	
}
function init_edg() { 
	var colums = [[
		{field:'SEQ',title:'顺序号',width:50,align:'center',editor:{
				type: 'numberbox',
				options: {
					precision:0,
					min:0,
					required:true	
				}
			}},
		{field:'ARGCODE',title:'参数代码',width:100,align:'center',editor:{
				type: 'validatebox',
				options: {
					required:true	
				}
			}},
		{field:'ARGNAME',title:'参数名称',width:100,align:'center',editor:{
				type: 'validatebox',
				options: {
					required:true	
				}
			}},
		{field:'ARGTYPE',title:'参数类型',width:100,align:'center',editor:{
				type: 'combobox',
				options: {
					defaultFilter: 4,
					valueField: 'cCode',
					textField: 'cDesc',
					editable:false,
					url:$URL,
					mode:'remote',
					required:true,
					onBeforeLoad:function(param){
				      	param.ClassName = 'INSU.COM.BaseData';
				      	param.QueryName = 'QueryDic1';
				      	param.Type = 'ARGTYPE';
				      	param.HospDr = '';
				      	param.ResultSetType = 'array';
				      	return true;

					},
					onSelect: function (data) {
						
					}
				}
			},formatter:function(value, data,index){
				var rtn = GLOBAL.ARGTYPE[value] || value;
				return rtn;	
			}},
		{field:'CONTYPE',title:'对照类型',width:100,align:'center',editor:{
				type: 'combobox',
				options: {
					defaultFilter: 4,
					valueField: 'cCode',
					textField: 'cDesc',
					url:$URL,
					editable:false,
					mode:'remote',
					onBeforeLoad:function(param){
				      	param.ClassName = 'INSU.COM.BaseData';
				      	param.QueryName = 'QueryDic1';
				      	param.Type = 'CONTYPE';
				      	param.HospDr = '';
				      	param.ResultSetType = 'array';
				      	return true;

					},
					onSelect: function (data) {
						
					}
				}
			},formatter:function(value, data,index){
				var rtn = GLOBAL.CONTYPE[value] || value;
				return rtn ;	
			}				
		},
		{field:'CONINFO',title:'数据源代码',width:94,align:'center',editor:{
				type: 'combobox',
				options: {
					defaultFilter: 4,
					valueField: 'ARGCODE',
					textField: 'ARGNAME',
					url:$URL,
					mode:'remote',
					onBeforeLoad:function(param){
						var selectWdg = $('#wdg').datagrid('getSelected');
						if(!selectWdg){
							return true;
						}
				      	param.ClassName = 'INSU.MI.ClassMethodArgsCom';
				      	param.QueryName = 'QueryClassMethodArgsByClassMethod';
				      	param.InputStr = selectWdg.CLASSNAME + "|" + selectWdg.METHODNAME ;
				      	param.ResultSetType = 'array';
				      	return true;
					},
					onLoadError:function(err){
						alert(err.responseText)
					},onLoadSuccess:function(data){
							
					}
				}
			}},
		{field:'CONINFODESC',title:'数据源名称',width:94,align:'center',editor:{
				type: 'text'
			}},	
		{field:'CONINFOSOURCE',title:'数据源来源',width:94,align:'center',editor:{
				type: 'text'
			}},	
		{field:'CONINFODEMO',title:'数据源描述',width:94,align:'center',editor:{
				type: 'text'
			}},
		{field:'DEFVALUE',title:'默认值',width:94,align:'center',editor:{
				type: 'text'
			}},
		{field:'LOCALPARCODE',title:'本地参数代码',width:124,editor:{
				type: 'text'
			}},
		{field:'EFFTFLAG',title:'生效标志',width:94,align:'center',editor:{
				type: 'combobox',
				options: {
					defaultFilter: 4,
					valueField: 'cCode',
					textField: 'cDesc',
					url:$URL,
					mode:'remote',
					editable:false,
					onBeforeLoad:function(param){
				      	param.ClassName = 'INSU.COM.BaseData';
				      	param.QueryName = 'QueryDic1';
				      	param.Type = 'EFFTFLAG';
				      	param.HospDr = '';
				      	param.ResultSetType = 'array';
				      	return true;

					},
					onSelect: function (data) {
						
					}
				}
			},formatter:function(value, data,index){
				var rtn = GLOBAL.EFFTFLAG[value] || value;
				return rtn ;	
			}},
		{field:'MUSTLFLAG',title:'必填标志',width:60,align:'center',editor:{
				type: 'combobox',
				options: {
					defaultFilter: 4,
					valueField: 'cCode',
					textField: 'cDesc',
					url:$URL,
					editable:false,
					mode:'remote',
					onBeforeLoad:function(param){
				      	param.ClassName = 'INSU.COM.BaseData';
				      	param.QueryName = 'QueryDic1';
				      	param.Type = 'MUSTFLAG';
				      	param.HospDr = '';
				      	param.ResultSetType = 'array';
				      	return true;

					},
					onSelect: function (data) {
						
					}
			}
			},formatter:function(value, data,index){
				var rtn = GLOBAL.MUSTFLAG[value] || value;
				return rtn ;	
			}},
		{field:'CODEFLAG',title:'代码标识',width:80,align:'center',editor:{
				type: 'combobox',
				options: {
					valueField: 'cCode',
					textField: 'cDesc',
					url:$URL,
					editable:false,
					mode:'remote',
					onBeforeLoad:function(param){
				      	param.ClassName = 'INSU.COM.BaseData';
				      	param.QueryName = 'QueryDic1';
				      	param.Type = 'CODEFLAG';
				      	param.HospDr = '';
				      	param.ResultSetType = 'array';
				      	return true;
					},
					onSelect: function (data) {
						
					}
			}
			},formatter:function(value, data,index){
				var rtn = GLOBAL.CODEFLAG[value] || value;
				return rtn ;	
			}},
		{field:'DICCODE',title:'代码字典',width:80,align:'center',editor:{
			type: 'text'
		}
		},
		{field:'MAXLENG',title:'最大长度',width:50,align:'center',editor:{
				type: 'text'
			}},
		{field:'SUBNODE',title:'子节点代码',width:48,align:'center',editor:{
				type: 'text'
			}},
		{field:'SUBNAME',title:'子节点名称',width:100,align:'center',editor:{
				type: 'text'
			}},
		{field:'ROWID',title:'ROWID',width:48,align:'center',hidden:true}
	]];
	//		pagination:true,
	$HUI.datagrid('#edg',{
		border: false,
		fit:true,
		singleSelect: true,
		data: [],
		toolbar:'#edgTB',
		columns:colums,
		onLoadSuccess:function(data){
			Global.edgSeq = [];
			var dataRowsLen = data.rows.length;
			if(dataRowsLen > 0){
				for (var tmpIndex=0;tmpIndex < dataRowsLen;tmpIndex++){
					var seq = data.rows[tmpIndex].SEQ;
					Global.edgSeq.push(seq);
				}	
			}
		},
		onDblClickRow:function(index,row){
			EastBeginEdit(index,row);
		},
		onSelect:function(rowIndex, rowData){
			
		},
		onUnselect:function(rowIndex, rowData){
			
		},onBeginEdit:function(){
			focusEditRow('edg');		
		}
	});
}
function Load_edg_DataGrid(){
	var wdgSelect = $('#wdg').datagrid('getSelected');
	if(!wdgSelect){
		$.messager.alert('提示', '请先选择内容节点','error');
        return ;	
	}
	var ROWID = wdgSelect.ROWID
	/*var queryParams = {
	    ClassName : Global.PortConfig.ClassName,
	    QueryName : 'QueryPortInArgs',
	    PortNodeId : ROWID
	}	
    loadDataGridStore('edg',queryParams);*/	
    //改为直接异步调用 20210318
    //return;
	$cm({
		ClassName:Global.PortConfig.ClassName,
		QueryName: 'QueryPortInArgs',
		PortNodeId : ROWID,
		edgKeyInput: getValueById('edgKeyInput'),
		page:1,    //可选项，页码，默认1
		rows:1000    //可选项，获取多少条数据，默认50
	},function(jsonData){
		$('#edg').datagrid('loadData',jsonData);
	});


}
// 新增
function edg_addRow(){
	var dgSelect = $('#wdg').datagrid('getSelected');
	if(!dgSelect){
		INSUMIAlert('请先选择内容节点' , 'error');
        return ;	
	}
	if(dgSelect.ROWID == ""){
		INSUMIAlert('请先选择内容节点' , 'error');
        return;		
	}
	//var editor = $('#dg').datagrid('getEditor');
	var SelectIndex = INSUMIGetEditRowIndexByID('edg');
	if(SelectIndex > -1 ){
		if (!$('#edg').datagrid('validateRow', SelectIndex)) {
			$.messager.popover({msg: '数据验证不通过', type: 'error'});
			return;
		}
       $('#edg').datagrid('endEdit', SelectIndex);		
	}
	var rows = $('#edg').datagrid('getRows');
	var lastRows = rows.length;
	var nextSeq = GetEDGNextSeq();
	$('#edg').datagrid('appendRow',{
			ARGCODE: '',
			ARGNAME: '',
			CONTYPE: '',
			CONINFO : '',
			ARGTYPE : '',
			MUSTLFLAG : '',
			MAXLENG : '' ,
			SUBNODE : '' ,
			SUBNAME : '' ,
			CONINFODESC :'',
			SEQ : nextSeq ,
			CONINFOSOURCE : '' ,
			CONINFODEMO : '' ,
			EFFTFLAG :'',
			DEFVALUE :'',
			DICCODE:'',
			LOCALPARCODE: ''
	});
	$('#edg').datagrid('beginEdit', lastRows);	
	$('#edg').datagrid('scrollTo',lastRows);
	$('#edg').datagrid('selectRow', lastRows);
}
// 结束编辑
function edg_endEditRow(){
		
}
// 保存单行
function edg_SaveSingleOld(){
	var dgSelect = $('#wdg').datagrid('getSelected');
	if(!dgSelect){
		INSUMIAlert('请先选择内容节点' , 'error');
        return ;	
	}
	var wdgSelect = $('#edg').datagrid('getSelected');	
	if(!wdgSelect){
		INSUMIPOP('请选择要保存的行' , 'error');
		return;	
	}
	var wdgSelectIndex = $('#edg').datagrid('getRowIndex',wdgSelect);
	
	var wdgSelectRowId = wdgSelect.ROWID || '';
	var editorRow = {
			ARGCODE: INSUMIDataGrid.getCellVal('edg',wdgSelectIndex,'ARGCODE'),
			ARGNAME: INSUMIDataGrid.getCellVal('edg',wdgSelectIndex,'ARGNAME'),
			CONTYPE: INSUMIDataGrid.getCellVal('edg',wdgSelectIndex,'CONTYPE'),
			CONINFO : INSUMIDataGrid.getCellVal('edg',wdgSelectIndex,'CONINFO'),
			ARGTYPE : INSUMIDataGrid.getCellVal('edg',wdgSelectIndex,'ARGTYPE'),
			MUSTLFLAG : INSUMIDataGrid.getCellVal('edg',wdgSelectIndex,'MUSTLFLAG'),
			MAXLENG : INSUMIDataGrid.getCellVal('edg',wdgSelectIndex,'MAXLENG') ,
			SUBNODE : INSUMIDataGrid.getCellVal('edg',wdgSelectIndex,'SUBNODE') ,
			SUBNAME : INSUMIDataGrid.getCellVal('edg',wdgSelectIndex,'SUBNAME') ,
			SEQ : INSUMIDataGrid.getCellVal('edg',wdgSelectIndex,'SEQ'),
			CONINFODESC : INSUMIDataGrid.getCellVal('edg',wdgSelectIndex,'CONINFODESC'),
			PARID:dgSelect.ROWID,
			CONINFOSOURCE : INSUMIDataGrid.getCellVal('edg',wdgSelectIndex,'CONINFOSOURCE') ,
			CONINFODEMO : INSUMIDataGrid.getCellVal('edg',wdgSelectIndex,'CONINFODEMO') ,
			EFFTFLAG :INSUMIDataGrid.getCellVal('edg',wdgSelectIndex,'EFFTFLAG'),
			DEFVALUE :INSUMIDataGrid.getCellVal('edg',wdgSelectIndex,'DEFVALUE'),
			DICCODE :INSUMIDataGrid.getCellVal('edg',wdgSelectIndex,'DICCODE'),
			LOCALPARCODE :INSUMIDataGrid.getCellVal('edg',wdgSelectIndex,'LOCALPARCODE'),
			ROWID : wdgSelectRowId
		}
	var InJson = JSON.stringify(editorRow);
	 // ##class(INSU.MI.PortListCom).Save(InJson)
	var rtn = $.m({ClassName: "INSU.MI.PortInArgsCom", MethodName: "Save", InJson: InJson,SessionStr: session['LOGON.USERID']}, false);
	if (rtn.split('^')[0] == 0){
		$('#edg').datagrid('updateRow',{
			index : wdgSelectIndex,
			row: editorRow
		});
		INSUMIPOP('保存成功' , 'success');
	}else{
		INSUMIPOP('保存失败：'  + rtn , 'error');
	}
}

// 保存多行
function edg_SaveSingle(){
	var dgSelect = $('#wdg').datagrid('getSelected');
	if(!dgSelect){
		INSUMIAlert('请先选择内容节点' , 'error');
        return ;	
	}
	var lastEdit = INSUMIGetEditRowIndexByID('edg');
	if (lastEdit > -1){
		if (!$('#edg').datagrid('validateRow', lastEdit)) {
			$.messager.popover({msg: '数据验证不通过', type: 'error'});
			return;
		}
		$('#edg').datagrid('endEdit',lastEdit);
	}
	
	var TotalNum = 0;
	var SuccessNum = 0;
	var ErrorNum = 0;
	var dgRows = $('#edg').datagrid('getChanges');
	for (var rowIndex = 0; rowIndex < dgRows.length; rowIndex++) {
		var dgRow = dgRows[rowIndex];
		if(dgRow){
			TotalNum++;
			var dgSelectRowId = dgRow.ROWID || '';
			var wdgSelectIndex = $('#edg').datagrid('getRowIndex',dgRow);
			$('#edg').datagrid('beginEdit',wdgSelectIndex); // For Get Editor value
			var editorRow = {
				ARGCODE: INSUMIDataGrid.getCellVal('edg',wdgSelectIndex,'ARGCODE'),
				ARGNAME: INSUMIDataGrid.getCellVal('edg',wdgSelectIndex,'ARGNAME'),
				CONTYPE: INSUMIDataGrid.getCellVal('edg',wdgSelectIndex,'CONTYPE'),
				CONINFO : INSUMIDataGrid.getCellVal('edg',wdgSelectIndex,'CONINFO'),
				ARGTYPE : INSUMIDataGrid.getCellVal('edg',wdgSelectIndex,'ARGTYPE'),
				MUSTLFLAG : INSUMIDataGrid.getCellVal('edg',wdgSelectIndex,'MUSTLFLAG'),
				MAXLENG : INSUMIDataGrid.getCellVal('edg',wdgSelectIndex,'MAXLENG') ,
				SUBNODE : INSUMIDataGrid.getCellVal('edg',wdgSelectIndex,'SUBNODE') ,
				SUBNAME : INSUMIDataGrid.getCellVal('edg',wdgSelectIndex,'SUBNAME') ,
				SEQ : INSUMIDataGrid.getCellVal('edg',wdgSelectIndex,'SEQ'),
				CONINFODESC : INSUMIDataGrid.getCellVal('edg',wdgSelectIndex,'CONINFODESC'),
				CODEFLAG : INSUMIDataGrid.getCellVal('edg',wdgSelectIndex,'CODEFLAG'),
				PARID:dgSelect.ROWID,
				CONINFOSOURCE : INSUMIDataGrid.getCellVal('edg',wdgSelectIndex,'CONINFOSOURCE') ,
				CONINFODEMO : INSUMIDataGrid.getCellVal('edg',wdgSelectIndex,'CONINFODEMO') ,
				EFFTFLAG :INSUMIDataGrid.getCellVal('edg',wdgSelectIndex,'EFFTFLAG'),
				DEFVALUE :INSUMIDataGrid.getCellVal('edg',wdgSelectIndex,'DEFVALUE'),
				DICCODE :INSUMIDataGrid.getCellVal('edg',wdgSelectIndex,'DICCODE'),
				LOCALPARCODE :INSUMIDataGrid.getCellVal('edg',wdgSelectIndex,'LOCALPARCODE'),
				ROWID : dgSelectRowId
			}
			editorRow['CONTYPE'] = editorRow['CONTYPE'].replace('PARAM',"APARAMA");
			$('#edg').datagrid('endEdit',wdgSelectIndex); // For Get Editor value
			if(editorRow['DICCODE'] == "" && editorRow['CODEFLAG'] == "Y"){
				editorRow['DICCODE'] = editorRow['ARGCODE'] + "Con00A";	
			}
			var InJson = JSON.stringify(editorRow);
			var rtn = $.m({ClassName: "INSU.MI.PortInArgsCom", MethodName: "Save", InJson: InJson,SessionStr: session['LOGON.USERID']}, false);	
			if(rtn.split('^')[0] == 0) {
				SuccessNum++;
				editorRow.ROWID = rtn.split('^')[1];
				if(editorRow['CONTYPE']=="APARAMA") editorRow['CONTYPE']="PARAM";
				$('#edg').datagrid('updateRow', {
					index : wdgSelectIndex,
					row: editorRow
				});
			}else{
				ErrorNum++;
			}
		}
	}
	$('#edg').datagrid('acceptChanges');
	INSUMIAlert('本次共保存:' + TotalNum + '条，' + '成功:' + SuccessNum + '，失败：' + ErrorNum +'条');
	//Load_edg_DataGrid();
	
}
function ClearGrid(gridid){
	$('#' + gridid).datagrid('loadData',{total:0,rows:[]});
}

//
//
function init_insuType(){
   /* var input = {};
	input['TradeCode'] = "query^SelfServPy.Common.ss_dicdataCtl^DDC";
	input['ss_dic_type'] = 'HI_TYPE'
    var p = ajaxPromise(input,"DoMethod");
	p.then((data)=>{
		alert(data.output);
	});*/
	// 医保类型
	$('#InsuType').combogrid({  
	    panelWidth:350,   
	    panelHeight:238,  
	    idField:'ss_dic_code',   
	    textField:'ss_dic_desc', 
      	rownumbers:false,
      	fit: true,
      	pagination: false,
      	url: $URL,
      	onBeforeLoad:function(param){
	      	param.TradeCode = "query^SelfServPy.Common.ss_dicdataCtl^DDC";
			param.ss_dic_type = 'HI_TYPE';
			param.ReturnType = "ArraySet"
			return true;
	    },
	    columns:[[   
	        {field:'ss_dic_code',title:'医保代码',width:60},  
	        {field:'ss_dic_desc',title:'医保描述',width:100}
	    ]],
	    fitColumns: true,
	    onLoadSuccess:function(data){
		    if(data.rows.length > 0){
				
		    }
		},onLoadError:function(err){
			alert(err)
		},
		onSelect:function(index,data){

		}
	}); 
	/*
	$('#PortCom-HITYPE').combogrid({  
	    panelWidth:350,   
	    panelHeight:238,  
	    idField:'cCode',   
	    textField:'cDesc', 
      	rownumbers:false,
      	fit: true,
      	pagination: false,
      	editable:false,
      	url:$URL,
      	onBeforeLoad:function(param){
	      	param.ClassName = 'web.INSUDicDataCom';
	      	param.QueryName = 'QueryDic1';
	      	param.Type = 'DLLType';
	      	param.HospDr = $('#PortCom-HOSPID').combobox('getValue');
	     },
	    columns:[[   
	        {field:'cCode',title:'医保代码',width:60},  
	        {field:'cDesc',title:'医保描述',width:100}
	    ]],
	    fitColumns: true,
	    onLoadSuccess:function(data){
		    if(data.rows.length > 0){
				$('#PortCom-HITYPE').combogrid('grid').datagrid('selectRow',0);
		    }
		}
	});	
	
	$('#PortRoot-HITYPE').combogrid({  
	    panelWidth:350,   
	    panelHeight:238,  
	    idField:'cCode',   
	    textField:'cDesc', 
      	rownumbers:false,
      	fit: true,
      	pagination: false,
      	editable:false,
      	url:$URL,
      	onBeforeLoad:function(param){
	      	param.ClassName = 'web.INSUDicDataCom';
	      	param.QueryName = 'QueryDic1';
	      	param.Type = 'DLLType';
	      	param.HospDr = $('#PortRoot-HOSPID').combobox('getValue');
	     },
	    columns:[[   
	        {field:'cCode',title:'医保代码',width:60},  
	        {field:'cDesc',title:'医保描述',width:100}
	    ]],
	    fitColumns: true,
	    onLoadSuccess:function(data){
		    if(data.rows.length > 0){
				$('#PortRoot-HITYPE').combogrid('grid').datagrid('selectRow',0);
		    }
		}
	});	*/
}
//
function init_hosp(){
	$('#Hospital').combogrid({  
	    panelWidth:350,   
	    panelHeight:238,  
	    idField:'Rowid',   
	    textField:'Desc', 
      	rownumbers:false,
      	fit: true,
      	pagination: false,
      	editable:false,
      	url:$URL,
      	onBeforeLoad:function(param){
	      	param.ClassName = Global.Com.ClassName;
	      	param.QueryName = 'QueryHospInfo';
	      	return true;
	     },
	    columns:[[   
	        {field:'Rowid',title:'数据ID',width:60},  
	        {field:'Desc',title:'描述',width:100}
	    ]],
	    fitColumns: true,
	    onSelect:function(index,data){
		    $('#InsuType').combobox('clear');
		    $('#InsuType').combogrid('grid').datagrid('reload');
		},
	    onLoadSuccess:function(data){
		    if(data.rows.length > 0){
				$('#Hospital').combogrid('grid').datagrid('selectRow',0);
		    }
		}
	}); 
	
	/*$('#PortCom-HOSPID').combogrid({  
	    panelWidth:350,   
	    panelHeight:238,  
	    idField:'Rowid',   
	    textField:'Desc', 
      	rownumbers:false,
      	fit: true,
      	pagination: false,
      	editable:false,
      	url:$URL,
      	onBeforeLoad:function(param){
	      	param.ClassName = Global.Com.ClassName;
	      	param.QueryName = 'QueryHospInfo';
	      	return true;
	     },
	    columns:[[   
	        {field:'Rowid',title:'数据ID',width:60},  
	        {field:'Desc',title:'描述',width:100}
	    ]],
	    fitColumns: true,
	    onSelect:function(){
		    $('#PortCom-HITYPE').combobox('clear');
		    $('#PortCom-HITYPE').combogrid('grid').datagrid('reload');
		},
	    onLoadSuccess:function(data){
		    
		}
	}); 
	
	$('#PortRoot-HOSPID').combogrid({  
	    panelWidth:350,   
	    panelHeight:238,  
	    idField:'Rowid',   
	    textField:'Desc', 
      	rownumbers:false,
      	fit: true,
      	pagination: false,
      	editable:false,
      	url:$URL,
      	onBeforeLoad:function(param){
	      	param.ClassName = Global.Com.ClassName;
	      	param.QueryName = 'QueryHospInfo';
	      	return true;
	     },
	    columns:[[   
	        {field:'Rowid',title:'数据ID',width:60},  
	        {field:'Desc',title:'描述',width:100}
	    ]],
	    fitColumns: true,
	    onSelect:function(){
		    $('#PortRoot-HITYPE').combobox('clear');
		    $('#PortRoot-HITYPE').combogrid('grid').datagrid('reload');
		},
	    onLoadSuccess:function(data){
		    
		}
	}); */
}

function init_auditFlag(){
	$('#AuditFlag').combobox({
		defaultFilter: 4,
		valueField: 'cCode',
		textField: 'cDesc',
		url:$URL,
		mode:'remote',
		onBeforeLoad:function(param){
	      	param.ClassName = 'INSU.COM.BaseData';
	      	param.QueryName = 'QueryDic1';
	      	param.Type = 'PUBLISHSTATUS';
	      	param.HospDr = '';
	      	param.ResultSetType = 'array';
	      	return true;

		},
		onSelect: function (data) {
		},onLoadSuccess:function(){

		}
	});		
}

// dg_btn_event
function DG_EndEdit(){
	var SelectIndex = INSUMIGetEditRowIndexByID('dg');
	if(SelectIndex < 0 ){
		$.messager.alert('提示', '请选择要取消编辑的行','error');
        return;	
	}
	$('#dg').datagrid('endEdit',SelectIndex);		
}



function stEdit(index,row){
	if(!CheckCanEdit()){
		INSUMIPOP('已经发布的数据不允许修改' , 'error');
		return;	
	};
	var SelectIndex = INSUMIGetEditRowIndexByID('dg');
	if(SelectIndex > -1 ){
		if (!$('#dg').datagrid('validateRow', SelectIndex)) {
			$.messager.popover({msg: '数据验证不通过', type: 'error'});
			return;
		}
		$('#dg').datagrid('endEdit',SelectIndex);
	}		
	$('#dg').datagrid('beginEdit',index);	
}

function WestBeginEdit(index,row){
	if(!CheckCanEdit()){
		INSUMIPOP('已经发布的数据不允许修改' , 'error');
		return;	
	};
	var SelectIndex = INSUMIGetEditRowIndexByID('wdg');
	if(SelectIndex > -1 ) {
		if (!$('#wdg').datagrid('validateRow', SelectIndex)) {
			$.messager.popover({msg: '数据验证不通过', type: 'error'});
			return;
		}
		$('#wdg').datagrid('endEdit',SelectIndex);
	}
	$('#wdg').datagrid('beginEdit',index);
	
}

function SwitchPARNODETYPE(PARNODETYPE){
	$('#btnPARNODETYPE').attr('data',PARNODETYPE.split('|')[0]);
	$('#btnPARNODETYPELabel').find('.l-btn-text').text(PARNODETYPE.split('|')[1]);
	
	Load_wdg_DataGrid();
}

function WestEndEdit(){

	var SelectIndex = INSUMIGetEditRowIndexByID('wdg');
	if(SelectIndex < 0 ){
		$.messager.alert('提示', '请选择要取消编辑的行','error');
        return;	
	}
	$('#wdg').datagrid('endEdit',SelectIndex);	

}
function EastBeginEdit(index,row){
	if(!CheckCanEdit()){
		INSUMIPOP('已经发布的数据不允许修改' , 'error');
		return;	
	};
	var SelectIndex = INSUMIGetEditRowIndexByID('edg');
	if(SelectIndex > -1 ){
		if (!$('#edg').datagrid('validateRow', SelectIndex)) {
			$.messager.popover({msg: '数据验证不通过', type: 'error'});
			return;
		}
		$('#edg').datagrid('endEdit',SelectIndex);	
	}	
	$('#edg').datagrid('beginEdit',index);
}

function EastEndEdit(){
	var SelectIndex = INSUMIGetEditRowIndexByID('edg');
	if(SelectIndex < 0 ){
		$.messager.alert('提示', '请选择要取消编辑的行','error');
        return;	
	}
	$('#edg').datagrid('endEdit',SelectIndex);
}
function selectClassMethod(data){
	var SelectIndex = INSUMIGetEditRowIndexByID('wdg');
	if(SelectIndex < 0 ){
		return;
	}
	// SetWdgValue
	INSUMIDataGrid.setGridVal('wdg',SelectIndex,'CLASSNAME',data.CLASSNAME);
	INSUMIDataGrid.setGridVal('wdg',SelectIndex,'METHODTYPE',data.METHODTYP);	
	INSUMIDataGrid.setGridVal('wdg',SelectIndex,'ClassMethodArgs',data.ROWID);	
}

// 到处接口及接口对于的节点、参数(左下角、右下角、上边)
function ExportALLData()
{
	try{
		var ExploreName = getExploreName();
		if(ExploreName !="IE>=11"){
			INSUMIPOP('请使用IE11导出，并且配置信任站点(ActiveX)' , 'error');	
			return;
		}
		var selectDG = $('#dg').datagrid('getSelected');
		if(!selectDG){
			INSUMIPOP('没有选择要导出的数据' , 'error');	
			return;
		}		
		$.messager.confirm('提示','是否继续导出【' + selectDG.INFNAME + '】下的所有数据',function(r){
			if(r){
				var PortListId = selectDG.ROWID;	
				$cm({
					ResultSetType:"ExcelPlugin",  
					ExcelName:"数据上传",		  
					PageName:"ExportALLData",      
					ClassName:"INSU.MI.PortConfig",
					QueryName:"ExportData",
					PortListId:PortListId
				},false);
			}
		})
	} catch(e) {
		$.messager.alert("警告",e.message,'error');
	};
}
// 导出接口及接口对于的节点、参数(左下角、右下角、上边)
function ImportAllData()
{
	try{
		INSUMIFileOpenWindow(import_AllData);
	} catch(e) {
		$.messager.alert("警告",e.message);
	};
}
// 判断行是否可以编辑
function CheckCanEdit(){
	var dgSelected = $('#dg').datagrid('getSelected');
	if(!dgSelected){
		return false;	
	}	
	if(dgSelected.CHKFLAG=="2"){ // 已发布
		return false; // 已发布的不允许修改	
	}
	return true;
}
//根据发布状态 更改按钮禁用样式
function ChangeButtonByPublishStatus(){
	var dgSelected = $('#dg').datagrid('getSelected');
	if(!dgSelected){
		$('.changebtn').linkbutton('enable');
		return;	
	}	
	var Status = dgSelected.CHKFLAG;
	if(Status == 2){
		INSUMIPOP('不允许操作发布状态的数据' , 'info');
		$('.changebtn').linkbutton('disable');	
	}else{
		$('.changebtn').linkbutton('enable');		
	}	
}
// 将选中行改为光标所在行
function focusEditRow(gridId){
	$('#' + gridId + 'TB').next().find(".datagrid-editable-input,.combo").off('click');
	$('#' + gridId + 'TB').next().find(".datagrid-editable-input,.combo").on('click',function(){				
		var index = INSUMIGetEditRowIndexByID(gridId);
		$('#' + gridId).datagrid('selectRow',index);
	});	
}