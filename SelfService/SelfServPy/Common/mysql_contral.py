from typing import Coroutine
from SelfServDB.models import business_master as model
from django.forms.models import model_to_dict  
from django.db import connection,transaction
from SelfServPy.ApplicationFrameWork.Tools import GetXMLNode
from datetime import datetime, date, timedelta
import json
from SelfServPy import INSU

class mysqlsql:

	def queryTrade(self,Qparam):#查询master表
		try:
			print("查询trade表交易--Qparam-------------------------------------------------------",Qparam)
			cursor = connection.cursor()# 使用cursor()方法获取操作游标 
			sqltrade = "SELECT  his_master_id,ss_td_amt,ss_td_no,ss_td_hisno,ss_td_platno,ss_td_update,serial_number, UserCode,code_val, terminal_info,d.ss_dic_desc "
			#sqlselect="from ss_tradedetails a left join business_master b on  a.ss_td_no=b.serial_number left join patinfo c on b.id=c.fk_businessmaster_id left join ss_dicdata d on b.code=d.ss_dic_code and d.ss_dic_type='Business' where  c.code='his_patinfo' and c.his_master_id !='' "
			sqlselect="from business_master a left join ss_tradedetails b on  a.serial_number=b.ss_td_no left join patinfo c on a.id=c.fk_businessmaster_id left join ss_dicdata d on a.code=d.ss_dic_code and d.ss_dic_type='Business' where  c.code='his_patinfo' and c.his_master_id !='' "
			sqltatal="SELECT  SUM(ss_td_amt)AS totalamout "
			for key, value in Qparam.items(): 
				if key=="ss_td_update":
					if value=="":
						value= datetime.now().strftime('%Y-%m-%d')
						print("ss_td_update-------------------------------------------------------",value,type(value))
				if value =="":
					continue
				if key=="ss_td_update":
					print("-------------------------------------------------------value",value)
					Endtime=(datetime.strptime(value.split(' ')[0],'%Y-%m-%d')+datetime.timedelta(days=1)).strftime('%Y-%m-%d')
					sqlselect=sqlselect+" and "+"b."+key +">='"+ value +"'"+" and "+"b."+key+"<'"+Endtime+"'"
				if key=="ss_td_amt":#金额
					sqlselect=sqlselect+" and "+"b.ss_td_amt = "+"'"+value+"'"	
				if key=="ss_td_no":#自助机流水号
					sqlselect=sqlselect+" and "+"b.ss_td_no = "+"'"+value+"'"	
				if key=="UserCode":#操作员号
					sqlselect=sqlselect+" and "+"a.usercode"+"='"+value+"'"
				if key=="code":#业务类型
					sqlselect=sqlselect+" and "+"a.code = "+"'"+value+"'"	
				if key=="PatientName":#姓名
					sqlselect=sqlselect+" and "+"c.code_val LIKE "+"'%"+value+"%'"	
				if key=="his_master_id":#门诊号
					sqlselect=sqlselect+" and "+"c.his_master_id = "+"'"+value+"'"
				if key=="processcode":#业务名称
					sqlselect=sqlselect+" and "+"d.ss_dic_desc = "+"'"+value+"'"
				if key=="resultcode":#交易状态
					sqlselect=sqlselect+" and "+"a.business_status = "+"'"+value+"'"	
			ResultSql=[]
			sqltatal=sqltatal+sqlselect
			print("查询金额"+sqltatal)
			cursor.execute(sqltatal)#执行数据库查询
			TotalAmout=str(cursor.fetchall()[0][0])
			sql=sqltrade+sqlselect
			print("查询交易"+sql)
			cursor.execute(sql)#执行数据库查询
			TableCount=len(cursor.fetchall())
			#print(str(TableCount),type(TableCount))
			sql=sql+" LIMIT "+str(int(Qparam['limit'])*(int(Qparam['page'])-1))+","+str(int(Qparam['limit']))
			cursor.execute(sql)#执行数据库查询
			results = cursor.fetchall()# 获取所有记录列 表
			#print("-------------------------------------------------------",results)
			RowCount=1
			for row in results:
				ResultRow={}
				ResultRow['his_master_id'] = row[0]
				ResultRow['ss_td_amt'] = row[1]
				ResultRow['ss_td_no'] = row[2]
				ResultRow['ss_td_hisno'] = row[3]
				ResultRow['ss_td_platno'] = row[4]
				ResultRow['ss_td_update'] = str(row[5]).split('.')[0]
				ResultRow['serial_number'] = row[6]
				ResultRow['UserCode'] = row[7]
				ResultRow['PatientName'] = GetXMLNode(row[8],"PatientName")
				ResultRow['resultcode'] = row[9]
				ResultRow['processcode'] = row[10]
				ResultRow['id'] = str(RowCount)
				RowCount=RowCount+1
				ResultSql.append(json.dumps(ResultRow,ensure_ascii=False))
			#print("-------------------------------------------------------",RowCount)
			self.queryset = {
				'ResultSql' :ResultSql,
				'TableCount':str(TableCount),
				'TotalAnout':TotalAmout,
				}
			self.msg="Success"
			#self.result= 
		except Exception as e:
			print ('queryTradeException: '+e)
			self.result = str(e)
			ex = Exception(self)
		# 关闭数据库连接
		connection.close()

	def queryTerminal(self,Qparam):#查询所有终端
		try:
			print("Qparam-------------------------------------------------------",Qparam)
			cursor = connection.cursor()# 使用cursor()方法获取操作游标 
			sql = "SELECT  ss_eqlistd_eqcode,ss_eqlistd_eqdesc from ss_eqlistd ORDER BY ss_eqlistd_eqcode  ASC"
			print(sql)
			ResultSql=[]
			cursor.execute(sql)#执行数据库查询
			results = cursor.fetchall()# 获取所有记录列 表
			for row in results:
				ResultRow={}
				ResultRow['UserCode'] = row[0]
				ResultRow['usercode'] = row[0]
				ResultRow['usercodeaddr'] = row[1]
				ResultSql.append(json.dumps(ResultRow,ensure_ascii=False))
			self.queryset = ResultSql
			self.msg="Success"
			#self.result= 
		except Exception as e:
			print ('queryRegException: '+e)
			self.result = str(e)
			ex = Exception(self)
		# 关闭数据库连接
		connection.close()

	def queryTradeType(self,Qparam):#查询所有操作名称
		try:
			print("Qparam-------------------------------------------------------",Qparam)
			cursor = connection.cursor()# 使用cursor()方法获取操作游标 
			sql = "SELECT  ss_pc_dicdesc,ss_pc_diccode from ss_processconfig "
			print(sql)
			ResultSql=[]
			cursor.execute(sql)#执行数据库查询
			results = cursor.fetchall()# 获取所有记录列 表
			for row in results:
				ResultRow={}
				ResultRow['ss_pc_dicdesc'] = row[0]
				ResultSql.append(json.dumps(ResultRow,ensure_ascii=False))
				self.queryset = ResultSql
				self.msg="Success"
		except Exception as e:
			print ('queryTradeTypeException: '+e)
			self.result = str(e)
			ex = Exception(self)
			# 关闭数据库连接
		connection.close()

	def queryTradedetail(self,Qparam):	#查询交易明细支付金额
		try:
			print("Qparam-------------------------------------------------------",Qparam)
			cursor = connection.cursor()# 使用cursor()方法获取操作游标 
			sql = "SELECT  ss_tdp_code, ss_tdp_amt,ss_tdp_no from ss_tdpaymode"
			for key, value in Qparam.items(): 
				if key=="ss_tdp_no":
					sql=sql+" where "+"ss_tdp_no = "+"'"+value+"'"	
			print(sql)
			ResultSql=[]
			cursor.execute(sql)#执行数据库查询
			results = cursor.fetchall()# 获取所有记录列 表
			TableCount=len(results)
			CodeToPayName = dict(WECHAT='微信支付:', INSUAccount="医保统筹:", INSUAmt="医保账户:", AlIPAY="支付宝支付:",JHZFYHK="银行卡支付:")
			for row in results:
				ResultRow={}
				ResultRow['ss_tdp_code'] = row[0]
				#print("-----------------------------row",bool(row[0]))
				if row[0]!='':
					#print("-----------------------------row!=""")
					ResultRow['ss_tdp_code'] = CodeToPayName[row[0]]
				ResultRow['ss_tdp_amt'] =row[1]#str(round(float(row[1]),2))
				ResultRow['ss_tdp_no'] =row[2]
				ResultRow["Tradno"]=row[2]#医保交易号就显示自助机产生的流水
				ResultRow["SucessState"]="是"#医保全部成功
				if row[0]=="WECHAT" or row[0]=="AlIPAY":
					detialsql= "SELECT  ss_extd_type,ss_extd_platno from ss_extdetails where ss_extd_no='"+Qparam["ss_tdp_no"]+"'"+"and ss_extd_type!='Query'"
					cursor.execute(detialsql)#执行数据库查询
					detialresults = cursor.fetchall()# 获取所有记录列 表
					for detialrow in detialresults:
						if detialrow[0]=="Refund":
							ResultRow["RefundState"]="是"
						if detialrow[0]=="Cancel":
							ResultRow["CancelState"]="是"	
						if detialrow[0]=="Pay":
							ResultRow["SucessState"]="是"
							ResultRow["Tradno"]=detialrow[1]
				ResultSql.append(json.dumps(ResultRow,ensure_ascii=False))
				#print(ResultRow)
			self.queryset = {
				'ResultSql' :ResultSql,
				'TableCount':str(TableCount),
				}
			self.msg="Success"
			#self.result= 
		except Exception as e:
			print ('queryRegException: '+e)
			self.result = str(e)
			ex = Exception(self)
		# 关闭数据库连接
		connection.close()

