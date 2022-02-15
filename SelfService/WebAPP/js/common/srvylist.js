/**
 * FileName: srvylist.js
 * Anchor: tangzf
 * Date: 2020-3-23
 * Description: 移动收费读卡
 */
 var Global={
	SelectRow :'',
	PageIndex : 1,
	SrvListArr: [],
	BGJClass: ''
}
var SelectArrInfo = {};
var jsonObj = {
	"length": 8,
	"data1":[{
		"srvcontent" : "1.是否有发热、咽痛、咳嗽、腹泻、鼻塞、流鼻涕、乏力等症状?",
		"YESNO":"YESNO"
	},{
		"srvcontent" : "否",
		"YESNO":"NO"
	},{
		"srvcontent" : "是",
		"YESNO":"YES"
	}	
	],
	"data2":[{
		"srvcontent" : "2.14天内是否有中高风险地区的旅行史或居住史?",
		"YESNO":"YESNO"
	},{
		"srvcontent" : "否",
		"YESNO":"NO"
	},{
		"srvcontent" : "是",
		"YESNO":"YES"
	}	
	],
	"data3":[{
		"srvcontent" : "3.14天内是否有境外疫情严重国家或地区的旅行史或居住史?",
		"YESNO":"YESNO"
	},{
		"srvcontent" : "否",
		"YESNO":"NO"
	},{
		"srvcontent" : "是",
		"YESNO":"YES"
	}	
	],
	"data4":[{
		"srvcontent" : "4.14天内是否接触过新冠病毒感染确诊病例?",
		"YESNO":"YESNO"
	},{
		"srvcontent" : "否",
		"YESNO":"NO"
	},{
		"srvcontent" : "是",
		"YESNO":"YES"
	}	
	],
	"data5":[{
		"srvcontent" : "5.14天内是否曾接触过来自忠告风险地区的有发热或者有症状的患者?",
		"YESNO":"YESNO"
	},{
		"srvcontent" : "否",
		"YESNO":"NO"
	},{
		"srvcontent" : "是",
		"YESNO":"YES"
	}	
	],
	"data6":[{
		"srvcontent" : "6.14天内是否曾接触境外疫情严重国家或地区的有发热或有呼吸道症状的患者?",
		"YESNO":"YESNO"
	},{
		"srvcontent" : "否",
		"YESNO":"NO"
	},{
		"srvcontent" : "是",
		"YESNO":"YES"
	}	
	],
	"data7":[{
		"srvcontent" : "7.您周围(如家中、学校班级或单位)是否有2例及以上发热或呼吸道症状的病例?",
		"YESNO":"YESNO"
	},{
		"srvcontent" : "否",
		"YESNO":"NO"
	},{
		"srvcontent" : "是",
		"YESNO":"YES"
	}	
	],
	"data8":[{
		"srvcontent" : "8.是否从事进口海产品冷链加工运输工作、交通系统工作(公交、地铁、网约车)?",
		"YESNO":"YESNO"
	},{
		"srvcontent" : "否",
		"YESNO":"NO"
	},{
		"srvcontent" : "是",
		"YESNO":"YES"
	}		
	]
}
var totalLen = 0;

$(function () {
	var role = OSPGetParentVal('client_dict', 'ss_eqlistd_role');
	if (role == "role2") {
		Global.BGJClass = 'bgj';
		$(".layui-card-body").css({'height': '340px'});
		$('.bottom-advise').css({'padding-top': '0'});
		$('.bottom-advise label').css('line-height','35px');
		$('.title-surv').css({'line-height': '70px'});
		$('.bottom-change').css({'text-align':'center','padding-top':'20px','position':'absolute','left':'500px'});
		$('.bottom-change>img').css({'width': '140px', 'margin-bottom':'12px'});
		$('.bottom-advise label').css({'font-size': '20px'});
		//提交
		$('.bottom-change').find('span').css({'padding': '10px 42px', 'font-size': '24px'});
	}
	var rtn = PeyServ_QuerySurvList()
	var rtnObj = JSON.parse(rtn.output);
	jsonObj = rtnObj;
	totalLen = jsonObj.length;
	$('#pageNum').text('/' + totalLen);
	init_OrderList(jsonObj);
});

