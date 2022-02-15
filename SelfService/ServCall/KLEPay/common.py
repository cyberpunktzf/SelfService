import hashlib
import random
import string
import json
import ast
from SelfServPy.Common.LogCtl import SaveSYSLog
from ServCall.KLEPay.config import getConfig
from SelfServPy.ApplicationFrameWork import Tools
from SelfServPy.Common import ss_extdetailsCtl 

#支付状态查询
def get_querypay_param(ClsHisOPObj,SignFlag):
    try:
        #查询
        #支付方式
        UserOperationDic = Tools.GetUserOperation(ClsHisOPObj.serial_id,"paymode")
        PayModeCode = UserOperationDic.get('PayModeCode')
        if PayModeCode != "WECHAT" and PayModeCode != "AlIPAY":
            return False #不需要微信支付宝支付
        # 1. 取支付订单
        BDObj = ss_extdetailsCtl.EXTC()
        Input = {
            "ss_extd_code":ClsHisOPObj.business_type,
            "ss_extd_type":"Pay",
            "ss_extd_status":"0",
            "ss_extd_id":ClsHisOPObj.serial_id,
            "ss_extd_no":ClsHisOPObj.serial_number,
            "ss_extd_creator":ClsHisOPObj.client_dict.get('ss_eqlistd_eqcode')
        }
        BDObj.query(Input) 
        EXTOBJ = {}
        if BDObj.queryset:
            EXTOBJ = BDObj.queryset[0]
        else:
            raise Exception('支付状态查询失败未查询到支付订单')

        mch_order_id = getattr(EXTOBJ,'ss_extd_hisno')
        pay_id =  getattr(EXTOBJ,'ss_extd_platno')
        out_trade_no = ""

        tmpDict = {
            "org_code":	getConfig("org_code"),#String	Y	32	机构编码
            "mch_appid":getConfig("appid")	,#String	Y	32	商户APPID(巨鼎开放平台申请分配)

            "mch_order_id"	: mch_order_id ,#String	32	N	商户支付订单号
            "pay_id"	: pay_id ,#String	32	N	巨鼎平台支付订单号
            "out_trade_no"	: out_trade_no ,#String	32	N	微信/支付宝/.订单号

            "sign"	: "" ,#String	32	Y	签名，见《附录》第11项（签名与验签机制）
            "sign_type"	: "MD5" #String	32	Y	签名类型，目前支持MD5，默认为MD5
        }
        tmpDict1 = ""
        if SignFlag == "Y":
            tmpDict1 = __getSign(tmpDict)
        tmpDict['sign'] = tmpDict1
        return tmpDict
    except Exception as e:
        raise Exception("get_querypay_param" + str(e))
#退费状态查询
def get_refundquery_param(ClsHisOPObj,SignFlag):
    try:
        #查询
        # 1. 取支付订单
        BDObj = ss_extdetailsCtl.EXTC()
        Input = {
            "ss_extd_code":ClsHisOPObj.business_type,
            "ss_extd_type":"Pay",
            "ss_extd_status":"0",
            "ss_extd_id":ClsHisOPObj.serial_id,
            "ss_extd_no":ClsHisOPObj.serial_number,
            "ss_extd_creator":ClsHisOPObj.client_dict.get('ss_eqlistd_eqcode')
        }
        BDObj.query(Input) 
        EXTOBJ = {}
        if BDObj.queryset:
            EXTOBJ = BDObj.queryset[0]
        else:
            raise Exception('支付状态查询失败未查询到支付订单')

        mch_order_id = getattr(EXTOBJ,'ss_extd_hisno')
        pay_id =  getattr(EXTOBJ,'ss_extd_platno')
        out_trade_no = ""

        tmpDict = {
            "org_code":	getConfig("org_code"),#String	Y	32	机构编码
            "mch_appid":getConfig("appid")	,#String	Y	32	商户APPID(巨鼎开放平台申请分配)

            "mch_order_id"	: mch_order_id ,#String	32	N	商户支付订单号
            "pay_id"	: pay_id ,#String	32	N	巨鼎平台支付订单号
            "out_trade_no"	: out_trade_no ,#String	32	N	微信/支付宝/.订单号

            "sign"	: "" ,#String	32	Y	签名，见《附录》第11项（签名与验签机制）
            "sign_type"	: "MD5" #String	32	Y	签名类型，目前支持MD5，默认为MD5
        }
        tmpDict1 = ""
        if SignFlag == "Y":
            tmpDict1 = __getSign(tmpDict)
        tmpDict['sign'] = tmpDict1
        return tmpDict
    except Exception as e:
        raise Exception("get_refundquery_param" + str(e))
