/**
 * FileName: prereg.doctordetails.html
 * Anchor: tangzf
 * Date: 2020-4-26
 * Description: 预约挂号-医生排班查询 1004
 */
var Global={
	SelectRow: '',
	COL: 4,
	ROW: 3,
	BOXHEIGHT: '180px',
	BoxColor: 'rgb(0, 206, 209)',
	ScheduleArr: [],
	BGJClass: ''
}
var CurrentPage=0;
$(function () {
	var role = OSPGetParentVal('client_dict', 'ss_eqlistd_role');
	if (role == "role2"){
		Global.BGJClass = 'bgj';
		$('.bgj').css('display', 'inherit');
		$('.bottom-advise').css('padding-top','0px');
		$('tr.table-title').removeClass('title-td');
		//$('.bottom-change').css({'position': 'absolute', 'top':'370px','left':'1020px'});
		$('.bottom-change').css({'text-align':'center','position':'absolute','top':'490px','left':'500px'});
		$('.bottom-advise label').css('line-height','35px');
		$(".layui-col-md8").css({'height': '305px','margin-top':'20px','margin-left':'180px'});
		$('.today').css('display', 'none');

		//翻页
		$('.bottom-change>img').css({'width':'140px','margin-bottom':'10px'});
	}
	
	init_Title();
	GetHISDocDetInfo(CurrentPage);
});

function QueryDocTimeInfo(InputObj){
	GoNextBusiness('Param=' + InputObj);
	return false;
}
function init_Title(){
	var ParamStr = INSUGetRequest('Param');
	var ParamObj = JSON.parse(ParamStr);
	
	var DepName = "";
	if (Global.BGJClass == "bgj"){
		var DepName = "【您选择的是："  +  ParamObj.DoctorName + ' ' + ParamObj.DoctotLevelCode + ' ' + ParamObj.DeptName +  "】";
		$('.DeptName').text(DepName);
	}
	/*
	$('.DoctorName').text(ParamObj.DoctorName);
	$('.DoctorLevel').text(ParamObj.DoctotLevelCode);
	$('.Description').text(ParamObj.Description);
	$('.DeptNamebgj').text(ParamObj.DeptName);
	$('#DeptName').text(DepName);
	$('.DoctorSpec').text(ParamObj.DoctorSpec);
	*/
	var nowDate = getToday().split(' ')[0];
	$('#today').text(nowDate);
	//Reg
	var BusinessType = OSPGetParentVal('BusinessType');
	if(BusinessType == "Reg"){
		$('.doc-date-title').text('请选择挂号日期');
	}

}
function GetHISDocDetInfo(index){
	var tmpPro = $('#NextButton').attr('disabled');
	if(tmpPro){
		return;
	}
	$('#NextButton').attr('disabled','disabled');
	$('#BackButton').attr('disabled','disabled');
	setTimeout(function(){
		$('#NextButton').removeAttr('disabled');
		$('#BackButton').removeAttr('disabled');
		return;
	},500)
	CurrentPage = CurrentPage + index;
	if(CurrentPage <= 0){
		CurrentPage = 0;	
	}
	
	var ParamStr = INSUGetRequest('Param');
	var ParamObj = JSON.parse(ParamStr);
	var DepName = ParamObj.DeptName;
	if(DepName == "肾移植门诊"){
		CurrentPage=CurrentPage >= 4 ? 0 : CurrentPage;
		index = 0;
		$('#pageNum').text('/4')
	}else{
		CurrentPage=CurrentPage >= 2 ? 0 : CurrentPage;
	}
	if (CurrentPage == 1 && index < 0){
		return;
	}
	if (CurrentPage == 0 && index > 0){
		return;
	}


	$('#currentPage').text(CurrentPage+1);

	$('.morning,.afternoon').find('td:not(:first)').text('');
	rtnObj = PeyServ_GetDocDate()
	AddDocToHtml(rtnObj);
}

