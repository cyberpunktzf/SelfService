/**
 * FileName: prereg.doctor.timeinfo.js
 * Anchor: tangzf
 * Date: 2020-4-26
 * Description: 查询菜单
 */
 $(function () { 
	var UnionInfoFlag = OSPGetParentVal('processcode');
	if(UnionInfoFlag.indexOf('Union') == -1){
		nextBusiness();
	}
 });
 function nextBusiness(){
	GoNextBusiness('');
	return false;
 }