# 退费
def get_refund_param(ClsHisOPObj,SignFlag):
    try:
        # 1. 取支付订单
        BDObj = ss_extdetailsCtl.EXTC()
        Input = {
            "ss_extd_code":ClsHisOPObj.business_type,
            "ss_extd_type":"Pay",
            "ss_extd_status":"0",
            "ss_extd_id":ClsHisOPObj.serial_id,
            "ss_extd_no":ClsHisOPObj.serial_number,
            "ss_extd_creator":ClsHisOPObj.client_dict.get('ss_eqlistd_eqcode')
        }
        BDObj.query(Input) 
        EXTOBJ = {}
        if BDObj.queryset:
            EXTOBJ = BDObj.queryset[0]
        else:
            raise Exception('退费失败未查询到支付订单')  
        # 1取支付订单结束
        refund_reason = "HIS支付失败"
        tmpDict = {
            "org_code":	getConfig("org_code"),#String	Y	32	机构编码
            "mch_appid":getConfig("appid")	,#String	Y	32	商户APPID(巨鼎开放平台申请分配)
            'mch_order_id'	: "R" + getattr(EXTOBJ,'ss_extd_hisno') ,#String	32	Y	商户退款订单号
            'mch_notify_url'	: getConfig("notify_url") ,#String	512	N	商户回调通知地址
            'pay_id'	: getattr(EXTOBJ,'ss_extd_platno') ,#String	32	三选一	巨鼎平台支付订单号（推荐使用巨鼎支付订单号退费）
            'mch_pay_order_id'	: '' ,#String	32	三选一	商户在巨鼎支付平台下单支付订单号
            'pay_out_trade_no'	: '' ,#String	32	三选一	微信/支付宝/...支付订单号
            'refund_amt' :	getattr(EXTOBJ,'ss_extd_amt'),	#12,2	Y	退款金额，单位元
            'refund_reason'	: refund_reason ,#String	512	Y	退款原因
            'extend_params'	: '' ,#String	512	N	扩展参数/回传信息
            'sign'	: '' ,#String	32	Y	签名，见《附录》第11项（签名与验签机制）
            'sign_type'	: 'MD5' ,#String	32	Y	签名类型，目前支持MD5，默认为MD5
            'part_refund_type'	: '' ,#String	32	N	医保退费类型，非必填,不填则全退，CASH_ONLY 则只退现金部分
            'request_content'	: '' ,#String		N	透传医保局，非必填，有需要透传数据到医保局时填写
            'cancel_bill_no'	: '' ,#String	20	N	医保撤销单据号
            'cancel_serial_no'	: '' #String	20	N	医保撤销流水号
        }
        tmpDict1 = ""
        if SignFlag == "Y":
            tmpDict1 = __getSign(tmpDict)
        tmpDict['sign'] = tmpDict1
        return tmpDict
    except Exception as e:
        raise Exception("get_pay_param失败" + str(e))
# 撤销 会退费
def get_cancel_param(ClsHisOPObj,SignFlag):
    try:
        # 1. 取支付订单
        BDObj = ss_extdetailsCtl.EXTC()
        Input = {
            "ss_extd_code":ClsHisOPObj.business_type,
            "ss_extd_type":"Pay",
            "ss_extd_status":"0",
            "ss_extd_id":ClsHisOPObj.serial_id,
            "ss_extd_no":ClsHisOPObj.serial_number,
            "ss_extd_creator":ClsHisOPObj.client_dict.get('ss_eqlistd_eqcode')
        }
        BDObj.query(Input) 
        EXTOBJ = {}
        if BDObj.queryset:
            EXTOBJ = BDObj.queryset[0]
        else:
            raise Exception('退费失败未查询到支付订单')  
        # 1取支付订单结束
        tmpDict = {
            "org_code":	getConfig("org_code"),#String	Y	32	机构编码
            "mch_appid":getConfig("appid")	,#String	Y	32	商户APPID(巨鼎开放平台申请分配)

            "mch_order_id"	: getattr(EXTOBJ,'ss_extd_hisno') ,#String	32	N	商户支付订单号
            "pay_id"	: getattr(EXTOBJ,'ss_extd_platno') ,#String	32	N	巨鼎平台支付订单号
            "out_trade_no"	:  '',#String	32	N	微信/支付宝/.订单号

            "sign"	: "" ,#String	32	Y	签名，见《附录》第11项（签名与验签机制）
            "sign_type"	: "MD5" #String	32	Y	签名类型，目前支持MD5，默认为MD5
        }
        tmpDict1 = ""
        if SignFlag == "Y":
            tmpDict1 = __getSign(tmpDict)
        tmpDict['sign'] = tmpDict1
        return tmpDict
    except Exception as e:
        raise Exception("get_pay_param失败" + str(e))
