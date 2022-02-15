//定义当前是否大写的状态 
var CapsLockValue=0; 
var curEditName;
var check;

function BuildKeyboard(type){
	var htmlStr = "";
	if(type == "num"){
		for(var i=48;i<58;i++){
			htmlStr = htmlStr + "<div class='layui-card osp-box osp-item-inner osp-3d-btn' value='" + String.fromCharCode(65+i) + "' ><label>";
			htmlStr = htmlStr + String.fromCharCode(i)
			htmlStr = htmlStr + "</label></div>"
		}
	}
	for(var i=0;i<26;i++){
		htmlStr = htmlStr + "<div class='layui-card osp-box osp-item-inner osp-3d-btn' value='" + String.fromCharCode(65+i) + "' ><label>";
		htmlStr = htmlStr + String.fromCharCode(65+i)
		htmlStr = htmlStr + "</label></div>"
	}
	htmlStr = htmlStr + "<div class='layui-card osp-box osp-item-inner keyboard-double osp-3d-btn' value='退格' >";
	htmlStr = htmlStr + "<div class='icon-left'></div>"
	htmlStr = htmlStr + "<label>退格</label></div>" 
	
	htmlStr = htmlStr + "<div class='layui-card osp-box osp-item-inner keyboard-double osp-3d-btn' value='清空' >";
	htmlStr = htmlStr + "<div class='icon-clear'></div>"
	htmlStr = htmlStr + "<label>清空</label></div>" 

	htmlStr = htmlStr + "<div class='layui-card osp-box osp-item-inner keyboard-double osp-3d-btn' value='搜索' >";
	htmlStr = htmlStr + "<div class='icon-search'></div>"
	htmlStr = htmlStr + "<label>搜索</label></div>" 
	$(".keyboard").prepend(htmlStr);

	$(".keyboard").find('.osp-box').bind('click', function () {
		addValue($(this).attr('value'))
	});
	//var keyboardHeight = 374;
	//$('.keyboard').css('height',keyboardHeight);

	$('#TAlias').bind('focus', function () {
		openKeyboard();
	});
	//给输入的密码框添加新值 
	function addValue(newValue) 
	{ 
		switch (newValue){
			case "清空":
				clearValue();
				break;
			case "退格":
				backspace();
				break;
			case "关闭":
				closeKeyboard();
				break;
			case "搜索":
				SearchKeydown();
				break;
			default:
				CapsLockValue==0?$("#TAlias").val($("#TAlias").val()+ newValue):$("#TAlias").val($("#TAlias").val()+ newValue.toUpperCase())
				break;
		}
	} 
}

function closeKeyboard(){
	$('.keyboard').css('visibility','hidden');
}
function openKeyboard(){
	$('.keyboard').css('visibility','visible');
}
//清空 
function clearValue() 
{ 
	$("#TAlias").val(""); 
} 
//实现BackSpace键的功能 
function backspace() 
{ 
	var longnum=$("#TAlias").val().length; 
	var num ;
	num=$("#TAlias").val().substr(0,longnum-1); 
	$("#TAlias").val(num); 
} 
