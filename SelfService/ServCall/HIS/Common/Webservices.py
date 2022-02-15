#encoding = gbk
import urllib.request
from xml.dom.minidom import parseString
import sys
from urllib import parse
import http.cookiejar,urllib.request
from suds.client import Client
from suds.wsse import Security
from suds.wsse import UsernameToken
from xml.etree import ElementTree as ET
import requests
from SelfServPy.Common import ss_dicdataCtl
#from suds.client import UsernameToken
#import Security
#import httplib
'''
def CallHISWS123(ParInput):  
    try:
        ParInput = parse.quote(ParInput)
        #page = urllib.request.urlopen("http://www.webxml.com.cn/WebServices/WeatherWebService.asmx/getWeatherbyCityName?theCityName=58367")

        #page = urllib.request.urlopen("http://10.3.200.13:57772/imedical/web/Webservice.BILLSelfPay.CLS?&CacheUserName=_system&CachePassword=sys&CacheNoRedirect=1&soap_method=DHCSelfPay&Input=" + ParInput)
        #page = urllib.request.urlopen("http://81.70.252.237:57772/imedical/web/Webservice.BILLSelfPay.CLS?&CacheUserName=_system&CachePassword=sys&CacheNoRedirect=1&soap_method=DHCSelfPay&Input=" + ParInput)
        #page = urllib.request.urlopen("http://81.70.185.88:57772/imedical/web/Webservice.BILLSelfPay.CLS?&CacheUserName=_system&CachePassword=SYS&CacheNoRedirect=1&soap_method=DHCSelfPay&Input=" + ParInput)
        #page = urllib.request.urlopen("http://81.70.252.237/imedical/web/Webservice.BILLSelfPay.CLS?&CacheUserName=_system&CachePassword=sys&CacheNoRedirect=1&soap_method=DHCSelfPay&Input=" + ParInput)
        page = urllib.request.urlopen("http://10.80.2.1:57772/imedical/web/Webservice.BILLSelfPay.CLS?&CacheUserName=dhact&CachePassword=dhact&CacheNoRedirect=1&soap_method=DHCSelfPay&Input=" + ParInput)
        
        lines = page.readlines()
        print('lines', lines)
        page.close()
        document = ""
        for line in lines :
            document = document + line.decode('utf-8')
        body1 = document.split('<![CDATA[')[1]
        content = body1.split(']]></DHCSelfPayResult>')[0]
        print("xmlOut:",content)
    except:
        print("Unexpected error:", sys.exc_info()[0])
    return content

'''
#在用
def CallHISWS(ParInput):  

    #ParInput = parse.quote(ParInput)
    #page = urllib.request.urlopen("http://www.webxml.com.cn/WebServices/WeatherWebService.asmx/getWeatherbyCityName?theCityName=58367")

    #page = urllib.request.urlopen("http://10.3.200.13:57772/imedical/web/Webservice.BILLSelfPay.CLS?&CacheUserName=_system&CachePassword=sys&CacheNoRedirect=1&soap_method=DHCSelfPay&Input=" + ParInput)
    #page = urllib.request.urlopen("http://81.70.252.237:57772/imedical/web/Webservice.BILLSelfPay.CLS?&CacheUserName=_system&CachePassword=sys&CacheNoRedirect=1&soap_method=DHCSelfPay&Input=" + ParInput)
    #page = urllib.request.urlopen("http://81.70.185.88:57772/imedical/web/Webservice.BILLSelfPay.CLS?&CacheUserName=_system&CachePassword=SYS&CacheNoRedirect=1&soap_method=DHCSelfPay&Input=" + ParInput)
    #page = urllib.request.urlopen("http://81.70.252.237/imedical/web/Webservice.BILLSelfPay.CLS?&CacheUserName=_system&CachePassword=sys&CacheNoRedirect=1&soap_method=DHCSelfPay&Input=" + ParInput)
    #page = urllib.request.urlopen("http://10.3.201.13:57772/imedical/web/Webservice.BILLSelfPay.CLS?&CacheUserName=_system&CachePassword=SYS&CacheNoRedirect=1&soap_method=DHCSelfPay&Input=" + ParInput)
    NewObj = ss_dicdataCtl.DDC()
    QueryParam = {
        'ss_dic_type' : 'HISInterfaceInfo'
    }
    NewObj.query(QueryParam)
    for tmpRSCObj in NewObj.queryset:
        ALLQuerySet = tmpRSCObj
        ss_dic_code = getattr(ALLQuerySet,'ss_dic_code')
        if ss_dic_code == "url":
            url = getattr(ALLQuerySet,'ss_dic_demo')
        if ss_dic_code == "username":
            username = getattr(ALLQuerySet,'ss_dic_demo')
        if ss_dic_code == "password":
            password = getattr(ALLQuerySet,'ss_dic_demo') 
    token = UsernameToken(username,password)
    security = Security()
    security.tokens.append(token)
    #url = "http://10.80.3.10/imedical/web/Webservice.BILLSelfPay.CLS?WSDL=1&CacheUserName=dhwebservice&CachePassword=dhwebservice&CacheNoRedirect=1"
    #url = "http://10.80.2.1/imedical/web/Webservice.BILLSelfPay.CLS?WSDL=1&CacheUserName=dhact&CachePassword=dhact&CacheNoRedirect=1"
    client = Client(url)

    client.set_options(wsse=security)
    content = client.service.DHCSelfPay(ParInput)
    return content