#region logquery.js
	def queryMasterLog(self,Qparam):#查询主表日志
		try: 
			print("Qparam-------------------------------------------------------",Qparam)
			cursor = connection.cursor()# 使用cursor()方法获取操作游标 
			sql = "select business_date,his_master_id,usercode,serial_number,code_val,ss_pc_dicdesc,business_status, fk_businessmaster_id from business_master a LEFT JOIN patinfo b ON a.id=b.fk_businessmaster_id and b.code ='his_patinfo' "
			sql += " LEFT JOIN ss_processconfig c  ON  a.processcode=c.ss_pc_processcode "#连表ss_processconfig查询
			sql += " where b.his_master_id !=''"
			#提取入参作为查询条件
			for key, value in Qparam.items(): 
				if key=="business_date":
					if value=="":
						value= datetime.now().strftime('%Y-%m-%d')
				if key=="business_date":
					#Endtime=(datetime.strptime(value.split(' ')[0],'%Y-%m-%d')+datetime.timedelta(days=1)).strftime('%Y-%m-%d')
					#sql=sql+"and "+"DATE_FORMAT(a."+key +">='"+ value +"','%Y%M%D')"+" and "+"DATE_FORMAT(a."+key+"<'"+Endtime+"','%Y%M%D')"
					sql=sql +"and  DATE_FORMAT(a."+key+",'%Y%M%D')="+"DATE_FORMAT('"+value+"','%Y%M%D')"
				if value =="":
					continue
				if key =="ss_pc_dicdesc":
					sql=sql+"and "+"c.ss_pc_dicdesc = '"+value+"'"
				if key =="his_master_id":
					sql=sql+"and "+"b.his_master_id = '"+value+"'"
				if key =="PatientName":
					sql=sql+"and "+"b.code_val like '%"+value+"%'"
				if key =="usercode":
					sql=sql+"and "+"a.usercode = '"+value+"'"
				if key =="serial_number":
					sql=sql+"and "+"a.serial_number = '"+value+"'"
				if key =="resultcode":
					sql=sql+"and "+"a.business_status = '"+value+"'"
			print("查询主表日志"+sql)
			ResultSql=[]
			cursor.execute(sql)#执行数据库查询
			TableCount=len(cursor.fetchall())#获取查询数量
			sql=sql+" LIMIT "+str(int(Qparam['limit'])*(int(Qparam['page'])-1))+","+str(int(Qparam['limit']))#限制查询条数
			cursor.execute(sql)#执行数据库查询
			results = cursor.fetchall()# 获取所有记录列 表
			print("查询主表日志限制数量"+sql)#控制台显示查询语句
			RowCount=1
			for row in results:
				ResultRow={}
				ResultRow['business_date'] = str(row[0]).split('.')[0]
				ResultRow['his_master_id'] = row[1]
				ResultRow['usercode'] = row[2]
				ResultRow['serial_number'] = row[3]
				if str(row[4]).find('PatientName')>0:
					ResultRow['PatientName'] = GetXMLNode(row[4],"PatientName")
				ResultRow['ss_pc_dicdesc'] = row[5]
				ResultRow['resultcode'] = row[6]
				ResultRow['businessId'] = row[7]
				ResultRow['id'] = str(RowCount)
				RowCount=RowCount+1
				ResultSql.append(json.dumps(ResultRow,ensure_ascii=False))
			#print("-------------------------------------------------------",ResultSql)
			self.queryset = {
				'ResultSql' :ResultSql,
				'TableCount':str(TableCount),
				}

			self.msg="Success"
		except Exception as e:
			print ('queryMasterLogException: '+e)
			self.result = str(e)
			ex = Exception(self)
		# 关闭数据库连接
		connection.close()

	def querydetailss_Exceptions(self,Qparam):#通过主表查询不成功的订单，并且第三方订单支付
		try: 
			#print("Qparam-------------------------------------------------------",Qparam)
			cursor = connection.cursor()# 使用cursor()方法获取操作游标 
			sql = "select business_date,his_master_id,usercode,serial_number,code_val,ss_pc_dicdesc,business_status, fk_businessmaster_id from business_master a LEFT JOIN patinfo b ON a.id=b.fk_businessmaster_id and b.his_master_id !=''  LEFT JOIN ss_processconfig c  ON  a.processcode=c.ss_pc_processcode where b.code ='his_patinfo' "
			for key, value in Qparam.items(): 
				if key=="business_date":
					if value=="":
						value= datetime.now().strftime('%Y-%m-%d')
				if key=="business_date":
					#Endtime=(datetime.strptime(value.split(' ')[0],'%Y-%m-%d')+datetime.timedelta(days=1)).strftime('%Y-%m-%d')
					#sql=sql+"and "+"DATE_FORMAT(a."+key +">='"+ value +"','%Y%M%D')"+" and "+"DATE_FORMAT(a."+key+"<'"+Endtime+"','%Y%M%D')"
					sql=sql +"and  DATE_FORMAT(a."+key+",'%Y%M%D')="+"DATE_FORMAT('"+value+"','%Y%M%D')"
				if value =="":
					continue
				if key =="his_master_id":
					sql=sql+"and "+"b.his_master_id = '"+value+"'"
				if key =="usercode":
					sql=sql+"and "+"a.usercode = '"+value+"'"
				if key =="serial_number":
					sql=sql+"and "+"a.serial_number = '"+value+"'"
				if key =="PatientName":
					sql=sql+"and "+"b.code_val like '%"+value+"%'"
				if key =="processcode":
					sql=sql+"and "+"c.ss_pc_dicdesc = '"+value+"'"
				if key =="resultcode":
					sql=sql+"and "+"a.business_status = '"+value+"'"
			sql=sql+" and IFNULL(a.business_status,'') <>'1'"
			print("通过主表查询订单"+sql)
			ResultSql=[]
			cursor.execute(sql)#执行数据库查询
			results = cursor.fetchall()# 获取所有记录列 表
			RowCount=1
			for row in results:
				ResultRow={}
				ResultRow['business_date'] = str(row[0]).split('.')[0]
				ResultRow['his_master_id'] = row[1]
				iscommitHis=0
				sqlDtail= "select intef_code,id from business_details where fk_businessmaster_id = '"+row[7] +"' order by id"
				#print(sqlDtail)
				cursor.execute(sqlDtail)#执行数据库查询
				resultDtail = cursor.fetchall()# 获取所有记录列 表
				for row1 in resultDtail:
					if str(row1[0])=="1101" or str(row1[0])=="4906":
						iscommitHis=1
				if iscommitHis==1 :
					continue 
				sqltrade = "select * from ss_extdetails where ss_extd_id = '"+row[7] +"' and ss_extd_type='notify'"#看第三方订单是否存在 
				#print(sqltrade)
				cursor.execute(sqltrade)#执行数据库查询
				if int(len(cursor.fetchall()))<1 :
					continue
				ResultRow['usercode'] = row[2]
				ResultRow['serial_number'] = row[3]
				if str(row[4]).find('PatientName')>0:
					ResultRow['PatientName'] = GetXMLNode(row[4],"PatientName")
				ResultRow['processcode'] = row[5]
				ResultRow['resultcode'] = row[6]
				ResultRow['businessId'] = row[7]
				ResultRow['id'] = str(RowCount)
				if (int(Qparam['limit'])*(int(Qparam['page'])-1))<RowCount & RowCount<=(int(Qparam['limit'])*(int(Qparam['page']))):
					ResultSql.append(json.dumps(ResultRow,ensure_ascii=False))
				RowCount=RowCount+1
			#print("-------------------------------------------------------",ResultSql)
			self.queryset = {
				'ResultSql' :ResultSql,
				'TableCount':str(RowCount),
				}
			self.msg="Success"
		except Exception as e:
			print ('queryMasterLogException: '+e)
			self.result = str(e)
			ex = Exception(self)
		# 关闭数据库连接
		connection.close()

	def querybusiness_details(self,Qparam):#通过主表查询临时表点击过哪些页面
		try:
			#print("Qparam-------------------------------------------------------",Qparam)
			cursor = connection.cursor()# 使用cursor()方法获取操作游标 
			sql = "select modal_code,ss_dic_desc,ss_dic_concode,business_date,fk_businessmaster_id,a.id from business_details a LEFT JOIN ss_dicdata b ON a.modal_code=b.ss_dic_code AND b.ss_dic_type='PageUrl' WHERE  (intef_code!='SaveBD' OR modal_code like 'INSU%' )  "
			for key, value in Qparam.items(): 
				if value =="":
					continue
				if key =="fk_businessmaster_id":
					sql=sql+"and "+"a.fk_businessmaster_id = '"+value+"'"+" ORDER BY a.id ASC "
			print("通过主表查询临时表点击过哪些页面"+sql)
			ResultSql=[]
			cursor.execute(sql)#执行数据库查询
			tmpresult=cursor.fetchall()# 获取所有记录列 表
			TableCount=0
			ss_dic_desccod=""
			serial_number=""
			cursor.execute(sql)#执行数据库查询
			results = cursor.fetchall()# 获取所有记录列 表
			for row in results:
				ResultRow={}
				ResultRow['modal_code'] = row[0]
				ResultRow['ss_dic_desc'] = row[1]
				ResultRow['ss_dic_concode'] = row[2]
				ResultRow['business_date'] = str(row[3]).split('.')[0]
				ResultRow['fk_businessmaster_id'] = row[4]
				ResultRow['id'] = row[5]
				if ss_dic_desccod!=str(row[0]):
					ss_dic_desccod=row[0]
					TableCount=TableCount+1 #临时计算数量，因为在代码中加了判断个数，所以不能用limit
					#无法通过limit选择，就通过当前页面和页面数量控制是否添加集合中
					if (int(Qparam['limit'])*(int(Qparam['page'])-1))<TableCount & TableCount<=(int(Qparam['limit'])*(int(Qparam['page']))):
						ResultSql.append(json.dumps(ResultRow,ensure_ascii=False))
			#print("-------------------------------------------------------",ResultSql)
			self.queryset = {
				'ResultSql' :ResultSql,
				'TableCount':str(TableCount),
			}
			self.msg="Success"
		except Exception as e:
			print ('queryMasterLogException: '+e)
			self.result = str(e)
			ex = Exception(self)
		# 关闭数据库连接
		connection.close()
	
	def querybusiness_PageMethod(self,Qparam):#通过页面查询调用那些方法
		try:
			#print("通过页面查询调用那些方法",Qparam)
			cursor = connection.cursor()# 使用cursor()方法获取操作游标 
			sql = "select intef_code,intef_input,intef_output,business_date,business_update,ss_ts_transcodedesc,modal_code,serial_number from business_details a LEFT JOIN ss_transcodeconfig b on a.intef_code=b.ss_transcode where  (intef_code!='SaveBD' OR modal_code like 'INSU%' )  "
			for key, value in Qparam.items(): 
				if value =="" :
					continue
				if key=="modal_code":
					modelcode=value
					continue
				if key=="id":
					sql=sql+" and a."+key+">='"+value+"'"
					continue
				if key=="fk_businessmaster_id":
					businessId=value
					sql=sql+" and a."+key+"='"+value+"'"
				#sql=sql +" and "+key+"='"+value+"'"
			sql=sql+"ORDER BY a.id ASC"
			print("通过页面查询调用那些方法"+sql)
			ResultSql=[]
			CodeToPayName = dict(WxPay="微信下单", AliPay="支付宝下单",JHZFYHK="银行卡下单",Pay="支付",Query="查询",Refund="退费")
			cursor.execute(sql)#执行数据库查询
			results = cursor.fetchall()# 获取所有记录列 表
			isadd="0"
			for row in results:
				ResultRow={}
				ResultRow['intef_code'] = row[0]
				ResultRow['intef_input'] = str(row[1])
				ResultRow['intef_output'] = str(row[2])
				ResultRow['business_date'] = str(row[3])#.split('.')[0]
				ResultRow['business_update'] = str(row[4])#.split('.')[0]
				ResultRow['ss_ts_transcodedesc'] = str(row[5])
				code=str(row[0])
				if code=="6666" and str(row[6])=="paymode":
					isadd="1"
				if row[6]!=modelcode:#判断下一部和上一步操作不属于同一页面因为6666不能完全过滤
					break
				ResultSql.append(json.dumps(ResultRow,ensure_ascii=False))
				sqlPayTrade ="select ss_extd_channel,ss_extd_ininfo,ss_extd_outinfo,ss_extd_createdate,ss_extd_update,ss_extd_amt from ss_extdetails where ss_extd_id='"+str(businessId)+"' and ss_extd_hisno='"+str(row[7])+"'"
				sqlPayTrade=sqlPayTrade+" and ss_extd_channel!='' and ss_extd_type='Pay'"
				if str(row[0])=="6666":
					print("第三方账单查询"+sqlPayTrade)
					if isadd=="1": #or code=="4906":  
						cursor.execute(sqlPayTrade)#执行数据库查询
						resultPayTrade = cursor.fetchall()# 获取所有记录列 表
						for row1 in resultPayTrade:
							ResultRowPayTrade={}
							isadd="2"#判断第三方订单添加完毕
							ResultRowPayTrade['intef_code'] = row1[0]
							ResultRowPayTrade['intef_input'] = str(row1[1])
							ResultRowPayTrade['intef_output'] = str(row1[2])
							ResultRowPayTrade['business_date'] = str(row1[3])#.split('.')[0]
							ResultRowPayTrade['business_update'] = str(row1[4])#.split('.')[0]
							ResultRowPayTrade['ss_ts_transcodedesc'] = CodeToPayName[str(row1[0])]+" 金额:"+str(row1[5])
							ResultSql.append(json.dumps(ResultRowPayTrade,ensure_ascii=False))
					if  isadd=="2":
						break
			#print("-------------------------------------------------------",ResultSql)
			self.queryset = ResultSql
			self.msg="Success"
		except Exception as e:
			print ('querybusiness_PageMethodException: '+e)
			self.result = str(e)
			ex = Exception(self)
		# 关闭数据库连接
		connection.close()
#endregion

