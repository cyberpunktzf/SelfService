import xmltodict
from ServCall.HIS.Common.Webservices import CallHISWS
from ServCall.HIS.Common.Webservices import CallHISDocInfo

from SelfServPy.Common import business_masterCtl as BMCtl
from SelfServPy.Common import ss_tdpaymodeCtl
from SelfServPy.Common import ss_tradedetailsCtl
from SelfServPy.Common import business_detailsCtl as BDCtl
from SelfServPy.Common import ss_extdetailsCtl
from SelfServPy.Common import ss_dicdataCtl
from SelfServPy.Common import patinfoCtl as PTCtl
from SelfServPy.ApplicationFrameWork import Tools
import json
import random
from urllib import parse
from SelfServPy.Common.LogCtl import SaveSYSLog
#from PIL import Image
import base64
import datetime
from SelfServPy.Common import ss_docpictureCtl as DPCtl
from SelfServPy.INSU import get_mi_type 
from SelfServPy.INSU import save_insu_portinfo
from SelfServPy.INSU import GetInsuPayInfo
from SelfServPy.Common import ss_eqlistcfgCtl
from SelfServPy.Common import ss_eqroleconfigCtl
 
# 该类需要手动编写，根据HIS接口要求的数据，从业务流水表中组织数据
class DHC:
    # 初始化
    def Init(self,Input,ClsHisOPObj):
        #组织参数
        UserID = Input.get('UserID')
        UserCode = 'ZZJ6'
        HospId = Input.get('HospId')
        GroupId = Input.get('GroupId')
        #取设备代码
        ss_eqlistd_eqcode = ClsHisOPObj.client_dict.get('ss_eqlistd_eqcode')
        ss_eqlistd_unit = ClsHisOPObj.client_dict.get('ss_eqlistd_unit')
        Terminal = "ZZJ6"
        if ss_eqlistd_eqcode:
            Terminal = ss_eqlistd_eqcode
            UserCode = ss_eqlistd_eqcode
        else:
            Terminal1 = Input.get('Terminal')
            if Terminal1:
                Terminal = Terminal1
        UserID = "19401"
        if ss_eqlistd_unit:
            if ss_eqlistd_unit !="":
                UserID = ss_eqlistd_unit 
        #此处需要根据具体HIS进行修改
        terminal_infoDic = {'UserID':UserID,'UserCode':UserCode,'HospId':HospId,'GroupId':GroupId,'Terminal':Terminal}
        # terminal_info
        terminal_info = json.dumps(terminal_infoDic)
        # 生成主表业务流水号  serial_number
        #RandomStr="qwertyuiopasdfghjklzxcvbnm0123456789"
        #serial_numberList = random.sample(RandomStr,10)
        #serial_number = "".join(serial_numberList)
        DateTimeStamp = Tools.getDefStDate(0,formatterType="Y/M/DD:M:S")
        DateTimeStamp = DateTimeStamp.replace('/','')
        serial_number = Terminal + Input.get('Business') + DateTimeStamp
        serial_number = serial_number.replace(' ','')
        # code 
        code = Input.get('Business')
        # processcode 
        processcode = Input.get('processcode')
        # desc
        InsertDic = {'terminal_info':terminal_info,'serial_number':serial_number,'code':code,'processcode':processcode,'usercode' : UserCode,'business_status':'0'}
        BMObj = BMCtl.BM()
        BMObj.insert(InsertDic)
        rtn = str(BMObj.result)
        if BMObj.result > 0:
            rtn = 0
            msg = "成功"
        else:
            rtn = str(BMObj.result)
            msg = BMObj.msg
        #print("初始化成功",BMObj)
        OutPut = {'serial_number':serial_number,'serial_id':str(BMObj.result)}
        Response = Tools.BuildWebOutPut(OutPut)
        return Response
    # 根据第一次业务信息，生成业务主表
    # 用于患者需要多次业务时，不返回主页，重新读卡
    # 场景： 1.核酸 挂号-缴费，2.结算多笔费用时
    # 功能：插 bm 主表，插患者信息表patinfo
    def RepeatInit(self,Input,ClsHisOPObj):
        #组织参数
        # 取OldBMID
        old_bm_id = Input.get('serial_id')
        BMObj = BMCtl.BM()
        QInput = {
            "id":int(old_bm_id)
        }
        BMObj.query(QInput)
        if BMObj.queryset:
            Terminal = ClsHisOPObj.client_dict.get('ss_eqlistd_eqcode')
            DateTimeStamp = Tools.getDefStDate(0,formatterType="Y/M/DD:M:S")
            DateTimeStamp = DateTimeStamp.replace('/','')   
            serial_number = Terminal + Input.get('Business') + DateTimeStamp
            serial_number = serial_number.replace(' ','')
            terminal_info =  getattr(BMObj.queryset[0],'terminal_info')
            code = Input.get('Business')
            processcode = Input.get('processcode')
        InsertDic = {'terminal_info':terminal_info,'serial_number':serial_number,'code':code,'processcode':processcode,'usercode' : Terminal,'business_status':'0','old_bm_id':old_bm_id}
        BMObj = BMCtl.BM()
        BMObj.insert(InsertDic)
        rtn = str(BMObj.result)
        if BMObj.result > 0:
            rtn = 0
            msg = "成功"
        else:
            rtn = str(BMObj.result)
            msg = BMObj.msg
        print("插入主表",msg)
        #2.插入patinfo 两行数据
        #2.1插入卡信息
        PTObj = PTCtl.PT()
        queryParam = {'fk_businessmaster_id':int(old_bm_id),'code':'card_patinfo'} 
        PTObj.query(queryParam)
        if PTObj.queryset:
            code_val = getattr(PTObj.queryset[0],'code_val')
            code = "card_patinfo"
            his_master_id = ""
            InsertDic = {'fk_businessmaster_id':str(BMObj.result),'code':code,'code_val':code_val,'his_master_id':his_master_id}
            PTObj.insert(InsertDic)
            if PTObj.result > 0:
                #2.2插入his患者信息
                PTObj = ''
                PTObj = PTCtl.PT()
                queryParam = {'fk_businessmaster_id':str(old_bm_id),'code':'his_patinfo'} 
                PTObj.query(queryParam)
                if PTObj.queryset:
                    code_val = getattr(PTObj.queryset[0],'code_val')
                    code = "his_patinfo"
                    his_master_id = getattr(PTObj.queryset[0],'his_master_id')
                    id_no = getattr(PTObj.queryset[0],'id_no')
                    his_patname = getattr(PTObj.queryset[0],'his_patname')
                    InsertDic = {'fk_businessmaster_id':str(BMObj.result),'code':code,'code_val':code_val,'his_master_id':his_master_id,'id_no':id_no,'his_patname':his_patname}
                    PTObj.insert(InsertDic)
                    if PTObj.result > 0:
                        pass
        OutPut = {'serial_number':serial_number,'serial_id':str(BMObj.result)}
        Response = Tools.BuildWebOutPut(OutPut)
        return Response
    # 保存读卡信息
    def SavePatInfo(self,Input,ClsHisOPObj):
        '''
            "ResponseStatus" : code,
            "ResponseText" : "",
            "CardType" : "1", // 1.身份证 ,2:医保卡,3:HIS就诊卡
            "CardTypeCode" : CardTypeCode, // 01.身份证 ,02:医保卡,3:HIS就诊卡
            "IDNo" : idno,
            "Name" : name,
            "Sex" : Sex,
            "Age" : Age,
            "brdy" : brdy,
            "naty" : naty,
            "Address" : AddDr,
            "PatINSUInfo":{
                "INSUNo" : "",
                "INSUCardNo" : "",
                "INSUStates" : "",
                "Acount" : "",
                "Company" : ""
            }
        '''
        # 组织参数
        # PTCtl
        PTObj = PTCtl.PT()
        code = "card_patinfo"
        fk_businessmaster_id = ClsHisOPObj.serial_id
        code_val = Input.get('card_patinfo')
        #code_val = json.dumps(code_val,ensure_ascii=False)
        #code_val = parse.quote(code_val)
        #code_val = code_val.decode('UTF-8').encode('gbk')
        his_master_id = ''
        InsertDic = {'fk_businessmaster_id':fk_businessmaster_id,'code':code,'code_val':code_val,'his_master_id':his_master_id}
        PTObj.insert(InsertDic)
        if PTObj.result > 0:
            rtn = 0
            msg = "成功"
        else:
            rtn = str(PTObj.result)
            msg = PTObj.msg
        #print('保存患者基本信息结束：',PTObj.msg)
        Response = {'patinfo_id':PTObj.result}
        Response = Tools.BuildWebOutPut(Response)
        return Response
    # 保存界面操作信息
    def DHC_6666(self,Input,ClsHisOPObj):
        # 组织HIS接口参数      
        BDObj = BDCtl.BD()
        Input['intef_input'] = Input.get('intef_input')
        BDObj.saveByWeb(Input)
        # 构造返回参数
        Response = {'result':0,"bd_id":BDObj.result}
        Response = Tools.BuildWebOutPut(Response)
        return Response
    # 获取患者基本信息
    def DHC_3300(self,Input,ClsHisOPObj):
        # 组织HIS接口参数
        print('DHC_3300接口开始',Input,"------",ClsHisOPObj)
        BusinessMasterId = ClsHisOPObj.serial_id
        IDNO = ClsHisOPObj.patinfo_dict.get('idno')
        PatName = ClsHisOPObj.patinfo_dict.get('name')
        HISCardTypeCode = "01"
        HospId = ClsHisOPObj.terminal_dict.get('hosp_id')
        UserCode = ClsHisOPObj.terminal_dict.get('user_code')
        barCode = ClsHisOPObj.patinfo_dict.get('barcode')
        if ClsHisOPObj.patinfo_dict.get('readcard_type') != "2": 
            barCode = ""
        InsuAge = ClsHisOPObj.patinfo_dict.get('age')
        RequestStr = "<Request><InsuAge>" + InsuAge + "</InsuAge><PatientID></PatientID><AdmId>" + barCode + "</AdmId><TradeCode>3300</TradeCode><TransactionId></TransactionId><ExtOrgCode></ExtOrgCode><ClientType></ClientType><TerminalID></TerminalID><HospitalId>" + HospId + "</HospitalId><ExtUserID>" + UserCode  + "</ExtUserID><PatientCard></PatientCard><CardType></CardType><Phone></Phone><IDCardType>" + HISCardTypeCode + "</IDCardType><IDNo>" +  IDNO + "</IDNo><PatientName>" + PatName + "</PatientName></Request>"
        # 保存入参
        BDObj = BDCtl.BD()
        Input['intef_input'] = RequestStr
        BDObj.saveByWeb(Input)
        # 调用HIS接口
        Response = CallHISWS(RequestStr)
        # 保存出参
        Input['id'] = BDObj.result
        Input['intef_output'] = Response
        BDObj.saveByWeb(Input)
        # 构造返回参数
        Response = Tools.BuildWebOutPut(Response)
        return Response
    # 患者建档
    def DHC_3014(self,Input,ClsHisOPObj):
        # 组织HIS接口参数
        SaveSYSLog('DHC_3014接口开始')
        BusinessMasterId = ClsHisOPObj.serial_id
        IDNO = ClsHisOPObj.patinfo_dict.get('idno')
        PatName = ClsHisOPObj.patinfo_dict.get('name')
        HISCardTypeCode = "01"
        HospId = ClsHisOPObj.terminal_dict.get('hosp_id')
        UserCode = ClsHisOPObj.terminal_dict.get('user_code')

        Sex = ClsHisOPObj.patinfo_dict.get('sex').replace('"','')
        if Sex == '男':
            Sex = "1"
        else:
            Sex = "2"
        DOB = ClsHisOPObj.patinfo_dict.get('brtd')
        # PatientType
        PatientType = '01'
        INSUCardStr = ClsHisOPObj.patinfo_dict.get('insu_card_no') 
        if INSUCardStr != "":
            PatientType = '05' 
        Address =  ClsHisOPObj.patinfo_dict.get('Address')
        Mobile = Input.get('TelePhoneNo')
        CardTypeCode = '01'
        IDNo = IDNO
        PatientName = PatName

        IDType = '01'
        
        RequestStr = "<Request><PatientCard>" + IDNo + "</PatientCard><Address>" + Address + "</Address><TradeCode>3014</TradeCode><Mobile>" + Mobile + "</Mobile><PatientType>" + PatientType + "</PatientType><CardTypeCode>" + CardTypeCode + "</CardTypeCode><IDNo>" + IDNo + "</IDNo><PatientName>" + PatientName +  "</PatientName><Sex>" + Sex + "</Sex><DOB>" + DOB + "</DOB><IDType>" + IDType + "</IDType><HospitalId>" + HospId + "</HospitalId><UserID>" + UserCode  + "</UserID></Request>"
        # 保存入参
        BDObj = BDCtl.BD()
        Input['intef_input'] = RequestStr
        BDObj.saveByWeb(Input)
        # 调用HIS接口
        Response = CallHISWS(RequestStr)
        # 保存出参
        Input['id'] = BDObj.result
        Input['intef_output'] = Response
        BDObj.saveByWeb(Input)
        # 构造返回参数
        Response = Tools.BuildWebOutPut(Response)
        return Response
    # 查询科室
    def DHC_1012(self,Input,ClsHisOPObj):
        # 组织HIS接口参数
        SaveSYSLog('DHC_1012接口开始')
        # 组织HIS接口参数
        IDNO = ClsHisOPObj.patinfo_dict.get('idno')
        PatName = ClsHisOPObj.patinfo_dict.get('name')
        HISCardTypeCode = "01"
        HospId = ClsHisOPObj.terminal_dict.get('hosp_id')
        UserCode = ClsHisOPObj.terminal_dict.get('user_id')
        BusinessMasterId = ClsHisOPObj.serial_id
        

        UserOperationDic = Tools.GetUserOperation(BusinessMasterId,"level1dep")
        DepartmentGroupCode = ""
        DepartmentCode = ""
        if 'DepartmentCode' in UserOperationDic.keys():
            DepartmentGroupCode=UserOperationDic.get('DepartmentCode')
        processcode = ClsHisOPObj.processcode
        if processcode == "NAReg-Reg" :
            DepartmentCode = "688" #RowID
        BusinessType = ClsHisOPObj.business_type
        StartDate = ""
        EndDate = ""
        if BusinessType == "Reg":
            StartDate = Tools.getDefStDate(0)
            EndDate = Tools.getDefStDate(0)
        elif BusinessType == "ORDR":
            StartDate = Tools.getDefStDate(1)
            EndDate = Tools.getDefStDate(14)
        RequestStr = "<Request><TradeCode>1012</TradeCode><PatientID>" + ClsHisOPObj.his_patinfo_dict.get('his_unique_no') + "</PatientID><StartDate>" + StartDate + "</StartDate><EndDate>" + EndDate + "</EndDate><ExtUserID>" + ClsHisOPObj.terminal_dict.get('user_code') + "</ExtUserID><DepartmentCode>" + DepartmentCode + "</DepartmentCode><DepartmentGroupCode>" + DepartmentGroupCode +"</DepartmentGroupCode><ExtOrgCode></ExtOrgCode><ClientType>ATM</ClientType><HospitalId>" + HospId + "</HospitalId></Request>"
        # 保存入参
        BDObj = BDCtl.BD()
        Input['intef_input'] = RequestStr
        BDObj.saveByWeb(Input)
        # 调用HIS接口
        Response = CallHISWS(RequestStr)
        # 保存出参
        Input['id'] = BDObj.result
        Input['intef_output'] = Response
        BDObj.saveByWeb(Input)
        # 构造返回参数
        Response = Tools.BuildWebOutPut(Response)
        return Response
    # 医保预挂号
    def DHC_PayServ_INSUPreReg(self,Input,ClsHisOPObj):
        #print("医保预挂号参数开始：",ClsHisOPObj.__dict__)
        #print("奇怪的字典=",ClsHisOPObj.patinfo_dict)
        # 组织HIS接口参数
        IDNO = ClsHisOPObj.patinfo_dict.get('idno')
        PatName = ClsHisOPObj.patinfo_dict.get('name')
        INSUCardStr = ClsHisOPObj.patinfo_dict.get('insu_card_no') 
        if INSUCardStr=="":
            Response = Tools.BuildWebOutPut("",result = "-1",msg = "医保读卡返回串不能为空")
            return Response
        HISCardTypeCode = "01"
        HospId = ClsHisOPObj.terminal_dict.get('hosp_id')
        UserCode = ClsHisOPObj.terminal_dict.get('user_code')
        UserID = ClsHisOPObj.terminal_dict.get('user_id')
        PatientName = PatName
        BusinessMasterId = ClsHisOPObj.serial_id
        BusinessType = ClsHisOPObj.business_type

        if BusinessType == "OBTNO" :
            UserOperationDic = Tools.GetUserOperation(BusinessMasterId,"getpredetails")
            ScheduleItemCode= UserOperationDic.get('OrderCode')
            PayAmount = UserOperationDic.get('PayAmt')
        elif BusinessType == "Reg" :
            #Money
            BDOutPut = Tools.GeBDOutPut(BusinessMasterId,intef_code = '10015')
            PayAmount = Tools.GetXMLNode(BDOutPut,'RegFee')
            ScheduleItemCode = Tools.GetXMLNode(BDOutPut,'ScheduleItemCode')
        elif BusinessType == "DRINCRNO" :
            #Money
            UserOperationDic = Tools.GetUserOperation(BusinessMasterId,"getpredetails")
            ScheduleItemCode= UserOperationDic.get('OrderCode')
            PayAmount = UserOperationDic.get('PayAmt')
        # 门特类别
        MTLB = ''
        UserOperationDic = Tools.GetUserOperation(BusinessMasterId,"diag")
        DicInfo = UserOperationDic.get('Param')
        if DicInfo:       
            DicInfoDic = json.loads(DicInfo)
            MTLB = str(DicInfoDic.get('INDIDDicCode'))
        #费别
        AdmReasonId = get_mi_type(ClsHisOPObj)
        #医保票据号
        djlsh = ''
        # BankFlag
        BankFlag = 'Y'
        #Password
        Password = '111111'
        # CardStr
        CardStr = self.BuildCardStr(ClsHisOPObj)
        #TarInfo !2767^AAAA0001^普通门诊诊察费^15
        TariItem = '17401'
        TarCode = '01200037'
        TarDesc = '普通门诊诊察费'
        TarAmt = '15'

        ExpStr = self.DHC_1105(ClsHisOPObj,ScheduleItemCode)
        SaveExpStr = ExpStr
        #print("SaveExpStr",SaveExpStr)
        DepartmentCode = ""
        if len(Tools.GetXMLNode(ExpStr,'ExpString').split('^')) > 3:
            DepartmentCode = Tools.GetXMLNode(ExpStr,'ExpString').split('^')[3]
        #
        TarItemInfo = Tools.GetXMLNode(ExpStr,'ExpString').split('!')[1:]
        #O^10退公务020^30^1016^19401^CZ0103195307146413^D1784^4^^^^^^^^^!19573^00200002^副主任医师门诊诊察费（二、三级医院）^20.000000!19586^00200014^糖尿病门诊诊察费（门特加收）^10.000000</ExpString></Response>
        TarItemInfo = str(TarItemInfo)   #TariItem + '^' + TarCode + '^' + TarDesc+ '^' + TarAmt   
        TarItemInfo = TarItemInfo.replace("'","")
        TarItemInfo = TarItemInfo.replace("[","")
        TarItemInfo = TarItemInfo.replace("]","")
        TarItemInfo = TarItemInfo.replace(",","!")
        TarItemInfo = TarItemInfo.replace(" ","")
        #print("TarItemInfoTarItemInfo",TarItemInfo)
        #        Type^       Name^              TotalAmount^     HisDepCode      ^               ^    PatId  ^DoctCode^  MTLB^^Djlsh^BankFlag^CardStr^Password!TarItemDr^Code^Desc^Amount! TarItemDr2^Code2^Desc2^Amount2!……
        ExpStr = 'O' + '^' + PatName + '^' + PayAmount + '^' + DepartmentCode + '^' + UserID  + '^' + IDNO + '^' + '^' + MTLB + '^^' + djlsh + '^' + BankFlag + '^' + CardStr + '^' + Password + '^!' + TarItemInfo
        #ExpStr = 'O^10退公务020^15^ZYMZ001^12173^CZ0103195307146413^HB002^^^^^;' + PersonalID + '=^^' + CheckCode + '^!2767^AAAA0001^普通门诊诊察费^15.000000^cn_iptcp:10.3.202.10[1972]:DHC-APP|dhwebservice|dhwebservice|GlobalEMR|WEB||HOSPID:2'
        jsonObj = {
            'dhandle': '0',
            'PaadmRowid': '',
            'UserID': UserID,
            'AdmReasonId': get_mi_type(ClsHisOPObj), 
            'ExpStr': ExpStr
        }
        #print("医保预挂号返回串",jsonObj)
        jsonStr = json.dumps(jsonObj)
        Response =  jsonStr 
        # 保存出参
        BDObj = BDCtl.BD()
        Input['intef_input'] = SaveExpStr
        Input['intef_output'] = Response
        BDObj.saveByWeb(Input)
        # 构造返回参数
        Response = Tools.BuildWebOutPut(Response)
        
        return Response
    # 医保挂号
    def DHC_PayServ_INSUReg(self,Input,ClsHisOPObj):
        #print("医保挂号提交参数开始：",ClsHisOPObj.__dict__)
        # 组织HIS接口参数
        IDNO = ClsHisOPObj.patinfo_dict.get('idno')
        PatName = ClsHisOPObj.patinfo_dict.get('name')
        INSUCardStr = ClsHisOPObj.patinfo_dict.get('insu_card_no') 
        HISCardTypeCode = "01"
        HospId = ClsHisOPObj.terminal_dict.get('hosp_id')
        UserCode = ClsHisOPObj.terminal_dict.get('user_code')
        UserID = ClsHisOPObj.terminal_dict.get('user_id')
        PatientName = PatName
        BusinessMasterId = ClsHisOPObj.serial_id
        
        #Interface
        #CardType = ""
        #StartDate = ""
        #EndDate = ""
        #RequestStr = '<Request><TradeCode>GetSurvlist</TradeCode></Request>'
        # 保存入参
        # 调用HIS接口
        #Response = CallHISWS(RequestStr)
        #费别
        AdmReasonId = get_mi_type(ClsHisOPObj)
        #Money
        UserOperationDic = Tools.GeBDOutPut(BusinessMasterId,"INSUPreRegBack",'SaveBD')
        AdmInfoDr = UserOperationDic.split('^')[1]
        jsonObj = {
            'dhandle': '0',
            'AdmInfoDr': AdmInfoDr,
            'UserID': UserID,
            'AdmReasonId': AdmReasonId, 
            'ExpStr': ''
        }
        #print("医保预挂号返回串",jsonObj)
        jsonStr = json.dumps(jsonObj)
        Response =  jsonStr 
        # 保存出参
        BDObj = BDCtl.BD()
        Input['intef_output'] = Response
        BDObj.saveByWeb(Input)
        # 构造返回参数
        Response = Tools.BuildWebOutPut(Response)
        
        return Response
    # 医保预结算
    def DHC_PayServ_InsuOPDividePre(self,Input,ClsHisOPObj):
        #print("医保预结算返回串",ClsHisOPObj.__dict__)
        # 组织HIS接口参数
        IDNO = ClsHisOPObj.patinfo_dict.get('idno')
        PatName = ClsHisOPObj.patinfo_dict.get('name')
        INSUCardStr = ClsHisOPObj.patinfo_dict.get('insu_card_no') 
        HISCardTypeCode = "01"
        HospId = ClsHisOPObj.terminal_dict.get('hosp_id')
        UserCode = ClsHisOPObj.terminal_dict.get('user_code')
        UserID = ClsHisOPObj.terminal_dict.get('user_id')
        PatientName = PatName
        BusinessMasterId = ClsHisOPObj.serial_id
        
        #Interface
        # 保存入参
        # ,StrInvDr:5366,UserID:5366,AdmSource:1,
        # ExpStr:N^238^^^^^^^01^cn_iptcp:10.3.202.10[1972]:DHC-APP|dhwebservice|dhwebservice|GlobalEMR|WEB||HOSPID:2^^^2^!^^;991011000000001322=000000000892000000?^,
        # CPPFlag:NotCPPFlag,
        # AdmReasonId:2
        BDOutPut = Tools.GeBDOutPut(BusinessMasterId,intef_code = '4905')
        StrInvDr = Tools.GetXMLNode(BDOutPut,'InvoiceNo')
        AdmSource = "1"
        #费别
        AdmReasonId = get_mi_type(ClsHisOPObj)
        # ExpStr
        StrikeFlag = "N"
        GroupDr = "238"
        HISAcc = ""
        BankFlag = "Y"
        CardStr = self.BuildCardStr(ClsHisOPObj)
        #取挂号
        #CardStr = '' + '|' + '' + '|' + '' + '|' + '' + '|' + '' + '|' + '' + '|' + ''
        DFBZ=""
        Password = '111111'
        ExpStr = StrikeFlag + '^' + GroupDr + '^' + HISAcc + '^^^^' + BankFlag + '^' + CardStr + '^' + Password + '^' + DFBZ
        CPPFlag = "NotCPPFlag"
        
        #Param
        jsonObj = {
            'dhandle': '0',
            'UserID': UserID,
            'StrInvDr': StrInvDr,
            'AdmSource': AdmSource,
            'AdmReasonId': AdmReasonId, 
            'ExpStr': ExpStr,
            'CPPFlag': CPPFlag
        }
        #print("医保预结算返回串",jsonObj)
        jsonStr = json.dumps(jsonObj)
        Response =  jsonStr 
        # 保存出参
        BDObj = BDCtl.BD()
        Input['intef_output'] = Response
        BDObj.saveByWeb(Input)
        # 构造返回参数
        Response = Tools.BuildWebOutPut(Response)
        
        return Response
    # 医保结算
    def DHC_PayServ_InsuOPDivideCommit(self,Input,ClsHisOPObj):
        #print("医保结算返回串",ClsHisOPObj.__dict__)
        # 组织HIS接口参数
        IDNO = ClsHisOPObj.patinfo_dict.get('idno')
        PatName = ClsHisOPObj.patinfo_dict.get('name')
        INSUCardStr = ClsHisOPObj.patinfo_dict.get('insu_card_no') 
        HISCardTypeCode = "01"
        HospId = ClsHisOPObj.terminal_dict.get('hosp_id')
        UserCode = ClsHisOPObj.terminal_dict.get('user_code')
        UserID = ClsHisOPObj.terminal_dict.get('user_id')
        PatientName = PatName
        BusinessMasterId = ClsHisOPObj.serial_id

        UserOperationDic = Tools.GeBDOutPut(BusinessMasterId,"InsuOPDividePreBack",'SaveBD')
        InsuDivDr = UserOperationDic.split('^')[1]
        #Interface
        # 保存入参
        AdmSource = "1"
        #费别
        AdmReasonId = get_mi_type(ClsHisOPObj)
        ExpStr = ""
        CPPFlag = "NotCPPFlag"
        Password = '111111'
        #Param
        jsonObj = {
            'dhandle': '0',
            'UserID': UserID,
            'InsuDivDr': InsuDivDr,
            'AdmSource': AdmSource,
            'AdmReasonId': AdmReasonId, 
            'ExpStr': ExpStr,
            'CPPFlag': CPPFlag
        }
        #print("医保预结算返回串",jsonObj)
        jsonStr = json.dumps(jsonObj)
        Response =  jsonStr 
        # 保存出参
        BDObj = BDCtl.BD()
        Input['intef_output'] = Response
        BDObj.saveByWeb(Input)
        # 构造返回参数
        Response = Tools.BuildWebOutPut(Response)
        
        return Response
    # 取消医保预结算
    def DHC_PayServ_InsuOPDivideRollBack(self,Input,ClsHisOPObj):
        #print("取消医保预结算",ClsHisOPObj.__dict__)
        # 组织HIS接口参数
        IDNO = ClsHisOPObj.patinfo_dict.get('idno')
        PatName = ClsHisOPObj.patinfo_dict.get('name')
        INSUCardStr = ClsHisOPObj.patinfo_dict.get('insu_card_no') 
        HISCardTypeCode = "01"
        HospId = ClsHisOPObj.terminal_dict.get('hosp_id')
        UserCode = ClsHisOPObj.terminal_dict.get('user_code')
        UserID = ClsHisOPObj.terminal_dict.get('user_id')
        PatientName = PatName
        BusinessMasterId = ClsHisOPObj.serial_id
        
        #Interface
        # 保存入参
        InsuDivDr = ""
        AdmSource = ""
        # dhandle, AdmInfoDr, UserID, AdmReasonId, ExpStr
        InsuDivDr = ""
        INSURtn = Tools.GeBDOutPut(BusinessMasterId,'InsuOPDividePreBack','SaveBD')
        #解析医保串  医保患者
        if INSURtn !="" :
            InsuDivDr = INSURtn.split('^')[1] #0^150^200^0^0^门大(城职)联网已结算^^CZZG^1!1^306^033^046^048^047^049^050^0!N
        #取费别
        AdmReasonId = get_mi_type(ClsHisOPObj)

        ExpStr = ""
        CPPFlag = ""
        Password = '111111'
        #Param
        jsonObj = {
            'dhandle': '0',
            'UserID': UserID,
            'InsuDivDr': InsuDivDr,
            'AdmSource': AdmSource,
            'AdmReasonId': AdmReasonId, 
            'ExpStr': ExpStr,
            'CPPFlag': CPPFlag
        }
        #print("医保预结算返回串",jsonObj)
        jsonStr = json.dumps(jsonObj)
        Response =  jsonStr 
        # 保存出参
        BDObj = BDCtl.BD()
        Input['intef_output'] = Response
        BDObj.saveByWeb(Input)
        # 构造返回参数
        Response = Tools.BuildWebOutPut(Response)
        
        return Response
    # 取消医保结算
    def DHC_PayServ_InsuOPDivideStrike(self,Input,ClsHisOPObj):
        #print("取消医保结算", ClsHisOPObj.__dict__)
        # 组织HIS接口参数
        IDNO = ClsHisOPObj.patinfo_dict.get('idno')
        PatName = ClsHisOPObj.patinfo_dict.get('name')
        INSUCardStr = ClsHisOPObj.patinfo_dict.get('insu_card_no') 
        HISCardTypeCode = "01"
        HospId = ClsHisOPObj.terminal_dict.get('hosp_id')
        UserCode = ClsHisOPObj.terminal_dict.get('user_code')
        UserID = ClsHisOPObj.terminal_dict.get('user_id')
        PatientName = PatName
        BusinessMasterId = ClsHisOPObj.serial_id
        
        #Interface
        
        # 保存入参
        InsuDivDr = ""
        AdmSource = ""
        AdmReasonId = ""
        # dhandle, AdmInfoDr, UserID, AdmReasonId, ExpStr
        InsuDivDr = ""
        INSURtn = Tools.GeBDOutPut(BusinessMasterId,'InsuOPDivideCommitBacak','SaveBD')
        #解析医保串  医保患者
        if INSURtn !="" :
            InsuDivDr = INSURtn.split('^')[1] #0^150^200^0^0^门大(城职)联网已结算^^CZZG^1!1^306^033^046^048^047^049^050^0!N
        #取费别
        AdmReasonId = get_mi_type(ClsHisOPObj)
        ExpStr = ""
        CPPFlag = ""
        Password = '111111'
        #Param
        jsonObj = {
            'dhandle': '0',
            'UserID': UserID,
            'InsuDivid': InsuDivDr,
            'AdmSource': AdmSource,
            'AdmReasonId': AdmReasonId, 
            'ExpStr': ExpStr,
            'CPPFlag': CPPFlag
        }
        #print("医保结算返回串",jsonObj)
        jsonStr = json.dumps(jsonObj)
        Response =  jsonStr 
        # 保存出参
        BDObj = BDCtl.BD()
        Input['intef_output'] = Response
        BDObj.saveByWeb(Input)
        # 构造返回参数
        Response = Tools.BuildWebOutPut(Response)
        
        return Response
    # 取消医保预挂号
    def DHC_PayServ_INSUCancelPreReg(self,Input,ClsHisOPObj):
        #print("取消医保预挂号",ClsHisOPObj.__dict__)
        # 组织HIS接口参数
        IDNO = ClsHisOPObj.patinfo_dict.get('idno')
        PatName = ClsHisOPObj.patinfo_dict.get('name')
        INSUCardStr = ClsHisOPObj.patinfo_dict.get('insu_card_no') 
        HISCardTypeCode = "01"
        HospId = ClsHisOPObj.terminal_dict.get('hosp_id')
        UserCode = ClsHisOPObj.terminal_dict.get('user_code')
        UserID = ClsHisOPObj.terminal_dict.get('user_id')
        PatientName = PatName
        BusinessMasterId = ClsHisOPObj.serial_id
        
        #Interface
        # 保存入参
        # dhandle, AdmInfoDr, UserID, AdmReasonId, ExpStr
        AdmInfoDr = ""
        INSURtn = Tools.GeBDOutPut(BusinessMasterId,'INSUPreRegBack','SaveBD')
        #解析医保串  医保患者
        if INSURtn !="" :
            AdmInfoDr = INSURtn.split('^')[1] #0^150^200^0^0^门大(城职)联网已结算^^CZZG^1!1^306^033^046^048^047^049^050^0!N
        #取费别
        AdmReasonId = get_mi_type(ClsHisOPObj)
        ExpStr = ""
        Password = '111111'
        #Param
        jsonObj = {
            'dhandle': '0',
            'UserID': UserID,
            'AdmInfoDr': AdmInfoDr,
            'AdmReasonId': AdmReasonId, 
            'ExpStr': ExpStr
        }
        jsonStr = json.dumps(jsonObj)
        Response =  jsonStr 
        # 保存出参
        BDObj = BDCtl.BD()
        Input['intef_output'] = Response
        BDObj.saveByWeb(Input)
        # 构造返回参数
        Response = Tools.BuildWebOutPut(Response)
        
        return Response
    # 取消医保挂号
    def DHC_PayServ_INSURegReturn(self,Input,ClsHisOPObj):
        #print("取消医保挂号",ClsHisOPObj.__dict__)
        # 组织HIS接口参数
        IDNO = ClsHisOPObj.patinfo_dict.get('idno')
        PatName = ClsHisOPObj.patinfo_dict.get('name')
        INSUCardStr = ClsHisOPObj.patinfo_dict.get('insu_card_no') 
        HISCardTypeCode = "01"
        HospId = ClsHisOPObj.terminal_dict.get('hosp_id')
        UserCode = ClsHisOPObj.terminal_dict.get('user_code')
        UserID = ClsHisOPObj.terminal_dict.get('user_id')
        PatientName = PatName
        BusinessMasterId = ClsHisOPObj.serial_id
        
        #Interface
        # 保存入参
        # dhandle, AdmInfoDr, UserID, AdmReasonId, ExpStr
        # dhandle, AdmInfoDr, UserID, AdmReasonId, ExpStr
        AdmInfoDr = ""
        INSURtn = Tools.GeBDOutPut(BusinessMasterId,'INSURegBack','SaveBD')
        #解析医保串  医保患者
        if INSURtn !="" :
            AdmInfoDr = INSURtn.split('^')[1] #0^150^200^0^0^门大(城职)联网已结算^^CZZG^1!1^306^033^046^048^047^049^050^0!N
        #取费别
        AdmReasonId = get_mi_type(ClsHisOPObj)
           
        ExpStr = ""
        Password = '111111'
        #Param
        jsonObj = {
            'dhandle': '0',
            'UserID': UserID,
            'AdmInfoDr': AdmInfoDr,
            'AdmReasonId': AdmReasonId, 
            'ExpStr': ExpStr
        }
        #print("取消医保挂号返回串",jsonObj)
        jsonStr = json.dumps(jsonObj)
        Response =  jsonStr 
        # 保存出参
        BDObj = BDCtl.BD()
        Input['intef_output'] = Response
        BDObj.saveByWeb(Input)
        # 构造返回参数
        Response = Tools.BuildWebOutPut(Response)
        
        return Response
    # 通过科室ID获取科室代码
    # 医保上传需要HIS科室代码，HIS所有接口均返回id
    def DHC_GetDepInfoById(self,DepId,ClsHisOPObj):
        # 组织HIS接口参数
        SaveSYSLog('DHC_GetDepInfoById接口开始')
        BusinessMasterId = ClsHisOPObj.serial_id
        IDNO = ClsHisOPObj.patinfo_dict.get('idno')
        PatName = ClsHisOPObj.patinfo_dict.get('name')
        HISCardTypeCode = "01"
        HospId = ClsHisOPObj.terminal_dict.get('hosp_id')
        UserCode = ClsHisOPObj.terminal_dict.get('user_code')

        Sex = ClsHisOPObj.patinfo_dict.get('sex')
        DOB = ClsHisOPObj.patinfo_dict.get('brtd')


        RequestStr = "<Request><TradeCode>GetDepInfoById</TradeCode><DepId>" + DepId + "</DepId></Request>"
        # 调用HIS接口
        Response = CallHISWS(RequestStr)
        return Response
    def BuildCardStr (self,ClsHisOPObj):
        INSUCardStr = ClsHisOPObj.patinfo_dict.get('insu_card_no') 
        if len(INSUCardStr.split('^')) > 34:
            pass
        else:
            CardStr = '' #+ '|' + '' + '|' + '' + '|' + '' + '|' + '' + '|' + '' + '|' + ''
            return CardStr
        MedCardNo = INSUCardStr.split('^')[1]
        PersonalID = INSUCardStr.split('^')[0]
        CheckCode = INSUCardStr.split('^')[21]
        MultitudeCategory = INSUCardStr.split('^')[34]
        BusinessMasterId = ClsHisOPObj.serial_id
        MTLB = ''
        UserOperationDic = Tools.GetUserOperation(BusinessMasterId,"diag")
        DicInfo = UserOperationDic.get('Param')
        if DicInfo:       
            DicInfoDic = json.loads(DicInfo)
            MTLB = str(DicInfoDic.get('INDIDDicCode'))
        AdmReasonId = '2'
        UserOperationDic = Tools.GetUserOperation(BusinessMasterId,"insutype")
        DicInfo = UserOperationDic.get('Param')
        if DicInfo:
           AdmReasonId =  DicInfo
        # 城镇职工传5 ，门特传2
        #if AdmReasonId == "2":
        #    InsurTypeCode = "5"
        #else:
        #    InsurTypeCode = "2"
        MtType = MTLB
        Password = '111111'
        CardStr = MedCardNo + '|' + '' + '|'  + PersonalID + '|' + CheckCode + '|' + MultitudeCategory # + '|' + Password + '|' + PersonalID + '|' + CheckCode + '|' + MultitudeCategory + '|' + InsurTypeCode + '|' + MtType
        return CardStr
    # 医保挂号扩展串
    def DHC_1105(self,ClsHisOPObj,ScheduleItemCode):
        #print("医保挂号扩展串开始：",ClsHisOPObj.__dict__)
        # 组织HIS接口参数
        IDNO = ClsHisOPObj.patinfo_dict.get('idno')
        PatName = ClsHisOPObj.patinfo_dict.get('name')
        INSUCardStr = ClsHisOPObj.patinfo_dict.get('insu_card_no') 
        HISCardTypeCode = "01"
        HospId = ClsHisOPObj.terminal_dict.get('hosp_id')
        UserCode = ClsHisOPObj.terminal_dict.get('user_code')
        UserID = ClsHisOPObj.terminal_dict.get('user_id')
        PatientName = PatName
        BusinessMasterId = ClsHisOPObj.serial_id
        CardNo = ClsHisOPObj.his_patinfo_dict.get('his_unique_no') 
        MTLB = ''
        UserOperationDic = Tools.GetUserOperation(BusinessMasterId,"diag")
        DicInfo = UserOperationDic.get('Param')
        if DicInfo:       
            DicInfoDic = json.loads(DicInfo)
            MTLB = str(DicInfoDic.get('INDIDDicCode'))
        #Money
        APPTRowId = ""
        UserOperationDic = Tools.GetUserOperation(BusinessMasterId,"getpredetails")
        if UserOperationDic:
            APPTRowId = UserOperationDic.get('OrderCode')
        RequestStr = "<Request><APPTRowId>" + APPTRowId + "</APPTRowId><TradeCode>1105</TradeCode><MTBillType>" + MTLB + "</MTBillType><ExtUserID>" + UserCode + "</ExtUserID><CardType>01</CardType><PatientID>" + CardNo + "</PatientID><ScheduleItemCode>" + ScheduleItemCode + "</ScheduleItemCode></Request>"
        # 调用HIS接口
        #print("医保挂号扩展串入参：",RequestStr)
        Response = CallHISWS(RequestStr)   
        ResultCode = Tools.GetXMLNode(Response,'ResultCode')  
        if ResultCode != "0" :
            raise Exception(Response)
        
        # 构造返回参数
        #print("医保挂号扩展串结束：",Response)
        return Response
    # 锁号
    def DHC_10015(self,Input,ClsHisOPObj):
        # 组织HIS接口参数
        #print("医保挂号扩展串开始：",ClsHisOPObj.__dict__)
        # 组织HIS接口参数
        IDNO = ClsHisOPObj.patinfo_dict.get('idno')
        PatName = ClsHisOPObj.patinfo_dict.get('name')
        INSUCardStr = ClsHisOPObj.patinfo_dict.get('insu_card_no') 
        HISCardTypeCode = "01"
        HospId = ClsHisOPObj.terminal_dict.get('hosp_id')
        UserCode = ClsHisOPObj.terminal_dict.get('user_code')
        UserID = ClsHisOPObj.terminal_dict.get('user_id')
        PatientName = PatName
        BusinessMasterId = ClsHisOPObj.serial_id
        CardNo = ClsHisOPObj.his_patinfo_dict.get('his_unique_no') 

        #Interface
        #&Param = {"ScheduleItemCode":"56||12","ServiceDate":"2021-07-23","WeekDay":"5","SessionCode":"06","SessionName":"24小时","StartTime":"00:00","EndTime":"23:59","DepartmentCode":"149","DepartmentName":"肾内科门诊","DoctorCode":"56","DoctorName":"翟留玉","DoctorTitleCode":"81","DoctorTitle":"普通号","DoctorSessTypeCode":"81","DoctorSessType":"普通号","Fee":"15","RegFee":"0","CheckupFee":"15","OtherFee":"0","AvailableNumStr":"5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,96,97,98,99,100,101","AdmitAddress":"2层内科诊区11诊室","ScheduleStatus":"1","AvailableTotalNum":"100","AvailableLeftNum":"96","TimeRangeFlag":"1","JointFlag":"N"}
        UserOperationDic = Tools.GeBDOutPut(BusinessMasterId,"ScheduleInfo",'SaveBD')
        UserOperationDic = json.loads(UserOperationDic)
        ScheduleItemCode = UserOperationDic.get('ScheduleItemCode')
        MTBillType = ""
        UserOperationDic = Tools.GetUserOperation(BusinessMasterId,"diag")
        if UserOperationDic:
            DicInfo = UserOperationDic.get('Param')
            if DicInfo:       
                DicInfoDic = json.loads(DicInfo)
                MTBillType = str(DicInfoDic.get('INDIDDicCode'))
        AdmReason = ""
        UserOperationDic = Tools.GetUserOperation(BusinessMasterId,"insutype")
        if UserOperationDic:
            DicInfo = UserOperationDic.get('Param')
            if DicInfo:
                AdmReason =  DicInfo
        RequestStr = "<Request><TradeCode>10015</TradeCode><AdmReason>" + AdmReason + "</AdmReason><MTBillType>" + MTBillType + "</MTBillType><CardType>" + HISCardTypeCode + "</CardType><PatientID>" + CardNo + "</PatientID><ExtUserID>" + UserCode +  "</ExtUserID><ScheduleItemCode>" + ScheduleItemCode + "</ScheduleItemCode><PayOrderId></PayOrderId><LockQueueNo></LockQueueNo></Request>"
        # 保存入参
        #print("RequestStr",RequestStr)
        BDObj = BDCtl.BD()
        Input['intef_input'] = RequestStr
        BDObj.saveByWeb(Input)
        # 调用HIS接口
        ResponseXml = CallHISWS(RequestStr)
        # 保存出参
        Input['id'] = BDObj.result
        Input['intef_output'] = ResponseXml
        BDObj.saveByWeb(Input)
        # 构造返回参数
        Response = Tools.BuildWebOutPut(ResponseXml)
        return Response  
    # 取消锁号
    def DHC_10016(self,Input,ClsHisOPObj):
        # 组织HIS接口参数
        IDNO = ClsHisOPObj.patinfo_dict.get('idno')
        PatName = ClsHisOPObj.patinfo_dict.get('name')
        INSUCardStr = ClsHisOPObj.patinfo_dict.get('insu_card_no') 
        HISCardTypeCode = "01"
        HospId = ClsHisOPObj.terminal_dict.get('hosp_id')
        UserCode = ClsHisOPObj.terminal_dict.get('user_code')
        UserID = ClsHisOPObj.terminal_dict.get('user_id')
        PatientName = PatName
        BusinessMasterId = ClsHisOPObj.serial_id
        CardNo = ClsHisOPObj.his_patinfo_dict.get('his_unique_no') 
        # 取操作数据
        # <Response><TradeCode>10015</TradeCode><TransactionId>DHC000451210729143727</TransactionId><ResultCode>0</ResultCode><ResultContent>加号成功</ResultContent><LockQueueNo>1</LockQueueNo><ScheduleItemCode>56||6</ScheduleItemCode><AdmDoc>普通号</AdmDoc><AdmDate>2021-07-29</AdmDate><AdmTime>24小时</AdmTime><RegFee>15</RegFee></Response>
        BDOutPut = Tools.GeBDOutPut(BusinessMasterId,intef_code = '10015')
        #print("10016参数",BDOutPut)
        ScheduleItemCode = Tools.GetXMLNode(BDOutPut,'ScheduleItemCode')
        #print("10016参数",BDOutPut)
        HisTradeNo = Tools.GetXMLNode(BDOutPut,'HisTradeNo')
        TransactionId = Tools.GetXMLNode(BDOutPut,'TransactionId')
        if TransactionId == "":
            TransactionId = HisTradeNo
        LockNo = Tools.GetXMLNode(BDOutPut,'LockQueueNo') if Tools.GetXMLNode(BDOutPut,'LockQueueNo') else ""
        AppOrderCode = "" #UserOperationDic.get('AppOrderCode') if UserOperationDicObj.get('AppOrderCode') else ""
        PayOrderId = ""
        PayAmount = ""
        PayModeCode = ""
        
        RequestStr="<Request><TradeCode>10016</TradeCode><AppOrderCode>" + ScheduleItemCode + "</AppOrderCode><TransactionId>" + TransactionId + "</TransactionId><ExtOrgCode></ExtOrgCode><ClientType></ClientType><HospitalId>" + HospId + "</HospitalId><TerminalID></TerminalID><ScheduleItemCode>" + ScheduleItemCode + "</ScheduleItemCode><ExtUserID>" + UserCode +"</ExtUserID><PatientID>" + CardNo + "</PatientID><LockQueueNo>" + LockNo + "</LockQueueNo><CardType>" + HISCardTypeCode + "</CardType><PayBankCode></PayBankCode><PayCardNo></PayCardNo><PayModeCode>" + PayModeCode + "</PayModeCode><PayFee>" + PayAmount + "</PayFee><PayInsuFeeStr>" + "" + "</PayInsuFeeStr><PayTradeNo></PayTradeNo><PayOrderId>" + PayOrderId + "</PayOrderId></Request>"
        # 保存入参
        #print("RequestStr",RequestStr)
        BDObj = BDCtl.BD()
        Input['intef_input'] = RequestStr
        BDObj.saveByWeb(Input)
        # 调用HIS接口
        Response = CallHISWS(RequestStr)
        # 保存出参
        Input['id'] = BDObj.result
        Input['intef_output'] = Response
        BDObj.saveByWeb(Input)
        # 构造返回参数
        Response = Tools.BuildWebOutPut(Response)
        return Response
    # 取消预约
    def DHC_1108(self,Input,ClsHisOPObj):
        # 组织HIS接口参数
        IDNO = ClsHisOPObj.patinfo_dict.get('idno')
        PatName = ClsHisOPObj.patinfo_dict.get('name')
        INSUCardStr = ClsHisOPObj.patinfo_dict.get('insu_card_no') 
        HISCardTypeCode = "01"
        HospId = ClsHisOPObj.terminal_dict.get('hosp_id')
        UserCode = ClsHisOPObj.terminal_dict.get('user_code')
        UserID = ClsHisOPObj.terminal_dict.get('user_id')
        PatientName = PatName
        BusinessMasterId = ClsHisOPObj.serial_id
        CardNo = ClsHisOPObj.his_patinfo_dict.get('his_unique_no') 

        BusinessType = ClsHisOPObj.business_type
        ProcessCode = ClsHisOPObj.processcode
        JointFlag = Input.get('JointFlag')
        if JointFlag:
            pass
            #if JointFlag == "Y":
            #    Response = self.CancelUnion(Input,ClsHisOPObj)
            #    return Response        
        if "UnionOP" in ProcessCode:
            pass
            #Response = self.CancelUnion(Input,ClsHisOPObj)
            #return Response

        OrderCode = Input.get('OrderCode')
        # 取操作数据

        RequestStr = '<Request><TradeCode>1108</TradeCode><OrderCode>' + OrderCode + '</OrderCode><ExtUserID>' + UserCode + '</ExtUserID></Request>'
        # 保存入参
        #print("RequestStr",RequestStr)
        BDObj = BDCtl.BD()
        Input['intef_input'] = RequestStr
        BDObj.saveByWeb(Input)
        # 调用HIS接口
        Response = CallHISWS(RequestStr)
        # 保存出参
        Input['id'] = BDObj.result
        Input['intef_output'] = Response
        BDObj.saveByWeb(Input)
        # 构造返回参数
        Response = Tools.BuildWebOutPut(Response)
        return Response
    # 一级科室查询
    def DHC_1011(self,Input,ClsHisOPObj):
        # 组织HIS接口参数
        IDNO = ClsHisOPObj.patinfo_dict.get('idno')
        PatName = ClsHisOPObj.patinfo_dict.get('name')
        INSUCardStr = ClsHisOPObj.patinfo_dict.get('insu_card_no') 
        HISCardTypeCode = "01"
        HospId = ClsHisOPObj.terminal_dict.get('hosp_id')
        UserCode = ClsHisOPObj.terminal_dict.get('user_code')
        UserID = ClsHisOPObj.terminal_dict.get('user_id')
        PatientName = PatName
        BusinessMasterId = ClsHisOPObj.serial_id
        CardNo = ClsHisOPObj.his_patinfo_dict.get('his_unique_no') 
        
        processcode = ClsHisOPObj.processcode
        DepartmentType = "O"
        if processcode == "FR-Reg":
            DepartmentType = "E"

        RequestStr = "<Request><DepartmentType>" + DepartmentType + "</DepartmentType><TradeCode>1011</TradeCode><ExtUserID>" + UserCode + "</ExtUserID><DepartmentGroupCode></DepartmentGroupCode><ExtOrgCode></ExtOrgCode><ClientType>ATM</ClientType><HospitalId>" + HospId +"</HospitalId></Request>"
        # 保存入参
        BDObj = BDCtl.BD()
        Input['intef_input'] = RequestStr
        BDObj.saveByWeb(Input)
        # 调用HIS接口
        Response = CallHISWS(RequestStr)
        # 保存出参
        Input['id'] = BDObj.result
        Input['intef_output'] = Response
        BDObj.saveByWeb(Input)
        # 构造返回参数
        Response = Tools.BuildWebOutPut(Response)
        return Response
    # 医生查询
    def DHC_1013(self,Input,ClsHisOPObj):
        # 组织HIS接口参数
        IDNO = ClsHisOPObj.patinfo_dict.get('idno')
        PatName = ClsHisOPObj.patinfo_dict.get('name')
        INSUCardStr = ClsHisOPObj.patinfo_dict.get('insu_card_no') 
        HISCardTypeCode = "01"
        HospId = ClsHisOPObj.terminal_dict.get('hosp_id')
        UserCode = ClsHisOPObj.terminal_dict.get('user_code')
        UserID = ClsHisOPObj.terminal_dict.get('user_id')
        PatientName = PatName
        BusinessMasterId = ClsHisOPObj.serial_id
        CardNo = ClsHisOPObj.his_patinfo_dict.get('his_unique_no') 

        UserOperationDic = Tools.GetUserOperation(BusinessMasterId,"level2dep")
        DepartmentCode= UserOperationDic.get('DepartmentCode')
        PatientID = ClsHisOPObj.his_patinfo_dict.get('his_unique_no') 
        DoctorCode=""
        Source = ""
        Businesstype = ClsHisOPObj.business_type
        if Businesstype == "Reg":
            Source = "Reg"
        processcode = ClsHisOPObj.processcode
        if processcode == "NAReg-Reg" :
            #DoctorCode = "688" #RowID
            Source = "Reg"
        #  根据配置取
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
        AEndDate = datetime.datetime(2020, 10, 1,23, 0, tzinfo=None)
        SessionCode = ""
        if MStartDate < CurDT < MEndDate:
           SessionCode = "S"
        elif AStartDate < CurDT < AEndDate:
            SessionCode = "X"
        else:
            SessionCode = ""
        if Businesstype == "ORDR":
            SessionCode = ""
        RequestStr =  "<Request><PatientID>" + PatientID + "</PatientID><TimeRangeCode>" + SessionCode + "</TimeRangeCode><Source>" + Source + "</Source><DoctorCode>" + DoctorCode + "</DoctorCode><TradeCode>1013</TradeCode><ExtOrgCode></ExtOrgCode><ClientType></ClientType><HospitalId>" + HospId + "</HospitalId><ExtUserID>" + UserCode + "</ExtUserID><DepartmentCode>" + DepartmentCode + "</DepartmentCode></Request>"
        # 保存入参
        BDObj = BDCtl.BD()
        Input['intef_input'] = RequestStr
        BDObj.saveByWeb(Input)
        # 调用HIS接口
        Response = CallHISWS(RequestStr)
        # 保存出参
        Input['id'] = BDObj.result
        Input['intef_output'] =  Response
        BDObj.saveByWeb(Input)
        # 构造返回参数
        Response = Tools.BuildWebOutPut(Response)
        return Response
    # 医生排班查询
    def DHC_1004(self,Input,ClsHisOPObj):
        # 组织HIS接口参数
        # &Param={"DoctorCode":"56","DoctorName":"翟留玉","DoctotLevelCode":"医师","DoctorLevel":"4","DeptId":"149","DeptName":"肾内科门诊","EffectiveSeqNo":"24小时:98"}
        IDNO = ClsHisOPObj.patinfo_dict.get('idno')
        PatName = ClsHisOPObj.patinfo_dict.get('name')
        INSUCardStr = ClsHisOPObj.patinfo_dict.get('insu_card_no') 
        HISCardTypeCode = "01"
        HospId = ClsHisOPObj.terminal_dict.get('hosp_id')
        UserCode = ClsHisOPObj.terminal_dict.get('user_code')
        UserID = ClsHisOPObj.terminal_dict.get('user_id')
        PatientName = PatName
        BusinessMasterId = ClsHisOPObj.serial_id
        CardNo = ClsHisOPObj.his_patinfo_dict.get('his_unique_no') 
        BusinessType = ClsHisOPObj.business_type

        UserOperationDic = Tools.GetUserOperation(BusinessMasterId,"predoc")
        UserOperationDic= UserOperationDic.get('Param')
        UserOperationDicObj = json.loads(UserOperationDic)
        
        DepartmentCode  = UserOperationDicObj.get('DeptId')
        DoctorCode = UserOperationDicObj.get('DoctorCode')
        #根据配置取
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
        AEndDate = datetime.datetime(2020, 10, 1,17, 0, tzinfo=None)
        SessionCode = ""
        if MStartDate < CurDT < MEndDate:
           SessionCode = "S"
        elif AStartDate < CurDT < AEndDate:
            SessionCode = "X"
        else:
            SessionCode = ""
        #
        if str(BusinessType) == "Reg":
            StartDate = ""
            EndDate = ""
        else:
            StartDate = Tools.getDefStDate(1)
            EndDate = Tools.getDefStDate(14)

        if str(BusinessType) == "ORDR":
            SessionCode = ""
            if DepartmentCode == "194":
                StartDate = Tools.getDefStDate(1)
                EndDate = Tools.getDefStDate(28)
        RequestStr = "<Request><PatientID>" + CardNo + "</PatientID><Source>" + BusinessType + "</Source><TradeCode>1004</TradeCode><ExtOrgCode></ExtOrgCode><ClientType></ClientType><HospitalId>2</HospitalId><ExtUserID>" + UserCode + "</ExtUserID><StartDate>" + StartDate + "</StartDate><EndDate>" + EndDate + "</EndDate><DepartmentCode>" + DepartmentCode + "</DepartmentCode><ServiceCode></ServiceCode><DoctorCode>" + DoctorCode + "</DoctorCode><RBASSessionCode>" + SessionCode + "</RBASSessionCode></Request>"
        # 保存入参
        #print("组织HIS接口参数",RequestStr)
        BDObj = BDCtl.BD()
        Input['intef_input'] = RequestStr
        BDObj.saveByWeb(Input)
        # 调用HIS接口
        Response = CallHISWS(RequestStr)
        # 保存出参
        Input['id'] = BDObj.result
        Input['intef_output'] = Response
        BDObj.saveByWeb(Input)
        # 构造返回参数
        Response = Tools.BuildWebOutPut(Response)
        return Response
    # 分时段信息查询
    def DHC_10041(self,Input,ClsHisOPObj):
        #print('10041参数开始')
        IDNO = ClsHisOPObj.patinfo_dict.get('idno')
        PatName = ClsHisOPObj.patinfo_dict.get('name')
        INSUCardStr = ClsHisOPObj.patinfo_dict.get('insu_card_no') 
        HISCardTypeCode = "01"
        HospId = ClsHisOPObj.terminal_dict.get('hosp_id')
        UserCode = ClsHisOPObj.terminal_dict.get('user_code')
        UserID = ClsHisOPObj.terminal_dict.get('user_id')
        PatientName = PatName
        BusinessMasterId = ClsHisOPObj.serial_id
        CardNo = ClsHisOPObj.his_patinfo_dict.get('his_unique_no') 

        #Param={"ScheduleItemCode":"56||12","ServiceDate":"2021-07-23","WeekDay":"5","SessionCode":"06","SessionName":"24小时","StartTime":"00:00","EndTime":"23:59","DepartmentCode":"149","DepartmentName":"肾内科门诊","DoctorCode":"56","DoctorName":"翟留玉","DoctorTitleCode":"81","DoctorTitle":"普通号","DoctorSessTypeCode":"81","DoctorSessType":"普通号","Fee":"15","RegFee":"0","CheckupFee":"15","OtherFee":"0","AvailableNumStr":"1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,96,97,98,99,100","AdmitAddress":"2层内科诊区11诊室","ScheduleStatus":"1","AvailableTotalNum":"100","AvailableLeftNum":"100","TimeRangeFlag":"1","JointFlag":"N"}
        UserOperationDic = Tools.GetUserOperation(BusinessMasterId,"predocdat")
        UserOperationDic= UserOperationDic.get('Param')
        UserOperationDicObj = json.loads(UserOperationDic)
        DepartmentCode  = UserOperationDicObj.get('DepartmentCode') if UserOperationDicObj.get('DepartmentCode') else ""
        DoctorCode = UserOperationDicObj.get('DoctorCode') if UserOperationDicObj.get('DoctorCode') else ""
        ScheduleItemCode = UserOperationDicObj.get('ScheduleItemCode')
        RBASSessionCode = UserOperationDicObj.get('RBASSessionCode') if UserOperationDicObj.get('RBASSessionCode') else ""
        ServiceDate = UserOperationDicObj.get('ServiceDate')
        RequestStr = "<Request><TradeCode>10041</TradeCode><HospitalId>" + HospId + "</HospitalId><DepartmentCode>" + DepartmentCode + "</DepartmentCode><ExtUserID>" + UserCode + "</ExtUserID><DoctorCode>" + DoctorCode + "</DoctorCode><ScheduleItemCode>" + ScheduleItemCode + "</ScheduleItemCode><PatientID>" + CardNo + "</PatientID><CardType>" + HISCardTypeCode + "</CardType><CredTypeCode>01</CredTypeCode><RBASSessionCode>" + RBASSessionCode + "</RBASSessionCode><ServiceDate>" + ServiceDate +"</ServiceDate></Request>"
        # 保存入参
        BDObj = BDCtl.BD()
        Input['intef_input'] = RequestStr
        BDObj.saveByWeb(Input)
        # 调用HIS接口
        Response = CallHISWS(RequestStr)
        # 保存出参
        Input['id'] = BDObj.result
        Input['intef_output'] = Response
        BDObj.saveByWeb(Input)
        # 构造返回参数
        Response = Tools.BuildWebOutPut(Response)
        return Response  
    # 患者基本信息修改
    def DHC_3016(self,Input,ClsHisOPObj):
        #print('3016参数开始')
        IDNO = ClsHisOPObj.patinfo_dict.get('idno')
        PatName = ClsHisOPObj.patinfo_dict.get('name')
        INSUCardStr = ClsHisOPObj.patinfo_dict.get('insu_card_no') 
        HISCardTypeCode = "01"
        HospId = ClsHisOPObj.terminal_dict.get('hosp_id')
        UserCode = ClsHisOPObj.terminal_dict.get('user_code')
        UserID = ClsHisOPObj.terminal_dict.get('user_id')
        PatientName = PatName
        BusinessMasterId = ClsHisOPObj.serial_id
        CardNo = ClsHisOPObj.his_patinfo_dict.get('his_unique_no') 


        TelePhoneNo = Input.get('TelePhoneNo')
        RequestStr = "<Request><TradeCode>3016</TradeCode><ExtUserID>" + UserCode + "</ExtUserID><PatientID>" + CardNo + "</PatientID><TelephoneNo>" + TelePhoneNo + "</TelephoneNo><IDType></IDType><PatientCard></PatientCard><CardTypeCode>" + HISCardTypeCode + "</CardTypeCode><PatName>" + PatName + "</PatName><PatSex></PatSex><PatType></PatType><GuardianNo></GuardianNo><IDNo></IDNo><PatBirth></PatBirth></Request>"
        # 保存入参
        #print("RequestStr",RequestStr)
        BDObj = BDCtl.BD()
        Input['intef_input'] = RequestStr
        BDObj.saveByWeb(Input)
        # 调用HIS接口
        Response = CallHISWS(RequestStr)
        # 保存出参
        Input['id'] = BDObj.result
        Input['intef_output'] = Response
        BDObj.saveByWeb(Input)
        # 构造返回参数
        Response = Tools.BuildWebOutPut(Response)
        return Response 
    # 预约
    def DHC_1000(self,Input,ClsHisOPObj):
        #print('1000参数开始')
        # 组织HIS接口参数
        IDNO = ClsHisOPObj.patinfo_dict.get('idno')
        PatName = ClsHisOPObj.patinfo_dict.get('name')
        INSUCardStr = ClsHisOPObj.patinfo_dict.get('insu_card_no') 
        HospId = ClsHisOPObj.terminal_dict.get('hosp_id')
        UserCode = ClsHisOPObj.terminal_dict.get('user_code')
        UserID = ClsHisOPObj.terminal_dict.get('user_id')
        PatientName = PatName
        BusinessMasterId = ClsHisOPObj.serial_id
        BusinessType = ClsHisOPObj.business_type
        # 取操作数据
        UserOperationDic = Tools.GetUserOperation(BusinessMasterId,"predoctime")
        #print("UserOperationDic",UserOperationDic)
        #{'Param': '{"ScheduleItemCode":"4388||3","ServiceDate":"2021-09-05","WeekDay":"7","SessionCode":"01","SessionName":"上午","StartTime":"08:00","EndTime":"12:00","DepartmentCode":"119","DepartmentName":"内分泌科门诊","DoctorCode":"636","DoctorName":"段丽君","DoctorTitleCode":"79","DoctorTitle":"主任号","DoctorSessTypeCode":"79","DoctorSessType":"主任号","Fee":"30","RegFee":"0","CheckupFee":"30","OtherFee":"0","AvailableNumStr":"6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30","AdmitAddress":"1层内科诊区11、12、13诊室","ScheduleStatus":"1","AvailableTotalNum":"30","AvailableLeftNum":"25","TimeRangeFlag":"1","JointFlag":"N"}'}
        ScheduleItemCode = UserOperationDic.get('ScheduleItemCode')
        LockQueueNo = ""
        if UserOperationDic.get('LockQueueNo'):
            LockQueueNo = UserOperationDic.get('LockQueueNo')
        TransactionId = ""
        if UserOperationDic.get('TransactionId'):
            TransactionId = UserOperationDic.get('TransactionId')
        AdmitRange = ""
        if UserOperationDic.get('AdmitRange'):
            AdmitRange = UserOperationDic.get('AdmitRange')
        Address = "" #UserOperationDic.get('Address') if UserOperationDic.get('Address') else ""
        TelePhoneNo = ""
        #联合门诊参数
        JointFlag = ""
        LinkApptID = ""
        ProcessCode = ClsHisOPObj.processcode
        #print("ProcessCode",ProcessCode)
        if "UnionOP" in ProcessCode:
            JointFlag = "Y"
            LinkApptID = ""
            #Response = self.DOUnion(Input,ClsHisOPObj)
            #return Response
        CardNo = ClsHisOPObj.his_patinfo_dict.get('his_unique_no') 
        HISCardTypeCode = ClsHisOPObj.his_patinfo_dict.get('his_card_type')
        #else: #正常预约
        RequestStr = "<Request><JointFlag>" + JointFlag + "</JointFlag><LinkApptID>" + LinkApptID + "</LinkApptID><TradeCode>1000</TradeCode><ScheduleItemCode>" + ScheduleItemCode + "</ScheduleItemCode><LockQueueNo>" + LockQueueNo + "</LockQueueNo><HospitalId>" + HospId + "</HospitalId><ExtUserID>" + UserCode +"</ExtUserID><TransactionId>" + TransactionId + "</TransactionId><PatientID>" + CardNo + "</PatientID><CardType>" + HISCardTypeCode + "</CardType><PatientName>" + PatientName + "</PatientName><CredTypeCode>" + HISCardTypeCode + "</CredTypeCode><IDCardNo>" + IDNO + "</IDCardNo><TelePhoneNo>" + TelePhoneNo + "</TelePhoneNo><MobileNo>" + TelePhoneNo + "</MobileNo><AdmitRange>" + AdmitRange + "</AdmitRange><Address>" + Address + "</Address></Request>"
        # 保存入参
        BDObj = BDCtl.BD()
        Input['intef_input'] = RequestStr
        BDObj.saveByWeb(Input)
        # 调用HIS接口
        Response = CallHISWS(RequestStr)
        # 保存出参
        Input['id'] = BDObj.result
        Input['intef_output'] = Response
        BDObj.saveByWeb(Input)
        # 构造返回参数
        Response = Tools.BuildWebOutPut(Response)
        return Response 
    # 预约记录查询
    def DHC_1005(self,Input,ClsHisOPObj):
        #print('1005参数开始')
        # 组织HIS接口参数
        IDNO = ClsHisOPObj.patinfo_dict.get('idno')
        PatName = ClsHisOPObj.patinfo_dict.get('name')
        INSUCardStr = ClsHisOPObj.patinfo_dict.get('insu_card_no') 
        HISCardTypeCode = "01"
        HospId = ClsHisOPObj.terminal_dict.get('hosp_id')
        UserCode = ClsHisOPObj.terminal_dict.get('user_code')
        UserID = ClsHisOPObj.terminal_dict.get('user_id')
        PatientName = PatName
        BusinessMasterId = ClsHisOPObj.serial_id
        CardNo = ClsHisOPObj.his_patinfo_dict.get('his_unique_no') 
        BusinessType = ClsHisOPObj.business_type
        

        if BusinessType == "OBTNO": #取号
            QueryDateFlag = "AdmDate"
            OrderApptEndDate = Tools.getDefStDate(0)
            OrderApptStartDate = Tools.getDefStDate(0)
        
        elif BusinessType == "PreOrder": #查询
            QueryDateFlag = "AdmDate"
            OrderApptEndDate = Tools.getDefStDate(14)
            OrderApptStartDate = Tools.getDefStDate(0)
        
        elif BusinessType == "DRINCRNO": #加号
            QueryDateFlag = ""
            OrderApptEndDate = "" #Tools.getDefStDate(0)
            OrderApptStartDate = "" #Tools.getDefStDate(-7)
        else:
            QueryDateFlag = ""
            OrderApptEndDate = ""
            OrderApptStartDate = ""
        VIPNo = ""
        if Input.get('VIPNo')  :
            VIPNo = Input.get('VIPNo')
        PatientNo = CardNo
        IDCardNo = ""
        # 门特类别
        MTLB = ''
        UserOperationDic = Tools.GetUserOperation(BusinessMasterId,"diag")
        DicInfo = UserOperationDic.get('Param')
        if DicInfo:       
            DicInfoDic = json.loads(DicInfo)
            MTLB = str(DicInfoDic.get('INDIDDicCode'))
        HSDocFlag = "N"
        processcode=ClsHisOPObj.processcode
        if processcode == "NA-OBTNO":
            HSDocFlag = "Y"
        BusinessType = processcode
        AdmReason = ""
        UserOperationDic = Tools.GetUserOperation(BusinessMasterId,"insutype")
        if UserOperationDic:
            DicInfo = UserOperationDic.get('Param')
            if DicInfo:
                AdmReason =  DicInfo
        RequestStr = '<Request><AdmReason>' + AdmReason + '</AdmReason><BusinessType>' + BusinessType + '</BusinessType><HSDocFlag>' + HSDocFlag + '</HSDocFlag><MTBillType>' + MTLB + '</MTBillType><VIPNo>' + VIPNo + '</VIPNo><OrderApptEndDate>' + OrderApptEndDate + '</OrderApptEndDate><OrderApptStartDate>' + OrderApptStartDate + '</OrderApptStartDate><TradeCode>1005</TradeCode><IDCardNo>' + IDCardNo + '</IDCardNo><CardNo></CardNo><PatientNo>' + PatientNo + '</PatientNo><ExtUserID>' + UserCode + '</ExtUserID><QueryDateFlag>'+ QueryDateFlag + '</QueryDateFlag><CardType>' + HISCardTypeCode +'</CardType></Request>'
        # 保存入参
        #print("RequestStr",RequestStr)
        BDObj = BDCtl.BD()
        Input['intef_input'] = RequestStr
        BDObj.saveByWeb(Input)
        # 调用HIS接口
        Response = CallHISWS(RequestStr)
        # 保存出参
        Input['id'] = BDObj.result
        Input['intef_output'] = Response
        BDObj.saveByWeb(Input)
        # 构造返回参数
        Response = Tools.BuildWebOutPut(Response)
        return Response
    # 最终挂号---标志一次挂号成功
    def DHC_1101(self,Input,ClsHisOPObj):
        #print('1101参数开始')
        IDNO = ClsHisOPObj.patinfo_dict.get('idno')
        PatName = ClsHisOPObj.patinfo_dict.get('name')
        INSUCardStr = ClsHisOPObj.patinfo_dict.get('insu_card_no') 
        HISCardTypeCode = "01"
        HospId = ClsHisOPObj.terminal_dict.get('hosp_id')
        UserCode = ClsHisOPObj.terminal_dict.get('user_code')
        UserID = ClsHisOPObj.terminal_dict.get('user_id')
        PatientName = PatName
        BusinessMasterId = ClsHisOPObj.serial_id
        CardNo = ClsHisOPObj.his_patinfo_dict.get('his_unique_no') 
        BusinessType = ClsHisOPObj.business_type
        AdmReasonDr = "1"
        UserOperationDic = Tools.GetUserOperation(BusinessMasterId,"insutype")
        DicInfo = UserOperationDic.get('Param')
        if DicInfo:
           AdmReasonDr =  DicInfo
        APPTRowId = ""
        #Interface
        if  BusinessType == "DRINCRNO":
            UserOperationDic = Tools.GetUserOperation(BusinessMasterId,"getpredetails")
            
            OrderCode = UserOperationDic.get('OrderCode')
            TotalAmt = UserOperationDic.get('PayAmt')
            UserOperationDic = Tools.GetUserOperation(BusinessMasterId,"input")
            ScheduleItemCode = "" #UserOperationDic.get('InuputNo')
            # var ParamInput = "&PayModeCode=" + Param.split('^')[1] + "&PayModeId=" + Param.split('^')[0];
            # 取操作数据
            if OrderCode:
                APPTRowId = OrderCode
            UserOperationDic = Tools.GetUserOperation(BusinessMasterId,"paymode")
            PayModeCode = UserOperationDic.get('PayModeCode')
            TransactionId = ""
            LockNo = ""
        elif BusinessType =="Reg":

            BDOutPut = Tools.GeBDOutPut(BusinessMasterId,intef_code = '10015')
            ScheduleItemCode = Tools.GetXMLNode(BDOutPut,'ScheduleItemCode') 
            TransactionId = Tools.GetXMLNode(BDOutPut,'TransactionId') 
            OrderCode = ""
            TotalAmt = Tools.GetXMLNode(BDOutPut,'RegFee')
            LockNo = ""
            
            BDOutPut = Tools.GetUserOperation(BusinessMasterId,'paymode')
            PayModeCode = "WECHAT"
            if 'PayModeCode' in BDOutPut.keys():
                PayModeCode = BDOutPut.get('PayModeCode')
        elif BusinessType =="OBTNO":

            BDOutPut = Tools.GeBDOutPut(BusinessMasterId,'pay','10015')
            ScheduleItemCode = Tools.GetXMLNode(BDOutPut,'ScheduleItemCode') 
            TransactionId = Tools.GetXMLNode(BDOutPut,'TransactionId') 
            
            
            LockNo = ""

            BDOutPut = Tools.GetUserOperation(BusinessMasterId,'paymode')
            PayModeCode = BDOutPut.get('PayModeCode')

            BDOutPut = Tools.GetUserOperation(BusinessMasterId,'getpredetails')
            OrderCode = BDOutPut.get('OrderCode')
            TotalAmt = BDOutPut.get('PayAmt')
        #
        PayAmount = Tools.GeBDOutPut(BusinessMasterId,intef_code = 'GetInsuAmt').split('^')[0]
        PayDetails = ""
        # 取支付方式对照
        HISPayMode = "CASH" #0费用
        HISPayModeDict = ss_dicdataCtl.GetDicConByDicTypeCode("PayMode",PayModeCode)
        if HISPayModeDict:
            HISPayMode = HISPayModeDict.get('ss_dic_concode')
        if str(PayAmount) == "0" or str(PayAmount) == "0.00" or str(PayAmount) == "0.0":
            HISPayMode = "CASH" #0费用
        if PayModeCode == "JHZFYHK":
            PayModeCode = PayModeCode
            TradeChannel = PayModeCode
            PayAccountNo = ""
            PayAmt = PayAmount
            PlatformNo = ""
            OutPayNo = ClsHisOPObj.serial_number
            PayChannel = PayModeCode
            PayServPOSPay = Tools.GeBDOutPut(BusinessMasterId,intef_code = 'PayServ_POSPay')
            POSPayStr = PayServPOSPay
            PayDetails = "<PayDetails><PayModeCode>" + HISPayMode + "</PayModeCode><TradeChannel>" + TradeChannel  + "</TradeChannel><PayAccountNo>" + PayAccountNo + "</PayAccountNo><PayAmt>" + PayAmt + "</PayAmt><PlatformNo>" + PlatformNo + "</PlatformNo><OutPayNo>" + OutPayNo + "</OutPayNo><PayChannel>" + PayChannel + "</PayChannel><PayData>" + POSPayStr + "</PayData></PayDetails>"
        elif PayModeCode == "WECHAT" or PayModeCode == "AlIPAY":
            PayModeCode = PayModeCode
            TradeChannel = PayModeCode
            PayAccountNo = ""
            PayAmt = PayAmount
            PlatformNo = ""
            OutPayNo = ClsHisOPObj.serial_number
            PayChannel = PayModeCode
            PayServPOSPay = ss_extdetailsCtl.GetEXTSuccessInfo(ClsHisOPObj) 
            PayServPOSPay = PayServPOSPay.get('ss_extd_outinfo')
            PayServPOSPay = json.dumps(PayServPOSPay)
            POSPayStr = PayServPOSPay
            PayDetails = "<PayDetails><PayModeCode>" + HISPayMode + "</PayModeCode><TradeChannel>" + TradeChannel  + "</TradeChannel><PayAccountNo>" + PayAccountNo + "</PayAccountNo><PayAmt>" + PayAmt + "</PayAmt><PlatformNo>" + PlatformNo + "</PlatformNo><OutPayNo>" + OutPayNo + "</OutPayNo><PayChannel>" + PayChannel + "</PayChannel><PayData>" + POSPayStr + "</PayData></PayDetails>"

        PayOrderId = "95275555555" + LockNo
        PayInsuFeeStr = Tools.GeBDOutPut(BusinessMasterId,'INSURegBack','SaveBD')
        if PayInsuFeeStr !="":
            PayInsuFeeStr = PayInsuFeeStr.replace(chr(2),"$c(2)")
        if AdmReasonDr != "1" and AdmReasonDr != "": #判断医保患者 是否有过医保挂号
            if PayInsuFeeStr == "":
                raise Exception("1101^医保网络异常请重试一次，谢谢")
        if AdmReasonDr == "1" and HISPayMode == "CASH" :
            if str(PayAmount) != "0" and str(PayAmount) != "0.00" and str(PayAmount) != "0.0":
                raise Exception("1101^医保网络异常请重试一次，谢谢")
        #print("PayInsuFeeStrOutPut",PayInsuFeeStr)
        MTBillType = ""
        UserOperationDic = Tools.GetUserOperation(BusinessMasterId,"diag")
        DicInfo = UserOperationDic.get('Param')
        if DicInfo:       
            DicInfoDic = json.loads(DicInfo)
            MTBillType = str(DicInfoDic.get('INDIDDicCode'))
        RequestStr="<Request><APPTRowId>" + APPTRowId + "</APPTRowId><MTBillType>" + MTBillType + "</MTBillType><AdmReasonDr>" + AdmReasonDr +  "</AdmReasonDr><TradeCode>1101</TradeCode><AppOrderCode>" + OrderCode + "</AppOrderCode><TransactionId>" + TransactionId + "</TransactionId><ExtOrgCode></ExtOrgCode><ClientType></ClientType><HospitalId>" + HospId + "</HospitalId><TerminalID></TerminalID><ScheduleItemCode>" + ScheduleItemCode + "</ScheduleItemCode><ExtUserID>" + UserCode +"</ExtUserID><PatientID>" + CardNo + "</PatientID><QueueNo>" + LockNo + "</QueueNo><CardType>" + HISCardTypeCode + "</CardType><PayBankCode></PayBankCode><PayCardNo></PayCardNo><PayModeCode>" + HISPayMode + "</PayModeCode><PayFee>" + TotalAmt + "</PayFee><PayInsuFeeStr>" + PayInsuFeeStr + "</PayInsuFeeStr><PayTradeNo></PayTradeNo><PayOrderId>" + PayOrderId + "</PayOrderId>" + PayDetails + "</Request>"
        # 保存入参
        #print("RequestStr",RequestStr)
        BDObj = BDCtl.BD()
        Input['intef_input'] = RequestStr
        BDObj.saveByWeb(Input)
        # 调用HIS接口
        Response = CallHISWS(RequestStr)
        # 保存出参
        Input['id'] = BDObj.result
        Input['intef_output'] = Response
        BDObj.saveByWeb(Input)
        # 判断HIS是否成功
        HISVal = Tools.GetXMLNode(Response,'ResultCode')
        err = "-1"
        if HISVal == '0':
            err = "0"
            # 保存成功时的交易金额
            TradeAmt = Tools.GetXMLNode(Response,'RegFee') 
            BDObj = BDCtl.BD()
            del Input['id']
            Input['TradeCode'] = 'OrderAmt'
            Input['intef_input'] = ""
            Input['intef_output'] = TradeAmt
            BDObj.saveByWeb(Input) 
        # 构造返回参数
        Response = Tools.BuildWebOutPut(Response)
        output = {
            'result' : err,
            'output': Response
        }
        return output 
    # HIS预结算
    def DHC_4905(self,Input,ClsHisOPObj):
        #print('4905参数开始')
        IDNO = ClsHisOPObj.patinfo_dict.get('idno')
        PatName = ClsHisOPObj.patinfo_dict.get('name')
        INSUCardStr = ClsHisOPObj.patinfo_dict.get('insu_card_no') 
        HISCardTypeCode = "01"
        HospId = ClsHisOPObj.terminal_dict.get('hosp_id')
        UserCode = ClsHisOPObj.terminal_dict.get('user_code')
        UserID = ClsHisOPObj.terminal_dict.get('user_id')
        PatientName = PatName
        BusinessMasterId = ClsHisOPObj.serial_id
        CardNo = ClsHisOPObj.his_patinfo_dict.get('his_unique_no') 
        BusinessType = ClsHisOPObj.business_type

        #Interface
        # <Response><TradeCode>10015</TradeCode><TransactionId>DHC000407210723115449</TransactionId><ResultCode>0</ResultCode><ResultContent>加号成功</ResultContent><LockQueueNo>5</LockQueueNo><ScheduleItemCode>56||12</ScheduleItemCode><AdmDoc>普通号</AdmDoc><AdmDate>2021-07-23</AdmDate><AdmTime>24小时</AdmTime><RegFee>15</RegFee></Response>
        OrderNo = Input.get('OrderNo')
        Amount = Input.get('OrderSum')
        CardType = "1"
        RequestStr = '<Request><TradeCode>4905</TradeCode><HospitalID>' + HospId + '</HospitalID><PatientID>' + CardNo + '</PatientID><Adm>' + '' +'</Adm><OrderNo>' + OrderNo + '</OrderNo><OrderSum>' + Amount + '</OrderSum><CardType>' + CardType + '</CardType><UserCode>' + UserCode + '</UserCode></Request>'
        # 保存入参
        #print("RequestStr",RequestStr)
        BDObj = BDCtl.BD()
        Input['intef_input'] = RequestStr
        BDObj.saveByWeb(Input)
        # 调用HIS接口
        Response = CallHISWS(RequestStr)
        # 保存出参
        Response = Response.replace("![CDATA[","")
        Response = Response.replace("]]","")
        Response = Response.replace(" ","")
        Input['id'] = BDObj.result
        Input['intef_output'] = Response
        BDObj.saveByWeb(Input)
        # 构造返回参数
        Response = Tools.BuildWebOutPut(Response)
        return Response 
    # HIS确认完成  标志HIS结算成功
    def DHC_4906(self,Input,ClsHisOPObj):
        #print('4906参数开始')
        # 组织HIS接口参数
        IDNO = ClsHisOPObj.patinfo_dict.get('idno')
        PatName = ClsHisOPObj.patinfo_dict.get('name')
        INSUCardStr = ClsHisOPObj.patinfo_dict.get('insu_card_no') 
        HISCardTypeCode = "01"
        HospId = ClsHisOPObj.terminal_dict.get('hosp_id')
        UserCode = ClsHisOPObj.terminal_dict.get('user_code')
        UserID = ClsHisOPObj.terminal_dict.get('user_id')
        PatientName = PatName
        BusinessMasterId = ClsHisOPObj.serial_id
        CardNo = ClsHisOPObj.his_patinfo_dict.get('his_unique_no') 
        BusinessType = ClsHisOPObj.business_type
        #Interface
        # <Response><TradeCode>10015</TradeCode><TransactionId>DHC000407210723115449</TransactionId><ResultCode>0</ResultCode><ResultContent>加号成功</ResultContent><LockQueueNo>5</LockQueueNo><ScheduleItemCode>56||12</ScheduleItemCode><AdmDoc>普通号</AdmDoc><AdmDate>2021-07-23</AdmDate><AdmTime>24小时</AdmTime><RegFee>15</RegFee></Response>
        
        BDOutPut = Tools.GetUserOperation(BusinessMasterId,'chargeshow','4905',"XML")
        TotalAmt = Tools.GetXMLNode(BDOutPut,'OrderSum') 
        PayAmt = Tools.GeBDOutPut(BusinessMasterId,intef_code = 'GetInsuAmt').split('^')[0]
        OrderNo = Tools.GetXMLNode(BDOutPut,'OrderNo') 
        
        BDOutPut = Tools.GeBDOutPut(BusinessMasterId,'chargeshow','4905')
        
        InvoiceNoStr = Tools.GetXMLNode(BDOutPut,'InvoiceNo') 
        BDOutPut = Tools.GetUserOperation(BusinessMasterId,'paymode')
        PayModeCode = BDOutPut.get('PayModeCode')
        
        PayAccountNo = ""
        CardType = "1" 
        # 取支付方式对照
        HISPayMode = "CASH" #0费用
        HISPayModeDict = ss_dicdataCtl.GetDicConByDicTypeCode("PayMode",PayModeCode)
        if HISPayModeDict:
            HISPayMode = HISPayModeDict.get('ss_dic_concode')
        if PayAmt == "0" or PayAmt == "0.00" or PayAmt == "0.0":
            HISPayMode = "CASH" #0费用
        PayDetails = "<PayDetails><PayAmt>" + PayAmt + "</PayAmt><PayModeCode>" + HISPayMode + "</PayModeCode><TradeChannel></TradeChannel><PayAccountNo>" + PayAccountNo + "</PayAccountNo><PlatformNo></PlatformNo><OutPayNo></OutPayNo><PayChannel></PayChannel><PayData></PayData></PayDetails>"
        if PayModeCode == "JHZFYHK":
            PayModeCode = PayModeCode
            TradeChannel = PayModeCode
            PayAccountNo = ""
            PlatformNo = ""
            OutPayNo = ClsHisOPObj.serial_number
            PayChannel = PayModeCode
            PayServPOSPay = Tools.GeBDOutPut(BusinessMasterId,intef_code = 'PayServ_POSPay')
            POSPayStr = PayServPOSPay
            PayDetails = "<PayDetails><PayAmt>" + PayAmt + "</PayAmt><PayModeCode>" + HISPayMode + "</PayModeCode><TradeChannel>" + TradeChannel  + "</TradeChannel><PayAccountNo>" + PayAccountNo + "</PayAccountNo><PlatformNo>" + PlatformNo + "</PlatformNo><OutPayNo>" + OutPayNo + "</OutPayNo><PayChannel>" + PayChannel + "</PayChannel><PayData>" + POSPayStr + "</PayData></PayDetails>"
        elif PayModeCode == "WECHAT" or PayModeCode == "AlIPAY":
            PayModeCode = PayModeCode
            TradeChannel = PayModeCode
            PayAccountNo = ""
            PlatformNo = ""
            OutPayNo = ClsHisOPObj.serial_number
            PayChannel = PayModeCode
            PayServPOSPay = ss_extdetailsCtl.GetEXTSuccessInfo(ClsHisOPObj) 
            PayServPOSPay = PayServPOSPay.get('ss_extd_outinfo')
            PayServPOSPay = json.dumps(PayServPOSPay)
            POSPayStr = PayServPOSPay
            PayDetails = "<PayDetails><PayAmt>" + PayAmt + "</PayAmt><PayModeCode>" + HISPayMode + "</PayModeCode><TradeChannel>" + TradeChannel  + "</TradeChannel><PayAccountNo>" + PayAccountNo + "</PayAccountNo><PlatformNo>" + PlatformNo + "</PlatformNo><OutPayNo>" + OutPayNo + "</OutPayNo><PayChannel>" + PayChannel + "</PayChannel><PayData>" + POSPayStr + "</PayData></PayDetails>"

        RequestStr = '<Request><CardType>' + CardType + '</CardType><TradeCode>4906</TradeCode><HospitalID>' + HospId + '</HospitalID><PatientID>' + CardNo + '</PatientID><OrderNo>' + OrderNo + '</OrderNo><InvoiceNoStr>' + InvoiceNoStr + '</InvoiceNoStr>' + '<UserCode>' + UserCode + '</UserCode><InsuPersonInfo></InsuPersonInfo><InsuDivide></InsuDivide><InsuTradeOut></InsuTradeOut><ExpStr></ExpStr>' + PayDetails + '</Request>'
    
        # 保存入参
        #print("RequestStr",RequestStr)
        BDObj = BDCtl.BD()
        Input['intef_input'] = RequestStr
        BDObj.saveByWeb(Input)
        # 调用HIS接口
        Response = CallHISWS(RequestStr)
        #Response = "<Response><ResultCode>-1</ResultCode><ResultMsg>确认完成成功!!</ResultMsg></Response>" 
        # 保存出参
        Input['id'] = BDObj.result
        Input['intef_output'] = Response
        BDObj.saveByWeb(Input)
        # 判断HIS是否成功
        HISVal = Tools.GetXMLNode(Response,'ResultCode')
        err = "-1"
        if HISVal != "0":
            del Input['id']
            Input['TradeCode'] = '4909'
            rtn4909 = self.DHC_4909(Input,ClsHisOPObj)
            Response = rtn4909.get('output')
            HISVal = Tools.GetXMLNode(Response,'ResultCode')
        if HISVal == '0':
            err = "0"
            # 保存成功时的交易金额
            BDObj = BDCtl.BD()
            del Input['id']
            Input['TradeCode'] = 'OrderAmt'
            Input['intef_input'] = ""
            Input['intef_output'] = PayAmt
            BDObj.saveByWeb(Input) 
        # 构造返回参数
        a = Response.replace("<Response>","")
        b = a.replace("</Response>","")
        Response = "<Response>" + b + "<InvId>" + InvoiceNoStr + "</InvId></Response>"
        Response = Tools.BuildWebOutPut(Response)
        output = {
            'result' : err,
            'output': Response
        }
        return output 
    # HIS撤销预结算
    def DHC_4910(self,Input,ClsHisOPObj):
        #print('4910参数开始')
        # 组织HIS接口参数
        IDNO = ClsHisOPObj.patinfo_dict.get('idno')
        PatName = ClsHisOPObj.patinfo_dict.get('name')
        INSUCardStr = ClsHisOPObj.patinfo_dict.get('insu_card_no') 
        HISCardTypeCode = "01"
        HospId = ClsHisOPObj.terminal_dict.get('hosp_id')
        UserCode = ClsHisOPObj.terminal_dict.get('user_code')
        UserID = ClsHisOPObj.terminal_dict.get('user_id')
        PatientName = PatName
        BusinessMasterId = ClsHisOPObj.serial_id
        CardNo = ClsHisOPObj.his_patinfo_dict.get('his_unique_no') 
        BusinessType = ClsHisOPObj.business_type
        InvoiceNoStr = Input.get('InvoiceNoStr')
        CardType = "1"
        if InvoiceNoStr:
            RequestStr = '<Request><TradeCode>4910</TradeCode><PatientID>'+ CardNo +'</PatientID><CardType>' + CardType + '</CardType><UserCode>' + UserCode + '</UserCode><InvoiceNoStr>' + InvoiceNoStr + '</InvoiceNoStr><TerminalID>ZZJ001</TerminalID><OrderNo></OrderNo><HospitalID>' + HospId + '</HospitalID></Request>'
        else:
        #Interface       
            BDOutPut = Tools.GetUserOperation(BusinessMasterId,'chargeshow','4905',"XML")
            OrderNo = Tools.GetXMLNode(BDOutPut,'OrderNo') 
            BDOutPut = Tools.GeBDOutPut(BusinessMasterId,'chargeshow','4905')
            InvoiceNoStr = Tools.GetXMLNode(BDOutPut,'InvoiceNo')            
            RequestStr = '<Request><TradeCode>4910</TradeCode><PatientID>'+ CardNo +'</PatientID><CardType>' + CardType + '</CardType><UserCode>' + UserCode + '</UserCode><InvoiceNoStr>' + InvoiceNoStr + '</InvoiceNoStr><TerminalID>ZZJ001</TerminalID><OrderNo>' + OrderNo + '</OrderNo><HospitalID>' + HospId + '</HospitalID></Request>'
        # 保存入参
        #print("RequestStr",RequestStr)
        BDObj = BDCtl.BD()
        Input['intef_input'] = RequestStr
        BDObj.saveByWeb(Input)
        # 调用HIS接口
        Response = CallHISWS(RequestStr)
        # 保存出参
        Input['id'] = BDObj.result
        Input['intef_output'] = Response
        BDObj.saveByWeb(Input)
        # 构造返回参数
        Response = Tools.BuildWebOutPut(Response)
        return Response
    # 查询HIS就诊记录
    def DHC_4902(self,Input,ClsHisOPObj):
        #print('4902参数开始')
        # 组织HIS接口参数
        IDNO = ClsHisOPObj.patinfo_dict.get('idno')
        PatName = ClsHisOPObj.patinfo_dict.get('name')
        INSUCardStr = ClsHisOPObj.patinfo_dict.get('insu_card_no') 
        HISCardTypeCode = "01"
        HospId = ClsHisOPObj.terminal_dict.get('hosp_id')
        UserCode = ClsHisOPObj.terminal_dict.get('user_code')
        UserID = ClsHisOPObj.terminal_dict.get('user_id')
        PatientName = PatName
        BusinessMasterId = ClsHisOPObj.serial_id
        CardNo = ClsHisOPObj.his_patinfo_dict.get('his_unique_no') 
        BusinessType = ClsHisOPObj.business_type
        barCode = ClsHisOPObj.patinfo_dict.get('barcode')
        if ClsHisOPObj.patinfo_dict.get('readcard_type') != "2": 
            barCode = ""
        #Interface
        CardType = ""
        StartDate = ""
        EndDate = ""
        Adm = ""
        if barCode:
            if barCode !="":
                Adm = barCode
        RequestStr = '<Request><TradeCode>4902</TradeCode><AdmID>' + Adm + '</AdmID><PatientID>'+ CardNo +'</PatientID><CardType>' + CardType + '</CardType><UserCode>' + UserCode + '</UserCode><StartDate>' + StartDate + '</StartDate><EndDate>' + EndDate + '</EndDate><HospitalID>' + HospId + '</HospitalID></Request>'
        # 保存入参
        #print("RequestStr",RequestStr)
        BDObj = BDCtl.BD()
        Input['intef_input'] = RequestStr
        BDObj.saveByWeb(Input)
        # 调用HIS接口
        Response = CallHISWS(RequestStr)
        # 保存出参
        Input['id'] = BDObj.result
        Input['intef_output'] = Response
        BDObj.saveByWeb(Input)
        # 构造返回参数
        Response = Tools.BuildWebOutPut(Response)
        return Response
    # 查询HIS待缴费结算单
    def DHC_4904(self,Input,ClsHisOPObj):
        #print('4904参数开始')
        # 组织HIS接口参数
        IDNO = ClsHisOPObj.patinfo_dict.get('idno')
        PatName = ClsHisOPObj.patinfo_dict.get('name')
        INSUCardStr = ClsHisOPObj.patinfo_dict.get('insu_card_no') 
        HISCardTypeCode = "01"
        HospId = ClsHisOPObj.terminal_dict.get('hosp_id')
        UserCode = ClsHisOPObj.terminal_dict.get('user_code')
        UserID = ClsHisOPObj.terminal_dict.get('user_id')
        PatientName = PatName
        BusinessMasterId = ClsHisOPObj.serial_id
        CardNo = ClsHisOPObj.his_patinfo_dict.get('his_unique_no') 
        BusinessType = ClsHisOPObj.business_type
        PTObj = PTCtl.PT()
        queryParam = {'fk_businessmaster_id':int(BusinessMasterId),'code':'card_patinfo'} 
        PTObj.query(queryParam)
        barCode = ClsHisOPObj.patinfo_dict.get('barCode')
        if ClsHisOPObj.patinfo_dict.get('readcard_type') != "2": 
            barCode = ""
        Adm = ""
        if barCode:
            if barCode !="":
                Adm = barCode
        else:
            UserOperationDic = Tools.GetUserOperation(BusinessMasterId,"AdmList")
            if UserOperationDic:
                Adm = UserOperationDic.get('AdmId')
        OrderNo = ""   
        PayingListOrderNo = ""
        UserOperationDic = Tools.GetUserOperation(BusinessMasterId,"PayingList") 
        if UserOperationDic:
            OrderNoDic = UserOperationDic.get('PayingList')
            #print("OrderNoDic",OrderNoDic)
            if OrderNoDic:
                if isinstance(OrderNoDic,dict):
                    pass
                else:
                    OrderNoDic = json.loads(OrderNoDic)
            PayingListOrderNo = OrderNoDic.get('OrderNo')
        OrderNo = PayingListOrderNo
        modal_code = Input.get("modal_code")
        if modal_code != "chargeshow":
            OrderNo = ""
        #Interface
        CardType = "1"
        StartDate = ""
        EndDate = "" #Tools.getDefStDate(0)
        RequestStr = '<Request><OrderNo>' + OrderNo + '</OrderNo><TradeCode>4904</TradeCode><PatientID>' + CardNo +'</PatientID><Adm>'+ Adm +'</Adm><UserCode>' + UserCode + '</UserCode><CardType>' + CardType + '</CardType><TerminalID>ZZJ001</TerminalID><SecrityNo></SecrityNo><StartDate>' + StartDate + '</StartDate><EndDate>' + EndDate + '</EndDate><ExpStr></ExpStr></Request>'
        # 保存入参
        #print("RequestStr",RequestStr)
        BDObj = BDCtl.BD()
        Input['intef_input'] = RequestStr
        BDObj.saveByWeb(Input)
        # 调用HIS接口
        Response = CallHISWS(RequestStr)
        # 保存出参
        Input['id'] = BDObj.result
        Input['intef_output'] = Response
        BDObj.saveByWeb(Input)
        # 构造返回参数
        Response = Tools.BuildWebOutPut(Response)
        return Response 
    # 物价查询
    def DHC_90013(self,Input,ClsHisOPObj):
        #print('90013参数开始',Input)
        # 组织HIS接口参数
        IDNO = ClsHisOPObj.patinfo_dict.get('idno')
        PatName = ClsHisOPObj.patinfo_dict.get('name')
        INSUCardStr = ClsHisOPObj.patinfo_dict.get('insu_card_no') 
        HISCardTypeCode = "01"
        HospId = ClsHisOPObj.terminal_dict.get('hosp_id')
        UserCode = ClsHisOPObj.terminal_dict.get('user_code')
        UserID = ClsHisOPObj.terminal_dict.get('user_id')
        PatientName = PatName
        BusinessMasterId = ClsHisOPObj.serial_id
        CardNo = ClsHisOPObj.his_patinfo_dict.get('his_unique_no') 
        BusinessType = ClsHisOPObj.business_type
        #Interface
        ParamInput = Input.get('ParamInput')

        RequestStr = '<Request><BusinessType>' + BusinessType + '</BusinessType><TradeCode>90013</TradeCode><Alias>' + ParamInput + '</Alias><HospitalID>' + HospId + '</HospitalID></Request>'
        # 保存入参
        #print("RequestStr",RequestStr)
        BDObj = BDCtl.BD()
        Input['intef_input'] = RequestStr
        BDObj.saveByWeb(Input)
        # 调用HIS接口
        Response = CallHISWS(RequestStr)
        # 保存出参
        Input['id'] = BDObj.result
        Input['intef_output'] = Response
        BDObj.saveByWeb(Input)
        # 构造返回参数
        Response = Tools.BuildWebOutPut(Response)
        return Response
    #   HIS缴费信息查询
    def DHC_4908(self,Input,ClsHisOPObj):
        #print('4908参数开始')
        # 组织HIS接口参数
        IDNO = ClsHisOPObj.patinfo_dict.get('idno')
        PatName = ClsHisOPObj.patinfo_dict.get('name')
        INSUCardStr = ClsHisOPObj.patinfo_dict.get('insu_card_no') 
        HISCardTypeCode = "01"
        HospId = ClsHisOPObj.terminal_dict.get('hosp_id')
        UserCode = ClsHisOPObj.terminal_dict.get('user_code')
        UserID = ClsHisOPObj.terminal_dict.get('user_id')
        PatientName = PatName
        BusinessMasterId = ClsHisOPObj.serial_id
        CardNo = ClsHisOPObj.his_patinfo_dict.get('his_unique_no') 
        BusinessType = ClsHisOPObj.business_type

        #Interface
        ParamInput = "1"
        CardType = "1"
        TerminalID = ""
        StartDate = ""
        EndDate = ""

        RequestStr = '<Request><TradeCode>4908</TradeCode><HospitalID>' + HospId + '</HospitalID><PatientID>' + CardNo + '</PatientID><CardType>' + CardType +'</CardType><OrderNo></OrderNo><InvoiceNo></InvoiceNo><UserCode>' + UserCode + '</UserCode><SecrityNo></SecrityNo><TerminalID>' + TerminalID + '</TerminalID><StartDate>' + StartDate + '</StartDate><EndDate>' + EndDate + '</EndDate><PrtInvNo></PrtInvNo><ExpStr></ExpStr><Adm></Adm></Request>'
        # 保存入参
        #print("RequestStr",RequestStr)
        BDObj = BDCtl.BD()
        Input['intef_input'] = RequestStr
        BDObj.saveByWeb(Input)
        # 调用HIS接口
        Response = CallHISWS(RequestStr)
        # 保存出参
        Input['id'] = BDObj.result
        Input['intef_output'] = Response
        BDObj.saveByWeb(Input)
        # 构造返回参数
        Response = Tools.BuildWebOutPut(Response)
        return Response  
    # 流调表信息获取
    def DHC_GetSurvlist(self,Input,ClsHisOPObj):
        #print('GetSurvlist参数开始')
        # 组织HIS接口参数
        IDNO = ClsHisOPObj.patinfo_dict.get('idno')
        PatName = ClsHisOPObj.patinfo_dict.get('name')
        INSUCardStr = ClsHisOPObj.patinfo_dict.get('insu_card_no') 
        HISCardTypeCode = "01"
        HospId = ClsHisOPObj.terminal_dict.get('hosp_id')
        UserCode = ClsHisOPObj.terminal_dict.get('user_code')
        UserID = ClsHisOPObj.terminal_dict.get('user_id')
        PatientName = PatName
        BusinessMasterId = ClsHisOPObj.serial_id
        CardNo = ClsHisOPObj.his_patinfo_dict.get('his_unique_no') 
        BusinessType = ClsHisOPObj.business_type
        #Interface
        CardType = ""
        StartDate = ""
        EndDate = ""
        RequestStr = '<Request><TradeCode>GetSurvlist</TradeCode></Request>'
        # 保存入参
        #print("RequestStr",RequestStr)
        BDObj = BDCtl.BD()
        Input['intef_input'] = RequestStr
        BDObj.saveByWeb(Input)
        # 调用HIS接口
        Response = CallHISWS(RequestStr)
        # 保存出参
        Input['id'] = BDObj.result
        Input['intef_output'] = Response
        BDObj.saveByWeb(Input)
        # 构造返回参数
        Response = Tools.BuildWebOutPut(Response)
        return Response
    # 流调表信息保存
    def DHC_SaveSurvList(self,Input,ClsHisOPObj):
        #print('GetSurvlist参数开始',Input)
        # 组织HIS接口参数
        IDNO = ClsHisOPObj.patinfo_dict.get('idno')
        PatName = ClsHisOPObj.patinfo_dict.get('name')
        INSUCardStr = ClsHisOPObj.patinfo_dict.get('insu_card_no') 
        HISCardTypeCode = "01"
        HospId = ClsHisOPObj.terminal_dict.get('hosp_id')
        UserCode = ClsHisOPObj.terminal_dict.get('user_code')
        UserID = ClsHisOPObj.terminal_dict.get('user_id')
        PatientName = PatName
        BusinessMasterId = ClsHisOPObj.serial_id
        CardNo = ClsHisOPObj.his_patinfo_dict.get('his_unique_no') 
        BusinessType = ClsHisOPObj.business_type
        #Interface
        sex = ClsHisOPObj.patinfo_dict.get('sex') 
        phone = ClsHisOPObj.patinfo_dict.get('phone') 
        tmpInput = ""
        #print('sex',sex,'phone',phone)
        Patinfo = '^1' + PatName + '^' + CardNo + "^" + IDNO + "^" + sex + "^" + phone + ''
        for key in Input.get('Input'):
            #print('key',Input.get('Input').get(key))
            tmpValue = Input.get('Input').get(key).split('##')[1]
            tmpData = "^^" + Input.get('Input').get(key).split('^')[0] + '^' + Input.get('Input').get(key).split('^')[2] + '^' + Input.get('Input').get(key).split('^')[6] + '^' + tmpValue
            tmpInput = tmpInput + "#" + tmpData
        RequestStr = '<Request><TradeCode>SaveSurvList</TradeCode><Input>' + tmpInput + '</Input><Patinfo>' + Patinfo + '</Patinfo></Request>'
        # 保存入参
        #print("RequestStr",RequestStr)
        BDObj = BDCtl.BD()
        Input['intef_input'] = RequestStr
        BDObj.saveByWeb(Input)
        # 调用HIS接口
        Response = CallHISWS(RequestStr)
        #print("GetSurvlist参数开始",Response)
        # 保存出参
        Input['id'] = BDObj.result
        Input['intef_output'] = Response
        BDObj.saveByWeb(Input)
        # 构造返回参数
        Response = Tools.BuildWebOutPut(Response)
        return Response 
    # 保存业务流水表
    def DHC_SaveBD(self,Input,ClsHisOPObj):
        #print('SaveBD参数开始',Input)
        # 组织HIS接口参数
        tmpmodal_code = Input['modal_code'] #INSUPreRegBack
        tmpOutput = Input['intef_output']
        if tmpmodal_code:
            #保存医保信息 预挂号
            if tmpmodal_code == "INSUPreRegBack" or tmpmodal_code == "InsuOPDividePreBack" or tmpmodal_code == "InsuOPDivideCommitBacak" or tmpmodal_code == "INSURegBack":
                InsertInput = {
                    "ss_extd_amt":'',
                    "ss_extd_type":tmpmodal_code,
                    "ss_extd_status":'1',
                    "ss_extd_outinfo":Input.get('intef_output'),
                    "ss_extd_ininfo":Input.get('intef_input')
                }
                save_insu_portinfo(InsertInput,ClsHisOPObj)
        BDObj = BDCtl.BD()
        #Input['intef_output'] = RequestStr
        BDObj.saveByWeb(Input)
        Response = "<Response><ResultCode>0</ResultCode><ResultMsg></ResultMsg><output></output></Response>"
        # 构造返回参数
        Response = Tools.BuildWebOutPut(Response)
        return Response
    # 联合门诊预约业务
    # 多笔预约
    def DOUnion(self,Input,ClsHisOPObj):
        try:
            #print("联合门诊开始")
            IDNO = ClsHisOPObj.patinfo_dict.get('idno')
            PatName = ClsHisOPObj.patinfo_dict.get('name')
            INSUCardStr = ClsHisOPObj.patinfo_dict.get('insu_card_no') 
            HISCardTypeCode = "01"
            HospId = ClsHisOPObj.terminal_dict.get('hosp_id')
            UserCode = ClsHisOPObj.terminal_dict.get('user_code')
            UserID = ClsHisOPObj.terminal_dict.get('user_id')
            PatientName = PatName
            BusinessMasterId = ClsHisOPObj.serial_id
            CardNo = ClsHisOPObj.his_patinfo_dict.get('his_unique_no') 
            #
            UserOperationDic = Tools.GetUserOperation(BusinessMasterId,"predoctime")
            ScheduleItemCode = UserOperationDic.get('ScheduleItemCode')
            LockQueueNo = UserOperationDic.get('LockQueueNo')
            TransactionId = UserOperationDic.get('TransactionId')
            AdmitRange = UserOperationDic.get('AdmitRange')
            JointFlag = "Y"
            LinkApptID = ""
            Address = ""
            TelePhoneNo=""
            
            AllDoctor = Tools.GeBDOutPut(BusinessMasterId,"predocdat","1004")
            AllDoctor = '<?xml version="1.0" encoding="UTF-8"?>' + AllDoctor #"<Response><ResultCode>0</ResultCode><RecordCount>12</RecordCount><Schedules><Schedule><ScheduleItemCode>5323||40</ScheduleItemCode><ServiceDate>2021-08-24</ServiceDate><WeekDay>2</WeekDay><SessionCode>02</SessionCode><SessionName>下午</SessionName><StartTime>14:00</StartTime><EndTime>17:30</EndTime><DepartmentCode>165</DepartmentCode><DepartmentName>糖尿病肾病联合门诊</DepartmentName><DoctorCode>704</DoctorCode><DoctorName>常文秀</DoctorName><DoctorTitleCode>79</DoctorTitleCode><DoctorTitle>主任号</DoctorTitle><DoctorSessTypeCode>79</DoctorSessTypeCode><DoctorSessType>主任号</DoctorSessType><Fee>30</Fee><RegFee>0</RegFee><CheckupFee>30</CheckupFee><OtherFee>0</OtherFee><AvailableNumStr>1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20</AvailableNumStr><AdmitAddress>2层内科诊区12诊室</AdmitAddress><ScheduleStatus>1</ScheduleStatus><AvailableTotalNum>20</AvailableTotalNum><AvailableLeftNum>20</AvailableLeftNum><TimeRangeFlag>1</TimeRangeFlag><JointFlag>Y</JointFlag></Schedule><Schedule><ScheduleItemCode>5339||41</ScheduleItemCode><ServiceDate>2021-08-24</ServiceDate><WeekDay>2</WeekDay><SessionCode>02</SessionCode><SessionName>下午</SessionName><StartTime>14:00</StartTime><EndTime>17:30</EndTime><DepartmentCode>165</DepartmentCode><DepartmentName>糖尿病肾病联合门诊</DepartmentName><DoctorCode>633</DoctorCode><DoctorName>张凤平</DoctorName><DoctorTitleCode>79</DoctorTitleCode><DoctorTitle>主任号</DoctorTitle><DoctorSessTypeCode>79</DoctorSessTypeCode><DoctorSessType>主任号</DoctorSessType><Fee>30</Fee><RegFee>0</RegFee><CheckupFee>30</CheckupFee><OtherFee>0</OtherFee><AvailableNumStr>1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20</AvailableNumStr><AdmitAddress>2层内科诊区12诊室</AdmitAddress><ScheduleStatus>1</ScheduleStatus><AvailableTotalNum>20</AvailableTotalNum><AvailableLeftNum>20</AvailableLeftNum><TimeRangeFlag>0</TimeRangeFlag><JointFlag>Y</JointFlag><ASASDR>5323||40</ASASDR></Schedule><Schedule><ScheduleItemCode>5323||46</ScheduleItemCode><ServiceDate>2021-08-25</ServiceDate><WeekDay>3</WeekDay><SessionCode>02</SessionCode><SessionName>下午</SessionName><StartTime>14:00</StartTime><EndTime>17:30</EndTime><DepartmentCode>165</DepartmentCode><DepartmentName>糖尿病肾病联合门诊</DepartmentName><DoctorCode>704</DoctorCode><DoctorName>常文秀</DoctorName><DoctorTitleCode>79</DoctorTitleCode><DoctorTitle>主任号</DoctorTitle><DoctorSessTypeCode>79</DoctorSessTypeCode><DoctorSessType>主任号</DoctorSessType><Fee>30</Fee><RegFee>0</RegFee><CheckupFee>30</CheckupFee><OtherFee>0</OtherFee><AvailableNumStr>1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20</AvailableNumStr><AdmitAddress>2层内科诊区12诊室</AdmitAddress><ScheduleStatus>1</ScheduleStatus><AvailableTotalNum>20</AvailableTotalNum><AvailableLeftNum>20</AvailableLeftNum><TimeRangeFlag>0</TimeRangeFlag><JointFlag>Y</JointFlag></Schedule><Schedule><ScheduleItemCode>5339||47</ScheduleItemCode><ServiceDate>2021-08-25</ServiceDate><WeekDay>3</WeekDay><SessionCode>02</SessionCode><SessionName>下午</SessionName><StartTime>14:00</StartTime><EndTime>17:30</EndTime><DepartmentCode>165</DepartmentCode><DepartmentName>糖尿病肾病联合 门诊</DepartmentName><DoctorCode>633</DoctorCode><DoctorName>张凤平</DoctorName><DoctorTitleCode>80</DoctorTitleCode><DoctorTitle>副主任号</DoctorTitle><DoctorSessTypeCode>80</DoctorSessTypeCode><DoctorSessType>副主任号</DoctorSessType><Fee>20</Fee><RegFee>0</RegFee><CheckupFee>20</CheckupFee><OtherFee>0</OtherFee><AvailableNumStr>1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20</AvailableNumStr><AdmitAddress>2层内科诊区12诊室</AdmitAddress><ScheduleStatus>1</ScheduleStatus><AvailableTotalNum>20</AvailableTotalNum><AvailableLeftNum>20</AvailableLeftNum><TimeRangeFlag>0</TimeRangeFlag><JointFlag>Y</JointFlag><ASASDR>5323||46</ASASDR></Schedule><Schedule><ScheduleItemCode>5323||49</ScheduleItemCode><ServiceDate>2021-08-26</ServiceDate><WeekDay>4</WeekDay><SessionCode>02</SessionCode><SessionName>下午</SessionName><StartTime>14:00</StartTime><EndTime>17:30</EndTime><DepartmentCode>165</DepartmentCode><DepartmentName>糖尿病肾病联合门诊</DepartmentName><DoctorCode>704</DoctorCode><DoctorName>常文秀</DoctorName><DoctorTitleCode>79</DoctorTitleCode><DoctorTitle>主任号</DoctorTitle><DoctorSessTypeCode>79</DoctorSessTypeCode><DoctorSessType>主任号</DoctorSessType><Fee>30</Fee><RegFee>0</RegFee><CheckupFee>30</CheckupFee><OtherFee>0</OtherFee><AvailableNumStr>1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20</AvailableNumStr><AdmitAddress>2层内科诊区12诊室</AdmitAddress><ScheduleStatus>1</ScheduleStatus><AvailableTotalNum>20</AvailableTotalNum><AvailableLeftNum>20</AvailableLeftNum><TimeRangeFlag>0</TimeRangeFlag><JointFlag>Y</JointFlag></Schedule><Schedule><ScheduleItemCode>5339||50</ScheduleItemCode><ServiceDate>2021-08-26</ServiceDate><WeekDay>4</WeekDay><SessionCode>02</SessionCode><SessionName>下午</SessionName><StartTime>14:00</StartTime><EndTime>17:30</EndTime><DepartmentCode>165</DepartmentCode><DepartmentName>糖尿病肾病联合门诊</DepartmentName><DoctorCode>633</DoctorCode><DoctorName>张凤平</DoctorName><DoctorTitleCode>80</DoctorTitleCode><DoctorTitle>副主任号</DoctorTitle><DoctorSessTypeCode>80</DoctorSessTypeCode><DoctorSessType>副主任号</DoctorSessType><Fee>20</Fee><RegFee>0</RegFee><CheckupFee>20</CheckupFee><OtherFee>0</OtherFee><AvailableNumStr>1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20</AvailableNumStr><AdmitAddress>2层内科 诊区12诊室</AdmitAddress><ScheduleStatus>1</ScheduleStatus><AvailableTotalNum>20</AvailableTotalNum><AvailableLeftNum>20</AvailableLeftNum><TimeRangeFlag>0</TimeRangeFlag><JointFlag>Y</JointFlag><ASASDR>5323||49</ASASDR></Schedule><Schedule><ScheduleItemCode>5323||52</ScheduleItemCode><ServiceDate>2021-08-27</ServiceDate><WeekDay>5</WeekDay><SessionCode>02</SessionCode><SessionName>下午</SessionName><StartTime>14:00</StartTime><EndTime>17:30</EndTime><DepartmentCode>165</DepartmentCode><DepartmentName>糖尿病肾病联合门诊</DepartmentName><DoctorCode>704</DoctorCode><DoctorName>常文秀</DoctorName><DoctorTitleCode>79</DoctorTitleCode><DoctorTitle>主任号</DoctorTitle><DoctorSessTypeCode>79</DoctorSessTypeCode><DoctorSessType>主任号</DoctorSessType><Fee>30</Fee><RegFee>0</RegFee><CheckupFee>30</CheckupFee><OtherFee>0</OtherFee><AvailableNumStr>1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20</AvailableNumStr><AdmitAddress>2层内科诊区12诊室</AdmitAddress><ScheduleStatus>1</ScheduleStatus><AvailableTotalNum>20</AvailableTotalNum><AvailableLeftNum>20</AvailableLeftNum><TimeRangeFlag>0</TimeRangeFlag><JointFlag>Y</JointFlag></Schedule><Schedule><ScheduleItemCode>5339||53</ScheduleItemCode><ServiceDate>2021-08-27</ServiceDate><WeekDay>5</WeekDay><SessionCode>02</SessionCode><SessionName>下午</SessionName><StartTime>14:00</StartTime><EndTime>17:30</EndTime><DepartmentCode>165</DepartmentCode><DepartmentName>糖尿病肾病联合门诊</DepartmentName><DoctorCode>633</DoctorCode><DoctorName>张凤平</DoctorName><DoctorTitleCode>80</DoctorTitleCode><DoctorTitle>副主任号</DoctorTitle><DoctorSessTypeCode>80</DoctorSessTypeCode><DoctorSessType>副主任号</DoctorSessType><Fee>20</Fee><RegFee>0</RegFee><CheckupFee>20</CheckupFee><OtherFee>0</OtherFee><AvailableNumStr>1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20</AvailableNumStr><AdmitAddress>2层内科诊区12诊室</AdmitAddress><ScheduleStatus>1</ScheduleStatus><AvailableTotalNum>20</AvailableTotalNum><AvailableLeftNum>20</AvailableLeftNum><TimeRangeFlag>0</TimeRangeFlag><JointFlag>Y</JointFlag><ASASDR>5323||52</ASASDR></Schedule><Schedule><ScheduleItemCode>5323||55</ScheduleItemCode><ServiceDate>2021-08-28</ServiceDate><WeekDay>6</WeekDay><SessionCode>02</SessionCode><SessionName>下午</SessionName><StartTime>14:00</StartTime><EndTime>17:30</EndTime><DepartmentCode>165</DepartmentCode><DepartmentName>糖尿病肾病联合门诊</DepartmentName><DoctorCode>704</DoctorCode><DoctorName>常文秀</DoctorName><DoctorTitleCode>79</DoctorTitleCode><DoctorTitle>主任号</DoctorTitle><DoctorSessTypeCode>79</DoctorSessTypeCode><DoctorSessType>主任号</DoctorSessType><Fee>30</Fee><RegFee>0</RegFee><CheckupFee>30</CheckupFee><OtherFee>0</OtherFee><AvailableNumStr>1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20</AvailableNumStr><AdmitAddress>2层内科诊区12诊室</AdmitAddress><ScheduleStatus>1</ScheduleStatus><AvailableTotalNum>20</AvailableTotalNum><AvailableLeftNum>20</AvailableLeftNum><TimeRangeFlag>0</TimeRangeFlag><JointFlag>Y</JointFlag></Schedule><Schedule><ScheduleItemCode>5339||56</ScheduleItemCode><ServiceDate>2021-08-28</ServiceDate><WeekDay>6</WeekDay><SessionCode>02</SessionCode><SessionName>下午</SessionName><StartTime>14:00</StartTime><EndTime>17:30</EndTime><DepartmentCode>165</DepartmentCode><DepartmentName>糖尿病肾病联合门诊</DepartmentName><DoctorCode>633</DoctorCode><DoctorName>张凤平</DoctorName><DoctorTitleCode>80</DoctorTitleCode><DoctorTitle>副主任号</DoctorTitle><DoctorSessTypeCode>80</DoctorSessTypeCode><DoctorSessType>副主任号</DoctorSessType><Fee>20</Fee><RegFee>0</RegFee><CheckupFee>20</CheckupFee><OtherFee>0</OtherFee><AvailableNumStr>1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20</AvailableNumStr><AdmitAddress>2层内科诊区12诊室</AdmitAddress><ScheduleStatus>1</ScheduleStatus><AvailableTotalNum>20</AvailableTotalNum><AvailableLeftNum>20</AvailableLeftNum><TimeRangeFlag>0</TimeRangeFlag><JointFlag>Y</JointFlag><ASASDR>5323||55</ASASDR></Schedule><Schedule><ScheduleItemCode>5323||44</ScheduleItemCode><ServiceDate>2021-08-30</ServiceDate><WeekDay>1</WeekDay><SessionCode>02</SessionCode><SessionName>下午</SessionName><StartTime>14:00</StartTime><EndTime>17:30</EndTime><DepartmentCode>165</DepartmentCode><DepartmentName>糖尿病肾病联合门诊</DepartmentName><DoctorCode>704</DoctorCode><DoctorName>常文秀</DoctorName><DoctorTitleCode>79</DoctorTitleCode><DoctorTitle>主任号</DoctorTitle><DoctorSessTypeCode>79</DoctorSessTypeCode><DoctorSessType>主任号</DoctorSessType><Fee>30</Fee><RegFee>0</RegFee><CheckupFee>30</CheckupFee><OtherFee>0</OtherFee><AvailableNumStr>1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20</AvailableNumStr><AdmitAddress>2层内科诊区12诊室</AdmitAddress><ScheduleStatus>1</ScheduleStatus><AvailableTotalNum>20</AvailableTotalNum><AvailableLeftNum>20</AvailableLeftNum><TimeRangeFlag>0</TimeRangeFlag><JointFlag>Y</JointFlag></Schedule><Schedule><ScheduleItemCode>5339||45</ScheduleItemCode><ServiceDate>2021-08-30</ServiceDate><WeekDay>1</WeekDay><SessionCode>02</SessionCode><SessionName>下午</SessionName><StartTime>14:00</StartTime><EndTime>17:30</EndTime><DepartmentCode>165</DepartmentCode><DepartmentName>糖尿病肾病联合门诊</DepartmentName><DoctorCode>633</DoctorCode><DoctorName>张凤平</DoctorName><DoctorTitleCode>80</DoctorTitleCode><DoctorTitle> 副主任号</DoctorTitle><DoctorSessTypeCode>80</DoctorSessTypeCode><DoctorSessType>副主任号</DoctorSessType><Fee>20</Fee><RegFee>0</RegFee><CheckupFee>20</CheckupFee><OtherFee>0</OtherFee><AvailableNumStr>1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20</AvailableNumStr><AdmitAddress>2层内科诊区12诊室</AdmitAddress><ScheduleStatus>1</ScheduleStatus><AvailableTotalNum>20</AvailableTotalNum><AvailableLeftNum>20</AvailableLeftNum><TimeRangeFlag>0</TimeRangeFlag><JointFlag>Y</JointFlag><ASASDR>5323||44</ASASDR></Schedule></Schedules></Response>"
            
            a = xmltodict.parse(AllDoctor)
            b = a.get('Response')
            c = b.get('Schedules')
            d = c.get('Schedule')
            # 0.先判断传入的排班是否是 主排班
            ISMain = ScheduleItemCode #默认传入的是主排班
            for k in d:
                if isinstance(k,str):
                    raise Exception("只有一个医生坐诊")
                tmpScheduleItemCode =  k.get('ScheduleItemCode')

                if tmpScheduleItemCode == ScheduleItemCode:
                    #找到了选中的传入的排班
                    tmpMainScheduleItemCode = k.get('ASASDR')
                    if tmpMainScheduleItemCode is not None: #说明不是主排班
                        if tmpMainScheduleItemCode !="":
                            ISMain = tmpMainScheduleItemCode
                    break
            # 1.先预约主排班
            IDStr = ""
            #CardNo = ClsHisOPObj.his_patinfo_dict.get('his_card_no') 
            HISCardTypeCode = ClsHisOPObj.his_patinfo_dict.get('his_card_type')
            # 保存入参
            RequestStr = "<Request><JointFlag>" + JointFlag + "</JointFlag><LinkApptID></LinkApptID><TradeCode>1000</TradeCode><ScheduleItemCode>" + ISMain + "</ScheduleItemCode><LockQueueNo>" + LockQueueNo + "</LockQueueNo><HospitalId>" + HospId + "</HospitalId><ExtUserID>" + UserCode +"</ExtUserID><TransactionId>" + TransactionId + "</TransactionId><PatientID>" + CardNo + "</PatientID><CardType>" + HISCardTypeCode + "</CardType><PatientName>" + PatientName + "</PatientName><CredTypeCode>" + HISCardTypeCode + "</CredTypeCode><IDCardNo></IDCardNo><TelePhoneNo>" + TelePhoneNo + "</TelePhoneNo><MobileNo>" + TelePhoneNo + "</MobileNo><AdmitRange>" + AdmitRange + "</AdmitRange><Address>" + Address + "</Address></Request>"
            BDObj = BDCtl.BD()
            Input['intef_input'] = RequestStr
            BDObj.saveByWeb(Input)
            # 调用HIS接口
            Response = CallHISWS(RequestStr)
            IDStr = Tools.GetXMLNode(Response,'OrderCode')
            # 保存出参
            Input['id'] = BDObj.result
            Input['intef_output'] = Response
            BDObj.saveByWeb(Input)
            # 构造返回参数
            ResultCode = Tools.GetXMLNode(Response,'ResultCode')
            if ResultCode != "0":
                raise Exception("联合门诊联合预约时发生错误：预约主排班失败" + ResultContent)
            tmpMainId = Tools.GetXMLNode(Response,'OrderCode')
            # 2.预约其他关联排班  
            for k in d:
                tmpScheduleItemCode =  k.get('ASASDR')
                if tmpScheduleItemCode != ISMain:
                    continue
                tmpSelfScheduleItemCode =  k.get('ScheduleItemCode')
                RequestStr = "<Request><JointFlag>" + JointFlag + "</JointFlag><LinkApptID>" + tmpMainId + "</LinkApptID><TradeCode>1000</TradeCode><ScheduleItemCode>" + tmpSelfScheduleItemCode + "</ScheduleItemCode><LockQueueNo>" + LockQueueNo + "</LockQueueNo><HospitalId>" + HospId + "</HospitalId><ExtUserID>" + UserCode +"</ExtUserID><TransactionId>" + TransactionId + "</TransactionId><PatientID>" + CardNo + "</PatientID><CardType>" + HISCardTypeCode + "</CardType><PatientName>" + PatientName + "</PatientName><CredTypeCode>" + HISCardTypeCode + "</CredTypeCode><IDCardNo></IDCardNo><TelePhoneNo>" + TelePhoneNo + "</TelePhoneNo><MobileNo>" + TelePhoneNo + "</MobileNo><AdmitRange>" + AdmitRange + "</AdmitRange><Address>" + Address + "</Address></Request>"
                # 1.先预约主排班
                # 保存入参
                BDObj = BDCtl.BD()
                del Input['id']
                Input['intef_input'] = RequestStr
                BDObj.saveByWeb(Input)
                # 调用HIS接口
                Response1 = CallHISWS(RequestStr)
                IDStr = IDStr + "^" + Tools.GetXMLNode(Response1,'OrderCode')
                # 保存出参
                Input['id'] = BDObj.result
                Input['intef_output'] = Response1
                BDObj.saveByWeb(Input)
            Response = Response.replace("</Response>","<OrderCodeStr>" + IDStr + "</OrderCodeStr></Response>")
            Response = Tools.BuildWebOutPut(Response)
            return Response
        except Exception  as e:
            raise Exception("联合门诊联合预约时发生错误：" + str(e))
    # 联合门诊取消预约
    def CancelUnion(self,Input,ClsHisOPObj):
        IDNO = ClsHisOPObj.patinfo_dict.get('idno')
        PatName = ClsHisOPObj.patinfo_dict.get('name')
        INSUCardStr = ClsHisOPObj.patinfo_dict.get('insu_card_no') 
        HISCardTypeCode = "01"
        HospId = ClsHisOPObj.terminal_dict.get('hosp_id')
        UserCode = ClsHisOPObj.terminal_dict.get('user_code')
        UserID = ClsHisOPObj.terminal_dict.get('user_id')
        PatientName = PatName
        BusinessMasterId = ClsHisOPObj.serial_id
        CardNo = ClsHisOPObj.his_patinfo_dict.get('his_unique_no') 

        OrderCode = Input.get('OrderCode')
        JointFlag = "Y"
        LinkApptID = ""
        Address = ""
        TelePhoneNo=""
        #取所有信息
        AllDoctor = Tools.GeBDOutPut(BusinessMasterId,"getpredetails","1005")
        AllDoctor = '<?xml version="1.0" encoding="UTF-8"?>' + AllDoctor
        a = xmltodict.parse(AllDoctor)
        b = a.get('Response')
        c = b.get('Orders')
        d = c.get('Order')
        # 0.先判断传入的排班是否是 主排班
        ISMain = OrderCode #默认传入的是主排班
        for k in d:
            tmpScheduleItemCode =  k.get('OrderCode')
            if tmpScheduleItemCode == OrderCode:
                #找到了选中的传入的排班
                tmpMainScheduleItemCode = k.get('LinkApptID')
                if tmpMainScheduleItemCode is not None: #说明不是主排班
                    if tmpMainScheduleItemCode !="":
                        ISMain = tmpMainScheduleItemCode
                break
        # 1.先取消预约主排班      
        # 保存入参
        
        RequestStr = '<Request><TradeCode>1108</TradeCode><OrderCode>' + ISMain + '</OrderCode><ExtUserID>' + UserCode + '</ExtUserID></Request>'
        #print("CancelUnion",d)
        BDObj = BDCtl.BD()
        Input['intef_input'] = RequestStr
        BDObj.saveByWeb(Input)
        # 调用HIS接口
        Response = CallHISWS(RequestStr)
        # 保存出参
        Input['id'] = BDObj.result
        Input['intef_output'] = Response
        BDObj.saveByWeb(Input)
        # 构造返回参数
        Response = Tools.BuildWebOutPut(Response)
        # 2.预约其他关联排班  
        for k in d:
            tmpScheduleItemCode =  k.get('LinkApptID')
            if not tmpScheduleItemCode:
                continue
            #if str(tmpScheduleItemCode) != str(ISMain.split('||')[0] + '||' + ISMain.split('||')[1]):
            if str(tmpScheduleItemCode) != str(ISMain):
                continue
            tmpSelfScheduleItemCode =  k.get('OrderCode')
            RequestStr = '<Request><TradeCode>1108</TradeCode><OrderCode>' + tmpSelfScheduleItemCode + '</OrderCode><ExtUserID>' + UserCode + '</ExtUserID></Request>'
            # 1.先预约主排班
            # 保存入参
            BDObj = BDCtl.BD()
            del Input['id']
            Input['intef_input'] = RequestStr
            BDObj.saveByWeb(Input)
            # 调用HIS接口
            Response1 = CallHISWS(RequestStr)
            # 保存出参
            Input['id'] = BDObj.result
            Input['intef_output'] = Response1
            BDObj.saveByWeb(Input)
        return Response
    # MisPos支付
    def PayServ_POSPay(self,Input,ClsHisOPObj):
        #print('PayServ_POSPay参数开始')
        # 组织HIS接口参数
        IDNO = ClsHisOPObj.patinfo_dict.get('idno')
        PatName = ClsHisOPObj.patinfo_dict.get('name')
        INSUCardStr = ClsHisOPObj.patinfo_dict.get('insu_card_no') 
        HISCardTypeCode = "01"
        HospId = ClsHisOPObj.terminal_dict.get('hosp_id')
        UserCode = ClsHisOPObj.terminal_dict.get('user_code')
        UserID = ClsHisOPObj.terminal_dict.get('user_id')
        PatientName = PatName
        BusinessMasterId = ClsHisOPObj.serial_id
        CardNo = ClsHisOPObj.his_patinfo_dict.get('his_unique_no') 
        BusinessType = ClsHisOPObj.business_type

        # 保存
        PayAmount = Input.get('SelfAmt')
        BDObj = BDCtl.BD()
        Input['intef_input'] = PayAmount
        BDObj.saveByWeb(Input)
        Response = "<Response><ResultCode>0</ResultCode><ResultContent></ResultContent><PayAmt>" + PayAmount + "</PayAmt></Response>"
        # 构造返回参数
        if Input['intef_output'] != '':
            PosRtn = Input['intef_output']
            ss_extd_status = "0" #默认失败
            if PosRtn.split('|')[0] == "000000":
                ss_extd_status = "1"
            DOutPut = Tools.GetUserOperation(BusinessMasterId,'paymode')
            PayModeCode = "NOCHOICE"
            if 'PayModeCode' in BDOutPut.keys():
                PayModeCode = BDOutPut.get('PayModeCode')
            EXTCOBJ = ss_extdetailsCtl.EXTC()
            Input = {
                "ss_extd_code":ClsHisOPObj.business_type,
                "ss_extd_amt":PayAmount,
                "ss_extd_type":'Query',
                "ss_extd_status":ss_extd_status,
                "ss_extd_id":ClsHisOPObj.serial_id,
                "ss_extd_no":ClsHisOPObj.serial_number,
                "ss_extd_hisno": '',
                "ss_extd_platno": '',
                "ss_extd_extno":'',
                "ss_extd_channel":PayModeCode,
                "ss_extd_outinfo":Input['intef_output'],
                "ss_extd_ininfo":Response,
                "ss_extd_creator":ClsHisOPObj.client_dict.get('ss_eqlistd_eqcode')
            }
            EXTCOBJ.insert(Input)  
        Response = Tools.BuildWebOutPut(Response)
        return Response  
    # 取医保患者的医保支付金额 该接口需要放在医保接口调用之后使用
    # 取患者最终自负金额(微信支付宝)
    def GetInsuAmtNew(self,Input,ClsHisOPObj):
        try:
            #var INSUInfo = INSURtn.split('!')[1];
            #INSUSelfAmt = INSUInfo.split(String.fromCharCode(2))[0].split('^')[1];
            #insuaccout = INSUInfo.split(String.fromCharCode(2))[3].split('^')[1];
            INSURtn = ""
            BusinessType = ClsHisOPObj.business_type
            BusinessMasterId = ClsHisOPObj.serial_id
            backString = ""
            INSUZHZF = "0"
            INSUTCZF = "0"
            #取订单总金额
            SelfAmt = getOrdAmt(ClsHisOPObj)
            #取出医保串
            AdmReasonId = get_mi_type(ClsHisOPObj)
            #print(AdmReasonId,",",SelfAmt)
            if AdmReasonId != "1":
                InsuDic = GetInsuPayInfo(ClsHisOPObj)
                INSUZHZF = InsuDic.get('INSUZHZF')
                INSUTCZF = InsuDic.get('INSUTCZF')
                SelfAmt = float(SelfAmt) - float(INSUZHZF) - float(INSUTCZF)
            # 非医保患者 自费金额=订单金额
            if float(SelfAmt)<0:
                raise Exception("-1^取自负金额失败,金额小于0")
            backString = str(Tools.formatterAmt(SelfAmt)) + '^' + str(Tools.formatterAmt(INSUZHZF))+ '^' + str(Tools.formatterAmt(INSUTCZF))
            #保存患者自负金额
            BDObj = BDCtl.BD()
            Input['intef_output'] = backString
            BDObj.saveByWeb(Input)
            return backString
        except Exception as e:
            print(str(e))
            raise Exception("-1^网络异常，请返回到主页并重试，谢谢")
    def GetInsuAmt(self,Input,ClsHisOPObj):
        try:
            #var INSUInfo = INSURtn.split('!')[1];
            #INSUSelfAmt = INSUInfo.split(String.fromCharCode(2))[0].split('^')[1];
            #insuaccout = INSUInfo.split(String.fromCharCode(2))[3].split('^')[1];
            INSURtn = ""
            BusinessType = ClsHisOPObj.business_type
            BusinessMasterId = ClsHisOPObj.serial_id
            backString = ""
            INSUZHZF = "0"
            INSUTCZF = "0"
            SelfAmt = "-1"
            #取订单总金额
            if  BusinessType == "DRINCRNO":
                UserOperationDic = Tools.GetUserOperation(BusinessMasterId,"getpredetails")        
                OrderCode = UserOperationDic.get('OrderCode')
                SelfAmt = UserOperationDic.get('PayAmt')
            elif BusinessType =="Reg":
                BDOutPut = Tools.GeBDOutPut(BusinessMasterId,intef_code = '10015')
                SelfAmt = Tools.GetXMLNode(BDOutPut,'RegFee')
            elif BusinessType =="OBTNO":
                BDOutPut = Tools.GetUserOperation(BusinessMasterId,'getpredetails')
                OrderCode = BDOutPut.get('OrderCode')
                SelfAmt = BDOutPut.get('PayAmt')
            elif BusinessType == "Charge":
                INSURtn = Tools.GeBDOutPut(BusinessMasterId,'InsuOPDividePreBack','SaveBD')
                BDOutPut = Tools.GetUserOperation(BusinessMasterId,'chargeshow','4905',"XML")
                SelfAmt = Tools.GetXMLNode(BDOutPut,'OrderSum') 
            BDOutPut = Tools.GetUserOperation(BusinessMasterId,'chargeshow','4905',"XML")
            if BDOutPut:
                if BDOutPut !="":
                    SelfAmt = Tools.GetXMLNode(BDOutPut,'OrderSum') 
            #取出医保串
            if BusinessType == "Reg" or BusinessType == "OBTNO" or BusinessType == "DRINCRNO" :
                INSURtn = Tools.GeBDOutPut(BusinessMasterId,'INSUPreRegBack','SaveBD')
                if INSURtn:
                    INSURtnArr = INSURtn.split('!')[1] #0^150^200^0^0^门大(城职)联网已结算^^CZZG^1!1^306^033^046^048^047^049^050^0!N
                    SelfAmt = INSURtnArr.split(chr(2))[0].split('^')[1]
                    INSUZHZF = INSURtnArr.split(chr(2))[3].split('^')[1]
            if BusinessType == "Charge":
                INSURtn = Tools.GeBDOutPut(BusinessMasterId,'InsuOPDividePreBack','SaveBD')
                #0^123^4.89^2493633^06^048^047^049^050^0
                if INSURtn:
                    InvInfo = INSURtn.split(chr(2))[0]
                    InvPrt = InvInfo.split('^')[3]
                    BDOutPut = Tools.GeBDOutPut(BusinessMasterId,intef_code = '4905')
                    StrInvDr = Tools.GetXMLNode(BDOutPut,'InvoiceNo')
                    if StrInvDr == InvPrt:
                        SelfAmt = INSURtn.split('^')[2]
                        INSUZHZF = INSURtn.split(chr(2))[1].split('^')[1]
            # 非医保患者 自费金额=订单金额
            if float(SelfAmt)<0:
                raise Exception("-1^取自负金额失败,金额小于0")
            backString = str(SelfAmt) + '^' + str(INSUZHZF)+ '^' + str(INSUTCZF)
            #保存患者自负金额
            BDObj = BDCtl.BD()
            Input['intef_output'] = backString
            BDObj.saveByWeb(Input)
            return backString
        except Exception as e:
            print(str(e))
            raise Exception("-1^网络异常，请返回到主页并重试，谢谢")

    # 获取结算界面展示信息
    def GetShowInfo(self,ClsHisOPObj):
        #print('PayServ_POSPay参数开始')
        # 组织HIS接口参数
        IDNO = ClsHisOPObj.patinfo_dict.get('idno')
        PatName = ClsHisOPObj.patinfo_dict.get('name')
        INSUCardStr = ClsHisOPObj.patinfo_dict.get('insu_card_no') 
        HISCardTypeCode = "01"
        HospId = ClsHisOPObj.terminal_dict.get('hosp_id')
        UserCode = ClsHisOPObj.terminal_dict.get('user_code')
        UserID = ClsHisOPObj.terminal_dict.get('user_id')
        PatientName = PatName
        BusinessMasterId = ClsHisOPObj.serial_id
        CardNo = ClsHisOPObj.his_patinfo_dict.get('his_unique_no') 
        BusinessType = ClsHisOPObj.business_type

        #Interface 
        loc = ""
        doc = ""
        title = ""
        admdatetime = ""
        regfee = ""
        PayAmount = "0"
        if BusinessType == "OBTNO" or BusinessType == "DRINCRNO":
            UserOperationDic = Tools.GetUserOperation(BusinessMasterId,"getpredetails")
            BDOutPut = json.loads(UserOperationDic.get('Schedule'))
            loc = BDOutPut.get('Department') #科室
            doc = BDOutPut.get('Doctor') #医生
            title = BDOutPut.get('DoctorTitle') #医生职称
            SessionName = BDOutPut.get('SessionName')
            AdmitRange = BDOutPut.get('AdmitRange') #就诊时段
            admdatetime = SessionName
            if BusinessType == "OBTNO":
                if AdmitRange !="":
                    admdatetime = AdmitRange.split(' ')[1]
            regfee = BDOutPut.get('RegFee')  #就诊费用
        if BusinessType =="Reg":
            BDOutPut = Tools.GeBDOutPut(BusinessMasterId,intef_code ='10015')
            regfee = Tools.GetXMLNode(BDOutPut,'RegFee') 
        # 保存
        Response = "<Response><ResultCode>0</ResultCode><Fee>" + regfee + "</Fee><DepartmentName>" + loc + "</DepartmentName><DoctorName>" + doc + "</DoctorName><DoctorTitle>" + title + "</DoctorTitle><SessionName>" + admdatetime + "</SessionName></Response>"
        # 构造返回参数
        Response = Tools.BuildWebOutPut(Response)
        return Response  
    #校验HIS是否结算成功
    def DHC_4909(self,Input,ClsHisOPObj):
        #print('4908参数开始')
        # 组织HIS接口参数
        IDNO = ClsHisOPObj.patinfo_dict.get('idno')
        PatName = ClsHisOPObj.patinfo_dict.get('name')
        INSUCardStr = ClsHisOPObj.patinfo_dict.get('insu_card_no') 
        HISCardTypeCode = "01"
        HospId = ClsHisOPObj.terminal_dict.get('hosp_id')
        UserCode = ClsHisOPObj.terminal_dict.get('user_code')
        UserID = ClsHisOPObj.terminal_dict.get('user_id')
        PatientName = PatName
        BusinessMasterId = ClsHisOPObj.serial_id
        CardNo = ClsHisOPObj.his_patinfo_dict.get('his_unique_no') 
        BusinessType = ClsHisOPObj.business_type

        #Interface
        ParamInput = "1"
        CardType = "1"
        TerminalID = ""
        StartDate = ""
        EndDate = ""

        BDOutPut = Tools.GetUserOperation(BusinessMasterId,'chargeshow','4905',"XML")
        OrderNo = Tools.GetXMLNode(BDOutPut,'OrderNo') 
        InvoiceNoStr = Tools.GetXMLNode(BDOutPut,'InvoiceNo') 
        RequestStr = '<Request><TradeCode>4909</TradeCode><HospitalID>' + HospId + '</HospitalID><PatientID>' + CardNo + '</PatientID><CardType></CardType><OrderNo>' + OrderNo + '</OrderNo><UserCode>' + UserCode + '</UserCode></Request>'
        # 保存入参
        #print("RequestStr",RequestStr)
        BDObj = BDCtl.BD()
        Input['intef_input'] = RequestStr
        BDObj.saveByWeb(Input)
        # 调用HIS接口
        Response = CallHISWS(RequestStr)
        # 保存出参
        a = Response.replace("<Response>","")
        b = a.replace("</Response>","")
        Response = "<Response>" + b + "<HisInvId>" + InvoiceNoStr + "</HisInvId></Response>"
        Input['id'] = BDObj.result
        Input['intef_output'] = Response
        BDObj.saveByWeb(Input)
        # 构造返回参数
        Response = Tools.BuildWebOutPut(Response)
        return Response 
    # 异常撤销
    # 只允许放在主页 定时返回时操作
    def CheckSingleData(self,ClsHisOPObj):
        #print('CheckSingleData参数开始')
        # 组织HIS接口参数
        IDNO = ClsHisOPObj.patinfo_dict.get('idno')
        PatName = ClsHisOPObj.patinfo_dict.get('name')
        INSUCardStr = ClsHisOPObj.patinfo_dict.get('insu_card_no') 
        HISCardTypeCode = "01"
        HospId = ClsHisOPObj.terminal_dict.get('hosp_id')
        UserCode = ClsHisOPObj.terminal_dict.get('user_code')
        UserID = ClsHisOPObj.terminal_dict.get('user_id')
        PatientName = PatName
        BusinessMasterId = ClsHisOPObj.serial_id
        CardNo = ClsHisOPObj.his_patinfo_dict.get('his_unique_no') 
        BusinessType = ClsHisOPObj.business_type
        # 组织HIS接口参数
        #//# 1.检查是否有需要撤销的医保预挂号
        #// 如果做过医保预挂号，并且未进行过医保挂号，或者医保挂号失败
        rtnDic = {
            "PreInsuReg" : "",
            "InsuReg" : "",
            "PreInsuOPdivide" : "",
            "InsuOPdivide" : "",
            "HISOPDivide" : "",
            "ExtRefund":"",
            "HisFlag":"",
            "CloseExtPay":"",
            "ExtCancel":''
        }
        #Charge
        BDOutPut = Tools.GeBDOutPut(BusinessMasterId,intef_code = '4906')
        if  BDOutPut:
            ResultCode = Tools.GetXMLNode(BDOutPut,'ResultCode')
            if ResultCode == "0":
                rtnDic['HisFlag']="Y"
        #Reg
        BDOutPut = Tools.GeBDOutPut(BusinessMasterId,intef_code = '1101')
        if  BDOutPut:
            ResultCode = Tools.GetXMLNode(BDOutPut,'ResultCode')
            if ResultCode == "0":
                rtnDic['HisFlag']="Y"
        #Ordr
        BDOutPut = Tools.GeBDOutPut(BusinessMasterId,intef_code = '1000')
        if  BDOutPut:
            ResultCode = Tools.GetXMLNode(BDOutPut,'ResultCode')
            if ResultCode == "0":
                rtnDic['HisFlag']="Y"
        UserOperationDic = Tools.GeBDOutPut(BusinessMasterId,"INSUPreRegBack",'SaveBD')
        if  UserOperationDic:
            PreResult = UserOperationDic.split('^')[0]
            if PreResult == "0":
                UserOperationDic = Tools.GeBDOutPut(BusinessMasterId,"INSURegBack",'SaveBD')
                if  UserOperationDic:
                    success = "0"
                    if  success != "0":
                        rtnDic['PreInsuReg']="Y"
                else:
                    rtnDic['PreInsuReg']="Y"
        #2.检查是否有需要撤销的医保挂号
        #// 如果做过医保挂号，但未进行过HIS挂号或者HIS挂号失败
        UserOperationDic = Tools.GeBDOutPut(BusinessMasterId,"INSURegBack",'SaveBD')
        if  UserOperationDic:
            PreResult = UserOperationDic.split('^')[0]
            if PreResult == "0":
                BDOutPut = Tools.GeBDOutPut(BusinessMasterId,intef_code = '1101')
                if  BDOutPut:
                    ResultCode = Tools.GetXMLNode(BDOutPut,'ResultCode')
                    if  ResultCode != "0":
                        rtnDic['InsuReg']="Y"
                else:
                    rtnDic['InsuReg']="Y"
        #//# 3.检查是否有需要撤销的医保预结算
        #// 进行过医保预结算 且医保预结算成功 但未调用医保结算或者调用医保结算失败
        UserOperationDic = Tools.GeBDOutPut(BusinessMasterId,"InsuOPDividePreBack",'SaveBD')
        if  UserOperationDic:
            PreResult = UserOperationDic.split('^')[0]
            if PreResult == "0":
                BDOutPut = Tools.GeBDOutPut(BusinessMasterId,'InsuOPDivideCommitBacak','SaveBD')
                if  BDOutPut:
                    ResultCode = BDOutPut.split('^')[0]
                    if  ResultCode != "0":
                        rtnDic['PreInsuOPdivide']="Y"
                else:
                    rtnDic['PreInsuOPdivide']="Y"
        #//# 4.检查是否有需要撤销的医保结算
        #// 进行过医保结算，HIS确认完成失败，或者未进行确认完成
        UserOperationDic = Tools.GeBDOutPut(BusinessMasterId,"InsuOPDivideCommitBacak",'SaveBD')
        if  UserOperationDic:
            PreResult = UserOperationDic.split('^')[0]
            if PreResult == "0":
                BDOutPut = Tools.GeBDOutPut(BusinessMasterId,intef_code = '4906')
                if  BDOutPut:
                    ResultCode = Tools.GetXMLNode(BDOutPut,'ResultCode')
                    if  ResultCode != "0":
                        rtnDic['InsuOPdivide']="Y"
                else:
                    rtnDic['InsuOPdivide']="Y"
        #//# 5.检查是否有需要撤销的HIS预结算记录
        #// HIS确认完成失败或者 未进行确认完成
        UserOperationDic = Tools.GeBDOutPut(BusinessMasterId,intef_code = '4905')
        if  UserOperationDic:
            BDOutPut = Tools.GeBDOutPut(BusinessMasterId,intef_code = '4906')
            if  BDOutPut:
                ResultCode = Tools.GetXMLNode(BDOutPut,'ResultCode')
                if  ResultCode != "0":
                    rtnDic['HISOPDivide']="Y"
            else:
                rtnDic['HISOPDivide']="Y"
        #//# 6.检查是否有是否需要退费的第三方
        # 检查是否完成最终交易， 是否在成功交易表(ss_tdpaymode)的支付方式中存 第三方交易表的ID
        UserOperationDic = Tools.GetUserOperation(BusinessMasterId,"paymode")
        SelfPayMode = UserOperationDic.get('PayModeCode') #自费支付方式

        if SelfPayMode == "WECHAT" or SelfPayMode == "AlIPAY":
            if SelfPayMode == "WECHAT" or SelfPayMode == "AlIPAY":
                HISResult4906 = "0"
                HISResult1101 = "0"
                BDOutPut = Tools.GeBDOutPut(BusinessMasterId,intef_code = '4906')
                if BDOutPut:
                    ResultCode = Tools.GetXMLNode(BDOutPut,'ResultCode')
                    if ResultCode != "0" and ResultCode != "":
                        rtnDic['ExtRefund']="Y"
                        #rtnDic['CloseExtPay']="Y"
                BDOutPut1 = Tools.GeBDOutPut(BusinessMasterId,intef_code = '1101')
                if BDOutPut1:
                    ResultCode = Tools.GetXMLNode(BDOutPut1,'ResultCode')
                    if ResultCode!="" and ResultCode != "0": #不为空 避免调用HIS接口了  但是HIS未返回值 这一段期间，不允许退费 ，如果退费成功会漏费
                        rtnDic['ExtRefund']="Y"
                        #rtnDic['CloseExtPay']="Y"
                if not BDOutPut1 and not BDOutPut:
                    rtnDic['ExtCancel']="Y"
                    #rtnDic['CloseExtPay']="Y"
                    #rtnDic['ExtRefund']="Y"          
            '''
            TDPC = ss_tdpaymodeCtl.TDPC()
            InputQuery = {
                'ss_tdp_no':ClsHisOPObj.serial_number,
                'ss_tdp_code':SelfPayMode
            }
            TDPC.query(InputQuery)
            if TDPC.queryset: #查到了 没更新第三方交易表
                # rtnDic['ExtRefund']="Y" 测试需要退费时取消注释 
                ALLQuerySet = TDPC.queryset[0]
                ss_tdp_extid = getattr(ALLQuerySet,'ss_tdp_extid')     
                if not ss_tdp_extid:
                    rtnDic['ExtRefund']="Y"
                elif +int(ss_tdp_extid) == 0:
                    rtnDic['ExtRefund']="Y"
            else: #未查到 说明没成功
                rtnDic['ExtRefund']="Y"
            '''

        
        # 构造返回参数
        #BDObj = BDCtl.BD()
        #Input['intef_input'] = RequestStr
        #BDObj.saveByWeb(Input)
        Response = Tools.BuildWebOutPut(rtnDic)
        return Response
    # 获取HIS医保字典信息
    def GetDicInfo(self,Input,ClsHisOPObj):
        #print('GetDicInfo参数开始',Input)
        # 组织HIS接口参数
        IDNO = ClsHisOPObj.patinfo_dict.get('idno')
        PatName = ClsHisOPObj.patinfo_dict.get('name')
        INSUCardStr = ClsHisOPObj.patinfo_dict.get('insu_card_no') 
        HISCardTypeCode = "01"
        HospId = ClsHisOPObj.terminal_dict.get('hosp_id')
        UserCode = ClsHisOPObj.terminal_dict.get('user_code')
        UserID = ClsHisOPObj.terminal_dict.get('user_id')
        PatientName = PatName
        BusinessMasterId = ClsHisOPObj.serial_id
        CardNo = ClsHisOPObj.his_patinfo_dict.get('his_unique_no') 
        BusinessType = ClsHisOPObj.business_type
        #Interface
        DicType = Input.get('DicType')
        DicDemo = ""
        DepDr = ""
        if DicType == "MTLBA":
            UserOperationDic = Tools.GetUserOperation(BusinessMasterId,"insutype")
            DicDemo = UserOperationDic.get('Param')
            if not DicDemo:
                Response = Tools.BuildWebOutPut("")
                return Response  
            else:
                if DicDemo == "1" or DicDemo == "2" or DicDemo == "8":
                    Response = Tools.BuildWebOutPut("")
                    return Response   
            UserOperationDic = Tools.GetUserOperation(BusinessMasterId,"level2dep")
            if UserOperationDic:
                DepDr = UserOperationDic.get('DepartmentCode') 
        RequestStr = '<Request><TradeCode>GetDicInfo</TradeCode><DepDr>' + DepDr + '</DepDr><HospitalID>' + HospId + '</HospitalID><DicType>' + DicType + '</DicType></Request>'
        # 保存入参
        #print("RequestStr",RequestStr)
        BDObj = BDCtl.BD()
        Input['intef_input'] = RequestStr
        BDObj.saveByWeb(Input)
        # 调用HIS接口
        Response = CallHISWS(RequestStr)
        # 保存出参
        Input['id'] = BDObj.result
        Input['intef_output'] = Response
        BDObj.saveByWeb(Input)
        # 构造返回参数
        Response = Tools.BuildWebOutPut(Response)
        return Response  
    # 获取照片
    def GetDoctorPicture(self,Input,ClsHisOPObj):
        try:
            DoctorCode = Input.get('DoctorCode')
            DoctorName = Input.get('DoctorDesc')
            #print('GetDoctorPicture参数开始',DoctorCode)
            #image = Image.open('C:/cygwin64/SelfService/WebAPP/123.jpg')
            #out_buff = BytesIO()
            #image.save(out_buff,format = 'JPEG')
            #by_data = out_buff.getvalue()
            DPModal = DPCtl.DP() 
            Input = {
                'ss_dcp_code':DoctorCode
            }
            base64_str = ""
            DPModal.query(Input)
            if DPModal.queryset: #
                ALLQuerySet = DPModal.queryset[0]
                base64_str = getattr(ALLQuerySet,'ss_dcp_info')   
            if base64_str == "":
                base64_str = CallHISDocInfo(DoctorCode)
                if  not base64_str:
                    base64_str = "-1"
                #base64_str = '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' #str(base64.b64encode(by_data))
                #保存照片
                InsertInput = {
                    'ss_dcp_code':DoctorCode,
                    'ss_dcp_info':base64_str,
                    'ss_dcp_name':DoctorName
                }
                DPModal1 = DPCtl.DP() 
                DPModal1.insert(InsertInput)

            Response = Tools.BuildWebOutPut(base64_str)
            #print(base64_str)
            return base64_str
        except Exception as e:
            print("1异常",e)

    # 电子发票开票
    def PayServInvocieBill(self,Input,ClsHisOPObj):
        try:
            # 组织HIS接口参数
            IDNO = ClsHisOPObj.patinfo_dict.get('idno')
            PatName = ClsHisOPObj.patinfo_dict.get('name')
            INSUCardStr = ClsHisOPObj.patinfo_dict.get('insu_card_no') 
            HISCardTypeCode = "01"
            HospId = ClsHisOPObj.terminal_dict.get('hosp_id')
            UserCode = ClsHisOPObj.terminal_dict.get('user_code')
            UserID = ClsHisOPObj.terminal_dict.get('user_id')
            PatientName = PatName
            BusinessMasterId = ClsHisOPObj.serial_id
            CardNo = ClsHisOPObj.his_patinfo_dict.get('his_unique_no') 
            BusinessType = ClsHisOPObj.business_type
            #Interface
            PayAdmType = "OP"
            HISPrtRowID = ""
            TDC = ss_tradedetailsCtl.TDC()
            InputQuery = {
                'ss_td_no':ClsHisOPObj.serial_number
            }
            TDC.query(InputQuery)
            if TDC.queryset: #查到了 没更新第三方交易表
                # rtnDic['ExtRefund']="Y" 测试需要退费时取消注释 
                ALLQuerySet = TDC.queryset[0]
                HISPrtRowID = getattr(ALLQuerySet,'ss_td_hisno')   
            OrgHISPrtRowID = ""
            PathCode = ""
            ExpStr = ""
            RequestStr = '<Request><TradeCode>PayServInvocieBill</TradeCode><PayAdmType>' + PayAdmType + '</PayAdmType><HISPrtRowID>' + HISPrtRowID + '</HISPrtRowID><OrgHISPrtRowID>' + OrgHISPrtRowID + '</OrgHISPrtRowID><PathCode>' + PathCode + '</PathCode><ExpStr>' + ExpStr + '</ExpStr></Request>'
            # 保存入参
            #print("RequestStr",RequestStr)
            BDObj = BDCtl.BD()
            Input['intef_input'] = RequestStr
            BDObj.saveByWeb(Input)
            # 调用HIS接口
            Response = CallHISWS(RequestStr)
            # 保存出参
            Input['id'] = BDObj.result
            Input['intef_output'] = Response
            BDObj.saveByWeb(Input)
            # 构造返回参数
            Response = Tools.BuildWebOutPut(Response) 
            return Response
        except Exception as e:
            print("1异常",e)

    # 获取凭条打印信息
    def GetCertPrint(self,Input,ClsHisOPObj):
        try:
            #print('GetDicInfo参数开始',Input)
            # 组织HIS接口参数
            IDNO = ClsHisOPObj.patinfo_dict.get('idno')
            PatName = ClsHisOPObj.patinfo_dict.get('name')
            INSUCardStr = ClsHisOPObj.patinfo_dict.get('insu_card_no') 
            HISCardTypeCode = "01"
            HospId = ClsHisOPObj.terminal_dict.get('hosp_id')
            UserCode = ClsHisOPObj.terminal_dict.get('user_code')
            UserID = ClsHisOPObj.terminal_dict.get('user_id')
            PatientName = PatName
            BusinessMasterId = ClsHisOPObj.serial_id
            CardNo = ClsHisOPObj.his_patinfo_dict.get('his_unique_no') 
            BusinessType = ClsHisOPObj.business_type
            #Interface
            PatientID = ClsHisOPObj.his_patinfo_dict.get('his_unique_no') 
            AdmId = ""
            if ClsHisOPObj.patinfo_dict.get('barcode') and ClsHisOPObj.patinfo_dict.get('readcard_type') == "2":
                AdmId = ClsHisOPObj.patinfo_dict.get('barcode')
            RegType = Input.get('RegType')
            RequestStr = '<Request><UserId>' + UserID + '</UserId><TradeCode>GetCertPrint</TradeCode><RegType>' + RegType + '</RegType><AdmId>' + AdmId + '</AdmId><PatientID>' + PatientID + '</PatientID></Request>'
            # 保存入参
            BDObj = BDCtl.BD()
            Input['intef_input'] = RequestStr
            BDObj.saveByWeb(Input)
            # 调用HIS接口
            Response = CallHISWS(RequestStr)
            #print('Response',Response)
            # 保存出参
            Input['id'] = BDObj.result
            Input['intef_output'] = Response
            BDObj.saveByWeb(Input)
            # 构造返回参数
            Response = Tools.BuildWebOutPut(Response)
            return Response 
        except Exception as e:
            print("1异常",e)
     # 电子发票打印信息
    def GetEIPrintInfo(self,Input,ClsHisOPObj):
        #print('GetEIPrintInfo参数开始',Input)
        # 组织HIS接口参数
        IDNO = ClsHisOPObj.patinfo_dict.get('idno')
        PatName = ClsHisOPObj.patinfo_dict.get('name')
        INSUCardStr = ClsHisOPObj.patinfo_dict.get('insu_card_no') 
        HISCardTypeCode = "01"
        HospId = ClsHisOPObj.terminal_dict.get('hosp_id')
        UserCode = ClsHisOPObj.terminal_dict.get('user_code')
        UserID = ClsHisOPObj.terminal_dict.get('user_id')
        PatientName = PatName
        BusinessMasterId = ClsHisOPObj.serial_id
        CardNo = ClsHisOPObj.his_patinfo_dict.get('his_unique_no') 
        BusinessType = ClsHisOPObj.business_type
        barCode = ClsHisOPObj.patinfo_dict.get('barcode')
        if ClsHisOPObj.patinfo_dict.get('readcard_type') != "2": 
            barCode = ""
        #Interface  
        # 门诊号^业务发生日期^电子票据代码^电子票据号码^电子票据效验码^业务标志（F:门诊收费  R:门诊挂号）##门诊号^业务发生日期^电子票据代码^电子票据号码^电子票据效验码^业务标志（F:门诊收费  R:门诊挂号）##....
        RequestStr = '<Request><TradeCode>GetEIPrintInfo</TradeCode><AdmId>' + barCode + '</AdmId><PatNo>' + CardNo + '</PatNo><HospitalID>' + HospId + '</HospitalID></Request>'
        # 保存入参
        #print("RequestStr",RequestStr)
        BDObj = BDCtl.BD()
        Input['intef_input'] = RequestStr
        BDObj.saveByWeb(Input)
        # 调用HIS接口
        Response = CallHISWS(RequestStr)
        # 保存出参
        Input['id'] = BDObj.result
        Input['intef_output'] = Response
        BDObj.saveByWeb(Input)
        # 构造返回参数
        Response = Tools.BuildWebOutPut(Response)
        return Response  
     # 电子清单打印信息
    def GetEInvDetail(self,Input,ClsHisOPObj):
        #print('GetEInvDetail参数开始',Input)
        # 组织HIS接口参数
        IDNO = ClsHisOPObj.patinfo_dict.get('idno')
        PatName = ClsHisOPObj.patinfo_dict.get('name')
        INSUCardStr = ClsHisOPObj.patinfo_dict.get('insu_card_no') 
        HISCardTypeCode = "01"
        HospId = ClsHisOPObj.terminal_dict.get('hosp_id')
        UserCode = ClsHisOPObj.terminal_dict.get('user_code')
        UserID = ClsHisOPObj.terminal_dict.get('user_id')
        PatientName = PatName
        BusinessMasterId = ClsHisOPObj.serial_id
        CardNo = ClsHisOPObj.his_patinfo_dict.get('his_unique_no') 
        BusinessType = ClsHisOPObj.business_type
        barCode = ClsHisOPObj.patinfo_dict.get('barcode')
        if ClsHisOPObj.patinfo_dict.get('readcard_type') != "2": 
            barCode = ""
        #Interface  
        # 门诊号^业务发生日期^电子票据代码^电子票据号码^电子票据效验码^业务标志（F:门诊收费  R:门诊挂号）##门诊号^业务发生日期^电子票据代码^电子票据号码^电子票据效验码^业务标志（F:门诊收费  R:门诊挂号）##....
        RequestStr = '<Request><TradeCode>GetEInvDetail</TradeCode><AdmId>' + barCode + '</AdmId><PatNo>' + CardNo + '</PatNo><HospitalID>' + HospId + '</HospitalID></Request>'
        # 保存入参
        #print("RequestStr",RequestStr)
        BDObj = BDCtl.BD()
        Input['intef_input'] = RequestStr
        BDObj.saveByWeb(Input)
        # 调用HIS接口
        Response = CallHISWS(RequestStr)
        # 保存出参
        Input['id'] = BDObj.result
        Input['intef_output'] = Response
        BDObj.saveByWeb(Input)
        # 构造返回参数
        Response = Tools.BuildWebOutPut(Response)
        return Response  
    # 获取HIS异常信息
    def GetChgException(self,Input,ClsHisOPObj):
        #print('GetChgException参数开始')
        # 组织HIS接口参数
        IDNO = ClsHisOPObj.patinfo_dict.get('idno')
        PatName = ClsHisOPObj.patinfo_dict.get('name')
        INSUCardStr = ClsHisOPObj.patinfo_dict.get('insu_card_no') 
        HISCardTypeCode = "01"
        HospId = ClsHisOPObj.terminal_dict.get('hosp_id')
        UserCode = ClsHisOPObj.terminal_dict.get('user_code')
        UserID = ClsHisOPObj.terminal_dict.get('user_id')
        PatientName = PatName
        BusinessMasterId = ClsHisOPObj.serial_id
        CardNo = ClsHisOPObj.his_patinfo_dict.get('his_unique_no') 
        BusinessType = ClsHisOPObj.business_type
        PTObj = PTCtl.PT()
        queryParam = {'fk_businessmaster_id':int(BusinessMasterId),'code':'card_patinfo'} 
        PTObj.query(queryParam)
        barCode=""
        INSUCardStr = ""
        INSUCardNo = ""
        if PTObj.queryset:
            card_patinfo = getattr(PTObj.queryset[0],'code_val')
            GlobalPatInfo = json.loads(card_patinfo)
            barCode = GlobalPatInfo.get('barCode')
            INSUCardStr = GlobalPatInfo.get('INSUCardStr')
            if INSUCardStr:
                if len(str(INSUCardStr).split('^')) > 1:
                    INSUCardNo = str(INSUCardStr).split('^')[1]
        Adm = ""
        if ClsHisOPObj.patinfo_dict.get('readcard_type') != "2": 
            barCode = ""
        if barCode:
            if barCode !="":
                Adm = barCode
        else:
            UserOperationDic = Tools.GetUserOperation(BusinessMasterId,"AdmList")
            if UserOperationDic:
                Adm = UserOperationDic.get('AdmId')
        OrderNo = ""   
        PayingListOrderNo = ""
        UserOperationDic = Tools.GetUserOperation(BusinessMasterId,"PayingList") 
        if UserOperationDic:
            OrderNoDic = UserOperationDic.get('PayingList')
            #print("OrderNoDic",OrderNoDic)
            if OrderNoDic:
                if isinstance(OrderNoDic,dict):
                    pass
                else:
                    OrderNoDic = json.loads(OrderNoDic)
            PayingListOrderNo = OrderNoDic.get('OrderNo')
        OrderNo = PayingListOrderNo
        modal_code = Input.get("modal_code")
        if modal_code != "chargeshow":
            OrderNo = ""
        #Interface
        CardType = "1"
        StartDate = ""
        EndDate = "" #Tools.getDefStDate(0)
        RequestStr = '<Request><INSUCardNo>' + INSUCardNo + '</INSUCardNo><OrderNo>' + OrderNo + '</OrderNo><TradeCode>GetChgException</TradeCode><PatientID>' + CardNo +'</PatientID><Adm>'+ Adm +'</Adm><UserCode>' + UserCode + '</UserCode><CardType>' + CardType + '</CardType><TerminalID>ZZJ001</TerminalID><SecrityNo></SecrityNo><StartDate>' + StartDate + '</StartDate><EndDate>' + EndDate + '</EndDate><ExpStr></ExpStr></Request>'
                  # 保存入参
        #print("RequestStr",RequestStr)
        BDObj = BDCtl.BD()
        Input['intef_input'] = RequestStr
        BDObj.saveByWeb(Input)
        # 调用HIS接口
        Response = CallHISWS(RequestStr)
        # 保存出参
        Input['id'] = BDObj.result
        Input['intef_output'] = Response
        BDObj.saveByWeb(Input)
        # 构造返回参数
        Response = Tools.BuildWebOutPut(Response)
        return Response  
     # 检查自助机是否在自动结算 如果是 则不允许使用自助机
    def CheckAutoHandin(self,Input,ClsHisOPObj):
        #print('GetEIPrintInfo参数开始',Input)
        # 组织HIS接口参数
        IDNO = ClsHisOPObj.patinfo_dict.get('idno')
        PatName = ClsHisOPObj.patinfo_dict.get('name')
        INSUCardStr = ClsHisOPObj.patinfo_dict.get('insu_card_no') 
        HISCardTypeCode = "01"
        HospId = ClsHisOPObj.terminal_dict.get('hosp_id')
        UserCode = ClsHisOPObj.terminal_dict.get('user_code')
        UserID = ClsHisOPObj.terminal_dict.get('user_id')
        PatientName = PatName
        BusinessMasterId = ClsHisOPObj.serial_id
        CardNo = ClsHisOPObj.his_patinfo_dict.get('his_unique_no') 
        BusinessType = ClsHisOPObj.business_type
        #Interface  
        # 门诊号^业务发生日期^电子票据代码^电子票据号码^电子票据效验码^业务标志（F:门诊收费  R:门诊挂号）##门诊号^业务发生日期^电子票据代码^电子票据号码^电子票据效验码^业务标志（F:门诊收费  R:门诊挂号）##....
        RequestStr = '<Request><TradeCode>CheckAutoHandin</TradeCode></Request>'
        # 保存入参
        #print("RequestStr",RequestStr)
        BDObj = BDCtl.BD()
        Input['intef_input'] = RequestStr
        BDObj.saveByWeb(Input)
        # 调用HIS接口
        Response = CallHISWS(RequestStr)
        # 保存出参
        Input['id'] = BDObj.result
        Input['intef_output'] = Response
        BDObj.saveByWeb(Input)
        # 构造返回参数
        Response = Tools.BuildWebOutPut(Response)
        return Response 
    def GetExceptionPrint(self,Input,ClsHisOPObj):
        IDNO = ClsHisOPObj.patinfo_dict.get('idno')
        PatName = ClsHisOPObj.patinfo_dict.get('name')
        INSUCardStr = ClsHisOPObj.patinfo_dict.get('insu_card_no') 
        HISCardTypeCode = "01"
        HospId = ClsHisOPObj.terminal_dict.get('hosp_id')
        UserCode = ClsHisOPObj.terminal_dict.get('user_code')
        UserID = ClsHisOPObj.terminal_dict.get('user_id')
        PatientName = PatName
        BusinessMasterId = ClsHisOPObj.serial_id
        CardNo = ClsHisOPObj.his_patinfo_dict.get('his_unique_no') 
        BusinessType = ClsHisOPObj.business_type

        #print('GetExceptionPrint参数开始')
        PrtData = Input.get('PrtData')
        defrowHegith = 5
        #data
        TmpDateTime = Tools.getDefStDate(0,"Y/M/DD:M:S")
        TmpDateTimeNewY = TmpDateTime.split(' ')[1]
        TmpDateTimeNewD = TmpDateTimeNewY.replace('/',":")
        TmpDateTime = TmpDateTime.split(' ')[0] + " " + TmpDateTimeNewD
        CardNo = ClsHisOPObj.his_patinfo_dict.get('his_unique_no')
        Operator = ClsHisOPObj.terminal_dict.get('user_code')
        Operator = ClsHisOPObj.terminal_dict.get('user_code')
        serial_number = ClsHisOPObj.serial_number
        his_unique_admno = ClsHisOPObj.his_patinfo_dict.get('his_unique_admno')
        #
        # 取银行卡支付信息
        PosInfo =  Tools.GeBDOutPut(BusinessMasterId,intef_code = 'PayServ_POSPay')
        if not PosInfo:
            PosInfo = ""
        else:
            PosInfo = str(PosInfo)
        if PosInfo != "":
            PosInfoLen = len(PosInfo.split('|'))
            status =  PosInfo.split('|')[0]
            PosErr = ss_dicdataCtl.GetDicConByDicTypeCode("PosErr",status)
            PosErrDesc = ""
            if PosErr:
                PosErrDesc = PosErr.get('ss_dic_condesc')
            if status == "000000" and PosInfoLen > 11:
                TerminalNo = PosInfo.split('|')[4]
                TmpDate = PosInfo.split('|')[5]
                tmpAmt = PosInfo.split('|')[8]
                refundNo =  PosInfo.split('|')[10]
                backNo = PosInfo.split('|')[7]
                PosInfo = "参考号：" + refundNo + "|金额：" + tmpAmt + "|日期：" + TmpDate + "|终端号：" + TerminalNo+ "|银行卡：" + backNo
            PosInfo = PosErrDesc + ":" "银行卡支付信息：" + PosInfo
            PrtData = PrtData + PosInfo
        #
        rowHegith = defrowHegith
        alignWidth = 250
        xCneterPositon = 17
        xLeft = 2
        row1 = {"fontbold":"","fontname":"","fontsize":10,"height":"40","isqrcode":"","name":"DrugEnd","type":"text","value":' 天津市第一中心医院',"width":alignWidth,"x":xCneterPositon,"y":rowHegith}
        rowHegith +=defrowHegith
        row2 = {"fontbold":"","fontname":"","fontsize":10,"height":"40","isqrcode":"","name":"DrugEnd","type":"text","value":'     错误提示',"width":alignWidth,"x":xCneterPositon,"y":rowHegith}
        rowHegith +=defrowHegith
        row3 = {"fontbold":"","fontname":"","fontsize":15,"height":"40","isqrcode":"","name":"DrugEnd","type":"text","value":'此凭证请妥善保管',"width":alignWidth,"x":xCneterPositon-4,"y":rowHegith}
        rowHegith +=defrowHegith
        row4 = {"fontbold":"","fontname":"","fontsize":10,"height":"40","isqrcode":"","name":"DrugEnd","type":"text","value":'-----------------------------------',"width":alignWidth,"x":xLeft,"y":rowHegith}
        rowHegith +=defrowHegith
        row5 = {"fontbold":"","fontname":"","fontsize":10,"height":"40","isqrcode":"","name":"DrugEnd","type":"text","value":'日期时间：' + TmpDateTime,"width":alignWidth,"x":xLeft,"y":rowHegith}
        rowHegith +=defrowHegith
        row6 = {"fontbold":"","fontname":"","fontsize":10,"height":"40","isqrcode":"","name":"DrugEnd","type":"text","value":'就诊卡ID：' + CardNo,"width":alignWidth,"x":xLeft,"y":rowHegith}
        rowHegith +=defrowHegith
        row7 = {"fontbold":"","fontname":"","fontsize":10,"height":"40","isqrcode":"","name":"DrugEnd","type":"text","value":'操作员：' + Operator,"width":alignWidth,"x":xLeft,"y":rowHegith}
        rowHegith +=defrowHegith
        row8 = {"fontbold":"","fontname":"","fontsize":10,"height":"40","isqrcode":"","name":"DrugEnd","type":"text","value":'-----------------------------------',"width":alignWidth,"x":xLeft,"y":rowHegith}
        rowHegith +=defrowHegith
        row9 = {"fontbold":"","fontname":"","fontsize":10,"height":"40","isqrcode":"","name":"DrugEnd","type":"text","value":'患者姓名：' + PatName,"width":alignWidth,"x":xLeft,"y":rowHegith}
        rowHegith +=defrowHegith
        row10 = {"fontbold":"","fontname":"","fontsize":10,"height":"40","isqrcode":"","name":"DrugEnd","type":"text","value":'业务流水号：' + serial_number,"width":alignWidth,"x":xLeft,"y":rowHegith}
        rowHegith +=defrowHegith
        row11 = {"fontbold":"","fontname":"","fontsize":10,"height":"40","isqrcode":"","name":"DrugEnd","type":"text","value":'门诊号：' + his_unique_admno,"width":alignWidth,"x":xLeft,"y":rowHegith}
        rowHegith +=defrowHegith
        row12 = {"fontbold":"","fontname":"","fontsize":10,"height":"40","isqrcode":"","name":"DrugEnd","type":"text","value":'-----------------------------------',"width":alignWidth,"x":xLeft,"y":rowHegith}
        rowHegith +=defrowHegith
        Response = [row1,row2,row3,row4,row5,row6,row7,row8,row9,row10,row11,row12]
        #内容需要换行打印 17个字
        tmpIndex = 1
        printData = ""
        for key in PrtData:
            printData = printData + key
            tmpIndex = tmpIndex + 1
            if tmpIndex == 17:
                row13 = {"fontbold":"","fontname":"","fontsize":10,"height":"80","isqrcode":"","name":"DrugEnd","type":"text","value":printData,"width":alignWidth,"x":xLeft,"y":rowHegith}
                Response.append(row13)
                tmpIndex = 1
                printData = ""
                rowHegith +=defrowHegith
        # 输出最后一次
        if tmpIndex != 17:
            row13 = {"fontbold":"","fontname":"","fontsize":10,"height":"80","isqrcode":"","name":"DrugEnd","type":"text","value":printData,"width":alignWidth,"x":xLeft,"y":rowHegith}
            Response.append(row13)
        rowHegith +=defrowHegith
        rowHegith +=defrowHegith
        rowHegith +=defrowHegith
        row14 = {"fontbold":"","fontname":"","fontsize":15,"height":"40","isqrcode":"","name":"DrugEnd","type":"text","value":'请到人工窗口处理',"width":alignWidth,"x":xCneterPositon-4,"y":rowHegith}
        Response.append(row14)
        Response = json.dumps(Response)
        # 构造返回参数
        Response = Tools.BuildWebOutPut(Response)
        return Response 
