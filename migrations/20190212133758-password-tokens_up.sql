ALTER TABLE `utilisateur` ADD COLUMN `password` VARCHAR(255) NOT NULL AFTER `email`;

CREATE TABLE IF NOT EXISTS `resetpasswordtokens` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `utilisateur_id` int(11) NOT NULL,
  `token` varchar(255) NOT NULL,
  `status` set('used','new') NOT NULL DEFAULT 'new',
  `date` DATETIME NOT NULL,
  PRIMARY KEY (`id`),
  KEY `userID` (`utilisateur_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;