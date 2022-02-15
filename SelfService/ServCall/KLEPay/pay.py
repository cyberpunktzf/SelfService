import requests
from django.http import HttpResponse,JsonResponse
import hashlib
import random
import string
import json
import ast
#import xmltodict
from ServCall.KLEPay.config import getConfig
from ServCall.KLEPay import common
import urllib.request
import requests
from SelfServPy.Common import ss_extdetailsCtl 
from SelfServPy.Common import ss_refundsingleCtl 
import time
from SelfServPy.ApplicationFrameWork import Tools
from SelfServPy.ApplicationFrameWork import ClsHisOperation as ClsHisOP
from SelfServPy.Common import business_detailsCtl as BDCtl
from ServCall.HIS.Common.Webservices import CallHISWS
# 扫码支付 患者主扫 打开微信 或支付宝 扫一扫进行支付  需要返回支付二维码
# 返回 false 不需要第三方支付
#       0 创建订单成功
#       非0  创建订单失败
def Pay(ClsHisOPObj):   
    #print("开始第三方支付")
    # 支付
    # 1. 获取支付入参
    InputJson = common.get_pay_param(ClsHisOPObj,"Y")
    if not InputJson:
        return False
    InputJson = json.dumps(InputJson)
    #print("2.1获取支付入参",InputJson)

    # 2. 申请令牌
    token = json.loads(apply_token())
    if not token.get('result'):
        msg = "申请token失败:" + token.get('message')
        raise Exception(msg)
    token = token.get('result')
    # 3. 支付接口调用
    payRtn = DoRequest(InputJson,getConfig('payAdd'),token.get('accessToken'))
    #print("2.1获取支付",payRtn)
    # 4. 保存接口返回值
    InputJson = common.get_pay_param(ClsHisOPObj,"")
    SaveExtInfo(ClsHisOPObj,InputJson,payRtn,"Pay") 

    # 5. 构造返回值
    payRtn = json.loads(payRtn)
    # {'code': 11200002, 'sign': '2FBC9D921800C6A6D0BBFA7F2102308D', 'message': '重复的商户订单号', 'sign_type': 'MD5'}
    result = "-1"
    qcrode = ""
    msg = ""
    if payRtn.get("code") == 200:
        result = "1"
        qcrode = payRtn.get('result').get('qrcode_content')
    else:
        result = payRtn.get("code")
        msg = payRtn.get("message")
    payRtn = {
        "result" : result,
        "qcrode" : qcrode,
        'msg':msg
    }
    #构造返回值 结束
    return payRtn
#查询订单状态
# 0 支付成功
# 1 需要继续查询
# false 非第三方支付
def QueryPay(ClsHisOPObj):
    #print("开始查询订单状态")
    # 查询
    # 1.获取查询入参
    InputJson = common.get_querypay_param(ClsHisOPObj,"Y")
    if not InputJson:
        return False
    InputJson = json.dumps(InputJson)
    #print("2.1获取查询订单状态入参",InputJson)
    # 2. 申请令牌
    token = json.loads(apply_token())
    if not token.get('result'):
        msg = "申请token失败:" + token.get('message')
        raise Exception(msg)
    token = token.get('result')
    # 3.接口调用
    payRtn = DoRequest(InputJson,getConfig('queryAdd'),token.get('accessToken'))
    #print("2.1获取查询订单状态",payRtn)
    # 4. 保存接口返回值
    InputJson = common.get_querypay_param(ClsHisOPObj,"")
    extid = str(SaveExtInfo(ClsHisOPObj,InputJson,payRtn,"Query"))
    # 5. 构造返回值
    result = "-1"
    rtnoutput = ""
    msg = ""
    payRtn = json.loads(payRtn)
    if payRtn.get("code") == 200:
        payresult = payRtn.get("result")
        pay_status = payresult.get('status')
        if pay_status == "pay_success":
            result = "0"
        else:
            result = "1"
    else:
        result = payRtn.get("code")
        msg = payRtn.get("message")

    payRtn = {
        "result":result,
        "rtnoutput":rtnoutput,
        "msg":msg,
        'extid':extid
    }
    return payRtn
