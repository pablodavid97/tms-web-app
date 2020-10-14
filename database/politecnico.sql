CREATE DATABASE  IF NOT EXISTS `politecnico` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `politecnico`;
-- MySQL dump 10.13  Distrib 8.0.21, for Linux (x86_64)
--
-- Host: 127.0.0.1    Database: politecnico
-- ------------------------------------------------------
-- Server version	8.0.21-0ubuntu0.20.04.4

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `decano`
--

DROP TABLE IF EXISTS `decano`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `decano` (
  `usuario_id` int NOT NULL,
  `carrera` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`usuario_id`),
  CONSTRAINT `fk_decano_usuario1` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`usuario_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `decano`
--

LOCK TABLES `decano` WRITE;
/*!40000 ALTER TABLE `decano` DISABLE KEYS */;
INSERT INTO `decano` VALUES (1,'Mecánica'),(2,'Electrónica'),(3,'Alimentos'),(4,'Industrial'),(5,'Sistemas'),(6,'Agronomía'),(7,'Física'),(8,'Ambiental'),(9,'Civil'),(10,'Química'),(11,'Matemática'),(12,'Agronomía'),(13,'Electrónica'),(14,'Industrial'),(15,'Física'),(16,'Fisica'),(17,'Matemática'),(18,'Mecánica'),(19,'Química'),(20,'Industrial'),(21,'Industrial'),(22,'Sistemas'),(23,'Civil'),(24,'Mecánica'),(25,'Fisica'),(26,'Matemática'),(27,'Electrónica'),(28,'Química'),(29,'Alimentos'),(30,'Industrial');
/*!40000 ALTER TABLE `decano` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `estado_reunion`
--

DROP TABLE IF EXISTS `estado_reunion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `estado_reunion` (
  `estado_id` int NOT NULL,
  `estado` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`estado_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `estado_reunion`
--

LOCK TABLES `estado_reunion` WRITE;
/*!40000 ALTER TABLE `estado_reunion` DISABLE KEYS */;
/*!40000 ALTER TABLE `estado_reunion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `estudiante`
--

DROP TABLE IF EXISTS `estudiante`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `estudiante` (
  `usuario_id` int NOT NULL,
  `carrera` varchar(45) DEFAULT NULL,
  `gpa` int DEFAULT NULL,
  `status` varchar(45) DEFAULT NULL,
  `periodo_de_admision` varchar(45) DEFAULT NULL,
  `tipo_de_admision` varchar(45) DEFAULT NULL,
  `horario` varchar(45) DEFAULT NULL,
  `progreso_de_carrera` varchar(45) DEFAULT NULL,
  `profesor_usuario_id` int NOT NULL,
  PRIMARY KEY (`usuario_id`,`profesor_usuario_id`),
  KEY `fk_estudiante_usuario1_idx` (`usuario_id`),
  KEY `fk_estudiante_profesor1_idx` (`profesor_usuario_id`),
  CONSTRAINT `fk_estudiante_profesor1` FOREIGN KEY (`profesor_usuario_id`) REFERENCES `profesor` (`usuario_id`),
  CONSTRAINT `fk_estudiante_usuario1` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`usuario_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `estudiante`
--

LOCK TABLES `estudiante` WRITE;
/*!40000 ALTER TABLE `estudiante` DISABLE KEYS */;
INSERT INTO `estudiante` VALUES (61,'Industrial',3,'Activo','Segundo Semestre 2017/2018','Primera',NULL,NULL,34),(62,'Física',3,'Activo','Primer Semestre 2018/2019','Tercera',NULL,NULL,38),(63,'Mecánica',4,'Activo','Segundo Semestre 2018/2019','Segunda',NULL,NULL,31),(64,'Matemática',3,'Activo','Segundo Semestre 2018/2019','Primera',NULL,NULL,39),(65,'Sistemas',3,'Inactivo','Segundo Semestre 2018/2019','Segunda',NULL,NULL,35),(66,'Alimentos',2,'Activo','Segundo Semestre 2017/2018','Tercera',NULL,NULL,32),(67,'Química',2,'Inactivo','Primer Semestre 2018/2019','Primera',NULL,NULL,40),(68,'Civil',2,'Activo','Primer Semestre 2019/2020','Segunda',NULL,NULL,41),(69,'Electrónica',2,'Activo','Primer Semestre 2019/2020','Tercera',NULL,NULL,42),(70,'Agronomía',3,'Activo','Segundo Semestre 2019/2020','Primera',NULL,NULL,33),(71,'Civil',3,'Inactivo','Segundo Semestre 2019/2020','Segunda',NULL,NULL,41),(72,'Electrónica',3,'Activo','Segundo Semestre 2017/2018','Tercera',NULL,NULL,42),(73,'Sistemas',2,'Inactivo','Primer Semestre 2018/2019','Tercera',NULL,NULL,35),(74,'Física',4,'Inactivo','Primer Semestre 2018/2019','Segunda',NULL,NULL,38),(75,'Matemática',4,'Activo','Primer Semestre 2016/2017','Primera',NULL,NULL,39),(76,'Sistemas',4,'Activo','Segundo Semestre 2016/2017','Primera',NULL,NULL,58),(77,'Industrial',4,'Activo','Primer Semestre 2017/2018','Primera',NULL,NULL,44),(78,'Matemática',3,'Activo','Primer Semestre 2017/2018','Primera',NULL,NULL,51),(79,'Industrial',3,'Activo','Primer Semestre 2017/2018','Segunda',NULL,NULL,46),(80,'Industrial',3,'Activo','Segundo Semestre 2017/2018','Segunda',NULL,NULL,47),(81,'Electrónica',3,'Activo','Segundo Semestre 2017/2018','Primera',NULL,NULL,45),(82,'Electrónica',3,'Activo','Primer Semestre 2016/2017','Tercera',NULL,NULL,45),(83,'Civil',4,'Activo','Segundo Semestre 2016/2017','Primera',NULL,NULL,49),(84,'Civil',4,'Inactivo','Segundo Semestre 2017/2018','Primera',NULL,NULL,49),(85,'Industrial',3,'Inactivo','Segundo Semestre 2017/2018','Segunda',NULL,NULL,47),(86,'Alimentos',3,'Inactivo','Primer Semestre 2016/2017','Primera',NULL,NULL,32),(87,'Alimentos',4,'Activo','Segundo Semestre 2016/2017','Primera',NULL,NULL,32),(88,'Química',3,'Activo','Primer Semestre 2017/2018','Segunda',NULL,NULL,55),(89,'Química',3,'Inactivo','Primer Semestre 2016/2017','Tercera',NULL,NULL,55),(90,'Química',3,'Inactivo','Primer Semestre 2017/2018','Primera',NULL,NULL,55);
/*!40000 ALTER TABLE `estudiante` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Temporary view structure for view `estudiante_view`
--

DROP TABLE IF EXISTS `estudiante_view`;
/*!50001 DROP VIEW IF EXISTS `estudiante_view`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `estudiante_view` AS SELECT 
 1 AS `usuario_id`,
 1 AS `codigo`,
 1 AS `correo_institucional`,
 1 AS `hash`,
 1 AS `nombres`,
 1 AS `apellidos`,
 1 AS `correo_personal`,
 1 AS `telefono`,
 1 AS `carrera`,
 1 AS `gpa`,
 1 AS `status`,
 1 AS `periodo_de_admision`,
 1 AS `tipo_de_admision`,
 1 AS `profesor_usuario_id`*/;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `profesor`
--

DROP TABLE IF EXISTS `profesor`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `profesor` (
  `usuario_id` int NOT NULL,
  `carrera` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`usuario_id`),
  CONSTRAINT `fk_profesor_usuario1` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`usuario_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `profesor`
--

LOCK TABLES `profesor` WRITE;
/*!40000 ALTER TABLE `profesor` DISABLE KEYS */;
INSERT INTO `profesor` VALUES (31,'Mecánica'),(32,'Alimentos'),(33,'Agronomía'),(34,'Industrial'),(35,'Sistemas'),(36,'Electrónica'),(37,'Civil'),(38,'Física'),(39,'Matemática'),(40,'Química'),(41,'Civil'),(42,'Electrónica'),(43,'Ambiental'),(44,'Industrial'),(45,'Electrónica'),(46,'Industrial'),(47,'Industrial'),(48,'Mecánica'),(49,'Civil'),(50,'Agronomía'),(51,'Matemática'),(52,'Electrónica'),(53,'Física'),(54,'Electrónica'),(55,'Química'),(56,'Física'),(57,'Industrial'),(58,'Sistemas'),(59,'Química'),(60,'Civil');
/*!40000 ALTER TABLE `profesor` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Temporary view structure for view `profesor_view`
--

DROP TABLE IF EXISTS `profesor_view`;
/*!50001 DROP VIEW IF EXISTS `profesor_view`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `profesor_view` AS SELECT 
 1 AS `usuario_id`,
 1 AS `codigo`,
 1 AS `nombres`,
 1 AS `apellidos`,
 1 AS `hash`,
 1 AS `carrera`,
 1 AS `correo_institucional`,
 1 AS `correo_personal`,
 1 AS `telefono`*/;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `reunion`
--

DROP TABLE IF EXISTS `reunion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reunion` (
  `reunion_id` int NOT NULL AUTO_INCREMENT,
  `tema` varchar(45) DEFAULT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  `fecha` datetime DEFAULT NULL,
  `comentarios_estudiante` varchar(255) DEFAULT NULL,
  `comentarios_profesor` varchar(255) DEFAULT NULL,
  `semestre` varchar(255) DEFAULT NULL,
  `estado_id` int DEFAULT NULL,
  `profesor_usuario_id` int NOT NULL,
  `estudiante_usuario_id` int NOT NULL,
  PRIMARY KEY (`reunion_id`),
  KEY `fk_reunion_estado_reunion1_idx` (`estado_id`),
  KEY `fk_reunion_profesor1_idx` (`profesor_usuario_id`),
  KEY `fk_reunion_estudiante1_idx` (`estudiante_usuario_id`),
  CONSTRAINT `fk_reunion_estado_reunion1` FOREIGN KEY (`estado_id`) REFERENCES `estado_reunion` (`estado_id`),
  CONSTRAINT `fk_reunion_estudiante1` FOREIGN KEY (`estudiante_usuario_id`) REFERENCES `estudiante` (`usuario_id`),
  CONSTRAINT `fk_reunion_profesor1` FOREIGN KEY (`profesor_usuario_id`) REFERENCES `profesor` (`usuario_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reunion`
--

LOCK TABLES `reunion` WRITE;
/*!40000 ALTER TABLE `reunion` DISABLE KEYS */;
INSERT INTO `reunion` VALUES (1,'Seguimiento','Esto es para dar seguimiento','2020-10-14 00:00:00',NULL,NULL,NULL,NULL,38,62),(2,'Nueva reunion','Esta es una nueva reunión','2020-10-14 00:00:00',NULL,NULL,NULL,NULL,38,62),(3,'Reunión 2','Esta reunión es con otro estudiante.','2020-10-17 22:00:00',NULL,NULL,NULL,NULL,38,74),(4,'Reunion 4','Esta es otra reunion de seguimiento.','2020-10-31 23:00:00',NULL,NULL,NULL,NULL,38,62);
/*!40000 ALTER TABLE `reunion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Temporary view structure for view `reunion_view`
--

DROP TABLE IF EXISTS `reunion_view`;
/*!50001 DROP VIEW IF EXISTS `reunion_view`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `reunion_view` AS SELECT 
 1 AS `reunion_id`,
 1 AS `tema`,
 1 AS `descripcion`,
 1 AS `fecha`,
 1 AS `profesor_usuario_id`,
 1 AS `nombres_profesor`,
 1 AS `apellidos_profesor`,
 1 AS `estudiante_usuario_id`,
 1 AS `nombres_estudiante`,
 1 AS `apellidos_estudiante`,
 1 AS `estado_id`*/;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `rol`
--

DROP TABLE IF EXISTS `rol`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rol` (
  `rol_id` int NOT NULL,
  `nombre` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`rol_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rol`
--

LOCK TABLES `rol` WRITE;
/*!40000 ALTER TABLE `rol` DISABLE KEYS */;
INSERT INTO `rol` VALUES (1,'Decano'),(2,'Profesor'),(3,'Estudiante'),(4,'Administrador');
/*!40000 ALTER TABLE `rol` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuario`
--

DROP TABLE IF EXISTS `usuario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuario` (
  `usuario_id` int NOT NULL AUTO_INCREMENT,
  `codigo` varchar(45) DEFAULT NULL,
  `correo_institucional` varchar(255) DEFAULT NULL,
  `hash` varchar(255) DEFAULT NULL,
  `nombres` varchar(255) DEFAULT NULL,
  `apellidos` varchar(255) DEFAULT NULL,
  `correo_personal` varchar(255) DEFAULT NULL,
  `telefono` varchar(45) DEFAULT NULL,
  `first_time_login` tinyint(1) DEFAULT NULL,
  `rol_id` int NOT NULL,
  PRIMARY KEY (`usuario_id`),
  KEY `fk_usuario_rol_idx` (`rol_id`),
  CONSTRAINT `fk_usuario_rol` FOREIGN KEY (`rol_id`) REFERENCES `rol` (`rol_id`)
) ENGINE=InnoDB AUTO_INCREMENT=91 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuario`
--

LOCK TABLES `usuario` WRITE;
/*!40000 ALTER TABLE `usuario` DISABLE KEYS */;
INSERT INTO `usuario` VALUES (1,'136217','cpavon@usfq.edu.ec',NULL,'Carmen','Pavón','carmenp@hotmail.com','0983627345',0,1),(2,'137584','lu.guerra@usfq.edu.ec',NULL,'Luis','Guerra','luisg@gmail.com','0983627346',1,1),(3,'132748','davidlopez4@usfq.edu.ec',NULL,'David','Lopez ','davidl@gmail.com','0983627347',1,1),(4,'127483','gchacon@usfq.edu.ec',NULL,'Guillermo','Chacon','guillermoc@hotmail.com','0983627348',1,1),(5,'118475','baragon@usfq.edu.ec',NULL,'Benjamin','Aragón','benjamin@gmail.com','0983627349',1,1),(6,'138098','ibarbero@usfq.edu.ec',NULL,'Irina','Barbero','irinab@hotmail.com','0983627350',1,1),(7,'123452','cgodoy@usfq.edu.ec',NULL,'Consuelo','Godoy','consuelog@gmail.com','0983627351',1,1),(8,'131243','ffernandez@usfq.edu.ec',NULL,'Fausto','Fernandez','faustof@hotmail.com','0983627352',1,1),(9,'138086','isalgado@usfq.edu.ec',NULL,'Inés','Salgado','iness8@gmail.com','0983627353',1,1),(10,'132024','pcampos@usfq.edu.ec',NULL,'Pedro','Campos','pedro_c@gmail.com','0983627354',1,1),(11,'126043','apineda@usfq.edu.ec',NULL,'Albert','Pineda','albert98@gmail.com','0983627355',1,1),(12,'126686','aconde@usfq.edu.ec',NULL,'Arturo','Conde','arturoc@hotmail.com','0983627356',1,1),(13,'130943','emedina@usfq.edu.ec',NULL,'Estrella','Medina','estrella3@gmail.com','0983627357',1,1),(14,'131423','vhoyos@usfq.edu.ec',NULL,'Valentina','Hoyos','valen-tina@gmail.com','0983627358',1,1),(15,'125098','smanzano@usfq.edu.ec',NULL,'Sebastián','Manzano','sebastianm@hotmail.com','0983627359',1,1),(16,'136218','ddelgado@usfq.edu.ec','$2a$10$Hl.sFJhehT2ADBYOawrU/.thzfoCbdwXN/JqhvhFpK72QyMpSLSqi','David','Delgado','daviddelagdo@gmail.com','0983627360',0,1),(17,'136219','csalgado@usfq.edu.ec',NULL,'Cristina ','Salgado','cristinasalgado@gmail.com','0983627123',1,1),(18,'136220','eiturralde@usfq.edu.ec',NULL,'Edison','Iturralde','edisoniturralde@gmail.com','0983627456',1,1),(19,'136221','jlima@usfq.edu.ec',NULL,'Juan','Lima','jjlima@gmail.com','0983627789',1,1),(20,'136222','cbarboso@usfq.edu.ec',NULL,'Carla ','Barboso','cbarboso@gmail.com','0983627351',1,1),(21,'136223','nwitt@usfq.edu.ec',NULL,'Nicole','Witt','nwitt@gmail.com','0983627352',1,1),(22,'136224','iitriango@usfq.edu.ec',NULL,'Irina','Itriango','irinaii1990@gmail.com','0983627353',1,1),(23,'136225','vzurita@usfq.edu.ec',NULL,'Victor','Zurita','victor123zuri@hotmail.com','0983627354',1,1),(24,'136226','jsalgado@usfq.edu.ec',NULL,'John','Salgado','johnsalga@gmail.com','0983627355',1,1),(25,'136227','pyepez@usfq.edu.ec',NULL,'Pedro','Yépez','pyepez@gmail.com','0983627356',1,1),(26,'136228','aporras@usfq.edu.ec',NULL,'Alejandro','Porras','alejoporras@hotmail.com','0983627357',1,1),(27,'136229','jdfabara@usfq.edu.ec',NULL,'Juan David','Fabara','jdavidfabara7@gmail.com','0983627358',1,1),(28,'136230','lmontufar@usfq.edu.ec',NULL,'Luis','Montufar','lmontufar@hotmail.com','0983627341',1,1),(29,'136231','dmendoza@usfq.edu.ec',NULL,'Daniel','Mendoza','dmenzoa@gmail.com','0983627342',1,1),(30,'136232','cmendez@usfq.edu.ec',NULL,'Cesar','Mendez','cesarmendez14@gmail.com','0983627343',1,1),(31,'134589','clopez@usfq.edu.ec',NULL,'Carlos','Lopez','carlosl@hotmail.com','0998364758',0,2),(32,'132742','msuarez@usfq.edu.ec',NULL,'María','Suarez','marias@gmail.com','0937263549',1,2),(33,'130895','fmarino@usfq.edu.ec',NULL,'Fernando','Mariño','fernandom9@hotmail.com','0876162340',1,2),(34,'129048','ialmendariz@usfq.edu.ec',NULL,'Ignacia','Almendariz','ignaciaA@gmail.com','0815061131',1,2),(35,'127201','mcabezas@usfq.edu.ec',NULL,'Mauricio','Cabezas','mauricio_c@hotmail.com','0953959922',1,2),(36,'125354','pbaez@usfq.edu.ec',NULL,'Pamela','Baez','pamelab@gmail.com','0992858713',1,2),(37,'124724','amorales@usfq.edu.ec',NULL,'Andrea','Morales','andream@gmail.com','0897215342',1,2),(38,'124094','pportilla@usfq.edu.ec','$2a$10$ZR/breShre7Wbirz8a3ynO7ol8FMuyDUghMi2M4BrsumoauRfp2Li','Pedro','Portilla','pedrop@hotmail.com','0953959922',0,2),(39,'123464','cpazmino@usfq.edu.ec',NULL,'Carolina','Pazmiño','carolinap@gmail.com','0992858713',1,2),(40,'122834','strujillo@usfq.edu.ec',NULL,'Sebastian','Trujillo','sebastian_t@gmail.com','0897215342',1,2),(41,'122204','jdiaz@usfq.edu.ec',NULL,'Juan','Diaz','juand09@hotmail.com','0953959922',1,2),(42,'130298','fcazco@usfq.edu.ec',NULL,'Fernanda','Cazco','fernandac@gmail.com','0992858713',1,2),(43,'138392','gcalderon@usfq.edu.ec',NULL,'Guillermo','Calderón','guillermo-c@hotmail.com','0897215342',1,2),(44,'146486','epozo@usfq.edu.ec',NULL,'Esteban','Pozo','estebanp@gmail.com','0953959922',1,2),(45,'154580','esamaniego@usfq.edu.ec',NULL,'Estefania','Samaniego','estefanias@hotmail.com','0992858713',1,2),(46,'133020','vlopez@usfq.edu.ec',NULL,'Victor','Lopez','victorlopez@gmail.com','0998364712',1,2),(47,'123294','mscoello@usfq.edu.ec',NULL,'María Susana','Coello','mariascoello@gmail.com','0998364713',1,2),(48,'112534','fmartinez@usfq.edu.ec',NULL,'Fabian','Martinez','fmartinez@gmail.com','0998364714',1,2),(49,'291819','lespinoza@usfq.edu.ec',NULL,'Luis','Espinoza','lespinoza5@hotmail.com','0998364715',1,2),(50,'133034','svillagomez@usfq.edu.ec',NULL,'Santiago','Villagomez','svillagomez@gmail.com','0998364716',1,2),(51,'154020','gpazmiño@usfq.edu.ec',NULL,'Gabriela','Pazmiño','gpazmiño@gmail.com','0998364717',1,2),(52,'117890','ccordero@usfq.edu.ec',NULL,'Cristina','Cordero','ccordero3@gmail.com','0998364718',1,2),(53,'131415','arueda@usfq.edu.ec',NULL,'Alexis','Rueda','alexis24rueda@gmail.com','0998364719',1,2),(54,'130203','jgutierrez@usfq.edu.ec',NULL,'Jefferson','Guitierrez','jeffersongutierrez@gmail.com','0937263123',1,2),(55,'130507','jherbas@usfq.edu.ec',NULL,'Jonathan ','Herbas','jonaherbas@gmail.com','0937263456',1,2),(56,'130912','dlaufer@usfq.edu.ec',NULL,'Danilo','Laufer','danilolaufer@gmail.com','0937263789',1,2),(57,'150902','mprodriguez@usfq.edu.ec',NULL,'María Paz','Rodriguez','mariapaz3@gmail.com','0937263513',1,2),(58,'167123','aricaurte@usfq.edu.ec',NULL,'Antonio','Ricaurte','antonioricaurte@gmail.com','0999252976',1,2),(59,'160505','falacon@usfq.edu.ec',NULL,'Fausto','Alarcon','falarcon@gmail.com','0997504704',1,2),(60,'170403','dcalles@usfq.edu.ec',NULL,'Daniel','Calles','danielcalles@gmail.com','0993990288',1,2),(61,'132345','kverdezoto@estud.usfq.edu.ec',NULL,'Kevin','Verdezoto','kevin_v@hotmail.com','0984037457',0,3),(62,'124567','dlopez@estud.usfq.edu.ec','$2a$10$0NKX2ieauCQRrgc3v6QqK.wyH2.PJ0/gokEJsIfpumdnsVwWwVACa','Daniela','López','danielal@gmail.com','0927364859',0,3),(63,'116789','marevalo@estud.usfq.edu.ec',NULL,'Marco','Arévalo','marcoa@hotmail.com','0981253646',1,3),(64,'109011','jmerino@estud.usfq.edu.ec',NULL,'Juan','Merino','juan_m@gmail.com','0889263746',1,3),(65,'121233','achavez@estud.usfq.edu.ec',NULL,'Alejandra','Chávez','ale_cha@hotmail.com','0987654321',1,3),(66,'133455','myepez@estud.usfq.edu.ec',NULL,'Maria','Yépez','mariay6@gmail.com','0912347584',1,3),(67,'125677','aparedes@estud.usfq.edu.ec',NULL,'Antony','Paredes','antonyp@hotmail.com','0992341872',1,3),(68,'137899','ahidalgo@estud.usfq.edu.ec',NULL,'Andrés','Hidalgo','andresh09@gmail.com','0987654321',1,3),(69,'139876','mdiaz@estud.usfq.edu.ec',NULL,'Martina','Diaz','martinad@hotmail.com','0912347584',1,3),(70,'128683','csantos@estud.usfq.edu.ec',NULL,'Camila','Santos','camila-s98@gmail.com','0992341872',1,3),(71,'125782','rsalgado@estud.usfq.edu.ec',NULL,'Romina','Salgado','rominas@hotmail.com','0987654321',1,3),(72,'112882','asaenz@estud.usfq.edu.ec',NULL,'Alexander','Saenz','alexanders@gmail.com','0987654321',1,3),(73,'129981','jbrito@estud.usfq.edu.ec',NULL,'José','Brito','jose_b@hotmail.com','0992347584',1,3),(74,'127081','fnavarro@estud.usfq.edu.ec',NULL,'Fernando','Navarro','fernandon@gmail.com','0987654321',1,3),(75,'134180','cmejia@estud.usfq.edu.ec',NULL,'Carolina','Mejía','carom@hotmail.com','0982347584',1,3),(76,'167759','jmena@estud.usfq.edu.ec',NULL,'Juan','Mena','jmena234@hotmail.com','0969329699',1,3),(77,'179794','nlopez@estud.usfq.edu.ec',NULL,'Nicole','Lopez','nlopez@gmail.com','0948797776',1,3),(78,'186321','nverdezoto@estud.usfq.edu.ec',NULL,'Nathaly','Verdezoto','nverdezoto2010@gmail.com','0963873652',1,3),(79,'190992','ayanez@estud.usfq.edu.ec',NULL,'Austin','Yánez','austinyanez23@gmail.com','0995424409',1,3),(80,'198402','saguirre@estud.usfq.edu.ec',NULL,'Sofía','Aguirre','saguirrec34@gmail.com','0995947049',1,3),(81,'162443','sramirez@estud.usfq.edu.ec',NULL,'Santiago','Ramirez','santiramirez234@gmail.com','0965548319',1,3),(82,'193295','schavez@estud.usfq.edu.ec',NULL,'Sonia','Chavez','schavez@gmail.com','0910813014',1,3),(83,'177157','ejaramillo@estud.usfq.edu.ec',NULL,'Esteban','Jaramillo','estebanjojaramillo@gmail.com','0935182979',1,3),(84,'158939','jlopez@estud.usfq.edu.ec',NULL,'Julio','Lopez','juliolopez23@gmail.com','0952182266',1,3),(85,'141789','jsalazar@estud.usfq.edu.ec',NULL,'Juan','Salazar','juansalazar94@gmail.com','0917274881',1,3),(86,'182131','ngangotena@estud.usfq.edu.ec',NULL,'Nicole','Gangotena','nicolegangotena98@gmail.com','0981178624',1,3),(87,'140221','ctipan@estud.usfq.edu.ec',NULL,'Carlos Andres','Tipan','carlosandrestipan@gmail.com','0913187782',1,3),(88,'196302','mguerra@estud.usfq.edu.ec',NULL,'MIcaela','Guerra','micaleaceleguerra@gmail.com','0924621804',1,3),(89,'162303','ggallegos@estud.usfq.edu.ec',NULL,'Gabriel','Gallegos','gabrielgallegos92@gmail.com','0976798372',1,3),(90,'134724','pmoreno@estud.usfq.edu.ec',NULL,'Pedro','Moreno','pedromoreno212@gmail.com','0923304010',1,3);
/*!40000 ALTER TABLE `usuario` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Final view structure for view `estudiante_view`
--

/*!50001 DROP VIEW IF EXISTS `estudiante_view`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `estudiante_view` AS select `usuario`.`usuario_id` AS `usuario_id`,`usuario`.`codigo` AS `codigo`,`usuario`.`correo_institucional` AS `correo_institucional`,`usuario`.`hash` AS `hash`,`usuario`.`nombres` AS `nombres`,`usuario`.`apellidos` AS `apellidos`,`usuario`.`correo_personal` AS `correo_personal`,`usuario`.`telefono` AS `telefono`,`estudiante`.`carrera` AS `carrera`,`estudiante`.`gpa` AS `gpa`,`estudiante`.`status` AS `status`,`estudiante`.`periodo_de_admision` AS `periodo_de_admision`,`estudiante`.`tipo_de_admision` AS `tipo_de_admision`,`estudiante`.`profesor_usuario_id` AS `profesor_usuario_id` from (`usuario` join `estudiante` on((`usuario`.`usuario_id` = `estudiante`.`usuario_id`))) where (`usuario`.`rol_id` = 3) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `profesor_view`
--

/*!50001 DROP VIEW IF EXISTS `profesor_view`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `profesor_view` AS select `usuario`.`usuario_id` AS `usuario_id`,`usuario`.`codigo` AS `codigo`,`usuario`.`nombres` AS `nombres`,`usuario`.`apellidos` AS `apellidos`,`usuario`.`hash` AS `hash`,`profesor`.`carrera` AS `carrera`,`usuario`.`correo_institucional` AS `correo_institucional`,`usuario`.`correo_personal` AS `correo_personal`,`usuario`.`telefono` AS `telefono` from (`usuario` join `profesor` on((`usuario`.`usuario_id` = `profesor`.`usuario_id`))) where (`usuario`.`rol_id` = 2) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `reunion_view`
--

/*!50001 DROP VIEW IF EXISTS `reunion_view`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `reunion_view` AS select `reunion`.`reunion_id` AS `reunion_id`,`reunion`.`tema` AS `tema`,`reunion`.`descripcion` AS `descripcion`,`reunion`.`fecha` AS `fecha`,`reunion`.`profesor_usuario_id` AS `profesor_usuario_id`,`profesor_view`.`nombres` AS `nombres_profesor`,`profesor_view`.`apellidos` AS `apellidos_profesor`,`reunion`.`estudiante_usuario_id` AS `estudiante_usuario_id`,`estudiante_view`.`nombres` AS `nombres_estudiante`,`estudiante_view`.`apellidos` AS `apellidos_estudiante`,`reunion`.`estado_id` AS `estado_id` from ((`reunion` join `profesor_view` on((`profesor_view`.`usuario_id` = `reunion`.`profesor_usuario_id`))) join `estudiante_view` on((`estudiante_view`.`usuario_id` = `reunion`.`estudiante_usuario_id`))) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2020-10-14 13:52:01