#暂时不用  
def CallHISWS2(ParInput):  
    try:
        ParInput = parse.quote(ParInput)
        #page = urllib.request.urlopen("http://www.webxml.com.cn/WebServices/WeatherWebService.asmx/getWeatherbyCityName?theCityName=58367")

        #page = urllib.request.urlopen("http://10.3.200.13:57772/imedical/web/Webservice.BILLSelfPay.CLS?&CacheUserName=_system&CachePassword=sys&CacheNoRedirect=1&soap_method=DHCSelfPay&Input=" + ParInput)
        #page = urllib.request.urlopen("http://81.70.252.237:57772/imedical/web/Webservice.BILLSelfPay.CLS?&CacheUserName=_system&CachePassword=sys&CacheNoRedirect=1&soap_method=DHCSelfPay&Input=" + ParInput)
        #page = urllib.request.urlopen("http://81.70.185.88:57772/imedical/web/Webservice.BILLSelfPay.CLS?&CacheUserName=_system&CachePassword=SYS&CacheNoRedirect=1&soap_method=DHCSelfPay&Input=" + ParInput)
        #page = urllib.request.urlopen("http://81.70.252.237/imedical/web/Webservice.BILLSelfPay.CLS?&CacheUserName=_system&CachePassword=sys&CacheNoRedirect=1&soap_method=DHCSelfPay&Input=" + ParInput)

        body = '''
     <?xml version="1.0" encoding="UTF-8" ?>
    <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tem="http://tempuri.org">
   <soapenv:Header>
        <wsse:Security soapenv:mustUnderstand="1" xmlns:wsse="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd" xmlns:wsu="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd">
            <wsse:UsernameToken wsu:Id="UsernameToken-F428AE9B3BBD72E95D162738966271636">
                <wsse:Username>_system</wsse:Username>
                <wsse:Password Type="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-username-token-profile-1.0#PasswordText">SYS</wsse:Password>
                <wsse:Nonce EncodingType="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-soap-message-security-1.0#Base64Binary">E6/6iWt+wzpT3HDJhrEPqq</wsse:Nonce>
                <wsu:Created>2021-07-27T12:41:02.715Z</wsu:Created>
            </wsse:UsernameToken>
        </wsse:Security>
   </soapenv:Header>
   <soapenv:Body>
    <tem:DHCSelfPay>
   <!--Optional:-->
   <tem:Input>aaaaaaaaaaaaaaa</tem:Input>
    </tem:DHCSelfPay>
    </soapenv:Body>
    </soapenv:Envelope>"
        '''
        headers = {
            'content-Type' : 'text/xml;charset=utf-8',
            'Host': '10.3.201.13:57772',
            'SOAPAction': 'http://tempuri.org/Webservice.BILLSelfPay.DHCSelfPay',
            'Accept-Encoding': 'gzip,deflate',
            'Content-Length': str(len(body))
        }
        #url = "http://10.3.201.13:57772/imedical/web/Webservice.BILLSelfPay.CLS?WSDL=1&CacheUserName=_system&CachePassword=SYS&CacheNoRedirect=1"
        url = "http://10.3.201.13:57772/imedical/web/Webservice.BILLSelfPay.cls"
        rq = requests.request('POST',url=url,data=body.encode('utf-8'),headers = headers)
        #page = urllib.request.urlopen(rq)
        #print("aaaaaa",rq.content)
        #print("bbbbb",qwes)
        return
        lines = page.readlines()
        #print('lines', lines)
        page.close()
        document = ""
        for line in lines :
            document = document + line.decode('utf-8')
        body1 = document.split('<![CDATA[')[1]
        content = body1.split(']]></DHCSelfPayResult>')[0]
        #print("xmlOut:",content)
    except Exception as e:
        print("Unexpected error:", str(e))
    return content
