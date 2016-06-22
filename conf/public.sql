/*
Navicat PGSQL Data Transfer

Source Server         : localhost
Source Server Version : 90408
Source Host           : localhost:5432
Source Database       : dangxi
Source Schema         : public

Target Server Type    : PGSQL
Target Server Version : 90408
File Encoding         : 65001

Date: 2016-06-22 22:52:41
*/


-- ----------------------------
-- Sequence structure for authorised_user_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."authorised_user_seq";
CREATE SEQUENCE "public"."authorised_user_seq"
 INCREMENT 1
 MINVALUE 1
 MAXVALUE 9223372036854775807
 START 298
 CACHE 1;
SELECT setval('"public"."authorised_user_seq"', 298, true);

-- ----------------------------
-- Sequence structure for info_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."info_seq";
CREATE SEQUENCE "public"."info_seq"
 INCREMENT 1
 MINVALUE 1
 MAXVALUE 9223372036854775807
 START 1
 CACHE 1;

-- ----------------------------
-- Sequence structure for info_type_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."info_type_seq";
CREATE SEQUENCE "public"."info_type_seq"
 INCREMENT 1
 MINVALUE 1
 MAXVALUE 9223372036854775807
 START 20
 CACHE 1;
SELECT setval('"public"."info_type_seq"', 20, true);

-- ----------------------------
-- Sequence structure for security_role_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."security_role_seq";
CREATE SEQUENCE "public"."security_role_seq"
 INCREMENT 1
 MINVALUE 1
 MAXVALUE 9223372036854775807
 START 127
 CACHE 1;
SELECT setval('"public"."security_role_seq"', 127, true);

-- ----------------------------
-- Sequence structure for user_permission_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."user_permission_seq";
CREATE SEQUENCE "public"."user_permission_seq"
 INCREMENT 1
 MINVALUE 1
 MAXVALUE 9223372036854775807
 START 1068
 CACHE 1;
SELECT setval('"public"."user_permission_seq"', 1068, true);

-- ----------------------------
-- Table structure for authorised_user
-- ----------------------------
DROP TABLE IF EXISTS "public"."authorised_user";
CREATE TABLE "public"."authorised_user" (
"id" int8 DEFAULT nextval('authorised_user_seq'::regclass) NOT NULL,
"authuser" varchar(255) COLLATE "default",
"password" varchar(255) COLLATE "default",
"user_name" varchar(255) COLLATE "default",
"email" varchar(255) COLLATE "default"
)
WITH (OIDS=FALSE)

;

-- ----------------------------
-- Records of authorised_user
-- ----------------------------
INSERT INTO "public"."authorised_user" VALUES ('58', 'admin', '30fdbe55c1647627f09055dcdeafe621b7d493a71bab465ff24a82c4b3823384be196e9a5f3bf82f', 'admin', '');
INSERT INTO "public"."authorised_user" VALUES ('72', 'test', '985c07fc3578d2149316895b4b9bda5199b74c08764f1e0c26a452f7105907122ea9182c05487081', 'test阿斯打算的', '');
INSERT INTO "public"."authorised_user" VALUES ('279', '阿斯顿个', '7bc340123d3dc64cd44112d8cc5eabfaf31839b3174b85d88ff0b34292b6866e28c4691dbc897b4d', '阿斯顿方', '');

-- ----------------------------
-- Table structure for authorised_user_security_role
-- ----------------------------
DROP TABLE IF EXISTS "public"."authorised_user_security_role";
CREATE TABLE "public"."authorised_user_security_role" (
"authorised_user_id" int8 NOT NULL,
"security_role_id" int8 NOT NULL
)
WITH (OIDS=FALSE)

;

-- ----------------------------
-- Records of authorised_user_security_role
-- ----------------------------
INSERT INTO "public"."authorised_user_security_role" VALUES ('58', '21');
INSERT INTO "public"."authorised_user_security_role" VALUES ('72', '26');
INSERT INTO "public"."authorised_user_security_role" VALUES ('279', '26');

-- ----------------------------
-- Table structure for info
-- ----------------------------
DROP TABLE IF EXISTS "public"."info";
CREATE TABLE "public"."info" (
"id" int8 NOT NULL,
"title" varchar(255) COLLATE "default",
"remark" varchar(255) COLLATE "default",
"info_type_id" int8,
"content" text COLLATE "default",
"user_id" int8,
"create_time" timestamp(6),
"last_update_time" timestamp(6)
)
WITH (OIDS=FALSE)

;

-- ----------------------------
-- Records of info
-- ----------------------------

-- ----------------------------
-- Table structure for info_type
-- ----------------------------
DROP TABLE IF EXISTS "public"."info_type";
CREATE TABLE "public"."info_type" (
"id" int8 NOT NULL,
"name" varchar(255) COLLATE "default"
)
WITH (OIDS=FALSE)

;

-- ----------------------------
-- Records of info_type
-- ----------------------------
INSERT INTO "public"."info_type" VALUES ('2', '活动风采');

-- ----------------------------
-- Table structure for security_role
-- ----------------------------
DROP TABLE IF EXISTS "public"."security_role";
CREATE TABLE "public"."security_role" (
"id" int8 DEFAULT nextval('security_role_seq'::regclass) NOT NULL,
"checked" int4 DEFAULT 0,
"sort" int4 DEFAULT 0,
"name" varchar(255) COLLATE "default",
"root_orinner" int4 DEFAULT 0,
"isadmin" int4 DEFAULT 0
)
WITH (OIDS=FALSE)