#退费
def Refund(ClsHisOPObj):
    #print("开始第三方退费")
    # 1. 申请令牌
    token = json.loads(apply_token())
    if not token.get('result'):
        msg = "申请token失败:" + token.get('message')
        raise Exception(msg)
    token = token.get('result')
    # 2查询
    # 2.1获取查询入参
    InputJson = common.get_refund_param(ClsHisOPObj,"Y")
    InputJson = json.dumps(InputJson)
    #print("2.1获取退费入参",InputJson)
    payRtn = DoRequest(InputJson,getConfig('refundAdd'),token.get('accessToken'))
    #print("2.1获取退费",payRtn)
    #保存返回值
    InputJson = common.get_refund_param(ClsHisOPObj,"")
    SaveExtInfo(ClsHisOPObj,InputJson,payRtn,"Refund")
    return payRtn
#关闭
def Close(ClsHisOPObj):
    #print("开始第三方关闭")
    # 1. 申请令牌
    token = json.loads(apply_token())
    if not token.get('result'):
        msg = "申请token失败:" + token.get('message')
        raise Exception(msg)
    token = token.get('result')
    # 2查询
    # 2.1获取查询入参
    InputJson = common.get_close_param(ClsHisOPObj,"Y")
    InputJson = json.dumps(InputJson)
    #print("2.1获取关闭入参",InputJson)
    payRtn = DoRequest(InputJson,getConfig('closeAdd'),token.get('accessToken'))
    #print("2.1获取关闭",payRtn)
    #保存返回值
    InputJson = common.get_close_param(ClsHisOPObj,"")
    SaveExtInfo(ClsHisOPObj,InputJson,payRtn,"Close")
    return payRtn
#撤销
def Cancel(ClsHisOPObj):
    #print("开始第三方撤销")
    # 1. 申请令牌
    token = json.loads(apply_token())
    if not token.get('result'):
        msg = "申请token失败:" + token.get('message')
        raise Exception(msg)
    token = token.get('result')
    # 2查询
    # 2.1获取查询入参
    InputJson = common.get_cancel_param(ClsHisOPObj,"Y")
    InputJson = json.dumps(InputJson)
    #print("2.1获取撤销入参",InputJson)
    payRtn = DoRequest(InputJson,getConfig('cancelAdd'),token.get('accessToken'))
    #print("2.1获取撤销",payRtn)
    #保存返回值
    InputJson = common.get_cancel_param(ClsHisOPObj,"")
    SaveExtInfo(ClsHisOPObj,InputJson,payRtn,"Cancel")
    return payRtn
#退费查询
def RefundQuery(ClsHisOPObj):
    #print("开始第三方退费查询")
    # 1. 申请令牌
    token = json.loads(apply_token())
    if not token.get('result'):
        msg = "申请token失败:" + token.get('message')
        raise Exception(msg)
    token = token.get('result')
    # 2查询
    # 2.1获取查询入参
    InputJson = common.get_refundquery_param(ClsHisOPObj,"Y")
    InputJson = json.dumps(InputJson)
    #print("2.1获取退费查询入参",InputJson)
    payRtn = DoRequest(InputJson,getConfig('refundQueryAdd'),token.get('accessToken'))
    #print("2.1获取退费查询",payRtn)
    #保存返回值
    InputJson = common.get_refundquery_param(ClsHisOPObj,"")
    SaveExtInfo(ClsHisOPObj,InputJson,payRtn,"RefundQuery")
    return payRtn
# 申请token
def apply_token():
    InputJson = common.get_apply_token()
    InputJson = json.dumps(InputJson)
    token = DoRequest(InputJson,"sys-auth/channel/oauth/token","")
    return token
