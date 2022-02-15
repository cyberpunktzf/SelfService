from SelfServDB.models import business_master as model
from SelfServDB.models import business_details as bd
from SelfServDB.models import patinfo as PT
from django.forms.models import model_to_dict  
from django.db.models import F,Q
import datetime
class QB:
    def __init__(self):
        self.result = "-12"
        self.msg = "未知错误"
    def queryForLog1(self,Qparam):
        try:
            #print('Qparam',Qparam)
            #日期 
            tmpFilter = Q()
            if Qparam['business_date'] !="":
                tmpYear = Qparam['business_date'].split(' ')[0].split('-')[0]
                tmpmonth = Qparam['business_date'].split(' ')[0].split('-')[1]
                tmpday = Qparam['business_date'].split(' ')[0].split('-')[2]
                tmpFilter = tmpFilter & Q(business_date__year = tmpYear, business_date__month=tmpmonth, business_date__day=tmpday)
            #患者唯一号码
            hisPatNo = Qparam['hisPatNo']
            #print('hisPatNo',hisPatNo)
            if hisPatNo !="":
                    tmpQFilter = PT.objects.using('db2').filter(his_master_id = hisPatNo)
                    if tmpQFilter:
                        Qparam['id']=tmpQFilter[0].fk_businessmaster_id
            #操作员工号
            UserCode = Qparam['UserCode']
            if UserCode !="":
                tmpFilter = tmpFilter & Q(usercode = UserCode)
            for tmpkey in Qparam:
                if Qparam[tmpkey] =="":
                    continue
                if tmpkey == 'business_date' or tmpkey == 'hisPatNo' or tmpkey == 'IPAdd' or tmpkey == 'UserCode' or tmpkey == 'PlatNo' or tmpkey == 'terminal_info':
                    continue
                tmpFilter.add(Q(**{tmpkey: Qparam[tmpkey]}), Q.AND)
            rtn = model.objects.using('db2').filter(tmpFilter)
            self.queryset = rtn
        except Exception as e:
            print(e)
    def queryForLog(self,Qparam):
        try:
            print('queryForLog',Qparam)
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