;

-- ----------------------------
-- Records of security_role
-- ----------------------------
INSERT INTO "public"."security_role" VALUES ('21', '1', '0', '系统管理', '0', '1');
INSERT INTO "public"."security_role" VALUES ('26', '1', '6', '测试员', '1', '0');
INSERT INTO "public"."security_role" VALUES ('27', '1', '5', '管理员', '0', '0');

-- ----------------------------
-- Table structure for security_role_user_permission
-- ----------------------------
DROP TABLE IF EXISTS "public"."security_role_user_permission";
CREATE TABLE "public"."security_role_user_permission" (
"security_role_id" int8 NOT NULL,
"user_permission_id" int8 NOT NULL
)
WITH (OIDS=FALSE)

;

-- ----------------------------
-- Records of security_role_user_permission
-- ----------------------------
INSERT INTO "public"."security_role_user_permission" VALUES ('27', '70');
INSERT INTO "public"."security_role_user_permission" VALUES ('27', '1029');

-- ----------------------------
-- Table structure for user_permission
-- ----------------------------
DROP TABLE IF EXISTS "public"."user_permission";
CREATE TABLE "public"."user_permission" (
"id" int8 DEFAULT nextval('user_permission_seq'::regclass) NOT NULL,
"pid_id" int8,
"checked" int4 DEFAULT 0,
"sort" int4 DEFAULT 0,
"icon_class" varchar(255) COLLATE "default",
"name" varchar(255) COLLATE "default",
"value" varchar(255) COLLATE "default",
"ismenu" int4 DEFAULT 0
)
WITH (OIDS=FALSE)

;

-- ----------------------------
-- Records of user_permission
-- ----------------------------
INSERT INTO "public"."user_permission" VALUES ('70', null, '1', '0', 'icon-user', '用户管理', 'authorisedUser_html', '1');
INSERT INTO "public"."user_permission" VALUES ('111', '131', '0', '3', 'icon-hand-right', '菜单权限', 'userPermission_html', '1');
INSERT INTO "public"."user_permission" VALUES ('131', null, '0', '2', 'icon-desktop', '系统设置', '', '1');
INSERT INTO "public"."user_permission" VALUES ('1029', null, '1', '1', 'icon-hand-right', '角色管理', 'securityRole_html', '1');
INSERT INTO "public"."user_permission" VALUES ('1049', '131', '0', '4', 'icon-hand-right', '信息类型', 'infoType_html', '1');

-- ----------------------------
-- Alter Sequences Owned By 
-- ----------------------------
ALTER SEQUENCE "public"."authorised_user_seq" OWNED BY "authorised_user"."id";

-- ----------------------------
-- Primary Key structure for table authorised_user
-- ----------------------------
ALTER TABLE "public"."authorised_user" ADD PRIMARY KEY ("id");

-- ----------------------------
-- Primary Key structure for table authorised_user_security_role
-- ----------------------------
ALTER TABLE "public"."authorised_user_security_role" ADD PRIMARY KEY ("authorised_user_id", "security_role_id");

-- ----------------------------
-- Indexes structure for table info
-- ----------------------------
CREATE INDEX "ix_info_infotype_1" ON "public"."info" USING btree ("info_type_id");
CREATE INDEX "ix_info_user_2" ON "public"."info" USING btree ("user_id");

-- ----------------------------
-- Primary Key structure for table info
-- ----------------------------
ALTER TABLE "public"."info" ADD PRIMARY KEY ("id");

-- ----------------------------
-- Primary Key structure for table info_type
-- ----------------------------
ALTER TABLE "public"."info_type" ADD PRIMARY KEY ("id");

-- ----------------------------
-- Primary Key structure for table security_role
-- ----------------------------
ALTER TABLE "public"."security_role" ADD PRIMARY KEY ("id");

-- ----------------------------
-- Primary Key structure for table security_role_user_permission
-- ----------------------------
ALTER TABLE "public"."security_role_user_permission" ADD PRIMARY KEY ("security_role_id", "user_permission_id");

-- ----------------------------
-- Indexes structure for table user_permission
-- ----------------------------
CREATE INDEX "ix_user_permission_pid_17" ON "public"."user_permission" USING btree ("pid_id");

-- ----------------------------
-- Primary Key structure for table user_permission
-- ----------------------------
ALTER TABLE "public"."user_permission" ADD PRIMARY KEY ("id");

-- ----------------------------
-- Foreign Key structure for table "public"."authorised_user_security_role"
-- ----------------------------
ALTER TABLE "public"."authorised_user_security_role" ADD FOREIGN KEY ("authorised_user_id") REFERENCES "public"."authorised_user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE "public"."authorised_user_security_role" ADD FOREIGN KEY ("security_role_id") REFERENCES "public"."security_role" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- ----------------------------
-- Foreign Key structure for table "public"."info"
-- ----------------------------
ALTER TABLE "public"."info" ADD FOREIGN KEY ("user_id") REFERENCES "public"."authorised_user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE "public"."info" ADD FOREIGN KEY ("info_type_id") REFERENCES "public"."info_type" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- ----------------------------
-- Foreign Key structure for table "public"."security_role_user_permission"
-- ----------------------------
ALTER TABLE "public"."security_role_user_permission" ADD FOREIGN KEY ("user_permission_id") REFERENCES "public"."user_permission" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE "public"."security_role_user_permission" ADD FOREIGN KEY ("security_role_id") REFERENCES "public"."security_role" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