#获取患者需要缴费的金额
def getOrdAmt(ClsHisOPObj):
    try:
        BusinessType = ClsHisOPObj.business_type
        BusinessMasterId = ClsHisOPObj.serial_id
        OrdAmt = "-1"
        #取订单总金额
        if  BusinessType == "DRINCRNO":
            UserOperationDic = Tools.GetUserOperation(BusinessMasterId,"getpredetails")        
            OrderCode = UserOperationDic.get('OrderCode')
            OrdAmt = UserOperationDic.get('PayAmt')
        elif BusinessType =="Reg":
            BDOutPut = Tools.GeBDOutPut(BusinessMasterId,intef_code = '10015')
            OrdAmt = Tools.GetXMLNode(BDOutPut,'RegFee')
        elif BusinessType =="OBTNO":
            BDOutPut = Tools.GetUserOperation(BusinessMasterId,'getpredetails')
            OrderCode = BDOutPut.get('OrderCode')
            OrdAmt = BDOutPut.get('PayAmt')
        elif BusinessType == "Charge":
            BDOutPut = Tools.GeBDOutPut(BusinessMasterId,'chargeshow','4905')
            OrdAmt = Tools.GetXMLNode(BDOutPut,'InvoiceAmt') 
            HisInv = Tools.GetXMLNode(BDOutPut,'InvoiceNo') 
        if float(OrdAmt)<0:
            raise Exception("-1^取自负金额失败,金额小于0")
        return OrdAmt
    except Exception as e:
        raise Exception("-1^取自负金额失败,金额小于0")
