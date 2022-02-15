# HIS 操作业务
from SelfServPy.Common import ss_refundsingleCtl 
from ServCall.KLEPay.pay import RefundSingle
from ServCall.HIS.Common.Webservices import CallHISWS
import json
from django.http import HttpResponse,JsonResponse
from SelfServPy.ApplicationFrameWork import Tools
import datetime
# 
def AutoRefund(ParamRequest):
    try:
        #查询HIS订单信息
        print('开始退单边')
        RSCObj = ss_refundsingleCtl.RSC()
        QueryInput = {
            "ss_ref_status" : "0",
            "ss_ref_type" : "KLE"
        }
        ss_ref_platno = ""
        if ParamRequest:
            if ParamRequest.get('ss_ref_platno'):
                ss_ref_platno = ParamRequest.get('ss_ref_platno')
                QueryInput = {
                    "ss_ref_status" : "0",
                    "ss_ref_type" : "KLE",
                    "ss_ref_platno":ss_ref_platno
                }
        RSCObj.query(QueryInput)
        print('查询结束')
        if RSCObj.queryset: #查到了 ‘
            tmpRefund = 0
            for tmpRSCObj in RSCObj.queryset:
                tmpRefund += 1
                print("退费:",tmpRefund)
                ALLQuerySet = tmpRSCObj
                RSCID = getattr(ALLQuerySet,'id') 
                RefundParam = {
                    'BusinessMasterId' : getattr(ALLQuerySet,'fk_businessmaster_id') ,
                    'ss_ref_patname' : getattr(ALLQuerySet,'ss_ref_patname'),
                    'ss_ref_patno' : getattr(ALLQuerySet,'ss_ref_patno'),
                    'ss_extd_no' : getattr(ALLQuerySet,'ss_ref_hisno'),
                    'refund_amt' : getattr(ALLQuerySet,'ss_ref_amt'),
                    'pay_id' : getattr(ALLQuerySet,'ss_ref_platno')

                }
                print("退费参数",RefundParam)
                #判断退费时间
                CurTime = Tools.getDefStDate(0, formatterType="0")
                HourData = int(CurTime[3])
                MData = int(CurTime[4])
                refundDate =  getattr(ALLQuerySet,'ss_ref_createdate')
                CurDT = datetime.datetime(int(CurTime[0]), int(CurTime[1]), int(CurTime[2]), HourData, MData, tzinfo=None)
                minDate = CurDT-refundDate
                minDateHourStr = str(minDate).split(':')[0]
                minDateMinStr = str(minDate).split(':')[1]
                print("时间间隔",minDate) 
                #退几分钟前的
                allowDate = 2
                if int(minDateHourStr) > 0:
                    pass
                else: #不足一小时的
                    if int(minDateMinStr) <= allowDate:
                        return HttpResponse({"code":"201","message":"success"},content_type="application/json,charset=utf-8")
                #调用HIS接口 判断是否允许退费
                inputjson = getattr(ALLQuerySet,'ss_ref_input')
                #inputjson = inputjson.replace("'",'"')
                #inputjson = json.dumps(inputjson)
                #inputjson = json.loads(inputjson)
                RequestStr = "<Request><TradeCode>ValidOPCharge</TradeCode><pay_amt>" + getattr(ALLQuerySet,'ss_ref_amt')   + "</pay_amt><his_order_id>" + getattr(ALLQuerySet,'ss_ref_hisno') + "</his_order_id><payInfo>" + inputjson + "</payInfo></Request>"
                # 调用HIS接口
                print("HIS入参",RequestStr)
                Response = CallHISWS(RequestStr)
                if isinstance(Response,dict):
                    ResponseDic = Response
                else:
                    ResponseDic = json.loads(Response)
                print("是否允许退费",ResponseDic)
                HisResult = ResponseDic.get('code')
                if HisResult:
                    if str(HisResult) == "0": #HIS返回是0才允许退费
                        rtn = RefundSingle(RefundParam)
                        if rtn:
                            RSCObj = ss_refundsingleCtl.RSC()
                            RSCObj.delete({"id":int(RSCID)}) 
                    else:
                        RSCObj = ss_refundsingleCtl.RSC()
                        RSCObj.insert({"id":int(RSCID),'ss_ref_status':'-2'})            
        #
    except Exception as e:
        print("退费异常",e)
    finally:
        return HttpResponse({"code":"200","message":"success"},content_type="application/json,charset=utf-8") 