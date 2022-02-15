from SelfServDB.models import business_master as model
from django.forms.models import model_to_dict  
from django.db import connection,transaction
from SelfServPy.ApplicationFrameWork.Tools import GetXMLNode
import datetime
import json
class mysqlsql:
	def queryTrade(self,Qparam):#查询master表去除不确定的交易--
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
						value= datetime.datetime.now().strftime('%Y-%m-%d')
						print("ss_td_update-------------------------------------------------------",value,type(value))
				if value =="":
					continue
				if key=="ss_td_update":
					print("-------------------------------------------------------value",value)
					Endtime=(datetime.datetime.strptime(value.split(' ')[0],'%Y-%m-%d')+datetime.timedelta(days=1)).strftime('%Y-%m-%d')
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
			sql = "SELECT  ss_eqlistd_eqcode from ss_eqlistd ORDER BY ss_eqlistd_eqcode  ASC"
			print(sql)
			ResultSql=[]
			cursor.execute(sql)#执行数据库查询
			results = cursor.fetchall()# 获取所有记录列 表
			for row in results:
				ResultRow={}
				ResultRow['UserCode'] = row[0]
				ResultRow['usercode'] = row[0]
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
			sql = "SELECT  ss_pc_dicdesc from ss_processconfig "
			print(sql)
			ResultSql=[]
			cursor.execute(sql)#执行数据库查询
			results = cursor.fetchall()# 获取所有记录列 表
			for row in results:
				ResultRow={}
				ResultRow['processcode'] = row[0]#js中取值是processcode
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
		
	def queryMasterLog(self,Qparam):#查询主表日志
		try: 
			#print("Qparam-------------------------------------------------------",Qparam)
			cursor = connection.cursor()# 使用cursor()方法获取操作游标 
			sql = "select business_date,his_master_id,usercode,serial_number,code_val,ss_pc_dicdesc,business_status, fk_businessmaster_id from business_master a LEFT JOIN patinfo b ON a.id=b.fk_businessmaster_id and b.his_master_id !=''  LEFT JOIN ss_processconfig c  ON  a.processcode=c.ss_pc_processcode where b.code ='his_patinfo' "
			for key, value in Qparam.items(): 
				if key=="business_date":
					if value=="":
						value= datetime.datetime.now().strftime('%Y-%m-%d')
				if key=="business_date":
					Endtime=(datetime.datetime.strptime(value.split(' ')[0],'%Y-%m-%d')+datetime.timedelta(days=1)).strftime('%Y-%m-%d')
					sql=sql+"and "+"a."+key +">='"+ value +"'"+" and "+"a."+key+"<'"+Endtime+"'"
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
			print("查询主表日志"+sql)
			ResultSql=[]
			cursor.execute(sql)#执行数据库查询
			TableCount=len(cursor.fetchall())
			#print(str(TableCount),type(TableCount))
			sql=sql+" LIMIT "+str(int(Qparam['limit'])*(int(Qparam['page'])-1))+","+str(int(Qparam['limit']))
			cursor.execute(sql)#执行数据库查询
			results = cursor.fetchall()# 获取所有记录列 表
			print("查询主表日志限制数量"+sql)
			RowCount=1
			for row in results:
				ResultRow={}
				ResultRow['business_date'] = str(row[0]).split('.')[0]
				ResultRow['his_master_id'] = row[1]
				ResultRow['usercode'] = row[2]
				ResultRow['serial_number'] = row[3]
				if str(row[4]).find('PatientName')>0:
					ResultRow['PatientName'] = GetXMLNode(row[4],"PatientName")
				ResultRow['processcode'] = row[5]
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

	def querydetailss_Exceptions(self,Qparam):#通过主表查询不成功的订单，并且第三方生成了订单
		try: 
			#print("Qparam-------------------------------------------------------",Qparam)
			cursor = connection.cursor()# 使用cursor()方法获取操作游标 
			sql = "select business_date,his_master_id,usercode,serial_number,code_val,ss_pc_dicdesc,business_status, fk_businessmaster_id from business_master a LEFT JOIN patinfo b ON a.id=b.fk_businessmaster_id and b.his_master_id !=''  LEFT JOIN ss_processconfig c  ON  a.processcode=c.ss_pc_processcode where b.code ='his_patinfo' "
			for key, value in Qparam.items(): 
				if key=="business_date":
					if value=="":
						value= datetime.datetime.now().strftime('%Y-%m-%d')
				if key=="business_date":
					Endtime=(datetime.datetime.strptime(value.split(' ')[0],'%Y-%m-%d')+datetime.timedelta(days=1)).strftime('%Y-%m-%d')
					sql=sql+"and "+"a."+key +">='"+ value +"'"+" and "+"a."+key+"<'"+Endtime+"'"
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
				sqltrade = "select * from ss_extdetails where ss_extd_id = '"+row[7] +"' and ss_extd_channel!='INSU'"#看第三方订单是否存在
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
			sql = "select modal_code,ss_dic_desc,ss_dic_concode,business_date,fk_businessmaster_id,a.id from business_details a LEFT JOIN ss_dicdata b ON a.modal_code=b.ss_dic_code AND b.ss_dic_type='PageUrl' WHERE intef_code!='SaveBD' "
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
			sql = "select intef_code,intef_input,intef_output,business_date,business_update,ss_ts_transcodedesc,modal_code,serial_number from business_details a LEFT JOIN ss_transcodeconfig b on a.intef_code=b.ss_transcode where intef_code!='SaveBD' "
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
							ResultRowPayTrade['intef_code'] = row1[0]
							ResultRowPayTrade['intef_input'] = str(row1[1])
							ResultRowPayTrade['intef_output'] = str(row1[2])
							ResultRowPayTrade['business_date'] = str(row1[3])#.split('.')[0]
							ResultRowPayTrade['business_update'] = str(row1[4])#.split('.')[0]
							ResultRowPayTrade['ss_ts_transcodedesc'] = CodeToPayName[str(row1[0])]+" 金额:"+str(row1[5])
							ResultSql.append(json.dumps(ResultRowPayTrade,ensure_ascii=False))
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

	def queryQrcodeOrder(self,Qparam):#查询扫码交易
		try:
			CodeToPayName = dict(WxPay="微信", AliPay="支付宝",JHZFYHK="银行卡",Pay="支付",Query="查询",Refund="退费")
			print("Qparam-------------------------------------------------------",Qparam)
			cursor = connection.cursor()# 使用cursor()方法获取操作游标 
			sql = "SELECT   ss_extd_code,ss_extd_amt,ss_extd_type,ss_extd_status,ss_extd_no,ss_extd_hisno,ss_extd_platno,ss_extd_channel,ss_extd_outinfo,ss_extd_ininfo,ss_extd_update,ss_extd_creator,ss_extd_id,business_status,c.id AS contralid, modal_code,intef_code,intef_input,intef_output from ss_extdetails a LEFT JOIN business_master b on a.ss_extd_no=b.serial_number LEFT JOIN business_details c on  a.ss_extd_id=c.fk_businessmaster_id where "
			for key, value in Qparam.items(): 
				if key=="ss_extd_update":
					if value=="":
						sql=sql+" ss_extd_update !=''"
					else:
						Endtime=(datetime.datetime.strptime(value.split(' ')[0],'%Y-%m-%d')+datetime.timedelta(days=1)).strftime('%Y-%m-%d')
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
			CodeToPayName = dict(WxPay="微信", AliPay="支付宝",JHZFYHK="银行卡",Pay="支付",Query="查询",Refund="退费")
			print("查询退费订单入参-------------------------------------------------------",Qparam)
			cursor = connection.cursor()# 使用cursor()方法获取操作游标 
			sql = "SELECT   fk_businessmaster_id,ss_ref_patname,ss_ref_patno,ss_ref_amt,ss_ref_platno,ss_ref_input,ss_ref_output,ss_ref_createdate,ss_ref_creator,ss_ref_hisno,ss_ref_status,ss_extd_channel  from ss_refundsingle a LEFT JOIN ss_extdetails b on a.ss_ref_platno=b.ss_extd_platno and b.ss_extd_type='Pay' where "
			for key, value in Qparam.items(): 
				if key=="ss_ref_createdate":
					if value=="":
						sql=sql+" ss_ref_createdate !=''"
					else:
						Endtime=(datetime.datetime.strptime(value.split(' ')[0],'%Y-%m-%d')+datetime.timedelta(days=1)).strftime('%Y-%m-%d')
						sql=sql+" ss_ref_createdate>='"+ value +"'"+" and "+"ss_ref_createdate<'"+Endtime+"'"
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
					sql=sql+" and "+"ss_extd_channel = "+"'"+value+"'"
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
				ResultRow['ss_extd_channel'] = "" #CodeToPayName[row[11]]
				TableCount=TableCount+1
				#if (int(Qparam['limit'])*(int(Qparam['page'])-1))<TableCount & TableCount<=(int(Qparam['limit'])*(int(Qparam['page']))):
				#	ResultSql.append(json.dumps(ResultRow,ensure_ascii=False))
			print(123123123)
			self.queryset = {
				'ResultSql' :ResultSql,
				'TableCount':str(TableCount)
			}
			self.msg="Success"
		except Exception as e:
			print ('查询退费订单入参查询语句queryRefundOrder: '+e)
			self.result = str(e)
			ex = Exception(self)
		# 关闭数据库连接
		connection.close()

	def QueryDoctorInfo(self,Qparam):  #查询医生列表
		try:
			print("Qparam-------------------------------------------------------",Qparam)
			cursor = connection.cursor()# 使用cursor()方法获取操作游标 
			sql = "select id, ss_dcp_code,ss_dcp_info,ss_dcp_createdate,ss_dcp_update from ss_docpicture"
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

	def InsertDoctorInfo(self,Qparam):
		try:
			print("Qparam-------------------------------------------------------",Qparam)
			cursor = connection.cursor()# 使用cursor()方法获取操作游标 
			sql = "select ss_dcp_code,ss_dcp_info from ss_docpicture"
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