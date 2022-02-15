$(function () {
	try {
		OSP_Init_layui();
		//
		BuildSYSPageTitle();
		//
		BuildSYSWhiteBtn();
		//
		BuildSYSIconBtn();
	
		BuildSYSIconBackBtn()
		
		var clientdict = OSPGetParentVal('client_dict');
		var role = clientdict['ss_eqlistd_role'];
		if (role == "role2"){
			$('body:not(.main-body)').height('550px');
		}
	} catch (error) {		
	}	
})
function OSP_Init_layui(){
	layui.config({
		base: '/WebAPP/plugin/layim-v3.7.8/dist/layerTable/2.x/'
	}).extend({
		layerTable: 'layerTable/layerTable'
	}).use(['layerTable'], function () {
		layerTable = layui.layerTable;
    });
}
function OSP_Init_LayerTable(){
	layui.config({
		base: '/WebAPP/plugin/layim-v3.7.8/dist/layerTable/2.x/'
	}).extend({
		layerTable: 'layerTable/layerTable'
	}).use(['layerTable'], function () {
		layerTable = layui.layerTable;
    });
}
function getSYSConfig(str,node,defVal){
	var val = defVal;
	var tmp1 = str.split(node + ':');
	if(tmp1.length > 1){
		var tmp2 = tmp1[1];
		val = tmp2.split(',')[0];
	}
	return val;
}
// 两边带尖头的标题
function BuildSYSPageTitle(){
	var pagetitleArr = $('.pagetitle');
	$.each(pagetitleArr,function(index,pageTitleDiv){
		var dataOpt = $(pageTitleDiv).attr('data-options');
		var dataOptObj = "";
		//config
		var icons = "";
		var fontSize = "40px";
		//config
		if(dataOpt != undefined ){
			icons = getSYSConfig(dataOpt,"icons",icons);
			fontSize = getSYSConfig(dataOpt,"font-size",fontSize);
		}
		var title =  $(pageTitleDiv).attr('title');
		if(!title){
			title = "";
		}
		var htmlStr = icons == "none"?"":'<img style="padding-bottom: 20px;" src="/WebAPP/themes/images/dbnext.png" />';
		htmlStr += '<label style=" \
		width: 289px; \
		opacity: 1; \
		font-size:' +  fontSize + ';';
		
		htmlStr += 'font-family: Source Han Sans CN, Source Han Sans CN-Regular; \
		text-align: left; \
		color: #FFFFFF; \
		">' + title + '</label>'
		htmlStr += icons == "none"?"":'<img style="padding-bottom: 20px;" src="/WebAPP/themes/images/dbprev.png" />';
		$(htmlStr).appendTo(pageTitleDiv);
	})
}
// 白色背景按钮
function BuildSYSWhiteBtn(){
	var pagetitleArr = $('.sys-white-defbutton');
	var child = $('.sys-white-defbutton').find('.sys-white-defbutton-label');
	if(child.length > 0){
		return;
	}
	$.each(pagetitleArr,function(index,pageTitleDiv){
		var dataOpt = $(pageTitleDiv).attr('data-options');
		var dataOptObj = "";
		if(dataOpt != undefined ){
			dataOptObj = JSON.stringify("{" + dataOpt + "}");
		}
		var title =  $(pageTitleDiv).attr('title');
		if(!title){
			title = "";
		}
		var htmlStr = "<label class='sys-white-defbutton-label'>" + title + "</label>";
		$(htmlStr).appendTo(pageTitleDiv);
	})
}
// 带图标的的按钮
function BuildSYSIconBtn(){
	var pagetitleArr = $('.sys-white-defbutton-icon');
	$.each(pagetitleArr,function(index,pageTitleDiv){
		var dataOpt = $(pageTitleDiv).attr('data-options');
		var dataOptObj = "";
		//config
		var icons = "";
		var fontSize = "40px";
		//config
		if(dataOpt != undefined ){
			icons = getSYSConfig(dataOpt,"icons",icons);
			fontSize = getSYSConfig(dataOpt,"font-size",fontSize);
		}
		var title =  $(pageTitleDiv).attr('title');
		if(!title){
			title = "";
		}
		var htmlStr = '<div class="sys-white-defbutton-icon-il">';
				htmlStr += '<div> \
								<div class="icon-btn ' +  icons + '" ></div> \
							</div> \
							<div class="sys-white-defbutton-icon-label">'
							htmlStr +=	title ;
				htmlStr +=	'</div>';
		htmlStr +=	'</div>';
		htmlStr += '<div style="height:100%;width:0px;vertical-align: middle;display: inline-block;"></div>';
		$(htmlStr).appendTo(pageTitleDiv);
	})
}

//主页返回按钮样式
function BuildSYSIconBackBtn(){
	var pagetitleArr = $('.sys-defbutton');
	$.each(pagetitleArr,function(index,pageTitleDiv){
		//var dataOpt = $(pageTitleDiv).attr('data-options');
		//var dataOptObj = "";
		//config
		//var icons = "";
		//var fontSize = "40px";
		//config
		//if(dataOpt != undefined ){
			//icons = getSYSConfig(dataOpt,"icons",icons);
			//fontSize = getSYSConfig(dataOpt,"font-size",fontSize);
		//}
		var title =  $(pageTitleDiv).attr('title');
		if(!title){
			title="";
		}
		var htmlStr = '<label class="sys-defbutton-label">' + title + '</label>';
		$(htmlStr).appendTo(pageTitleDiv);
	})
}
var keyCodeMap = {
    // 91: true, // command
    61: true,
    107: true, // 数字键盘 +
    109: true, // 数字键盘 -
    173: true, // 火狐 - 号
    187: true, // +
    189: true // -
};
// 覆盖ctrl||command + ‘+’/‘-’
document.onkeydown = function (event) {
    var e = event || window.event;
    var  ctrlKey = e.ctrlKey || e.metaKey;
    if (ctrlKey && keyCodeMap[e.keyCode]) {
        e.preventDefault();
		return false;
    } else if (e.detail) { // Firefox
        event.returnValue = false;
		return false;
    }
};
// 覆盖鼠标滑动
$(document).on('mousewheel DOMMouseScroll', onMouseScroll);
function onMouseScroll(e){
    e.preventDefault();
    var wheel = e.originalEvent.wheelDelta || -e.originalEvent.detail;
    var delta = Math.max(-1, Math.min(1, wheel) );
    return false;
}
$('*').dblclick(function(e){
	e.preventDefault();
	return false;
});

var scrollFunc=function(e){ 
	e=e || window.event; 
	if(e.wheelDelta && event.ctrlKey){//IE/Opera/Chrome 
	 event.returnValue=false;
	}else if(e.detail){  //Firefox 
	 event.returnValue=false; 
	} 
}  
/*注册事件*/
if(document.addEventListener){ 
	document.addEventListener('DOMMouseScroll',scrollFunc,false); 
}//
window.onmousewheel=document.onmousewheel=scrollFunc;//IE/Opera/Chrome/Safari
// right menu
/*
window.document.oncontextmenu = function(){
	return false;
}*/
//
function Disabled(e,css){
	$(e).css('background','#cccccc');
	$(css).off('click');
}