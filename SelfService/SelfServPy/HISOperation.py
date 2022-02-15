# HIS 操作业务
from SelfServPy.Common import patinfoCtl as PTCtl
from SelfServPy.ApplicationFrameWork import Tools
from SelfServPy.ApplicationFrameWork import ClsHisOperation as ClsHisOP
import json
import time
from SelfServPy.Common.LogCtl import SaveSYSLog
from SelfServPy.Common import ss_tradedetailsCtl as TDCtl
from SelfServPy.Common import ss_tdpaymodeCtl as TDPCtl
from SelfServPy.Rules import Check
from SelfServPy.Common import ss_processconfigCtl
from SelfServPy.Common import ss_eqlistcfgCtl
from SelfServPy.Common import business_masterCtl as BMCtl
from SelfServPy.Common import ss_eqroleconfigCtl
from SelfServPy.Common import ss_dicdataCtl
#第三方支付
from ServCall.KLEPay.pay import Pay
from ServCall.KLEPay.pay import QueryPay
from ServCall.KLEPay.pay import Refund
from ServCall.KLEPay.pay import Close
from ServCall.KLEPay.pay import Cancel
from ServCall.KLEPay.pay import RefundQuery
from SelfServPy import DHC_Business as DHCB
import xmltodict
# 
# 入参： input: 类型： Json格式的String
#          serial_id : 业务主表id                                       *必传 （除初始化TradeCode=Init，之外必传)
#          serial_number : 业务流水号                                   *必传 （除初始化TradeCode=Init，之外必传)
#          TradeCode: 交易代码 例如:3300                                *必传   交易代码为6666时 标志为用户主动操作提交保存的数据，即点界面按钮
#          modal_code  : 操作代码 例如:readcard, 为流程配置中的代码       *必传 
#          bd_id:   业务流水表的id 在用户操作时传入
# 备注： 一个交易代码TradeCode 即一次 DO接口  生成一条业务明细表BD记录 bd_id
# 返回值： 
#            'result' : 交易结果代码 非0 表示 服务端调用失败
#            'msg':  服务端调用失败原因
#            'output' : 服务端返回的数据,
#            "outputType" : 返回数据类型 默认为json格式  业务层调用该接口 均直接返回 HIS返回的数据
def DO(ParamRequest):
    try:
        Input = ParamRequest.POST.copy() #['Input'] 
        #Input = json.loads(Input)
        #print('Input',Input)
        # 
        #SaveSYSLog('入参：' + Input)
        #1. 初始化全局变量
        SaveSYSLog('开始初始化全局变量')
        ClsHisOPObj = ClsHisOP.HISGlobalInfo()
        SaveSYSLog('初始化全局变量成功')
        #2. 根据客户端信息取配置
        rtn = ClsHisOPObj.GetClientCofig(ParamRequest)
        if rtn =="-1":
            rtn = ClsHisOPObj.GetClientCofig(ParamRequest)
            if rtn == "-1":
                raise Exception('生成客户端信息失败' + str(e))
        #3. 获取入参
        BusinessMasterId = Input.get('serial_id')
        BusinessMasterSerNo = Input.get('serial_number')
        Business = Input.get('Business')
        TradeCode = Input.get('TradeCode')
        #4. 业务初始化
        DHCObj = DHCB.DHC()
        #4.1 初始化 每个主界面按钮只需要初始化一次  返回初始化信息
        if TradeCode == "Init":
            Response = DHCObj.Init(Input,ClsHisOPObj)
            return Response

        # 根据第一次业务信息，生成业务主表
        # 用于患者需要多次业务时，不返回主页，重新读卡
        # 场景： 1.核酸 挂号-缴费，2.结算多笔费用时
        # 功能：插 bm 主表，插患者信息表patinfo
        if TradeCode == "RepeatInit":
            Response = DHCObj.RepeatInit(Input,ClsHisOPObj)
            return Response
        #5. 非初始化业务，根据客户端参数 生成业务主表信息 (此时已初始化成功)
        ClsHisOPObj.BuildBMInfo(BusinessMasterId)
        #6. 保存物理读卡的信息  身份证或医保卡
        if TradeCode == "SavePatInfo": 
            Response = DHCObj.SavePatInfo(Input,ClsHisOPObj)
            return Response   
        #7. 通过物理卡信息 生成患者信息全局变量           
        ClsHisOPObj.BuildPTInfo(BusinessMasterId)
        ### 以下接口均为业务接口  
        #  获取患者 基本信息 3300
        if TradeCode == "3300":
            # 组织HIS接口参数
            Response = DHCObj.DHC_3300(Input,ClsHisOPObj)
            HISOutPut = Response.get('output')
            HISResultCode = Tools.GetXMLNode(HISOutPut,"ResultCode")
            if HISResultCode == "0": 
                # 保存HIS患者基本信息
                #<Response><ResultCode>0</ResultCode><PatInfos><PatInfo><PatientID>61266949</PatientID><PatientName>gaga</PatientName><Sex>女</Sex><SexCode>2</SexCode><DOB>1990-01-01</DOB><TelephoneNo>18270883636</TelephoneNo><Mobile>18270883636</Mobile><DocumentID></DocumentID><Address></Address><IDTypeCode></IDTypeCode><IDTypeDesc></IDTypeDesc><IDNo>120104199001010622</IDNo><InsureCardNo></InsureCardNo><AccInfo>0^3451552^612669490001^0^^0^^1093507^61266949^3451663^P^^24^^0^3451552^612669490001^0^^0^^1093507^61266949^3451663^P^^24^</AccInfo><AccInfoBalance>0</AccInfoBalance><AccInfoNo>3451552</AccInfoNo><PatientCard>120104199001010622</PatientCard><YBFlag>0</YBFlag><PatType>自费</PatType><PatTypeCode>01</PatTypeCode><Age>31岁</Age><BlackFlag>0</BlackFlag></PatInfo></PatInfos></Response>
                PTObj = PTCtl.PT()
                code = "his_patinfo"
                code_val = HISOutPut
                his_master_id = ""
                if Tools.GetXMLNode(HISOutPut,'Response'):
                    his_master_id = Tools.GetXMLNode(HISOutPut,'PatientID')
                    his_patname = Tools.GetXMLNode(HISOutPut,'PatientName')
                    id_no = Tools.GetXMLNode(HISOutPut,'IDNo')
                InsertDic = {'fk_businessmaster_id':BusinessMasterId,'code':code,'code_val':code_val,'his_master_id':his_master_id,'his_patname':his_patname,'id_no':id_no}
                PTObj.insert(InsertDic)
            return Response 

        #8.生成HIS患者信息全局变量 his_patinfo
        ClsHisOPObj.BuildHISPTInfo(BusinessMasterId)    

        # 保存用户操作信息
        if TradeCode == "6666":
            Response = DHCObj.DHC_6666(Input,ClsHisOPObj)
            return Response 
        #  患者建档 3014
        if TradeCode == "3014":
            # 组织HIS接口参数
            Response = DHCObj.DHC_3014(Input,ClsHisOPObj)
            return Response 
        # 2 获取一级科室
        if TradeCode == "1011":
            # 组织HIS接口参数       
            Response = DHCObj.DHC_1011(Input,ClsHisOPObj)
            ResponseXmlStr = Response.get('output')
            ResponseDic = xmltodict.parse(ResponseXmlStr)
            if ResponseDic.get("Response"):
                if ResponseDic.get("Response").get("ResultCode") == "0" and ResponseDic.get("Response").get("RecordCount") != "0":
                    DepList = ResponseDic.get("Response").get('Departments').get('Department')
                    Unshow = DHCB.getUnShowL1Dep(ClsHisOPObj)
                    #print(Unshow,DepList)
                    if Unshow != {}:
                        DepListIndex = 0
                        for key in DepList:
                            DataCode = DepList[DepListIndex].get('DepartmentCode')
                            ConfigCode = Unshow.get(DataCode)
                            if ConfigCode is not None:
                                DepList.pop(DepListIndex)
                            else:
                                DepListIndex += 1
                        ResponseDic.get("Response").get('Departments')['Department']=DepList
                        ResponseXmlStr = xmltodict.unparse(ResponseDic)
                        Response = Tools.BuildWebOutPut(ResponseXmlStr)
            return Response
        # 获取二级科室
        if TradeCode == "1012":
            # 组织HIS接口参数       
            Response = DHCObj.DHC_1012(Input,ClsHisOPObj)
            ResponseXmlStr = Response.get('output')
            ResponseDic = xmltodict.parse(ResponseXmlStr)
            if ResponseDic.get("Response"):
                if ResponseDic.get("Response").get("ResultCode") == "0" and ResponseDic.get("Response").get("RecordCount") != "0":
                    DepList = ResponseDic.get("Response").get('Departments').get('Department')
                    Unshow = DHCB.getUnShowL2Dep(ClsHisOPObj)
                    #print(Unshow,DepList)
                    if Unshow != {}:
                        DepListIndex = 0
                        for key in DepList:
                            DataCode = DepList[DepListIndex].get('DepartmentCode')
                            ConfigCode = Unshow.get(DataCode)
                            if ConfigCode is not None:
                                DepList.pop(DepListIndex)
                            else:
                                DepListIndex += 1
                        ResponseDic.get("Response").get('Departments')['Department']=DepList
                        ResponseXmlStr = xmltodict.unparse(ResponseDic)
                        Response = Tools.BuildWebOutPut(ResponseXmlStr)
            return Response
        if TradeCode == "1013":
            # 组织HIS接口参数       
            Response = DHCObj.DHC_1013(Input,ClsHisOPObj)
            return Response 
        if TradeCode == "1004":
            # 组织HIS接口参数       
            Response = DHCObj.DHC_1004(Input,ClsHisOPObj)
            return Response
        if TradeCode == "10041":
            # 组织HIS接口参数       
            Response = DHCObj.DHC_10041(Input,ClsHisOPObj)
            return Response
        if TradeCode == "3016":
            # 组织HIS接口参数      
            Response = DHCObj.DHC_3016(Input,ClsHisOPObj)
            return Response   
        if TradeCode == "1000":
            # 组织HIS接口参数
            Response = DHCObj.DHC_1000(Input,ClsHisOPObj)
            return Response 
        # 取消锁号
        if TradeCode == "10016":
            # 组织HIS接口参数  
            Response = DHCObj.DHC_10016(Input,ClsHisOPObj)
            return Response
        if TradeCode == "1108":
            # 组织HIS接口参数 
            Response = DHCObj.DHC_1108(Input,ClsHisOPObj)
            return Response
        if TradeCode == "1105":
            # 组织HIS接口参数
            Response = DHCObj.DHC_1105(Input,ClsHisOPObj)
            return Response  
        # 查询预约信息
        if TradeCode == "1005":
            Response = DHCObj.DHC_1005(Input,ClsHisOPObj)
            return Response  
        # 挂号/取号/加号 如果返回成功则标志本次挂号成功  需要保存交易流水表ss_tradedetails
        # <Response><ResultCode>0</ResultCode><ResultContent>挂号成功</ResultContent><SeqCode>70</SeqCode><RegFee>7.5</RegFee><AdmitRange>2021-11-18 14:00-14:30</AdmitRange><AdmitAddress>1层外科诊区14诊室</AdmitAddress><TransactionId>DHC077531211118161226</TransactionId><PayOrderId>95275555555</PayOrderId><AdmNo>00411723</AdmNo><DeptName>甲状腺专病门诊</DeptName><DoctorName>普诊医师</DoctorName><DoctorLevelDesc>老人号</DoctorLevelDesc><TimeRange>下午</TimeRange><RegistrationID>333224</RegistrationID><HisTradeOrderId>202111181613274013453915</HisTradeOrderId><HisInvprtId>749065</HisInvprtId></Response>
        if TradeCode == "1101":
            rtn = DHCObj.DHC_1101(Input,ClsHisOPObj)
            result = rtn.get('result')
            Response = rtn.get('output')
            business_status = "-1"
            his_invid = ""
            if result == "0": #为0标志这最终交易成功
                business_status = "1"
                his_invid = Tools.GetXMLNode(Response.get('output'),"HisInvprtId")
                SaveTDInfo(Response,ClsHisOPObj)
            InsertDic = {'id':int(ClsHisOPObj.serial_id),'business_status': business_status,'his_invid':his_invid}
            BMObj = BMCtl.BM()
            BMObj.insert(InsertDic)
            return Response 
        # 锁号
        if TradeCode == "10015":
            # 组织HIS接口参数       
            Response = DHCObj.DHC_10015(Input,ClsHisOPObj)
            # 将已经锁的号取消锁号(解决IE奔溃未取消锁号的情况)
            HISOutPut = Response.get('output')
            HISResultCode = Tools.GetXMLNode(HISOutPut,"ResultCode")
            if HISResultCode == "-1001510": #有未付费的记录
                DHCObj.DHC_10016(Input,ClsHisOPObj)
                Response = DHCObj.DHC_10015(Input,ClsHisOPObj)
            return Response
        # HIS预结算
        if TradeCode == "4905":
            # 组织HIS接口参数
            Response = DHCObj.DHC_4905(Input,ClsHisOPObj)
            return Response
        # HIS确认完成 
        if TradeCode == "4906":
            # 组织HIS接口参数
            rtn = DHCObj.DHC_4906(Input,ClsHisOPObj)
            result = rtn.get('result')
            Response = rtn.get('output')
            business_status = "-1"
            his_invid = ""
            if result == "0":
                SaveTDInfo(Response,ClsHisOPObj)
                business_status = "1"
                his_invid = Tools.GetXMLNode(Response.get('output'),"InvId")
                InsertDic = {'id':int(ClsHisOPObj.serial_id),'business_status': business_status,'his_invid':his_invid}
                BMObj = BMCtl.BM()
                BMObj.insert(InsertDic)
            return Response
        # HIS校验是否结算成果
        if TradeCode == "4909":
            # 组织HIS接口参数
            Response = DHCObj.DHC_4909(Input,ClsHisOPObj)
            return Response 
        # HIS取消预结算
        if TradeCode == "4910":
            # 组织HIS接口参数
            Response = DHCObj.DHC_4910(Input,ClsHisOPObj)
            return Response 
        # 查询就诊记录
        if TradeCode == "4902":
            # 组织HIS接口参数
            Response = DHCObj.DHC_4902(Input,ClsHisOPObj)
            return Response 
        # 查询HIS代缴费结算单
        if TradeCode == "4904":
            # 组织HIS接口参数
            Response = DHCObj.DHC_4904(Input,ClsHisOPObj)
            return Response 
        # 物价查询
        if TradeCode == "90013":
            # 组织HIS接口参数
            Response = DHCObj.DHC_90013(Input,ClsHisOPObj)
            return Response 
        # HIS缴费信息查询
        if TradeCode == "4908":
            # 组织HIS接口参数
            Response = DHCObj.DHC_4908(Input,ClsHisOPObj)
            return Response   
        # 流调表信息获取
        if TradeCode == "GetSurvlist":
            # 组织HIS接口参数
            Response = DHCObj.DHC_GetSurvlist(Input,ClsHisOPObj)
            return Response 
        # 流调表信息保存
        if TradeCode == "SaveSurvList":
            # 组织HIS接口参数
            Response = DHCObj.DHC_SaveSurvList(Input,ClsHisOPObj)
            return Response 
        # 医保预挂号
        if TradeCode == "PayServ_INSUPreReg":
            # 构造返回参数
            Response = DHCObj.DHC_PayServ_INSUPreReg(Input,ClsHisOPObj)
            return Response
        # 撤销医保预挂号
        if TradeCode == "PayServ_INSUCancelPreReg":
            # 构造返回参数
            Response = DHCObj.DHC_PayServ_INSUCancelPreReg(Input,ClsHisOPObj)
            return Response
        # 医保挂号
        if TradeCode == "PayServ_INSUReg":
            # 构造返回参数
            Response = DHCObj.DHC_PayServ_INSUReg(Input,ClsHisOPObj)
            return Response
        # 撤销医保挂号
        if TradeCode == "PayServ_INSURegReturn":
            # 构造返回参数
            Response = DHCObj.DHC_PayServ_INSURegReturn(Input,ClsHisOPObj)
            return Response
        # 医保预结算
        if TradeCode == "PayServ_InsuOPDividePre":
            # 构造返回参数
            Response = DHCObj.DHC_PayServ_InsuOPDividePre(Input,ClsHisOPObj)
            return Response
        # 撤销医保预结算
        if TradeCode == "PayServ_InsuOPDivideRollBack":
            # 构造返回参数
            Response = DHCObj.DHC_PayServ_InsuOPDivideRollBack(Input,ClsHisOPObj)
            return Response
        # 医保结算
        if TradeCode == "PayServ_InsuOPDivideCommit":
            # 构造返回参数
            Response = DHCObj.DHC_PayServ_InsuOPDivideCommit(Input,ClsHisOPObj)
            return Response
        # 撤销医保结算
        if TradeCode == "PayServ_InsuOPDivideStrike":
            # 构造返回参数
            Response = DHCObj.DHC_PayServ_InsuOPDivideStrike(Input,ClsHisOPObj)
            return Response
        # 保存业务流水表
        if TradeCode == "SaveBD":
            # 组织HIS接口参数
            Response = DHCObj.DHC_SaveBD(Input,ClsHisOPObj)
            return Response    
        # 获取医保支付方式
        if TradeCode == "GetInsuAmt":
            # 组织HIS接口参数
            Response = DHCObj.GetInsuAmt(Input,ClsHisOPObj)
            Response = Tools.BuildWebOutPut(Response)
            return Response 
        # 获取医保支付方式
        if TradeCode == "PayServ_POSPay":
            # 组织HIS接口参数
            Response = DHCObj.PayServ_POSPay(Input,ClsHisOPObj)
            return Response    
        # 获取支付信息
        if TradeCode == "GetShowInfo":
            # 组织HIS接口参数
            Response = DHCObj.GetShowInfo(ClsHisOPObj)
            return Response  
        # 获取异常打印数据
        if TradeCode == "GetExceptionPrint":
            # 组织HIS接口参数
            Response = DHCObj.GetExceptionPrint(Input,ClsHisOPObj)
            return Response
        # 获取HIS医保字典信息
        if TradeCode == "PayServ_GetDicInfo":
            # 组织HIS接口参数
            Response = DHCObj.GetDicInfo(Input,ClsHisOPObj)
            return Response
        # 检查是否符合规则
        if TradeCode == "CheckRule":
            # 组织HIS接口参数
            CK = Check.CK()
            Response = CK.checkfun(Input,ClsHisOPObj)
            return Response      
        # 检查需要撤销的单边数据
        if TradeCode == "CheckSingleData":
            # 组织HIS接口参数
            Response = DHCObj.CheckSingleData(ClsHisOPObj)
            return Response   
        # 获取医生照片
        if TradeCode == "GetDoctorPicture":
            # 组织HIS接口参数
            Response = DHCObj.GetDoctorPicture(Input,ClsHisOPObj)
            return Response     
        # 获取电子发票打印信息
        if TradeCode == "GetEIPrintInfo":
            # 组织HIS接口参数
            Response = DHCObj.GetEIPrintInfo(Input,ClsHisOPObj)
            return Response  
        # 获取电子清单印信息
        if TradeCode == "GetEInvDetail":
            # 组织HIS接口参数
            Response = DHCObj.GetEInvDetail(Input,ClsHisOPObj)
            return Response    
        # 获取主界面按钮
        if TradeCode == "GetMenuBtn":
            # 组织HIS接口参数
            Response = GetMenuBtn(ClsHisOPObj)
            return Response 
        # 获取设备信息
        if TradeCode == "GetDeviceInfo":
            # 组织HIS接口参数
            Response = Tools.BuildWebOutPut(ClsHisOPObj.client_dict)
            return Response   
        # 获取凭条打印
        if TradeCode == "GetCertPrint":
            # 组织HIS接口参数
            Response = DHCObj.GetCertPrint(Input,ClsHisOPObj)
            return Response
        # 获取HIS异常信息
        if TradeCode == "GetChgException":
            # 组织HIS接口参数
            Response = DHCObj.GetChgException(Input,ClsHisOPObj)
            return Response
        # 第三方支付----------------------------------------------Ext
        # 支付
        # 0 不需要支付
        # 1 订单创建成功
        #   1时： output 为支付二维码
        #   其他 订单创建失败 错误信息msg
        if TradeCode == "ExtPay":
            # 组织HIS接口参数
            result = "-1"
            msg = ""
            rtnoutput = ""
            rtn = Pay(ClsHisOPObj)
            if not rtn:
                result = "0" #不需要支付
            else:
                result = str(rtn.get('result'))
                rtnoutput = rtn.get('qcrode') # 支付二维码
                msg = rtn.get('msg')
            Response = Tools.BuildWebOutPut(rtnoutput ,result = str(result),msg = str(msg))     
            return Response 
        # 关闭第三方支付
        if TradeCode == "CloseExtPay":
            # 组织HIS接口参数
            rtn = Close(ClsHisOPObj)
            Response = Tools.BuildWebOutPut(rtn)
            return Response   
        # 撤销第三方支付
        if TradeCode == "CancelExtPay":
            # 组织HIS接口参数
            rtn = Cancel(ClsHisOPObj)
            Response = Tools.BuildWebOutPut(rtn)
            return Response  
        # 退费
        if TradeCode == "RefundExtPay":
            # 组织HIS接口参数
            rtn = Refund(ClsHisOPObj)
            Response = Tools.BuildWebOutPut(rtn)
            return Response 
        # 查询
        # 0 支付成功
        # 1 支付中
        # 0 不需要第三方支付
        if TradeCode == "QueryExtPay":
            result = "-1"
            msg = ""
            rtnoutput = ""
            # 组织HIS接口参数
            rtn = QueryPay(ClsHisOPObj)
            if not rtn:
                result = "0"
            else:
                result = str(rtn.get("result"))
                msg = rtn.get("msg")
            Response = Tools.BuildWebOutPut(rtnoutput,result=result,msg = msg)
            return Response    
        # 退费查询
        if TradeCode == "QueryRefundExtPay":
            # 组织HIS接口参数
            rtn = RefundQuery(ClsHisOPObj)
            Response = Tools.BuildWebOutPut(rtn)
            return Response 
        # 第三方支付----------------------------------------------Ext
        # 查看HIS自助机是否在自动结算
        if TradeCode == "CheckAutoHandin":
            # 组织HIS接口参数
            Response = DHCObj.CheckAutoHandin(Input,ClsHisOPObj)
            return Response  
        # 电子发票开票
        if TradeCode == "PayServInvocieBill":
            # 组织HIS接口参数
            Response = DHCObj.PayServInvocieBill(Input,ClsHisOPObj)
            #print("PayServInvocieBill",Response)
            return Response  
        # 是否需要更新动态库
        if TradeCode == "UpdateDLL":
            OutPut = "N"
            Response = Tools.BuildWebOutPut(OutPut)
            return Response 
        # 获取系统时间
        if TradeCode == "GetSYSDateTime":
            OutPut = Tools.getDefStDate(0,'Y/M/DD:M:S')
            Response = Tools.BuildWebOutPut(OutPut)
            return Response     
        # 更新患者身份类型
        if TradeCode == "UpdateHIType":
            #print("更新患者身份类型")
            PTObj = PTCtl.PT()
            BusinessMasterId = ClsHisOPObj.serial_id
            hi_type = Input.get('hi_type')
            InsertDic = {'hi_type':hi_type}
            PTObj.update(InsertDic,{'fk_businessmaster_id':BusinessMasterId,'code':'his_patinfo'})
            rtn = str(PTObj.result)
            if PTObj.result > 0:
                rtn = 0
                msg = "成功"
            else:
                rtn = str(PTObj.result)
                msg = PTObj.msg
            print("更新患者身份类型",msg)
            OutPut = {'pt_id':str(PTObj.result)}
            Response = Tools.BuildWebOutPut(OutPut)
            return Response
        # 延迟函数
        if TradeCode == "sleep":
            seconds0 = int(Input.get('seconds'))
            time.sleep(seconds0)
        # 获取自助机支付方式配置
        if TradeCode == "PayServGetPayMode":
            rtnArr = getPayMInfo(ClsHisOPObj)
            Response = Tools.BuildWebOutPut(rtnArr)
            return Response    
    except Exception as e:
            print("DOErr:" ,str(e))
            error = "" + str(e)
            result = "-1"
            if len(str(e).split('^')) > 1:
                result = str(e).split('^')[0]
            Response = Tools.BuildWebOutPut("",result = result,msg=error)
            return Response
