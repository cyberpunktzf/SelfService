from SelfServDB.models import ss_extdetails as model
from django.forms.models import model_to_dict  
from django.db.models import F,Q
from SelfServPy.ApplicationFrameWork import Tools
class EXTC:
    def __init__(self):
        self.result = "-1"
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
            self.result = DicDataObj.id
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
            rtn = model.objects.using('db2').filter(tmpFilter).order_by('-id')
            self.queryset = rtn
        except Exception as e:
            print("queryDicDataErr:" ,str(e))
            self.result = str(e)
            ex = Exception(self)
            raise ex


    def delete(self,Input):
        try:
            #print("delete",Input)
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
def GetEXTSuccessInfo(ClsHisOPObj):
    UserOperationDic = Tools.GetUserOperation(ClsHisOPObj.serial_id,"paymode")
    SelfPayMode = UserOperationDic.get('PayModeCode') #自费支付方式
    Input ={
        "ss_extd_type":'Query',
        "ss_extd_no":ClsHisOPObj.serial_number
    }
    tmpDict = {
    }
    tmpFilter = Q(ss_extd_type = "Query") & Q(ss_extd_no = ClsHisOPObj.serial_number)
    rtn = model.objects.filter(tmpFilter).order_by('-id')
    if rtn:
        ALLQuerySet = rtn[0]
        tmpDict = Tools.modle_to_dict(ALLQuerySet)
    return tmpDict
