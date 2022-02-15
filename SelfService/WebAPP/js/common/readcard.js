/**
 * FileName: dhcbillinsu.offselfpro.charge.readcard.js
 * Anchor: tangzf
 * Date: 2020-3-23
 * Description: 移动收费读卡
 */
 $(function () {
	var role = OSPGetParentVal('client_dict', 'ss_eqlistd_role');
	if (role == "role2"){
		$('.menu-center-content').addClass('bgj-menu-center-content');
		$('.layui-row').css('margin-right','50px');
		$("div.pagetitle + div").css({'padding-top':'90px'});
		$(".sys-white-defbutton").css({'width': '280px', 'height':'120px','border-radius': '10px','margin-top': '140px'});
		$(".sys-white-defbutton-label").css({'font-size': '26px'});
	}
})
function ReadAdmCard(){
	OSPSetParentVal('ReadCardType',"0");
	GoNextBusiness("0");
	return false;
}

/*
* 读医保卡
*/
function INSUReadCard(){
	OSPSetParentVal('ReadCardType',"1");
	GoNextBusiness("1");
	return false;
}
/*
* 电子医保凭证
*/
function ReadEINSU(){
	OSPSetParentVal('ReadCardType',"3"); //返回主页需要清空
	OSPSetParentVal('InsuType',"ZZB");
	GoNextBusiness("&ReadCardType=INSU");
	return false;
}
