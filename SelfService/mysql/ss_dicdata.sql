/*
Navicat MySQL Data Transfer

Source Server         : 127.0.0.1
Source Server Version : 50725
Source Host           : 10.80.6.10:8090
Source Database       : selfservice

Target Server Type    : MYSQL
Target Server Version : 50725
File Encoding         : 65001

Date: 2022-01-18 14:41:15
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for ss_dicdata
-- ----------------------------
DROP TABLE IF EXISTS `ss_dicdata`;
CREATE TABLE `ss_dicdata` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `ss_dic_type` varchar(20) DEFAULT NULL,
  `ss_dic_code` varchar(100) DEFAULT NULL,
  `ss_dic_desc` varchar(100) DEFAULT NULL,
  `ss_dic_demo` varchar(200) DEFAULT NULL,
  `ss_dic_createdate` datetime(6) NOT NULL,
  `ss_dic_creator` varchar(50) DEFAULT NULL,
  `ss_dic_update` datetime(6) NOT NULL,
  `ss_dic_upuser` varchar(50) DEFAULT NULL,
  `ss_dic_concode` varchar(100) DEFAULT NULL,
  `ss_dic_condemo` varchar(200) DEFAULT NULL,
  `ss_dic_condesc` varchar(100) DEFAULT NULL,
  `ss_dic_catalog` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `ss_dicdata_ss_dic_catalog_cc1166e5` (`ss_dic_catalog`)
) ENGINE=InnoDB AUTO_INCREMENT=226 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of ss_dicdata
-- ----------------------------
INSERT INTO `ss_dicdata` VALUES ('3', 'PayMode', 'JHZFYHK', '银行卡', '48', '2021-08-09 18:32:20.122172', null, '2021-08-09 18:32:20.122172', null, 'JHZFYHK', null, 'his支付银行卡', null);
INSERT INTO `ss_dicdata` VALUES ('4', 'PayMode', 'WECHAT', '微信', '46', '2021-08-09 18:32:20.122172', null, '2021-08-09 18:32:20.122172', null, 'WECHAT', null, 'HIS支付微信', null);
INSERT INTO `ss_dicdata` VALUES ('5', 'PayMode', 'AlIPAY', '支付宝', '47', '2021-08-09 18:32:20.122172', null, '2021-08-09 18:32:20.122172', null, 'ALIPAY', null, 'HIS支付支付宝', null);
INSERT INTO `ss_dicdata` VALUES ('6', 'MainMenu', 'Main', '自助机主界面', '12个按钮的自助机主界面', '2021-09-13 09:39:21.097385', null, '2021-09-13 09:39:21.097411', null, null, null, null, null);
INSERT INTO `ss_dicdata` VALUES ('7', 'MainMenu', 'BGJ-Main', '壁挂机主界面', '壁挂机主界面', '2021-09-13 09:41:14.756813', null, '2021-09-13 09:41:14.756839', null, null, null, null, null);
INSERT INTO `ss_dicdata` VALUES ('8', 'MainMenu', 'EIP', '电子发票打印界面', '2个按钮', '2021-09-13 09:41:50.131203', null, '2021-09-13 09:41:50.131229', null, null, null, null, null);
INSERT INTO `ss_dicdata` VALUES ('9', 'MainMenu', 'NAReg', '核酸检测界面', '', '2021-09-13 09:42:16.099684', null, '2021-09-13 09:42:16.099709', null, null, null, null, null);
INSERT INTO `ss_dicdata` VALUES ('11', 'Business', 'OBTNO', '取号', '', '2021-09-13 09:45:02.365416', null, '2021-09-13 09:45:02.365443', null, null, null, null, null);
INSERT INTO `ss_dicdata` VALUES ('12', 'SYS', 'SYS', '系统字典', '', '2021-09-13 09:45:40.381789', null, '2021-09-13 09:45:40.381814', null, null, null, null, null);
INSERT INTO `ss_dicdata` VALUES ('13', 'SYS', 'Business', '业务维护', '用于业务控制(多个流程可用一套业务)', '2021-09-13 09:46:06.004841', null, '2021-09-13 09:46:06.004868', null, null, null, null, null);
INSERT INTO `ss_dicdata` VALUES ('14', 'SYS', 'PayMode', '自助机支付方式对照', '自助机支付方式对照HIS支付方式', '2021-09-13 09:46:33.676434', null, '2021-09-13 09:46:33.676462', null, null, null, null, null);
INSERT INTO `ss_dicdata` VALUES ('15', 'SYS', 'MainMenu', '自助机主界面菜单维护', '维护自助机界面按钮个数', '2021-09-13 09:46:38.941764', null, '2021-09-13 09:46:38.941791', null, null, null, null, null);
INSERT INTO `ss_dicdata` VALUES ('16', 'Business', 'CANCORDR', '取消预约', '取消预约', '2021-09-13 09:44:42.973835', null, '2021-09-13 09:44:42.973872', null, null, null, null, null);
INSERT INTO `ss_dicdata` VALUES ('17', 'Business', 'QURY', '查询', '', '2021-09-13 09:45:02.365416', null, '2021-09-13 09:45:02.365443', null, null, null, null, null);
INSERT INTO `ss_dicdata` VALUES ('18', 'Business', 'CERTPRT', '凭条打印', '', '2021-09-14 10:37:51.242934', null, '2021-09-14 10:37:51.242934', null, null, null, null, null);
INSERT INTO `ss_dicdata` VALUES ('19', 'Business', 'DRINCRNO', '加号', '', '2021-09-14 10:37:51.397486', null, '2021-09-14 10:37:51.397486', null, null, null, null, null);
INSERT INTO `ss_dicdata` VALUES ('20', 'Business', 'Charge', '门诊缴费', '', '2021-09-14 10:37:51.536468', null, '2021-09-14 10:37:51.536468', null, null, null, null, null);
INSERT INTO `ss_dicdata` VALUES ('22', 'Business', 'HLTJ', '健康天津', '', '2021-09-14 10:37:52.068020', null, '2021-09-14 10:37:52.068020', null, null, null, null, null);
INSERT INTO `ss_dicdata` VALUES ('23', 'Business', 'PreOrder', '预约明细', '', '2021-09-14 10:37:52.208674', null, '2021-09-14 10:37:52.208674', null, null, null, null, null);
INSERT INTO `ss_dicdata` VALUES ('24', 'Business', 'ChargeDetail', '缴费明细', '', '2021-09-14 10:37:52.334076', null, '2021-09-14 10:37:52.334076', null, null, null, null, null);
INSERT INTO `ss_dicdata` VALUES ('25', 'Business', 'ItmPrice', '项目价格查询', '', '2021-09-14 10:37:52.449734', null, '2021-09-14 10:37:52.449734', null, null, null, null, null);
INSERT INTO `ss_dicdata` VALUES ('26', 'Business', 'UnionOP', '联合门诊-菜单', '', '2021-09-14 10:38:18.477577', null, '2021-09-14 10:38:18.477577', null, null, null, null, null);
INSERT INTO `ss_dicdata` VALUES ('27', 'Business', 'NAReg', '核酸挂号-菜单', '', '2021-09-14 10:38:18.632184', null, '2021-09-14 10:38:18.632184', null, null, null, null, null);
INSERT INTO `ss_dicdata` VALUES ('28', 'Business', 'MedPrice', '药品价格查询', '', '2021-09-14 10:38:18.785463', null, '2021-09-14 10:38:18.785463', null, null, null, null, null);
INSERT INTO `ss_dicdata` VALUES ('29', 'Business', 'Reg', '挂号', '', '2021-09-14 10:38:18.969371', null, '2021-09-14 10:38:18.969371', null, null, null, null, null);
INSERT INTO `ss_dicdata` VALUES ('30', 'Business', 'ORDR', '预约', '', '2021-09-14 10:38:19.192088', null, '2021-09-14 10:38:19.192088', null, null, null, null, null);
INSERT INTO `ss_dicdata` VALUES ('31', 'Business', 'EIP', '电子发票打印', '', '2021-09-14 10:38:19.396455', null, '2021-09-14 10:38:19.396455', null, null, null, null, null);
INSERT INTO `ss_dicdata` VALUES ('32', 'Business', 'ED', '电子清单打印', '', '2021-09-14 10:38:19.599472', null, '2021-09-14 10:38:19.599472', null, null, null, null, null);
INSERT INTO `ss_dicdata` VALUES ('35', 'processcode', 'ORDR', '预约', '', '2021-09-14 10:48:39.115535', null, '2021-09-14 10:48:39.115535', null, null, null, null, null);
INSERT INTO `ss_dicdata` VALUES ('36', 'processcode', 'OBTNO', '取号', '', '2021-09-14 10:48:39.269401', null, '2021-09-14 10:48:39.269401', null, null, null, null, null);
INSERT INTO `ss_dicdata` VALUES ('37', 'processcode', 'CANCORDR', '取消预约', '', '2021-09-14 10:48:39.411080', null, '2021-09-14 10:48:39.411080', null, null, null, null, null);
INSERT INTO `ss_dicdata` VALUES ('38', 'processcode', 'QURY', '查询', '', '2021-09-14 10:48:39.583247', null, '2021-09-14 10:48:39.583247', null, null, null, null, null);
INSERT INTO `ss_dicdata` VALUES ('39', 'processcode', 'CERTPRT', '凭条打印', '', '2021-09-14 10:48:39.742370', null, '2021-09-14 10:48:39.742370', null, null, null, null, null);
INSERT INTO `ss_dicdata` VALUES ('40', 'processcode', 'DRINCRNO', '加号', '', '2021-09-14 10:48:39.882942', null, '2021-09-14 10:48:39.882942', null, null, null, null, null);
INSERT INTO `ss_dicdata` VALUES ('41', 'processcode', 'Charge', '缴费', '', '2021-09-14 10:48:40.006597', null, '2021-09-14 10:48:40.006597', null, null, null, null, null);
INSERT INTO `ss_dicdata` VALUES ('42', 'processcode', 'Reg', '挂号', '', '2021-09-14 10:48:40.304352', null, '2021-09-14 10:48:40.304352', null, null, null, null, null);
INSERT INTO `ss_dicdata` VALUES ('43', 'processcode', 'HLTJ', '健康天津', '', '2021-09-14 10:48:40.457141', null, '2021-09-14 10:48:40.457141', null, null, null, null, null);
INSERT INTO `ss_dicdata` VALUES ('44', 'processcode', 'PreOrder', '预约记录', '', '2021-09-14 10:48:40.468112', null, '2021-09-14 10:48:40.468112', null, null, null, null, null);
INSERT INTO `ss_dicdata` VALUES ('45', 'processcode', 'ChargeDetail', '缴费明细查询', '', '2021-09-14 10:48:40.613722', null, '2021-09-14 10:48:40.613722', null, null, null, null, null);
INSERT INTO `ss_dicdata` VALUES ('46', 'processcode', 'ItmPrice', '收费项价格查询', '', '2021-09-14 10:48:40.883999', null, '2021-09-14 10:48:40.883999', null, null, null, null, null);
INSERT INTO `ss_dicdata` VALUES ('47', 'processcode', 'UnionOP', '联合门诊-菜单', '', '2021-09-14 10:48:41.027615', null, '2021-09-14 10:48:41.027615', null, null, null, null, null);
INSERT INTO `ss_dicdata` VALUES ('48', 'processcode', 'NAReg', '核酸挂号-菜单', '', '2021-09-14 10:49:16.911918', null, '2021-09-14 10:49:16.911918', null, null, null, null, null);
INSERT INTO `ss_dicdata` VALUES ('49', 'processcode', 'MedPrice', '药品价格查询', '', '2021-09-14 10:49:17.100989', null, '2021-09-14 10:49:17.100989', null, null, null, null, null);
INSERT INTO `ss_dicdata` VALUES ('50', 'processcode', 'NAReg-Reg', '核酸挂号-挂号业务', '', '2021-09-14 10:49:17.257097', null, '2021-09-14 10:49:17.257097', null, null, null, null, null);
INSERT INTO `ss_dicdata` VALUES ('51', 'processcode', 'UnionOP-ORDR', '联合门诊-预约', '', '2021-09-14 10:49:17.460507', null, '2021-09-14 10:49:17.460507', null, null, null, null, null);
INSERT INTO `ss_dicdata` VALUES ('52', 'processcode', 'EIP', '电子发票', '', '2021-09-14 10:49:17.755332', null, '2021-09-14 10:49:17.755332', null, null, null, null, null);
INSERT INTO `ss_dicdata` VALUES ('53', 'processcode', 'ED', '电子清单', '', '2021-09-14 10:49:17.912381', null, '2021-09-14 10:49:17.912381', null, null, null, null, null);
INSERT INTO `ss_dicdata` VALUES ('54', 'processcode', 'UnionOP-CANCORDR', '联合门诊-取消预约', '', '2021-09-14 10:49:18.068895', null, '2021-09-14 10:49:18.068895', null, null, null, null, null);
INSERT INTO `ss_dicdata` VALUES ('55', 'SYS', 'processcode', '流程代码', '配置按钮的下的具体流程走向（决定界面跳转）', '2021-09-14 10:55:11.277081', null, '2021-09-14 10:55:11.277081', null, null, null, null, null);
INSERT INTO `ss_dicdata` VALUES ('56', 'SYS', 'PageUrl', '界面代码', '维护流程配置中每个步骤的界面url', '2021-09-14 11:06:19.094625', null, '2021-09-14 11:06:19.094625', null, '维护时最后 【?】不能丢', null, null, null);
INSERT INTO `ss_dicdata` VALUES ('57', 'PageUrl', 'readcard', '读卡', '', '2021-09-14 11:06:22.958475', null, '2021-09-14 11:06:22.958475', null, '/WebAPP/pages/common/readcard.show.html?', null, null, null);
INSERT INTO `ss_dicdata` VALUES ('58', 'PageUrl', 'srvylist', '流调表', '', '2021-09-14 11:14:41.922201', null, '2021-09-14 11:14:41.922201', null, '/WebAPP/pages/common/srvylist.html?', null, null, null);
INSERT INTO `ss_dicdata` VALUES ('59', 'PageUrl', 'tips', '联合门诊提示', '', '2021-09-14 11:14:42.093782', null, '2021-09-14 11:14:42.093782', null, '/WebAPP/pages/prereg/union.tips.html?', null, null, null);
INSERT INTO `ss_dicdata` VALUES ('60', 'PageUrl', 'level1dep', '一级科室查询', '', '2021-09-14 11:14:42.235448', null, '2021-09-14 11:14:42.235448', null, '/WebAPP/pages/prereg/level1department.html?', null, null, null);
INSERT INTO `ss_dicdata` VALUES ('61', 'PageUrl', 'level2dep', '二级科室查询', '', '2021-09-14 11:14:42.376274', null, '2021-09-14 11:14:42.376274', null, '/WebAPP/pages/prereg/department.html?', null, null, null);
INSERT INTO `ss_dicdata` VALUES ('62', 'PageUrl', 'predoc', '医生查询', '', '2021-09-14 11:14:42.453757', null, '2021-09-14 11:14:42.453757', null, '/WebAPP/pages/prereg/doctor.html?', null, null, null);
INSERT INTO `ss_dicdata` VALUES ('63', 'PageUrl', 'predocdat', '排班查询', '', '2021-09-14 11:14:42.641800', null, '2021-09-14 11:14:42.641800', null, '/WebAPP/pages/prereg/doctordetails.html?', null, null, null);
INSERT INTO `ss_dicdata` VALUES ('64', 'PageUrl', 'predoctime', '分时段信息查询', '', '2021-09-14 11:14:42.766304', null, '2021-09-14 11:14:42.766304', null, '/WebAPP/pages/prereg/doctor.timeinfo.html?', null, null, null);
INSERT INTO `ss_dicdata` VALUES ('65', 'PageUrl', 'modifypat', '确认联系方式', '', '2021-09-14 11:14:42.920575', null, '2021-09-14 11:14:42.920575', null, '/WebAPP/pages/common/modifypatinfo.html?', null, null, null);
INSERT INTO `ss_dicdata` VALUES ('66', 'PageUrl', 'pay', 'HIS最终提交业务', '', '2021-09-14 11:14:43.048670', null, '2021-09-14 11:14:43.048670', null, '/WebAPP/pages/common/pay.html?', '2.pay.js中获取pattype=Charge的 代码，此处已在后台修改 ？？ 未删除代码 ', null, null);
INSERT INTO `ss_dicdata` VALUES ('67', 'PageUrl', 'pattype', '患者类型选择', '自费/医保', '2021-09-14 11:14:43.174643', null, '2021-09-14 11:14:43.174643', null, '/WebAPP/pages/common/readcard.html', null, null, null);
INSERT INTO `ss_dicdata` VALUES ('68', 'PageUrl', 'getpredetails', '预约记录查询', '', '2021-09-14 11:14:43.333370', null, '2021-09-14 11:14:43.333370', null, '/WebAPP/pages/prereg/predetails.html?AllowReund=GET', 'Get:取号业务使用；Y：取消预约', null, null);
INSERT INTO `ss_dicdata` VALUES ('69', 'PageUrl', 'showreg', '挂号费用展示', '', '2021-09-14 11:20:12.968077', null, '2021-09-14 11:20:12.968077', null, '/WebAPP/pages/prereg/show.html?', null, null, null);
INSERT INTO `ss_dicdata` VALUES ('70', 'PageUrl', 'paymode', '支付方式选择', '', '2021-09-14 11:20:13.122980', null, '2021-09-14 11:20:13.123982', null, '/WebAPP/pages/common/paymode.html?', null, null, null);
INSERT INTO `ss_dicdata` VALUES ('71', 'PageUrl', 'query', '查询主界面', '', '2021-09-14 11:20:13.263643', null, '2021-09-14 11:20:13.263643', null, '/WebAPP/pages/query/menu.html?', null, null, null);
INSERT INTO `ss_dicdata` VALUES ('72', 'PageUrl', 'printmain', '打印主界面', '', '2021-09-14 11:20:13.406053', null, '2021-09-14 11:20:13.406053', null, '/WebAPP/pages/print/cert.html?', null, null, null);
INSERT INTO `ss_dicdata` VALUES ('73', 'PageUrl', 'input', '键盘输入界面', '', '2021-09-14 11:20:13.542688', null, '2021-09-14 11:20:13.542688', null, '/WebAPP/pages/common/text.input.html?', 'KeyType=letter:带字母的键盘，缺省数字键盘', null, null);
INSERT INTO `ss_dicdata` VALUES ('74', 'PageUrl', 'AdmList', '查询就诊记录', '', '2021-09-14 11:20:13.692118', null, '2021-09-14 11:20:13.692118', null, '/WebAPP/pages/charge/admlist.html?', null, null, null);
INSERT INTO `ss_dicdata` VALUES ('75', 'PageUrl', 'chargeshow', '缴费信息展示', '', '2021-09-14 11:20:13.754538', null, '2021-09-14 11:20:13.754538', null, '/WebAPP/pages/charge/divide.show.html?', null, null, null);
INSERT INTO `ss_dicdata` VALUES ('76', 'PageUrl', 'insutype', '医保类别选择', '', '2021-09-14 11:20:13.865857', null, '2021-09-14 11:20:13.865857', null, '/WebAPP/pages/insu/pattype.html?', null, null, null);
INSERT INTO `ss_dicdata` VALUES ('77', 'PageUrl', 'diag', '慢特病诊断选择', '', '2021-09-14 11:20:14.085900', null, '2021-09-14 11:20:14.085900', null, '/WebAPP/pages/insu/diag.html?', null, null, null);
INSERT INTO `ss_dicdata` VALUES ('78', 'PageUrl', 'HLTJ', '健康天津', '', '2021-09-14 11:20:14.117429', null, '2021-09-14 11:20:14.117429', null, '/WebAPP/pages/selfdef.health.tianjin.html?', null, null, null);
INSERT INTO `ss_dicdata` VALUES ('79', 'PageUrl', 'getpredetails', '缴费明细', '', '2021-09-14 11:20:14.338991', null, '2021-09-14 11:20:14.338991', null, '/WebAPP/pages/query/opinv.html?', null, null, null);
INSERT INTO `ss_dicdata` VALUES ('80', 'PageUrl', 'itemprice', '价格查询', '', '2021-09-14 11:20:14.385759', null, '2021-09-14 11:20:14.385759', null, '/WebAPP/pages/query/itemprice.html?', null, null, null);
INSERT INTO `ss_dicdata` VALUES ('81', 'PageUrl', 'unionmenu', '联合门诊菜单', '', '2021-09-14 11:20:14.512819', null, '2021-09-14 11:20:14.512819', null, '/WebAPP/pages/prereg/union.menu.html?', null, null, null);
INSERT INTO `ss_dicdata` VALUES ('82', 'PageUrl', 'naregmenu', '核酸挂号菜单', '', '2021-09-14 11:32:40.496298', null, '2021-09-14 11:32:40.496298', null, '/WebAPP/pages/prereg/nareg.menu.html?', null, null, null);
INSERT INTO `ss_dicdata` VALUES ('83', 'PageUrl', 'EIP', '电子发票打印', '', '2021-09-14 11:32:40.667499', null, '2021-09-14 11:32:40.667499', null, '/WebAPP/pages/print/ei.html?', null, null, null);
INSERT INTO `ss_dicdata` VALUES ('84', 'PageUrl', 'ED', '电子清单打印', '', '2021-09-14 11:32:40.825579', null, '2021-09-14 11:32:40.825579', null, '/WebAPP/pages/print/ed.html?', null, null, null);
INSERT INTO `ss_dicdata` VALUES ('91', 'SYS', 'PosErr', '银行POS报错信息', '', '2021-09-14 11:32:44.084601', null, '2021-09-14 11:32:44.084601', null, null, null, null, null);
INSERT INTO `ss_dicdata` VALUES ('92', 'PosErr', '00', '承兑或交易成功', '', '2021-09-14 11:32:44.084601', null, '2021-09-14 11:32:44.084601', null, null, null, '承兑或交易成功', null);
INSERT INTO `ss_dicdata` VALUES ('93', 'PosErr', '01', '查发卡行', '', '2021-09-14 11:32:44.084601', null, '2021-09-14 11:32:44.084601', null, null, null, '查发卡行', null);
INSERT INTO `ss_dicdata` VALUES ('94', 'PosErr', '02', '查发卡行的特殊条件', '', '2021-09-14 11:32:44.084601', null, '2021-09-14 11:32:44.084601', null, null, null, '可电话向发卡行查询', null);
INSERT INTO `ss_dicdata` VALUES ('95', 'PosErr', '03', '无效商户', '', '2021-09-14 11:32:44.084601', null, '2021-09-14 11:32:44.084601', null, null, null, '商户需要在银行或中心登记', null);
INSERT INTO `ss_dicdata` VALUES ('96', 'PosErr', '04', '没收卡', '', '2021-09-14 11:32:44.084601', null, '2021-09-14 11:32:44.084601', null, null, null, '操作员没收卡', null);
INSERT INTO `ss_dicdata` VALUES ('97', 'PosErr', '05', '不予承兑', '', '2021-09-14 11:32:44.084601', null, '2021-09-14 11:32:44.084601', null, null, null, '发卡不予承兑', null);
INSERT INTO `ss_dicdata` VALUES ('98', 'PosErr', '06', '出错', '', '2021-09-14 11:32:44.084601', null, '2021-09-14 11:32:44.084601', null, null, null, '发卡行故障', null);
INSERT INTO `ss_dicdata` VALUES ('99', 'PosErr', '07', '特殊条件下没收卡', '', '2021-09-14 11:32:44.084601', null, '2021-09-14 11:32:44.084601', null, null, null, '特殊条件下没收卡', null);
INSERT INTO `ss_dicdata` VALUES ('100', 'PosErr', '09', '请求正在处理中', '', '2021-09-14 11:32:44.084601', null, '2021-09-14 11:32:44.084601', null, null, null, '重新提交交易请求', null);
INSERT INTO `ss_dicdata` VALUES ('101', 'PosErr', '12', '无效交易', '', '2021-09-14 11:32:44.084601', null, '2021-09-14 11:32:44.084601', null, null, null, '发卡行不支持的交易', null);
INSERT INTO `ss_dicdata` VALUES ('102', 'PosErr', '13', '无效金额', '', '2021-09-14 11:32:44.084601', null, '2021-09-14 11:32:44.084601', null, null, null, '金额为0 或太大', null);
INSERT INTO `ss_dicdata` VALUES ('103', 'PosErr', '14', '无效卡号', '', '2021-09-14 11:32:44.084601', null, '2021-09-14 11:32:44.084601', null, null, null, '卡种未在中心登记或读卡号有误', null);
INSERT INTO `ss_dicdata` VALUES ('104', 'PosErr', '15', '无此发卡行', '', '2021-09-14 11:32:44.084601', null, '2021-09-14 11:32:44.084601', null, null, null, '此发卡行未与中心开通业务', null);
INSERT INTO `ss_dicdata` VALUES ('105', 'PosErr', '19', '重新送入交易', '', '2021-09-14 11:32:44.084601', null, '2021-09-14 11:32:44.084601', null, null, null, '刷卡读取数据有误，可重新刷卡', null);
INSERT INTO `ss_dicdata` VALUES ('106', 'PosErr', '20', '无效应答', '', '2021-09-14 11:32:44.084601', null, '2021-09-14 11:32:44.084601', null, null, null, '无效应答', null);
INSERT INTO `ss_dicdata` VALUES ('107', 'PosErr', '21', '不做任何处理', '', '2021-09-14 11:32:44.084601', null, '2021-09-14 11:32:44.084601', null, null, null, '不做任何处理', null);
INSERT INTO `ss_dicdata` VALUES ('108', 'PosErr', '22', '怀疑操作有误', '', '2021-09-14 11:32:44.084601', null, '2021-09-14 11:32:44.084601', null, null, null, 'POS状态与中心不符，可重新签到', null);
INSERT INTO `ss_dicdata` VALUES ('109', 'PosErr', '23', '不可接受的交易费', '', '2021-09-14 11:32:44.084601', null, '2021-09-14 11:32:44.084601', null, null, null, '不可接受的交易费', null);
INSERT INTO `ss_dicdata` VALUES ('110', 'PosErr', '25', '未能找到文件上记录', '', '2021-09-14 11:32:44.084601', null, '2021-09-14 11:32:44.084601', null, null, null, '发卡行未能找到有关记录', null);
INSERT INTO `ss_dicdata` VALUES ('111', 'PosErr', '30', '格式错误', '', '2021-09-14 11:32:44.084601', null, '2021-09-14 11:32:44.084601', null, null, null, '格式错误', null);
INSERT INTO `ss_dicdata` VALUES ('112', 'PosErr', '31', '不支持的银行', '', '2021-09-14 11:32:44.084601', null, '2021-09-14 11:32:44.084601', null, null, null, '此发卡方未与中心开通业务', null);
INSERT INTO `ss_dicdata` VALUES ('113', 'PosErr', '33', '过期的卡', '', '2021-09-14 11:32:44.084601', null, '2021-09-14 11:32:44.084601', null, null, null, '过期的卡，操作员可以没收', null);
INSERT INTO `ss_dicdata` VALUES ('114', 'PosErr', '34', '有作弊嫌疑', '', '2021-09-14 11:32:44.084601', null, '2021-09-14 11:32:44.084601', null, null, null, '有作弊嫌疑的卡，操作员可以没收', null);
INSERT INTO `ss_dicdata` VALUES ('115', 'PosErr', '35', '受卡方与安全保密部门联系', '', '2021-09-14 11:32:44.084601', null, '2021-09-14 11:32:44.084601', null, null, null, '有作弊嫌疑的卡，操作员可以没收', null);
INSERT INTO `ss_dicdata` VALUES ('116', 'PosErr', '36', '受限制的卡', '', '2021-09-14 11:32:44.084601', null, '2021-09-14 11:32:44.084601', null, null, null, '有作弊嫌疑的卡，操作员可以没收', null);
INSERT INTO `ss_dicdata` VALUES ('117', 'PosErr', '37', '受卡方呼受理方安全保密部门(没收卡)', '', '2021-09-14 11:32:44.084601', null, '2021-09-14 11:32:44.084601', null, null, null, '有作弊嫌疑的卡，操作员可以没收', null);
INSERT INTO `ss_dicdata` VALUES ('118', 'PosErr', '38', '超过允许的PIN试输入', '', '2021-09-14 11:32:44.084601', null, '2021-09-14 11:32:44.084601', null, null, null, '密码错次数超限，操作员可以没收', null);
INSERT INTO `ss_dicdata` VALUES ('119', 'PosErr', '39', '无此信用卡账户', '', '2021-09-14 11:32:44.084601', null, '2021-09-14 11:32:44.084601', null, null, null, '可能刷卡操作有误', null);
INSERT INTO `ss_dicdata` VALUES ('120', 'PosErr', '40', '请求的功能尚不支持', '', '2021-09-14 11:32:44.084601', null, '2021-09-14 11:32:44.084601', null, null, null, '发卡行不支持的交易类型', null);
INSERT INTO `ss_dicdata` VALUES ('121', 'PosErr', '41', '丢失卡', '', '2021-09-14 11:32:44.084601', null, '2021-09-14 11:32:44.084601', null, null, null, '挂失的卡， 操作员可以没收', null);
INSERT INTO `ss_dicdata` VALUES ('122', 'PosErr', '42', '无此账户', '', '2021-09-14 11:32:44.084601', null, '2021-09-14 11:32:44.084601', null, null, null, '发卡行找不到此账户', null);
INSERT INTO `ss_dicdata` VALUES ('123', 'PosErr', '43', '被窃卡', '', '2021-09-14 11:32:44.084601', null, '2021-09-14 11:32:44.084601', null, null, null, '被窃卡， 操作员可以没收', null);
INSERT INTO `ss_dicdata` VALUES ('124', 'PosErr', '44', '无此投资账户', '', '2021-09-14 11:32:44.084601', null, '2021-09-14 11:32:44.084601', null, null, null, '可能刷卡操作有误', null);
INSERT INTO `ss_dicdata` VALUES ('125', 'PosErr', '45', 'Fallback交易', '', '2021-09-14 11:32:44.084601', null, '2021-09-14 11:32:44.084601', null, null, null, '不允许fallback交易', null);
INSERT INTO `ss_dicdata` VALUES ('126', 'PosErr', '51', '无足够的存款', '', '2021-09-14 11:32:44.084601', null, '2021-09-14 11:32:44.084601', null, null, null, '账户内余额不足', null);
INSERT INTO `ss_dicdata` VALUES ('127', 'PosErr', '52', '无此支票账户', '', '2021-09-14 11:32:44.084601', null, '2021-09-14 11:32:44.084601', null, null, null, '无此支票账户', null);
INSERT INTO `ss_dicdata` VALUES ('128', 'PosErr', '53', '无此储蓄卡账户', '', '2021-09-14 11:32:44.084601', null, '2021-09-14 11:32:44.084601', null, null, null, '无此储蓄卡账户', null);
INSERT INTO `ss_dicdata` VALUES ('129', 'PosErr', '54', '过期的卡', '', '2021-09-14 11:32:44.084601', null, '2021-09-14 11:32:44.084601', null, null, null, '过期的卡', null);
INSERT INTO `ss_dicdata` VALUES ('130', 'PosErr', '55', '不正确的PIN', '', '2021-09-14 11:32:44.084601', null, '2021-09-14 11:32:44.084601', null, null, null, '密码输错', null);
INSERT INTO `ss_dicdata` VALUES ('131', 'PosErr', '56', '无此卡记录', '', '2021-09-14 11:32:44.084601', null, '2021-09-14 11:32:44.084601', null, null, null, '发卡行找不到此账户', null);
INSERT INTO `ss_dicdata` VALUES ('132', 'PosErr', '57', '不允许持卡人进行的交易', '', '2021-09-14 11:32:44.084601', null, '2021-09-14 11:32:44.084601', null, null, null, '不允许持卡人进行的交易', null);
INSERT INTO `ss_dicdata` VALUES ('133', 'PosErr', '58', '不允许终端进行的交易', '', '2021-09-14 11:32:44.084601', null, '2021-09-14 11:32:44.084601', null, null, null, '该商户不允许进行的交易', null);
INSERT INTO `ss_dicdata` VALUES ('134', 'PosErr', '59', '有作弊嫌疑', '', '2021-09-14 11:32:44.084601', null, '2021-09-14 11:32:44.084601', null, null, null, '有作弊嫌疑', null);
INSERT INTO `ss_dicdata` VALUES ('135', 'PosErr', '60', '受卡方与安全保密部门联系', '', '2021-09-14 11:32:44.084601', null, '2021-09-14 11:32:44.084601', null, null, null, '受卡方与安全保密部门联系', null);
INSERT INTO `ss_dicdata` VALUES ('136', 'PosErr', '61', '超出取款金额限制', '', '2021-09-14 11:32:44.084601', null, '2021-09-14 11:32:44.084601', null, null, null, '一次交易的金额太大', null);
INSERT INTO `ss_dicdata` VALUES ('137', 'PosErr', '62', '受限制的卡', '', '2021-09-14 11:32:44.084601', null, '2021-09-14 11:32:44.084601', null, null, null, '受限制的卡', null);
INSERT INTO `ss_dicdata` VALUES ('138', 'PosErr', '63', '违反安全保密规定', '', '2021-09-14 11:32:44.084601', null, '2021-09-14 11:32:44.084601', null, null, null, '违反安全保密规定', null);
INSERT INTO `ss_dicdata` VALUES ('139', 'PosErr', '64', '原始金额不正确', '', '2021-09-14 11:32:44.084601', null, '2021-09-14 11:32:44.084601', null, null, null, '原始金额不正确', null);
INSERT INTO `ss_dicdata` VALUES ('140', 'PosErr', '65', '超出取款次数限制', '', '2021-09-14 11:32:44.084601', null, '2021-09-14 11:32:44.084601', null, null, null, '超出取款次数限制', null);
INSERT INTO `ss_dicdata` VALUES ('141', 'PosErr', '66', '受卡方呼受理方安全保密部门', '', '2021-09-14 11:32:44.084601', null, '2021-09-14 11:32:44.084601', null, null, null, '受卡方呼受理方安全保密部门', null);
INSERT INTO `ss_dicdata` VALUES ('142', 'PosErr', '67', '捕捉（没收卡）', '', '2021-09-14 11:32:44.084601', null, '2021-09-14 11:32:44.084601', null, null, null, '捕捉（没收卡）', null);
INSERT INTO `ss_dicdata` VALUES ('143', 'PosErr', '68', '收到的回答太迟', '', '2021-09-14 11:32:44.084601', null, '2021-09-14 11:32:44.084601', null, null, null, '发卡行规定时间内没有回答', null);
INSERT INTO `ss_dicdata` VALUES ('144', 'PosErr', '69', '资金到账行无此账户', '', '2021-09-14 11:32:44.084601', null, '2021-09-14 11:32:44.084601', null, null, null, '资金到账行账号不正确', null);
INSERT INTO `ss_dicdata` VALUES ('145', 'PosErr', '75', '允许的输入PIN次数超限', '', '2021-09-14 11:32:44.084601', null, '2021-09-14 11:32:44.084601', null, null, null, '允许的输入PIN次数超限', null);
INSERT INTO `ss_dicdata` VALUES ('146', 'PosErr', '77', '需要向网络中心签到', '', '2021-09-14 11:32:44.084601', null, '2021-09-14 11:32:44.084601', null, null, null, 'POS批次与网络中心不一致', null);
INSERT INTO `ss_dicdata` VALUES ('147', 'PosErr', '79', '脱机交易对账不平', '', '2021-09-14 11:32:44.084601', null, '2021-09-14 11:32:44.084601', null, null, null, 'POS终端上传的脱机数据对账不平', null);
INSERT INTO `ss_dicdata` VALUES ('148', 'PosErr', '89', '安全处理失败', '', '2021-09-14 11:32:44.084601', null, '2021-09-14 11:32:44.084601', null, null, null, '1、调用MAC校验程序失败2、调用PIN校验程序失败3、MAC处理失败4、密钥处理失败', null);
INSERT INTO `ss_dicdata` VALUES ('149', 'PosErr', '90', '日期切换正在处理', '', '2021-09-14 11:32:44.084601', null, '2021-09-14 11:32:44.084601', null, null, null, '日期切换正在处理', null);
INSERT INTO `ss_dicdata` VALUES ('150', 'PosErr', '91', '发卡行或建设银行不能操作', '', '2021-09-14 11:32:44.084601', null, '2021-09-14 11:32:44.084601', null, null, null, '电话查询发卡方或建设银行，可重作', null);
INSERT INTO `ss_dicdata` VALUES ('151', 'PosErr', '92', '金融机构或中间网络设施找不到或无法达到', '', '2021-09-14 11:32:44.084601', null, '2021-09-14 11:32:44.084601', null, null, null, '电话查询发卡方或网络中心，可重作', null);
INSERT INTO `ss_dicdata` VALUES ('152', 'PosErr', '93', '交易违法、不能完成', '', '2021-09-14 11:32:44.084601', null, '2021-09-14 11:32:44.084601', null, null, null, '交易违法、不能完成', null);
INSERT INTO `ss_dicdata` VALUES ('153', 'PosErr', '94', '重复交易', '', '2021-09-14 11:32:44.084601', null, '2021-09-14 11:32:44.084601', null, null, null, '查询网络中心，可重新签到作交易', null);
INSERT INTO `ss_dicdata` VALUES ('154', 'PosErr', '95', '调节控制错', '', '2021-09-14 11:32:44.084601', null, '2021-09-14 11:32:44.084601', null, null, null, '调节控制错', null);
INSERT INTO `ss_dicdata` VALUES ('155', 'PosErr', '96', '系统异常、失效', '', '2021-09-14 11:32:44.084601', null, '2021-09-14 11:32:44.084601', null, null, null, '发卡方或网络中心出现故障', null);
INSERT INTO `ss_dicdata` VALUES ('156', 'PosErr', '97', 'POS终端号找不到', '', '2021-09-14 11:32:44.084601', null, '2021-09-14 11:32:44.084601', null, null, null, '终端未在中心或银行登记', null);
INSERT INTO `ss_dicdata` VALUES ('157', 'PosErr', '98', '收不到发卡行应答', '', '2021-09-14 11:32:44.084601', null, '2021-09-14 11:32:44.084601', null, null, null, '收不到发卡行应答', null);
INSERT INTO `ss_dicdata` VALUES ('158', 'PosErr', '99', 'PIN格式错', '', '2021-09-14 11:32:44.084601', null, '2021-09-14 11:32:44.084601', null, null, null, '可重新签到作交易', null);
INSERT INTO `ss_dicdata` VALUES ('159', 'PosErr', 'A0', 'MAC校验错', '', '2021-09-14 11:32:44.084601', null, '2021-09-14 11:32:44.084601', null, null, null, '可重新签到作交易', null);
INSERT INTO `ss_dicdata` VALUES ('160', 'PosErr', 'A1', '未知交易', '', '2021-09-14 11:32:44.084601', null, '2021-09-14 11:32:44.084601', null, null, null, '未知交易', null);
INSERT INTO `ss_dicdata` VALUES ('161', 'PosErr', 'A2', '运营商系统忙', '', '2021-09-14 11:32:44.084601', null, '2021-09-14 11:32:44.084601', null, null, null, '运营商系统忙', null);
INSERT INTO `ss_dicdata` VALUES ('162', 'PosErr', 'A3', '证件号码不符', '', '2021-09-14 11:32:44.084601', null, '2021-09-14 11:32:44.084601', null, null, null, '证件号码不符', null);
INSERT INTO `ss_dicdata` VALUES ('163', 'PosErr', 'A4', '证件类型不符', '', '2021-09-14 11:32:44.084601', null, '2021-09-14 11:32:44.084601', null, null, null, '证件类型不符', null);
INSERT INTO `ss_dicdata` VALUES ('164', 'PosErr', 'A5', '客户信息已存在', '', '2021-09-14 11:32:44.084601', null, '2021-09-14 11:32:44.084601', null, null, null, '客户信息已存在', null);
INSERT INTO `ss_dicdata` VALUES ('165', 'PosErr', 'A6', '帐户已签约', '', '2021-09-14 11:32:44.084601', null, '2021-09-14 11:32:44.084601', null, null, null, '帐户已签约', null);
INSERT INTO `ss_dicdata` VALUES ('166', 'PosErr', 'A7', '客户身份不正确', '', '2021-09-14 11:32:44.084601', null, '2021-09-14 11:32:44.084601', null, null, null, '客户身份不正确', null);
INSERT INTO `ss_dicdata` VALUES ('167', 'PosErr', 'A8', '额度不足', '', '2021-09-14 11:32:44.084601', null, '2021-09-14 11:32:44.084601', null, null, null, '用于分期付款交易', null);
INSERT INTO `ss_dicdata` VALUES ('168', 'PosErr', 'A9', '非现场类交易必填项不足，或非现场类交易与实际不符', '', '2021-09-14 11:32:44.084601', null, '2021-09-14 11:32:44.084601', null, null, null, '输入必填项', null);
INSERT INTO `ss_dicdata` VALUES ('169', 'PosErr', 'AA', '为非理财卡', '', '2021-09-14 11:32:44.084601', null, '2021-09-14 11:32:44.084601', null, null, null, '为非理财卡', null);
INSERT INTO `ss_dicdata` VALUES ('170', 'PosErr', 'AB', '为理财卡非白金卡', '', '2021-09-14 11:32:44.084601', null, '2021-09-14 11:32:44.084601', null, null, null, '为理财卡非白金卡', null);
INSERT INTO `ss_dicdata` VALUES ('171', 'PosErr', 'B1', '异地用户资料', '', '2021-09-14 11:32:44.084601', null, '2021-09-14 11:32:44.084601', null, null, null, '异地用户资料', null);
INSERT INTO `ss_dicdata` VALUES ('172', 'PosErr', 'B2', '非法用户资料', '', '2021-09-14 11:32:44.084601', null, '2021-09-14 11:32:44.084601', null, null, null, '非法用户资料', null);
INSERT INTO `ss_dicdata` VALUES ('173', 'PosErr', 'B3', '非法电话号码', '', '2021-09-14 11:32:44.084601', null, '2021-09-14 11:32:44.084601', null, null, null, '非法电话号码', null);
INSERT INTO `ss_dicdata` VALUES ('174', 'PosErr', 'B4', '用户输入归属地州错', '', '2021-09-14 11:32:44.084601', null, '2021-09-14 11:32:44.084601', null, null, null, '用户输入归属地州错', null);
INSERT INTO `ss_dicdata` VALUES ('175', 'PosErr', 'B5', '户名反显交易仅适用于本行借记/准贷记账户', '', '2021-09-14 11:32:44.084601', null, '2021-09-14 11:32:44.084601', null, null, null, '发起账户验证交易获取账户姓名', null);
INSERT INTO `ss_dicdata` VALUES ('176', 'PosErr', 'B7', '本地州尚未开通该业务', '', '2021-09-14 11:32:44.084601', null, '2021-09-14 11:32:44.084601', null, null, null, '本地州尚未开通该业务', null);
INSERT INTO `ss_dicdata` VALUES ('177', 'PosErr', 'B8', '用户不存在或已销号', '', '2021-09-14 11:32:44.084601', null, '2021-09-14 11:32:44.084601', null, null, null, '用户不存在或已销号', null);
INSERT INTO `ss_dicdata` VALUES ('178', 'PosErr', 'B9', '非正常号码', '', '2021-09-14 11:32:44.084601', null, '2021-09-14 11:32:44.084601', null, null, null, '非正常号码', null);
INSERT INTO `ss_dicdata` VALUES ('179', 'PosErr', 'C1', '代收费不允许少缴费', '', '2021-09-14 11:32:44.084601', null, '2021-09-14 11:32:44.084601', null, null, null, '代收费不允许少缴费', null);
INSERT INTO `ss_dicdata` VALUES ('180', 'PosErr', 'D0', '权益积分不足，请与客户经理联系', '', '2021-09-14 11:32:44.084601', null, '2021-09-14 11:32:44.084601', null, null, null, '用于权益积分交易', null);
INSERT INTO `ss_dicdata` VALUES ('181', 'PosErr', 'D1', '该笔流水不是当前客户的，请查证', '', '2021-09-14 11:32:44.084601', null, '2021-09-14 11:32:44.084601', null, null, null, '用于权益积分交易', null);
INSERT INTO `ss_dicdata` VALUES ('182', 'PosErr', 'D2', '该笔流水已撤销或冲正', '', '2021-09-14 11:32:44.084601', null, '2021-09-14 11:32:44.084601', null, null, null, '用于权益积分交易', null);
INSERT INTO `ss_dicdata` VALUES ('183', 'PosErr', 'D3', '您输入的流水号不是当日流水', '', '2021-09-14 11:32:44.084601', null, '2021-09-14 11:32:44.084601', null, null, null, '用于权益积分交易', null);
INSERT INTO `ss_dicdata` VALUES ('184', 'PosErr', 'D5', '没有找到服务信息，请与银行联系', '', '2021-09-14 11:32:44.084601', null, '2021-09-14 11:32:44.084601', null, null, null, '用于权益积分交易', null);
INSERT INTO `ss_dicdata` VALUES ('185', 'PosErr', 'Z1', '该功能暂未开通', '', '2021-09-14 11:32:44.084601', null, '2021-09-14 11:32:44.084601', null, null, null, '该功能暂未开通', null);
INSERT INTO `ss_dicdata` VALUES ('186', 'PosErr', 'Z2', '系统不支持该功能', '', '2021-09-14 11:32:44.084601', null, '2021-09-14 11:32:44.084601', null, null, null, '系统不支持该功能', null);
INSERT INTO `ss_dicdata` VALUES ('187', 'PosErr', 'F2', '无此定制帐号类型', '', '2021-09-14 11:32:44.084601', null, '2021-09-14 11:32:44.084601', null, null, null, '无此定制帐号类型', null);
INSERT INTO `ss_dicdata` VALUES ('188', 'PosErr', 'F3', '该定制帐号尚未开通服务功能', '', '2021-09-14 11:32:44.084601', null, '2021-09-14 11:32:44.084601', null, null, null, '该定制帐号尚未开通服务功能', null);
INSERT INTO `ss_dicdata` VALUES ('189', 'PosErr', 'F5', '该帐号无定制对应关系', '', '2021-09-14 11:32:44.084601', null, '2021-09-14 11:32:44.084601', null, null, null, '该帐号无定制对应关系', null);
INSERT INTO `ss_dicdata` VALUES ('190', 'PosErr', 'F6', '定制已取消', '', '2021-09-14 11:32:44.084601', null, '2021-09-14 11:32:44.084601', null, null, null, '定制已取消', null);
INSERT INTO `ss_dicdata` VALUES ('191', 'PosErr', 'F7', '无效运营商', '', '2021-09-14 11:32:44.084601', null, '2021-09-14 11:32:44.084601', null, null, null, '无效运营商', null);
INSERT INTO `ss_dicdata` VALUES ('192', 'PosErr', 'F8', '该运营商尚未开通', '', '2021-09-14 11:32:44.084601', null, '2021-09-14 11:32:44.084601', null, null, null, '该运营商尚未开通', null);
INSERT INTO `ss_dicdata` VALUES ('193', 'PosErr', 'FB', '该帐号已经定制', '', '2021-09-14 11:32:44.084601', null, '2021-09-14 11:32:44.084601', null, null, null, '该帐号已经定制', null);
INSERT INTO `ss_dicdata` VALUES ('194', 'PosErr', 'FR', '定制已超过有效期', '', '2021-09-14 11:32:44.084601', null, '2021-09-14 11:32:44.084601', null, null, null, '定制已超过有效期', null);
INSERT INTO `ss_dicdata` VALUES ('195', 'PosErr', 'FE', 'IC卡不允许做刷卡交易', '', '2021-09-14 11:32:44.084601', null, '2021-09-14 11:32:44.084601', null, null, null, 'IC卡不允许做刷卡交易', null);
INSERT INTO `ss_dicdata` VALUES ('196', 'PosErr', 'FD', '汇率查询不允许手输卡号', '', '2021-09-14 11:32:44.084601', null, '2021-09-14 11:32:44.084601', null, null, null, '汇率查询不允许手输卡号', null);
INSERT INTO `ss_dicdata` VALUES ('197', 'PosErr', 'N0', '该卡不支持DCC交易', '', '2021-09-14 11:32:44.084601', null, '2021-09-14 11:32:44.084601', null, null, null, '该卡不支持DCC交易', null);
INSERT INTO `ss_dicdata` VALUES ('198', 'PosErr', 'G1', '无此交易类型', '', '2021-09-14 11:32:44.084601', null, '2021-09-14 11:32:44.084601', null, null, null, '无此交易类型', null);
INSERT INTO `ss_dicdata` VALUES ('199', 'PosErr', 'G2', '无此厂商', '', '2021-09-14 11:32:44.084601', null, '2021-09-14 11:32:44.084601', null, null, null, '无此厂商', null);
INSERT INTO `ss_dicdata` VALUES ('200', 'PosErr', 'G3', '无此终端型号', '', '2021-09-14 11:32:44.084601', null, '2021-09-14 11:32:44.084601', null, null, null, '无此终端型号', null);
INSERT INTO `ss_dicdata` VALUES ('201', 'PosErr', 'G4', '无此终端序列号', '', '2021-09-14 11:32:44.084601', null, '2021-09-14 11:32:44.084601', null, null, null, '无此终端序列号', null);
INSERT INTO `ss_dicdata` VALUES ('202', 'PosErr', 'G5', '无此商户', '', '2021-09-14 11:32:44.084601', null, '2021-09-14 11:32:44.084601', null, null, null, '无此商户', null);
INSERT INTO `ss_dicdata` VALUES ('203', 'PosErr', 'G6', '无此应用标识', '', '2021-09-14 11:32:44.084601', null, '2021-09-14 11:32:44.084601', null, null, null, '无此应用标识', null);
INSERT INTO `ss_dicdata` VALUES ('204', 'PosErr', 'G7', '放弃当前交易', '', '2021-09-14 11:32:44.084601', null, '2021-09-14 11:32:44.084601', null, null, null, '放弃当前交易', null);
INSERT INTO `ss_dicdata` VALUES ('205', 'PosErr', 'G8', '终端校验TMSMAC值错误', '', '2021-09-14 11:32:44.084601', null, '2021-09-14 11:32:44.084601', null, null, null, '终端校验TMSMAC值错误', null);
INSERT INTO `ss_dicdata` VALUES ('206', 'PosErr', 'G9', '终端下载失败', '', '2021-09-14 11:32:44.084601', null, '2021-09-14 11:32:44.084601', null, null, null, '终端下载失败', null);
INSERT INTO `ss_dicdata` VALUES ('207', 'PosErr', 'H1', '终端下载未完成', '', '2021-09-14 11:32:44.084601', null, '2021-09-14 11:32:44.084601', null, null, null, '终端下载未完成', null);
INSERT INTO `ss_dicdata` VALUES ('208', 'PosErr', 'H2', 'CRC校验错误', '', '2021-09-14 11:32:44.084601', null, '2021-09-14 11:32:44.084601', null, null, null, 'CRC校验错误', null);
INSERT INTO `ss_dicdata` VALUES ('209', 'PosErr', 'RP', '电子现金退货重复交易', '', '2021-09-14 11:32:44.084601', null, '2021-09-14 11:32:44.084601', null, null, null, '终端发起重复电子现金退货交易', null);
INSERT INTO `ss_dicdata` VALUES ('210', 'PosErr', 'T1', '二维码号已使用', '', '2021-09-14 11:32:44.084601', null, '2021-09-14 11:32:44.084601', null, null, null, '二维码号已使用', null);
INSERT INTO `ss_dicdata` VALUES ('211', 'PosErr', 'T2', '二维码号已过期', '', '2021-09-14 11:32:44.084601', null, '2021-09-14 11:32:44.084601', null, null, null, '二维码号已过期', null);
INSERT INTO `ss_dicdata` VALUES ('212', 'PosErr', 'T3', '二维码号已撤销', '', '2021-09-14 11:32:44.084601', null, '2021-09-14 11:32:44.084601', null, null, null, '二维码号已撤销', null);
INSERT INTO `ss_dicdata` VALUES ('213', 'PosErr1', 'PosErr1', '银行POS报错信息', '', '2021-09-14 11:32:44.084601', null, '2021-09-14 11:32:44.084601', null, null, null, null, null);
INSERT INTO `ss_dicdata` VALUES ('214', 'SYS', 'HI_TYPE', '医保类型', '', '2021-11-30 21:02:59.133202', null, '2021-11-30 21:02:59.133202', null, null, null, null, null);
INSERT INTO `ss_dicdata` VALUES ('215', 'HI_TYPE', '00A', '标准版', '', '2021-11-30 21:04:45.625526', null, '2021-11-30 21:04:45.625526', null, null, null, null, null);
INSERT INTO `ss_dicdata` VALUES ('216', 'HI_TYPE', 'ZZB', 'ZZBA', '', '2021-11-30 21:04:45.625526', null, '2021-11-30 21:04:45.625526', null, null, null, null, null);
INSERT INTO `ss_dicdata` VALUES ('217', 'SYS', 'INSU_CONFIGTYPE', '配置类型--保留 用不到', '', '2021-11-30 21:02:59.133202', null, '2021-11-30 21:02:59.133202', null, null, null, null, null);
INSERT INTO `ss_dicdata` VALUES ('218', 'INSU_CONFIGTYPE', '0', '线下', '', '2021-11-30 21:02:59.133202', null, '2021-11-30 21:02:59.133202', null, null, null, null, null);
INSERT INTO `ss_dicdata` VALUES ('219', 'INSU_CONFIGTYPE', '1', '线上', '', '2021-11-30 21:02:59.133202', null, '2021-11-30 21:02:59.133202', null, null, null, null, null);
INSERT INTO `ss_dicdata` VALUES ('220', 'SYS', 'ShowEQInfo', '是否在自助机显示设备信息', 'concode=Y显示N不显示', '2021-11-30 21:02:59.133202', null, '2021-11-30 21:02:59.133202', null, 'Y', 'condesc配置显示字体样式style字符串', 'color:red;font-size:40px;', null);
INSERT INTO `ss_dicdata` VALUES ('221', 'SYS', 'HISInterfaceInfo', 'HIS接口配置信息', null, '2021-12-07 17:26:51.000000', null, '2021-12-07 17:26:53.000000', null, null, null, null, null);
INSERT INTO `ss_dicdata` VALUES ('222', 'HISInterfaceInfo', 'url', '地址(注意地址中也有密钥)', 'http://10.80.7.10/imedical/web/Webservice.BILLSelfPay.CLS?WSDL=1&CacheUserName=dhwebservice&CachePassword=dhwebservice&CacheNoRedirect=1', '2021-12-07 17:27:46.000000', null, '2021-12-07 17:27:47.000000', null, null, null, null, null);
INSERT INTO `ss_dicdata` VALUES ('223', 'HISInterfaceInfo', 'username', '用户名', 'dhwebservice', '2021-12-07 17:28:06.000000', null, '2021-12-07 17:28:08.000000', null, null, null, null, null);
INSERT INTO `ss_dicdata` VALUES ('224', 'HISInterfaceInfo', 'password', '密码', 'dhwebservice', '2021-12-07 17:28:15.000000', null, '2021-12-07 17:28:17.000000', null, null, null, null, null);
INSERT INTO `ss_dicdata` VALUES ('225', 'PageUrl', 'PayingList', '查询待缴费订单', '', '2021-12-14 11:38:07.229257', null, '2021-12-14 11:38:07.229257', null, null, null, null, null);
