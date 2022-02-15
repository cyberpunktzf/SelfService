/*
** Creator: TianZJ
** CreatDate: 2021-08-13
** Description: 显示大屏加载数据js
** demo.js
*/
/// 界面加载默认加载方法
/*
window.onload=function(){
    addonetr();
    add("我是demo");
    initECharts();
}
*/
function initECharts(ChartType){
    alert(ChartType)
    ///获取ECharts容器
    var opECherts=document.getElementById('openECharts');
    ///初始话ECharts
    var zzjChart=echarts.init(opECherts);
    ///获取数据(对象中含有数据)
    var object={};   /// 创建一个对象
    var zzjData=[];  /// 创建一个数组
    for (var ii=0;ii<4;ii++){
        var obj={};
        obj[ii]="abc";
        zzjData.push(obj);
    }
    object['name']='jack';
    object['age']=25;
    object['data']=zzjData;
    var json=JSON.stringify(object);  ////对象转json
    console.log(json);
    ////alert(json)
    var obj1=JSON.parse(json);   ////json转对象
    console.log(obj1)
    if(ChartType="pie"){
        var option=GetPieOption(json);
        zzjChart.setOption(option);
    }else if (ChartType="lin"){
        var option=GetLinOption(json);
        zzjChart.setOption(option);
    }
}

function GetPieOption(jsonStr){
    var serviceData=[];
    var txtData=[];
    var chartviewObj=JSON.parse(jsonStr);
    var option={
        title:{
            text:chartviewObj.name,   ////大标题
            //subtext:'纯属虚构',     ////类似于副标题
            x:'left'
        },
        tooltip:{
            trigger:'item',           //// 数据项图形触发，主要在散点图，饼图等无类目轴的图表中使用。
            formatter:"{a}<br/>{b}:{c}({d}%)"   //// {a} （系列名称），{b} （数据项名称），{c} （数值），{d}（百分比） 用于鼠标悬浮时对应的显示格式和内容
        },
        legend:{
            orient:'vertical',
            left:'left',
            data:chartviewObj.legend
        },
        series:[                ////系列列表。每个系列通过type决定自己的图表类型
            {
                name:'类型',
                type:'pie',
                radius:'50%',
                center:['40%','40%'],
                data:chartviewObj.series,
                itemStyle:{
                    emphasis:{
                        shadowBlur:10,
                        shadowOffsetX:0,
                        shadowColor:'rgba(0,0,0,0.5)'
                    }
                }
            }
        ]
    }
return option;
}

function GetLinOption(jsonStr,chartName){
    var unit="";
    var maxy="";
    if (chartName=="paymodesum"){
        unit="(K)";
        maxy=400;
    }
    if (chartName=="paymodenum"){
        unit="(笔数)";
        maxy=3000;
    } 
    if (chartName=="comparesum"){
        unit="(K)";
        maxy=400;
    } 
    if (chartName=="comparenum"){
        unit="(笔数)";
        maxy=30;
    }
    var serviceData=[];
    var tmp=[];
    var chartviewObj=JSON.parse(jsonStr);
    for (var i=0;i<chartviewObj.series.length;i++){
        ///转换Series
        temp={
            name:chartviewObj.series[i].name,
            type:"line",
            data:chartviewObj.series[i].series
        }
        tmp.push(temp)
    }
    var option={
        title:{
            text:chartviewObj.name,
            x:'left',
            textStyle:{
                "fontSize":16
            }
        },
        tooltip:{
            trigger:'axis'
        },
        /// 调整图表在div中的大小
        grid:{
            left:'3%',  /// 图表距边框的距离
            right:'4%',
            bottom:'3%',
            containLabel:true
        },
        legend:{
            data:chartviewObj.legend,
            textStyle:{
                fontSize:16
            },
            x:'center'
        },
        toolbox:{
            show:true,
            feature:{
                mark:{show:true},
                dataView:{show:true,readOnly:false},
                magicType:{show:true,type:['line']},
                saveAsImage:{show:true}
            }
        },
        calculable:true,
        xAxis:{
            type:'category',
            boundaryGap:false,
            data:chartviewObj.xAxis
        },
        yAxis:{
            name:'业务量'+unit,
            type:'value',
            min:0,
            max:maxy,
            splitNumber:1
        },
        series:tep
    }
    return option;
}

function GetOption(){
 ///initECharts("pie")
    /// 基于准备好的demo，初始化ECharts实列
    var myChart=echarts.init(document.getElementById("openEChartsEast"));
     ///指定图表的配置项和数据
     var option={
        title:{
            text:''  ///图形标题
        },
        tooltip:{
            ///show:false,                    ///关闭悬浮提示
            trigger:'item',                ///设置触发类型，默认数据触发
            formatter:"{a} <br/>{b}: {c} ({d}%)"   ///设置提示框显示内容   {a}指series.data的name   {c}指series.data的value  {d}%指这一部分占总数的百分比
        },
        legend:{
            orient:'vertical',
            x:'left',
            data:[
                {value:12,name:'正常'},
                {value:1,name:'故障'},
                {value:0,name:'离线'}
            ]
        },
        series:[{
            type:'pie',
            radius:['50%','70%'],   ///第一个百分比设置内圈大小，第二个百分比设置外圈大小
            ///roseType:'area',     ///是否显示成南丁格尔图，默认false
            hoverAnimation:false,   ///是否开启hover在扇形区上的放大动画效果
            silent:true,            ///图形是否不响应和触发鼠标事件，默认为false，即响应和触发鼠标事件
            ///center:['80%','40%'],   ///第一个百分比设置水平位置，第二个百分比设置垂直位置
            data:[
                {value:12,name:'正常'},
                {value:1,name:'故障'},
                {value:0,name:'离线'}
            ]
        }]
   };
    myChart.setOption(option,true);
}