# 主请求
def DoRequest(ParamJson,Paramaddress,token):
    try:
        #print("支付参数",ParamJson)
        #print("支付接口",Paramaddress)
        #print("支付权限",token)
        if token == "":
            headers = {
                "Content-Type" : "application/json"
            }
        else:
            headers = {
                "Content-Type" : "application/json",
                "Authorization-Token":token
            } 
        #print("headers",headers)
        url = getConfig("wxURl") + Paramaddress
        #page = urllib.request.urlopen(url)
        page = requests.post(url,data=ParamJson,headers=headers)
        
        #print(page.text)
        return page.text
    except Exception as e:
        print(e)
#保存第三方订单表
#InputJson
def SaveExtInfo(ClsHisOPObj,InputJson,payRtn,DoType):
    BDObj = ss_extdetailsCtl.EXTC()
    #print("保存Ext",payRtn)
    #print("保存ExtInputJson",InputJson)
    if isinstance(payRtn,str):
        payRtn = json.loads(payRtn)
    ss_extd_platno = ""
    ss_extd_amt = InputJson.get('order_amt')
    ss_extd_status = "0" #
    pay_option = InputJson.get('pay_option')
    ss_extd_hisno = InputJson.get('mch_order_id')
    #{'result': {'pay_time_end': '2021-10-31 07:38:22', 'out_trade_no': '4200001208202110316261019883', 'pay_option': 'WxPay', 'patient_type': '1', 'order_subject': '当日挂号', 'patient_id': '61449334', 'business_type': 'regist-day', 'mch_order_id': '69paymode66662021103173718', 'patient_name': '张梦晗', 'pay_type': 'SCANPAY', 'order_amt': 15.0, 'pay_id': '12001201187469817408794624', 'terminal_id': 'ZZJ24', 'status': 'pay_success'}, 'code': 200, 'sign': '2772E864CCD04225AFCAA5A24EBF4B9F', 'message': 'success', 'sign_type': 'MD5'}
    if payRtn.get('result'):
        if payRtn.get('result').get('pay_id'):
            ss_extd_platno = payRtn.get('result').get('pay_id')
        if payRtn.get('result').get('status'):
            status = payRtn.get('result').get('status')  
            if status == "pay_success":
                ss_extd_status = "1"
        if payRtn.get('result').get('order_amt'):
                ss_extd_amt = payRtn.get('result').get('order_amt')
        if payRtn.get('result').get('pay_option'):
            pay_option = payRtn.get('result').get('pay_option')
    ss_extd_extno = "" #kong
    Input = {
        "ss_extd_code":ClsHisOPObj.business_type,
        "ss_extd_amt":ss_extd_amt,
        "ss_extd_type":DoType,
        "ss_extd_status":ss_extd_status,
        "ss_extd_id":ClsHisOPObj.serial_id,
        "ss_extd_no":ClsHisOPObj.serial_number,
        "ss_extd_hisno": ss_extd_hisno,
        "ss_extd_platno": ss_extd_platno,
        "ss_extd_extno":'',
        "ss_extd_channel":pay_option,
        "ss_extd_outinfo":payRtn,
        "ss_extd_ininfo":InputJson,
        "ss_extd_creator":ClsHisOPObj.client_dict.get('ss_eqlistd_eqcode')
    }
    BDObj.insert(Input)   
    return BDObj.result
