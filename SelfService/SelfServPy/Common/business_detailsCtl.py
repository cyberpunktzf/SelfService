from SelfServDB.models import business_details as model
from django.forms.models import model_to_dict  
from django.db.models import F,Q
import json
import random
from SelfServPy.ApplicationFrameWork import Tools
class BD:
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
    # 通过前端参数保存业务流水表
    def saveByWeb(self,Input):
        try:
            #print("saveByWeb",Input)
            # 1.取基础参数
            fk_businessmaster_id = Input.get('serial_id')
            serial_number = Input.get('serial_number')
            #HIS业务流水号
            his_serial_number = Input.get('his_serial_number')
            # modal_code
            modal_code = Input.get('modal_code')
            # model_desc 
            model_desc = Input.get('model_desc')
            # intef_code 
            intef_code = Input.get('TradeCode')
            # 接口描述
            intef_desc = Input.get('intef_desc')
            # intef_input 
            intef_input = Input.get('intef_input')
            # intef_output
            intef_output = Input.get('intef_output')
            # serial_number
            #RandomStr="qwertyuiopasdfghjklzxcvbnm0123456789"
            #serial_numberList = random.sample(RandomStr,10)
            DateTimeStamp1 = Tools.getDefStDate(0,formatterType="Y/M/DD:M:S")
            DateTimeStamp = DateTimeStamp1.replace('/','')
            serial_number = str(fk_businessmaster_id) + modal_code + intef_code + DateTimeStamp
            serial_number = serial_number.replace(' ','')
            tempTime = DateTimeStamp1.split(' ')[1]
            tempTime = tempTime.replace('/',':')
            tmpInserDT = DateTimeStamp1.split(' ')[0] + ' ' + tempTime
            tmpInserDT = DateTimeStamp1.split(' ')[0].replace('/','-') + ' ' + tempTime
            if  Input.get('id'):
                TmpId = Input.get('id')
                #InsertDic = {'business_update':tmpInserDT,'id':TmpId,'fk_businessmaster_id':fk_businessmaster_id,'serial_number':serial_number,'his_serial_number':his_serial_number,'modal_code':modal_code,'model_desc':model_desc,'intef_code':intef_code,'intef_desc':intef_desc,'intef_input':intef_input,'intef_output':intef_output}
                InsertDic = {'business_update':tmpInserDT,'id':TmpId,'intef_output':intef_output}
            else:
                InsertDic = {'business_update':tmpInserDT,'fk_businessmaster_id':fk_businessmaster_id,'serial_number':serial_number,'his_serial_number':his_serial_number,'modal_code':modal_code,'model_desc':model_desc,'intef_code':intef_code,'intef_desc':intef_desc,'intef_input':intef_input,'intef_output':intef_output}
            self.insert(InsertDic)
        except Exception as e:
            print("saveByWeb:" ,str(e))
            self.result = str(e)
            ex = Exception(self)
            raise ex