#根据配置取是否展示一级科室
def getUnShowL1Dep(ClsHisOPObj):
    rtnDic = {}
    print("# 1.根据自助机配置 取支付方式")
    EQLC = ss_eqlistcfgCtl.ELCFG()
    QueryParam = {
        'ss_eqlistc_cfgcode' : 'unshowl1dep',
        'ss_eqlistc_code' : ClsHisOPObj.client_dict.get('ss_eqlistd_eqcode')
    }
    EQLC.query(QueryParam)
    if EQLC.queryset:
        for tmpRSCObj in EQLC.queryset:
            rtnDic[getattr(tmpRSCObj,'ss_eqlistc_cfgvalue')] = ""
    # 2.根据角色取支付方式
    if rtnDic == {}:
        NewObj = ss_eqroleconfigCtl.EQRCC()
        QueryParam = {
            'ss_eqrolecfg_code' :ClsHisOPObj.client_dict.get('ss_eqlistd_role'),
            'ss_eqrolecfg_cfgcode' : 'unshowl1dep'
        }
        NewObj.query(QueryParam)
        if NewObj.queryset:
            for tmpRSCObj in NewObj.queryset:
                ALLQuerySet = tmpRSCObj
                ss_eqrolecfg_actflg = getattr(ALLQuerySet,'ss_eqrolecfg_actflg') 
                if ss_eqrolecfg_actflg == "Y":
                    rtnDic[getattr(ALLQuerySet,'ss_eqrolecfg_cfgvalue')] = ""
    # 3.都没有的使用默认值  均显示
    return rtnDic
