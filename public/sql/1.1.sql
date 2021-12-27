CREATE TABLE `crudd`.`crudd` (
    `id` INT NOT NULL AUTO_INCREMENT ,
    `nombre` VARCHAR(20) NOT NULL ,
    `apellido` VARCHAR(20) NOT NULL ,
    `sexo` VARCHAR(2) NOT NULL ,
    `imagen` VARCHAR(200) NOT NULL ,
    `activo` INT NOT NULL ,
     KEY (`id`)) ENGINE = InnoDB;