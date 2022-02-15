/*
Navicat MySQL Data Transfer

Source Server         : 127.0.0.1
Source Server Version : 50725
Source Host           : 10.80.6.10:8090
Source Database       : selfservice

Target Server Type    : MYSQL
Target Server Version : 50725
File Encoding         : 65001

Date: 2022-01-18 14:41:27
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for ss_eqlistconfig
-- ----------------------------
DROP TABLE IF EXISTS `ss_eqlistconfig`;
CREATE TABLE `ss_eqlistconfig` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `ss_eqlistc_code` varchar(20) DEFAULT NULL,
  `ss_eqlistc_desc` varchar(50) DEFAULT NULL,
  `ss_eqlistc_cfgcode` varchar(50) DEFAULT NULL,
  `ss_eqlistc_cfgdesc` varchar(100) DEFAULT NULL,
  `ss_eqlistc_createdate` datetime(6) NOT NULL,
  `ss_eqlistc_creator` varchar(50) DEFAULT NULL,
  `ss_eqlistc_update` datetime(6) NOT NULL,
  `ss_eqlistc_upuser` varchar(50) DEFAULT NULL,
  `ss_eqlistc_cfgvalue` varchar(500) DEFAULT NULL,
  `ss_eqlistc_cfgvaluedemo` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=129 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of ss_eqlistconfig
-- ----------------------------
INSERT INTO `ss_eqlistconfig` VALUES ('1', 'DH31-46', '开发机', 'processcode', '流程配置', '2021-09-03 14:36:02.000000', null, '2021-09-03 14:36:07.000000', null, 'Main', null);
INSERT INTO `ss_eqlistconfig` VALUES ('2', 'BGJ19', '壁挂机测试1111', 'processcode', '流程配置', '2021-09-03 14:36:02.000000', null, '2021-09-03 14:36:07.000000', null, 'TestReg', null);
INSERT INTO `ss_eqlistconfig` VALUES ('3', 'C8NCZBJXDMFYUK3', '电子发票打印机', 'processcode', '流程配置', '2021-09-03 14:36:02.000000', null, '2021-09-03 14:36:07.000000', null, 'EIP', null);
INSERT INTO `ss_eqlistconfig` VALUES ('4', 'WIN-1MDNOQHL2T2', '自助机服务器', 'processcode', '流程配置', '2021-09-03 14:36:02.000000', null, '2021-09-03 14:36:07.000000', null, 'Main', null);
INSERT INTO `ss_eqlistconfig` VALUES ('5', 'ZZJ51', '门诊二楼内科右1', 'processcode', '流程配置', '2021-09-03 14:36:02.000000', null, '2021-09-03 14:36:07.000000', null, 'Main', null);
INSERT INTO `ss_eqlistconfig` VALUES ('6', 'ZZJ41', '(田)开发机', 'processcode', '流程配置', '2021-09-03 14:36:02.000000', null, '2021-09-03 14:36:07.000000', null, 'Main', null);
INSERT INTO `ss_eqlistconfig` VALUES ('10', 'BGJ2', '门诊楼1楼楼梯口', 'processcode', '流程配置', '2021-09-13 00:00:00.000000', '', '2021-09-13 00:00:00.000000', '', 'EP', null);
INSERT INTO `ss_eqlistconfig` VALUES ('13', 'BGJ1', '壁挂自助机', 'processcode', '流程配置', '2021-09-13 11:14:06.855046', '', '2021-09-13 11:14:06.855071', '', 'EP', null);
INSERT INTO `ss_eqlistconfig` VALUES ('15', 'ZZJ2', '自助机', 'processcode', '流程配置', '2021-09-13 11:20:20.036921', '', '2021-09-13 11:20:20.036947', '', 'Main', null);
INSERT INTO `ss_eqlistconfig` VALUES ('16', 'ZZJ3', '自助机', 'processcode', '流程配置', '2021-09-13 11:21:15.588193', '', '2021-09-13 11:21:15.588217', '', 'Main', null);
INSERT INTO `ss_eqlistconfig` VALUES ('20', 'ZZJ4', '自助机', 'processcode', '流程配置', '2021-09-13 00:00:00.000000', '', '2021-09-13 00:00:00.000000', '', 'NAReg', null);
INSERT INTO `ss_eqlistconfig` VALUES ('23', 'ZZJ5', '自助机', 'processcode', '流程配置', '2021-09-13 00:00:00.000000', '', '2021-09-13 00:00:00.000000', '', 'NAReg', null);
INSERT INTO `ss_eqlistconfig` VALUES ('29', 'ZZJ7', '自助机', 'processcode', '流程配置', '2021-09-13 00:00:00.000000', '', '2021-09-13 00:00:00.000000', '', 'Main', null);
INSERT INTO `ss_eqlistconfig` VALUES ('30', 'ZZJ6', '自助机', 'processcode', '流程配置', '2021-09-13 11:39:52.301160', '', '2021-09-13 11:39:52.301185', '', 'Main', null);
INSERT INTO `ss_eqlistconfig` VALUES ('31', 'ZZJ8', '自助机', 'processcode', '流程配置', '2021-09-13 00:00:00.000000', '', '2021-09-13 00:00:00.000000', '', 'Main', null);
INSERT INTO `ss_eqlistconfig` VALUES ('32', 'ZZJ9', '自助机', 'processcode', '流程配置', '2021-09-13 00:00:00.000000', '', '2021-09-13 00:00:00.000000', '', 'Main', null);
INSERT INTO `ss_eqlistconfig` VALUES ('33', 'ZZJ10', '自助机', 'processcode', '流程配置', '2021-09-13 00:00:00.000000', '', '2021-09-13 00:00:00.000000', '', 'Main', null);
INSERT INTO `ss_eqlistconfig` VALUES ('34', 'ZZJ11', '自助机', 'processcode', '流程配置', '2021-09-13 00:00:00.000000', '', '2021-09-13 00:00:00.000000', '', 'Main', null);
INSERT INTO `ss_eqlistconfig` VALUES ('35', 'ZZJ12', '自助机', 'processcode', '流程配置', '2021-09-13 00:00:00.000000', '', '2021-09-13 00:00:00.000000', '', 'Main', null);
INSERT INTO `ss_eqlistconfig` VALUES ('36', 'ZZJ13', '自助机', 'processcode', '流程配置', '2021-09-13 00:00:00.000000', '', '2021-09-13 00:00:00.000000', '', 'Main', null);
INSERT INTO `ss_eqlistconfig` VALUES ('37', 'ZZJ14', '自助机', 'processcode', '流程配置', '2021-09-13 00:00:00.000000', '', '2021-09-13 00:00:00.000000', '', 'Main', null);
INSERT INTO `ss_eqlistconfig` VALUES ('38', 'ZZJ15', '自助机', 'processcode', '流程配置', '2021-09-13 00:00:00.000000', '', '2021-09-13 00:00:00.000000', '', 'Main', null);
INSERT INTO `ss_eqlistconfig` VALUES ('39', 'ZZJ16', '自助机', 'processcode', '流程配置', '2021-09-13 00:00:00.000000', '', '2021-09-13 00:00:00.000000', '', 'Main', null);
INSERT INTO `ss_eqlistconfig` VALUES ('40', 'ZZJ17', '自助机', 'processcode', '流程配置', '2021-09-13 00:00:00.000000', '', '2021-09-13 00:00:00.000000', '', 'Main', null);
INSERT INTO `ss_eqlistconfig` VALUES ('41', 'ZZJ18', '自助机', 'processcode', '流程配置', '2021-09-13 00:00:00.000000', '', '2021-09-13 00:00:00.000000', '', 'Main', null);
INSERT INTO `ss_eqlistconfig` VALUES ('42', 'ZZJ19', '自助机', 'processcode', '流程配置', '2021-09-13 00:00:00.000000', '', '2021-09-13 00:00:00.000000', '', 'Main', null);
INSERT INTO `ss_eqlistconfig` VALUES ('43', 'ZZJ20', '自助机', 'processcode', '流程配置', '2021-09-13 00:00:00.000000', '', '2021-09-13 00:00:00.000000', '', 'Main', null);
INSERT INTO `ss_eqlistconfig` VALUES ('44', 'ZZJ21', '自助机', 'processcode', '流程配置', '2021-09-13 00:00:00.000000', '', '2021-09-13 00:00:00.000000', '', 'Main', null);
INSERT INTO `ss_eqlistconfig` VALUES ('51', 'ZZJ22', '自助机', 'processcode', '流程配置', '2021-09-13 00:00:00.000000', '', '2021-09-13 00:00:00.000000', '', 'NAReg', null);
INSERT INTO `ss_eqlistconfig` VALUES ('52', 'ZZJ23', '自助机', 'processcode', '流程配置', '2021-09-13 00:00:00.000000', '', '2021-09-13 00:00:00.000000', '', 'NAReg', null);
INSERT INTO `ss_eqlistconfig` VALUES ('53', 'ZZJ24', '自助机', 'processcode', '流程配置', '2021-09-13 00:00:00.000000', '', '2021-09-13 00:00:00.000000', '', 'HXReg-Menu', null);
INSERT INTO `ss_eqlistconfig` VALUES ('54', 'ZZJ25', '自助机', 'processcode', '流程配置', '2021-09-13 00:00:00.000000', '', '2021-09-13 00:00:00.000000', '', 'FROP', null);
INSERT INTO `ss_eqlistconfig` VALUES ('55', 'ZZJ26', '自助机', 'processcode', '流程配置', '2021-09-13 00:00:00.000000', '', '2021-09-13 00:00:00.000000', '', 'Main', null);
INSERT INTO `ss_eqlistconfig` VALUES ('56', 'ZZJ27', '自助机', 'processcode', '流程配置', '2021-09-13 00:00:00.000000', '', '2021-09-13 00:00:00.000000', '', 'Main', null);
INSERT INTO `ss_eqlistconfig` VALUES ('57', 'ZZJ28', '自助机', 'processcode', '流程配置', '2021-09-13 00:00:00.000000', '', '2021-09-13 00:00:00.000000', '', 'Main', null);
INSERT INTO `ss_eqlistconfig` VALUES ('58', 'ZZJ29', 'ZZJ29', 'processcode', '流程配置', '2021-09-13 00:00:00.000000', '', '2021-09-13 00:00:00.000000', '', 'Main', null);
INSERT INTO `ss_eqlistconfig` VALUES ('59', 'ZZJ30', '自助机', 'processcode', '流程配置', '2021-09-13 00:00:00.000000', '', '2021-09-13 00:00:00.000000', '', 'Main', null);
INSERT INTO `ss_eqlistconfig` VALUES ('61', 'ZZJ31', '自助机', 'processcode', '流程配置', '2021-09-13 00:00:00.000000', '', '2021-09-13 00:00:00.000000', '', 'Main', null);
INSERT INTO `ss_eqlistconfig` VALUES ('62', 'ZZJ32', '自助机', 'processcode', '流程配置', '2021-09-13 00:00:00.000000', '', '2021-09-13 00:00:00.000000', '', 'Main', null);
INSERT INTO `ss_eqlistconfig` VALUES ('63', 'ZZJ33', '自助机', 'processcode', '流程配置', '2021-09-13 00:00:00.000000', '', '2021-09-13 00:00:00.000000', '', 'Main', null);
INSERT INTO `ss_eqlistconfig` VALUES ('64', 'ZZJ34', '自助机', 'processcode', '流程配置', '2021-09-13 00:00:00.000000', '', '2021-09-13 00:00:00.000000', '', 'NAReg', null);
INSERT INTO `ss_eqlistconfig` VALUES ('66', 'BGJ3', '壁挂自助机', 'processcode', '流程配置', '2021-09-13 00:00:00.000000', '', '2021-09-13 00:00:00.000000', '', 'BGJ-Main', null);
INSERT INTO `ss_eqlistconfig` VALUES ('67', 'BGJ4', '壁挂自助机', 'processcode', '流程配置', '2021-09-13 00:00:00.000000', '', '2021-09-13 00:00:00.000000', '', 'NAReg', null);
INSERT INTO `ss_eqlistconfig` VALUES ('68', 'BGJ5', '壁挂自助机', 'processcode', '流程配置', '2021-09-13 00:00:00.000000', '', '2021-09-13 00:00:00.000000', '', 'BGJ-Main', null);
INSERT INTO `ss_eqlistconfig` VALUES ('69', 'BGJ6', '壁挂自助机', 'processcode', '流程配置', '2021-09-13 00:00:00.000000', '', '2021-09-13 00:00:00.000000', '', 'BGJ-Main', null);
INSERT INTO `ss_eqlistconfig` VALUES ('70', 'BGJ7', '壁挂自助机', 'processcode', '流程配置', '2021-09-13 00:00:00.000000', '', '2021-09-13 00:00:00.000000', '', 'NAReg', null);
INSERT INTO `ss_eqlistconfig` VALUES ('71', 'BGJ8', '壁挂自助机', 'processcode', '流程配置', '2021-09-13 00:00:00.000000', '', '2021-09-13 00:00:00.000000', '', 'BGJ-Main', null);
INSERT INTO `ss_eqlistconfig` VALUES ('72', 'BGJ9', '壁挂自助机', 'processcode', '流程配置', '2021-09-13 00:00:00.000000', '', '2021-09-13 00:00:00.000000', '', 'BGJ-Main', null);
INSERT INTO `ss_eqlistconfig` VALUES ('73', 'BGJ10', '体检壁挂机', 'processcode', '流程配置', '2021-09-13 00:00:00.000000', '', '2021-09-13 00:00:00.000000', '', 'BGJTJOP', null);
INSERT INTO `ss_eqlistconfig` VALUES ('74', 'BGJ11', '壁挂自助机', 'processcode', '流程配置', '2021-09-13 00:00:00.000000', '', '2021-09-13 00:00:00.000000', '', 'BGJ-Main', null);
INSERT INTO `ss_eqlistconfig` VALUES ('75', 'BGJ12', '壁挂自助机', 'processcode', '流程配置', '2021-09-13 00:00:00.000000', '', '2021-09-13 00:00:00.000000', '', 'BGJ-Main', null);
INSERT INTO `ss_eqlistconfig` VALUES ('76', 'BGJ13', '壁挂自助机', 'processcode', '流程配置', '2021-09-13 00:00:00.000000', '', '2021-09-13 00:00:00.000000', '', 'HXReg-Menu', null);
INSERT INTO `ss_eqlistconfig` VALUES ('77', 'BGJ14', '壁挂自助机', 'processcode', '流程配置', '2021-09-13 00:00:00.000000', '', '2021-09-13 00:00:00.000000', '', 'BGJ-Main', null);
INSERT INTO `ss_eqlistconfig` VALUES ('78', 'BGJ15', '壁挂自助机', 'processcode', '流程配置', '2021-09-13 00:00:00.000000', '', '2021-09-13 00:00:00.000000', '', 'BGJ-Main', null);
INSERT INTO `ss_eqlistconfig` VALUES ('79', 'BGJ16', '壁挂自助机', 'processcode', '流程配置', '2021-09-13 00:00:00.000000', '', '2021-09-13 00:00:00.000000', '', 'EP', null);
INSERT INTO `ss_eqlistconfig` VALUES ('82', 'ZZJ42', '自助机', 'processcode', '流程配置', '2021-09-13 00:00:00.000000', '', '2021-09-13 00:00:00.000000', '', 'Main', null);
INSERT INTO `ss_eqlistconfig` VALUES ('83', 'ZZJ37', '自助机', 'processcode', '流程配置', '2021-09-13 00:00:00.000000', '', '2021-09-13 00:00:00.000000', '', 'Main', null);
INSERT INTO `ss_eqlistconfig` VALUES ('84', 'BGJ18', '壁挂自助机', 'processcode', '流程配置', '2021-09-13 00:00:00.000000', '', '2021-09-13 00:00:00.000000', '', 'BGJ-Main', null);
INSERT INTO `ss_eqlistconfig` VALUES ('85', 'ZZJ38', '自助机', 'processcode', '流程配置', '2021-09-13 00:00:00.000000', '', '2021-09-13 00:00:00.000000', '', 'EIP', null);
INSERT INTO `ss_eqlistconfig` VALUES ('86', 'ZZJ39', '自助机', 'processcode', '流程配置', '2021-09-13 00:00:00.000000', '', '2021-09-13 00:00:00.000000', '', 'EIP', null);
INSERT INTO `ss_eqlistconfig` VALUES ('90', 'ZZJ47', '自助机', 'processcode', '流程配置', '2021-09-03 14:36:02.000000', null, '2021-09-03 14:36:07.000000', null, 'NAReg', null);
INSERT INTO `ss_eqlistconfig` VALUES ('91', 'ZZJ43', '46所2楼测试', 'processcode', '流程配置', '2021-09-03 14:36:02.000000', null, '2021-09-03 14:36:07.000000', null, 'Main', null);
INSERT INTO `ss_eqlistconfig` VALUES ('92', 'ZZJ45', '46所2楼测试', 'processcode', '流程配置', '2021-09-03 14:36:02.000000', null, '2021-09-03 14:36:07.000000', null, 'Main', null);
INSERT INTO `ss_eqlistconfig` VALUES ('93', 'ZZJ46', '46所2楼测试', 'processcode', '流程配置', '2021-09-03 14:36:02.000000', null, '2021-09-03 14:36:07.000000', null, 'Main', null);
INSERT INTO `ss_eqlistconfig` VALUES ('96', 'ZZJ48', 'ZZJ48', 'processcode', '流程配置', '2021-09-16 00:37:02.745862', '', '2021-09-16 00:37:02.745862', '', 'Main', null);
INSERT INTO `ss_eqlistconfig` VALUES ('98', 'ZZJ49', 'ZZJ49', 'processcode', '流程配置', '2021-09-16 00:47:11.679663', null, '2021-09-16 00:47:11.679690', null, 'Main', null);
INSERT INTO `ss_eqlistconfig` VALUES ('99', 'ZZJ50', 'ZZJ50', 'processcode', '流程配置', '2021-09-16 01:29:34.305000', null, '2021-09-16 01:29:34.305026', null, 'Main', null);
INSERT INTO `ss_eqlistconfig` VALUES ('101', 'ZZJ1', '一楼农行自助机区域左侧', 'processcode', '流程配置', '2021-09-16 02:01:33.432318', '', '2021-09-16 02:01:33.432318', '', 'Main', null);
INSERT INTO `ss_eqlistconfig` VALUES ('102', 'ZZJ35', '门诊一楼大厅', 'processcode', '流程配置', '2021-09-16 02:02:27.779582', null, '2021-09-16 02:02:27.779609', null, 'Main', null);
INSERT INTO `ss_eqlistconfig` VALUES ('103', 'ZZJ36', '门诊一楼挂号收费', 'processcode', '流程配置', '2021-09-16 02:11:59.908209', null, '2021-09-16 02:11:59.908237', null, 'Main', null);
INSERT INTO `ss_eqlistconfig` VALUES ('104', 'ZZJ40', '发热门诊', 'processcode', '流程配置', '2021-09-17 10:28:40.402048', null, '2021-09-17 10:28:40.402074', null, 'FROP', null);
INSERT INTO `ss_eqlistconfig` VALUES ('105', 'BGJ17', '发热门诊', 'processcode', '流程配置', '2021-09-17 10:30:23.944215', null, '2021-09-17 10:30:23.944241', null, 'FROP', null);
INSERT INTO `ss_eqlistconfig` VALUES ('106', 'ZZ3', '壁挂机三楼2', 'processcode', '流程配置', '2021-09-17 10:30:23.944215', null, '2021-09-17 10:30:23.944241', null, 'Main', null);
INSERT INTO `ss_eqlistconfig` VALUES ('107', 'ZZJ53', 'ZZJ53', 'processcode', '流程配置', '2021-09-20 21:41:27.205650', null, '2021-09-20 21:41:27.205676', null, 'Main', null);
INSERT INTO `ss_eqlistconfig` VALUES ('108', 'ZZJ52', '移植楼A1', 'processcode', '流程配置', '2021-09-20 21:41:51.192465', null, '2021-09-20 21:41:51.192492', null, 'Main', null);
INSERT INTO `ss_eqlistconfig` VALUES ('111', 'BGJ21', 'BGJ21', 'processcode', '流程配置', '2021-09-22 15:36:20.683118', null, '2021-09-22 15:36:20.683145', null, 'Main', null);
INSERT INTO `ss_eqlistconfig` VALUES ('112', 'ZZ1', 'ZZ1', 'processcode', '流程配置', '2021-09-22 16:15:46.388512', null, '2021-09-22 16:15:46.388540', null, 'BGJ-Main', null);
INSERT INTO `ss_eqlistconfig` VALUES ('113', 'ZZJ6', '3楼左2', 'proceecode', '流程配置', '2021-09-22 16:48:20.389574', null, '2021-09-22 16:48:20.389601', null, 'FROP', null);
INSERT INTO `ss_eqlistconfig` VALUES ('114', 'ZZ2', '3楼左2', 'proceecode', '流程配置', '2021-09-22 16:48:20.389574', null, '2021-09-22 16:48:20.389601', null, 'BGJ-Main', null);
INSERT INTO `ss_eqlistconfig` VALUES ('115', 'BGJ17', 'BGJ17', 'paymode', '支付方式', '2021-12-07 10:40:13.000000', null, '2021-12-07 10:40:16.000000', null, 'AlIPAY', null);
INSERT INTO `ss_eqlistconfig` VALUES ('116', 'ZZJ40', 'ZZJ40', 'paymode', '支付方式', '2021-12-07 10:41:02.000000', null, '2021-12-07 10:41:06.000000', null, 'WECHAT', null);
INSERT INTO `ss_eqlistconfig` VALUES ('117', 'ZZJ40', 'ZZJ40', 'paymode', '支付方式', '2021-12-07 10:41:02.000000', null, '2021-12-07 10:41:06.000000', null, 'AlIPAY', null);
INSERT INTO `ss_eqlistconfig` VALUES ('118', 'ZZJ25', null, 'paymode', '支付方式', '2021-12-07 10:41:02.000000', null, '2021-12-07 10:41:06.000000', null, 'WECHAT', null);
INSERT INTO `ss_eqlistconfig` VALUES ('119', 'ZZJ25', null, 'paymode', '支付方式', '2021-12-07 10:41:02.000000', null, '2021-12-07 10:41:06.000000', null, 'AlIPAY', null);
INSERT INTO `ss_eqlistconfig` VALUES ('120', 'ZZJ18', null, 'paymode', '支付方式', '2021-12-07 10:41:02.000000', null, '2021-12-07 10:41:06.000000', null, 'WECHAT', null);
INSERT INTO `ss_eqlistconfig` VALUES ('121', 'ZZJ18', null, 'paymode', '支付方式', '2021-12-07 10:41:02.000000', null, '2021-12-07 10:41:06.000000', null, 'AlIPAY', null);
INSERT INTO `ss_eqlistconfig` VALUES ('122', 'ZZJ21', null, 'paymode', '支付方式', '2021-12-07 10:41:02.000000', null, '2021-12-07 10:41:06.000000', null, 'WECHAT', null);
INSERT INTO `ss_eqlistconfig` VALUES ('123', 'ZZJ21', null, 'paymode', '支付方式', '2021-12-07 10:41:02.000000', null, '2021-12-07 10:41:06.000000', null, 'AlIPAY', null);
INSERT INTO `ss_eqlistconfig` VALUES ('124', 'ZZJ1', null, 'paymode', '支付方式', '2021-12-07 10:41:02.000000', null, '2021-12-07 10:41:06.000000', null, 'WECHAT', null);
INSERT INTO `ss_eqlistconfig` VALUES ('125', 'ZZJ1', null, 'paymode', '支付方式', '2021-12-07 10:41:02.000000', null, '2021-12-07 10:41:06.000000', null, 'AlIPAY', null);
INSERT INTO `ss_eqlistconfig` VALUES ('126', 'ZZJ17', null, 'paymode', '支付方式', '2021-12-07 10:41:02.000000', null, '2021-12-07 10:41:06.000000', null, 'WECHAT', null);
INSERT INTO `ss_eqlistconfig` VALUES ('127', 'ZZJ17', null, 'paymode', '支付方式', '2021-12-07 10:41:02.000000', null, '2021-12-07 10:41:06.000000', null, 'AlIPAY', null);
INSERT INTO `ss_eqlistconfig` VALUES ('128', 'ZZ3', null, 'unshowl1dep', '不展示的1级科室', '2021-12-07 10:41:02.000000', null, '2021-12-07 10:41:06.000000', null, '5', null);
