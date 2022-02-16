# HIS 操作业务
import xmltodict
from ServCall.HIS.Common.Webservices import CallHISWS
from SelfServPy.Common import business_masterCtl as BMCtl
from SelfServPy.Common import business_detailsCtl as BDCtl
from SelfServPy.Common import patinfoCtl as PTCtl
from SelfServPy.ApplicationFrameWork import Tools
import json
import random
import xmltodict
from urllib import parse
from SelfServPy.Common.LogCtl import SaveSYSLog
from SelfServPy.Common import ss_eqlistdCtl
import platform
import socket
class HISGlobalInfo:
    #定义私有变量
    # 1.业务主表信息
    serial_id = "" #业务主表ID
    serial_number = "" #业务主表流水号
    business_type = "" #业务类型
    processcode = "" #流程代码
    #1.1 业务主表中的终端信息
    # {"UserID": "7", "UserCode": "reg", "HospId": "2", "GroupId": "238", "Terminal": ""}
    # 如需添加 继续追加json键对
    terminal_dict = {
        'user_id' : "", # 操作员id
        'user_code' : "", # 操作员代码
        'hosp_id' : "", #院区id
        'hosp_code' : "", #院区代码
        'hosp_desc' : "", #院区描述
        'group_id' : "", #安全组id
        'terminal_no' : "", #终端号
        'mac' : "" #mac地址
    }

    # 2.患者基本信息
    patinfo_dict = {
        'name' : "", #姓名
        'sex' : "", #性别
        'age' : "",  #年龄
        'idno' : "", #身份证
        'insu_card_no' : "", #医保卡号 医保卡返回串
        'brtd' : "", #生日
        'phone' : "", #电话号码
        'readcard_type' : "", #读卡类型
        'naty' : '', #民族
        'Address':'',
        'barcode':'' #条码
    }
    # 3.HIS患者基本信息
    his_patinfo_dict = {
        'his_unique_no' : "", # HIS患者唯一号
        'his_card_type' : "", # HIS患者卡类型
        'his_card_no' :'',
        'his_unique_admno' : "", # HIS 患者唯一就诊流水号  标志唯一一次就诊
        'hi_type':''
    }
    # 4.客户端字典配置信息  客户端主表
    client_dict = {											
        'id':'',
        'ss_eqlistd_eqcode' : "", # 
        'ss_eqlistd_eqdesc' : "", #
        'ss_eqlistd_address' :'',
        'ss_eqlistd_spec' : "" ,
        'ss_eqlistd_unit' : "",
        'ss_eqlistd_type' : "", 
        'ss_eqlistd_ip' :'',
        'ss_eqlistd_mac' : "" ,
        'ss_eqlistd_opdate' :'',
        'ss_eqlistd_closedate' : "" ,
        'ss_eqlistd_createdate' : "",
        'ss_eqlistd_creator' : "", 
        'ss_eqlistd_update' :'',
        'ss_eqlistd_upuser' : "" ,
        'ss_eqlistd_role' :''
    }
    #生成业务主表信息
    def BuildBMInfo(self,BusinessMasterId):
        if BusinessMasterId=="":
            return 
        SaveSYSLog('开始生成业务主表信息')
        #查询
        InputParam = {"id":int(BusinessMasterId)}
        GlobalBMObj = BMCtl.BM()
        GlobalBMObj.query(InputParam)
        GlobalBusinessMaster = GlobalBMObj.queryset[0]  
        #赋值
        self.serial_id = BusinessMasterId 
        self.serial_number = getattr( GlobalBusinessMaster, 'serial_number') 
        self.business_type = getattr( GlobalBusinessMaster, 'code')  
        self.processcode = getattr( GlobalBusinessMaster, 'processcode')  
        # terminal_info
        GlobalTerminalInfoStr = getattr( GlobalBusinessMaster, 'terminal_info')
        GlobalTerminalInfo = json.loads(GlobalTerminalInfoStr)
        self.terminal_dict['user_id'] = GlobalTerminalInfo.get('UserID')
        self.terminal_dict['user_code']  = GlobalTerminalInfo.get('UserCode')
        self.terminal_dict['hosp_id']  = GlobalTerminalInfo.get('HospId')
        self.terminal_dict['group_id'] = GlobalTerminalInfo.get('GroupId')
        self.terminal_dict['terminal_no']  = GlobalTerminalInfo.get('Terminal')
        SaveSYSLog('生成业务主表信息成功')
    #生成患者基本信息
    def BuildPTInfo(self,BusinessMasterId):
        if BusinessMasterId=="":
            return
        SaveSYSLog('开始生成患者基本信息')
        #查询
        PTObj = PTCtl.PT()
        queryParam = {'fk_businessmaster_id':int(BusinessMasterId),'code':'card_patinfo'} 
        PTObj.query(queryParam)
        GlobalPatInfo = "" 
        #{"ResponseStatus": 0, "ResponseText": "", "CardType": "1", "CardTypeCode": "01", "IDNo": "6221261994121311455", "Name": "hhd", "Sex": "男", "Age": "22", "brdy": "1994-12-13", "naty": "a", "Address": "", "INSUCardStr": ""}
        if PTObj.queryset:
            card_patinfo = getattr(PTObj.queryset[0],'code_val')
            GlobalPatInfo = json.loads(card_patinfo)
        else:
            SaveSYSLog('未查询到患者基本信息,BusinessMasterId')
            return
        #赋值
        self.patinfo_dict['name'] = GlobalPatInfo.get('Name')
        self.patinfo_dict['sex'] = GlobalPatInfo.get('Sex')
        self.patinfo_dict['age'] = GlobalPatInfo.get('Age')
        self.patinfo_dict['idno'] = GlobalPatInfo.get('IDNo')
        self.patinfo_dict['brtd'] = GlobalPatInfo.get('brdy')
        self.patinfo_dict['phone'] = ''
        self.patinfo_dict['naty'] = GlobalPatInfo.get('naty')
        self.patinfo_dict['Address'] = GlobalPatInfo.get('Address')
        self.patinfo_dict['barcode'] = GlobalPatInfo.get('barCode')
        self.patinfo_dict['readcard_type'] = GlobalPatInfo.get('ReadCardType')

        # 解析医保串
        self.patinfo_dict['insu_card_no'] = GlobalPatInfo.get('INSUCardStr')
        SaveSYSLog('生成患者基本信息成功')
    #生成患者HIS就诊信息
    def BuildHISPTInfo(self,BusinessMasterId):
        if BusinessMasterId=="":
            return
        SaveSYSLog('开始生成HIS患者基本信息')
        #查询
        PTObj = PTCtl.PT()
        queryParam = {'fk_businessmaster_id':int(BusinessMasterId),'code':'his_patinfo'} 
        PTObj.query(queryParam)
        his_unique_no = ""
        his_card_type = ""
        his_card_no = ""
        hi_type = ""
        if PTObj.queryset:
            ALLQuerySet = PTObj.queryset[0]
            his_patinfo = getattr(ALLQuerySet,'code_val')
            #print("his_patinfo",his_patinfo)
            if his_patinfo !="":
                result = Tools.GetXMLNode(his_patinfo,'ResultCode')
                if result =="0":
                    his_card_no = Tools.GetXMLNode(his_patinfo,'PatientCard') 
                    his_unique_no = Tools.GetXMLNode(his_patinfo,'PatientID') 
                    his_card_type = Tools.GetXMLNode(his_patinfo,'PatTypeCode') 
                    hi_type = getattr(ALLQuerySet,'hi_type')
        else:
            SaveSYSLog('未查询到HIS患者基本信息,BusinessMasterId')
            return
        #赋值
        self.his_patinfo_dict['his_unique_no'] = his_unique_no
        self.his_patinfo_dict['his_card_type'] = his_card_type
        self.his_patinfo_dict['his_card_no'] = his_card_no
        self.his_patinfo_dict['hi_type'] = hi_type
        #print('生成HIS患者基本信息成功',his_unique_no)
    # 根据客户端信息 获取客户端配置(字典)
    def GetClientCofig(self,ParamRequest):
        try:
            Terminal = platform.node()
            NODE1 = ParamRequest.META.get('uwsgi.node')
            if NODE1:
                Terminal = bytes.decode(ParamRequest.META['uwsgi.node'])
            IPStr = ParamRequest.META['REMOTE_ADDR']
            #print("开始生成根据客户端信息", IPStr)
            # 根据客户端名称 获取客户端配置信息
            print("IPStr=",IPStr)
            ELCObj = ss_eqlistdCtl.ELC()
            queryParam = {'ss_eqlistd_ip':IPStr}   
            ELCObj.query(queryParam)
            if ELCObj.queryset:
                ALLQuerySet = ELCObj.queryset[0]
                self.client_dict = Tools.modle_to_dict(ALLQuerySet)
            #print("生成根据客户端信息成功",self.client_dict)
            return "0"
        except Exception as e:
            print('生成客户端信息失败' + str(e))
            return "-1"
            #raise Exception('生成客户端信息失败' + str(e))



