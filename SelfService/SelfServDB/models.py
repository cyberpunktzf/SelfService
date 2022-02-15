# -*- coding: utf-8 -*-
from django.db import models
import django.utils.timezone as timezone
# Create your models here. 必须是models 文件里
class ss_processconfig(models.Model):
    objects = models.Manager()
    # 创建如下几个表的字段
    #  primary_key=True: 该字段为主键
    id = models.AutoField('RowId',null=False, primary_key=True,unique=True,db_index=True)

    ss_pc_dictype = models.CharField('类型', max_length=50,null=True,db_index=True)
    # 字符串 业务判断根据该字段 不唯一
    ss_pc_diccode = models.CharField('代码' ,max_length=50,null=True,db_index=True)
    # 字符串
    ss_pc_dicdesc = models.CharField('描述' ,max_length=50,null=True)
    # 字符串
    ss_pc_demo = models.CharField('值',max_length=2000,null=True)
    # 创建日期
    ss_pc_createdate = models.DateTimeField(auto_now_add=True,null=True)
    # 创建人
    ss_pc_creator = models.CharField('创建人', max_length=50,null=True)
    # 修改日期
    ss_pc_update = models.DateTimeField(auto_now_add=True,null=True)
    # 修改人
    ss_pc_upuser = models.CharField('修改人', max_length=10,null=True)
    # 流程代码 取流程时根据该字段 唯一 必须唯一
    ss_pc_processcode = models.CharField('流程代码',max_length=50,null=True,db_index=True)

    class Meta:
       db_table = 'ss_processconfig'
class Log(models.Model):
    objects = models.Manager()
    #创建如下几个表的字段
    #  primary_key=True: 该字段为主键
    id = models.AutoField('RowId',null=False, primary_key=True,unique=True)
    #  字符串 最大长度20
    UserCode = models.CharField('用户代码', max_length=50,null=True)
    #  字符串
    UserName = models.CharField('用户名', null=True, max_length=50)
    #  字符串
    IP = models.CharField('IP地址', max_length=20,null=True)
    #  u字符串
    Mac = models.CharField('MAC地址', max_length=20,null=True)
    # 创建时间 auto_now_add：只有在新增的时候才会生效
    CreateDateTime = models.DateTimeField(auto_now_add=True)
    # 修改时间 auto_now： 添加和修改都会改变时间
    ModifyDateTime = models.DateTimeField(auto_now=True)
    #  字符串 最大长度20
    Business = models.CharField('业务', max_length=50,null=True)
    #  字符串
    Product = models.CharField('产品', max_length=50,null=True)
    #  字符串
    ClientName = models.CharField('客户端产品',max_length=50,null=True)
    #  
    MsgInfo = models.CharField('内容', max_length=5000,null=True)
    # 指定表名 不指定默认APP名字——类名(app_demo_Student)
    class Meta:
       db_table = 'SelfService_Log'
class business_master(models.Model):
    objects = models.Manager()
    #创建如下几个表的字段
    #  primary_key=True: 该字段为主键
    id = models.AutoField('RowId',null=False, primary_key=True,unique=True,db_index=True)
    # 业务流水号
    serial_number = models.CharField('业务流水号', max_length=50,null=True,db_index=True)
    # 业务代码
    code = models.CharField('业务代码', max_length=50,null=True,db_index=True)
    # 业务描述
    desc = models.CharField('业务描述', max_length=50,null=True)
    # 业务日期
    business_date = models.DateTimeField(auto_now_add=True,db_index=True)
    # 终端信息 终端号,IP地址，MAC地址，院区，操作员，安全组
    terminal_info = models.CharField('终端信息', max_length=2000,null=True)
    # 业务代码
    processcode = models.CharField('流程代码', max_length=50,null=True,db_index=True)
    # 操作员代码
    usercode = models.CharField('操作员代码', max_length=20,null=True,db_index=True)
    # 业务状态 成功1，失败-1,交易中0（默认是0） status
    business_status = models.CharField('业务状态', max_length=10,null=True,db_index=True)
    # HIS业务唯一号
    his_invid = models.CharField('HIS业务唯一号', max_length=50,null=True,db_index=True)
    # HIS业务唯一号
    old_bm_id = models.CharField('原业务表id', max_length=50,null=True,db_index=True)
    # 指定表名 不指定默认APP名字——类名(app_demo_Student)
    class Meta:
        db_table = 'business_master'
 # 业务流水表
 # 根据HIS提供的接口 存值 接口代码填写接口代码，例如:挂号1101，模块例如：pattype,,,返回串中的code:{"1":{"desc":"选择患者类型","code":"pattype","page":"/WebAPP/pages/common/readcard.html?","config":{}},"2":{"desc":"读卡","code":"readcard","page":"/WebAPP/pages/common/readcard.show.html","config":{"url":"/WebAPP/themes/images/card123.gif","cardmode":"1"}},"3":{"desc":"选择预约记录","code":"getpredetails","page":"/WebAPP/pages/prereg/predetails.html?AllowReund=Y","config":""},"4":{"desc":"选择支付方式","code":"preregpay","page":"/WebAPP/pages/perreg/paymode.html?","config":""}}