#region extdetails.js
	def queryExtdetialQrcode(self,Qparam):#查询第三方订单交易  
		try:
			CodeToPayName = dict(WxPay="微信", AliPay="支付宝",JHZFYHK="银行卡",Pay="下单",Query="查询",notify="通知",Cancel="取消",Refund="退费")
			print("Qparam-------------------------------------------------------",Qparam)
			cursor = connection.cursor()# 使用cursor()方法获取操作游标 
			sql = "SELECT ss_extd_code,"
			sql+="ss_extd_amt,"
			sql+="ss_extd_type,"
			sql+="ss_extd_status,"
			sql+="ss_extd_no,"
			sql+="ss_extd_hisno,"
			sql+="ss_extd_platno,"
			sql+="ss_extd_channel,"
			sql+="ss_extd_outinfo,"
			sql+="ss_extd_ininfo,"
			sql+="ss_extd_update,"
			sql+="ss_extd_creator,"
			sql+="ss_extd_id,code_val from ss_extdetails a LEFT JOIN patinfo b ON a.ss_extd_id=b.fk_businessmaster_id and b.code ='his_patinfo'and b.his_master_id !='' where "
			for key, value in Qparam.items(): 
				if key=="ss_extd_update":
					if value=="":
						value= datetime.now().strftime('%Y-%m-%d')
						sql=sql +" DATE_FORMAT(ss_extd_update,'%Y%M%D')="+"DATE_FORMAT('"+value+"','%Y%M%D')"
					else:
						#Endtime=(datetime.strptime(value.split(' ')[0],'%Y-%m-%d')+datetime.timedelta(days=1)).strftime('%Y-%m-%d')
						#sql=sql+" ss_extd_update>='"+ value +"'"+" and "+"ss_extd_update<'"+Endtime+"'"
						sql=sql +" DATE_FORMAT(ss_extd_update,'%Y%M%D')="+"DATE_FORMAT('"+value+"','%Y%M%D')"
				if  value=="":
					continue
				if key =="PatientName":
					sql=sql+"and "+"b.code_val like '%"+value+"%'"
				if key=="ss_extd_platno":
					sql=sql+" and "+"ss_extd_platno = "+"'"+value+"'"	
				if key=="ss_extd_hisno":
					sql=sql+" and "+"ss_extd_hisno = "+"'"+value+"'"
				if key=="ss_extd_channel":
					sql=sql+" and "+"ss_extd_channel = "+"'"+value+"'"
				if key=="ss_extd_type":
					sql=sql+" and "+"ss_extd_type = "+"'"+value+"'"	
			sql=sql +" and IFNULL(ss_extd_channel,'')  <> 'INSU'"
			print("查询第三方订单交易"+sql)
			TableCount=0#临时计算数量
			ResultSql=[]
			cursor.execute(sql)#执行数据库查询
			results = cursor.fetchall()# 获取所有记录列 表
			for row in results:
				ResultRow={}
				ResultRow['ss_extd_code'] =str(row[0])
				ResultRow['ss_extd_amt'] =str(row[1])
				ResultRow['ss_extd_type'] =CodeToPayName[str(row[2])]
				ResultRow['ss_extd_status'] =str(row[3]) #CodeToPayName[row[0]]
				ResultRow['ss_extd_no'] =row[4]
				ResultRow['ss_extd_hisno'] =row[5]
				ResultRow['ss_extd_platno'] = row[6]
				ResultRow['ss_extd_channel'] =row[7]
				if  row[7]!=None:
					ResultRow['ss_extd_channel']=CodeToPayName[str(row[7])]
				ResultRow['ss_extd_outinfo'] =row[8]
				ResultRow['ss_extd_ininfo'] =row[9]
				ResultRow['ss_extd_update'] =str(row[10]).split('.')[0]
				ResultRow['ss_extd_creator'] =row[11]
				ResultRow['ss_extd_id'] =row[12]
				if str(row[13]).find('PatientName')>0:
					ResultRow['PatientName'] = GetXMLNode(row[13],"PatientName")
				TableCount=TableCount+1
				ResultRow['id']=str(TableCount)
				if (int(Qparam['limit'])*(int(Qparam['page'])-1))<TableCount & TableCount<=(int(Qparam['limit'])*(int(Qparam['page']))):
					ResultSql.append(json.dumps(ResultRow,ensure_ascii=False))
			self.queryset = {
				'ResultSql' :ResultSql,
				'TableCount':str(TableCount),
			}
			self.msg="Success"
			#self.result= 
		except Exception as e:
			print ('queryRegException: '+e)
			self.result = str(e)
			ex = Exception(self)
		# 关闭数据库连接
		connection.close()
#endregion

#region extdetailsMedical.js
	def queryExtdetialMedical(self,Qparam):#查询医保订单交易   GetInsuPayInfo()
		try:
			CodeToPayName = dict(WxPay="微信", AliPay="支付宝",JHZFYHK="银行卡",Pay="下单",Query="查询",notify="通知",Cancel="取消",Refund="退费",INSU="医保")
			print("Qparam-------------------------------------------------------",Qparam)
			cursor = connection.cursor()# 使用cursor()方法获取操作游标 
			sql = "SELECT ss_extd_code,"
			sql+="ss_extd_amt,"
			sql+="ss_extd_type,"
			sql+="ss_extd_status,"
			sql+="ss_extd_no,"
			sql+="ss_extd_hisno,"
			sql+="ss_extd_platno,"
			sql+="ss_extd_channel,"
			sql+="ss_extd_outinfo,"
			sql+="ss_extd_ininfo,"
			sql+="ss_extd_update,"
			sql+="ss_extd_creator,"
			sql+="ss_extd_id,code_val from ss_extdetails a LEFT JOIN patinfo b ON a.ss_extd_id=b.fk_businessmaster_id and b.code ='his_patinfo'and b.his_master_id !='' where "
			statut=""
			for key, value in Qparam.items(): 
				if key=="ss_extd_update":
					if value=="":
						value= datetime.now().strftime('%Y-%m-%d')
						sql=sql +" DATE_FORMAT(ss_extd_update,'%Y%M%D')="+"DATE_FORMAT('"+value+"','%Y%M%D')"
					else:
						#Endtime=(datetime.strptime(value.split(' ')[0],'%Y-%m-%d')+datetime.timedelta(days=1)).strftime('%Y-%m-%d')
						#sql=sql+" ss_extd_update>='"+ value +"'"+" and "+"ss_extd_update<'"+Endtime+"'"
						sql=sql +" DATE_FORMAT(ss_extd_update,'%Y%M%D')="+"DATE_FORMAT('"+value+"','%Y%M%D')"
				if  value=="":
					continue
				if key =="PatientName":
					sql=sql+"and "+"b.code_val like '%"+value+"%'"
				if key=="ss_extd_platno":
					sql=sql+" and "+"ss_extd_platno = "+"'"+value+"'"	
				if key=="ss_extd_hisno":
					sql=sql+" and "+"ss_extd_hisno = "+"'"+value+"'"
				if key=="ss_extd_channel":
					sql=sql+" and "+"ss_extd_channel = "+"'"+value+"'"
				if key=="ss_extd_type":
					sql=sql+" and "+"ss_extd_type = "+"'"+value+"'"	
				if key=="ss_extd_outinfo":
					statut=value
			sql=sql +" and IFNULL(ss_extd_channel,'')  = 'INSU'"
			print("查询第三方订单交易"+sql)
			TableCount=0#临时计算数量
			ResultSql=[]
			cursor.execute(sql)#执行数据库查询
			results = cursor.fetchall()# 获取所有记录列 表
			for row in results:
				ResultRow={}
				ResultRow['ss_extd_code'] =str(row[0])
				#region 取医保金额
				Input={}
				Input["AdmReason"]="2"
				Input["business_type"]=str(row[0])
				print("business_type")
				Input["serial_id"]=str(row[12])
				InsuDic=INSU.GetInsuPayInfo(Input)
				#endregion
				if not InsuDic or InsuDic=='':
					print("取金额错误")
					ResultRow['ss_extd_INSUZHZF'] ="取金额错误"
					ResultRow['ss_extd_INSUTCZF'] ="取金额错误"
				else :
					print(InsuDic)
					ResultRow['ss_extd_INSUZHZF'] =str(InsuDic.get('INSUZHZF'))
					ResultRow['ss_extd_INSUTCZF'] =str(InsuDic.get('INSUTCZF'))
				ResultRow['ss_extd_type'] =str(row[2])
				ResultRow['ss_extd_status'] =str(row[3]) #CodeToPayName[row[0]]
				ResultRow['ss_extd_no'] =row[4]
				ResultRow['ss_extd_hisno'] =row[5]
				ResultRow['ss_extd_platno'] = row[6]
				ResultRow['ss_extd_channel'] =row[7]
				if  row[7]!=None:
					ResultRow['ss_extd_channel']=CodeToPayName[str(row[7])]
				ResultRow['ss_extd_outinfo'] =row[8]
				ResultRow['ss_extd_ininfo'] =row[9]
				ResultRow['ss_extd_update'] =str(row[10]).split('.')[0]
				ResultRow['ss_extd_creator'] =row[11]
				ResultRow['ss_extd_id'] =row[12]
				if str(row[13]).find('PatientName')>0:
					ResultRow['PatientName'] = GetXMLNode(row[13],"PatientName")
				TableCount=TableCount+1
				ResultRow['id']=str(TableCount)
				if (int(Qparam['limit'])*(int(Qparam['page'])-1))<TableCount & TableCount<=(int(Qparam['limit'])*(int(Qparam['page']))):
					ResultSql.append(json.dumps(ResultRow,ensure_ascii=False))
			self.queryset = {
				'ResultSql' :ResultSql,
				'TableCount':str(TableCount),
			}
			self.msg="Success"
		except Exception as e:
			print ('queryRegException: '+e)
			self.result = str(e)
			ex = Exception(self)
		# 关闭数据库连接
		connection.close()

	def queryExtdetialMedical11(self,Qparam):#查询医保订单交易   GetInsuPayInfo()
		try:
			CodeToPayName = dict(WxPay="微信", AliPay="支付宝",JHZFYHK="银行卡",Pay="下单",Query="查询",notify="通知",Cancel="取消",Refund="退费",INSU="医保")
			print("Qparam-------------------------------------------------------",Qparam)
			cursor = connection.cursor()# 使用cursor()方法获取操作游标 
			sql = "SELECT ss_extd_code,"
			sql+="ss_extd_amt,"
			sql+="ss_extd_type,"
			sql+="ss_extd_status,"
			sql+="ss_extd_no,"
			sql+="ss_extd_hisno,"
			sql+="ss_extd_platno,"
			sql+="ss_extd_channel,"
			sql+="ss_extd_outinfo,"
			sql+="ss_extd_ininfo,"
			sql+="ss_extd_update,"
			sql+="ss_extd_creator,"
			sql+="ss_extd_id,code_val from ss_extdetails a LEFT JOIN patinfo b ON a.ss_extd_id=b.fk_businessmaster_id and b.code ='his_patinfo'and b.his_master_id !='' where "
			statut=""
			for key, value in Qparam.items(): 
				if key=="ss_extd_update":
					if value=="":
						value= datetime.now().strftime('%Y-%m-%d')
						sql=sql +" DATE_FORMAT(ss_extd_update,'%Y%M%D')="+"DATE_FORMAT('"+value+"','%Y%M%D')"
					else:
						#Endtime=(datetime.strptime(value.split(' ')[0],'%Y-%m-%d')+datetime.timedelta(days=1)).strftime('%Y-%m-%d')
						#sql=sql+" ss_extd_update>='"+ value +"'"+" and "+"ss_extd_update<'"+Endtime+"'"
						sql=sql +" DATE_FORMAT(ss_extd_update,'%Y%M%D')="+"DATE_FORMAT('"+value+"','%Y%M%D')"
				if  value=="":
					continue
				if key =="PatientName":
					sql=sql+"and "+"b.code_val like '%"+value+"%'"
				if key=="ss_extd_platno":
					sql=sql+" and "+"ss_extd_platno = "+"'"+value+"'"	
				if key=="ss_extd_hisno":
					sql=sql+" and "+"ss_extd_hisno = "+"'"+value+"'"
				if key=="ss_extd_channel":
					sql=sql+" and "+"ss_extd_channel = "+"'"+value+"'"
				if key=="ss_extd_type":
					sql=sql+" and "+"ss_extd_type = "+"'"+value+"'"	
				if key=="ss_extd_outinfo":
					statut=value
			sql=sql +" and IFNULL(ss_extd_channel,'')  = 'INSU'"
			print("查询第三方订单交易"+sql)
			TableCount=0#临时计算数量
			ResultSql=[]
			cursor.execute(sql)#执行数据库查询
			results = cursor.fetchall()# 获取所有记录列 表
			for row in results:
				ResultRow={}
				ResultRow['ss_extd_code'] =str(row[0])
				ResultRow['ss_extd_amt'] =GetShowInfo()
				ResultRow['ss_extd_type'] =str(row[2])
				ResultRow['ss_extd_status'] =str(row[3]) #CodeToPayName[row[0]]
				ResultRow['ss_extd_no'] =row[4]
				ResultRow['ss_extd_hisno'] =row[5]
				ResultRow['ss_extd_platno'] = row[6]
				ResultRow['ss_extd_channel'] =row[7]
				if  row[7]!=None:
					ResultRow['ss_extd_channel']=CodeToPayName[str(row[7])]
				ResultRow['ss_extd_outinfo'] =row[8]
				ResultRow['ss_extd_ininfo'] =row[9]
				ResultRow['ss_extd_update'] =str(row[10]).split('.')[0]
				ResultRow['ss_extd_creator'] =row[11]
				ResultRow['ss_extd_id'] =row[12]
				if str(row[13]).find('PatientName')>0:
					ResultRow['PatientName'] = GetXMLNode(row[13],"PatientName")
				TableCount=TableCount+1
				ResultRow['id']=str(TableCount)
				if (int(Qparam['limit'])*(int(Qparam['page'])-1))<TableCount & TableCount<=(int(Qparam['limit'])*(int(Qparam['page']))):
					ResultSql.append(json.dumps(ResultRow,ensure_ascii=False))
			self.queryset = {
				'ResultSql' :ResultSql,
				'TableCount':str(TableCount),
			}
			self.msg="Success"
			#self.result= 
		except Exception as e:
			print ('queryRegException: '+e)
			self.result = str(e)
			ex = Exception(self)
		# 关闭数据库连接
		connection.close()
