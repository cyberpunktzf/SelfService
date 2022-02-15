import xmltodict
from SelfServPy.Common import business_masterCtl as BMCtl
from SelfServPy.Common import data_contrast_port_listCtl
from SelfServPy.ApplicationFrameWork import Tools
import json
import random
from urllib import parse
import datetime

# 该类需要手动编写，根据HIS接口要求的数据，从业务流水表中组织数据
class DC:
    # 初始化
    def QueryPortList(self,Input,ClsHisOPObj):
        DCPLCtl = data_contrast_port_listCtl.DCPLC()
        DCPLCtl.query()
        #组织参数 #HOSPID,TYPE,HITYPE,INFNO,INFNAME,CONTENTTYPE,SIGNTYPE,CHKFLAG,EFFTFLAG,URL,NODECODE,HISVER,CRTER,CRTEDATE,CRTETIME,UPDTID,UPDTDATE,UPDTTIME,ROWID,CLASSNAME,METHODNAME,OUTNODECODE
        #UserID = Input.get('UserID')

