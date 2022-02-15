/*
Navicat MySQL Data Transfer

Source Server         : 127.0.0.1
Source Server Version : 50725
Source Host           : 10.80.6.10:8090
Source Database       : selfservice

Target Server Type    : MYSQL
Target Server Version : 50725
File Encoding         : 65001

Date: 2022-01-18 14:42:32
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for ss_eqrule
-- ----------------------------
DROP TABLE IF EXISTS `ss_eqrule`;
CREATE TABLE `ss_eqrule` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `ss_eqr_type` varchar(20) DEFAULT NULL,
  `ss_eqr_code` varchar(50) DEFAULT NULL,
  `ss_eqr_desc` varchar(100) DEFAULT NULL,
  `ss_eqr_demo` varchar(50) DEFAULT NULL,
  `ss_eqr_stdate` datetime(6) DEFAULT NULL,
  `ss_eqr_enddate` datetime(6) DEFAULT NULL,
  `ss_eqr_createdate` datetime(6) NOT NULL,
  `ss_eqr_creator` varchar(50) DEFAULT NULL,
  `ss_eqr_update` datetime(6) NOT NULL,
  `ss_eqr_upuser` varchar(50) DEFAULT NULL,
  `ss_eqr_savemode` varchar(25) DEFAULT NULL,
  `ss_eqr_saveval` varchar(25) DEFAULT NULL,
  `ss_eqr_actflag` varchar(25) DEFAULT NULL,
  `ss_eqr_conflag` varchar(5) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of ss_eqrule
-- ----------------------------
INSERT INTO `ss_eqrule` VALUES ('1', 'StopBusiness', 'StopBusiness', '是否允许使用该业务', '', '2021-12-13 17:45:39.000000', '2021-12-13 17:45:43.000000', '2021-12-13 17:45:46.000000', '', '2021-12-13 17:45:51.000000', '', '', '', 'N', '');
INSERT INTO `ss_eqrule` VALUES ('2', 'checkStopInsu', 'checkStopInsu', '是否允许使用该医保类型', '', '2021-12-13 17:47:03.000000', '2021-12-13 17:47:06.000000', '2021-12-13 17:47:08.000000', '', '2021-12-13 17:47:10.000000', '', '', '', 'N', '');
