from ServCall.HIS.Common.Webservices import CallHISWS
from SelfServPy.Common import business_masterCtl as BMCtl
from SelfServPy.Common import business_detailsCtl as BDCtl
from SelfServPy.Common import ss_eqrdetailsCtl as ERDCtl
from SelfServPy.Common import ss_eqruleCtl as ERCtl
from SelfServPy.Common import patinfoCtl as PTCtl
from SelfServPy.ApplicationFrameWork import Tools
from SelfServPy.ApplicationFrameWork import ClsHisOperation as ClsHisOP
import json
from urllib import parse
import datetime
# 该类需要手动编写，根据HIS接口要求的数据，从业务流水表中组织数据
class CK:
    def checkfun(self,Input,ClsHisOPObj):
        try:
            #检查是否未管理员机器
            #True 管理员 不进行规则校验
            AdminFlag = checkAdmin(Input,ClsHisOPObj)
            if AdminFlag:
                Response = Tools.BuildWebOutPut("",msg = "",result = "0")    
                return Response
            #print("checkfun----------")
            IDNO = ClsHisOPObj.patinfo_dict.get('idno')
            PatName = ClsHisOPObj.patinfo_dict.get('name')
            HospId = ClsHisOPObj.terminal_dict.get('hosp_id')
            UserCode = ClsHisOPObj.terminal_dict.get('user_code')
            UserID = ClsHisOPObj.terminal_dict.get('user_id')
            BusinessMasterId = ClsHisOPObj.serial_id
            BusinessType = ClsHisOPObj.business_type
            CheckCode = Input.get('CheckCode')
            RuleType = Input.get('RuleType')
            #print("checkfun----------",CheckCode)
            if RuleType:
                if RuleType == "StopBusiness":
                    rtn = checkStop(Input,ClsHisOPObj)
                    if rtn.get('result') == "0":
                        Response = Tools.BuildWebOutPut("",msg = "",result = "0")    
                        return Response
                    else: #非StopBusiness的规则
                        Response = Tools.BuildWebOutPut("",msg = rtn.get('Response'),result = rtn.get('result')) 
                        return Response   
            #取当前时间
            CurTime = Tools.getDefStDate(0, formatterType="0")
            HourData = int(CurTime[3])
            MData = int(CurTime[4])
            CurDT = datetime.datetime(2020, 10, 1, HourData, MData, tzinfo=None)
            #早上定义时间段
            MStartDate =  datetime.datetime(2020, 10, 1, 7, 0, tzinfo=None) #'7' + '00'
            MEndDate = datetime.datetime(2020, 10, 1,11, 30, tzinfo=None)
            #下午定义时间段
            AStartDate = datetime.datetime(2020, 10, 1,12, 0, tzinfo=None)
            AEndDate = datetime.datetime(2020, 10, 1,17, 00, tzinfo=None)
            #验证规则
            
            #挂号业务规则
            #挂号时间范围
            if CheckCode == "Reg":
                if (CurDT < MStartDate or CurDT > MEndDate) and (CurDT < AStartDate):
                    result = "-1"
                    Response ="挂号时间07:00-11:30 12:00-17:00"
                if (CurDT >= AStartDate) and (CurDT < AStartDate or CurDT > AEndDate):
                    result = "-1"
                    Response ="挂号时间07:00-11:30 12:00-17:00" 
            #挂号业务规则
            #挂号时间范围
            if CheckCode == "ORDR":
                if (CurDT < MStartDate or CurDT > AEndDate):
                    result = "-1"
                    Response ="预约时间07:00-17:00"
            #取号时间规则
            if CheckCode == "OBTNO":
                InputParam = Input.get('InputParam')
                InputObj  = json.loads(InputParam)
                AdmitRange = InputObj.get('AdmitRange')

                DateTimeInfo = AdmitRange.split(' ')[1]
                # 14:00-14:30
                StartDate = DateTimeInfo.split('-')[0]
                StartHour = StartDate.split(':')[0]
                StartMin = StartDate.split(':')[1]

                EndDate = DateTimeInfo.split('-')[1]
                EndHour = StartDate.split(':')[0]
                EndMin = StartDate.split(':')[1]

                StartDate = datetime.datetime(2020, 10, 1,int(StartHour),int(StartMin), tzinfo=None)
                EndDate = datetime.datetime(2020, 10, 1,int(EndHour),int(EndMin), tzinfo=None)
                CurDT1 = datetime.datetime(2020, 10, 1, HourData, MData + 30, tzinfo=None) #提前30分钟
                #print(StartDate,EndDate,CurDT1)
                if CurDT > EndDate:
                    result = "0"
                    Response = "已过取号时间：" + AdmitRange.split(' ')[1]
                elif CurDT1 + 30 < StartDate:
                    result = "0"
                    Response = "未到取号时间：" + AdmitRange.split(' ')[1] 
                #print("Response",Response)
            # 下午不能挂早上号，早上不能挂下午号，全天除外
            if CheckCode == "RegCheck":
                BookInfo = Tools.GetUserOperation(BusinessMasterId,"predoc")
                ScheInfo = BookInfo.get('Param')
                ScheInfoDic = json.loads(ScheInfo)
                EffectiveSeqNo = ScheInfoDic.get('EffectiveSeqNo')
                CurrentDesc = ""
                if (CurDT > MStartDate and CurDT < MEndDate) :
                    CurrentDesc = "上午"
                if (CurDT > AStartDate) and (CurDT < AEndDate) :
                    CurrentDesc = "下午"
                if CurrentDesc not in EffectiveSeqNo:
                    result = "0"
                    Response = CurrentDesc + "只能挂" + CurrentDesc + "的号" 
            # 医生选择界面按钮事件
            if CheckCode == "checkDoctor":
                InputParam = Input.get('Input')
                # DoctorCode":"636","DoctorName":"段丽君","DoctotLevelCode":"主任医师","DoctorLevel":"1","DeptId":"119","DeptName":"内分泌科门诊","UserCode":"D1262"
                InputObj = json.loads(InputParam)
                # 1.只有门特患者才能挂附加号
                DoctorName = InputObj.get('DoctorName')
                if "附加号" in DoctorName:
                    MTLB = ""
                    UserOperationDic = Tools.GetUserOperation(BusinessMasterId,"diag")
                    DicInfo = UserOperationDic.get('Param')
                    if DicInfo:       
                        DicInfoDic = json.loads(DicInfo)
                        MTLB = str(DicInfoDic.get('INDIDDicCode'))
                    if MTLB == "":
                        Response = "只有门特患者才能挂附加号" 
                        result = "0"
            Response = Tools.BuildWebOutPut("",msg = Response,result = result)  
            return Response
        except:
            Response = ""
            result = "0"
            Response = Tools.BuildWebOutPut("",msg = Response,result = "0")  
            return Response
