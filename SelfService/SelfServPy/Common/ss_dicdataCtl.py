from SelfServDB.models import ss_dicdata as model
from django.forms.models import model_to_dict  
from django.db.models import F,Q
class DDC:
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
            rtn = model.objects.using('db2').filter(tmpFilter)
            self.queryset = rtn
        except Exception as e:
            print("queryDicDataErr:" ,str(e))
            self.result = str(e)
            ex = Exception(self)
            raise ex

    def delete(self,Input):
        try:
            print("delete",Input)
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
       
def GetDicConByDicTypeCode (dictype,diccode):
    try:
        tmpDict = {
            "ss_dic_concode":"",
            "ss_dic_condesc":""
        }
        tmpFilter = Q(ss_dic_type = dictype) & Q(ss_dic_code = diccode)
        rtn = model.objects.filter(tmpFilter)
        if rtn:
            ALLQuerySet = rtn[0]
            tmpDict = {
                "ss_dic_concode": getattr(ALLQuerySet,'ss_dic_concode') ,
                "ss_dic_condesc": getattr(ALLQuerySet,'ss_dic_condesc'),
                "ss_dic_condemo": getattr(ALLQuerySet,'ss_dic_condemo'),
                "ss_dic_demo": getattr(ALLQuerySet,'ss_dic_demo'),
                "ss_dic_desc":getattr(ALLQuerySet,'ss_dic_desc')
            }
        return tmpDict
    except Exception as e:
        print("queryDicDataErr:" ,str(e))
        return tmpDict