class business_details(models.Model):
    objects = models.Manager()
    #创建如下几个表的字段
    #  primary_key=True: 该字段为主键
    id = models.AutoField('RowId',null=False, primary_key=True,unique=True,db_index=True)
    # 业务主表id
    fk_businessmaster_id = models.CharField('业务主表id', max_length=50,null=True,db_index=True)
    # 自助业务流水号 
    serial_number = models.CharField('自助业务流水号', max_length=50,null=True,db_index=True)
    # HIS业务流水号 可做对照 返回值的哪一个是唯一流水号
    his_serial_number = models.CharField('HIS业务流水号', max_length=50,null=True,db_index=True)
    # 模块代码 
    modal_code = models.CharField('模块代码', max_length=50,null=True,db_index=True)
    # 模块描述
    model_desc = models.CharField('模块描述', max_length=50,null=True)
    # 自助服务接口代码  和HIS做对照  存自助机自己的代码
    intef_code = models.CharField('接口代码', max_length=50,null=True,db_index=True)
    # 接口描述
    intef_desc = models.CharField('接口描述', max_length=50,null=True)
    # 接口入参
    intef_input = models.CharField('接口入参', max_length=15000,null=True)
    # 接口返回
    intef_output = models.TextField("接口出参",null=True)
    # 业务日期
    business_date = models.DateTimeField(auto_now_add=True,db_index=True)
    business_update = models.DateTimeField(null=True)
    # 指定表名 不指定默认APP名字——类名(app_demo_Student)
    class Meta:
        db_table = 'business_details'
# 患者信息表
class patinfo(models.Model): 
    objects = models.Manager()
    #创建如下几个表的字段
    #  primary_key=True: 该字段为主键
    id = models.AutoField('RowId',null=False, primary_key=True,unique=True,db_index=True)
    # 业务主表id
    fk_businessmaster_id = models.CharField('业务主表id', max_length=50,null=True,db_index=True)
    # 基本信息code 
    code = models.CharField('代码', max_length=50,null=True,db_index=True)
    # 基本信息值
    code_val = models.CharField('代码值', max_length=5000,null=True)
    # HIS患者唯一号
    his_master_id = models.CharField('HIS患者唯一号', max_length=50,null=True,db_index=True)
    # HIS患者姓名
    his_patname = models.CharField('患者姓名', max_length=20,null=True,db_index=True)
    # 身份证号
    id_no = models.CharField('身份证号', max_length=20,null=True,db_index=True)
    # 初始医保类型
    hi_type = models.CharField('医保类型', max_length=20,null=True,db_index=True)
    class Meta:
        db_table = 'patinfo'
# 自助机设备表 自助机主表
class ss_eqlistd(models.Model): 
    objects = models.Manager()
    #创建如下几个表的字段
    id = models.AutoField('RowId',null=False, primary_key=True,unique=True,db_index=True)
    # 设备编号
    ss_eqlistd_eqcode = models.CharField('设备编号', max_length=20,null=True,db_index=True)
    # 设备名称
    ss_eqlistd_eqdesc = models.CharField('设备名称', max_length=50,null=True)
    # 设备位置
    ss_eqlistd_address = models.CharField('设备位置', max_length=300,null=True)
    # 设备规格
    ss_eqlistd_spec = models.CharField('设备规格', max_length=20,null=True)
    # 设备单位
    ss_eqlistd_unit = models.CharField('设备单位', max_length=20,null=True)
    # 设备分类编码
    ss_eqlistd_type = models.CharField('设备分类编码', max_length=20,null=True,db_index=True)
    # 设备ip
    ss_eqlistd_ip = models.CharField('设备ip', max_length=20,null=True,db_index=True)
    # 设备mac
    ss_eqlistd_mac = models.CharField('设备mac', max_length=50,null=True)
    # 开机时间
    ss_eqlistd_opdate = models.DateTimeField(auto_now_add=True)
    # 关机时间
    ss_eqlistd_closedate = models.DateTimeField(auto_now_add=True)
    # 创建日期
    ss_eqlistd_createdate = models.DateTimeField(auto_now_add=True)
    # 创建人
    ss_eqlistd_creator = models.CharField('创建人', max_length=50,null=True)
    # 修改日期
    ss_eqlistd_update = models.DateTimeField(auto_now_add=True)
    # 修改人
    ss_eqlistd_upuser = models.CharField('修改', max_length=50,null=True)
    # 设备角色代码
    ss_eqlistd_role = models.CharField('设备角色代码', max_length=50,null=True,db_index=True)
    class Meta:
        db_table = 'ss_eqlistd'
