from django.http import HttpResponse,JsonResponse
from SelfServPy.Common.LogCtl import SaveSYSLog
from django.core import serializers 
from ServCall.HIS.Common.Webservices import CallHISWS
from SelfServPy import HISOperation
import sys
import json
from django.http import FileResponse
import ctypes

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