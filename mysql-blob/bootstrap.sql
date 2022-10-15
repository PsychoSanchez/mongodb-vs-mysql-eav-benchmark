CREATE DATABASE IF NOT EXISTS `product`;

CREATE TABLE IF NOT EXISTS `product`.`entity_blob` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `entity_id` BIGINT NOT NULL,
    `value` JSON NOT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `entity_id` (`entity_id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8;