# 保存成功的交易流水信息，交易支付方式信息 
def SaveTDInfo(HISResponse,ClsHisOPObj):
    try:
        #1.SaveTDinfo 保存交易主表
        BusinessMasterId = ClsHisOPObj.serial_id
        #print("SaveTDinfo",1)
        # 挂号
        HISOuput = HISResponse.get('output')
        HISNo = Tools.GetXMLNode(HISOuput,"HisTradeOrderId") #挂号为该字段返回
        if ClsHisOPObj.business_type == "Charge":
            BDOutPut = Tools.GetUserOperation(BusinessMasterId,'chargeshow','4905',"XML")
            HISNo = Tools.GetXMLNode(BDOutPut,'OrderNo') 
        # 此处需要测试 金额不为0=--------------------------------------------------！！！！！！
        OrderSum = Tools.GeBDOutPut(BusinessMasterId,intef_code = 'OrderAmt')
        #if not HISNo and OrderSum != "0":
        #    raise Exception("保存HIS交易流水失败HIS交易流水,HIS交易流水不存在")
        # 1.2. 关联第三方交易表
        #print("SaveTDinfo",2)
        ExtID=""
        # 组织HIS接口参数
        rtn = QueryPay(ClsHisOPObj)
        if rtn:
            result = str(rtn.get("result"))
            if result !="0":
                raise Exception("保存成功的交易流水失败：第三方未成功")
            ExtID = rtn.get('extid')
        #print("SaveTDinfo",3)
        TDObj = TDCtl.TDC()
        Input = {
            'ss_td_code' : ClsHisOPObj.business_type,
            'ss_td_desc' : '',
            'ss_td_amt' : OrderSum,
            'ss_td_type' : '1', #1成功   0 预结算
            'ss_td_no' : ClsHisOPObj.serial_number,
            'ss_td_hisno' : HISNo,
            'ss_td_platno' : ExtID,
            'ss_td_extno' : '',
            'ss_td_channel' : '',
            'ss_td_creator' : ClsHisOPObj.terminal_dict.get('terminal_no')
        }
        TDObj.insert(Input)
        #2.SaveTDPInfo 保存交易支付方式(子表)
        #print("SaveTDinfo",4)
        INSUAmt = 0 #医保总统筹
        SelfAmt = OrderSum #患者自负金额 默认支付全部
        INSUAccount = 0 # 医保账户支付
        # 取医保支付方式---------------------------------------------具体返回值具体修改
        INSURtn = Tools.GeBDOutPut(BusinessMasterId,intef_code = 'GetInsuAmt') #患者自负金额^医保账户支付金额$医保支付方式1!医保支付方式1金额$医保支付方式2!医保支付方式2金额……
        if INSURtn !="":
            SelfAmt = float(INSURtn.split('^')[0])
            INSUAccount = float(INSURtn.split('^')[1])
            INSUAmt = float(OrderSum) - SelfAmt - INSUAccount
        # 此处可以校验支付方式是否平
        #2.1插入自费支付方式

        #print("SaveTDinfo",5)
        UserOperationDic = Tools.GetUserOperation(BusinessMasterId,"paymode")
        SelfPayMode = UserOperationDic.get('PayModeCode') #自费支付方式
        Input = {
            'ss_tdp_no' : ClsHisOPObj.serial_number ,
            'ss_tdp_code' : SelfPayMode ,
            'ss_tdp_desc' :'',
            'ss_tdp_amt' : str(SelfAmt),
            'ss_tdp_masterid': TDObj.result,
            'ss_tdp_extid': ExtID
        }
        TDPObj = TDPCtl.TDPC()
        TDPObj.insert(Input)
        #print("SaveTDinfo",6)
        #2.2 插入医保账户支付
        Input = {
            'ss_tdp_no' : ClsHisOPObj.serial_number ,
            'ss_tdp_code' : 'INSUAccount' ,
            'ss_tdp_desc' :'医保账户支付',
            'ss_tdp_amt' : str(INSUAccount),
            'ss_tdp_masterid':TDObj.result
        }
        TDPObj = TDPCtl.TDPC()
        TDPObj.insert(Input)
        #print("SaveTDinfo",7)
        #2.2 插入医保统筹支付
        Input = {
            'ss_tdp_no' : ClsHisOPObj.serial_number ,
            'ss_tdp_code' : 'INSUAmt' ,
            'ss_tdp_desc' :'医保总报销',
            'ss_tdp_amt' : str(INSUAmt),
            'ss_tdp_masterid':TDObj.result
        }
        TDPObj = TDPCtl.TDPC()
        TDPObj.insert(Input)
        #print("SaveTDinfo",8)
    except Exception as e:
        #raise Exception(e)
        print(str(e))
