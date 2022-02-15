from SelfServDB.models import business_master as model
from django.forms.models import model_to_dict  
from django.db.models import F,Q
class BM:
    def __init__(self):
        self.result = "-12"
        self.msg = "未知错误"

    def insert(self,Input):
        try:
            print("__insert",Input)
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
            print("queryst",Qparam)
            tmpFilter = Q()
            for tmpkey in Qparam:
                tmpFilter.add(Q(**{tmpkey: Qparam[tmpkey]}), Q.AND)
            rtn = model.objects.filter(tmpFilter)
            self.queryset = rtn
        except Exception as e:
            print("queryDicDataErr:" ,str(e))
            self.result = str(e)

    def delete(self,Input):
        try:
            print("__insert",Input)
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