#根据配置取是否展示二级科室
def getUnShowL2Dep(ClsHisOPObj):
    rtnDic = {}
    print("# 1.根据自助机配置 取支付方式")
    EQLC = ss_eqlistcfgCtl.ELCFG()
    QueryParam = {
        'ss_eqlistc_cfgcode' : 'unshowl2dep',
        'ss_eqlistc_code' : ClsHisOPObj.client_dict.get('ss_eqlistd_eqcode')
    }
    EQLC.query(QueryParam)
    if EQLC.queryset:
        for tmpRSCObj in EQLC.queryset:
            rtnDic[getattr(tmpRSCObj,'ss_eqlistc_cfgvalue')] = ""
    # 2.根据角色取支付方式
    if rtnDic == {}:
        NewObj = ss_eqroleconfigCtl.EQRCC()
        QueryParam = {
            'ss_eqrolecfg_code' :ClsHisOPObj.client_dict.get('ss_eqlistd_role'),
            'ss_eqrolecfg_cfgcode' : 'unshowl2dep'
        }
        NewObj.query(QueryParam)
        if NewObj.queryset:
            for tmpRSCObj in NewObj.queryset:
                ALLQuerySet = tmpRSCObj
                ss_eqrolecfg_actflg = getattr(ALLQuerySet,'ss_eqrolecfg_actflg') 
                if ss_eqrolecfg_actflg == "Y":
                    rtnDic[getattr(ALLQuerySet,'ss_eqrolecfg_cfgvalue')] = ""
    # 3.都没有的使用默认值  均显示
    return rtnDic

