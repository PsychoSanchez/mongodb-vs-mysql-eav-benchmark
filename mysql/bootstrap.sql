CREATE TABLE IF NOT EXISTS `product`.`entity_attribute_value` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `entity_id` BIGINT NOT NULL,
    `attribute_id` VARCHAR(64) NOT NULL,
    `type` ENUM(
        'boolean',
        'int',
        'float',
        'bigint_unsigned',
        'timestamp',
        'string',
        'text'
    ) NOT NULL,
    `value_boolean` TINYINT DEFAULT NULL COMMENT 'DataType:BOOLEAN',
    `value_int` INT DEFAULT NULL,
    `value_float` FLOAT DEFAULT NULL,
    `value_bigint_unsigned` BIGINT UNSIGNED DEFAULT NULL,
    `value_timestamp` TIMESTAMP DEFAULT NULL,
    `value_string` VARCHAR(256) DEFAULT NULL,
    `value_text` VARCHAR(21845) DEFAULT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `entity_id_attribute_id` (`entity_id`, `attribute_id`),
    INDEX KEY `eav_entity_id` (`entity_id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8;