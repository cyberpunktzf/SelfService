#web调用python服务
from django.http import HttpResponse,JsonResponse
from SelfServPy.Common.LogCtl import SaveSYSLog
from SelfServPy.Common import ss_processconfigCtl
from SelfServPy.ApplicationFrameWork import Tools
import json
import sys
import pathlib
def DoMethod(request):
    try:
        SaveSYSLog(request)
        rtn = {
            "result" : "-1", 
            "msg" : "调用方法不能为空"
        }
        #print("Domethod=",request.POST) 
        if 'TradeCode' in request.POST:
            TmpInput = request.POST.copy()
            TradeCode = TmpInput['TradeCode']
            ReturnType = TmpInput.get('ReturnType')
            if not ReturnType:
                ReturnType = ""
            if TradeCode == "GetDicDataDemoByTypeCode": #流程配置 表
                # 初始化字典对象
                DicDataObj = ss_processconfigCtl.PCC()
                # 组织入参 判断入参合法性
                #build_input(DicDataObj,TmpInput)
                # 调用接口
                rtn1 = eval(TradeCode)(DicDataObj ,TmpInput)
                # 构造返回值
                AQuerySet = DicDataObj.queryset
                rtn = Tools.BuildWebOutPut(AQuerySet,outputType=ReturnType)
            else:         
                _moduleName = TradeCode.split('^')[1]
                Operation = TradeCode.split('^')[0]
                ClassName = TradeCode.split('^')[2]
                del TmpInput['TradeCode']
                if ReturnType!="":
                    del TmpInput['ReturnType']
                if TmpInput.get('rows'):
                    del TmpInput['rows']
                if TmpInput.get('page'):
                    del TmpInput['page']
                #导入module
                lib = __import__('importlib')
                _module = lib.import_module(_moduleName)
                #实例化类
                NewObj = getattr(_module,ClassName)()
                #调用方法
                rtn1 = getattr(NewObj,Operation)(TmpInput)
                if hasattr(NewObj,'queryset'):
                    AQuerySet = getattr(NewObj,'queryset')
                    rtn = Tools.BuildWebOutPut(AQuerySet,outputType=ReturnType)
                else:    
                    OutPut = {'id':getattr(NewObj,'result')}
                    rtn = Tools.BuildWebOutPut(OutPut,outputType=ReturnType)    
            #print(rtn)
        #return HttpResponse(json.dumps(output,eGETnsure_ascii=False),content_type="application/json,charset=utf-8")
        return HttpResponse(json.dumps(rtn),content_type="application/json,charset=utf-8")
    except Exception as e:
        print("Error",e)
        return HttpResponse(json.dumps(str(e),ensure_ascii=False),content_type="application/json,charset=utf-8")
    finally:
        DicDataObj = ""
#1字典相关
#1.1 新增/更新字典
def InsertDicData(DicDataObj, Input):
    DicDataObj.Insert(Input)
#1.2删除字典
def DeleteDicData(DicDataObj, Input):
    DicDataObj.Delete(Input)
#1.3查询字典集
def QueryDicData(DicDataObj, Input):
    #print("QueryDicData",Input)
    DicDataObj.Query(Input)
#1.4查询单个具体字典
def GetDicDataDemoByTypeCode(DicDataObj, Input):
    #print("GetDicDataDemoByTypeCode:",Input)
    DicDataObj.GetDicDataByTypeCode(Input)
#2. 日志相关
#2.1 新增日志
#2.2 查询日志
#3. 设备列表
#3.1 新增/更新
def InsertELC(DicDataObj, Input):
    DicDataObj.Insert(Input)
#3.2删除
def DeleteELC(DicDataObj, Input):
    DicDataObj.Delete(Input)
#3.3查询
def QueryELC(DicDataObj, Input):
    #print("QueryDicData",Input)
    DicDataObj.Query(Input)
