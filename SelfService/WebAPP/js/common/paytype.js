/**
 * FileName: dhcbillinsu.offselfpro.charge.readcard.js
 * Anchor: tangzf
 * Date: 2020-3-23
 * Description: 移动收费读卡
 */
 $(function () {

 })
 
function ReadAdmCard(){
	OSPSetParentVal('InsuType',"");
	GoNextBusiness("");
	return false;
}
/*
	读医保卡
*/
function INSUReadCard(){
	OSPSetParentVal('InsuType',"ZZB");
	GoNextBusiness("");
	return false;
}
