/**
 * FileName: common.modifypatinfo.js
 * Anchor: tangzf
 * Date: 2020-3-23
 * Description: 基本信息修改
 */
var PatPhone = '';
var PreOrdrRequestStr="";
 $(function () {
    var clientdict = OSPGetParentVal('client_dict');
	var role = clientdict['ss_eqlistd_role'];
	if (role == "role2"){
        $('.sys-white-defbutton.cardno').css('height','50px');	
        $('.bgj').css('display','none');

		$('.bgj-phone').css('position','absolute');
		$('.bgj-phone').css('top','50px');
        $('.bgj-phone').css('left','240px');

		$('#CardNo').css('position','absolute');
		$('#CardNo').css('top','-25px');
        $('#CardNo').css('left','290px');
        
        $('.cardno img').css('top','2px');
        
        $('.sys-white-defbutton.cardno').css('top','50px');	

        $('.modify-button:first').css('margin-top','80px');
        
        $('.keybord-region').css('margin-top','50px');

        //键盘
        $('.sys-white-defbutton.number').css('width','90px');
        $('.sys-white-defbutton.number').css('height','48px');

        $('.sys-white-defbutton.number').find('label').css('font-size','30px');
        $('.sys-white-defbutton.number').find('label').css('line-height','47px');
        $('img[data="back"]').css('margin-top','5px');
	}
    /*alert(11);
    //text1
    var sysbtn =$('.keybord-region').find('.sys-white-defbutton');
    var sysbtnLen = sysbtn.length;
    $.each(sysbtn,function(index,val){
        var jsonStr = '{' + $(val).attr('data-options') + '}';
        var tjsonObj = JSON.parse(jsonStr);
        var text = tjsonObj.text;
        if(!text){
            text = "";
        }
        var htmlStr = "<label  class='sys-white-defbutton-label' id='CardNo' ></label>"
    })*/

//text2

    PreOrdrRequestStr = INSUGetRequest('RequestStr');
    PatPhone = OSPGetParentVal('HisPatInfo').TelephoneNo;
    $("#CardNo").text(PatPhone);
	init_keybord();

 });
 function ModifyCallBack(jsonObj){
     if(jsonObj.Response.ResultCode == "0"){
        GoNextBusiness();
        return false;
     }else{
        OSPAlert('',"修改手机号失败",'提示');
     }
 }
function init_keybord(){
    $('.change').on('click',function(){
        $("#CardNo").text('');
        $(".change").css('display','none');
        $("#keybord").css('display','block');
        $("#modifyBack").css('display','block');
    });
    $('#BtnConfirm').on('click',function(){
        var TelePhoneNo = $("#CardNo").text();
        if(TelePhoneNo.length !=11){
            OSPAlert('',"请输入正确的手机号",'提示');
            return;
        }
        var OutPut ={
            "TelePhoneNo" : TelePhoneNo
        }    
        if(PatPhone == TelePhoneNo){
            GoNextBusiness();
            return false;
        }else{
            var jsonObj = PayServ_UpdatePatInfo(OutPut);
            ModifyCallBack(jsonObj);
        }

    });
    $('.modifyBack').on('click',function(){
        $("#CardNo").text(PatPhone);
        $(".change").css('display','block');
        $("#keybord").css('display','none');
        $("#modifyBack").css('display','none');
    });

	$('.keybord-region').find('.sys-white-defbutton').on('click',function(){
		var keyId = $(this).children(':first').attr('data');
		switch (keyId)  {
			case 'clear':
				$("#CardNo").text('');
				break;
			case 'back':
				var InputVal = $("#CardNo").text();
				InputVal = InputVal.substring(0,InputVal.length - 1);
				$("#CardNo").text(InputVal);
				break;
			default:
				var InputVal = $("#CardNo").text();
				if(InputVal==""){
					InputVal = $(this).children(':first').text();
				}else{
					InputVal = InputVal + $(this).children(':first').text();
				}
                $("#CardNo").text(InputVal);
                if( $('#CardNo').text().length == 11 ){
                    $(".change").css('display','');
                    $("#keybord").css('display','none');
                    $("#modifyBack").css('display','none');

                }
				break;
		}		
	});
}
