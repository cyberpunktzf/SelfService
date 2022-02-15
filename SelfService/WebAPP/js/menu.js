/**
 * FileName: charge.menu.js
 * Anchor: tangzf
 * Date: 2020-3-23
 * Description: 菜单
 */
 $(function () {
	/*AddLoading('系统升级中请2分钟后再尝试');
	setTimeout(function(){
		RemoveLoading();
	},120000)*/
	// 初始化打印插件
	ClearGlobal("N");
	//DHC_PrintByLodop('lodopObj', 'inpara', 'inlist', 'DataObj', 'reportNote', 'otherCfg');
	let p0 = new Promise((resovle,reject) =>{
		//loadCLodop();
		setTimeout(function(){
			//var lodopObj = getLodop();
			//OSPSetParentVal('CPrintObj',lodopObj);
			resovle();
		},100)
	});
	p0.then((data)=>{
		//生成界面主菜单按钮
		init_menuBtn();

		//获取客户端信息
		GetDeviceInfo();
		//根据角色自助机样式 修改自助机界面布局
		init_layout();
		if(OSPGetParentVal('client_dict')['ss_eqlistd_eqcode'] == ""){
			SSAlert('','请联系管理员维护自助机设备列表配置','提示');
		}
		// 从服务器获取自助机系统时间
		PayServ_GetSYSDateTime();
		//检查是否可以使用自助机 20210904
			// 1.升级时不允许使用
			/*var rtn = PayServ_CheckAutoHandin();
			if (rtn.output == "Y"){
				AddLoading('系统正在升级请稍后');
				var timer = setInterval(function(){
					// 支付结果查询
					var CKrtn = PayServ_CheckAutoHandin();
					if(typeof CKrtn == "undefined"){

					}else if(CKrtn.output != "Y"){
						clearInterval(timer);
						RemoveLoading();
					}
				},10000)
				return;
			}*/
			//	2.检查是否需要更新动态库
			var rtn = PayServ_UpdateDLL();
			if (rtn.output == "Y"){
				AddLoading('系统正在更新动态库');
				var timer = setInterval(function(){
					// 支付结果查询
					var CKrtn = PayServ_CheckAutoHandin();
					if(typeof CKrtn == "undefined"){

					}else if(CKrtn.output != "Y"){
						clearInterval(timer);
						RemoveLoading();
					}
				},10000)
				return;
			}

	})
	// 2.未到使用时间
	// end
 })