#endregion

#region 订单查询
	def queryExtdetialQrcodeold(self,Qparam):#查询扫码交易
		try:
			CodeToPayName = dict(WxPay="微信", AliPay="支付宝",JHZFYHK="银行卡",INSU="医保",Query="查询",Refund="退费")
			print("Qparam-------------------------------------------------------",Qparam)
			cursor = connection.cursor()# 使用cursor()方法获取操作游标 
			sql = "SELECT   ss_extd_code,ss_extd_amt,ss_extd_type,ss_extd_status,ss_extd_no,ss_extd_hisno,ss_extd_platno,ss_extd_channel,ss_extd_outinfo,ss_extd_ininfo,ss_extd_update,ss_extd_creator,ss_extd_id,business_status,c.id AS contralid, modal_code,intef_code,intef_input,intef_output from ss_extdetails a LEFT JOIN business_master b on a.ss_extd_no=b.serial_number LEFT JOIN business_details c on  a.ss_extd_id=c.fk_businessmaster_id where "
			for key, value in Qparam.items(): 
				if key=="ss_extd_update":
					if value=="":
						sql=sql+" ss_extd_update !=''"
					else:
						Endtime=(datetime.strptime(value.split(' ')[0],'%Y-%m-%d')+datetime.timedelta(days=1)).strftime('%Y-%m-%d')
						sql=sql+" ss_extd_update>='"+ value +"'"+" and "+"ss_extd_update<'"+Endtime+"'"
				if  value=="":
					continue
				if key=="ss_extd_platno":
					sql=sql+" and "+"ss_extd_platno = "+"'"+value+"'"	
				if key=="ss_extd_no":
					sql=sql+" and "+"ss_extd_no = "+"'"+value+"'"	
				if key=="ss_extd_hisno":
					sql=sql+" and "+"ss_extd_hisno = "+"'"+value+"'"
				if key=="ss_extd_channel":
					sql=sql+" and "+"ss_extd_channel = "+"'"+value+"'"
				if key=="ss_extd_type":
					sql=sql+" and "+"ss_extd_type = "+"'"+value+"'"
				if key=="business_status":
					sql=sql+" and "+"business_status = "+"'"+value+"'"	
			sql=sql +" and ss_extd_channel is not NULL ORDER BY ss_extd_id,c.id DESC"
			print(sql)
			TableCount=0
			tmpextdid=""
			tmpresultcount=0#临时计算数量，因为在代码中加了判断个数，所以不能用limit
			ResultSql=[]
			cursor.execute(sql)#执行数据库查询
			results = cursor.fetchall()# 获取所有记录列 表
			for row in results:
				ResultRow={}
				ResultRow['ss_extd_amt'] =str(row[1])
				ResultRow['ss_extd_type'] =str(row[2]) #CodeToPayName[row[0]]
				ResultRow['ss_extd_no'] =row[4]
				ResultRow['ss_extd_hisno'] =row[5]
				ResultRow['ss_extd_platno'] = row[6]
				ResultRow['ss_extd_channel'] =row[7]
				ResultRow['ss_extd_outinfo'] =row[8]
				ResultRow['ss_extd_ininfo'] =row[9]
				ResultRow['ss_extd_update'] =str(row[10]).split('.')[0]
				ResultRow['ss_extd_creator'] =row[11]
				ResultRow['ss_extd_id'] =row[12]
				ResultRow['business_status'] =str(row[13])
				ResultRow['contralid'] =str(row[14])
				ResultRow['modal_code'] =str(row[15])
				ResultRow['intef_code'] =str(row[16])
				if tmpextdid!=str(row[12]):
					tmpextdid=row[12]
					TableCount=TableCount+1
					tmpresultcount=tmpresultcount+1
					if (int(Qparam['limit'])*(int(Qparam['page'])-1))<tmpresultcount & tmpresultcount<=(int(Qparam['limit'])*(int(Qparam['page']))):
						ResultSql.append(json.dumps(ResultRow,ensure_ascii=False))
			self.queryset = {
				'ResultSql' :ResultSql,
				'TableCount':str(TableCount),
			}
			self.msg="Success"
			#self.result= 
		except Exception as e:
			print ('queryRegException: '+e)
			self.result = str(e)
			ex = Exception(self)
		# 关闭数据库连接
		connection.close()

	def queryRefundOrder(self,Qparam):#查询退费订单
		try:
			CodeToPayName = dict(WECHAT="微信", AlIPAY="支付宝",JHZFYHK="银行卡",Pay="支付",Query="查询",Refund="退费",KLE="未维护")
			print("查询退费订单入参-------------------------------------------------------",Qparam)
			cursor = connection.cursor()# 使用cursor()方法获取操作游标 
			sql = "SELECT   fk_businessmaster_id,ss_ref_patname,ss_ref_patno,ss_ref_amt,ss_ref_platno,ss_ref_input,ss_ref_output,ss_ref_createdate,ss_ref_creator,ss_ref_hisno,ss_ref_status,ss_ref_type  from ss_refundsingle where ss_ref_patno !=''"
			for key, value in Qparam.items(): 
				if key=="ss_ref_createdate":
					if value=="":
						sql=sql+"and ss_ref_createdate !=''"
					else:
						Endtime=(datetime.strptime(value.split(' ')[0],'%Y-%m-%d')+timedelta(days=1)).strftime('%Y-%m-%d')
						sql=sql+"and ss_ref_createdate>='"+ value +"'"+" and "+"ss_ref_createdate<'"+Endtime+"'"
				if  value=="":
					continue
				if key=="ss_ref_patname":
					sql=sql+" and "+"ss_ref_patname = "+"'"+value+"'"	
				if key=="ss_ref_patno":
					sql=sql+" and "+"ss_ref_patno = "+"'"+value+"'"	
				if key=="ss_ref_platno":
					sql=sql+" and "+"ss_ref_platno = "+"'"+value+"'"
				if key=="ss_ref_amt":
					sql=sql+" and "+"ss_ref_amt = "+"'"+value+"'"
				if key=="ss_ref_hisno":
					sql=sql+" and "+"ss_ref_hisno = "+"'"+value+"'"
				if key=="ss_ref_status":
					sql=sql+" and "+"ss_ref_status = "+"'"+value+"'"
				if key=="ss_extd_channel":
					sql=sql+" and "+"ss_ref_type = "+"'"+value+"'"
			sql=sql +" ORDER BY ss_ref_createdate"
			print("查询退费订单入参查询语句"+sql)
			TableCount=0#临时计算数量，因为在代码中加了判断个数，所以不能用limit
			ResultSql=[]
			cursor.execute(sql)#执行数据库查询
			results = cursor.fetchall()# 获取所有记录列 表
			for row in results:
				ResultRow={}
				ResultRow['fk_businessmaster_id'] =str(row[0])
				ResultRow['ss_ref_patname'] =str(row[1]) #CodeToPayName[row[0]]
				ResultRow['ss_ref_patno'] =row[2]
				ResultRow['ss_ref_amt'] =row[3]
				ResultRow['ss_ref_platno'] = row[4]
				ResultRow['ss_ref_input'] =row[5]
				ResultRow['ss_ref_output'] =row[6]
				ResultRow['ss_ref_createdate'] =str(row[7])
				ResultRow['ss_ref_creator'] =row[8]
				ResultRow['ss_ref_hisno'] =row[9]
				ResultRow['ss_ref_status'] =row[10]
				ResultRow['ss_extd_channel'] =CodeToPayName[row[11]]
				TableCount=TableCount+1
				if (int(Qparam['limit'])*(int(Qparam['page'])-1))<TableCount & TableCount<=(int(Qparam['limit'])*(int(Qparam['page']))):
					ResultSql.append(json.dumps(ResultRow,ensure_ascii=False))
			self.queryset = {
				'ResultSql' :ResultSql,
				'TableCount':str(TableCount),
			}
			self.msg="Success"
		except Exception as e:
			print ('查询退费订单入参查询语句queryRefundOrder: '+e)
			self.result = str(e)
			ex = Exception(self)
		# 关闭数据库连接
		connection.close()
#endregion

	def QueryDoctorInfo(self,Qparam):  #查询医生列表
		try:
			print("Qparam-------------------------------------------------------",Qparam)
			cursor = connection.cursor()# 使用cursor()方法获取操作游标 
			sql = "select id, ss_dcp_code,ss_dcp_info,ss_dcp_createdate,ss_dcp_update from ss_docpicture where id!='' "
			for key, value in Qparam.items(): 
				if  value=="":
					continue
				if key=="ss_dcp_code":
					sql=sql+" and "+"ss_dcp_code = "+"'"+value+"'"	
			print(sql)
			ResultSql=[]
			cursor.execute(sql)#执行数据库查询
			TableCount=len(cursor.fetchall())
			sql=sql+" LIMIT "+str(int(Qparam['limit'])*(int(Qparam['page'])-1))+","+str(int(Qparam['limit']))
			cursor.execute(sql)#执行数据库查询
			results = cursor.fetchall()# 获取所有记录列 表
			print(sql)
			for row in results:
				ResultRow={}
				ResultRow['id'] = str(row[0])
				ResultRow['ss_dcp_code'] = str(row[1])
				ResultRow['ss_dcp_info'] = str(row[2])
				ResultRow['ss_dcp_createdate'] = str(row[3])
				ResultRow['ss_dcp_update'] = str(row[4])
				ResultSql.append(json.dumps(ResultRow,ensure_ascii=False))
			#print("-------------------------------------------------------",ResultSql)
			self.queryset = {
				'ResultSql' :ResultSql,
				'TableCount':str(TableCount),
				}
			self.msg="Success"
		except Exception as e:
			print ('queryRegException: '+e)
			self.result = str(e)
			ex = Exception(self)
			# 关闭数据库连接
		connection.close()

	def InsertDoctorInfo(self,Qparam): #插入医生信息
		try:
			print("Qparam-------------------------------------------------------",Qparam)
			cursor = connection.cursor()# 使用cursor()方法获取操作游标 
			sql = "select ss_dcp_code,ss_dcp_info from ss_docpicture where ss_dcp_code!='' "
			for key, value in Qparam.items(): 
				if value =="":
					continue
				if key =="ss_dcp_code":
					sql=sql+"and "+"ss_dcp_code = '"+value+"'"
				if key =="ss_dcp_info":
					sql=sql+"and "+"ss_dcp_info = '"+value+"'"
			print(sql)
			ResultSql=[]
			cursor.execute(sql)#执行数据库查询
			TableCount=len(cursor.fetchall())
			sql=sql+" LIMIT "+str(int(Qparam['limit'])*(int(Qparam['page'])-1))+","+str(int(Qparam['limit']))
			cursor.execute(sql)#执行数据库查询
			results = cursor.fetchall()# 获取所有记录列 表
			print(sql)
			for row in results:
				ResultRow={}
				ResultRow['ss_dcp_code'] = str(row[0])
				ResultRow['ss_dcp_info'] = str(row[1])
				ResultSql.append(json.dumps(ResultRow,ensure_ascii=False))
			#print("-------------------------------------------------------",ResultSql)
			self.queryset = {
				'ResultSql' :ResultSql,
				'TableCount':str(TableCount),
				}

			self.msg="Success"
		except Exception as e:
			print ('queryRegException: '+e)
			self.result = str(e)
			ex = Exception(self)
			# 关闭数据库连接
		connection.close()