# 关闭
def get_close_param(ClsHisOPObj,SignFlag):
    try:
        # 1. 取支付订单
        BDObj = ss_extdetailsCtl.EXTC()
        Input = {
            "ss_extd_code":ClsHisOPObj.business_type,
            "ss_extd_type":"Pay",
            "ss_extd_status":"0",
            "ss_extd_id":ClsHisOPObj.serial_id,
            "ss_extd_no":ClsHisOPObj.serial_number,
            "ss_extd_creator":ClsHisOPObj.client_dict.get('ss_eqlistd_eqcode')
        }
        BDObj.query(Input) 
        EXTOBJ = {}
        if BDObj.queryset:
            EXTOBJ = BDObj.queryset[0]
        else:
            raise Exception('关闭失败查询到支付订单')  
        # 1取支付订单结束
        tmpDict = {
            "org_code":	getConfig("org_code"),#String	Y	32	机构编码
            "mch_appid":getConfig("appid")	,#String	Y	32	商户APPID(巨鼎开放平台申请分配)

            "mch_order_id"	: getattr(EXTOBJ,'ss_extd_hisno') ,#String	32	N	商户支付订单号
            "pay_id"	: getattr(EXTOBJ,'ss_extd_platno') ,#String	32	N	巨鼎平台支付订单号
            "out_trade_no"	: '' ,#String	32	N	微信/支付宝/.订单号

            "sign"	: "" ,#String	32	Y	签名，见《附录》第11项（签名与验签机制）
            "sign_type"	: "MD5" #String	32	Y	签名类型，目前支持MD5，默认为MD5
        }
        tmpDict1 = ""
        if SignFlag == "Y":
            tmpDict1 = __getSign(tmpDict)
        tmpDict['sign'] = tmpDict1
        return tmpDict
    except Exception as e:
        raise Exception("get_pay_param失败" + str(e))
