/**
 * FileName: admin.sysdicconfig.js
 * Anchor: tangzf
 * Date: 2020-3-23
 * Description: 移动收费-订单
 */
var Global = {

}
$(function () {

})
$("dd a").bind("click",function(){
   $('.layadmin-iframe').attr('src','../WebAPP/pages/admin/' + $(this).attr("value") + ".html" )
})