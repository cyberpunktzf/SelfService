# 通用工具类
from django.core import serializers
from SelfServPy.Common import business_detailsCtl as BDCtl
from SelfServPy.Common import business_masterCtl as BMCtl
import json
import time
import datetime
#  QuerySet 转换为Web前端返回值
#   ModalQS QuerySet 
#   OutPutType : 返回值output的类型  缺省：JSON
# return: {result:0,msg:"错误信息",output:"返回值",outputType:"JSON/XML"}
def BuildWebOutPut(ModalQS,**kw):
    try:
        AllList = ""
        #print("BuildWebIPut",type(ModalQS))
        if isinstance(ModalQS,dict):
            AllList = ModalQS
        elif isinstance(ModalQS,str):
            AllList = ModalQS
        elif isinstance(ModalQS,list):
            AllList = ModalQS
        elif isinstance(ModalQS,bytes):
            AllList = ModalQS
        else:
            dataList = serializers.serialize("json", ModalQS) 
            dataJson = json.loads(dataList)
            AllList = []
            for SData in dataJson:
                tmpId = str(SData['pk'])
                tmpField = SData['fields']
                tmpField['id'] = tmpId
                tmpFieldStr = json.dumps(tmpField)
                if kw.get('outputType'):
                    if kw.get('outputType') == "ArraySet":
                        tmpFieldStr = tmpField
                AllList.append(tmpFieldStr)
        rtnObj = {
            'result' : kw.get('result') if kw.get('result') else "0",
            'msg': kw.get('msg') if kw.get('result') else "成功",
            'output' : AllList,
            "outputType" : kw.get('outputType') if kw.get('result') else "JSON"
        }
        if kw.get('outputType'):
            if kw.get('outputType') == "ArraySet":
                rtnObj = {'rows':AllList,'total':'1000'} #{rows:[],total:1}
            elif kw.get('outputType') == "JsonArray":
                rtnObj = AllList #{rows:[],total:1}
        #print("BuildWebOutPut",rtnObj)
        return rtnObj
    except Exception as e:
        rtnObj = {
            'result' : '-SS999',
            'msg': AllList,
            'output' : AllList,
            "outputType" : "JSON"
        }
        return rtnObj
def GetXMLNode(xmlStr,Node):
    try:
        if xmlStr=="":
            return ""
        else:
            #<a>
            splitStr = "</" + Node  +  ">"
            xmlstr1 = xmlStr.split(splitStr)[0]
            splitStr = "<" + Node  +  ">"
            rtn = xmlstr1.split(splitStr)[1]
            return rtn
    except Exception as e:
        return ""

# a=1&b=2&c=3
def StrToDic(Str,SplitStr = "&",ValSplit = "="):
    tmpList = Str.split(SplitStr)  
    #[a=1,b=2,c=3]
    OutPutDic = {}
    for key in tmpList:
        if key=="" or key == "undefined":
            continue
        # a=1
        tmpKey = key.split(ValSplit)[0]
        tmpVal = key.split(ValSplit)[1]
        OutPutDic[tmpKey] = tmpVal
    return OutPutDic

# 获取指定界面流程用户操作的数据
#output 
def GetUserOperation(fk_businessmaster_id,modal_code = "",intef_code = "6666",OutPutType = "JSON"):
    if fk_businessmaster_id =="":
        return ""
    GlobalUserOperation = {}
    # 2.4 用户操作信息
    BDObj = BDCtl.BD()
    queryParam = {'fk_businessmaster_id':int(fk_businessmaster_id),"modal_code":modal_code,'intef_code':intef_code} 
    BDObj.query(queryParam)
    if BDObj.queryset:
        ALLQuerySet = BDObj.queryset[0]
        his_patinfo = getattr(ALLQuerySet,'intef_input')     
        if OutPutType == "JSON":
            GlobalUserOperation = StrToDic(his_patinfo) 
        else:
           GlobalUserOperation = his_patinfo
    return GlobalUserOperation
def GeBDOutPut(fk_businessmaster_id,modal_code = "",intef_code = "6666"):
    if fk_businessmaster_id =="":
        return ""
    his_patinfo = ""
    # 2.4 用户操作信息
    BDObj = BDCtl.BD()
    if modal_code == "" :
        queryParam = {'fk_businessmaster_id':int(fk_businessmaster_id),'intef_code':intef_code}   
    else:
        queryParam = {'fk_businessmaster_id':int(fk_businessmaster_id),"modal_code":modal_code,'intef_code':intef_code}   
    BDObj.query(queryParam)
    if BDObj.queryset:
        ALLQuerySet = BDObj.queryset[0]
        his_patinfo = getattr(ALLQuerySet,'intef_output')                              
    return his_patinfo

def GeBDAll(fk_businessmaster_id,modal_code = "",intef_code = "6666"):
    if fk_businessmaster_id =="":
        return ""
    his_patinfo = ""
    # 2.4 用户操作信息
    BDObj = BDCtl.BD()
    if modal_code == "" :
        queryParam = {'fk_businessmaster_id':int(fk_businessmaster_id),'intef_code':intef_code}   
    else:
        queryParam = {'fk_businessmaster_id':int(fk_businessmaster_id),"modal_code":modal_code,'intef_code':intef_code}   
    BDObj.query(queryParam)
    if BDObj.queryset:
        ALLQuerySet = BDObj.queryset[0]
        his_patinfo = modle_to_dict(ALLQuerySet)
    return his_patinfo

def getDefStDate(DayNum,formatterType = "YMD"):
    timespan = time.time()
    timeNum = DayNum * 24 * 60 * 60
    timespan = int(timespan) + int(timeNum)
    timeList = time.localtime(timespan)
    if formatterType== "YMD":
        timeRtn = str(timeList[0]) + "-" + str(timeList[1]) + '-' + str(timeList[2])
    elif formatterType == "Y/M/DD:M:S":
        timeStr = time.strftime("%Y-%m-%d %H:%M:%S",timeList) 
        timeDateArr = timeStr.split(' ')[0].split('-')
        timeTimeArr = timeStr.split(' ')[1].split(':')
        timeRtn = str(timeDateArr[0]) + "/" + str(timeDateArr[1]) + '/' + str(timeDateArr[2]) + " " + str(timeTimeArr[0]) + "/" + str(timeTimeArr[1]) + '/' + str(timeTimeArr[2])
    elif formatterType == "0": #原始值，用来判断大小
        timeRtn = timeList

    return timeRtn
def modle_to_dict(model_obj):
    rtn = {}
    for key in model_obj.__dict__:
        if key !="_state":
            val = getattr(model_obj,key)
            if isinstance(val,datetime.datetime):
                val = val.strftime('%Y-%m-%d %H:%M:%S')
            elif not val:
                val = ""
            rtn[key] = val
    return rtn
def getBMIDByBMNO(BMNO):
    try:
        BMID = ""
        if BMNO =="":
            return ""
        BDObj = BMCtl.BM()
        queryParam = {
            'serial_number':BMNO
        }   
        BDObj.query(queryParam)
        if BDObj.queryset:
            ALLQuerySet = BDObj.queryset[0]
            BMID = getattr(ALLQuerySet,'id')  
        return BMID
    except:
        return ""
def formatterAmt(val,keeplen=""):
    try:
        order_amt = round(float(val),2)
        return order_amt
    except Exception as e:
        return val