#支付        
def get_pay_param(ClsHisOPObj,SignFlag):
    try:
        IDNO = ClsHisOPObj.patinfo_dict.get('idno')
        PatName = ClsHisOPObj.patinfo_dict.get('name')
        HospId = ClsHisOPObj.terminal_dict.get('hosp_id')
        UserCode = ClsHisOPObj.terminal_dict.get('user_code')
        UserID = ClsHisOPObj.terminal_dict.get('user_id')
        PatientName = PatName
        BusinessMasterId = ClsHisOPObj.serial_id
        CardNo = ClsHisOPObj.his_patinfo_dict.get('his_unique_no') 
        BusinessType = ClsHisOPObj.business_type

        #Interface
        mch_order_id = ""
        order_amt = "0.01" #单位元
        order_ccy = "" #
        order_subject = ""
        order_detail = ""
        pay_option = ""
        patient_id = CardNo
        patient_name = PatName

        #patient_type
        patient_type = ""
        AdmReasonDr = "1"
        UserOperationDic = Tools.GetUserOperation(BusinessMasterId,"insutype")
        DicInfo = UserOperationDic.get('Param')
        if DicInfo:
           AdmReasonDr = DicInfo
        patient_type = AdmReasonDr
        #
        terminal_id = ClsHisOPObj.client_dict.get('ss_eqlistd_eqcode')
        user_client_ip = ClsHisOPObj.client_dict.get('ss_eqlistd_ip')
        # business_type
        business_type = ""
        #预约挂号	regist-pre
        #当日挂号	regist-day
        #门诊缴费	outpat-fee
        #门诊充值	outpat-dep
        #病历本售卖	mrecord-sale
        #住院预交金	hospital-pre
        #餐费支付	pay-meal
        #停车费支付	pay-park
        #体检套餐支付	pay-physical
        #生活品支付	pay-toiletries
        #其他	other
        #
        time_expire = "300" #单位秒
        extend_params = ""
        sign = ""
        sign_type = "MD5"
        proxy_channel = ""


        UserOperationDic = Tools.GetUserOperation(BusinessMasterId,"paymode")
        PayModeCode = UserOperationDic.get('PayModeCode')

        #支付方式
        if PayModeCode == "WECHAT":
            pay_option = "WxPay"
        elif PayModeCode == "AlIPAY" :
            pay_option="AliPay"
        else:
            return False #不需要微信支付宝支付
        # 根据HIS业务取信息
        if  BusinessType == "DRINCRNO":
            UserOperationDic = Tools.GetUserOperation(BusinessMasterId,"getpredetails")   
            mch_order_id = UserOperationDic.get('OrderCode')
            order_amt = UserOperationDic.get('PayAmt')
            #
            order_subject = "医生加号"
            order_detail = "医生加号"
            #
            business_type = "regist-day"
        elif BusinessType =="Reg":
            BDOutPut = Tools.GeBDOutPut(BusinessMasterId,intef_code = '10015')
            ScheduleItemCode = Tools.GetXMLNode(BDOutPut,'ScheduleItemCode') 
            mch_order_id = Tools.GetXMLNode(BDOutPut,'TransactionId') 
            order_amt = Tools.GetXMLNode(BDOutPut,'RegFee')
            #
            order_subject = "当日挂号"
            order_detail = "当日挂号"
            #
            business_type = "regist-day"
        elif BusinessType =="OBTNO":
            BDOutPut = Tools.GeBDOutPut(BusinessMasterId,'pay','10015')
            ScheduleItemCode = Tools.GetXMLNode(BDOutPut,'ScheduleItemCode') 
            mch_order_id = Tools.GetXMLNode(BDOutPut,'TransactionId')
            BDOutPut = Tools.GetUserOperation(BusinessMasterId,'getpredetails')
            order_amt = BDOutPut.get('PayAmt')
            #
            order_subject = "取号"
            order_detail = "取号"
            #
            business_type = "regist-pre"
        elif BusinessType =="Charge":
            BDOutPut = Tools.GetUserOperation(BusinessMasterId,'chargeshow','4905',"XML")
            order_amt = Tools.GetXMLNode(BDOutPut,'OrderSum') 
            mch_order_id = Tools.GetXMLNode(BDOutPut,'OrderNo') 
            #
            order_subject = "门诊收费"
            order_detail = "门诊收费"
            #
            business_type = "outpat-fee"

        BDOutPut = Tools.GetUserOperation(BusinessMasterId,'chargeshow','4905',"XML")
        if BDOutPut:
            if BDOutPut !="":
                order_amt = Tools.GetXMLNode(BDOutPut,'OrderSum') 
                mch_order_id = Tools.GetXMLNode(BDOutPut,'OrderNo') 
                #
                order_subject = "门诊收费"
                order_detail = "门诊收费"
                #
                business_type = "outpat-fee"
        
        INSURtn = Tools.GeBDOutPut(BusinessMasterId,intef_code = 'GetInsuAmt') #患者自负金额^医保账户支付金额$医保支付方式1!医保支付方式1金额$医保支付方式2!医保支付方式2金额……
        order_amt = INSURtn.split('^')[0]
        order_amt = str(Tools.formatterAmt(order_amt))
        #order_amt = "0.01" #单位元
        #取支付方式操作的流水号
        GeBDAllDic = Tools.GeBDAll(BusinessMasterId,"paymode")
        mch_order_id = GeBDAllDic.get('serial_number')
        tmpDict = {
            "org_code":	getConfig("org_code"),#String	Y	32	机构编码
            "mch_appid":getConfig("appid")	,#String	Y	32	商户APPID(巨鼎开放平台申请分配)
            "mch_order_id":	mch_order_id,#String	Y	32	商户订单号
            "mch_notify_url":getConfig("notify_url")	,#String	N	512	商户回调通知地址
            "order_amt": order_amt	,#BigDecimal	Y		订单金额，单位元
            "order_ccy": order_ccy	,#String	N	3	订单币种，默认CNY
            "order_subject": order_subject	,#String	Y	128	订单主题/商品
            "order_detail":	order_detail,#String	N	2048	订单详情/说明
            "pay_option":	pay_option,#String	Y	32	支付方式，见《附录》第3项（支付方式）
            "patient_id":	patient_id,#String	N	32	患者ID
            "patient_name":	patient_name, #String	N	64	患者姓名

            "patient_type"	:patient_type,#String	N	32	患者类型
            "terminal_id"	: terminal_id ,#String	Y	32	终端编号
            "user_client_ip"	: user_client_ip ,#String	Y	32	客户端IP
            "business_type"	: business_type ,#String	Y	32	业务类型，见《附录》第8项（商户业务类型）
            "time_expire" : time_expire ,#,	int	N	10	支付过期时间，单位秒：最大15天（1296000秒）
            "extend_params"	: extend_params ,#String	N	512	扩展字段/回传信息
            "sign"	: "" ,#String	Y	32	签名，见《附录》第11项（签名与验签机制）
            "sign_type"	: sign_type ,#String	Y	32	签名类型，目前支持MD5，默认为MD5
            "proxy_channel"	: proxy_channel  #String	N	16	代理下单渠道，见《附录》第10项（农行代理微信/支付宝支付下单时必传）
        }
        tmpDict1 = ""
        if SignFlag == "Y":
            tmpDict1 = __getSign(tmpDict)
        tmpDict['sign'] = tmpDict1
        return tmpDict
    except Exception as e:
        raise Exception("get_pay_param失败" + str(e))