/*
	业务跳转
*/
 function gotoReadCard(Operation){
	try {
		var e = window.event.currentTarget;
		var tmpPro = $(e).attr('disabled');
		if(tmpPro){
			return;
		}
		var tmpClass = $(e).attr('class').split(' ')[0];

		$('.' + tmpClass).attr('disabled','disabled');
		setTimeout(function(){
			$('.' + tmpClass).removeAttr('disabled');
			return;
		},3000);
		//是否显示设备信息
		var rtn = PayServ_GetShowEQInfo();
		if (typeof rtn.ss_dic_concode !="undefined"){
			if (rtn.ss_dic_concode == "Y"){
				$("#eqlistinfo", parent.document).show();
				$("#eqlistinfo", parent.document).text('编号:' + OSPGetParentVal('client_dict', 'ss_eqlistd_eqcode') + '; IP:' + OSPGetParentVal('client_dict', 'ss_eqlistd_ip'));
				if(rtn.ss_dic_condesc !=""){
					$("#eqlistinfo", parent.document).attr('style',rtn.ss_dic_condesc);
				}
			}else{
				$("#eqlistinfo", parent.document).hide();
			}
		}
		// 校验挂号时间
		var InputObj = {
			'CheckCode':Operation
		}
		var checkFlag = checkRules(InputObj);
		if(checkFlag.result !="0" || !checkFlag){
			//OSPAlert('',checkFlag.msg,'提示')
			return false;
		}
		Disabled(this,'.sys-white-defbutton-icon');	
		OSPSetParentVal('processcode', Operation);
		//根据流程代码 获取流配置

		var input = {
			"ss_pc_dictype" : "Business",
			"ss_pc_processcode" : Operation,
			"TradeCode" : "GetDicDataDemoByTypeCode"
		}
		var p = ajaxPromise(input,"DoMethod");
		p.then((data)=>{
			BuildProcess(data)
		});
	} catch (error) {
		
	}finally{
		
	} 
}
function BuildProcess(jsonObj){
	json = JSON.parse(jsonObj.output[0]);
	var ConfigObj = JSON.parse(json.ss_pc_demo); 
	OSPSetParentVal('Business', ConfigObj); 
	//根据流程所属的业务类型 进行初始化 业务类型
	OSPSetParentVal('BusinessType', json.ss_pc_diccode);
	// 检查是否允许进行业务操作
	if (typeof checkStop !="undefined"){
		var InputObj = {
			'CheckCode':json.ss_pc_diccode
		}
		var checkFlag = checkStop(InputObj);
		if(checkFlag.result !="0" || !checkFlag){
			return false;
		}	
	}
	// 生产自助服务业务流水号 初始化方法
	PayServ_Init();
	if(OSPGetParentVal('client_dict')['ss_eqlistd_eqcode'] == ""){
		OSPAlert('','请联系管理员维护自助机设备列表配置','提示');
		return;
	}
	else{
		var role = OSPGetParentVal('client_dict', 'ss_eqlistd_role');
		if (role == "role1"){
			var rtn = InsuAutoReadCard(0,1,5,0,"",5000,"test");
			if(rtn){
				if(rtn.indexOf("纸张正常") < 0){
					PayServ_SaveDeviceInfo('PrintPaper','打印机',rtn);
				}
			}
		}
		GoNextBusiness();
		return false;
	}
}
// 根据配置分配主界面
function init_menuBtn(){
	//根据流程代码 获取流配置
	// 先根据设备取
	var jsonObj = PayServ_GetMenuBtn()
	if(typeof jsonObj == "undefined" || !jsonObj.output.ss_pc_demo || jsonObj.output.ss_pc_demo == ""){
		OSPAlert('','获取菜单配置失败,将使用默认菜单','提示');
	}else{
		var ConfigObj = JSON.parse(jsonObj.output.ss_pc_demo); 

		$.each($('.box1'),function(index,val){
			// title="取号" data-options="icons:icon-1" onclick="gotoReadCard('OBTNO')">
			var dataObj = ConfigObj[index + 1];
			if(!dataObj){
				$(val).css('display',"none");	
			}else{
				var title = dataObj.desc;
				var Code = dataObj.processcode;
				var icons = dataObj.icons;	
				$(val).attr('title',title);
				$(val).find('.sys-white-defbutton-icon-label').text(title);
				$(val).attr('onclick',"gotoReadCard('" + Code + "')");
				$(val).attr('data-options',"icons:icon-1");
			}
		})
	}
}

function init_layout(){
	var role = OSPGetParentVal('client_dict', 'ss_eqlistd_role');
	if (role == "admin") {
		$("#adminClick", parent.document).css('display','block');
	}else{
		$("#adminClick", parent.document).css('display','none');
	}
	if (role == "role2"){
		
		// 1.主界面
		$(".main-body", parent.document).addClass('bgj-body');
		// 2.主界面 管理员排按钮
		$(".sys-defbutton:not(#mainBack)", parent.document).addClass('bgj-sys-defbutton');
		// 3.主界面 主体框架
		$(".sys-main-menu", parent.document).css({'height': '170px'});
		// 4.时间
		$(".billinsu-clock", parent.document).addClass('bgj');
		// 5.倒计时
		$(".OSPSYSCountDown", parent.document).addClass('bgj').css({'display':'none'});
		
		$("#mainBack>label", parent.document).remove();
		$("#mainBack", parent.document).removeAttr("title").removeClass("sys-defbutton").text("返回").addClass("button button-royal button-circle button-large bgj-btn-back");

		$('.first-col').css('margin-left','140px');
		$('body').css({'background': 'rgb(0,36,178)'});
		$('body:not(.main-body)').css({'height':'550px'});

		$('body>.container').css({'padding-top': '60px'});
		$(".sys-white-defbutton-icon").css({'width': '280px', 'height':'120px','border-radius': '10px'});
		$(".sys-white-defbutton-icon .sys-white-defbutton-icon-label").css({'font-size': '26px', 'font-weight':'bold', 'margin':'auto'});
		$(".sys-white-defbutton-icon .icon-btn").addClass("for-icon-btn");

		$(".osp-main-container", parent.document).addClass('bgj').css({'height':'550px'});
	}
}