#region 规则维护

	def QueryEqrdetailsInfo(self,Qparam):  #查询规则明细
		try:
			print("查询规则明细Qparam-----------------",Qparam)
			cursor = connection.cursor()# 使用cursor()方法获取操作游标 
			sql = "SELECT a.id,ss_eqrd_type,ss_eqrd_code,ss_eqrd_desc,ss_eqrd_createdate,ss_eqrd_update,ss_eqrd_stdate,ss_eqrd_enddate,ss_eqrd_actflag,ss_eqr_desc,ss_dic_desc from ss_eqrdetails a LEFT JOIN ss_dicdata b on a.ss_eqrd_code=b.ss_dic_code and b.ss_dic_type='Business' LEFT JOIN ss_eqrule c ON a.ss_eqrd_type=c.ss_eqr_type where ss_eqrd_code!=''  "
			for key, value in Qparam.items(): 
				if value =="":
					continue
				if key =="ss_eqrd_type":
					sql=sql+"and "+"ss_eqrd_type = '"+value+"'"
				if key =="ss_eqrd_code":
					sql=sql+"and "+"ss_eqrd_code = '"+value+"'"
				if key =="ss_eqrd_desc":
					sql=sql+"and "+"ss_eqrd_desc = '"+value+"'"
				if key =="ss_eqrd_createdate":
					sql=sql+"and "+"ss_eqrd_createdate = '"+value+"'"
				if key =="ss_eqrd_stdate":
					sql=sql+"and "+"ss_eqrd_stdate = '"+value+"'"
				if key =="ss_eqrd_enddate":
					sql=sql+"and "+"ss_eqrd_enddate = '"+value+"'"
				if key =="ss_eqrd_actflag":
					sql=sql+"and "+"ss_eqrd_actflag = '"+value+"'"
			ResultSql=[]
			print("查询规则明细"+sql)
			cursor.execute(sql)#执行数据库查询
			TableCount=len(cursor.fetchall())
			sql=sql+" ORDER BY a.id LIMIT "+str(int(Qparam['limit'])*(int(Qparam['page'])-1))+","+str(int(Qparam['limit']))
			print("查询规则明细"+sql)
			cursor.execute(sql)#执行数据库查询
			results = cursor.fetchall()# 获取所有记录列 表
			for row in results:
				ResultRow={}
				ResultRow['id'] = str(row[0])
				ResultRow['ss_eqrd_type'] = str(row[1])
				ResultRow['ss_eqrd_code'] = str(row[2])
				ResultRow['ss_eqrd_desc'] = str(row[3])
				ResultRow['ss_eqrd_createdate'] = str(row[4])
				ResultRow['ss_eqrd_update'] = str(row[5])
				ResultRow['ss_eqrd_stdate'] = str(row[6])
				ResultRow['ss_eqrd_enddate'] = str(row[7])
				ResultRow['ss_eqrd_actflag'] = str(row[8])
				ResultRow['ss_eqr_desc'] = str(row[9])
				ResultRow['ss_dic_desc'] = str(row[10])
				ResultSql.append(json.dumps(ResultRow,ensure_ascii=False))
			self.queryset = {
				'ResultSql' :ResultSql,
				'TableCount':str(TableCount),
				}
			self.msg="Success"
		except Exception as e:
			print ('queryRegException: '+e)
			self.result = str(e)
			ex = Exception(self)
			# 关闭数据库连接
		connection.close()

	def DeleteEqrdetailsInfo(self,Qparam):  #删除选中规则明细
		try:
			cursor = connection.cursor()# 使用cursor()方法获取操作游标 
			sql = "DELETE FROM selfservice.ss_eqrdetails where id='"+str(Qparam['id'])+"'"
			print(sql)
			ResultSql=[]
			cursor.execute(sql)#执行数据库删除
			results=cursor.fetchall()
			print("删除选中规则明细"+str(results))
			self.queryset = {
				'ResultSql' :ResultSql
				}
			self.msg="Success"
		except Exception as e:
			print ('queryRegException: '+e)
			self.result = str(e)
			ex = Exception(self)
			# 关闭数据库连接
		connection.close()

	def UpdateEqrdetailsInfo(self,Qparam):  #更新规则明细表
		try:
			cursor = connection.cursor()# 使用cursor()方法获取操作游标 
			updatedate=str(datetime.now().strftime('%Y-%m-%d %H:%M:%S'))
			print(Qparam)
			for key, value in Qparam.items(): 
				if value =="None":
					Qparam[key]=''
				if key=="ss_eqrd_createdate":
					if value =='None':
						Qparam[key]=updatedate
				if key=="ss_eqrd_stdate":
					if value =='None':
						Qparam[key]=updatedate
				if key=="ss_eqrd_enddate":
					if value =='None':
						Qparam[key]=updatedate
			if str(Qparam['id'])!="" :
				print("更新规则明细表id=",str(Qparam['id']))
				sql="UPDATE selfservice.ss_eqrdetails  SET "
				sql+="ss_eqrd_type='"+str(Qparam['ss_eqrd_type'])+"',"
				sql+="ss_eqrd_code='"+str(Qparam['ss_eqrd_code'])+"',"
				sql+="ss_eqrd_desc='"+str(Qparam['ss_eqrd_desc'])+"',"
				sql+="ss_eqrd_createdate='"+str(Qparam['ss_eqrd_createdate'])+"',"
				sql+="ss_eqrd_update='"+updatedate+"',"
				sql+="ss_eqrd_stdate='"+str(Qparam['ss_eqrd_stdate'])+"',"
				sql+="ss_eqrd_enddate='"+str(Qparam['ss_eqrd_enddate'])+"',"
				sql+="ss_eqrd_actflag='"+str(Qparam['ss_eqrd_actflag'])+"'"
				sql+="where id='"+str(Qparam['id'])+"'"
				print(sql)
			else :
				print("插入规则明细表id=",str(Qparam['id']))
				sql="INSERT INTO selfservice.ss_eqrdetails ( ss_eqrd_type, ss_eqrd_code, ss_eqrd_desc, ss_eqrd_createdate, ss_eqrd_update, ss_eqrd_stdate, ss_eqrd_enddate,ss_eqrd_actflag) VALUES("
				sql+="'"+str(Qparam['ss_eqrd_type'])+"',"
				sql+="'"+str(Qparam['ss_eqrd_code'])+"',"
				sql+="'"+str(Qparam['ss_eqrd_desc'])+"',"
				sql+="'"+str(Qparam['ss_eqrd_createdate'])+"',"
				sql+="'"+updatedate+"',"
				sql+="'"+str(Qparam['ss_eqrd_stdate'])+"',"
				sql+="'"+str(Qparam['ss_eqrd_enddate'])+"',"
				sql+="'"+str(Qparam['ss_eqrd_actflag'])+"')"
			cursor.execute(sql)#执行数据库查询
			ResultSql=[]
			results=cursor.fetchall()
			print("更新规则明细表"+str(results))
			self.queryset = {
				'ResultSql' :ResultSql
				}
			self.msg="Success"
		except Exception as e:
			print ('queryRegException: '+e)
			self.result = str(e)
			ex = Exception(self)
			# 关闭数据库连接
		connection.close()

	def QueryRulesInfo(self,Qparam):  #查询规则分类
		try:
			print("查询规则明细Qparam-----------------",Qparam)
			cursor = connection.cursor()# 使用cursor()方法获取操作游标 
			sql = "SELECT a.id,ss_eqrd_type,ss_eqrd_code,ss_eqrd_desc,ss_eqrd_createdate,ss_eqrd_update,ss_eqrd_stdate,ss_eqrd_enddate,ss_eqrd_actflag,ss_eqr_desc,ss_dic_desc from ss_eqrdetails a LEFT JOIN ss_dicdata b on a.ss_eqrd_code=b.ss_dic_code and b.ss_dic_type='Business' LEFT JOIN ss_eqrule c ON a.ss_eqrd_type=c.ss_eqr_type where ss_eqrd_code!=''  "
			for key, value in Qparam.items(): 
				if value =="":
					continue
				if key =="ss_eqrd_type":
					sql=sql+"and "+"ss_eqrd_type = '"+value+"'"
				if key =="ss_eqrd_code":
					sql=sql+"and "+"ss_eqrd_code = '"+value+"'"
				if key =="ss_eqrd_desc":
					sql=sql+"and "+"ss_eqrd_desc = '"+value+"'"
				if key =="ss_eqrd_createdate":
					sql=sql+"and "+"ss_eqrd_createdate = '"+value+"'"
				if key =="ss_eqrd_stdate":
					sql=sql+"and "+"ss_eqrd_stdate = '"+value+"'"
				if key =="ss_eqrd_enddate":
					sql=sql+"and "+"ss_eqrd_enddate = '"+value+"'"
				if key =="ss_eqrd_actflag":
					sql=sql+"and "+"ss_eqrd_actflag = '"+value+"'"
			ResultSql=[]
			print("查询规则明细"+sql)
			cursor.execute(sql)#执行数据库查询
			TableCount=len(cursor.fetchall())
			sql=sql+" ORDER BY a.id LIMIT "+str(int(Qparam['limit'])*(int(Qparam['page'])-1))+","+str(int(Qparam['limit']))
			print("查询规则明细"+sql)
			cursor.execute(sql)#执行数据库查询
			results = cursor.fetchall()# 获取所有记录列 表
			for row in results:
				ResultRow={}
				ResultRow['id'] = str(row[0])
				ResultRow['ss_eqrd_type'] = str(row[1])
				ResultRow['ss_eqrd_code'] = str(row[2])
				ResultRow['ss_eqrd_desc'] = str(row[3])
				ResultRow['ss_eqrd_createdate'] = str(row[4])
				ResultRow['ss_eqrd_update'] = str(row[5])
				ResultRow['ss_eqrd_stdate'] = str(row[6])
				ResultRow['ss_eqrd_enddate'] = str(row[7])
				ResultRow['ss_eqrd_actflag'] = str(row[8])
				ResultRow['ss_eqr_desc'] = str(row[9])
				ResultRow['ss_dic_desc'] = str(row[10])
				ResultSql.append(json.dumps(ResultRow,ensure_ascii=False))
			self.queryset = {
				'ResultSql' :ResultSql,
				'TableCount':str(TableCount),
				}
			self.msg="Success"
		except Exception as e:
			print ('queryRegException: '+e)
			self.result = str(e)
			ex = Exception(self)
			# 关闭数据库连接
		connection.close()

