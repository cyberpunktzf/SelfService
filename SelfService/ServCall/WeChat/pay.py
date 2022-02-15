import requests
from django.http import HttpResponse,JsonResponse
import hashlib
import random
import string
import json
import ast
#import xmltodict
from ServCall.WeChat.config import getConfig
from ServCall.WeChat import common
from SelfServPy.Common.LogCtl import SaveSYSLog

def Pay_NATIVE(inputReq):
    try:
        SaveSYSLog(inputReq)
        param = eval(inputReq.POST['input'])
        PayInput = str(common.buildWeChatParam(param,"NATIVE"))
        resp = requests.post( getConfig('wxURl'), PayInput.encode('utf-8'), headers={'Content-Type': 'text/xml'})
        rtn = BuildResult(resp)
        print("end")
        return HttpResponse(json.dumps(rtn,ensure_ascii=False),content_type="application/json,charset=utf-8") 	
    except Exception as e:
        SaveExeption(e)
def Pay_Scan(inputReq): #目前没有使用
    try:
        SaveSYSLog(inputReq)
        param = eval(inputReq.POST['input'])
        PayInput = str(common.buildWeChatParam(param,"SCAN"))
        resp = requests.post( getConfig('wxURl'), PayInput.encode('utf-8'), headers={'Content-Type': 'text/xml'})
        rtn = BuildResult(resp)
        print("end")
        return HttpResponse(json.dumps(rtn,ensure_ascii=False),content_type="application/json,charset=utf-8") 	
    except Exception as e:
        SaveExeption(e)
#JSAPI需要 NATIVE不需要
def getOpenID(req):
    SaveSYSLog(req)
    param = {
        'code':'code',
        'appid': 'wxb10f6bff81487fed',
        'secret': 'APPSECRET',
        'grant_type': 'authorization_code',
    }
    # 通过code获取access_token
    openIdUrl = 'https://api.weixin.qq.com/sns/oauth2/access_token'
    resp = requests.get(openIdUrl, params=param)
    # {openid, accss_token, refresh_token, openid, scope, expires_in}
    # openId = json.loads(resp.text)['openid']
    return resp.text
# 构造返回值
def BuildResult(resp):
    # SaveSYSLog(resp)
    # result = -1
    # xmlStr = resp.text.encode('ISO-8859-1').decode('utf-8')
    # Flag = xmltodict.parse(xmlStr)['xml']['return_code']

    # if Flag=="SUCCESS":
    #     result = 0
    #     rtn = {
    #         "url" : xmltodict.parse(xmlStr)['xml']['code_url']
    #     }
    # else:
    #     rtn = {
    #         "errorText" : xmltodict.parse(xmlStr)['xml']['return_msg']
    #     }

    outPutObj = {
      #  "result" : result,
      #  "msg" : rtn,
    }
    #outPutStr = json.dumps(outPutObj)
    return outPutObj

