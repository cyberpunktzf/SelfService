# HIS 操作业务
import json
from SelfServPy.ApplicationFrameWork import Tools
import datetime
from SelfServPy.Common import ss_extdetailsCtl
#保存医保接口调用信息
def save_insu_portinfo(Input,ClsHisOPObj):
    BDObj = ss_extdetailsCtl.EXTC()
    #第三方交易表保存医保数据(ext)type  INSUPre,INSUCommit,INSURefund,INSUCancel,ss_extd_channel=INSU
    Input = {
        "ss_extd_code":ClsHisOPObj.business_type,
        "ss_extd_amt":Input.get('ss_extd_amt'),
        "ss_extd_type":Input.get('ss_extd_type'),
        "ss_extd_status":Input.get('ss_extd_status'),
        "ss_extd_id":ClsHisOPObj.serial_id,
        "ss_extd_no":ClsHisOPObj.serial_number,
        "ss_extd_hisno": '',
        "ss_extd_platno": '',
        "ss_extd_extno":'',
        "ss_extd_channel":'INSU',
        "ss_extd_outinfo":Input.get('ss_extd_outinfo'),
        "ss_extd_ininfo":Input.get('ss_extd_ininfo'),
        "ss_extd_creator":ClsHisOPObj.client_dict.get('ss_eqlistd_eqcode')
    }
    BDObj.insert(Input)
#此处做对照根据对照取 
#处理医保类型
def get_mi_type(ClsHisOPObj,Input):
    try:
        #print("get_mi_type")
        if ClsHisOPObj=='':
            rtn_mi_type=Input
        else :
            rtn_mi_type = ClsHisOPObj.his_patinfo_dict['hi_type']
        #print("get_mi_type",ClsHisOPObj.his_patinfo_dict)
        if rtn_mi_type :
            return rtn_mi_type
        else:
            raise Exception("-1^获取费别失败")  
    except Exception as e:
        print(str(e))
#获取医保支付信息
def GetInsuPayInfo(ClsHisOPObj):
    try:
        #自费的返回0
        #print("自费的返回0")
                #自费的返回0
        #print("自费的返回0")
        if ClsHisOPObj.get("AdmReason"):
            AdmReason = get_mi_type('',ClsHisOPObj.get("AdmReason"))
        else :
            AdmReason = get_mi_type(ClsHisOPObj)
        if not AdmReason or AdmReason=='':
            raise Exception(e)
        INSUZHZF = 0
        INSUTCZF = 0
        if(AdmReason == "1"):
            rtnDic = {
                'INSUZHZF' : '0',
                'INSUTCZF' : '0'
            }
            return rtnDic
        BusinessType = ClsHisOPObj.business_type
        ss_extd_type = ""
        if BusinessType == "Reg" or BusinessType == "OBTNO" or BusinessType == "DRINCRNO" :
            ss_extd_type = "INSUPreRegBack"
        if BusinessType == "Charge":
            ss_extd_type = "InsuOPDividePreBack"
        #取医保数据
        QueryInput = {
            "ss_extd_id" : ClsHisOPObj.serial_id,
            "ss_extd_channel" : 'INSU',
            "ss_extd_type" : ss_extd_type
        }
        BDObj = ss_extdetailsCtl.EXTC()
        BDObj.query(QueryInput)
        ALLQuerySet = BDObj.queryset[0]
        insuoutinfo = getattr(ALLQuerySet,'ss_extd_outinfo')
        #挂号类业务 0^303569^586513^0^0^门大(城职)联网已结算^^CZZG^1!1^06^033^1551^053^052^054^055^0!N
        if BusinessType == "Reg" or BusinessType == "OBTNO" or BusinessType == "DRINCRNO" : #0^150^200^0^0^门大(城职)联网已结算^^CZZG^1!1^306^033^046^048^047^049^050^0!N
            INSUTCZF = 0
            insuoutinfo = insuoutinfo.split('!')[1]
            INSUPayArr = insuoutinfo.split(chr(2))
            tmpIndex = 0
            for index in INSUPayArr:
                #key = 1^30
                key = INSUPayArr[tmpIndex]
                PayModeCode = key.split('^')[0]
                PayAmt = key.split('^')[1]
                if PayModeCode == "1":
                    SelfAmt = PayAmt
                elif PayModeCode == "33":
                    INSUZHZF = PayAmt
                else:
                    INSUTCZF += float(PayAmt)
                tmpIndex = tmpIndex + 1
        #缴费类业务
        #print("#缴费类业务",BusinessType,insuoutinfo)
        if BusinessType == "Charge": #0^587570^0^107238233^26^053^052^054^055^0 
            INSUTCZF = 0
            INSUPayArr = insuoutinfo.split(chr(2))
            tmpIndex = 0
            #print("INSUPayArr",INSUPayArr)
            #print("insuoutinfo",insuoutinfo)
            for index in INSUPayArr:
                #key = 1^30
                #print('tmpIndex',tmpIndex)
                if tmpIndex == 0:
                    tmpIndex = tmpIndex + 1
                    continue
                key = INSUPayArr[tmpIndex]
                #print("key",key)
                PayModeCode = key.split('^')[0]
                PayAmt = key.split('^')[1]
                if PayModeCode == "1":
                    SelfAmt = PayAmt
                elif PayModeCode == "33":
                    INSUZHZF = PayAmt
                else:
                    INSUTCZF += float(PayAmt)
                tmpIndex = tmpIndex + 1
        rtnDic = {
            'INSUZHZF' : str(INSUZHZF),
            'INSUTCZF' : str(INSUTCZF)
        }
        #print("rtnDic",rtnDic)
        return rtnDic
    except Exception as e:
        print("rtnDic",e)
        raise Exception(e)
