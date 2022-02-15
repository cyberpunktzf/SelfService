/*
Navicat MySQL Data Transfer

Source Server         : 127.0.0.1
Source Server Version : 50725
Source Host           : 10.80.6.10:8090
Source Database       : selfservice

Target Server Type    : MYSQL
Target Server Version : 50725
File Encoding         : 65001

Date: 2022-01-18 14:41:35
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for ss_eqrole
-- ----------------------------
DROP TABLE IF EXISTS `ss_eqrole`;
CREATE TABLE `ss_eqrole` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `ss_eqro_code` varchar(20) DEFAULT NULL,
  `ss_eqro_desc` varchar(50) DEFAULT NULL,
  `ss_eqro_createdate` datetime(6) NOT NULL,
  `ss_eqro_creator` varchar(50) DEFAULT NULL,
  `ss_eqro_update` datetime(6) NOT NULL,
  `ss_eqro_upuser` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of ss_eqrole
-- ----------------------------
INSERT INTO `ss_eqrole` VALUES ('1', 'role1', '缴费挂号立式', '2021-09-02 10:48:12.353195', null, '2021-09-02 10:48:12.353195', null);
INSERT INTO `ss_eqrole` VALUES ('2', 'role2', '壁挂机', '2021-09-02 10:48:34.609632', null, '2021-09-02 10:48:34.609632', null);
INSERT INTO `ss_eqrole` VALUES ('3', 'role3', '电子发票打印机', '2021-09-02 10:48:59.084111', null, '2021-09-02 10:48:59.084111', null);
INSERT INTO `ss_eqrole` VALUES ('4', 'admin', '管理员', '2021-09-02 10:50:58.951284', null, '2021-09-02 10:50:58.951284', null);