#endregion

#region  eqlistconfig
	def QueryEqlistConfigInfo(self,Qparam):  #查询设备配置维护列表
		try:
			cursor = connection.cursor()# 使用cursor()方法获取操作游标 
			sql = "SELECT "
			sql+="id,"
			sql+="ss_eqlistc_code,"
			sql+="ss_eqlistc_desc,"
			sql+="ss_eqlistc_cfgcode,"
			sql+="ss_eqlistc_cfgdesc,"
			sql+="ss_eqlistc_createdate,"
			sql+="ss_eqlistc_creator,"
			sql+="ss_eqlistc_update,"
			sql+="ss_eqlistc_upuser,"
			#sql+="ss_eqlistc_cfgvalue from ss_eqlistconfig  where ss_eqlistc_code='"
			sql+="ss_eqlistc_cfgvalue FROM ss_eqlistconfig where ss_eqlistc_code IS NOT NULL "
			for key, value in Qparam.items(): 
				if value =="":
					continue
				if key =="id":
					sql=sql+"and "+"id = '"+value+"'"
				if key =="usercode":
					sql=sql+"and "+"ss_eqlistc_code = '"+value+"'"
				if key =="ss_eqlistc_cfgcode":
					sql=sql+"and "+"ss_eqlistc_cfgcode = '"+value+"'"
				if key =="ss_eqlistc_update":
					sql=sql+"and "+"ss_eqlistc_update >= '"+value+"'"
				if key =="ss_eqlistc_cfgvalue":
					sql=sql+"and "+"ss_eqlistc_cfgvalue = '"+value+"'"
			ResultSql=[]
			rescount=0
			cursor.execute(sql)#执行数据库查询
			TableCount=len(cursor.fetchall())
			sql=sql+"GROUP BY ss_eqlistc_cfgcode ORDER BY id LIMIT "+str(int(Qparam['limit'])*(int(Qparam['page'])-1))+","+str(int(Qparam['limit']))
			#print("查询设备配置维护列表"+sql)
			cursor.execute(sql)#执行数据库查询
			results = cursor.fetchall()# 获取所有记录列 表
			for row in results:
				ResultRow={}
				ResultRow['id'] = str(row[0])
				ResultRow['ss_eqlistc_code'] = str(row[1])
				ResultRow['ss_eqlistc_desc'] = str(row[2])
				ResultRow['ss_eqlistc_cfgcode'] = str(row[3])
				ResultRow['ss_eqlistc_cfgdesc'] = str(row[4])
				ResultRow['ss_eqlistc_createdate'] = str(row[5])
				ResultRow['ss_eqlistc_creator'] = str(row[6])
				ResultRow['ss_eqlistc_update'] = str(row[7])
				ResultRow['ss_eqlistc_upuser'] = str(row[8])
				ResultRow['ss_eqlistc_cfgvalue'] = str(row[9])
				ResultRow['resid'] = str(rescount)
				rescount+=1
				ResultSql.append(json.dumps(ResultRow,ensure_ascii=False))
			self.queryset = {
				'ResultSql' :ResultSql,
				'TableCount':str(TableCount),
				}
			self.msg="Success"
		except Exception as e:
			print ('QueryEqlistConfigInfoException: '+e)
			self.result = str(e)
			ex = Exception(self)
			# 关闭数据库连接
		connection.close()

	def DeleteEqlistConfigInfo(self,Qparam):  #删除设备配置维护列表
		try:
			cursor = connection.cursor()# 使用cursor()方法获取操作游标 
			print(Qparam)
			sql = "DELETE FROM selfservice.ss_eqlistconfig where ss_eqlistc_cfgcode='"+str(Qparam['ss_eqlistc_cfgcode'])+"' and ss_eqlistc_code='"+str(Qparam['ss_eqlistc_code'])+"'"
			print("删除设备配置维护列表"+sql)
			ResultSql=[]
			cursor.execute(sql)#执行数据库删除
			results=cursor.fetchall()
			print("删除选中规则明细"+str(results))
			self.queryset = {
				'ResultSql' :ResultSql
				}
			self.msg="Success"
		except Exception as e:
			print ('queryRegException: '+e)
			self.result = str(e)
			ex = Exception(self)
			# 关闭数据库连接
		connection.close()
	def DeleteEqlistConfigDetailInfo(self,Qparam):  #删除设备配置维护列表明细
		try:
			cursor = connection.cursor()# 使用cursor()方法获取操作游标 
			print(Qparam)
			sql = "DELETE FROM selfservice.ss_eqlistconfig where ss_eqlistc_cfgcode='"+str(Qparam['ss_eqlistc_cfgcode'])+"' and ss_eqlistc_code='"+str(Qparam['ss_eqlistc_code'])+"' and id='"+str(Qparam['id'])+"'"
			print("删除设备配置维护列表"+sql)
			ResultSql=[]
			cursor.execute(sql)#执行数据库删除
			results=cursor.fetchall()
			print("删除选中规则明细"+str(results))
			self.queryset = {
				'ResultSql' :ResultSql
				}
			self.msg="Success"
		except Exception as e:
			print ('queryRegException: '+e)
			self.result = str(e)
			ex = Exception(self)
			# 关闭数据库连接
		connection.close()
	def QueryEqlistConfigcfg(self,Qparam):#查询所有配置分类名称
		try:
			cursor = connection.cursor()# 使用cursor()方法获取操作游标 
			sql = "SELECT ss_eqlistc_cfgcode,ss_eqlistc_cfgdesc from ss_eqlistconfig where ss_eqlistc_cfgcode IS NOT NULL "
			for key, value in Qparam.items(): 
				if value =="":
					continue
				if key =="ss_eqlistc_cfgcode":
					sql=sql+"and "+"ss_eqlistc_cfgcode = '"+value+"'"
			# 	if key =="id":
			#		sql=sql+"and "+"id = '"+value+"'" 
			sql+=" GROUP BY ss_eqlistc_cfgcode"
			ResultSql=[]
			cursor.execute(sql)#执行数据库查询
			results = cursor.fetchall()# 获取所有记录列 表
			for row in results:
				ResultRow={}
				ResultRow['ss_eqlistc_cfgcode'] = row[0]
				ResultRow['ss_eqlistc_cfgdesc'] = row[1]
				ResultSql.append(json.dumps(ResultRow,ensure_ascii=False))
				self.queryset = ResultSql
				self.msg="Success"
		except Exception as e:
			print ('queryTradeTypeException: '+e)
			self.result = str(e)
			ex = Exception(self)
			# 关闭数据库连接
		connection.close()

	def UpdateEqlistConfigcfg(self,Qparam):  #更新配置分类
		try:
			print("更新配置分类",Qparam)
			cursor = connection.cursor()# 使用cursor()方法获取操作游标 
			updatedate=str(datetime.now().strftime('%Y-%m-%d %H:%M:%S'))
			for key, value in Qparam.items(): 
				if value =="None":
					Qparam[key]=''
			if str(Qparam['id'])!="" :
				if str(Qparam['updatetype'])=='0':#更新分类
					sql="UPDATE selfservice.ss_eqlistconfig  SET "
					sql+="ss_eqlistc_code='"+str(Qparam['ss_eqlistc_code'])+"',"
					sql+="ss_eqlistc_desc='"+str(Qparam['ss_eqlistc_desc'])+"',"
					sql+="ss_eqlistc_cfgcode='"+str(Qparam['ss_eqlistc_cfgcode'])+"',"
					sql+="ss_eqlistc_cfgdesc='"+str(Qparam['ss_eqlistc_cfgdesc'])+"',"
					sql+="ss_eqlistc_createdate='"+str(Qparam['ss_eqlistc_createdate'])+"',"
					sql+="ss_eqlistc_update='"+str(Qparam['ss_eqlistc_update'])+"' "
					sql+="where id='"+str(Qparam['id'])+"'"
				else:#更新分类明细
					sql="UPDATE selfservice.ss_eqlistconfig  SET "
					sql+="ss_eqlistc_code='"+str(Qparam['ss_eqlistc_code'])+"',"
					sql+="ss_eqlistc_desc='"+str(Qparam['ss_eqlistc_desc'])+"',"
					sql+="ss_eqlistc_cfgcode='"+str(Qparam['ss_eqlistc_cfgcode'])+"',"
					sql+="ss_eqlistc_cfgdesc='"+str(Qparam['ss_eqlistc_cfgdesc'])+"',"
					sql+="ss_eqlistc_createdate='"+str(updatedate)+"',"
					sql+="ss_eqlistc_update='"+str(updatedate)+"',"
					sql+="ss_eqlistc_cfgvalue='"+str(Qparam['ss_dic_code'])+"' "
					sql+="where id='"+str(Qparam['id'])+"'"
					print(sql)
			else :
				if str(Qparam['updatetype'])=='0':#更新分类
					sql="INSERT INTO selfservice.ss_eqlistconfig ( ss_eqlistc_code, ss_eqlistc_desc,ss_eqlistc_cfgcode, ss_eqlistc_cfgdesc, ss_eqlistc_createdate, ss_eqlistc_update) VALUES("
					sql+="'"+str(Qparam['ss_eqlistc_code'])+"',"
					sql+="'"+str(Qparam['ss_eqlistc_desc'])+"',"
					sql+="'"+str(Qparam['ss_eqlistc_cfgcode'])+"',"
					sql+="'"+str(Qparam['ss_eqlistc_cfgdesc'])+"',"
					sql+="'"+str(Qparam['ss_eqlistc_createdate'])+"',"
					sql+="'"+str(Qparam['ss_eqlistc_update'])+"')"
				else:
					sql="INSERT INTO selfservice.ss_eqlistconfig ( ss_eqlistc_code, ss_eqlistc_desc,ss_eqlistc_cfgcode, ss_eqlistc_cfgdesc, ss_eqlistc_createdate,ss_eqlistc_cfgvalue, ss_eqlistc_update) VALUES("
					sql+="'"+str(Qparam['ss_eqlistc_code'])+"',"
					sql+="'"+str(Qparam['ss_eqlistc_desc'])+"',"
					sql+="'"+str(Qparam['ss_eqlistc_cfgcode'])+"',"
					sql+="'"+str(Qparam['ss_eqlistc_cfgdesc'])+"',"
					sql+="'"+str(Qparam['ss_eqlistc_createdate'])+"',"
					sql+="'"+str(Qparam['ss_dic_code'])+"',"
					sql+="'"+str(Qparam['ss_eqlistc_update'])+"')"
			print("更新配置分类"+sql)
			cursor.execute(sql)#执行数据库查询
			ResultSql=[]
			results=cursor.fetchall()
			print("更新规则明细表"+str(results))
			self.queryset = {
				'ResultSql' :ResultSql
				}
			self.msg="Success"
		except Exception as e:
			print ('UpdateEqlistConfigcfgException: '+e)
			self.result = str(e)
			ex = Exception(self)
			# 关闭数据库连接
		connection.close()

	def QueryEqlistConfigDtailInfo(self,Qparam):  #查询设备配置明细列表
		try:
			#print("查询设备配置明细列表-----------------",Qparam)
			cursor = connection.cursor()# 使用cursor()方法获取操作游标 
			sql = "SELECT "
			sql+="a.id,"
			sql+="ss_eqlistc_code,"
			sql+="ss_eqlistc_desc,"
			sql+="ss_eqlistc_cfgcode,"
			sql+="ss_eqlistc_cfgdesc,"
			sql+="ss_eqlistc_update,"
			sql+="ss_eqlistc_cfgvalue,"
			sql+="ss_dic_desc "
			#sql+="ss_eqlistc_cfgvalue from ss_eqlistconfig  where ss_eqlistc_code='"
			sql+="FROM ss_eqlistconfig a LEFT JOIN ss_dicdata b ON a.ss_eqlistc_cfgcode=b.ss_dic_type  and a.ss_eqlistc_cfgvalue=b.ss_dic_code where ss_eqlistc_code IS NOT NULL "
			#print("查询设备配置明细列表"+sql)
			for key, value in Qparam.items(): 
				if value =="":
					continue
				if key =="ss_eqlistc_code":
					sql=sql+"and "+"ss_eqlistc_code = '"+value+"'"
				if key =="ss_eqlistc_cfgcode":
					sql=sql+"and "+"ss_eqlistc_cfgcode = '"+value+"'"
			ResultSql=[]
			rescount=0
			cursor.execute(sql)#执行数据库查询
			TableCount=len(cursor.fetchall())
			sql=sql+" ORDER BY id LIMIT "+str(int(Qparam['limit'])*(int(Qparam['page'])-1))+","+str(int(Qparam['limit']))
			#print("查询设备配置明细列表"+sql)
			cursor.execute(sql)#执行数据库查询
			results = cursor.fetchall()# 获取所有记录列 表
			for row in results:
				ResultRow={}
				ResultRow['id'] = str(row[0])
				ResultRow['ss_eqlistc_code'] = str(row[1])
				ResultRow['ss_eqlistc_desc'] = str(row[2])
				ResultRow['ss_eqlistc_cfgcode'] = str(row[3])
				ResultRow['ss_eqlistc_cfgdesc'] = str(row[4])
				ResultRow['ss_eqlistc_update'] = str(row[5])
				ResultRow['ss_eqlistc_cfgvalue'] = str(row[6])
				ResultRow['ss_dic_desc'] = str(row[7])
				ResultRow['resid'] = str(rescount)
				rescount+=1
				ResultSql.append(json.dumps(ResultRow,ensure_ascii=False))
			self.queryset = {
				'ResultSql' :ResultSql,
				'TableCount':str(TableCount),
				}
			self.msg="Success"
		except Exception as e:
			print ('QueryEqlistConfigDtailInfoException: '+e)
			self.result = str(e)
			ex = Exception(self)
			# 关闭数据库连接
		connection.close()

	def QueryEqlistConfigtype(self,Qparam):#查询所有配置
		try:
			cursor = connection.cursor()# 使用cursor()方法获取操作游标 
			sql = "SELECT ss_dic_code,ss_dic_desc,ss_dic_concode from ss_dicdata where ss_dic_type IS NOT NULL "
			for key, value in Qparam.items(): 
				if value =="":
					continue
				if key =="ss_eqlistc_cfgcode":
					sql=sql+"and "+"ss_dic_type = '"+value+"'"
				if key =="ss_dic_type":
					sql=sql+"and "+"ss_dic_type = '"+value+"'"
				if key =="ss_eqlistc_cfgvalue":
					sql=sql+"and "+"ss_dic_code = '"+value+"'"
				if key =="ss_dic_code":
					sql=sql+"and "+"ss_dic_code = '"+value+"'"
			# 	if key =="id":
			#		sql=sql+"and "+"id = '"+value+"'" 
			print("查询所有配置"+sql)
			ResultSql=[]
			cursor.execute(sql)#执行数据库查询
			results = cursor.fetchall()# 获取所有记录列 表
			for row in results:
				ResultRow={}
				ResultRow['ss_dic_code'] = row[0]
				ResultRow['ss_dic_desc'] = row[1]
				ResultRow['ss_dic_concode'] = row[2]
				ResultSql.append(json.dumps(ResultRow,ensure_ascii=False))
			self.queryset = ResultSql
			self.result= "0"
			self.msg="Success"
		except Exception as e:
			print ('QueryEqlistConfigtypeException: '+e)
			self.result = str(e)
			ex = Exception(self)
			# 关闭数据库连接
		connection.close()