#支付平台回调
# 处理支付成功，但是HIS返回的情况(同时点支付和返回)
def PayCallBack(RequestInput):
    #return HttpResponse({"code":"200","message":"success"},content_type="application/json,charset=utf-8")
    #print("支付平台回调",RequestInput)
    #print("支付平台回调CS",RequestInput.body)
    #'{"sign":"9D27AC6B3CDC000C354344E2D211EEC5","status":"pay_success","sign_type":"MD5","event_type":11001,"org_code":"50821","mch_appid":"1629983059933605","pay_id":"12001201173884226356260864","mch_order_id":"21408paymode6666202192319546","out_trade_no":"4200001134202109236304590985","notify_message":"\xe8\xae\xa2\xe5\x8d\x95\xe6\x94\xaf\xe4\xbb\x98\xe6\x88\x90\xe5\x8a\x9f","extend_params":"","cash_fee":null,"cash_trade_status":null,"insurance_trade_status":null,"insurance_fee":null,"insurance_self_fee":null,"insurance_fund_fee":null,"insurance_other_fee":null,"insurance_order_id":null,"cash_order_id":null,"auth_no":null,"total_freeze_amount":null,"rest_amount":null,"total_pay_amount":null,"total_unfreeze_amount":null,"gmt_create":null,"gmt_trans":null,"user_id":null,"pay_type":null}'
    try:
        RequestBody = RequestInput.body
        if RequestBody:
            RequestBody = RequestBody #.replace('b',"")
            RequestDict = json.loads(RequestBody)
            pay_status = RequestDict.get('status')
            RequestString = json.dumps(RequestDict)
            pay_id = RequestDict.get('pay_id')
            if pay_status == "pay_success": #第三方支付成功
                BusinessMasterId = ""
                #查询HIS订单信息
                BDObj = ss_extdetailsCtl.EXTC()
                Input = {
                    "ss_extd_platno":pay_id,
                    'ss_extd_type':'Pay'
                }
                BDObj.query(Input)
                if BDObj.queryset:
                    ALLQuerySet = BDObj.queryset[0]
                    ss_extd_no = getattr(ALLQuerySet,'ss_extd_no') 
                    refund_amt = getattr(ALLQuerySet,'ss_extd_amt')  
                    BusinessMasterId = Tools.getBMIDByBMNO(ss_extd_no)
                if BusinessMasterId == "":
                    return HttpResponse({"code":"200","message":"success"},content_type="application/json,charset=utf-8")
                #将通知信息插入第三方订单表
                EXTCObj = ss_extdetailsCtl.EXTC()
                InputEXTX = {
                    "ss_extd_code": getattr(ALLQuerySet,'ss_extd_code'),
                    "ss_extd_amt": getattr(ALLQuerySet,'ss_extd_amt'),
                    "ss_extd_type": 'notify',
                    "ss_extd_status": getattr(ALLQuerySet,'ss_extd_status'),
                    "ss_extd_id": getattr(ALLQuerySet,'ss_extd_id'),
                    "ss_extd_no": getattr(ALLQuerySet,'ss_extd_no'),
                    "ss_extd_hisno": getattr(ALLQuerySet,'ss_extd_hisno'),
                    "ss_extd_platno": getattr(ALLQuerySet,'ss_extd_platno'),
                    "ss_extd_extno":getattr(ALLQuerySet,'ss_extd_extno'),
                    "ss_extd_channel": getattr(ALLQuerySet,'ss_extd_channel'),
                    "ss_extd_outinfo": '',
                    "ss_extd_ininfo": RequestString,
                    "ss_extd_creator": getattr(ALLQuerySet,'ss_extd_creator')
                }
                EXTCObj.insert(InputEXTX)
                #根据自助机流水号获取HIS流水号
                #{"sign": "D10B530550538DE9C4DE362644F4CEA2", "status": "pay_success", "sign_type": "MD5", "event_type": 11001, "org_code": "50821", "mch_appid": "1629983059933605", "pay_id": "12001201201370967426084864", "mch_order_id": "539844paymode6666202112816163", "out_trade_no": "4200001146202112082661149538", "order_amt": 15.0, "pay_time": "2021-12-08 16:16:38", "notify_message": "\u8ba2\u5355\u652f\u4ed8\u6210\u529f"}
                BDserial_number = RequestDict.get('mch_order_id')
                BDObjNew = BDCtl.BD()
                queryParam = {'fk_businessmaster_id':int(BusinessMasterId),"serial_number":BDserial_number}   
                BDObjNew.query(queryParam)
                HisTradeId = ""
                refund_amt_new = ""
                PayModeCode=""
                if BDObjNew.queryset:
                    ALLQuerySet = BDObjNew.queryset[0]
                    his_patinfo = getattr(ALLQuerySet,'intef_input')
                    if len(his_patinfo.split('&')) > 3: #&PayModeCode=WECHAT&PayModeId=46&CurrentPayOrd=202112091540274013652170&OrderAmt=41.51
                        HisTradeIdStr = his_patinfo.split('&')[3]
                        if len(HisTradeIdStr.split('=')) > 1:
                            HisTradeId = HisTradeIdStr.split('=')[1]
                        refund_amt_newStr = his_patinfo.split('&')[4]
                        refund_amt_new = refund_amt_newStr.split('=')[1]
                        #PayModeCode
                        PayModeCodeStr = his_patinfo.split('&')[1]
                        PayModeCode = PayModeCodeStr.split('=')[1]
                #print("#未取到HIS订单的 不撤销",ALLQuerySet)
                if HisTradeId == "":
                    return HttpResponse({"code":"200","message":"success"},content_type="application/json,charset=utf-8")       
                #设置退费标志
                RefundFlag = ""
                RequestStr = "<Request><TradeCode>ValidOPCharge</TradeCode><pay_amt>" + refund_amt_new + "</pay_amt><his_order_id>" + HisTradeId + "</his_order_id><payInfo>" + RequestString + "</payInfo></Request>"
                #print("# 调用HIS接口",RequestStr)
                #
                time.sleep(6)
                Response = CallHISWS(RequestStr)
                #print("Response",Response)
                if isinstance(Response,dict):
                    ResponseDic = Response
                else:
                    ResponseDic = json.loads(Response)
                HisResult = ResponseDic.get('code')
                if HisResult:
                    if str(HisResult) == "1":
                        RefundFlag = "Y"
                if RefundFlag != "Y":
                    return HttpResponse({"code":"200","message":"success"},content_type="application/json,charset=utf-8")
                #开始退费
                if RefundFlag == "Y":
                    #取患者基本信息
                    ClsHisOPObj = ClsHisOP.HISGlobalInfo()
                    ClsHisOPObj.BuildPTInfo(BusinessMasterId)
                    ClsHisOPObj.BuildHISPTInfo(BusinessMasterId)
                    #将需要退费的信息插入第三方订单表
                    RSC = ss_refundsingleCtl.RSC()
                    # fk_businessmaster_id	ss_ref_patname	ss_ref_patno	ss_ref_amt	ss_ref_ordamt	ss_ref_platno	ss_ref_input	ss_ref_output	ss_dcp_createdate	ss_dcp_creator	ss_dcp_update	ss_dcp_upuser	ss_ref_hisno	ss_ref_status	ss_ref_type
                    InputEXTX = {
                        "fk_businessmaster_id": BusinessMasterId,
                        "ss_ref_patname": ClsHisOPObj.patinfo_dict.get('name'),
                        "ss_ref_patno": ClsHisOPObj.his_patinfo_dict.get('his_unique_no') , #HIS患者唯一号码
                        "ss_ref_amt": refund_amt_new,
                        "ss_ref_ordamt": '',
                        "ss_ref_platno": pay_id,
                        "ss_ref_input": RequestString,
                        "ss_ref_output": Response + "#" + RequestStr,
                        "ss_ref_creator":'auto',
                        "ss_ref_hisno" : HisTradeId,
                        "ss_ref_status" : "0",
                        "ss_ref_type" : PayModeCode
                    }
                    RSC.insert(InputEXTX)
                    # 1. 申请令牌
                    ''' token = json.loads(apply_token())
                    if not token.get('result'):
                        msg = "申请token失败:" + token.get('message')
                        return HttpResponse({"result":0},content_type="application/json,charset=utf-8")
                    token = token.get('result')
                    # 2查询
                    # 2.1获取查询入参
                    InputJson = common.get_callback_refund_param(ss_extd_no,pay_id,refund_amt)
                    InputJson = json.dumps(InputJson)
                    #print("2.1获取退费回调入参",InputJson)
                    #print("BDOutPut",BDOutPut)
                    #print("BDOutPut1",BDOutPut1)
                    payRtn = DoRequest(InputJson,getConfig('refundAdd'),token.get('accessToken'))
                    # 保存退费结果
                    BDObj = BDCtl.BD()
                    Input = {
                        'fk_businessmaster_id':BusinessMasterId,
                        'modal_code':'AutoRefund',
                        'intef_code':'AutoRefund',
                        'intef_output':payRtn,
                        'intef_input':RequestStr
                    }
                    BDObj.insert(Input)'''
                    #print("回调结果",payRtn)
        return HttpResponse({"code":"200","message":"success"},content_type="application/json,charset=utf-8")
    except Exception as e:
        print("DOErrRef",str(e))
        return HttpResponse({"code":"100","message":"success"},content_type="application/json,charset=utf-8")
