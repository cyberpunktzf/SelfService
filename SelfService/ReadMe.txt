v0.1 2021-09-13 02:00
初始版本

v0.2 2021-09-14 11:56
1.修复BUG-联合门诊取消预约不能同时取消2个
修改DHC_Business.py 中的1108 取消预约接口，增加通过流程配置代码判断是否为联合门诊
		    中的CancelUnion 接口
修改union.menu.html中取消预约的ID:CANCORDR为UnionOP-CANCORDR
2.修改新建患者时，标题为 请输入电话号码
text.input.js

v0.3 2021-09-14 15:22
1.修改自助机流水号生成规则，自助机编号+业务类型+日期时间
修改DHC_Business.py 中的Init方法
修改business_detailsCtl.py 中的 saveByWeb
2.payservicce.js中 新增保存操作日志接口PayServ_SaveBDInfo
3.card.js读卡时调用PayServ_SaveBDInfo 接口保存操作记录
4.不需要支付的 不显示支付二维码pay.js
5.0元复诊号加号 传入ATTPROWID DHC_1101 加号过程增加参数OrderCode=ATTPROWID 
6.1005排版查询新增加参数慢特类别
v0.4 2021-09-18 09:44
1.联合门诊取消预约 只能看到联合门诊预约记录
2.正常取消预约可以取消联合门诊预约