#endregion

#region 主菜单配置 ss_processconfig->menu

	def QueryprocessconfigMenu(self,Qparam):  #查询主菜单配置
		try:
			cursor = connection.cursor()# 使用cursor()方法获取操作游标 
			sql = "SELECT "
			sql+="a.id,"
			sql+="ss_pc_dictype,"
			sql+="ss_pc_diccode,"
			sql+="ss_pc_dicdesc,"
			sql+="ss_pc_demo,"
			sql+="ss_pc_createdate,"
			sql+="ss_pc_processcode,"
			sql+="ss_dic_desc,"
			sql+="ss_pc_update"
			#sql+="ss_eqlistc_cfgvalue from ss_eqlistconfig  where ss_eqlistc_code='"
			sql+=" from ss_processconfig a LEFT JOIN ss_dicdata b on a.ss_pc_diccode=b.ss_dic_code where ss_dic_type='MainMenu' and ss_pc_dictype='Menu' "
			for key, value in Qparam.items(): 
				if value =="":
					continue
				if key =="id":
					sql=sql+"and "+"id = '"+value+"'"
				if key =="ss_pc_diccode":
					sql=sql+"and "+"ss_pc_diccode = '"+value+"'"
			ResultSql=[]
			rescount=0
			cursor.execute(sql)#执行数据库查询
			TableCount=len(cursor.fetchall())
			sql=sql+" Limit "+str((int(Qparam['limit'])-1)*(int(Qparam['page'])-1))+","+str(int(Qparam['limit'])-1)
			print("查询主菜单配置"+sql)
			cursor.execute(sql)#执行数据库查询
			results = cursor.fetchall()# 获取所有记录列 表
			for row in results:
				ResultRow={}
				ResultRow['id'] = str(row[0])
				ResultRow['ss_pc_dictype'] = str(row[1])
				ResultRow['ss_pc_diccode'] = str(row[2])
				ResultRow['ss_pc_dicdesc'] = str(row[3])
				ResultRow['ss_pc_demo'] = str(row[4])
				ResultRow['ss_pc_createdate'] = str(row[5])
				ResultRow['ss_pc_processcode'] = str(row[6])
				ResultRow['ss_dic_desc'] = str(row[7])
				ResultRow['resid'] = str(rescount)
				ResultRow['ss_pc_update'] = str(row[8])
				rescount+=1
				ResultSql.append(json.dumps(ResultRow,ensure_ascii=False))
			self.queryset = {
				'ResultSql' :ResultSql,
				'TableCount':str(TableCount),
				}
			self.msg="Success"
		except Exception as e:
			print ('QueryprocessconfigException: '+e)
			self.result = str(e)
			ex = Exception(self)
			# 关闭数据库连接
		connection.close()
	
	def QueryprocessconfigMenutype(self,Qparam):#查询主菜单所有配置
		try:
			cursor = connection.cursor()# 使用cursor()方法获取操作游标 
			sql = "SELECT ss_dic_code,ss_dic_desc,ss_pc_demo from ss_dicdata a LEFT JOIN ss_processconfig b on a.ss_dic_code=b.ss_pc_diccode and b.ss_pc_dictype='Menu' where ss_dic_type IS NOT NULL "
			for key, value in Qparam.items(): 
				if value =="":
					continue
				if key =="ss_eqlistc_cfgcode":
					sql=sql+"and "+"ss_dic_type = '"+value+"'"
				if key =="ss_dic_type":
					sql=sql+"and "+"ss_dic_type = '"+value+"'"
				if key =="ss_eqlistc_cfgvalue":
					sql=sql+"and "+"ss_dic_code = '"+value+"'"
				if key =="ss_dic_code":
					sql=sql+"and "+"ss_dic_code = '"+value+"'"
			# 	if key =="id":
			#		sql=sql+"and "+"id = '"+value+"'" 
			print("查询所有配置"+sql)
			ResultSql=[]
			cursor.execute(sql)#执行数据库查询
			results = cursor.fetchall()# 获取所有记录列 表
			for row in results:
				ResultRow={}
				ResultRow['ss_dic_code'] = row[0]
				ResultRow['ss_dic_desc'] = row[1]
				ResultRow['ss_pc_demo'] = row[2]
				ResultSql.append(json.dumps(ResultRow,ensure_ascii=False))
			self.queryset = ResultSql
			self.result= "0"
			self.msg="Success"
		except Exception as e:
			print ('QueryEqlistConfigtypeException: '+e)
			self.result = str(e)
			ex = Exception(self)
			# 关闭数据库连接
		connection.close()

	def DeleteprocessconfigMenu(self,Qparam):  #删除主菜单维护列表
		try:
			cursor = connection.cursor()# 使用cursor()方法获取操作游标 
			sql = "DELETE FROM selfservice.ss_processconfig where id='"+str(Qparam['id'])+"'"
			print("删除设备配置维护列表"+sql)
			ResultSql=[]
			cursor.execute(sql)#执行数据库删除
			results=cursor.fetchall()
			print("删除选中规则明细"+str(results))
			self.queryset = {
				'ResultSql' :ResultSql
				}
			self.msg="Success"
		except Exception as e:
			print ('DeleteprocessconfigMenuException: '+e)
			self.result = str(e)
			ex = Exception(self)
			# 关闭数据库连接
		connection.close()

	def InsertprocessconfigMenu(self,Qparam):  #插入或者更新主页菜单配置
		try:
			print("插入主页菜单配置",Qparam)
			cursor = connection.cursor()# 使用cursor()方法获取操作游标 
			updatedate=str(datetime.now().strftime('%Y-%m-%d %H:%M:%S'))
			for key, value in Qparam.items(): 
				if value =="None"or value =='null':
					Qparam[key]=''
				if key=="ss_pc_createdate":
					if value =='None':
						Qparam[key]=updatedate
				if key=="ss_pc_update":
					if value =='None'or value =='null':
						Qparam[key]=updatedate
			if str(Qparam['id'])!="" :
				sql="UPDATE selfservice.ss_processconfig  SET "
				sql+="ss_pc_dictype='Menu',"
				sql+="ss_pc_diccode='"+str(Qparam['ss_pc_diccode'])+"',"
				sql+="ss_pc_dicdesc='"+str(Qparam['ss_dic_desc'])+"',"
				sql+="ss_pc_demo='"+str(Qparam['ss_pc_demo'])+"',"
				sql+="ss_pc_createdate='"+str(Qparam['ss_pc_createdate'])+"',"
				sql+="ss_pc_update='"+str(Qparam['ss_pc_update'])+"'"
				sql+="where id='"+str(Qparam['id'])+"'"
			else :
				sql="INSERT INTO selfservice.ss_processconfig ( ss_pc_dictype, ss_pc_diccode,ss_pc_dicdesc, ss_pc_demo, ss_pc_createdate,ss_pc_update) VALUES("
				sql+="'Menu',"
				sql+="'"+str(Qparam['ss_pc_diccode'])+"',"
				sql+="'"+str(Qparam['ss_dic_desc'])+"',"
				sql+="'"+str(Qparam['ss_pc_demo'])+"',"
				sql+="'"+str(Qparam['ss_pc_createdate'])+"',"
				sql+="'"+str(Qparam['ss_pc_update'])+"')"
			print("插入主页菜单配置"+sql)
			cursor.execute(sql)#执行数据库查询
			ResultSql=[]
			results=cursor.fetchall()
			print("插入主页菜单配置"+str(results))
			self.queryset = {
				'ResultSql' :ResultSql
				}
			self.msg="Success"
		except Exception as e:
			print ('InsertprocessconfigMenuException: '+e)
			self.result = str(e)
			ex = Exception(self)
			# 关闭数据库连接
		connection.close()

#endregion

