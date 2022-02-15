from SelfServDB.models import ss_processconfig as model
from django.forms.models import model_to_dict  
from django.db.models import F,Q
class PCC:
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
    def GetDicDataByTypeCode(self,Input):
        try:
            ParamDicType = Input.get('ss_pc_dictype')
            ParamDicCode = Input.get('ss_pc_diccode')
            Paramprocesscode = Input.get('ss_pc_processcode')

            ParamSaveMode = Input.get('ss_pc_savemode')
            ParamSaveVal = Input.get('ss_pc_saveval')
            
            #print("GetDicDataByTypeCodeFun",ParamDicType,ParamDicCode)
            output = {
                "result" : "-1",
                "msg" : "无数据"
            }
            if Paramprocesscode == "":
                tmpFilter = Q(ss_pc_dictype = ParamDicType) & Q(ss_pc_diccode = ParamDicCode)
            elif ParamSaveMode and ParamSaveVal:
                tmpFilter = Q(ss_pc_dictype = ParamDicType) & Q(ss_pc_savemode = ParamSaveMode) & Q(ss_pc_saveval = ParamSaveVal)
            else:
                tmpFilter = Q(ss_pc_dictype = ParamDicType) & Q(ss_pc_processcode = Paramprocesscode)
            rtn = model.objects.filter(tmpFilter)
            self.queryset = rtn
        except Exception as e:
            print("GetDicDataByTypeCodeErr:" , str(e))
            rtn["msg"] = str(e)
            return rtn