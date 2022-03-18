CREATE TABLE `user` ( 
    `id` INT NOT NULL AUTO_INCREMENT, 
    `email` VARCHAR(180) NOT NULL , 
    `roles` JSON NOT NULL , 
    `password` VARCHAR(200) NOT NULL,
    PRIMARY KEY (`id`)) ;

CREATE TABLE `datos`(
    `id` INT NOT NULL AUTO_INCREMENT ,
    `nombre` VARCHAR(20) NOT NULL ,
    `apellido` VARCHAR(20) NOT NULL ,
    `sexo` VARCHAR(2) NOT NULL ,
    `imagen` VARCHAR(200) NOT NULL ,
    `activo` INT NOT NULL ,
    PRIMARY KEY (`id`));