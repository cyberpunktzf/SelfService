/*
Navicat MySQL Data Transfer

Source Server         : 127.0.0.1
Source Server Version : 50725
Source Host           : 10.80.6.10:8090
Source Database       : selfservice

Target Server Type    : MYSQL
Target Server Version : 50725
File Encoding         : 65001

Date: 2022-01-18 14:42:02
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for ss_eqrdetails
-- ----------------------------
DROP TABLE IF EXISTS `ss_eqrdetails`;
CREATE TABLE `ss_eqrdetails` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `ss_eqrd_type` varchar(20) DEFAULT NULL,
  `ss_eqrd_code` varchar(50) DEFAULT NULL,
  `ss_eqrd_stval` varchar(100) DEFAULT NULL,
  `ss_eqrd_endval` varchar(100) DEFAULT NULL,
  `ss_eqrd_option` varchar(10) DEFAULT NULL,
  `ss_eqrd_stdate` datetime(6) DEFAULT NULL,
  `ss_eqrd_enddate` datetime(6) DEFAULT NULL,
  `ss_eqrd_actflag` varchar(5) DEFAULT NULL,
  `ss_eqrd_createdate` datetime(6) NOT NULL,
  `ss_eqrd_creator` varchar(50) DEFAULT NULL,
  `ss_eqrd_update` datetime(6) NOT NULL,
  `ss_eqrd_upuser` varchar(50) DEFAULT NULL,
  `ss_eqrd_desc` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of ss_eqrdetails
-- ----------------------------
INSERT INTO `ss_eqrdetails` VALUES ('2', 'StopBusiness', 'OBTNO', null, null, null, '2021-10-21 15:38:52.000000', null, 'N', '2021-10-21 15:35:44.000000', null, '2021-10-21 15:35:46.000000', null, null);
INSERT INTO `ss_eqrdetails` VALUES ('3', 'StopBusiness', 'DRINCRNO', null, null, null, '2021-10-21 15:38:52.000000', null, 'N', '2021-10-21 15:35:44.000000', null, '2021-10-21 15:35:46.000000', null, null);
INSERT INTO `ss_eqrdetails` VALUES ('4', 'StopBusiness', 'Charge', null, null, null, '2021-10-21 15:38:52.000000', null, 'N', '2021-10-21 15:35:44.000000', null, '2021-10-21 15:35:46.000000', null, null);
INSERT INTO `ss_eqrdetails` VALUES ('5', 'StopBusiness', 'ORDR', null, null, null, '2021-10-21 15:38:52.000000', null, 'N', '2021-10-21 15:35:44.000000', null, '2021-10-21 15:35:46.000000', null, null);
INSERT INTO `ss_eqrdetails` VALUES ('6', 'checkStopInsu', 'PatType', null, null, null, '2021-10-21 15:38:52.000000', null, 'Y', '2021-10-21 15:35:44.000000', null, '2021-10-21 15:35:46.000000', null, null);
INSERT INTO `ss_eqrdetails` VALUES ('7', 'checkStopInsu', 'INSUReadCard', null, null, null, '2021-10-21 15:38:52.000000', null, 'Y', '2021-10-21 15:35:44.000000', null, '2021-10-21 15:35:46.000000', null, null);
INSERT INTO `ss_eqrdetails` VALUES ('8', 'checkStopInsuType', '5', null, null, null, '2021-10-21 15:38:52.000000', null, 'Y', '2021-10-21 15:35:44.000000', null, '2021-10-21 15:35:46.000000', null, '城职生育不允许在自助机进行结算');
INSERT INTO `ss_eqrdetails` VALUES ('9', 'checkStopInsuType', '6', null, null, null, '2021-10-21 15:38:52.000000', null, 'Y', '2021-10-21 15:35:44.000000', null, '2021-10-21 15:35:46.000000', null, '城职工伤不允许在自助机进行结算');
INSERT INTO `ss_eqrdetails` VALUES ('10', 'checkStopInsuType', '7', null, null, null, '2021-10-21 15:38:52.000000', null, 'Y', '2021-10-21 15:35:44.000000', null, '2021-10-21 15:35:46.000000', null, '城乡生育不允许在自助机进行结算');
INSERT INTO `ss_eqrdetails` VALUES ('11', 'StopBusiness', 'Reg', null, null, null, '2021-10-21 15:38:52.000000', null, 'N', '2021-10-21 15:35:44.000000', null, '2021-10-21 15:35:46.000000', null, null);
INSERT INTO `ss_eqrdetails` VALUES ('12', 'StopBusiness', 'CANCORDR', '', '', '', '2021-10-21 15:38:52.000000', '2021-11-03 16:32:06.000000', 'N', '2021-10-21 15:35:44.000000', '', '2021-10-21 15:35:46.000000', '', '');
INSERT INTO `ss_eqrdetails` VALUES ('13', 'StopBusiness', 'QURY', '', '', '', '2021-10-21 15:38:52.000000', '2021-11-03 16:32:06.000000', 'N', '2021-10-21 15:35:44.000000', '', '2021-10-21 15:35:46.000000', '', '');
INSERT INTO `ss_eqrdetails` VALUES ('14', 'StopBusiness', 'CERTPRT', '', '', '', '2021-10-21 15:38:52.000000', '2021-11-03 16:32:06.000000', 'N', '2021-10-21 15:35:44.000000', '', '2021-10-21 15:35:46.000000', '', '');
INSERT INTO `ss_eqrdetails` VALUES ('15', 'StopBusiness', 'HLTJ', '', '', '', '2021-10-21 15:38:52.000000', '2021-11-03 16:32:06.000000', 'N', '2021-10-21 15:35:44.000000', '', '2021-10-21 15:35:46.000000', '', '');
INSERT INTO `ss_eqrdetails` VALUES ('16', 'StopBusiness', 'UnionOP', '', '', '', '2021-10-21 15:38:52.000000', '2021-11-03 16:32:06.000000', 'N', '2021-10-21 15:35:44.000000', '', '2021-10-21 15:35:46.000000', '', '');
INSERT INTO `ss_eqrdetails` VALUES ('17', 'StopBusiness', 'EIP', '', '', '', '2021-10-21 15:38:52.000000', '2021-11-03 16:32:06.000000', 'N', '2021-10-21 15:35:44.000000', '', '2021-10-21 15:35:46.000000', '', '');
INSERT INTO `ss_eqrdetails` VALUES ('18', 'StopBusiness', 'ED', '', '', '', '2021-10-21 15:38:52.000000', '2021-11-03 16:32:06.000000', 'N', '2021-10-21 15:35:44.000000', '', '2021-10-21 15:35:46.000000', '', '');
INSERT INTO `ss_eqrdetails` VALUES ('19', 'Admin', 'ZZ3', '', '', '', '2021-10-21 15:38:52.000000', '2021-11-03 16:32:06.000000', 'Y', '2021-10-21 15:35:44.000000', '', '2021-10-21 15:35:46.000000', '', '管理员机器，不受任何规则控制');
INSERT INTO `ss_eqrdetails` VALUES ('20', 'Admin', 'DH31-46', '', '', '', '2021-10-21 15:38:52.000000', '2021-11-03 16:32:06.000000', 'Y', '2021-10-21 15:35:44.000000', '', '2021-10-21 15:35:46.000000', '', '管理员机器，不受任何规则控制');
INSERT INTO `ss_eqrdetails` VALUES ('21', 'Admin', 'ZZJ31', '', '', '', '2021-10-21 15:38:52.000000', '2021-11-03 16:32:06.000000', 'Y', '2021-10-21 15:35:44.000000', '', '2021-10-21 15:35:46.000000', '', '管理员机器，不受任何规则控制');
INSERT INTO `ss_eqrdetails` VALUES ('22', 'Admin', 'ORDR', '', '', '', '2021-10-21 15:38:52.000000', '2021-11-03 16:32:06.000000', 'N', '2021-10-21 15:35:44.000000', '', '2021-10-21 15:35:46.000000', '', '管理员机器，不受任何规则控制');