def checkStop(Input,ClsHisOPObj):
    try:
        #此时只有 checkcode参数业务代码
        CheckCode = Input.get('CheckCode')
        Response = ""
        result = "0"
        #校验
        ERDCtlObj = ERDCtl.ERDC()
        queryParam = {
            "ss_eqrd_type":"StopBusiness",
            "ss_eqrd_code":CheckCode
        }
        ERDCtlObj.query(queryParam)
        if ERDCtlObj.queryset:
            ALLQuerySet = ERDCtlObj.queryset[0]
            ss_eqrd_actflag = getattr(ALLQuerySet,'ss_eqrd_actflag')
            if ss_eqrd_actflag == "Y":
                result = "-1"
                Response = "抱歉，业务暂停使用"
        output = {
            "result" : result,
            "Response":Response
        }
        return output                            
    except Exception:
        Response = ""
        result = "0"
        output = {
            "result" : result,
            "Response":"异常"
        }
        return output  
#根据费别配置是否允许进行医保结算 
# 缴费医保结算时调用
def checkStopInsuType(Input,ClsHisOPObj):
    try:
        #此时只有 checkcode参数业务代码
        CheckCode = Input.get('CheckCode')
        Response = ""
        result = "0"
        #校验
        ERDCtlObj = ERDCtl.ERDC()
        queryParam = {
            "ss_eqrd_type":"StopInsuType",
            "ss_eqrd_code":CheckCode
        }
        ERDCtlObj.query(queryParam)
        if ERDCtlObj.queryset:
            ALLQuerySet = ERDCtlObj.queryset[0]
            ss_eqrd_actflag = getattr(ALLQuerySet,'ss_eqrd_actflag')
            ss_eqrd_desc = "抱歉，业务暂停使用"
            if ss_eqrd_actflag == "Y":
                result = "-1"
                if getattr(ALLQuerySet,'ss_eqrd_desc') !="":
                    ss_eqrd_desc = getattr(ALLQuerySet,'ss_eqrd_desc')
                Response = ss_eqrd_desc
        output = {
            "result" : result,
            "Response":Response
        }
        return output                            
    except Exception:
        Response = ""
        result = "0"
        output = {
            "result" : result,
            "Response":"异常"
        }
        return output 