# 自助机设备配置表 
class ss_eqlistconfig(models.Model): 
    objects = models.Manager()
    #创建如下几个表的字段
    id = models.AutoField('RowId',null=False, primary_key=True,unique=True)
    # 设备编号
    ss_eqlistc_code = models.CharField('设备编号', max_length=20,null=True)
    # 设备名称
    ss_eqlistc_desc = models.CharField('设备名称', max_length=50,null=True)
    # 配置代码
    ss_eqlistc_cfgcode = models.CharField('配置代码', max_length=50,null=True)
    # 配置名称
    ss_eqlistc_cfgdesc = models.CharField('配置名称', max_length=100,null=True)
    # 配置值
    ss_eqlistc_cfgvalue = models.CharField('配置值', max_length=500,null=True)
    # 创建日期
    ss_eqlistc_createdate = models.DateTimeField(auto_now_add=True)
    # 创建人
    ss_eqlistc_creator = models.CharField('创建人', max_length=50,null=True)
    # 修改日期
    ss_eqlistc_update = models.DateTimeField(auto_now_add=True)
    # 修改人
    ss_eqlistc_upuser = models.CharField('修改', max_length=50,null=True)
    # 配置值
    ss_eqlistc_cfgvaluedemo = models.CharField('配置值描述', max_length=100,null=True)
    # 设备角色代码
    class Meta:
        db_table = 'ss_eqlistconfig'
# 自助机设备模块表
class ss_eqmlist(models.Model): 
    objects = models.Manager()
    #创建如下几个表的字段
    id = models.AutoField('RowId',null=False, primary_key=True,unique=True)
    # 设备编号
    ss_eqmlist_eqcode = models.CharField('设备编号', max_length=20,null=True)
    # 设备名称
    ss_eqmlist_eqdesc = models.CharField('设备名称', max_length=50,null=True)
    # 模块编号
    ss_eqmlist_modcode = models.CharField('模块编号', max_length=20,null=True)
    # 模块名称
    ss_eqmlist_moddesc = models.CharField('模块名称', max_length=50,null=True)
    # 模块状态
    ss_eqmlist_modstatus = models.CharField('模块状态', max_length=5,null=True)
    # 创建日期
    ss_eqmlist_createdate = models.DateTimeField(auto_now_add=True)
    # 创建人
    ss_eqmlist_creator = models.CharField('创建人', max_length=50,null=True)
    # 修改日期
    ss_eqmlist_update = models.DateTimeField(auto_now_add=True)
    # 修改人
    ss_eqmlist_upuser = models.CharField('修改人', max_length=50,null=True)
    # 模块类型 YHK 
    ss_eqmlist_modtype = models.CharField('模块类型', max_length=50,null=True)
    class Meta:
        db_table = 'ss_eqmlist'
# 自助机设备模块故障表
class ss_eqmfault(models.Model): 
    objects = models.Manager()
    #创建如下几个表的字段
    id = models.AutoField('RowId',null=False, primary_key=True,unique=True)
    # 设备编号
    ss_eqmf_eqcode = models.CharField('设备编号', max_length=20,null=True)
    # 设备名称
    ss_eqmf_eqdesc = models.CharField('设备名称', max_length=50,null=True)
    # 模块编号
    ss_eqmf_modcode = models.CharField('模块编号', max_length=20,null=True)
    # 模块名称
    ss_eqmf_moddesc = models.CharField('模块名称', max_length=50,null=True)
    # 模块状态
    ss_eqmf_modstatus = models.CharField('模块状态', max_length=5,null=True)
    # 故障编码
    ss_eqmf_faultcode = models.CharField('故障代码', max_length=100,null=True)
    # 故障描述
    ss_eqmf_faultdesc = models.CharField('故障描述', max_length=500,null=True)

    # 创建日期
    ss_eqmf_createdate = models.DateTimeField(auto_now_add=True)
    # 创建人
    ss_eqmf_creator = models.CharField('创建人', max_length=50,null=True)
    # 修改日期
    ss_eqmf_update = models.DateTimeField(auto_now_add=True)
    # 修改人
    ss_eqmf_upuser = models.CharField('修改人', max_length=50,null=True)
    class Meta:
        db_table = 'ss_eqmfault'
