/*
Navicat MySQL Data Transfer

Source Server         : 127.0.0.1
Source Server Version : 50725
Source Host           : 10.80.6.10:8090
Source Database       : selfservice

Target Server Type    : MYSQL
Target Server Version : 50725
File Encoding         : 65001

Date: 2022-01-18 14:39:58
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for auth_group
-- ----------------------------
DROP TABLE IF EXISTS `auth_group`;
CREATE TABLE `auth_group` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(150) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for auth_group_permissions
-- ----------------------------
DROP TABLE IF EXISTS `auth_group_permissions`;
CREATE TABLE `auth_group_permissions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `group_id` int(11) NOT NULL,
  `permission_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_group_permissions_group_id_permission_id_0cd325b0_uniq` (`group_id`,`permission_id`),
  KEY `auth_group_permissio_permission_id_84c5c92e_fk_auth_perm` (`permission_id`),
  CONSTRAINT `auth_group_permissio_permission_id_84c5c92e_fk_auth_perm` FOREIGN KEY (`permission_id`) REFERENCES `auth_permission` (`id`),
  CONSTRAINT `auth_group_permissions_group_id_b120cbf9_fk_auth_group_id` FOREIGN KEY (`group_id`) REFERENCES `auth_group` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for auth_permission
-- ----------------------------
DROP TABLE IF EXISTS `auth_permission`;
CREATE TABLE `auth_permission` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `content_type_id` int(11) NOT NULL,
  `codename` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_permission_content_type_id_codename_01ab375a_uniq` (`content_type_id`,`codename`),
  CONSTRAINT `auth_permission_content_type_id_2f476e4b_fk_django_co` FOREIGN KEY (`content_type_id`) REFERENCES `django_content_type` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=129 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for auth_user
-- ----------------------------
DROP TABLE IF EXISTS `auth_user`;
CREATE TABLE `auth_user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `password` varchar(128) NOT NULL,
  `last_login` datetime(6) DEFAULT NULL,
  `is_superuser` tinyint(1) NOT NULL,
  `username` varchar(150) NOT NULL,
  `first_name` varchar(150) NOT NULL,
  `last_name` varchar(150) NOT NULL,
  `email` varchar(254) NOT NULL,
  `is_staff` tinyint(1) NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  `date_joined` datetime(6) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for auth_user_groups
-- ----------------------------
DROP TABLE IF EXISTS `auth_user_groups`;
CREATE TABLE `auth_user_groups` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `group_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_user_groups_user_id_group_id_94350c0c_uniq` (`user_id`,`group_id`),
  KEY `auth_user_groups_group_id_97559544_fk_auth_group_id` (`group_id`),
  CONSTRAINT `auth_user_groups_group_id_97559544_fk_auth_group_id` FOREIGN KEY (`group_id`) REFERENCES `auth_group` (`id`),
  CONSTRAINT `auth_user_groups_user_id_6a12ed8b_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for auth_user_user_permissions
-- ----------------------------
DROP TABLE IF EXISTS `auth_user_user_permissions`;
CREATE TABLE `auth_user_user_permissions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `permission_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_user_user_permissions_user_id_permission_id_14a6b632_uniq` (`user_id`,`permission_id`),
  KEY `auth_user_user_permi_permission_id_1fbb5f2c_fk_auth_perm` (`permission_id`),
  CONSTRAINT `auth_user_user_permi_permission_id_1fbb5f2c_fk_auth_perm` FOREIGN KEY (`permission_id`) REFERENCES `auth_permission` (`id`),
  CONSTRAINT `auth_user_user_permissions_user_id_a95ead1b_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for business_details
-- ----------------------------
DROP TABLE IF EXISTS `business_details`;
CREATE TABLE `business_details` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `fk_businessmaster_id` varchar(50) DEFAULT NULL,
  `serial_number` varchar(100) DEFAULT NULL,
  `his_serial_number` varchar(50) DEFAULT NULL,
  `modal_code` varchar(50) DEFAULT NULL,
  `model_desc` varchar(50) DEFAULT NULL,
  `intef_code` varchar(50) DEFAULT NULL,
  `intef_desc` varchar(50) DEFAULT NULL,
  `intef_input` varchar(10000) DEFAULT NULL,
  `intef_output` text,
  `business_date` datetime(6) NOT NULL,
  `business_update` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `business_details_fk_businessmaster_id_a5c99c59` (`fk_businessmaster_id`),
  KEY `business_details_his_serial_number_ca7b50ce` (`his_serial_number`),
  KEY `business_details_intef_code_fb985867` (`intef_code`),
  KEY `business_details_modal_code_d6fe725d` (`modal_code`),
  KEY `business_details_serial_number_d8b1a1aa` (`serial_number`),
  KEY `business_details_business_date_0906471a` (`business_date`)
) ENGINE=InnoDB AUTO_INCREMENT=4277386 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for business_master
-- ----------------------------
DROP TABLE IF EXISTS `business_master`;
CREATE TABLE `business_master` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `serial_number` varchar(50) DEFAULT NULL,
  `code` varchar(50) DEFAULT NULL,
  `desc` varchar(50) DEFAULT NULL,
  `business_date` datetime(6) NOT NULL,
  `terminal_info` varchar(2000) DEFAULT NULL,
  `processcode` varchar(50) DEFAULT NULL,
  `usercode` varchar(20) DEFAULT NULL,
  `business_status` varchar(10) DEFAULT NULL,
  `his_invid` varchar(50) DEFAULT NULL,
  `old_bm_id` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `business_master_code_50978879` (`code`),
  KEY `business_master_processcode_7a468e0a` (`processcode`),
  KEY `business_master_serial_number_d34b0d67` (`serial_number`),
  KEY `business_master_business_date_3a3dc0cc` (`business_date`),
  KEY `business_master_usercode_61233167` (`usercode`),
  KEY `business_master_business_status_621ff3b0` (`business_status`),
  KEY `business_master_his_invid_2e18cfd0` (`his_invid`),
  KEY `business_master_old_bm_id_9655f3b7` (`old_bm_id`)
) ENGINE=InnoDB AUTO_INCREMENT=1124447 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for data_contrast_port_inargs
-- ----------------------------
DROP TABLE IF EXISTS `data_contrast_port_inargs`;
CREATE TABLE `data_contrast_port_inargs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `parid` varchar(50) DEFAULT NULL,
  `seq` varchar(50) DEFAULT NULL,
  `argcode` varchar(50) DEFAULT NULL,
  `argname` varchar(50) DEFAULT NULL,
  `contype` varchar(50) DEFAULT NULL,
  `coninfo` varchar(100) DEFAULT NULL,
  `argtype` varchar(50) DEFAULT NULL,
  `mustl_flag` varchar(50) DEFAULT NULL,
  `max_leng` varchar(50) DEFAULT NULL,
  `subnode` varchar(50) DEFAULT NULL,
  `subname` varchar(50) DEFAULT NULL,
  `crter` varchar(50) DEFAULT NULL,
  `crte_date` date DEFAULT NULL,
  `crte_time` time(6) DEFAULT NULL,
  `updt_id` varchar(50) DEFAULT NULL,
  `updt_date` date DEFAULT NULL,
  `updt_time` time(6) DEFAULT NULL,
  `coninfodesc` varchar(50) DEFAULT NULL,
  `parnode_type` varchar(50) DEFAULT NULL,
  `codeflag` varchar(50) DEFAULT NULL,
  `defvalue` varchar(50) DEFAULT NULL,
  `coninfodemo` varchar(50) DEFAULT NULL,
  `efft_flag` varchar(50) DEFAULT NULL,
  `coninfosource` varchar(50) DEFAULT NULL,
  `diccode` varchar(50) DEFAULT NULL,
  `localparcode` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `data_contrast_port_inargs_parid_b555e319` (`parid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for data_contrast_port_list
-- ----------------------------
DROP TABLE IF EXISTS `data_contrast_port_list`;
CREATE TABLE `data_contrast_port_list` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `type` varchar(50) DEFAULT NULL,
  `hi_type` varchar(50) DEFAULT NULL,
  `infno` varchar(50) DEFAULT NULL,
  `infname` varchar(50) DEFAULT NULL,
  `contenttype` varchar(50) DEFAULT NULL,
  `signtype` varchar(50) DEFAULT NULL,
  `chkflag` varchar(50) DEFAULT NULL,
  `efftflag` varchar(3) DEFAULT NULL,
  `url` varchar(50) DEFAULT NULL,
  `node_code` varchar(50) DEFAULT NULL,
  `his_ver` varchar(50) DEFAULT NULL,
  `crter` varchar(50) DEFAULT NULL,
  `crte_date` date DEFAULT NULL,
  `crte_time` time(6) DEFAULT NULL,
  `updt_id` varchar(50) DEFAULT NULL,
  `updt_date` date DEFAULT NULL,
  `updt_time` time(6) DEFAULT NULL,
  `classname` varchar(50) DEFAULT NULL,
  `methodname` varchar(50) DEFAULT NULL,
  `outnode_code` varchar(50) DEFAULT NULL,
  `buildinput` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for data_contrast_port_node
-- ----------------------------
DROP TABLE IF EXISTS `data_contrast_port_node`;
CREATE TABLE `data_contrast_port_node` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `parid` varchar(50) DEFAULT NULL,
  `seq` varchar(50) DEFAULT NULL,
  `nodecode` varchar(50) DEFAULT NULL,
  `nodename` varchar(50) DEFAULT NULL,
  `node_type` varchar(50) DEFAULT NULL,
  `sub_flag` varchar(50) DEFAULT NULL,
  `classname` varchar(50) DEFAULT NULL,
  `methodname` varchar(50) DEFAULT NULL,
  `methodtype` varchar(50) DEFAULT NULL,
  `conflag` varchar(50) DEFAULT NULL,
  `crter` varchar(50) DEFAULT NULL,
  `crte_date` date DEFAULT NULL,
  `crte_time` time(6) DEFAULT NULL,
  `updt_id` varchar(50) DEFAULT NULL,
  `updt_date` date DEFAULT NULL,
  `updt_time` time(6) DEFAULT NULL,
  `parnode_type` varchar(50) DEFAULT NULL,
  `efft_flag` varchar(50) DEFAULT NULL,
  `multrow` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `data_contrast_port_node_parid_cc956f52` (`parid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for django_admin_log
-- ----------------------------
DROP TABLE IF EXISTS `django_admin_log`;
CREATE TABLE `django_admin_log` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `action_time` datetime(6) NOT NULL,
  `object_id` longtext,
  `object_repr` varchar(200) NOT NULL,
  `action_flag` smallint(5) unsigned NOT NULL,
  `change_message` longtext NOT NULL,
  `content_type_id` int(11) DEFAULT NULL,
  `user_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `django_admin_log_content_type_id_c4bce8eb_fk_django_co` (`content_type_id`),
  KEY `django_admin_log_user_id_c564eba6_fk_auth_user_id` (`user_id`),
  CONSTRAINT `django_admin_log_content_type_id_c4bce8eb_fk_django_co` FOREIGN KEY (`content_type_id`) REFERENCES `django_content_type` (`id`),
  CONSTRAINT `django_admin_log_user_id_c564eba6_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for django_content_type
-- ----------------------------
DROP TABLE IF EXISTS `django_content_type`;
CREATE TABLE `django_content_type` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `app_label` varchar(100) NOT NULL,
  `model` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `django_content_type_app_label_model_76bd3d3b_uniq` (`app_label`,`model`)
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for django_migrations
-- ----------------------------
DROP TABLE IF EXISTS `django_migrations`;
CREATE TABLE `django_migrations` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `app` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `applied` datetime(6) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=88 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for django_session
-- ----------------------------
DROP TABLE IF EXISTS `django_session`;
CREATE TABLE `django_session` (
  `session_key` varchar(40) NOT NULL,
  `session_data` longtext NOT NULL,
  `expire_date` datetime(6) NOT NULL,
  PRIMARY KEY (`session_key`),
  KEY `django_session_expire_date_a5c62663` (`expire_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for patinfo
-- ----------------------------
DROP TABLE IF EXISTS `patinfo`;
CREATE TABLE `patinfo` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `fk_businessmaster_id` varchar(50) DEFAULT NULL,
  `code` varchar(50) DEFAULT NULL,
  `code_val` varchar(5000) DEFAULT NULL,
  `his_master_id` varchar(50) DEFAULT NULL,
  `hi_type` varchar(20) DEFAULT NULL,
  `his_patname` varchar(20) DEFAULT NULL,
  `id_no` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `patinfo_code_138433d4` (`code`),
  KEY `patinfo_fk_businessmaster_id_405f2fe6` (`fk_businessmaster_id`),
  KEY `patinfo_his_master_id_cbb80b10` (`his_master_id`),
  KEY `patinfo_hi_type_0a37d832` (`hi_type`),
  KEY `patinfo_his_patname_0b3a1b8a` (`his_patname`),
  KEY `patinfo_id_no_51f476b8` (`id_no`)
) ENGINE=InnoDB AUTO_INCREMENT=1883920 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for recci_bank_trade
-- ----------------------------
DROP TABLE IF EXISTS `recci_bank_trade`;
CREATE TABLE `recci_bank_trade` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `bank_tr_code` varchar(20) DEFAULT NULL,
  `bank_tr_desc` varchar(20) DEFAULT NULL,
  `bank_tr_atm` varchar(20) DEFAULT NULL,
  `bank_tr_type` varchar(20) DEFAULT NULL,
  `bank_tr_no` varchar(20) DEFAULT NULL,
  `bank_tr_zzjno` varchar(20) DEFAULT NULL,
  `bank_tr_pay` varchar(20) DEFAULT NULL,
  `bank_tr_bankno` varchar(20) DEFAULT NULL,
  `bank_tr_date` datetime(6) NOT NULL,
  `bank_tr_user` varchar(10) DEFAULT NULL,
  `bank_tr_time` datetime(6) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for recci_his_trade
-- ----------------------------
DROP TABLE IF EXISTS `recci_his_trade`;
CREATE TABLE `recci_his_trade` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `his_tr_code` varchar(20) DEFAULT NULL,
  `his_tr_desc` varchar(20) DEFAULT NULL,
  `his_tr_atm` varchar(20) DEFAULT NULL,
  `his_tr_type` varchar(20) DEFAULT NULL,
  `his_tr_no` varchar(20) DEFAULT NULL,
  `his_tr_zzjno` varchar(20) DEFAULT NULL,
  `his_tr_bankno` varchar(20) DEFAULT NULL,
  `his_tr_pay` varchar(20) DEFAULT NULL,
  `his_tr_date` datetime(6) NOT NULL,
  `his_tr_time` datetime(6) NOT NULL,
  `his_tr_user` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for selfservice_log
-- ----------------------------
DROP TABLE IF EXISTS `selfservice_log`;
CREATE TABLE `selfservice_log` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `UserCode` varchar(50) DEFAULT NULL,
  `UserName` varchar(50) DEFAULT NULL,
  `IP` varchar(20) DEFAULT NULL,
  `Mac` varchar(20) DEFAULT NULL,
  `CreateDateTime` datetime(6) NOT NULL,
  `ModifyDateTime` datetime(6) NOT NULL,
  `Business` varchar(50) DEFAULT NULL,
  `Product` varchar(50) DEFAULT NULL,
  `ClientName` varchar(50) DEFAULT NULL,
  `MsgInfo` varchar(5000) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

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
-- Table structure for ss_docpicture
-- ----------------------------
DROP TABLE IF EXISTS `ss_docpicture`;
CREATE TABLE `ss_docpicture` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `ss_dcp_code` varchar(20) DEFAULT NULL,
  `ss_dcp_info` longtext,
  `ss_dcp_createdate` datetime(6) NOT NULL,
  `ss_dcp_creator` varchar(50) DEFAULT NULL,
  `ss_dcp_update` datetime(6) NOT NULL,
  `ss_dcp_upuser` varchar(50) DEFAULT NULL,
  `ss_dcp_name` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `ss_docpicture_ss_dcp_code_54a0f331` (`ss_dcp_code`),
  KEY `ss_docpicture_ss_dcp_creator_c3bdbc3c` (`ss_dcp_creator`),
  KEY `ss_docpicture_ss_dcp_name_55c148e8` (`ss_dcp_name`)
) ENGINE=InnoDB AUTO_INCREMENT=327 DEFAULT CHARSET=utf8;

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
-- Table structure for ss_eqlistd
-- ----------------------------
DROP TABLE IF EXISTS `ss_eqlistd`;
CREATE TABLE `ss_eqlistd` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `ss_eqlistd_eqcode` varchar(20) DEFAULT NULL,
  `ss_eqlistd_eqdesc` varchar(50) DEFAULT NULL,
  `ss_eqlistd_address` varchar(300) DEFAULT NULL,
  `ss_eqlistd_spec` varchar(20) DEFAULT NULL,
  `ss_eqlistd_unit` varchar(20) DEFAULT NULL,
  `ss_eqlistd_type` varchar(20) DEFAULT NULL,
  `ss_eqlistd_ip` varchar(20) DEFAULT NULL,
  `ss_eqlistd_mac` varchar(50) DEFAULT NULL,
  `ss_eqlistd_opdate` datetime(6) NOT NULL,
  `ss_eqlistd_closedate` datetime(6) NOT NULL,
  `ss_eqlistd_createdate` datetime(6) NOT NULL,
  `ss_eqlistd_creator` varchar(50) DEFAULT NULL,
  `ss_eqlistd_update` datetime(6) NOT NULL,
  `ss_eqlistd_upuser` varchar(50) DEFAULT NULL,
  `ss_eqlistd_role` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `ss_eqlistd_ss_eqlistd_eqcode_033797e1` (`ss_eqlistd_eqcode`),
  KEY `ss_eqlistd_ss_eqlistd_ip_a1f55f36` (`ss_eqlistd_ip`),
  KEY `ss_eqlistd_ss_eqlistd_role_a9342b2f` (`ss_eqlistd_role`),
  KEY `ss_eqlistd_ss_eqlistd_type_5c85235b` (`ss_eqlistd_type`)
) ENGINE=InnoDB AUTO_INCREMENT=108 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for ss_eqmfault
-- ----------------------------
DROP TABLE IF EXISTS `ss_eqmfault`;
CREATE TABLE `ss_eqmfault` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `ss_eqmf_eqcode` varchar(20) DEFAULT NULL,
  `ss_eqmf_eqdesc` varchar(50) DEFAULT NULL,
  `ss_eqmf_modcode` varchar(20) DEFAULT NULL,
  `ss_eqmf_moddesc` varchar(50) DEFAULT NULL,
  `ss_eqmf_modstatus` varchar(5) DEFAULT NULL,
  `ss_eqmf_faultcode` varchar(100) DEFAULT NULL,
  `ss_eqmf_faultdesc` varchar(500) DEFAULT NULL,
  `ss_eqmf_createdate` datetime(6) NOT NULL,
  `ss_eqmf_creator` varchar(50) DEFAULT NULL,
  `ss_eqmf_update` datetime(6) NOT NULL,
  `ss_eqmf_upuser` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1498 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for ss_eqmlist
-- ----------------------------
DROP TABLE IF EXISTS `ss_eqmlist`;
CREATE TABLE `ss_eqmlist` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `ss_eqmlist_eqcode` varchar(20) DEFAULT NULL,
  `ss_eqmlist_eqdesc` varchar(50) DEFAULT NULL,
  `ss_eqmlist_modcode` varchar(20) DEFAULT NULL,
  `ss_eqmlist_moddesc` varchar(50) DEFAULT NULL,
  `ss_eqmlist_modstatus` varchar(5) DEFAULT NULL,
  `ss_eqmlist_createdate` datetime(6) NOT NULL,
  `ss_eqmlist_creator` varchar(50) DEFAULT NULL,
  `ss_eqmlist_update` datetime(6) NOT NULL,
  `ss_eqmlist_upuser` varchar(50) DEFAULT NULL,
  `ss_eqmlist_modtype` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;

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
-- Table structure for ss_extdetails
-- ----------------------------
DROP TABLE IF EXISTS `ss_extdetails`;
CREATE TABLE `ss_extdetails` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `ss_extd_code` varchar(20) DEFAULT NULL,
  `ss_extd_amt` varchar(20) DEFAULT NULL,
  `ss_extd_type` varchar(20) DEFAULT NULL,
  `ss_extd_status` varchar(20) DEFAULT NULL,
  `ss_extd_no` varchar(50) DEFAULT NULL,
  `ss_extd_hisno` varchar(50) DEFAULT NULL,
  `ss_extd_platno` varchar(50) DEFAULT NULL,
  `ss_extd_extno` varchar(50) DEFAULT NULL,
  `ss_extd_channel` varchar(30) DEFAULT NULL,
  `ss_extd_outinfo` varchar(5000) DEFAULT NULL,
  `ss_extd_createdate` datetime(6) NOT NULL,
  `ss_extd_creator` varchar(50) DEFAULT NULL,
  `ss_extd_update` datetime(6) NOT NULL,
  `ss_extd_upuser` varchar(50) DEFAULT NULL,
  `ss_extd_id` varchar(50) DEFAULT NULL,
  `ss_extd_ininfo` varchar(5000) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `ss_extdetails_ss_extd_channel_dcb3b01a` (`ss_extd_channel`),
  KEY `ss_extdetails_ss_extd_code_1914c69a` (`ss_extd_code`),
  KEY `ss_extdetails_ss_extd_creator_b406635c` (`ss_extd_creator`),
  KEY `ss_extdetails_ss_extd_extno_64bb8e4a` (`ss_extd_extno`),
  KEY `ss_extdetails_ss_extd_hisno_4539a589` (`ss_extd_hisno`),
  KEY `ss_extdetails_ss_extd_id_1b63980e` (`ss_extd_id`),
  KEY `ss_extdetails_ss_extd_no_f2eb1c2b` (`ss_extd_no`),
  KEY `ss_extdetails_ss_extd_platno_c0f7c77c` (`ss_extd_platno`),
  KEY `ss_extdetails_ss_extd_status_d816a04c` (`ss_extd_status`),
  KEY `ss_extdetails_ss_extd_type_9fef5b23` (`ss_extd_type`),
  KEY `ss_extdetails_ss_extd_createdate_4e829caf` (`ss_extd_createdate`)
) ENGINE=InnoDB AUTO_INCREMENT=3429333 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for ss_processconfig
-- ----------------------------
DROP TABLE IF EXISTS `ss_processconfig`;
CREATE TABLE `ss_processconfig` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `ss_pc_dictype` varchar(50) DEFAULT NULL,
  `ss_pc_diccode` varchar(50) DEFAULT NULL,
  `ss_pc_dicdesc` varchar(50) DEFAULT NULL,
  `ss_pc_demo` varchar(2000) DEFAULT NULL,
  `ss_pc_createdate` datetime(6) DEFAULT NULL,
  `ss_pc_creator` varchar(50) DEFAULT NULL,
  `ss_pc_update` datetime(6) DEFAULT NULL,
  `ss_pc_upuser` varchar(10) DEFAULT NULL,
  `ss_pc_processcode` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `ss_processconfig_ss_pc_diccode_f03fab4c` (`ss_pc_diccode`),
  KEY `ss_processconfig_ss_pc_dictype_08e9d6a5` (`ss_pc_dictype`),
  KEY `ss_processconfig_ss_pc_processcode_af5637fc` (`ss_pc_processcode`)
) ENGINE=InnoDB AUTO_INCREMENT=40 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for ss_refundsingle
-- ----------------------------
DROP TABLE IF EXISTS `ss_refundsingle`;
CREATE TABLE `ss_refundsingle` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `fk_businessmaster_id` varchar(20) DEFAULT NULL,
  `ss_ref_patname` varchar(20) DEFAULT NULL,
  `ss_ref_patno` varchar(20) DEFAULT NULL,
  `ss_ref_amt` varchar(20) DEFAULT NULL,
  `ss_ref_ordamt` varchar(20) DEFAULT NULL,
  `ss_ref_platno` varchar(100) DEFAULT NULL,
  `ss_ref_input` varchar(5000) DEFAULT NULL,
  `ss_ref_output` varchar(5000) DEFAULT NULL,
  `ss_ref_createdate` datetime(6) NOT NULL,
  `ss_ref_creator` varchar(50) DEFAULT NULL,
  `ss_ref_update` datetime(6) NOT NULL,
  `ss_ref_upuser` varchar(50) DEFAULT NULL,
  `ss_ref_hisno` varchar(100) DEFAULT NULL,
  `ss_ref_status` varchar(20) DEFAULT NULL,
  `ss_ref_type` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `ss_refundsingle_fk_businessmaster_id_13e21c1b` (`fk_businessmaster_id`),
  KEY `ss_refundsingle_ss_ref_patname_5f08daed` (`ss_ref_patname`),
  KEY `ss_refundsingle_ss_ref_patno_a5737d85` (`ss_ref_patno`),
  KEY `ss_refundsingle_ss_ref_ordamt_0ba37210` (`ss_ref_ordamt`),
  KEY `ss_refundsingle_ss_ref_platno_60aec44e` (`ss_ref_platno`),
  KEY `ss_refundsingle_ss_ref_hisno_d80486a6` (`ss_ref_hisno`),
  KEY `ss_refundsingle_ss_ref_status_499bfa5e` (`ss_ref_status`),
  KEY `ss_refundsingle_ss_ref_type_753cd5ae` (`ss_ref_type`)
) ENGINE=InnoDB AUTO_INCREMENT=623 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for ss_tdpaymode
-- ----------------------------
DROP TABLE IF EXISTS `ss_tdpaymode`;
CREATE TABLE `ss_tdpaymode` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `ss_tdp_no` varchar(50) DEFAULT NULL,
  `ss_tdp_code` varchar(20) DEFAULT NULL,
  `ss_tdp_amt` varchar(20) DEFAULT NULL,
  `ss_tdp_createdate` datetime(6) NOT NULL,
  `ss_tdp_creator` varchar(50) DEFAULT NULL,
  `ss_tdp_update` datetime(6) NOT NULL,
  `ss_tdp_upuser` varchar(50) DEFAULT NULL,
  `ss_tdp_desc` varchar(20) DEFAULT NULL,
  `ss_tdp_masterid` varchar(50) DEFAULT NULL,
  `ss_tdp_extid` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `ss_tdpaymode_ss_tdp_code_b6a64e14` (`ss_tdp_code`),
  KEY `ss_tdpaymode_ss_tdp_extid_e17046e8` (`ss_tdp_extid`),
  KEY `ss_tdpaymode_ss_tdp_masterid_4fea902e` (`ss_tdp_masterid`),
  KEY `ss_tdpaymode_ss_tdp_no_13c7b32b` (`ss_tdp_no`)
) ENGINE=InnoDB AUTO_INCREMENT=1881328 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for ss_tradedetails
-- ----------------------------
DROP TABLE IF EXISTS `ss_tradedetails`;
CREATE TABLE `ss_tradedetails` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `ss_td_code` varchar(20) DEFAULT NULL,
  `ss_td_desc` varchar(20) DEFAULT NULL,
  `ss_td_amt` varchar(20) DEFAULT NULL,
  `ss_td_type` varchar(20) DEFAULT NULL,
  `ss_td_no` varchar(50) DEFAULT NULL,
  `ss_td_hisno` varchar(50) DEFAULT NULL,
  `ss_td_platno` varchar(50) DEFAULT NULL,
  `ss_td_extno` varchar(50) DEFAULT NULL,
  `ss_td_channel` varchar(50) DEFAULT NULL,
  `ss_td_createdate` datetime(6) NOT NULL,
  `ss_td_creator` varchar(50) DEFAULT NULL,
  `ss_td_update` datetime(6) NOT NULL,
  `ss_td_upuser` varchar(50) DEFAULT NULL,
  `ss_td_selfamt` varchar(20) DEFAULT NULL,
  `ss_td_pattype` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `ss_tradedetails_ss_td_channel_99fbb645` (`ss_td_channel`),
  KEY `ss_tradedetails_ss_td_code_d4a087db` (`ss_td_code`),
  KEY `ss_tradedetails_ss_td_extno_ab95ad95` (`ss_td_extno`),
  KEY `ss_tradedetails_ss_td_hisno_41e26789` (`ss_td_hisno`),
  KEY `ss_tradedetails_ss_td_no_cdf07721` (`ss_td_no`),
  KEY `ss_tradedetails_ss_td_platno_2045e8d6` (`ss_td_platno`),
  KEY `ss_tradedetails_ss_td_type_b7ed6e22` (`ss_td_type`),
  KEY `ss_tradedetails_ss_td_creator_1ac85e21` (`ss_td_creator`)
) ENGINE=InnoDB AUTO_INCREMENT=627110 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for ss_transcodeconfig
-- ----------------------------
DROP TABLE IF EXISTS `ss_transcodeconfig`;
CREATE TABLE `ss_transcodeconfig` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `ss_transcode` varchar(50) DEFAULT NULL,
  `ss_transcodename` varchar(50) DEFAULT NULL,
  `ss_ts_transcodedesc` varchar(50) DEFAULT NULL,
  `ss_ts_inputdemo` varchar(5000) DEFAULT NULL,
  `ss_ts_outputdemo` varchar(5000) DEFAULT NULL,
  `ss_ts_transcodedate` datetime(6) DEFAULT NULL,
  `ss_ts_transcodecreator` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `ss_processconfig_ss_pc_diccode_f03fab4c` (`ss_transcodename`),
  KEY `ss_processconfig_ss_pc_dictype_08e9d6a5` (`ss_transcode`)
) ENGINE=InnoDB AUTO_INCREMENT=64 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for test
-- ----------------------------
DROP TABLE IF EXISTS `test`;
CREATE TABLE `test` (
  `aaa` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
