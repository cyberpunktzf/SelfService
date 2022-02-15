/*
Navicat MySQL Data Transfer

Source Server         : 127.0.0.1
Source Server Version : 50725
Source Host           : 10.80.6.10:8090
Source Database       : selfservice

Target Server Type    : MYSQL
Target Server Version : 50725
File Encoding         : 65001

Date: 2022-01-18 14:41:42
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for ss_eqroleconfig
-- ----------------------------
DROP TABLE IF EXISTS `ss_eqroleconfig`;
CREATE TABLE `ss_eqroleconfig` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `ss_eqrolecfg_code` varchar(20) DEFAULT NULL,
  `ss_eqrolecfg_desc` varchar(20) DEFAULT NULL,
  `ss_eqrolecfg_cfgcode` varchar(50) DEFAULT NULL,
  `ss_eqrolecfg_cfgdesc` varchar(100) DEFAULT NULL,
  `ss_eqrolecfg_cfgvalue` varchar(500) DEFAULT NULL,
  `ss_eqrolecfg_actflg` varchar(5) DEFAULT NULL,
  `ss_eqrolecfg_createdate` datetime(6) NOT NULL,
  `ss_eqrolecfg_creator` varchar(50) DEFAULT NULL,
  `ss_eqrolecfg_update` datetime(6) NOT NULL,
  `ss_eqrolecfg_upuser` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `ss_eqroleconfig_ss_eqrolecfg_code_35a06e72` (`ss_eqrolecfg_code`),
  KEY `ss_eqroleconfig_ss_eqrolecfg_cfgcode_412d9ad0` (`ss_eqrolecfg_cfgcode`),
  KEY `ss_eqroleconfig_ss_eqrolecfg_actflg_d79e1ab5` (`ss_eqrolecfg_actflg`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of ss_eqroleconfig
-- ----------------------------
INSERT INTO `ss_eqroleconfig` VALUES ('1', 'role2', '壁挂机', 'paymode', '支付方式', 'WECHAT', 'Y', '2021-12-06 20:41:34.000000', '', '2021-12-06 20:41:28.000000', '');
INSERT INTO `ss_eqroleconfig` VALUES ('2', 'role2', '壁挂机', 'paymode', '支付方式', 'AlIPAY', 'Y', '2021-12-07 10:36:44.000000', '', '2021-12-07 10:36:46.000000', '');