#生成预结算信息
#费用展示界面调用
def CreateTDInfo(ClsHisOPObj):
    try:
        if ClsHisOPObj.business_type == "Reg":
            pass
        if ClsHisOPObj.business_type == "DRINCRNO":
            pass
        if ClsHisOPObj.business_type == "OBTNO":
            pass
        if ClsHisOPObj.business_type == "Charge":
            pass
        TDObj = TDCtl.TDC()
        Input = {
            'ss_td_code' : ClsHisOPObj.business_type,
            'ss_td_desc' : '',
            'ss_td_amt' : OrderSum,
            'ss_td_type' : '0', #自助机预结算
            'ss_td_no' : ClsHisOPObj.serial_number,
            'ss_td_hisno' : '',
            'ss_td_platno' : '',
            'ss_td_extno' : '',
            'ss_td_channel' : '',
            'ss_td_creator' : ClsHisOPObj.terminal_dict.get('terminal_no')
        }
        TDObj.insert(Input)
    except Exception as e:
        pass
# 获取主界面菜单配置
def GetMenuBtn(ClsHisOPObj):
    try:
        ClientDict =  ClsHisOPObj.client_dict
        #print("获取菜单",ClientDict) 
        ClientName = ClientDict.get('ss_eqlistd_eqcode')
        ClentRole = ClientDict.get('ss_eqlistd_role')
        if ClientName == "":
            raise Exception('未取到客户端配置')
        #根据设备代码 获取设备流程配置
        rtn = {}
        Input = {
            "ss_eqlistc_code" :ClientName,
            "ss_eqlistc_cfgcode" : 'processcode'
	    }
        PCCObj = ss_eqlistcfgCtl.ELCFG()
        PCCObj.query(Input)
        if PCCObj.queryset: # 如果没有配置设备 则通过角色获取
            #print(PCCObj.queryset[0])
            rtn = Tools.modle_to_dict( PCCObj.queryset[0]) 
            processcode = rtn.get('ss_eqlistc_cfgvalue')
            if not processcode:
                raise Exception('设备未维护流程代码')
            Input = {
                "ss_pc_dictype" : "Menu",
                "ss_pc_diccode" : processcode
            }
            PCCObj = ss_processconfigCtl.PCC()
            PCCObj.query(Input)
            if PCCObj.queryset: # 如果没有配置设备 则通过角色获取
                ALLQuerySet = PCCObj.queryset[0]
                rtn = Tools.modle_to_dict(ALLQuerySet) 
            else:
                raise Exception('无效的流程代码')
        Response = Tools.BuildWebOutPut(rtn)
        return Response
        # 通过设备编号 获取菜单配置
    except Exception as e:
        print("获取菜单异常",e)
        pass
