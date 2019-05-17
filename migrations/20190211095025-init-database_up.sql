CREATE TABLE IF NOT EXISTS `client` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `raison_sociale` varchar(45) DEFAULT NULL,
  `adresse` text,
  `code_postal` varchar(5) DEFAULT NULL,
  `ville` varchar(45) DEFAULT NULL,
  `date_created_gmt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `application` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nom` varchar(45) DEFAULT NULL,
  `date_created_gmt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `client_application` (
  `client_id` int(11) NOT NULL,
  `application_id` int(11) NOT NULL,
  PRIMARY KEY (`client_id`,`application_id`),
  KEY `fk_application_id_idx` (`application_id`),
  CONSTRAINT `fk_client_application_application_id` FOREIGN KEY (`application_id`) REFERENCES `application` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_client_application_client_id` FOREIGN KEY (`client_id`) REFERENCES `client` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `abilite` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `application_id` int(11) NOT NULL,
  `nom` varchar(45) NOT NULL,
  `description` text NOT NULL,
  `template` JSON
  PRIMARY KEY (`id`),
  KEY `fk_application_id_idx` (`application_id`),
  CONSTRAINT `fk_abilite_application_id` FOREIGN KEY (`application_id`) REFERENCES `application` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `role` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `application_id` int(11) NOT NULL,
  `nom` varchar(45) NOT NULL,
  `description` text,
  PRIMARY KEY (`id`),
  KEY `fk_role_application_id_idx` (`application_id`),
  CONSTRAINT `fk_role_application_id` FOREIGN KEY (`application_id`) REFERENCES `application` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `role_abilite` (
  `abilite_id` int(11) NOT NULL,
  `role_id` int(11) NOT NULL,
  PRIMARY KEY (`abilite_id`,`role_id`),
  KEY `fk_role_abilite_role_id_idx` (`role_id`),
  CONSTRAINT `fk_role_abilite_abilite_id` FOREIGN KEY (`abilite_id`) REFERENCES `abilite` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_role_abilite_role_id` FOREIGN KEY (`role_id`) REFERENCES `role` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `contact` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `client_id` int(11) NOT NULL,
  `date_created_gmt` datetime NOT NULL,
  `actif` tinyint(1) NOT NULL,
  `nom` varchar(45) NOT NULL,
  `prenom` varchar(45) NOT NULL,
  `telephone_fixe` varchar(10) DEFAULT NULL,
  `telephone_portable` varchar(10) DEFAULT NULL,
  `email` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_contact_client_id_idx` (`client_id`),
  CONSTRAINT `fk_contact_client_id` FOREIGN KEY (`client_id`) REFERENCES `client` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `utilisateur` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nom` varchar(45) NOT NULL,
  `prenom` varchar(45) DEFAULT NULL,
  `email` varchar(45) NOT NULL,
  `password` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email_UNIQUE` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `client_utilisateur` (
  `client_id` int(11) NOT NULL,
  `utilisateur_id` int(11) NOT NULL,
  PRIMARY KEY (`client_id`,`utilisateur_id`),
  KEY `fk_client_utilisateur_utilisateur_id_idx` (`utilisateur_id`),
  CONSTRAINT `fk_client_utilisateur_client_id` FOREIGN KEY (`client_id`) REFERENCES `client` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_client_utilisateur_utilisateur_id` FOREIGN KEY (`utilisateur_id`) REFERENCES `utilisateur` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `utilisateur_role` (
  `utilisateur_id` int(11) NOT NULL,
  `role_id` int(11) NOT NULL,
  PRIMARY KEY (`utilisateur_id`,`role_id`),
  KEY `fk_utilisateur_role_role_id_idx` (`role_id`),
  CONSTRAINT `fk_utilisateur_role_role_id` FOREIGN KEY (`role_id`) REFERENCES `role` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_utilisateur_role_utilisateur_id` FOREIGN KEY (`utilisateur_id`) REFERENCES `utilisateur` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `utilisateur_abilite` (
  `utilisateur_id` int(11) NOT NULL,
  `abilite_id` int(11) NOT NULL,
  PRIMARY KEY (`utilisateur_id`,`abilite_id`),
  KEY `fk_utilisateur_abilite_abilite_id_idx` (`abilite_id`),
  CONSTRAINT `fk_utilisateur_abilite_abilite_id` FOREIGN KEY (`abilite_id`) REFERENCES `abilite` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_utilisateur_abilite_utilisateur_id` FOREIGN KEY (`utilisateur_id`) REFERENCES `utilisateur` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