# 自助规则表
class ss_eqrule(models.Model): 
    objects = models.Manager()
    #创建如下几个表的字段
    id = models.AutoField('RowId',null=False, primary_key=True,unique=True)
    # 规则分类
    ss_eqr_type = models.CharField('规则分类', max_length=20,null=True)
    # 规则代码
    ss_eqr_code = models.CharField('规则代码', max_length=50,null=True)
    # 规则描述
    ss_eqr_desc = models.CharField('规则描述', max_length=100,null=True)
    # 规则备注
    ss_eqr_demo = models.CharField('规则备注', max_length=50,null=True)
    # 控制类型 0 提示 1 完全控制
    ss_eqr_conflag = models.CharField('控制类型', max_length=5,null=True)
    # 规则生效日期
    ss_eqr_stdate =  models.DateTimeField(null=True)
    # 规则失效日期
    ss_eqr_enddate =  models.DateTimeField(null=True)
    # 创建日期
    ss_eqr_createdate = models.DateTimeField(auto_now_add=True)
    # 创建人
    ss_eqr_creator = models.CharField('创建人', max_length=50,null=True)
    # 修改日期
    ss_eqr_update = models.DateTimeField(auto_now_add=True)
    # 修改人
    ss_eqr_upuser = models.CharField('修改人', max_length=50,null=True)
    # 保存模式 按自助机角色保存  按单个自助机保存
    ss_eqr_savemode = models.CharField('保存模式',max_length=25,null=True)
    # 保存值 按自助机角色保存：角色代码  按单个自助机保存  自助机终端号
    ss_eqr_saveval = models.CharField('保存值',max_length=25,null=True)
    # 是否有效 和日期同时生效
    ss_eqr_actflag = models.CharField('是否有效',max_length=25,null=True)
    class Meta:
        db_table = 'ss_eqrule'
# 自助规则明细
class ss_eqrdetails(models.Model): 
    objects = models.Manager()
    #创建如下几个表的字段
    id = models.AutoField('RowId',null=False, primary_key=True,unique=True)
    # 规则分类
    ss_eqrd_type = models.CharField('规则分类', max_length=20,null=True)
    # 规则代码
    ss_eqrd_code = models.CharField('规则代码', max_length=50,null=True)
    # 开始值
    ss_eqrd_stval = models.CharField('开始值', max_length=100,null=True)
    # 开始值
    ss_eqrd_endval = models.CharField('开始值', max_length=100,null=True)
    # 操作符
    ss_eqrd_option = models.CharField('操作符', max_length=10,null=True)
    # 规则生效日期
    ss_eqrd_stdate =  models.DateTimeField(null=True)
    # 规则失效日期
    ss_eqrd_enddate =  models.DateTimeField(null=True)
    # 是否有效 和日期同时生效 Y有效 N无效
    ss_eqrd_actflag = models.CharField('是否有效',max_length=5,null=True)
    
    # 创建日期
    ss_eqrd_createdate = models.DateTimeField(auto_now_add=True)
    # 创建人
    ss_eqrd_creator = models.CharField('创建人', max_length=50,null=True)
    # 修改日期
    ss_eqrd_update = models.DateTimeField(auto_now_add=True)
    # 修改人
    ss_eqrd_upuser = models.CharField('修改人', max_length=50,null=True)
    # 规则描述
    ss_eqrd_desc = models.CharField('规则描述', max_length=50,null=True)
    class Meta:
        db_table = 'ss_eqrdetails'
# 自助字典表
class ss_dicdata(models.Model): 
    objects = models.Manager()
    #创建如下几个表的字段
    id = models.AutoField('RowId',null=False, primary_key=True,unique=True)
    # 字典类型
    ss_dic_type = models.CharField('字典类型', max_length=20,null=True)
    # 字典代码
    ss_dic_code = models.CharField('字典代码', max_length=100,null=True)
    # 字典描述
    ss_dic_desc = models.CharField('字典描述', max_length=100,null=True)
    # 字典备注
    ss_dic_demo = models.CharField('字典备注', max_length=200,null=True)

    # 创建日期
    ss_dic_createdate = models.DateTimeField(auto_now_add=True)
    # 创建人
    ss_dic_creator = models.CharField('创建人', max_length=50,null=True)
    # 修改日期
    ss_dic_update = models.DateTimeField(auto_now_add=True)
    # 修改人
    ss_dic_upuser = models.CharField('修改人', max_length=50,null=True)
    # 字典对照代码
    ss_dic_concode = models.CharField('字典对照代码', max_length=100,null=True)
    # 字典对照描述
    ss_dic_condesc = models.CharField('字典对照描述', max_length=100,null=True)
    # 字典对照备注
    ss_dic_condemo = models.CharField('字典对照备注', max_length=200,null=True)
    # 字典目录
    ss_dic_catalog = models.CharField('字典目录', max_length=50,null=True,db_index=True)
    class Meta:
        db_table = 'ss_dicdata'
