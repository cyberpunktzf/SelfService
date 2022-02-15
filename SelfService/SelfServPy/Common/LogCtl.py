
import sys
import json
from django.http import HttpResponse,JsonResponse
from SelfServDB.models import Log
from django.db.models import F,Q
from urllib import parse
def __insert(input):
    try:
        logObj = Log()
        for key in input:
            setattr(logObj,key,input[key]) 
        logObj.save()    
    except Exception as e:
        print("__insert:" , str(e),input)
        pass
def __QueryLog__(Qparam):
    try:
        tmpFilter = Q()
        for tmpkey in Qparam:
            tmpFilter.add(Q(**{tmpkey: Qparam[tmpkey]}), Q.OR)
        rtn = Log.objects.filter(tmpFilter)
        return rtn   
    except Exception as e:
        print("__QueryLog__:" , str(e),Qparam)
        pass

def Log(inputParam): 
    rtn=json.dumps({"msg":"","code":"200","data":[[]],"count":"0"})
    print(rtn)
    return HttpResponse(rtn,content_type="text/json,charset=utf-8")
def SaveSYSLog(inputParam):
    try:
        #print(inputParam)
        return
        ipaddress = ""
        if hasattr(inputParam, "META"):
            if 'HTTP_X_FORWARDED_FOR' in inputParam.META:
                ipaddress = inputParam.META['HTTP_X_FORWARDED_FOR']
            else:
                ipaddress = inputParam.META['REMOTE_ADDR']
        inputParam = str(inputParam)
        inputParam = parse.unquote(inputParam)
        input ={
            "MsgInfo" : '"' + inputParam + '"',
            "Business" :  sys._getframe().f_back.f_code.co_name,
            "IP" : ipaddress
        }
        __insert(input)
    except Exception as e:
        print("SaveSYSLog",str(e))
    
def SaveExeption(input):
    input ={
        "MsgInfo" : str(input),
        "Business" :  sys._getframe().f_back.f_code.co_name,
        "Product" : "Exception"
    }
    __insert(input)
def __buildInput():
    return
def QueryLog(request):
    #SaveSYSLog(request.GET)
    #print(request.post)InputParam
    InputParam={}
    InputParam['Business'] = request.GET["Business"]
    rtn = __QueryLog__(InputParam)
    TempList = {}
    if rtn.exists():
        i = 0
        for tmpQuerySet in rtn:
            TempOutput = {}
            for key in tmpQuerySet.__dict__:
                if(key!="_state"):
                    TempOutput[key] = str(tmpQuerySet.__dict__[key]).replace("None","")
            TempList[i] = TempOutput   
            i = i + 1        
    output = {
        "result" : "0",
        "msg" : {"output":TempList}
    }
    return HttpResponse(json.dumps(output,ensure_ascii=False),content_type="application/json,charset=utf-8")
    def query(self,Qparam):
        try:
            tmpFilter = Q()
            for tmpkey in Qparam:
                if Qparam[tmpkey] =="":
                    continue
                tmpFilter.add(Q(**{tmpkey: Qparam[tmpkey]}), Q.AND)  
            rtn = model.objects.filter(tmpFilter)
            self.queryset = rtn
        except Exception as e:
            print("queryDicDataErr:" ,str(e))
            self.result = str(e)
            ex = Exception(self)
            raise ex