# 检测是否允许使用所有医保 (调用医保接口)
def checkStopInsu(Input,ClsHisOPObj):
    try:
        #此时只有 checkcode参数业务代码
        CheckCode = Input.get('CheckCode')
        Response = ""
        result = "0"
        #校验
        ERDCtlObj = ERDCtl.ERDC()
        queryParam = {
            "ss_eqrd_type":"StopInsu",
            "ss_eqrd_code":CheckCode #读卡和非读卡业务
        }
        ERDCtlObj.query(queryParam)
        if ERDCtlObj.queryset:
            ALLQuerySet = ERDCtlObj.queryset[0]
            ss_eqrd_actflag = getattr(ALLQuerySet,'ss_eqrd_actflag')
            ss_eqrd_desc = "抱歉，业务暂停使用"
            if ss_eqrd_actflag == "Y":
                result = "-1"
                if getattr(ALLQuerySet,'ss_eqrd_desc') !="":
                    ss_eqrd_desc = getattr(ALLQuerySet,'ss_eqrd_desc')
                Response = ss_eqrd_desc
        output = {
            "result" : result,
            "Response":Response
        }
        return output                            
    except Exception:
        Response = ""
        result = "0"
        output = {
            "result" : result,
            "Response":"异常"
        }
        return output 
#获取允许展示的支付方式信息
def getChargePayModeInfo(Input,ClsHisOPObj):
    pass
#检查是否未管理员机器
#True 管理员 不进行规则校验
def checkAdmin(Input,ClsHisOPObj):
    IDNO = ClsHisOPObj.patinfo_dict.get('idno')
    PatName = ClsHisOPObj.patinfo_dict.get('name')
    HospId = ClsHisOPObj.terminal_dict.get('hosp_id')
    UserCode = ClsHisOPObj.client_dict.get('ss_eqlistd_eqcode')
    UserID = ClsHisOPObj.terminal_dict.get('user_id')
    BusinessMasterId = ClsHisOPObj.serial_id
    BusinessType = ClsHisOPObj.business_type
    CheckCode = Input.get('CheckCode')
    RuleType = Input.get('RuleType')
    ERDCtlObj = ERDCtl.ERDC()
    queryParam = {
        "ss_eqrd_type":"Admin",
        "ss_eqrd_code":UserCode, 
        "ss_eqrd_actflag":"Y" #只判断有效的
    }
    ERDCtlObj.query(queryParam)
    output = False
    if ERDCtlObj.queryset:
        ALLQuerySet = ERDCtlObj.queryset[0]
        ss_eqrd_actflag = getattr(ALLQuerySet,'ss_eqrd_actflag')
        if ss_eqrd_actflag == "Y":
            output = True
    return output