# 自助机交易流水表 (只存交易成功的)
class ss_tradedetails(models.Model): 
    objects = models.Manager()
    #创建如下几个表的字段
    id = models.AutoField('RowId',null=False, primary_key=True,unique=True,db_index=True)
    # 交易代码
    ss_td_code = models.CharField('交易代码', max_length=20,null=True,db_index=True)
    # 交易描述
    ss_td_desc = models.CharField('交易描述', max_length=20,null=True)
    # 交易总金额
    ss_td_amt = models.CharField('交易金额', max_length=20,null=True)
    # 交易类型 1,代表最终成功的
    ss_td_type = models.CharField('交易类型', max_length=20,null=True,db_index=True)
    # 自助机交易流水号
    ss_td_no = models.CharField('自助机交易流水号', max_length=50,null=True,db_index=True)
    # HIS交易流水号
    ss_td_hisno = models.CharField('HIS交易流水号', max_length=50,null=True,db_index=True)
    # 交易平台流水号
    ss_td_platno = models.CharField('交易平台流水号', max_length=50,null=True,db_index=True)
    # 支付机构交易流水号 微信支付宝返回的
    ss_td_extno = models.CharField('支付机构交易流水号', max_length=50,null=True,db_index=True)
    # 交易渠道
    ss_td_channel = models.CharField('支付机构交易流水号', max_length=50,null=True,db_index=True)
    # 创建日期
    ss_td_createdate = models.DateTimeField(auto_now_add=True)
    # 创建人 自助机编号
    ss_td_creator = models.CharField('创建人', max_length=50,null=True,db_index=True)
    # 修改日期
    ss_td_update = models.DateTimeField(auto_now_add=True)
    # 修改人
    ss_td_upuser = models.CharField('修改人', max_length=50,null=True)
    # 患者自负金额 (总金额-医保支付金额)
    ss_td_selfamt = models.CharField('患者自负金额', max_length=20,null=True)
    class Meta:
        db_table = 'ss_tradedetails'

# 自助机交易流水支付方式表 (自助机交易流水表的子表)
class ss_tdpaymode(models.Model): 
    objects = models.Manager()
    #创建如下几个表的字段
    id = models.AutoField('RowId',null=False, primary_key=True,unique=True,db_index=True)
    # 自助机交易流水号
    ss_tdp_masterid = models.CharField('交易主表id', max_length=50,null=True,db_index=True)
    # 自助机交易流水号
    ss_tdp_no = models.CharField('自助机交易流水号', max_length=50,null=True,db_index=True)
    # 交易代码
    ss_tdp_code = models.CharField('交易代码', max_length=20,null=True,db_index=True)
    # 支付方式描述
    ss_tdp_desc = models.CharField('交易描述', max_length=20,null=True)
    # 支付方式金额
    ss_tdp_amt = models.CharField('支付方式金额', max_length=20,null=True)
    # 创建日期
    ss_tdp_createdate = models.DateTimeField(auto_now_add=True)
    # 创建人
    ss_tdp_creator = models.CharField('创建人', max_length=50,null=True)
    # 修改日期
    ss_tdp_update = models.DateTimeField(auto_now_add=True)
    # 修改人
    ss_tdp_upuser = models.CharField('修改人', max_length=50,null=True)
    # ExtDetId ss_extdetails.id
    ss_tdp_extid = models.CharField('第三方交易表ID', max_length=20,null=True,db_index=True)
    class Meta:
        db_table = 'ss_tdpaymode'
# HIS交易
class recci_his_trade(models.Model): 
    										
    objects = models.Manager()
    #创建如下几个表的字段
    id = models.AutoField('RowId',null=False, primary_key=True,unique=True)
    # 
    his_tr_code = models.CharField('', max_length=20,null=True)
    # 
    his_tr_desc = models.CharField('', max_length=20,null=True)
    # 
    his_tr_atm = models.CharField('', max_length=20,null=True)
    # 
    his_tr_type = models.CharField('', max_length=20,null=True)
    # 
    his_tr_no = models.CharField('', max_length=20,null=True)
    # 
    his_tr_zzjno = models.CharField('', max_length=20,null=True)
    # 
    his_tr_bankno = models.CharField('', max_length=20,null=True)
    # 
    his_tr_pay = models.CharField('', max_length=20,null=True)
    # 
    his_tr_date = models.DateTimeField(auto_now_add=True)
    # 
    his_tr_time = models.DateTimeField(auto_now_add=True)
    # 
    his_tr_user = models.CharField('', max_length=10,null=True)
    class Meta:
        db_table = 'recci_his_trade'