#暂时不用
def CallHISInterface(ParInput):  
    #page = urllib.request.urlopen("http://www.webxml.com.cn/WebServices/WeatherWebService.asmx/getWeatherbyCityName?theCityName=58367")
    ParInput = parse.quote(ParInput)
    page = urllib.request.urlopen("http://81.70.185.88:57772/imedical/web/Webservice.BILLSelfPay.CLS?&CacheUserName=_system&CachePassword=SYS&CacheNoRedirect=1&soap_method=DHCSelfPay&Input=" + ParInput)
    lines = page.readlines()
    page.close()
    document = ""
    for line in lines :
        document = document + line.decode('utf-8')
    body1 = document.split('<![CDATA[')[1]
    content = body1.split(']]></DHCSelfPayResult>')[0]
    #print("xmlOut:",content)
    return content
#在用
def CallHISDocInfo(DoctorCode):  
    try:
        #ParInput = parse.quote(ParInput)
        #page = urllib.request.urlopen("http://www.webxml.com.cn/WebServices/WeatherWebService.asmx/getWeatherbyCityName?theCityName=58367")

        #page = urllib.request.urlopen("http://10.3.200.13:57772/imedical/web/Webservice.BILLSelfPay.CLS?&CacheUserName=_system&CachePassword=sys&CacheNoRedirect=1&soap_method=DHCSelfPay&Input=" + ParInput)
        #page = urllib.request.urlopen("http://81.70.252.237:57772/imedical/web/Webservice.BILLSelfPay.CLS?&CacheUserName=_system&CachePassword=sys&CacheNoRedirect=1&soap_method=DHCSelfPay&Input=" + ParInput)
        #page = urllib.request.urlopen("http://81.70.185.88:57772/imedical/web/Webservice.BILLSelfPay.CLS?&CacheUserName=_system&CachePassword=SYS&CacheNoRedirect=1&soap_method=DHCSelfPay&Input=" + ParInput)
        #page = urllib.request.urlopen("http://81.70.252.237/imedical/web/Webservice.BILLSelfPay.CLS?&CacheUserName=_system&CachePassword=sys&CacheNoRedirect=1&soap_method=DHCSelfPay&Input=" + ParInput)
        #page = urllib.request.urlopen("http://10.3.201.13:57772/imedical/web/Webservice.BILLSelfPay.CLS?&CacheUserName=_system&CachePassword=SYS&CacheNoRedirect=1&soap_method=DHCSelfPay&Input=" + ParInput)
        token = UsernameToken("dhwebservice","dhwebservice")
        security = Security()
        security.tokens.append(token)
        #url = "http://10.80.7.10/imedical/web/Webservice.BILLSelfPay.CLS?WSDL=1&CacheUserName=dhact&CachePassword=dhact&CacheNoRedirect=1"
        url = "http://10.81.1.40:8888/ws/doctorInfo?wsdl"
        client = Client(url)
        client.set_options(wsse=security)
        client.set_options(timeout=1)
        content = client.service.getDoctorInfo(DoctorCode)
        return content
    except Exception:
        return "-1"
