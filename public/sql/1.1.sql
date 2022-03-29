
CREATE TABLE `datos`(
    `id` INT NOT NULL AUTO_INCREMENT ,
    `nombre` VARCHAR(20) NOT NULL ,
    `apellido` VARCHAR(20) NOT NULL ,
    `sexo` VARCHAR(2) NOT NULL ,
    `imagen` VARCHAR(200),
    `activo` INT NOT NULL ,
    PRIMARY KEY (`id`));