# 银行交易
class recci_bank_trade(models.Model): 										
    objects = models.Manager()
    #创建如下几个表的字段
    id = models.AutoField('RowId',null=False, primary_key=True,unique=True)
    # 
    bank_tr_code = models.CharField('', max_length=20,null=True)
    # 
    bank_tr_desc = models.CharField('', max_length=20,null=True)
    # 
    bank_tr_atm = models.CharField('', max_length=20,null=True)
    # 
    bank_tr_type = models.CharField('', max_length=20,null=True)

    # 
    bank_tr_no = models.CharField('', max_length=20,null=True)
    # 
    bank_tr_zzjno = models.CharField('', max_length=20,null=True)
    # 
    bank_tr_pay = models.CharField('', max_length=20,null=True)
    # 
    bank_tr_bankno = models.CharField('', max_length=20,null=True)
    # 
    bank_tr_date = models.DateTimeField(auto_now_add=True)
    # 
    bank_tr_user = models.CharField('', max_length=10,null=True)
    # 
    bank_tr_time = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'recci_bank_trade'
# 自助机设备角色表
class ss_eqrole(models.Model): 
    objects = models.Manager()
    #创建如下几个表的字段
    id = models.AutoField('RowId',null=False, primary_key=True,unique=True)
    # 角色代码
    ss_eqro_code = models.CharField('角色代码', max_length=20,null=True)
    # 角色名称
    ss_eqro_desc = models.CharField('角色名称', max_length=50,null=True)
    # 创建日期
    ss_eqro_createdate = models.DateTimeField(auto_now_add=True)
    # 创建人
    ss_eqro_creator = models.CharField('创建人', max_length=50,null=True)
    # 修改日期
    ss_eqro_update = models.DateTimeField(auto_now_add=True)
    # 修改人
    ss_eqro_upuser = models.CharField('修改人', max_length=50,null=True)
    class Meta:
        db_table = 'ss_eqrole'
# 第三方交易表
class ss_extdetails(models.Model): 
    objects = models.Manager()
    #创建如下几个表的字段
    id = models.AutoField('RowId',null=False, primary_key=True,unique=True,db_index=True)
    # 业务类型代码 (挂号，收费，取号)
    ss_extd_code = models.CharField('交易代码', max_length=20,null=True,db_index=True)
    # 交易总金额
    ss_extd_amt = models.CharField('交易金额', max_length=20,null=True)
    # 支付 Pay  查询Query #退费Refund
    ss_extd_type = models.CharField('交易类型', max_length=20,null=True,db_index=True)
    # 支付 Pay  查询Query #退费Refund
    ss_extd_status = models.CharField('交易结果', max_length=20,null=True,db_index=True)
    # 自助机交易主表ID
    ss_extd_id = models.CharField('自助机交易主表ID', max_length=50,null=True,db_index=True)
    # 自助机交易流水号
    ss_extd_no = models.CharField('自助机交易流水号', max_length=50,null=True,db_index=True)
    # HIS交易流水号
    ss_extd_hisno = models.CharField('HIS交易流水号', max_length=50,null=True,db_index=True)
    # 交易平台流水号
    ss_extd_platno = models.CharField('交易平台流水号', max_length=50,null=True,db_index=True)
    # 支付机构交易流水号 微信支付宝返回的
    ss_extd_extno = models.CharField('支付机构交易流水号', max_length=50,null=True,db_index=True)
    # 交易渠道 微信支付宝
    ss_extd_channel = models.CharField('交易渠道', max_length=30,null=True,db_index=True)
    # 第三方返回信息
    ss_extd_outinfo = models.CharField('第三方返回信息 ', max_length=5000,null=True)
    # 入参
    ss_extd_ininfo = models.CharField('入参', max_length=5000,null=True)
    # 创建日期
    ss_extd_createdate = models.DateTimeField(auto_now_add=True,db_index=True)
    # 创建人 自助机编号
    ss_extd_creator = models.CharField('创建人', max_length=50,null=True,db_index=True)
    # 修改日期
    ss_extd_update = models.DateTimeField(auto_now_add=True)
    # 修改人
    ss_extd_upuser = models.CharField('修改人', max_length=50,null=True) 
    class Meta:
        db_table = 'ss_extdetails'