/*
   流调表 table.reload(ID, options)
*/
function init_OrderList(jsonObj){
	try{
	   var content = Global.PageIndex;
	   $('#currentPage').text(content);
	   layui.use('table', function(){
		var table = layui.table;
		//第一个实例
		table.render({
			id:'OrderList',
			elem: '#OrderList',
			field:'srvcontent',
			align:'center',
			border:'',
			size: 'lg', //表格尺寸 默认 sm
			even:false, //隔行背景
			height:329,
			url:  PYTHONSERVER + 'CallSelfServPY', //数据接口
			parseData: function(ret){
				return {	
					  "code": 200, //解析接口状态
					  "count": jsonObj.length, //解析数据长度
					  "data": jsonObj['data' + Global.PageIndex] //解析数据列表
					};
			},
			response: {
				statusCode: 200 //重新规定成功的状态码为 200，table 组件默认为 0
			},
			cols: [[ //表头
				{field: 'srvcontent', title: '', templet:function(d){	
					var selectData = SelectArrInfo[Global.PageIndex];
					var YESCk = "";
					var NOCk = "";
					if(selectData=="YES"){
						YESCk = 'checked';
					}
					if(selectData=="NO"){
						NOCk = 'checked';
					}
					if(d.YESNO == "YES"){
						return "<input name='Yckradio' " + YESCk + "  type='radio'/>" + d.srvcontent;
						//return "<input class='Yckradio' value = 0 type='radio' + " + Yesmsg + "/>" + d.srvcontent;
					}else if(d.YESNO == "NO"){
						return "<input name='Nckradio' " + NOCk + "  type='radio'/>" + d.srvcontent;
					}else {
						return d.srvcontent;
					}
				 }},
				 {field: 'YESNO', title: 'YESNO',width:0, hide:true}
			]]
		});
		//监听行单击事件
		 table.on('row(OrderList)', function(obj){
			SelectArrInfo[Global.PageIndex] = obj.data.YESNO;
			if(obj.data.YESNO == "YES"){
				//$(this).find('.layui-anim.layui-icon').css('color','black');
				$('input[name="Yckradio"]').next().addClass('layui-form-radioed');
				$('input[name="Yckradio"]').next().find('i').addClass('layui-anim-scaleSpring');
				$('input[name="Yckradio"]').next().find('i').text('');


				$('input[name="Nckradio"]').next().find('i').text('');
				$('input[name="Nckradio"]').next().removeClass('layui-form-radioed');
				FillSrvyList(true);	
				
								 
			}else if(obj.data.YESNO == "NO"){
				$('input[name="Nckradio"]').next().addClass('layui-form-radioed');
				$('input[name="Nckradio"]').next().find('i').addClass('layui-anim-scaleSpring');
				$('input[name="Nckradio"]').next().find('i').text('');
				
				
				$('input[name="Yckradio"]').next().find('i').text('');
				$('input[name="Yckradio"]').next().removeClass('layui-form-radioed');
				FillSrvyList(true);	
				
			}	
			if(Global.SrvListArr){
				// Global.SrvListArr[obj.data.srvcontent]=(obj.data.YESNO);
				jsonObj['data' + (Global.PageIndex)]['selected'] = obj.data.YESNO;
			 }
			});
		});
	}catch(e){
   		alert(e.ResponseText);
	}
}

// boolean :true +
// boolean :false -
function FillSrvyList(boolean){
	if(boolean){
		if(Global.PageIndex >= totalLen){
			return;
		}
		Global.PageIndex++;
	}
	if(!boolean){
		Global.PageIndex--;
	}
	if(Global.PageIndex<1){
		Global.PageIndex = 1;
	}
	$('#submit').hide();
	if(Global.PageIndex >= totalLen){
		$('#submit').show();
		if (Global.BGJClass == "bgj") {
			$('.bottom-change').css({'left': '400px'});
		}
	}
	
	if(Global.PageIndex > totalLen){
		var Flag = "Y";
		for(var tmpI=1;tmpI<jsonObj.length;tmpI++){
			selected = jsonObj['data' + tmpI]['selected'];
			if(!selected){
				Flag = tmpI;
				break;
			}
		}
		if(Flag != "Y"){
			Global.PageIndex--;
			OSPAlert('','第' + Flag +'页，未选择','提示',function(){
				return;
			});
		}
		return;			
	}else {
		init_OrderList(jsonObj);
	}
}

function submit() {
	var totNum = 0;
	$.each(SelectArrInfo,function(index,val){
		totNum++;
	})
	if(totNum < totalLen){	
		OSPAlert('','存在未选择的项目','提示');
		return;
	}
	var Input = {
		"Input": SelectArrInfo
	}
	//var rtn = PeyServ_SaveSurvList(Input);
	//return;
	OSPAlert('','保存成功,谢谢您的配合','提示',function(){
		GoNextBusiness();
		return false;
	});
}