def RefundSingle(ParamDict):
    try:
        # 1. 申请令牌
        print("获取查询入参",ParamDict)
        ss_extd_no = ParamDict.get('ss_extd_no')
        pay_id = ParamDict.get('pay_id')
        refund_amt = ParamDict.get('refund_amt')
        BusinessMasterId = ParamDict.get('BusinessMasterId')
        token = json.loads(apply_token())
        if not token.get('result'):
            msg = "申请token失败:" + token.get('message')
            return False
        token = token.get('result')
        # 2查询
        # 2.1获取查询入参
        InputJson = common.get_callback_refund_param(ss_extd_no,pay_id,refund_amt)
        InputJson = json.dumps(InputJson)
        #print("2.1获取退费回调入参",InputJson)
        #print("BDOutPut",BDOutPut)
        #print("BDOutPut1",BDOutPut1)
        payRtn = DoRequest(InputJson,getConfig('refundAdd'),token.get('accessToken'))
        # 保存退费结果
        BDObj = BDCtl.BD()
        Input = {
            'fk_businessmaster_id':BusinessMasterId,
            'modal_code':'AutoRefund',
            'intef_code':'AutoRefund',
            'intef_output':payRtn,
            'intef_input':""
        }
        BDObj.insert(Input)
        return True
    except Exception as e:
        print("退费异常",str(e))
        return False