class ss_docpicture(models.Model): 
    objects = models.Manager()
    #创建如下几个表的字段
    id = models.AutoField('RowId',null=False, primary_key=True,unique=True,db_index=True)
    # 医生代码
    ss_dcp_code = models.CharField('医生代码', max_length=20,null=True,db_index=True)
    # 医生照片
    ss_dcp_info = models.TextField('医生照片', null=True)
    #
    ss_dcp_createdate = models.DateTimeField(auto_now_add=True)
    # 创建人
    ss_dcp_creator = models.CharField('创建人', max_length=50,null=True,db_index=True)
    # 修改日期
    ss_dcp_update = models.DateTimeField(auto_now_add=True)
    # 修改人
    ss_dcp_upuser = models.CharField('修改人', max_length=50,null=True) 
    # 医生姓名
    ss_dcp_name = models.CharField('医生姓名', max_length=20,null=True,db_index=True)
    class Meta:
        db_table = 'ss_docpicture'
class ss_refundsingle(models.Model): 
    objects = models.Manager()
    #创建如下几个表的字段
    id = models.AutoField('RowId',null=False, primary_key=True,unique=True,db_index=True)
    # 患者姓名
    ss_ref_patname = models.CharField('患者姓名', max_length=20,null=True,db_index=True)
    # HIS患者唯一号
    ss_ref_patno = models.CharField('HIS患者唯一号', max_length=20,null=True,db_index=True)
    # 自助机正交易 主表ID
    fk_businessmaster_id = models.CharField('主表ID', max_length=20,null=True,db_index=True)
    # 冲销状态 1  冲销成功  ，-1冲销失败，0 待冲正,-2 HIS二次校验不需要冲正
    ss_ref_status = models.CharField('冲销状态', max_length=20,null=True,db_index=True)
    # 冲销类型 INSU  医保  KLE
    ss_ref_type = models.CharField('冲销类型', max_length=20,null=True,db_index=True)
    # 冲销金额 主表ID
    ss_ref_amt = models.CharField('冲销金额', max_length=20,null=True)
    # 订单金额 主表ID
    ss_ref_ordamt = models.CharField('订单金额', max_length=20,null=True,db_index=True)
    # 交易平台流水号
    ss_ref_platno = models.CharField('交易平台流水号', max_length=100,null=True,db_index=True)
    # HIS订单号
    ss_ref_hisno = models.CharField('HIS订单号', max_length=100,null=True,db_index=True)
    # 冲正入参
    ss_ref_input = models.CharField('冲正入参', max_length=5000,null=True)
    # 冲正出参
    ss_ref_output = models.CharField('冲正出参', max_length=5000,null=True)
    #
    ss_ref_createdate = models.DateTimeField(auto_now_add=True)
    # 创建人
    ss_ref_creator = models.CharField('创建人', max_length=50,null=True,db_index=True)
    # 修改日期
    ss_ref_update = models.DateTimeField(auto_now_add=True)
    # 修改人
    ss_ref_upuser = models.CharField('修改人', max_length=50,null=True) 
    class Meta:
        db_table = 'ss_refundsingle'
class DataContrastPortList(models.Model):
    id = models.AutoField(null=False, primary_key=True,unique=True,db_index=True)
    type = models.CharField(max_length=50, blank=True, null=True)
    hi_type = models.CharField(max_length=50, blank=True, null=True)
    infno = models.CharField(max_length=50, blank=True, null=True)
    infname = models.CharField(max_length=50, blank=True, null=True)
    contenttype = models.CharField(max_length=50, blank=True, null=True)
    signtype = models.CharField(max_length=50, blank=True, null=True)
    chkflag = models.CharField(max_length=50, blank=True, null=True)
    efftflag = models.CharField(max_length=3, blank=True, null=True)
    url = models.CharField(max_length=50, blank=True, null=True)
    node_code = models.CharField(max_length=50, blank=True, null=True)
    his_ver = models.CharField(max_length=50, blank=True, null=True)
    crter = models.CharField(max_length=50, blank=True, null=True)
    crte_date = models.DateField(blank=True, null=True)
    crte_time = models.TimeField(blank=True, null=True)
    updt_id = models.CharField(max_length=50, blank=True, null=True)
    updt_date = models.DateField(blank=True, null=True)
    updt_time = models.TimeField(blank=True, null=True)
    classname = models.CharField(max_length=50, blank=True, null=True)
    methodname = models.CharField(max_length=50, blank=True, null=True)
    outnode_code = models.CharField(max_length=50, blank=True, null=True)
    buildinput = models.CharField(max_length=50, blank=True, null=True)
    class Meta:
        db_table = 'data_contrast_port_list'