function AddDocToHtml(jsonObj){
	if(jsonObj.Response.RecordCount == 0){
		OSPAlert('', jsonObj.Response.ResultContent, '提示', function(e){
			rebackClick();
		})
		return;
	}
	var DepArr = jsonObj.Response.Schedules.Schedule;
	if(!DepArr.length){
		DepArr = [
			DepArr
		]
	}
	var BusinessType = OSPGetParentVal('BusinessType');
	var days = 1;


	//循环周
	//获取组件
	var datetime = new Date();
	var week = datetime.getDay();
	var FirstWeek = week + 1;
	for (var days = 1;days <= 7; days++){
		var tmpWeek =  TransWeek(FirstWeek).split('^')[0]; //TransWeek(DepArr[index].WeekDay).split('^')[0];
		FirstWeek++;
		var tmpDate = getDefStDate(days + CurrentPage*7).substring(5,10);//DepArr[index].ServiceDate.substring(5,10);
		// 标题
		$('.week-head' + days + ' .week-head-days').text(tmpDate);
		$('.week-head' + days + ' .week-head-title').text(tmpWeek);
		// 内容
		//循环返回值
		$.each(DepArr, function(index,val){
			var btnText = "空";
			var Pdisabled = "disabled";
			var b = $.isEmptyObject(val);
			var SorDate = val.ServiceDate;

			if(!b){
				var ParamStr = INSUGetRequest('Param');
				var ParamObj = JSON.parse(ParamStr)
				if(tmpDate != SorDate.substring(5,10) || val.DoctorName != ParamObj.DoctorName){
					return true;
				}
				// 上下午
				var SessionName = DepArr[index].SessionName;
	
				if(BusinessType == "Reg"){
					btnText = "挂号";
					Pdisabled = "";
					if(typeof DepArr[index].AvailableNumStr!="undefined" && DepArr[index].AvailableNumStr.split(",").length < 1) {
						btnText = "挂完";
						Pdisabled = "disabled";
					}
				}else if(BusinessType == "ORDR"){
					btnText = "预约";
					Pdisabled = "";
					if(typeof DepArr[index].AvailableNumStr!="undefined" && DepArr[index].AvailableNumStr.split(",").length < 1) {
						btnText = "约满";
						Pdisabled = "disabled";
					}
				}
			}else{
				btnText = "无号";
				btnText = "";
				Pdisabled = "disabled";
			}
			if(typeof DepArr[index].UnableReason !="undefined"){
				if(DepArr[index].UnableReason !=""){
					btnText = DepArr[index].UnableReason;
					Pdisabled = "disabled";
				}				
			}
			var htmlStr = _BuildBtn(DepArr,btnText,index,Pdisabled);
			if (SessionName=="上午"){
				$('.morning ' + '.week-content' + days).prepend(htmlStr);
			}else if (SessionName=="下午"){
				$('.afternoon ' + '.week-content' + days).prepend(htmlStr);
			}else{
				$('.afternoon ' + '.week-content' + days).prepend(htmlStr);
				$('.morning ' + '.week-content' + days).prepend(htmlStr);
			}
		});
	}
	//无号
	var tdArr = $( '.td-val');
	$.each(tdArr,function(index,td){
		var content = $(td).find('label');
		var trclass =  $(td).parent().attr('class').split(' ')[1];
		var tdCls = $(td).attr('class').split(' ')[0];
		if(content.length < 1){
			var htmlStr = _BuildBtn(false,"空","","disabled");
			$('.' + trclass + ' .' + tdCls).prepend(htmlStr);
		}
	});
	// 绑定事件
	$(".docbtclick").bind("click",function(){
		var InputObj = $(this).find('label').attr('data');
		if(!InputObj){
			return;
		}
		Disabled(this,'td');	
		
		if(InputObj == ""){
			return;
		}
		QueryDocTimeInfo(InputObj);
	});
	// 构造html
	function _BuildBtn(DepArr,btnText,index,Pdisabled){
		if(DepArr){
			DepArr = JSON.stringify(DepArr[index]); 
		}else{
			DepArr = "";
		}
		var htmlStr ="";
		htmlStr = htmlStr + "<div class='docbtclick sys-defbutton " + Pdisabled + "'  style='width:88px;height:52px;margin:0px auto;'>";
			htmlStr = htmlStr + "<label class='sys-defbutton-label " + Pdisabled + "' data='"+ DepArr  + "'>" + btnText + "</label>";				
		htmlStr = htmlStr + "</div>";		
		htmlStr = htmlStr + "";
		return htmlStr;
	}
}
function TransWeek(week){	
	if(week > 6){
		week = week-7;
	}
	switch (+week) {
        case 0:
            var week = '星期日' + "^Sun";
            break;
        case 1:
            var week = '星期一'+ "^Mon";
            break;
        case 2:
            var week = '星期二'+ "^Tues";
            break;
        case 3:
            var week = '星期三'+ "^Wed";
            break;
        case 4:
            var week = '星期四'+ "^Thur";
            break;
        case 5:
            var week = '星期五'+ "^Fri";
            break;
        case 6:
            var week = '星期六'+ "^Sat";
            break;
	}	
	return week;
}