# 更新医生照片
def UpdateDocPicture(ParamInput):
    try:
        ss_dcp_code = ParamInput.get('ss_dcp_code')
        
        DPModal = DPCtl.DP() 
        Input = {
            
        }
        tmpI=0
        base64_str = ""
        DPModal.query(Input)
        if DPModal.queryset: #
            for tmpRSCObj in DPModal.queryset:
                ALLQuerySet = tmpRSCObj
                ss_dcp_code = getattr(ALLQuerySet,'ss_dcp_code') 
                tmpid = getattr(ALLQuerySet,'id')
                tmpI = tmpI + 1
                #接口调用
                base64_str = CallHISDocInfo(ss_dcp_code)
                if  not base64_str:
                    base64_str = "-1"
                #保存照片
                InsertInput = {
                    'id':int(tmpid),
                    'ss_dcp_code':ss_dcp_code,
                    'ss_dcp_info':base64_str
                }
                DPModal1 = DPCtl.DP() 
                DPModal1.insert(InsertInput)
        # 通过设备编号 获取菜单配置
    except Exception as e:
        print("获取菜单异常",e)
        pass
#根据配置取支付方式
def getPayMInfo(ClsHisOPObj):
    try:
        rtnArr = []
        print("# 1.根据自助机配置 取支付方式")
        EQLC = ss_eqlistcfgCtl.ELCFG()
        QueryParam = {
            'ss_eqlistc_cfgcode' : 'paymode',
            'ss_eqlistc_code' : ClsHisOPObj.client_dict.get('ss_eqlistd_eqcode')
        }
        EQLC.query(QueryParam)
        if EQLC.queryset:
            for tmpRSCObj in EQLC.queryset:
                rtnDic = {}
                rtnDic['PayModeCode'] = getattr(tmpRSCObj,'ss_eqlistc_cfgvalue')
                coninfo = ss_dicdataCtl.GetDicConByDicTypeCode('PayMode',rtnDic['PayModeCode'])
                rtnDic['PayModeDesc'] = coninfo.get('ss_dic_desc')
                rtnDic['PayModeId'] = coninfo.get('ss_dic_demo')
                rtnArr.append(rtnDic)
        # 2.根据角色取支付方式
        if rtnArr == []:
            NewObj = ss_eqroleconfigCtl.EQRCC()
            QueryParam = {
                'ss_eqrolecfg_code' :ClsHisOPObj.client_dict.get('ss_eqlistd_role'),
                'ss_eqrolecfg_cfgcode' : 'paymode'
            }
            NewObj.query(QueryParam)
            if NewObj.queryset:
                for tmpRSCObj in NewObj.queryset:
                    ALLQuerySet = tmpRSCObj
                    ss_eqrolecfg_actflg = getattr(ALLQuerySet,'ss_eqrolecfg_actflg') 
                    if ss_eqrolecfg_actflg == "Y":
                        rtnDic = {}
                        rtnDic['PayModeCode'] = getattr(ALLQuerySet,'ss_eqrolecfg_cfgvalue')
                        coninfo = ss_dicdataCtl.GetDicConByDicTypeCode('PayMode',rtnDic['PayModeCode'])
                        rtnDic['PayModeDesc'] = coninfo.get('ss_dic_desc')
                        rtnDic['PayModeId'] = coninfo.get('ss_dic_demo')
                        rtnArr.append(rtnDic)
        # 3.都没有的使用默认值  均显示
        if rtnArr == []:
            rtnArr = [{"PayModeCode":"JHZFYHK","PayModeDesc":"银行卡","PayModeId":"48"},{"PayModeCode":"WECHAT","PayModeDesc":"微信","PayModeId":"46"},{"PayModeCode":"AlIPAY","PayModeDesc":"支付宝","PayModeId":"47"}]
        print('rtnArr',rtnArr)
        return rtnArr
    except Exception as e:
        print("err",e)
        return rtnArr