def get_apply_token():
    #'appid': '1629983059933605',
    #'APPSECRET': 'A09462711DC94490AD803D7BC9983545', 
    tmpDict = {
        'appKey':getConfig('appid'),
        'appSecret':getConfig('APPSECRET')
    }
    return tmpDict
# 计算签名 
def __getSign(kwargs):
    keys, paras = sorted(kwargs), []
    paras = ['{}={}'.format(key, kwargs[key]) for key in keys if key != 'sign_type' and key != 'sign' and kwargs.get(key) != '']
    stringA = '&'.join(paras)
 
    stringSignTemp = stringA + '&key=' + getConfig("APPSECRET")
    #print("sign")
    #print(stringSignTemp)
    sign = __MD5(stringSignTemp).upper()
    return sign
# 获取MD5
def __MD5(InputStr):
    md5 = hashlib.md5()
    md5.update(InputStr.encode('utf-8'))
    return md5.hexdigest()
def get_callback_refund_param(ss_extd_no,pay_id,refund_amt):
    tmpDict = {
        "org_code":	getConfig("org_code"),#String	Y	32	机构编码
        "mch_appid":getConfig("appid")	,#String	Y	32	商户APPID(巨鼎开放平台申请分配)
        'mch_order_id'	: "C" + ss_extd_no ,#String	32	Y	商户退款订单号
        'mch_notify_url'	: getConfig("notify_url") ,#String	512	N	商户回调通知地址
        'pay_id'	:pay_id,#String	32	三选一	巨鼎平台支付订单号（推荐使用巨鼎支付订单号退费）
        'mch_pay_order_id'	: '' ,#String	32	三选一	商户在巨鼎支付平台下单支付订单号
        'pay_out_trade_no'	: '' ,#String	32	三选一	微信/支付宝/...支付订单号
        'refund_amt' :	refund_amt,	#12,2	Y	退款金额，单位元
        'refund_reason'	: 'HIS未支付' ,#String	512	Y	退款原因
        'extend_params'	: '' ,#String	512	N	扩展参数/回传信息
        'sign'	: '' ,#String	32	Y	签名，见《附录》第11项（签名与验签机制）
        'sign_type'	: 'MD5' ,#String	32	Y	签名类型，目前支持MD5，默认为MD5
        'part_refund_type'	: '' ,#String	32	N	医保退费类型，非必填,不填则全退，CASH_ONLY 则只退现金部分
        'request_content'	: '' ,#String		N	透传医保局，非必填，有需要透传数据到医保局时填写
        'cancel_bill_no'	: '' ,#String	20	N	医保撤销单据号
        'cancel_serial_no'	: '' #String	20	N	医保撤销流水号
    }
    tmpDict1 = __getSign(tmpDict)
    tmpDict['sign'] = tmpDict1
    return tmpDict