from SelfServDB.models import patinfo as model
from django.forms.models import model_to_dict  
from django.db.models import F,Q
class PT:
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
    def update(self,UInput,QInput):
        try:
            tmpFilter = Q()
            if "id" in QInput:
                tmpFilter = tmpFilter & Q(id=QInput['id'])  #修改
            else:
                for tmpkey in QInput:
                    tmpFilter.add(Q(**{tmpkey: QInput[tmpkey]}), Q.AND)  #修改
            DicDataObj = model.objects.get(tmpFilter) #修改
            for key in UInput:
                if not hasattr(DicDataObj,key):
                    self.msg = key + "：字段不存在"
                    return
                setattr(DicDataObj,key,UInput[key]) 
            DicDataObj.save()
            self.msg="Success"
            self.result = DicDataObj.id
        except Exception as e:
            print("updateDataErr:" ,str(e))
            self.result = str(e)
            raise Exception("-1^更新患者医保类型失败")     