class DataContrastPortNode(models.Model):
    id = models.AutoField(null=False, primary_key=True,unique=True,db_index=True)
    parid = models.CharField(max_length=50, blank=True, null=True,db_index=True)
    seq = models.CharField(max_length=50, blank=True, null=True)
    nodecode = models.CharField(max_length=50, blank=True, null=True)
    nodename = models.CharField(max_length=50, blank=True, null=True)
    node_type = models.CharField(max_length=50, blank=True, null=True)
    sub_flag = models.CharField(max_length=50, blank=True, null=True)
    classname = models.CharField(max_length=50, blank=True, null=True)
    methodname = models.CharField(max_length=50, blank=True, null=True)
    methodtype = models.CharField(max_length=50, blank=True, null=True)
    conflag = models.CharField(max_length=50, blank=True, null=True)
    crter = models.CharField(max_length=50, blank=True, null=True)
    crte_date = models.DateField(blank=True, null=True)
    crte_time = models.TimeField(blank=True, null=True)
    updt_id = models.CharField(max_length=50, blank=True, null=True)
    updt_date = models.DateField(blank=True, null=True)
    updt_time = models.TimeField(blank=True, null=True)
    parnode_type = models.CharField(max_length=50, blank=True, null=True)
    efft_flag = models.CharField(max_length=50, blank=True, null=True)
    multrow = models.CharField(max_length=50, blank=True, null=True)
    class Meta:
        db_table = 'data_contrast_port_node'
class DataContrastPortInargs(models.Model):
    id = models.AutoField(null=False, primary_key=True,unique=True,db_index=True)
    parid = models.CharField(max_length=50, blank=True, null=True,db_index=True)
    seq = models.CharField(max_length=50, blank=True, null=True)
    argcode = models.CharField(max_length=50, blank=True, null=True)
    argname = models.CharField(max_length=50, blank=True, null=True)
    contype = models.CharField(max_length=50, blank=True, null=True)
    coninfo = models.CharField(max_length=100, blank=True, null=True)
    argtype = models.CharField(max_length=50, blank=True, null=True)
    mustl_flag = models.CharField(max_length=50, blank=True, null=True)
    max_leng = models.CharField(max_length=50, blank=True, null=True)
    subnode = models.CharField(max_length=50, blank=True, null=True)
    subname = models.CharField(max_length=50, blank=True, null=True)
    crter = models.CharField(max_length=50, blank=True, null=True)
    crte_date = models.DateField(blank=True, null=True)
    crte_time = models.TimeField(blank=True, null=True)
    updt_id = models.CharField(max_length=50, blank=True, null=True)
    updt_date = models.DateField(blank=True, null=True)
    updt_time = models.TimeField(blank=True, null=True)
    coninfodesc = models.CharField(max_length=50, blank=True, null=True)
    parnode_type = models.CharField(max_length=50, blank=True, null=True)
    codeflag = models.CharField(max_length=50, blank=True, null=True)
    defvalue = models.CharField(max_length=50, blank=True, null=True)
    coninfodemo = models.CharField(max_length=50, blank=True, null=True)
    efft_flag = models.CharField(max_length=50, blank=True, null=True)
    coninfosource = models.CharField(max_length=50, blank=True, null=True)
    diccode = models.CharField(max_length=50, blank=True, null=True)
    localparcode = models.CharField(max_length=50, blank=True, null=True)
    class Meta:
        db_table = 'data_contrast_port_inargs'
# 自助机设备角色配置表 
class ss_eqroleconfig(models.Model): 
    objects = models.Manager()
    #创建如下几个表的字段
    id = models.AutoField('RowId',null=False, primary_key=True,unique=True)
    # 设备角色代码
    ss_eqrolecfg_code = models.CharField('设备编号', max_length=20,null=True,db_index=True)
    # 设备角色名称
    ss_eqrolecfg_desc = models.CharField('设备名称', max_length=20,null=True)
    # 配置代码
    ss_eqrolecfg_cfgcode = models.CharField('配置代码', max_length=50,null=True,db_index=True)
    # 配置名称
    ss_eqrolecfg_cfgdesc = models.CharField('配置名称', max_length=100,null=True)
    # 配置值
    ss_eqrolecfg_cfgvalue = models.CharField('配置值', max_length=500,null=True)
    # 生效标志
    ss_eqrolecfg_actflg = models.CharField('生效标志', max_length=5,null=True,db_index=True)
    # 创建日期
    ss_eqrolecfg_createdate = models.DateTimeField(auto_now_add=True)
    # 创建人
    ss_eqrolecfg_creator = models.CharField('创建人', max_length=50,null=True)
    # 修改日期
    ss_eqrolecfg_update = models.DateTimeField(auto_now_add=True)
    # 修改人
    ss_eqrolecfg_upuser = models.CharField('修改', max_length=50,null=True)
    # 设备角色代码
    class Meta:
        db_table = 'ss_eqroleconfig'