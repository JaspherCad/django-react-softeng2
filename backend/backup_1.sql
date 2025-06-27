-- MySQL dump 10.13  Distrib 8.0.35, for Win64 (x86_64)
--
-- Host: localhost    Database: hospital_db
-- ------------------------------------------------------
-- Server version	8.0.35

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `api_bed`
--

DROP TABLE IF EXISTS `api_bed`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `api_bed` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `number` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_occupied` tinyint(1) NOT NULL,
  `room_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `number` (`number`),
  KEY `api_bed_room_id_60602bf3_fk_api_room_id` (`room_id`),
  CONSTRAINT `api_bed_room_id_60602bf3_fk_api_room_id` FOREIGN KEY (`room_id`) REFERENCES `api_room` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `api_bed`
--

LOCK TABLES `api_bed` WRITE;
/*!40000 ALTER TABLE `api_bed` DISABLE KEYS */;
/*!40000 ALTER TABLE `api_bed` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `api_bedassignment`
--

DROP TABLE IF EXISTS `api_bedassignment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `api_bedassignment` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `start_time` datetime(6) NOT NULL,
  `end_time` datetime(6) DEFAULT NULL,
  `last_billed_time` datetime(6) DEFAULT NULL,
  `total_hours` int unsigned NOT NULL,
  `assigned_by_id` bigint DEFAULT NULL,
  `bed_id` bigint NOT NULL,
  `billing_id` bigint DEFAULT NULL,
  `patient_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `api_bedassignment_billing_id_de6783e6_fk_api_billing_id` (`billing_id`),
  KEY `api_bedassignment_patient_id_6473a769_fk_api_patient_id` (`patient_id`),
  KEY `api_bedassignment_assigned_by_id_f3159492_fk_api_user_id` (`assigned_by_id`),
  KEY `api_bedassignment_bed_id_0f122349_fk_api_bed_id` (`bed_id`),
  CONSTRAINT `api_bedassignment_assigned_by_id_f3159492_fk_api_user_id` FOREIGN KEY (`assigned_by_id`) REFERENCES `api_user` (`id`),
  CONSTRAINT `api_bedassignment_bed_id_0f122349_fk_api_bed_id` FOREIGN KEY (`bed_id`) REFERENCES `api_bed` (`id`),
  CONSTRAINT `api_bedassignment_billing_id_de6783e6_fk_api_billing_id` FOREIGN KEY (`billing_id`) REFERENCES `api_billing` (`id`),
  CONSTRAINT `api_bedassignment_patient_id_6473a769_fk_api_patient_id` FOREIGN KEY (`patient_id`) REFERENCES `api_patient` (`id`),
  CONSTRAINT `api_bedassignment_chk_1` CHECK ((`total_hours` >= 0))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `api_bedassignment`
--

LOCK TABLES `api_bedassignment` WRITE;
/*!40000 ALTER TABLE `api_bedassignment` DISABLE KEYS */;
/*!40000 ALTER TABLE `api_bedassignment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `api_billing`
--

DROP TABLE IF EXISTS `api_billing`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `api_billing` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `code` varchar(8) COLLATE utf8mb4_unicode_ci NOT NULL,
  `date_created` datetime(6) NOT NULL,
  `status` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `total_due` decimal(10,2) NOT NULL,
  `created_by_id` bigint DEFAULT NULL,
  `patient_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`),
  KEY `api_billing_patient_id_a7d84402_fk_api_patient_id` (`patient_id`),
  KEY `api_billing_created_by_id_9f5a7bd0_fk_api_user_id` (`created_by_id`),
  CONSTRAINT `api_billing_created_by_id_9f5a7bd0_fk_api_user_id` FOREIGN KEY (`created_by_id`) REFERENCES `api_user` (`id`),
  CONSTRAINT `api_billing_patient_id_a7d84402_fk_api_patient_id` FOREIGN KEY (`patient_id`) REFERENCES `api_patient` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `api_billing`
--

LOCK TABLES `api_billing` WRITE;
/*!40000 ALTER TABLE `api_billing` DISABLE KEYS */;
/*!40000 ALTER TABLE `api_billing` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `api_billing_operator`
--

DROP TABLE IF EXISTS `api_billing_operator`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `api_billing_operator` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `billing_id` bigint NOT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `api_billing_operator_billing_id_user_id_ef23e407_uniq` (`billing_id`,`user_id`),
  KEY `api_billing_operator_user_id_fd32ba2c_fk_api_user_id` (`user_id`),
  CONSTRAINT `api_billing_operator_billing_id_8bd8f773_fk_api_billing_id` FOREIGN KEY (`billing_id`) REFERENCES `api_billing` (`id`),
  CONSTRAINT `api_billing_operator_user_id_fd32ba2c_fk_api_user_id` FOREIGN KEY (`user_id`) REFERENCES `api_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `api_billing_operator`
--

LOCK TABLES `api_billing_operator` WRITE;
/*!40000 ALTER TABLE `api_billing_operator` DISABLE KEYS */;
/*!40000 ALTER TABLE `api_billing_operator` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `api_billingitem`
--

DROP TABLE IF EXISTS `api_billingitem`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `api_billingitem` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `quantity` int unsigned NOT NULL,
  `subtotal` decimal(10,2) NOT NULL,
  `bed_assignment_id` bigint DEFAULT NULL,
  `billing_id` bigint NOT NULL,
  `service_availed_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `api_billingitem_bed_assignment_id_9f6ef93a_fk_api_bedas` (`bed_assignment_id`),
  KEY `api_billingitem_billing_id_9fb409fb_fk_api_billing_id` (`billing_id`),
  KEY `api_billingitem_service_availed_id_e0c7722a_fk_api_patie` (`service_availed_id`),
  CONSTRAINT `api_billingitem_bed_assignment_id_9f6ef93a_fk_api_bedas` FOREIGN KEY (`bed_assignment_id`) REFERENCES `api_bedassignment` (`id`),
  CONSTRAINT `api_billingitem_billing_id_9fb409fb_fk_api_billing_id` FOREIGN KEY (`billing_id`) REFERENCES `api_billing` (`id`),
  CONSTRAINT `api_billingitem_service_availed_id_e0c7722a_fk_api_patie` FOREIGN KEY (`service_availed_id`) REFERENCES `api_patientservice` (`id`),
  CONSTRAINT `api_billingitem_chk_1` CHECK ((`quantity` >= 0))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `api_billingitem`
--

LOCK TABLES `api_billingitem` WRITE;
/*!40000 ALTER TABLE `api_billingitem` DISABLE KEYS */;
/*!40000 ALTER TABLE `api_billingitem` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `api_billingoperatorlog`
--

DROP TABLE IF EXISTS `api_billingoperatorlog`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `api_billingoperatorlog` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `timestamp` datetime(6) NOT NULL,
  `action` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `billing_id` bigint NOT NULL,
  `user_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `api_billingoperatorlog_billing_id_e3514d9f_fk_api_billing_id` (`billing_id`),
  KEY `api_billingoperatorlog_user_id_c9991532_fk_api_user_id` (`user_id`),
  CONSTRAINT `api_billingoperatorlog_billing_id_e3514d9f_fk_api_billing_id` FOREIGN KEY (`billing_id`) REFERENCES `api_billing` (`id`),
  CONSTRAINT `api_billingoperatorlog_user_id_c9991532_fk_api_user_id` FOREIGN KEY (`user_id`) REFERENCES `api_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `api_billingoperatorlog`
--

LOCK TABLES `api_billingoperatorlog` WRITE;
/*!40000 ALTER TABLE `api_billingoperatorlog` DISABLE KEYS */;
/*!40000 ALTER TABLE `api_billingoperatorlog` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `api_clinicalnote`
--

DROP TABLE IF EXISTS `api_clinicalnote`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `api_clinicalnote` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `note_type` varchar(120) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `note_date` datetime(6) DEFAULT NULL,
  `focus_problem` longtext COLLATE utf8mb4_unicode_ci,
  `progress_notes` longtext COLLATE utf8mb4_unicode_ci,
  `orders` longtext COLLATE utf8mb4_unicode_ci,
  `content` longtext COLLATE utf8mb4_unicode_ci,
  `case_number_patient` longtext COLLATE utf8mb4_unicode_ci,
  `medication` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `dose_frequency` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `author_id` bigint DEFAULT NULL,
  `patient_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `api_clinicalnote_author_id_a0be26c4_fk_api_user_id` (`author_id`),
  KEY `api_clinicalnote_patient_id_6c9209af_fk_api_patient_id` (`patient_id`),
  CONSTRAINT `api_clinicalnote_author_id_a0be26c4_fk_api_user_id` FOREIGN KEY (`author_id`) REFERENCES `api_user` (`id`),
  CONSTRAINT `api_clinicalnote_patient_id_6c9209af_fk_api_patient_id` FOREIGN KEY (`patient_id`) REFERENCES `api_patient` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `api_clinicalnote`
--

LOCK TABLES `api_clinicalnote` WRITE;
/*!40000 ALTER TABLE `api_clinicalnote` DISABLE KEYS */;
INSERT INTO `api_clinicalnote` VALUES (1,'Doctor','2025-06-27 05:52:00.000000','','Marunong na maglakad sa tubig','Sit','','SD392FAA3','','','2025-06-27 05:52:47.000826','2025-06-27 05:52:47.000826',1,1),(2,'Nurse','2025-06-27 05:52:00.000000','Corruption','Data: Science\nAction: Tulfo\nResponse: Yes','','','SD392FAA3','','','2025-06-27 05:53:25.667605','2025-06-27 05:53:25.667605',1,1),(3,'Medication','2025-06-27 05:53:00.000000','','','','','SD392FAA3','Skyflakes','','2025-06-27 05:53:46.542032','2025-06-27 05:53:46.542032',1,1),(4,'Medication','2025-06-27 05:53:00.000000','','','','','SD392FAA3','','','2025-06-27 05:54:46.800281','2025-06-27 05:54:46.800281',1,1);
/*!40000 ALTER TABLE `api_clinicalnote` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `api_historicalpatient`
--

DROP TABLE IF EXISTS `api_historicalpatient`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `api_historicalpatient` (
  `id` bigint NOT NULL,
  `ward_service` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bed_number` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `has_philhealth` tinyint(1) NOT NULL,
  `case_number` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `hospital_case_number` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `has_hmo` tinyint(1) NOT NULL,
  `hmo` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `code` varchar(5) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type_of_admission` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `admission_date` datetime(6) DEFAULT NULL,
  `current_condition` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `date_of_birth` date DEFAULT NULL,
  `birth_place` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `gender` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `age` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `occupation` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `civil_status` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `nationality` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `religion` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `visit_type` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `consultation_datetime` datetime(6) DEFAULT NULL,
  `referred_by` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `next_consultation_date` datetime(6) DEFAULT NULL,
  `discharge_date` datetime(6) DEFAULT NULL,
  `total_days` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `principal_diagnosis` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `other_diagnosis` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `principal_operation` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `other_operation` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone` varchar(15) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `emergency_contact_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `emergency_contact_phone` varchar(15) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_active` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `entry_date` datetime(6) NOT NULL,
  `height` decimal(5,2) DEFAULT NULL,
  `weight` decimal(5,2) DEFAULT NULL,
  `blood_pressure` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `pulse_rate` decimal(5,2) DEFAULT NULL,
  `respiratory_rate` decimal(5,2) DEFAULT NULL,
  `temperature` decimal(5,2) DEFAULT NULL,
  `physical_examination` longtext COLLATE utf8mb4_unicode_ci,
  `main_complaint` longtext COLLATE utf8mb4_unicode_ci,
  `present_illness` longtext COLLATE utf8mb4_unicode_ci,
  `clinical_findings` longtext COLLATE utf8mb4_unicode_ci,
  `icd_code` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `diagnosis` longtext COLLATE utf8mb4_unicode_ci,
  `treatment` longtext COLLATE utf8mb4_unicode_ci,
  `disposition` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `result` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `membership` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `father_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `father_address` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `father_contact` varchar(15) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `mother_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `mother_address` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `mother_contact` varchar(15) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `spouse_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `spouse_address` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `spouse_contact` varchar(15) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `history_id` int NOT NULL AUTO_INCREMENT,
  `history_date` datetime(6) NOT NULL,
  `history_change_reason` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `history_type` varchar(1) COLLATE utf8mb4_unicode_ci NOT NULL,
  `attending_physician_id` bigint DEFAULT NULL,
  `history_user_id` bigint DEFAULT NULL,
  `archived` tinyint(1) NOT NULL,
  PRIMARY KEY (`history_id`),
  KEY `api_historicalpatient_history_user_id_aa8d524a_fk_api_user_id` (`history_user_id`),
  KEY `api_historicalpatient_id_beba82e9` (`id`),
  KEY `api_historicalpatient_case_number_80453bae` (`case_number`),
  KEY `api_historicalpatient_code_9022f6a4` (`code`),
  KEY `api_historicalpatient_attending_physician_id_bea45980` (`attending_physician_id`),
  CONSTRAINT `api_historicalpatient_history_user_id_aa8d524a_fk_api_user_id` FOREIGN KEY (`history_user_id`) REFERENCES `api_user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `api_historicalpatient`
--

LOCK TABLES `api_historicalpatient` WRITE;
/*!40000 ALTER TABLE `api_historicalpatient` DISABLE KEYS */;
INSERT INTO `api_historicalpatient` VALUES (1,'','',0,'SD392FAA3','92572',0,'sdfdsf','ZXF5X','Clarence Cortina','Admitted','','2025-06-27 05:50:00.000000','Not specified','2000-02-08','Sa bahay','Male','25','123 Sample Street, Antipolo City','Student','Single','Indian','N/A','New',NULL,'',NULL,NULL,'','','','','','09123456789','','','Active','2025-06-27 05:51:05.015254',NULL,NULL,'',NULL,NULL,NULL,'','','','','','','','','','','Dad','123 Sample Street, Antipolo City','09123456789','Mom','123 Sample Street, Antipolo City','09123456789','','','',1,'2025-06-27 05:51:05.018035',NULL,'+',NULL,1,0),(1,'','',0,'SD392FAA3','92572',0,'sdfdsf','ZXF5X','Clarence Cortina','Admitted','','2025-06-27 05:50:00.000000','Not specified','2000-02-08','Sa bahay','Male','25','123 Sample Street, Antipolo City','Student','Single','Indian','N/A','New',NULL,'',NULL,NULL,'','','','','','09123456789','','','Active','2025-06-27 05:51:05.015254',NULL,NULL,'',NULL,NULL,NULL,'','','','','','','','','','','Dad','123 Sample Street, Antipolo City','09123456789','Mom','123 Sample Street, Antipolo City','09123456789','','','',2,'2025-06-27 05:55:23.240391',NULL,'~',NULL,1,1),(1,'','',0,'SD392FAA3','92572',0,'sdfdsf','ZXF5X','Clarence Cortina','Admitted','','2025-06-27 05:50:00.000000','Not specified','2000-02-08','Sa bahay','Male','25','123 Sample Street, Antipolo City','Student','Single','Indian','N/A','New',NULL,'',NULL,NULL,'','','','','','09123456789','','','Active','2025-06-27 05:51:05.015254',NULL,NULL,'',NULL,NULL,NULL,'','','','','','','','','','','Dad','123 Sample Street, Antipolo City','09123456789','Mom','123 Sample Street, Antipolo City','09123456789','','','',3,'2025-06-27 05:55:27.345965',NULL,'~',NULL,1,0),(2,'','',0,'DLKLS054','safwerw234',0,'None','S7DTN','Lance Gonzales','Outpatient','',NULL,'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.','2003-04-12','','Male','22','435 Somewhere Street, Valenzuela City','Student','Single','Filipino','Catholic','New','2025-06-27 06:00:00.000000','N/A','2025-06-27 10:00:00.000000',NULL,'','','','','','0999111444','','','Active','2025-06-27 06:02:59.217500',170.00,50.00,'119/76 mmHg',80.00,17.00,33.00,'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.','Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.','Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.','','','','Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.','','','','','','','','','','','','',4,'2025-06-27 06:02:59.221927',NULL,'+',1,1,0),(3,'','',0,'RTY04332','EFD4004',0,'None','DRWCR','Jaspher','Outpatient','',NULL,'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.','2020-02-28','','Male','5','999 Bahay Street, Quezon City','Student','Single','Filipino','N/A','New','2025-06-27 06:06:00.000000','N/A',NULL,NULL,'','','','','','09987654321','','','Active','2025-06-27 06:06:42.795878',170.00,50.00,'119/76 mmHg',80.00,17.00,33.00,'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.','Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.','Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.','','','','Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.','','','','','','','','','','','','',5,'2025-06-27 06:06:42.809654',NULL,'+',NULL,1,0),(1,'','',0,'SD392FAA3','92572',0,'sdfdsf','ZXF5X','Clarence Cortina','Admitted','','2025-06-27 05:50:00.000000','Not specified','2000-02-08','Sa bahay','Male','25','123 Sample Street, Antipolo City','Student','Single','Indian','N/A','New',NULL,'',NULL,NULL,'','','','','','09123456789','','','Active','2025-06-27 05:51:05.015254',NULL,NULL,'',NULL,NULL,NULL,'','','','','','','','','','','Dad','123 Sample Street, Antipolo City','09123456789','Mom','123 Sample Street, Antipolo City','09123456789','','','',6,'2025-06-27 06:08:16.058797',NULL,'~',NULL,1,0),(1,'','',0,'SD392FAA3','92572',0,'sdfdsf','ZXF5X','Clarence Cortina','Admitted','','2025-06-27 05:50:00.000000','Not specified','2000-02-08','Sa bahay','Male','25','123 Sample Street, Antipolo City','Student','Single','Indian','N/A','New',NULL,'',NULL,NULL,'','','','','','09123456789','','','Active','2025-06-27 05:51:05.015254',NULL,NULL,'',NULL,NULL,NULL,'','','','','','','','','','','Dad','123 Sample Street, Antipolo City','09123456789','Mom','123 Sample Street, Antipolo City','09123456789','','','',7,'2025-06-27 06:08:16.058797',NULL,'~',NULL,1,0);
/*!40000 ALTER TABLE `api_historicalpatient` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `api_laboratoryresult`
--

DROP TABLE IF EXISTS `api_laboratoryresult`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `api_laboratoryresult` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `test_type` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `result_summary` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `date_performed` datetime(6) NOT NULL,
  `code` varchar(8) COLLATE utf8mb4_unicode_ci NOT NULL,
  `patient_id` bigint NOT NULL,
  `performed_by_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`),
  KEY `api_laboratoryresult_patient_id_7764d4cd_fk_api_patient_id` (`patient_id`),
  KEY `api_laboratoryresult_performed_by_id_1057d388_fk_api_user_id` (`performed_by_id`),
  CONSTRAINT `api_laboratoryresult_patient_id_7764d4cd_fk_api_patient_id` FOREIGN KEY (`patient_id`) REFERENCES `api_patient` (`id`),
  CONSTRAINT `api_laboratoryresult_performed_by_id_1057d388_fk_api_user_id` FOREIGN KEY (`performed_by_id`) REFERENCES `api_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `api_laboratoryresult`
--

LOCK TABLES `api_laboratoryresult` WRITE;
/*!40000 ALTER TABLE `api_laboratoryresult` DISABLE KEYS */;
/*!40000 ALTER TABLE `api_laboratoryresult` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `api_labresultfile`
--

DROP TABLE IF EXISTS `api_labresultfile`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `api_labresultfile` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `file` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `uploaded_at` datetime(6) NOT NULL,
  `result_id` bigint NOT NULL,
  `uploaded_by_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `api_labresultfile_result_id_427f1dd2_fk_api_laboratoryresult_id` (`result_id`),
  KEY `api_labresultfile_uploaded_by_id_c0e85787_fk_api_user_id` (`uploaded_by_id`),
  CONSTRAINT `api_labresultfile_result_id_427f1dd2_fk_api_laboratoryresult_id` FOREIGN KEY (`result_id`) REFERENCES `api_laboratoryresult` (`id`),
  CONSTRAINT `api_labresultfile_uploaded_by_id_c0e85787_fk_api_user_id` FOREIGN KEY (`uploaded_by_id`) REFERENCES `api_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `api_labresultfile`
--

LOCK TABLES `api_labresultfile` WRITE;
/*!40000 ALTER TABLE `api_labresultfile` DISABLE KEYS */;
/*!40000 ALTER TABLE `api_labresultfile` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `api_labresultfilegroup`
--

DROP TABLE IF EXISTS `api_labresultfilegroup`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `api_labresultfilegroup` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `description` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `uploaded_at` datetime(6) NOT NULL,
  `result_id` bigint NOT NULL,
  `uploaded_by_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `api_labresultfilegro_result_id_4a1eaeda_fk_api_labor` (`result_id`),
  KEY `api_labresultfilegroup_uploaded_by_id_b255f626_fk_api_user_id` (`uploaded_by_id`),
  CONSTRAINT `api_labresultfilegro_result_id_4a1eaeda_fk_api_labor` FOREIGN KEY (`result_id`) REFERENCES `api_laboratoryresult` (`id`),
  CONSTRAINT `api_labresultfilegroup_uploaded_by_id_b255f626_fk_api_user_id` FOREIGN KEY (`uploaded_by_id`) REFERENCES `api_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `api_labresultfilegroup`
--

LOCK TABLES `api_labresultfilegroup` WRITE;
/*!40000 ALTER TABLE `api_labresultfilegroup` DISABLE KEYS */;
/*!40000 ALTER TABLE `api_labresultfilegroup` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `api_labresultfileingroup`
--

DROP TABLE IF EXISTS `api_labresultfileingroup`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `api_labresultfileingroup` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `file` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `group_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `api_labresultfileing_group_id_c03b4f31_fk_api_labre` (`group_id`),
  CONSTRAINT `api_labresultfileing_group_id_c03b4f31_fk_api_labre` FOREIGN KEY (`group_id`) REFERENCES `api_labresultfilegroup` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `api_labresultfileingroup`
--

LOCK TABLES `api_labresultfileingroup` WRITE;
/*!40000 ALTER TABLE `api_labresultfileingroup` DISABLE KEYS */;
/*!40000 ALTER TABLE `api_labresultfileingroup` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `api_medicalhistory`
--

DROP TABLE IF EXISTS `api_medicalhistory`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `api_medicalhistory` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `patient_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `api_medicalhistory_patient_id_2160595a_fk_api_patient_id` (`patient_id`),
  CONSTRAINT `api_medicalhistory_patient_id_2160595a_fk_api_patient_id` FOREIGN KEY (`patient_id`) REFERENCES `api_patient` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `api_medicalhistory`
--

LOCK TABLES `api_medicalhistory` WRITE;
/*!40000 ALTER TABLE `api_medicalhistory` DISABLE KEYS */;
/*!40000 ALTER TABLE `api_medicalhistory` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `api_patient`
--

DROP TABLE IF EXISTS `api_patient`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `api_patient` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `ward_service` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bed_number` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `has_philhealth` tinyint(1) NOT NULL,
  `case_number` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `hospital_case_number` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `has_hmo` tinyint(1) NOT NULL,
  `hmo` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `code` varchar(5) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type_of_admission` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `admission_date` datetime(6) DEFAULT NULL,
  `current_condition` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `date_of_birth` date DEFAULT NULL,
  `birth_place` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `gender` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `age` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `occupation` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `civil_status` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `nationality` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `religion` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `visit_type` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `consultation_datetime` datetime(6) DEFAULT NULL,
  `referred_by` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `next_consultation_date` datetime(6) DEFAULT NULL,
  `discharge_date` datetime(6) DEFAULT NULL,
  `total_days` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `principal_diagnosis` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `other_diagnosis` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `principal_operation` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `other_operation` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone` varchar(15) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `emergency_contact_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `emergency_contact_phone` varchar(15) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_active` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `entry_date` datetime(6) NOT NULL,
  `height` decimal(5,2) DEFAULT NULL,
  `weight` decimal(5,2) DEFAULT NULL,
  `blood_pressure` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `pulse_rate` decimal(5,2) DEFAULT NULL,
  `respiratory_rate` decimal(5,2) DEFAULT NULL,
  `temperature` decimal(5,2) DEFAULT NULL,
  `physical_examination` longtext COLLATE utf8mb4_unicode_ci,
  `main_complaint` longtext COLLATE utf8mb4_unicode_ci,
  `present_illness` longtext COLLATE utf8mb4_unicode_ci,
  `clinical_findings` longtext COLLATE utf8mb4_unicode_ci,
  `icd_code` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `diagnosis` longtext COLLATE utf8mb4_unicode_ci,
  `treatment` longtext COLLATE utf8mb4_unicode_ci,
  `disposition` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `result` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `membership` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `father_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `father_address` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `father_contact` varchar(15) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `mother_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `mother_address` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `mother_contact` varchar(15) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `spouse_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `spouse_address` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `spouse_contact` varchar(15) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `attending_physician_id` bigint DEFAULT NULL,
  `archived` tinyint(1) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`),
  UNIQUE KEY `case_number` (`case_number`),
  KEY `api_patient_attending_physician_id_dfdc037c_fk_api_user_id` (`attending_physician_id`),
  CONSTRAINT `api_patient_attending_physician_id_dfdc037c_fk_api_user_id` FOREIGN KEY (`attending_physician_id`) REFERENCES `api_user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `api_patient`
--

LOCK TABLES `api_patient` WRITE;
/*!40000 ALTER TABLE `api_patient` DISABLE KEYS */;
INSERT INTO `api_patient` VALUES (1,'','',0,'SD392FAA3','92572',0,'sdfdsf','ZXF5X','Clarence Cortina','Admitted','','2025-06-27 05:50:00.000000','Not specified','2000-02-08','Sa bahay','Male','25','123 Sample Street, Antipolo City','Student','Single','Indian','N/A','New',NULL,'',NULL,NULL,'','','','','','09123456789','','','Active','2025-06-27 05:51:05.015254',NULL,NULL,'',NULL,NULL,NULL,'','','','','','','','','','','Dad','123 Sample Street, Antipolo City','09123456789','Mom','123 Sample Street, Antipolo City','09123456789','','','',NULL,0),(2,'','',0,'DLKLS054','safwerw234',0,'None','S7DTN','Lance Gonzales','Outpatient','',NULL,'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.','2003-04-12','','Male','22','435 Somewhere Street, Valenzuela City','Student','Single','Filipino','Catholic','New','2025-06-27 06:00:00.000000','N/A','2025-06-27 10:00:00.000000',NULL,'','','','','','0999111444','','','Active','2025-06-27 06:02:59.217500',170.00,50.00,'119/76 mmHg',80.00,17.00,33.00,'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.','Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.','Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.','','','','Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.','','','','','','','','','','','','',1,0),(3,'','',0,'RTY04332','EFD4004',0,'None','DRWCR','Jaspher','Outpatient','',NULL,'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.','2020-02-28','','Male','5','999 Bahay Street, Quezon City','Student','Single','Filipino','N/A','New','2025-06-27 06:06:00.000000','N/A',NULL,NULL,'','','','','','09987654321','','','Active','2025-06-27 06:06:42.795878',170.00,50.00,'119/76 mmHg',80.00,17.00,33.00,'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.','Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.','Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.','','','','Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.','','','','','','','','','','','','',NULL,0);
/*!40000 ALTER TABLE `api_patient` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `api_patientimage`
--

DROP TABLE IF EXISTS `api_patientimage`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `api_patientimage` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `file` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `uploaded_at` datetime(6) NOT NULL,
  `patient_id` bigint NOT NULL,
  `uploaded_by_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `api_patientimage_patient_id_dabfa6fc_fk_api_patient_id` (`patient_id`),
  KEY `api_patientimage_uploaded_by_id_4b1e4f4d_fk_api_user_id` (`uploaded_by_id`),
  CONSTRAINT `api_patientimage_patient_id_dabfa6fc_fk_api_patient_id` FOREIGN KEY (`patient_id`) REFERENCES `api_patient` (`id`),
  CONSTRAINT `api_patientimage_uploaded_by_id_4b1e4f4d_fk_api_user_id` FOREIGN KEY (`uploaded_by_id`) REFERENCES `api_user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `api_patientimage`
--

LOCK TABLES `api_patientimage` WRITE;
/*!40000 ALTER TABLE `api_patientimage` DISABLE KEYS */;
INSERT INTO `api_patientimage` VALUES (1,'patient_images/patient_1/05.png','','2025-06-27 05:51:05.120181',1,1),(2,'patient_images/patient_2/Figure_8.png','','2025-06-27 06:02:59.281551',2,1),(3,'patient_images/patient_3/Figure_24.png','','2025-06-27 06:06:42.911450',3,1);
/*!40000 ALTER TABLE `api_patientimage` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `api_patientservice`
--

DROP TABLE IF EXISTS `api_patientservice`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `api_patientservice` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `date_availed` datetime(6) NOT NULL,
  `quantity` int unsigned NOT NULL,
  `cost_at_time` decimal(10,2) DEFAULT NULL,
  `patient_id` bigint NOT NULL,
  `service_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `api_patientservice_patient_id_f7823f2a_fk_api_patient_id` (`patient_id`),
  KEY `api_patientservice_service_id_86321a5c_fk_api_service_id` (`service_id`),
  CONSTRAINT `api_patientservice_patient_id_f7823f2a_fk_api_patient_id` FOREIGN KEY (`patient_id`) REFERENCES `api_patient` (`id`),
  CONSTRAINT `api_patientservice_service_id_86321a5c_fk_api_service_id` FOREIGN KEY (`service_id`) REFERENCES `api_service` (`id`),
  CONSTRAINT `api_patientservice_chk_1` CHECK ((`quantity` >= 0))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `api_patientservice`
--

LOCK TABLES `api_patientservice` WRITE;
/*!40000 ALTER TABLE `api_patientservice` DISABLE KEYS */;
/*!40000 ALTER TABLE `api_patientservice` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `api_payment`
--

DROP TABLE IF EXISTS `api_payment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `api_payment` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `amount_paid` decimal(10,2) NOT NULL,
  `payment_method` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `date_paid` datetime(6) NOT NULL,
  `billing_id` bigint NOT NULL,
  `received_by_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `billing_id` (`billing_id`),
  KEY `api_payment_received_by_id_0b9f77ca_fk_api_user_id` (`received_by_id`),
  CONSTRAINT `api_payment_billing_id_e522af95_fk_api_billing_id` FOREIGN KEY (`billing_id`) REFERENCES `api_billing` (`id`),
  CONSTRAINT `api_payment_received_by_id_0b9f77ca_fk_api_user_id` FOREIGN KEY (`received_by_id`) REFERENCES `api_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `api_payment`
--

LOCK TABLES `api_payment` WRITE;
/*!40000 ALTER TABLE `api_payment` DISABLE KEYS */;
/*!40000 ALTER TABLE `api_payment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `api_room`
--

DROP TABLE IF EXISTS `api_room`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `api_room` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `hourly_rate` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `api_room`
--

LOCK TABLES `api_room` WRITE;
/*!40000 ALTER TABLE `api_room` DISABLE KEYS */;
/*!40000 ALTER TABLE `api_room` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `api_service`
--

DROP TABLE IF EXISTS `api_service`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `api_service` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `current_cost` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `api_service`
--

LOCK TABLES `api_service` WRITE;
/*!40000 ALTER TABLE `api_service` DISABLE KEYS */;
/*!40000 ALTER TABLE `api_service` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `api_user`
--

DROP TABLE IF EXISTS `api_user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `api_user` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `password` varchar(128) COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_login` datetime(6) DEFAULT NULL,
  `is_superuser` tinyint(1) NOT NULL,
  `user_id` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `department` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  `is_staff` tinyint(1) NOT NULL,
  `first_name` varchar(30) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `last_name` varchar(30) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(254) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `date_joined` datetime(6) NOT NULL,
  `has_security_questions` tinyint(1) NOT NULL,
  `address` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `birthdate` date DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_id` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `api_user`
--

LOCK TABLES `api_user` WRITE;
/*!40000 ALTER TABLE `api_user` DISABLE KEYS */;
INSERT INTO `api_user` VALUES (1,'pbkdf2_sha256$600000$wmSpFGl7yV1numOkHv5jZr$OhWIxwSiCz4fTDG/FzuYlCiQgOZTMO3jIMLRGJ1bw/E=','2025-06-27 05:47:35.683203',1,'000','Admin','Hospital',1,1,NULL,NULL,NULL,NULL,'2025-06-27 05:46:48.728011',0,NULL,NULL);
/*!40000 ALTER TABLE `api_user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `api_user_groups`
--

DROP TABLE IF EXISTS `api_user_groups`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `api_user_groups` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint NOT NULL,
  `group_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `api_user_groups_user_id_group_id_9c7ddfb5_uniq` (`user_id`,`group_id`),
  KEY `api_user_groups_group_id_3af85785_fk_auth_group_id` (`group_id`),
  CONSTRAINT `api_user_groups_group_id_3af85785_fk_auth_group_id` FOREIGN KEY (`group_id`) REFERENCES `auth_group` (`id`),
  CONSTRAINT `api_user_groups_user_id_a5ff39fa_fk_api_user_id` FOREIGN KEY (`user_id`) REFERENCES `api_user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `api_user_groups`
--

LOCK TABLES `api_user_groups` WRITE;
/*!40000 ALTER TABLE `api_user_groups` DISABLE KEYS */;
INSERT INTO `api_user_groups` VALUES (1,1,1);
/*!40000 ALTER TABLE `api_user_groups` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `api_user_user_permissions`
--

DROP TABLE IF EXISTS `api_user_user_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `api_user_user_permissions` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint NOT NULL,
  `permission_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `api_user_user_permissions_user_id_permission_id_a06dd704_uniq` (`user_id`,`permission_id`),
  KEY `api_user_user_permis_permission_id_305b7fea_fk_auth_perm` (`permission_id`),
  CONSTRAINT `api_user_user_permis_permission_id_305b7fea_fk_auth_perm` FOREIGN KEY (`permission_id`) REFERENCES `auth_permission` (`id`),
  CONSTRAINT `api_user_user_permissions_user_id_f3945d65_fk_api_user_id` FOREIGN KEY (`user_id`) REFERENCES `api_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `api_user_user_permissions`
--

LOCK TABLES `api_user_user_permissions` WRITE;
/*!40000 ALTER TABLE `api_user_user_permissions` DISABLE KEYS */;
/*!40000 ALTER TABLE `api_user_user_permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `api_useractionlog`
--

DROP TABLE IF EXISTS `api_useractionlog`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `api_useractionlog` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `action_type` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `object_id` int unsigned NOT NULL,
  `object_repr` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `details` json NOT NULL,
  `ip_address` char(39) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `timestamp` datetime(6) NOT NULL,
  `content_type_id` int NOT NULL,
  `user_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `api_useractionlog_content_type_id_fa7e0df4_fk_django_co` (`content_type_id`),
  KEY `api_useractionlog_user_id_7c40fe05_fk_api_user_id` (`user_id`),
  CONSTRAINT `api_useractionlog_content_type_id_fa7e0df4_fk_django_co` FOREIGN KEY (`content_type_id`) REFERENCES `django_content_type` (`id`),
  CONSTRAINT `api_useractionlog_user_id_7c40fe05_fk_api_user_id` FOREIGN KEY (`user_id`) REFERENCES `api_user` (`id`),
  CONSTRAINT `api_useractionlog_chk_1` CHECK ((`object_id` >= 0))
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `api_useractionlog`
--

LOCK TABLES `api_useractionlog` WRITE;
/*!40000 ALTER TABLE `api_useractionlog` DISABLE KEYS */;
INSERT INTO `api_useractionlog` VALUES (1,'UPDATE',1,' ID 1 - Clarence Cortina','{\"changes\": {\"name\": [\"Clarence Cortina\", \"Clarence Cortina\"], \"status\": [\"Admitted\", \"Admitted\"], \"address\": [\"123 Sample Street, Antipolo City\", \"123 Sample Street, Antipolo City\"]}}',NULL,'2025-06-27 05:55:23.209128',12,NULL),(2,'UPDATE',1,' ID 1 - Clarence Cortina','{\"changes\": {\"name\": [\"Clarence Cortina\", \"Clarence Cortina\"], \"status\": [\"Admitted\", \"Admitted\"], \"address\": [\"123 Sample Street, Antipolo City\", \"123 Sample Street, Antipolo City\"]}}',NULL,'2025-06-27 05:55:27.336963',12,NULL),(3,'UPDATE',1,' ID 1 - Clarence Cortina','{\"changes\": {\"name\": [\"Clarence Cortina\", \"Clarence Cortina\"], \"status\": [\"Admitted\", \"Admitted\"], \"address\": [\"123 Sample Street, Antipolo City\", \"123 Sample Street, Antipolo City\"]}}',NULL,'2025-06-27 06:08:16.043852',12,NULL),(4,'UPDATE',1,' ID 1 - Clarence Cortina','{\"changes\": {\"name\": [\"Clarence Cortina\", \"Clarence Cortina\"], \"status\": [\"Admitted\", \"Admitted\"], \"address\": [\"123 Sample Street, Antipolo City\", \"123 Sample Street, Antipolo City\"]}}',NULL,'2025-06-27 06:08:16.058797',12,NULL);
/*!40000 ALTER TABLE `api_useractionlog` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `api_userimage`
--

DROP TABLE IF EXISTS `api_userimage`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `api_userimage` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `file` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `uploaded_at` datetime(6) NOT NULL,
  `uploaded_by_id` bigint DEFAULT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `api_userimage_uploaded_by_id_bc6be0f9_fk_api_user_id` (`uploaded_by_id`),
  KEY `api_userimage_user_id_53b7659e_fk_api_user_id` (`user_id`),
  CONSTRAINT `api_userimage_uploaded_by_id_bc6be0f9_fk_api_user_id` FOREIGN KEY (`uploaded_by_id`) REFERENCES `api_user` (`id`),
  CONSTRAINT `api_userimage_user_id_53b7659e_fk_api_user_id` FOREIGN KEY (`user_id`) REFERENCES `api_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `api_userimage`
--

LOCK TABLES `api_userimage` WRITE;
/*!40000 ALTER TABLE `api_userimage` DISABLE KEYS */;
/*!40000 ALTER TABLE `api_userimage` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `api_userlog`
--

DROP TABLE IF EXISTS `api_userlog`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `api_userlog` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `action` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `timestamp` datetime(6) NOT NULL,
  `details` json NOT NULL,
  `user_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `api_userlog_user_id_6858d1fd_fk_api_user_id` (`user_id`),
  CONSTRAINT `api_userlog_user_id_6858d1fd_fk_api_user_id` FOREIGN KEY (`user_id`) REFERENCES `api_user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=82 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `api_userlog`
--

LOCK TABLES `api_userlog` WRITE;
/*!40000 ALTER TABLE `api_userlog` DISABLE KEYS */;
INSERT INTO `api_userlog` VALUES (1,'VIEW','2025-06-27 05:51:21.836844','{\"message\": \"Updated patient details RENZ\", \"patient_id\": 1, \"patient_name\": \"Clarence Cortina\", \"updated_fields\": []}',1),(2,'VIEW','2025-06-27 05:51:21.913944','{\"message\": \"Updated patient details RENZ\", \"patient_id\": 1, \"patient_name\": \"Clarence Cortina\", \"updated_fields\": []}',1),(3,'VIEW','2025-06-27 05:51:24.089726','{\"message\": \"Viewed a clinical note:\"}',1),(4,'VIEW','2025-06-27 05:51:24.132400','{\"message\": \"Viewed a clinical note:\"}',1),(5,'VIEW','2025-06-27 05:51:24.154270','{\"message\": \"Viewed a patient history:\", \"patient_id\": 1, \"patient_name\": \"Clarence Cortina\"}',1),(6,'VIEW','2025-06-27 05:51:24.203511','{\"message\": \"Viewed a patient history:\", \"patient_id\": 1, \"patient_name\": \"Clarence Cortina\"}',1),(7,'VIEW','2025-06-27 05:51:27.620416','{\"message\": \"Viewed a patient image:\", \"patient_id\": 1, \"patient_name\": \"Clarence Cortina\"}',1),(8,'VIEW','2025-06-27 05:51:27.657509','{\"message\": \"Viewed a patient image:\", \"patient_id\": 1, \"patient_name\": \"Clarence Cortina\"}',1),(9,'VIEW','2025-06-27 05:52:13.098154','{\"message\": \"Viewed a patient image:\", \"patient_id\": 1, \"patient_name\": \"Clarence Cortina\"}',1),(10,'VIEW','2025-06-27 05:52:13.138406','{\"message\": \"Viewed a patient image:\", \"patient_id\": 1, \"patient_name\": \"Clarence Cortina\"}',1),(11,'VIEW','2025-06-27 05:52:22.218265','{\"message\": \"Viewed a clinical note:\"}',1),(12,'VIEW','2025-06-27 05:52:22.274766','{\"message\": \"Viewed a clinical note:\"}',1),(13,'VIEW','2025-06-27 05:52:22.310371','{\"message\": \"Viewed a patient history:\", \"patient_id\": 1, \"patient_name\": \"Clarence Cortina\"}',1),(14,'VIEW','2025-06-27 05:52:22.369948','{\"message\": \"Viewed a patient history:\", \"patient_id\": 1, \"patient_name\": \"Clarence Cortina\"}',1),(15,'CREATE','2025-06-27 05:52:47.005786','{\"message\": \"Created a clinical note:\", \"patient_id\": 1, \"patient_name\": \"Clarence Cortina\"}',1),(16,'CREATE','2025-06-27 05:53:25.676744','{\"message\": \"Created a clinical note:\", \"patient_id\": 1, \"patient_name\": \"Clarence Cortina\"}',1),(17,'CREATE','2025-06-27 05:53:46.562363','{\"message\": \"Created a clinical note:\", \"patient_id\": 1, \"patient_name\": \"Clarence Cortina\"}',1),(18,'CREATE','2025-06-27 05:54:46.804696','{\"message\": \"Created a clinical note:\", \"patient_id\": 1, \"patient_name\": \"Clarence Cortina\"}',1),(19,'VIEW','2025-06-27 05:55:37.282892','{\"message\": \"Updated patient details RENZ\", \"patient_id\": 1, \"patient_name\": \"Clarence Cortina\", \"updated_fields\": []}',1),(20,'VIEW','2025-06-27 05:55:37.340407','{\"message\": \"Updated patient details RENZ\", \"patient_id\": 1, \"patient_name\": \"Clarence Cortina\", \"updated_fields\": []}',1),(21,'VIEW','2025-06-27 05:55:38.775132','{\"message\": \"Viewed a clinical note:\"}',1),(22,'VIEW','2025-06-27 05:55:38.806686','{\"message\": \"Viewed a clinical note:\"}',1),(23,'VIEW','2025-06-27 05:55:38.822892','{\"message\": \"Viewed a patient history:\", \"patient_id\": 1, \"patient_name\": \"Clarence Cortina\"}',1),(24,'VIEW','2025-06-27 05:55:38.868734','{\"message\": \"Viewed a patient history:\", \"patient_id\": 1, \"patient_name\": \"Clarence Cortina\"}',1),(25,'VIEW','2025-06-27 05:55:40.579818','{\"message\": \"Updated patient details RENZ\", \"patient_id\": 1, \"patient_name\": \"Clarence Cortina\", \"updated_fields\": []}',1),(26,'VIEW','2025-06-27 05:55:40.629876','{\"message\": \"Updated patient details RENZ\", \"patient_id\": 1, \"patient_name\": \"Clarence Cortina\", \"updated_fields\": []}',1),(27,'VIEW','2025-06-27 05:55:52.982513','{\"message\": \"Updated patient details RENZ\", \"patient_id\": 1, \"patient_name\": \"Clarence Cortina\", \"updated_fields\": []}',1),(28,'VIEW','2025-06-27 05:55:53.026555','{\"message\": \"Updated patient details RENZ\", \"patient_id\": 1, \"patient_name\": \"Clarence Cortina\", \"updated_fields\": []}',1),(29,'VIEW','2025-06-27 05:56:00.629748','{\"message\": \"Viewed a clinical note:\"}',1),(30,'VIEW','2025-06-27 05:56:00.660262','{\"message\": \"Viewed a clinical note:\"}',1),(31,'VIEW','2025-06-27 05:56:00.670253','{\"message\": \"Viewed a patient history:\", \"patient_id\": 1, \"patient_name\": \"Clarence Cortina\"}',1),(32,'VIEW','2025-06-27 05:56:00.694976','{\"message\": \"Viewed a patient history:\", \"patient_id\": 1, \"patient_name\": \"Clarence Cortina\"}',1),(33,'VIEW','2025-06-27 05:56:13.344492','{\"message\": \"Viewed a patient image:\", \"patient_id\": 1, \"patient_name\": \"Clarence Cortina\"}',1),(34,'VIEW','2025-06-27 05:56:13.366383','{\"message\": \"Viewed a patient image:\", \"patient_id\": 1, \"patient_name\": \"Clarence Cortina\"}',1),(35,'VIEW','2025-06-27 05:56:42.541231','{\"message\": \"Viewed a patient image:\", \"patient_id\": 1, \"patient_name\": \"Clarence Cortina\"}',1),(36,'VIEW','2025-06-27 05:56:42.558355','{\"message\": \"Viewed a patient image:\", \"patient_id\": 1, \"patient_name\": \"Clarence Cortina\"}',1),(37,'VIEW','2025-06-27 05:56:55.649602','{\"message\": \"Viewed a clinical note:\"}',1),(38,'VIEW','2025-06-27 05:56:55.686221','{\"message\": \"Viewed a clinical note:\"}',1),(39,'VIEW','2025-06-27 05:56:55.705345','{\"message\": \"Viewed a patient history:\", \"patient_id\": 1, \"patient_name\": \"Clarence Cortina\"}',1),(40,'VIEW','2025-06-27 05:56:55.745220','{\"message\": \"Viewed a patient history:\", \"patient_id\": 1, \"patient_name\": \"Clarence Cortina\"}',1),(41,'VIEW','2025-06-27 05:56:56.215274','{\"message\": \"Updated patient details RENZ\", \"patient_id\": 1, \"patient_name\": \"Clarence Cortina\", \"updated_fields\": []}',1),(42,'VIEW','2025-06-27 05:56:56.258880','{\"message\": \"Updated patient details RENZ\", \"patient_id\": 1, \"patient_name\": \"Clarence Cortina\", \"updated_fields\": []}',1),(43,'VIEW','2025-06-27 05:57:53.206951','{\"query\": \"Clarence\", \"message\": \"Searched a patient:\"}',1),(44,'VIEW','2025-06-27 05:57:53.237081','{\"query\": \"Clarence\", \"message\": \"Searched a patient:\"}',1),(45,'VIEW','2025-06-27 05:57:55.593040','{\"query\": \"ZXF5X\", \"message\": \"Searched a patient:\"}',1),(46,'VIEW','2025-06-27 05:57:55.607827','{\"query\": \"ZXF5X\", \"message\": \"Searched a patient:\"}',1),(47,'VIEW','2025-06-27 05:58:00.505808','{\"message\": \"Updated patient details RENZ\", \"patient_id\": 1, \"patient_name\": \"Clarence Cortina\", \"updated_fields\": []}',1),(48,'VIEW','2025-06-27 05:58:00.555014','{\"message\": \"Updated patient details RENZ\", \"patient_id\": 1, \"patient_name\": \"Clarence Cortina\", \"updated_fields\": []}',1),(49,'VIEW','2025-06-27 06:00:43.561663','{\"query\": \"111\", \"message\": \"Searched a user:\"}',1),(50,'VIEW','2025-06-27 06:00:48.053377','{\"query\": \"000\", \"message\": \"Searched a user:\"}',1),(51,'VIEW','2025-06-27 06:00:51.665326','{\"query\": \"1\", \"message\": \"Searched a user:\"}',1),(52,'VIEW','2025-06-27 06:05:49.365385','{\"query\": \"1\", \"message\": \"Searched a user:\"}',1),(53,'VIEW','2025-06-27 06:07:43.353141','{\"message\": \"Updated patient details RENZ\", \"patient_id\": 1, \"patient_name\": \"Clarence Cortina\", \"updated_fields\": []}',1),(54,'VIEW','2025-06-27 06:07:43.401617','{\"message\": \"Updated patient details RENZ\", \"patient_id\": 1, \"patient_name\": \"Clarence Cortina\", \"updated_fields\": []}',1),(55,'VIEW','2025-06-27 06:07:49.297902','{\"message\": \"Viewed a clinical note:\"}',1),(56,'VIEW','2025-06-27 06:07:49.329092','{\"message\": \"Viewed a clinical note:\"}',1),(57,'VIEW','2025-06-27 06:07:49.340007','{\"message\": \"Viewed a patient history:\", \"patient_id\": 1, \"patient_name\": \"Clarence Cortina\"}',1),(58,'VIEW','2025-06-27 06:07:49.372176','{\"message\": \"Viewed a patient history:\", \"patient_id\": 1, \"patient_name\": \"Clarence Cortina\"}',1),(59,'VIEW','2025-06-27 06:08:01.715375','{\"message\": \"Viewed a clinical note:\"}',1),(60,'VIEW','2025-06-27 06:08:01.773503','{\"message\": \"Viewed a clinical note:\"}',1),(61,'VIEW','2025-06-27 06:08:01.790390','{\"message\": \"Viewed a patient history:\", \"patient_id\": 1, \"patient_name\": \"Clarence Cortina\"}',1),(62,'VIEW','2025-06-27 06:08:01.832799','{\"message\": \"Viewed a patient history:\", \"patient_id\": 1, \"patient_name\": \"Clarence Cortina\"}',1),(63,'VIEW','2025-06-27 06:08:04.028922','{\"message\": \"Updated patient details RENZ\", \"patient_id\": 1, \"patient_name\": \"Clarence Cortina\", \"updated_fields\": []}',1),(64,'VIEW','2025-06-27 06:08:04.082395','{\"message\": \"Updated patient details RENZ\", \"patient_id\": 1, \"patient_name\": \"Clarence Cortina\", \"updated_fields\": []}',1),(65,'VIEW','2025-06-27 06:08:08.948764','{\"message\": \"1Viewed patient details\", \"patient_id\": 1, \"patient_name\": \"Clarence Cortina\"}',1),(66,'VIEW','2025-06-27 06:08:08.977862','{\"message\": \"1Viewed patient details\", \"patient_id\": 1, \"patient_name\": \"Clarence Cortina\"}',1),(67,'VIEW','2025-06-27 06:08:08.986836','{\"message\": \"Viewed a patient image:\", \"patient_id\": 1, \"patient_name\": \"Clarence Cortina\"}',1),(68,'VIEW','2025-06-27 06:08:09.011471','{\"message\": \"Viewed a patient image:\", \"patient_id\": 1, \"patient_name\": \"Clarence Cortina\"}',1),(69,'UPDATE','2025-06-27 06:08:16.074953','{\"message\": \"Updated patient details\", \"patient_id\": 1, \"patient_name\": \"Clarence Cortina\", \"updated_fields\": [\"has_philhealth\", \"case_number\", \"hospital_case_number\", \"has_hmo\", \"hmo\", \"name\", \"status\", \"type_of_admission\", \"admission_date\", \"current_condition\", \"date_of_birth\", \"birth_place\", \"gender\", \"age\", \"address\", \"occupation\", \"civil_status\", \"nationality\", \"religion\", \"ward_service\", \"bed_number\", \"attending_physician\", \"visit_type\", \"consultation_datetime\", \"referred_by\", \"next_consultation_date\", \"discharge_date\", \"total_days\", \"phone\", \"emergency_contact_name\", \"emergency_contact_phone\", \"height\", \"weight\", \"blood_pressure\", \"pulse_rate\", \"respiratory_rate\", \"temperature\", \"physical_examination\", \"main_complaint\", \"present_illness\", \"clinical_findings\", \"icd_code\", \"diagnosis\", \"treatment\", \"principal_diagnosis\", \"other_diagnosis\", \"principal_operation\", \"other_operation\", \"disposition\", \"result\", \"membership\", \"father_name\", \"father_address\", \"father_contact\", \"mother_name\", \"mother_address\", \"mother_contact\", \"spouse_name\", \"spouse_address\", \"spouse_contact\"]}',1),(70,'VIEW','2025-06-27 06:08:31.235261','{\"message\": \"Updated patient details RENZ\", \"patient_id\": 1, \"patient_name\": \"Clarence Cortina\", \"updated_fields\": []}',1),(71,'VIEW','2025-06-27 06:08:31.279236','{\"message\": \"Updated patient details RENZ\", \"patient_id\": 1, \"patient_name\": \"Clarence Cortina\", \"updated_fields\": []}',1),(72,'VIEW','2025-06-27 06:08:37.956041','{\"message\": \"Viewed a clinical note:\"}',1),(73,'VIEW','2025-06-27 06:08:37.984967','{\"message\": \"Viewed a clinical note:\"}',1),(74,'VIEW','2025-06-27 06:08:37.990864','{\"message\": \"Viewed a patient history:\", \"patient_id\": 1, \"patient_name\": \"Clarence Cortina\"}',1),(75,'VIEW','2025-06-27 06:08:38.027035','{\"message\": \"Viewed a patient history:\", \"patient_id\": 1, \"patient_name\": \"Clarence Cortina\"}',1),(76,'VIEW','2025-06-27 06:08:52.457383','{\"message\": \"Viewed a patient image:\", \"patient_id\": 1, \"patient_name\": \"Clarence Cortina\"}',1),(77,'VIEW','2025-06-27 06:08:52.474077','{\"message\": \"Viewed a patient image:\", \"patient_id\": 1, \"patient_name\": \"Clarence Cortina\"}',1),(78,'VIEW','2025-06-27 06:09:06.443620','{\"message\": \"Viewed a clinical note:\"}',1),(79,'VIEW','2025-06-27 06:09:06.497012','{\"message\": \"Viewed a clinical note:\"}',1),(80,'VIEW','2025-06-27 06:09:06.503218','{\"message\": \"Viewed a patient history:\", \"patient_id\": 1, \"patient_name\": \"Clarence Cortina\"}',1),(81,'VIEW','2025-06-27 06:09:06.559212','{\"message\": \"Viewed a patient history:\", \"patient_id\": 1, \"patient_name\": \"Clarence Cortina\"}',1);
/*!40000 ALTER TABLE `api_userlog` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `api_usersecurityquestion`
--

DROP TABLE IF EXISTS `api_usersecurityquestion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `api_usersecurityquestion` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `question` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `answer` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `api_usersecurityquestion_user_id_62bdbd0b_fk_api_user_id` (`user_id`),
  CONSTRAINT `api_usersecurityquestion_user_id_62bdbd0b_fk_api_user_id` FOREIGN KEY (`user_id`) REFERENCES `api_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `api_usersecurityquestion`
--

LOCK TABLES `api_usersecurityquestion` WRITE;
/*!40000 ALTER TABLE `api_usersecurityquestion` DISABLE KEYS */;
/*!40000 ALTER TABLE `api_usersecurityquestion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_group`
--

DROP TABLE IF EXISTS `auth_group`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_group` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_group`
--

LOCK TABLES `auth_group` WRITE;
/*!40000 ALTER TABLE `auth_group` DISABLE KEYS */;
INSERT INTO `auth_group` VALUES (1,'Admin');
/*!40000 ALTER TABLE `auth_group` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_group_permissions`
--

DROP TABLE IF EXISTS `auth_group_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_group_permissions` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `group_id` int NOT NULL,
  `permission_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_group_permissions_group_id_permission_id_0cd325b0_uniq` (`group_id`,`permission_id`),
  KEY `auth_group_permissio_permission_id_84c5c92e_fk_auth_perm` (`permission_id`),
  CONSTRAINT `auth_group_permissio_permission_id_84c5c92e_fk_auth_perm` FOREIGN KEY (`permission_id`) REFERENCES `auth_permission` (`id`),
  CONSTRAINT `auth_group_permissions_group_id_b120cbf9_fk_auth_group_id` FOREIGN KEY (`group_id`) REFERENCES `auth_group` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_group_permissions`
--

LOCK TABLES `auth_group_permissions` WRITE;
/*!40000 ALTER TABLE `auth_group_permissions` DISABLE KEYS */;
/*!40000 ALTER TABLE `auth_group_permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_permission`
--

DROP TABLE IF EXISTS `auth_permission`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_permission` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `content_type_id` int NOT NULL,
  `codename` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_permission_content_type_id_codename_01ab375a_uniq` (`content_type_id`,`codename`),
  CONSTRAINT `auth_permission_content_type_id_2f476e4b_fk_django_co` FOREIGN KEY (`content_type_id`) REFERENCES `django_content_type` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=133 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_permission`
--

LOCK TABLES `auth_permission` WRITE;
/*!40000 ALTER TABLE `auth_permission` DISABLE KEYS */;
INSERT INTO `auth_permission` VALUES (1,'Can add log entry',1,'add_logentry'),(2,'Can change log entry',1,'change_logentry'),(3,'Can delete log entry',1,'delete_logentry'),(4,'Can view log entry',1,'view_logentry'),(5,'Can add permission',2,'add_permission'),(6,'Can change permission',2,'change_permission'),(7,'Can delete permission',2,'delete_permission'),(8,'Can view permission',2,'view_permission'),(9,'Can add group',3,'add_group'),(10,'Can change group',3,'change_group'),(11,'Can delete group',3,'delete_group'),(12,'Can view group',3,'view_group'),(13,'Can add content type',4,'add_contenttype'),(14,'Can change content type',4,'change_contenttype'),(15,'Can delete content type',4,'delete_contenttype'),(16,'Can view content type',4,'view_contenttype'),(17,'Can add session',5,'add_session'),(18,'Can change session',5,'change_session'),(19,'Can delete session',5,'delete_session'),(20,'Can view session',5,'view_session'),(21,'Can add user',6,'add_user'),(22,'Can change user',6,'change_user'),(23,'Can delete user',6,'delete_user'),(24,'Can view user',6,'view_user'),(25,'Can add bed',7,'add_bed'),(26,'Can change bed',7,'change_bed'),(27,'Can delete bed',7,'delete_bed'),(28,'Can view bed',7,'view_bed'),(29,'Can add bed assignment',8,'add_bedassignment'),(30,'Can change bed assignment',8,'change_bedassignment'),(31,'Can delete bed assignment',8,'delete_bedassignment'),(32,'Can view bed assignment',8,'view_bedassignment'),(33,'Can add billing',9,'add_billing'),(34,'Can change billing',9,'change_billing'),(35,'Can delete billing',9,'delete_billing'),(36,'Can view billing',9,'view_billing'),(37,'Can add laboratory result',10,'add_laboratoryresult'),(38,'Can change laboratory result',10,'change_laboratoryresult'),(39,'Can delete laboratory result',10,'delete_laboratoryresult'),(40,'Can view laboratory result',10,'view_laboratoryresult'),(41,'Can add lab result file group',11,'add_labresultfilegroup'),(42,'Can change lab result file group',11,'change_labresultfilegroup'),(43,'Can delete lab result file group',11,'delete_labresultfilegroup'),(44,'Can view lab result file group',11,'view_labresultfilegroup'),(45,'Can add patient',12,'add_patient'),(46,'Can change patient',12,'change_patient'),(47,'Can delete patient',12,'delete_patient'),(48,'Can view patient',12,'view_patient'),(49,'Can add room',13,'add_room'),(50,'Can change room',13,'change_room'),(51,'Can delete room',13,'delete_room'),(52,'Can view room',13,'view_room'),(53,'Can add service',14,'add_service'),(54,'Can change service',14,'change_service'),(55,'Can delete service',14,'delete_service'),(56,'Can view service',14,'view_service'),(57,'Can add user security question',15,'add_usersecurityquestion'),(58,'Can change user security question',15,'change_usersecurityquestion'),(59,'Can delete user security question',15,'delete_usersecurityquestion'),(60,'Can view user security question',15,'view_usersecurityquestion'),(61,'Can add user log',16,'add_userlog'),(62,'Can change user log',16,'change_userlog'),(63,'Can delete user log',16,'delete_userlog'),(64,'Can view user log',16,'view_userlog'),(65,'Can add user image',17,'add_userimage'),(66,'Can change user image',17,'change_userimage'),(67,'Can delete user image',17,'delete_userimage'),(68,'Can view user image',17,'view_userimage'),(69,'Can add user action log',18,'add_useractionlog'),(70,'Can change user action log',18,'change_useractionlog'),(71,'Can delete user action log',18,'delete_useractionlog'),(72,'Can view user action log',18,'view_useractionlog'),(73,'Can add payment',19,'add_payment'),(74,'Can change payment',19,'change_payment'),(75,'Can delete payment',19,'delete_payment'),(76,'Can view payment',19,'view_payment'),(77,'Can add patient service',20,'add_patientservice'),(78,'Can change patient service',20,'change_patientservice'),(79,'Can delete patient service',20,'delete_patientservice'),(80,'Can view patient service',20,'view_patientservice'),(81,'Can add patient image',21,'add_patientimage'),(82,'Can change patient image',21,'change_patientimage'),(83,'Can delete patient image',21,'delete_patientimage'),(84,'Can view patient image',21,'view_patientimage'),(85,'Can add medical history',22,'add_medicalhistory'),(86,'Can change medical history',22,'change_medicalhistory'),(87,'Can delete medical history',22,'delete_medicalhistory'),(88,'Can view medical history',22,'view_medicalhistory'),(89,'Can add lab result file in group',23,'add_labresultfileingroup'),(90,'Can change lab result file in group',23,'change_labresultfileingroup'),(91,'Can delete lab result file in group',23,'delete_labresultfileingroup'),(92,'Can view lab result file in group',23,'view_labresultfileingroup'),(93,'Can add lab result file',24,'add_labresultfile'),(94,'Can change lab result file',24,'change_labresultfile'),(95,'Can delete lab result file',24,'delete_labresultfile'),(96,'Can view lab result file',24,'view_labresultfile'),(97,'Can add historical patient',25,'add_historicalpatient'),(98,'Can change historical patient',25,'change_historicalpatient'),(99,'Can delete historical patient',25,'delete_historicalpatient'),(100,'Can view historical patient',25,'view_historicalpatient'),(101,'Can add clinical note',26,'add_clinicalnote'),(102,'Can change clinical note',26,'change_clinicalnote'),(103,'Can delete clinical note',26,'delete_clinicalnote'),(104,'Can view clinical note',26,'view_clinicalnote'),(105,'Can add billing operator log',27,'add_billingoperatorlog'),(106,'Can change billing operator log',27,'change_billingoperatorlog'),(107,'Can delete billing operator log',27,'delete_billingoperatorlog'),(108,'Can view billing operator log',27,'view_billingoperatorlog'),(109,'Can add billing item',28,'add_billingitem'),(110,'Can change billing item',28,'change_billingitem'),(111,'Can delete billing item',28,'delete_billingitem'),(112,'Can view billing item',28,'view_billingitem'),(113,'Can add Scheduled task',29,'add_schedule'),(114,'Can change Scheduled task',29,'change_schedule'),(115,'Can delete Scheduled task',29,'delete_schedule'),(116,'Can view Scheduled task',29,'view_schedule'),(117,'Can add task',30,'add_task'),(118,'Can change task',30,'change_task'),(119,'Can delete task',30,'delete_task'),(120,'Can view task',30,'view_task'),(121,'Can add Failed task',31,'add_failure'),(122,'Can change Failed task',31,'change_failure'),(123,'Can delete Failed task',31,'delete_failure'),(124,'Can view Failed task',31,'view_failure'),(125,'Can add Successful task',32,'add_success'),(126,'Can change Successful task',32,'change_success'),(127,'Can delete Successful task',32,'delete_success'),(128,'Can view Successful task',32,'view_success'),(129,'Can add Queued task',33,'add_ormq'),(130,'Can change Queued task',33,'change_ormq'),(131,'Can delete Queued task',33,'delete_ormq'),(132,'Can view Queued task',33,'view_ormq');
/*!40000 ALTER TABLE `auth_permission` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_admin_log`
--

DROP TABLE IF EXISTS `django_admin_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_admin_log` (
  `id` int NOT NULL AUTO_INCREMENT,
  `action_time` datetime(6) NOT NULL,
  `object_id` longtext COLLATE utf8mb4_unicode_ci,
  `object_repr` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `action_flag` smallint unsigned NOT NULL,
  `change_message` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `content_type_id` int DEFAULT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `django_admin_log_content_type_id_c4bce8eb_fk_django_co` (`content_type_id`),
  KEY `django_admin_log_user_id_c564eba6_fk_api_user_id` (`user_id`),
  CONSTRAINT `django_admin_log_content_type_id_c4bce8eb_fk_django_co` FOREIGN KEY (`content_type_id`) REFERENCES `django_content_type` (`id`),
  CONSTRAINT `django_admin_log_user_id_c564eba6_fk_api_user_id` FOREIGN KEY (`user_id`) REFERENCES `api_user` (`id`),
  CONSTRAINT `django_admin_log_chk_1` CHECK ((`action_flag` >= 0))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_admin_log`
--

LOCK TABLES `django_admin_log` WRITE;
/*!40000 ALTER TABLE `django_admin_log` DISABLE KEYS */;
/*!40000 ALTER TABLE `django_admin_log` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_content_type`
--

DROP TABLE IF EXISTS `django_content_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_content_type` (
  `id` int NOT NULL AUTO_INCREMENT,
  `app_label` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `model` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `django_content_type_app_label_model_76bd3d3b_uniq` (`app_label`,`model`)
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_content_type`
--

LOCK TABLES `django_content_type` WRITE;
/*!40000 ALTER TABLE `django_content_type` DISABLE KEYS */;
INSERT INTO `django_content_type` VALUES (1,'admin','logentry'),(7,'api','bed'),(8,'api','bedassignment'),(9,'api','billing'),(28,'api','billingitem'),(27,'api','billingoperatorlog'),(26,'api','clinicalnote'),(25,'api','historicalpatient'),(10,'api','laboratoryresult'),(24,'api','labresultfile'),(11,'api','labresultfilegroup'),(23,'api','labresultfileingroup'),(22,'api','medicalhistory'),(12,'api','patient'),(21,'api','patientimage'),(20,'api','patientservice'),(19,'api','payment'),(13,'api','room'),(14,'api','service'),(6,'api','user'),(18,'api','useractionlog'),(17,'api','userimage'),(16,'api','userlog'),(15,'api','usersecurityquestion'),(3,'auth','group'),(2,'auth','permission'),(4,'contenttypes','contenttype'),(31,'django_q','failure'),(33,'django_q','ormq'),(29,'django_q','schedule'),(32,'django_q','success'),(30,'django_q','task'),(5,'sessions','session');
/*!40000 ALTER TABLE `django_content_type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_migrations`
--

DROP TABLE IF EXISTS `django_migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_migrations` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `app` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `applied` datetime(6) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=36 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_migrations`
--

LOCK TABLES `django_migrations` WRITE;
/*!40000 ALTER TABLE `django_migrations` DISABLE KEYS */;
INSERT INTO `django_migrations` VALUES (1,'contenttypes','0001_initial','2025-06-27 05:45:10.369780'),(2,'contenttypes','0002_remove_content_type_name','2025-06-27 05:45:10.491822'),(3,'auth','0001_initial','2025-06-27 05:45:11.002896'),(4,'auth','0002_alter_permission_name_max_length','2025-06-27 05:45:11.122657'),(5,'auth','0003_alter_user_email_max_length','2025-06-27 05:45:11.138673'),(6,'auth','0004_alter_user_username_opts','2025-06-27 05:45:11.153899'),(7,'auth','0005_alter_user_last_login_null','2025-06-27 05:45:11.163085'),(8,'auth','0006_require_contenttypes_0002','2025-06-27 05:45:11.169630'),(9,'auth','0007_alter_validators_add_error_messages','2025-06-27 05:45:11.181422'),(10,'auth','0008_alter_user_username_max_length','2025-06-27 05:45:11.194554'),(11,'auth','0009_alter_user_last_name_max_length','2025-06-27 05:45:11.206761'),(12,'auth','0010_alter_group_name_max_length','2025-06-27 05:45:11.239692'),(13,'auth','0011_update_proxy_permissions','2025-06-27 05:45:11.253790'),(14,'auth','0012_alter_user_first_name_max_length','2025-06-27 05:45:11.263382'),(15,'api','0001_initial','2025-06-27 05:45:18.339565'),(16,'admin','0001_initial','2025-06-27 05:45:18.662575'),(17,'admin','0002_logentry_remove_auto_add','2025-06-27 05:45:18.712095'),(18,'admin','0003_logentry_add_action_flag_choices','2025-06-27 05:45:18.739269'),(19,'api','0002_historicalpatient_archived_patient_archived','2025-06-27 05:45:19.134436'),(20,'api','0003_alter_historicalpatient_options_and_more','2025-06-27 05:45:19.306591'),(21,'django_q','0001_initial','2025-06-27 05:45:19.395610'),(22,'django_q','0002_auto_20150630_1624','2025-06-27 05:45:19.564813'),(23,'django_q','0003_auto_20150708_1326','2025-06-27 05:45:19.741098'),(24,'django_q','0004_auto_20150710_1043','2025-06-27 05:45:19.757656'),(25,'django_q','0005_auto_20150718_1506','2025-06-27 05:45:19.819365'),(26,'django_q','0006_auto_20150805_1817','2025-06-27 05:45:19.936191'),(27,'django_q','0007_ormq','2025-06-27 05:45:19.983647'),(28,'django_q','0008_auto_20160224_1026','2025-06-27 05:45:19.995023'),(29,'django_q','0009_auto_20171009_0915','2025-06-27 05:45:20.092755'),(30,'django_q','0010_auto_20200610_0856','2025-06-27 05:45:20.100361'),(31,'django_q','0011_auto_20200628_1055','2025-06-27 05:45:20.149108'),(32,'django_q','0012_auto_20200702_1608','2025-06-27 05:45:20.155559'),(33,'django_q','0013_task_attempt_count','2025-06-27 05:45:20.209784'),(34,'django_q','0014_schedule_cluster','2025-06-27 05:45:20.258002'),(35,'sessions','0001_initial','2025-06-27 05:45:20.324229');
/*!40000 ALTER TABLE `django_migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_q_ormq`
--

DROP TABLE IF EXISTS `django_q_ormq`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_q_ormq` (
  `id` int NOT NULL AUTO_INCREMENT,
  `key` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `lock` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_q_ormq`
--

LOCK TABLES `django_q_ormq` WRITE;
/*!40000 ALTER TABLE `django_q_ormq` DISABLE KEYS */;
/*!40000 ALTER TABLE `django_q_ormq` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_q_schedule`
--

DROP TABLE IF EXISTS `django_q_schedule`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_q_schedule` (
  `id` int NOT NULL AUTO_INCREMENT,
  `func` varchar(256) COLLATE utf8mb4_unicode_ci NOT NULL,
  `hook` varchar(256) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `args` longtext COLLATE utf8mb4_unicode_ci,
  `kwargs` longtext COLLATE utf8mb4_unicode_ci,
  `schedule_type` varchar(1) COLLATE utf8mb4_unicode_ci NOT NULL,
  `repeats` int NOT NULL,
  `next_run` datetime(6) DEFAULT NULL,
  `task` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `minutes` smallint unsigned DEFAULT NULL,
  `cron` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cluster` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `django_q_schedule_chk_1` CHECK ((`minutes` >= 0))
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_q_schedule`
--

LOCK TABLES `django_q_schedule` WRITE;
/*!40000 ALTER TABLE `django_q_schedule` DISABLE KEYS */;
INSERT INTO `django_q_schedule` VALUES (1,'api.tasks.generate_hourly_bed_charges',NULL,'()','{}','I',-1,'2025-06-27 05:46:07.913572',NULL,NULL,1,NULL,NULL),(2,'api.tasks.generate_hourly_bed_charges',NULL,'()','{}','I',-1,'2025-06-27 05:47:15.458100',NULL,NULL,1,NULL,NULL),(3,'api.tasks.generate_hourly_bed_charges',NULL,'()','{}','I',-1,'2025-06-27 05:47:16.349061',NULL,NULL,1,NULL,NULL),(4,'api.tasks.generate_hourly_bed_charges',NULL,'()','{}','I',-1,'2025-06-27 06:32:45.028466',NULL,NULL,1,NULL,NULL),(5,'api.tasks.generate_hourly_bed_charges',NULL,'()','{}','I',-1,'2025-06-27 06:33:08.162545',NULL,NULL,1,NULL,NULL),(6,'api.tasks.generate_hourly_bed_charges',NULL,'()','{}','I',-1,'2025-06-27 06:33:13.173086',NULL,NULL,1,NULL,NULL),(7,'api.tasks.generate_hourly_bed_charges',NULL,'()','{}','I',-1,'2025-06-27 06:34:49.352123',NULL,NULL,1,NULL,NULL),(8,'api.tasks.generate_hourly_bed_charges',NULL,'()','{}','I',-1,'2025-06-27 06:35:45.180832',NULL,NULL,1,NULL,NULL);
/*!40000 ALTER TABLE `django_q_schedule` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_q_task`
--

DROP TABLE IF EXISTS `django_q_task`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_q_task` (
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `func` varchar(256) COLLATE utf8mb4_unicode_ci NOT NULL,
  `hook` varchar(256) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `args` longtext COLLATE utf8mb4_unicode_ci,
  `kwargs` longtext COLLATE utf8mb4_unicode_ci,
  `result` longtext COLLATE utf8mb4_unicode_ci,
  `started` datetime(6) NOT NULL,
  `stopped` datetime(6) NOT NULL,
  `success` tinyint(1) NOT NULL,
  `id` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `group` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `attempt_count` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_q_task`
--

LOCK TABLES `django_q_task` WRITE;
/*!40000 ALTER TABLE `django_q_task` DISABLE KEYS */;
/*!40000 ALTER TABLE `django_q_task` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_session`
--

DROP TABLE IF EXISTS `django_session`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_session` (
  `session_key` varchar(40) COLLATE utf8mb4_unicode_ci NOT NULL,
  `session_data` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `expire_date` datetime(6) NOT NULL,
  PRIMARY KEY (`session_key`),
  KEY `django_session_expire_date_a5c62663` (`expire_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_session`
--

LOCK TABLES `django_session` WRITE;
/*!40000 ALTER TABLE `django_session` DISABLE KEYS */;
INSERT INTO `django_session` VALUES ('glve1yj61obqoxta35pb3efn5e9tgo6p','.eJxVjEEOwiAQAP_C2RCgSwWP3vsGsgtbqRpISnsy_l1JetDrzGReIuC-5bA3XsOSxEVocfplhPHBpYt0x3KrMtayrQvJnsjDNjnVxM_r0f4NMrbctwYRGcDNEQzpeI4W3KijM5boiwa2CI6MYq9tAq9IOUDPabYjOjOI9wfmhDfB:1uV1vz:fOE904hL5_bkO9AOwvZ9mph_S0nKF1wyZ9HmAUeoqqQ','2025-07-11 05:47:35.701262');
/*!40000 ALTER TABLE `django_session` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-06-27 14:39:05
