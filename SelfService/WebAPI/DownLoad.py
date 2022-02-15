from django.shortcuts import render
from django.http import HttpResponse,JsonResponse
from SelfServPy.Common.LogCtl import SaveSYSLog
from django.core import serializers 
from ServCall.HIS.Common.Webservices import CallHISWS
from SelfServPy import HISOperation
import sys
import json
from django.http import FileResponse
import os
def DownLoad(request):
    try:
        file = request.GET['file'] #  接口代码 3301
        #insuupdate.zip
        if file:
            tmpfile = open('download/' + file,'rb')
        else:
            tmpfile = open('download/DLL.rar','rb')
        response1 = FileResponse(tmpfile)
        response1['Content-Type'] = 'application/octet-stream'
        response1['Content-Dispositon'] = 'attachment;'
        return response1
    except Exception as e :
        print("异常",e)
def FileList(request):
    try:
        Input = request.GET
        if Input:
            TradeType = Input.get('TradeType')
            if TradeType:
                jsonObj = {}
                for home,dirs,files in os.walk(os.getcwd() + '\download'):
                    for filename in files:
                        jsonObj[filename]=""
                return HttpResponse(json.dumps(jsonObj),content_type="application/json,charset=utf-8")
        return render(request, r"pages/common/download.html")
    except Exception as e :
        print("异常",e)