#region 流程配置 ss_processconfig->Business

	def QueryprocessconfigBusiness(self,Qparam):  #查询流程配置
		try:
			cursor = connection.cursor()# 使用cursor()方法获取操作游标 
			sql = "SELECT "
			sql+="a.id,"
			sql+="ss_pc_dictype,"
			sql+="ss_pc_diccode,"
			sql+="ss_pc_dicdesc,"
			sql+="ss_pc_demo,"
			sql+="ss_pc_createdate,"
			sql+="ss_pc_processcode,"
			sql+="ss_dic_desc,"
			sql+="ss_pc_update"
			#sql+="ss_eqlistc_cfgvalue from ss_eqlistconfig  where ss_eqlistc_code='"
			sql+=" from ss_processconfig a LEFT JOIN ss_dicdata b on a.ss_pc_diccode=b.ss_dic_code where ss_dic_type='Business' and ss_pc_dictype='Business' "
			for key, value in Qparam.items(): 
				if value =="":
					continue
				if key =="id":
					sql=sql+"and "+"id = '"+value+"'"
				if key =="ss_pc_diccode":
					sql=sql+"and "+"ss_pc_diccode = '"+value+"'"
			ResultSql=[]
			rescount=0
			cursor.execute(sql)#执行数据库查询
			TableCount=len(cursor.fetchall())
			sql=sql+" Limit "+str((int(Qparam['limit'])-1)*(int(Qparam['page'])-1))+","+str(int(Qparam['limit'])-1)
			print("查询流程配置"+sql)
			cursor.execute(sql)#执行数据库查询
			results = cursor.fetchall()# 获取所有记录列 表
			for row in results:
				ResultRow={}
				ResultRow['id'] = str(row[0])
				ResultRow['ss_pc_dictype'] = str(row[1])
				ResultRow['ss_pc_diccode'] = str(row[2])
				ResultRow['ss_pc_dicdesc'] = str(row[3])
				ResultRow['ss_pc_demo'] = str(row[4])
				ResultRow['ss_pc_createdate'] = str(row[5])
				ResultRow['ss_pc_processcode'] = str(row[6])
				ResultRow['ss_dic_desc'] = str(row[7])
				ResultRow['resid'] = str(rescount)
				ResultRow['ss_pc_update'] = str(row[8])
				rescount+=1
				ResultSql.append(json.dumps(ResultRow,ensure_ascii=False))
			self.queryset = {
				'ResultSql' :ResultSql,
				'TableCount':str(TableCount),
				}
			self.msg="Success"
		except Exception as e:
			print ('QueryprocessconfigException: '+e)
			self.result = str(e)
			ex = Exception(self)
			# 关闭数据库连接
		connection.close()
	
	def QueryprocessconfigBusinesstype(self,Qparam):#查询流程所有配置
		try:
			cursor = connection.cursor()# 使用cursor()方法获取操作游标 
			sql = "SELECT ss_dic_code,ss_dic_desc,ss_pc_demo,ss_pc_processcode from ss_dicdata a LEFT JOIN ss_processconfig b on b.ss_pc_dictype='Business' and a.ss_dic_code=b.ss_pc_processcode where ss_dic_type IS NOT NULL "
			for key, value in Qparam.items(): 
				if value =="":
					continue
				if key =="ss_eqlistc_cfgcode":
					sql=sql+"and "+"ss_dic_type = '"+value+"'"
				if key =="ss_dic_type":
					sql=sql+"and "+"ss_dic_type = '"+value+"'"
				if key =="ss_eqlistc_cfgvalue":
					sql=sql+"and "+"ss_dic_code = '"+value+"'"
				if key =="ss_dic_code":
					sql=sql+"and "+"ss_dic_code = '"+value+"'"
			# 	if key =="id":
			#		sql=sql+"and "+"id = '"+value+"'" 
			#print("查询查询流程所有配置"+sql)
			ResultSql=[]
			cursor.execute(sql)#执行数据库查询
			results = cursor.fetchall()# 获取所有记录列 表
			for row in results:
				ResultRow={}
				ResultRow['ss_dic_code'] = row[0]
				ResultRow['ss_dic_desc'] = row[1]
				ResultRow['ss_pc_demo'] = str(row[2])
				ResultRow['ss_pc_processcode'] = row[3]
				ResultSql.append(json.dumps(ResultRow,ensure_ascii=False))
			self.queryset = ResultSql
			self.result= "0"
			self.msg="Success"
		except Exception as e:
			print ('QueryprocessconfigBusinesstypeException: '+e)
			self.result = str(e)
			ex = Exception(self)
			# 关闭数据库连接
		connection.close()

	def DeleteprocessconfigBusiness(self,Qparam):  #删除流程配置
		try:
			cursor = connection.cursor()# 使用cursor()方法获取操作游标 
			sql = "DELETE FROM selfservice.ss_processconfig where id='"+str(Qparam['id'])+"'"
			print("删除流程配置"+sql)
			ResultSql=[]
			cursor.execute(sql)#执行数据库删除
			results=cursor.fetchall()
			print("删除流程配置返回"+str(results))
			self.queryset = {
				'ResultSql' :ResultSql
				}
			self.msg="Success"
		except Exception as e:
			print ('DeleteprocessconfigBusinessException: '+e)
			self.result = str(e)
			ex = Exception(self)
			# 关闭数据库连接
		connection.close()

	def InsertprocessconfigBusiness(self,Qparam):  #插入或者更新流程配置
		try:
			cursor = connection.cursor()# 使用cursor()方法获取操作游标 
			updatedate=str(datetime.now().strftime('%Y-%m-%d %H:%M:%S'))
			for key, value in Qparam.items(): 
				if value =="None"or value =='null':
					Qparam[key]=''
				if key=="ss_pc_createdate":
					if value =='None':
						Qparam[key]=updatedate
				if key=="ss_pc_update":
					if value =='None'or value =='null':
						Qparam[key]=updatedate
			print("插入流程配置",Qparam)
			if str(Qparam['id'])!="" :
				sql="UPDATE selfservice.ss_processconfig  SET "
				sql+="ss_pc_dictype='Business',"
				sql+="ss_pc_diccode='"+str(Qparam['ss_pc_diccode'])+"',"
				sql+="ss_pc_dicdesc='"+str(Qparam['ss_pc_dicdesc'])+"',"
				sql+="ss_pc_demo='"+str(Qparam['ss_pc_demo'])+"',"
				sql+="ss_pc_createdate='"+str(Qparam['ss_pc_createdate'])+"',"
				sql+="ss_pc_update='"+str(Qparam['ss_pc_update'])+"',"
				sql+="ss_pc_processcode='"+str(Qparam['ss_pc_processcode'])+"'"
				sql+="where id='"+str(Qparam['id'])+"'"
			else :
				sql="INSERT INTO selfservice.ss_processconfig ( ss_pc_dictype, ss_pc_diccode,ss_pc_dicdesc, ss_pc_demo, ss_pc_createdate,ss_pc_update,ss_pc_processcode) VALUES("
				sql+="'Business',"
				sql+="'"+str(Qparam['ss_pc_diccode'])+"',"
				sql+="'"+str(Qparam['ss_pc_dicdesc'])+"',"
				sql+="'"+str(Qparam['ss_pc_demo'])+"',"
				sql+="'"+str(Qparam['ss_pc_createdate'])+"',"
				sql+="'"+str(Qparam['ss_pc_update'])+"',"
				sql+="'"+str(Qparam['ss_pc_processcode'])+"')"
			print("插入流程配置"+sql)
			cursor.execute(sql)#执行数据库查询
			ResultSql=[]
			results=cursor.fetchall()
			print("插入流程配置"+str(results))
			self.queryset = {
				'ResultSql' :ResultSql
				}
			self.msg="Success"
		except Exception as e:
			print ('DeleteprocessconfigBusinessException: '+e)
			self.result = str(e)
			ex = Exception(self)
			# 关闭数据库连接
		connection.close()

#endregion

#region east.html、west.html
	def QueryMasterPersent(self,Qparam):  #查询挂号缴费业务，以及成功笔数和百分比
		try:
			cursor = connection.cursor()# 使用cursor()方法获取操作游标 
			DateValue= '2021-09-26'#(date.today() + timedelta(days = -1)).strftime("%Y-%m-%d")
			sql = "SELECT "
			sql+="(select count(*)from business_master where code='Reg' "+"and  DATE_FORMAT(business_date,'%Y%M%D')="+"DATE_FORMAT('"+DateValue+"','%Y%M%D')"" ) as 'Reg',"
			sql+="(select count(*)from business_master where code='Reg' "+"and  DATE_FORMAT(business_date,'%Y%M%D')="+"DATE_FORMAT('"+DateValue+"','%Y%M%D')"" ) as 'RegSeccsess',"
			sql+="(select count(*)from business_master where code='Charge' "+"and  DATE_FORMAT(business_date,'%Y%M%D')="+"DATE_FORMAT('"+DateValue+"','%Y%M%D')"" )as 'Charge',"
			sql+="(select count(*)from business_master where code='Charge' "+"and  DATE_FORMAT(business_date,'%Y%M%D')="+"DATE_FORMAT('"+DateValue+"','%Y%M%D')"" )as 'ChargeSeccsess',"
			sql+="(select count(*)from business_master where code='ORDR' "+"and  DATE_FORMAT(business_date,'%Y%M%D')="+"DATE_FORMAT('"+DateValue+"','%Y%M%D')"" ) as 'ORDR',"
			sql+="(select count(*)from business_master where code='ORDR' "+"and  DATE_FORMAT(business_date,'%Y%M%D')="+"DATE_FORMAT('"+DateValue+"','%Y%M%D')"" ) as 'ORDRSeccsess',"
			sql+="(select count(*)from business_master where code='OBTNO' "+"and  DATE_FORMAT(business_date,'%Y%M%D')="+"DATE_FORMAT('"+DateValue+"','%Y%M%D')"" ) as 'OBTNO' ,"
			sql+="(select count(*)from business_master where code='OBTNO' "+"and  DATE_FORMAT(business_date,'%Y%M%D')="+"DATE_FORMAT('"+DateValue+"','%Y%M%D')"" ) as 'OBTNOSeccsess',"
			sql+="(select count(*)from business_master where code='Reg' "+"and  DATE_FORMAT(business_date,'%Y%M%D%H')="+"DATE_FORMAT('"+DateValue+" 7','%Y%M%D%H')"" ) as 'RegSeven',"
			sql+="(select count(*)from business_master where code='Reg' "+"and  DATE_FORMAT(business_date,'%Y%M%D%H')="+"DATE_FORMAT('"+DateValue+" 8','%Y%M%D%H')"" ) as 'RegEight',"
			sql+="(select count(*)from business_master where code='Reg' "+"and  DATE_FORMAT(business_date,'%Y%M%D%H')="+"DATE_FORMAT('"+DateValue+" 9','%Y%M%D%H')"" ) as 'RegNine',"
			sql+="(select count(*)from business_master where code='Reg' "+"and  DATE_FORMAT(business_date,'%Y%M%D%H')="+"DATE_FORMAT('"+DateValue+" 10','%Y%M%D%H')"" ) as 'RegTen',"
			sql+="(select count(*)from business_master where code='Reg' "+"and  DATE_FORMAT(business_date,'%Y%M%D%H')="+"DATE_FORMAT('"+DateValue+" 11','%Y%M%D%H')"" ) as 'RegEleven',"
			sql+="(select count(*)from ss_eqlistd) as 'TerminalNum'"
			ResultSql=[]
			cursor.execute(sql)#执行数据库查询
			#print("控制台查询总数"+sql)
			cursor.execute(sql)#执行数据库查询
			results = cursor.fetchall()# 获取所有记录列 表
			for row in results:
				ResultRow={}
				ResultRow['Reg'] = str(row[0])
				ResultRow['RegSeccsess'] = str(row[1])
				ResultRow['Charge'] = str(row[2])
				ResultRow['ChargeSeccsess'] = str(row[3])
				ResultRow['ORDR'] = str(row[4])
				ResultRow['ORDRSeccsess'] = str(row[5])
				ResultRow['OBTNO'] = str(row[6])
				ResultRow['OBTNOSeccsess'] = str(row[7])
				ResultRow['RegSeven'] = str(row[8])
				ResultRow['RegEight'] = str(row[9])
				ResultRow['RegNine'] = str(row[10])
				ResultRow['RegTen'] = str(row[11])
				ResultRow['RegEleven'] = str(row[12])
				ResultRow['TerminalNum'] = str(row[13])
				
				ResultSql.append(json.dumps(ResultRow,ensure_ascii=False))
			self.queryset = {
				'ResultSql' :ResultSql,
				}
			self.msg="Success"
		except Exception as e:
			print ('QueryMasterPersentException: '+e)
			self.result = str(e)
			ex = Exception(self)
			# 关闭数据库连接
		connection.close()



#endregion





