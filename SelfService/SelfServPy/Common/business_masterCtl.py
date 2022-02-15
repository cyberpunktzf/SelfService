from SelfServDB.models import business_master as model
from django.forms.models import model_to_dict  
from django.db.models import F,Q
import datetime
class BM:
    def __init__(self):
        self.result = "-12"
        self.msg = "未知错误"

    def insert(self,Input):
        try:
            #print("__insert",Input)
            if "id" in Input:
                DicDataObj = model.objects.get(id=Input['id']) #修改
            else:
                DicDataObj = model() #新增
            for key in Input:
                if not hasattr(DicDataObj,key):
                    self.msg = key + "：字段不存在"
                    return
                setattr(DicDataObj,key,Input[key]) 
            DicDataObj.save()
            self.msg="Success"
            self.result= DicDataObj.id
        except Exception as e:
            print("inserDicDataErr:" ,str(e))
            self.result = str(e)

    def query(self,Qparam):
        try:
            tmpFilter = Q()
            for tmpkey in Qparam:
                if Qparam[tmpkey] =="":
                    continue
                tmpFilter.add(Q(**{tmpkey: Qparam[tmpkey]}), Q.AND)  
            rtn = model.objects.using('db2').filter(tmpFilter)
            self.queryset = rtn
        except Exception as e:
            print("queryDicDataErr:" ,str(e))
            self.result = str(e)
            ex = Exception(self)
            raise ex

    def delete(self,Input):
        try:
            #print("__insert",Input)
            if "id" in Input:
                DicDataObj = model.objects.get(id=Input['id']) #修改
                DicDataObj.delete()
            else:
                self.msg = "字段[id]不能为空" 
            self.msg="Success"
            self.result="0"
        except Exception as e:
            print("deleteDicDataErr:" ,str(e))
            self.result = str(e)
    def queryForLog(self,Qparam):
        try:
            #print('Qparam',Qparam)
            tmpFilter = Q()
            for tmpkey in Qparam:
                if Qparam[tmpkey] =="":
                    continue
                if tmpkey == 'business_date':
                    continue
                tmpFilter.add(Q(**{tmpkey: Qparam[tmpkey]}), Q.AND)
            #print('Qparam[business_date]',Qparam['business_date'])  
            if Qparam['business_date'] !="":
                tmpYear = Qparam['business_date'].split(' ')[0].split('-')[0]
                tmpmonth = Qparam['business_date'].split(' ')[0].split('-')[1]
                tmpday = Qparam['business_date'].split(' ')[0].split('-')[2]
                rtn = model.objects.using('db2').filter(tmpFilter).filter(business_date__year = tmpYear, business_date__month=tmpmonth, business_date__day=tmpday)
            else:
                rtn = model.objects.using('db2').filter(tmpFilter)
            self.queryset = rtn
        except Exception as e:
            print("queryDicDataErr:" ,str(e))
            self.result = str(e)
            ex = Exception(self)
            raise ex