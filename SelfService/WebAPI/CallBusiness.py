from django.http import HttpResponse,JsonResponse
from SelfServPy.Common.LogCtl import SaveSYSLog
from django.core import serializers 
from ServCall.HIS.Common.Webservices import CallHISWS
from SelfServPy import HISOperation
import sys
import json

def CallPython(request):
    try:
        #SaveSYSLog(request)
        output = {
            "result" : "-1", 
            "msg" : "调用方法不能为空"
        }
        TmpInput = request.POST['Input'] #  接口代码 3301
        SaveSYSLog(TmpInput)
        rtn = CallHISWS(TmpInput)
        output = json.dumps(rtn,ensure_ascii=False)
        SaveSYSLog(output)
        #return HttpResponse(json.dumps(output,eGETnsure_ascii=False),content_type="application/json,charset=utf-8")
        return HttpResponse(output,content_type="application/json,charset=utf-8")
    except Exception as e :
        output["result"] = -1
        output["msg"] ='异常' + str(e)
        print("异常",e)
        return HttpResponse(json.dumps(output,ensure_ascii=False),content_type="application/json,charset=utf-8")
    finally:
        #print(1)
        pass
 #  在用
def CallPythonService(request):
    try:
        #SaveSYSLog(request)
        output = {
            "result" : "-1", 
            "msg" : "调用方法不能为空"
        }
        TmpInput = request.POST #request.POST['Input'] #  接口代码 3301
        #print('参数',TmpInput)
        # 调用HIS接口
        rtnObj = HISOperation.DO(request)
        if "GetDoctorPicture" in TmpInput:
            output =   json.dumps(rtnObj,ensure_ascii=False)
        else:
            output = json.dumps(rtnObj,ensure_ascii=False)
        return HttpResponse(output,content_type="application/json,charset=utf-8")
    except Exception as e  :
        output["result"] = -1
        output["msg"] ='异常' + str(e)
        print("异常",e)
        return HttpResponse(json.dumps(output,ensure_ascii=False),content_type="application/json,charset=utf-8")
    finally:
        #print(1)
        pass