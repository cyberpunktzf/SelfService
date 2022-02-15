/**
 * FileName: dhcbillinsu.offselfpro.query.accountbalance.js
 * Anchor: tangzf
 * Date: 2020-3-23
 * Description: 移动收费账户余额查询
 */
 $(function () {
	autoLayout();	 
	$('#AccountID').text(OSPGetParentVal('PatInfo','AccountID'));
	$('#BalanceAmt').text(formatAmt(OSPGetParentVal('PatInfo','BalanceAmt')));
	$('#LimitAmt').text(formatAmt(OSPGetParentVal('PatInfo','LimitAmt')));
	
 })
function autoLayout(){
	$('.layui-card').css('height',window.innerHeight - 90);
	var payModeRow = $('.layui-col-md6').length;
	var height = (window.innerHeight) / payModeRow;
	$('.layui-col-md6').css('height',height < 40 ? 40 : height);
	window.onresize=function(){
		$('.layui-card').css('height',window.innerHeight - 90);
		var height = (window.innerHeight ) / payModeRow;
		$('.layui-col-md6').css('height',height < 40 ? 40 : height);
		$('.layui-card-body').attr('style','height:' + height + 'px');		
	}
	$('label').css('font-size','20px');
}