#支付平台回调
# 处理支付成功，但是HIS返回的情况(同时点支付和返回)
def PayCallBackold(RequestInput):
    #return HttpResponse({"code":"200","message":"success"},content_type="application/json,charset=utf-8")
    #print("支付平台回调",RequestInput)
    #print("支付平台回调CS",RequestInput.body)
    #'{"sign":"9D27AC6B3CDC000C354344E2D211EEC5","status":"pay_success","sign_type":"MD5","event_type":11001,"org_code":"50821","mch_appid":"1629983059933605","pay_id":"12001201173884226356260864","mch_order_id":"21408paymode6666202192319546","out_trade_no":"4200001134202109236304590985","notify_message":"\xe8\xae\xa2\xe5\x8d\x95\xe6\x94\xaf\xe4\xbb\x98\xe6\x88\x90\xe5\x8a\x9f","extend_params":"","cash_fee":null,"cash_trade_status":null,"insurance_trade_status":null,"insurance_fee":null,"insurance_self_fee":null,"insurance_fund_fee":null,"insurance_other_fee":null,"insurance_order_id":null,"cash_order_id":null,"auth_no":null,"total_freeze_amount":null,"rest_amount":null,"total_pay_amount":null,"total_unfreeze_amount":null,"gmt_create":null,"gmt_trans":null,"user_id":null,"pay_type":null}'
    try:
        RequestBody = RequestInput.body
        if RequestBody:
            RequestBody = RequestBody #.replace('b',"")
            RequestDict = json.loads(RequestBody)
            pay_status = RequestDict.get('status')
            RequestString = json.dumps(RequestDict)
            pay_id = RequestDict.get('pay_id')
            if pay_status == "pay_success": #第三方支付成功
                BusinessMasterId = ""
                #查询HIS订单信息
                BDObj = ss_extdetailsCtl.EXTC()
                Input = {
                    "ss_extd_platno":pay_id,
                    'ss_extd_type':'Pay'
                }
                BDObj.query(Input)
                if BDObj.queryset:
                    ALLQuerySet = BDObj.queryset[0]
                    ss_extd_no = getattr(ALLQuerySet,'ss_extd_no') 
                    refund_amt = getattr(ALLQuerySet,'ss_extd_amt')  
                    BusinessMasterId = Tools.getBMIDByBMNO(ss_extd_no)
                if BusinessMasterId == "":
                    return HttpResponse({"code":"200","message":"success"},content_type="application/json,charset=utf-8")
                #根据自助机流水号获取HIS流水号
                BDserial_number = RequestDict.get('mch_order_id')
                BDObjNew = BDCtl.BD()
                queryParam = {'fk_businessmaster_id':int(BusinessMasterId),"serial_number":BDserial_number}   
                BDObjNew.query(queryParam)
                HisTradeId = ""
                refund_amt_new = ""
                if BDObjNew.queryset:
                    ALLQuerySet = BDObjNew.queryset[0]
                    his_patinfo = getattr(ALLQuerySet,'intef_input')
                    if len(his_patinfo.split('&')) > 3:
                        HisTradeIdStr = his_patinfo.split('&')[3]
                        if len(HisTradeIdStr.split('=')) > 1:
                            HisTradeId = HisTradeIdStr.split('=')[1]
                        refund_amt_newStr = his_patinfo.split('&')[4]
                        refund_amt_new = refund_amt_newStr.split('=')[1]
                #未取到HIS订单的 不撤销
                if HisTradeId == "":
                    return HttpResponse({"code":"200","message":"success"},content_type="application/json,charset=utf-8")       
                #设置退费标志
                RefundFlag = ""
                RequestStr = "<Request><TradeCode>ValidOPCharge</TradeCode><pay_amt>" + refund_amt_new + "</pay_amt><his_order_id>" + HisTradeId + "</his_order_id><payInfo>" + RequestString + "</payInfo></Request>"
                # 调用HIS接口
                #
                time.sleep(6)
                Response = CallHISWS(RequestStr)
                if isinstance(Response,dict):
                    ResponseDic = Response
                else:
                    ResponseDic = json.loads(Response)
                HisResult = ResponseDic.get('code')
                if HisResult:
                    if str(HisResult) == "0":
                        RefundFlag = "Y"
                if RefundFlag != "Y":
                    return HttpResponse({"code":"200","message":"success"},content_type="application/json,charset=utf-8")
                #开始退费
                if RefundFlag == "Y":
                    # 1. 申请令牌
                    token = json.loads(apply_token())
                    if not token.get('result'):
                        msg = "申请token失败:" + token.get('message')
                        return HttpResponse({"result":0},content_type="application/json,charset=utf-8")
                    token = token.get('result')
                    # 2查询
                    # 2.1获取查询入参
                    InputJson = common.get_callback_refund_param(ss_extd_no,pay_id,refund_amt)
                    InputJson = json.dumps(InputJson)
                    #print("2.1获取退费回调入参",InputJson)
                    #print("BDOutPut",BDOutPut)
                    #print("BDOutPut1",BDOutPut1)
                    payRtn = DoRequest(InputJson,getConfig('refundAdd'),token.get('accessToken'))
                    # 保存退费结果
                    BDObj = BDCtl.BD()
                    Input = {
                        'fk_businessmaster_id':BusinessMasterId,
                        'modal_code':'AutoRefund',
                        'intef_code':'AutoRefund',
                        'intef_output':payRtn,
                        'intef_input':RequestStr
                    }
                    BDObj.insert(Input)
                    #print("回调结果",payRtn)
        return HttpResponse({"code":"200","message":"success"},content_type="application/json,charset=utf-8")
    except Exception as e:
        print("DOErrRef",str(e))
        return HttpResponse({"code":"100","message":"success"},content_type="application/json,charset=utf-8")
